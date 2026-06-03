'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES, APP_NAME } from '@/lib/constants';
import { Terminal } from 'lucide-react';
import ApexFledLogo from '@/components/ui/ApexFledLogo';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#0B0C10] border-t border-slate-800/80 text-slate-400 relative overflow-hidden font-sans">
      {/* Top primary accent line glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-40"></div>

      {/* Main content grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 md:gap-8 lg:gap-8 xl:gap-12">
          
          {/* Column 1: Brand & Social Media Links */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <Link href={ROUTES.HOME} className="inline-flex items-center gap-3 group mb-3">
                <div className="drop-shadow-[0_0_10px_rgba(59,130,246,0.45)] group-hover:drop-shadow-[0_0_18px_rgba(59,130,246,0.7)] transition-all duration-300 group-hover:scale-105">
                  <ApexFledLogo size={44} id="footer" />
                </div>
                <span className="text-xl sm:text-2xl font-black font-heading text-white tracking-widest uppercase group-hover:text-primary transition-colors">
                  APEX<span className="text-primary group-hover:text-white transition-colors">FLED</span>
                </span>
              </Link>
            </div>

            {/* Premium Colorful Brand Social Media Links */}
            <div className="flex flex-wrap gap-3">
              {/* Instagram */}
              <Link
                href="https://www.instagram.com/apexfled?igsh=bDFrZ29jMmw0cTI4"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-[#0f172a] border border-sky-500/20 rounded-2xl text-slate-400 hover:text-pink-500 hover:border-pink-500 transition-all duration-300 hover:-translate-y-[3px] glow-instagram"
              >
                <svg className="w-5 h-5 transition-transform duration-300 hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </Link>

              {/* Discord */}
              <Link
                href="https://discord.gg/CbGaFm5RTr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-[#0f172a] border border-sky-500/20 rounded-2xl text-slate-400 hover:text-[#5865F2] hover:border-[#5865F2] transition-all duration-300 hover:-translate-y-[3px] glow-discord"
              >
                <svg className="w-5 h-5 transition-transform duration-300 hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011 19.92 19.92 0 0 0 10.17 0 .078.078 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
                </svg>
              </Link>

              {/* Telegram */}
              <Link
                href="https://t.me/apexfled"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-[#0f172a] border border-sky-500/20 rounded-2xl text-slate-400 hover:text-[#0088cc] hover:border-[#0088cc] transition-all duration-300 hover:-translate-y-[3px] glow-telegram"
              >
                <svg className="w-5 h-5 transition-transform duration-300 hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.97-.74 3.79-1.65 6.32-2.73 7.57-3.26 3.6-1.5 4.35-1.76 4.84-1.77.11 0 .35.03.5.15.13.1.17.24.18.35-.01.08-.01.17-.02.26z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Removed spacer to keep columns nicely balanced */}

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white text-sm sm:text-base font-extrabold font-heading uppercase tracking-widest mb-6 pb-2 border-b border-slate-800/80">
              QUICK LINKS
            </h3>
            <ul className="space-y-3.5 text-xs sm:text-sm font-bold">
              {[
                { label: 'Home', href: ROUTES.HOME },
                { label: 'Products', href: ROUTES.PRODUCTS },
                { label: 'Support', href: ROUTES.SUPPORT },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Privacy Policy', href: '/privacy' },
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
            <h3 className="text-white text-sm sm:text-base font-extrabold font-heading uppercase tracking-widest mb-6 pb-2 border-b border-slate-800/80">
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

          {/* Column 4: Why ApexFled */}
          <div className="lg:col-span-4">
            <h3 className="text-white text-sm sm:text-base font-extrabold font-heading uppercase tracking-widest mb-6 pb-2 border-b border-slate-800/80">
              WHY APEXFLED
            </h3>
            <ul className="space-y-3.5 text-xs sm:text-sm font-bold text-slate-400">
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
      <div className="bg-[#07080c] border-t border-slate-800/80 py-6 relative z-10">
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
