import Link from 'next/link';

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-6">Onboard Success</h1>
      <p className="text-lg mb-12">
        CS AI resource hub for mid-market B2B SaaS Customer Success teams.
      </p>
      <section className="grid gap-8 grid-cols-1 md:grid-cols-3">
        <Link href="/playbooks" className="block rounded-lg border p-6 hover:bg-blue-900 hover:text-white">
          <h2 className="text-2xl font-semibold mb-2">Playbooks</h2>
          <p>Explore practical customer success AI playbooks.</p>
        </Link>
        <Link href="/agents" className="block rounded-lg border p-6 hover:bg-blue-900 hover:text-white">
          <h2 className="text-2xl font-semibold mb-2">Agents</h2>
          <p>Directory of agentic AI tools for CS teams.</p>
        </Link>
        <Link href="/integrators" className="block rounded-lg border p-6 hover:bg-blue-900 hover:text-white">
          <h2 className="text-2xl font-semibold mb-2">Integrators</h2>
          <p>Find agencies specializing in CS AI implementations.</p>
        </Link>
      </section>
    </main>
  );
}
