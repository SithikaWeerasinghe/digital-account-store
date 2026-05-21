import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-border max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 text-success rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        
        <h1 className="text-2xl font-bold text-text-primary mb-2">Payment Successful!</h1>
        <p className="text-text-secondary mb-8">
          Your order has been confirmed. We've sent the digital products to your email address.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left text-sm">
          <div className="flex justify-between mb-2">
            <span className="text-text-muted">Order ID:</span>
            <span className="font-medium text-text-primary">ORD-{Math.floor(Math.random() * 100000)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Total Paid:</span>
            <span className="font-medium text-text-primary">$43.18</span>
          </div>
        </div>
        
        <Link href={ROUTES.HOME} className="mp-button-primary w-full inline-block">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
