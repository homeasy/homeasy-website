"use server";

import { randomInt } from "node:crypto";
import { headers } from "next/headers";
import { dbMode } from "@/lib/db";
import { allow } from "@/lib/rate-limit";
import { notify } from "@/lib/notify";
import { getSite } from "@/lib/site-live";
import { enquiryKindLabel, enquirySchema, type EnquiryResult } from "./schema";
import { insertEnquiry, type Enquiry } from "./store";

const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const newRef = () => `HQ-${Array.from({ length: 5 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("")}`;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** Server action behind every EnquiryFormBase: validate, drop bots, rate-limit, save, alert the team. */
export async function submitEnquiry(_prev: EnquiryResult, formData: FormData): Promise<EnquiryResult> {
  // honeypot: real people never fill the hidden "website" box. Pretend it worked so bots learn nothing.
  if (String(formData.get("website") ?? "").trim()) return { ok: true, ref: "HQ-00000" };

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (!allow(`enquiry:${ip}`)) return { ok: false, message: "Too many requests. Please try again in a few minutes, or WhatsApp us." };

  const parsed = enquirySchema.safeParse(Object.fromEntries([...formData].filter(([k]) => !k.startsWith("extra_") && !k.startsWith("label_"))));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0] ?? "form")] ??= issue.message;
    return { ok: false, errors };
  }
  const input = parsed.data;

  // form-specific answers: extra_<name> holds the answer, label_<name> the question as shown
  const extra: Record<string, string> = {};
  for (const [key, value] of formData) {
    if (!key.startsWith("extra_") || typeof value !== "string" || !value.trim()) continue;
    const label = String(formData.get(`label_${key.slice(6)}`) ?? key.slice(6)).slice(0, 80);
    if (Object.keys(extra).length < 12) extra[label] = value.trim().slice(0, 500);
  }
  const requiredMissing = String(formData.get("required_extras") ?? "").split(",").filter(Boolean).filter((n) => !String(formData.get(`extra_${n}`) ?? "").trim());
  if (requiredMissing.length) return { ok: false, errors: Object.fromEntries(requiredMissing.map((n) => [`extra_${n}`, "Please fill this in."])) };

  if (dbMode() === "none") return { ok: false, message: "We could not save your request just now. Please WhatsApp or call us instead." };
  const now = new Date().toISOString();
  const row: Enquiry = {
    ref: newRef(),
    kind: input.kind,
    name: input.name,
    mobile: input.mobile,
    email: input.email ?? null,
    organisation: input.organisation ?? null,
    city: input.city ?? null,
    message: input.message ?? null,
    extra,
    page: input.page ?? null,
    status: "new",
    admin_notes: null,
    created_at: now,
    updated_at: now,
  };
  if (!(await insertEnquiry(row))) return { ok: false, message: "We could not save your request just now. Please WhatsApp or call us instead." };

  const site = await getSite();
  const lines = [
    ["Type", enquiryKindLabel(row.kind)],
    ["Name", row.name],
    ["Mobile", `+91 ${row.mobile}`],
    ["Email", row.email ?? ""],
    ["Organisation", row.organisation ?? ""],
    ["City", row.city ?? ""],
    ...Object.entries(extra),
    ["Message", row.message ?? ""],
    ["Page", row.page ?? ""],
  ].filter(([, v]) => v);
  await notify({
    subject: `New ${enquiryKindLabel(row.kind).toLowerCase()} enquiry: ${row.name} (${row.ref})`,
    html: `<h2>New enquiry ${esc(row.ref)}</h2><table cellpadding="6">${lines.map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join("")}</table><p><a href="${site.url}/admin/enquiries">Open in the admin</a></p>`,
    replyTo: row.email ?? undefined,
  });
  return { ok: true, ref: row.ref };
}
