import type { Metadata } from "next";
import Link from "next/link";
import { CompanyIdentity, GrievanceContact, LegalPage } from "@/components/company/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy — Homeasy",
  description:
    "Which cookies the Homeasy website uses, why, for how long, and how you can refuse or remove them.",
};

/** PRD §8.16 + §15. First draft: must be reviewed by a lawyer before go-live. */
export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie policy"
      intro="What cookies are, what this website uses today, and how you stay in control."
    >
      <h2>1. Who we are</h2>
      <p>
        This website is run by <CompanyIdentity />.
      </p>

      <h2>2. What cookies are</h2>
      <p>
        Cookies are small text files that a website saves in your browser. They help a site remember your choices or
        understand how it is used. Similar technologies, such as local storage, work in a comparable way. This policy
        covers all of them.
      </p>

      <h2>3. What this website uses today</h2>
      <ul>
        <li>This site currently sets no analytics cookies.</li>
        <li>This site sets no advertising or tracking cookies.</li>
        <li>We do not use cookies to build a profile of you or to show you targeted ads.</li>
      </ul>

      <h2>4. What may change, and how you will be asked</h2>
      <p>
        We plan to use Google Analytics to understand, in aggregate, which pages are useful. It is not enabled today.
        Once enabled, it will run only after you give consent.
      </p>
      <ul>
        <li>You will see a clear choice to accept or refuse analytics cookies.</li>
        <li>If you refuse, analytics will not load and the site will work the same way.</li>
        <li>We will need to store your choice in your browser, so we do not ask you on every page.</li>
      </ul>

      <h2>5. Types of cookies, purpose and duration</h2>
      <h3>Strictly necessary</h3>
      <p>
        Purpose: to remember your cookie choice and keep forms secure. These do not need consent because the site
        cannot work properly without them. They are not used to track you.
      </p>
      <h3>Analytics (only with your consent)</h3>
      <p>
        Purpose: to count visits and see which pages are used, so we can improve the site. These are set by Google
        Analytics and are not in use today.
      </p>
      <p>
        Before any of these cookies is switched on, we will list each one on this page with its name, purpose and how
        long it lasts.
      </p>

      <h2>6. Third-party sites</h2>
      <p>
        This website links to WhatsApp, Google Maps and our social media pages. We do not embed them here. If you
        follow a link, that site may set its own cookies under its own policy.
      </p>

      <h2>7. How to refuse or remove cookies</h2>
      <ul>
        <li>Once the consent choice is live, you can refuse analytics cookies there and change your mind later.</li>
        <li>You can block or delete cookies at any time in your browser settings.</li>
        <li>Blocking analytics cookies will not stop you using this website.</li>
      </ul>

      <h2>8. More information</h2>
      <p>
        Our{" "}
        <Link href="/privacy-policy" className="link">
          Privacy policy
        </Link>{" "}
        explains how we handle personal data and your rights under the Digital Personal Data Protection Act, 2023.
      </p>

      <h2>9. Contact</h2>
      <p>For questions about cookies on this website, write to:</p>
      <GrievanceContact />

      <h2>10. Changes to this policy</h2>
      <p>
        We will update this page before any new cookie is used. The latest version will always be here, with the date
        it was last updated.
      </p>
    </LegalPage>
  );
}
