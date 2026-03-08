'use client';

import { useEffect, useState } from 'react';
import { Service } from '@/app/types';
import { servicesApi } from '@/lib/api';
import Link from 'next/link';
import { Scissors, ArrowRight } from 'lucide-react';

export function ServicesPreview() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    servicesApi.getServices({ limit: 3 }).then((data) => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center">Loading services...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          From classic cuts to modern styling, we offer a complete range of premium salon services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((svc) => (
          <Link
            key={svc.id}
            href={`/services/${svc.id}`}
            className="bg-gray-800 text-white rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center mb-4">
              <Scissors className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{svc.name}</h3>
            <p className="text-gray-300 mb-4">
              {svc.description?.slice(0, 100)}
            </p>
            <p className="text-2xl font-bold text-amber-600">${svc.price}</p>
          </Link>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/services"
          className="inline-flex items-center text-amber-600 font-semibold hover:text-amber-700"
        >
          View All Services
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}