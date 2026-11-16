/**
 * Small data layer (server only). One API over two back ends:
 *  - Supabase (REST, service-role key) when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set
 *  - JSON files in .data/ during development (or when LEADS_LOCAL_FILE=true), so everything can be tested without keys
 * In production without keys there is no storage: reads return [] and writes fail.
 */
import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type Row = Record<string, unknown>;

export function dbMode(): "supabase" | "local" | "none" {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return "supabase";
  return process.env.NODE_ENV !== "production" || process.env.LEADS_LOCAL_FILE === "true" ? "local" : "none";
}

function sb(table: string) {
  const base = `${process.env.SUPABASE_URL!.replace(/\/$/, "")}/rest/v1/${table}`;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return { base, headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" } };
}

const file = (table: string) => path.join(process.cwd(), ".data", `${table}.json`);

async function readLocal<T extends Row>(table: string): Promise<T[] | null> {
  try {
    return JSON.parse(await readFile(file(table), "utf8")) as T[];
  } catch {
    return null; // file not created yet
  }
}
async function writeLocal(table: string, rows: Row[]) {
  await mkdir(path.dirname(file(table)), { recursive: true });
  await writeFile(file(table), JSON.stringify(rows, null, 2));
}

/** All rows, ordered. `null` means "this table has never been written" (local mode only), so callers can seed it. */
export async function dbList<T extends Row>(table: string, order = "created_at.desc"): Promise<T[] | null> {
  const mode = dbMode();
  if (mode === "supabase") {
    const { base, headers } = sb(table);
    const res = await fetch(`${base}?select=*&order=${order}&limit=1000`, { headers, cache: "no-store" });
    if (!res.ok) throw new Error(`[db] list ${table} failed: ${res.status} ${await res.text()}`);
    return (await res.json()) as T[];
  }
  if (mode === "none") return null;
  const rows = await readLocal<T>(table);
  if (!rows) return null;
  const [col, dir] = order.split(".");
  return [...rows].sort((a, b) => {
    const x = a[col] as string | number;
    const y = b[col] as string | number;
    return (x < y ? -1 : x > y ? 1 : 0) * (dir === "desc" ? -1 : 1);
  });
}

export async function dbInsert(table: string, rows: Row | Row[]): Promise<boolean> {
  const list = Array.isArray(rows) ? rows : [rows];
  const mode = dbMode();
  if (mode === "supabase") {
    const { base, headers } = sb(table);
    const res = await fetch(base, { method: "POST", headers: { ...headers, Prefer: "return=minimal" }, body: JSON.stringify(list), cache: "no-store" });
    if (!res.ok) console.error(`[db] insert ${table} failed: ${res.status} ${await res.text()}`);
    return res.ok;
  }
  if (mode === "none") return false;
  await writeLocal(table, [...((await readLocal(table)) ?? []), ...list]);
  return true;
}

export async function dbUpdate(table: string, column: string, value: string, patch: Row): Promise<boolean> {
  const mode = dbMode();
  if (mode === "supabase") {
    const { base, headers } = sb(table);
    const res = await fetch(`${base}?${column}=eq.${encodeURIComponent(value)}`, {
      method: "PATCH",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify(patch),
      cache: "no-store",
    });
    if (!res.ok) console.error(`[db] update ${table} failed: ${res.status} ${await res.text()}`);
    return res.ok;
  }
  if (mode === "none") return false;
  const rows = (await readLocal(table)) ?? [];
  const row = rows.find((r) => r[column] === value);
  if (!row) return false;
  Object.assign(row, patch);
  await writeLocal(table, rows);
  return true;
}

let localQueue: Promise<void> = Promise.resolve();

/** One row by a key column, or null. */
export async function dbGet<T extends Row>(table: string, column: string, value: string): Promise<T | null> {
  const mode = dbMode();
  if (mode === "supabase") {
    const { base, headers } = sb(table);
    const res = await fetch(`${base}?select=*&${column}=eq.${encodeURIComponent(value)}&limit=1`, { headers, cache: "no-store" });
    if (!res.ok) throw new Error(`[db] get ${table} failed: ${res.status} ${await res.text()}`);
    return ((await res.json()) as T[])[0] ?? null;
  }
  if (mode === "none") return null;
  return ((await readLocal<T>(table)) ?? []).find((r) => r[column] === value) ?? null;
}

/** Insert, or replace the row that has the same key. One request. Returns an error text on failure. */
export async function dbUpsert(table: string, column: string, row: Row): Promise<string | null> {
  const mode = dbMode();
  if (mode === "supabase") {
    const { base, headers } = sb(table);
    const res = await fetch(`${base}?on_conflict=${column}`, {
      method: "POST",
      headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(row),
      cache: "no-store",
    });
    if (res.ok) return null;
    const detail = `${res.status} ${await res.text()}`;
    console.error(`[db] upsert ${table} failed: ${detail}`);
    return detail;
  }
  if (mode === "none") return "No storage is connected.";
  // local test files: several upserts may arrive together, so do them one at a time per process
  localQueue = localQueue.then(async () => {
    const rows = (await readLocal(table)) ?? [];
    await writeLocal(table, [...rows.filter((r) => r[column] !== row[column]), row]);
  });
  await localQueue;
  return null;
}

export async function dbDelete(table: string, column: string, value: string): Promise<boolean> {
  const mode = dbMode();
  if (mode === "supabase") {
    const { base, headers } = sb(table);
    const res = await fetch(`${base}?${column}=eq.${encodeURIComponent(value)}`, { method: "DELETE", headers, cache: "no-store" });
    return res.ok;
  }
  if (mode === "none") return false;
  const rows = (await readLocal(table)) ?? [];
  await writeLocal(table, rows.filter((r) => r[column] !== value));
  return true;
}

/** Stores an uploaded image and returns its public URL. Supabase Storage bucket "product-images", or public/uploads locally. */
export async function saveImage(folder: string, name: string, bytes: Buffer, contentType: string): Promise<string | null> {
  const mode = dbMode();
  if (mode === "supabase") {
    const root = process.env.SUPABASE_URL!.replace(/\/$/, "");
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const res = await fetch(`${root}/storage/v1/object/product-images/${folder}/${name}`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": contentType, "x-upsert": "true", "cache-control": "31536000" },
      body: new Uint8Array(bytes),
    });
    if (!res.ok) {
      console.error(`[db] image upload failed: ${res.status} ${await res.text()}`);
      return null;
    }
    return `${root}/storage/v1/object/public/product-images/${folder}/${name}`;
  }
  if (mode === "none") return null;
  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return `/uploads/${folder}/${name}`;
}

/**
 * Private files (e.g. resumes): stored in a Supabase Storage bucket that is NOT public, or under .data/files
 * locally. They can only be read back through the server with the service-role key (see the admin download route).
 */
export async function savePrivateFile(bucket: string, name: string, bytes: Buffer, contentType: string): Promise<boolean> {
  const mode = dbMode();
  if (mode === "supabase") {
    const root = process.env.SUPABASE_URL!.replace(/\/$/, "");
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const res = await fetch(`${root}/storage/v1/object/${bucket}/${name}`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": contentType, "x-upsert": "true" },
      body: new Uint8Array(bytes),
    });
    if (!res.ok) console.error(`[db] file upload to ${bucket} failed: ${res.status} ${await res.text()}`);
    return res.ok;
  }
  if (mode === "none") return false;
  const target = path.join(process.cwd(), ".data", "files", bucket, name);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, bytes);
  return true;
}

export async function readPrivateFile(bucket: string, name: string): Promise<Buffer | null> {
  const mode = dbMode();
  if (mode === "supabase") {
    const root = process.env.SUPABASE_URL!.replace(/\/$/, "");
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const headers = { apikey: key, Authorization: `Bearer ${key}` };
    // Supabase serves private objects on either of these addresses depending on version
    for (const prefix of ["object/authenticated", "object"]) {
      const res = await fetch(`${root}/storage/v1/${prefix}/${bucket}/${name}`, { headers, cache: "no-store" });
      if (res.ok) return Buffer.from(await res.arrayBuffer());
    }
    return null;
  }
  if (mode === "none") return null;
  try {
    return await readFile(path.join(process.cwd(), ".data", "files", bucket, name));
  } catch {
    return null;
  }
}

/** Turns a storage error into advice the admin can act on. */
export function dbErrorHint(e: unknown): string {
  const m = e instanceof Error ? e.message : String(e);
  if (/PGRST205|\b404\b/.test(m)) {
    return "A database table is missing. In Supabase, open the SQL Editor and run supabase/schema.sql, 02-store.sql, 03-content.sql, 04-enquiries.sql, 05-chat.sql and 06-applications-inbox.sql from the supabase folder. Use the same project as SUPABASE_URL.";
  }
  if (/\b413\b|too large/i.test(m)) return "The content is too large to save in one go.";
  if (/PGRST204|42703/.test(m)) {
    return "A database column is missing. In Supabase, open the SQL Editor and run supabase/schema.sql again (it only adds what is missing).";
  }
  if (/\b40[13]\b/.test(m)) {
    return "Supabase rejected the key. SUPABASE_SERVICE_ROLE_KEY must be the secret (service_role) key, not the anon or publishable key.";
  }
  return "Could not reach Supabase. Check that SUPABASE_URL is the plain project address, like https://xxxx.supabase.co, then redeploy.";
}
