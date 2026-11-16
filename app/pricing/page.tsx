import type { Metadata } from "next";
import Link from "next/link";
import data from "@/data/packages.json";
import { Card, CtaBand, Faq, PageHero, Section, SectionHeading, StatusBadge, type Status } from "@/components/ui";
import { CheckList } from "@/components/catalog";
import { flags, usp, type UspId } from "@/lib/flags";

export const metadata: Metadata = {
  title: "Homeasy Packages — Smart Room to Full Smart Home",
  description: "Simple smart-home packages. Exact price confirmed after a free home survey.",
};

type Item = { text: string; usp?: string };
type AddOn = { name: string; price: number | null; status: string | null };

const NO_PRICE = "Price after free survey";

/** Honesty rule: no prices until final. With SHOW_PRICES=false every price cell reads the same. */
function priceLabel(price: number | null, priceType = "from"): string {
  if (!flags.SHOW_PRICES) return NO_PRICE;
  if (priceType === "custom") return "Custom quote";
  if (price === null) return NO_PRICE;
  return `From ₹${price.toLocaleString("en-IN")}`;
}

/** Drops items whose USP flag is off. */
function visible(items: Item[]): string[] {
  return items.filter((i) => !i.usp || usp(i.usp as UspId)).map((i) => i.text);
}

export default function PricingPage() {
  const fixedPrice = usp("U4");
  const addOns = data.addOns as AddOn[];

  const faq = [
    { q: "Is the survey free?", a: "Yes. The home survey is free anywhere in Bihar." },
    {
      q: "Any hidden charges?",
      a: fixedPrice
        ? "No. The quote includes modules, installation, app setup and GST. What we quote is what you pay."
        : "Your written quote lists the modules, installation and app setup before any work starts. You decide after you see it.",
    },
    { q: "Can I start with one room?", a: "Yes. You can start with one room and add more rooms later." },
    { q: "Is the app free?", a: "Yes, for every Homeasy customer." },
    {
      q: "How do I pay?",
      a: "Payment terms and accepted methods are confirmed with your written quote.",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Simple packages. Exact price after a free survey."
        sub={
          fixedPrice
            ? "One fixed price for modules, installation, app setup and GST. What we quote is what you pay."
            : "Pick a starting point. We confirm your exact price in writing after a free home survey."
        }
      >
        <Link href="/book-survey" className="btn btn-primary min-h-12 px-6">
          Book a free home survey
        </Link>
      </PageHero>

      <Section>
        <SectionHeading
          title="Packages"
          sub="Start with one room or do the whole home. Your exact price is confirmed after the free survey."
        />
        <ul className="mt-10 grid gap-4 sm:gap-6 lg:grid-cols-3">
          {data.packages.map((p) => (
            <li key={p.slug} className="min-w-0">
              <Card className="flex h-full flex-col">
                <h3 className="text-h4 leading-snug">{p.name}</h3>
                <p className="mt-1 text-body">{p.tagline}</p>
                <p className="mt-5 border-y border-line py-4 text-[1.1875rem] font-semibold text-ink">
                  {priceLabel(p.price, p.priceType)}
                </p>
                <CheckList items={visible(p.includes)} className="mt-5" />
                <div className="mt-auto pt-6">
                  <Link href="/book-survey" className="btn btn-outline min-h-12 w-full">
                    Book a free survey
                  </Link>
                </div>
              </Card>
            </li>
          ))}
        </ul>
        <Card className="mt-4 flex flex-col gap-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-[1.1875rem] leading-snug">Business and project pricing</h3>
            <p className="mt-1 text-[15px] text-body">
              For designers, builders, offices and institutions. Bulk and project pricing is shared on request.
            </p>
          </div>
          <Link href="/solutions" className="btn btn-outline min-h-12 shrink-0 whitespace-nowrap">
            See solutions
          </Link>
        </Card>
      </Section>

      <Section tone="cloud">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <SectionHeading title="Every package includes" />
            <CheckList items={visible(data.everyPackage)} className="mt-8" />
            <p className="mt-6 text-[15px] text-body">
              The Homeasy app is free for every Homeasy customer.{" "}
              <Link href="/app" className="link">
                About the app
              </Link>
            </p>
          </div>
          <div className="min-w-0">
            <SectionHeading title="Add-ons" />
            <ul className="mt-8 divide-y divide-line rounded-card border border-line bg-white">
              {addOns.map((a) => (
                <li key={a.name} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <span className="flex min-w-0 flex-wrap items-center gap-2 font-semibold">
                    {a.name}
                    {a.status && <StatusBadge status={a.status as Status} />}
                  </span>
                  <span className="text-[15px] text-body sm:shrink-0 sm:text-right">{priceLabel(a.price)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <SectionHeading
              title="Why a survey first?"
              sub={
                fixedPrice
                  ? "Every home's wiring is different. A survey means your quote is accurate, fair and fixed, with no extra charges on installation day."
                  : "Every home's wiring is different. A survey lets us check your switchboxes and give you an accurate, fair quote."
              }
            />
            <p className="mt-4 text-body">The survey is free across Bihar.</p>
            {fixedPrice && (
              <p className="mt-4 text-body">
                <Link href="/guarantee" className="link">
                  Read our fixed-price promise in full
                </Link>
              </p>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="sr-only">Pricing questions</h2>
            <Faq items={faq} />
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
