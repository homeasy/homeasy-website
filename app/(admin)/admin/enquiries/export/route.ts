import type { NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin/session";
import { enquiryKindLabel } from "@/lib/enquiries/schema";
import { listEnquiries } from "@/lib/enquiries/store";

function cell(v: unknown) {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@]/.test(s)) s = `'${s}`; // stop spreadsheet apps treating text as a formula
  return `"${s.replace(/"/g, '""')}"`;
}

/** CSV of enquiries (admin only), optionally one type: /admin/enquiries/export?kind=early_access */
export async function GET(request: NextRequest) {
  if (!(await isAdmin())) return new Response("Not signed in", { status: 401 });
  const kind = request.nextUrl.searchParams.get("kind") ?? "";
  const rows = (await listEnquiries()).filter((e) => !kind || e.kind === kind);
  const extraKeys = [...new Set(rows.flatMap((e) => Object.keys(e.extra ?? {})))];
  const head = ["ref", "created_at", "type", "status", "name", "mobile", "email", "organisation", "city", ...extraKeys, "message", "page", "notes"];
  const lines = rows.map((e) =>
    [e.ref, e.created_at, enquiryKindLabel(e.kind), e.status, e.name, e.mobile, e.email, e.organisation, e.city, ...extraKeys.map((k) => e.extra?.[k]), e.message, e.page, e.admin_notes].map(cell).join(","),
  );
  return new Response("﻿" + [head.join(","), ...lines].join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="homeasy-${kind || "enquiries"}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
