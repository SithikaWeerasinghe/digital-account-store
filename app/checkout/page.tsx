'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { sampleProducts } from '@/data/sampleProducts';
import {
  Mail, CreditCard, Bitcoin, Shield, Zap,
  Check, AlertCircle, ArrowRight, Package
} from 'lucide-react';
import { useRouter } from 'next/navigation';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, AMEX', icon: CreditCard },
  { id: 'crypto', label: 'Cryptocurrency', desc: 'BTC, ETH, USDT & more', icon: Bitcoin },
];

// Mock cart for the standalone checkout page
const mockCart = [
  { product: sampleProducts[0], quantity: 1 },
  { product: sampleProducts[2], quantity: 1 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [errors, setErrors] = useState<{ email?: string; confirmEmail?: string }>({});
  const [loading, setLoading] = useState(false);

  const subtotal = mockCart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const total = subtotal;

  const validate = () => {
    const errs: { email?: string; confirmEmail?: string } = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!confirmEmail) {
      errs.confirmEmail = 'Please confirm your email address.';
    } else if (email !== confirmEmail) {
      errs.confirmEmail = 'Email addresses do not match.';
    }
    return errs;
  };

  const handlePlaceOrder = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      router.push(ROUTES.CHECKOUT_SUCCESS);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d1b2a] tracking-tight">Checkout</h1>
          <p className="text-gray-500 text-sm mt-1">Complete your order and receive your digital product instantly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Customer + Payment */}
          <div className="lg:col-span-2 space-y-5">

            {/* Customer details card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-[#0059a6] to-[#009ee3] px-6 py-5">
                <h2 className="text-base font-extrabold text-white">1. Delivery Information</h2>
                <p className="text-white/70 text-xs mt-0.5">Enter the email where you will receive your digital product.</p>
              </div>

              <div className="p-6 space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-[#0d1b2a] mb-1.5">
                    <span className="flex items-center gap-1.5"><Mail size={13} /> Email Address *</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
                    placeholder="your@email.com"
                    className={`apex-input ${errors.email ? 'error' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Confirm email */}
                <div>
                  <label className="block text-sm font-bold text-[#0d1b2a] mb-1.5">
                    Confirm Email Address *
                  </label>
                  <input
                    type="email"
                    value={confirmEmail}
                    onChange={(e) => { setConfirmEmail(e.target.value); setErrors(prev => ({ ...prev, confirmEmail: undefined })); }}
                    placeholder="Repeat your email"
                    className={`apex-input ${errors.confirmEmail ? 'error' : ''}`}
                  />
                  {errors.confirmEmail && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.confirmEmail}
                    </p>
                  )}
                </div>

                {/* Order note */}
                <div>
                  <label className="block text-sm font-bold text-[#0d1b2a] mb-1.5">
                    Order Note <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any additional notes for your order..."
                    className="apex-input resize-none"
                  />
                </div>

                {/* Trust note */}
                <div className="flex items-start gap-2.5 bg-blue-50 rounded-xl p-3.5 text-xs text-gray-600">
                  <Zap size={13} className="text-[#009ee3] mt-0.5 flex-shrink-0" />
                  Your product will be delivered to this email instantly after payment confirmation.
                </div>
              </div>
            </div>

            {/* Payment method card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-[#0059a6] to-[#009ee3] px-6 py-5">
                <h2 className="text-base font-extrabold text-white">2. Payment Method</h2>
                <p className="text-white/70 text-xs mt-0.5">Select your preferred payment option.</p>
              </div>

              <div className="p-6 space-y-3">
                {PAYMENT_METHODS.map(({ id, label, desc, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setPaymentMethod(id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                      paymentMethod === id
                        ? 'border-[#009ee3] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === id ? 'border-[#009ee3]' : 'border-gray-300'}`}>
                      {paymentMethod === id && <div className="w-2.5 h-2.5 rounded-full bg-[#009ee3]" />}
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${paymentMethod === id ? 'bg-[#009ee3]/10' : 'bg-gray-100'}`}>
                      <Icon size={20} className={paymentMethod === id ? 'text-[#009ee3]' : 'text-gray-400'} />
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${paymentMethod === id ? 'text-[#009ee3]' : 'text-gray-800'}`}>{label}</p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                  </button>
                ))}

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 text-xs text-amber-700">
                  <strong>Note:</strong> Payment integration will be connected in a future backend stage.
                  Placing an order now will redirect to a confirmation page.
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="font-extrabold text-[#0d1b2a]">Order Summary</h2>
              </div>

              <div className="p-5 space-y-4">
                {/* Items */}
                {mockCart.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={20} className="text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-xs font-bold text-[#0d1b2a] line-clamp-2 leading-snug">{item.product.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                      <span className="apex-badge-blue text-[9px] mt-1 inline-flex">{item.product.category}</span>
                    </div>
                    <div className="text-right text-sm font-extrabold text-[#0d1b2a] flex-shrink-0">
                      {formatCurrency(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}

                {/* Pricing */}
                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Processing Fee</span>
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="font-extrabold text-[#0d1b2a]">Total</span>
                  <span className="text-2xl font-extrabold text-[#0d1b2a]">{formatCurrency(total)}</span>
                </div>

                {/* Delivery notice */}
                <div className="flex items-start gap-2 bg-emerald-50 rounded-xl p-3 text-xs text-emerald-700">
                  <Zap size={12} className="flex-shrink-0 mt-0.5" />
                  Instant delivery to your email after payment.
                </div>

                {/* Place order */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#009ee3] text-white font-extrabold text-base hover:bg-[#007ec0] transition-all duration-150 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <>Place Order <ArrowRight size={16} /></>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
                  <Shield size={11} />
                  Secure encrypted checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
