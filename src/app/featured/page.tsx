"use client";

import { useState } from "react";

export default function FeaturedPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [form, setForm] = useState({ listingName: "", email: "" });
  const [selectedType, setSelectedType] = useState<"integrator" | "agent" | null>(null);

  async function handleCheckout(type: "integrator" | "agent") {
    if (!form.listingName || !form.email) {
      setSelectedType(type);
      return;
    }

    setLoading(type);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, listingName: form.listingName, email: form.email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
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
          and increased visibility to Customer Success teams actively looking for tools.
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

      {/* Pricing */}
      <div className="text-center mb-8">
        <p className="text-3xl font-bold">
          $49<span className="text-lg font-normal text-muted">/month</span>
        </p>
        <p className="text-muted text-sm mt-1">Cancel anytime. No long-term commitment.</p>
      </div>

      {/* Form */}
      {selectedType && (
        <div className="max-w-md mx-auto mb-8 space-y-4">
          <div className="text-center text-sm text-muted mb-2">
            Enter your details to get your{" "}
            <span className="text-white font-medium">{selectedType}</span> listing featured
          </div>
          <input
            type="text"
            placeholder="Your listing / company name"
            value={form.listingName}
            onChange={(e) => setForm({ ...form, listingName: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-muted/50 focus:outline-none focus:border-accent"
          />
          <input
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-muted/50 focus:outline-none focus:border-accent"
          />
          <button
            onClick={() => handleCheckout(selectedType)}
            disabled={!!loading || !form.listingName || !form.email}
            className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors"
          >
            {loading ? "Redirecting to checkout…" : "Continue to Payment"}
          </button>
          <button
            onClick={() => setSelectedType(null)}
            className="w-full text-muted text-sm hover:text-white transition-colors"
          >
            ← Back
          </button>
        </div>
      )}

      {!selectedType && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => handleCheckout("integrator")}
            className="px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors"
          >
            Feature Your Agency
          </button>
        </div>
      )}

      <p className="text-center text-muted/60 text-xs mt-8">
        After payment, your featured listing will be activated within 24 hours.
        Subscriptions renew monthly until cancelled.
      </p>
    </section>
  );
}
