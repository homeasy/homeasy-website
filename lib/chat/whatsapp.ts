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

const env = process.env;
export const whatsappConfigured = () => !!(env.WHATSAPP_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID && teamNumbers().length);
export const teamNumbers = () => (env.WHATSAPP_TEAM_NUMBERS ?? "").split(",").map((n) => n.replace(/\D/g, "")).filter((n) => n.length >= 10);

const endpoint = () => `https://graph.facebook.com/${env.WHATSAPP_API_VERSION ? `${env.WHATSAPP_API_VERSION}/` : ""}${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

async function post(body: Record<string, unknown>): Promise<{ id: string | null; code: number | null }> {
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
      return { id: null, code: json.error?.code ?? res.status };
    }
    return { id: json.messages?.[0]?.id ?? null, code: null };
  } catch (e) {
    console.error("[whatsapp] request failed", e);
    return { id: null, code: null };
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

/** Checks that a webhook call really comes from Meta: HMAC-SHA256 of the raw body with the app secret. */
export function validSignature(rawBody: string, header: string | null): boolean {
  const secret = env.WHATSAPP_APP_SECRET;
  if (!secret || !header?.startsWith("sha256=")) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(rawBody).digest("hex"));
  const given = Buffer.from(header.slice(7));
  return expected.length === given.length && timingSafeEqual(expected, given);
}
