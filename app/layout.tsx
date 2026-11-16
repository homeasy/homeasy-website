import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import "./globals.css";
import { getContent } from "@/lib/content/store";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/lib/seo/meta";
import { site } from "@/lib/site";

/** Site-wide defaults. Search-engine verification codes come from Admin → SEO → Search tools. */
export async function generateMetadata(): Promise<Metadata> {
  const { verification: v } = await getContent("seo");
  return {
    metadataBase: new URL(site.url),
    title: { default: DEFAULT_TITLE, template: "%s" },
    description: DEFAULT_DESCRIPTION,
    applicationName: site.brand,
    openGraph: { type: "website", siteName: site.brand, locale: "en_IN" },
    verification: {
      ...(v.google ? { google: v.google } : {}),
      ...(v.yandex ? { yandex: v.yandex } : {}),
      ...(v.bing ? { other: { "msvalidate.01": v.bing } } : {}),
    },
  };
}

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
