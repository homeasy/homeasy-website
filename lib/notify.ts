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

/**
 * A short confirmation to the person who filled in a form, when they gave an email. Needs a verified sender
 * (LEAD_NOTIFY_FROM): Resend's test sender cannot write to customers, so without it nothing is sent.
 */
export async function confirmTo(email: string | null | undefined, subject: string, html: string, replyTo?: string): Promise<void> {
  if (!email || !process.env.RESEND_API_KEY || !process.env.LEAD_NOTIFY_FROM) return;
  await sendEmail([email], subject, html, replyTo);
}
