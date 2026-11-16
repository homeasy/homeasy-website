import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import "./globals.css";
import { flags, usp } from "@/lib/flags";
import { site } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { RevealObserver } from "@/components/ui/RevealObserver";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Homeasy — Make Your Existing Home Smart Without Rewiring",
    template: "%s",
  },
  description:
    "Smart modules inside your existing switchbox. Control lights, fans, geyser and AC from your phone. Free home survey in Bihar.",
  applicationName: site.brand,
  openGraph: {
    type: "website",
    siteName: site.brand,
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Official Chillax WOFF2 files, served unmodified from /public/fonts (licence: no subsetting/renaming)
  preload("/fonts/Chillax-Regular.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload("/fonts/Chillax-Bold.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  return (
    <html lang="en-IN" className="antialiased">
      <body className="flex min-h-dvh flex-col bg-white text-ink">
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
        <FloatingWhatsApp showReplyPromise={usp("U2")} />
        <RevealObserver />
      </body>
    </html>
  );
}
