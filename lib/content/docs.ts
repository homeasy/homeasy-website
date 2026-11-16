/** The editable website documents and their built-in (seed) versions. No server imports: safe anywhere. */
import faqSeed from "@/data/faq.json";
import homeSeed from "@/data/home.json";
import packagesSeed from "@/data/packages.json";
import siteJson from "@/data/site.json";

export type SeoPage = { title: string; description: string; focusKeyword: string; keywords: string[]; noindex: boolean };
export type SeoDoc = {
  pages: Record<string, SeoPage>;
  verification: { google: string; bing: string; yandex: string };
  aiCrawlers: { search: boolean; training: boolean };
  llmsSummary: string;
};

const { note: _packagesNote, ...packages } = packagesSeed;
void _packagesNote;
const { _note: _faqNote, ...faq } = faqSeed;
void _faqNote;
const { _sections_note: _homeNote, ...home } = homeSeed;
void _homeNote;

const contact = {
  phone: siteJson.contact.phoneE164.replace(/^\+91/, ""),
  whatsapp: siteJson.contact.whatsappNumber.replace(/^91/, ""),
  email: siteJson.contact.email,
  hours: siteJson.contact.hours,
  address: { street: siteJson.address.street, city: siteJson.address.city, state: siteJson.address.state, pincode: siteJson.address.pincode },
  social: siteJson.social,
  whatsappMessages: siteJson.whatsappMessages,
};

const seo: SeoDoc = {
  pages: {},
  verification: { google: "", bing: "", yandex: "" },
  aiCrawlers: { search: true, training: false },
  llmsSummary: "",
};

export const SEEDS = { home, faq, packages, contact, seo };
export type ContentKey = keyof typeof SEEDS;
export type ContentDoc<K extends ContentKey> = (typeof SEEDS)[K];
export const CONTENT_KEYS = Object.keys(SEEDS) as ContentKey[];

/** Documents edited with the general content editor, with the names shown in the admin. */
export const EDITABLE: Record<"home" | "faq" | "packages", { label: string; description: string; view: string }> = {
  home: { label: "Homepage", description: "Every section below the hero: headings, text, cards, and which sections are shown.", view: "/" },
  faq: { label: "FAQ", description: "Question groups and answers on the FAQ page.", view: "/faq" },
  packages: { label: "Packages", description: "The three packages, what every package includes, and add-ons on the Pricing page.", view: "/pricing" },
};
