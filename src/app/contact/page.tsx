"use client";

export default function ContactPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-semibold mb-6">Contact Us</h1>
      <p className="mb-6">Have questions or want to get in touch? Use the form below.</p>
      <form onSubmit={(e) => { e.preventDefault(); console.log('Form submitted'); alert('Thank you for reaching out!'); }} className="flex flex-col max-w-md gap-4">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required className="p-2 border rounded" />
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={4} required className="p-2 border rounded" />
        <button type="submit" className="bg-blue-900 text-white py-2 rounded hover:bg-blue-800">Send</button>
      </form>
    </main>
  );
}
