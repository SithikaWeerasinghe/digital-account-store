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
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-[#009ee3]/40 hover:shadow-lg transition-all duration-200 flex flex-col">
      {/* Image area */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 aspect-video">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={40} className="text-gray-300" />
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
        {discount && product.inStock && (
          <div className="absolute top-2 left-2">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          </div>
        )}
        {product.isInstantDelivery && (
          <div className="absolute top-2 right-2">
            <span className="flex items-center gap-1 bg-[#009ee3] text-white text-xs font-medium px-2 py-0.5 rounded-full">
              <Zap size={11} /> Instant
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <span className="text-xs font-medium text-[#009ee3] bg-blue-50 px-2 py-0.5 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-gray-700">{product.rating}</span>
            <span>({product.reviewsCount})</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-3">
            <div>
              <span className="text-xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <span className="ml-1.5 text-sm text-gray-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <span className={`text-xs font-medium ${product.inStock ? 'text-emerald-600' : 'text-red-500'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <Link
            href={`${ROUTES.PRODUCTS}/${product.slug}`}
            className={`flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
              product.inStock
                ? 'bg-[#009ee3] text-white hover:bg-[#008cc9]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
            }`}
          >
            View Details
            {product.inStock && <ArrowRight size={15} />}
          </Link>
        </div>
      </div>
    </div>
  );
}
