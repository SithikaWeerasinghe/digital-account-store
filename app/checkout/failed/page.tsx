import Link from 'next/link';
import { XCircle, RefreshCw } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function CheckoutFailedPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-border max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 text-danger rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} />
        </div>
        
        <h1 className="text-2xl font-bold text-text-primary mb-2">Payment Failed</h1>
        <p className="text-text-secondary mb-8">
          We couldn't process your payment. Please try again with a different payment method.
        </p>
        
        <div className="flex flex-col gap-3">
          <Link href={ROUTES.CHECKOUT} className="mp-button-primary w-full flex items-center justify-center gap-2">
            <RefreshCw size={18} />
            Try Again
          </Link>
          <Link href={ROUTES.SUPPORT} className="text-text-secondary hover:text-primary text-sm font-medium transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
