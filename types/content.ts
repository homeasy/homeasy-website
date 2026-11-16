/**
 * Types for the content files in /data (PRD §16). The JSON files are the built-in text; several are also
 * edited in the admin and published (see lib/content/docs.ts). Keep these in step with the files.
 */
export type Status = "available" | "coming-soon" | "planned";

/** data/products.json: starter products (the admin's Products & prices takes over once imported). */
export type ProductSeed = { slug: string; name: string; headline: string; line: string; controls: string[]; icon: string; status: Status };
export type ProductsFile = { products: ProductSeed[] };

/** data/packages.json */
export type PackageItem = { text: string; usp?: string };
export type Package = { slug: string; name: string; tagline: string; priceType: "from" | "custom"; price: number | null; includes: PackageItem[] };
export type AddOn = { name: string; price: number | null; status: Status | null };
export type PackagesFile = { packages: Package[]; everyPackage: PackageItem[]; addOns: AddOn[] };

/** data/estimator.json: room-by-room estimator (PRD §8.18). Prices stay null until final (SHOW_PRICES). */
export type EstimatorAppliance = { id: string; label: string; module: string; price: number | null };
export type EstimatorFile = { rooms: { id: string; label: string }[]; appliances: EstimatorAppliance[]; note: string };

/** data/service-areas.json */
export type ServiceAreasFile = { label: string; pincodePrefixes: string[]; note?: string };

/** data/faq.json */
export type FaqPart = { text: string; whenOn?: string; whenOff?: string };
export type FaqItem = { q: string; parts: FaqPart[]; link?: { href: string; label: string }; status?: Status; statusWhenOff?: { flag: string; status: Status } };
export type FaqFile = { groups: { id: string; title: string; items: FaqItem[] }[] };

/** data/roadmap.json */
export type RoadmapItem = { period: string; title: string; detail?: string; status: "done" | "now" | "available" | "planned" };

/** data/jobs.json: leave as [] to show "No open roles right now". */
export type Job = { title: string; location: string; type: string; summary: string };

/** data/legal.json: one entry per policy page. */
export type LegalDoc = { title: string; intro: string; draft: boolean; dates: string; body: string };
