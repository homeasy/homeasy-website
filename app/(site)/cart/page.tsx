import type { Metadata } from "next";
import { CartView } from "@/components/shop/CartView";
import { PageHero, Section } from "@/components/ui";
import { whatsappHref } from "@/lib/site";
import { getPublicProducts } from "@/lib/store/products";
import { razorpayConfigured } from "@/lib/store/razorpay";
import { getPublicSettings } from "@/lib/store/settings";

export const metadata: Metadata = { title: "Your cart — Homeasy", robots: { index: false } };

/** Cart and checkout. Only products with a price and "Available" status can be bought. */
export default async function CartPage() {
  const [products, settings] = await Promise.all([getPublicProducts(), getPublicSettings()]);
  const buyable = products
    .filter((p) => p.price && p.status === "available")
    .map((p) => ({ id: p.id, slug: p.slug, name: p.name, price: p.price as number, image_url: p.image_url, icon: p.icon }));
  return (
    <>
      <PageHero eyebrow="Checkout" title="Your cart" sub="Review your modules, tell us where to deliver, and pay securely." />
      <Section className="!pt-10">
        <CartView products={buyable} settings={settings} whatsappHref={whatsappHref("general")} online={razorpayConfigured()} />
      </Section>
    </>
  );
}
