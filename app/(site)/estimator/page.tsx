import type { Metadata } from "next";
import Link from "next/link";
import { Card, PageHero, Section, SectionHeading } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { Related } from "@/components/ui/Related";
import { Estimator } from "@/components/estimator/Estimator";
import type { EstimatorData, EstimatorProduct } from "@/components/estimator/types";
import estimatorJson from "@/data/estimator.json";
import productsJson from "@/data/products.json";
import { flags } from "@/lib/flags";
import { seoMetadata } from "@/lib/seo/meta";
import { getSite } from "@/lib/site-live";

const pageMeta: Metadata = {
  title: "Smart Home Cost Estimator, Room by Room — Homeasy",
  description:
    "Use the Homeasy smart home cost estimator: pick your rooms and appliances and see which modules you need. Exact price confirmed after a free survey.",
};

export function generateMetadata() {
  return seoMetadata("/estimator", pageMeta);
}

const data = estimatorJson as unknown as EstimatorData;

/** Only modules the estimator maps to, with names taken from the product list (never retyped). */
const products: EstimatorProduct[] = productsJson.products
  .filter((p) => data.modules.some((m) => m.slug === p.slug))
  .map((p) => ({ slug: p.slug, name: p.name, headline: p.headline, status: p.status }));

const GOOD_TO_KNOW = [
  {
    title: "It is an indicative list",
    body: "Every switchbox is different. We look inside yours at the free survey and confirm which modules fit.",
  },
  {
    title: "Your switches stay",
    body: "Homeasy modules go inside the existing switchbox, behind the switches you already have.",
  },
  {
    title: "Start with one room",
    body: "You can make one room smart first and add more rooms later.",
  },
];

export default async function EstimatorPage() {
  const site = await getSite();
  const showPrices = flags.SHOW_PRICES;

  return (
    <>
      <PageHero
        eyebrow="Estimator"
        title="Estimate your smart home"
        sub={
          showPrices
            ? "A room-by-room smart home cost estimator: a simple home automation cost calculator. Tell us about your rooms and what you want to control. We suggest the Homeasy modules and show starting prices; your exact price is confirmed after a free survey."
            : "A room-by-room smart home cost estimator: a simple home automation cost calculator. Tell us about your rooms and what you want to control, and see which Homeasy modules that needs. We confirm your exact price after a free survey."
        }
      />

      <Section>
        <Estimator
          data={data}
          products={products}
          showPrices={showPrices}
          whatsappHref={site.whatsappHref("general")}
        />
      </Section>

      <Section tone="cloud">
        <SectionHeading
          title="Good to know"
          sub="The estimator gives you a starting point. The free survey gives you the final list and your written quote."
        />
        <ul className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-3">
          {GOOD_TO_KNOW.map((g) => (
            <li key={g.title} className="min-w-0">
              <Card className="h-full">
                <h3 className="text-[1.1875rem] leading-snug">{g.title}</h3>
                <p className="mt-2 text-[15px] text-body">{g.body}</p>
              </Card>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[15px] text-body">
          Want to know what each module does?{" "}
          <Link href="/products" className="link">
            See the Homeasy modules
          </Link>
        </p>
      </Section>

      <Related paths={["/pricing", "/products", "/how-it-works"]} />

      <CtaBand />
    </>
  );
}
