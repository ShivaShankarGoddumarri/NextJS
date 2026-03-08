'use client';

import { useEffect, useState } from 'react';
import { Service, ServiceCreate, ServiceUpdate } from '@/app/types';
import { servicesApi } from '@/lib/api';
import { AdminRoute } from '@/components/protected-route';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceCreate>({
    name: '',
    description: '',
    price: 0,
    duration: 0,
    category: '',
    gender: '',
    is_active: true,
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await servicesApi.getServices({ limit: 100 });
        setServices(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'price' || name === 'duration' ? Number(value) : value,
    } as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await servicesApi.createService(form);
      setServices((prev) => [created, ...prev]);
      setForm({
        name: '',
        description: '',
        price: 0,
        duration: 0,
        category: '',
        gender: '',
        is_active: true,
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-white px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Manage Services</h1>
        {error && <p className="text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Duration (min)</label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Category</label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md p-2"
              >
                <option value="">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <button className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-black rounded-lg">
            Add Service
          </button>
        </form>

        <div>
          {loading ? (
            <p>Loading services...</p>
          ) : (
            <div className="space-y-4">
              {services.map((svc) => (
                <div key={svc.id} className="border p-4 rounded">
                  <h2 className="font-semibold">{svc.name}</h2>
                  <p>${svc.price} • {svc.duration} min</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminRoute>
  );
}