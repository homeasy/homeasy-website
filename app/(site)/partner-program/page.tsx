import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Handshake, Home, PencilRuler, ShieldCheck, Users, Video, Wallet, Wrench, type LucideIcon } from "lucide-react";
import { IconTile } from "@/components/catalog";
import { EnquiryFormBase } from "@/components/forms/EnquiryFormBase";
import { Card, Faq, PageHero, Section, SectionHeading, Steps } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { CtaBand } from "@/components/ui/CtaBand";
import { Related } from "@/components/ui/Related";
import { reveal } from "@/components/ui/reveal";
import { seoMetadata } from "@/lib/seo/meta";
import { site } from "@/lib/site";

const pageMeta: Metadata = {
  title: "Homeasy Partner Program: Refer a Home in Bihar",
  description:
    "Join the Homeasy partner program: refer homes that want to go smart, we do the survey and installation, and your reward terms are confirmed in writing.",
};

export function generateMetadata() {
  return seoMetadata("/partner-program", pageMeta);
}

const WHY: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Wallet, title: "A reward for every home installed", body: "When a home you referred gets Homeasy installed, you earn a referral reward. The amount and the terms are given to you in writing when you join." },
  { icon: Handshake, title: "No fee to join", body: "There is nothing to buy and nothing to stock. You introduce the home; that is your part." },
  { icon: ShieldCheck, title: "We do the work", body: "Our team does the free survey, the written quote, the installation and the support afterwards. Your name stays good with the family you referred." },
];

const WHO: { icon: LucideIcon; title: string; body: string; href?: string }[] = [
  { icon: Wrench, title: "Electricians", body: "You are already in the home. Tell the family about retrofit and let us take it from there.", href: "/solutions/electricians" },
  { icon: PencilRuler, title: "Interior designers and architects", body: "Offer smart control without changing the switchboards your client chose.", href: "/solutions/designers" },
  { icon: Building2, title: "Builders and property consultants", body: "Give buyers and tenants one more reason to choose a flat.", href: "/solutions/builders" },
  { icon: Home, title: "Homeowners", body: "Happy with the idea? Refer a neighbour, a relative or a friend." },
  { icon: Video, title: "Content creators and influencers", body: "If your audience is in Bihar, show them how an existing home becomes smart, and refer the families who ask." },
  { icon: Users, title: "Anyone with a network", body: "Shop owners, society members, students: if you know homes in Bihar, you can refer them." },
];

const STEPS = [
  { title: "Register", body: "Fill the short form. We call you, explain the programme and send the reward terms in writing." },
  { title: "Refer a home", body: "Share the homeowner's name and number with their permission, or book a free survey for them." },
  { title: "We survey and install", body: "We check the switchboxes, give a written quote and install. You can follow the status with us." },
  { title: "You are rewarded", body: "When the installation is complete, you receive your reward as set out in your written terms." },
];

const FAQ = [
  { q: "How much is the referral reward?", a: "We do not publish a figure on the website. The amount and how it is paid are given to you in writing when you join, before you refer anyone." },
  { q: "Is there a fee to join?", a: "No. There is no joining fee and nothing to buy." },
  { q: "Do I have to sell or install anything?", a: "No. You introduce the home. Homeasy does the survey, the quote, the installation and the support." },
  { q: "Which areas can I refer homes from?", a: `We survey homes across ${site.serviceAreaLabel}. Our office and pilot are in Patna.` },
  { q: "When can I start?", a: `You can register now. We are inviting pilot homes in Patna, and our public launch is planned for ${site.launch.label}.` },
  { q: "Do I need the homeowner's permission?", a: "Yes. Please share someone's name and number only after they agree to be contacted by Homeasy." },
];

/** The referral partner programme (founder, 17 Nov 2026). No reward figures: they are confirmed in writing to each partner. */
export default function PartnerProgramPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/partner-program" />
      <PageHero
        eyebrow="Partner program"
        title="Refer a home. We make it smart."
        sub="The Homeasy partner program is for anyone who knows a home that wants to go smart. You introduce the family, our team does the survey and the installation, and you are rewarded for every home that is installed."
        aside={
          <div id="join" className="mx-auto w-full max-w-[460px] scroll-mt-28 rounded-section border border-line bg-white p-5 sm:p-6">
            <h2 className="text-h4">Become a partner</h2>
            <p className="mb-5 mt-1 text-[15px] text-body">It takes a minute. We call you during working hours.</p>
            <EnquiryFormBase
              kind="partner"
              page="/partner-program"
              show={{ email: true, city: true }}
              required={["city"]}
              cityLabel="Your city or district"
              extraFields={[
                {
                  name: "partner_type",
                  label: "I am",
                  type: "select",
                  options: ["An electrician", "An interior designer or architect", "A builder or property consultant", "A content creator or influencer", "A homeowner", "Something else"],
                  required: true,
                },
              ]}
              submitLabel="Join the partner program"
              successTitle="Thank you. You are registered."
              successText="Our team will call or WhatsApp you during working hours to explain the programme and share the terms in writing."
            />
          </div>
        }
      >
        <a href="#join" className="btn btn-primary min-h-12 px-6 lg:hidden">
          Become a partner
        </a>
        <a href="#how" className="btn btn-outline min-h-12 px-6">
          See how it works
        </a>
      </PageHero>

      <Section>
        <SectionHeading title="Why partner with Homeasy" />
        <ul className="mt-10 grid gap-4 sm:gap-6 lg:grid-cols-3">
          {WHY.map((w, i) => (
            <li key={w.title} {...reveal(i)} className="min-w-0">
              <Card className="h-full">
                <IconTile icon={w.icon} />
                <h3 className="mt-4 text-[1.1875rem] leading-snug">{w.title}</h3>
                <p className="mt-2 text-[15px] text-body">{w.body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="navy" id="how" className="scroll-mt-20">
        <SectionHeading title="How you earn" sub="Four steps, and only the first two are yours." onDark />
        <div className="mt-10">
          <Steps items={STEPS} onDark />
        </div>
      </Section>

      <Section>
        <SectionHeading title="Who can join" sub="You do not need to be in the electrical trade. You need to know homes." />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {WHO.map((w, i) => (
            <li key={w.title} {...reveal(i)} className="min-w-0">
              <Card className="flex h-full flex-col">
                <IconTile icon={w.icon} />
                <h3 className="mt-4 text-[1.1875rem] leading-snug">{w.title}</h3>
                <p className="mt-2 text-[15px] text-body">{w.body}</p>
                {w.href && (
                  <Link href={w.href} className="link mt-auto inline-flex min-h-11 items-center pt-3 text-[15px] font-semibold">
                    More for you
                  </Link>
                )}
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="cloud">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div className="min-w-0">
            <SectionHeading title="What you are referring" sub="Homeasy makes an existing home smart without changing its switches." />
            <ul className="mt-6 space-y-2 text-body">
              <li>Compact modules fitted inside the existing switchbox, behind the switches the family already has.</li>
              <li>Lights, fans with speed, the geyser, the AC and the TV, controlled from one app.</li>
              <li>The switches keep working by hand, even when the internet is down.</li>
              <li>A free home survey first, then a written quote, then installation by our trained electricians.</li>
              <li>A 3-year warranty on Homeasy modules.</li>
            </ul>
            <Link href="/how-it-works" className="link mt-5 inline-flex min-h-11 items-center font-semibold">
              See how it works
            </Link>
          </div>
          <div className="min-w-0">
            <h2 className="text-h4">Questions partners ask</h2>
            <div className="mt-4">
              <Faq items={FAQ} />
            </div>
          </div>
        </div>
      </Section>

      <Related paths={["/solutions", "/how-it-works", "/early-access"]} />
      <CtaBand title="Know a home that wants to go smart?" body="Register as a partner above, or book a free home survey for the family straight away." />
    </>
  );
}
