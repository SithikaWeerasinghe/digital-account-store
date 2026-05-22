import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { Tv, Bot, Gamepad2, Cpu, Briefcase, Gift, ArrowRight } from 'lucide-react';
import { sampleProducts } from '@/data/sampleProducts';

const categories = [
  {
    name: 'Streaming',
    description: 'Entertainment subscriptions & media access',
    icon: Tv,
    accent: 'bg-purple-500',
    soft: 'bg-purple-50 text-purple-600',
    border: 'hover:border-purple-200',
    query: 'Streaming',
  },
  {
    name: 'AI Tools',
    description: 'AI assistants, writing & design tools',
    icon: Bot,
    accent: 'bg-[#009ee3]',
    soft: 'bg-blue-50 text-[#009ee3]',
    border: 'hover:border-blue-200',
    query: 'AI Tools',
  },
  {
    name: 'Gaming',
    description: 'In-game items, bundles & game passes',
    icon: Gamepad2,
    accent: 'bg-emerald-500',
    soft: 'bg-emerald-50 text-emerald-600',
    border: 'hover:border-emerald-200',
    query: 'Gaming',
  },
  {
    name: 'Software',
    description: 'License keys for essential software',
    icon: Cpu,
    accent: 'bg-orange-500',
    soft: 'bg-orange-50 text-orange-600',
    border: 'hover:border-orange-200',
    query: 'Software',
  },
  {
    name: 'Productivity',
    description: 'Cloud storage, learning & work tools',
    icon: Briefcase,
    accent: 'bg-teal-500',
    soft: 'bg-teal-50 text-teal-600',
    border: 'hover:border-teal-200',
    query: 'Productivity',
  },
  {
    name: 'Gift Cards',
    description: 'Digital gift codes for popular platforms',
    icon: Gift,
    accent: 'bg-rose-500',
    soft: 'bg-rose-50 text-rose-600',
    border: 'hover:border-rose-200',
    query: 'Gift Cards',
  },
];

export default function CategorySection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="apex-badge-blue mb-3 inline-flex">Browse Categories</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d1b2a] mb-3 tracking-tight">
            Explore Popular Categories
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            Find exactly what you need across our curated selection of digital products.
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = sampleProducts.filter(p => p.category === cat.query).length;
            return (
              <Link
                key={cat.name}
                href={`${ROUTES.PRODUCTS}?category=${encodeURIComponent(cat.query)}`}
                className={`group flex flex-col items-center p-5 bg-white rounded-2xl border-2 border-gray-100 ${cat.border} hover:shadow-lg transition-all duration-200 text-center cursor-pointer`}
              >
                <div className={`w-14 h-14 rounded-2xl ${cat.soft} flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-sm font-bold text-[#0d1b2a] mb-1 leading-tight">{cat.name}</h3>
                <p className="text-[10px] text-gray-400 leading-tight hidden sm:block mb-2">
                  {cat.description}
                </p>
                {count > 0 && (
                  <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                    {count} {count === 1 ? 'product' : 'products'}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-1.5 text-[#009ee3] font-semibold text-sm hover:gap-2.5 transition-all duration-150"
          >
            View all products <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
