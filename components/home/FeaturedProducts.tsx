'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { sampleProducts } from '@/data/sampleProducts';
import ProductCard from '@/components/products/ProductCard';
import { ArrowRight, Clock, Box } from 'lucide-react';

export default function FeaturedProducts() {
  const featured = sampleProducts.filter((p) => p.inStock).slice(0, 4);

  // Countdown timer for next Supply Drop restock
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 12, seconds: 53 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 }; // reset to 12 hours
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="pt-4 pb-16 bg-[#050509] relative overflow-hidden">
      {/* Central glow behind products grid */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Asymmetric Tactical Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-6 border-b border-[#25253A]/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mb-3 rounded-sm bg-[#FF5500]/5 border border-[#FF5500]/30 font-mono text-[9px] font-black text-[#FF5500] tracking-widest uppercase">
              <Box size={10} className="animate-bounce" />
              HOT DEPLOYMENT :: ACQUISITION COORDINATES
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-[family-name:var(--font-heading)] uppercase tracking-wider text-white">
              SUPPLY <span className="text-primary drop-shadow-[0_0_12px_rgba(139,92,246,0.4)]">DROPS</span>
            </h2>
            <p className="text-xs font-mono text-text-secondary tracking-widest uppercase mt-2">
              High-value digital licenses, assets, and booster profiles active in database
            </p>
          </div>

          {/* Dynamic Restock Countdown Widget */}
          <div className="flex items-center gap-3 bg-[#111219] border border-[#25253A] rounded-sm p-3 font-mono">
            <Clock size={16} className="text-[#FF5500] animate-pulse" />
            <div>
              <span className="text-[8px] text-white/30 tracking-widest block font-bold uppercase">NEXT SUPPLY_DROP</span>
              <span className="text-sm font-black text-white tracking-wider">
                {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Footer CTAs */}
        <div className="mt-12 flex justify-between items-center border-t border-[#25253A]/60 pt-6">
          <span className="font-mono text-[9px] text-[#A1A1AA]/30 font-black tracking-widest uppercase hidden md:inline">
            // ALL KEYS CRYPTOGRAPHICALLY SECURED IN ISOLATED DATABASE NODE
          </span>
          <Link
            href={ROUTES.PRODUCTS}
            className="glow-border-button flex items-center gap-2 bg-[#12131A] text-white border border-[#25253A] font-black tracking-widest uppercase hover:text-primary hover:border-primary/50 py-3.5 px-6 rounded-sm text-xs transition-all duration-300 w-full md:w-auto text-center justify-center"
          >
            DECRYPT ENTIRE INVENTORY <ArrowRight size={14} className="text-primary" />
          </Link>
        </div>

      </div>
    </section>
  );
}
