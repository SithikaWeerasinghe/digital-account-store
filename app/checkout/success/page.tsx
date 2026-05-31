import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0"></div>

      <div className="bg-card p-8 md:p-12 rounded-3xl shadow-2xl border border-border max-w-md w-full text-center relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-emerald-500 to-green-600 blur-[1px]"></div>
        
        <div className="w-16 h-16 bg-green-50 text-success rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
          <CheckCircle size={32} />
        </div>
        
        <h1 className="text-2xl font-bold font-heading text-text-primary mb-2 uppercase tracking-wide">Payment Successful!</h1>
        <p className="text-text-secondary mb-8 text-sm sm:text-base leading-relaxed">
          Your order has been confirmed. We&apos;ve sent the digital products to your email address.
        </p>
        
        <div className="bg-slate-50 border border-border rounded-xl p-5 mb-8 text-left text-sm font-mono space-y-2">
          <div className="flex justify-between">
            <span className="text-text-secondary/70">Order ID:</span>
            <span className="font-bold text-text-primary">ORD-74892</span>
          </div>
          <div className="flex justify-between border-t border-border/60 pt-2">
            <span className="text-text-secondary/70">Total Paid:</span>
            <span className="font-bold text-primary">$43.18</span>
          </div>
        </div>
        
        <Link href={ROUTES.HOME} className="mp-button-primary w-full inline-block py-3.5 text-center">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
