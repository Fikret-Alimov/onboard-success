import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Featured — OnboardSuccess",
  description:
    "Get priority placement for your AI agent or agency in the OnboardSuccess directory.",
  openGraph: {
    title: "Get Featured — OnboardSuccess",
    description:
      "Get priority placement for your AI agent or agency in the OnboardSuccess directory.",
    url: "https://www.onboard-success.com/featured",
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
    title: "Get Featured — OnboardSuccess",
    description:
      "Get priority placement for your AI agent or agency in the OnboardSuccess directory.",
    images: ["https://www.onboard-success.com/og-default.png"],
  },
  alternates: {
    canonical: "/featured",
  },
};

export default function FeaturedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
