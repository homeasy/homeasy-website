"use server";

import { headers } from "next/headers";
import { randomInt } from "node:crypto";
import { fieldErrors, surveySchema, type SurveyResult } from "@/lib/leads/schema";
import { allow } from "@/lib/leads/rate-limit";
import { notifySurveyLead } from "@/lib/leads/notify";
import { saveLead } from "@/lib/leads/store";
import { checkPincode } from "@/lib/service-area";

const REF_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // no 0/O/1/I: easy to read out on a call

function makeRef() {
  let s = "";
  for (let i = 0; i < 5; i++) s += REF_CHARS[randomInt(REF_CHARS.length)];
  return `HE-${s}`;
}

/** Validates, rate-limits and stores a survey request (PRD §10.1, F1). */
export async function submitSurvey(formData: FormData): Promise<SurveyResult> {
  // Honeypot: real people never fill this hidden field. Pretend success so bots learn nothing.
  if (String(formData.get("company") ?? "") !== "") return { ok: true, ref: makeRef(), inServiceArea: true };

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (!allow(ip)) return { ok: false, message: "Too many requests. Please try again in a few minutes, or WhatsApp us." };

  const raw = Object.fromEntries(formData) as Record<string, unknown>;
  raw.appliances = formData.getAll("appliances");
  const parsed = surveySchema.safeParse(raw);
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  const d = parsed.data;

  if (d.preferredDate) {
    const day = new Date(`${d.preferredDate}T00:00:00+05:30`).getTime();
    const now = Date.now();
    if (!(day > now && day < now + 31 * 24 * 60 * 60 * 1000)) {
      return { ok: false, errors: { preferredDate: "Choose a date from tomorrow up to 30 days ahead." } };
    }
  }

  const area = checkPincode(d.pincode);
  const inServiceArea = area.status === "served";
  const ref = makeRef();

  const saved = await saveLead("survey_requests", {
    ref,
    full_name: d.fullName,
    mobile: d.mobile,
    whatsapp: d.whatsapp ?? d.mobile,
    email: d.email ?? null,
    pincode: d.pincode,
    locality: d.locality,
    in_service_area: inServiceArea,
    home_type: d.homeType,
    rooms: d.rooms ?? null,
    appliances: d.appliances,
    switch_brand: d.switchBrand ?? null,
    preferred_date: d.preferredDate ?? null,
    time_slot: d.timeSlot ?? null,
    heard_from: d.heardFrom ?? null,
    consent: true,
    source_cta: d.sourceCta ?? null,
    page: d.page ?? null,
    utm_source: d.utmSource ?? null,
    utm_medium: d.utmMedium ?? null,
    utm_campaign: d.utmCampaign ?? null,
    status: inServiceArea ? "new" : "out_of_area",
    created_at: new Date().toISOString(),
  });

  if (!saved.ok) return { ok: false, message: "Something went wrong on our side. Please WhatsApp or call us instead." };
  await notifySurveyLead({
    ref,
    fullName: d.fullName,
    mobile: d.mobile,
    whatsapp: d.whatsapp ?? d.mobile,
    email: d.email,
    pincode: d.pincode,
    locality: d.locality,
    inServiceArea,
    homeType: d.homeType,
    rooms: d.rooms,
    appliances: d.appliances,
    switchBrand: d.switchBrand,
    preferredDate: d.preferredDate,
    timeSlot: d.timeSlot,
    heardFrom: d.heardFrom,
    page: d.page,
    utmSource: d.utmSource,
  });
  return { ok: true, ref, inServiceArea };
}
