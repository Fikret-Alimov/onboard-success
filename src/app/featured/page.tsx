"use client";

import { useState } from "react";

export default function FeaturedPage() {
  const [form, setForm] = useState({ listingName: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.listingName || !form.email) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/featured-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium mb-4">
          ⭐ Featured Listings
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Get Featured on OnboardSuccess
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          Stand out from the crowd with priority placement, a gold featured badge,
          and increased visibility to Customer Success teams actively looking for tools and partners.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: "🏆",
            title: "Priority Placement",
            desc: "Your listing appears first in directory results, above non-featured entries.",
          },
          {
            icon: "⭐",
            title: "Gold Featured Badge",
            desc: "A distinctive badge signals trust and quality to potential customers.",
          },
          {
            icon: "📈",
            title: "Increased Visibility",
            desc: "Featured listings get 3–5× more clicks than standard directory entries.",
          },
        ].map((b) => (
          <div
            key={b.title}
            className="border border-white/5 rounded-xl p-6 bg-navy-light"
          >
            <div className="text-2xl mb-3">{b.icon}</div>
            <h3 className="font-semibold mb-1">{b.title}</h3>
            <p className="text-muted text-sm">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Inquiry Form */}
      {submitted ? (
        <div className="max-w-md mx-auto text-center py-12">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">We&apos;ll be in touch!</h2>
          <p className="text-muted">
            Thanks for your interest. We&apos;ll send you all the details and pricing
            information to <span className="text-white font-medium">{form.email}</span> shortly.
          </p>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">Interested? Get in touch.</h2>
            <p className="text-muted text-sm">
              Tell us about your listing and we&apos;ll send you all the details, including pricing and a payment link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="listingName" className="block text-sm font-medium text-muted mb-1">
                Company / Listing Name *
              </label>
              <input
                id="listingName"
                type="text"
                required
                placeholder="e.g. Acme CS Consulting"
                value={form.listingName}
                onChange={(e) => setForm({ ...form, listingName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-muted/50 focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted mb-1">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-muted/50 focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-muted mb-1">
                Anything else? (optional)
              </label>
              <textarea
                id="message"
                rows={3}
                placeholder="Tell us about your company or any questions you have..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-muted/50 focus:outline-none focus:border-accent resize-none"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting || !form.listingName || !form.email}
              className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {submitting ? "Sending…" : "Get Featured Listing Details"}
            </button>
          </form>

          <p className="text-center text-muted/60 text-xs mt-6">
            We&apos;ll respond within 24 hours with pricing details and next steps. No commitment required.
          </p>
        </div>
      )}
    </section>
  );
}
