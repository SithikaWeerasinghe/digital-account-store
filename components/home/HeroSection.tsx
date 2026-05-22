import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { ArrowRight, Zap, Shield, Clock, CheckCircle } from 'lucide-react';

export default function HeroSection() {
  const trustBadges = [
    { icon: Zap, label: 'Instant Delivery' },
    { icon: Shield, label: 'Secure Checkout' },
    { icon: CheckCircle, label: 'Verified Stock' },
    { icon: Clock, label: '24/7 Support' },
  ];

  return (
    <section className="relative bg-[#050509] text-white overflow-hidden min-h-[85vh] flex items-center">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Central Purple Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Floating Neon Dots */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_#8b5cf6] animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-accent rounded-full shadow-[0_0_15px_#a855f7] animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#ffffff] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 z-10 w-full">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-card/50 backdrop-blur-md border border-primary/30 rounded-full px-5 py-2 mb-8 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <Zap size={16} className="text-primary" />
            <span className="text-sm font-bold tracking-widest uppercase text-primary-foreground">Instant digital delivery — no waiting</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-8 font-[family-name:var(--font-heading)] uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-text-secondary drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Level Up Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]">
              Digital World
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-text-secondary leading-relaxed mb-12 max-w-2xl font-medium">
            Buy trusted gaming, streaming, AI, and software digital products with fast delivery, secure checkout, and reliable support.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 mb-16 w-full justify-center">
            <Link
              href={ROUTES.PRODUCTS}
              className="mp-button-primary flex items-center justify-center gap-3 text-lg py-4 px-8"
            >
              Browse Products
              <ArrowRight size={20} />
            </Link>
            <Link
              href={ROUTES.SUPPORT}
              className="mp-button-secondary flex items-center justify-center gap-3 text-lg py-4 px-8"
            >
              Contact Support
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 w-full">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-card/60 backdrop-blur-md border border-border/80 rounded-xl px-4 py-3 hover:border-primary/50 transition-colors"
              >
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                  <Icon size={16} className="text-primary" />
                </div>
                <span className="text-sm font-bold tracking-wider uppercase text-white">{label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
