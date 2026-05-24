'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { useState, useEffect, useRef } from 'react';

function StreamingIcon({ className, isSquare }: { className?: string; isSquare?: boolean }) {
  return (
    <svg className={`w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-105 transition-transform duration-300 ${className || ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className="animate-netflix-zoom">
        {/* Left Column of N */}
        <path 
          d="M 6,3 L 10,3 L 10,21 L 6,21 Z" 
          fill="#008cc9" 
          className="animate-netflix-left" 
        />
        {/* Right Column of N */}
        <path 
          d="M 14,3 L 18,3 L 18,21 L 14,21 Z" 
          fill="#008cc9" 
          className="animate-netflix-right" 
        />
        {/* Diagonal Ribbon Overlay of N */}
        <path 
          d="M 6,3 L 10,3 L 18,21 L 14,21 Z" 
          fill="#009ee3" 
          className="animate-netflix-diagonal"
          style={{ filter: 'drop-shadow(-2px 0px 4px rgba(0,0,0,0.2))' }}
        />
      </g>
    </svg>
  );
}

function AIToolsIcon({ className, isSquare }: { className?: string; isSquare?: boolean }) {
  return (
    <svg 
      className={`w-10 h-10 sm:w-12 sm:h-12 text-[#009ee3] transition-all duration-500 ease-out origin-center animate-chatgpt-pulse group-hover:animate-chatgpt-hover ${className || ''}`}
      viewBox="0 0 24 24" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z" />
    </svg>
  );
}

function GamingIcon({ className, isSquare }: { className?: string; isSquare?: boolean }) {
  return (
    <svg 
      className={`w-10 h-10 sm:w-12 sm:h-12 text-[#009ee3] group-hover:scale-105 transition-transform duration-300 ${className || ''}`} 
      viewBox="0 0 16 16" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Radar signal behind controller */}
      <circle cx="8" cy="8" r="7" className={`stroke-[#009ee3]/10 transition-all duration-500 origin-center ${isSquare ? 'animate-ping' : 'group-hover:animate-ping'}`} strokeWidth="0.5" />
      
      {/* Interactive Gamepad shake wrapping group */}
      <g className="group-hover:animate-gamepad-shake origin-center transition-all duration-300">
        
        {/* Modern Gamepad Outer Body with Curved Handles */}
        <path 
          d="M3.051 3.26a.5.5 0 0 1 .354-.613l1.932-.518a.5.5 0 0 1 .62.39c.655-.079 1.35-.117 2.043-.117.72 0 1.443.041 2.12.126a.5.5 0 0 1 .622-.399l1.932.518a.5.5 0 0 1 .306.729q.211.136.373.297c.408.408.78 1.05 1.095 1.772.32.733.599 1.591.805 2.466s.34 1.78.364 2.606c.024.816-.059 1.602-.328 2.21a1.42 1.42 0 0 1-1.445.83c-.636-.067-1.115-.394-1.513-.773-.245-.232-.496-.526-.739-.808-.126-.148-.25-.292-.368-.423-.728-.804-1.597-1.527-3.224-1.527s-2.496.723-3.224 1.527c-.119.131-.242.275-.368.423-.243.282-.494.575-.739.808-.398.38-.877.706-1.513.773a1.42 1.42 0 0 1-1.445-.83c-.27-.608-.352-1.395-.329-2.21.024-.826.16-1.73.365-2.606.206-.875.486-1.733.805-2.466.315-.722.687-1.364 1.094-1.772a2.3 2.3 0 0 1 .433-.335l-.028-.079z" 
          className="stroke-[#009ee3] fill-white" 
          strokeWidth="0.8"
        />

        {/* D-Pad cross */}
        <path 
          d="M 5,6.5 H 6 V 7.5 H 5 Z" 
          className="fill-[#009ee3]/25 stroke-[#009ee3]" 
          strokeWidth="0.5"
        />
        <path d="M 5.5,6 V 8 M 4.5,7 H 6.5" className="stroke-[#008cc9]" strokeWidth="0.6" />

        {/* Action Buttons (glowing/pulsing) */}
        {/* Y Button (Top) */}
        <circle cx="11.5" cy="5.8" r="0.5" fill="currentColor" className="text-[#008cc9] animate-pulse" style={{ animationDelay: '0.1s' }} />
        {/* X Button (Left) */}
        <circle cx="10.5" cy="6.8" r="0.5" fill="currentColor" className="text-[#008cc9] animate-pulse" style={{ animationDelay: '0.3s' }} />
        {/* B Button (Right) */}
        <circle cx="12.5" cy="6.8" r="0.5" fill="currentColor" className="text-[#008cc9] animate-pulse" style={{ animationDelay: '0.5s' }} />
        {/* A Button (Bottom) */}
        <circle cx="11.5" cy="7.8" r="0.5" fill="currentColor" className="text-[#008cc9] animate-pulse" style={{ animationDelay: '0.7s' }} />

        {/* Menu Buttons in Center */}
        <line x1="7.2" y1="6.8" x2="7.8" y2="6.8" className="stroke-[#009ee3]/80" strokeWidth="0.5" />
        <line x1="8.2" y1="6.8" x2="8.8" y2="6.8" className="stroke-[#009ee3]/80" strokeWidth="0.5" />
      </g>
    </svg>
  );
}

function SoftwareIcon({ className, isSquare }: { className?: string; isSquare?: boolean }) {
  return (
    <svg 
      className={`w-10 h-10 sm:w-12 sm:h-12 text-[#009ee3] group-hover:scale-105 transition-transform duration-300 ${className || ''}`} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circuit board grid backing */}
      <path d="M 2,12 L 5,12 L 7,10 L 10,10" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
      <path d="M 22,12 L 19,12 L 17,14 L 14,14" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
      <path d="M 12,2 L 12,5 L 10,7 L 10,10" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
      <path d="M 12,22 L 12,19 L 14,17 L 14,14" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />

      {/* Main CPU core body (glowing & pulsing) */}
      <rect 
        x="6" 
        y="6" 
        width="12" 
        height="12" 
        rx="1.5" 
        fill="white" 
        stroke="currentColor" 
        strokeWidth="1.5"
        className="animate-cpu-core"
      />
      
      {/* CPU core details (silicon wafer pattern) */}
      <rect x="8.5" y="8.5" width="7" height="7" rx="0.8" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1" />
      
      {/* Branching circuit traces with sequential dash flow */}
      <path 
        d="M 6,8 L 3,8 L 2,7" 
        stroke="currentColor" 
        strokeWidth="1.2" 
        strokeLinecap="round"
        className="animate-cpu-trace" 
      />
      <circle cx="2" cy="7" r="1.2" fill="currentColor" className="animate-pulse" />

      <path 
        d="M 18,8 L 21,8 L 22,7" 
        stroke="currentColor" 
        strokeWidth="1.2" 
        strokeLinecap="round"
        className="animate-cpu-trace" 
        style={{ animationDelay: '0.3s' }}
      />
      <circle cx="22" cy="7" r="1.2" fill="currentColor" className="animate-pulse" style={{ animationDelay: '0.3s' }} />

      <path 
        d="M 6,16 L 3,16 L 2,17" 
        stroke="currentColor" 
        strokeWidth="1.2" 
        strokeLinecap="round"
        className="animate-cpu-trace" 
        style={{ animationDelay: '0.6s' }}
      />
      <circle cx="2" cy="17" r="1.2" fill="currentColor" className="animate-pulse" style={{ animationDelay: '0.6s' }} />

      <path 
        d="M 18,16 L 21,16 L 22,17" 
        stroke="currentColor" 
        strokeWidth="1.2" 
        strokeLinecap="round"
        className="animate-cpu-trace" 
        style={{ animationDelay: '0.9s' }}
      />
      <circle cx="22" cy="17" r="1.2" fill="currentColor" className="animate-pulse" style={{ animationDelay: '0.9s' }} />

      {/* Micro Pin connections around the edge of the CPU */}
      <line x1="8" y1="5" x2="8" y2="6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="10" y1="5" x2="10" y2="6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="12" y1="5" x2="12" y2="6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="14" y1="5" x2="14" y2="6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="16" y1="5" x2="16" y2="6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />

      <line x1="8" y1="18" x2="8" y2="19" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="10" y1="18" x2="10" y2="19" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="12" y1="18" x2="12" y2="19" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="14" y1="18" x2="14" y2="19" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="16" y1="18" x2="16" y2="19" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />

      <line x1="5" y1="8" x2="6" y2="8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="5" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="5" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="5" y1="14" x2="6" y2="14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="5" y1="16" x2="6" y2="16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />

      <line x1="18" y1="8" x2="19" y2="8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="18" y1="10" x2="19" y2="10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="18" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="18" y1="14" x2="19" y2="14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="18" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />

      {/* Central Wafer Core element pulsing */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" className="animate-ping" style={{ animationDuration: '3s' }} />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

function ProductivityIcon({ className, isSquare }: { className?: string; isSquare?: boolean }) {
  return (
    <svg className={`w-10 h-10 sm:w-12 sm:h-12 text-[#009ee3] group-hover:scale-105 transition-transform duration-300 ${className || ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Checklist page */}
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" className={`transition-all duration-300 ${isSquare ? 'stroke-[#008cc9]' : ''}`} />
      <path d="M14 2v6h6" />
      {/* Text lines */}
      <line x1="8" y1="13" x2="16" y2="13" className="stroke-[#009ee3]/30" />
      <line x1="8" y1="17" x2="14" y2="17" className="stroke-[#009ee3]/30" />
      {/* Checklist item (checkmark drawing itself) */}
      <path d="M8 12.5l2 2 4.5-4.5" className="stroke-[#008cc9] animate-draw-check origin-center" style={{ strokeDasharray: 20, strokeDashoffset: 0 }} />
      {/* Mini spinning clock inside the document */}
      <circle cx="16" cy="6" r="2.5" className="stroke-[#009ee3]/25 fill-[#009ee3]/5" />
      <line x1="16" y1="6" x2="16" y2="4.5" className="stroke-[#008cc9] animate-clock-hand" style={{ transformOrigin: '16px 6px' }} />
    </svg>
  );
}

function GiftCardsIcon({ className, isSquare }: { className?: string; isSquare?: boolean }) {
  return (
    <svg 
      className={`w-10 h-10 sm:w-12 sm:h-12 text-[#009ee3] group-hover:scale-105 transition-transform duration-300 ${className || ''}`} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background soft glow rings radiating from heart */}
      <circle cx="12" cy="12" r="9.5" className={`stroke-[#009ee3]/10 transition-all duration-500 origin-center ${isSquare ? 'animate-ping' : 'group-hover:animate-ping'}`} strokeWidth="0.8" />
      
      {/* Floating sparkles */}
      <path 
        d="M 6,6 L 6.5,7.5 L 8,8 L 6.5,8.5 L 6,10 L 5.5,8.5 L 4,8 L 5.5,7.5 Z" 
        fill="currentColor" 
        fillOpacity="0.6" 
        className="animate-ping" 
        style={{ animationDuration: '2s' }} 
      />
      <path 
        d="M 18,5 L 18.3,6.2 L 19.5,6.5 L 18.3,6.8 L 18,8 L 17.7,6.8 L 16.5,6.5 L 17.7,6.2 Z" 
        fill="currentColor" 
        fillOpacity="0.4" 
        className="animate-ping" 
        style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} 
      />

      {/* Main Heart shape (glowing, pulsing, double-heartbeat) */}
      <path 
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
        fill="#fff159" 
        fillOpacity="0.1" 
        stroke="#fff159" 
        strokeWidth="2" 
        className="animate-heartbeat"
      />
    </svg>
  );
}

const categories = [
  {
    name: 'Streaming',
    description: 'Entertainment subscriptions & media access',
    icon: StreamingIcon,
    query: 'Streaming',
    color: 'text-primary',
    bgColor: 'bg-primary/5',
    borderColor: 'group-hover:border-primary/40 group-hover:shadow-[0_0_12px_rgba(0,158,227,0.2)]',
    iconAnimClass: 'animate-tv'
  },
  {
    name: 'AI Tools',
    description: 'AI assistants, writing & design tools',
    icon: AIToolsIcon,
    query: 'AI Tools',
    color: 'text-primary',
    bgColor: 'bg-primary/5',
    borderColor: 'group-hover:border-primary/40 group-hover:shadow-[0_0_12px_rgba(0,158,227,0.2)]',
    iconAnimClass: ''
  },
  {
    name: 'Gaming',
    description: 'In-game items, bundles & game passes',
    icon: GamingIcon,
    query: 'Gaming',
    color: 'text-primary',
    bgColor: 'bg-primary/5',
    borderColor: 'group-hover:border-primary/40 group-hover:shadow-[0_0_12px_rgba(0,158,227,0.2)]',
    iconAnimClass: ''
  },
  {
    name: 'Software',
    description: 'License keys for essential software',
    icon: SoftwareIcon,
    query: 'Software',
    color: 'text-primary',
    bgColor: 'bg-primary/5',
    borderColor: 'group-hover:border-primary/40 group-hover:shadow-[0_0_12px_rgba(0,158,227,0.25)]',
    iconAnimClass: ''
  },
  {
    name: 'Productivity',
    description: 'Cloud storage, learning & work tools',
    icon: ProductivityIcon,
    query: 'Productivity',
    color: 'text-primary',
    bgColor: 'bg-primary/5',
    borderColor: 'group-hover:border-primary/40 group-hover:shadow-[0_0_12px_rgba(0,158,227,0.2)]',
    iconAnimClass: ''
  },
  {
    name: 'Gift Cards',
    description: 'Digital gift codes for popular platforms',
    icon: GiftCardsIcon,
    query: 'Gift Cards',
    color: 'text-primary',
    bgColor: 'bg-primary/5',
    borderColor: 'group-hover:border-primary/40 group-hover:shadow-[0_0_12px_rgba(0,158,227,0.2)]',
    iconAnimClass: ''
  },
];

export default function CategorySection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isRectangular, setIsRectangular] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // When the top of the section enters past 55% of window height (crosses middle of screen), morph into rectangles
      setIsRectangular(rect.top < windowHeight * 0.55);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="pt-10 pb-16 bg-secondary-background relative overflow-hidden">
      {/* Background grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,158,227,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(0,158,227,0.012)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header telemetry style */}
        <div className="text-center mb-6">
          <h2 className="text-3xl sm:text-4xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
            Explore Popular Categories
          </h2>
          <p className="text-sm text-text-secondary font-medium max-w-xl mx-auto leading-relaxed">
            Find exactly what you need across our curated selection of digital products.
          </p>
          <div className="w-16 h-[2px] bg-primary mx-auto mt-6 shadow-[0_0_10px_rgba(0,158,227,0.6)]"></div>
        </div>

        {/* Vertical Stack of Category Cards */}
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full items-center">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            const isSquare = !isRectangular;
            return (
              <Link
                key={cat.name}
                href={`${ROUTES.PRODUCTS}?category=${encodeURIComponent(cat.query)}`}
                className={`group flex items-center cursor-pointer relative overflow-hidden bg-card border border-border hover:bg-slate-50/50 transition-all duration-700 ease-out shadow-sm hover:shadow-[0_8px_25px_rgba(0,158,227,0.08)] ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                } ${
                  isRectangular 
                    ? 'w-full max-w-4xl rounded-[32px] p-6 sm:p-8 border-primary/20 h-auto min-h-[120px] sm:min-h-[136px]' 
                    : 'is-square w-36 h-36 sm:w-44 sm:h-44 rounded-[44px] justify-center p-0 border-white/10 mx-auto'
                }`}
                style={{ animationDelay: isVisible ? `${index * 150}ms` : '0ms' }}
              >
                {/* Glowing Icon Container */}
                <div className={`flex items-center justify-center flex-shrink-0 transition-all duration-700 ease-out ${cat.bgColor} border border-border ${cat.borderColor} ${
                  isRectangular ? 'w-20 h-20 mr-6 rounded-[22px]' : 'w-24 h-24 sm:w-28 sm:h-28 rounded-[30px] sm:rounded-[36px]'
                }`}>
                  <Icon className={cat.iconAnimClass} isSquare={isSquare} />
                </div>
                
                {/* Content Area */}
                <div className={`flex-1 flex flex-col justify-center transition-all duration-700 ${
                  isRectangular ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0 overflow-hidden pointer-events-none'
                }`}>
                  <h3 className="text-xl sm:text-2xl font-black font-heading tracking-wider uppercase text-slate-800 group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  
                  {/* Expandable description */}
                  <div className="max-h-0 opacity-0 group-hover:max-h-[60px] group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden mt-0 group-hover:mt-1.5 transform translate-y-1 group-hover:translate-y-0">
                    <p className="text-[15px] sm:text-lg text-text-secondary leading-relaxed font-medium">
                      {cat.description}
                    </p>
                  </div>
                </div>

                {/* Interactive Arrow Indicator */}
                <div className={`transition-all duration-700 ${
                  isRectangular ? 'opacity-30 group-hover:opacity-100 group-hover:translate-x-1 ml-5' : 'opacity-0 w-0 overflow-hidden pointer-events-none'
                } text-slate-400 group-hover:text-primary`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
