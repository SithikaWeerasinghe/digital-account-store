import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { Tv, Bot, Gamepad2, Cpu, Briefcase, Gift } from 'lucide-react';

const categories = [
  {
    name: 'Gaming',
    description: 'In-game items, bundles & game passes',
    icon: Gamepad2,
    query: 'Gaming',
    color: 'from-[#8B5CF6] to-[#A855F7]',
  },
  {
    name: 'Streaming',
    description: 'Entertainment subscriptions & media access',
    icon: Tv,
    query: 'Streaming',
    color: 'from-[#6D28D9] to-[#8B5CF6]',
  },
  {
    name: 'AI Tools',
    description: 'AI assistants, writing & design tools',
    icon: Bot,
    query: 'AI Tools',
    color: 'from-[#7C3AED] to-[#A855F7]',
  },
  {
    name: 'Software',
    description: 'License keys for essential software',
    icon: Cpu,
    query: 'Software',
    color: 'from-[#5B21B6] to-[#7C3AED]',
  },
  {
    name: 'Productivity',
    description: 'Cloud storage, learning & work tools',
    icon: Briefcase,
    query: 'Productivity',
    color: 'from-[#8B5CF6] to-[#6D28D9]',
  },
  {
    name: 'Gift Cards',
    description: 'Digital gift codes for popular platforms',
    icon: Gift,
    query: 'Gift Cards',
    color: 'from-[#A855F7] to-[#C084FC]',
  },
];

export default function CategorySection() {
  return (
    <section className="py-20 bg-[#0B0B12] relative">
      {/* Top neon divider */}
      <div className="neon-divider mb-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="section-label mb-4 inline-flex">Shop by Category</span>
          <h2
            className="text-3xl sm:text-4xl font-black uppercase text-white mt-4 mb-3 tracking-wide"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Explore Popular Categories
          </h2>
          <p className="text-[#A1A1AA] max-w-xl mx-auto text-sm">
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
                className="group flex flex-col items-center p-5 bg-[#11111A] rounded-xl border border-[#25253A] hover:border-[#8B5CF6]/50 hover:bg-[#16161F] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)] transition-all duration-300 text-center cursor-pointer relative overflow-hidden"
              >
                {/* Top edge glow on hover */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3
                  className="text-xs font-bold uppercase tracking-wider text-white mb-1 group-hover:text-[#A855F7] transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-orbitron)' }}
                >
                  {cat.name}
                </h3>
                <p className="text-[10px] text-[#6B7280] leading-tight hidden sm:block group-hover:text-[#A1A1AA] transition-colors">
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
