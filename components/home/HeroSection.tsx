'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-[#009ee3] via-[#008cc9] to-blue-900 text-white overflow-hidden min-h-[80vh] flex items-center pt-32 pb-16 lg:pt-36 lg:pb-24">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

      {/* Glowing Lobby Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#fff159]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* LEFT WING: Precise copy and CTA nodes */}
          <div className="lg:col-span-6 flex flex-col items-center text-center lg:items-start lg:text-left">

            {/* Glitch-free high-conversion heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.75rem] xl:text-[4.25rem] font-black leading-[1.1] mb-8 sm:mb-10 font-heading uppercase tracking-wide text-white">
              Premium Digital <br />
              Products, <span className="text-[#fff159] drop-shadow-[0_0_12px_rgba(255,241,89,0.45)]">Delivered</span> <br />
              <span className="text-[#fff159] drop-shadow-[0_0_12px_rgba(255,241,89,0.45)]">Instantly.</span>
            </h1>

            {/* Button Layout */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto font-heading">
              <Link
                href={ROUTES.PRODUCTS}
                className="btn-premium-shine inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#fff159] hover:bg-[#ffe600] text-slate-900 font-extrabold text-sm tracking-widest uppercase transition-all duration-200 shadow-[0_4px_12px_rgba(255,241,89,0.35)] hover:shadow-[0_4px_20px_rgba(255,241,89,0.55)]"
              >
                Browse Products
              </Link>
              <Link
                href={ROUTES.SUPPORT}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-extrabold text-sm tracking-widest uppercase hover:bg-white/20 hover:border-white/30 transition-all duration-200"
              >
                Contact Support
              </Link>
            </div>

          </div>

          {/* RIGHT WING: Overlapping glassmorphism cards & rotating circular radar */}
          <div className="lg:col-span-6 flex justify-center items-center relative h-[420px] sm:h-[500px] lg:h-[520px] w-full">

            {/* Concentric Spinning Radar Circles backdrop (6 Concentric Rings) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">

              {/* Ring 1 (Outermost - 530px) */}
              <div className="absolute w-[440px] md:w-[530px] h-[440px] md:h-[530px] border-2 border-dashed border-white/5 rounded-full animate-spin-slow"></div>

              {/* Ring 2 (460px) */}
              <div className="absolute w-[380px] md:w-[460px] h-[380px] md:h-[460px] rounded-full border-2 border-t-2 border-r-2 border-transparent border-t-white/30 border-r-[#fff159]/20 animate-spin-reverse-slow"></div>

              {/* Ring 3 (400px) */}
              <div className="absolute w-[330px] md:w-[400px] h-[330px] md:h-[400px] border border-dotted border-white/10 rounded-full"></div>

              {/* Ring 4 (340px) */}
              <div className="absolute w-[280px] md:w-[340px] h-[280px] md:h-[340px] border-2 border-dashed border-white/10 rounded-full animate-spin-fast"></div>

              {/* Ring 5 (280px) */}
              <div className="absolute w-[220px] md:w-[280px] h-[220px] md:h-[280px] rounded-full border-2 border-t-2 border-l-2 border-transparent border-t-white/20 border-l-[#fff159]/10 animate-spin-reverse-fast"></div>

              {/* Ring 6 (Innermost - 200px) */}
              <div className="absolute w-[150px] md:w-[200px] h-[150px] md:h-[200px] border border-dotted border-white/5 rounded-full"></div>
            </div>

            {/* Cascading Glass Cards Container */}
            <div className="relative w-full max-w-[480px] h-[400px] mt-4">

              {/* Card 1: Netflix Premium (Top-Left) */}
              <div
                className="absolute top-0 left-0 sm:left-2 z-10 w-[240px] sm:w-[290px] md:w-[300px] animate-float"
                style={{ animationDuration: '6s' }}
              >
                <div className="w-full h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:bg-white/20 hover:border-white/30 hover:scale-[1.03] transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out">
                  <div className="flex flex-col gap-3">
                    <div>
                      <span className="inline-block text-xs font-black tracking-wider uppercase text-[#fff159] bg-[#fff159]/10 border border-[#fff159]/25 px-3 py-1 rounded-full font-mono">
                        STREAMING
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black tracking-wide text-white">Netflix Premium</h3>
                      <p className="text-xs sm:text-sm text-white/70 mt-1.5 font-medium">4K Ultra HD • 1 Month Access</p>
                    </div>
                    <div className="text-[15px] font-black text-white mt-1 font-mono">
                      $4.99
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Xbox Game Pass Ultimate (Middle) */}
              <div
                className="absolute top-[120px] left-[40px] sm:left-[80px] md:left-[90px] z-20 w-[240px] sm:w-[290px] md:w-[300px] animate-float"
                style={{ animationDuration: '7s', animationDelay: '1.5s' }}
              >
                <div className="w-full h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:bg-white/20 hover:border-white/30 hover:scale-[1.03] transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out">
                  <div className="flex flex-col gap-3">
                    <div>
                      <span className="inline-block text-xs font-black tracking-wider uppercase text-white bg-white/10 border border-white/20 px-3 py-1 rounded-full font-mono">
                        GAMING
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black tracking-wide text-white">Xbox Game Pass Ultimate</h3>
                      <p className="text-xs sm:text-sm text-white/70 mt-1.5 font-medium">100+ Games • PC/Console</p>
                    </div>
                    <div className="text-[15px] font-black text-white mt-1 font-mono">
                      $9.99
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: ChatGPT Plus (Bottom-Right) */}
              <div
                className="absolute top-[240px] left-[70px] sm:left-[160px] md:left-[180px] z-30 w-[240px] sm:w-[290px] md:w-[300px] animate-float"
                style={{ animationDuration: '8s', animationDelay: '3s' }}
              >
                <div className="w-full h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:bg-white/20 hover:border-white/30 hover:scale-[1.03] transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out">
                  <div className="flex flex-col gap-3">
                    <div>
                      <span className="inline-block text-xs font-black tracking-wider uppercase text-white/90 bg-white/15 border border-white/25 px-3 py-1 rounded-full font-mono">
                        AI TOOLS
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black tracking-wide text-white">ChatGPT Plus</h3>
                      <p className="text-xs sm:text-sm text-white/70 mt-1.5 font-medium">GPT-4 access • Shared account</p>
                    </div>
                    <div className="text-[15px] font-black text-white mt-1 font-mono">
                      $6.50
                    </div>
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
