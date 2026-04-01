import type { Metadata } from "next";
import Link from "next/link";
import { getAllTemplates, type TemplateMeta } from "@/lib/templates";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "AI Agent Workflow Templates for Customer Success | Onboard Success",
  description:
    "Pre-built n8n workflow templates for Customer Success automation. Churn detection, QBR prep, onboarding tracking, and more. Free and Pro templates ready to deploy.",
  openGraph: {
    title: "AI Agent Workflow Templates for Customer Success | Onboard Success",
    description:
      "Pre-built n8n workflow templates for Customer Success automation. Churn detection, QBR prep, onboarding tracking, and more.",
    url: "https://www.onboard-success.com/templates",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agent Workflow Templates for Customer Success | Onboard Success",
    description:
      "Pre-built n8n workflow templates for Customer Success automation. Churn detection, QBR prep, onboarding tracking, and more.",
  },
  alternates: {
    canonical: "/templates",
  },
};

function TierBadge({ tier }: { tier: string }) {
  if (tier === "pro") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20">
        Pro
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/20">
      Free
    </span>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, string> = {
    Beginner: "text-green-400",
    Intermediate: "text-blue-400",
    Advanced: "text-purple-400",
  };
  return (
    <span className={`text-xs font-medium ${colors[difficulty] || "text-muted"}`}>
      {difficulty}
    </span>
  );
}

function TemplateCard({ template }: { template: TemplateMeta }) {
  return (
    <Link
      href={`/templates/${template.id}`}
      className="block border border-white/5 rounded-xl bg-navy-light p-6 hover:border-accent/30 hover:bg-navy-lighter transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-muted font-medium uppercase tracking-wider">
          {template.category}
        </span>
        <TierBadge tier={template.tier} />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent transition-colors">
        {template.name}
      </h3>

      <p className="text-sm text-muted mb-4 line-clamp-2">
        {template.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {template.integrations.map((integration) => (
          <span
            key={integration}
            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-white/5 text-muted"
          >
            {integration}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-muted pt-3 border-t border-white/5">
        <div className="flex items-center gap-4">
          <DifficultyBadge difficulty={template.difficulty} />
          <span>⏱ {template.setupTime}</span>
        </div>
        <span>{template.platform}</span>
      </div>
    </Link>
  );
}

export default function TemplatesPage() {
  const templates = getAllTemplates();

  const categories = [...new Set(templates.map((t) => t.category))];

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Templates", href: "/templates" },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "AI Agent Workflow Templates",
          description:
            "Pre-built AI agent workflow templates for Customer Success teams. Deploy in minutes with n8n.",
          url: "https://www.onboard-success.com/templates",
          itemListElement: templates.map((template, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "SoftwareApplication",
              name: template.name,
              description: template.description,
              applicationCategory: "Business",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: template.tier === "free" ? "0" : "29",
                priceCurrency: "USD",
              },
            },
          })),
        }}
      />
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Deploy AI Agents for Customer Success
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          Pre-built workflow templates you can deploy in minutes. Download n8n
          configurations for churn detection, QBR prep, onboarding tracking,
          and more. New to CS automation? Start with our{" "}
          <Link href="/playbooks/from-insight-to-action" className="text-accent hover:text-accent-hover transition-colors">
            guide to operationalizing agentic AI
          </Link>{" "}
          or learn about{" "}
          <Link href="/playbooks/cs-ai-stack-2026" className="text-accent hover:text-accent-hover transition-colors">
            the 2026 CS AI stack
          </Link>.
        </p>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-accent text-white cursor-default">
          All Templates
        </span>
        {categories.map((cat) => (
          <span
            key={cat}
            className="px-4 py-1.5 rounded-full text-sm font-medium bg-white/5 text-muted hover:bg-white/10 hover:text-white cursor-default transition-colors"
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Stats bar */}
      <div className="flex justify-center gap-8 mb-10 text-sm text-muted">
        <span>
          <strong className="text-white">{templates.length}</strong> templates
        </span>
        <span>
          <strong className="text-white">
            {templates.filter((t) => t.tier === "free").length}
          </strong>{" "}
          free
        </span>
        <span>
          <strong className="text-white">n8n</strong> platform
        </span>
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-16 p-8 border border-white/5 rounded-xl bg-navy-light">
        <h2 className="text-2xl font-bold mb-3">Need a Custom Template?</h2>
        <p className="text-muted mb-6 max-w-lg mx-auto">
          Our integrator partners can build custom AI agent workflows tailored
          to your tech stack and CS processes.
        </p>
        <Link
          href="/integrators"
          className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors"
        >
          Browse Integrators →
        </Link>
      </div>
    </section>
  );
}
