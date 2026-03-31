import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "OnboardSuccess — CS AI Resources for B2B SaaS Teams",
  description:
    "The authoritative resource hub for Customer Success teams embracing AI. Playbooks, agent directories, and integrator listings for mid-market B2B SaaS.",
};

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white tracking-tight">
          OnboardSuccess
        </Link>
        <div className="flex items-center gap-8">
          <Link
            href="/playbooks"
            className="text-sm text-muted hover:text-white transition-colors"
          >
            Playbooks
          </Link>
          <Link
            href="/agents"
            className="text-sm text-muted hover:text-white transition-colors"
          >
            Agents
          </Link>
          <Link
            href="/integrators"
            className="text-sm text-muted hover:text-white transition-colors"
          >
            Integrators
          </Link>
          <Link
            href="/contact"
            className="text-sm bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Submit a Tool
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-navy">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-wrap gap-6 text-sm text-muted">
            <Link href="/playbooks" className="hover:text-white transition-colors">
              Playbooks
            </Link>
            <Link href="/agents" className="hover:text-white transition-colors">
              Agents
            </Link>
            <Link href="/integrators" className="hover:text-white transition-colors">
              Integrators
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
          <p className="text-sm text-muted/60">
            © 2026 Onboard Success OÜ
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-navy text-white min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
