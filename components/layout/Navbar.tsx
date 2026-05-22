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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-[#009ee3] rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-[#fff159]" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-[#009ee3] transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href={ROUTES.PRODUCTS}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#009ee3] text-white text-sm font-semibold hover:bg-[#008cc9] transition-colors duration-150"
            >
              Browse Products
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 pt-3 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-[#009ee3] hover:bg-blue-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href={ROUTES.PRODUCTS}
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-lg bg-[#009ee3] text-white text-sm font-semibold hover:bg-[#008cc9] transition-colors"
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
