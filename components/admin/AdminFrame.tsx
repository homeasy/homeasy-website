"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Activity, CircleHelp, ExternalLink, FileText, Gauge, Globe, Home, Inbox, Layers, Phone, Search, Type, LayoutDashboard, LogOut, Menu, Package, Server, Settings, ShoppingBag, X, type LucideIcon } from "lucide-react";
import { logout } from "@/app/(admin)/admin/actions";
import { ToastProvider } from "./toast";

/** Sidebar navigation, grouped like the Kynyx admin. Add new sections here. */
const NAV: { group: string; items: { href: string; label: string; icon: LucideIcon; exact?: boolean }[] }[] = [
  { group: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }] },
  {
    group: "Business",
    items: [
      { href: "/admin/leads", label: "Leads", icon: Inbox },
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    ],
  },
  {
    group: "Website",
    items: [
      { href: "/admin/products", label: "Products & prices", icon: Package },
      { href: "/admin/content/home", label: "Homepage", icon: Home },
      { href: "/admin/content/faq", label: "FAQ", icon: CircleHelp },
      { href: "/admin/content/packages", label: "Packages", icon: Layers },
      { href: "/admin/content/legal", label: "Policies & terms", icon: FileText },
      { href: "/admin/contact", label: "Contact & socials", icon: Phone },
    ],
  },
  {
    group: "SEO",
    items: [
      { href: "/admin/seo", label: "SEO health", icon: Activity, exact: true },
      { href: "/admin/seo/pages", label: "Titles & descriptions", icon: Type },
      { href: "/admin/seo/keywords", label: "Keywords", icon: Search },
      { href: "/admin/seo/speed", label: "Page speed", icon: Gauge },
      { href: "/admin/seo/tools", label: "Search tools", icon: Globe },
    ],
  },
  {
    group: "Settings",
    items: [
      { href: "/admin/settings", label: "Store settings", icon: Settings, exact: true },
      { href: "/admin/settings/system", label: "System", icon: Server },
    ],
  },
];

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-3 no-underline">
      <Image src="/logo/homeasy-icon.svg" alt="" width={36} height={36} />
      <span className="leading-tight">
        <span className="block text-base font-bold tracking-[0.04em] text-white">homeasy</span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-amber">Admin</span>
      </span>
    </Link>
  );
}

function Sidebar({ email, publishBox, onNavigate }: { email: string; publishBox: ReactNode; onNavigate?: () => void }) {
  const pathname = usePathname();
  const name = email.split("@")[0] || "Admin";
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center px-5">
        <Brand />
      </div>
      <nav aria-label="Admin" className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {NAV.map((g) => (
          <div key={g.group}>
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-ash">{g.group}</p>
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-lg border-l-2 px-3 py-2 text-sm no-underline transition-colors ${
                        active ? "border-amber bg-amber/10 font-medium text-white" : "border-transparent text-mist hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <item.icon size={16} aria-hidden="true" className="shrink-0 opacity-80" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="space-y-3 border-t border-navy-700 p-3">
        {publishBox}
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-2 text-sm text-mist no-underline hover:text-white">
          View website <ExternalLink size={14} aria-hidden="true" />
        </a>
        <div className="flex items-center gap-3 px-2">
          <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber/15 text-sm font-semibold uppercase text-amber">
            {name.charAt(0)}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm text-white" title={email}>
              {name}
            </span>
            <span className="block text-xs text-mist">Owner</span>
          </span>
        </div>
        <form action={logout}>
          <button type="submit" className="flex items-center gap-2 px-2 text-sm text-mist hover:text-white">
            <LogOut size={16} aria-hidden="true" /> Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminFrame({ email, publishBox, banner, children }: { email: string; publishBox: ReactNode; banner?: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <ToastProvider>
    <div className="on-dark min-h-dvh [color-scheme:dark] bg-deep text-white">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-navy-700 bg-navy lg:block">
        <Sidebar email={email} publishBox={publishBox} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-navy-700 bg-navy">
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-3 top-6 rounded p-1 text-mist">
              <X size={20} />
            </button>
            <Sidebar email={email} publishBox={publishBox} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-navy-700 bg-deep px-4 lg:hidden">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="rounded p-1.5 text-white">
            <Menu size={20} />
          </button>
          <Brand />
        </header>
        {banner}
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
    </ToastProvider>
  );
}
