"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Fades [data-reveal] elements in as they scroll into view (PRD §6.7: fade + 16 px rise).
 * Adds `reveal-on` to <html> only when JavaScript runs and motion is allowed, so content is never
 * hidden otherwise. Re-scans on every route change.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));
    // anything already on screen is shown straight away, before the hidden state can paint
    const vh = window.innerHeight;
    const pending = els.filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) {
        el.classList.add("is-visible");
        return false;
      }
      return true;
    });
    document.documentElement.classList.add("reveal-on");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      // the huge top margin counts everything above the viewport as "seen", so jumping down the page
      // (anchor links, restored scroll) never leaves hidden content behind
      { rootMargin: "100000px 0px -8% 0px" },
    );
    pending.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
