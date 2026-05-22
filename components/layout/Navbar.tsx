'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ROUTES, APP_NAME } from '@/lib/constants';
import { Menu, X, Zap } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Products', href: ROUTES.PRODUCTS },
    { label: 'Support', href: ROUTES.SUPPORT },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-9 h-9 bg-[#009ee3] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm">
              <Zap size={18} className="text-[#fff159] fill-[#fff159]" />
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight group-hover:text-[#009ee3] transition-colors">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold text-gray-600 hover:text-[#009ee3] transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href={ROUTES.PRODUCTS}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#009ee3] text-white text-sm font-bold hover:bg-[#008cc9] shadow-sm hover:shadow-md transition-all duration-300"
            >
              Browse Products
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 border border-gray-200/60 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-lg">
          <div className="px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:text-[#009ee3] hover:bg-gray-50 transition-all"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 px-4">
              <Link
                href={ROUTES.PRODUCTS}
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-3.5 rounded-xl bg-[#009ee3] text-white text-sm font-bold hover:bg-[#008cc9] shadow-sm"
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
