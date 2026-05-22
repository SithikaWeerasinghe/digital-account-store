import Link from 'next/link';
import { XCircle, RefreshCw, HeadphonesIcon } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function CheckoutFailedPage() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 bg-[#f0f4f8]">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl max-w-md w-full text-center p-8 sm:p-12">

        {/* Icon */}
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={44} className="text-red-500" />
        </div>

        {/* Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-[#0d1b2a] mb-2 tracking-tight">
            Payment or Order Failed
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Something went wrong while processing your order. Please try again or contact
            our support team for assistance.
          </p>
        </div>

        {/* Info card */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-8 text-left">
          <p className="text-sm text-red-700 leading-relaxed">
            This may have happened due to a payment timeout, network issue, or declined transaction.
            Please try again with a valid payment method.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Link
            href={ROUTES.CHECKOUT}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#009ee3] text-white font-bold hover:bg-[#007ec0] transition-colors shadow-md"
          >
            <RefreshCw size={16} /> Try Again
          </Link>
          <Link
            href={ROUTES.SUPPORT}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            <HeadphonesIcon size={15} /> Contact Support
          </Link>
          <Link
            href={ROUTES.PRODUCTS}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors mt-1"
          >
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}
