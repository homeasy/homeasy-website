/**
 * WhatsApp inbox (server only): messages customers send to the business number through Meta's Cloud API,
 * and the replies the team sends from the admin. Table `wa_messages` (supabase/06-applications-inbox.sql).
 */
import "server-only";
import { dbInsert, dbList, type Row } from "@/lib/db";

export type WaMessage = { id: string; phone: string; name: string | null; direction: "in" | "out"; body: string; at: string };

const TABLE = "wa_messages";
export const insertWaMessage = (m: WaMessage) => dbInsert(TABLE, m as unknown as Row);
/** Newest first (up to 1000). */
export async function listWaMessages(): Promise<WaMessage[]> {
  return ((await dbList<WaMessage & Row>(TABLE, "at.desc")) ?? []) as WaMessage[];
}
