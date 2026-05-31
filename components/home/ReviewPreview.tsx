'use client';

import { useState, useEffect } from 'react';
import { fetchReviews } from '@/lib/api';
import { Review } from '@/types/review';
import { Star, ShieldCheck } from 'lucide-react';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          className={i <= rating ? 'fill-amber-400 text-amber-400' : 'text-border fill-border'}
        />
      ))}
    </div>
  );
}

export default function ReviewPreview() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true);
        const data = await fetchReviews();
        setReviews(data.slice(0, 3));
      } catch (error) {
        console.error('Failed to load reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadReviews();
  }, []);

  return (
    <section className="py-24 bg-secondary-background border-t border-border relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 rounded-[100%] blur-[80px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-heading uppercase tracking-wider text-text-primary mb-4">
            Trusted by <span className="text-primary drop-shadow-[0_0_10px_rgba(0,158,227,0.2)]">Gamers</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto tracking-wide">
            Real feedback from verified customers across our digital product range.
          </p>
          <div className="w-16 h-[2px] bg-primary mx-auto mt-6 shadow-[0_0_10px_rgba(0,158,227,0.6)]"></div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="mp-card p-8 flex flex-col group relative"
              >
                {/* Quote Mark Decoration */}
                <div className="absolute top-6 right-6 text-6xl text-slate-200/50 font-serif leading-none group-hover:text-primary/10 transition-colors">&rdquo;</div>

                <div className="flex items-start justify-between mb-6 relative z-10">
                  <StarRating rating={review.rating} />
                </div>

                <p className="text-text-primary text-[15px] sm:text-base leading-relaxed flex-grow mb-8 relative z-10 font-medium">
                  {review.comment}
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-border relative z-10">
                  <div className="w-12 h-12 bg-slate-50 border border-border rounded-xl flex items-center justify-center text-primary font-bold font-heading text-lg group-hover:border-primary/50 group-hover:shadow-[0_0_10px_rgba(0,158,227,0.15)] transition-all">
                    {review.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-base font-bold font-heading text-text-primary tracking-wide uppercase">{review.userName}</p>
                    {review.verifiedPurchase && (
                      <p className="text-[13px] text-primary flex items-center gap-1 mt-1 font-semibold tracking-wider">
                        <ShieldCheck size={12} /> VERIFIED
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-text-secondary">
            <p>No reviews available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
