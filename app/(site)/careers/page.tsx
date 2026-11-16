import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { Related } from "@/components/ui/Related";
import { seoMetadata } from "@/lib/seo/meta";
import { Home, MapPin, UserCheck } from "lucide-react";
import { Card, PageHero, Section, SectionHeading } from "@/components/ui";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { getContent } from "@/lib/content/store";
import { getSite } from "@/lib/site-live";

const pageMeta: Metadata = {
  title: "Careers at Homeasy — Help Make Indian Homes Smart",
  description:
    "Careers at Homeasy: join us in Patna, Bihar and help make traditional Indian homes smart. See how to apply and what we look for.",
};

export function generateMetadata() {
  return seoMetadata("/careers", pageMeta);
}

const WHY = [
  { icon: Home, title: "Real impact", body: "Your work goes into real homes." },
  { icon: UserCheck, title: "Ownership", body: "Small team, big responsibility." },
  { icon: MapPin, title: "Built in Bihar", body: "Made here, for India." },
];

const FUTURE_ROLES = ["Embedded / firmware engineer", "Backend developer", "Installation lead and electricians"];

/** PRD §8.11 + §26.16 */
export default async function CareersPage() {
  const site = await getSite();
  // open roles come from Admin → Job postings (published copy); full-time roles first
  const jobs = [...(await getContent("jobs")).roles].sort((a, b) => Number(a.type === "Internship") - Number(b.type === "Internship"));
  const careersMail = `${site.mailHref}?subject=Careers%20at%20Homeasy`;
  return (
    <>
      <BreadcrumbJsonLd path="/careers" />
      <PageHero
        eyebrow="Careers at Homeasy"
        title="Help us make Indian homes smart."
        sub="We're a small, focused team in Patna building hardware, software and service that families can trust."
      >
        <a href="#apply" className="btn btn-primary min-h-12 px-6">
          Apply now
        </a>
        <a href={careersMail} className="btn btn-outline min-h-12 px-6">
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
        <SectionHeading title="Open roles" sub={jobs.length ? "Full-time roles and internships at our Patna office." : undefined} />
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
                <Card className="flex h-full flex-col">
                  <h3 className="text-h4">{job.title}</h3>
                  <p className="mt-1 text-[15px] text-slate">{[job.type, job.duration, job.location].filter(Boolean).join(" · ")}</p>
                  {job.pay && <p className="mt-2 font-semibold text-ink">{job.pay}</p>}
                  <p className="mb-5 mt-3 text-body">{job.summary}</p>
                  <a href="#apply" data-apply-role={job.title} className="btn btn-secondary mt-auto min-h-11 self-start px-5" aria-label={`Apply now for ${job.title}`}>
                    Apply now
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

      <Section tone="tint" id="apply" className="scroll-mt-20">
        <div className="max-w-[820px]">
          <SectionHeading title="Apply now" sub="All roles and internships are at our Patna office. Choose a role, add your details and attach your resume." />
          <div className="mt-8">
            <ApplicationForm roles={jobs.map((j) => j.title)} />
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading title="How to apply" />
        <div className="mt-8 max-w-[720px] space-y-4 text-body">
          <p>
            Use the form above, or email your profile to{" "}
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
            <strong className="font-semibold text-ink">Jobs in Patna:</strong> every role and internship is based at our Patna office. Smart home installation
            jobs are done in customers&apos; homes across our service area.
          </p>
        </div>
      </Section>

      <Related paths={["/about", "/solutions/electricians", "/contact"]} />

    </>
  );
}
