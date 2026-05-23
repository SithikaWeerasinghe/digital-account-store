'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { useState, useEffect, useRef } from 'react';

function StreamingIcon({ className }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 text-purple-400 group-hover:scale-105 transition-transform duration-300 ${className || ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="12" rx="2" className="group-hover:stroke-purple-300 transition-colors" />
      <path d="M12 19v3M9 22h6M17 2l-3 5M7 2l3 5" />
      <polygon points="10 11 15 13 10 15" fill="currentColor" className="opacity-70 group-hover:opacity-100 group-hover:scale-115 origin-center transition-all duration-300" />
      <path d="M19 9a3 3 0 0 1 0 8M5 9a3 3 0 0 0 0 8" className="opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
    </svg>
  );
}

function AIToolsIcon({ className }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 text-blue-400 group-hover:scale-105 transition-transform duration-300 ${className || ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v2M12 18v2M4 9h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Z" className="group-hover:translate-y-[-1px] transition-transform duration-300" />
      <path d="M2 13h2M20 13h2" />
      <circle cx="8" cy="14" r="1.5" fill="currentColor" className="group-hover:scale-125 origin-[8px_14px] transition-all duration-300" />
      <circle cx="16" cy="14" r="1.5" fill="currentColor" className="group-hover:scale-125 origin-[16px_14px] transition-all duration-300" />
      <path d="M9 6a3 3 0 0 1 6 0" className="stroke-blue-300/40 group-hover:stroke-blue-300 transition-all duration-300" />
    </svg>
  );
}

function GamingIcon({ className }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 text-emerald-400 group-hover:scale-105 transition-transform duration-300 ${className || ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="6" width="20" height="12" rx="6" className="group-hover:rotate-[-3deg] origin-center transition-transform duration-300" />
      <path d="M6 12h3M7.5 10.5v3" className="stroke-emerald-400 group-hover:stroke-white transition-colors" />
      <circle cx="15.5" cy="10.5" r="1" fill="currentColor" className="group-hover:animate-ping origin-[15.5px_10.5px] duration-1000" />
      <circle cx="17.5" cy="13.5" r="1" fill="currentColor" className="group-hover:animate-ping origin-[17.5px_13.5px] duration-1000" style={{ animationDelay: '0.3s' }} />
    </svg>
  );
}

function SoftwareIcon({ className }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 text-amber-400 group-hover:scale-105 transition-transform duration-300 ${className || ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="5" width="14" height="14" rx="2" className="group-hover:fill-amber-500/10 transition-colors duration-300" />
      <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" className="opacity-85 group-hover:scale-110 origin-center transition-transform" />
      <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" className="stroke-amber-400 group-hover:stroke-white transition-colors duration-300" />
    </svg>
  );
}

function ProductivityIcon({ className }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 text-cyan-400 group-hover:scale-105 transition-transform duration-300 ${className || ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <circle cx="7" cy="14" r="1" fill="currentColor" />
      <circle cx="12" cy="14" r="1" fill="currentColor" />
      <circle cx="17" cy="14" r="1" fill="currentColor" />
      <path d="M7 14l3 3 7-7" className="stroke-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </svg>
  );
}

function GiftCardsIcon({ className }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 text-rose-400 group-hover:scale-105 transition-transform duration-300 ${className || ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 12v8H4v-8" className="group-hover:translate-y-[1px] transition-transform duration-300" />
      <rect x="2" y="7" width="20" height="5" rx="1" className="group-hover:translate-y-[-2px] origin-center group-hover:rotate-[-2deg] transition-all duration-300" />
      <path d="M12 22V7M12 7H7a2 2 0 0 1 0-4h5M12 7h5a2 2 0 0 0 0-4h-5" />
    </svg>
  );
}

const categories = [
  {
    name: 'Streaming',
    description: 'Entertainment subscriptions & media access',
    icon: StreamingIcon,
    query: 'Streaming',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'group-hover:border-purple-500/40 group-hover:shadow-[0_0_12px_rgba(168,85,247,0.2)]',
    iconAnimClass: 'animate-tv'
  },
  {
    name: 'AI Tools',
    description: 'AI assistants, writing & design tools',
    icon: AIToolsIcon,
    query: 'AI Tools',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'group-hover:border-blue-500/40 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.2)]',
    iconAnimClass: 'animate-bot'
  },
  {
    name: 'Gaming',
    description: 'In-game items, bundles & game passes',
    icon: GamingIcon,
    query: 'Gaming',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'group-hover:border-emerald-500/40 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.2)]',
    iconAnimClass: 'animate-gaming'
  },
  {
    name: 'Software',
    description: 'License keys for essential software',
    icon: SoftwareIcon,
    query: 'Software',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'group-hover:border-amber-500/40 group-hover:shadow-[0_0_12px_rgba(245,158,11,0.2)]',
    iconAnimClass: 'animate-cpu'
  },
  {
    name: 'Productivity',
    description: 'Cloud storage, learning & work tools',
    icon: ProductivityIcon,
    query: 'Productivity',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'group-hover:border-cyan-500/40 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.2)]',
    iconAnimClass: 'animate-productivity'
  },
  {
    name: 'Gift Cards',
    description: 'Digital gift codes for popular platforms',
    icon: GiftCardsIcon,
    query: 'Gift Cards',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'group-hover:border-rose-500/40 group-hover:shadow-[0_0_12px_rgba(244,63,94,0.2)]',
    iconAnimClass: 'animate-gift'
  },
];

export default function CategorySection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="pt-10 pb-4 bg-[#0A0B10] relative overflow-hidden">
      {/* Background cyber grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.012)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header telemetry style */}
        <div className="text-center mb-6">
          <h2 className="text-3xl sm:text-4xl font-black font-[family-name:var(--font-heading)] uppercase tracking-wider text-white mb-4">
            Explore Popular Categories
          </h2>
          <p className="text-sm text-text-secondary font-medium max-w-xl mx-auto leading-relaxed">
            Find exactly what you need across our curated selection of digital products.
          </p>
          <div className="w-16 h-[2px] bg-primary mx-auto mt-6 shadow-[0_0_10px_rgba(139,92,246,0.6)]"></div>
        </div>

        {/* Loadout Config Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`${ROUTES.PRODUCTS}?category=${encodeURIComponent(cat.query)}`}
                className={`group flex flex-col items-center p-4 cursor-pointer relative overflow-hidden bg-[#11131E]/40 border border-white/[0.06] rounded-2xl hover:bg-[#12131e]/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 shadow-[0_4px_15px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_25px_rgba(139,92,246,0.12)] min-h-[110px] sm:min-h-[120px] ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: isVisible ? `${index * 150}ms` : '0ms' }}
              >
                {/* Glowing Icon Container */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${cat.bgColor} border border-white/[0.04] ${cat.borderColor}`}>
                  <Icon className={cat.iconAnimClass} />
                </div>
                
                <h3 className="text-[11px] sm:text-xs font-black font-[family-name:var(--font-heading)] tracking-wider uppercase text-white group-hover:text-primary transition-colors text-center">
                  {cat.name}
                </h3>
                
                {/* Expandable description */}
                <div className="w-full max-h-0 opacity-0 group-hover:max-h-[60px] group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden mt-0 group-hover:mt-2 transform translate-y-1.5 group-hover:translate-y-0">
                  <p className="text-[10px] text-text-secondary leading-relaxed font-medium text-center">
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
