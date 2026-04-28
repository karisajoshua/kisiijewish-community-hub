import { useEffect } from "react";
import { PageHero } from "@/components/PageHero";

const LAST_UPDATED = "April 28, 2026";

export default function Privacy() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Privacy Policy | Kisii Jewish Community";
    return () => { document.title = prev; };
  }, []);

  return (
    <>
      <PageHero
        title="Privacy Policy"
        subtitle="Your privacy matters to us. This policy explains how we handle your information."
      />

      <article className="container mx-auto px-4 py-14 max-w-3xl prose prose-slate prose-headings:font-display prose-headings:text-primary prose-a:text-accent">
        <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

        <h2>1. Introduction</h2>
        <p>
          The Kisii Jewish Community ("we", "us", "our") operates the website at{" "}
          <a href="https://kisiijewishcommunity.com">kisiijewishcommunity.com</a> (the "Site") and the
          related community services. We are committed to protecting the personal information of our
          members, visitors, donors, and supporters. This Privacy Policy describes what information we
          collect, how we use it, and the rights you have over it.
        </p>

        <h2>2. Information We Collect</h2>
        <p>We collect the following categories of personal information:</p>
        <ul>
          <li>
            <strong>Account information</strong> — name, email address, password (stored hashed), and
            profile details you choose to provide when signing up.
          </li>
          <li>
            <strong>Membership information</strong> — membership type, household details, and dues
            payment status when you apply for membership.
          </li>
          <li>
            <strong>Event participation</strong> — RSVPs, attendance records, dietary preferences, and
            accessibility requirements you provide when registering for events.
          </li>
          <li>
            <strong>Donation information</strong> — donor name, contact details, donation amount,
            payment processor reference, and any dedication you choose to share.
          </li>
          <li>
            <strong>Communications</strong> — messages you send us via the contact form, email, or
            other channels.
          </li>
          <li>
            <strong>Technical data</strong> — IP address, browser type, device identifiers, pages
            viewed, referring site, and approximate location, collected automatically through cookies
            and server logs.
          </li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Operate, maintain, and improve the Site and our community services;</li>
          <li>Process membership applications, event RSVPs, and donations;</li>
          <li>
            Send transactional emails (account verification, password resets, RSVP confirmations,
            donation receipts);
          </li>
          <li>
            Send community updates, newsletters, and announcements (only when you have opted in);
          </li>
          <li>Respond to inquiries and provide pastoral or administrative support;</li>
          <li>Detect, prevent, and address fraud, abuse, and security incidents;</li>
          <li>Comply with legal obligations (tax, accounting, regulatory reporting).</li>
        </ul>

        <h2>4. Legal Basis for Processing</h2>
        <p>
          Where applicable law requires a legal basis, we rely on: (a) your <em>consent</em> for
          marketing emails and optional profile fields; (b) <em>contract performance</em> for
          membership and event registration; (c) our <em>legitimate interests</em> in operating a
          safe, well-run community; and (d) <em>legal obligation</em> for financial and donation
          records.
        </p>

        <h2>5. How We Share Information</h2>
        <p>
          We do <strong>not</strong> sell your personal information. We share data only with:
        </p>
        <ul>
          <li>
            <strong>Service providers</strong> — hosting, email delivery, and payment processors who
            act on our instructions under written contracts;
          </li>
          <li>
            <strong>Community leadership</strong> — authorised administrators who need access to
            perform their roles (membership, events, finance);
          </li>
          <li>
            <strong>Legal authorities</strong> — when required by law, court order, or to protect
            the rights, safety, and property of the community or others.
          </li>
        </ul>

        <h2>6. Cookies and Similar Technologies</h2>
        <p>
          We use strictly necessary cookies to keep you signed in and to remember your preferences,
          and limited analytics cookies to understand how the Site is used. You can disable cookies
          in your browser, but parts of the Site (such as the member area) may not function
          correctly without them.
        </p>

        <h2>7. Data Retention</h2>
        <p>
          We retain personal information only as long as necessary for the purposes set out in this
          policy, or as required by law. Account data is kept while your account is active and for a
          reasonable archival period after closure. Donation records are retained for the period
          required by tax and accounting law.
        </p>

        <h2>8. Security</h2>
        <p>
          We use industry-standard administrative, technical, and physical safeguards to protect
          personal information, including encryption in transit (HTTPS), encrypted storage, role-based
          access controls, and database row-level security. No system is perfectly secure; if we
          become aware of a breach affecting your data, we will notify you in line with applicable
          law.
        </p>

        <h2>9. Children</h2>
        <p>
          The Site is not directed at children under 13. We do not knowingly collect personal
          information from children without verifiable parental consent. If you believe a child has
          provided us with personal data, please contact us so we can delete it.
        </p>

        <h2>10. Your Rights</h2>
        <p>Depending on where you live, you may have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you;</li>
          <li>Request correction of inaccurate or incomplete data;</li>
          <li>Request deletion of your data ("right to be forgotten");</li>
          <li>Object to or restrict certain processing activities;</li>
          <li>Withdraw consent for marketing communications at any time;</li>
          <li>Lodge a complaint with your local data protection authority.</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at the address below. We will respond within
          the time required by applicable law.
        </p>

        <h2>11. International Transfers</h2>
        <p>
          Our service providers may be located outside Kenya. Where personal data is transferred
          internationally, we use appropriate safeguards such as standard contractual clauses to
          protect it.
        </p>

        <h2>12. Third-Party Links</h2>
        <p>
          The Site may contain links to external websites. We are not responsible for the privacy
          practices of those sites; please review their policies before sharing information.
        </p>

        <h2>13. Changes to this Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Material changes will be announced on
          the Site and, where appropriate, by email. The "Last updated" date above shows when the
          policy was most recently revised.
        </p>

        <h2>14. Contact Us</h2>
        <p>
          For privacy questions or requests, please contact us at{" "}
          <a href="mailto:hello@kisiijewishcommunity.com">hello@kisiijewishcommunity.com</a> or via
          our <a href="/contact">contact page</a>.
        </p>
      </article>
    </>
  );
}
