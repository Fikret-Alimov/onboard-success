export default function AgentsPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-semibold mb-6">Agentic AI Tools</h1>
      <p className="mb-6">Handpicked agentic AI tools built to help Customer Success teams excel in mid-market B2B SaaS environments.</p>
      {/* Agents directory goes here once data is wired */}
      <ul className="list-disc pl-5">
        <li>AI Chat Support Assistant</li>
        <li>Automated Ticket Triage</li>
        <li>Sentiment Analysis Tool</li>
        <li>Customer Health Predictor</li>
        <li>Personalized Outreach Generator</li>
      </ul>
    </main>
  );
}
