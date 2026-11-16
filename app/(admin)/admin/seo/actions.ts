"use server";

import { randomUUID } from "node:crypto";
import { refresh } from "next/cache";
import { requireAdmin } from "@/lib/admin/session";
import type { SeoDoc, SeoPage } from "@/lib/content/docs";
import { getAdminDoc, getDraft, saveAdminDoc, saveDraft } from "@/lib/content/store";
import { KEYWORD_KINDS, KEYWORD_STATUSES, type Keyword, type SpeedRun } from "@/lib/seo/keywords";
import { SEO_ROUTES } from "@/lib/seo/routes";
import { site } from "@/lib/site";

type Result = { ok: boolean; error?: string };
const FAILED = "Could not save. Check that storage is connected (in Supabase, run supabase/03-content.sql once).";
const isRoute = (p: string) => SEO_ROUTES.some((r) => r.path === p);
const line = (v: unknown, max: number) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);

/** Saves one page's search title, description and keywords as a draft. Empty overrides are dropped. */
export async function saveSeoPage(path: string, input: Partial<SeoPage>): Promise<Result> {
  await requireAdmin();
  if (!isRoute(path)) return { ok: false, error: "Unknown page." };
  const page: SeoPage = {
    title: line(input.title, 120),
    description: line(input.description, 320),
    focusKeyword: line(input.focusKeyword, 80),
    keywords: (Array.isArray(input.keywords) ? input.keywords : []).map((k) => line(k, 60)).filter(Boolean).slice(0, 20),
    noindex: input.noindex === true,
  };
  const seo = (await getDraft("seo")).data;
  const pages = { ...seo.pages };
  if (page.title || page.description || page.focusKeyword || page.keywords.length || page.noindex) pages[path] = page;
  else delete pages[path];
  if (!(await saveDraft("seo", { ...seo, pages }))) return { ok: false, error: FAILED };
  refresh();
  return { ok: true };
}

export async function saveSeoSettings(input: Pick<SeoDoc, "verification" | "aiCrawlers" | "llmsSummary">): Promise<Result> {
  await requireAdmin();
  const code = (v: unknown) => String(v ?? "").trim().replace(/[<>"\s]/g, "").slice(0, 200);
  const seo = (await getDraft("seo")).data;
  const next: SeoDoc = {
    ...seo,
    verification: { google: code(input.verification?.google), bing: code(input.verification?.bing), yandex: code(input.verification?.yandex) },
    aiCrawlers: { search: input.aiCrawlers?.search === true, training: input.aiCrawlers?.training === true },
    llmsSummary: String(input.llmsSummary ?? "").trim().slice(0, 4000),
  };
  if (!(await saveDraft("seo", next))) return { ok: false, error: FAILED };
  refresh();
  return { ok: true };
}

// ---------------------------------------------------------------- keywords (admin-only list)

const loadKeywords = () => getAdminDoc<Keyword[]>("keywords", []);

export async function addKeyword(term: string, kind: string, page: string): Promise<Result> {
  await requireAdmin();
  const t = line(term, 120).toLowerCase();
  if (t.length < 2) return { ok: false, error: "Enter a keyword." };
  const list = await loadKeywords();
  if (list.some((k) => k.term === t)) return { ok: false, error: "That keyword is already tracked." };
  if (list.length >= 500) return { ok: false, error: "The keyword list is full (500)." };
  const row: Keyword = {
    id: randomUUID(),
    term: t,
    kind: (KEYWORD_KINDS as readonly string[]).includes(kind) ? (kind as Keyword["kind"]) : "target",
    page: isRoute(page) ? page : "",
    status: "planned",
    position: null,
    created_at: new Date().toISOString(),
  };
  if (!(await saveAdminDoc("keywords", [...list, row]))) return { ok: false, error: FAILED };
  refresh();
  return { ok: true };
}

export async function updateKeyword(id: string, patch: { page?: string; status?: string; position?: number | null }): Promise<Result> {
  await requireAdmin();
  const list = await loadKeywords();
  const row = list.find((k) => k.id === id);
  if (!row) return { ok: false, error: "Keyword not found." };
  if (patch.page !== undefined) row.page = isRoute(patch.page) ? patch.page : "";
  if (patch.status && (KEYWORD_STATUSES as readonly string[]).includes(patch.status)) row.status = patch.status as Keyword["status"];
  if (patch.position !== undefined) {
    const n = Math.round(Number(patch.position));
    row.position = patch.position === null || !Number.isFinite(n) || n < 1 || n > 1000 ? null : n;
  }
  if (!(await saveAdminDoc("keywords", list))) return { ok: false, error: FAILED };
  refresh();
  return { ok: true };
}

export async function deleteKeyword(id: string): Promise<Result> {
  await requireAdmin();
  const list = await loadKeywords();
  if (!(await saveAdminDoc("keywords", list.filter((k) => k.id !== id)))) return { ok: false, error: FAILED };
  refresh();
  return { ok: true };
}

const ideaCache = new Map<string, { at: number; groups: { group: string; ideas: string[] }[] }>();

/**
 * Keyword ideas from Google's public autocomplete (what people actually type). No key needed.
 * It shows demand, not search volume.
 */
export async function keywordIdeas(seed: string): Promise<{ ok: boolean; error?: string; groups?: { group: string; ideas: string[] }[] }> {
  await requireAdmin();
  const q = line(seed, 80).toLowerCase();
  if (q.length < 2) return { ok: false, error: "Enter a word or phrase to start from." };
  const hit = ideaCache.get(q);
  if (hit && Date.now() - hit.at < 3600_000) return { ok: true, groups: hit.groups };
  const variants: [string, string[]][] = [
    ["Direct", [q]],
    ["Buying", [`${q} price`, `${q} cost`, `best ${q}`, `${q} company`]],
    ["Local", [`${q} in patna`, `${q} in bihar`, `${q} in india`]],
    ["Questions", [`how to ${q}`, `what is ${q}`, `${q} vs`]],
  ];
  const suggest = async (text: string): Promise<string[]> => {
    try {
      const res = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=in&q=${encodeURIComponent(text)}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(6000),
      });
      const json = (await res.json()) as [string, string[]];
      return Array.isArray(json[1]) ? json[1].map((s) => String(s).toLowerCase()) : [];
    } catch {
      return [];
    }
  };
  const seen = new Set<string>();
  const groups: { group: string; ideas: string[] }[] = [];
  for (const [group, queries] of variants) {
    const ideas = (await Promise.all(queries.map(suggest))).flat().filter((s) => s.length <= 120 && !seen.has(s) && (seen.add(s), true));
    if (ideas.length) groups.push({ group, ideas: ideas.slice(0, 12) });
  }
  if (!groups.length) return { ok: false, error: "Google returned no suggestions. Try a shorter phrase." };
  ideaCache.set(q, { at: Date.now(), groups });
  return { ok: true, groups };
}

// ---------------------------------------------------------------- page speed (Google PageSpeed Insights)

type Audit = { numericValue?: number; title?: string; details?: { overallSavingsMs?: number; type?: string } };

export async function runPageSpeed(path: string, strategy: "mobile" | "desktop"): Promise<{ ok: boolean; error?: string; run?: SpeedRun }> {
  await requireAdmin();
  if (!isRoute(path) || (strategy !== "mobile" && strategy !== "desktop")) return { ok: false, error: "Unknown page." };
  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  api.searchParams.set("url", site.url + path);
  api.searchParams.set("strategy", strategy);
  for (const c of ["performance", "accessibility", "best-practices", "seo"]) api.searchParams.append("category", c);
  if (process.env.PAGESPEED_API_KEY) api.searchParams.set("key", process.env.PAGESPEED_API_KEY);
  let json: Record<string, unknown>;
  try {
    const res = await fetch(api, { cache: "no-store", signal: AbortSignal.timeout(90_000) });
    json = (await res.json()) as Record<string, unknown>;
    if (!res.ok) {
      const message = (json.error as { message?: string } | undefined)?.message ?? "";
      if (res.status === 429 || /quota/i.test(message)) {
        return { ok: false, error: "Google's free shared quota is used up for now. Add a PAGESPEED_API_KEY (free from Google Cloud) in the hosting settings, or try again later." };
      }
      return { ok: false, error: `Google could not test ${site.url + path}. ${message.slice(0, 160)}` };
    }
  } catch {
    return { ok: false, error: "The test timed out. Please try again." };
  }
  const lh = (json.lighthouseResult ?? {}) as { categories?: Record<string, { score: number | null }>; audits?: Record<string, Audit> };
  const score = (id: string) => (lh.categories?.[id]?.score == null ? null : Math.round(lh.categories[id].score! * 100));
  const num = (id: string) => lh.audits?.[id]?.numericValue ?? null;
  const fieldMetrics = ((json.loadingExperience ?? {}) as { metrics?: Record<string, { percentile?: number }> }).metrics;
  const history = await getAdminDoc<SpeedRun[]>("pagespeed", []);
  const previous = history.find((r) => r.path === path && r.strategy === strategy);
  const run: SpeedRun = {
    path,
    strategy,
    at: new Date().toISOString(),
    scores: { performance: score("performance"), accessibility: score("accessibility"), bestPractices: score("best-practices"), seo: score("seo") },
    metrics: { lcp: num("largest-contentful-paint"), fcp: num("first-contentful-paint"), tbt: num("total-blocking-time"), cls: num("cumulative-layout-shift"), si: num("speed-index") },
    field: fieldMetrics
      ? {
          lcp: fieldMetrics.LARGEST_CONTENTFUL_PAINT_MS?.percentile ?? null,
          inp: fieldMetrics.INTERACTION_TO_NEXT_PAINT?.percentile ?? null,
          cls: fieldMetrics.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile == null ? null : fieldMetrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100,
        }
      : null,
    opportunities: Object.values(lh.audits ?? {})
      .filter((a) => (a.details?.overallSavingsMs ?? 0) >= 100)
      .sort((a, b) => (b.details?.overallSavingsMs ?? 0) - (a.details?.overallSavingsMs ?? 0))
      .slice(0, 6)
      .map((a) => ({ title: String(a.title ?? "").slice(0, 140), savingMs: Math.round(a.details!.overallSavingsMs!) })),
    previousPerformance: previous?.scores.performance ?? null,
  };
  // keep the latest run for each page and device
  await saveAdminDoc("pagespeed", [run, ...history.filter((r) => !(r.path === path && r.strategy === strategy))].slice(0, 80));
  return { ok: true, run };
}
