'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Service } from '@/app/types';
import { servicesApi } from '@/lib/api';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await servicesApi.getServices();
        setServices(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading services...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold text-center py-8">Our Services</h1>
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => (
          <Link
            key={svc.id}
            href={`/services/${svc.id}`}
            className="block bg-gray-50 rounded-lg p-6 hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-semibold mb-2">{svc.name}</h2>
            <p className="text-gray-600 mb-4">
              {svc.description?.slice(0, 100)}
            </p>
            <p className="text-amber-600 font-bold">${svc.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}