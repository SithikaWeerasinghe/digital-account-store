import Link from 'next/link';
import { ROUTES, APP_NAME } from '@/lib/constants';
import { Zap, Shield, Clock } from 'lucide-react';

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Trust Bar */}
      <div className="border-b border-gray-800 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-medium text-gray-400">
            <span className="flex items-center gap-2">
              <Zap size={15} className="text-[#fff159]" />
              Instant Delivery
            </span>
            <span className="text-gray-600 hidden sm:block">•</span>
            <span className="flex items-center gap-2">
              <Shield size={15} className="text-[#009ee3]" />
              Secure Checkout
            </span>
            <span className="text-gray-600 hidden sm:block">•</span>
            <span className="flex items-center gap-2">
              <Clock size={15} className="text-green-400" />
              Support Available
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={ROUTES.HOME} className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#009ee3] rounded-lg flex items-center justify-center">
                <Zap size={18} className="text-[#fff159]" />
              </div>
              <span className="text-lg font-bold text-white">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              A modern digital products store built for fast delivery, secure checkout, and reliable support.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: ROUTES.HOME },
                { label: 'Products', href: ROUTES.PRODUCTS },
                { label: 'Support', href: ROUTES.SUPPORT },
                { label: 'Terms of Service', href: '#' },
                { label: 'Privacy Policy', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Submit a Ticket', href: ROUTES.SUPPORT },
                { label: 'FAQ', href: ROUTES.SUPPORT },
                { label: 'Contact Support', href: ROUTES.SUPPORT },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust & Security */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Why Apex Digital</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ Verified products only</li>
              <li>✓ Secure payment processing</li>
              <li>✓ Instant email delivery</li>
              <li>✓ Ticket-based support</li>
              <li>✓ Replacement guarantee</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <Link href={ROUTES.ADMIN.LOGIN} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
