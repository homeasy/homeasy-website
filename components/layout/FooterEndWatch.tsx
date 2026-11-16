"use client";

import { useEffect, useRef } from "react";

/**
 * Sits in the footer's last line. While that line is on screen it sets <html data-footer-end>, and the floating
 * chat / WhatsApp button steps aside (app/globals.css) so it never covers the copyright line and the credit.
 */
export function FooterEndWatch() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => document.documentElement.toggleAttribute("data-footer-end", e.isIntersecting));
    io.observe(el);
    return () => {
      io.disconnect();
      document.documentElement.removeAttribute("data-footer-end");
    };
  }, []);
  return <span ref={ref} aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px" />;
}
