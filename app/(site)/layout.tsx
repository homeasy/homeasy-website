import { SiteChrome } from "@/components/layout/SiteChrome";

/** Public website: every page gets the header, footer and action bars. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return <SiteChrome>{children}</SiteChrome>;
}
