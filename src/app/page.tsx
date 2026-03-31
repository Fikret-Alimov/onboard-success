import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { getAllTemplates } from "@/lib/templates";
import JsonLd from "@/components/JsonLd";

const sections = [
  {
    title: "Playbooks",
    description:
      "Deep dives into how AI is transforming Customer Success strategy. From agentic workflows to predictive health scoring — actionable intelligence for CS leaders.",
    href: "/playbooks",
  },
  {
    title: "AI Agents",
    description:
      "A curated directory of AI agents built for Customer Success. Compare features, integrations, and real user ratings to find the right fit for your stack.",
    href: "/agents",
  },
  {
    title: "Integrators",
    description:
      "Find certified consultants and agencies who specialize in CS platform implementation, migration, and optimization for mid-market SaaS teams.",
    href: "/integrators",
  },
];

export default function HomePage() {
  const allPosts = getAllPosts();

  // Pick 3 diverse articles covering different topics instead of just the 3 most recent
  const featuredSlugs = [
    "from-insight-to-action",      // Agentic AI / strategy
    "ai-health-scores-2026",       // Health scores / operations
    "building-custom-cs-agents",   // Build vs buy / technical
  ];
  const latestPosts = featuredSlugs
    .map((slug) => allPosts.find((p) => p.slug === slug))
    .filter(Boolean) as typeof allPosts;

  // Popular templates for the homepage section
  const allTemplates = getAllTemplates();
  const popularTemplateSlugs = [
    "churn-risk-alert",
    "qbr-prep-agent",
    "onboarding-tracker",
  ];
  const popularTemplates = popularTemplateSlugs
    .map((id) => allTemplates.find((t) => t.id === id))
    .filter(Boolean) as typeof allTemplates;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "OnboardSuccess",
          url: "https://www.onboard-success.com",
          description:
            "The AI resource hub for Customer Success teams in mid-market B2B SaaS",
          potentialAction: {
            "@type": "SearchAction",
            target:
              "https://www.onboard-success.com/playbooks?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            The AI Resource Hub
            <br />
            <span className="text-muted">for Customer Success</span>
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-2xl">
            Playbooks, tools, and expert directories for mid-market B2B SaaS
            teams navigating the shift to AI-powered Customer Success.
          </p>
        </div>
      </section>

      {/* Section CTAs */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group block p-8 rounded-xl border border-white/5 bg-navy-light hover:border-accent/30 transition-all"
            >
              <h2 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">
                {s.title}
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                {s.description}
              </p>
              <span className="inline-block mt-4 text-sm text-accent font-medium">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Playbooks */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold tracking-tight mb-8">
          Latest from the Blog
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/playbooks/${post.slug}`}
              className="group block p-6 rounded-xl border border-white/5 bg-navy-light hover:border-accent/30 transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-muted mb-3">
                <time>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                <span>·</span>
                <span>{post.readingTime}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors leading-snug">
                {post.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed line-clamp-3">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/playbooks"
            className="text-accent hover:text-accent-hover font-medium transition-colors"
          >
            View all playbooks →
          </Link>
        </div>
      </section>

      {/* Popular Templates */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold tracking-tight mb-8">
          Popular Templates
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {popularTemplates.map((template) => (
            <Link
              key={template.id}
              href={`/templates/${template.id}`}
              className="group block p-6 rounded-xl border border-white/5 bg-navy-light hover:border-accent/30 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted font-medium uppercase tracking-wider">
                  {template.category}
                </span>
                {template.tier === "free" ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/20">
                    Free
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20">
                    Pro
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors leading-snug">
                {template.name}
              </h3>
              <p className="text-sm text-muted leading-relaxed line-clamp-2">
                {template.description}
              </p>
              <div className="flex items-center gap-3 mt-3 text-xs text-muted">
                <span>{template.difficulty}</span>
                <span>·</span>
                <span>⏱ {template.setupTime}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/templates"
            className="text-accent hover:text-accent-hover font-medium transition-colors"
          >
            View all templates →
          </Link>
        </div>
      </section>

      {/* Email capture is in the footer — no duplicate needed here */}
    </>
  );
}
