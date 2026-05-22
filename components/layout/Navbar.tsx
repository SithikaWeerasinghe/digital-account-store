'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ROUTES, APP_NAME } from '@/lib/constants';
import { Menu, X, Zap } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'Products', href: ROUTES.PRODUCTS },
  { label: 'Checkout', href: ROUTES.CHECKOUT },
  { label: 'Support', href: ROUTES.SUPPORT },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#050509]/95 backdrop-blur-md border-b border-[#8B5CF6]/30 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link href={ROUTES.HOME} className="flex items-center gap-2 flex-shrink-0 group">
              <div className="w-8 h-8 bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_18px_rgba(168,85,247,0.7)] transition-shadow duration-300">
                <Zap size={16} className="text-white fill-white" />
              </div>
              <span
                className="text-xl font-black tracking-widest uppercase text-white transition-all duration-300"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                APEX{' '}
                <span className="text-[#A855F7] drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
                  DIGITAL
                </span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-xs font-bold tracking-[0.15em] uppercase text-[#A1A1AA] hover:text-white transition-colors duration-200 group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#A855F7] shadow-[0_0_6px_rgba(168,85,247,0.8)] group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link href={ROUTES.PRODUCTS} className="mp-button-primary text-xs px-5 py-2.5">
                Browse Products
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#11111A] border border-transparent hover:border-[#25253A] transition-all duration-200 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#050509]/95 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
          />
          {/* Menu content */}
          <div className="relative z-50 flex flex-col h-full pt-24 px-8">
            {/* Decorative top line */}
            <div className="absolute top-20 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/50 to-transparent" />

            <nav className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-4 rounded-xl text-lg font-bold tracking-widest uppercase text-[#A1A1AA] hover:text-white hover:bg-[#11111A] border border-transparent hover:border-[#25253A] transition-all duration-200"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8">
              <Link
                href={ROUTES.PRODUCTS}
                onClick={() => setMobileOpen(false)}
                className="mp-button-primary w-full py-4 text-base"
              >
                Browse Products
              </Link>
            </div>

            {/* Decorative bottom accent */}
            <div className="mt-auto pb-12 flex items-center gap-3">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#25253A] to-transparent" />
              <span className="text-xs tracking-widest uppercase text-[#6B7280]">{APP_NAME}</span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-[#25253A] to-transparent" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
