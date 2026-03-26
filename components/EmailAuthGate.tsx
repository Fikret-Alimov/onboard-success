import { useState } from 'react';

export default function EmailAuthGate({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      // Here you would implement backend call to send verification email or check allowed list
      // For demo, just accept any email and call onAuthSuccess
      setSubmitted(true);

      // Simulate async validation
      setTimeout(() => {
        onAuthSuccess();
      }, 1000);
    } catch (err) {
      setError('Failed to authenticate email. Please try again.');
    }
  };

  if (submitted) {
    return <p>Thank you! Checking access...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6 border rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Please enter your email to access this content</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full p-2 mb-2 border rounded"
        required
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
}
