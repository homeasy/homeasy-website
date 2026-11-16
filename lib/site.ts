import site from "@/data/site.json";

export { site };

export type WhatsAppMessage = keyof typeof site.whatsappMessages;

/** wa.me link with a pre-filled message (PRD §8.22, §26.22). */
export function whatsappHref(message: WhatsAppMessage = "general"): string {
  const text = encodeURIComponent(site.whatsappMessages[message]);
  return `https://wa.me/${site.contact.whatsappNumber}?text=${text}`;
}

export const telHref = `tel:${site.contact.phoneE164}`;
export const mailHref = `mailto:${site.contact.email}`;

export const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.pincode}`;
