import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Camera, Check, ChevronRight, ClipboardCheck, ShieldCheck, Truck, Wrench } from "lucide-react";
import { PriceLine, ProductCard, ProductVisual } from "@/components/catalog/ProductCard";
import { flags } from "@/lib/flags";
import { AddToCart } from "@/components/shop/AddToCart";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { Faq, Section, SectionHeading, StatusBadge } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { getSite } from "@/lib/site-live";
import { getPublicProduct, getPublicProducts } from "@/lib/store/products";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return (await getPublicProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await getPublicProduct((await params).slug);
  if (!p) return { title: "Product not found — Homeasy" };
  return {
    title: `${p.name} — Homeasy`,
    description: p.line || `${p.name}: a Homeasy smart module for Indian homes.`,
    openGraph: p.image_url ? { images: [p.image_url] } : undefined,
  };
}

async function ProductDetail({ params }: { params: Params }) {
  const site = await getSite();
  const { slug } = await params;
  const p = await getPublicProduct(slug);
  if (!p) notFound();
  const all = await getPublicProducts();
  const related = all.filter((x) => x.id !== p.id).sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 3);
  const buyable = flags.SHOW_CART && (!!p.price && p.status === "available");
  const paragraphs = p.description.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);
  const points = p.highlights.length ? p.highlights : p.controls.map((c) => `Controls: ${c}`);

  const sections: { q: string; a: React.ReactNode }[] = [
    ...(paragraphs.length
      ? [{ q: "About this module", a: <div className="space-y-3">{paragraphs.map((t) => <p key={t.slice(0, 40)}>{t}</p>)}</div> }]
      : []),
    {
      q: "Installation",
      a: "Homeasy modules go inside your existing switchbox, behind your switches. We recommend installation by our trained electricians, after a free survey that checks your switchboxes and wiring.",
    },
    { q: "Warranty and support", a: "Every Homeasy module carries a 3-year warranty against manufacturing defects. You can reach our team on WhatsApp and phone." },
    ...(flags.DELIVERY_ENABLED ? [{ q: "Delivery", a: "We deliver across Bihar. We confirm the delivery date with you after your order." }] : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.line,
    brand: { "@type": "Brand", name: site.brand },
    ...(p.image_url ? { image: p.image_url } : {}),
    ...(p.price && p.status === "available"
      ? { offers: { "@type": "Offer", priceCurrency: "INR", price: p.price, availability: "https://schema.org/InStock", url: `${site.url}/products/${p.slug}` } }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Section className="!py-8 lg:!py-12">
        <nav aria-label="Breadcrumb" className="text-[14px] text-slate">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/products" className="link">
                Products
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={14} />
            </li>
            <li aria-current="page" className="text-body">
              {p.name}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-14">
          {/* gallery: sticky on desktop so the details scroll past it */}
          <div className="min-w-0">
            <div className="relative lg:sticky lg:top-24">
              <ProductVisual product={p} className="aspect-[4/3.6] rounded-section border border-line" sizes="(min-width: 1024px) 620px, 100vw" />
              {p.featured && <span className="absolute left-4 top-4 rounded-full bg-navy px-3 py-1 text-[13px] font-semibold text-white">Bestseller</span>}
            </div>
          </div>

          <div className="min-w-0">
            {p.headline && <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-slate">{p.headline}</p>}
            <h1 className="mt-2 text-h2 leading-[1.1]">{p.name}</h1>
            {p.status !== "available" && (
              <div className="mt-3">
                <StatusBadge status={p.status} />
              </div>
            )}
            <div className="mt-5">
              <PriceLine product={p} large />
              {p.price && <p className="mt-1 text-[14px] text-slate">Per module. GST and delivery are shown in your cart.</p>}
            </div>
            {p.line && <p className="mt-5 text-lg text-body">{p.line}</p>}

            {points.length > 0 && (
              <ul className="mt-5 space-y-2.5">
                {points.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-body">
                    <Check size={18} aria-hidden="true" className="mt-1 shrink-0 text-success" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* buyable = has a price and is marked Available; otherwise the page asks for a survey */}
            <div className="mt-7">
              {buyable ? (
                <AddToCart productId={p.id} name={p.name} />
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/book-survey" className="btn btn-primary min-h-12 flex-1 whitespace-nowrap px-6">
                    Book a free home survey
                  </Link>
                  <a href={site.whatsappHref("general")} target="_blank" rel="noopener noreferrer" className="btn btn-outline min-h-12 flex-1 whitespace-nowrap px-6">
                    <WhatsAppIcon size={18} /> Ask on WhatsApp
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-card bg-tint p-4 text-[15px] text-ink">
              <Camera size={20} aria-hidden="true" className="mt-0.5 shrink-0" />
              <p>
                Not sure it fits your switchboard?{" "}
                <a href={site.whatsappHref("photo")} target="_blank" rel="noopener noreferrer" className="link font-semibold">
                  Send us a photo on WhatsApp
                </a>{" "}
                and we will tell you.
              </p>
            </div>

            <div className="mt-6">
              <Faq items={sections} />
            </div>

            <ul className="mt-6 grid grid-cols-3 gap-3 text-center text-[13px] text-body">
              {[
                { icon: ShieldCheck, t: "3-year warranty" },
                { icon: Wrench, t: "Installation available" },
                ...(flags.DELIVERY_ENABLED ? [{ icon: Truck, t: "Delivery across Bihar" }] : []),
              ].map(({ icon: Icon, t }) => (
                <li key={t} className="rounded-card border border-line p-3">
                  <Icon size={20} aria-hidden="true" className="mx-auto text-link" />
                  <span className="mt-1.5 block">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="cloud">
          <SectionHeading title="You may also like" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {related.map((r) => (
              <li key={r.id} className="min-w-0">
                <ProductCard product={r} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section>
        <div className="flex flex-col items-start gap-4 rounded-section border border-line p-6 sm:flex-row sm:items-center sm:justify-between lg:p-8">
          <div className="flex items-start gap-4">
            <ClipboardCheck size={28} aria-hidden="true" className="mt-1 shrink-0 text-link" />
            <div>
              <h2 className="text-h4">Not sure which modules your home needs?</h2>
              <p className="mt-1 text-body">That is what the free survey is for. We check every switchbox and tell you plainly.</p>
            </div>
          </div>
          <Link href="/book-survey" className="btn btn-secondary min-h-12 shrink-0 px-6">
            Book a free survey
          </Link>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}

export default function ProductPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="container-page py-24 text-body">Loading…</div>}>
      <ProductDetail params={params} />
    </Suspense>
  );
}
