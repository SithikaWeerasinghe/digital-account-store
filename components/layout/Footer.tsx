import Link from 'next/link';
import { ROUTES, APP_NAME } from '@/lib/constants';
import { Shield, Zap, Clock, CheckCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050509] border-t border-[#25253A] text-[#A1A1AA] relative overflow-hidden">
      {/* Top purple glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-60" />

      {/* Trust Bar */}
      <div className="border-b border-[#25253A] bg-[#0B0B12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-xs font-bold tracking-[0.15em] uppercase">
            <span className="flex items-center gap-2 text-white">
              <Zap size={14} className="text-[#8B5CF6]" />
              Instant Delivery
            </span>
            <span className="text-[#25253A] hidden sm:block">|</span>
            <span className="flex items-center gap-2 text-white">
              <Shield size={14} className="text-[#8B5CF6]" />
              Secure Checkout
            </span>
            <span className="text-[#25253A] hidden sm:block">|</span>
            <span className="flex items-center gap-2 text-white">
              <Clock size={14} className="text-[#8B5CF6]" />
              24/7 Support
            </span>
            <span className="text-[#25253A] hidden sm:block">|</span>
            <span className="flex items-center gap-2 text-white">
              <CheckCircle size={14} className="text-[#8B5CF6]" />
              Verified Stock
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={ROUTES.HOME} className="inline-flex items-center gap-2 mb-5 group">
              <div className="w-7 h-7 bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] rounded-md flex items-center justify-center">
                <Zap size={13} className="text-white fill-white" />
              </div>
              <span
                className="text-lg font-black tracking-widest uppercase text-white"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                APEX <span className="text-[#A855F7]">DIGITAL</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#6B7280]">
              A premium digital marketplace for gaming, streaming, AI tools, and software products — delivered instantly.
            </p>
            <div className="mt-5 flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#11111A] border border-[#25253A] flex items-center justify-center hover:border-[#8B5CF6]/50 hover:bg-[#8B5CF6]/10 transition-all cursor-pointer">
                <Zap size={14} className="text-[#8B5CF6]" />
              </div>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3
              className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6 pb-2 border-b border-[#25253A] inline-block"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Explore
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: ROUTES.HOME },
                { label: 'Browse Products', href: ROUTES.PRODUCTS },
                { label: 'Checkout', href: ROUTES.CHECKOUT },
                { label: 'Help Center', href: ROUTES.SUPPORT },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-[#A1A1AA] hover:text-[#A855F7] hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3
              className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6 pb-2 border-b border-[#25253A] inline-block"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Legal
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Terms of Service', href: '#' },
                { label: 'Privacy Policy', href: '#' },
                { label: 'Refund Policy', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-[#A1A1AA] hover:text-[#A855F7] hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guarantees */}
          <div>
            <h3
              className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6 pb-2 border-b border-[#25253A] inline-block"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Guarantees
            </h3>
            <ul className="space-y-3 text-sm font-medium text-[#A1A1AA]">
              <li className="flex items-center gap-2">
                <span className="text-[#8B5CF6] drop-shadow-[0_0_4px_rgba(139,92,246,0.8)]">✓</span>
                Verified Stock
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8B5CF6] drop-shadow-[0_0_4px_rgba(139,92,246,0.8)]">✓</span>
                Safe Transactions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8B5CF6] drop-shadow-[0_0_4px_rgba(139,92,246,0.8)]">✓</span>
                Instant Email Delivery
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8B5CF6] drop-shadow-[0_0_4px_rgba(139,92,246,0.8)]">✓</span>
                Priority Support
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#020204] border-t border-[#25253A]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[#6B7280] font-medium tracking-wide">
            © {currentYear}{' '}
            <span style={{ fontFamily: 'var(--font-orbitron)' }} className="text-[#A1A1AA]">
              {APP_NAME}
            </span>
            . ALL RIGHTS RESERVED.
          </p>
          <Link
            href={ROUTES.ADMIN.LOGIN}
            className="text-xs text-[#6B7280]/50 hover:text-[#8B5CF6] transition-colors tracking-widest uppercase"
          >
            System Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
