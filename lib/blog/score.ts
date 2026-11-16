/**
 * SEO score for one article, worked out from what is in the editor (no page fetch), so it can be shown while writing.
 * Same scale as Admin → SEO health: every check is good (1), could be better (0.5) or needs fixing (0); score = average × 100.
 */
import { keywordMatch, keywordWords, phraseCount } from "@/lib/seo/keyword-match";
import { plainText, searchDescription, searchTitle, wordCount, type Article } from "./shared";

export type Level = "good" | "ok" | "bad";
export type Check = { label: string; level: Level; detail: string };
export type ScoreInput = Pick<
  Article,
  "title" | "slug" | "excerpt" | "body_html" | "cover_url" | "cover_alt" | "focus_keyword" | "seo_title" | "seo_description" | "noindex"
>;

/** An article should have at least this many words to answer a search properly. */
export const ARTICLE_WORDS = 600;

export function scoreArticle(a: ScoreInput): { score: number; checks: Check[]; words: number } {
  const checks: Check[] = [];
  const add = (label: string, level: Level, detail: string) => checks.push({ label, level, detail });
  const title = searchTitle(a);
  const description = searchDescription(a);
  const text = plainText(a.body_html).toLowerCase();
  const words = wordCount(text);
  const kw = a.focus_keyword.trim().toLowerCase();
  const html = a.body_html;

  if (a.noindex) add("Visible to search engines", "bad", "This article is set to “hide from search engines”.");
  add("Article title", !a.title.trim() ? "bad" : a.title.trim().length > 70 ? "ok" : "good", a.title.trim() ? `${a.title.trim().length} characters (best: up to 70).` : "Write the title.");
  add("Search title", !title ? "bad" : title.length < 30 || title.length > 62 ? "ok" : "good", title ? `${title.length} characters (best: 30–62).` : "No title yet.");
  add(
    "Search description",
    !description ? "bad" : description.length < 110 || description.length > 160 ? "ok" : "good",
    description ? `${description.length} characters (best: 110–160).` : "Write the short summary or a search description.",
  );

  if (!kw) add("Focus keyword", "bad", "Choose the one search phrase this article should be found for.");
  else {
    const level = (m: number): Level => (m === 1 ? "good" : m >= 0.6 ? "ok" : "bad");
    add("Keyword in title", level(keywordMatch(kw, title)), `“${kw}” in the search title.`);
    add("Keyword in description", level(keywordMatch(kw, description)), `“${kw}” in the search description.`);
    add("Keyword in address", keywordMatch(kw, a.slug.replace(/-/g, " ")) >= 0.6 ? "good" : "ok", `The address is /blog/${a.slug || "…"}.`);
    add("Keyword early in the text", words && keywordMatch(kw, text.split(" ").slice(0, 120).join(" ")) >= 0.75 ? "good" : "ok", "Use it in the first paragraph (checked in the first 120 words).");
    const used = phraseCount(kw, text);
    const density = words ? (used * keywordWords(kw).length) / words : 0;
    add(
      "Keyword use",
      used === 0 ? (words < 150 ? "bad" : "ok") : density > 0.03 ? "bad" : "good",
      used === 0 ? "The exact phrase is not in the text yet. Use it naturally two or three times." : density > 0.03 ? `Used ${used} times in ${words} words: that reads as stuffing. Use it less.` : `Exact phrase used ${used} time(s) in ${words} words.`,
    );
    const heads = plainText([...html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)].map((m) => m[1]).join(" · "));
    add("Keyword in a sub-heading", heads && keywordMatch(kw, heads) >= 0.6 ? "good" : "ok", "Use the phrase (or most of its words) in at least one heading.");
  }

  add("Amount of text", words < ARTICLE_WORDS / 2 ? "bad" : words < ARTICLE_WORDS ? "ok" : "good", `${words} words (aim for ${ARTICLE_WORDS} or more).`);
  const h2 = (html.match(/<h2[\s>]/gi) ?? []).length;
  add("Sub-headings", h2 >= 2 ? "good" : h2 === 1 || words < 150 ? "ok" : "bad", h2 ? `${h2} main sub-heading(s). Two or more make the article easy to scan.` : "Break the article up with Heading 2 sub-headings.");

  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => !/\salt="[^"]{3,}"/i.test(t)).length;
  if (imgs.length) add("Image descriptions", noAlt ? "bad" : "good", noAlt ? `${noAlt} of ${imgs.length} images have no description.` : `All ${imgs.length} images have a description.`);

  const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)].map((m) => m[1]);
  const internal = links.filter((h) => h.startsWith("/") || /^https?:\/\/(www\.)?homeasy\.io/i.test(h)).length;
  add("Links to Homeasy pages", internal >= 2 ? "good" : internal === 1 ? "ok" : "bad", `${internal} link(s) to other pages of this website (aim for two or more, for example /how-it-works or /book-survey).`);

  add("Short summary", a.excerpt.trim().length >= 60 ? "good" : a.excerpt.trim() ? "ok" : "bad", a.excerpt.trim() ? `${a.excerpt.trim().length} characters. It is shown on the blog list.` : "Write one or two sentences for the blog list.");
  add(
    "Cover photo",
    a.cover_url && a.cover_alt.trim().length >= 3 ? "good" : a.cover_url ? "ok" : "ok",
    a.cover_url ? (a.cover_alt.trim().length >= 3 ? "A cover photo with a description is set." : "Describe the cover photo in a few words.") : "No cover photo: the site-wide share image is used.",
  );

  const score = Math.round((checks.reduce((n, c) => n + (c.level === "good" ? 1 : c.level === "ok" ? 0.5 : 0), 0) / checks.length) * 100);
  const order = { bad: 0, ok: 1, good: 2 };
  return { score, checks: [...checks].sort((x, y) => order[x.level] - order[y.level]), words };
}
