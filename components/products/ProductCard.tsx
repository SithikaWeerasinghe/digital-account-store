import Link from 'next/link';
import { Product } from '@/types/product';
import { ROUTES } from '@/lib/constants';
import { Star, Zap, Package, Gamepad2, Tv, Bot, Cpu, Briefcase, Gift } from 'lucide-react';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Gaming: Gamepad2,
  Streaming: Tv,
  'AI Tools': Bot,
  Software: Cpu,
  Productivity: Briefcase,
  'Gift Cards': Gift,
};

const categoryColors: Record<string, string> = {
  Gaming: 'from-[#7C3AED] to-[#A855F7]',
  Streaming: 'from-[#6D28D9] to-[#8B5CF6]',
  'AI Tools': 'from-[#5B21B6] to-[#7C3AED]',
  Software: 'from-[#4C1D95] to-[#6D28D9]',
  Productivity: 'from-[#8B5CF6] to-[#A855F7]',
  'Gift Cards': 'from-[#A855F7] to-[#C084FC]',
};

export default function ProductCard({ product }: { product: Product }) {
  const CategoryIcon = categoryIcons[product.category] ?? Package;
  const gradientColor = categoryColors[product.category] ?? 'from-[#8B5CF6] to-[#A855F7]';
  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group flex flex-col bg-[#11111A] rounded-xl border border-[#25253A] hover:border-[#8B5CF6]/50 hover:bg-[#16161F] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(139,92,246,0.15)] transition-all duration-300 relative overflow-hidden">

      {/* Neon top edge — always subtly visible, intensifies on hover */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/40 to-transparent group-hover:via-[#A855F7] transition-all duration-300" />

      {/* Image / Icon area */}
      <div className={`relative h-40 bg-gradient-to-br ${gradientColor} flex items-center justify-center overflow-hidden flex-shrink-0`}>
        {/* Decorative grid pattern inside image */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px',
          }}
        />
        <CategoryIcon size={48} className="text-white/80 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-[#050509]/75 backdrop-blur-sm flex items-center justify-center">
            <span className="badge-red">Out of Stock</span>
          </div>
        )}

        {/* Discount badge */}
        {discountPct > 0 && product.inStock && (
          <div className="absolute top-3 left-3">
            <span className="bg-[#EF4444] text-white text-[10px] font-black px-2 py-1 rounded-md tracking-wider">
              -{discountPct}%
            </span>
          </div>
        )}

        {/* Instant badge */}
        {product.isInstantDelivery && product.inStock && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 bg-[#22C55E]/20 backdrop-blur-sm border border-[#22C55E]/40 text-[#22C55E] text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-md shadow-[0_0_8px_rgba(34,197,94,0.2)]">
              <Zap size={10} className="fill-[#22C55E]" /> Instant
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <span className="badge-purple">{product.category}</span>
          <div className="flex items-center gap-1 text-xs">
            <Star size={12} className="fill-[#FACC15] text-[#FACC15] drop-shadow-[0_0_4px_rgba(250,204,21,0.5)]" />
            <span className="font-bold text-white">{product.rating}</span>
            <span className="text-[#6B7280]">({product.reviewsCount})</span>
          </div>
        </div>

        <h3
          className="font-bold text-white text-sm mb-2 leading-snug group-hover:text-[#A855F7] transition-colors line-clamp-2"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          {product.name}
        </h3>

        <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2 mb-5 flex-grow">
          {product.description}
        </p>

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <span
                className="text-xl font-black text-white tracking-wide"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="ml-2 text-xs text-[#6B7280] line-through font-medium">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] font-bold tracking-widest uppercase ${
                product.inStock
                  ? 'text-[#22C55E] drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]'
                  : 'text-[#EF4444]'
              }`}
            >
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <Link
            href={`${ROUTES.PRODUCTS}/${product.slug}`}
            className={`flex items-center justify-center w-full py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
              product.inStock
                ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/40 hover:bg-[#8B5CF6] hover:text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:border-[#8B5CF6]'
                : 'bg-[#25253A]/50 text-[#6B7280] cursor-not-allowed pointer-events-none border border-[#25253A]'
            }`}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
