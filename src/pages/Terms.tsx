import { PageHero } from "@/components/PageHero";
import { Helmet } from "react-helmet-async";

const LAST_UPDATED = "April 28, 2026";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Kisii Jewish Community</title>
        <meta
          name="description"
          content="The terms and conditions that govern your use of the Kisii Jewish Community website and services."
        />
        <link rel="canonical" href="https://kisiijewishcommunity.com/terms" />
      </Helmet>

      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description="Please read these terms carefully — they govern your use of our website and community services."
      />

      <article className="container mx-auto px-4 py-14 max-w-3xl prose prose-slate prose-headings:font-display prose-headings:text-primary prose-a:text-accent">
        <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          These Terms of Service ("Terms") form a binding agreement between you and the Kisii Jewish
          Community ("we", "us", "our") governing your access to and use of{" "}
          <a href="https://kisiijewishcommunity.com">kisiijewishcommunity.com</a> and any related
          services (together, the "Services"). By accessing or using the Services you agree to be
          bound by these Terms. If you do not agree, please do not use the Services.
        </p>

        <h2>2. Eligibility</h2>
        <p>
          You must be at least 13 years old (or the age of digital consent in your jurisdiction) to
          create an account. If you are under 18, you confirm that a parent or guardian has reviewed
          these Terms on your behalf.
        </p>

        <h2>3. Accounts</h2>
        <ul>
          <li>You must provide accurate and current information when creating an account.</li>
          <li>You are responsible for maintaining the confidentiality of your credentials.</li>
          <li>
            You are responsible for all activity that occurs under your account. Notify us
            immediately of any unauthorised use.
          </li>
          <li>
            We may suspend or terminate accounts that violate these Terms, harm the community, or
            pose security risks.
          </li>
        </ul>

        <h2>4. Membership</h2>
        <p>
          Membership in the Kisii Jewish Community is subject to approval by community leadership and
          payment of any applicable dues. Membership confers certain privileges (event access,
          voting, services) described on our <a href="/membership">Membership page</a>. Membership
          may be revoked for conduct inconsistent with the values of the community, with reasonable
          notice and opportunity to respond where possible.
        </p>

        <h2>5. Events and RSVPs</h2>
        <p>
          When you RSVP to a community event you agree to the event's specific terms (capacity,
          fees, dietary policies, conduct). Unless stated otherwise, RSVPs are non-transferable.
          Some events may have separate refund or cancellation policies, which will be communicated
          at the time of registration.
        </p>

        <h2>6. Donations</h2>
        <p>
          Donations made through the Services are voluntary and, unless explicitly described as
          refundable, non-refundable. We will issue a receipt for each donation. We use third-party
          payment processors and do not store full card details on our servers. You are responsible
          for confirming the tax-deductibility of donations in your jurisdiction.
        </p>

        <h2>7. Acceptable Use</h2>
        <p>You agree <strong>not</strong> to:</p>
        <ul>
          <li>Use the Services for any unlawful, harmful, fraudulent, or abusive purpose;</li>
          <li>
            Post or transmit content that is defamatory, hateful, obscene, harassing, or that
            incites violence or discrimination;
          </li>
          <li>
            Impersonate another person, misrepresent your affiliation, or attempt to gain
            unauthorised access to another user's account;
          </li>
          <li>
            Interfere with or disrupt the Services (including by introducing malware, scraping at
            scale, or probing for vulnerabilities without permission);
          </li>
          <li>
            Use the Services to send unsolicited communications or to collect personal data of
            other users.
          </li>
        </ul>

        <h2>8. User Content</h2>
        <p>
          You retain ownership of content you submit (comments, photos, prayer requests, RSVP
          notes). By submitting content you grant us a non-exclusive, worldwide, royalty-free
          licence to host, display, reproduce, and adapt it as needed to operate the Services and
          serve the community. You represent that you have the right to grant this licence and that
          your content does not infringe any third party's rights.
        </p>
        <p>
          We may remove or moderate content at our discretion, especially content that breaches
          these Terms or community values.
        </p>

        <h2>9. Intellectual Property</h2>
        <p>
          All content provided by us — including the Kisii Jewish Community name, logo, written
          material, photography, and design — is owned by us or our licensors and is protected by
          copyright, trademark, and other laws. You may not copy, modify, or distribute our content
          without prior written permission, except for personal, non-commercial viewing.
        </p>

        <h2>10. Third-Party Services</h2>
        <p>
          The Services may integrate with third-party providers (authentication, payment, email).
          Your use of those services is subject to their own terms and privacy policies. We are not
          responsible for the acts or omissions of third parties.
        </p>

        <h2>11. Privacy</h2>
        <p>
          Your use of the Services is also governed by our <a href="/privacy">Privacy Policy</a>,
          which explains how we collect and use personal information.
        </p>

        <h2>12. Disclaimers</h2>
        <p>
          The Services are provided <strong>"as is"</strong> and <strong>"as available"</strong>{" "}
          without warranties of any kind, express or implied, including merchantability, fitness for
          a particular purpose, and non-infringement. We do not warrant that the Services will be
          uninterrupted, error-free, or secure, or that any information provided will be accurate or
          complete.
        </p>
        <p>
          Information on the Site (including educational, religious, or pastoral content) is
          provided for general guidance only and does not constitute legal, medical, financial, or
          professional advice.
        </p>

        <h2>13. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, the Kisii Jewish Community, its officers,
          trustees, employees, and volunteers will not be liable for any indirect, incidental,
          special, consequential, or punitive damages, or for any loss of profits, revenue, data, or
          goodwill, arising out of or in connection with your use of the Services. Our total
          aggregate liability for any claim arising out of these Terms will not exceed the amount
          you paid us in the twelve (12) months preceding the claim, or KES 5,000, whichever is
          greater.
        </p>

        <h2>14. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless the Kisii Jewish Community and its representatives
          from any claims, losses, liabilities, damages, costs, or expenses (including reasonable
          legal fees) arising out of your breach of these Terms, your misuse of the Services, or
          your violation of any law or third-party right.
        </p>

        <h2>15. Termination</h2>
        <p>
          You may close your account at any time by contacting us. We may suspend or terminate your
          access if you breach these Terms or if continued access would harm the community.
          Termination does not affect rights and obligations that by their nature should survive
          (including ownership, indemnification, and limitation of liability).
        </p>

        <h2>16. Governing Law and Jurisdiction</h2>
        <p>
          These Terms are governed by the laws of the Republic of Kenya, without regard to conflict
          of laws principles. Any dispute arising out of these Terms or the Services will be subject
          to the exclusive jurisdiction of the courts of Kenya, except where applicable law gives
          you the right to bring proceedings in your country of residence.
        </p>

        <h2>17. Changes to these Terms</h2>
        <p>
          We may update these Terms from time to time. If we make material changes we will notify
          users by posting a notice on the Site or by email. Your continued use of the Services
          after changes take effect constitutes acceptance of the revised Terms.
        </p>

        <h2>18. Contact</h2>
        <p>
          Questions about these Terms can be sent to{" "}
          <a href="mailto:hello@kisiijewishcommunity.com">hello@kisiijewishcommunity.com</a> or
          through our <a href="/contact">contact page</a>.
        </p>
      </article>
    </>
  );
}
