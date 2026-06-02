'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Clock, AlertCircle } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

function CheckoutPendingContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || searchParams.get('external_reference');

  // Mercado Pago appends these to the pending back_url.
  const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id');
  const mpStatus = searchParams.get('status') || searchParams.get('collection_status');
  const merchantOrderId = searchParams.get('merchant_order_id');

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0"></div>

      <div className="bg-card p-8 md:p-12 rounded-3xl shadow-2xl border border-border max-w-md w-full text-center relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-amber-400 to-amber-600 blur-[1px]"></div>

        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          <Clock size={32} />
        </div>

        <h1 className="text-2xl font-bold font-heading text-text-primary mb-2 uppercase tracking-wide">
          Payment Pending
        </h1>
        <p className="text-text-secondary mb-8 text-sm sm:text-base leading-relaxed">
          Your payment is being processed by Mercado Pago. Some payment methods take a little while to
          confirm. As soon as it&apos;s approved, your digital products will be delivered to your email.
        </p>

        <div className="bg-slate-50 border border-border rounded-xl p-5 mb-8 text-left text-sm font-mono space-y-2">
          {orderId && (
            <div className="flex justify-between gap-3">
              <span className="text-text-secondary/70">Order ID:</span>
              <span className="font-bold text-text-primary truncate max-w-[170px]">{orderId}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-border/60 pt-2">
            <span className="text-text-secondary/70">Payment Status:</span>
            <span className="font-bold text-amber-600">Pending</span>
          </div>
          {paymentId && (
            <div className="flex justify-between gap-3">
              <span className="text-text-secondary/70">Payment ID:</span>
              <span className="font-bold text-text-primary truncate max-w-[170px]">{paymentId}</span>
            </div>
          )}
          {merchantOrderId && (
            <div className="flex justify-between gap-3">
              <span className="text-text-secondary/70">Merchant Order:</span>
              <span className="font-bold text-text-primary truncate max-w-[170px]">{merchantOrderId}</span>
            </div>
          )}
          {mpStatus && (
            <div className="flex justify-between gap-3">
              <span className="text-text-secondary/70">MP Status:</span>
              <span className="font-bold text-text-primary">{mpStatus}</span>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-2">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
          <p className="text-xs text-blue-700">
            No need to pay again. We&apos;ll confirm your payment automatically and email you once it&apos;s approved.
          </p>
        </div>

        <div className="space-y-3">
          <Link href={ROUTES.HOME} className="mp-button-primary w-full inline-block py-3.5 text-center">
            Browse Products
          </Link>
          <Link href={ROUTES.SUPPORT} className="text-text-secondary hover:text-primary text-sm font-bold tracking-wider uppercase transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPendingPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading...</div>}>
      <CheckoutPendingContent />
    </Suspense>
  );
}
