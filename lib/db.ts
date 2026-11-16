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
