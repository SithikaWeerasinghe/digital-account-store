'use client';

import { useState } from 'react';
import { sampleProducts } from '@/data/sampleProducts';
import { sampleReviews } from '@/data/sampleReviews';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import {
  Star, BadgeCheck, Zap, Shield, Package,
  ChevronRight, Mail, CreditCard, Bitcoin, Banknote, Check, Gamepad2, Tv, Bot, Cpu, Briefcase, Gift
} from 'lucide-react';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={14}
          className={i <= Math.round(rating) ? 'fill-[#FACC15] text-[#FACC15] drop-shadow-[0_0_4px_rgba(250,204,21,0.4)]' : 'text-[#25253A] fill-[#25253A]'}
        />
      ))}
    </div>
  );
}

const PAYMENT_METHODS = [
  { id: 'card', label: 'Card Payment', desc: 'Visa, Mastercard, AMEX', icon: CreditCard },
  { id: 'crypto', label: 'Crypto Payment', desc: 'BTC, ETH, USDT', icon: Bitcoin },
  { id: 'manual', label: 'Manual Payment', desc: 'Bank transfer or other', icon: Banknote },
];

const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Gaming: Gamepad2, Streaming: Tv, 'AI Tools': Bot, Software: Cpu, Productivity: Briefcase, 'Gift Cards': Gift,
};
const categoryColors: Record<string, string> = {
  Gaming: 'from-[#7C3AED] to-[#A855F7]', Streaming: 'from-[#6D28D9] to-[#8B5CF6]',
  'AI Tools': 'from-[#5B21B6] to-[#7C3AED]', Software: 'from-[#4C1D95] to-[#6D28D9]',
  Productivity: 'from-[#8B5CF6] to-[#A855F7]', 'Gift Cards': 'from-[#A855F7] to-[#C084FC]',
};

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = sampleProducts.find((p) => p.slug === params.slug) ?? sampleProducts[0];
  const reviews = sampleReviews.slice(0, 3);

  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const total = product.price * quantity;
  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const CategoryIcon = categoryIcons[product.category] ?? Package;
  const gradientColor = categoryColors[product.category] ?? 'from-[#8B5CF6] to-[#A855F7]';

  const handleCheckout = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#050509]">
      {/* Breadcrumb */}
      <div className="border-b border-[#25253A] bg-[#0B0B12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-[#6B7280]" aria-label="Breadcrumb">
            <Link href={ROUTES.HOME} className="hover:text-[#A855F7] transition-colors">Home</Link>
            <ChevronRight size={13} />
            <Link href={ROUTES.PRODUCTS} className="hover:text-[#A855F7] transition-colors">Products</Link>
            <ChevronRight size={13} />
            <span className="text-[#A1A1AA] font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Product Info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Product Header Card */}
            <div className="bg-[#11111A] rounded-xl border border-[#25253A] overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/60 to-transparent" />

              {/* Product visual */}
              <div className={`h-56 bg-gradient-to-br ${gradientColor} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`, backgroundSize: '40px 40px' }} />
                <CategoryIcon size={80} className="text-white/70 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]" />
                {product.isInstantDelivery && (
                  <div className="absolute top-4 right-4">
                    <span className="flex items-center gap-1.5 bg-[#22C55E]/20 backdrop-blur-sm border border-[#22C55E]/40 text-[#22C55E] text-xs font-bold px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                      <Zap size={12} className="fill-[#22C55E]" /> Instant Email Delivery
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="badge-purple">{product.category}</span>
                  <span className={`text-xs font-bold tracking-widest uppercase ${product.inStock ? 'text-[#22C55E] drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'text-[#EF4444]'}`}>
                    {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                  </span>
                </div>

                <h1
                  className="text-2xl sm:text-3xl font-black uppercase text-white mb-4 leading-tight"
                  style={{ fontFamily: 'var(--font-orbitron)' }}
                >
                  {product.name}
                </h1>

                <div className="flex items-center gap-4 mb-6">
                  <StarRating rating={product.rating} />
                  <span className="font-bold text-white text-sm">{product.rating}</span>
                  <span className="text-[#6B7280] text-xs">{product.reviewsCount} reviews</span>
                </div>

                <div className="flex items-end gap-3 mb-8">
                  <span
                    className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                    style={{ fontFamily: 'var(--font-orbitron)' }}
                  >
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-xl text-[#6B7280] line-through mb-1">{formatCurrency(product.originalPrice)}</span>
                      <span className="badge-red mb-1">-{discountPct}% OFF</span>
                    </>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2
                    className="text-sm font-bold uppercase tracking-wider text-white mb-3"
                    style={{ fontFamily: 'var(--font-orbitron)' }}
                  >
                    Product Description
                  </h2>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed">{product.description}</p>
                </div>

                {/* What You Receive */}
                <div className="mb-6 bg-[#8B5CF6]/5 border border-[#8B5CF6]/20 rounded-xl p-5">
                  <h2
                    className="text-sm font-bold uppercase tracking-wider text-white mb-4"
                    style={{ fontFamily: 'var(--font-orbitron)' }}
                  >
                    What You Receive
                  </h2>
                  <ul className="space-y-2.5">
                    {[
                      'Digital product details sent to your email',
                      'Step-by-step delivery instructions',
                      'Order confirmation number',
                      'Basic usage guidance',
                      'Access to support if needed',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-[#A1A1AA]">
                        <Check size={14} className="text-[#8B5CF6] mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Features */}
                {product.features?.length > 0 && (
                  <div className="mb-6">
                    <h2
                      className="text-sm font-bold uppercase tracking-wider text-white mb-3"
                      style={{ fontFamily: 'var(--font-orbitron)' }}
                    >
                      Key Features
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {product.features.map((f) => (
                        <div key={f} className="flex items-center gap-2.5 text-sm text-[#A1A1AA]">
                          <div className="w-5 h-5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center flex-shrink-0">
                            <Check size={10} className="text-[#22C55E]" />
                          </div>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Important Notes */}
                <div className="bg-[#FACC15]/5 border border-[#FACC15]/20 rounded-xl p-5">
                  <h2
                    className="text-sm font-bold uppercase tracking-wider text-white mb-3"
                    style={{ fontFamily: 'var(--font-orbitron)' }}
                  >
                    Important Before Purchase
                  </h2>
                  <ul className="space-y-2">
                    {[
                      'Please enter a valid email address at checkout.',
                      'Digital products are delivered after payment confirmation.',
                      'Do not share your order details publicly.',
                      'Refunds are handled according to our refund policy.',
                      'Contact support if you face any issue with your order.',
                    ].map((note) => (
                      <li key={note} className="flex items-start gap-2 text-sm text-[#A1A1AA]">
                        <span className="text-[#FACC15] mt-0.5 flex-shrink-0">•</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="bg-[#11111A] rounded-xl border border-[#25253A] p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/40 to-transparent" />
              <h2
                className="text-lg font-black uppercase tracking-wide text-white mb-6"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                Customer Reviews
              </h2>
              <div className="space-y-5">
                {reviews.map((review) => (
                  <div key={review.id} className="pb-5 border-b border-[#25253A] last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-[0_0_8px_rgba(139,92,246,0.3)] flex-shrink-0">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{review.userName}</p>
                          <StarRating rating={review.rating} />
                        </div>
                      </div>
                      {review.verifiedPurchase && (
                        <span className="flex items-center gap-1 text-[#22C55E] text-[10px] font-bold tracking-wider uppercase">
                          <BadgeCheck size={12} /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#A1A1AA] leading-relaxed ml-12">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Checkout Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {submitted ? (
                <div className="bg-[#11111A] rounded-xl border border-[#22C55E]/40 p-6 text-center shadow-[0_0_20px_rgba(34,197,94,0.1)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#22C55E]/60 to-transparent" />
                  <div className="w-14 h-14 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                    <Check size={26} className="text-[#22C55E]" />
                  </div>
                  <h3
                    className="text-lg font-black uppercase text-white mb-2"
                    style={{ fontFamily: 'var(--font-orbitron)' }}
                  >
                    Checkout Initiated!
                  </h3>
                  <p className="text-sm text-[#A1A1AA] mb-4">
                    Payment integration will be connected in a future update. Your order will be processed to{' '}
                    <strong className="text-[#A855F7]">{email}</strong>.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm text-[#8B5CF6] hover:text-[#A855F7] transition-colors font-medium"
                  >
                    Edit Order
                  </button>
                </div>
              ) : (
                <div className="bg-[#11111A] rounded-xl border border-[#25253A] overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/60 to-transparent" />

                  {/* Checkout header */}
                  <div className="bg-gradient-to-r from-[#8B5CF6]/20 to-[#A855F7]/10 border-b border-[#25253A] px-5 py-4">
                    <h2
                      className="text-sm font-black uppercase tracking-wider text-white"
                      style={{ fontFamily: 'var(--font-orbitron)' }}
                    >
                      Complete Your Order
                    </h2>
                    <p className="text-[#A1A1AA] text-xs mt-0.5">Instant delivery to your email</p>
                  </div>

                  <div className="p-5 space-y-5">
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><Mail size={12} /> Email Address *</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                        placeholder="your@email.com"
                        className={`mp-input ${emailError ? 'border-[#EF4444] focus:border-[#EF4444]' : ''}`}
                      />
                      {emailError && <p className="text-xs text-[#EF4444] mt-1">{emailError}</p>}
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Quantity</label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-9 h-9 rounded-lg border border-[#25253A] bg-[#050509] flex items-center justify-center text-[#A1A1AA] hover:border-[#8B5CF6]/50 hover:text-white transition-all font-bold"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-bold text-white">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(10, quantity + 1))}
                          className="w-9 h-9 rounded-lg border border-[#25253A] bg-[#050509] flex items-center justify-center text-[#A1A1AA] hover:border-[#8B5CF6]/50 hover:text-white transition-all font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Payment Method</label>
                      <div className="space-y-2">
                        {PAYMENT_METHODS.map(({ id, label, desc, icon: Icon }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setPaymentMethod(id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                              paymentMethod === id
                                ? 'border-[#8B5CF6]/60 bg-[#8B5CF6]/10 shadow-[0_0_10px_rgba(139,92,246,0.15)]'
                                : 'border-[#25253A] bg-[#050509] hover:border-[#25253A]/80'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === id ? 'border-[#A855F7]' : 'border-[#25253A]'}`}>
                              {paymentMethod === id && <div className="w-2.5 h-2.5 rounded-full bg-[#A855F7]" />}
                            </div>
                            <Icon size={16} className={paymentMethod === id ? 'text-[#A855F7]' : 'text-[#6B7280]'} />
                            <div>
                              <p className={`text-xs font-bold ${paymentMethod === id ? 'text-[#A855F7]' : 'text-white'}`}>{label}</p>
                              <p className="text-[10px] text-[#6B7280]">{desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-[#050509] rounded-xl border border-[#25253A] p-4 space-y-2 text-sm">
                      <div className="flex justify-between text-[#A1A1AA]">
                        <span>Unit Price</span>
                        <span>{formatCurrency(product.price)}</span>
                      </div>
                      <div className="flex justify-between text-[#A1A1AA]">
                        <span>Quantity</span>
                        <span>× {quantity}</span>
                      </div>
                      <div className="border-t border-[#25253A] pt-2 flex justify-between font-black text-white">
                        <span>Total</span>
                        <span
                          className="text-[#A855F7] drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                          style={{ fontFamily: 'var(--font-orbitron)' }}
                        >
                          {formatCurrency(total)}
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      onClick={handleCheckout}
                      disabled={!product.inStock}
                      className="mp-button-primary w-full py-4 text-sm"
                    >
                      Continue to Checkout
                    </button>

                    <div className="flex items-center justify-center gap-2 text-xs text-[#6B7280]">
                      <Shield size={12} />
                      Secure payment processing
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
