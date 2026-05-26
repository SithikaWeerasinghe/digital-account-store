import Link from 'next/link';
import { Product } from '@/types/product';
import { ROUTES } from '@/lib/constants';
import { Star, Zap, Package, ShoppingCart, BadgeCheck } from 'lucide-react';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function ProductCard({ product }: { product: Product }) {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    // ── Entire card is a link ──
    <Link
      href={product.inStock ? `${ROUTES.PRODUCTS}/${product.slug}` : '#'}
      className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-primary shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,158,227,0.22)] transition-all duration-300 ease-out hover:-translate-y-1.5 h-full ${
        product.inStock ? 'cursor-pointer' : 'cursor-not-allowed'
      }`}
    >
      {/* ── Premium Blue Shine Sweep Overlay (Forward-only & Fast) ── */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-primary/8 via-white/30 via-primary/8 to-transparent -skew-x-20 -translate-x-[150%] group-hover:animate-card-shine" />
      </div>

      {/* ── Image Area ── */}
      <div className="relative overflow-hidden bg-slate-100" style={{ aspectRatio: '16/10' }}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-50">
            <Package size={36} className="text-slate-300" />
            <span className="text-xs text-slate-400 font-medium">No Image</span>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          {product.isInstantDelivery && (
            <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm border border-primary/30 text-primary text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full shadow-sm">
              <Zap size={9} className="fill-primary stroke-none" />
              Instant Delivery
            </span>
          )}
          {discountPercent && discountPercent > 0 && (
            <span className="ml-auto inline-flex items-center bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[3px] flex items-center justify-center z-10">
            <span className="inline-flex items-center gap-1.5 bg-white border border-red-200 text-red-500 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ── Card Body ── */}
      <div className="flex flex-col flex-grow p-5">

        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/8 border border-primary/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
            <BadgeCheck size={9} />
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-slate-800">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-400 font-medium">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-5 flex-grow">
          {product.description}
        </p>

        {/* Footer: Price + CTA */}
        <div className="border-t border-slate-100 pt-4 mt-auto">

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-slate-400 line-through font-medium">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* View Details — styled div (not <a> since the whole card is already a link) */}
          <div
            className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 ${
              product.inStock
                ? 'bg-white text-primary border-2 border-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_6px_20px_rgba(0,158,227,0.3)]'
                : 'bg-slate-50 text-slate-300 border-2 border-slate-100'
            }`}
          >
            <ShoppingCart size={14} />
            {product.inStock ? 'View Details' : 'Out of Stock'}
          </div>
        </div>
      </div>
    </Link>
  );
}
