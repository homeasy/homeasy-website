import type { Metadata } from "next";
import { LegalDoc } from "@/components/company/LegalDoc";
import { seoMetadata } from "@/lib/seo/meta";

const pageMeta: Metadata = {
  title: "Cookie Policy — Homeasy Automation Pvt. Ltd.",
  description:
    "The Homeasy cookie policy: which cookies this website uses, why, for how long, and how you can refuse or remove them.",
};

export function generateMetadata() {
  return seoMetadata("/cookie-policy", pageMeta);
}

/** The text is edited in Admin → Policies & terms (built-in version: data/legal.json). */
export default function Page() {
  return <LegalDoc id="cookie-policy" />;
}
