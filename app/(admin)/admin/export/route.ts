import type { NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin/session";
import { filterLeads, parseLeadFilters } from "@/lib/leads/filter";
import { listLeads } from "@/lib/leads/store";

const COLUMNS = [
  "ref", "created_at", "status", "priority", "full_name", "mobile", "whatsapp", "email", "locality", "pincode", "in_service_area",
  "home_type", "rooms", "appliances", "switch_brand", "preferred_date", "time_slot", "heard_from", "source_cta", "page",
  "utm_source", "utm_medium", "utm_campaign", "assigned_to", "notes", "updated_at",
] as const;

function cell(v: unknown) {
  let s = Array.isArray(v) ? v.join("; ") : v == null ? "" : String(v);
  if (/^[=+\-@]/.test(s)) s = `'${s}`; // stop spreadsheet apps treating lead text as a formula
  return `"${s.replace(/"/g, '""')}"`;
}

/** CSV download of the leads matching the current filters (admin only). */
export async function GET(request: NextRequest) {
  if (!(await isAdmin())) return new Response("Not signed in", { status: 401 });
  const filters = parseLeadFilters(Object.fromEntries(request.nextUrl.searchParams));
  const leads = filterLeads(await listLeads(), filters).map((l) => ({
    ...l,
    // hand-written notes, newest first, in one cell
    notes: [...l.activity.filter((n) => !n.system).reverse().map((n) => n.text), l.notes].filter(Boolean).join(" | "),
  }));
  const lines = [COLUMNS.join(","), ...leads.map((l) => COLUMNS.map((c) => cell((l as Record<string, unknown>)[c])).join(","))];
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="homeasy-leads.csv"',
      "Cache-Control": "no-store",
    },
  });
}
