"use server";

import { refresh } from "next/cache";
import { requireAdmin } from "@/lib/admin/session";
import { deleteChat, getChat, updateChat } from "@/lib/chat/store";

type Result = { ok: boolean; error?: string };
const ID = /^CH-[A-Z2-9]{20}$/;

/** A team member's reply: it appears in the visitor's chat window, and the AI stays quiet for the next 15 minutes. */
export async function replyToChat(id: string, text: string): Promise<Result> {
  await requireAdmin();
  const body = text.trim().slice(0, 1500);
  const session = ID.test(id) && body ? await getChat(id) : null;
  if (!session) return { ok: false, error: "Could not send." };
  const now = Date.now();
  const saved = await updateChat(id, {
    handoff: true,
    live_until: new Date(now + 15 * 60 * 1000).toISOString(),
    messages: [...session.messages, { role: "agent", text: body, at: new Date(now).toISOString() }],
  });
  if (!saved) return { ok: false, error: "Could not send." };
  refresh();
  return { ok: true };
}

export async function removeChat(id: string): Promise<Result> {
  await requireAdmin();
  if (!ID.test(id) || !(await deleteChat(id))) return { ok: false, error: "Could not delete." };
  refresh();
  return { ok: true };
}
