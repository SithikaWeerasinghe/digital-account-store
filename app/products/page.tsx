'use client';

import { useState, useMemo } from 'react';
import { sampleProducts } from '@/data/sampleProducts';
import ProductCard from '@/components/products/ProductCard';
import { Search, SlidersHorizontal, Zap, Shield, Package, HeadphonesIcon, X } from 'lucide-react';

const CATEGORIES = ['All', 'Streaming', 'AI Tools', 'Gaming', 'Software', 'Productivity', 'Gift Cards'];
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'In Stock First', value: 'in_stock' },
];

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sort, setSort] = useState('newest');

  const filtered = useMemo(() => {
    let result = [...sampleProducts];

    if (activeCategory !== 'All') {
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

  const clearFilters = () => {
    setSearch('');
    setActiveCategory('All');
    setSort('newest');
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8]">

      {/* Page Hero Banner */}
      <div className="bg-[#ffd700] px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-[#0059a6] via-[#009ee3] to-[#00b8f0] rounded-2xl px-8 py-10 text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/25 rounded-full px-3 py-1 text-xs font-semibold mb-4">
                <Zap size={11} fill="currentColor" /> All Products
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
                Browse Digital Products
              </h1>
              <p className="text-white/80 text-base leading-relaxed">
                Search trusted digital products with fast delivery and clear support. All categories available.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search + Sort bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-grow">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name, category, or description..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#009ee3]/25 focus:border-[#009ee3] transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <SlidersHorizontal size={15} className="text-gray-400 flex-shrink-0" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#009ee3]/25 focus:border-[#009ee3] transition-all appearance-none cursor-pointer text-gray-700 font-medium"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 whitespace-nowrap border ${
                activeCategory === cat
                  ? 'bg-[#009ee3] text-white border-[#009ee3] shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#009ee3]/40 hover:text-[#009ee3]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            Showing{' '}
            <span className="font-bold text-[#0d1b2a]">{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'product' : 'products'}
            {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
            {search ? ` matching "${search}"` : ''}
          </p>
          {(search || activeCategory !== 'All' || sort !== 'newest') && (
            <button
              onClick={clearFilters}
              className="text-xs text-[#009ee3] font-semibold hover:underline flex items-center gap-1"
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-gray-300" />
            </div>
            <h3 className="font-bold text-gray-700 mb-2">No products found</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
              Try adjusting your search term or selecting a different category.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#009ee3] text-white text-sm font-bold hover:bg-[#007ec0] transition-colors shadow-sm"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Trust strip */}
        <div className="mt-16 pt-10 border-t border-gray-200">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, label: 'Secure Checkout', desc: 'Encrypted payment processing' },
              { icon: Zap, label: 'Instant Delivery', desc: 'Email delivery after payment' },
              { icon: HeadphonesIcon, label: 'Support Tickets', desc: 'Help available any time' },
              { icon: Package, label: 'Verified Stock', desc: 'Quality checked products' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-[#009ee3] flex-shrink-0">
                  <Icon size={17} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0d1b2a]">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
