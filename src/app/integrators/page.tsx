import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Integrators Directory — OnboardSuccess",
  description:
    "Find certified consultants and agencies specializing in CS platform implementation for mid-market SaaS.",
};

interface Integrator {
  name: string;
  type: string;
  location: string;
  specialties: string[];
  website: string;
  featured?: boolean;
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

function isFeaturedActive(integrator: Integrator): boolean {
  if (!integrator.featured) return false;
  if (!integrator.featuredUntil) return true;
  return new Date(integrator.featuredUntil) > new Date();
}

export default async function IntegratorsPage() {
  const integrators = await getIntegrators();

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-3">Integrators</h1>
      <p className="text-muted text-lg mb-12 max-w-2xl">
        Certified consultants and agencies who specialize in CS platform
        implementation, migration, and optimization.
      </p>

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrators.map((integrator) => {
            const featured = isFeaturedActive(integrator);
            return (
              <div
                key={integrator.name}
                className={`p-6 rounded-xl border bg-navy-light relative ${
                  featured
                    ? "border-amber-500/40 ring-1 ring-amber-500/20"
                    : "border-white/5"
                }`}
              >
                {/* Featured badge */}
                {featured && (
                  <div className="absolute -top-3 left-4 px-3 py-0.5 bg-amber-500 text-navy text-xs font-bold rounded-full">
                    {integrator.featuredBadge || "Featured Partner"}
                  </div>
                )}

                <div className="text-xs text-accent font-medium mb-2 uppercase tracking-wide">
                  {integrator.type}
                </div>
                <h3 className="text-lg font-semibold mb-1">{integrator.name}</h3>
                <p className="text-xs text-muted mb-3">📍 {integrator.location}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {integrator.specialties.map((s) => (
                    <span
                      key={s}
                      className="text-xs px-2 py-0.5 rounded-full bg-navy-lighter text-muted"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <a
                    href={integrator.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent hover:underline"
                  >
                    Visit website →
                  </a>
                </div>

                {/* Request a Quote CTA */}
                <Link
                  href={`/contact?type=quote&integrator=${encodeURIComponent(integrator.name)}`}
                  className="block w-full text-center bg-accent hover:bg-accent-hover text-white font-medium py-2.5 rounded-lg transition-colors text-sm mb-2"
                >
                  Request a Quote
                </Link>

                {/* Claim listing */}
                <Link
                  href={`/contact?type=claim&listing=${encodeURIComponent(integrator.name)}`}
                  className="block text-center text-xs text-muted/50 hover:text-muted transition-colors"
                >
                  Claim this listing
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
