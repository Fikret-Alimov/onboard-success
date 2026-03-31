import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment Cancelled — OnboardSuccess",
};

export default function FeaturedCancelPage() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-24 text-center">
      <div className="text-5xl mb-6">🔙</div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">
        Payment Cancelled
      </h1>
      <p className="text-muted text-lg mb-8">
        No worries — nothing was charged. You can come back anytime to get your
        listing featured.
      </p>
      <Link
        href="/featured"
        className="px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors inline-block"
      >
        Back to Featured Listings
      </Link>
    </section>
  );
}
