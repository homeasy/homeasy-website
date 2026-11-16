import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import nav from "@/data/navigation.json";
import { fullAddress, mailHref, site, telHref, whatsappHref } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";

/** Navy footer, 4 columns on desktop, stacked accordions on mobile (PRD §7.2, §25.1). */
export function Footer() {
  return (
    <footer className="on-dark bg-navy text-white">
      <div className="container-page py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_3fr]">
          <div>
            <Logo variant="dark" className="h-7 lg:h-8" />
            <p className="mt-3 text-sm text-mist">{site.tagline}</p>
            <SocialLinks className="-ml-3 mt-4 text-white" />
          </div>

          {/* Desktop: 4 columns */}
          <div className="hidden grid-cols-4 gap-6 lg:grid">
            {nav.footer.map((col) => (
              <div key={col.title}>
                <h2 className="text-sm font-semibold tracking-normal text-white">{col.title}</h2>
                <ul className="mt-3 space-y-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-mist no-underline hover:text-white hover:underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile: native accordions (keyboard accessible, no JS) */}
          <div className="divide-y divide-navy-700 border-y border-navy-700 lg:hidden">
            {nav.footer.map((col) => (
              <details key={col.title} className="group">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between font-semibold">
                  {col.title}
                  <span aria-hidden="true" className="text-mist transition-transform group-open:rotate-90">
                    ▸
                  </span>
                </summary>
                <ul className="space-y-1 pb-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="flex min-h-10 items-center text-mist no-underline hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <li>
            <a href={telHref} className="inline-flex min-h-11 items-center gap-2 text-white no-underline hover:underline">
              <Phone size={16} aria-hidden="true" /> {site.contact.phoneDisplay}
            </a>
          </li>
          <li>
            <a
              href={whatsappHref("general")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-white no-underline hover:underline"
            >
              <WhatsAppIcon size={16} /> WhatsApp
            </a>
          </li>
          <li>
            <a href={mailHref} className="inline-flex min-h-11 items-center gap-2 text-white no-underline hover:underline">
              <Mail size={16} aria-hidden="true" /> {site.contact.email}
            </a>
          </li>
        </ul>

        <div className="mt-6 border-t border-navy-700 pt-6 text-[13px] leading-relaxed text-mist">
          <p>
            © {site.copyrightYear} {site.legalName} · CIN {site.cin} · Incorporated {site.foundedYear}
          </p>
          <p>Registered office: {fullAddress}, India</p>
        </div>
      </div>
    </footer>
  );
}
