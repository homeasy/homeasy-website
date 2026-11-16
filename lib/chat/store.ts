/** Chat sessions (server only): table `chat_sessions` (supabase/05-chat.sql), or .data/chat_sessions.json in development. */
import "server-only";
import { dbDelete, dbGet, dbInsert, dbList, dbUpdate, type Row } from "@/lib/db";

export type ChatMessage = { role: "user" | "assistant" | "agent"; text: string; at: string };
export type ChatSession = {
  id: string;
  name: string;
  email: string | null;
  mobile: string;
  mode: "whatsapp" | "call" | "email";
  messages: ChatMessage[];
  handoff: boolean;
  live_until: string | null;
  /** WhatsApp message IDs of this chat's messages forwarded to the team, to match their replies */
  wa_ids?: string[];
  page: string | null;
  created_at: string;
  updated_at: string;
};

const TABLE = "chat_sessions";

export const insertChat = (s: ChatSession) => dbInsert(TABLE, s as unknown as Row);
export async function getChat(id: string): Promise<ChatSession | null> {
  return (await dbGet<ChatSession & Row>(TABLE, "id", id)) as ChatSession | null;
}
export const updateChat = (id: string, patch: Partial<ChatSession>) => dbUpdate(TABLE, "id", id, { ...patch, updated_at: new Date().toISOString() } as Row);
export async function listChats(): Promise<ChatSession[]> {
  return ((await dbList<ChatSession & Row>(TABLE, "updated_at.desc")) ?? []) as ChatSession[];
}
export const deleteChat = (id: string) => dbDelete(TABLE, "id", id);
