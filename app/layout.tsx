import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import "./globals.css";
import { site } from "@/lib/site";

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
      <body className="bg-white text-ink">{children}
      </body>
    </html>
  );
}
