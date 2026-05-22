import Link from 'next/link';
import { Product } from '@/types/product';
import { ROUTES } from '@/lib/constants';
import { Star, Zap, Package } from 'lucide-react';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="mp-card group flex flex-col relative overflow-hidden">
      {/* Decorative top border glow */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Image area */}
      <div className="relative overflow-hidden aspect-[4/3] bg-[#0A0A0F]">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={40} className="text-border" />
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent"></div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-destructive text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase">
              Out of Stock
            </span>
          </div>
        )}
        
        {product.isInstantDelivery && (
          <div className="absolute top-3 right-3 z-10">
            <span className="flex items-center gap-1.5 bg-primary/20 backdrop-blur-md border border-primary/50 text-white text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.3)]">
              <Zap size={12} className="text-accent" /> Instant
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary border border-primary/30 px-2 py-1 rounded-md bg-primary/5">
            {product.category}
          </span>
          <div className="flex items-center gap-1.5 text-xs">
            <Star size={14} className="fill-warning text-warning drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" />
            <span className="font-bold text-white">{product.rating}</span>
            <span className="text-text-secondary">({product.reviewsCount})</span>
          </div>
        </div>

        <h3 className="font-bold font-[family-name:var(--font-heading)] text-white text-lg tracking-wide mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-6 flex-grow">
          {product.description}
        </p>

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-5">
            <div>
              <span className="text-2xl font-black font-[family-name:var(--font-heading)] text-white tracking-wider">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <span className="ml-2 text-sm text-text-secondary line-through font-medium">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <span className={`text-xs font-bold tracking-widest uppercase ${product.inStock ? 'text-success drop-shadow-[0_0_5px_rgba(34,197,94,0.4)]' : 'text-destructive'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <Link
            href={`${ROUTES.PRODUCTS}/${product.slug}`}
            className={`flex items-center justify-center w-full py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
              product.inStock
                ? 'bg-primary/10 text-primary border border-primary/50 hover:bg-primary hover:text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                : 'bg-border/50 text-text-secondary cursor-not-allowed pointer-events-none'
            }`}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
