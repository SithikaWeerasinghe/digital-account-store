'use client';

import { use, useState } from 'react';
import { sampleProducts } from '@/data/sampleProducts';
import { sampleReviews } from '@/data/sampleReviews';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import {
  Star, BadgeCheck, Zap, Shield, Package,
  ChevronRight, Mail, CreditCard, Bitcoin, Check,
  Headphones, ArrowLeft, Quote
} from 'lucide-react';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function StarRating({ rating, size = 15 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? 'fill-[#ffd700] text-[#ffd700]' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, AMEX', icon: CreditCard },
  { id: 'crypto', label: 'Cryptocurrency', desc: 'BTC, ETH, USDT & more', icon: Bitcoin },
];

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = sampleProducts.find((p) => p.slug === slug);
  const reviews = sampleReviews.slice(0, 3);

  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 px-4 bg-[#f0f4f8]">
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
          <Package size={36} className="text-gray-300" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-[#0d1b2a] mb-2">Product Not Found</h1>
          <p className="text-gray-500 mb-6">The product you are looking for does not exist or has been removed.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#009ee3] text-white font-bold hover:bg-[#007ec0] transition-colors shadow-md"
          >
            <ArrowLeft size={16} /> Browse Products
          </Link>
          <Link
            href={ROUTES.SUPPORT}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    );
  }

  const total = product.price * quantity;
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleCheckout = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8]">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-400">
            <Link href={ROUTES.HOME} className="hover:text-[#009ee3] transition-colors">Home</Link>
            <ChevronRight size={13} />
            <Link href={ROUTES.PRODUCTS} className="hover:text-[#009ee3] transition-colors">Products</Link>
            <ChevronRight size={13} />
            <span className="text-gray-700 font-semibold truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Product Info */}
          <div className="lg:col-span-2 space-y-5">

            {/* Product header card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Product image */}
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-50 to-slate-100">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={64} className="text-gray-300" />
                  </div>
                )}
                {product.isInstantDelivery && (
                  <div className="absolute top-4 right-4">
                    <span className="flex items-center gap-1.5 bg-[#009ee3] text-white text-sm font-bold px-3.5 py-1.5 rounded-full shadow-lg">
                      <Zap size={13} fill="currentColor" className="text-[#ffd700]" />
                      Instant Email Delivery
                    </span>
                  </div>
                )}
                {discount && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white text-sm font-extrabold px-3 py-1.5 rounded-full shadow-lg">
                      -{discount}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Product info */}
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className="apex-badge-blue">{product.category}</span>
                  <span className={`text-sm font-bold ${product.inStock ? 'text-emerald-600' : 'text-red-500'}`}>
                    {product.inStock ? '● In Stock' : '○ Out of Stock'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d1b2a] mb-4 leading-tight tracking-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4 mb-6">
                  <StarRating rating={product.rating} />
                  <span className="font-extrabold text-gray-800">{product.rating}</span>
                  <span className="text-gray-400 text-sm">{product.reviewsCount} reviews</span>
                </div>

                <div className="flex items-end gap-3 mb-7">
                  <span className="text-4xl font-extrabold text-[#0d1b2a]">{formatCurrency(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-xl text-gray-400 line-through mb-0.5">{formatCurrency(product.originalPrice)}</span>
                      <span className="text-sm font-extrabold text-red-500 mb-0.5">-{discount}% OFF</span>
                    </>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-base font-bold text-[#0d1b2a] mb-2">Product Description</h2>
                  <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
                </div>

                {/* Delivery Info */}
                <div className="mb-6 bg-[#e8f6fd] rounded-2xl p-5 border border-[#009ee3]/15">
                  <h2 className="text-sm font-bold text-[#0d1b2a] mb-3 flex items-center gap-2">
                    <Zap size={14} className="text-[#009ee3]" /> Delivery Information
                  </h2>
                  <ul className="space-y-2">
                    {[
                      'Digital product details sent to your email instantly',
                      'Step-by-step delivery instructions included',
                      'Order confirmation number provided',
                      'Access to support if needed post-delivery',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <Check size={14} className="text-[#009ee3] mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Features */}
                {product.features?.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-sm font-bold text-[#0d1b2a] mb-3">Key Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.features.map((f) => (
                        <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <Check size={11} className="text-emerald-600" />
                          </div>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Important notes */}
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                  <h2 className="text-sm font-bold text-[#0d1b2a] mb-3">⚠ Important Before Purchase</h2>
                  <ul className="space-y-1.5">
                    {[
                      'Please enter a valid email address at checkout.',
                      'Digital products are delivered after payment confirmation.',
                      'Do not share your order details publicly.',
                      'Refunds are handled according to our refund policy.',
                      'Contact support if you face any issue with your order.',
                    ].map((note) => (
                      <li key={note} className="flex items-start gap-2 text-sm text-amber-800">
                        <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Link
                    href={ROUTES.SUPPORT}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:border-[#009ee3]/50 hover:text-[#009ee3] transition-colors"
                  >
                    <Headphones size={16} /> Contact Support
                  </Link>
                </div>
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <h2 className="text-xl font-extrabold text-[#0d1b2a] mb-6">Customer Reviews</h2>
              <div className="space-y-5">
                {reviews.map((review) => (
                  <div key={review.id} className="pb-5 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#009ee3] to-[#0066cc] rounded-full flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#0d1b2a]">{review.userName}</p>
                          <StarRating rating={review.rating} size={13} />
                        </div>
                      </div>
                      {review.verifiedPurchase && (
                        <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                          <BadgeCheck size={13} /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed ml-13 ml-[52px] mt-2 relative">
                      <Quote size={14} className="text-[#009ee3]/20 absolute -left-5 top-0" />
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Order Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {submitted ? (
                <div className="bg-white rounded-2xl border-2 border-emerald-200 p-6 text-center shadow-lg">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Check size={30} className="text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#0d1b2a] mb-2">Order Initiated!</h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                    Payment integration will be connected in a future stage. Delivery will be sent to{' '}
                    <strong className="text-[#0d1b2a]">{email}</strong>.
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-sm text-[#009ee3] font-semibold hover:underline"
                    >
                      Edit Order
                    </button>
                    <Link
                      href={ROUTES.PRODUCTS}
                      className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Browse More Products
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Box header */}
                  <div className="bg-gradient-to-r from-[#0059a6] to-[#009ee3] px-6 py-5">
                    <h2 className="text-lg font-extrabold text-white">Complete Your Order</h2>
                    <p className="text-white/70 text-sm mt-0.5">Instant delivery to your email inbox</p>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-bold text-[#0d1b2a] mb-1.5">
                        <span className="flex items-center gap-1.5"><Mail size={13} /> Email Address *</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                        placeholder="your@email.com"
                        className={`apex-input ${emailError ? 'error' : ''}`}
                      />
                      {emailError && <p className="text-xs text-red-500 mt-1.5">{emailError}</p>}
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-bold text-[#0d1b2a] mb-1.5">Quantity</label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-extrabold text-[#0d1b2a]">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(10, quantity + 1))}
                          className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-bold text-[#0d1b2a] mb-2">Payment Method</label>
                      <div className="space-y-2">
                        {PAYMENT_METHODS.map(({ id, label, desc, icon: Icon }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setPaymentMethod(id)}
                            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                              paymentMethod === id
                                ? 'border-[#009ee3] bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                paymentMethod === id ? 'border-[#009ee3]' : 'border-gray-300'
                              }`}
                            >
                              {paymentMethod === id && <div className="w-2.5 h-2.5 rounded-full bg-[#009ee3]" />}
                            </div>
                            <Icon size={17} className={paymentMethod === id ? 'text-[#009ee3]' : 'text-gray-400'} />
                            <div>
                              <p className={`text-sm font-bold ${paymentMethod === id ? 'text-[#009ee3]' : 'text-gray-700'}`}>{label}</p>
                              <p className="text-xs text-gray-400">{desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2 text-center">
                        Payment integration will be connected in a future stage.
                      </p>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm border border-gray-100">
                      <div className="flex justify-between text-gray-500">
                        <span>Unit Price</span>
                        <span>{formatCurrency(product.price)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Quantity</span>
                        <span>× {quantity}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between font-extrabold text-[#0d1b2a] text-base">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      onClick={handleCheckout}
                      disabled={!product.inStock}
                      className="w-full py-3.5 rounded-xl bg-[#009ee3] text-white font-extrabold text-base hover:bg-[#007ec0] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-md hover:shadow-lg active:scale-[0.98]"
                    >
                      {product.inStock ? 'Place Order' : 'Out of Stock'}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                      <Shield size={12} />
                      Secure encrypted checkout
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
