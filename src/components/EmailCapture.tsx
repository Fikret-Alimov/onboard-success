"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: insertError } = await supabase
      .from("subscribers")
      .insert({ email, source: "website" });

    setLoading(false);

    if (insertError) {
      if (insertError.code === "23505") {
        setError("You're already subscribed!");
      } else {
        setError("Something went wrong. Please try again.");
      }
      return;
    }

    setSubmitted(true);
    setEmail("");
  }

  if (submitted) {
    return (
      <div className="border border-accent/20 rounded-xl p-8 bg-navy-light text-center">
        <div className="text-3xl mb-3">✉️</div>
        <h3 className="text-lg font-semibold mb-1">You&apos;re subscribed!</h3>
        <p className="text-sm text-muted">
          Welcome to the Weekly CS AI Digest. Check your inbox soon.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-white/10 rounded-xl p-8 bg-navy-light">
      <h3 className="text-xl font-semibold mb-2">
        Get the Weekly CS AI Digest
      </h3>
      <p className="text-sm text-muted mb-5">
        Curated insights on agentic AI for Customer Success teams. No spam,
        unsubscribe anytime.
      </p>
      {error && (
        <div className={`text-sm mb-4 px-4 py-2 rounded-lg ${
          error.includes("already") 
            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
            : "bg-red-500/10 text-red-400 border border-red-500/20"
        }`}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="flex-1 px-4 py-3 rounded-lg bg-navy border border-white/10 text-white placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-lg transition-colors text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      <p className="text-xs text-muted/60 mt-3">
        By subscribing you agree to our{" "}
        <Link href="/privacy" className="text-accent hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
