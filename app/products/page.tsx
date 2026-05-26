'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchProducts } from '@/lib/api';
import { Product } from '@/types/product';
import ProductCard from '@/components/products/ProductCard';
import { Search, SlidersHorizontal, Zap, Shield, Package, HeadphonesIcon } from 'lucide-react';

const CATEGORIES = ['All Products', 'Gaming', 'Streaming', 'AI Tools', 'Software', 'Productivity', 'Gift Cards'];
const SORT_OPTIONS = [
  { label: 'Newest Releases', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'popular' },
  { label: 'In Stock Only', value: 'in_stock' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'All Products');
  const [sort, setSort] = useState('newest');

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];

    if (activeCategory !== 'All Products') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
      case 'in_stock':
        result.sort((a, b) => (a.inStock === b.inStock ? 0 : a.inStock ? -1 : 1));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [search, activeCategory, sort]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Page Header */}
      <div className="bg-secondary border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-black font-heading uppercase tracking-widest text-text-primary mb-6">
            Browse Digital <span className="text-primary drop-shadow-[0_0_10px_rgba(0,158,227,0.2)]">Products</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg font-medium tracking-wide">
            Explore gaming, streaming, AI, software, and productivity products with fast delivery and simple checkout.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, categories, or keywords..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-white text-text-primary text-base font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-text-secondary/50 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 relative">
            <SlidersHorizontal size={18} className="absolute left-4 text-primary pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="pl-12 pr-10 py-3.5 rounded-xl border border-border bg-white text-text-primary text-base font-bold tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer shadow-sm min-w-[220px]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white text-text-primary">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-3 flex-wrap mb-10 pb-4 border-b border-border/50">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-200 border ${
                activeCategory === cat
                  ? 'bg-primary border-primary text-white shadow-[0_4px_12px_rgba(0,158,227,0.25)]'
                  : 'bg-white border-border text-text-secondary hover:border-primary/50 hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm sm:text-base font-medium tracking-wide text-text-secondary mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Showing <span className="text-text-primary font-bold">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'product' : 'products'}
          {activeCategory !== 'All Products' ? ` in ${activeCategory}` : ''}
          {search ? ` matching "${search}"` : ''}
        </p>

        {/* Product Grid */}
        {isLoading ? (
          <div className="py-32 text-center mp-card">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="font-bold font-heading uppercase tracking-wider text-text-primary text-xl mb-3">Loading Products...</h3>
          </div>
        ) : error ? (
          <div className="py-32 text-center mp-card border-hazard/50">
            <h3 className="font-bold font-heading uppercase tracking-wider text-hazard text-xl mb-3">Error Loading Products</h3>
            <p className="text-text-secondary tracking-wide mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mp-button-primary"
            >
              Try Again
            </button>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center mp-card">
            <div className="w-20 h-20 bg-slate-50 border border-border rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Package size={32} className="text-border" />
            </div>
            <h3 className="font-bold font-heading uppercase tracking-wider text-text-primary text-xl mb-3">No products found</h3>
            <p className="text-sm sm:text-base text-text-secondary tracking-wide mb-8">
              Try adjusting your search or selecting a different category.
            </p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All Products'); }}
              className="mp-button-primary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Trust Strip */}
        <div className="mt-20 border-t border-border pt-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, label: 'Secure Checkout', desc: 'Encrypted payment processing' },
              { icon: Zap, label: 'Instant Delivery', desc: 'Email delivery after payment' },
              { icon: HeadphonesIcon, label: 'Support Tickets', desc: 'Help available any time' },
              { icon: Package, label: 'Order Tracking', desc: 'Check your order status' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 mp-card text-center sm:text-left">
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary flex-shrink-0 shadow-[0_0_10px_rgba(0,158,227,0.1)]">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-base font-bold font-heading uppercase tracking-wide text-text-primary mb-1">{label}</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <ProductsContent />
    </Suspense>
  );
}
