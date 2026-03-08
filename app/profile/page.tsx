'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { UserUpdate } from '@/app/types';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState<UserUpdate>({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '' });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMessage(null);
    try {
      const { data, error } = await supabase
        .from('users')
        .update(form)
        .eq('id', user.id);
      if (error) throw error;
      setMessage('Profile updated');
      await refreshUser();
    } catch (err: any) {
      setMessage((err && err.message) || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}