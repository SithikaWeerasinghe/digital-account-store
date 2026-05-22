'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {

  return (
    <section className="relative bg-gradient-to-br from-[#009ee3] via-[#008cc9] to-blue-900 text-white overflow-hidden min-h-[85vh] flex items-center">
      {/* Background cyber grid and glow gradients */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none animate-grid-glide" />
      <div className="absolute inset-0 pointer-events-none">
        {/* Glowing orbs */}
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-white/5 blur-[120px] animate-pulse-slow" />
      </div>
 
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20 lg:pt-36 lg:pb-28 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content Column */}
          <div className="lg:col-span-7">
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
            <div className="flex flex-col sm:flex-row gap-4">
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
          </div>
 
          {/* Floating Cards Showcase Column */}
          <div className="lg:col-span-5 hidden lg:block relative">
            <div className="relative w-full h-[400px] flex items-center justify-center">
              
              {/* Animated orbital lines behind the cards */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Track circle (static/subtle) */}
                <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-white/5 animate-[spin_100s_linear_infinite]" />
                
                {/* Floating ambient particles */}
                <div className="absolute top-[10%] left-[20%] w-2 h-2 rounded-full bg-[#fff159]/20 blur-[0.5px] animate-particle-slow-1" />
                <div className="absolute bottom-[15%] right-[25%] w-3 h-3 rounded-full bg-[#009ee3]/15 blur-[1px] animate-particle-slow-2" />
                <div className="absolute top-[40%] right-[10%] w-1.5 h-1.5 rounded-full bg-white/15 blur-[0.5px] animate-particle-slow-3" />
                <div className="absolute bottom-[30%] left-[15%] w-2.5 h-2.5 rounded-full bg-[#fff159]/15 blur-[1px] animate-particle-slow-2 [animation-direction:reverse]" />
                <div className="absolute top-[25%] right-[30%] w-2 h-2 rounded-full bg-white/10 blur-[0.5px] animate-particle-slow-1 [animation-direction:reverse]" />

                {/* SVG Laser Orbit Paths & Radar Crosshairs */}
                <svg className="absolute w-[440px] h-[440px] -rotate-90" viewBox="0 0 100 100">
                  {/* Radar grid lines */}
                  <line x1="50" y1="8" x2="50" y2="92" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.3" strokeDasharray="1 2" />
                  <line x1="8" y1="50" x2="92" y2="50" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.3" strokeDasharray="1 2" />

                  {/* Outer Tech circular ticks */}
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.015)"
                    strokeWidth="0.8"
                    strokeDasharray="1 6"
                  />

                  {/* Outer Orbit Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.04)"
                    strokeWidth="0.5"
                  />
                  {/* Outer Orbit Laser comet */}
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="url(#orbitGradient1)"
                    strokeWidth="1.5"
                    strokeDasharray="25 250"
                    className="animate-orbit-pulse"
                  />
                  
                  {/* Middle Slow Laser Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="39"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.02)"
                    strokeWidth="0.4"
                  />
                  {/* Slow laser (circumference ~245) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="39"
                    fill="none"
                    stroke="url(#orbitGradient1)"
                    strokeWidth="1"
                    strokeDasharray="15 230"
                    className="animate-[orbit-pulse_15s_linear_infinite]"
                  />

                  {/* Inner Orbit Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="34"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.025)"
                    strokeWidth="0.5"
                  />
                  {/* Inner Orbit Laser comet (reversed) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="34"
                    fill="none"
                    stroke="url(#orbitGradient2)"
                    strokeWidth="1.2"
                    strokeDasharray="35 180"
                    className="animate-orbit-pulse-reverse"
                  />
                  
                  <defs>
                    <linearGradient id="orbitGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fff159" stopOpacity="1" />
                      <stop offset="50%" stopColor="#009ee3" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#009ee3" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="orbitGradient2" x1="100%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#009ee3" stopOpacity="1" />
                      <stop offset="60%" stopColor="#fff159" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#fff159" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              {/* Floating Cards Stack (all animated in sync to maintain distance) */}
              {/* Card 1: Streaming Account */}
              <div className="absolute top-2 left-2 w-[230px] p-5 glass-card-light rounded-2xl border border-white/60 shadow-lg animate-float-slow text-gray-900">
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 bg-purple-100/80 border border-purple-200/60 px-2.5 py-0.5 rounded-full">Streaming</span>
                </div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Netflix Premium</h3>
                <p className="text-xs text-gray-500 mb-3">4K Ultra HD • 1 Month Access</p>
                <div className="pt-3 border-t border-gray-200/40">
                  <span className="font-extrabold text-sm text-gray-900">$4.99</span>
                </div>
              </div>
  
              {/* Card 2: AI Power Tool */}
              <div className="absolute bottom-2 right-2 w-[230px] p-5 glass-card-light rounded-2xl border border-white/60 shadow-lg animate-float-slow text-gray-900">
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-100/80 border border-blue-200/60 px-2.5 py-0.5 rounded-full">AI Tools</span>
                </div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">ChatGPT Plus</h3>
                <p className="text-xs text-gray-500 mb-3">GPT-4 access • Shared account</p>
                <div className="pt-3 border-t border-gray-200/40">
                  <span className="font-extrabold text-sm text-gray-900">$6.50</span>
                </div>
              </div>
  
              {/* Card 3: Gaming Pass */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] p-5 glass-card-light rounded-2xl border border-white/60 shadow-lg animate-float-slow text-gray-900">
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/80 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">Gaming</span>
                </div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Xbox Game Pass Ultimate</h3>
                <p className="text-xs text-gray-500 mb-3">100+ Games • PC/Console</p>
                <div className="pt-3 border-t border-gray-200/40">
                  <span className="font-extrabold text-sm text-gray-900">$9.99</span>
                </div>
              </div>
 
            </div>
          </div>
 
        </div>
      </div>
    </section>
  );
}
