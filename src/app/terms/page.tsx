import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — OnboardSuccess",
  description: "Terms of Service for OnboardSuccess.com",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-3">Terms of Service</h1>
      <p className="text-muted text-sm mb-10">Last updated: March 31, 2026</p>

      <div className="prose">
        <h2>1. Operator</h2>
        <p>
          This website (&ldquo;OnboardSuccess&rdquo; or the &ldquo;Site&rdquo;) is operated by{" "}
          <strong>Onboard Success OÜ</strong>, a company registered in the Republic of
          Estonia. By accessing or using this Site, you agree to be bound by these Terms
          of Service.
        </p>

        <h2>2. Use of the Site</h2>
        <p>
          OnboardSuccess provides informational content, directories, and resources
          related to AI-powered Customer Success for B2B SaaS companies. The Site is
          provided &ldquo;as is&rdquo; for general informational purposes only.
        </p>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Site for any unlawful purpose</li>
          <li>Scrape, copy, or reproduce content without written permission</li>
          <li>Attempt to gain unauthorized access to any part of the Site</li>
          <li>Use automated systems to access the Site in a manner that sends more requests than a human could reasonably produce</li>
        </ul>

        <h2>3. Intellectual Property</h2>
        <p>
          All content on this Site — including articles, guides, graphics, logos, and
          design — is the intellectual property of Onboard Success OÜ or its content
          contributors, and is protected by applicable copyright and trademark laws.
        </p>
        <p>
          You may share links to our content and quote brief excerpts with proper
          attribution. Reproducing entire articles or substantial portions without
          written permission is prohibited.
        </p>

        <h2>4. Directory Listings</h2>
        <p>
          The AI agents and integrator listings on this Site are provided for
          informational purposes. Inclusion in our directory does not constitute an
          endorsement. We make reasonable efforts to ensure accuracy but cannot guarantee
          that all information is current or complete.
        </p>

        <h2>5. User Submissions</h2>
        <p>
          When you submit information through our contact forms (including tool or agency
          submissions), you grant Onboard Success OÜ a non-exclusive, royalty-free
          license to use that information for the purpose of operating and improving the
          Site. We will not share your personal contact details publicly without your
          consent.
        </p>

        <h2>6. Disclaimers</h2>
        <p>
          The content on this Site is for general informational purposes only and does
          not constitute professional advice. We make no warranties or representations
          about the accuracy, completeness, or suitability of the information provided.
        </p>
        <p>
          Product ratings, reviews, and comparisons reflect publicly available information
          and user-reported data. We are not responsible for the accuracy of third-party
          ratings or reviews.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by applicable law, Onboard Success OÜ shall
          not be liable for any indirect, incidental, special, consequential, or punitive
          damages, or any loss of profits or revenues, whether incurred directly or
          indirectly, or any loss of data, use, goodwill, or other intangible losses
          resulting from:
        </p>
        <ul>
          <li>Your use of or inability to use the Site</li>
          <li>Any decisions made based on content provided on the Site</li>
          <li>Any unauthorized access to or use of our servers</li>
          <li>Any interruption or cessation of service</li>
        </ul>

        <h2>8. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of
          the Republic of Estonia, without regard to conflict of law principles. Any
          disputes arising from these Terms shall be subject to the exclusive jurisdiction
          of the courts of Estonia.
        </p>

        <h2>9. Changes to These Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. Changes will be posted
          on this page with an updated revision date. Your continued use of the Site
          after changes are posted constitutes acceptance of the updated Terms.
        </p>

        <h2>10. Third-Party Listings</h2>
        <p>
          OnboardSuccess features listings of third-party products, services, and
          companies. These listings are provided for informational purposes only.
          Inclusion in our directory does not imply endorsement, affiliation, or
          sponsorship.
        </p>
        <p>
          Product information, ratings, and pricing are based on publicly available data
          and may not reflect current details. We make reasonable efforts to keep listings
          accurate but cannot guarantee completeness or timeliness.
        </p>
        <p>
          Companies and individuals listed in our directories may request modifications
          or removal of their listings by contacting us at{" "}
          <a href="mailto:hello@onboard-success.com">hello@onboard-success.com</a>.
        </p>

        <h2>11. Contact</h2>
        <p>
          For questions about these Terms, please contact us at{" "}
          <a href="mailto:legal@onboard-success.com">legal@onboard-success.com</a>.
        </p>
      </div>
    </article>
  );
}
