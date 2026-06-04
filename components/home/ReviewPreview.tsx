'use client';

import { useState, useEffect } from 'react';
import { fetchReviews } from '@/lib/api';
import { Review } from '@/types/review';
import { Star } from 'lucide-react';

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

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch (e) {
    return dateString;
  }
};

export default function ReviewPreview() {
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const reviewsData = await fetchReviews({ type: 'website' });
        
        let displayedReviews = [...reviewsData];
        if (displayedReviews.length < 30) {
          const allReviews = await fetchReviews();
          const existingIds = new Set(displayedReviews.map(r => r.id));
          for (const r of allReviews) {
            if (displayedReviews.length >= 30) break;
            if (!existingIds.has(r.id)) {
              displayedReviews.push(r);
              existingIds.add(r.id);
            }
          }
        }

        setAllReviews(displayedReviews);
        setReviews(displayedReviews.slice(0, 9));
      } catch (error) {
        console.error('Failed to load review data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (allReviews.length === 0) return;
    
    const setSize = 9;
    if (allReviews.length <= setSize) {
      setReviews(allReviews);
      return;
    }

    const interval = setInterval(() => {
      setIsFading(true);
      
      setTimeout(() => {
        setAllReviews((prevAllReviews) => {
          const newSet: Review[] = [];
          // Shift reviews rotation: take the first item and push to the back
          const updatedAllReviews = [...prevAllReviews];
          const first = updatedAllReviews.shift();
          if (first) {
            updatedAllReviews.push(first);
          }
          
          for (let i = 0; i < setSize; i++) {
            newSet.push(updatedAllReviews[i % updatedAllReviews.length]);
          }
          setReviews(newSet);
          return updatedAllReviews;
        });
        setIsFading(false);
      }, 400);
    }, 8000); // rotate every 8 seconds

    return () => clearInterval(interval);
  }, [allReviews]);

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

        <div className="w-full">
          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-350 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="mp-card p-6 flex flex-col group relative overflow-hidden border border-border bg-card/45 h-[155px]"
                >
                  {/* Quote Mark Decoration */}
                  <div className="absolute top-4 right-4 text-5xl text-slate-200/5 font-serif leading-none group-hover:text-primary/5 transition-colors pointer-events-none">&rdquo;</div>

                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <StarRating rating={review.rating} />
                    <span className="text-[12px] text-text-secondary font-medium">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  <p className="text-text-primary text-[14px] sm:text-base leading-relaxed relative z-10 font-medium line-clamp-3 overflow-hidden text-ellipsis">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-dashed border-border rounded-3xl bg-card/20 text-text-secondary flex items-center justify-center">
              <p>No reviews available yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
