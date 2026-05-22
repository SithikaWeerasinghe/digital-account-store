'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { ArrowRight, Zap, Shield, Clock, CheckCircle } from 'lucide-react';

export default function HeroSection() {
  const trustBadges = [
    { icon: Zap, label: 'Instant Delivery', color: 'text-neon-cyan', bg: 'bg-cyan-950/50 border border-neon-cyan/20' },
    { icon: Shield, label: 'Secure Checkout', color: 'text-emerald-400', bg: 'bg-emerald-950/50 border border-emerald-500/20' },
    { icon: Clock, label: '24/7 Support', color: 'text-purple-400', bg: 'bg-purple-950/50 border border-purple-500/20' },
    { icon: CheckCircle, label: 'Verified Stock', color: 'text-amber-400', bg: 'bg-amber-950/50 border border-amber-500/20' },
  ];

  return (
    <section className="relative bg-gradient-to-br from-[#009ee3] via-[#008cc9] to-blue-900 text-white overflow-hidden min-h-[90vh] flex items-center">
      {/* Background cyber grid and glow gradients */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none animate-grid-glide" />
      <div className="absolute inset-0 pointer-events-none">
        {/* Glowing orbs */}
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-white/5 blur-[120px] animate-pulse-slow" />
      </div>
 
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content Column */}
          <div className="lg:col-span-7">
            {/* Instant Delivery Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/25 rounded-full px-4 py-1.5 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fff159] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fff159]"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-white/90">Instant Digital Delivery</span>
            </div>
 
            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight">
              Premium Digital Products,{' '}
              <span className="text-[#fff159]">
                Delivered Instantly.
              </span>
            </h1>
 
            {/* Subtitle */}
            <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-2xl">
              Buy trusted digital products, subscriptions, gaming items, and productivity tools with fast delivery, secure checkout, and friendly support.
            </p>
 
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href={ROUTES.PRODUCTS}
                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#fff159] text-gray-900 font-bold text-base hover:bg-yellow-300 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Browse Products
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
              {trustBadges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-3 py-2.5"
                >
                  <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-[#fff159]" />
                  </div>
                  <span className="text-sm font-medium text-white/90">{label}</span>
                </div>
              ))}
            </div>
          </div>
 
          {/* Floating Cards Showcase Column */}
          <div className="lg:col-span-5 hidden lg:block relative">
            <div className="relative w-full h-[450px] flex items-center justify-center">
              
              {/* Outer decorative ring */}
              <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-white/20 animate-[spin_60s_linear_infinite]" />
              
              {/* Floating Cards Stack */}
              {/* Card 1: Streaming Account */}
              <div className="absolute top-10 left-5 w-60 p-5 glass-card-light rounded-2xl border border-white/60 shadow-lg animate-float-slow text-gray-900">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-100 border border-purple-200/50 px-2 py-0.5 rounded-full">Streaming</span>
                  <Zap size={15} className="text-purple-600" />
                </div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Netflix Premium</h3>
                <p className="text-xs text-gray-500 mb-3">4K Ultra HD • 1 Month Access</p>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200/40">
                  <span className="font-extrabold text-sm text-gray-900">$4.99</span>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">Instant</span>
                </div>
              </div>
 
              {/* Card 2: AI Power Tool */}
              <div className="absolute bottom-6 right-5 w-60 p-5 glass-card-light rounded-2xl border border-white/60 shadow-lg animate-float-slow [animation-delay:-3s] text-gray-900">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#009ee3] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">AI Tools</span>
                  <Zap size={15} className="text-[#009ee3]" />
                </div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">ChatGPT Plus</h3>
                <p className="text-xs text-gray-500 mb-3">GPT-4 access • Shared account</p>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200/40">
                  <span className="font-extrabold text-sm text-gray-900">$6.50</span>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">Instant</span>
                </div>
              </div>
 
              {/* Card 3: Gaming Pass */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 p-5 glass-card-light rounded-2xl border border-white/60 shadow-lg animate-float-slow [animation-delay:-1.5s] text-gray-900">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Gaming</span>
                  <Zap size={15} className="text-emerald-600" />
                </div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Xbox Game Pass Ultimate</h3>
                <p className="text-xs text-gray-500 mb-3">100+ Games • PC/Console</p>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200/40">
                  <span className="font-extrabold text-sm text-gray-900">$9.99</span>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">Instant</span>
                </div>
              </div>
 
            </div>
          </div>
 
        </div>
      </div>
    </section>
  );
}
