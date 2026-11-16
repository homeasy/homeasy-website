/**
 * Draft → publish. Admin edits change the working tables only. The public website reads a published
 * SNAPSHOT (table published_content), which changes only when the admin presses "Publish now".
 * So nothing goes live by accident, and a redeploy never leaks unpublished edits.
 */
import "server-only";
import { dbInsert, dbList, dbUpdate, type Row } from "@/lib/db";

const TABLE = "published_content";
type Snapshot<T> = { key: string; data: T; published_at: string };

export async function getSnapshot<T>(key: string): Promise<Snapshot<T> | null> {
  const rows = await dbList<Snapshot<T> & Row>(TABLE, "key.asc");
  return rows?.find((r) => r.key === key) ?? null;
}

export async function saveSnapshot(key: string, data: unknown): Promise<boolean> {
  const published_at = new Date().toISOString();
  const existing = await getSnapshot(key);
  return existing ? dbUpdate(TABLE, "key", key, { data, published_at }) : dbInsert(TABLE, { key, data, published_at });
}

/** Stable text form of a row for comparing drafts with the live version (ignores timestamps). */
const fingerprint = (row: Row) => {
  const { created_at: _c, updated_at: _u, ...rest } = row;
  void _c;
  void _u;
  return JSON.stringify(Object.keys(rest).sort().map((k) => [k, rest[k]]));
};

/** How many rows differ between the working copy and the published snapshot (added, changed or removed). */
export function countChanges(draft: Row[], live: Row[] | null, idKey = "id"): number {
  if (!live) return draft.length;
  const liveMap = new Map(live.map((r) => [String(r[idKey]), fingerprint(r)]));
  let n = 0;
  for (const r of draft) {
    const prev = liveMap.get(String(r[idKey]));
    if (prev === undefined || prev !== fingerprint(r)) n++;
    liveMap.delete(String(r[idKey]));
  }
  return n + liveMap.size; // whatever is left was deleted in the draft
}
