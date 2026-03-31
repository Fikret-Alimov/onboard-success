import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playbooks — OnboardSuccess",
  description:
    "Deep dives into AI-powered Customer Success strategy for B2B SaaS teams.",
  openGraph: {
    title: "Playbooks — OnboardSuccess",
    description:
      "Deep dives into AI-powered Customer Success strategy for B2B SaaS teams.",
    url: "https://www.onboard-success.com/playbooks",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Playbooks — OnboardSuccess",
    description:
      "Deep dives into AI-powered Customer Success strategy for B2B SaaS teams.",
  },
  alternates: {
    canonical: "/playbooks",
  },
};

export default function PlaybooksPage() {
  const posts = getAllPosts();

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-3">Playbooks</h1>
      <p className="text-muted text-lg mb-12 max-w-2xl">
        Strategic guides on how AI is reshaping Customer Success for mid-market
        B2B SaaS teams.
      </p>

      <div className="space-y-8">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/playbooks/${post.slug}`}
            className="group block p-6 -mx-6 rounded-xl hover:bg-navy-light transition-colors"
          >
            <div className="flex items-center gap-3 text-sm text-muted mb-2">
              <time>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
              <span>·</span>
              <span>{post.readingTime}</span>
            </div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
              {post.title}
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-3">
              {post.description}
            </p>
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-navy-lighter text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
