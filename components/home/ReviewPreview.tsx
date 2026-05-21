import { sampleReviews } from '@/data/sampleReviews';
import { Star, BadgeCheck } from 'lucide-react';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

export default function ReviewPreview() {
  const reviews = sampleReviews.slice(0, 3);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Trusted by Digital Buyers</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Real feedback from verified customers across our product range.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-50 rounded-2xl border border-gray-100 p-6 flex flex-col hover:border-[#009ee3]/30 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <StarRating rating={review.rating} />
                {review.verifiedPurchase && (
                  <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                    <BadgeCheck size={14} /> Verified
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed flex-grow mb-5">
                &ldquo;{review.comment}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className="w-9 h-9 bg-[#009ee3]/10 rounded-full flex items-center justify-center text-[#009ee3] font-bold text-sm">
                  {review.userName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{review.userName}</p>
                  <p className="text-xs text-gray-400">Verified Buyer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
