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
