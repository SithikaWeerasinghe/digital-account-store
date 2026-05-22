import Link from 'next/link';
import { ROUTES, APP_NAME } from '@/lib/constants';
import { Zap, Shield, Clock, Tv, Bot, Gamepad2, Cpu, HelpCircle, FileText, RotateCcw } from 'lucide-react';

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-[#0d1b2a] text-gray-300">
      {/* Trust bar */}
      <div className="border-b border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm font-medium text-gray-400">
            <span className="flex items-center gap-2">
              <Zap size={14} className="text-[#ffd700]" fill="#ffd700" />
              Instant Delivery
            </span>
            <span className="text-gray-600 hidden sm:block">·</span>
            <span className="flex items-center gap-2">
              <Shield size={14} className="text-[#009ee3]" />
              Secure Checkout
            </span>
            <span className="text-gray-600 hidden sm:block">·</span>
            <span className="flex items-center gap-2">
              <Clock size={14} className="text-emerald-400" />
              24/7 Support
            </span>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={ROUTES.HOME} className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-[#009ee3] rounded-xl flex items-center justify-center">
                <Zap size={18} className="text-[#ffd700]" fill="#ffd700" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Secure digital product ordering with instant delivery workflow and support ticket assistance.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
              <Shield size={12} className="text-emerald-400 flex-shrink-0" />
              <span>Verified & trusted digital store</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: ROUTES.HOME },
                { label: 'Products', href: ROUTES.PRODUCTS },
                { label: 'Support', href: ROUTES.SUPPORT },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-[#009ee3] rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Categories</h3>
            <ul className="space-y-3">
              {[
                { label: 'Streaming', icon: Tv, href: `${ROUTES.PRODUCTS}?category=Streaming` },
                { label: 'AI Tools', icon: Bot, href: `${ROUTES.PRODUCTS}?category=AI+Tools` },
                { label: 'Gaming', icon: Gamepad2, href: `${ROUTES.PRODUCTS}?category=Gaming` },
                { label: 'Software', icon: Cpu, href: `${ROUTES.PRODUCTS}?category=Software` },
              ].map(({ label, icon: Icon, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <Icon size={13} className="text-gray-600 group-hover:text-[#009ee3] transition-colors flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Support</h3>
            <ul className="space-y-3">
              {[
                { label: 'Help Center', icon: HelpCircle, href: ROUTES.SUPPORT },
                { label: 'Terms of Service', icon: FileText, href: '#' },
                { label: 'Refund Policy', icon: RotateCcw, href: '#' },
              ].map(({ label, icon: Icon, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <Icon size={13} className="text-gray-600 group-hover:text-[#009ee3] transition-colors flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-gray-600">
            <Link href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
            <Link href={ROUTES.ADMIN.LOGIN} className="hover:text-gray-400 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
