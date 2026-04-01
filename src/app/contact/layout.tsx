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
  },
  twitter: {
    card: "summary",
    title: "Contact Us | Onboard Success",
    description:
      "Get in touch with OnboardSuccess. Submit a tool, agency, or partnership inquiry.",
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
