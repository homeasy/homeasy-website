import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/meta";
import Link from "next/link";
import { getSite } from "@/lib/site-live";
import { Card, PageHero, Section, SectionHeading, Steps } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { BulletList, Callout, live, replyLine, visitLine } from "@/components/service";

const pageMeta: Metadata = {
  title: "Warranty Policy: 3 Years on Homeasy Modules — Homeasy",
  description:
    "Homeasy modules carry a 3-year warranty against manufacturing defects, from your installation date. See what is covered and how to claim.",
};

export function generateMetadata() {
  return seoMetadata("/warranty", pageMeta);
}

/** PRD §8.15 */
export default async function WarrantyPage() {
  const site = await getSite();
  const claimSteps = [
    { title: "Contact us", body: "Message us on WhatsApp or call. Tell us what has stopped working." },
    { title: "Get a ticket number", body: "We register your complaint and share a ticket number." },
    { title: "We reply", body: replyLine(site.contact.hours) },
    { title: "Technician visit", body: visitLine },
  ];

  return (
    <>
      <PageHero
        eyebrow="Warranty"
        title="Homeasy warranty policy"
        sub="3 years on Homeasy modules, from your installation date."
      />

      <Section>
        <div className="max-w-[820px]">
          <Callout title="This policy is a draft.">
            It is pending legal review and may change before our first installation. The 3-year term on Homeasy
            modules is decided.
          </Callout>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card className="min-w-0">
            <h2 className="text-h4">Warranty term</h2>
            <p className="mt-3 text-body">
              <strong className="text-ink">3 years</strong> from the installation date, on Homeasy modules.
            </p>
          </Card>
          <Card className="min-w-0">
            <h2 className="text-h4">What is covered</h2>
            <p className="mt-3 text-body">
              Manufacturing defects in Homeasy modules. During the warranty period we replace the module, not repair
              it.
            </p>
          </Card>
          <Card className="min-w-0">
            <h2 className="text-h4">Installation workmanship</h2>
            <p className="mt-3 text-body">
              Our installation work carries a separate workmanship warranty. We will publish its period here before
              installations begin.
            </p>
          </Card>
          <Card className="min-w-0">
            <h2 className="text-h4">Documents to keep</h2>
            <p className="mt-3 text-body">
              {live.report
                ? "Keep your invoice and your Readiness Report reference. We use them to find your installation."
                : "Keep your invoice. We use it to find your installation."}
            </p>
          </Card>
        </div>
      </Section>

      <Section tone="cloud">
        <SectionHeading title="How to claim" sub="One message or call starts your claim." />
        <div className="mt-10">
          <Steps items={claimSteps} />
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={site.whatsappHref("general")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary min-h-12 px-6"
          >
            <WhatsAppIcon size={18} /> WhatsApp us
          </a>
          <a href={site.telHref} className="btn btn-outline min-h-12 px-6">
            Call {site.contact.phoneDisplay}
          </a>
        </div>
        <p className="mt-6 text-body">
          Our reply and visit promises are explained on the{" "}
          <Link href="/guarantee" className="link">
            guarantee page
          </Link>
          .
        </p>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="min-w-0">
            <SectionHeading title="What is not covered" sub="Draft list, pending legal review." />
            <div className="mt-6">
              <BulletList
                items={[
                  "Damage from lightning, water, fire or physical impact.",
                  "Electrical faults in your home's wiring or supply, outside the module.",
                  "Voltage surges beyond the module's rated protection.",
                  "Modules opened, moved or reinstalled by anyone other than Homeasy.",
                  "Third-party devices and appliances.",
                  "Normal wear of switches and plates.",
                ]}
              />
            </div>
          </div>
          <div className="min-w-0">
            <SectionHeading title="If you sell or rent out your home" />
            <p className="mt-6 text-body">
              We are finalising how the warranty passes to new occupants. Ask us if this matters for your home.
            </p>
            <p className="mt-4 text-body">
              More questions? See the{" "}
              <Link href="/faq" className="link">
                FAQ
              </Link>{" "}
              or{" "}
              <Link href="/contact" className="link">
                contact us
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
