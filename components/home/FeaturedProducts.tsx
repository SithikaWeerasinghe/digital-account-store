import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { sampleProducts } from '@/data/sampleProducts';
import ProductCard from '@/components/products/ProductCard';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProducts() {
  const featured = sampleProducts.filter((p) => p.inStock).slice(0, 4);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Digital Deals</h2>
            <p className="text-gray-500">Handpicked products with fast delivery and reliable support.</p>
          </div>
          <Link
            href={ROUTES.PRODUCTS}
            className="flex items-center gap-2 text-[#009ee3] font-semibold hover:gap-3 transition-all text-sm flex-shrink-0"
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#009ee3] text-white font-semibold hover:bg-[#008cc9] transition-colors"
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
