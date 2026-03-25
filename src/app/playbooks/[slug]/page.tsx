import { notFound } from "next/navigation";

export default function PlaybookDetailPage({ params }: { params: { slug: string } }) {
  // Placeholder detail page
  const { slug } = params;

  // TODO: Load actual playbook content based on slug
  if (!slug) {
    notFound();
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-semibold mb-6">Playbook: {slug.replace(/-/g, " ")}</h1>
      <p>Details and step-by-step guides coming soon.</p>
    </main>
  );
}
