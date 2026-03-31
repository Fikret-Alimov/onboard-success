import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = getPostBySlug(slug);
  return {
    title: `${meta.title} — OnboardSuccess`,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://www.onboard-success.com/playbooks/${slug}`,
      type: "article",
      publishedTime: meta.date,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: `/playbooks/${slug}`,
    },
  };
}

export default async function PlaybookArticle({ params }: { params: Params }) {
  const { slug } = await params;
  const { meta, content } = getPostBySlug(slug);
  const allPosts = getAllPosts();
  const relatedArticles = allPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: meta.title,
          datePublished: meta.date,
          description: meta.description,
          author: {
            "@type": "Organization",
            name: "Onboard Success",
          },
          publisher: {
            "@type": "Organization",
            name: "Onboard Success",
            url: "https://www.onboard-success.com",
          },
          mainEntityOfPage: `https://www.onboard-success.com/playbooks/${slug}`,
        }}
      />

      <Link
        href="/playbooks"
        className="text-sm text-muted hover:text-accent transition-colors mb-8 inline-block"
      >
        ← Back to Playbooks
      </Link>

      <header className="mb-10">
        <div className="flex items-center gap-3 text-sm text-muted mb-4">
          <time>
            {new Date(meta.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span>·</span>
          <span>{meta.readingTime}</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight leading-tight mb-4">
          {meta.title}
        </h1>
        <div className="flex gap-2">
          {meta.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-navy-lighter text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="prose">
        <MDXRemote source={content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </div>

      {/* Template CTA */}
      <div className="mt-12 p-8 rounded-xl border border-accent/20 bg-accent/5 text-center">
        <h2 className="text-xl font-bold mb-2">
          Explore Our AI Agent Templates
        </h2>
        <p className="text-muted text-sm mb-4 max-w-md mx-auto">
          Put these strategies into action with pre-built n8n workflow
          templates for Customer Success automation.
        </p>
        <Link
          href="/templates"
          className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors"
        >
          Browse Templates →
        </Link>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Related Articles
          </h2>
          <div className="grid gap-4">
            {relatedArticles.map((post) => (
              <Link
                key={post.slug}
                href={`/playbooks/${post.slug}`}
                className="group block p-5 rounded-xl border border-white/5 hover:border-accent/30 hover:bg-navy-light transition-all"
              >
                <div className="flex items-center gap-2 text-xs text-muted mb-2">
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
                <h3 className="font-semibold group-hover:text-accent transition-colors mb-1">
                  {post.title}
                </h3>
                <p className="text-sm text-muted line-clamp-2">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
