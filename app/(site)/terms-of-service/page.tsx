import type { Metadata } from "next";
import Link from "next/link";
import { CompanyIdentity, GrievanceContact, LegalPage } from "@/components/company/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service — Homeasy",
  description:
    "The terms for using the Homeasy website and for Homeasy surveys, quotes, installation and support in India.",
};

/** PRD §8.16 + §15. First draft: must be reviewed by a lawyer before go-live. */
export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of service"
      intro="The terms for using this website and for our surveys, quotes and installations."
    >
      <h2>1. About these terms</h2>
      <p>
        This website is run by <CompanyIdentity />. In these terms, &quot;Homeasy&quot;, &quot;we&quot; and
        &quot;us&quot; mean this company.
      </p>
      <p>
        By using this website or booking a survey, you agree to these terms. If you do not agree, please do not use
        the website. When you place an order, your written quote and order confirmation also apply. If they differ
        from these terms, the quote and order confirmation take priority.
      </p>

      <h2>2. Using this website</h2>
      <ul>
        <li>You may use this website for personal or business enquiries about Homeasy.</li>
        <li>Please give us accurate details, so we can reach you and serve you properly.</li>
        <li>
          You must not misuse the website. This includes trying to gain unauthorised access, sending spam, or
          interfering with how it works.
        </li>
      </ul>

      <h2>3. Information on this website</h2>
      <p>
        We try to keep this website accurate and up to date. Homeasy is at a pre-launch stage. Features, products and
        services marked &quot;Coming soon&quot; or &quot;Planned&quot; are not yet available and may change or may not
        be released. The roadmap shows current plans only.
      </p>
      <p>
        Images and 3D scenes on this website are illustrations. Actual modules and installations may look different.
        Whether a Homeasy module can be fitted depends on your switchboxes and wiring, which we check at the survey.
      </p>

      <h2>4. Home survey</h2>
      <ul>
        <li>The home survey is free within our survey service area, which is currently Bihar.</li>
        <li>A survey request is not a confirmed booking until we confirm a visit time with you.</li>
        <li>An adult must be present during the visit and give us safe access to the switchboards.</li>
        <li>Having a survey does not oblige you to buy anything.</li>
        <li>
          The survey is a visual check of the switchboxes and wiring we are shown. It is not a full electrical safety
          inspection of your property.
        </li>
      </ul>

      <h2>5. Quotes and prices</h2>
      <ul>
        <li>After the survey, we give you a written quote for the work you have asked for.</li>
        <li>The quote states what is included, the price, the taxes that apply and how long the quote is valid.</li>
        <li>
          If we find at installation that extra work is needed which could not be seen at the survey, we will tell you
          and agree any change with you before we continue.
        </li>
        <li>Any prices shown on this website are indicative. Your exact price is confirmed after the survey.</li>
      </ul>

      <h2>6. Orders and payments</h2>
      <p>
        An order is placed when you accept our written quote and we confirm it. The payment schedule and the payment
        methods we accept will be stated on your quote or invoice. We will give you a tax invoice for every payment
        where the law requires one.
      </p>

      <h2>7. Installation</h2>
      <ul>
        <li>Installation is carried out by Homeasy technicians on the date agreed with you.</li>
        <li>
          Please make sure an adult is present, that we have access to the switchboards, and that power can be
          switched off while we work.
        </li>
        <li>
          Homeasy modules are fitted inside your existing switchboxes. If a switchbox or its wiring is unsuitable or
          unsafe, we may decline to install there and will explain why.
        </li>
        <li>
          You remain responsible for the condition of your home&apos;s existing wiring, switches and appliances,
          except for damage caused by our work.
        </li>
        <li>
          Modules should not be opened, moved or reinstalled by anyone other than Homeasy. Doing so may affect your
          warranty.
        </li>
      </ul>

      <h2>8. Cancellations and refunds</h2>
      <ul>
        <li>You can cancel or reschedule a survey at any time, at no cost, by WhatsApp or phone.</li>
        <li>
          The cancellation and refund terms for a paid order will be set out in your quote and order confirmation
          before you pay.
        </li>
        <li>These terms are being finalised and this section will be updated before we take our first order.</li>
      </ul>

      <h2>9. Warranty and support</h2>
      <p>
        Homeasy modules carry a 3-year warranty against manufacturing defects, from the date of installation. The full
        terms, including what is not covered and how to claim, are on our{" "}
        <Link href="/warranty" className="link">
          Warranty
        </Link>{" "}
        page. For support, contact us on WhatsApp or phone during working hours ({site.contact.hours}).
      </p>

      <h2>10. The Homeasy app</h2>
      <p>
        The Homeasy app has not been launched. It is coming soon. When it is released, separate app terms will apply
        and will be published before you use it. App control depends on your Wi-Fi, internet and phone, which are
        outside our control.
      </p>

      <h2>11. Intellectual property</h2>
      <p>
        The Homeasy name, logo, website content and designs belong to Homeasy or its licensors. You may not copy or
        use them for commercial purposes without our written permission.
      </p>

      <h2>12. Privacy</h2>
      <p>
        Our{" "}
        <Link href="/privacy-policy" className="link">
          Privacy policy
        </Link>{" "}
        explains how we handle your personal data.
      </p>

      <h2>13. Third-party services and links</h2>
      <p>
        This website links to services run by others, such as WhatsApp, Google Maps and social media sites. We are not
        responsible for their content, availability or terms.
      </p>

      <h2>14. Our liability</h2>
      <ul>
        <li>We will carry out surveys and installations with reasonable care and skill.</li>
        <li>
          To the extent the law allows, we are not liable for indirect or consequential losses, or for problems caused
          by pre-existing faults in your wiring, power supply, appliances, internet connection or third-party devices.
        </li>
        <li>
          To the extent the law allows, our total liability for an order is limited to the amount you paid us for that
          order.
        </li>
        <li>
          Nothing in these terms limits liability that cannot be limited by law, or removes your rights as a consumer
          under the Consumer Protection Act, 2019.
        </li>
      </ul>

      <h2>15. Governing law and disputes</h2>
      <p>
        These terms are governed by the laws of India. Please contact us first so we can try to resolve any issue
        directly. Subject to your rights under consumer law, the courts at Patna, Bihar will have jurisdiction.
      </p>

      <h2>16. Changes to these terms</h2>
      <p>
        We may update these terms as our services develop. The latest version will always be on this page, with the
        date it was last updated. Changes do not affect orders already confirmed.
      </p>

      <h2>17. Contact and grievances</h2>
      <p>For questions or complaints about these terms or our services, write to:</p>
      <GrievanceContact />
      <p>
        You can also call or WhatsApp us on {site.contact.phoneDisplay} during working hours ({site.contact.hours}).
      </p>
    </LegalPage>
  );
}
