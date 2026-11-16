import type { Metadata } from "next";
import Link from "next/link";
import faq from "@/data/faq.json";
import { flags, usp, type UspId } from "@/lib/flags";
import { site, whatsappHref } from "@/lib/site";
import { CtaBand, Faq, PageHero, Section, StatusBadge, type Status } from "@/components/ui";
import { WhatsAppIcon } from "@/components/icons/brand-icons";

export const metadata: Metadata = {
  title: "Homeasy FAQ — Smart Retrofit Questions Answered",
  description: "Switches, wiring, installation, app, pricing and support.",
};

type Part = { text: string; whenOn?: string; whenOff?: string };
type Item = {
  q: string;
  parts: Part[];
  link?: { href: string; label: string };
  status?: string;
  statusWhenOff?: { flag: string; status: string };
};

function isOn(flag: string): boolean {
  if (/^U\d+$/.test(flag)) return usp(flag as UspId);
  return flag in flags ? flags[flag as keyof typeof flags] : false;
}

const TOKENS: Record<string, string> = {
  phone: site.contact.phoneDisplay,
  hours: site.contact.hours,
  legalName: site.legalName,
  foundedYear: String(site.foundedYear),
  founderName: site.founder.name,
  founderRole: site.founder.role,
};

/** Joins the parts that pass their flag checks and fills {tokens} from site.json. */
function answerText(item: Item): string {
  return item.parts
    .filter((p) => (!p.whenOn || isOn(p.whenOn)) && (!p.whenOff || !isOn(p.whenOff)))
    .map((p) => p.text)
    .join(" ")
    .replace(/\{(\w+)\}/g, (match, key: string) => TOKENS[key] ?? match);
}

function statusOf(item: Item): Status | undefined {
  if (item.status) return item.status as Status;
  if (item.statusWhenOff && !isOn(item.statusWhenOff.flag)) return item.statusWhenOff.status as Status;
  return undefined;
}

/** PRD §8.13, wireframe §25.10 */
export default function FaqPage() {
  const groups = faq.groups.map((group) => ({
    ...group,
    items: (group.items as Item[]).map((item) => ({ item, text: answerText(item), status: statusOf(item) })),
  }));

  // FAQPage structured data (PRD §13.4), built from the same resolved answers shown on the page.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((g) =>
      g.items.map(({ item, text }) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text },
      })),
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <PageHero
        eyebrow="FAQ"
        title="Questions, answered simply"
        sub="Switches, wiring, installation, app, pricing and support."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="FAQ categories" className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-0">
              {groups.map((g) => (
                <li key={g.id}>
                  <a
                    href={`#${g.id}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-[15px] font-semibold text-ink hover:bg-cloud lg:rounded-none lg:border-0 lg:px-0"
                  >
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 space-y-12">
            {groups.map((g) => (
              <section key={g.id} id={g.id} aria-labelledby={`${g.id}-heading`} className="scroll-mt-28">
                <h2 id={`${g.id}-heading`} className="text-h3 leading-[1.15]">
                  {g.title}
                </h2>
                <div className="mt-5">
                  <Faq
                    items={g.items.map(({ item, text, status }) => ({
                      q: item.q,
                      a: (
                        <>
                          <p>{text}</p>
                          {(status || item.link) && (
                            <p className="mt-3 flex flex-wrap items-center gap-3">
                              {status && <StatusBadge status={status} />}
                              {item.link && (
                                <Link href={item.link.href} className="link">
                                  {item.link.label}
                                </Link>
                              )}
                            </p>
                          )}
                        </>
                      ),
                    }))}
                  />
                </div>
              </section>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="cloud">
        <div className="max-w-[720px]">
          <h2 className="text-h3 leading-[1.15]">Still have a question?</h2>
          <p className="mt-4 text-lg text-body">
            Ask us on WhatsApp. We reply during working hours, {site.contact.hours}.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappHref("general")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary min-h-12 px-6"
            >
              <WhatsAppIcon size={18} /> WhatsApp us
            </a>
            <Link href="/contact" className="btn btn-outline min-h-12 px-6">
              Contact us
            </Link>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
