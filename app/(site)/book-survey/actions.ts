"use server";

import { headers } from "next/headers";
import { randomBytes, randomInt } from "node:crypto";
import { fieldErrors, partialLeadSchema, surveySchema, type PartialLeadResult, type SurveyResult } from "@/lib/leads/schema";
import { allow } from "@/lib/leads/rate-limit";
import { notifySurveyLead } from "@/lib/leads/notify";
import { saveLead, updatePartialLead } from "@/lib/leads/store";
import { checkPincode } from "@/lib/service-area";

const REF_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // no 0/O/1/I: easy to read out on a call

function makeRef() {
  let s = "";
  for (let i = 0; i < 5; i++) s += REF_CHARS[randomInt(REF_CHARS.length)];
  return `HE-${s}`;
}

async function clientIp() {
  const h = await headers();
  return (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
}

/**
 * Step 1 done ("Next"): saves a partial lead so the team can call back even if step 2 is abandoned
 * (PRD §10.1, §25.11). Consent is part of step 1 and is validated here before anything is stored.
 * Going back and changing step 1 updates the same lead. No team email is sent for a partial lead:
 * PRD §10.6 alerts on a survey request, which is sent once when step 2 is finished.
 * A failure here never blocks the customer: step 2 then saves the whole request as a new lead.
 */
export async function saveSurveyStepOne(formData: FormData): Promise<PartialLeadResult> {
  // Honeypot: pretend success so bots learn nothing. The token matches no row.
  if (String(formData.get("company") ?? "") !== "") return { ok: true, ref: makeRef(), token: randomBytes(16).toString("hex") };
  // own bucket, so saving step 1 does not use up the limit for the final submit
  if (!allow(`step1:${await clientIp()}`)) return { ok: false };

  const parsed = partialLeadSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false };
  const d = parsed.data;
  const inServiceArea = checkPincode(d.pincode).status === "served";
  const contact = {
    full_name: d.fullName,
    mobile: d.mobile,
    whatsapp: d.whatsapp ?? d.mobile,
    pincode: d.pincode,
    locality: d.locality,
    in_service_area: inServiceArea,
    status: inServiceArea ? "new" : "out_of_area",
  };

  if (d.leadRef && d.leadToken) {
    const updated = await updatePartialLead(d.leadRef, d.leadToken, contact);
    if (updated === "updated") return { ok: true, ref: d.leadRef, token: d.leadToken };
    if (updated === "error") return { ok: false };
  }

  const ref = makeRef();
  const token = randomBytes(16).toString("hex");
  const saved = await saveLead("survey_requests", {
    ref,
    ...contact,
    email: null,
    home_type: "", // not asked yet
    appliances: [],
    consent: true,
    source_cta: d.sourceCta ?? null,
    page: d.page ?? null,
    utm_source: d.utmSource ?? null,
    utm_medium: d.utmMedium ?? null,
    utm_campaign: d.utmCampaign ?? null,
    partial: true,
    resume_token: token,
    created_at: new Date().toISOString(),
  });
  return saved.ok ? { ok: true, ref, token } : { ok: false };
}

/** Validates, rate-limits and stores a survey request (PRD §10.1, F1). Finishes the step-1 lead when there is one. */
export async function submitSurvey(formData: FormData): Promise<SurveyResult> {
  // Honeypot: real people never fill this hidden field. Pretend success so bots learn nothing.
  if (String(formData.get("company") ?? "") !== "") return { ok: true, ref: makeRef(), inServiceArea: true };

  if (!allow(await clientIp())) {
    return { ok: false, reason: "rate_limit", message: "Too many requests. Please try again in a few minutes, or WhatsApp us." };
  }

  const raw = Object.fromEntries(formData) as Record<string, unknown>;
  raw.appliances = formData.getAll("appliances");
  const parsed = surveySchema.safeParse(raw);
  if (!parsed.success) return { ok: false, reason: "validation", errors: fieldErrors(parsed.error) };
  const d = parsed.data;

  if (d.preferredDate) {
    const day = new Date(`${d.preferredDate}T00:00:00+05:30`).getTime();
    const now = Date.now();
    if (!(day > now && day < now + 31 * 24 * 60 * 60 * 1000)) {
      return { ok: false, reason: "validation", errors: { preferredDate: "Choose a date from tomorrow up to 30 days ahead." } };
    }
  }

  const area = checkPincode(d.pincode);
  const inServiceArea = area.status === "served";
  const details = {
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
  };

  // Finish the lead saved after step 1 (same request number). Its status is left alone: the team may
  // already have called. If it cannot be found or updated, save the whole request as a new lead instead.
  let ref = "";
  if (d.leadRef && d.leadToken) {
    const updated = await updatePartialLead(d.leadRef, d.leadToken, { ...details, partial: false, resume_token: null });
    if (updated === "updated") ref = d.leadRef;
  }
  if (!ref) {
    ref = makeRef();
    const saved = await saveLead("survey_requests", {
      ref,
      ...details,
      consent: true,
      source_cta: d.sourceCta ?? null,
      page: d.page ?? null,
      utm_source: d.utmSource ?? null,
      utm_medium: d.utmMedium ?? null,
      utm_campaign: d.utmCampaign ?? null,
      status: inServiceArea ? "new" : "out_of_area",
      created_at: new Date().toISOString(),
    });
    if (!saved.ok) {
      return { ok: false, reason: "server", message: "Something went wrong on our side. Please WhatsApp or call us instead." };
    }
  }

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
