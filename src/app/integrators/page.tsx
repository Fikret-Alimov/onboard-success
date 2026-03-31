import type { Metadata } from "next";
import Link from "next/link";
import IntegratorsDirectory from "@/components/IntegratorsDirectory";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Integrators Directory — OnboardSuccess",
  description:
    "Find certified consultants and agencies specializing in CS platform implementation for mid-market SaaS.",
  openGraph: {
    title: "Integrators Directory — OnboardSuccess",
    description:
      "Find certified consultants and agencies specializing in CS platform implementation for mid-market SaaS.",
    url: "https://www.onboard-success.com/integrators",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Integrators Directory — OnboardSuccess",
    description:
      "Find certified consultants and agencies specializing in CS platform implementation for mid-market SaaS.",
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "CS Platform Integrators & Agencies",
          description:
            "Certified consultants and agencies specializing in CS platform implementation for mid-market SaaS.",
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
      <h1 className="text-4xl font-bold tracking-tight mb-3">Integrators</h1>
      <p className="text-muted text-lg mb-8 max-w-2xl">
        Certified consultants and agencies who specialize in CS platform
        implementation, migration, and optimization.
      </p>

      <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/5 px-6 py-4 flex items-center justify-between">
        <p className="text-sm text-amber-200/80">
          ⭐ Want your agency featured? Get priority placement and a gold badge for <span className="font-semibold text-amber-300">$49/mo</span>
        </p>
        <Link
          href="/featured"
          className="shrink-0 ml-4 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
        >
          Get Featured →
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
