import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/ui";
import type { Product } from "@/lib/store/products";
import { PRODUCT_ICON_MAP } from "./product-icons";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Photo, or a tinted icon panel when the product has no photo yet. */
export function ProductVisual({ product, className = "", sizes }: { product: Pick<Product, "image_url" | "icon" | "name">; className?: string; sizes?: string }) {
  const Icon = PRODUCT_ICON_MAP[product.icon] ?? PRODUCT_ICON_MAP.relay;
  return (
    <div className={`relative overflow-hidden bg-tint ${className}`}>
      {product.image_url ? (
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          unoptimized
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : null}
      {product.image_url ? null : (
        <span className="absolute inset-0 flex items-center justify-center text-blue-800">
          <Icon aria-hidden="true" className="size-[28%] max-h-24 max-w-24" strokeWidth={1.25} />
        </span>
      )}
    </div>
  );
}

export function PriceLine({ product, large = false }: { product: Pick<Product, "price" | "mrp">; large?: boolean }) {
  if (!product.price) return <p className={large ? "text-h4 font-semibold" : "text-[15px] font-semibold"}>Price after free survey</p>;
  const off = product.mrp ? Math.round((1 - product.price / product.mrp) * 100) : 0;
  return (
    <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
      <span className={large ? "text-h3 font-bold leading-none" : "text-[17px] font-bold"}>{inr(product.price)}</span>
      {product.mrp && <s className={`text-slate ${large ? "text-[17px]" : "text-[14px]"}`}>{inr(product.mrp)}</s>}
      {off > 0 && <span className="rounded-full bg-amber px-2 py-0.5 text-[12px] font-bold text-navy">{off}% off</span>}
    </p>
  );
}

/** Product card for listings. The whole card is one link to the product page. */
export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="fx-card group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white text-ink no-underline"
    >
      <div className="relative">
        <ProductVisual product={product} className="aspect-[4/3]" sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.featured && <span className="rounded-full bg-navy px-2.5 py-1 text-[12px] font-semibold text-white">Featured</span>}
          {product.status !== "available" && <StatusBadge status={product.status} />}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        {product.headline && <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-slate">{product.headline}</p>}
        <h3 className="mt-1 text-[1.25rem] leading-snug">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-[15px] text-body">{product.line}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <PriceLine product={product} />
          <span className="inline-flex items-center gap-1 text-[14px] font-semibold text-link">
            View <ArrowRight size={15} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
