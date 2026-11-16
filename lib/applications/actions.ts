"use server";

import { randomInt } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { getContent } from "@/lib/content/store";
import { dbMode, savePrivateFile } from "@/lib/db";
import { confirmTo, notify } from "@/lib/notify";
import { allow } from "@/lib/rate-limit";
import { getSite } from "@/lib/site-live";
import { EXPERIENCE_OPTIONS, GENERAL_ROLE, RESUME_MAX_BYTES, RESUME_TYPES, type ApplicationResult } from "./schema";
import { insertApplication, RESUME_BUCKET, type Application } from "./store";

const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const newRef = () => `HJ-${Array.from({ length: 5 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("")}`;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const optional = <T extends z.ZodType>(t: T) => z.preprocess((v) => (v === "" || v == null ? undefined : v), t.optional());

const schema = z.object({
  role: z.string().trim().min(2, "Please choose a role.").max(120),
  name: z.string().trim().min(2, "Please enter your name.").max(80, "Name is too long."),
  mobile: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, ""))
    .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number.")),
  email: z.email("Enter a valid email address."),
  city: optional(z.string().trim().max(80, "That is too long.")),
  qualification: optional(z.string().trim().max(160, "That is too long.")),
  experience: optional(z.enum(EXPERIENCE_OPTIONS)),
  link: optional(z.url("Enter a full link starting with https://").max(300)),
  message: optional(z.string().trim().max(2000, "Please keep this under 2,000 characters.")),
  consent: z.literal("on", { error: "Please accept to continue." }),
});

/** Careers form: validates, stores the resume privately, saves the application, alerts the team and confirms to the applicant. */
export async function submitApplication(_prev: ApplicationResult, formData: FormData): Promise<ApplicationResult> {
  if (String(formData.get("website") ?? "").trim()) return { ok: true, ref: "HJ-00000" }; // honeypot
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (!allow(`apply:${ip}`)) return { ok: false, message: "Too many applications from this connection. Please try again in a few minutes, or email us." };

  const fields = Object.fromEntries([...formData].filter(([k, v]) => k !== "resume" && typeof v === "string"));
  const parsed = schema.safeParse(fields);
  const errors: Record<string, string> = {};
  if (!parsed.success) for (const issue of parsed.error.issues) errors[String(issue.path[0] ?? "form")] ??= issue.message;

  // the role must be one that is open right now (or the general option)
  const open = (await getContent("jobs")).roles.map((r) => r.title);
  if (parsed.success && parsed.data.role !== GENERAL_ROLE && !open.includes(parsed.data.role)) errors.role = "That role is no longer open. Please choose another.";

  const file = formData.get("resume");
  let ext = "";
  if (!(file instanceof File) || file.size === 0) errors.resume = "Please attach your resume.";
  else {
    ext = (file.name.split(".").pop() ?? "").toLowerCase();
    if (!RESUME_TYPES[ext]) errors.resume = "The resume must be a PDF or Word file (.pdf, .doc, .docx).";
    else if (file.size > RESUME_MAX_BYTES) errors.resume = "The resume is too large. Please use a file under 3 MB.";
  }
  if (Object.keys(errors).length || !parsed.success || !(file instanceof File)) return { ok: false, errors };
  if (dbMode() === "none") return { ok: false, message: "We could not save your application just now. Please email it to us instead." };

  const d = parsed.data;
  const ref = newRef();
  const bytes = Buffer.from(await file.arrayBuffer());
  // PDFs start with "%PDF", .docx files are zip archives ("PK"), old .doc files start with D0 CF: refuse anything else
  const head = bytes.subarray(0, 4);
  const looksRight = ext === "pdf" ? head.toString("latin1") === "%PDF" : ext === "docx" ? head[0] === 0x50 && head[1] === 0x4b : head[0] === 0xd0 && head[1] === 0xcf;
  if (!looksRight) return { ok: false, errors: { resume: "That file does not look like a PDF or Word document." } };
  const resumePath = `${ref}.${ext}`;
  if (!(await savePrivateFile(RESUME_BUCKET, resumePath, bytes, RESUME_TYPES[ext]))) {
    return { ok: false, message: "We could not upload your resume just now. Please try again, or email it to us." };
  }

  const now = new Date().toISOString();
  const row: Application = {
    ref,
    role: d.role,
    name: d.name,
    mobile: d.mobile,
    email: d.email,
    city: d.city ?? null,
    qualification: d.qualification ?? null,
    experience: d.experience ?? null,
    link: d.link ?? null,
    message: d.message ?? null,
    resume_path: resumePath,
    resume_name: file.name.slice(0, 120),
    status: "new",
    admin_notes: null,
    created_at: now,
    updated_at: now,
  };
  if (!(await insertApplication(row))) return { ok: false, message: "We could not save your application just now. Please email it to us instead." };

  const site = await getSite();
  const lines = [
    ["Role", row.role],
    ["Name", row.name],
    ["Mobile", `+91 ${row.mobile}`],
    ["Email", row.email],
    ["City", row.city ?? ""],
    ["Qualification", row.qualification ?? ""],
    ["Experience", row.experience ?? ""],
    ["Link", row.link ?? ""],
    ["Message", row.message ?? ""],
  ].filter(([, v]) => v);
  await Promise.all([
    notify({
      subject: `Job application: ${row.name} for ${row.role} (${row.ref})`,
      html: `<h2>New job application ${esc(row.ref)}</h2><table cellpadding="6">${lines.map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join("")}</table><p><a href="${site.url}/admin/applications">Open in the admin</a> to read the resume.</p>`,
      replyTo: row.email,
    }),
    confirmTo(
      row.email,
      `We have your application, ${row.role}`,
      `<div style="font-family:Arial,sans-serif;font-size:15px;color:#0B1220"><p>Hi ${esc(row.name.split(" ")[0])},</p><p>Thank you for applying for <strong>${esc(row.role)}</strong> at Homeasy. Your application number is <strong>${esc(row.ref)}</strong>.</p><p>We read every application. If your profile fits the role, our team will contact you by phone or email.</p><p>Team Homeasy</p></div>`,
      site.contact.email,
    ),
  ]);
  return { ok: true, ref };
}
