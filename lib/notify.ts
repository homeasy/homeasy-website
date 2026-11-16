/**
 * Team alerts by email (server only). Uses Resend (RESEND_API_KEY, LEAD_NOTIFY_TO, LEAD_NOTIFY_FROM), the provider
 * already set up for survey leads; does nothing when the key is not set, so forms keep working without email.
 */
import "server-only";
import { sendEmail } from "@/lib/leads/notify";

export async function notify({ subject, html, replyTo }: { subject: string; html: string; replyTo?: string }): Promise<void> {
  const to = (process.env.LEAD_NOTIFY_TO ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!to.length) return;
  await sendEmail(to, subject, html, replyTo);
}
