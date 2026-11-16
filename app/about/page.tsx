import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Feather, Handshake, Headset, MapPin, ShieldCheck } from "lucide-react";
import { Card, CtaBand, PageHero, Section, SectionHeading } from "@/components/ui";
import { LinkedInIcon } from "@/components/icons/brand-icons";
import { fullAddress, mailHref, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Homeasy — Smart Home Retrofit Company, Patna",
  description:
    "Homeasy Automation Pvt. Ltd. (founded 2025, Patna) makes traditional homes smart without rewiring.",
};

const VALUES = [
  { icon: Feather, title: "Simplicity", body: "Smart living should be easy to buy, easy to use and easy to explain." },
  { icon: Handshake, title: "Honesty", body: "We say what is ready and what is still planned. No inflated claims." },
  { icon: ShieldCheck, title: "Safety first", body: "We check your wiring before we fit anything inside a switchbox." },
  { icon: MapPin, title: "Built for India", body: "Designed around Indian switchboxes, Indian homes and Indian families." },
  { icon: Headset, title: "Reliable support", body: "We install what we sell, and we stay reachable after installation." },
];

/** PRD §8.8. Recognition is hidden until there are confirmed items; GST is omitted until provided. */
export default function AboutPage() {
  const facts: { label: string; value: ReactNode }[] = [
    { label: "Legal name", value: site.legalName },
    { label: "CIN", value: site.cin },
    { label: "Incorporated", value: String(site.foundedYear) },
    { label: "Registered office", value: fullAddress },
    {
      label: "Email",
      value: (
        <a href={mailHref} className="link">
          {site.contact.email}
        </a>
      ),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="About Homeasy"
        title="Making Indian homes smart — the easy way."
        sub="Homeasy is a Patna-based company converting traditional homes into smart homes, without changing switches or rewiring."
      >
        <Link href="/book-survey" className="btn btn-primary min-h-12 px-6">
          Book a free survey
        </Link>
        <Link href="/solutions" className="btn btn-outline min-h-12 px-6">
          Partner with us
        </Link>
      </PageHero>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="min-w-0">
            <SectionHeading title="Our story" />
            <div className="mt-6 max-w-[640px] space-y-4 text-lg text-body">
              <p>Most Indian families live in homes built long before smart homes existed.</p>
              <p>Replacing switchboards or rewiring is costly and disruptive.</p>
              <p>
                We started Homeasy in {site.foundedYear} to make smart living possible for these homes. Small modules
                go inside the switchboxes they already have, installed and supported by our own team.
              </p>
            </div>
          </div>
          <div className="min-w-0">
            <div className="rounded-card bg-tint p-6 lg:p-8">
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-body">Our mission</h2>
              <p className="mt-3 text-h4 font-semibold leading-snug text-ink">
                Make every Indian home smart, safe and easy to live in — without rebuilding it.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="cloud">
        <SectionHeading title="What we value" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {VALUES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="min-w-0">
              <Card className="h-full">
                <Icon aria-hidden="true" className="size-6 text-link" strokeWidth={1.75} />
                <h3 className="mt-4 text-[1.1875rem] leading-snug">{title}</h3>
                <p className="mt-2 text-[15px] text-body">{body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeading title="Founder" />
        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <Image
            src={site.founder.photo}
            alt={`${site.founder.name}, ${site.founder.role} of Homeasy`}
            width={160}
            height={160}
            className="size-40 shrink-0 rounded-full border border-line object-cover"
          />
          <div className="min-w-0 max-w-[640px]">
            <h3 className="text-h4">{site.founder.name}</h3>
            <p className="mt-1 text-slate">{site.founder.role}</p>
            <p className="mt-4 text-body">
              Vishwjeet brings 13+ years of personal experience in interior design, automation and smart-home
              integration.
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-body">
              <li>B.Tech, MAIT Rohini (GGSIPU)</li>
              <li>Diploma in Mechanical Engineering, Government Polytechnic Purnea</li>
            </ul>
            <a
              href={site.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link mt-4 inline-flex min-h-11 items-center gap-2"
            >
              <LinkedInIcon size={18} /> Homeasy on LinkedIn
            </a>
            <p className="mt-6 border-t border-line pt-6 text-body">
              We&apos;re a small, focused team building Homeasy from Patna.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="cloud">
        <SectionHeading title="Company facts" />
        <Card className="mt-10 max-w-[720px]">
          <dl className="divide-y divide-line">
            {facts.map((f) => (
              <div key={f.label} className="grid gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-[180px_1fr] sm:gap-6">
                <dt className="text-[15px] text-slate">{f.label}</dt>
                <dd className="min-w-0 break-words font-semibold text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </Section>

      <CtaBand />
    </>
  );
}
