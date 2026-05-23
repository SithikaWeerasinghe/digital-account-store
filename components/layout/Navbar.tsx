'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ROUTES } from '@/lib/constants';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', href: ROUTES.HOME },
    { label: 'PRODUCTS', href: ROUTES.PRODUCTS },
    { label: 'CHECKOUT', href: ROUTES.CHECKOUT },
    { label: 'SUPPORT', href: ROUTES.SUPPORT },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#050509]/95 backdrop-blur-md border-b border-white/5 shadow-lg' 
          : 'bg-[#050509]/60 backdrop-blur-sm border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Clean Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2 flex-shrink-0 group">
            <span className="text-xl font-black font-heading text-white tracking-widest uppercase transition-all duration-300 group-hover:text-primary">
              APEX<span className="text-primary group-hover:text-white transition-colors"> DIGITAL</span>
            </span>
          </Link>

          {/* Simple Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-black font-heading tracking-widest uppercase text-white/70 hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Simple Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href={ROUTES.PRODUCTS}
              className="inline-flex items-center justify-center py-2.5 px-6 rounded-xl bg-primary text-white text-xs font-black font-heading tracking-widest uppercase hover:bg-primary-hover shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-300"
            >
              Browse Products
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2.5 rounded-xl border border-white/10 bg-[#0E1017] text-white/70 hover:text-white hover:border-primary/50 transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0E1017]/95 backdrop-blur-md absolute w-full left-0 z-40">
          <div className="px-4 pt-4 pb-6 space-y-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 border border-[#1D1F2D] hover:border-primary/40 rounded-xl text-xs font-black tracking-widest uppercase text-white/70 hover:text-white hover:bg-primary/5 transition-all duration-200 font-heading"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4">
              <Link
                href={ROUTES.PRODUCTS}
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-3 bg-primary text-white text-xs font-black font-heading tracking-widest uppercase rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
