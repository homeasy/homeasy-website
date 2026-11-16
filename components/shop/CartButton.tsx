"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./cart-store";

/** Header cart icon with the number of items. */
export function CartButton() {
  const count = useCart().reduce((n, l) => n + l.qty, 0);
  return (
    <Link
      href="/cart"
      aria-label={count ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart"}
      // on phones the icon appears only once something is in the cart, to keep the header within 360 px
      className={`relative size-11 items-center justify-center rounded-button text-ink hover:bg-cloud ${count ? "inline-flex" : "hidden lg:inline-flex"}`}
    >
      <ShoppingCart size={22} aria-hidden="true" />
      {count > 0 && (
        <span className="absolute right-0.5 top-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-amber px-1 text-[11px] font-bold leading-5 text-navy">
          {count}
        </span>
      )}
    </Link>
  );
}

/** Wraps the header's "Book survey" button: on phones it gives way to the cart icon (the bottom bar still has Book survey). */
export function HideOnPhoneWhenCartHasItems({ children }: { children: React.ReactNode }) {
  const has = useCart().length > 0;
  return <span className={has ? "hidden lg:contents" : "contents"}>{children}</span>;
}
