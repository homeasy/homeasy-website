/** Enquiry storage (server only): table `enquiries` (supabase/04-enquiries.sql), or .data/enquiries.json in development. */
import "server-only";
import { dbDelete, dbInsert, dbList, dbUpdate, type Row } from "@/lib/db";

export type Enquiry = {
  ref: string; // e.g. HQ-7K2QF
  kind: string;
  name: string;
  mobile: string;
  email: string | null;
  organisation: string | null;
  city: string | null;
  message: string | null;
  extra: Record<string, string>; // form-specific answers, label → answer
  page: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

const TABLE = "enquiries";

export const insertEnquiry = (e: Enquiry) => dbInsert(TABLE, e as unknown as Row);
export async function listEnquiries(): Promise<Enquiry[]> {
  return ((await dbList<Enquiry & Row>(TABLE, "created_at.desc")) ?? []) as Enquiry[];
}
export const updateEnquiry = (ref: string, patch: Partial<Pick<Enquiry, "status" | "admin_notes">>) =>
  dbUpdate(TABLE, "ref", ref, { ...patch, updated_at: new Date().toISOString() });
export const deleteEnquiry = (ref: string) => dbDelete(TABLE, "ref", ref);
