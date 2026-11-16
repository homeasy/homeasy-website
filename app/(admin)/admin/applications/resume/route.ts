import type { NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin/session";
import { RESUME_TYPES } from "@/lib/applications/schema";
import { listApplications, RESUME_BUCKET } from "@/lib/applications/store";
import { readPrivateFile } from "@/lib/db";

/** Resume download (admin only). Resumes live in a private bucket and can only be read through this route. */
export async function GET(request: NextRequest) {
  if (!(await isAdmin())) return new Response("Not signed in", { status: 401 });
  const ref = request.nextUrl.searchParams.get("ref") ?? "";
  const application = (await listApplications()).find((a) => a.ref === ref);
  if (!application?.resume_path) return new Response("No resume for this application", { status: 404 });
  const bytes = await readPrivateFile(RESUME_BUCKET, application.resume_path);
  if (!bytes) return new Response("The resume file could not be read", { status: 404 });
  const ext = application.resume_path.split(".").pop() ?? "pdf";
  const name = `${application.name.replace(/[^\w -]/g, "").trim() || "resume"} - ${application.ref}.${ext}`;
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": RESUME_TYPES[ext] ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
