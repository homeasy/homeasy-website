/** Lead list filters, shared by the admin list and the CSV export. */
import { LEAD_PRIORITIES, LEAD_STATUSES } from "./schema";
import { DISTRICT_NAMES, districtName } from "./districts";
import type { Lead } from "./store";

export type LeadFilters = { status: string; priority: string; home: string; district: string; q: string; from: string; to: string; sort: string };
type Params = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const day = (v: string) => (/^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "");

/** The calendar day in India (YYYY-MM-DD) for a timestamp. */
export const istDay = (t: string | number) => new Date(new Date(t).getTime() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);

export function parseLeadFilters(sp: Params): LeadFilters {
  const status = one(sp.status);
  const priority = one(sp.priority);
  const sort = one(sp.sort);
  return {
    status: LEAD_STATUSES.some((s) => s.id === status) ? status : "",
    priority: (LEAD_PRIORITIES as readonly string[]).includes(priority) ? priority : "",
    home: one(sp.home).slice(0, 40),
    district: DISTRICT_NAMES.includes(one(sp.district)) ? one(sp.district) : "",
    q: one(sp.q).trim().slice(0, 80),
    from: day(one(sp.from)),
    to: day(one(sp.to)),
    sort: ["oldest", "updated", "name"].includes(sort) ? sort : "newest",
  };
}

export function filterLeads(all: Lead[], f: LeadFilters): Lead[] {
  const q = f.q.toLowerCase();
  const rows = all.filter((l) => {
    if (f.status && l.status !== f.status) return false;
    if (f.priority && l.priority !== f.priority) return false;
    if (f.home && l.home_type !== f.home) return false;
    if (f.district && districtName(l.pincode) !== f.district) return false;
    const d = istDay(l.created_at);
    if (f.from && d < f.from) return false;
    if (f.to && d > f.to) return false;
    if (q && ![l.ref, l.full_name, l.mobile, l.whatsapp, l.locality, l.pincode, l.email].join(" ").toLowerCase().includes(q)) return false;
    return true;
  });
  if (f.sort === "oldest") rows.sort((a, b) => a.created_at.localeCompare(b.created_at));
  else if (f.sort === "updated") rows.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  else if (f.sort === "name") rows.sort((a, b) => a.full_name.localeCompare(b.full_name));
  else rows.sort((a, b) => b.created_at.localeCompare(a.created_at));
  return rows;
}
