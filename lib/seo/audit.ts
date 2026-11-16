/**
 * SEO health (server only). Fetches each public page of this site as a search engine would and scores it.
 * The scoring follows the Kynyx admin: every check is good (1), ok (0.5) or bad (0); score = average × 100.
 */
import "server-only";
import { headers } from "next/headers";
import type { SeoDoc } from "@/lib/content/docs";
import { isProductionHost } from "@/lib/site";
import { SEO_ROUTES, type SeoRoute } from "./routes";

export type Level = "good" | "ok" | "bad";
export type Check = { label: string; level: Level; detail: string };
export type PageAudit = SeoRoute & {
  ok: boolean;
  title: string;
  description: string;
  h1: string[];
  words: number;
  text: string; // visible text, lower case
  headings: string; // h1–h3 text, lower case
  focusKeyword: string;
  checks: Check[];
  score: number;
};

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
const strip = (html: string) => decode(html.replace(/<(script|style|noscript|template)[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const metaTag = (html: string, attr: string, name: string) => {
  const tag = html.match(new RegExp(`<(?:meta|link)[^>]*${attr}="${name}"[^>]*>`, "i"))?.[0] ?? "";
  return decode(tag.match(/(?:content|href)="([^"]*)"/i)?.[1] ?? "");
};

// "near me" is answered by the place names on the page, and "vs"/"how" carry no meaning of their own
const STOP = new Set(["a", "an", "the", "in", "on", "for", "of", "to", "and", "or", "with", "your", "my", "is", "at", "by", "near", "me", "vs", "how"]);
const stem = (w: string) => (w.length > 3 ? w.replace(/ies$/, "y").replace(/(ch|sh|s|x|z)es$/, "$1").replace(/s$/, "") : w);
/** One spelling for words people write two ways: Wi-Fi / wifi, switchboard / switch board, switchbox / switch box. */
const spell = (t: string) => t.toLowerCase().replace(/wi[-\s]fi/g, "wifi").replace(/switch(board|box)/g, "switch $1");
export const keywordWords = (k: string) => spell(k).split(/[^a-z0-9]+/).filter((w) => w && !STOP.has(w)).map(stem);
/** Share of the keyword's words found in the text (0–1). */
export function keywordMatch(keyword: string, text: string): number {
  const words = keywordWords(keyword);
  if (!words.length) return 0;
  const hay = new Set(spell(text).split(/[^a-z0-9]+/).map(stem));
  return words.filter((w) => hay.has(w)).length / words.length;
}
/** How many times the whole phrase appears. */
const phraseCount = (keyword: string, text: string) => {
  const k = keyword.toLowerCase().trim();
  return k ? text.split(k).length - 1 : 0;
};

const MIN_WORDS = { home: 400, page: 250, legal: 0 };

function analyse(route: SeoRoute, html: string, status: number, seo: SeoDoc): PageAudit {
  const main = html.match(/<main[\s\S]*<\/main>/i)?.[0] ?? html.match(/<body[\s\S]*<\/body>/i)?.[0] ?? "";
  const title = decode(html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? "").trim();
  const description = metaTag(html, "name", "description");
  const h1 = [...main.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => strip(m[1]));
  const headings = [...main.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)].map((m) => strip(m[1])).join(" · ").toLowerCase();
  const text = strip(main).toLowerCase();
  const words = text ? text.split(" ").length : 0;
  const imgs = [...main.matchAll(/<img[^>]*>/gi)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => !/\salt="/i.test(t)).length;
  const internal = new Set([...main.matchAll(/<a[^>]*href="(\/[^"#?]*)/gi)].map((m) => m[1])).size;
  const focusKeyword = seo.pages[route.path]?.focusKeyword || route.keyword;
  const noindex = !!seo.pages[route.path]?.noindex;
  const checks: Check[] = [];
  const add = (label: string, level: Level, detail: string) => checks.push({ label, level, detail });

  if (status !== 200) add("Page loads", "bad", `The page answered with status ${status || "no response"}.`);
  if (noindex) add("Visible to search engines", "bad", "This page is set to “hide from search engines”.");
  add("Search title", !title ? "bad" : title.length < 30 || title.length > 62 ? "ok" : "good", title ? `${title.length} characters (best: 30–62).` : "No title.");
  add(
    "Search description",
    !description ? "bad" : description.length < 110 || description.length > 160 ? "ok" : "good",
    description ? `${description.length} characters (best: 110–160).` : "No description.",
  );
  if (!focusKeyword) add("Focus keyword", "bad", "No focus keyword set for this page.");
  else {
    const level = (m: number): Level => (m === 1 ? "good" : m >= 0.6 ? "ok" : "bad");
    add("Keyword in title", level(keywordMatch(focusKeyword, title)), `“${focusKeyword}” in the search title.`);
    add("Keyword in description", level(keywordMatch(focusKeyword, description)), `“${focusKeyword}” in the search description.`);
    // page addresses are fixed, so this is only credited when it matches (not counted against the page otherwise)
    if (keywordMatch(focusKeyword, route.path) === 1) add("Keyword in address", "good", `The page address is ${route.path}.`);
    add("Keyword early in the text", keywordMatch(focusKeyword, text.split(" ").slice(0, 120).join(" ")) >= 0.75 ? "good" : "ok", "Checked in the first 120 words.");
    if (words >= 150) {
      const density = (phraseCount(focusKeyword, text) * keywordWords(focusKeyword).length) / words;
      add("Keyword use", phraseCount(focusKeyword, text) === 0 ? "ok" : density > 0.03 ? "bad" : "good", `Exact phrase used ${phraseCount(focusKeyword, text)} time(s) in ${words} words.`);
    }
  }
  const min = MIN_WORDS[route.kind];
  if (min) add("Amount of text", words < min / 2 ? "bad" : words < min ? "ok" : "good", `${words} words (aim for ${min} or more).`);
  add("Main heading (H1)", h1.length === 1 ? "good" : h1.length === 0 ? "bad" : "ok", h1.length === 1 ? h1[0] : `${h1.length} H1 headings (there should be exactly one).`);
  if (words > 400) add("Sub-headings", /<h2/i.test(main) ? "good" : "ok", "Long pages read better with H2 sub-headings.");
  if (imgs.length) add("Image descriptions", noAlt ? "bad" : "good", noAlt ? `${noAlt} of ${imgs.length} images have no alt text.` : `All ${imgs.length} images have alt text.`);
  add("Links to other pages", internal >= 2 ? "good" : internal === 1 ? "ok" : "bad", `${internal} other pages linked from the content.`);
  add("Canonical address", metaTag(html, "rel", "canonical") ? "good" : "ok", metaTag(html, "rel", "canonical") || "No canonical link.");
  add("Share image", metaTag(html, "property", "og:image") ? "good" : "ok", metaTag(html, "property", "og:image") ? "A share image is set." : "No share image.");

  const score = Math.round((checks.reduce((n, c) => n + (c.level === "good" ? 1 : c.level === "ok" ? 0.5 : 0), 0) / checks.length) * 100);
  return { ...route, ok: status === 200, title, description, h1, words, text, headings, focusKeyword, checks, score };
}

/** The address this admin is being viewed on, so the check reads the same site (local, beta or live). */
export async function siteOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")}://${host}`;
}

async function fetchText(url: string): Promise<{ status: number; body: string }> {
  try {
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(12000), headers: { "user-agent": "HomeasyAdmin-SEO-check" } });
    return { status: res.status, body: await res.text() };
  } catch {
    return { status: 0, body: "" };
  }
}

const memo = new Map<string, { at: number; pages: PageAudit[] }>();

/** Audits every page. Results are kept for a minute so moving between the SEO screens stays quick. */
export async function auditSite(seo: SeoDoc): Promise<PageAudit[]> {
  const origin = await siteOrigin();
  const key = origin + JSON.stringify(seo.pages);
  const hit = memo.get(key);
  if (hit && Date.now() - hit.at < 60_000) return hit.pages;
  const pages = await Promise.all(
    SEO_ROUTES.map(async (r) => {
      const { status, body } = await fetchText(origin + r.path);
      return analyse(r, body, status, seo);
    }),
  );
  memo.clear();
  memo.set(key, { at: Date.now(), pages });
  return pages;
}

export async function crawlerFiles(): Promise<{ name: string; ok: boolean; href: string }[]> {
  const origin = await siteOrigin();
  return Promise.all(
    ["/robots.txt", "/sitemap.xml", "/llms.txt"].map(async (p) => ({ name: p, href: p, ok: (await fetchText(origin + p)).status === 200 })),
  );
}

export const band = (score: number): Level => (score >= 80 ? "good" : score >= 55 ? "ok" : "bad");
/** true when the admin is being viewed on a test address (beta, preview, localhost), where search engines are blocked. */
export async function onTestAddress(): Promise<boolean> {
  return !isProductionHost(new URL(await siteOrigin()).host);
}
