'use client';

import { useState, useEffect } from 'react';
import ReviewTable from '@/components/admin/ReviewTable';
import { fetchReviews } from '@/lib/api';
import { Review } from '@/types/review';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchReviews();
        setReviews(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch reviews');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Reviews</h1>
        <p className="text-text-secondary mt-1">Manage product reviews and feedback</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-xl">
          <h3 className="font-bold text-lg mb-1">Error Loading Reviews</h3>
          <p>{error}</p>
        </div>
      ) : reviews.length > 0 ? (
        <ReviewTable reviews={reviews} />
      ) : (
        <div className="text-center py-12 bg-white border border-border rounded-xl">
          <p className="text-text-secondary">No reviews found.</p>
        </div>
      )}
    </div>
  );
}
