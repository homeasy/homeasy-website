"use server";

import { randomUUID } from "node:crypto";
import { refresh } from "next/cache";
import { requireAdmin } from "@/lib/admin/session";
import { insertWaMessage } from "@/lib/chat/wa-inbox";
import { sendToCustomer } from "@/lib/chat/whatsapp";

/** Sends a WhatsApp reply to a customer from the business number and keeps a copy in the inbox. */
export async function replyOnWhatsApp(phone: string, text: string): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const to = phone.replace(/\D/g, "");
  const body = text.trim().slice(0, 3500);
  if (to.length < 10 || !body) return { ok: false, error: "Type a message first." };
  const sent = await sendToCustomer(to, body);
  if (!sent.id) return { ok: false, error: sent.error };
  await insertWaMessage({ id: sent.id || randomUUID(), phone: to, name: null, direction: "out", body, at: new Date().toISOString() });
  refresh();
  return { ok: true };
}
