"use client";

import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { GA_ID, getConsent, onConsentChange, track } from "@/lib/analytics";

/** Where on the page a click happened, in the words PRD §14.1 uses. */
function locationOf(el: Element): string {
  if (el.closest("header")) return "header";
  if (el.closest('nav[aria-label="Quick actions"]')) return "sticky";
  if (el.closest("footer")) return "footer";
  if (el.closest(".fixed")) return "float";
  return "page";
}
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40);

/**
 * Google Analytics 4, loaded only when NEXT_PUBLIC_GA_ID is set AND the visitor has accepted analytics
 * cookies (PRD §14, §15). Also sends the site-wide events of PRD §14.1 from one place: CTA, WhatsApp, call and
 * photo-check clicks, FAQ opens, scroll depth, package cards coming into view, and the guarantee and sample
 * report page views. Form-specific events are sent by the forms themselves. Renders nothing.
 */
export function Analytics() {
  const pathname = usePathname();
  const consent = useSyncExternalStore(onConsentChange, getConsent, () => null);
  const on = !!GA_ID && consent === "granted";

  // load gtag once consent is given
  useEffect(() => {
    if (!on || document.getElementById("ga4")) return;
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });
    const script = document.createElement("script");
    script.id = "ga4";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
  }, [on]);

  // page views on navigation, plus the two page-specific events
  useEffect(() => {
    if (!on) return;
    track("page_view", { page_path: pathname });
    if (pathname === "/guarantee") track("guarantee_view", { source: document.referrer ? new URL(document.referrer).pathname : "direct" });
    if (pathname === "/readiness-report") track("report_sample_view");
  }, [on, pathname]);

  useEffect(() => {
    if (!on) return;
    const page = pathname;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const link = target?.closest("a[href]") as HTMLAnchorElement | null;
      const summary = target?.closest("summary");
      if (summary) {
        const details = summary.parentElement as HTMLDetailsElement;
        if (!details.open) track("faq_expand", { question_id: slug(summary.textContent ?? ""), page });
        return;
      }
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const where = locationOf(link);
      if (href.includes("wa.me/")) {
        const photo = /photo/i.test(decodeURIComponent(href)) || /photo/i.test(link.textContent ?? "");
        track(photo ? "photo_check_click" : "whatsapp_click", { page, location: where });
      } else if (href.startsWith("tel:")) {
        track("call_click", { page, location: where });
      } else if (link.classList.contains("btn")) {
        track("cta_click", { cta_id: slug(link.textContent ?? href), page, section: link.closest("section")?.id || where });
      }
    };
    const depths = [25, 50, 75, 100];
    const seen = new Set<number>();
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const percent = max <= 0 ? 100 : Math.round((window.scrollY / max) * 100);
      for (const d of depths) {
        if (percent >= d && !seen.has(d)) {
          seen.add(d);
          track("scroll_depth", { percent: d, page });
        }
      }
    };
    // elements marked data-track-view="event:value" (e.g. pricing cards) report once when they come into view
    const viewed = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const [event, value] = ((entry.target as HTMLElement).dataset.trackView ?? "").split(":");
          if (event) track(event, { [event === "package_view" ? "package" : "value"]: value ?? "" });
          viewed.unobserve(entry.target);
        }
      },
      { threshold: 0.5 },
    );
    document.querySelectorAll("[data-track-view]").forEach((el) => viewed.observe(el));
    document.addEventListener("click", onClick, true);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("scroll", onScroll);
      viewed.disconnect();
    };
  }, [on, pathname]);

  return null;
}
