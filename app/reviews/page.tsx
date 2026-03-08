'use client';

import { useEffect, useState } from 'react';
import { reviewsApi } from '@/lib/api';
import { Review } from '@/app/types';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await reviewsApi.getReviews(20);
        setReviews(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading reviews...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Customer Reviews</h1>
      <div className="space-y-6">
        {reviews.map((r) => (
          <div key={r.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">{r.customer?.name || 'Anonymous'}</p>
              <p className="text-sm text-gray-500">{r.rating} ⭐</p>
            </div>
            <p>{r.comment}</p>
          </div>
        ))}
        {reviews.length === 0 && <p>No reviews yet.</p>}
      </div>
    </div>
  );
}