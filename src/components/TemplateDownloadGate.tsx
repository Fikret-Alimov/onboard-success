"use client";

import { useState, useEffect, FormEvent } from "react";

interface TemplateDownloadGateProps {
  slug: string;
  templateName: string;
}

export default function TemplateDownloadGate({ slug, templateName }: TemplateDownloadGateProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("onboard_dl_email");
    if (saved) setEmail(saved);
  }, []);

  function isValidEmail(e: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  function handleSubmit(evt: FormEvent) {
    evt.preventDefault();
    setError("");

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email.");
      return;
    }
    if (!isValidEmail(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    localStorage.setItem("onboard_dl_email", trimmed);
    setSubmitted(true);

    // Trigger download
    window.location.href = `/api/templates/${slug}/download?email=${encodeURIComponent(trimmed)}`;

    // Reset submitted state after a moment so they can download again
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          className="flex-1 min-w-0 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-muted text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
        />
        <button
          type="submit"
          disabled={submitted}
          className="shrink-0 px-5 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white rounded-lg font-medium transition-colors text-sm"
        >
          {submitted ? "✓ Downloading…" : "⬇ Download"}
        </button>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <p className="text-muted text-xs">We&apos;ll send you workflow updates. No spam.</p>
    </form>
  );
}
