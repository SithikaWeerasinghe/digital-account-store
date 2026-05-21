'use client';

import { useState } from 'react';
import { sampleProducts } from '@/data/sampleProducts';
import { sampleReviews } from '@/data/sampleReviews';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import {
  Star, BadgeCheck, Zap, Shield, Package,
  ChevronRight, Mail, CreditCard, Bitcoin, Banknote, Check
} from 'lucide-react';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={15}
          className={i <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}
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

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = sampleProducts.find((p) => p.slug === params.slug) ?? sampleProducts[0];
  const reviews = sampleReviews.slice(0, 3);

  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const total = product.price * quantity;

  const handleCheckout = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setSubmitted(true);
  };

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <Package size={48} className="text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-800">Product Not Found</h1>
        <p className="text-gray-500">The product you are looking for does not exist or has been removed.</p>
        <Link href={ROUTES.PRODUCTS} className="mt-2 px-5 py-2.5 rounded-xl bg-[#009ee3] text-white font-semibold hover:bg-[#008cc9] transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500">
            <Link href={ROUTES.HOME} className="hover:text-[#009ee3] transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href={ROUTES.PRODUCTS} className="hover:text-[#009ee3] transition-colors">Products</Link>
            <ChevronRight size={14} />
            <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Header Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={64} className="text-gray-300" />
                  </div>
                )}
                {product.isInstantDelivery && (
                  <div className="absolute top-4 right-4">
                    <span className="flex items-center gap-1.5 bg-[#009ee3] text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-lg">
                      <Zap size={14} className="text-[#fff159]" /> Instant Email Delivery
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className="inline-flex items-center text-xs font-semibold text-[#009ee3] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                    {product.category}
                  </span>
                  <span className={`text-sm font-semibold ${product.inStock ? 'text-emerald-600' : 'text-red-500'}`}>
                    {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

                <div className="flex items-center gap-4 mb-6">
                  <StarRating rating={product.rating} />
                  <span className="font-bold text-gray-900">{product.rating}</span>
                  <span className="text-gray-500 text-sm">{product.reviewsCount} reviews</span>
                </div>

                <div className="flex items-end gap-3 mb-6">
                  <span className="text-4xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-xl text-gray-400 line-through mb-0.5">{formatCurrency(product.originalPrice)}</span>
                      <span className="text-sm font-bold text-red-500 mb-0.5">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Product Description */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Product Description</h2>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                {/* What You Receive */}
                <div className="mb-6 bg-blue-50 rounded-xl p-5">
                  <h2 className="text-base font-semibold text-gray-900 mb-3">What You Receive</h2>
                  <ul className="space-y-2">
                    {['Digital product details sent to your email', 'Step-by-step delivery instructions', 'Order confirmation number', 'Basic usage guidance', 'Access to support if needed'].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <Check size={15} className="text-[#009ee3] mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Features */}
                {product.features?.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-base font-semibold text-gray-900 mb-3">Key Features</h2>
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

                {/* Important Notes */}
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                  <h2 className="text-base font-semibold text-gray-900 mb-3">Important Before Purchase</h2>
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
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
              <div className="space-y-5">
                {reviews.map((review) => (
                  <div key={review.id} className="pb-5 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#009ee3]/10 rounded-full flex items-center justify-center text-[#009ee3] font-bold text-sm">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{review.userName}</p>
                          <StarRating rating={review.rating} />
                        </div>
                      </div>
                      {review.verifiedPurchase && (
                        <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                          <BadgeCheck size={13} /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed ml-12">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Checkout Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {submitted ? (
                <div className="bg-white rounded-2xl border border-emerald-200 p-6 text-center shadow-lg">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={28} className="text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Checkout Initiated!</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Payment integration will be connected in a future update. Your order will be processed to{' '}
                    <strong>{email}</strong>.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm text-[#009ee3] hover:underline"
                  >
                    Edit Order
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#009ee3] to-[#006fa8] px-6 py-4">
                    <h2 className="text-lg font-bold text-white">Complete Your Order</h2>
                    <p className="text-white/75 text-sm">Instant delivery to your email</p>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        <span className="flex items-center gap-1.5"><Mail size={14} /> Email Address *</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                        placeholder="your@email.com"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#009ee3]/30 focus:border-[#009ee3] transition-all ${emailError ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}
                      />
                      {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantity</label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors font-bold"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-900">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(10, quantity + 1))}
                          className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                      <div className="space-y-2">
                        {PAYMENT_METHODS.map(({ id, label, desc, icon: Icon }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setPaymentMethod(id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                              paymentMethod === id
                                ? 'border-[#009ee3] bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === id ? 'border-[#009ee3]' : 'border-gray-300'}`}>
                              {paymentMethod === id && <div className="w-3 h-3 rounded-full bg-[#009ee3]" />}
                            </div>
                            <Icon size={18} className={paymentMethod === id ? 'text-[#009ee3]' : 'text-gray-400'} />
                            <div>
                              <p className={`text-sm font-semibold ${paymentMethod === id ? 'text-[#009ee3]' : 'text-gray-700'}`}>{label}</p>
                              <p className="text-xs text-gray-400">{desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Unit Price</span>
                        <span>{formatCurrency(product.price)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Quantity</span>
                        <span>× {quantity}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-base">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      onClick={handleCheckout}
                      disabled={!product.inStock}
                      className="w-full py-3.5 rounded-xl bg-[#009ee3] text-white font-bold text-base hover:bg-[#008cc9] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-md hover:shadow-lg active:scale-[0.98]"
                    >
                      Continue to Checkout
                    </button>

                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                      <Shield size={13} />
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
