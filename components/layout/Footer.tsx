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
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-700 relative overflow-hidden font-mono">
      {/* Top primary accent line glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-40"></div>

      {/* Trust bar overlay */}
      <div className="border-b border-slate-200/60 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-xs sm:text-sm font-black tracking-widest uppercase">
            <span className="flex items-center gap-2 text-slate-800">
              <Zap size={14} className="text-primary animate-pulse" />
              INSTANT_DROP_ACTIVE
            </span>
            <span className="text-slate-300 hidden sm:block">|</span>
            <span className="flex items-center gap-2 text-slate-800">
              <Shield size={14} className="text-primary animate-pulse" />
              SECURE_HANDSHAKE_SSL
            </span>
            <span className="text-slate-300 hidden sm:block">|</span>
            <span className="flex items-center gap-2 text-slate-800">
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
                <span className="text-xl sm:text-2xl font-black font-heading text-slate-800 tracking-widest uppercase group-hover:text-primary transition-colors">
                  APEX<span className="text-primary group-hover:text-slate-800 transition-colors">_DIGITAL</span>
                </span>
              </Link>
              <p className="text-xs sm:text-[13px] leading-relaxed text-slate-500 max-w-sm font-medium">
                Premium secure digital marketplace releasing immediate authorization hashes for streaming overlay packs, neural optimization systems, and keycard tools.
              </p>
            </div>

            {/* Newsletter input styled as secure CLI Decrypt Box */}
            <form onSubmit={handleSubscribe} className="max-w-sm space-y-2">
              <span className="text-[10px] sm:text-xs font-black text-slate-400 tracking-widest uppercase block">
                SUBSCRIBE // NEW_DROP_NOTIFICATION_LOGS
              </span>
              <div className="relative flex items-center bg-white border border-slate-200 p-1.5 rounded-sm focus-within:border-primary transition-all">
                <span className="text-primary font-black text-sm pl-2.5 pr-1.5 select-none font-mono">&gt;</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={subscribed ? 'DECRYPTED_SUBSCRIBER_ACTIVE' : 'ENTER_ENCRYPTION_MAIL'}
                  disabled={subscribed}
                  className="bg-transparent text-xs sm:text-sm w-full py-2 px-1 text-slate-800 outline-none placeholder:text-slate-300 font-mono disabled:text-[#22C55E]"
                  required
                />
                <button
                  type="submit"
                  disabled={subscribed}
                  className="bg-slate-50 hover:bg-primary/10 border border-slate-200 text-slate-700 p-2 rounded-sm transition-all group disabled:border-transparent disabled:bg-transparent"
                >
                  <ChevronRight size={14} className={subscribed ? 'text-[#22C55E]' : 'text-primary group-hover:translate-x-0.5 transition-transform'} />
                </button>
              </div>
            </form>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-slate-800 text-sm sm:text-base font-extrabold font-heading uppercase tracking-widest mb-6 pb-2 border-b border-slate-200">
              QUICK LINKS
            </h3>
            <ul className="space-y-3.5 text-xs sm:text-sm font-bold">
              {[
                { label: 'Home', href: ROUTES.HOME },
                { label: 'Products', href: ROUTES.PRODUCTS },
                { label: 'Support', href: ROUTES.SUPPORT },
                { label: 'Terms of Service', href: '/terms-of-service' },
                { label: 'Privacy Policy', href: '/privacy-policy' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-primary hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200">
                    <span className="text-primary/45 font-black">&gt;</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="lg:col-span-2">
            <h3 className="text-slate-800 text-sm sm:text-base font-extrabold font-heading uppercase tracking-widest mb-6 pb-2 border-b border-slate-200">
              SUPPORT
            </h3>
            <ul className="space-y-3.5 text-xs sm:text-sm font-bold">
              {[
                { label: 'Submit a Ticket', href: '/support' },
                { label: 'FAQ', href: '/support' },
                { label: 'Contact Support', href: '/support' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-primary hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-200">
                    <span className="text-primary/45 font-black">&gt;</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Why Apex Digital */}
          <div className="lg:col-span-2">
            <h3 className="text-slate-800 text-sm sm:text-base font-extrabold font-heading uppercase tracking-widest mb-6 pb-2 border-b border-slate-200">
              WHY APEX DIGITAL
            </h3>
            <ul className="space-y-3.5 text-xs sm:text-sm font-bold text-slate-500">
              <li className="flex items-center gap-2"><span className="text-primary font-black">✓</span> Verified products only</li>
              <li className="flex items-center gap-2"><span className="text-primary font-black">✓</span> Secure payment processing</li>
              <li className="flex items-center gap-2"><span className="text-primary font-black">✓</span> Instant email delivery</li>
              <li className="flex items-center gap-2"><span className="text-primary font-black">✓</span> Ticket-based support</li>
              <li className="flex items-center gap-2"><span className="text-primary font-black">✓</span> Replacement guarantee</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-100 border-t border-slate-200 py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm font-bold">
          <p className="text-slate-500 tracking-widest uppercase">
            © {currentYear} {APP_NAME}. ALL SYSTEM RIGHTS RESERVED.
          </p>
          <Link href={ROUTES.ADMIN.LOGIN} className="text-slate-400 hover:text-primary transition-colors tracking-widest uppercase flex items-center gap-1.5 font-mono">
            <Terminal size={11} className="text-primary" /> SYSTEM_ADMIN_LOGIN
          </Link>
        </div>
      </div>
    </footer>
  );
}
