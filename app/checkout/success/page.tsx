'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const sessionId = searchParams.get('session_id');
  const invoiceNumber = searchParams.get('invoice_number');

  // For now, show pending status since real Stripe payment data isn't available yet
  const showRealData = false;
  const orderAmount = searchParams.get('amount') ? `$${searchParams.get('amount')}` : null;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0"></div>

      <div className="bg-card p-8 md:p-12 rounded-3xl shadow-2xl border border-border max-w-md w-full text-center relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-emerald-500 to-green-600 blur-[1px]"></div>

        <div className="w-16 h-16 bg-green-50 text-success rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
          <CheckCircle size={32} />
        </div>

        <h1 className="text-2xl font-bold font-heading text-text-primary mb-2 uppercase tracking-wide">
          {showRealData ? 'Payment Successful!' : 'Order Received'}
        </h1>
        <p className="text-text-secondary mb-8 text-sm sm:text-base leading-relaxed">
          {showRealData
            ? 'Your order has been confirmed. We\'ve sent the digital products to your email address.'
            : 'Your order has been received. Payment confirmation and digital products will be delivered once payment is processed.'}
        </p>

        <div className="bg-slate-50 border border-border rounded-xl p-5 mb-8 text-left text-sm font-mono space-y-2">
          {(orderId || invoiceNumber) && (
            <div className="flex justify-between">
              <span className="text-text-secondary/70">Order ID:</span>
              <span className="font-bold text-text-primary">{orderId || invoiceNumber || 'Processing...'}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-border/60 pt-2">
            <span className="text-text-secondary/70">Order Status:</span>
            <span className="font-bold text-amber-600">Pending Confirmation</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary/70">Payment Status:</span>
            <span className="font-bold text-amber-600">Pending</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary/70">Delivery Status:</span>
            <span className="font-bold text-amber-600">Pending</span>
          </div>
          {orderAmount && (
            <div className="flex justify-between border-t border-border/60 pt-2">
              <span className="text-text-secondary/70">Total Amount:</span>
              <span className="font-bold text-primary">{orderAmount}</span>
            </div>
          )}
        </div>

        {!showRealData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-2">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-blue-700">
              Real payment confirmation will be displayed once Stripe integration is active.
            </p>
          </div>
        )}

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

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
