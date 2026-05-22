'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ROUTES, APP_NAME } from '@/lib/constants';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Products', href: ROUTES.PRODUCTS },
    { label: 'Checkout', href: ROUTES.CHECKOUT },
    { label: 'Support', href: ROUTES.SUPPORT },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/90 backdrop-blur-md border-b border-border shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2 flex-shrink-0 group">
            <span className="text-2xl font-bold font-[family-name:var(--font-heading)] text-white tracking-widest uppercase transition-all duration-300 group-hover:text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold tracking-wider uppercase text-text-secondary hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href={ROUTES.PRODUCTS}
              className="mp-button-primary"
            >
              Browse Products
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md text-text-secondary hover:text-white hover:bg-card transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md absolute w-full left-0">
          <div className="px-4 pt-4 pb-6 space-y-2 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-semibold tracking-wider uppercase text-text-secondary hover:text-white hover:bg-border/50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 pb-2">
              <Link
                href={ROUTES.PRODUCTS}
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center mp-button-primary"
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
