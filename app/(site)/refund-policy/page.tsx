import type { Metadata } from "next";
import { LegalDoc } from "@/components/company/LegalDoc";
import { seoMetadata } from "@/lib/seo/meta";

const pageMeta: Metadata = {
  title: "Refund and Cancellation Policy — Homeasy",
  description:
    "The Homeasy refund policy: how to cancel an order, when a refund applies, and how and when refunds are paid back to you.",
};

export function generateMetadata() {
  return seoMetadata("/refund-policy", pageMeta);
}

/** The text is edited in Admin → Policies & terms (built-in version: data/legal.json). */
export default function Page() {
  return <LegalDoc id="refund-policy" />;
}
