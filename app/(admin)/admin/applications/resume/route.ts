import type { NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin/session";
import { PHOTO_TYPES, RESUME_TYPES } from "@/lib/applications/schema";
import { listApplications, RESUME_BUCKET } from "@/lib/applications/store";
import { readPrivateFile } from "@/lib/db";

/** Resume download, or the applicant's photo with ?file=photo (admin only). Both live in a private bucket and can only be read through this route. */
export async function GET(request: NextRequest) {
  if (!(await isAdmin())) return new Response("Not signed in", { status: 401 });
  const ref = request.nextUrl.searchParams.get("ref") ?? "";
  const wantPhoto = request.nextUrl.searchParams.get("file") === "photo";
  const application = (await listApplications()).find((a) => a.ref === ref);
  const stored = wantPhoto ? application?.photo_path : application?.resume_path;
  if (!application || !stored) return new Response("No file for this application", { status: 404 });
  const bytes = await readPrivateFile(RESUME_BUCKET, stored);
  if (!bytes) return new Response("The file could not be read", { status: 404 });
  const ext = stored.split(".").pop() ?? "pdf";
  const name = `${application.name.replace(/[^\w -]/g, "").trim() || "applicant"} - ${application.ref}${wantPhoto ? " photo" : ""}.${ext}`;
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": (wantPhoto ? PHOTO_TYPES[ext] : RESUME_TYPES[ext]) ?? "application/octet-stream",
      "Content-Disposition": `${wantPhoto ? "inline" : "attachment"}; filename="${name}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
