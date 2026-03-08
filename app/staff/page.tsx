'use client';

import { StaffRoute } from '@/components/protected-route';

export default function StaffPage() {
  return (
    <StaffRoute>
      <div className="min-h-screen bg-black text-white px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Staff Dashboard</h1>
        <p>Coming soon: view your schedule, manage appointments, and more.</p>
      </div>
    </StaffRoute>
  );
}