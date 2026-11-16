import Link from "next/link";
import { flags } from "@/lib/flags";
import { Mail } from "lucide-react";
import nav from "@/data/navigation.json";
import { getPublicArticles } from "@/lib/blog/store";
import { getSite } from "@/lib/site-live";
import { FooterEndWatch } from "./FooterEndWatch";
import { Logo } from "./Logo";
import { CookieSettingsLink } from "./CookieBanner";
import { SocialLinks } from "./SocialLinks";

/**
 * Navy footer (PRD §7.2, §25.1). Top: brand, contact details and the main action beside five link groups
 * (accordions on phones). Bottom: company details and the legal links.
 */
const LINK = "text-mist no-underline hover:text-white hover:underline";
const CONTACT = "inline-flex min-h-10 items-center gap-2.5 text-[15px] text-white no-underline hover:underline";

export async function Footer() {
  const [site, articles] = await Promise.all([getSite(), flags.SHOW_BLOG ? getPublicArticles() : []]);
  // refund and delivery policies belong to online buying; the blog link waits for the first published article
  const hidden = new Set([...(flags.SHOW_CART ? [] : ["/refund-policy", "/delivery-policy"]), ...(articles.length ? [] : ["/blog"]), ...(flags.SHOW_INVESTORS_PAGE ? [] : ["/investors"])]);
  const shown = (l: { href: string }) => !hidden.has(l.href);
  const groups = nav.footer.map((g) => ({ ...g, links: g.links.filter(shown) }));

  return (
    <footer className="on-dark bg-navy text-white">
      <div className="container-page pb-8 pt-12 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] lg:gap-12">
          {/* brand and contact */}
          <div>
            <Logo variant="dark" className="h-7 lg:h-8" />
            <p className="mt-3 max-w-[320px] text-sm text-mist">{site.tagline}</p>
            <a href={site.mailHref} className={`${CONTACT} mt-4 break-all`}>
              <Mail size={16} aria-hidden="true" className="shrink-0 text-mist" /> {site.contact.email}
            </a>
            <div>
              <Link href="/book-survey?source=footer" className="btn btn-primary mt-4 min-h-11 px-5">
                Book a free home survey
              </Link>
            </div>
            <SocialLinks className="-ml-3 mt-4 text-white" />
          </div>

          {/* desktop: link groups */}
          <nav aria-label="Footer" className="hidden grid-cols-3 gap-x-6 gap-y-10 lg:grid xl:grid-cols-5">
            {groups.map((col) => (
              <div key={col.title} className="min-w-0">
                <h2 className="text-sm font-semibold tracking-normal text-white">{col.title}</h2>
                <ul className="mt-3 space-y-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className={`inline-flex min-h-6 items-center text-sm ${LINK}`}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* phones: native accordions (keyboard accessible, no JS) */}
          <nav aria-label="Footer" className="divide-y divide-navy-700 border-y border-navy-700 lg:hidden">
            {groups.map((col) => (
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
                      <Link href={l.href} className={`flex min-h-10 items-center ${LINK}`}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </nav>
        </div>

        {/* company details the law asks a company website to show */}
        <p className="mt-10 text-[13px] leading-relaxed text-mist">
          {site.legalName} · CIN {site.cin} · Incorporated {site.foundedYear} · Registered office: {site.fullAddress}, India
        </p>
      </div>

      {/* last line: copyright and policies on the left, credit on the right; nothing below it */}
      <div className="relative border-t border-navy-700">
        <FooterEndWatch />
        <div className="container-page flex flex-col gap-x-8 gap-y-1 py-3 text-[13px] text-mist sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap items-center gap-x-5">
            <li className="inline-flex min-h-8 items-center">
              © {site.copyrightYear} {site.brand}
            </li>
            {nav.footerLegal.filter(shown).map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={`inline-flex min-h-8 items-center ${LINK}`}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsLink className={`inline-flex min-h-8 items-center font-normal ${LINK}`} />
            </li>
          </ul>
          <p className="inline-flex min-h-8 shrink-0 items-center gap-1">
            Made with <span aria-hidden="true">❤️</span>
            <span className="sr-only">love</span> by{" "}
            <a href="https://www.kynyx.com" target="_blank" rel="noopener" className="font-semibold text-white no-underline hover:underline">
              Kynyx
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
