import type { Metadata } from "next";
import { LegalDoc } from "@/components/company/LegalDoc";
import { seoMetadata } from "@/lib/seo/meta";

const pageMeta: Metadata = {
  title: "Delivery Policy — Homeasy Automation Pvt. Ltd.",
  description:
    "The Homeasy delivery policy: where we deliver in Bihar, how delivery is arranged after you order, and what it costs.",
};

export function generateMetadata() {
  return seoMetadata("/delivery-policy", pageMeta);
}

/** The text is edited in Admin → Policies & terms (built-in version: data/legal.json). */
export default function Page() {
  return <LegalDoc id="delivery-policy" />;
}
