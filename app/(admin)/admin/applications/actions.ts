"use server";

import { refresh } from "next/cache";
import { requireAdmin } from "@/lib/admin/session";
import { APPLICATION_STATUSES } from "@/lib/applications/schema";
import { deleteApplication, updateApplication } from "@/lib/applications/store";

type Result = { ok: boolean; error?: string };
const REF = /^HJ-[A-Z0-9]{5}$/;

export async function setApplicationStatus(ref: string, status: string): Promise<Result> {
  await requireAdmin();
  if (!REF.test(ref) || !APPLICATION_STATUSES.some((s) => s.id === status)) return { ok: false, error: "Invalid request." };
  if (!(await updateApplication(ref, { status }))) return { ok: false, error: "Could not save." };
  refresh();
  return { ok: true };
}

export async function saveApplicationNotes(ref: string, notes: string): Promise<Result> {
  await requireAdmin();
  if (!REF.test(ref)) return { ok: false, error: "Invalid request." };
  if (!(await updateApplication(ref, { admin_notes: notes.trim().slice(0, 4000) || null }))) return { ok: false, error: "Could not save." };
  refresh();
  return { ok: true };
}

export async function removeApplication(ref: string): Promise<Result> {
  await requireAdmin();
  if (!REF.test(ref) || !(await deleteApplication(ref))) return { ok: false, error: "Could not delete." };
  refresh();
  return { ok: true };
}
