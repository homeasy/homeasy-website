import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/meta";
import { LegalPage } from "@/components/company/LegalPage";

const pageMeta: Metadata = {
  title: "Privacy Policy — Homeasy",
  description: "How Homeasy Automation Private Limited collects, uses, stores, shares and protects your personal information.",
};

export function generateMetadata() {
  return seoMetadata("/privacy-policy", pageMeta);
}

/**
 * Privacy Policy carried over from the live site (homeasy.io/privacy-policy, last updated 08/09/2025),
 * at the founder's request. The wording is the company's own published policy: change it only with the founder.
 */
export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="How we collect, use, store, share and protect your personal information."
      draft={false}
      dates="Effective Date: 02/04/2025 · Last Updated: 08/09/2025"
    >
      <p>
        This Privacy Policy (&ldquo;Policy&rdquo;) describes how Homeasy Automation Private Limited, a company
        incorporated under the Companies Act, 2013, bearing CIN: U74909BR2025PTC073219, and having its registered
        office at B-Hub, 5th Floor, A Block, Mauryalok Complex, Patna – 800001, Bihar, India (hereinafter referred to
        as &ldquo;Homeasy,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), collects, uses, stores,
        shares, and protects your personal information when you access or use our website, mobile application,
        hardware devices, and related services (&ldquo;Services&rdquo;). By using our Services, you consent to the
        collection, processing, and use of your personal information in accordance with this Policy.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We may collect the following categories of information:</p>
      <h3>a. Personally Identifiable Information (PII)</h3>
      <ul>
        <li>Full name, email address, phone number, billing and shipping addresses</li>
        <li>Account login details and credentials.</li>
        <li>Payment details (processed securely through third-party gateways).</li>
      </ul>
      <h3>b. Sensitive Personal Data or Information (SPDI)</h3>
      <ul>
        <li>Financial details for payment processing.</li>
        <li>
          Device configuration, automation preferences, and usage logs from connected smart devices. (SPDI is collected
          and processed only as required under the Information Technology (Reasonable Security Practices and
          Procedures and Sensitive Personal Data or Information) Rules, 2011.)
        </li>
      </ul>
      <h3>c. Technical &amp; Device Information</h3>
      <ul>
        <li>IP address, browser type, operating system, unique device identifiers.</li>
        <li>Log data, and application usage statistics.</li>
      </ul>
      <h3>d. Cookies &amp; Tracking Technologies</h3>
      <ul>
        <li>We use cookies, web beacons, and similar tools to enhance user experience and for analytics.</li>
      </ul>

      <h2>2. Purpose of Collection &amp; Use of Data</h2>
      <p>We process your data only for lawful purposes, including:</p>
      <ul>
        <li>To provide, personalize, and improve our Services.</li>
        <li>To process orders, payments, and subscriptions.</li>
        <li>To enable device integration and automation features.</li>
        <li>To send transactional, service-related, or promotional communications (with your consent).</li>
        <li>To comply with applicable legal, regulatory, or contractual obligations.</li>
      </ul>

      <h2>3. Consent</h2>
      <ul>
        <li>By using our Services, you expressly consent to the collection and processing of your personal data.</li>
        <li>
          You may withdraw consent at any time by contacting us (see Section 10). However, withdrawal may affect our
          ability to provide Services.
        </li>
      </ul>

      <h2>4. Data Retention</h2>
      <ul>
        <li>
          We retain personal information only as long as necessary to fulfill the purposes outlined in this Policy,
          comply with legal requirements, or resolve disputes.
        </li>
        <li>Upon request, we will delete or anonymize your personal data, unless retention is required under law.</li>
      </ul>

      <h2>5. Data Sharing &amp; Disclosure</h2>
      <p>We do not sell your personal information. We may share your data only with:</p>
      <ul>
        <li>Service Providers: Payment processors, cloud hosting, analytics partners.</li>
        <li>Business Partners: For authorized integrations or value-added services.</li>
        <li>Legal &amp; Regulatory Authorities: If required by law, court order, or government request.</li>
        <li>Corporate Transactions: In case of mergers, acquisitions, or transfer of business.</li>
      </ul>

      <h2>6. Data Security</h2>
      <ul>
        <li>
          We adopt reasonable security practices and procedures as mandated under Rule 8 of the SPDI Rules, including
          encryption, firewalls, and secure servers.
        </li>
        <li>While we strive to protect your data, no method of electronic storage or transmission is 100% secure.</li>
      </ul>

      <h2>7. User Rights</h2>
      <p>As per applicable law, you have the right to:</p>
      <ul>
        <li>Access, correct, update your personal information.</li>
        <li>Request deletion of your personal data.</li>
        <li>Restrict or object to data processing</li>
        <li>Withdraw consent at any time.</li>
        <li>Request a copy of your personal data in a portable format.</li>
      </ul>
      <p>To exercise your rights, you may contact us at the details provided in Section 10.</p>

      <h2>8. Children&rsquo;s Privacy</h2>
      <p>
        Our Services are not intended for individuals below 18 years of age. We do not knowingly collect data from
        minors. If such data is inadvertently collected, it will be deleted.
      </p>

      <h2>9. Updates to This Policy</h2>
      <p>
        We may update this Policy from time to time. Updates will be posted on our website with the &ldquo;Last
        Updated&rdquo; date. Continued use of Services constitutes acceptance of the revised Policy.
      </p>

      <h2>10. Grievance Officer &amp; Contact Information</h2>
      <p>
        In compliance with Rule 5(9) of the SPDI Rules, 2011, we have designated a Grievance Officer for data
        protection concerns:
      </p>
      <address>
        Name of Grievance Officer: Aditya Kumar
        <br />
        Designation: Grievance Officer – Data Privacy &amp; Compliance
        <br />
        Email:{" "}
        <a href="mailto:aditya@homeasy.io" className="link">
          aditya@homeasy.io
        </a>
        <br />
        Registered Office: Homeasy Automation Private Limited, CIN: U74909BR2025PTC073219, B-Hub, 5th Floor, A Block,
        Mauryalok Complex, Patna – 800001, Bihar, India.
      </address>
      <p>The Grievance Officer shall acknowledge grievances within 24 hours and resolve them within 15 working days.</p>

      <h2>Disclaimer</h2>
      <p>
        This policy is a binding agreement between you and Homeasy Automation Private Limited. Homeasy reserves the
        right to amend or update this policy at any time. Changes will be posted on our website, and continued use of
        our services will be deemed as acceptance.
      </p>
    </LegalPage>
  );
}
