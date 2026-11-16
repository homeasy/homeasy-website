/**
 * WhatsApp bridge for the website chat (server only), using Meta's WhatsApp Business Cloud API.
 * Visitor messages in a chat that asked for a person are forwarded to the team's own WhatsApp; when a team
 * member replies there (ideally by swipe-replying to the forwarded message), the reply goes back into the
 * visitor's chat window (app/api/whatsapp/webhook).
 *
 * Env: WHATSAPP_TOKEN (access token), WHATSAPP_PHONE_NUMBER_ID (the business number's ID in Meta),
 * WHATSAPP_TEAM_NUMBERS (who receives chats and may reply: digits with country code, comma-separated),
 * WHATSAPP_APP_SECRET (to verify webhook calls), WHATSAPP_VERIFY_TOKEN (any phrase you choose, typed once
 * into Meta's webhook form), optional WHATSAPP_TEMPLATE (an approved template with two text variables, used
 * when the 24-hour window is closed) and WHATSAPP_API_VERSION (e.g. v23.0).
 */
import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// Values pasted into the hosting settings often pick up a stray space or line break: read them trimmed.
const read = (name: string) => (process.env[name] ?? "").trim();
const env = {
  get WHATSAPP_TOKEN() { return read("WHATSAPP_TOKEN"); },
  get WHATSAPP_PHONE_NUMBER_ID() { return read("WHATSAPP_PHONE_NUMBER_ID"); },
  get WHATSAPP_TEAM_NUMBERS() { return read("WHATSAPP_TEAM_NUMBERS"); },
  get WHATSAPP_APP_SECRET() { return read("WHATSAPP_APP_SECRET"); },
  get WHATSAPP_VERIFY_TOKEN() { return read("WHATSAPP_VERIFY_TOKEN"); },
  get WHATSAPP_TEMPLATE() { return read("WHATSAPP_TEMPLATE"); },
  get WHATSAPP_TEMPLATE_LANG() { return read("WHATSAPP_TEMPLATE_LANG"); },
  get WHATSAPP_API_VERSION() { return read("WHATSAPP_API_VERSION"); },
};
/** The phrase Meta must send when the webhook is saved. */
export const verifyToken = () => env.WHATSAPP_VERIFY_TOKEN;
export const whatsappConfigured = () => !!(env.WHATSAPP_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID && teamNumbers().length);
export const teamNumbers = () => env.WHATSAPP_TEAM_NUMBERS.split(",").map((n) => n.replace(/\D/g, "")).filter((n) => n.length >= 10);

const endpoint = () => `https://graph.facebook.com/${env.WHATSAPP_API_VERSION ? `${env.WHATSAPP_API_VERSION}/` : ""}${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

async function post(body: Record<string, unknown>): Promise<{ id: string | null; code: number | null; status?: number; message?: string }> {
  try {
    const res = await fetch(endpoint(), {
      method: "POST",
      headers: { Authorization: `Bearer ${env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", ...body }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const json = (await res.json().catch(() => ({}))) as { messages?: { id: string }[]; error?: { code?: number; message?: string } };
    if (!res.ok) {
      console.error(`[whatsapp] send failed: ${res.status} ${json.error?.code ?? ""} ${json.error?.message ?? ""}`);
      return { id: null, code: json.error?.code ?? res.status, status: res.status, message: json.error?.message };
    }
    return { id: json.messages?.[0]?.id ?? null, code: null };
  } catch (e) {
    console.error("[whatsapp] request failed", e);
    return { id: null, code: null, message: "Could not reach Meta (network or timeout)." };
  }
}

/**
 * Sends a text to every team number and returns the WhatsApp message IDs (used to match replies to a chat).
 * WhatsApp only allows free text within 24 hours of the recipient's last message to the business number;
 * outside that window Meta answers with error 131047, and the approved template (if configured) is used instead.
 */
export async function sendToTeam(text: string, who = "Website chat"): Promise<string[]> {
  if (!whatsappConfigured()) return [];
  const ids: string[] = [];
  for (const to of teamNumbers()) {
    let sent = await post({ to, type: "text", text: { body: text.slice(0, 3500), preview_url: false } });
    if (!sent.id && sent.code === 131047 && env.WHATSAPP_TEMPLATE) {
      const plain = (s: string) => s.replace(/\s+/g, " ").trim().slice(0, 900); // template variables cannot contain new lines
      sent = await post({
        to,
        type: "template",
        template: {
          name: env.WHATSAPP_TEMPLATE,
          language: { code: env.WHATSAPP_TEMPLATE_LANG || "en" },
          components: [{ type: "body", parameters: [{ type: "text", text: plain(who) }, { type: "text", text: plain(text) }] }],
        },
      });
    }
    if (sent.id) ids.push(sent.id);
  }
  return ids;
}

/** A reply from the admin to a customer who wrote to the business number. Free text only works within 24 hours of their last message. */
export async function sendToCustomer(phone: string, text: string): Promise<{ id: string | null; error: string }> {
  if (!env.WHATSAPP_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID) return { id: null, error: "The WhatsApp connection is not set up." };
  const sent = await post({ to: phone.replace(/\D/g, ""), type: "text", text: { body: text.slice(0, 3500), preview_url: false } });
  return { id: sent.id, error: sent.id ? "" : `Meta said (code ${sent.code ?? "?"}): ${sent.message ?? "no message"}. ${explain(sent.code, sent.status)}` };
}

/** Checks that a webhook call really comes from Meta: HMAC-SHA256 of the raw body with the app secret. */
export function validSignature(rawBody: string, header: string | null): boolean {
  const secret = env.WHATSAPP_APP_SECRET;
  if (!secret || !header?.startsWith("sha256=")) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(rawBody).digest("hex"));
  const given = Buffer.from(header.slice(7));
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** What Meta's error numbers mean, in plain words (for the admin's test button). */
function explain(code: number | null, status?: number): string {
  if (code === 190 || status === 401) return "Meta rejected the access token (wrong, expired or revoked). Generate a new system-user token with whatsapp_business_messaging and whatsapp_business_management, put it in WHATSAPP_TOKEN and redeploy.";
  if (code === 131047) return "Outside the 24-hour window: WhatsApp only allows a free reply within 24 hours of that person's last message to the business number (for team numbers, an approved template in WHATSAPP_TEMPLATE also works).";
  if (code === 131030) return "This number is not on the test number's allowed list. In Meta, add it under \"Send to\" → Manage recipients and verify it.";
  if (code === 10 || code === 200 || code === 3) return "The token does not have permission for this WhatsApp account. Assign the WhatsApp account to the system user with full control, then generate the token again.";
  if (code === 100) return "Either WHATSAPP_PHONE_NUMBER_ID is not the ID Meta shows under \"Phone number ID\", or (more often) this token has no access to the WhatsApp account that owns the number: in Business settings > Accounts > WhatsApp accounts, give the system user full control of that account (test numbers live in a \"Test WhatsApp Business Account\"), then generate the token again.";
  if (code === 131026) return "WhatsApp could not deliver to this number (not on WhatsApp, or it has not accepted the latest terms).";
  return "See the message from Meta above.";
}

export type WhatsAppTest = {
  settings: { label: string; ok: boolean }[];
  number: { ok: boolean; detail: string };
  sends: { to: string; ok: boolean; detail: string }[];
};

/** Admin self-test: are the settings present, does Meta accept the token and number ID, and does a test message go out? */
export async function whatsappSelfTest(): Promise<WhatsAppTest> {
  const settings = [
    { label: "WHATSAPP_TOKEN", ok: !!env.WHATSAPP_TOKEN },
    { label: "WHATSAPP_PHONE_NUMBER_ID", ok: /^\d{8,}$/.test(env.WHATSAPP_PHONE_NUMBER_ID) },
    { label: "WHATSAPP_TEAM_NUMBERS", ok: teamNumbers().length > 0 },
    { label: "WHATSAPP_APP_SECRET (for replies coming back)", ok: !!env.WHATSAPP_APP_SECRET },
    { label: "WHATSAPP_VERIFY_TOKEN", ok: !!env.WHATSAPP_VERIFY_TOKEN },
  ];
  if (!env.WHATSAPP_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID) return { settings, number: { ok: false, detail: "Add the missing settings and redeploy." }, sends: [] };

  let number = { ok: false, detail: "Could not reach Meta." };
  try {
    const res = await fetch(`https://graph.facebook.com/${env.WHATSAPP_API_VERSION ? `${env.WHATSAPP_API_VERSION}/` : ""}${env.WHATSAPP_PHONE_NUMBER_ID}?fields=display_phone_number,verified_name`, {
      headers: { Authorization: `Bearer ${env.WHATSAPP_TOKEN}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const json = (await res.json().catch(() => ({}))) as { display_phone_number?: string; verified_name?: string; error?: { code?: number; message?: string } };
    number = res.ok
      ? { ok: true, detail: `Meta accepts the token. Business number: ${json.display_phone_number ?? "?"} (${json.verified_name ?? "no name"}).` }
      : { ok: false, detail: `Meta said (${res.status}, code ${json.error?.code ?? "?"}): ${json.error?.message ?? "no message"}. ${explain(json.error?.code ?? null, res.status)}` };
  } catch {
    /* keep the default */
  }

  const sends: WhatsAppTest["sends"] = [];
  for (const to of teamNumbers()) {
    const r = await post({ to, type: "text", text: { body: "Homeasy test: the website chat bridge can reach this WhatsApp number." } });
    sends.push({
      to: `…${to.slice(-4)}`,
      ok: !!r.id,
      detail: r.id ? "Sent. It should arrive on this phone now." : `Meta said (${r.status ?? "?"}, code ${r.code ?? "?"}): ${r.message ?? "no message"}. ${explain(r.code, r.status)}`,
    });
  }
  return { settings, number, sends };
}
