"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

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

const TYPES = [
  "Implementation Partner",
  "Strategy Consultant",
  "Revenue Architecture",
  "CX Consulting",
  "Enterprise AI",
  "RevOps",
  "Methodology",
];

function extractUniqueLocations(integrators: Integrator[]): string[] {
  const set = new Set<string>();
  integrators.forEach((i) => set.add(i.location));
  return Array.from(set).sort();
}

function isFeaturedActive(integrator: Integrator): boolean {
  if (!integrator.featured) return false;
  if (!integrator.featuredUntil) return true;
  return new Date(integrator.featuredUntil) > new Date();
}

export default function IntegratorsDirectory({
  integrators,
}: {
  integrators: Integrator[];
}) {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const allLocations = useMemo(() => extractUniqueLocations(integrators), [integrators]);

  const filtered = useMemo(() => {
    return integrators.filter((integrator) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        integrator.name.toLowerCase().includes(q) ||
        integrator.specialties.some((s) => s.toLowerCase().includes(q)) ||
        integrator.description.toLowerCase().includes(q);
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(integrator.type);
      const matchesLocation =
        selectedLocations.length === 0 || selectedLocations.includes(integrator.location);
      return matchesSearch && matchesType && matchesLocation;
    });
  }, [integrators, search, selectedTypes, selectedLocations]);

  const activeFilterCount =
    selectedTypes.length + selectedLocations.length + (search ? 1 : 0);

  function toggleFilter(value: string, list: string[], setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function clearAll() {
    setSearch("");
    setSelectedTypes([]);
    setSelectedLocations([]);
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
            placeholder="Search integrators by name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#3B82F6]/50"
          />
        </div>

        {/* Type pills */}
        <div className="mb-3">
          <span className="text-xs text-white/40 uppercase tracking-wide mr-3">Type</span>
          <div className="inline-flex flex-wrap gap-2">
            {TYPES.map((type) => (
              <button
                key={type}
                onClick={() => toggleFilter(type, selectedTypes, setSelectedTypes)}
                className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                  selectedTypes.includes(type)
                    ? "bg-[#3B82F6]/20 text-white border border-[#3B82F6]"
                    : "bg-white/10 text-white/70 border border-transparent hover:bg-white/15"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Location pills */}
        <div className="mb-3">
          <span className="text-xs text-white/40 uppercase tracking-wide mr-3">Location</span>
          <div className="inline-flex flex-wrap gap-2">
            {allLocations.map((loc) => (
              <button
                key={loc}
                onClick={() => toggleFilter(loc, selectedLocations, setSelectedLocations)}
                className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                  selectedLocations.includes(loc)
                    ? "bg-[#3B82F6]/20 text-white border border-[#3B82F6]"
                    : "bg-white/10 text-white/70 border border-transparent hover:bg-white/15"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Result count + clear */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/50">
            Showing {filtered.length} of {integrators.length} integrators
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

      {/* Integrator cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 border border-white/5 rounded-xl bg-navy-light">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold mb-2">No integrators found</h2>
          <p className="text-muted text-sm">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((integrator) => {
            const featured = isFeaturedActive(integrator);
            const linkUrl = integrator.contactUrl || integrator.website;

            return (
              <div
                key={integrator.id}
                className={`p-6 rounded-xl border bg-navy-light relative flex flex-col ${
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
                <p className="text-xs text-muted mb-2">📍 {integrator.location}</p>

                {/* Description */}
                <p className="text-sm text-white/60 mb-3 leading-relaxed">
                  {integrator.description}
                </p>

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

                <div className="mt-auto">
                  <div className="flex items-center gap-3 mb-3">
                    <a
                      href={linkUrl}
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
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
