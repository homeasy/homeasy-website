import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Phone } from "lucide-react";
import { AdminShell, formatWhen, StatusChip } from "@/components/admin/AdminShell";
import { LeadEditor } from "@/components/admin/LeadEditor";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { requireAdmin } from "@/lib/admin/session";
import { statusLabel } from "@/lib/leads/schema";
import { getLead, storageMode } from "@/lib/leads/store";

async function LeadDetail({ params }: { params: Promise<{ ref: string }> }) {
  await requireAdmin();
  const { ref } = await params;
  const lead = await getLead(decodeURIComponent(ref));
  if (!lead) notFound();
  const wa = lead.whatsapp || lead.mobile;
  const rows: [string, string][] = [
    ["Area", `${lead.locality}, ${lead.pincode}`],
    ["In service area", lead.in_service_area ? "Yes" : "No"],
    ["Home type", lead.home_type],
    ["Rooms", lead.rooms ?? "—"],
    ["Wants to control", lead.appliances?.join(", ") || "—"],
    ["Switch brand", lead.switch_brand ?? "—"],
    ["Preferred visit", [lead.preferred_date, lead.time_slot].filter(Boolean).join(", ") || "—"],
    ["Email", lead.email ?? "—"],
    ["Heard from", lead.heard_from ?? "—"],
    ["Came from", [lead.page, lead.source_cta, lead.utm_source && `utm: ${lead.utm_source}`].filter(Boolean).join(" · ") || "—"],
    ["Received", formatWhen(lead.created_at)],
  ];
  return (
    <AdminShell mode={storageMode()}>
      <Link href="/admin" className="link inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold">
        <ArrowLeft size={16} aria-hidden="true" /> All leads
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-h3 leading-tight">{lead.full_name}</h1>
        <StatusChip status={lead.status} label={statusLabel(lead.status)} />
        <span className="text-[14px] text-slate">{lead.ref}</span>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <a href={`tel:+91${lead.mobile}`} className="btn btn-secondary min-h-12 px-5">
          <Phone size={18} aria-hidden="true" /> Call +91 {lead.mobile}
        </a>
        <a href={`https://wa.me/91${wa}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline min-h-12 px-5">
          <WhatsAppIcon size={18} /> WhatsApp +91 {wa}
        </a>
      </div>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <dl className="divide-y divide-line rounded-card border border-line bg-white">
          {rows.map(([k, v]) => (
            <div key={k} className="grid gap-1 p-4 sm:grid-cols-[160px_minmax(0,1fr)]">
              <dt className="text-[14px] text-slate">{k}</dt>
              <dd className="break-words font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="rounded-card border border-line bg-white p-5">
          <h2 className="mb-4 text-h4">Follow-up</h2>
          <LeadEditor leadRef={lead.ref} status={lead.status} assignedTo={lead.assigned_to ?? ""} notes={lead.notes ?? ""} />
        </div>
      </div>
    </AdminShell>
  );
}

export default function LeadPage({ params }: { params: Promise<{ ref: string }> }) {
  return (
    <Suspense fallback={<p className="p-8 text-body">Loading lead…</p>}>
      <LeadDetail params={params} />
    </Suspense>
  );
}
