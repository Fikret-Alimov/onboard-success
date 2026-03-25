import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const navLinks = [
  { href: "/playbooks", label: "Playbooks" },
  { href: "/agents", label: "Agents" },
  { href: "/integrators", label: "Integrators" },
  { href: "/contact", label: "Contact" },
];

export const metadata: Metadata = {
  title: "Onboard Success — CS AI Resource Hub",
  description:
    "Onboard Success is the CS AI resource hub for mid-market SaaS teams: playbooks, agentic tools, and integrators that help excellence in customer success.",
  metadataBase: new URL("https://onboard-success.com"),
  openGraph: {
    title: "Onboard Success",
    description:
      "Practical playbooks, agentic AI tools, and integrators tailored for mid-market Customer Success teams.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} min-h-full bg-[#010916] text-white`}
    >
      <body className="min-h-full flex flex-col">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-white/10 backdrop-blur-lg bg-[#010916]/80 sticky top-0 z-20">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-lg font-semibold tracking-wide">
                Onboard Success
              </Link>
              <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="transition hover:text-[#5dd2ff]"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/playbooks"
                  className="rounded-full border border-[#5dd2ff] px-4 py-2 text-sm font-semibold text-[#5dd2ff] transition hover:bg-[#5dd2ff] hover:text-[#010916]"
                >
                  Submit a Tool
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1"> {children} </main>
          <footer className="border-t border-white/10 bg-[#010916]/70">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-4">
                <Link href="/playbooks">Playbooks</Link>
                <Link href="/agents">Agents</Link>
                <Link href="/integrators">Integrators</Link>
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
                <Link href="/contact">Contact</Link>
              </div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/50">
                <Link href="https://www.linkedin.com/in/fikret" target="_blank" rel="noreferrer" className="hover:text-[#5dd2ff]">
                  LinkedIn
                </Link>
              </div>
            </div>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
