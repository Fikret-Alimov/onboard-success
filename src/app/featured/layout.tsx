import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Featured — OnboardSuccess",
  description:
    "Get priority placement for your AI agent or agency in the OnboardSuccess directory.",
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
