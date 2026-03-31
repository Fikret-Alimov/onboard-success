"use client";

import { useState, useMemo } from "react";

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

function isFeaturedActive(agent: Agent): boolean {
  if (!agent.featured) return false;
  if (!agent.featuredUntil) return true;
  return new Date(agent.featuredUntil) > new Date();
}

const CATEGORIES = [
  "CS Platform",
  "AI-Native Platform",
  "Support AI",
  "CX Operations",
  "Relationship Intelligence",
  "Digital CS",
  "Autonomous Agent",
];

function extractUniqueIntegrations(agents: Agent[]): string[] {
  const set = new Set<string>();
  agents.forEach((a) => a.integrations?.forEach((i) => set.add(i)));
  return Array.from(set).sort();
}

export default function AgentsDirectory({ agents }: { agents: Agent[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const allIntegrations = useMemo(() => extractUniqueIntegrations(agents), [agents]);

  const filtered = useMemo(() => {
    const result = agents.filter((agent) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        agent.name.toLowerCase().includes(q) ||
        agent.description.toLowerCase().includes(q);
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(agent.category);
      const matchesIntegration =
        selectedIntegrations.length === 0 ||
        selectedIntegrations.some((i) => agent.integrations?.includes(i));
      return matchesSearch && matchesCategory && matchesIntegration;
    });

    // Sort: featured first, then alphabetical
    return result.sort((a, b) => {
      const aFeatured = isFeaturedActive(a);
      const bFeatured = isFeaturedActive(b);
      if (aFeatured && !bFeatured) return -1;
      if (!aFeatured && bFeatured) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [agents, search, selectedCategories, selectedIntegrations]);

  const activeFilterCount = selectedCategories.length + selectedIntegrations.length + (search ? 1 : 0);

  function toggleFilter(value: string, list: string[], setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function clearAll() {
    setSearch("");
    setSelectedCategories([]);
    setSelectedIntegrations([]);
  }

  return (
    <>
      {/* Sticky filter bar */}
      <div className="sticky top-16 z-30 bg-[#0B1120]/95 backdrop-blur-md border-b border-white/5 -mx-6 px-6 py-4 mb-8">
        {/* Search */}
        <div className="relative mb-4">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#3B82F6]/50"
          />
        </div>

        {/* Category pills */}
        <div className="mb-3">
          <span className="text-xs text-white/40 uppercase tracking-wide mr-3">Category</span>
          <div className="inline-flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleFilter(cat, selectedCategories, setSelectedCategories)}
                className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                  selectedCategories.includes(cat)
                    ? "bg-[#3B82F6]/20 text-white border border-[#3B82F6]"
                    : "bg-white/10 text-white/70 border border-transparent hover:bg-white/15"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Integration pills */}
        <div className="mb-3">
          <span className="text-xs text-white/40 uppercase tracking-wide mr-3">Integrations</span>
          <div className="inline-flex flex-wrap gap-2">
            {allIntegrations.map((integ) => (
              <button
                key={integ}
                onClick={() => toggleFilter(integ, selectedIntegrations, setSelectedIntegrations)}
                className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                  selectedIntegrations.includes(integ)
                    ? "bg-[#3B82F6]/20 text-white border border-[#3B82F6]"
                    : "bg-white/10 text-white/70 border border-transparent hover:bg-white/15"
                }`}
              >
                {integ}
              </button>
            ))}
          </div>
        </div>

        {/* Result count + clear */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/50">
            Showing {filtered.length} of {agents.length} agents
          </span>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-[#3B82F6] hover:text-[#3B82F6]/80 transition-colors"
            >
              Clear all ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Agent cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 border border-white/5 rounded-xl bg-navy-light">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold mb-2">No agents found</h2>
          <p className="text-muted text-sm">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((agent) => {
            const url = agent.affiliateUrl || agent.website;
            const isAffiliate = !!agent.affiliateUrl;
            const isExpanded = expandedId === agent.id;
            const featured = isFeaturedActive(agent);

            return (
              <div
                key={agent.id}
                className={`p-6 rounded-xl border bg-navy-light flex flex-col relative ${
                  featured
                    ? "border-amber-500/40 ring-1 ring-amber-500/20"
                    : "border-white/5"
                }`}
              >
                {/* Featured badge */}
                {featured && (
                  <div className="absolute -top-3 left-4 px-3 py-0.5 bg-amber-500 text-navy text-xs font-bold rounded-full">
                    {agent.featuredBadge || "Featured Tool"}
                  </div>
                )}

                <div className="text-xs text-accent font-medium mb-2 uppercase tracking-wide">
                  {agent.category}
                </div>
                <h3 className="text-lg font-semibold mb-1">{agent.name}</h3>
                <p className="text-sm text-muted mb-2">{agent.description}</p>

                {/* Expandable long description */}
                {agent.longDescription && (
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : agent.id)}
                    className="text-xs text-[#3B82F6] hover:text-[#3B82F6]/80 text-left mb-2 transition-colors"
                  >
                    {isExpanded ? "Show less ▲" : "Read more ▼"}
                  </button>
                )}
                {isExpanded && agent.longDescription && (
                  <p className="text-xs text-white/60 mb-3 leading-relaxed">
                    {agent.longDescription}
                  </p>
                )}

                <p className="text-xs text-muted mb-2">
                  <span className="text-white/60">Best for:</span> {agent.bestFor}
                </p>

                {/* Pricing */}
                {agent.pricing && (
                  <p className="text-xs text-muted mb-2">
                    <span className="text-white/60">Pricing:</span> {agent.pricing}
                  </p>
                )}

                {/* G2 Rating + Reviews */}
                {agent.g2Rating && agent.g2Rating !== "N/A" && (
                  <p className="text-xs text-muted mb-3">
                    ⭐ {agent.g2Rating}
                    {agent.g2Reviews && (
                      <span className="text-white/40 ml-1">({agent.g2Reviews} reviews)</span>
                    )}
                  </p>
                )}

                {/* Features */}
                {agent.features && agent.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {agent.features.map((f) => (
                      <span
                        key={f}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[#3B82F6]/10 text-[#3B82F6]/80 border border-[#3B82F6]/20"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                )}

                {/* Integrations */}
                {agent.integrations && agent.integrations.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {agent.integrations.map((i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50"
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto">
                  <a
                    href={url}
                    target="_blank"
                    rel={
                      isAffiliate
                        ? "noopener noreferrer sponsored"
                        : "noopener noreferrer"
                    }
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
    </>
  );
}
