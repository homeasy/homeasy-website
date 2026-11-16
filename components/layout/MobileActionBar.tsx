import Link from "next/link";
import { CalendarCheck, Phone } from "lucide-react";
import { getSite } from "@/lib/site-live";
import { WhatsAppIcon } from "@/components/icons/brand-icons";

/** Sticky bottom bar on mobile/tablet: WhatsApp · Call · Book survey (PRD §7.2, F4). */
export async function MobileActionBar() {
  const site = await getSite();
  const item =
    "flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-button text-[13px] font-semibold no-underline";
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="flex h-16 items-center gap-2 px-2">
        <a href={site.whatsappHref("general")} target="_blank" rel="noopener noreferrer" className={`${item} text-ink`}>
          <WhatsAppIcon size={20} />
          WhatsApp
        </a>
        <a href={site.telHref} className={`${item} text-ink`}>
          <Phone size={20} aria-hidden="true" />
          Call
        </a>
        <Link href="/book-survey" className={`${item} bg-blue text-navy`}>
          <CalendarCheck size={20} aria-hidden="true" />
          Book survey
        </Link>
      </div>
    </nav>
  );
}
