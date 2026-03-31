import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Agents Directory — OnboardSuccess",
  description:
    "A curated directory of AI agents for Customer Success teams. Compare features, integrations, and ratings.",
};

interface Agent {
  name: string;
  category: string;
  description: string;
  bestFor: string;
  g2Rating: number;
  website: string;
  integrations: string[];
  affiliateUrl?: string;
}

async function getAgents(): Promise<Agent[]> {
  const data = await import("@/../content/agents.json");
  return data.default as Agent[];
}

export default async function AgentsPage() {
  const agents = await getAgents();

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-3">AI Agents</h1>
      <p className="text-muted text-lg mb-12 max-w-2xl">
        A curated directory of AI agents built for Customer Success. Compare
        features, integrations, and real user ratings.
      </p>

      {agents.length === 0 ? (
        <div className="text-center py-20 border border-white/5 rounded-xl bg-navy-light">
          <div className="text-4xl mb-4">🤖</div>
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted text-sm max-w-md mx-auto">
            We&apos;re curating the best AI agents for Customer Success teams.
            Check back soon or{" "}
            <a href="/contact" className="text-accent hover:underline">
              submit a tool
            </a>{" "}
            for consideration.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => {
            const url = agent.affiliateUrl || agent.website;
            const isAffiliate = !!agent.affiliateUrl;
            return (
              <div
                key={agent.name}
                className="p-6 rounded-xl border border-white/5 bg-navy-light"
              >
                <div className="text-xs text-accent font-medium mb-2 uppercase tracking-wide">
                  {agent.category}
                </div>
                <h3 className="text-lg font-semibold mb-1">{agent.name}</h3>
                <p className="text-sm text-muted mb-3">{agent.description}</p>
                <p className="text-xs text-muted mb-2">
                  <span className="text-white/60">Best for:</span> {agent.bestFor}
                </p>
                {agent.g2Rating > 0 && (
                  <p className="text-xs text-muted mb-3">
                    G2 Rating: {agent.g2Rating}/5
                  </p>
                )}
                <div>
                  <a
                    href={url}
                    target="_blank"
                    rel={isAffiliate ? "noopener noreferrer sponsored" : "noopener noreferrer"}
                    className="text-sm text-accent hover:underline"
                  >
                    Visit website →
                  </a>
                  {isAffiliate && (
                    <p className="text-[10px] text-muted/40 mt-1">
                      Partner link — we may earn a commission
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
