'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ROUTES, APP_NAME } from '@/lib/constants';
import { Shield, Zap, Clock, Terminal, ChevronRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#050509] border-t border-[#25253A] text-text-secondary relative overflow-hidden font-mono">
      {/* Top green/purple neon line glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-40"></div>

      {/* Trust bar overlay */}
      <div className="border-b border-[#25253A]/60 bg-[#0B0C13]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-[10px] font-black tracking-widest uppercase">
            <span className="flex items-center gap-2 text-white/90">
              <Zap size={14} className="text-primary animate-pulse" />
              INSTANT_DROP_ACTIVE
            </span>
            <span className="text-[#25253A] hidden sm:block">|</span>
            <span className="flex items-center gap-2 text-white/90">
              <Shield size={14} className="text-primary animate-pulse" />
              SECURE_HANDSHAKE_SSL
            </span>
            <span className="text-[#25253A] hidden sm:block">|</span>
            <span className="flex items-center gap-2 text-white/90">
              <Clock size={14} className="text-primary animate-pulse" />
              24_7_SUPPORT_MONITOR
            </span>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          
          {/* Column 1: Brand & Decryption terminal */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <Link href={ROUTES.HOME} className="inline-block group mb-3">
                <span className="text-xl font-black font-[family-name:var(--font-heading)] text-white tracking-widest uppercase group-hover:text-primary transition-colors">
                  APEX<span className="text-primary group-hover:text-white transition-colors">_DIGITAL</span>
                </span>
              </Link>
              <p className="text-[11px] leading-relaxed text-[#A1A1AA]/70 max-w-sm font-medium">
                Premium secure digital marketplace releasing immediate authorization hashes for streaming overlay packs, neural optimization systems, and keycard tools.
              </p>
            </div>

            {/* Newsletter input styled as secure CLI Decrypt Box */}
            <form onSubmit={handleSubscribe} className="max-w-sm space-y-2">
              <span className="text-[8px] font-black text-white/30 tracking-widest uppercase block">
                SUBSCRIBE // NEW_DROP_NOTIFICATION_LOGS
              </span>
              <div className="relative flex items-center bg-[#090A10] border border-[#202230] p-1 rounded-sm focus-within:border-primary transition-all">
                <span className="text-primary font-black text-xs pl-2.5 pr-1.5 select-none font-mono">&gt;</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={subscribed ? 'DECRYPTED_SUBSCRIBER_ACTIVE' : 'ENTER_ENCRYPTION_MAIL'}
                  disabled={subscribed}
                  className="bg-transparent text-[11px] w-full py-2 px-1 text-white outline-none placeholder:text-white/20 font-mono disabled:text-[#39FF14]"
                  required
                />
                <button
                  type="submit"
                  disabled={subscribed}
                  className="bg-[#12131A] hover:bg-primary/10 border border-[#25253A] text-white p-2 rounded-sm transition-all group disabled:border-transparent disabled:bg-transparent"
                >
                  <ChevronRight size={14} className={subscribed ? 'text-[#39FF14]' : 'text-primary group-hover:translate-x-0.5 transition-transform'} />
                </button>
              </div>
            </form>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white text-xs font-black font-[family-name:var(--font-heading)] uppercase tracking-widest mb-6 pb-2 border-b border-[#25253A]">
              EXPLORE
            </h3>
            <ul className="space-y-3.5 text-[11px] font-bold">
              {[
                { label: 'HOME BASE', href: ROUTES.HOME },
                { label: 'ARMORY CATALOG', href: ROUTES.PRODUCTS },
                { label: 'TERMINAL GATEWAY', href: ROUTES.CHECKOUT },
                { label: 'SUPPORT MAINLINE', href: ROUTES.SUPPORT },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-primary hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200">
                    <span className="text-primary/45 font-black">&gt;</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal Protocols */}
          <div className="lg:col-span-2">
            <h3 className="text-white text-xs font-black font-[family-name:var(--font-heading)] uppercase tracking-widest mb-6 pb-2 border-b border-[#25253A]">
              PROTOCOLS
            </h3>
            <ul className="space-y-3.5 text-[11px] font-bold">
              {[
                { label: 'TERMS of SERVICE', href: '#' },
                { label: 'PRIVACY POLICY', href: '#' },
                { label: 'REFUND POLICY', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-primary hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200">
                    <span className="text-primary/45 font-black">&gt;</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: System Parameters */}
          <div className="lg:col-span-2">
            <h3 className="text-white text-xs font-black font-[family-name:var(--font-heading)] uppercase tracking-widest mb-6 pb-2 border-b border-[#25253A]">
              PARAMETERS
            </h3>
            <ul className="space-y-3.5 text-[10px] font-bold text-white/40">
              <li className="flex items-center gap-2"><span className="text-primary font-black">&gt;</span> STATUS: ACTIVE</li>
              <li className="flex items-center gap-2"><span className="text-primary font-black">&gt;</span> LOADOUTS: SECURE</li>
              <li className="flex items-center gap-2"><span className="text-primary font-black">&gt;</span> DROPS: INSTANT</li>
              <li className="flex items-center gap-2"><span className="text-primary font-black">&gt;</span> SSL: 256_HASH</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#020205] border-t border-[#1C1D2A] py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold">
          <p className="text-[#A1A1AA]/45 tracking-widest uppercase">
            © {currentYear} {APP_NAME}. ALL SYSTEM RIGHTS RESERVED.
          </p>
          <Link href={ROUTES.ADMIN.LOGIN} className="text-white/20 hover:text-primary transition-colors tracking-widest uppercase flex items-center gap-1.5 font-mono">
            <Terminal size={11} className="text-primary" /> SYSTEM_ADMIN_LOGIN
          </Link>
        </div>
      </div>
    </footer>
  );
}
