import type { Metadata } from "next";
import { LegalDoc } from "@/components/company/LegalDoc";
import { seoMetadata } from "@/lib/seo/meta";

const pageMeta: Metadata = {
  title: "Terms of Service — Homeasy Automation Pvt. Ltd.",
  description:
    "The terms of service for using the Homeasy website and for Homeasy surveys, quotes, installation, online orders and support in India.",
};

export function generateMetadata() {
  return seoMetadata("/terms-of-service", pageMeta);
}

/** The text is edited in Admin → Policies & terms (built-in version: data/legal.json). */
export default function Page() {
  return <LegalDoc id="terms-of-service" />;
}
