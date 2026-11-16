"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { cart } from "./cart-store";
import { QtyStepper } from "./QtyStepper";

/** Quantity + "Add to cart" + "Buy now" on a product page. */
export function AddToCart({ productId, name }: { productId: string; name: string }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const router = useRouter();
  return (
    <div>
      <div className="flex items-center gap-4">
        <QtyStepper value={qty} onChange={setQty} label={`Quantity of ${name}`} />
        <p aria-live="polite" className="text-[14px] text-body">
          {added && (
            <>
              Added.{" "}
              <Link href="/cart" className="link font-semibold">
                View cart
              </Link>
            </>
          )}
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className="btn btn-primary min-h-12 flex-1 whitespace-nowrap px-6"
          onClick={() => {
            cart.add(productId, qty);
            setAdded(true);
            window.setTimeout(() => setAdded(false), 4000);
          }}
        >
          {added ? <Check size={18} aria-hidden="true" /> : <ShoppingCart size={18} aria-hidden="true" />}
          {added ? "Added to cart" : "Add to cart"}
        </button>
        <button
          type="button"
          className="btn btn-secondary min-h-12 flex-1 whitespace-nowrap px-6"
          onClick={() => {
            cart.add(productId, qty);
            router.push("/cart");
          }}
        >
          Buy now
        </button>
      </div>
    </div>
  );
}
