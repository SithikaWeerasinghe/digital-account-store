import { sampleReviews } from '@/data/sampleReviews';
import { sampleProducts } from '@/data/sampleProducts';
import { Star, BadgeCheck, Quote } from 'lucide-react';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= rating ? 'fill-[#ffd700] text-[#ffd700]' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

export default function ReviewPreview() {
  const reviews = sampleReviews.slice(0, 3);

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="apex-badge-blue mb-3 inline-flex">Customer Reviews</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d1b2a] mb-3 tracking-tight">
            Trusted by Digital Buyers
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            Real feedback from verified customers across our product range.
          </p>

          {/* Summary stats */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={18} className="fill-[#ffd700] text-[#ffd700]" />
              ))}
            </div>
            <span className="text-lg font-extrabold text-[#0d1b2a]">4.8</span>
            <span className="text-gray-400 text-sm">Average from {sampleReviews.length}+ reviews</span>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => {
            const product = sampleProducts.find(p => p.id === review.productId);
            return (
              <div
                key={review.id}
                className="relative bg-gray-50 rounded-2xl border border-gray-100 p-6 flex flex-col hover:border-[#009ee3]/25 hover:shadow-lg transition-all duration-200"
              >
                {/* Quote icon */}
                <div className="absolute top-5 right-5 text-[#009ee3]/10">
                  <Quote size={36} fill="currentColor" />
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between mb-4">
                  <StarRating rating={review.rating} />
                  {review.verifiedPurchase && (
                    <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                      <BadgeCheck size={13} /> Verified
                    </span>
                  )}
                </div>

                {/* Comment */}
                <p className="text-gray-600 text-sm leading-relaxed flex-grow mb-5 relative z-10">
                  &ldquo;{review.comment}&rdquo;
                </p>

                {/* Product tag */}
                {product && (
                  <span className="apex-badge-blue text-[10px] mb-4 w-fit">
                    {product.name}
                  </span>
                )}

                {/* Reviewer */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#009ee3] to-[#0066cc] rounded-full flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">
                    {review.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0d1b2a]">{review.userName}</p>
                    <p className="text-xs text-gray-400">Verified Buyer</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
