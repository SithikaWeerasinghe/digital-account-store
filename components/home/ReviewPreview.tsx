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
  // Duplicate reviews array to create a seamless infinite scrolling loop
  const marqueeReviews = [...sampleReviews, ...sampleReviews];

  return (
    <section className="py-20 bg-gray-50 text-gray-900 border-t border-gray-200/50 relative overflow-hidden">
      {/* Decorative gradient radial */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-[#009ee3]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">
            Trusted by <span className="text-[#009ee3] font-black">Digital Buyers</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Real feedback from verified buyers across our range of digital premium goods.
          </p>
        </div>
      </div>

      {/* Infinite scrolling marquee track */}
      <div className="relative w-full flex overflow-x-hidden py-4 border-y border-gray-200 bg-gray-100/20 pointer-events-auto group">
        
        {/* Left/Right fading edge overlays for premium look */}
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

        {/* Marquee Inner - Row 1 */}
        <div className="flex gap-6 animate-marquee-scroll shrink-0 min-w-full group-hover:[animation-play-state:paused] pr-6">
          {marqueeReviews.map((review, i) => (
            <div
              key={`${review.id}-${i}`}
              className="w-[320px] shrink-0 bg-white border border-gray-200 shadow-sm p-6 rounded-2xl flex flex-col justify-between hover:border-[#009ee3]/30 hover:shadow-md transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <StarRating rating={review.rating} />
                  {review.verifiedPurchase && (
                    <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                      <BadgeCheck size={14} className="text-emerald-600" /> Verified
                    </span>
                  )}
                </div>

                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-auto">
                <div className="w-8 h-8 bg-blue-50 text-[#009ee3] border border-blue-100/50 rounded-full flex items-center justify-center font-extrabold text-xs">
                  {review.userName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">{review.userName}</p>
                  <p className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">Verified Buyer</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
