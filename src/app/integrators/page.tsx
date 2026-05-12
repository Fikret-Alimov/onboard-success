import type { Metadata } from "next";
import Link from "next/link";
import IntegratorsDirectory from "@/components/IntegratorsDirectory";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "CS & AI Services: Who's Actually Worth Hiring in 2026",
  description:
    "Vetted CS implementation partners and AI integration agencies. Gainsight, ChurnZero, Vitally, AI agent deployment. The shortlist for mid-market B2B SaaS.",
  openGraph: {
    title: "CS & AI Services: Who's Actually Worth Hiring in 2026",
    description:
      "Vetted CS implementation partners and AI integration agencies. Gainsight, ChurnZero, Vitally, AI agent deployment. The shortlist for mid-market B2B SaaS.",
    url: "https://www.onboard-success.com/integrators",
    type: "website",
    images: [
      {
        url: "https://www.onboard-success.com/og-default.png",
        width: 1200,
        height: 630,
        alt: "OnboardSuccess — AI Resource Hub for Customer Success",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CS & AI Services Directory | Onboard Success",
    description:
      "Vetted CS and AI services: implementation, AI integration, agent deployment, and consulting for mid-market B2B SaaS.",
    images: ["https://www.onboard-success.com/og-default.png"],
  },
  alternates: {
    canonical: "/integrators",
  },
};

interface Integrator {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  specialties: string[];
  website: string;
  contactUrl?: string;
  featured: boolean;
  featuredUntil?: string;
  featuredBadge?: string;
}

async function getIntegrators(): Promise<Integrator[]> {
  const data = await import("@/../content/integrators.json");
  const integrators = data.default as Integrator[];

  // Sort: featured first (only if not expired), then alphabetical
  const now = new Date().toISOString();
  return integrators.sort((a, b) => {
    const aFeatured = a.featured && (!a.featuredUntil || a.featuredUntil > now);
    const bFeatured = b.featured && (!b.featuredUntil || b.featuredUntil > now);
    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;
    return a.name.localeCompare(b.name);
  });
}

export default async function IntegratorsPage() {
  const integrators = await getIntegrators();

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Integrators", href: "/integrators" },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "CS & AI Services Directory",
          description:
            "Vetted CS and AI services: platform implementation, AI integration, agent deployment, and CS operations consulting for mid-market B2B SaaS.",
          url: "https://www.onboard-success.com/integrators",
          itemListElement: integrators.map((integrator, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "LocalBusiness",
              name: integrator.name,
              description: integrator.description,
              url: integrator.website,
              address: {
                "@type": "PostalAddress",
                addressLocality: integrator.location,
              },
            },
          })),
        }}
      />
      <h1 className="text-4xl font-bold tracking-tight mb-3">CS & AI Services</h1>
      <p className="text-muted text-lg mb-2 max-w-3xl">
        Vetted consultants, agencies, and implementation partners for mid-market B2B SaaS Customer Success teams.
      </p>
      <p className="text-muted text-base mb-6 max-w-3xl">
        Find specialists in CS platform implementation (Gainsight, ChurnZero, Vitally, Totango), AI agent deployment, AI integration, CS operations, health score architecture, and end-to-end customer success transformation. Not sure where to start? Read our{" "}
        <Link href="/playbooks/building-custom-cs-agents" className="text-accent hover:text-accent-hover transition-colors">
          guide to building custom CS agents
        </Link>{" "}
        or explore the{" "}
        <Link href="/playbooks/autonomous-onboarding" className="text-accent hover:text-accent-hover transition-colors">
          autonomous onboarding playbook
        </Link>.
      </p>

      <p className="text-xs text-muted/50 max-w-2xl mb-8">
        All company names and brands are property of their respective owners.
        OnboardSuccess is an independent directory and is not affiliated with, endorsed
        by, or sponsored by any listed agency. Listing information is based on publicly
        available data and may not be current. To request changes or removal,{" "}
        <Link href="/contact" className="underline hover:text-white/60">
          contact us
        </Link>
        .
      </p>

      <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/5 px-6 py-4 flex items-center justify-between">
        <p className="text-sm text-amber-200/80">
          ⭐ Want your agency featured? Get priority placement and a gold badge to stand out.
        </p>
        <Link
          href="/featured"
          className="shrink-0 ml-4 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
        >
          Learn More →
        </Link>
      </div>

      {integrators.length === 0 ? (
        <div className="text-center py-20 border border-white/5 rounded-xl bg-navy-light">
          <div className="text-4xl mb-4">🏢</div>
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted text-sm max-w-md mx-auto">
            We&apos;re building a directory of top CS integrators and
            consultancies. Check back soon or{" "}
            <a href="/contact" className="text-accent hover:underline">
              submit an agency
            </a>{" "}
            for listing.
          </p>
        </div>
      ) : (
        <IntegratorsDirectory integrators={integrators} />
      )}
    </section>
  );
}
