import type { Metadata } from "next";
import { LegalDoc } from "@/components/company/LegalDoc";
import { seoMetadata } from "@/lib/seo/meta";

const pageMeta: Metadata = {
  title: "Privacy Policy — Homeasy Automation Pvt. Ltd.",
  description:
    "The Homeasy privacy policy: how Homeasy Automation Private Limited collects, uses, stores, shares and protects your personal information.",
};

export function generateMetadata() {
  return seoMetadata("/privacy-policy", pageMeta);
}

/** The text is edited in Admin → Policies & terms (built-in version: data/legal.json). */
export default function Page() {
  return <LegalDoc id="privacy-policy" />;
}
