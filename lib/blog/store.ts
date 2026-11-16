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

/** Every article, newest first, for the admin. */
export async function listArticles(): Promise<Article[]> {
  return ((await dbList<Article>(TABLE, "updated_at.desc")) ?? []) as Article[];
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
