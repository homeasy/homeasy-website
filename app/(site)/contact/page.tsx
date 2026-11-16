import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/meta";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Card, PageHero, Section, SectionHeading } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { usp } from "@/lib/flags";
import { getSite } from "@/lib/site-live";

const pageMeta: Metadata = {
  title: "Contact Homeasy — Patna",
  description: "Call, WhatsApp or email Homeasy for a free home survey or partnership.",
};

export function generateMetadata() {
  return seoMetadata("/contact", pageMeta);
}

const TILE =
  "flex h-full min-h-[120px] flex-col rounded-card border border-line bg-white p-6 text-ink no-underline transition-colors hover:border-navy hover:bg-cloud";

/**
 * PRD §8.12 + §26.15. The contact form (topic, message, consent) is not built yet:
 * it arrives with the database. Until then the page offers direct channels only.
 */
export default async function ContactPage() {
  const site = await getSite();
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${site.shortLegalName}, ${site.fullAddress}`,
  )}`;
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        sub="Questions, partnerships or press — we'd love to hear from you."
      />

      <Section>
        <ul className="grid gap-4 md:grid-cols-3">
          <li className="min-w-0">
            <a href={site.whatsappHref("general")} target="_blank" rel="noopener noreferrer" className={TILE}>
              <WhatsAppIcon size={28} className="text-link" />
              <span className="mt-4 text-h4 font-semibold">WhatsApp</span>
              <span className="mt-1 break-words text-body">{site.contact.phoneDisplay}</span>
              <span className="mt-3 text-[15px] text-slate">
                {usp("U2") ? "Reply within 30 minutes (working hours)" : "We reply during working hours"}
              </span>
            </a>
          </li>
          <li className="min-w-0">
            <a href={site.telHref} className={TILE}>
              <Phone aria-hidden="true" className="size-7 text-link" strokeWidth={1.75} />
              <span className="mt-4 text-h4 font-semibold">Call</span>
              <span className="mt-1 break-words text-body">{site.contact.phoneDisplay}</span>
              <span className="mt-3 text-[15px] text-slate">{site.contact.hours}</span>
            </a>
          </li>
          <li className="min-w-0">
            <a href={site.mailHref} className={TILE}>
              <Mail aria-hidden="true" className="size-7 text-link" strokeWidth={1.75} />
              <span className="mt-4 text-h4 font-semibold">Email</span>
              <span className="mt-1 break-words text-body">{site.contact.email}</span>
              <span className="mt-3 text-[15px] text-slate">Best for partnerships, press and careers</span>
            </a>
          </li>
        </ul>
      </Section>

      <Section tone="cloud">
        <SectionHeading title="Hours and address" />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Card className="min-w-0">
            <Clock aria-hidden="true" className="size-6 text-link" strokeWidth={1.75} />
            <h3 className="mt-4 text-h4">Office hours</h3>
            <p className="mt-2 text-body">{site.contact.hours}</p>
          </Card>
          <Card className="min-w-0">
            <MapPin aria-hidden="true" className="size-6 text-link" strokeWidth={1.75} />
            <h3 className="mt-4 text-h4">Registered office</h3>
            <address className="mt-2 break-words not-italic text-body">
              {site.shortLegalName}
              <br />
              {site.fullAddress}
            </address>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="link mt-3 inline-flex min-h-11 items-center"
            >
              Open in Google Maps
            </a>
          </Card>
        </div>
        <p className="mt-8 max-w-[720px] text-body">
          Want a home survey? It&apos;s free across Bihar.{" "}
          <Link href="/book-survey" className="link">
            Book a free home survey
          </Link>
          .
        </p>
      </Section>

      <CtaBand />
    </>
  );
}
