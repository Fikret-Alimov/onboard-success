import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment Successful — OnboardSuccess",
};

export default function FeaturedSuccessPage() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-24 text-center">
      <div className="text-5xl mb-6">🎉</div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">
        Thank You for Your Purchase!
      </h1>
      <p className="text-muted text-lg mb-2">
        Your featured listing will be activated within 24 hours.
      </p>
      <p className="text-muted mb-8">
        We&apos;ll send a confirmation email with details about your featured
        placement, gold badge, and priority positioning.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/agents"
          className="px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors"
        >
          View Agents Directory
        </Link>
        <Link
          href="/integrators"
          className="px-6 py-3 rounded-lg border border-white/10 hover:border-white/20 text-white font-medium transition-colors"
        >
          View Integrators Directory
        </Link>
      </div>
    </section>
  );
}
