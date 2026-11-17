import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Product } from "@/lib/store/products";

/**
 * Right-hand side of the products hero on wide screens: up to four module pictures in two staggered columns,
 * each a link to its product. Flat tiles, a slow drift up and down, nothing else.
 */
export function ProductHeroArt({ products }: { products: Pick<Product, "slug" | "name" | "image_url" | "headline">[] }) {
  if (products.length < 2) return null;
  const tile = (p: (typeof products)[number], i: number) => (
    <li key={p.slug} className="hero-float min-w-0" style={{ "--i": i } as CSSProperties}>
      <Link href={`/products/${p.slug}`} className="group relative block overflow-hidden rounded-card border border-line bg-white no-underline transition-colors hover:border-navy">
        <span className="relative block aspect-square">
          <Image src={p.image_url!} alt={p.name} fill unoptimized priority={i < 2} sizes="230px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        </span>
        <span className="block px-3.5 py-2.5 text-[13px] font-semibold leading-snug text-ink">{p.name.replace(/^Homeasy\s+/, "")}</span>
      </Link>
    </li>
  );
  // two columns, the right one set lower, so the four tiles sit like bricks instead of a plain grid
  return (
    <div className="mx-auto flex max-w-[460px] gap-4 xl:gap-5">
      <ul className="flex min-w-0 flex-1 flex-col gap-4 xl:gap-5">{products.filter((_, i) => i % 2 === 0).map((p, i) => tile(p, i * 2))}</ul>
      <ul className="flex min-w-0 flex-1 flex-col gap-4 pt-12 xl:gap-5">{products.filter((_, i) => i % 2 === 1).map((p, i) => tile(p, i * 2 + 1))}</ul>
    </div>
  );
}
