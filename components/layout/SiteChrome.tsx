import type { ReactNode } from "react";
import { flags, usp } from "@/lib/flags";
import { getSite } from "@/lib/site-live";
import { AnnouncementBar } from "./AnnouncementBar";
import { FloatingWhatsApp } from "./FloatingWhatsApp";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileActionBar } from "./MobileActionBar";
import { RevealObserver } from "@/components/ui/RevealObserver";

/** Header, footer and floating actions for the public website (not used by /admin). */
export async function SiteChrome({ children }: { children: ReactNode }) {
  const site = await getSite();
  return (
    <div className="site-chrome flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-button bg-navy px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      {flags.SHOW_ANNOUNCEMENT && <AnnouncementBar />}
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileActionBar />
      <FloatingWhatsApp whatsappHref={site.whatsappHref("general")} showReplyPromise={usp("U2")} />
      <RevealObserver />
    </div>
  );
}
