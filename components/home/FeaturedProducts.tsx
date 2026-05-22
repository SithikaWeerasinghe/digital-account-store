import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { sampleProducts } from '@/data/sampleProducts';
import ProductCard from '@/components/products/ProductCard';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProducts() {
  const featured = sampleProducts.filter((p) => p.inStock).slice(0, 4);

  return (
    <section className="py-20 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight text-gray-900">
              Featured <span className="text-[#009ee3] font-black">Digital Deals</span>
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              Handpicked premium licenses and accounts at unbeatable pricing.
            </p>
          </div>
          <Link
            href={ROUTES.PRODUCTS}
            className="flex items-center gap-1.5 text-[#009ee3] font-bold hover:gap-2.5 transition-all text-sm flex-shrink-0"
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-10 text-center sm:hidden">
          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#009ee3] text-white font-bold text-sm shadow-sm hover:bg-[#008cc9]"
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
