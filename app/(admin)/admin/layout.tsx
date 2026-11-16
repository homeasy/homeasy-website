import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Homeasy admin",
  robots: { index: false, follow: false },
};

// Admin actions talk to the database several times; give them room on slow connections.
export const maxDuration = 60;

/** Internal area: no marketing header/footer. Each page checks the session itself. */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-dvh bg-deep text-white">{children}</div>;
}
