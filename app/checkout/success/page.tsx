import Link from 'next/link';
import { CheckCircle, ShoppingBag, HeadphonesIcon, Zap } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 bg-[#f0f4f8]">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl max-w-md w-full text-center p-8 sm:p-12">

        {/* Icon */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle size={44} className="text-emerald-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#ffd700] rounded-full flex items-center justify-center">
            <Zap size={14} className="text-[#0d1b2a]" fill="currentColor" />
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-[#0d1b2a] mb-2 tracking-tight">Order Confirmed!</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your order has been received. Digital delivery will be processed after payment
            confirmation and sent to your email address.
          </p>
        </div>

        {/* Info card */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 mb-8 text-left space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle size={13} /> Confirmed
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Delivery Method</span>
            <span className="font-semibold text-[#0d1b2a]">Email Delivery</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Delivery Time</span>
            <span className="font-semibold text-[#009ee3]">Instant after payment</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#009ee3] text-white font-bold hover:bg-[#007ec0] transition-colors shadow-md"
          >
            <ShoppingBag size={16} /> Browse More Products
          </Link>
          <Link
            href={ROUTES.SUPPORT}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            <HeadphonesIcon size={15} /> Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
