import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { ArrowRight, Zap, Shield, Clock, CheckCircle } from 'lucide-react';

const trustBadges = [
  { icon: Zap, label: 'Instant Delivery' },
  { icon: Shield, label: 'Secure Checkout' },
  { icon: CheckCircle, label: 'Verified Stock' },
  { icon: Clock, label: '24/7 Support' },
];

// Particle positions (static for SSR safety)
const particles = [
  { top: '20%', left: '10%', size: 3, delay: '0s', duration: '6s', type: 1 },
  { top: '60%', left: '20%', size: 2, delay: '1s', duration: '8s', type: 2 },
  { top: '35%', left: '80%', size: 4, delay: '2s', duration: '7s', type: 1 },
  { top: '70%', left: '70%', size: 2, delay: '0.5s', duration: '9s', type: 3 },
  { top: '15%', left: '60%', size: 3, delay: '3s', duration: '6.5s', type: 2 },
  { top: '80%', left: '45%', size: 2, delay: '1.5s', duration: '7.5s', type: 1 },
  { top: '45%', left: '35%', size: 3, delay: '2.5s', duration: '8.5s', type: 3 },
  { top: '55%', left: '90%', size: 2, delay: '4s', duration: '6s', type: 2 },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hex-grid-bg scanline-overlay bg-[#050509]">

      {/* Radial purple center glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.25) 0%, rgba(168,85,247,0.08) 40%, transparent 70%)',
          }}
        />
        {/* Top-left corner accent */}
        <div
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)' }}
        />
        {/* Bottom-right accent */}
        <div
          className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)' }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#A855F7]"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              opacity: 0,
              boxShadow: `0 0 ${p.size * 3}px rgba(168,85,247,0.8)`,
              animation: `float-particle${p.type === 1 ? '' : `-${p.type}`} ${p.duration} ${p.delay} infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
        <div className="max-w-4xl">

          {/* Label badge */}
          <div className="inline-flex items-center gap-2 mb-8">
            <span className="section-label">
              <Zap size={11} />
              Premium Digital Marketplace
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase leading-[0.95] mb-6 text-white neon-text neon-text-animate tracking-tight"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            LEVEL UP YOUR
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#C084FC]">
              DIGITAL WORLD
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed mb-10 max-w-2xl">
            Buy trusted gaming, streaming, AI, and software digital products with fast delivery,
            secure checkout, and reliable support.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href={ROUTES.PRODUCTS} className="mp-button-primary px-8 py-4 text-sm">
              Browse Products
              <ArrowRight size={16} />
            </Link>
            <Link href={ROUTES.SUPPORT} className="mp-button-secondary px-8 py-4 text-sm">
              Contact Support
            </Link>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 bg-[#11111A]/80 backdrop-blur-sm border border-[#25253A] hover:border-[#8B5CF6]/40 rounded-xl px-3 py-3 transition-all duration-300 group cursor-default"
              >
                <div className="w-7 h-7 bg-[#8B5CF6]/15 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#8B5CF6]/25 transition-colors">
                  <Icon size={14} className="text-[#8B5CF6]" />
                </div>
                <span className="text-xs font-semibold text-[#A1A1AA] group-hover:text-white transition-colors">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050509] to-transparent pointer-events-none" />
    </section>
  );
}
