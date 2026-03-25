export default function PlaybooksPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-semibold mb-6">Playbooks</h1>
      <p className="mb-6">A curated list of AI-powered customer success playbooks to help mid-market SaaS teams scale excellence.</p>
      {/* Render playbook summaries here once data is wired */}
      <ul className="list-disc pl-5">
        <li>Onboarding Optimization</li>
        <li>Churn Reduction Signals</li>
        <li>QBR Preparation</li>
        <li>Customer Expansion Planning</li>
        <li>Customer Health Monitoring</li>
      </ul>
    </main>
  );
}
