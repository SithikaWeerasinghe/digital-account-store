import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { Tv, Bot, Gamepad2, Cpu, Briefcase, Gift } from 'lucide-react';

const categories = [
  {
    name: 'Streaming',
    description: 'Entertainment & media access',
    icon: Tv,
    color: 'bg-purple-100 text-purple-600',
    glowClass: 'glow-violet-hover',
    query: 'Streaming',
  },
  {
    name: 'AI Tools',
    description: 'AI writing & design tools',
    icon: Bot,
    color: 'bg-blue-100 text-blue-600',
    glowClass: 'glow-cyan-hover',
    query: 'AI Tools',
  },
  {
    name: 'Gaming',
    description: 'Keys, accounts & passes',
    icon: Gamepad2,
    color: 'bg-green-100 text-green-600',
    glowClass: 'glow-green-hover',
    query: 'Gaming',
  },
  {
    name: 'Software',
    description: 'License keys & packages',
    icon: Cpu,
    color: 'bg-orange-100 text-orange-600',
    glowClass: 'glow-gold-hover',
    query: 'Software',
  },
  {
    name: 'Productivity',
    description: 'Work, cloud & learning tools',
    icon: Briefcase,
    color: 'bg-teal-100 text-teal-600',
    glowClass: 'glow-cyan-hover',
    query: 'Productivity',
  },
  {
    name: 'Gift Cards',
    description: 'Platform gift codes & vouchers',
    icon: Gift,
    color: 'bg-rose-100 text-rose-600',
    glowClass: 'glow-rose-hover',
    query: 'Gift Cards',
  },
];

export default function CategorySection() {
  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-900 tracking-tight">
            Explore <span className="text-[#009ee3] font-black">Popular Categories</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Find exactly what you need across our curated selection of digital products.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`${ROUTES.PRODUCTS}?category=${encodeURIComponent(cat.query)}`}
                className={`group flex flex-col items-center p-6 rounded-2xl bg-white border border-gray-200 transition-all duration-300 text-center cursor-pointer hover:-translate-y-1.5 ${cat.glowClass}`}
              >
                {/* Icon wrapper */}
                <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]`}>
                  <Icon size={24} className="group-hover:rotate-6 transition-transform" />
                </div>
                
                {/* Heading */}
                <h3 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-[#009ee3] transition-colors">
                  {cat.name}
                </h3>
                
                {/* Subtitle */}
                <p className="text-xs text-gray-500 leading-snug hidden sm:block">
                  {cat.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
