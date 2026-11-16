import { SurveyForm } from "@/components/forms/SurveyForm";
import type { Metadata } from "next";
import { Related } from "@/components/ui/Related";
import { seoMetadata } from "@/lib/seo/meta";
import { Check, Phone } from "lucide-react";
import { Card, PageHero, Section, SectionHeading, Steps } from "@/components/ui";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { getSite } from "@/lib/site-live";

const pageMeta: Metadata = {
  title: "Book a Free Home Survey — Homeasy",
  description:
    "Book a free home survey with Homeasy anywhere in Bihar. We check your switchboxes and wiring and give you a fixed quote. No obligation.",
};

export function generateMetadata() {
  return seoMetadata("/book-survey", pageMeta);
}

/*
 * INTERIM PAGE. This is replaced later by the survey booking form and global modal
 * (PRD §8.14, §10.1, §26.17) once Supabase storage is in place. Until then, bookings
 * go through WhatsApp or a phone call.
 */

const BOOKING_MESSAGE =
  "Hi Homeasy, I'd like to book a free home survey. My name: ___ My area/pincode: ___ Rooms I want to make smart: ___";

const SURVEY_STEPS = [
  { title: "We visit your home", body: "A Homeasy technician comes at a time that suits you." },
  { title: "We check switchboxes and wiring", body: "We look inside the switchboxes in the rooms you choose." },
  { title: "We suggest the best setup", body: "You see what can be made smart, room by room." },
  { title: "You get a fixed quote", body: "It comes with your Readiness Report. You decide in your own time." },
];

const GOOD_TO_KNOW = [
  "The survey is free across Bihar.",
  "There is no obligation to buy.",
  "If your wiring needs a small fix, we tell you before you pay.",
];

export default async function BookSurveyPage() {
  const site = await getSite();
  const bookOnWhatsAppHref = `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(BOOKING_MESSAGE)}`;
  return (
    <>
      <PageHero
        eyebrow="Free home survey"
        title="Book your free home survey"
        sub="We'll visit, check your switchboxes and wiring, and give you a clear quote. No obligation. It is the first step to home automation and smart home installation in your home."
      />

      <Section>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <SurveyForm whatsappHref={bookOnWhatsAppHref} telHref={site.telHref} leadResponse={site.contact.leadResponse} />
          <div className="grid min-w-0 gap-4">
            <Card className="min-w-0">
              <h2 className="text-h4">Good to know</h2>
              <ul className="mt-3 space-y-3 text-body">
                {GOOD_TO_KNOW.map((line) => (
                  <li key={line} className="flex gap-3">
                    <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-link" strokeWidth={2} />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="min-w-0">
              <h2 className="text-h4">Prefer to talk?</h2>
              <p className="mt-3 break-words text-body">
                {site.contact.phoneDisplay} · {site.contact.hours}
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <a href={bookOnWhatsAppHref} target="_blank" rel="noopener noreferrer" className="btn btn-secondary min-h-12 px-6">
                  <WhatsAppIcon size={18} /> Book on WhatsApp
                </a>
                <a href={site.telHref} className="btn btn-outline min-h-12 px-6">
                  <Phone aria-hidden="true" className="size-[18px]" strokeWidth={2} /> Call us
                </a>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      <Section tone="cloud">
        <SectionHeading title="What happens at the survey" />
        <div className="mt-10">
          <Steps items={SURVEY_STEPS} />
        </div>
      </Section>
      <Related paths={["/how-it-works", "/pricing", "/faq"]} />
    </>
  );
}
