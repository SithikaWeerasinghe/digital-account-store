'use client';

import { useState } from 'react';
import { CreditCard, Bitcoin, Banknote, ShieldCheck, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Card Payment', desc: 'Pay securely using a debit or credit card.', icon: CreditCard },
  { id: 'crypto', label: 'Crypto Payment', desc: 'Pay using supported cryptocurrency options.', icon: Bitcoin },
  { id: 'manual', label: 'Manual Payment', desc: 'Submit an order request and complete payment manually.', icon: Banknote },
];

export default function CheckoutPage() {
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const price = 9.99;
  const total = price * quantity;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (quantity < 1) {
      setError('Quantity must be at least 1.');
      return;
    }
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="bg-[#050509] min-h-[calc(100vh-80px)] py-16 flex flex-col items-center justify-center px-4">
        <div className="bg-[#11111A] border border-[#22C55E]/40 rounded-2xl p-10 max-w-md w-full shadow-[0_0_40px_rgba(34,197,94,0.08)] text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#22C55E]/60 to-transparent" />

          <div className="w-20 h-20 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
            <Check size={36} className="text-[#22C55E]" />
          </div>

          <h2
            className="text-xl font-black uppercase text-white mb-2 tracking-wide"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Order Preview Created
          </h2>
          <p className="text-[#A1A1AA] text-sm mb-6">
            Your checkout details are ready. Real payment processing will be connected in the backend phase.
          </p>

          <div className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-xl p-4 mb-8">
            <p className="text-sm text-[#A855F7] font-medium">
              Checkout request created successfully. Payment integration will be connected later.
            </p>
          </div>

          <Link href={ROUTES.HOME} className="mp-button-primary w-full py-3.5 text-sm">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#050509] min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back link */}
        <Link
          href={ROUTES.PRODUCTS}
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#A855F7] transition-colors text-xs font-medium uppercase tracking-wider mb-8"
        >
          <ArrowLeft size={14} /> Back to Products
        </Link>

        {/* Header */}
        <div className="mb-10">
          <span className="section-label mb-4 inline-flex">Checkout</span>
          <h1
            className="text-3xl sm:text-4xl font-black uppercase text-white mt-4 mb-3 tracking-wide neon-text"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Secure Checkout
          </h1>
          <p className="text-[#A1A1AA] text-sm max-w-2xl">
            Review your digital product, enter your delivery email, and complete your order through a simple checkout process.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left: Form */}
          <div className="flex-1 space-y-5">
            <div className="bg-[#11111A] border border-[#25253A] rounded-2xl relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/60 to-transparent" />

              <form onSubmit={handleCheckout} className="p-6 space-y-6">

                {/* Email */}
                <div>
                  <label htmlFor="checkout-email" className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">
                    Email Address *
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for delivery"
                    className="mp-input"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label htmlFor="checkout-quantity" className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-[#25253A] bg-[#050509] flex items-center justify-center text-[#A1A1AA] hover:border-[#8B5CF6]/50 hover:text-white transition-all font-bold text-lg"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-black text-white text-lg">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="w-10 h-10 rounded-lg border border-[#25253A] bg-[#050509] flex items-center justify-center text-[#A1A1AA] hover:border-[#8B5CF6]/50 hover:text-white transition-all font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-xs font-bold text-white mb-3 uppercase tracking-wider">Payment Method</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PAYMENT_METHODS.map(({ id, label, desc, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        id={`payment-${id}`}
                        onClick={() => setPaymentMethod(id)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-200 ${
                          paymentMethod === id
                            ? 'border-[#A855F7]/60 bg-[#8B5CF6]/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                            : 'border-[#25253A] bg-[#050509] hover:border-[#25253A]/80'
                        }`}
                      >
                        <Icon size={22} className={`mb-2 transition-colors ${paymentMethod === id ? 'text-[#A855F7]' : 'text-[#6B7280]'}`} />
                        <span className="font-bold text-white text-xs mb-1">{label}</span>
                        <span className="text-[10px] text-[#6B7280] leading-tight">{desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-sm px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                <button type="submit" className="mp-button-primary w-full py-4 text-sm">
                  Continue to Checkout
                </button>
              </form>
            </div>

            {/* Delivery Notice */}
            <div className="bg-[#8B5CF6]/5 border border-[#8B5CF6]/25 rounded-xl p-4 flex items-start gap-3">
              <ShieldCheck className="text-[#8B5CF6] flex-shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-[#A1A1AA]">
                <span className="font-bold text-white">Delivery Notice:</span> Digital products are delivered to your email after payment confirmation.
              </p>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:w-96 space-y-5">

            {/* Summary Card */}
            <div className="bg-[#11111A] border border-[#25253A] rounded-2xl relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/60 to-transparent" />

              <div className="p-6">
                <h3
                  className="font-black uppercase text-white text-sm tracking-wider mb-5 pb-4 border-b border-[#25253A]"
                  style={{ fontFamily: 'var(--font-orbitron)' }}
                >
                  Order Summary
                </h3>

                <div className="flex gap-4 mb-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-black text-white tracking-widest uppercase">GAME</span>
                  </div>
                  <div className="flex-1">
                    <span className="badge-purple mb-1 inline-flex">Gaming</span>
                    <h4 className="font-bold text-white text-sm leading-tight mt-1">Gaming Digital Bundle</h4>
                    <p className="text-[#A1A1AA] text-xs mt-0.5">${price.toFixed(2)} each</p>
                  </div>
                </div>

                <div className="space-y-2.5 mb-5 pb-5 border-b border-[#25253A] text-sm">
                  <div className="flex justify-between text-[#A1A1AA]">
                    <span>Price</span>
                    <span>${price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#A1A1AA]">
                    <span>Quantity</span>
                    <span>{quantity}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-white">Total</span>
                  <span
                    className="font-black text-[#A855F7] text-2xl drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                    style={{ fontFamily: 'var(--font-orbitron)' }}
                  >
                    ${total.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-2">
                  {['Instant Delivery', 'Verified Stock', 'Support Available'].map((badge) => (
                    <div key={badge} className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] shadow-[0_0_4px_rgba(139,92,246,0.8)]" />
                      {badge}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Important Before Purchase */}
            <div className="bg-[#11111A] border border-[#25253A] rounded-2xl p-6">
              <h4
                className="font-bold text-white text-xs uppercase tracking-wider mb-4"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                Important Before Purchase
              </h4>
              <ul className="space-y-3 text-xs text-[#A1A1AA]">
                {[
                  'Enter a valid email address.',
                  'Your product details will be sent after payment confirmation.',
                  'Keep your order ID safe for support requests.',
                  'Refunds are handled according to the refund policy.',
                  'Contact support if you face any issue.',
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-[#8B5CF6] flex-shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
