import Link from 'next/link';
import { ROUTES, APP_NAME } from '@/lib/constants';
import { Shield, Zap, Clock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050509] border-t border-border text-text-secondary relative overflow-hidden">
      {/* Decorative top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-primary blur-md opacity-20"></div>

      {/* Trust Bar */}
      <div className="border-b border-border bg-[#0B0B12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm font-semibold tracking-wider uppercase">
            <span className="flex items-center gap-2 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
              <Zap size={16} className="text-primary" />
              Instant Delivery
            </span>
            <span className="text-border hidden sm:block">|</span>
            <span className="flex items-center gap-2 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
              <Shield size={16} className="text-primary" />
              Secure Checkout
            </span>
            <span className="text-border hidden sm:block">|</span>
            <span className="flex items-center gap-2 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
              <Clock size={16} className="text-primary" />
              24/7 Support
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={ROUTES.HOME} className="inline-block mb-6">
              <span className="text-2xl font-bold font-[family-name:var(--font-heading)] text-white tracking-widest uppercase drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-text-secondary">
              A premium digital marketplace offering instant access to gaming, streaming, AI tools, and software products.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest mb-6 border-b border-border pb-2 inline-block">Explore</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: ROUTES.HOME },
                { label: 'Browse Products', href: ROUTES.PRODUCTS },
                { label: 'Checkout', href: ROUTES.CHECKOUT },
                { label: 'Help Center', href: ROUTES.SUPPORT },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm font-medium hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white text-sm font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest mb-6 border-b border-border pb-2 inline-block">Legal</h3>
            <ul className="space-y-3">
              {[
                { label: 'Terms of Service', href: '#' },
                { label: 'Privacy Policy', href: '#' },
                { label: 'Refund Policy', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm font-medium hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guarantees */}
          <div>
            <h3 className="text-white text-sm font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest mb-6 border-b border-border pb-2 inline-block">Guarantees</h3>
            <ul className="space-y-3 text-sm font-medium text-text-secondary">
              <li className="flex items-center gap-2"><span className="text-primary">✓</span> Verified Stock</li>
              <li className="flex items-center gap-2"><span className="text-primary">✓</span> Safe Transactions</li>
              <li className="flex items-center gap-2"><span className="text-primary">✓</span> Instant Email Delivery</li>
              <li className="flex items-center gap-2"><span className="text-primary">✓</span> Priority Support</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#020204]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-secondary font-medium tracking-wide">
            © {currentYear} {APP_NAME}. ALL RIGHTS RESERVED.
          </p>
          <Link href={ROUTES.ADMIN.LOGIN} className="text-xs text-text-secondary/50 hover:text-primary transition-colors tracking-widest uppercase">
            System Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
