import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/catalog/ProductCard";
import { reveal } from "@/components/ui/reveal";
import { getPublicProducts } from "@/lib/store/products";
import {
  Truck,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Card, CtaBand, PageHero, Section, SectionHeading } from "@/components/ui";
import { IconTile } from "@/components/catalog";

export const metadata: Metadata = {
  title: "Homeasy Smart Modules for Indian Switchboxes",
  description:
    "Smart relay, fan controller, power module and IR remote — installed inside your existing switchbox.",
};


const INFO: { icon: LucideIcon; text: string }[] = [
  { icon: Wrench, text: "All Homeasy modules are installed by our trained electricians after a free survey." },
  { icon: ShieldCheck, text: "3-year warranty on every Homeasy module." },
  { icon: Truck, text: "Delivery across Bihar. We recommend a free survey first, to check your switchboxes." },
];

/** Product listing. Shows the PUBLISHED products (edited in /admin/products, live after Publish). */
export default async function ProductsPage() {
  const products = await getPublicProducts();
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Homeasy smart modules"
        sub="Designed to fit inside Indian switchboxes and make everyday appliances smart."
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
          title="The module line-up"
          sub="Every module is installed by our trained electricians after a free survey. We confirm the right ones for your home at the survey."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {products.map((p, i) => (
            <li key={p.id} id={p.slug} {...reveal(i)} className="min-w-0 scroll-mt-28">
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
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

      <CtaBand
        title="Not sure which modules you need?"
        body="That's what the free survey is for. We check your switchboxes and suggest the right modules."
      />
    </>
  );
}
