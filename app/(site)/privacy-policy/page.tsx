import type { Metadata } from "next";
import Link from "next/link";
import { CompanyIdentity, GrievanceContact, LegalPage } from "@/components/company/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy — Homeasy",
  description:
    "How Homeasy Automation Pvt. Ltd. collects, uses and protects your personal data, and your rights under India's DPDP Act 2023.",
};

/** PRD §8.16 + §15. First draft: must be reviewed by a lawyer before go-live. */
export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="What personal data we collect, why we collect it, and the choices you have."
    >
      <h2>1. Who we are</h2>
      <p>
        This website is run by <CompanyIdentity />. In this policy, &quot;Homeasy&quot;, &quot;we&quot; and
        &quot;us&quot; mean this company.
      </p>
      <p>
        We decide why and how your personal data is used. Under the Digital Personal Data Protection Act, 2023 (the
        &quot;DPDP Act&quot;), that makes us the Data Fiduciary and you the Data Principal.
      </p>

      <h2>2. What this policy covers</h2>
      <p>
        This policy covers personal data we receive through {site.url.replace("https://", "")}, and when you contact
        us by WhatsApp, phone or email. It also covers data we collect when we survey a home or carry out an
        installation.
      </p>

      <h2>3. The data we collect</h2>
      <h3>Data you give us</h3>
      <ul>
        <li>Contact details: your name, mobile number and, if you share it, your email address.</li>
        <li>Location details: your address, area and pincode, so we can check our service area and visit you.</li>
        <li>
          Home details: the type of home, the rooms and appliances you want to make smart, and any photos of
          switchboards you choose to send us.
        </li>
        <li>Messages: what you write or say to us on WhatsApp, phone, email or a form on this site.</li>
        <li>
          Business enquiries: your organisation, role and project details, if you contact us as a designer, builder,
          electrician, government body, investor or job applicant.
        </li>
      </ul>
      <h3>Data we record during a survey or installation</h3>
      <ul>
        <li>Notes and photos of switchboxes and wiring, used to prepare your Readiness Report and quote.</li>
        <li>Installation, warranty and support records for your home.</li>
      </ul>
      <h3>Data collected automatically</h3>
      <ul>
        <li>
          Our hosting provider keeps standard technical logs, such as IP address, browser type and the pages
          requested. These are used to keep the site secure and working.
        </li>
        <li>
          We do not run analytics on this site today. See &quot;Cookies and analytics&quot; below for what will change
          and how you will be asked.
        </li>
      </ul>
      <p>We do not ask for sensitive details such as bank passwords, card PINs or government ID through this site.</p>

      <h2>4. Why we use your data</h2>
      <p>We use your personal data only for the purpose you gave it to us, namely to:</p>
      <ul>
        <li>reply to your enquiry;</li>
        <li>book and carry out a home survey;</li>
        <li>prepare your Readiness Report and quote;</li>
        <li>install, support and provide warranty service for Homeasy modules;</li>
        <li>handle partnership, investor, press and job enquiries;</li>
        <li>keep records the law requires us to keep, such as invoices; and</li>
        <li>keep our website and services secure.</li>
      </ul>
      <p>
        We rely on your consent, which you give when you contact us or submit a form. We may also use data where the
        DPDP Act or another law allows or requires it.
      </p>

      <h2>5. Phone and WhatsApp contact</h2>
      <p>
        If you give us your mobile number, we will call or message you on WhatsApp about your enquiry, survey,
        installation or support request.
      </p>
      <p>
        We will not send you promotional messages unless you have agreed to receive them. You can ask us to stop
        contacting you at any time by replying &quot;STOP&quot; on WhatsApp or emailing {site.contact.email}.
      </p>
      <p>
        WhatsApp is operated by a third party. Messages you send us there are also subject to WhatsApp&apos;s own
        terms and privacy policy.
      </p>

      <h2>6. The Homeasy app</h2>
      <p>
        The Homeasy app has not been launched. It is coming soon. This policy does not yet cover app data. Before the
        app is released, we will update this policy to explain what the app collects and why.
      </p>

      <h2>7. Cookies and analytics</h2>
      <p>
        This site currently sets no analytics or advertising cookies. If we enable Google Analytics in future, it will
        run only after you give consent, and you will be able to refuse. Details are in our{" "}
        <Link href="/cookie-policy" className="link">
          Cookie policy
        </Link>
        .
      </p>

      <h2>8. Who we share data with</h2>
      <p>We do not sell your personal data. We share it only with:</p>
      <ul>
        <li>
          service providers that help us run the business, such as website hosting, data storage, email and
          messaging providers, who process data on our instructions;
        </li>
        <li>technicians and installers working for Homeasy, so they can visit and work at your home;</li>
        <li>professional advisers, such as accountants and lawyers, where needed; and</li>
        <li>government authorities, courts or regulators, where the law requires it.</li>
      </ul>
      <p>
        Some service providers may store or process data on servers outside India. We will do this only as permitted
        under the DPDP Act.
      </p>

      <h2>9. How long we keep data</h2>
      <p>
        We keep personal data only for as long as it is needed for the purpose it was collected, or for as long as the
        law requires. For example, invoices and warranty records must be kept for the periods set by tax and consumer
        law. When data is no longer needed, we delete it or make it anonymous.
      </p>

      <h2>10. How we protect data</h2>
      <p>
        We take reasonable technical and organisational steps to protect personal data against loss, misuse and
        unauthorised access. Access is limited to people who need it to do their work. No method of storage or
        transmission is completely secure, so we cannot promise absolute security. If a personal data breach affects
        you, we will inform you and the Data Protection Board of India as the law requires.
      </p>

      <h2>11. Your rights</h2>
      <p>Under the DPDP Act, you have the right to:</p>
      <ul>
        <li>ask for a summary of the personal data we hold about you and how we have used it;</li>
        <li>ask us to correct, complete or update your personal data;</li>
        <li>ask us to erase personal data that is no longer needed, unless the law requires us to keep it;</li>
        <li>withdraw your consent at any time, as easily as you gave it;</li>
        <li>have your complaint dealt with by our grievance contact; and</li>
        <li>nominate another person to exercise your rights if you die or become incapacitated.</li>
      </ul>
      <p>
        To use any of these rights, email {site.contact.email} from the address or with the mobile number you gave us,
        so we can confirm it is you. Withdrawing consent does not affect what we did before you withdrew it. It may
        mean we can no longer provide a service that depends on that data.
      </p>

      <h2>12. Children</h2>
      <p>
        Our website and services are meant for adults. We do not knowingly collect personal data from anyone under 18.
        If you believe a child has given us personal data, please contact us and we will delete it.
      </p>

      <h2>13. Grievances</h2>
      <p>If you have a question or complaint about how we handle your personal data, please write to:</p>
      <GrievanceContact />
      <p>
        We will acknowledge your complaint and respond within the time the law requires. If you are not satisfied with
        our response, you may complain to the Data Protection Board of India.
      </p>

      <h2>14. Changes to this policy</h2>
      <p>
        We may update this policy as our services change, for example when the app launches. The latest version will
        always be on this page, with the date it was last updated.
      </p>
    </LegalPage>
  );
}
