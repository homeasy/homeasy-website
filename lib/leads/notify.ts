/**
 * Lead notifications by email through Resend (server only). No package needed: plain HTTPS call.
 *   RESEND_API_KEY     required to send anything
 *   LEAD_NOTIFY_TO     where new-lead alerts go (default: the site email). Comma-separate several.
 *   LEAD_NOTIFY_FROM   sender, e.g. "Homeasy <leads@homeasy.io>". Needs homeasy.io verified in Resend.
 *                      Default "Homeasy <onboarding@resend.dev>" only delivers to the Resend account's own address.
 * A failed email never fails the booking: the lead is already saved.
 */
import "server-only";
import { getSite } from "@/lib/site-live";

const TEST_SENDER = "Homeasy <onboarding@resend.dev>";

const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export async function sendEmail(to: string[], subject: string, html: string, replyTo?: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.LEAD_NOTIFY_FROM || TEST_SENDER, to, subject, html, reply_to: replyTo }),
      cache: "no-store",
    });
    if (!res.ok) console.error(`[leads] Resend failed: ${res.status} ${await res.text()}`);
  } catch (e) {
    console.error("[leads] Resend request failed", e);
  }
}

export type SurveyLead = {
  ref: string;
  fullName: string;
  mobile: string;
  whatsapp: string;
  email?: string;
  pincode: string;
  locality: string;
  inServiceArea: boolean;
  homeType: string;
  rooms?: string;
  appliances: string[];
  switchBrand?: string;
  preferredDate?: string;
  timeSlot?: string;
  heardFrom?: string;
  page?: string;
  utmSource?: string;
};

/** Alert to the Homeasy team, plus a confirmation to the customer when they gave an email. */
export async function notifySurveyLead(lead: SurveyLead) {
  if (!process.env.RESEND_API_KEY) return;
  const site = await getSite();
  const to = (process.env.LEAD_NOTIFY_TO || site.contact.email).split(",").map((s) => s.trim()).filter(Boolean);
  const rows: [string, string][] = [
    ["Request no.", lead.ref],
    ["Name", lead.fullName],
    ["Mobile", `+91 ${lead.mobile}`],
    ["WhatsApp", `+91 ${lead.whatsapp}`],
    ["Email", lead.email ?? "—"],
    ["Area", `${lead.locality}, ${lead.pincode}`],
    ["In service area", lead.inServiceArea ? "Yes" : "No (out of area)"],
    ["Home type", lead.homeType],
    ["Rooms", lead.rooms ?? "—"],
    ["Wants to control", lead.appliances.join(", ") || "—"],
    ["Switch brand", lead.switchBrand ?? "—"],
    ["Preferred visit", [lead.preferredDate, lead.timeSlot].filter(Boolean).join(", ") || "—"],
    ["Heard from", lead.heardFrom ?? "—"],
    ["Source", [lead.page, lead.utmSource && `utm: ${lead.utmSource}`].filter(Boolean).join(" · ") || "—"],
  ];
  const table = rows
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#667085">${esc(k)}</td><td style="padding:6px 0;color:#0B1220"><strong>${esc(v)}</strong></td></tr>`)
    .join("");
  const wa = `https://wa.me/91${lead.whatsapp}`;
  const tasks = [
    sendEmail(
      to,
      `${lead.inServiceArea ? "New survey request" : "Out-of-area request"} ${lead.ref}: ${lead.fullName}, ${lead.locality}`,
      `<div style="font-family:Arial,sans-serif;font-size:15px"><h2 style="margin:0 0 12px">New survey request</h2><table style="border-collapse:collapse">${table}</table><p style="margin-top:16px"><a href="${wa}">Open WhatsApp chat</a> · <a href="tel:+91${esc(lead.mobile)}">Call</a></p><p style="color:#667085">Promise to the customer: we contact them ${esc(site.contact.leadResponse)}.</p></div>`,
      lead.email,
    ),
  ];
  // customer confirmation needs a verified sender domain; the Resend test sender cannot reach customers
  if (lead.email && process.env.LEAD_NOTIFY_FROM) {
    tasks.push(
      sendEmail(
        [lead.email],
        "Your free Homeasy home survey request",
        `<div style="font-family:Arial,sans-serif;font-size:15px;color:#0B1220"><p>Hi ${esc(lead.fullName.split(" ")[0])},</p><p>Thanks for booking a free home survey with Homeasy. Your request number is <strong>${esc(lead.ref)}</strong>.</p><p>${
          lead.inServiceArea
            ? `Our team will call or WhatsApp you ${esc(site.contact.leadResponse)} to confirm a visit time. During the visit we check your switchboxes and wiring and suggest the best setup for your home.`
            : "We don't serve your area yet. We've saved your details and will tell you when we do."
        }</p><p>Questions? WhatsApp or call us on ${esc(site.contact.phoneDisplay)}.</p><p>Team Homeasy<br><span style="color:#667085">${esc(site.tagline)}</span></p></div>`,
        site.contact.email,
      ),
    );
  }
  await Promise.all(tasks);
}
