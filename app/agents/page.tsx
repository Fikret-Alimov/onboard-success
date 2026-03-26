"use client";
import { useState } from "react";
import EmailAuthGate from "../../components/EmailAuthGate";

export default function AgentsPage() {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <EmailAuthGate onAuthSuccess={() => setAuthenticated(true)} />;
  }

  // Real agent content here
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Agents (protected)</h1>
      <p>Welcome! You have access to the agent content.</p>
      {/* Insert agent details or retrieve dynamic content here */}
    </div>
  );
}
