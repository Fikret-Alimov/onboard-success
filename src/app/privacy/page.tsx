import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — OnboardSuccess",
  description: "Privacy Policy for OnboardSuccess.com",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-3">Privacy Policy</h1>
      <p className="text-muted text-sm mb-10">Last updated: March 31, 2026</p>

      <div className="prose">
        <h2>1. Data Controller</h2>
        <p>
          The data controller for this website is <strong>Onboard Success OÜ</strong>,
          a company registered in the Republic of Estonia. For any privacy-related
          inquiries, please contact us at privacy@onboard-success.com.
        </p>

        <h2>2. What Data We Collect</h2>
        <h3>Contact Form Submissions</h3>
        <p>
          When you submit a form on our website, we collect your name, email address,
          and the content of your message. This data is processed solely for the purpose
          of responding to your inquiry.
        </p>

        <h3>Analytics</h3>
        <p>
          We use <strong>Vercel Analytics</strong>, a privacy-friendly analytics service
          that does not use cookies and does not track individual users across websites.
          Vercel Analytics collects anonymized, aggregated data about page views and web
          vitals to help us understand how our site is used.
        </p>

        <h3>Cookies</h3>
        <p>
          This website does not use cookies for tracking or advertising purposes. We may
          use essential cookies strictly necessary for the functioning of the website
          (e.g., session management). These do not require consent under GDPR.
        </p>

        <h2>3. Legal Basis for Processing</h2>
        <p>We process personal data on the following legal bases:</p>
        <ul>
          <li>
            <strong>Consent</strong> — When you voluntarily submit a contact form, you
            consent to the processing of the data you provide.
          </li>
          <li>
            <strong>Legitimate interest</strong> — We use anonymized analytics data to
            improve our website, which constitutes a legitimate interest that does not
            override your rights and freedoms.
          </li>
        </ul>

        <h2>4. Data Retention</h2>
        <p>
          Contact form submissions are retained for up to 12 months after your inquiry
          has been resolved, unless a longer retention period is required by law. Analytics
          data is aggregated and anonymized and does not constitute personal data.
        </p>

        <h2>5. Data Sharing</h2>
        <p>
          We do not sell, rent, or trade your personal data. We may share data with the
          following categories of service providers, solely for the purposes described in
          this policy:
        </p>
        <ul>
          <li>
            <strong>Hosting provider</strong> — Vercel Inc. (United States), for website
            hosting and analytics
          </li>
        </ul>
        <p>
          Where data is transferred outside the European Economic Area, we ensure
          appropriate safeguards are in place, such as Standard Contractual Clauses.
        </p>

        <h2>6. Your Rights Under GDPR</h2>
        <p>As a data subject, you have the right to:</p>
        <ul>
          <li><strong>Access</strong> your personal data</li>
          <li><strong>Rectify</strong> inaccurate personal data</li>
          <li><strong>Erase</strong> your personal data (&ldquo;right to be forgotten&rdquo;)</li>
          <li><strong>Restrict</strong> processing of your personal data</li>
          <li><strong>Data portability</strong> — receive your data in a structured, machine-readable format</li>
          <li><strong>Object</strong> to processing based on legitimate interest</li>
          <li><strong>Withdraw consent</strong> at any time, without affecting the lawfulness of prior processing</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at privacy@onboard-success.com.
          We will respond within 30 days.
        </p>

        <h2>7. Supervisory Authority</h2>
        <p>
          If you believe your data protection rights have been violated, you have the right
          to lodge a complaint with the Estonian Data Protection Inspectorate
          (Andmekaitse Inspektsioon) or your local supervisory authority.
        </p>

        <h2>8. Third-Party Information</h2>
        <p>
          Our directories contain publicly available information about companies and
          their products. This information is collected from public sources including
          company websites, review platforms, and press releases. If you represent a
          listed company and wish to update or remove your information, please contact us.
        </p>

        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted
          on this page with an updated revision date. We encourage you to review this
          policy periodically.
        </p>
      </div>
    </article>
  );
}
