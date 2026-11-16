import Link from "next/link";
import { whatsappHref } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { Logo } from "./Logo";
import { DesktopNav } from "./DesktopNav";
import { MobileDrawer } from "./MobileDrawer";

/** Sticky header (PRD §7.2, §9). Solid white with a 1px border: no blur (flat direction). */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="container-page flex h-14 items-center justify-between gap-4 lg:h-[72px]">
        <Logo priority />
        <DesktopNav />
        <div className="flex items-center gap-2">
          <a
            href={whatsappHref("general")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Homeasy on WhatsApp"
            className="hidden size-11 items-center justify-center rounded-button text-ink hover:bg-cloud lg:inline-flex"
          >
            <WhatsAppIcon size={22} />
          </a>
          <Link href="/book-survey" className="btn btn-primary min-h-10 whitespace-nowrap px-3 text-[15px] lg:min-h-11 lg:px-5">
            <span className="lg:hidden">Book survey</span>
            <span className="hidden lg:inline">Book a free survey</span>
          </Link>
          <MobileDrawer photoHref={whatsappHref("photo")} />
        </div>
      </div>
    </header>
  );
}
