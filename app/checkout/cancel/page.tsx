'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { XCircle, AlertCircle } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

function CheckoutCancelContent() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0"></div>

      <div className="bg-card p-8 md:p-12 rounded-3xl shadow-2xl border border-border max-w-md w-full text-center relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-slate-400 to-slate-600 blur-[1px]"></div>

        <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-200">
          <XCircle size={32} />
        </div>

        <h1 className="text-2xl font-bold font-heading text-text-primary mb-2 uppercase tracking-wide">
          Payment Cancelled
        </h1>
        <p className="text-text-secondary mb-8 text-sm sm:text-base leading-relaxed">
          Your crypto payment was cancelled and no charge was made. Your order is still pending — you can
          return to checkout and complete the payment whenever you&apos;re ready.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-2 text-left">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
          <p className="text-xs text-blue-700">
            No access details are sent until a payment is confirmed. If you already paid, it may still be
            confirming — check your email shortly.
          </p>
        </div>

        <div className="space-y-3">
          <Link href={ROUTES.PRODUCTS} className="mp-button-primary w-full inline-block py-3.5 text-center">
            Browse Products
          </Link>
          <Link
            href={ROUTES.SUPPORT}
            className="block text-text-secondary hover:text-primary text-sm font-bold tracking-wider uppercase transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading...</div>}>
      <CheckoutCancelContent />
    </Suspense>
  );
}
