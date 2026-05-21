'use client';

import { useState, useMemo } from 'react';
import { sampleProducts } from '@/data/sampleProducts';
import ProductCard from '@/components/products/ProductCard';
import { Search, SlidersHorizontal, Zap, Shield, Package, HeadphonesIcon } from 'lucide-react';

const CATEGORIES = ['All Products', 'Streaming', 'AI Tools', 'Gaming', 'Software', 'Productivity', 'Gift Cards'];
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Popular', value: 'popular' },
  { label: 'In Stock', value: 'in_stock' },
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
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#009ee3] to-[#006fa8] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Browse Digital Products</h1>
          <p className="text-white/80 max-w-2xl text-base">
            Find trusted digital products across streaming, AI tools, gaming, software, productivity, and gift card categories.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-grow">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#009ee3]/30 focus:border-[#009ee3] transition-all"
            />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <SlidersHorizontal size={16} className="text-gray-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#009ee3]/30 focus:border-[#009ee3] transition-all appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#009ee3] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#009ee3]/50 hover:text-[#009ee3]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-5">
          Showing <span className="font-semibold text-gray-800">{filtered.length}</span>{' '}
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
          <div className="py-24 text-center bg-white rounded-2xl border border-gray-200">
            <Package size={40} className="text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-sm text-gray-400 mb-5">
              Try adjusting your search or selecting a different category.
            </p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All Products'); }}
              className="px-5 py-2 rounded-xl bg-[#009ee3] text-white text-sm font-medium hover:bg-[#008cc9] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Trust Strip */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, label: 'Secure Checkout', desc: 'Encrypted payment processing' },
              { icon: Zap, label: 'Instant Delivery', desc: 'Email delivery after payment' },
              { icon: HeadphonesIcon, label: 'Support Tickets', desc: 'Help available any time' },
              { icon: Package, label: 'Order Tracking', desc: 'Check your order status' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-[#009ee3] flex-shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
