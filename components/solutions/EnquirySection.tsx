import type { ReactNode } from "react";
import { Mail, Phone } from "lucide-react";
import { Card, Section, SectionHeading } from "@/components/ui";
import { EnquiryFormBase } from "@/components/forms/EnquiryFormBase";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import type { EnquiryKind, ExtraField } from "@/lib/enquiries/schema";
import { getSite } from "@/lib/site-live";

type Props = {
  kind: Extract<EnquiryKind, "designer" | "builder" | "electrician" | "government">;
  /** page path, saved with the enquiry */
  page: string;
  title: string;
  sub: string;
  organisationLabel: string;
  /** standard fields that must be filled (PRD §10.2–10.3) */
  required?: ("email" | "organisation" | "city")[];
  cityLabel?: string;
  messageLabel: string;
  submitLabel: string;
  extraFields: ExtraField[];
  /** optional block shown above the WhatsApp / phone / email card */
  children?: ReactNode;
};

const ALT = "btn btn-outline min-h-12 w-full justify-start px-5";

/**
 * The inline enquiry form at the foot of each solution page (PRD §25.8, fields from §10.2–10.3),
 * with WhatsApp, phone and email next to it. Carries the `#enquire` anchor the hero buttons link to.
 */
export async function EnquirySection({ kind, page, title, sub, organisationLabel, required, cityLabel, messageLabel, submitLabel, extraFields, children }: Props) {
  const site = await getSite();
  return (
    <Section tone="tint" id="enquire" className="scroll-mt-20">
      <SectionHeading title={title} sub={sub} />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-8">
        <div className="min-w-0">
          <EnquiryFormBase
            kind={kind}
            page={page}
            organisationLabel={organisationLabel}
            required={required}
            cityLabel={cityLabel}
            messageLabel={messageLabel}
            submitLabel={submitLabel}
            extraFields={extraFields}
          />
        </div>
        <div className="min-w-0 space-y-6">
          {children}
          <Card>
            <h3 className="text-h4">Prefer to talk?</h3>
            <p className="mt-2 text-[15px] text-body">Reach us directly. Working hours: {site.contact.hours}.</p>
            <ul className="mt-5 space-y-3">
              <li>
                <a href={site.whatsappHref("general")} target="_blank" rel="noopener noreferrer" className={ALT}>
                  <WhatsAppIcon size={18} /> Enquire on WhatsApp
                </a>
              </li>
              <li>
                <a href={site.telHref} className={ALT}>
                  <Phone aria-hidden="true" size={18} /> <span>Call {site.contact.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a href={site.mailHref} className={ALT}>
                  <Mail aria-hidden="true" size={18} /> <span className="min-w-0 break-all">{site.contact.email}</span>
                </a>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </Section>
  );
}
