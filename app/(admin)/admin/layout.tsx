import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Homeasy admin",
  robots: { index: false, follow: false },
};

/** Internal area: no marketing header/footer. Each page checks the session itself. */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-dvh bg-cloud text-ink">{children}</div>;
}
