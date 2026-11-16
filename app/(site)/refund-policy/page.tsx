import type { Metadata } from "next";
import Link from "next/link";
import { CompanyIdentity, LegalPage } from "@/components/company/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy — Homeasy",
  description: "How to cancel a Homeasy order, when refunds apply, and how they are paid.",
};

/** First draft for founder and lawyer review. Time limits are deliberately not stated until the founder sets them. */
export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund and cancellation policy" intro="How to cancel an order, when a refund applies, and how it is paid.">
      <h2>1. Who this applies to</h2>
      <p>
        This policy covers orders placed on {site.url.replace("https://", "")} with <CompanyIdentity />.
      </p>

      <h2>2. Cancelling an order</h2>
      <ul>
        <li>You can cancel an order at any time before it is dispatched or installed. We refund the full amount you paid.</li>
        <li>To cancel, WhatsApp or call us on {site.contact.phoneDisplay}, or email {site.contact.email}, with your order number.</li>
        <li>Once a module has been installed in your home, the order can no longer be cancelled. Faults are handled under our warranty.</li>
      </ul>

      <h2>3. Booking amounts</h2>
      <ul>
        <li>A booking amount confirms your order. The balance is due before delivery or installation.</li>
        <li>If our survey finds that your switchboxes or wiring are not suitable, we refund the booking amount in full.</li>
        <li>If you cancel before dispatch or installation, we refund the booking amount in full.</li>
      </ul>

      <h2>4. Returns</h2>
      <ul>
        <li>You can return a module that has not been installed or used, in its original packaging. The return period is stated in your order confirmation.</li>
        <li>If a module arrives damaged or is not what you ordered, tell us as soon as you can, with photos. We replace it or refund you.</li>
        <li>Modules that have been installed, opened up or damaged after delivery cannot be returned for a refund.</li>
      </ul>

      <h2>5. Faulty modules</h2>
      <p>
        Homeasy modules carry a 3-year warranty against manufacturing defects. A faulty module is replaced under the{" "}
        <Link href="/warranty" className="link">
          warranty
        </Link>
        .
      </p>

      <h2>6. How refunds are paid</h2>
      <ul>
        <li>Refunds go back to the payment method you used, through our payment partner Razorpay.</li>
        <li>After we approve a refund, banks usually take 5 to 7 working days to show it in your account.</li>
        <li>We do not charge a fee for a refund that this policy allows.</li>
      </ul>

      <h2>7. Contact</h2>
      <p>
        Questions about a cancellation or refund: {site.contact.phoneDisplay} (phone and WhatsApp), {site.contact.email}. Working hours:{" "}
        {site.contact.hours}.
      </p>
    </LegalPage>
  );
}
