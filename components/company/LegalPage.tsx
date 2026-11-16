import type { ReactNode } from "react";
import { FileWarning } from "lucide-react";
import { PageHero, Section } from "@/components/ui";
import { fullAddress, mailHref, site } from "@/lib/site";

/** Static on purpose: update by hand when a legal page changes (no `new Date()` in server components). */
export const LEGAL_LAST_UPDATED = "16 November 2026";

/** Shared prose styles for long-form legal text inside the 720 px column. */
const PROSE = [
  "text-body",
  "[&_h2]:mt-12 [&_h2]:text-h4 [&_h2]:leading-snug [&_h2]:text-ink [&_h2:first-child]:mt-0",
  "[&_h3]:mt-6 [&_h3]:text-[1.0625rem] [&_h3]:text-ink",
  "[&_p]:mt-4",
  "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5",
  "[&_address]:mt-4 [&_address]:not-italic",
  "break-words",
].join(" ");

/**
 * Layout for /privacy-policy, /terms-of-service and /cookie-policy (PRD §8.16, §15).
 * Every legal page carries the "Draft — under legal review" notice until a lawyer signs it off.
 */
export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} sub={intro} />
      <Section>
        <div className="mx-auto max-w-[720px] lg:mx-0">
          <div role="note" className="flex gap-4 rounded-card border border-amber bg-amber-50 p-5">
            <FileWarning aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-ink" strokeWidth={1.75} />
            <p className="min-w-0 text-ink">
              <strong className="font-semibold">Draft — under legal review.</strong> This page will be finalised before
              we take our first order.
            </p>
          </div>
          <p className="mt-6 text-[15px] text-slate">Last updated: {LEGAL_LAST_UPDATED}</p>
          <div className={`mt-8 ${PROSE}`}>{children}</div>
        </div>
      </Section>
    </>
  );
}

/** Grievance contact block. No individual is named until one is formally appointed. */
export function GrievanceContact() {
  return (
    <address>
      Grievance Officer, {site.legalName}
      <br />
      {fullAddress}, India
      <br />
      Email:{" "}
      <a href={mailHref} className="link">
        {site.contact.email}
      </a>
    </address>
  );
}

/** One-line company identity used at the top of each legal page. */
export function CompanyIdentity() {
  return (
    <>
      {site.legalName} (CIN {site.cin}), registered office at {fullAddress}, India
    </>
  );
}
