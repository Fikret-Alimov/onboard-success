"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Newsletter signup:", email);
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
          className="bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-lg transition-colors text-sm whitespace-nowrap"
        >
          Subscribe
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
