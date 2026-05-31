'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { Menu, X } from 'lucide-react';
import ApexFledLogo from '@/components/ui/ApexFledLogo';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === '/';

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname.startsWith('/admin')) {
    return null;
  }


  const navLinks = [
    { label: 'HOME', href: ROUTES.HOME },
    { label: 'CHECKOUT', href: ROUTES.CHECKOUT },
    { label: 'SUPPORT', href: ROUTES.SUPPORT },
  ];

  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={`z-50 transition-all duration-300 ${isHome ? 'fixed top-0 left-0 right-0' : 'sticky top-0'
        } ${isTransparent
          ? 'bg-transparent border-b border-white/10'
          : 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className={`transition-all duration-300 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover:drop-shadow-[0_0_16px_rgba(59,130,246,0.75)] group-hover:scale-105`}>
              <ApexFledLogo size={38} id="nav" />
            </div>
            <span className={`text-xl font-black font-heading tracking-widest uppercase transition-all duration-300 ${isTransparent ? 'text-white' : 'text-slate-800'}`}>
              APEX<span className={isTransparent ? 'text-[#60a5fa]' : 'text-primary'}>FLED</span>
            </span>
          </Link>

          {/* Simple Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] sm:text-sm font-black font-heading tracking-widest uppercase transition-colors duration-200 ${isTransparent
                    ? 'text-white/80 hover:text-[#fff159]'
                    : 'text-slate-600 hover:text-primary'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Simple Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href={ROUTES.PRODUCTS}
              className={`btn-premium-shine inline-flex items-center justify-center py-2.5 px-6 rounded-xl text-sm font-black font-heading tracking-widest uppercase border transition-all duration-300 ${isTransparent
                  ? 'border-white/25 bg-white/10 text-white hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                  : 'border-primary bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-[0_0_20px_rgba(0,158,227,0.35)]'
                }`}
            >
              Browse Products
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2.5 rounded-xl border transition-colors focus:outline-none ${isTransparent
                ? 'border-white/10 bg-white/5 text-white/80 hover:text-white hover:border-white/25'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md absolute w-full left-0 z-40 transition-all duration-300 ease-out origin-top ${mobileOpen
            ? 'opacity-100 translate-y-0 scale-y-100 visible'
            : 'opacity-0 -translate-y-2 scale-y-95 invisible pointer-events-none'
          }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-2.5 shadow-md">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 border border-slate-100 hover:border-primary/45 rounded-xl text-sm font-black tracking-widest uppercase text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 font-heading"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4">
            <Link
              href={ROUTES.PRODUCTS}
              onClick={() => setMobileOpen(false)}
              className="btn-premium-shine block w-full text-center py-3 border border-primary bg-primary text-white hover:bg-primary-hover text-sm font-black font-heading tracking-widest uppercase rounded-xl shadow-md transition-all duration-200"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
