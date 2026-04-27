"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const categories = [
  "General",
  "Submit a Tool",
  "Submit an Agency",
  "Partnership",
  "Request a Quote",
  "Claim a Listing",
];

function ContactForm() {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const type = searchParams.get("type") || "";
  const integratorParam = searchParams.get("integrator") || "";
  const listingParam = searchParams.get("listing") || "";

  const [category, setCategory] = useState("");
  const [integrator, setIntegrator] = useState("");
  const [listing, setListing] = useState("");

  useEffect(() => {
    if (type === "quote") {
      setCategory("Request a Quote");
      setIntegrator(integratorParam);
    } else if (type === "claim") {
      setCategory("Claim a Listing");
      setListing(listingParam);
    }
  }, [type, integratorParam, listingParam]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          category: data.category,
          message: data.message,
          company: data.company || null,
          role: data.role || null,
          integrator: data.integrator || null,
          listing: data.listing || null,
        }),
      });

      if (!res.ok) {
        setLoading(false);
        setError("Something went wrong. Please try again.");
        return;
      }
    } catch {
      setLoading(false);
      setError("Something went wrong. Please try again.");
      return;
    }

    setLoading(false);
    setSubmitted(true);
  }

  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight mb-3">Contact</h1>
      <p className="text-muted text-lg mb-10">
        Have a question, want to submit a tool, or explore a partnership? We&apos;d
        love to hear from you.
      </p>

      {submitted ? (
        <div className="text-center py-16 border border-white/5 rounded-xl bg-navy-light">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-semibold mb-2">Message Sent</h2>
          <p className="text-muted text-sm">
            Thank you for reaching out. We&apos;ll get back to you soon.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-sm px-4 py-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              {error}
            </div>
          )}
          {/* Show context banner for quote requests */}
          {category === "Request a Quote" && integrator && (
            <div className="p-4 rounded-lg border border-accent/20 bg-accent/5">
              <p className="text-sm text-accent">
                📋 Requesting a quote for: <strong className="text-white">{integrator}</strong>
              </p>
            </div>
          )}

          {/* Show context banner for claim requests */}
          {category === "Claim a Listing" && listing && (
            <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
              <p className="text-sm text-amber-400">
                🏢 Claiming listing: <strong className="text-white">{listing}</strong>
              </p>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 rounded-lg bg-navy-light border border-white/10 text-white placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-lg bg-navy-light border border-white/10 text-white placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
              placeholder="you@company.com"
            />
          </div>

          {category === "Request a Quote" && integrator && (
            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-2">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                className="w-full px-4 py-3 rounded-lg bg-navy-light border border-white/10 text-white placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
                placeholder="Your company name"
              />
              <input type="hidden" name="integrator" value={integrator} />
            </div>
          )}

          {category === "Claim a Listing" && listing && (
            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-2">
                Your Role
              </label>
              <input
                type="text"
                id="role"
                name="role"
                className="w-full px-4 py-3 rounded-lg bg-navy-light border border-white/10 text-white placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
                placeholder="e.g. Founder, Marketing Director"
              />
              <input type="hidden" name="listing" value={listing} />
            </div>
          )}

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-2"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-navy-light border border-white/10 text-white focus:outline-none focus:border-accent transition-colors"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-navy-light border border-white/10 text-white placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors resize-none"
              placeholder={
                category === "Request a Quote"
                  ? "Tell us about your project, timeline, and budget range..."
                  : category === "Claim a Listing"
                  ? "Tell us about your agency and how you'd like to manage your listing..."
                  : "Tell us more..."
              }
            />
          </div>

          <p className="text-xs text-muted">
            By submitting you agree to our{" "}
            <Link href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Sending..."
              : category === "Request a Quote"
              ? "Request Quote"
              : category === "Claim a Listing"
              ? "Submit Claim"
              : "Send Message"}
          </button>
        </form>
      )}
    </section>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <section className="max-w-2xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Contact</h1>
          <p className="text-muted text-lg mb-10">Loading...</p>
        </section>
      }
    >
      <ContactForm />
    </Suspense>
  );
}
