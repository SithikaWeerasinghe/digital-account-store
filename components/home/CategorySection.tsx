import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { Tv, Bot, Gamepad2, Cpu, Briefcase, Gift } from 'lucide-react';

const categories = [
  {
    name: 'Gaming',
    description: 'Digital gaming products, bundles, and game-related access delivered online.',
    icon: Gamepad2,
    query: 'Gaming',
  },
  {
    name: 'Streaming',
    description: 'Entertainment digital products for movies, shows, music, and online media.',
    icon: Tv,
    query: 'Streaming',
  },
  {
    name: 'AI Tools',
    description: 'AI-powered tools for writing, studying, coding, research, and productivity.',
    icon: Bot,
    query: 'AI Tools',
  },
  {
    name: 'Software',
    description: 'Useful software access and digital tools for work, study, and business.',
    icon: Cpu,
    query: 'Software',
  },
  {
    name: 'Productivity',
    description: 'Digital tools that help you design, write, organize, and complete tasks faster.',
    icon: Briefcase,
    query: 'Productivity',
  },
  {
    name: 'Gift Cards',
    description: 'Digital codes and prepaid items delivered quickly through email.',
    icon: Gift,
    query: 'Gift Cards',
  },
];

export default function CategorySection() {
  return (
    <section className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider text-white mb-4">
            Popular Categories
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-[0_0_10px_rgba(139,92,246,0.6)]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`${ROUTES.PRODUCTS}?category=${encodeURIComponent(cat.query)}`}
                className="mp-card group flex items-start gap-5 p-6 cursor-pointer relative overflow-hidden"
              >
                {/* Hover Glow Effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] group-hover:bg-primary/20 transition-all duration-300"></div>

                <div className="w-14 h-14 rounded-2xl bg-[#1A1A24] border border-border flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all duration-300 relative z-10">
                  <Icon size={26} className="text-primary group-hover:text-accent transition-colors" />
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-lg font-bold font-[family-name:var(--font-heading)] tracking-widest uppercase text-white mb-2 group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
