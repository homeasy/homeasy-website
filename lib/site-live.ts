/**
 * Company details as currently PUBLISHED from Admin → Contact & socials (server only).
 * Phone, WhatsApp, email, hours, address, social links and the pre-filled WhatsApp messages can be
 * edited there; legal facts (company name, CIN, founding year) always come from data/site.json.
 * Server components: `const site = await getSite()`. Client components get plain values as props.
 */
import "server-only";
import { getContent } from "@/lib/content/store";
import { site as base } from "@/lib/site";

export async function getSite() {
  const c = await getContent("contact");
  const contact = {
    ...base.contact,
    phoneDisplay: `+91 ${c.phone.slice(0, 5)} ${c.phone.slice(5)}`,
    phoneE164: `+91${c.phone}`,
    whatsappNumber: `91${c.whatsapp}`,
    email: c.email,
    hours: c.hours,
  };
  const address = { ...base.address, ...c.address };
  const whatsappMessages = { ...base.whatsappMessages, ...c.whatsappMessages };
  return {
    ...base,
    contact,
    address,
    social: { ...base.social, ...c.social },
    whatsappMessages,
    telHref: `tel:${contact.phoneE164}`,
    mailHref: `mailto:${contact.email}`,
    fullAddress: `${address.street}, ${address.city}, ${address.state} ${address.pincode}`,
    /** wa.me link with a pre-filled message. */
    whatsappHref: (message: keyof typeof whatsappMessages = "general") =>
      `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(whatsappMessages[message])}`,
  };
}
export type LiveSite = Awaited<ReturnType<typeof getSite>>;
