import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Homeasy admin",
  robots: { index: false, follow: false },
};

// Admin actions talk to the database several times; give them room on slow connections.
export const maxDuration = 60;

// Applies the saved theme (light / dark / system) before the page is painted, so there is no flash.
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("homeasy-admin-theme")||"dark";document.documentElement.dataset.admTheme=t==="system"?(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"):t}catch(e){document.documentElement.dataset.admTheme="dark"}})()`;

/** Internal area: no marketing header/footer. Each page checks the session itself. */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="adm-root min-h-dvh bg-deep text-white">
      <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      {children}
    </div>
  );
}
