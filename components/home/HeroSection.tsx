'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-[#050509] text-white overflow-hidden min-h-[80vh] flex items-center pt-12 pb-16 lg:pt-16 lg:pb-24">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>
      
      {/* Glowing Lobby Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT WING: Precise copy and CTA nodes */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            
            {/* Glitch-free high-conversion heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.75rem] xl:text-[4.25rem] font-black leading-[1.1] mb-6 font-[family-name:var(--font-heading)] uppercase tracking-wide text-white">
              Premium Digital <br />
              Products, <span className="text-primary drop-shadow-[0_0_12px_rgba(139,92,246,0.45)]">Delivered</span> <br />
              <span className="text-primary drop-shadow-[0_0_12px_rgba(139,92,246,0.45)]">Instantly.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-text-secondary leading-relaxed mb-10 max-w-2xl font-medium">
              Buy trusted digital products, subscriptions, gaming items, and productivity tools with fast delivery, secure checkout, and friendly support.
            </p>

            {/* Button Layout */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href={ROUTES.PRODUCTS}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-black text-xs font-mono tracking-widest uppercase hover:bg-primary-hover transition-all duration-200 shadow-[0_0_15px_rgba(139,92,246,0.35)] hover:shadow-[0_0_20px_rgba(139,92,246,0.55)]"
              >
                Browse Products
                <ArrowRight size={14} className="stroke-[3]" />
              </Link>
              <Link
                href={ROUTES.SUPPORT}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white font-black text-xs font-mono tracking-widest uppercase hover:bg-white/10 hover:border-white/20 transition-all duration-200"
              >
                Contact Support
              </Link>
            </div>

          </div>

          {/* RIGHT WING: Overlapping glassmorphism cards & rotating circular radar */}
          <div className="lg:col-span-6 flex justify-center items-center relative h-[460px] sm:h-[500px] lg:h-[520px] w-full">
            
            {/* Concentric Spinning Radar Circles backdrop (6 Concentric Rings) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              
              {/* Ring 1 (Outermost - 530px) */}
              <div className="absolute w-[440px] md:w-[530px] h-[440px] md:h-[530px] border-2 border-dashed border-primary/15 rounded-full animate-spin-slow"></div>
              
              {/* Ring 2 (460px) */}
              <div className="absolute w-[380px] md:w-[460px] h-[380px] md:h-[460px] rounded-full border-2 border-t-2 border-r-2 border-transparent border-t-primary/40 border-r-accent/30 animate-spin-reverse-slow"></div>
              
              {/* Ring 3 (400px) */}
              <div className="absolute w-[330px] md:w-[400px] h-[330px] md:h-[400px] border border-dotted border-white/15 rounded-full"></div>
              
              {/* Ring 4 (340px) */}
              <div className="absolute w-[280px] md:w-[340px] h-[280px] md:h-[340px] border-2 border-dashed border-primary/20 rounded-full animate-spin-fast"></div>
              
              {/* Ring 5 (280px) */}
              <div className="absolute w-[220px] md:w-[280px] h-[220px] md:h-[280px] rounded-full border-2 border-t-2 border-l-2 border-transparent border-t-primary/35 border-l-accent/25 animate-spin-reverse-fast"></div>
              
              {/* Ring 6 (Innermost - 200px) */}
              <div className="absolute w-[150px] md:w-[200px] h-[150px] md:h-[200px] border border-dotted border-white/5 rounded-full"></div>
            </div>

            {/* Cascading Glass Cards Container */}
            <div className="relative w-full max-w-[480px] h-[400px] mt-4">
              
              {/* Card 1: Netflix Premium (Top-Left) */}
              <div 
                className="absolute top-0 left-2 z-10 w-[260px] sm:w-[290px] md:w-[300px] bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:bg-white/[0.06] hover:border-primary/20 hover:scale-[1.03] transition-all duration-300 animate-float"
                style={{ animationDuration: '6s' }}
              >
                <div className="flex flex-col gap-3">
                  <div>
                    <span className="inline-block text-[10px] font-black tracking-wider uppercase text-purple-400 bg-purple-500/10 border border-purple-500/25 px-3 py-1 rounded-full font-mono">
                      STREAMING
                    </span>
                  </div>
                  <div>
                    <h3 className="text-15px sm:text-base font-black tracking-wide text-white">Netflix Premium</h3>
                    <p className="text-[11px] sm:text-xs text-white/50 mt-1.5 font-medium">4K Ultra HD • 1 Month Access</p>
                  </div>
                  <div className="text-sm font-black text-white mt-1 font-mono">
                    $4.99
                  </div>
                </div>
              </div>

              {/* Card 2: Xbox Game Pass Ultimate (Middle) */}
              <div 
                className="absolute top-[125px] left-[50px] sm:left-[80px] md:left-[90px] z-20 w-[260px] sm:w-[290px] md:w-[300px] bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:bg-white/[0.06] hover:border-primary/20 hover:scale-[1.03] transition-all duration-300 animate-float"
                style={{ animationDuration: '7s', animationDelay: '1.5s' }}
              >
                <div className="flex flex-col gap-3">
                  <div>
                    <span className="inline-block text-[10px] font-black tracking-wider uppercase text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/25 px-3 py-1 rounded-full font-mono">
                      GAMING
                    </span>
                  </div>
                  <div>
                    <h3 className="text-15px sm:text-base font-black tracking-wide text-white">Xbox Game Pass Ultimate</h3>
                    <p className="text-[11px] sm:text-xs text-white/50 mt-1.5 font-medium">100+ Games • PC/Console</p>
                  </div>
                  <div className="text-sm font-black text-white mt-1 font-mono">
                    $9.99
                  </div>
                </div>
              </div>

              {/* Card 3: ChatGPT Plus (Bottom-Right) */}
              <div 
                className="absolute top-[250px] left-[100px] sm:left-[160px] md:left-[180px] z-30 w-[260px] sm:w-[290px] md:w-[300px] bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:bg-white/[0.06] hover:border-primary/20 hover:scale-[1.03] transition-all duration-300 animate-float"
                style={{ animationDuration: '8s', animationDelay: '3s' }}
              >
                <div className="flex flex-col gap-3">
                  <div>
                    <span className="inline-block text-[10px] font-black tracking-wider uppercase text-white/60 bg-white/5 border border-white/10 px-3 py-1 rounded-full font-mono">
                      AI TOOLS
                    </span>
                  </div>
                  <div>
                    <h3 className="text-15px sm:text-base font-black tracking-wide text-white">ChatGPT Plus</h3>
                    <p className="text-[11px] sm:text-xs text-white/50 mt-1.5 font-medium">GPT-4 access • Shared account</p>
                  </div>
                  <div className="text-sm font-black text-white mt-1 font-mono">
                    $6.50
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
