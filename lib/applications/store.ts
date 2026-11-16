/** Job applications (server only): table `job_applications` and the private `resumes` bucket (supabase/06-applications-inbox.sql). */
import "server-only";
import { dbDelete, dbInsert, dbList, dbUpdate, type Row } from "@/lib/db";

export type Application = {
  ref: string;
  role: string;
  name: string;
  mobile: string;
  email: string;
  city: string | null;
  qualification: string | null;
  experience: string | null;
  link: string | null;
  message: string | null; // why they want to join
  work: string | null; // relevant work or project
  start_date: string | null; // when they can join
  resume_path: string | null;
  resume_name: string | null;
  photo_path: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

const TABLE = "job_applications";
export const RESUME_BUCKET = "resumes";

export const insertApplication = (a: Application) => dbInsert(TABLE, a as unknown as Row);
export async function listApplications(): Promise<Application[]> {
  return ((await dbList<Application & Row>(TABLE, "created_at.desc")) ?? []) as Application[];
}
export const updateApplication = (ref: string, patch: Partial<Pick<Application, "status" | "admin_notes">>) =>
  dbUpdate(TABLE, "ref", ref, { ...patch, updated_at: new Date().toISOString() });
export const deleteApplication = (ref: string) => dbDelete(TABLE, "ref", ref);
