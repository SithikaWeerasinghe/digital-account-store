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
              {/* Facebook */}
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-[#0f172a] border border-sky-500/20 rounded-2xl text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all duration-300 hover:-translate-y-[3px] glow-facebook"
              >
                <svg className="w-5 h-5 transition-transform duration-300 hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </Link>

              {/* Twitter/X */}
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-[#0f172a] border border-sky-500/20 rounded-2xl text-slate-400 hover:text-white hover:border-slate-200 transition-all duration-300 hover:-translate-y-[3px] glow-twitter"
              >
                <svg className="w-5 h-5 transition-transform duration-300 hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Link>

              {/* Instagram */}
              <Link
                href="https://instagram.com"
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

              {/* YouTube */}
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-[#0f172a] border border-sky-500/20 rounded-2xl text-slate-400 hover:text-red-500 hover:border-red-500 transition-all duration-300 hover:-translate-y-[3px] glow-youtube"
              >
                <svg className="w-5 h-5 transition-transform duration-300 hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.511a3.003 3.003 0 0 0-2.11 2.107C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.107c1.87.511 9.388.511 9.388.511s7.518 0 9.388-.511a3.003 3.003 0 0 0 2.11-2.107c.502-1.87.502-5.837.502-5.837s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </Link>

              {/* GitHub */}
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-[#0f172a] border border-sky-500/20 rounded-2xl text-slate-400 hover:text-cyan-400 hover:border-cyan-400 transition-all duration-300 hover:-translate-y-[3px] glow-github"
              >
                <svg className="w-5 h-5 transition-transform duration-300 hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
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
