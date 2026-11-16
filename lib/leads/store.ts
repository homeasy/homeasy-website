/**
 * Lead storage (server only). Uses Supabase when SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set
 * (table: supabase/schema.sql). Without them, development saves to .data/leads.json so the form can be
 * tested; production refuses, and the form shows the WhatsApp/call fallback instead of losing a lead silently.
 */
import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type LeadRow = Record<string, string | number | boolean | string[] | null>;

export async function saveLead(table: "survey_requests", row: LeadRow): Promise<{ ok: boolean; reason?: string }> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    try {
      const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${table}`, {
        method: "POST",
        headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify(row),
        cache: "no-store",
      });
      if (!res.ok) {
        console.error(`[leads] Supabase insert failed: ${res.status} ${await res.text()}`);
        return { ok: false, reason: "storage_error" };
      }
      return { ok: true };
    } catch (e) {
      console.error("[leads] Supabase request failed", e);
      return { ok: false, reason: "storage_error" };
    }
  }

  if (process.env.NODE_ENV !== "production" || process.env.LEADS_LOCAL_FILE === "true") {
    const dir = path.join(process.cwd(), ".data");
    const file = path.join(dir, "leads.json");
    await mkdir(dir, { recursive: true });
    let rows: unknown[] = [];
    try {
      rows = JSON.parse(await readFile(file, "utf8"));
    } catch {
      /* first lead */
    }
    rows.push({ table, ...row });
    await writeFile(file, JSON.stringify(rows, null, 2));
    return { ok: true };
  }

  console.error("[leads] No storage configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  return { ok: false, reason: "not_configured" };
}

// ---------------------------------------------------------------- admin: read and update leads

export type Lead = {
  ref: string;
  full_name: string;
  mobile: string;
  whatsapp: string | null;
  email: string | null;
  pincode: string;
  locality: string;
  in_service_area: boolean;
  home_type: string;
  rooms: string | null;
  appliances: string[];
  switch_brand: string | null;
  preferred_date: string | null;
  time_slot: string | null;
  heard_from: string | null;
  source_cta: string | null;
  page: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  status: string;
  assigned_to: string | null;
  notes: string | null; // older free-text note, shown at the bottom of the activity list
  priority: string; // high | medium | low
  activity: LeadNote[]; // notes and status changes, oldest first
  created_at: string;
  updated_at: string;
};

export type LeadNote = { id: string; text: string; author: string; at: string; system?: boolean };

/** Fills in fields that older rows (or a table without the newer columns) do not have. */
function normalise(r: Partial<Lead>): Lead {
  return {
    assigned_to: null,
    notes: null,
    ...r,
    priority: r.priority || "medium",
    activity: Array.isArray(r.activity) ? r.activity : [],
    updated_at: r.updated_at || r.created_at,
  } as Lead;
}

const LOCAL_FILE = path.join(process.cwd(), ".data", "leads.json");
const localEnabled = () => process.env.NODE_ENV !== "production" || process.env.LEADS_LOCAL_FILE === "true";

function supabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return {
    base: `${url.replace(/\/$/, "")}/rest/v1/survey_requests`,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
  };
}

async function readLocal(): Promise<Lead[]> {
  try {
    const rows = JSON.parse(await readFile(LOCAL_FILE, "utf8")) as Partial<Lead>[];
    return rows.map(normalise);
  } catch {
    return [];
  }
}

/** Where leads are coming from, for the admin header. */
export function storageMode(): "supabase" | "local" | "none" {
  return supabase() ? "supabase" : localEnabled() ? "local" : "none";
}

/** Newest first, up to 1000 rows (plenty for the pilot; add paging when it grows). */
export async function listLeads(): Promise<Lead[]> {
  const sb = supabase();
  if (sb) {
    const res = await fetch(`${sb.base}?select=*&order=created_at.desc&limit=1000`, { headers: sb.headers, cache: "no-store" });
    if (!res.ok) throw new Error(`[db] list survey_requests failed: ${res.status} ${await res.text()}`);
    return ((await res.json()) as Partial<Lead>[]).map(normalise);
  }
  if (!localEnabled()) return [];
  return (await readLocal()).sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function getLead(ref: string): Promise<Lead | null> {
  const sb = supabase();
  if (sb) {
    const res = await fetch(`${sb.base}?select=*&ref=eq.${encodeURIComponent(ref)}&limit=1`, { headers: sb.headers, cache: "no-store" });
    if (!res.ok) throw new Error(`Supabase get failed: ${res.status}`);
    const row = ((await res.json()) as Partial<Lead>[])[0];
    return row ? normalise(row) : null;
  }
  return (await readLocal()).find((l) => l.ref === ref) ?? null;
}

export async function updateLead(
  ref: string,
  changes: Partial<Pick<Lead, "status" | "assigned_to" | "notes" | "priority" | "activity">>,
): Promise<boolean> {
  const patch = { ...changes, updated_at: new Date().toISOString() };
  const sb = supabase();
  if (sb) {
    const res = await fetch(`${sb.base}?ref=eq.${encodeURIComponent(ref)}`, {
      method: "PATCH",
      headers: { ...sb.headers, Prefer: "return=minimal" },
      body: JSON.stringify(patch),
      cache: "no-store",
    });
    if (!res.ok) console.error(`[leads] Supabase update failed: ${res.status} ${await res.text()}`);
    return res.ok;
  }
  if (!localEnabled()) return false;
  let rows: Record<string, unknown>[] = [];
  try {
    rows = JSON.parse(await readFile(LOCAL_FILE, "utf8"));
  } catch {
    return false;
  }
  const row = rows.find((r) => r.ref === ref);
  if (!row) return false;
  Object.assign(row, patch);
  await writeFile(LOCAL_FILE, JSON.stringify(rows, null, 2));
  return true;
}

/** Permanently deletes leads. Returns how many were asked to be removed, or 0 on failure. */
export async function deleteLeads(refs: string[]): Promise<number> {
  if (!refs.length) return 0;
  const sb = supabase();
  if (sb) {
    const list = refs.map((r) => `"${r}"`).join(",");
    const res = await fetch(`${sb.base}?ref=in.(${encodeURIComponent(list)})`, { method: "DELETE", headers: sb.headers, cache: "no-store" });
    if (!res.ok) console.error(`[leads] Supabase delete failed: ${res.status} ${await res.text()}`);
    return res.ok ? refs.length : 0;
  }
  if (!localEnabled()) return 0;
  let rows: Record<string, unknown>[] = [];
  try {
    rows = JSON.parse(await readFile(LOCAL_FILE, "utf8"));
  } catch {
    return 0;
  }
  const keep = rows.filter((r) => !refs.includes(String(r.ref)));
  await writeFile(LOCAL_FILE, JSON.stringify(keep, null, 2));
  return rows.length - keep.length;
}
