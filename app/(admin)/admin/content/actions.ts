"use server";

import { refresh } from "next/cache";
import { requireAdmin } from "@/lib/admin/session";
import { SEEDS, type ContentKey } from "@/lib/content/docs";
import { conform, schemaOf } from "@/lib/content/shape";
import { saveDraft } from "@/lib/content/store";

type Result = { ok: boolean; error?: string; data?: unknown };
const GENERAL: ContentKey[] = ["home", "faq", "packages", "legal", "jobs", "contact"];
const FAILED = "Could not save. Check that storage is connected (in Supabase, run supabase/03-content.sql once).";

function checkContact(c: (typeof SEEDS)["contact"]): string | null {
  if (!/^[6-9]\d{9}$/.test(c.phone)) return "Phone must be a 10-digit Indian mobile number, without +91.";
  if (!/^[6-9]\d{9}$/.test(c.whatsapp)) return "WhatsApp number must be a 10-digit Indian mobile number, without +91.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) return "Enter a valid email address.";
  if (!/^[1-9]\d{5}$/.test(c.address.pincode)) return "Pincode must be 6 digits.";
  if (!c.hours.trim() || !c.address.street.trim() || !c.address.city.trim() || !c.address.state.trim()) return "Working hours and the address cannot be empty.";
  for (const [name, url] of Object.entries(c.social)) if (!/^https:\/\/\S+$/.test(url)) return `The ${name} link must start with https://`;
  if (!c.whatsappMessages.general.trim() || !c.whatsappMessages.photo.trim()) return "The WhatsApp messages cannot be empty.";
  return null;
}

/** Saves a content document as a draft, after forcing it into the document's built-in shape. */
export async function saveContent(key: string, data: unknown): Promise<Result> {
  await requireAdmin();
  if (!GENERAL.includes(key as ContentKey)) return { ok: false, error: "Unknown document." };
  const k = key as "home" | "faq" | "packages" | "legal" | "jobs" | "contact";
  if (JSON.stringify(data ?? null).length > 400_000) return { ok: false, error: "That is too much text to save." };
  const clean = conform(schemaOf(SEEDS[k]), data);
  if (k === "contact") {
    const problem = checkContact(clean as (typeof SEEDS)["contact"]);
    if (problem) return { ok: false, error: problem };
  }
  if (!(await saveDraft(k, clean as never))) return { ok: false, error: FAILED };
  refresh();
  return { ok: true, data: clean };
}

export async function resetContent(key: string): Promise<Result> {
  await requireAdmin();
  if (!GENERAL.includes(key as ContentKey)) return { ok: false, error: "Unknown document." };
  const k = key as "home" | "faq" | "packages" | "legal" | "jobs" | "contact";
  if (!(await saveDraft(k, SEEDS[k] as never))) return { ok: false, error: FAILED };
  refresh();
  return { ok: true, data: SEEDS[k] };
}
