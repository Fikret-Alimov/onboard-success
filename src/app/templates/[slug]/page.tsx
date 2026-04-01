import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTemplates, getTemplateBySlug, type TemplateMeta } from "@/lib/templates";
import Breadcrumbs from "@/components/Breadcrumbs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const templates = getAllTemplates();
  return templates.map((t) => ({ slug: t.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) return { title: "Template Not Found" };
  return {
    title: `${template.name} | Onboard Success Templates`,
    description: template.description,
    openGraph: {
      title: template.name,
      description: template.description,
      url: `https://www.onboard-success.com/templates/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: template.name,
      description: template.description,
    },
    alternates: {
      canonical: `/templates/${slug}`,
    },
  };
}

function renderMarkdown(md: string): string {
  // Simple markdown to HTML (handles headings, lists, code blocks, bold, links, paragraphs, tables, hr)
  let html = md
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Headings
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // HR
    .replace(/^---$/gm, "<hr>")
    // Table rows
    .replace(/^\|(.+)\|$/gm, (_, row: string) => {
      const cells = row.split("|").map((c: string) => c.trim());
      return "<tr>" + cells.map((c: string) => `<td>${c}</td>`).join("") + "</tr>";
    })
    // Remove separator rows
    .replace(/<tr><td>[-:]+<\/td>.*?<\/tr>/g, "")
    // Wrap table rows
    .replace(/((?:<tr>.*?<\/tr>\n?)+)/g, "<table>$1</table>")
    // Unordered lists
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>")
    // Paragraphs (remaining lines that aren't tags)
    .replace(/^(?!<[a-z/])(.+)$/gm, "<p>$1</p>")
    // Clean up empty paragraphs
    .replace(/<p>\s*<\/p>/g, "");

  return html;
}

function RelatedTemplateCard({ template }: { template: TemplateMeta }) {
  return (
    <Link
      href={`/templates/${template.id}`}
      className="block border border-white/5 rounded-xl bg-navy-light p-5 hover:border-accent/30 hover:bg-navy-lighter transition-all group"
    >
      <span className="text-xs text-muted font-medium uppercase tracking-wider">
        {template.category}
      </span>
      <h3 className="text-lg font-semibold text-white mt-2 mb-2 group-hover:text-accent transition-colors">
        {template.name}
      </h3>
      <p className="text-sm text-muted line-clamp-2">{template.description}</p>
      <div className="flex items-center gap-3 mt-3 text-xs text-muted">
        <span>{template.difficulty}</span>
        <span>·</span>
        <span>⏱ {template.setupTime}</span>
      </div>
    </Link>
  );
}

export default async function TemplateDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) notFound();

  const isFree = template.tier === "free";

  // Get related templates (same category first, then others, exclude current)
  const allTemplates = getAllTemplates();
  const relatedTemplates = [
    ...allTemplates.filter((t) => t.id !== slug && t.category === template.category),
    ...allTemplates.filter((t) => t.id !== slug && t.category !== template.category),
  ].slice(0, 3);

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Templates", href: "/templates" },
          { name: template.name, href: `/templates/${slug}` },
        ]}
      />
      {/* Breadcrumb */}
      <nav className="text-sm text-muted mb-8">
        <Link href="/templates" className="hover:text-white transition-colors">
          Templates
        </Link>
        <span className="mx-2">→</span>
        <span className="text-white">{template.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="flex items-start gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {template.name}
            </h1>
            {template.tier === "pro" ? (
              <span className="mt-1.5 inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20">
                Pro
              </span>
            ) : (
              <span className="mt-1.5 inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/20">
                Free
              </span>
            )}
          </div>

          <p className="text-muted text-lg mb-8 leading-relaxed">
            {template.longDescription}
          </p>

          {/* Integrations */}
          <div className="flex flex-wrap gap-2 mb-8">
            {template.integrations.map((integration) => (
              <span
                key={integration}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-white/5 text-muted border border-white/5"
              >
                {integration}
              </span>
            ))}
          </div>

          {/* Download / Pro CTA */}
          <div className="mb-10">
            {isFree ? (
              <a
                href={`/api/templates/${template.id}/download`}
                className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors text-lg"
              >
                ⬇ Download Workflow
              </a>
            ) : (
              <div className="inline-flex flex-col items-start gap-2">
                <span className="inline-flex items-center px-6 py-3 bg-amber-500/15 text-amber-400 border border-amber-500/20 rounded-lg font-medium text-lg cursor-default">
                  🔒 Pro Template
                </span>
                <span className="text-sm text-muted">
                  Coming soon — $29/mo for all Pro templates
                </span>
              </div>
            )}
          </div>

          {/* README content */}
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(template.readme) }}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 border border-white/5 rounded-xl bg-navy-light p-6 space-y-5">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Template Details
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">
                  Category
                </p>
                <p className="text-sm text-white">{template.category}</p>
              </div>

              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">
                  Platform
                </p>
                <p className="text-sm text-white">{template.platform}</p>
              </div>

              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">
                  Difficulty
                </p>
                <p className="text-sm text-white">{template.difficulty}</p>
              </div>

              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">
                  Setup Time
                </p>
                <p className="text-sm text-white">{template.setupTime}</p>
              </div>

              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">
                  Version
                </p>
                <p className="text-sm text-white">{template.version}</p>
              </div>

              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">
                  Last Updated
                </p>
                <p className="text-sm text-white">{template.lastUpdated}</p>
              </div>
            </div>

            <hr className="border-white/5" />

            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-2">
                Integrations
              </p>
              <div className="flex flex-wrap gap-1.5">
                {template.integrations.map((i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-white/5 text-muted"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>

            <hr className="border-white/5" />

            {isFree ? (
              <a
                href={`/api/templates/${template.id}/download`}
                className="block w-full text-center px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors"
              >
                ⬇ Download
              </a>
            ) : (
              <div className="text-center">
                <span className="block w-full px-4 py-2.5 bg-amber-500/15 text-amber-400 border border-amber-500/20 rounded-lg font-medium cursor-default">
                  🔒 Pro Access Required
                </span>
                <p className="text-xs text-muted mt-2">$29/mo — coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Templates */}
      {relatedTemplates.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTemplates.map((t) => (
              <RelatedTemplateCard key={t.id} template={t} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
