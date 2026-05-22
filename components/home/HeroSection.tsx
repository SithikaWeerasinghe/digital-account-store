import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { ArrowRight, Zap, Shield, Clock, CheckCircle } from 'lucide-react';

export default function HeroSection() {
  const trustBadges = [
    { icon: Zap, label: 'Instant Delivery', color: 'text-[#fff159]', bg: 'bg-[#009ee3]' },
    { icon: Shield, label: 'Secure Checkout', color: 'text-white', bg: 'bg-emerald-500' },
    { icon: Clock, label: '24/7 Support', color: 'text-white', bg: 'bg-purple-500' },
    { icon: CheckCircle, label: 'Verified Stock', color: 'text-white', bg: 'bg-amber-500' },
  ];

  return (
    <section className="relative bg-gradient-to-br from-[#006fa8] via-[#009ee3] to-[#00c5f5] text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Zap size={14} className="text-[#fff159]" />
            <span className="text-sm font-medium">Instant digital delivery — no waiting</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Premium Digital Products,{' '}
            <span className="text-[#fff159]">Delivered Instantly.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-white/85 leading-relaxed mb-10 max-w-2xl">
            Buy trusted digital products, subscriptions, gaming items, and productivity tools with fast delivery, secure checkout, and friendly support.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <Link
              href={ROUTES.PRODUCTS}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#fff159] text-gray-900 font-bold text-base hover:bg-yellow-300 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Browse Products
              <ArrowRight size={18} />
            </Link>
            <Link
              href={ROUTES.SUPPORT}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 text-white font-semibold text-base hover:bg-white/25 transition-all duration-200"
            >
              Contact Support
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {trustBadges.map(({ icon: Icon, label, color, bg }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-3 py-2.5"
              >
                <div className={`w-7 h-7 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon size={15} className={color} />
                </div>
                <span className="text-sm font-medium text-white/90">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
