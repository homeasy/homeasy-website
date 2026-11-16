import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/meta";
import { Home, MapPin, UserCheck } from "lucide-react";
import { Card, PageHero, Section, SectionHeading } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import jobsData from "@/data/jobs.json";
import { getSite } from "@/lib/site-live";

const pageMeta: Metadata = {
  title: "Careers at Homeasy",
  description: "Join Homeasy and help make Indian homes smart.",
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
      <PageHero
        eyebrow="Careers"
        title="Help us make Indian homes smart."
        sub="We're a small, focused team in Patna building hardware, software and service that families can trust."
      />

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

      <CtaBand />
    </>
  );
}
