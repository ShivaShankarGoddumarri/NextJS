'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Service, AvailableSlots, AppointmentCreate } from '@/app/types';
import { servicesApi, slotsApi, appointmentsApi } from '@/lib/api';
import { CustomerRoute } from '@/components/protected-route';

export default function BookingPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const serviceId = params.get('serviceId') || undefined;

  const [service, setService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<AvailableSlots | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (serviceId) {
      servicesApi.getService(serviceId).then(setService).catch(console.error);
    } else {
      // load short list of services to choose from
      servicesApi.getServices({ limit: 10 }).then(setServices).catch(console.error);
    }
  }, [serviceId]);

  useEffect(() => {
    const fetchSlots = async () => {
      // we don't have staff logic yet, pass empty string to fetch all slots
      try {
        const available = await slotsApi.getAvailableSlots('', date);
        setSlots(available);
      } catch (err: any) {
        setError(err.message || 'Failed to load slots');
      }
    };
    fetchSlots();
  }, [date]);

  const handleBook = async () => {
    if (!user || !service) return;
    if (!selectedTime) {
      setError('Please choose a time slot');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const appointment: AppointmentCreate = {
        service_id: service.id,
        customer_id: user.id,
        appointment_date: date,
        appointment_time: selectedTime,
        // staff_id will be assigned later by admin/staff in backend
      };
      await appointmentsApi.createAppointment(appointment);
      setSuccess('Your appointment has been booked!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError((err && err.message) || JSON.stringify(err) || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerRoute>
      <div className="min-h-screen bg-black text-white px-4 py-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Book Appointment</h1>
        {!service ? (
          <div className="mb-6">
            <label className="block mb-1 font-medium">Choose a Service</label>
            <select
              value={service?.id || ''}
              onChange={(e) => {
                const id = e.target.value;
                const sel = services.find((s) => s.id === id) || null;
                setService(sel);
              }}
              className="border rounded-md p-2 w-full"
            >
              <option value="" disabled>
                Select a service
              </option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (${s.price})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">{service.name}</h2>
            <p className="text-gray-600">${service.price}</p>
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1 font-medium">Select Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-md p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <h3 className="font-medium mb-2">Available Time Slots</h3>
          {slots ? (
            <div className="grid grid-cols-3 gap-2">
              {slots.slots.map((slot) => (
                <button
                  key={slot.time}
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`py-2 px-3 rounded-lg border ${
                    selectedTime === slot.time
                      ? 'bg-amber-500 text-black'
                      : 'bg-gray-700 text-gray-300'
                  } ${!slot.available && 'opacity-50 cursor-not-allowed'}`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          ) : (
            <div>Loading slots...</div>
          )}
        </div>

        {error && <div className="text-red-600 mb-4">{error}</div>}
        {success && <div className="text-green-600 mb-4">{success}</div>}

        <button
          onClick={handleBook}
          disabled={loading || !selectedTime}
          className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition"
        >
          {loading ? 'Booking...' : 'Confirm Appointment'}
        </button>
      </div>
    </CustomerRoute>
  );
}