import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { sampleProducts } from '@/data/sampleProducts';
import ProductCard from '@/components/products/ProductCard';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProducts() {
  const featured = sampleProducts.filter((p) => p.inStock).slice(0, 4);

  return (
    <section className="py-20 bg-[#050509] relative">
      <div className="neon-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="section-label mb-4 inline-flex">Hot Deals</span>
            <h2
              className="text-3xl sm:text-4xl font-black uppercase text-white mt-4 mb-2 tracking-wide"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Featured Digital Deals
            </h2>
            <p className="text-[#A1A1AA] text-sm">
              Handpicked products with fast delivery and reliable support.
            </p>
          </div>
          <Link
            href={ROUTES.PRODUCTS}
            className="flex items-center gap-2 text-[#8B5CF6] font-bold hover:text-[#A855F7] hover:gap-3 transition-all text-sm tracking-wider uppercase flex-shrink-0 group"
          >
            View All Products
            <ArrowRight size={16} className="group-hover:drop-shadow-[0_0_6px_rgba(168,85,247,0.8)] transition-all" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-10 text-center sm:hidden">
          <Link href={ROUTES.PRODUCTS} className="mp-button-primary px-8 py-3">
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
