import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/meta";
import Link from "next/link";
import type { ReactNode } from "react";
import { Card, PageHero, Section, SectionHeading, StatusBadge } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { BulletList, Callout, PromiseStatus, live } from "@/components/service";
import { getSite } from "@/lib/site-live";

const pageMeta: Metadata = {
  title: "The Homeasy Promise, in Writing — Homeasy",
  description:
    "Our draft guarantee terms: same-look installation, fixed price, WhatsApp replies, technician visits in Patna and a 3-year module warranty.",
};

export function generateMetadata() {
  return seoMetadata("/guarantee", pageMeta);
}

type Pledge = {
  id: string;
  title: string;
  /** null = decided fact (not flag-gated) */
  on: boolean | null;
  promise: string;
  counts: ReactNode[];
  excludes: ReactNode[];
  claim: ReactNode[];
};

/** PRD §8.20, §8.20.1 (draft terms), §26.18, wireframe §25.12 */
export default async function GuaranteePage() {
  const site = await getSite();
  const promises: Pledge[] = [
    {
      id: "same-look",
      title: "“Same look” installation guarantee",
      on: live.sameLook,
      promise:
        "After installation, your switchboard looks exactly the same. Every switch works by hand as before, and we leave your home clean. Or we redo it free.",
      counts: [
        "Same appearance: plate, switches and positions refitted exactly as before. The module is not visible.",
        "Manual switches: every switch works by hand as before.",
        "No new damage: we repair or replace, free, any damage we cause to plates, switches, the box or the wall around it.",
        "Clean site: dust and debris cleaned before we leave.",
        "Proof: our technician takes before and after photos of every switchbox and shares them at handover.",
      ],
      excludes: [
        "Damage that was already there and recorded in survey photos. For example cracked plates, loose switches, damaged boxes or wall marks.",
        "Old or brittle plates and switches that break when opened because of age. We warn you at the survey. You choose to proceed, or to replace them at cost before work.",
        "Shallow boxes that need a spacer, extension frame or box change. We do this only with your written approval in the quote.",
        "Wiring corrections needed for safety that need visible work, such as replacing burnt wires. These are agreed in the quote.",
        "Changes you ask for, such as new switches, moved points or new plates.",
        "Discontinued switch models where an identical part isn't available. We offer the closest match.",
        "Exact paint colour matching. We repair damage we cause, but paint matching is limited to touch-up.",
        "Changes or damage after handover by others, tampering, or later electrical events like surges and lightning. Those fall under warranty terms.",
      ],
      claim: [
        "Send a WhatsApp photo of the issue soon after installation. We give you a ticket number.",
        live.visit
          ? "We revisit and redo the work free, within 24 hours of the claim in our Patna service area."
          : "We revisit and redo the work free.",
        "Before and after photos decide any dispute.",
        "The exact claim window will be confirmed in the final terms.",
      ],
    },
    {
      id: "fixed-price",
      title: "Fixed price, no surprises",
      on: live.fixedPrice,
      promise: "One price for modules, installation, app setup and GST. What we quote is what you pay.",
      counts: [
        "The written quote you receive after your free survey.",
        "Modules, installation, app setup and GST for the work listed in that quote.",
      ],
      excludes: [
        "Changes you ask for after the quote, such as extra rooms or switches.",
        "Wiring faults that were already there and need separate repair work. We tell you before doing anything.",
      ],
      claim: ["WhatsApp or call us with your quote and invoice. We check both and correct any difference."],
    },
    {
      id: "whatsapp-reply",
      title: "30-minute WhatsApp reply",
      on: live.reply,
      promise: "During working hours, a real person replies on WhatsApp within 30 minutes.",
      counts: [
        `Messages sent during working hours: ${site.contact.hours}.`,
        "A reply means a person gives you an answer or a next step. An automatic acknowledgement doesn't count.",
      ],
      excludes: [
        "Messages sent outside working hours. An auto-reply tells you when we will respond.",
      ],
      claim: ["Tell us on WhatsApp or by phone if we missed the time. We log it and follow up."],
    },
    {
      id: "technician-visit",
      title: "24-hour technician visit in Patna",
      on: live.visit,
      promise:
        "In our Patna service area, a technician visits within 24 hours of your complaint. We replace first, repair later.",
      counts: [
        "Time is counted from when your complaint is registered and you get a ticket number.",
        "Systems installed by Homeasy, within our Patna service area.",
        "Faults where a module or switch has stopped working.",
      ],
      excludes: [
        "Homes outside the Patna service area. We survey across Bihar, but this time promise is for Patna only.",
        "Systems or devices not installed by Homeasy.",
      ],
      claim: ["Raise the issue on WhatsApp or by phone. Keep your ticket number for reference."],
    },
    {
      id: "warranty",
      title: "3-year warranty",
      on: null,
      promise: "Homeasy modules are replaced free for manufacturing defects for 3 years.",
      counts: [
        "Homeasy modules, for 3 years from your installation date.",
        "Manufacturing defects. We replace the module during the warranty period.",
      ],
      excludes: [
        <>
          Exclusions such as lightning, water or physical damage. See the{" "}
          <Link href="/warranty" className="link">
            warranty policy
          </Link>
          .
        </>,
      ],
      claim: [
        <>
          WhatsApp or call us. The full steps are in the{" "}
          <Link href="/warranty" className="link">
            warranty policy
          </Link>
          .
        </>,
      ],
    },
  ];

  const status = (p: Pledge) =>
    p.on === null ? <StatusBadge status="available" label="Confirmed" /> : <PromiseStatus on={p.on} />;

  return (
    <>
      <PageHero
        eyebrow="Guarantee"
        title="The Homeasy promise. In writing."
        sub="Five promises we make to every Homeasy customer, and exactly what they mean."
      />

      <Section>
        <div className="max-w-[820px]">
          <Callout title="These terms are a draft.">
            They are pending legal review and may change. A promise marked &ldquo;Launching after our Patna
            pilot&rdquo; is not in force yet. It goes live once our pilot shows we can keep it every time.
          </Callout>
        </div>

        <div className="mt-12">
          <SectionHeading title="Our five promises" />
        </div>
        <ul className="mt-8 divide-y divide-line rounded-card border border-line bg-white">
          {promises.map((p) => (
            <li key={p.id}>
              <a
                href={`#${p.id}`}
                className="flex min-h-14 flex-col items-start gap-2 px-5 py-4 hover:bg-cloud sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-[17px] font-semibold">{p.title}</span>
                {status(p)}
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="cloud">
        <div className="space-y-8">
          {promises.map((p) => (
            <Card key={p.id} className="scroll-mt-28 sm:p-8">
              <article id={p.id} aria-labelledby={`${p.id}-title`} className="scroll-mt-28">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 id={`${p.id}-title`} className="text-h3 leading-[1.15]">
                    {p.title}
                  </h2>
                  {status(p)}
                </div>
                <p className="mt-4 max-w-[820px] text-lg text-ink">{p.promise}</p>

                <div className="mt-8 grid gap-8 lg:grid-cols-3">
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-semibold">What counts</h3>
                    <div className="mt-3 text-[15px]">
                      <BulletList items={p.counts} />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-semibold">What doesn&apos;t</h3>
                    <div className="mt-3 text-[15px]">
                      <BulletList items={p.excludes} />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-semibold">How to claim</h3>
                    <div className="mt-3 text-[15px]">
                      <BulletList items={p.claim} />
                    </div>
                  </div>
                </div>
              </article>
            </Card>
          ))}
        </div>

        <p className="mt-10 max-w-[820px] text-[15px] text-body">
          Draft terms, pending legal review. We show the exclusions to every customer at the survey and quote stage.
          The version and date will be added when the terms are final. Questions?{" "}
          <Link href="/contact" className="link">
            Contact us
          </Link>{" "}
          or see the{" "}
          <Link href="/faq" className="link">
            FAQ
          </Link>
          .
        </p>
      </Section>

      <CtaBand />
    </>
  );
}
