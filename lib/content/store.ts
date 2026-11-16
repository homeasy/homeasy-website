/**
 * Editable website content (server only). Same rule as products: the admin saves DRAFTS in the
 * site_content table; the public site reads the PUBLISHED copy (published_content, key "content:<name>"),
 * which changes only on Publish. Before anything is published the built-in files in /data are used.
 * The same table also keeps a few admin-only documents (keyword list, page-speed history) that are never published.
 */
import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { dbInsert, dbList, dbUpdate, type Row } from "@/lib/db";
import { getSnapshot, saveSnapshot } from "@/lib/store/publish";
import { CONTENT_KEYS, SEEDS, type ContentDoc, type ContentKey } from "./docs";
import { mergeDefaults } from "./shape";

const TABLE = "site_content";
type DocRow = Row & { key: string; data: unknown; updated_at: string };

const rows = async () => ((await dbList<DocRow>(TABLE, "key.asc")) ?? []) as DocRow[];

async function writeRow(key: string, data: unknown): Promise<boolean> {
  const updated_at = new Date().toISOString();
  const exists = (await rows()).some((r) => r.key === key);
  return exists ? dbUpdate(TABLE, "key", key, { data, updated_at }) : dbInsert(TABLE, { key, data, updated_at });
}

/** The admin's working copy (the built-in version until something has been saved). */
export async function getDraft<K extends ContentKey>(key: K): Promise<{ data: ContentDoc<K>; saved: boolean; updatedAt: string | null }> {
  const row = (await rows()).find((r) => r.key === key);
  return { data: mergeDefaults(SEEDS[key], row?.data), saved: !!row, updatedAt: row?.updated_at ?? null };
}

export const saveDraft = <K extends ContentKey>(key: K, data: ContentDoc<K>) => writeRow(key, data);

/** What the public website shows: the last published copy. Cached; Publish calls updateTag("content"). */
export async function getContent<K extends ContentKey>(key: K): Promise<ContentDoc<K>> {
  "use cache";
  cacheTag("content");
  cacheLife("hours");
  try {
    return mergeDefaults(SEEDS[key], (await getSnapshot<unknown>(`content:${key}`))?.data);
  } catch (e) {
    console.error(e);
    return SEEDS[key];
  }
}

/** Which saved documents differ from what is live. */
export async function contentPending(): Promise<ContentKey[]> {
  const drafts = (await rows()).filter((r) => (CONTENT_KEYS as string[]).includes(r.key));
  const out: ContentKey[] = [];
  for (const d of drafts) {
    const live = await getSnapshot<unknown>(`content:${d.key}`);
    if (!live || JSON.stringify(live.data) !== JSON.stringify(d.data)) out.push(d.key as ContentKey);
  }
  return out;
}

/** Copies every changed draft to the live copy. Returns true if anything was published. */
export async function publishContent(): Promise<boolean> {
  const pending = await contentPending();
  if (!pending.length) return false;
  const all = await rows();
  let ok = true;
  for (const key of pending) ok = (await saveSnapshot(`content:${key}`, all.find((r) => r.key === key)!.data)) && ok;
  return ok;
}

/** Admin-only documents (not part of publishing), e.g. the keyword list. */
export async function getAdminDoc<T>(key: string, fallback: T): Promise<T> {
  const row = (await rows()).find((r) => r.key === `admin:${key}`);
  return (row?.data as T) ?? fallback;
}
export const saveAdminDoc = (key: string, data: unknown) => writeRow(`admin:${key}`, data);
