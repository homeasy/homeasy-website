"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { endSession, passwordMatches, requireAdmin, startSession } from "@/lib/admin/session";
import { allow } from "@/lib/leads/rate-limit";
import { LEAD_STATUSES } from "@/lib/leads/schema";
import { updateLead } from "@/lib/leads/store";

export async function login(_prev: { error?: string } | undefined, formData: FormData) {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (!allow(`admin:${ip}`)) return { error: "Too many attempts. Wait a few minutes and try again." };
  if (!passwordMatches(String(formData.get("password") ?? ""))) return { error: "Wrong password." };
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

export async function saveLeadChanges(_prev: { ok?: boolean; error?: string } | undefined, formData: FormData) {
  await requireAdmin();
  const ref = String(formData.get("ref") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!ref || !LEAD_STATUSES.some((s) => s.id === status)) return { error: "Invalid request." };
  const ok = await updateLead(ref, {
    status,
    assigned_to: String(formData.get("assigned_to") ?? "").trim().slice(0, 80) || null,
    notes: String(formData.get("notes") ?? "").trim().slice(0, 4000) || null,
  });
  return ok ? { ok: true } : { error: "Could not save. Please try again." };
}
