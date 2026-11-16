import { Suspense, type ReactNode } from "react";
import { flags, usp } from "@/lib/flags";
import { DEFAULT_DESCRIPTION } from "@/lib/seo/meta";
import { getSite } from "@/lib/site-live";
import { Analytics } from "./Analytics";
import { AnnouncementBar } from "./AnnouncementBar";
import { BookingModal } from "./BookingModal";
import { CookieBanner } from "./CookieBanner";
import { FloatingWhatsApp } from "./FloatingWhatsApp";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileActionBar } from "./MobileActionBar";
import { RevealObserver } from "@/components/ui/RevealObserver";

/** Header, footer and floating actions for the public website (not used by /admin). */
export async function SiteChrome({ children }: { children: ReactNode }) {
  const site = await getSite();
  // Who Homeasy is, in the form search engines and AI assistants read (schema.org). Facts only: no ratings or counts.
  const organization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "HomeAndConstructionBusiness"],
    "@id": `${site.url}/#organization`,
    name: site.brand,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/logo/homeasy-logo-light.svg`,
    image: `${site.url}/opengraph-image.png`,
    description: DEFAULT_DESCRIPTION,
    foundingDate: String(site.foundedYear),
    founder: { "@type": "Person", name: site.founder.name, jobTitle: site.founder.role },
    telephone: site.contact.phoneE164,
    email: site.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.pincode,
      addressCountry: "IN",
    },
    areaServed: { "@type": "State", name: site.serviceAreaLabel },
    knowsAbout: ["Home automation", "Smart home retrofit", "Smart switch modules", "Smart home installation"],
    hasMap: site.social.google,
    sameAs: Object.values(site.social),
  };
  return (
    <div className="site-chrome flex min-h-dvh flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
      <a
        href="#main"
        className="sr-only z-50 rounded-button bg-navy px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      {flags.SHOW_ANNOUNCEMENT && <AnnouncementBar launch={site.launch.label} />}
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileActionBar />
      {/* both read the page address, which is only known per request on pages like /products/[slug] */}
      <Suspense fallback={null}>
        <FloatingWhatsApp whatsappHref={site.whatsappHref("general")} showReplyPromise={usp("U2")} />
        <RevealObserver />
        <Analytics />
      </Suspense>
      <BookingModal whatsappHref={site.whatsappHref("general")} telHref={site.telHref} leadResponse={site.contact.leadResponse} />
      <CookieBanner />
    </div>
  );
}
