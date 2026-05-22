'use client';

import { useState, useMemo } from 'react';
import { sampleProducts } from '@/data/sampleProducts';
import ProductCard from '@/components/products/ProductCard';
import { Search, SlidersHorizontal, Package, Shield, Zap, HeadphonesIcon } from 'lucide-react';

const CATEGORIES = ['All Products', 'Gaming', 'Streaming', 'AI Tools', 'Software', 'Productivity', 'Gift Cards'];
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'In Stock Only', value: 'in_stock' },
];

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [sort, setSort] = useState('newest');

  const filtered = useMemo(() => {
    let result = [...sampleProducts];

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
      case 'price_asc':  result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'popular':    result.sort((a, b) => b.reviewsCount - a.reviewsCount); break;
      case 'in_stock':   result.sort((a, b) => (a.inStock === b.inStock ? 0 : a.inStock ? -1 : 1)); break;
      default:           result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [search, activeCategory, sort]);

  return (
    <div className="min-h-screen bg-[#050509]">

      {/* Page Hero */}
      <div className="relative bg-[#0B0B12] border-b border-[#25253A] hex-grid-bg overflow-hidden">
        {/* Purple radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.3) 0%, transparent 70%)' }}
          />
        </div>
        <div className="neon-divider" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <span className="section-label mb-4 inline-flex">Marketplace</span>
          <h1
            className="text-3xl sm:text-5xl font-black uppercase text-white mt-4 mb-3 tracking-wide neon-text"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Browse Digital Products
          </h1>
          <p className="text-[#A1A1AA] max-w-2xl text-sm">
            Find trusted digital products across gaming, streaming, AI tools, software, productivity, and gift card categories.
          </p>
        </div>
        <div className="neon-divider" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-grow">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              id="product-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#11111A] border border-[#25253A] text-white text-sm placeholder:text-[#4A4A5A] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/40 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <SlidersHorizontal size={15} className="text-[#6B7280]" />
            <select
              id="product-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="pl-3 pr-8 py-3 rounded-xl bg-[#11111A] border border-[#25253A] text-white text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/40 transition-all appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#11111A]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 whitespace-nowrap border ${
                activeCategory === cat
                  ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                  : 'bg-transparent text-[#A1A1AA] border-[#25253A] hover:border-[#8B5CF6]/50 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-xs text-[#6B7280] mb-6 tracking-wide">
          Showing{' '}
          <span className="font-bold text-[#A1A1AA]">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'product' : 'products'}
          {activeCategory !== 'All Products' ? ` in ${activeCategory}` : ''}
          {search ? ` matching "${search}"` : ''}
        </p>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-[#11111A] rounded-xl border border-[#25253A]">
            <Package size={40} className="text-[#25253A] mx-auto mb-4" />
            <h3 className="font-bold text-white mb-2" style={{ fontFamily: 'var(--font-orbitron)' }}>
              No Products Found
            </h3>
            <p className="text-sm text-[#6B7280] mb-6">
              Try adjusting your search or selecting a different category.
            </p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All Products'); }}
              className="mp-button-primary px-6 py-2.5"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Trust Strip */}
        <div className="mt-16 border-t border-[#25253A] pt-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, label: 'Secure Checkout', desc: 'Encrypted payment processing' },
              { icon: Zap, label: 'Instant Delivery', desc: 'Email delivery after payment' },
              { icon: HeadphonesIcon, label: 'Support Tickets', desc: 'Help available any time' },
              { icon: Package, label: 'Verified Products', desc: 'Quality checked before listing' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 p-4 bg-[#11111A] rounded-xl border border-[#25253A]">
                <div className="w-9 h-9 bg-[#8B5CF6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={17} className="text-[#8B5CF6]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">{label}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
