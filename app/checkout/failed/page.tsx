import Link from 'next/link';
import { XCircle, RefreshCw } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function CheckoutFailedPage() {
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
          We couldn&apos;t process your payment. Please try again with a different payment method.
        </p>
        
        <div className="flex flex-col gap-3">
          <Link href={ROUTES.CHECKOUT} className="mp-button-primary w-full flex items-center justify-center gap-2 py-3">
            <RefreshCw size={14} />
            Try Again
          </Link>
          <Link href={ROUTES.SUPPORT} className="text-text-secondary hover:text-primary text-sm font-bold tracking-wider uppercase transition-colors pt-2">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
