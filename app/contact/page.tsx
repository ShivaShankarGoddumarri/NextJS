'use client';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="mb-4">Have questions or need assistance? Reach out to us.</p>
      <div className="space-y-4">
        <p>
          <strong>Phone:</strong> (555) 123-4567
        </p>
        <p>
          <strong>Email:</strong> info@luxetrim.com
        </p>
        <p>
          <strong>Address:</strong> 123 Luxury Ave, Downtown, New York, NY 10001
        </p>
      </div>
    </div>
  );
}