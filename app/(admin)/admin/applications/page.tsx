import Link from "next/link";
import { Suspense } from "react";
import { ChevronDown, Download, Mail, Phone } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ApplicationControls } from "@/components/admin/ApplicationControls";
import { Card, EmptyState, ErrorBanner, fmtDateTime, InfoRow, PageHeader, Pill, timeAgo } from "@/components/admin/ui";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { requestTime, requireAdmin } from "@/lib/admin/session";
import { APPLICATION_STATUSES, applicationStatusLabel } from "@/lib/applications/schema";
import { listApplications, type Application } from "@/lib/applications/store";
import { dbErrorHint, dbMode } from "@/lib/db";

type Search = Promise<{ role?: string; status?: string; q?: string }>;
const TONE: Record<string, "amber" | "blue" | "green" | "grey" | "red"> = { new: "amber", shortlisted: "blue", interview: "blue", offered: "green", hired: "green", rejected: "grey" };

async function Applications({ searchParams }: { searchParams: Search }) {
  await requireAdmin();
  const { role = "", status = "", q = "" } = await searchParams;
  const now = await requestTime();
  let all: Application[] = [];
  let loadError = "";
  try {
    all = await listApplications();
  } catch (e) {
    console.error(e);
    loadError = dbErrorHint(e);
  }
  const roles = [...new Set(all.map((a) => a.role))].sort();
  const needle = q.toLowerCase();
  const rows = all.filter(
    (a) => (!role || a.role === role) && (!status || a.status === status) && (!q || [a.ref, a.name, a.mobile, a.email, a.city, a.qualification, a.message].join(" ").toLowerCase().includes(needle)),
  );
  return (
    <AdminShell mode={dbMode()}>
      <PageHeader
        title="Job applications"
        description="Applications from the form on the Careers page. Openings are managed under Website → Job postings."
        actions={
          <Link href="/admin/content/jobs" className="adm-btn adm-btn-secondary">
            Job postings
          </Link>
        }
      />
      <form method="get" className="mb-4 flex flex-wrap items-center gap-2">
        <input name="q" defaultValue={q} placeholder="Search name, mobile, email, college" aria-label="Search applications" className="adm-control w-full sm:w-72" />
        <select name="role" defaultValue={role} aria-label="Role" className="adm-control w-auto sm:w-64">
          <option value="">All roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={status} aria-label="Status" className="adm-control w-auto sm:w-44">
          <option value="">All statuses</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <button type="submit" className="adm-btn adm-btn-secondary">
          Filter
        </button>
        {(role || status || q) && (
          <Link href="/admin/applications" className="adm-btn adm-btn-ghost">
            Clear
          </Link>
        )}
      </form>
      {loadError && <ErrorBanner title="Could not load applications.">{loadError}</ErrorBanner>}
      <Card bodyClassName="p-0">
        {rows.length === 0 ? (
          <EmptyState title={all.length ? "No applications match this filter" : "No applications yet"} text={all.length ? "Try clearing the filter." : "Applications sent from the Careers page will appear here."} />
        ) : (
          <ul className="divide-y divide-navy-700">
            {rows.map((a) => (
              <li key={a.ref}>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 hover:bg-white/[0.03] sm:px-5">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-white">{a.name}</span>
                      <span className="block truncate text-xs text-mist">
                        {a.role}
                        {a.qualification ? ` · ${a.qualification}` : ""}
                      </span>
                    </span>
                    <Pill tone={TONE[a.status] ?? "grey"}>{applicationStatusLabel(a.status)}</Pill>
                    <span className="hidden w-16 shrink-0 text-right text-xs text-ash sm:block" title={fmtDateTime(a.created_at)}>
                      {timeAgo(a.created_at, now)}
                    </span>
                    <ChevronDown size={16} aria-hidden="true" className="shrink-0 -rotate-90 text-mist transition-transform group-open:rotate-0" />
                  </summary>
                  <div className="grid gap-5 border-t border-navy-700 bg-navy-800/40 p-4 sm:p-5 lg:grid-cols-3">
                    <div className="min-w-0 lg:col-span-2">
                      <div className="mb-4 flex flex-wrap gap-2">
                        {a.resume_path && (
                          <a href={`/admin/applications/resume?ref=${a.ref}`} className="adm-btn adm-btn-primary adm-btn-sm">
                            <Download size={14} aria-hidden="true" /> Resume
                          </a>
                        )}
                        <a href={`tel:+91${a.mobile}`} className="adm-btn adm-btn-secondary adm-btn-sm">
                          <Phone size={14} aria-hidden="true" /> Call
                        </a>
                        <a href={`https://wa.me/91${a.mobile}`} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-secondary adm-btn-sm">
                          <WhatsAppIcon size={14} /> WhatsApp
                        </a>
                        <a href={`mailto:${a.email}?subject=${encodeURIComponent(`Your application for ${a.role} at Homeasy (${a.ref})`)}`} className="adm-btn adm-btn-secondary adm-btn-sm">
                          <Mail size={14} aria-hidden="true" /> Email
                        </a>
                      </div>
                      {a.message && <p className="mb-4 whitespace-pre-wrap break-words text-sm text-white">{a.message}</p>}
                      <dl className="divide-y divide-navy-700 border-t border-navy-700">
                        <InfoRow label="Application">{a.ref}</InfoRow>
                        <InfoRow label="Role">{a.role}</InfoRow>
                        <InfoRow label="Mobile">+91 {a.mobile}</InfoRow>
                        <InfoRow label="Email">{a.email}</InfoRow>
                        <InfoRow label="City">{a.city}</InfoRow>
                        <InfoRow label="Qualification">{a.qualification}</InfoRow>
                        <InfoRow label="Experience">{a.experience}</InfoRow>
                        <InfoRow label="Link">
                          {a.link && (
                            <a href={a.link} target="_blank" rel="noopener noreferrer" className="text-white underline">
                              {a.link}
                            </a>
                          )}
                        </InfoRow>
                        <InfoRow label="Resume file">{a.resume_name}</InfoRow>
                        <InfoRow label="Received">{fmtDateTime(a.created_at)}</InfoRow>
                      </dl>
                    </div>
                    <ApplicationControls applicationRef={a.ref} name={a.name} status={a.status} notes={a.admin_notes ?? ""} />
                  </div>
                </details>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AdminShell>
  );
}

export default function AdminApplicationsPage({ searchParams }: { searchParams: Search }) {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading applications…</p>}>
      <Applications searchParams={searchParams} />
    </Suspense>
  );
}
