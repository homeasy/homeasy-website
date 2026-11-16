import { whatsappHref } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons/brand-icons";

/**
 * Desktop floating WhatsApp button (PRD §9). The "30 min" reply promise is shown only when
 * USP_U2 is on (PRD R13); otherwise a neutral label is used.
 */
export function FloatingWhatsApp({ showReplyPromise }: { showReplyPromise: boolean }) {
  const label = showReplyPromise ? "Questions? We reply in 30 min" : "Questions? WhatsApp us";
  return (
    <a
      href={whatsappHref("general")}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-full bg-navy py-3 pl-3 pr-4 text-white no-underline hover:bg-navy-700 lg:inline-flex on-dark"
    >
      <WhatsAppIcon size={24} />
      <span className="text-[15px] font-semibold">{label}</span>
    </a>
  );
}
