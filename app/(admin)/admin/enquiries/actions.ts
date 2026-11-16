"use server";

import { refresh } from "next/cache";
import { requireAdmin } from "@/lib/admin/session";
import { ENQUIRY_STATUSES } from "@/lib/enquiries/schema";
import { deleteEnquiry, updateEnquiry } from "@/lib/enquiries/store";

type Result = { ok: boolean; error?: string };
const REF = /^HQ-[A-Z0-9]{5}$/;

export async function setEnquiryStatus(ref: string, status: string): Promise<Result> {
  await requireAdmin();
  if (!REF.test(ref) || !ENQUIRY_STATUSES.some((s) => s.id === status)) return { ok: false, error: "Invalid request." };
  if (!(await updateEnquiry(ref, { status }))) return { ok: false, error: "Could not save." };
  refresh();
  return { ok: true };
}

export async function saveEnquiryNotes(ref: string, notes: string): Promise<Result> {
  await requireAdmin();
  if (!REF.test(ref)) return { ok: false, error: "Invalid request." };
  if (!(await updateEnquiry(ref, { admin_notes: notes.trim().slice(0, 4000) || null }))) return { ok: false, error: "Could not save." };
  refresh();
  return { ok: true };
}

export async function removeEnquiry(ref: string): Promise<Result> {
  await requireAdmin();
  if (!REF.test(ref) || !(await deleteEnquiry(ref))) return { ok: false, error: "Could not delete." };
  refresh();
  return { ok: true };
}
