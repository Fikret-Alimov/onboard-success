import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Link from "next/link";
import EmailCapture from "@/components/EmailCapture";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.onboard-success.com"),
  title: "Customer Success AI Resources for B2B SaaS | Onboard Success",
  description:
    "The authoritative resource hub for Customer Success teams embracing AI. Playbooks, agent directories, integrator listings, and workflow templates for mid-market B2B SaaS.",
  openGraph: {
    title: "Customer Success AI Resources for B2B SaaS | Onboard Success",
    description:
      "The authoritative resource hub for Customer Success teams embracing AI. Playbooks, agent directories, integrator listings, and workflow templates for mid-market B2B SaaS.",
    url: "https://www.onboard-success.com",
    siteName: "OnboardSuccess",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Customer Success AI Resources for B2B SaaS | Onboard Success",
    description:
      "The authoritative resource hub for Customer Success teams embracing AI. Playbooks, agent directories, integrator listings, and workflow templates for mid-market B2B SaaS.",
  },
  alternates: {
    canonical: "/",
  },
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
            href="/templates"
            className="text-sm text-muted hover:text-white transition-colors"
          >
            Templates
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
        {/* Newsletter signup */}
        <div className="max-w-xl mb-10">
          <EmailCapture />
        </div>

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
            <Link href="/templates" className="hover:text-white transition-colors">
              Templates
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
          <div className="text-right">
            <p className="text-sm text-muted/60">
              © 2026 Onboard Success OÜ
            </p>
            <p className="text-xs text-muted/40">
              OnboardSuccess is an independent resource. We are not affiliated with any listed company unless explicitly stated.
            </p>
          </div>
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
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Onboard Success",
            legalName: "Onboard Success OÜ",
            url: "https://www.onboard-success.com",
            description:
              "The AI resource hub for Customer Success teams in mid-market B2B SaaS",
            foundingDate: "2026",
            contactPoint: {
              "@type": "ContactPoint",
              email: "hello@onboard-success.com",
              contactType: "customer support",
              url: "https://www.onboard-success.com/contact",
            },
            sameAs: [],
          }}
        />
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
