import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";

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
  };
}

export default async function PlaybookArticle({ params }: { params: Params }) {
  const { slug } = await params;
  const { meta, content } = getPostBySlug(slug);

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
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
        <MDXRemote source={content} />
      </div>
    </article>
  );
}
