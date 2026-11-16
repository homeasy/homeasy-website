import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/meta";
import Link from "next/link";
import { CompanyIdentity, LegalPage } from "@/components/company/LegalPage";
import { getSite } from "@/lib/site-live";

const pageMeta: Metadata = {
  title: "Delivery Policy — Homeasy",
  description: "Where Homeasy delivers, how delivery is arranged, and what it costs.",
};

export function generateMetadata() {
  return seoMetadata("/delivery-policy", pageMeta);
}

/** First draft for founder and lawyer review. Delivery times are confirmed per order until the founder sets a standard. */
export default async function DeliveryPolicyPage() {
  const site = await getSite();
  return (
    <LegalPage title="Delivery policy" intro="Where we deliver, how delivery is arranged, and what it costs.">
      <h2>1. Who this applies to</h2>
      <p>
        This policy covers orders placed on {site.url.replace("https://", "")} with <CompanyIdentity />.
      </p>

      <h2>2. Where we deliver</h2>
      <p>We deliver across Bihar. The checkout page tells you if your pincode is outside our delivery area.</p>

      <h2>3. When your order arrives</h2>
      <ul>
        <li>After you order, we call or WhatsApp you to confirm the delivery date.</li>
        <li>Delivery time depends on your location and on stock. We tell you the expected date before we dispatch.</li>
        <li>If we cannot deliver an item, we tell you and refund what you paid for it.</li>
      </ul>

      <h2>4. Delivery charges</h2>
      <p>Any delivery charge is shown in your cart before you pay. There are no delivery charges added later.</p>

      <h2>5. Installation</h2>
      <ul>
        <li>Homeasy modules go inside your electrical switchbox. We recommend installation by our trained electricians.</li>
        <li>
          Not every switchbox suits every module. A{" "}
          <Link href="/book-survey" className="link">
            free home survey
          </Link>{" "}
          checks yours first.
        </li>
        <li>Electrical work carries risk. Do not open a switchbox yourself unless you are a qualified electrician.</li>
      </ul>

      <h2>6. Receiving your order</h2>
      <ul>
        <li>Please check the package when it arrives.</li>
        <li>
          If anything is damaged or missing, tell us as soon as you can, with photos. See our{" "}
          <Link href="/refund-policy" className="link">
            refund and cancellation policy
          </Link>
          .
        </li>
      </ul>

      <h2>7. Contact</h2>
      <p>
        Questions about a delivery: {site.contact.phoneDisplay} (phone and WhatsApp), {site.contact.email}. Working hours: {site.contact.hours}.
      </p>
    </LegalPage>
  );
}
