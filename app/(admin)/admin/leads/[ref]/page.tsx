import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { CopyRef, DeleteLead, LeadNotes, LeadPipeline, type NoteView } from "@/components/admin/LeadPanels";
import { BACK_LINK, Card, fmtDateTime, InfoRow, LeadStatusBadge, Pill, timeAgo } from "@/components/admin/ui";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { requestTime, requireAdmin } from "@/lib/admin/session";
import { getLead, listLeads, storageMode } from "@/lib/leads/store";

async function LeadDetail({ params }: { params: Promise<{ ref: string }> }) {
  await requireAdmin();
  const { ref } = await params;
  const lead = await getLead(decodeURIComponent(ref));
  if (!lead) notFound();
  const now = await requestTime();
  const wa = lead.whatsapp || lead.mobile;
  const firstName = lead.full_name.split(" ")[0];
  const related = (await listLeads()).filter((l) => l.mobile === lead.mobile && l.ref !== lead.ref).slice(0, 5);

  const notes: NoteView[] = [...lead.activity].reverse().map((n) => ({
    id: n.id,
    text: n.text,
    author: n.author || "admin",
    ago: timeAgo(n.at, now),
    when: fmtDateTime(n.at),
    system: !!n.system,
  }));
  if (lead.notes) notes.push({ id: "legacy", text: lead.notes, author: "Earlier note", ago: "", when: "", system: false });

  return (
    <AdminShell mode={storageMode()}>
      <Link href="/admin/leads" className={BACK_LINK}>
        <ArrowLeft size={16} aria-hidden="true" /> All leads
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-white">{lead.full_name}</h1>
            <LeadStatusBadge status={lead.status} />
          </div>
          <p className="mt-1 text-sm text-mist">
            {lead.locality}, {lead.pincode} · Received {fmtDateTime(lead.created_at)}
            <CopyRef value={lead.ref} />
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={`tel:+91${lead.mobile}`} className="adm-btn adm-btn-primary">
            <Phone size={16} aria-hidden="true" /> Call
          </a>
          <a
            href={`https://wa.me/91${wa}?text=${encodeURIComponent(`Hi ${firstName}, this is Homeasy. Thank you for booking a free survey (request ${lead.ref}).`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="adm-btn adm-btn-secondary"
          >
            <WhatsAppIcon size={16} /> WhatsApp
          </a>
          {lead.email && (
            <a href={`mailto:${lead.email}?subject=${encodeURIComponent(`Your Homeasy survey request (${lead.ref})`)}`} className="adm-btn adm-btn-secondary">
              <Mail size={16} aria-hidden="true" /> Email
            </a>
          )}
          <DeleteLead leadRef={lead.ref} name={lead.full_name} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <Card title="Survey request">
            <p className="mb-2 text-xs uppercase tracking-wider text-ash">Wants to control</p>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {lead.appliances?.length ? lead.appliances.map((a) => <Pill key={a}>{a}</Pill>) : <span className="text-sm text-mist">Not said</span>}
            </div>
            <dl className="-mb-2.5 divide-y divide-navy-700 border-t border-navy-700">
              <InfoRow label="Home type">{lead.home_type || (lead.partial ? "Not given yet (stopped after step 1)" : "")}</InfoRow>
              <InfoRow label="Rooms">{lead.rooms}</InfoRow>
              <InfoRow label="Switch brand">{lead.switch_brand}</InfoRow>
              <InfoRow label="Preferred visit">{[lead.preferred_date, lead.time_slot].filter(Boolean).join(", ")}</InfoRow>
            </dl>
          </Card>

          <Card title="Activity & notes">
            <LeadNotes leadRef={lead.ref} notes={notes} />
          </Card>
        </div>

        <div className="min-w-0 space-y-6">
          <Card title="Pipeline">
            <LeadPipeline leadRef={lead.ref} status={lead.status} priority={lead.priority} assignedTo={lead.assigned_to ?? ""} />
          </Card>

          <Card title="Contact">
            <dl className="-my-2.5 divide-y divide-navy-700">
              <InfoRow label="Mobile">
                <a href={`tel:+91${lead.mobile}`} className="text-white no-underline hover:text-amber">
                  +91 {lead.mobile}
                </a>
              </InfoRow>
              <InfoRow label="WhatsApp">{lead.whatsapp && `+91 ${lead.whatsapp}`}</InfoRow>
              <InfoRow label="Email">
                {lead.email && (
                  <a href={`mailto:${lead.email}`} className="text-white no-underline hover:text-amber">
                    {lead.email}
                  </a>
                )}
              </InfoRow>
              <InfoRow label="Area">
                {lead.locality}, {lead.pincode}
              </InfoRow>
              <InfoRow label="Service area">{lead.in_service_area ? "Inside (Bihar)" : "Outside"}</InfoRow>
            </dl>
          </Card>

          <Card title="Details">
            <dl className="-my-2.5 divide-y divide-navy-700">
              <InfoRow label="Heard from">{lead.heard_from}</InfoRow>
              <InfoRow label="Page">{[lead.page, lead.source_cta].filter(Boolean).join(" · ")}</InfoRow>
              <InfoRow label="Campaign">{[lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(" / ")}</InfoRow>
              <InfoRow label="Updated">{timeAgo(lead.updated_at, now)}</InfoRow>
            </dl>
          </Card>

          {related.length > 0 && (
            <Card title="Previous requests">
              <ul className="space-y-2.5">
                {related.map((r) => (
                  <li key={r.ref}>
                    <Link href={`/admin/leads/${r.ref}`} className="flex items-center justify-between gap-2 text-sm no-underline hover:text-amber">
                      <span className="truncate text-mist">
                        {r.ref} · {fmtDateTime(r.created_at)}
                      </span>
                      <LeadStatusBadge status={r.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

export default function LeadPage({ params }: { params: Promise<{ ref: string }> }) {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading lead…</p>}>
      <LeadDetail params={params} />
    </Suspense>
  );
}
