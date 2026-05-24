'use client';

import { useState } from 'react';
import { sampleProducts } from '@/data/sampleProducts';
import { sampleReviews } from '@/data/sampleReviews';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import {
  Star, ShieldCheck, Zap, Shield, Package,
  ChevronRight, Mail, CreditCard, Bitcoin, Banknote, Check, AlertCircle
} from 'lucide-react';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={16}
          className={i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}
        />
      ))}
    </div>
  );
}

const PAYMENT_METHODS = [
  { id: 'card', label: 'Card Payment', desc: 'Visa, Mastercard, AMEX', icon: CreditCard },
  { id: 'crypto', label: 'Crypto Payment', desc: 'BTC, ETH, USDT', icon: Bitcoin },
  { id: 'manual', label: 'Manual Payment', desc: 'Bank transfer', icon: Banknote },
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
      <div className="min-h-[70vh] bg-slate-50 flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-24 h-24 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm">
          <Package size={40} className="text-slate-300" />
        </div>
        <h1 className="text-3xl font-black font-[family-name:var(--font-heading)] uppercase tracking-widest text-slate-800">Product Not Found</h1>
        <p className="text-slate-500 tracking-wide font-medium">The product you are looking for does not exist or has been removed.</p>
        <Link href={ROUTES.PRODUCTS} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative text-slate-800">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50 to-transparent pointer-events-none"></div>

      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-slate-500">
            <Link href={ROUTES.HOME} className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight size={14} className="text-slate-300" />
            <Link href={ROUTES.PRODUCTS} className="hover:text-blue-600 transition-colors">Products</Link>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-slate-800 truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT COLUMN: Product Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Header Card */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden">
              <div className="aspect-[21/9] bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden group">
                {/* Glow effect behind image */}
                <div className="absolute inset-0 bg-blue-400/20 blur-[50px] opacity-50"></div>
                
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover opacity-80 mix-blend-lighten" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center relative z-10">
                    <Package size={80} className="text-blue-200/60" />
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-90"></div>

                {product.isInstantDelivery && (
                  <div className="absolute top-5 right-5 z-20">
                    <span className="flex items-center gap-2 bg-blue-600 text-white text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-full shadow-[0_4px_12px_rgba(37,99,235,0.2)]">
                      <Zap size={14} className="text-amber-300 fill-amber-300" /> Instant Email Delivery
                    </span>
                  </div>
                )}
              </div>

              <div className="p-8 sm:p-10 relative z-10 -mt-10 bg-white rounded-t-3xl border-t border-slate-100">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <span className="inline-flex items-center text-[10px] font-bold tracking-widest uppercase text-blue-600 border border-blue-200 bg-blue-50/50 px-3 py-1.5 rounded-md shadow-sm">
                    {product.category}
                  </span>
                  <span className={`text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-md border ${product.inStock ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-rose-600 border-rose-200 bg-rose-50'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black font-[family-name:var(--font-heading)] uppercase tracking-wider text-slate-800 mb-6">{product.name}</h1>

                <div className="flex items-center gap-4 mb-8 bg-slate-50 border border-slate-100 rounded-xl p-4 inline-flex">
                  <StarRating rating={product.rating} />
                  <span className="font-bold text-slate-800">{product.rating}</span>
                  <span className="text-slate-500 text-sm font-medium">({product.reviewsCount} reviews)</span>
                </div>

                <div className="flex items-end gap-4 mb-10 pb-10 border-b border-slate-100">
                  <span className="text-5xl font-black font-[family-name:var(--font-heading)] text-slate-800 tracking-wider">{formatCurrency(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="mb-2">
                      <span className="text-xl text-slate-400 line-through mr-3 font-medium">{formatCurrency(product.originalPrice)}</span>
                      <span className="text-xs font-bold tracking-widest uppercase text-rose-600 bg-rose-50 border border-rose-200 px-2 py-1 rounded-md shadow-sm">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Description */}
                <div className="mb-10">
                  <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_5px_#2563eb]"></span>
                    Product Description
                  </h2>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    This digital product gives customers access to selected productivity, entertainment, gaming, or software features designed for online tasks. After successful checkout, delivery details will be sent to your email.
                  </p>
                </div>

                {/* What You Receive */}
                <div className="mb-10 bg-blue-50/50 border border-blue-100 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-[40px]"></div>
                  <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest text-slate-800 mb-5 relative z-10 flex items-center gap-2">
                    <Package size={18} className="text-blue-600" />
                    What You Receive
                  </h2>
                  <ul className="space-y-3 relative z-10">
                    {[
                      'Digital product details',
                      'Delivery instructions',
                      'Order confirmation',
                      'Basic usage guidance',
                      'Support access if needed'
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm font-medium text-slate-600">
                        <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Features */}
                {product.features?.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest text-slate-800 mb-5 flex items-center gap-2">
                      <Zap size={18} className="text-amber-500 fill-amber-500" />
                      Key Features
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.features.map((f) => (
                        <div key={f} className="flex items-center gap-3 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                          <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <Check size={12} className="text-amber-600" />
                          </div>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Important Notes */}
                <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6">
                  <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest text-amber-700 mb-5 flex items-center gap-2">
                    <AlertCircle size={18} />
                    Important Before Purchase
                  </h2>
                  <ul className="space-y-2.5">
                    {[
                      'Please enter a valid email address at checkout.',
                      'Digital products are delivered after payment confirmation.',
                      'Do not share your order details publicly.',
                      'Refunds are handled according to our refund policy.',
                      'Contact support if you face any issue with your order.',
                    ].map((note) => (
                      <li key={note} className="flex items-start gap-3 text-sm font-medium text-amber-800/80">
                        <span className="text-amber-500/50 mt-1 flex-shrink-0 text-[10px]">■</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px]"></div>
              
              <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest text-slate-800 mb-8 relative z-10">
                Customer <span className="text-blue-600">Reviews</span>
              </h2>
              
              <div className="space-y-6 relative z-10">
                {reviews.map((review) => (
                  <div key={review.id} className="p-6 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 border border-blue-200 rounded-xl flex items-center justify-center text-blue-700 font-bold font-[family-name:var(--font-heading)] text-lg shadow-sm">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold font-[family-name:var(--font-heading)] text-slate-800 tracking-wide uppercase mb-1">{review.userName}</p>
                          <StarRating rating={review.rating} />
                        </div>
                      </div>
                      {review.verifiedPurchase && (
                        <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold tracking-widest uppercase bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                          <ShieldCheck size={12} /> Verified Purchase
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Checkout Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              {submitted ? (
                <div className="bg-white border border-emerald-200 shadow-sm rounded-3xl p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-50/30"></div>
                  <div className="w-20 h-20 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-sm">
                    <Check size={32} className="text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider text-slate-800 mb-3 relative z-10">Checkout Initiated!</h3>
                  <p className="text-sm text-slate-600 font-medium mb-6 relative z-10">
                    Payment integration will be connected in a future update. Your order will be processed to{' '}
                    <strong className="text-slate-800 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded ml-1">{email}</strong>.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold tracking-widest uppercase text-blue-600 hover:text-blue-700 transition-colors relative z-10 border-b border-blue-200 hover:border-blue-300 pb-0.5"
                  >
                    Edit Order
                  </button>
                </div>
              ) : (
                <div className="bg-white border border-slate-100 shadow-md rounded-3xl overflow-hidden">
                  {/* Header */}
                  <div className="bg-slate-50 border-b border-slate-100 px-8 py-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                    <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest text-slate-800 mb-1">Complete Order</h2>
                    <p className="text-blue-600 text-xs font-bold tracking-widest uppercase">Instant Email Delivery</p>
                  </div>

                  <div className="p-8 space-y-8">
                    {/* Email */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">
                        <Mail size={14} className="text-blue-600" /> Email Address *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                        placeholder="your@email.com"
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all ${emailError ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200'}`}
                      />
                      {emailError && <p className="text-xs font-bold tracking-wide text-red-600 mt-2">{emailError}</p>}
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">Quantity</label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-950 hover:border-blue-500 transition-colors font-bold"
                        >
                          −
                        </button>
                        <span className="w-10 text-center font-bold text-slate-800 text-lg">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(10, quantity + 1))}
                          className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-950 hover:border-blue-500 transition-colors font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">Payment Method</label>
                      <div className="space-y-3">
                        {PAYMENT_METHODS.map(({ id, label, desc, icon: Icon }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setPaymentMethod(id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                              paymentMethod === id
                                ? 'border-blue-600 bg-blue-50/40 shadow-[0_0_15px_rgba(37,99,235,0.06)]'
                                : 'border-slate-200 bg-white hover:border-blue-300'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${paymentMethod === id ? 'border-blue-600' : 'border-slate-300'}`}>
                              {paymentMethod === id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_5px_#2563eb]" />}
                            </div>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${paymentMethod === id ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 border border-slate-100 text-slate-500'}`}>
                              <Icon size={18} />
                            </div>
                            <div className="text-left">
                              <p className={`text-sm font-bold tracking-wide uppercase mb-0.5 ${paymentMethod === id ? 'text-slate-800 font-extrabold' : 'text-slate-600'}`}>{label}</p>
                              <p className="text-[10px] font-medium tracking-wider uppercase text-slate-400">{desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-[20px]"></div>
                      <div className="flex justify-between text-xs font-bold tracking-widest uppercase text-slate-500 relative z-10">
                        <span>Unit Price</span>
                        <span>{formatCurrency(product.price)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold tracking-widest uppercase text-slate-500 relative z-10">
                        <span>Quantity</span>
                        <span>× {quantity}</span>
                      </div>
                      <div className="border-t border-slate-200 pt-3 mt-1 flex justify-between items-center relative z-10">
                        <span className="text-sm font-bold tracking-widest uppercase text-slate-800">Total</span>
                        <span className="text-2xl font-black font-[family-name:var(--font-heading)] text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.2)]">{formatCurrency(total)}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      onClick={handleCheckout}
                      disabled={!product.inStock}
                      className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_4px_12px_rgba(37,99,235,0.15)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Continue to Checkout
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest uppercase text-slate-500">
                      <Shield size={12} className="text-blue-600" />
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
