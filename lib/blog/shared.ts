/** Blog articles: the shape of one article and small text helpers. No server code, so the editor can use them too. */
export type Article = {
  id: string;
  slug: string;
  title: string;
  /** one or two sentences shown on the blog list and used as the search description when none is written */
  excerpt: string;
  /** the article text as clean HTML (written in the admin editor, cleaned again on the server when saved) */
  body_html: string;
  cover_url: string | null;
  cover_alt: string;
  author: string;
  category: string;
  focus_keyword: string;
  seo_title: string;
  seo_description: string;
  noindex: boolean;
  /** shown on the website (after Publish) */
  active: boolean;
  /** the date printed on the article, YYYY-MM-DD */
  published_on: string | null;
  created_at: string;
  updated_at: string;
};

export type ArticleInput = Omit<Article, "id" | "created_at" | "updated_at">;

export const DEFAULT_AUTHOR = "Homeasy team";

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70).replace(/-+$/, "");

const decode = (s: string) =>
  s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
/** The words a reader sees, without tags. */
export const plainText = (html: string) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
export const wordCount = (text: string) => (text ? text.split(/\s+/).filter(Boolean).length : 0);
export const readingMinutes = (words: number) => Math.max(1, Math.round(words / 200));

/** What search engines are given: the written search title / description, else the article's own title / summary. */
export const searchTitle = (a: Pick<Article, "seo_title" | "title">) => a.seo_title.trim() || a.title.trim();
export const searchDescription = (a: Pick<Article, "seo_description" | "excerpt">) => a.seo_description.trim() || a.excerpt.trim();

/** "17 November 2026" from YYYY-MM-DD, the same on the server and in the browser. */
export function longDate(day: string | null): string {
  if (!day) return "";
  const [y, m, d] = day.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return y && m && d ? `${d} ${months[m - 1]} ${y}` : "";
}
