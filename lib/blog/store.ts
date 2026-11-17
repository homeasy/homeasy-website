/**
 * Blog articles (server only). Same rule as products: the admin edits rows in the `articles` table (drafts);
 * the public site reads the PUBLISHED snapshot (published_content, key "articles"), which changes only on Publish.
 */
import "server-only";
import { randomUUID } from "node:crypto";
import { cacheLife, cacheTag } from "next/cache";
import { dbDelete, dbInsert, dbList, dbUpdate } from "@/lib/db";
import { getSnapshot } from "@/lib/store/publish";
import type { Article, ArticleInput } from "./shared";

const TABLE = "articles";

/**
 * The first starter articles were added with photo descriptions that began "Illustration: …". The founder does not
 * want that word anywhere (17 Nov 2026), so it is dropped whenever an article is read, in the admin and on the site.
 * Saving the article in the admin then stores the clean description.
 */
function clean<T extends Article>(a: T): T {
  const alt = (a.cover_alt ?? "").replace(/^illustration:\s*/i, "");
  return alt === a.cover_alt ? a : { ...a, cover_alt: alt.charAt(0).toUpperCase() + alt.slice(1) };
}

/** Every article, newest first, for the admin. */
export async function listArticles(): Promise<Article[]> {
  return (((await dbList<Article>(TABLE, "updated_at.desc")) ?? []) as Article[]).map(clean);
}

export async function getArticle(id: string): Promise<Article | null> {
  return (await listArticles()).find((a) => a.id === id) ?? null;
}

export async function createArticle(input: ArticleInput): Promise<string | null> {
  const id = randomUUID();
  const now = new Date().toISOString();
  return (await dbInsert(TABLE, { ...input, id, created_at: now, updated_at: now })) ? id : null;
}

export async function updateArticle(id: string, patch: Partial<ArticleInput>): Promise<boolean> {
  return dbUpdate(TABLE, "id", id, { ...patch, updated_at: new Date().toISOString() });
}

export const deleteArticle = (id: string) => dbDelete(TABLE, "id", id);

/** Articles on the public site: the last published copy, visible ones only, newest first. Cached; Publish calls updateTag("articles"). */
export async function getPublicArticles(): Promise<Article[]> {
  "use cache";
  cacheTag("articles");
  cacheLife("hours");
  try {
    const live = (await getSnapshot<Article[]>("articles"))?.data ?? [];
    return live
      .map(clean)
      .filter((a) => a.active && a.slug && a.title)
      .sort((a, b) => (b.published_on ?? "").localeCompare(a.published_on ?? "") || b.created_at.localeCompare(a.created_at));
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getPublicArticle(slug: string): Promise<Article | null> {
  return (await getPublicArticles()).find((a) => a.slug === slug) ?? null;
}
