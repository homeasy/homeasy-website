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

/** Hidden fields sent with both steps: where the lead came from, and which saved step-1 lead to update. */
const trackingFields = {
  sourceCta: optional(z.string().max(60)),
  page: optional(z.string().max(200)),
  utmSource: optional(z.string().max(80)),
  utmMedium: optional(z.string().max(80)),
  utmCampaign: optional(z.string().max(80)),
  leadRef: optional(z.string().regex(/^HE-[2-9A-HJ-NP-Z]{5}$/)),
  leadToken: optional(z.string().regex(/^[0-9a-f]{32}$/)),
};

/** What the server saves when step 1 is completed (a partial lead, PRD §25.11). */
export const partialLeadSchema = stepOneSchema.extend(trackingFields);

export const surveySchema = stepOneSchema.extend({
  email: optional(z.email("Enter a valid email address.")),
  homeType: z.enum(HOME_TYPES, { error: "Please choose your home type." }),
  rooms: optional(z.enum(ROOM_OPTIONS)),
  appliances: z.array(z.enum(APPLIANCES)).max(APPLIANCES.length).default([]),
  switchBrand: optional(z.enum(SWITCH_BRANDS)),
  preferredDate: optional(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date.")),
  timeSlot: optional(z.enum(TIME_SLOTS)),
  heardFrom: optional(z.enum(HEARD_FROM)),
  ...trackingFields,
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
  | { ok: false; errors?: FieldErrors; message?: string; reason?: "validation" | "rate_limit" | "server" };

/** Result of saving step 1. `token` lets the same browser finish (update) this lead in step 2. */
export type PartialLeadResult = { ok: true; ref: string; token: string } | { ok: false };

/** Values the booking form can be opened with, e.g. /book-survey?rooms=2-3&appliances=Lights,Fans&pincode=800001&source=estimator */
export type SurveyPrefill = {
  rooms?: (typeof ROOM_OPTIONS)[number];
  appliances: (typeof APPLIANCES)[number][];
  switchBrand?: (typeof SWITCH_BRANDS)[number];
  pincode?: string;
  source?: string;
};

const same = (a: string, b: string) => a.trim().toLowerCase().replace(/-/g, "–") === b.toLowerCase();

/** Reads the prefill from a query string. Unknown values are ignored. */
export function parseSurveyPrefill(search: string): SurveyPrefill {
  const p = new URLSearchParams(search);
  const rooms = p.get("rooms") ?? "";
  const brand = p.get("brand") ?? "";
  const wanted = (p.get("appliances") ?? "").split(",");
  const pincode = (p.get("pincode") ?? "").trim();
  const source = (p.get("source") ?? "").trim().toLowerCase();
  return {
    rooms: ROOM_OPTIONS.find((v) => same(rooms, v)),
    appliances: APPLIANCES.filter((v) => wanted.some((w) => same(w, v))),
    switchBrand: SWITCH_BRANDS.find((v) => same(brand, v)),
    pincode: /^[1-9]\d{5}$/.test(pincode) ? pincode : undefined,
    source: /^[a-z0-9][a-z0-9_-]{0,59}$/.test(source) ? source : undefined,
  };
}

/** Lead pipeline (PRD §27.3). Order = the order shown in the admin. */
export const LEAD_STATUSES = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "survey_scheduled", label: "Survey scheduled" },
  { id: "surveyed", label: "Surveyed" },
  { id: "quoted", label: "Quoted" },
  { id: "won", label: "Won" },
  { id: "installed", label: "Installed" },
  { id: "lost", label: "Lost" },
  { id: "out_of_area", label: "Out of area" },
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number]["id"];
export const statusLabel = (id: string) => LEAD_STATUSES.find((s) => s.id === id)?.label ?? id;

export const LEAD_PRIORITIES = ["high", "medium", "low"] as const;
/** Statuses still being worked on (not won, lost or out of area). */
export const OPEN_LEAD_STATUSES = ["new", "contacted", "survey_scheduled", "surveyed", "quoted"];
