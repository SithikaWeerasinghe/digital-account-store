'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ROUTES, APP_NAME } from '@/lib/constants';
import { Menu, X, Zap } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Products', href: ROUTES.PRODUCTS },
    { label: 'Support', href: ROUTES.SUPPORT },
  ];

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
        scrolled ? 'shadow-md border-b border-gray-100' : 'border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-8">

          {/* Logo — left */}
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2.5 flex-shrink-0"
          >
            <div className="w-9 h-9 bg-[#009ee3] rounded-xl flex items-center justify-center shadow-sm">
              <Zap size={18} className="text-[#ffd700]" fill="#ffd700" />
            </div>
            <span className="text-lg font-extrabold text-[#0d1b2a] tracking-tight">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Nav — center */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-[#009ee3] hover:bg-blue-50 rounded-lg transition-all duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA — right */}
          <div className="hidden md:flex items-center flex-shrink-0">
            <Link
              href={ROUTES.PRODUCTS}
              className="apex-btn-primary text-sm py-2.5 px-5 rounded-xl"
            >
              Browse Products
            </Link>
          </div>

          {/* Mobile hamburger — pushed to right */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 pt-3 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:text-[#009ee3] hover:bg-blue-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 pb-1">
              <Link
                href={ROUTES.PRODUCTS}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#009ee3] text-white text-sm font-bold hover:bg-[#007ec0] transition-colors shadow-sm"
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
