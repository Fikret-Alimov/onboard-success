import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — OnboardSuccess",
  description:
    "Get in touch with OnboardSuccess. Submit a tool, agency, or partnership inquiry.",
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
