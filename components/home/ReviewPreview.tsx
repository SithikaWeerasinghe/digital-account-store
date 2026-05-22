import { sampleReviews } from '@/data/sampleReviews';
import { Star, BadgeCheck } from 'lucide-react';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          className={
            i <= rating
              ? 'fill-[#FACC15] text-[#FACC15] drop-shadow-[0_0_4px_rgba(250,204,21,0.5)]'
              : 'text-[#25253A] fill-[#25253A]'
          }
        />
      ))}
    </div>
  );
}

export default function ReviewPreview() {
  const reviews = sampleReviews.slice(0, 3);

  return (
    <section className="py-20 bg-[#0B0B12] relative">
      <div className="neon-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center mb-12">
          <span className="section-label mb-4 inline-flex">Reviews</span>
          <h2
            className="text-3xl sm:text-4xl font-black uppercase text-white mt-4 mb-3 tracking-wide"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Trusted by Digital Buyers
          </h2>
          <p className="text-[#A1A1AA] max-w-xl mx-auto text-sm">
            Real feedback from verified customers across our product range.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group bg-[#11111A] rounded-xl border border-[#25253A] p-6 flex flex-col hover:border-[#8B5CF6]/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(139,92,246,0.1)] transition-all duration-300 relative overflow-hidden"
            >
              {/* Top glow on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-start justify-between mb-4">
                <StarRating rating={review.rating} />
                {review.verifiedPurchase && (
                  <span className="flex items-center gap-1 text-[#22C55E] text-[10px] font-bold tracking-wider uppercase drop-shadow-[0_0_4px_rgba(34,197,94,0.4)]">
                    <BadgeCheck size={13} /> Verified
                  </span>
                )}
              </div>

              <p className="text-[#A1A1AA] text-sm leading-relaxed flex-grow mb-5 italic">
                &ldquo;{review.comment}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-[#25253A]">
                <div className="w-9 h-9 bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(139,92,246,0.3)] flex-shrink-0">
                  {review.userName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{review.userName}</p>
                  <p className="text-[10px] text-[#6B7280] uppercase tracking-wider">Verified Buyer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
