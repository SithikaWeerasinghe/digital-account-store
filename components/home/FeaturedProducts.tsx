import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { sampleProducts } from '@/data/sampleProducts';
import ProductCard from '@/components/products/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FeaturedProducts() {
  const featured = sampleProducts.filter((p) => p.inStock).slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-[#f0f4f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="apex-badge-blue mb-3 inline-flex">
              <Sparkles size={11} /> Featured Deals
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d1b2a] mb-2 tracking-tight">
              Featured Digital Products
            </h2>
            <p className="text-gray-500 text-base">
              Handpicked products with fast delivery and reliable support.
            </p>
          </div>
          <Link
            href={ROUTES.PRODUCTS}
            className="flex items-center gap-1.5 text-[#009ee3] font-bold hover:gap-2.5 transition-all text-sm flex-shrink-0 group"
          >
            View All Products <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#009ee3] text-white font-bold hover:bg-[#007ec0] transition-colors shadow-md"
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
