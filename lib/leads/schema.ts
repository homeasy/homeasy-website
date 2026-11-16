/** Survey booking form: one schema shared by the browser and the server (PRD §10.1). */
import { z } from "zod";

export const HOME_TYPES = ["Apartment", "Independent house", "Office or shop", "Other"] as const;
export const ROOM_OPTIONS = ["1", "2–3", "4–5", "Whole home", "Not sure"] as const;
export const APPLIANCES = ["Lights", "Fans", "Geyser", "AC", "TV", "Water motor", "Outdoor lights", "Other"] as const;
export const SWITCH_BRANDS = ["Anchor", "Legrand", "Schneider", "Havells", "Roma", "GM", "Goldmedal", "Other", "Not sure"] as const;
export const TIME_SLOTS = ["Morning", "Afternoon", "Evening"] as const;
export const HEARD_FROM = [
  "Instagram",
  "Facebook",
  "YouTube",
  "Google",
  "WhatsApp",
  "Friend or family",
  "Electrician",
  "Interior designer",
  "Other",
] as const;

const mobile = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, ""))
  .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number."));

const optional = <T extends z.ZodType>(t: T) => z.preprocess((v) => (v === "" || v == null ? undefined : v), t.optional());

/** Step 1: who you are, where you are, and consent (asked before anything is saved: DPDP Act). */
export const stepOneSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name.").max(60, "Name is too long."),
  mobile,
  whatsapp: optional(mobile),
  pincode: z.string().trim().regex(/^[1-9]\d{5}$/, "Enter a 6-digit pincode."),
  locality: z.string().trim().min(2, "Please enter your area or locality.").max(80, "Locality is too long."),
  consent: z.literal("on", { error: "Please accept to continue." }),
});

export const surveySchema = stepOneSchema.extend({
  email: optional(z.email("Enter a valid email address.")),
  homeType: z.enum(HOME_TYPES, { error: "Please choose your home type." }),
  rooms: optional(z.enum(ROOM_OPTIONS)),
  appliances: z.array(z.enum(APPLIANCES)).max(APPLIANCES.length).default([]),
  switchBrand: optional(z.enum(SWITCH_BRANDS)),
  preferredDate: optional(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date.")),
  timeSlot: optional(z.enum(TIME_SLOTS)),
  heardFrom: optional(z.enum(HEARD_FROM)),
  sourceCta: optional(z.string().max(60)),
  page: optional(z.string().max(200)),
  utmSource: optional(z.string().max(80)),
  utmMedium: optional(z.string().max(80)),
  utmCampaign: optional(z.string().max(80)),
});

export type SurveyInput = z.infer<typeof surveySchema>;
export type FieldErrors = Partial<Record<string, string>>;

/** First message per field, keyed by field name. */
export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export type SurveyResult =
  | { ok: true; ref: string; inServiceArea: boolean }
  | { ok: false; errors?: FieldErrors; message?: string };
