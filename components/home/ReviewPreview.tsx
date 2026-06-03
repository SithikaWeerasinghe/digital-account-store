'use client';

import { useState, useEffect } from 'react';
import { fetchReviews, fetchProducts, createReview } from '@/lib/api';
import { Review } from '@/types/review';
import { Product } from '@/types/product';
import { Star, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

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

const getAvatarGradient = (name: string) => {
  const gradients = [
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-500',
    'from-emerald-400 to-teal-600',
    'from-amber-400 to-orange-500',
    'from-rose-500 to-red-600',
    'from-cyan-500 to-blue-600'
  ];
  let hash = 0;
  const cleanName = name || 'Anonymous';
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

export default function ReviewPreview() {
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [setIndex, setSetIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [formComment, setFormComment] = useState('');
  const [formProduct, setFormProduct] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [reviewsData, productsData] = await Promise.all([
          fetchReviews({ type: 'website' }),
          fetchProducts()
        ]);
        
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
        setReviews(displayedReviews.slice(0, 10));
        setProductsList(productsData);
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
    
    const setSize = 10;
    if (allReviews.length <= setSize) {
      setReviews(allReviews);
      return;
    }

    const interval = setInterval(() => {
      setIsFading(true);
      
      setTimeout(() => {
        setSetIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          const start = (nextIndex * setSize) % allReviews.length;
          
          const newSet: Review[] = [];
          for (let i = 0; i < setSize; i++) {
            newSet.push(allReviews[(start + i) % allReviews.length]);
          }
          
          setReviews(newSet);
          return nextIndex;
        });
        setIsFading(false);
      }, 400);
    }, 35000);

    return () => clearInterval(interval);
  }, [allReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setSubmitError('Name is required');
      return;
    }
    if (!formComment.trim()) {
      setSubmitError('Comment is required');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const emailVal = formEmail.trim() || 'visitor@apexfled.com';
      const formattedEmail = `${emailVal}|${formName.trim()}`;

      await createReview({
        rating: formRating,
        comment: formComment.trim(),
        customer_email: formattedEmail,
        product_id: formProduct || undefined,
      });

      setSubmitSuccess(true);
      setFormName('');
      setFormEmail('');
      setFormRating(5);
      setFormComment('');
      setFormProduct('');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* LEFT: Reviews Grid (Takes 2 columns) */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex justify-center items-center py-24 h-full">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : reviews.length > 0 ? (
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-350 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
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
              <div className="text-center py-24 border border-dashed border-border rounded-3xl bg-card/20 text-text-secondary h-full flex items-center justify-center">
                <p>No reviews available yet. Be the first to leave one!</p>
              </div>
            )}
          </div>

          {/* RIGHT: Write a Review Form (Takes 1 column) */}
          <div className="lg:col-span-1 h-full">
            <div className="mp-card p-8 bg-card/50 backdrop-blur-md border border-border rounded-3xl relative overflow-hidden shadow-2xl h-full flex flex-col justify-center">
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

              {submitSuccess ? (
                <div className="text-center py-8 px-2 flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 bg-success/15 border border-success/30 rounded-2xl flex items-center justify-center mb-6 text-success animate-bounce shadow-md">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-black font-heading uppercase tracking-widest text-text-primary mb-2">
                    Review Submitted!
                  </h3>
                  <p className="text-sm text-text-secondary font-medium mb-6 leading-relaxed">
                    Thank you for your feedback! Your review has been submitted successfully and will appear on the store once approved.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="text-xs font-black font-heading tracking-widest uppercase text-primary hover:text-primary-hover border-b border-primary/30 hover:border-primary transition-all pb-0.5 cursor-pointer"
                  >
                    Submit Another Review
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2.5 mb-6">
                    <h3 className="text-xl sm:text-2xl font-black font-heading uppercase tracking-wider text-text-primary whitespace-nowrap">
                      Leave a Review
                    </h3>
                    <Sparkles size={22} className="text-primary shrink-0" />
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black tracking-wider uppercase text-text-secondary mb-2">
                        Your Rating
                      </label>
                      <div className="flex gap-1.5 items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setFormRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="focus:outline-none transition-all duration-150 transform hover:scale-125 cursor-pointer"
                          >
                            <Star
                              size={22}
                              className={`${
                                star <= (hoverRating ?? formRating)
                                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]'
                                  : 'text-border fill-transparent'
                              } transition-colors`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black tracking-wider uppercase text-text-secondary mb-2">
                        Product / Category
                      </label>
                      <select
                        value={formProduct}
                        onChange={(e) => setFormProduct(e.target.value)}
                        className="w-full bg-secondary-background border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary/50 transition-all font-medium cursor-pointer"
                      >
                        <option value="">General Store / Website</option>
                        {productsList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black tracking-wider uppercase text-text-secondary mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Jane Doe"
                        className="w-full bg-secondary-background border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder-text-secondary/35 focus:outline-none focus:border-primary/50 transition-all font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black tracking-wider uppercase text-text-secondary mb-2">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="e.g. jane@example.com"
                        className="w-full bg-secondary-background border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder-text-secondary/35 focus:outline-none focus:border-primary/50 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black tracking-wider uppercase text-text-secondary mb-2">
                        Your Feedback
                      </label>
                      <textarea
                        value={formComment}
                        onChange={(e) => setFormComment(e.target.value)}
                        placeholder="Tell us what you think..."
                        rows={3}
                        className="w-full bg-secondary-background border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder-text-secondary/35 focus:outline-none focus:border-primary/50 transition-all font-medium resize-none"
                        required
                      />
                    </div>

                    {submitError && (
                      <p className="text-xs font-bold text-red-500 mt-2">{submitError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary-hover text-white font-black font-heading text-sm tracking-widest uppercase py-3.5 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Sparkles size={13} /> Submit Review
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
