import type { Metadata } from "next";
import AgentsDirectory from "@/components/AgentsDirectory";

export const metadata: Metadata = {
  title: "AI Agents Directory — OnboardSuccess",
  description:
    "A curated directory of AI agents for Customer Success teams. Compare features, integrations, and ratings.",
};

interface Agent {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription?: string;
  bestFor: string;
  g2Rating: string;
  g2Reviews?: string;
  pricing?: string;
  website: string;
  affiliateUrl?: string;
  integrations?: string[];
  features?: string[];
  featured?: boolean;
  featuredUntil?: string;
  featuredBadge?: string;
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
      <p className="text-muted text-lg mb-8 max-w-2xl">
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
        <AgentsDirectory agents={agents} />
      )}
    </section>
  );
}
