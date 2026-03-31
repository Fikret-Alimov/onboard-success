import type { Metadata } from "next";

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
}

async function getIntegrators(): Promise<Integrator[]> {
  const data = await import("@/../content/integrators.json");
  return data.default as Integrator[];
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
          {integrators.map((integrator) => (
            <div
              key={integrator.name}
              className="p-6 rounded-xl border border-white/5 bg-navy-light"
            >
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
              <a
                href={integrator.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline"
              >
                Visit website →
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
