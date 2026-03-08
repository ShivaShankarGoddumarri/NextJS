'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { appointmentsApi } from '@/lib/api';
import { Appointment } from '@/app/types';
import { CustomerRoute } from '@/components/protected-route';

export default function DashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      try {
        const data = await appointmentsApi.getAppointments({
          customer_id: user.id
        });
        setAppointments(data);
      } catch (err: any) {
        setError((err && err.message) || JSON.stringify(err) || 'Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const cancel = async (id: string) => {
    try {
      await appointmentsApi.cancelAppointment(id);
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CustomerRoute>
      <div className="min-h-screen bg-black text-white px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Appointments</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <div key={appt.id} className="p-4 border rounded-lg">
                <p className="font-medium">Booking ID: {appt.booking_id}</p>
                <p>
                  {appt.appointment_date} @ {appt.appointment_time}
                </p>
                <p>Service: {appt.service?.name}</p>
                <p>Status: {appt.status}</p>
                {appt.status !== 'cancelled' && (
                  <button
                    onClick={() => cancel(appt.id)}
                    className="mt-2 text-red-600 hover:underline"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
            {appointments.length === 0 && <p>No appointments yet.</p>}
          </div>
        )}
      </div>
    </CustomerRoute>
  );
}