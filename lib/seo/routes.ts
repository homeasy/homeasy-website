/** The public pages managed by the SEO tools, listed in the sitemap and /llms.txt, and linked from "Keep exploring". Add new pages here. */
export type SeoRoute = {
  path: string;
  label: string;
  kind: "home" | "page" | "legal";
  /** built-in focus keyword; Admin → SEO → Titles & descriptions can replace it per page */
  keyword: string;
  /** other searches this page should answer (from Google autocomplete for India, Nov 2026). Wi-Fi and Alexa/Google terms are included at the founder's request: the pages answer them truthfully (voice control is planned, not available) */
  keywords: string[];
  /** one plain line about the page */
  summary: string;
};

export const SEO_ROUTES: SeoRoute[] = [
  { path: "/", label: "Home", kind: "home", keyword: "home automation in patna", keywords: ["smart home without rewiring", "smart home solutions patna", "home automation company in bihar", "convert normal switch to smart switch", "smart switch board for home"], summary: "Homeasy makes existing homes smart by fitting modules inside the switchbox you already have." },
  { path: "/how-it-works", label: "How it works", kind: "page", keyword: "retrofit smart switch", keywords: ["convert normal switch to smart switch", "retrofit smart switch module", "smart home without rewiring", "home automation switches"], summary: "See how smart modules fit behind the switches you already have, step by step." },
  { path: "/products", label: "Products", kind: "page", keyword: "smart switch module", keywords: ["smart fan controller", "geyser smart switch", "control ac from phone", "retrofit smart switch module", "smart switch board for home", "wifi smart switch", "smart switch module wifi", "retrofit wifi smart switch", "smart fan regulator wifi"], summary: "The Homeasy modules for lights, fans, geysers, ACs and TVs." },
  { path: "/pricing", label: "Pricing", kind: "page", keyword: "home automation cost", keywords: ["smart home packages", "smart home cost", "smart home automation cost in india"], summary: "Simple packages, with your exact price confirmed after a free home survey." },
  { path: "/installation", label: "Installation", kind: "page", keyword: "smart home installation in patna", keywords: ["smart home installation services", "smart home installation near me", "home automation in bihar"], summary: "What happens on survey day and installation day, and the safety checks we follow." },
  { path: "/app", label: "Homeasy app", kind: "page", keyword: "smart home app", keywords: ["control ac from phone", "smart home app for android", "smart switch app", "wifi smart switch app"], summary: "Rooms, scenes, schedules and family sharing on your phone." },
  { path: "/book-survey", label: "Book a free survey", kind: "page", keyword: "free home survey", keywords: ["smart home installation near me", "home automation near me"], summary: "Pick a day and we will check your switchboxes at home, free anywhere in Bihar." },
  { path: "/solutions", label: "Solutions", kind: "page", keyword: "smart home solutions", keywords: ["smart home solutions patna", "home automation companies", "smart retrofit solutions"], summary: "Homeasy for interior designers, builders, electricians and government buildings." },
  { path: "/solutions/designers", label: "Interior designers", kind: "page", keyword: "smart home solutions for interior designers", keywords: ["home automation for interior designers", "smart switch board for home"], summary: "Add smart control behind the switchboards your clients chose, with no redesign." },
  { path: "/solutions/builders", label: "Builders & commercial", kind: "page", keyword: "home automation for builders", keywords: ["smart-ready homes", "home automation for offices", "smart home solutions patna"], summary: "Retrofit smart control for ready flats, show flats, offices and shops." },
  { path: "/solutions/electricians", label: "Electricians", kind: "page", keyword: "smart home installation training", keywords: ["smart home installation jobs", "electrician network", "smart home installation course"], summary: "Join the Homeasy electrician network in Bihar and learn smart-home installation." },
  { path: "/solutions/government", label: "Government", kind: "page", keyword: "smart retrofit for government buildings", keywords: ["home automation for government buildings", "central control for lights and fans"], summary: "Central control and schedules for lights and fans in public buildings, without rewiring." },
  { path: "/about", label: "About", kind: "page", keyword: "home automation company in patna", keywords: ["home automation company in bihar", "smart home company", "home automation companies"], summary: "Who we are, and why we retrofit homes instead of replacing switchboards." },
  { path: "/contact", label: "Contact", kind: "page", keyword: "contact homeasy", keywords: ["home automation near me", "smart home patna"], summary: "Call, WhatsApp or email the Homeasy team in Patna." },
  { path: "/faq", label: "FAQ", kind: "page", keyword: "homeasy faq", keywords: ["smart switch vs normal switch", "how to convert normal switch to smart switch", "smart home without wiring", "smart switch alexa", "does smart switch work with alexa", "google home smart switch"], summary: "Straight answers on switches, wiring, the app, pricing and support." },
  { path: "/guarantee", label: "Guarantee", kind: "page", keyword: "homeasy guarantee", keywords: ["smart home installation services"], summary: "The promises Homeasy makes to customers, written down." },
  { path: "/warranty", label: "Warranty", kind: "page", keyword: "homeasy warranty", keywords: ["smart switch warranty"], summary: "The 3-year warranty on Homeasy modules: what is covered and how to claim." },
  { path: "/roadmap", label: "Roadmap", kind: "page", keyword: "homeasy roadmap", keywords: ["smart home automation", "alexa smart switch", "smart fan regulator alexa", "google home automation"], summary: "What is available today and what is planned next." },
  { path: "/investors", label: "Investors", kind: "page", keyword: "homeasy for investors", keywords: ["smart home startup india", "home automation company in india"], summary: "The case for retrofit-first smart homes in India, and how to reach the founder." },
  { path: "/careers", label: "Careers", kind: "page", keyword: "careers at homeasy", keywords: ["smart home installation jobs", "jobs in patna"], summary: "Work with Homeasy in Patna on hardware, software and installation." },
  { path: "/privacy-policy", label: "Privacy policy", kind: "legal", keyword: "privacy policy", keywords: [], summary: "How Homeasy collects, uses and protects personal information." },
  { path: "/terms-of-service", label: "Terms of service", kind: "legal", keyword: "terms of service", keywords: [], summary: "The terms for using the website and Homeasy services." },
  { path: "/refund-policy", label: "Refund policy", kind: "legal", keyword: "refund policy", keywords: [], summary: "How to cancel an order and when refunds apply." },
  { path: "/delivery-policy", label: "Delivery policy", kind: "legal", keyword: "delivery policy", keywords: [], summary: "Where Homeasy delivers and how delivery is arranged." },
  { path: "/cookie-policy", label: "Cookie policy", kind: "legal", keyword: "cookie policy", keywords: [], summary: "Which cookies the website uses and how to refuse them." },
];

export const routeFor = (path: string) => SEO_ROUTES.find((r) => r.path === path);
