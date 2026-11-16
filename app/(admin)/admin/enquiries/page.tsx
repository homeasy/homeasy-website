import Link from "next/link";
import { Suspense } from "react";
import { ChevronDown, Mail, Phone } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { EnquiryControls } from "@/components/admin/EnquiryRow";
import { Card, EmptyState, ErrorBanner, fmtDateTime, InfoRow, PageHeader, Pill, timeAgo } from "@/components/admin/ui";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { requestTime, requireAdmin } from "@/lib/admin/session";
import { dbErrorHint, dbMode } from "@/lib/db";
import { ENQUIRY_KINDS, ENQUIRY_STATUSES, enquiryKindLabel, enquiryStatusLabel } from "@/lib/enquiries/schema";
import { listEnquiries, type Enquiry } from "@/lib/enquiries/store";

type Search = Promise<{ kind?: string; status?: string; q?: string }>;
const TONE: Record<string, "amber" | "blue" | "green" | "grey" | "red"> = { new: "amber", contacted: "blue", in_progress: "blue", closed: "green", spam: "grey" };

async function Enquiries({ searchParams }: { searchParams: Search }) {
  await requireAdmin();
  const { kind = "", status = "", q = "" } = await searchParams;
  const now = await requestTime();
  let all: Enquiry[] = [];
  let loadError = "";
  try {
    all = await listEnquiries();
  } catch (e) {
    console.error(e);
    loadError = dbErrorHint(e);
  }
  const needle = q.toLowerCase();
  const rows = all.filter(
    (e) => (!kind || e.kind === kind) && (!status || e.status === status) && (!q || [e.ref, e.name, e.mobile, e.email, e.organisation, e.city, e.message].join(" ").toLowerCase().includes(needle)),
  );
  return (
    <AdminShell mode={dbMode()}>
      <PageHeader title="Enquiries" description="Messages from the contact, partner, government and demo forms. Survey bookings are under Leads." />
      <form method="get" className="mb-4 flex flex-wrap items-center gap-2">
        <input name="q" defaultValue={q} placeholder="Search name, mobile, organisation, message" aria-label="Search enquiries" className="adm-control w-full sm:w-72" />
        <select name="kind" defaultValue={kind} aria-label="Type" className="adm-control w-auto sm:w-52">
          <option value="">All types</option>
          {ENQUIRY_KINDS.map((k) => (
            <option key={k.id} value={k.id}>
              {k.label}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={status} aria-label="Status" className="adm-control w-auto sm:w-44">
          <option value="">All statuses</option>
          {ENQUIRY_STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <button type="submit" className="adm-btn adm-btn-secondary">
          Filter
        </button>
        {(kind || status || q) && (
          <Link href="/admin/enquiries" className="adm-btn adm-btn-ghost">
            Clear
          </Link>
        )}
      </form>
      {loadError && <ErrorBanner title="Could not load enquiries.">{loadError}</ErrorBanner>}
      <Card bodyClassName="p-0">
        {rows.length === 0 ? (
          <EmptyState title={all.length ? "No enquiries match this filter" : "No enquiries yet"} text={all.length ? "Try clearing the filter." : "Messages sent from the website forms will appear here."} />
        ) : (
          <ul className="divide-y divide-navy-700">
            {rows.map((e) => (
              <li key={e.ref}>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 hover:bg-white/[0.03] sm:px-5">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-white">
                        {e.name} {e.organisation && <span className="font-normal text-mist">· {e.organisation}</span>}
                      </span>
                      <span className="block truncate text-xs text-mist">{e.message || Object.values(e.extra ?? {}).join(" · ") || `+91 ${e.mobile}`}</span>
                    </span>
                    <span className="hidden sm:block">
                      <Pill>{enquiryKindLabel(e.kind)}</Pill>
                    </span>
                    <Pill tone={TONE[e.status] ?? "grey"}>{enquiryStatusLabel(e.status)}</Pill>
                    <span className="hidden w-16 shrink-0 text-right text-xs text-ash sm:block" title={fmtDateTime(e.created_at)}>
                      {timeAgo(e.created_at, now)}
                    </span>
                    <ChevronDown size={16} aria-hidden="true" className="shrink-0 -rotate-90 text-mist transition-transform group-open:rotate-0" />
                  </summary>
                  <div className="grid gap-5 border-t border-navy-700 bg-navy-800/40 p-4 sm:p-5 lg:grid-cols-3">
                    <div className="min-w-0 lg:col-span-2">
                      <div className="mb-4 flex flex-wrap gap-2">
                        <a href={`tel:+91${e.mobile}`} className="adm-btn adm-btn-primary adm-btn-sm">
                          <Phone size={14} aria-hidden="true" /> Call
                        </a>
                        <a href={`https://wa.me/91${e.mobile}`} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-secondary adm-btn-sm">
                          <WhatsAppIcon size={14} /> WhatsApp
                        </a>
                        {e.email && (
                          <a href={`mailto:${e.email}?subject=${encodeURIComponent(`Your Homeasy enquiry (${e.ref})`)}`} className="adm-btn adm-btn-secondary adm-btn-sm">
                            <Mail size={14} aria-hidden="true" /> Email
                          </a>
                        )}
                      </div>
                      {e.message && <p className="mb-4 whitespace-pre-wrap break-words text-sm text-white">{e.message}</p>}
                      <dl className="divide-y divide-navy-700 border-t border-navy-700">
                        <InfoRow label="Request no.">{e.ref}</InfoRow>
                        <InfoRow label="Type">{enquiryKindLabel(e.kind)}</InfoRow>
                        <InfoRow label="Mobile">+91 {e.mobile}</InfoRow>
                        <InfoRow label="Email">{e.email}</InfoRow>
                        <InfoRow label="Organisation">{e.organisation}</InfoRow>
                        <InfoRow label="City">{e.city}</InfoRow>
                        {Object.entries(e.extra ?? {}).map(([k, v]) => (
                          <InfoRow key={k} label={k}>
                            {v}
                          </InfoRow>
                        ))}
                        <InfoRow label="Sent from">{e.page}</InfoRow>
                        <InfoRow label="Received">{fmtDateTime(e.created_at)}</InfoRow>
                      </dl>
                    </div>
                    <EnquiryControls enquiryRef={e.ref} name={e.name} status={e.status} notes={e.admin_notes ?? ""} />
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

export default function AdminEnquiriesPage({ searchParams }: { searchParams: Search }) {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading enquiries…</p>}>
      <Enquiries searchParams={searchParams} />
    </Suspense>
  );
}
