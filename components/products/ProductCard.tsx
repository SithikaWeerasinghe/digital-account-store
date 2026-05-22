import Link from 'next/link';
import { Product } from '@/types/product';
import { ROUTES } from '@/lib/constants';
import { Star, Zap, ArrowRight, Package } from 'lucide-react';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-[#009ee3]/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image area */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 aspect-video border-b border-gray-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={40} className="text-gray-300" />
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
        {discount && product.inStock && (
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
              -{discount}%
            </span>
          </div>
        )}
        {product.isInstantDelivery && (
          <div className="absolute top-2.5 right-2.5">
            <span className="flex items-center gap-1 bg-[#009ee3] text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
              <Zap size={11} className="fill-white" /> Instant
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-[#009ee3] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100/50">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
            <Star size={13} className="fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-700">{product.rating}</span>
            <span>({product.reviewsCount})</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug mb-2 line-clamp-2 group-hover:text-[#009ee3] transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-5 flex-grow">
          {product.description}
        </p>

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <span className="text-xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <span className="ml-1.5 text-sm text-gray-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${product.inStock ? 'text-emerald-600' : 'text-red-500'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <Link
            href={`${ROUTES.PRODUCTS}/${product.slug}`}
            className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              product.inStock
                ? 'bg-[#009ee3] text-white hover:bg-[#008cc9] hover:shadow-md'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
            }`}
          >
            View Details
            {product.inStock && <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />}
          </Link>
        </div>
      </div>
    </div>
  );
}
