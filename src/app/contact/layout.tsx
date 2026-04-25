import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Onboard Success",
  description:
    "Get in touch with OnboardSuccess. Submit a tool, agency, or partnership inquiry. We respond within 24 hours.",
  openGraph: {
    title: "Contact Us | Onboard Success",
    description:
      "Get in touch with OnboardSuccess. Submit a tool, agency, or partnership inquiry.",
    url: "https://www.onboard-success.com/contact",
    type: "website",
    images: [
      {
        url: "https://www.onboard-success.com/og-default.png",
        width: 1200,
        height: 630,
        alt: "OnboardSuccess — AI Resource Hub for Customer Success",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Contact Us | Onboard Success",
    description:
      "Get in touch with OnboardSuccess. Submit a tool, agency, or partnership inquiry.",
    images: ["https://www.onboard-success.com/og-default.png"],
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
