import type { Metadata } from "next";
import { Related } from "@/components/ui/Related";
import { seoMetadata } from "@/lib/seo/meta";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Card, PageHero, Section, SectionHeading } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { EnquiryFormBase } from "@/components/forms/EnquiryFormBase";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { usp } from "@/lib/flags";
import { getSite } from "@/lib/site-live";

const pageMeta: Metadata = {
  title: "Contact Homeasy — Call, WhatsApp or Email, Patna",
  description:
    "Contact Homeasy in Patna by phone, WhatsApp or email to book a free home survey, ask a question or discuss a business partnership.",
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
        sub="Contact Homeasy with questions, partnerships or press — we'd love to hear from you."
      >
        <a href={site.whatsappHref("general")} target="_blank" rel="noopener noreferrer" className="btn btn-secondary min-h-12 px-6">
          <WhatsAppIcon size={18} /> WhatsApp us
        </a>
        <Link href="/book-survey" className="btn btn-outline min-h-12 px-6">
          Book a free home survey
        </Link>
      </PageHero>

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

      <Section tone="cloud">
        <div id="message" className="max-w-[760px] scroll-mt-28">
          <SectionHeading title="Send us a message" sub="Tell us what you need and we will get back to you during working hours." />
          <div className="mt-8">
            <EnquiryFormBase
              kind="contact"
              page="/contact"
              show={{ email: true, city: true, message: true }}
              submitLabel="Send message"
              extraFields={[
                {
                  name: "topic",
                  label: "What is this about?",
                  type: "select",
                  required: true,
                  options: ["Home survey", "Designer", "Builder or commercial", "Electrician", "Government", "Investor", "Press", "Careers", "Support"],
                },
              ]}
            />
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading title="What happens after you contact us" />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["Tell us about your home", "Share your pincode and what you want to control: lights, fans, geyser, AC or TV. A photo of your switchboard helps."],
            ["We book a free home survey", "Our electrician visits, checks your switchboxes and wiring, and tells you what can be made smart. The survey is free across Bihar."],
            ["You get a written quote", "You see the modules, installation and app setup in writing before any work starts. You decide after you see it."],
          ].map(([title, body], i) => (
            <li key={title} className="min-w-0">
              <Card className="h-full">
                <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-slate">Step {i + 1}</p>
                <h3 className="mt-2 text-h4">{title}</h3>
                <p className="mt-2 text-body">{body}</p>
              </Card>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-[720px] text-body">
          Interior designer, builder, electrician or government department? See{" "}
          <Link href="/solutions" className="link">
            Homeasy for business
          </Link>{" "}
          and write to us about your project.
        </p>
      </Section>

      <Related paths={["/book-survey", "/faq", "/how-it-works"]} />

      <CtaBand />
    </>
  );
}
