'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ROUTES, APP_NAME } from '@/lib/constants';
import { Menu, X, Zap } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';
  const isTransparent = isHome && !scrolled && !mobileOpen;

  const navLinks = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Browse Products', href: ROUTES.PRODUCTS },
    { label: 'Support', href: ROUTES.SUPPORT },
  ];

  return (
    <header className={`z-50 px-4 sm:px-6 lg:px-8 pt-4 transition-all duration-300 ${
      isTransparent ? 'absolute top-0 left-0 right-0' : 'sticky top-0'
    }`}>
      <div className={`max-w-7xl mx-auto border rounded-2xl transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent border-transparent shadow-none'
          : 'bg-white/75 backdrop-blur-xl border-gray-200/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
      }`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link href={ROUTES.HOME} className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-9 h-9 bg-gradient-to-br from-[#009ee3] to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-md shadow-[#009ee3]/20">
                <Zap size={16} className="text-[#fff159] fill-[#fff159] group-hover:scale-110 transition-transform" />
              </div>
              <span className={`text-lg font-black tracking-tight transition-colors ${
                isTransparent 
                  ? 'text-white group-hover:text-[#fff159]' 
                  : 'text-gray-900 group-hover:text-[#009ee3]'
              }`}>
                {APP_NAME}
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-semibold tracking-wide transition-colors duration-200 ${
                      isTransparent
                        ? 'text-white/85 hover:text-[#fff159]'
                        : 'text-slate-600 hover:text-[#009ee3]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-xl border transition-colors cursor-pointer ${
                isTransparent
                  ? 'text-white hover:bg-white/10 border-white/25'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60 border-gray-200/40'
              }`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-150 px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-[#009ee3] hover:bg-slate-50 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
