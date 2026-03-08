'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Service } from '@/app/types';
import { servicesApi } from '@/lib/api';
import Link from 'next/link';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      try {
        const data = await servicesApi.getService(id);
        setService(data);
      } catch (err: any) {
        setError(err.message || 'Service not found');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-white">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!service) return null;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <button onClick={() => router.back()} className="mb-4 text-amber-600 hover:underline">
        &larr; Back to services
      </button>
      <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
      <p className="text-gray-300 mb-6">{service.description}</p>
      <p className="text-amber-600 font-bold text-2xl mb-6">${service.price}</p>
      <Link
        href={`/booking?serviceId=${service.id}`}
        className="bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
      >
        Book This Service
      </Link>
    </div>
  );
}