'use client';

import { useAuth } from '@/lib/auth-context';

export default function SettingsPage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <p>Account settings will go here.</p>
    </div>
  );
}