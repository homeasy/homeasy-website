import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { Related } from "@/components/ui/Related";
import { seoMetadata } from "@/lib/seo/meta";
import { Home, MapPin, UserCheck } from "lucide-react";
import { Card, PageHero, Section, SectionHeading } from "@/components/ui";
import jobsData from "@/data/jobs.json";
import { getSite } from "@/lib/site-live";

const pageMeta: Metadata = {
  title: "Careers at Homeasy — Help Make Indian Homes Smart",
  description:
    "Careers at Homeasy: join us in Patna, Bihar and help make traditional Indian homes smart. See how to apply and what we look for.",
};

export function generateMetadata() {
  return seoMetadata("/careers", pageMeta);
}

/** One open role in data/jobs.json. Leave the file as [] to show the empty state. */
type Job = { title: string; location: string; type: string; summary: string };

const jobs = jobsData as Job[];

const WHY = [
  { icon: Home, title: "Real impact", body: "Your work goes into real homes." },
  { icon: UserCheck, title: "Ownership", body: "Small team, big responsibility." },
  { icon: MapPin, title: "Built in Bihar", body: "Made here, for India." },
];

const FUTURE_ROLES = [
  "Embedded / firmware engineer",
  "Mobile app developer",
  "Backend developer",
  "Installation lead and electricians",
  "Sales (B2B and B2G)",
];

/** PRD §8.11 + §26.16 */
export default async function CareersPage() {
  const site = await getSite();
  const careersMail = `${site.mailHref}?subject=Careers%20at%20Homeasy`;
  return (
    <>
      <BreadcrumbJsonLd path="/careers" />
      <PageHero
        eyebrow="Careers at Homeasy"
        title="Help us make Indian homes smart."
        sub="We're a small, focused team in Patna building hardware, software and service that families can trust."
      >
        <a href={careersMail} className="btn btn-primary min-h-12 px-6">
          Email your profile
        </a>
      </PageHero>

      <Section>
        <SectionHeading title="Why Homeasy" />
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {WHY.map(({ icon: Icon, title, body }) => (
            <li key={title} className="min-w-0">
              <Card className="h-full">
                <Icon aria-hidden="true" className="size-6 text-link" strokeWidth={1.75} />
                <h3 className="mt-4 text-[1.1875rem] leading-snug">{title}</h3>
                <p className="mt-2 text-body">{body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="cloud">
        <SectionHeading title="Open roles" />
        {jobs.length === 0 ? (
          <Card className="mt-10 max-w-[720px]">
            <h3 className="text-h4">No open roles right now.</h3>
            <p className="mt-3 break-words text-body">
              Send your profile to{" "}
              <a href={careersMail} className="link">
                {site.contact.email}
              </a>{" "}
              — we read every one.
            </p>
            <a href={careersMail} className="btn btn-primary mt-6 min-h-12 px-6">
              Email your profile
            </a>
          </Card>
        ) : (
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <li key={job.title} className="min-w-0">
                <Card className="h-full">
                  <h3 className="text-h4">{job.title}</h3>
                  <p className="mt-1 text-[15px] text-slate">
                    {job.location} · {job.type}
                  </p>
                  <p className="mt-3 text-body">{job.summary}</p>
                  <a
                    href={`${site.mailHref}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                    className="link mt-4 inline-flex min-h-11 items-center"
                  >
                    Apply by email
                  </a>
                </Card>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 max-w-[720px]">
          <h3 className="text-h4">Roles we expect to need</h3>
          <p className="mt-3 text-body">These are not open yet. Write to us if one fits you.</p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-body">
            {FUTURE_ROLES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <SectionHeading title="How to apply" />
        <div className="mt-8 max-w-[720px] space-y-4 text-body">
          <p>
            Email your profile to{" "}
            <a href={careersMail} className="link">
              {site.contact.email}
            </a>{" "}
            with the role you are interested in and a few lines on work you have done. We are a small team, so tell us what you would like to own. You do not need to wait for a role to be listed here. Tell us about the hardware, software or installation work you have done, and link to anything you have built.
          </p>
          <p>
            <strong className="font-semibold text-ink">What we build:</strong> retrofit modules that fit inside existing switchboxes, the Homeasy app, and the
            survey-to-support service around them.
          </p>
          <p>
            <strong className="font-semibold text-ink">Jobs in Patna:</strong> Homeasy is based in Patna, Bihar. Smart home installation jobs are done in
            customers&apos; homes across our service area.
          </p>
        </div>
      </Section>

      <Related paths={["/about", "/solutions/electricians", "/contact"]} />

    </>
  );
}
