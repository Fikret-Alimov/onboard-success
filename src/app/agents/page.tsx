import type { Metadata } from "next";
import Link from "next/link";
import AgentsDirectory from "@/components/AgentsDirectory";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "AI Agents Directory — OnboardSuccess",
  description:
    "A curated directory of AI agents for Customer Success teams. Compare features, integrations, and ratings.",
  openGraph: {
    title: "AI Agents Directory — OnboardSuccess",
    description:
      "A curated directory of AI agents for Customer Success teams. Compare features, integrations, and ratings.",
    url: "https://www.onboard-success.com/agents",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agents Directory — OnboardSuccess",
    description:
      "A curated directory of AI agents for Customer Success teams. Compare features, integrations, and ratings.",
  },
  alternates: {
    canonical: "/agents",
  },
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "AI Agents for Customer Success",
          description:
            "A curated directory of AI agents built for Customer Success teams.",
          url: "https://www.onboard-success.com/agents",
          itemListElement: agents.map((agent, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: agent.name,
            url: agent.website,
            description: agent.description,
          })),
        }}
      />
      <h1 className="text-4xl font-bold tracking-tight mb-3">AI Agents</h1>
      <p className="text-muted text-lg mb-8 max-w-2xl">
        A curated directory of AI agents built for Customer Success. Compare
        features, integrations, and real user ratings.
      </p>

      <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/5 px-6 py-4 flex items-center justify-between">
        <p className="text-sm text-amber-200/80">
          ⭐ Want your AI agent featured? Get priority placement and a gold badge for <span className="font-semibold text-amber-300">$49/mo</span>
        </p>
        <Link
          href="/featured"
          className="shrink-0 ml-4 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
        >
          Get Featured →
        </Link>
      </div>

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
