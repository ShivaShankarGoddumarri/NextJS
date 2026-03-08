'use client';

import { AdminRoute } from '@/components/protected-route';

export default function AdminPage() {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-white px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <p>Coming soon: view stats, manage staff, services, and users.</p>
      </div>
    </AdminRoute>
  );
}