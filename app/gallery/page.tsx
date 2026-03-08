'use client';

import { useEffect, useState } from 'react';
import { Gallery } from '@/app/types';
import { galleryApi } from '@/lib/api';

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await galleryApi.getGallery();
        setPhotos(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading gallery...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-lg">
            <img src={p.image_url} alt={p.description || 'Gallery image'} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}