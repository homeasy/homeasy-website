"use server";

import { requireAdmin } from "@/lib/admin/session";
import { whatsappSelfTest, type WhatsAppTest } from "@/lib/chat/whatsapp";

/** Checks the WhatsApp bridge settings with Meta and sends a test message to the team numbers. */
export async function testWhatsApp(): Promise<WhatsAppTest> {
  await requireAdmin();
  return whatsappSelfTest();
}
