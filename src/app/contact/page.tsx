"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

const categories = [
  "General",
  "Submit a Tool",
  "Submit an Agency",
  "Partnership",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Contact form submission:", data);
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
              placeholder="Tell us more..."
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
            className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-3 rounded-lg transition-colors"
          >
            Send Message
          </button>
        </form>
      )}
    </section>
  );
}
