import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { Related } from "@/components/ui/Related";
import { flags } from "@/lib/flags";
import { seoMetadata } from "@/lib/seo/meta";
import Link from "next/link";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductExplorer } from "@/components/catalog/ProductExplorer";
import { SwitchboardPlay, type PlayItem } from "@/components/catalog/SwitchboardPlay";
import { getPublicProducts } from "@/lib/store/products";
import {
  Truck,
  ShieldCheck,
  Wrench,
  type LucideIcon,
  ClipboardCheck,
} from "lucide-react";
import { Card, PageHero, Section, SectionHeading } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { IconTile } from "@/components/catalog";

const pageMeta: Metadata = {
  title: "Homeasy Smart Switch Module Range for Indian Homes",
  description:
    "Every Homeasy smart switch module for lights, fans, geysers and ACs: smart relay, fan controller, power module and IR remote, inside your existing switchbox.",
};

export function generateMetadata() {
  return seoMetadata("/products", pageMeta);
}


const INFO: { icon: LucideIcon; text: string }[] = [
  { icon: Wrench, text: "All Homeasy modules are installed by our trained electricians after a free survey." },
  { icon: ShieldCheck, text: "3-year warranty on every Homeasy module." },
  { icon: ClipboardCheck, text: "Detailed specifications will be published once certification and testing are complete." },
  ...(flags.DELIVERY_ENABLED ? [{ icon: Truck, text: "Delivery across Bihar. We recommend a free survey first, to check your switchboxes." }] : []),
];

/** Product listing. Shows the PUBLISHED products (edited in /admin/products, live after Publish). */
export default async function ProductsPage() {
  const products = await getPublicProducts();
  // the hero's switchboard: which pictured module sits behind each switch (matched on what the module controls)
  const behind = (test: (controls: string) => boolean) => products.find((p) => p.image_url && test(p.controls.join(" | ")));
  const wanted: [PlayItem["key"], (c: string) => boolean][] = [
    ["light", (c) => /\blight/i.test(c)],
    ["fan", (c) => /\bfan/i.test(c)],
    ["geyser", (c) => /geyser/i.test(c)],
    ["ac", (c) => /\bac\b/i.test(c) && /\btv\b/i.test(c)],
  ];
  const play: PlayItem[] = wanted.flatMap(([key, test]) => {
    const p = behind(test);
    return p ? [{ key, slug: p.slug, name: p.name, image: p.image_url! }] : [];
  });
  return (
    <>
      <BreadcrumbJsonLd path="/products" />
      <PageHero
        eyebrow="Products"
        title="Homeasy smart modules"
        sub="Each Homeasy retrofit smart switch module is designed to fit inside Indian switchboxes, behind your existing switchboard, so you can control lights, fans, the geyser and the AC from your phone."
        aside={<SwitchboardPlay items={play} />}
      >
        <Link href="/book-survey" className="btn btn-primary min-h-12 px-6">
          Book a free home survey
        </Link>
        <Link href="/how-it-works" className="btn btn-outline min-h-12 px-6">
          See how it works
        </Link>
      </PageHero>

      <Section>
        <SectionHeading
          title="What do you want to control?"
          sub="Every module is installed by our trained electricians after a free survey. We confirm the right ones for your home at the survey."
        />
        <div className="mt-10">
          <ProductExplorer items={products.map((p) => ({ slug: p.slug, controls: p.controls, card: <ProductCard product={p} /> }))} />
        </div>
      </Section>

      <Section tone="cloud">
        <SectionHeading title="How Homeasy modules are sold" />
        <ul className="mt-10 grid gap-4 sm:gap-6 lg:grid-cols-3">
          {INFO.map((item) => (
            <li key={item.text} className="min-w-0">
              <Card className="flex h-full items-start gap-4">
                <IconTile icon={item.icon} />
                <p className="min-w-0 text-body">{item.text}</p>
              </Card>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-[720px] text-body">
          Not every switchbox suits every module. We check yours at the survey and tell you plainly what is possible.{" "}
          <Link href="/pricing" className="link">
            See packages
          </Link>
        </p>
      </Section>

      <Section tone="cloud">
        <div className="max-w-[760px]">
          <h2 className="text-h3 leading-[1.15]">Wi-Fi, Alexa and Google Home</h2>
          <h3 className="mt-8 text-h4">Is this a Wi-Fi smart switch?</h3>
          <p className="mt-2 text-body">
            App control needs Wi-Fi and internet at home. Your switches always work by hand, even when the Wi-Fi or internet is down.
          </p>
          <h3 className="mt-6 text-h4">Does it work with Alexa or Google Home?</h3>
          <p className="mt-2 text-body">
            Not yet. Voice control with Alexa and Google Assistant is planned, and we will announce it only when it is ready. See the{" "}
            <Link href="/roadmap" className="link">
              roadmap
            </Link>{" "}
            and the{" "}
            <Link href="/faq" className="link">
              FAQ
            </Link>
            .
          </p>
        </div>
      </Section>

      <Related paths={["/how-it-works", "/pricing", "/installation"]} />

      <CtaBand
        title="Not sure which modules you need?"
        body="That's what the free survey is for. We check your switchboxes and suggest the right modules."
      />
    </>
  );
}
