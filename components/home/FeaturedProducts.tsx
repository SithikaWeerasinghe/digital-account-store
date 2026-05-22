import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { sampleProducts } from '@/data/sampleProducts';
import ProductCard from '@/components/products/ProductCard';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProducts() {
  const featured = sampleProducts.filter((p) => p.inStock).slice(0, 4);

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider text-white mb-3">
              Featured <span className="text-primary drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">Deals</span>
            </h2>
            <p className="text-text-secondary font-medium tracking-wide">Premium digital products with instant access.</p>
          </div>
          <Link
            href={ROUTES.PRODUCTS}
            className="flex items-center gap-2 text-white font-bold tracking-widest uppercase hover:text-primary hover:gap-3 transition-all duration-300 text-sm flex-shrink-0"
          >
            View All Products <ArrowRight size={18} className="text-primary" />
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
            className="mp-button-primary inline-flex"
          >
            View All Products <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
