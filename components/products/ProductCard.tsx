import Link from 'next/link';
import { Product } from '@/types/product';
import { ROUTES } from '@/lib/constants';
import { Star, Zap, ArrowRight, Package } from 'lucide-react';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-[#009ee3]/30 hover:shadow-xl transition-all duration-250 flex flex-col apex-card-hover">

      {/* Image / Visual area */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-slate-100 aspect-video">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={40} className="text-gray-300" />
          </div>
        )}

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wide">
              Out of Stock
            </span>
          </div>
        )}

        {/* Discount badge */}
        {discount && product.inStock && (
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-red-500 text-white text-[11px] font-extrabold px-2 py-1 rounded-full shadow-md">
              -{discount}%
            </span>
          </div>
        )}

        {/* Instant delivery badge */}
        {product.isInstantDelivery && product.inStock && (
          <div className="absolute top-2.5 right-2.5">
            <span className="flex items-center gap-1 bg-[#009ee3] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md">
              <Zap size={11} fill="currentColor" /> Instant
            </span>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">

        {/* Category + rating row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="apex-badge-blue text-[11px]">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-gray-500 flex-shrink-0">
            <Star size={11} className="fill-[#ffd700] text-[#ffd700]" />
            <span className="font-bold text-gray-700">{product.rating}</span>
            <span className="text-gray-400">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Product name */}
        <h3 className="font-bold text-[#0d1b2a] text-sm leading-snug mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        {/* Price + stock + CTA */}
        <div className="mt-auto space-y-3">
          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-[#0d1b2a]">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through font-normal">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <span
              className={`text-xs font-bold ${
                product.inStock ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              {product.inStock ? '● In Stock' : '○ Out of Stock'}
            </span>
          </div>

          <Link
            href={`${ROUTES.PRODUCTS}/${product.slug}`}
            className={`flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-150 ${
              product.inStock
                ? 'bg-[#009ee3] text-white hover:bg-[#007ec0] shadow-sm hover:shadow-md'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
            }`}
          >
            View Details
            {product.inStock && <ArrowRight size={14} />}
          </Link>
        </div>
      </div>
    </div>
  );
}
