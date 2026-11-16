import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { getSite } from "@/lib/site-live";
import { Section } from "./index";

// Kept out of ./index because it reads the published contact details on the server,
// and ./index is also imported by browser components.
/** Closing call-to-action band: Book a free home survey + WhatsApp. */
export async function CtaBand({
  title = "Ready to make your home smart?",
  body = "Book a free home survey. We'll check your switchboxes and show you what's possible.",
}: {
  title?: string;
  body?: string;
}) {
  const site = await getSite();
  return (
    <Section tone="navy">
      <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[640px]">
          <h2 className="text-h2 leading-[1.15]">{title}</h2>
          <p className="mt-3 text-lg text-mist">{body}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href="/book-survey" className="btn btn-primary min-h-12 whitespace-nowrap px-6">
            Book a free home survey
          </Link>
          <a
            href={site.whatsappHref("general")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-on-dark min-h-12 whitespace-nowrap"
          >
            <WhatsAppIcon size={18} /> WhatsApp us
          </a>
        </div>
      </div>
    </Section>
  );
}
