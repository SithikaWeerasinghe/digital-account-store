import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { Tv, Bot, Gamepad2, Cpu, Briefcase, Gift } from 'lucide-react';

const categories = [
  {
    name: 'Streaming',
    description: 'Entertainment subscriptions & media access',
    icon: Tv,
    color: 'bg-purple-100 text-purple-600',
    border: 'hover:border-purple-300',
    query: 'Streaming',
  },
  {
    name: 'AI Tools',
    description: 'AI assistants, writing & design tools',
    icon: Bot,
    color: 'bg-blue-100 text-blue-600',
    border: 'hover:border-blue-300',
    query: 'AI Tools',
  },
  {
    name: 'Gaming',
    description: 'In-game items, bundles & game passes',
    icon: Gamepad2,
    color: 'bg-green-100 text-green-600',
    border: 'hover:border-green-300',
    query: 'Gaming',
  },
  {
    name: 'Software',
    description: 'License keys for essential software',
    icon: Cpu,
    color: 'bg-orange-100 text-orange-600',
    border: 'hover:border-orange-300',
    query: 'Software',
  },
  {
    name: 'Productivity',
    description: 'Cloud storage, learning & work tools',
    icon: Briefcase,
    color: 'bg-teal-100 text-teal-600',
    border: 'hover:border-teal-300',
    query: 'Productivity',
  },
  {
    name: 'Gift Cards',
    description: 'Digital gift codes for popular platforms',
    icon: Gift,
    color: 'bg-rose-100 text-rose-600',
    border: 'hover:border-rose-300',
    query: 'Gift Cards',
  },
];

export default function CategorySection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Explore Popular Categories</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Find exactly what you need across our curated selection of digital products.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`${ROUTES.PRODUCTS}?category=${encodeURIComponent(cat.query)}`}
                className={`group flex flex-col items-center p-5 bg-white rounded-2xl border border-gray-200 ${cat.border} hover:shadow-md transition-all duration-200 text-center cursor-pointer`}
              >
                <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-sm font-semibold text-gray-800 mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-500 leading-tight hidden sm:block">{cat.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
