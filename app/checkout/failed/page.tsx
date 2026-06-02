'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCw } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

function CheckoutFailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const reason = searchParams.get('reason');
  const sessionId = searchParams.get('session_id');

  const failureMessage = reason
    ? `Payment processing failed: ${reason}`
    : 'The payment was not completed or was cancelled.';

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0"></div>

      <div className="bg-card p-8 md:p-12 rounded-3xl shadow-2xl border border-border max-w-md w-full text-center relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-red-500 to-rose-600 blur-[1px]"></div>

        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
          <XCircle size={32} />
        </div>

        <h1 className="text-2xl font-bold font-heading text-text-primary mb-2 uppercase tracking-wide">Payment Failed</h1>
        <p className="text-text-secondary mb-8 text-sm sm:text-base leading-relaxed">
          {failureMessage}
        </p>

        {orderId && (
          <div className="bg-slate-50 border border-border rounded-xl p-5 mb-6 text-left text-sm font-mono space-y-2">
            <div className="flex justify-between">
              <span className="text-text-secondary/70">Order ID:</span>
              <span className="font-bold text-text-primary">{orderId}</span>
            </div>
            {sessionId && (
              <div className="flex justify-between">
                <span className="text-text-secondary/70">Session ID:</span>
                <span className="font-bold text-text-primary font-xs truncate max-w-[150px]">{sessionId}</span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Link href={ROUTES.CHECKOUT} className="mp-button-primary w-full flex items-center justify-center gap-2 py-3">
            <RefreshCw size={14} />
            Try Again
          </Link>
          <Link href={ROUTES.SUPPORT} className="text-text-secondary hover:text-primary text-sm font-bold tracking-wider uppercase transition-colors pt-2">
            Contact Support
          </Link>
          <Link href={ROUTES.HOME} className="text-text-secondary hover:text-primary text-sm font-bold tracking-wider uppercase transition-colors">
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutFailedPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading...</div>}>
      <CheckoutFailedContent />
    </Suspense>
  );
}
