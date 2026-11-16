import type { Metadata } from "next";
import { Related } from "@/components/ui/Related";
import { seoMetadata } from "@/lib/seo/meta";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, PageHero, Section, SectionHeading } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { flags, usp } from "@/lib/flags";
import { getSite } from "@/lib/site-live";

const pageMeta: Metadata = {
  title: "Homeasy for Investors — Smart Retrofit for India",
  description:
    "Homeasy for investors: bringing smart living to India's traditional homes by retrofitting the switchboxes people already have.",
};

export function generateMetadata() {
  return seoMetadata("/investors", pageMeta);
}

/**
 * PRD §8.10 + §26.13. Rule R10: no funding, revenue, valuation or market-size figures.
 * The one-pager download is a "Could" item and is not offered yet.
 */
export default async function InvestorsPage() {
  if (!flags.SHOW_INVESTORS_PAGE) notFound();
  const site = await getSite();
  const investorMail = `${site.mailHref}?subject=Investor%20enquiry`;

  // "Written service levels" is only claimed once the reply-time and visit-time promises are live.
  const serviceLevels = usp("U2") && usp("U5");

  const blocks = [
    {
      title: "Problem",
      points: [
        "Smart homes usually need new switchboards or rewiring.",
        "DIY modules come without installation or support.",
        "After-sales service is weak.",
      ],
    },
    {
      title: "Solution",
      points: [
        "Homeasy modules fit inside existing switchboxes.",
        "Trained installers do the work.",
        "A free Homeasy app controls the home.",
        serviceLevels ? "Service levels are written down." : "Support stays with us after installation.",
      ],
    },
    {
      title: "Business model",
      points: [
        "Hardware and installation revenue from the first order.",
        "B2B projects with designers and builders.",
        "B2G projects for public buildings.",
        "Service plans later.",
      ],
    },
    {
      title: "Market",
      points: [
        "India only.",
        "We start with a pilot in Patna.",
        "Then Bihar and other cities through installer partners.",
      ],
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Homeasy for investors"
        title="Bringing smart living to India's traditional homes."
        sub="Most Indian homes can't go smart without rewiring. Homeasy makes it possible with retrofit modules, professional installation and a free app."
      >
        <a href={investorMail} className="btn btn-primary min-h-12 px-6">
          Contact the founder
        </a>
      </PageHero>

      <Section>
        <SectionHeading title="The opportunity, in brief" />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {blocks.map((b) => (
            <Card key={b.title} className="min-w-0">
              <h3 className="text-h4">{b.title}</h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-body">
                {b.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="cloud">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="min-w-0">
            <h2 className="text-h4">Stage</h2>
            <p className="mt-4 text-body">
              Pre-launch. We are preparing pilot installations in Patna. The company was incorporated in{" "}
              {site.foundedYear}.
            </p>
            <p className="mt-4">
              <Link href="/roadmap" className="link inline-flex min-h-11 items-center">
                See the roadmap
              </Link>
            </p>
          </Card>
          <Card className="min-w-0">
            <h2 className="text-h4">Founder</h2>
            <p className="mt-4 text-body">
              {site.founder.name}, {site.founder.role}. He brings 13+ years of personal experience in interior design,
              automation and smart-home integration.
            </p>
            <p className="mt-4">
              <Link href="/about" className="link inline-flex min-h-11 items-center">
                More about Homeasy
              </Link>
            </p>
          </Card>
        </div>
      </Section>

      <Section>
        <div className="max-w-[720px]">
          <h2 className="text-h2 leading-[1.15]">Talk to the founder</h2>
          <p className="mt-4 text-lg text-body">
            We don&apos;t publish financial figures on this page. Write to us and we&apos;ll share more directly.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href={investorMail} className="btn btn-primary min-h-12 px-6">
              Contact the founder
            </a>
            <span className="break-words text-body">{site.contact.email}</span>
          </div>
        </div>
      </Section>

      <Related paths={["/about", "/roadmap", "/how-it-works"]} />

      <CtaBand />
    </>
  );
}
