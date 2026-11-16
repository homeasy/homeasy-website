/** Enquiry forms (contact, partners, government): one schema shared by the browser and the server (PRD §10.2–10.4). */
import { z } from "zod";

export const ENQUIRY_KINDS = [
  { id: "contact", label: "General" },
  { id: "designer", label: "Interior designer" },
  { id: "builder", label: "Builder / commercial" },
  { id: "electrician", label: "Electrician" },
  { id: "government", label: "Government" },
  { id: "demo", label: "Demo request" },
] as const;
export type EnquiryKind = (typeof ENQUIRY_KINDS)[number]["id"];
export const enquiryKindLabel = (id: string) => ENQUIRY_KINDS.find((k) => k.id === id)?.label ?? id;

export const ENQUIRY_STATUSES = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "in_progress", label: "In progress" },
  { id: "closed", label: "Closed" },
  { id: "spam", label: "Spam" },
] as const;
export const enquiryStatusLabel = (id: string) => ENQUIRY_STATUSES.find((s) => s.id === id)?.label ?? id;

const optional = <T extends z.ZodType>(t: T) => z.preprocess((v) => (v === "" || v == null ? undefined : v), t.optional());
const mobile = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, ""))
  .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number."));

/** Fields every enquiry form has. Extra, form-specific answers travel in `extra` (label → answer). */
export const enquirySchema = z.object({
  kind: z.enum(ENQUIRY_KINDS.map((k) => k.id) as [EnquiryKind, ...EnquiryKind[]]),
  name: z.string().trim().min(2, "Please enter your name.").max(80, "Name is too long."),
  mobile,
  email: optional(z.email("Enter a valid email address.")),
  organisation: optional(z.string().trim().max(120, "That is too long.")),
  city: optional(z.string().trim().max(80, "That is too long.")),
  message: optional(z.string().trim().max(2000, "Please keep the message under 2,000 characters.")),
  consent: z.literal("on", { error: "Please accept to continue." }),
  page: optional(z.string().max(200)),
});
export type EnquiryInput = z.infer<typeof enquirySchema>;

/** One extra question on a form, declared by the page that uses EnquiryFormBase. */
export type ExtraField = {
  name: string; // letters, numbers and underscores; sent as extra_<name>
  label: string;
  type?: "text" | "select" | "textarea" | "number";
  options?: string[];
  required?: boolean;
  placeholder?: string;
};

export type EnquiryResult = { ok: true; ref: string } | { ok: false; errors?: Record<string, string>; message?: string } | undefined;
