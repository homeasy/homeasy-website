/**
 * "N changes waiting to go live" and Publish, for everything at once: products, store settings, website
 * content and blog articles. Reads the tables side by side (not one after another) and writes each changed
 * live copy in a single request, so Publish stays fast even when the database is far from the server.
 */
import "server-only";
import { CONTENT_KEYS } from "@/lib/content/docs";
import { dbList, type Row } from "@/lib/db";
import { DEFAULT_SETTINGS } from "./pricing";
import { countChanges, saveSnapshot } from "./publish";

type Change = { key: string; label: string; data: unknown; tag: "products" | "store" | "content" | "articles" };

async function findChanges(): Promise<{ changes: Change[]; count: number; publishedAt: string | null }> {
  const [live, products, settings, content, articles] = await Promise.all([
    dbList<Row>("published_content", "key.asc"),
    dbList<Row>("products", "sort_order.asc"),
    dbList<Row>("store_settings", "key.asc"),
    dbList<Row>("site_content", "key.asc"),
    // the blog table is newer (supabase/07-blog.sql): until it exists, publishing everything else must still work
    dbList<Row>("articles", "created_at.asc").catch(() => null),
  ]);
  const snap = new Map((live ?? []).map((r) => [String(r.key), r]));
  const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
  const changes: Change[] = [];
  let count = 0;

  if (products?.length) {
    const n = countChanges(products, (snap.get("products")?.data as Row[] | undefined) ?? null);
    if (n) changes.push({ key: "products", label: "Products", data: products, tag: "products" });
    count += n;
  }

  const store = settings?.find((r) => r.key === "store");
  if (store) {
    const { key: _key, updated_at: _updated, ...rest } = store;
    void _key;
    void _updated;
    const draft = { ...DEFAULT_SETTINGS, ...rest };
    const liveStore = snap.get("store")?.data as Row | undefined;
    if (!liveStore || !same({ ...DEFAULT_SETTINGS, ...liveStore }, draft)) {
      changes.push({ key: "store", label: "Store settings", data: draft, tag: "store" });
      count++;
    }
  }

  for (const row of content ?? []) {
    const name = String(row.key);
    if (!(CONTENT_KEYS as string[]).includes(name)) continue; // admin-only lists are never published
    const liveDoc = snap.get(`content:${name}`);
    if (!liveDoc || !same(liveDoc.data, row.data)) {
      changes.push({ key: `content:${name}`, label: name, data: row.data, tag: "content" });
      count++;
    }
  }

  const liveArticles = (snap.get("articles")?.data as Row[] | undefined) ?? null;
  if (articles && (articles.length || liveArticles?.length)) {
    const n = countChanges(articles, liveArticles);
    if (n) changes.push({ key: "articles", label: "Blog articles", data: articles, tag: "articles" });
    count += n;
  }

  const dates = (live ?? []).map((r) => String(r.published_at)).sort();
  return { changes, count, publishedAt: dates.at(-1) ?? null };
}

export async function publishState(): Promise<{ pending: number; publishedAt: string | null }> {
  const { count, publishedAt } = await findChanges();
  return { pending: count, publishedAt };
}

/** Copies every changed draft to its live copy. Returns which cache tags to refresh and any failures. */
export async function publishAll(): Promise<{ published: number; tags: Change["tag"][]; failed: string[]; detail: string }> {
  const { changes } = await findChanges();
  const results = await Promise.all(changes.map(async (c) => ({ c, error: await saveSnapshot(c.key, c.data) })));
  const done = results.filter((r) => !r.error);
  const bad = results.filter((r) => r.error);
  return {
    published: done.length,
    tags: [...new Set(done.map((r) => r.c.tag))],
    failed: bad.map((r) => r.c.label),
    detail: bad[0]?.error ?? "",
  };
}
