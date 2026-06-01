import Link from 'next/link';
import { Product } from '@/types/product';
import { ROUTES } from '@/lib/constants';
import { Star, Zap, Package, BadgeCheck, ArrowRight } from 'lucide-react';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(n);
}

export default function ProductCard({ product }: { product: Product }) {
  const discountPercent = null;

  return (
    // ── Entire card is a link ──
    <Link
      href={product.inStock ? `${ROUTES.PRODUCTS}/${product.slug}` : '#'}
      className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-primary shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(0,158,227,0.12)] transition-all duration-300 ease-out hover:-translate-y-1 h-full ${
        product.inStock ? 'cursor-pointer' : 'cursor-not-allowed'
      }`}
    >
      {/* Subtle corner accent highlights */}
      <div className="corner-accent absolute inset-0 pointer-events-none z-30 rounded-2xl" />

      {/* ── Premium Blue Shine Sweep Overlay (Forward-only & Fast) ── */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-primary/5 via-white/20 via-primary/5 to-transparent -skew-x-20 -translate-x-[150%] group-hover:animate-card-shine" />
      </div>

      <div className="relative overflow-hidden bg-white border-b border-slate-100" style={{ aspectRatio: '1.35/1' }}>
        {product.imageUrl ? (
          <div className="w-full h-full relative overflow-hidden flex items-center justify-center p-3">
            <img
              src={product.imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
            />
            <img
              src={product.imageUrl}
              alt={product.name}
              className="relative w-full h-full object-contain z-10 transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 relative">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,158,227,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,158,227,0.03)_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />
            <Package size={32} className="text-primary/40 animate-pulse" />
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">APEX_LICENSE</span>
          </div>
        )}

        {/* Subtle gradient overlay at the bottom for blending */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />



        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="inline-flex items-center gap-1.5 bg-white border border-red-200 text-red-500 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ── Card Body ── */}
      <div className="flex flex-col flex-grow p-4 sm:p-5">

        {/* Rating */}
        <div className="flex items-center justify-end mb-2">
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-amber-500 text-amber-500" />
            <span className="text-xs font-bold text-slate-800">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-slate-400 font-medium">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-extrabold text-slate-900 text-base leading-snug mb-1.5 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        {/* Cleaner Metadata Box */}
        <div className="border-t border-slate-100 pt-3 pb-3 text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">
          <div className="flex items-center gap-1.5 bg-slate-50/50 border border-slate-100 rounded-lg p-1.5 justify-center">
            <BadgeCheck size={11} className="text-emerald-500" />
            <span className="truncate">SECURITY: 100% GUARANTEED</span>
          </div>
        </div>

        {/* Footer: Price + CTA */}
        <div className="border-t border-slate-100 pt-3.5 mt-auto">

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* View Details button */}
          <div
            className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 border ${
              product.inStock
                ? 'bg-white text-primary border-primary hover:bg-primary hover:text-white hover:border-primary hover:shadow-[0_4px_16px_rgba(0,158,227,0.2)]'
                : 'bg-slate-50 text-slate-300 border-slate-100'
            }`}
          >
            <span>{product.inStock ? 'View Details' : 'Out of Stock'}</span>
            {product.inStock && (
              <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
