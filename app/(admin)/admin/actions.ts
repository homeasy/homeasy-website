"use server";

import { randomUUID } from "node:crypto";
import { refresh } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { endSession, credentialsMatch, requireAdmin, startSession } from "@/lib/admin/session";
import { allow } from "@/lib/leads/rate-limit";
import { LEAD_PRIORITIES, LEAD_STATUSES, statusLabel } from "@/lib/leads/schema";
import { deleteLeads, getLead, updateLead, type LeadNote } from "@/lib/leads/store";

export async function login(_prev: { error?: string } | undefined, formData: FormData) {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (!allow(`admin:${ip}`)) return { error: "Too many attempts. Wait a few minutes and try again." };
  if (!credentialsMatch(String(formData.get("email") ?? ""), String(formData.get("password") ?? ""))) {
    return { error: "Wrong email or password." };
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

// ---------------------------------------------------------------- leads

export type ActionResult = { ok: boolean; error?: string; affected?: number };

const REF = /^[A-Za-z0-9-]{4,24}$/;
const SAVE_FAILED = "Could not save. If the database is new, run supabase/schema.sql again in Supabase to add the newer columns.";
const author = () => (process.env.ADMIN_EMAIL ?? "admin").split("@")[0] || "admin";
const entry = (text: string, system = false): LeadNote => ({
  id: randomUUID(),
  text,
  author: author(),
  at: new Date().toISOString(),
  ...(system ? { system: true } : {}),
});
const isStatus = (s: string) => LEAD_STATUSES.some((x) => x.id === s);
const isPriority = (p: string) => (LEAD_PRIORITIES as readonly string[]).includes(p);

/** Changes status, priority or the person assigned, and records each change in the lead's activity. */
export async function updateLeadPipeline(ref: string, patch: { status?: string; priority?: string; assigned_to?: string }): Promise<ActionResult> {
  await requireAdmin();
  const lead = REF.test(ref) ? await getLead(ref) : null;
  if (!lead) return { ok: false, error: "Lead not found." };
  const next: Parameters<typeof updateLead>[1] = {};
  const log: LeadNote[] = [];
  if (patch.status && patch.status !== lead.status) {
    if (!isStatus(patch.status)) return { ok: false, error: "Unknown status." };
    next.status = patch.status;
    log.push(entry(`Status changed: ${statusLabel(lead.status)} → ${statusLabel(patch.status)}`, true));
  }
  if (patch.priority && patch.priority !== lead.priority) {
    if (!isPriority(patch.priority)) return { ok: false, error: "Unknown priority." };
    next.priority = patch.priority;
    log.push(entry(`Priority changed: ${lead.priority} → ${patch.priority}`, true));
  }
  if (patch.assigned_to !== undefined) {
    const who = patch.assigned_to.trim().slice(0, 80) || null;
    if (who !== lead.assigned_to) {
      next.assigned_to = who;
      log.push(entry(who ? `Assigned to ${who}` : "Assignment cleared", true));
    }
  }
  if (!log.length) return { ok: true };
  next.activity = [...lead.activity, ...log];
  if (!(await updateLead(ref, next))) return { ok: false, error: SAVE_FAILED };
  refresh();
  return { ok: true };
}

export async function addLeadNote(ref: string, text: string): Promise<ActionResult> {
  await requireAdmin();
  const body = text.trim().slice(0, 4000);
  const lead = REF.test(ref) && body ? await getLead(ref) : null;
  if (!lead) return { ok: false, error: "Could not add the note." };
  if (!(await updateLead(ref, { activity: [...lead.activity, entry(body)] }))) return { ok: false, error: SAVE_FAILED };
  refresh();
  return { ok: true };
}

export async function removeLeadNote(ref: string, id: string): Promise<ActionResult> {
  await requireAdmin();
  const lead = REF.test(ref) ? await getLead(ref) : null;
  if (!lead) return { ok: false, error: "Lead not found." };
  // status and priority changes are a record of what happened: only hand-written notes can be removed
  const activity = lead.activity.filter((n) => n.id !== id || n.system);
  if (!(await updateLead(ref, { activity }))) return { ok: false, error: SAVE_FAILED };
  refresh();
  return { ok: true };
}

export async function removeLead(ref: string): Promise<ActionResult> {
  await requireAdmin();
  if (!REF.test(ref) || !(await deleteLeads([ref]))) return { ok: false, error: "Could not delete the lead." };
  redirect("/admin/leads");
}

/** Bulk action from the leads list: set one status on many leads, or delete them. */
export async function bulkLeads(refs: string[], action: "status" | "delete", status?: string): Promise<ActionResult> {
  await requireAdmin();
  const list = [...new Set(refs)].filter((r) => REF.test(r)).slice(0, 200);
  if (!list.length) return { ok: false, error: "Nothing selected." };
  let affected = 0;
  if (action === "delete") {
    affected = await deleteLeads(list);
  } else {
    if (!status || !isStatus(status)) return { ok: false, error: "Unknown status." };
    for (const ref of list) {
      const lead = await getLead(ref);
      if (!lead) continue;
      if (lead.status === status) {
        affected++;
        continue;
      }
      const activity = [...lead.activity, entry(`Status changed: ${statusLabel(lead.status)} → ${statusLabel(status)}`, true)];
      if (await updateLead(ref, { status, activity })) affected++;
    }
  }
  if (!affected) return { ok: false, error: SAVE_FAILED };
  refresh();
  return { ok: true, affected };
}
