'use client';

import { useState, useEffect, use } from 'react';
import { fetchProductBySlug, fetchReviews } from '@/lib/api';
import { Product } from '@/types/product';
import { Review } from '@/types/review';
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
          className={i <= Math.round(rating) ? 'fill-warning text-warning' : 'text-slate-200 fill-slate-200'}
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

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [productData, reviewsData] = await Promise.all([
          fetchProductBySlug(slug),
          fetchReviews()
        ]);
        setProduct(productData);
        setReviews(reviewsData.slice(0, 3));
      } catch (err: any) {
        setError(err.message || 'Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [slug]);

  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const total = product ? product.price * quantity : 0;

  const handleCheckout = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setSubmitted(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-background flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h1 className="text-xl font-black font-heading uppercase tracking-widest text-text-primary">Loading Product...</h1>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] bg-background flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-24 h-24 bg-card border border-border rounded-full flex items-center justify-center shadow-2xl">
          <Package size={40} className="text-text-secondary/50" />
        </div>
        <h1 className="text-3xl font-black font-heading uppercase tracking-widest text-text-primary">Product Not Found</h1>
        <p className="text-text-secondary tracking-wide font-medium">The product you are looking for does not exist or has been removed.</p>
        <Link href={ROUTES.PRODUCTS} className="px-6 py-3 bg-primary text-white font-black font-heading tracking-widest uppercase rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative text-text-primary font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>

      {/* Breadcrumb */}
      <div className="border-b border-border bg-secondary-background relative z-10 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-text-secondary">
            <Link href={ROUTES.HOME} className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={12} className="text-border" />
            <Link href={ROUTES.PRODUCTS} className="hover:text-primary transition-colors">Products</Link>
            <ChevronRight size={12} className="text-border" />
            <span className="text-text-primary truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT COLUMN: Product Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Header Card */}
            <div className="bg-card border border-border shadow-2xl rounded-3xl overflow-hidden">
              <div className="aspect-[21/9] bg-gradient-to-br from-primary to-accent relative overflow-hidden group">
                {/* Glow effect behind image */}
                <div className="absolute inset-0 bg-primary/20 blur-[50px] opacity-50"></div>
                
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover opacity-80 mix-blend-luminosity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center relative z-10">
                    <Package size={80} className="text-primary/45" />
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-95"></div>

                {product.isInstantDelivery && (
                  <div className="absolute top-5 right-5 z-20">
                    <span className="flex items-center gap-2 bg-primary text-white text-xs font-black font-heading tracking-widest uppercase px-4 py-2 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                      <Zap size={14} className="text-warning fill-warning animate-pulse" /> Instant Email Delivery
                    </span>
                  </div>
                )}
              </div>

              <div className="p-8 sm:p-10 relative z-10 -mt-10 bg-card rounded-t-3xl border-t border-border">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <span className="inline-flex items-center text-xs font-black font-heading tracking-widest uppercase text-primary border border-primary/20 bg-primary/5 px-3 py-1.5 rounded-sm shadow-sm">
                    {product.category}
                  </span>
                  <span className={`text-sm font-black font-heading tracking-widest uppercase px-3 py-1.5 rounded-sm border ${product.inStock ? 'text-success border-success/20 bg-success/5' : 'text-hazard border-hazard/20 bg-hazard/5'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black font-heading uppercase tracking-wider text-text-primary mb-6">{product.name}</h1>

                <div className="flex items-center gap-4 mb-8 bg-secondary-background border border-border rounded-xl p-4 inline-flex">
                  <StarRating rating={product.rating} />
                  <span className="font-bold text-text-primary font-heading">{product.rating}</span>
                  <span className="text-text-secondary text-sm sm:text-base font-medium">({product.reviewsCount} reviews)</span>
                </div>

                <div className="flex items-end gap-4 mb-10 pb-10 border-b border-border">
                  <span className="text-5xl font-black font-heading text-text-primary tracking-wider">{formatCurrency(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="mb-2">
                      <span className="text-xl text-text-secondary line-through mr-3 font-medium">{formatCurrency(product.originalPrice)}</span>
                      <span className="text-xs sm:text-sm font-black font-heading tracking-widest uppercase text-hazard bg-hazard/10 border border-hazard/20 px-2 py-1 rounded-sm shadow-sm">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Description */}
                <div className="mb-10">
                  <h2 className="text-lg font-black font-heading uppercase tracking-widest text-text-primary mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(0,158,227,0.4)]"></span>
                    Product Description
                  </h2>
                  <p className="text-text-secondary leading-relaxed font-medium">
                    This digital product gives customers access to selected productivity, entertainment, gaming, or software features designed for online tasks. After successful checkout, delivery details will be sent to your email.
                  </p>
                </div>

                {/* What You Receive */}
                <div className="mb-10 bg-primary/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px]"></div>
                  <h2 className="text-lg font-black font-heading uppercase tracking-widest text-text-primary mb-5 relative z-10 flex items-center gap-2">
                    <Package size={18} className="text-primary" />
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
                      <li key={item} className="flex items-start gap-3 text-sm sm:text-base font-medium text-text-secondary">
                        <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Features */}
                {product.features?.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-lg font-black font-heading uppercase tracking-widest text-text-primary mb-5 flex items-center gap-2">
                      <Zap size={18} className="text-warning fill-warning" />
                      Key Features
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {product.features.map((f) => (
                        <div key={f} className="flex items-center gap-3 text-sm sm:text-base font-medium text-text-secondary bg-secondary-background border border-border p-3 rounded-xl">
                          <div className="w-6 h-6 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                            <Check size={12} className="text-primary" />
                          </div>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Important Notes */}
                <div className="bg-warning/5 border border-warning/20 rounded-2xl p-6">
                  <h2 className="text-lg font-black font-heading uppercase tracking-widest text-warning mb-5 flex items-center gap-2">
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
                      <li key={note} className="flex items-start gap-3 text-sm sm:text-base font-medium text-warning/80">
                        <span className="text-warning/55 mt-1 flex-shrink-0 text-[10px]">■</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="bg-card border border-border shadow-2xl rounded-3xl p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px]"></div>
              
              <h2 className="text-2xl font-black font-heading uppercase tracking-widest text-text-primary mb-8 relative z-10">
                Customer <span className="text-primary">Reviews</span>
              </h2>
              
              <div className="space-y-6 relative z-10">
                {reviews.map((review) => (
                  <div key={review.id} className="p-6 bg-secondary-background border border-border rounded-xl">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary font-black font-heading text-lg shadow-sm">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-base font-black font-heading text-text-primary tracking-wide uppercase mb-1">{review.userName}</p>
                          <StarRating rating={review.rating} />
                        </div>
                      </div>
                      {review.verifiedPurchase && (
                        <span className="flex items-center gap-1.5 text-success text-xs font-black tracking-widest uppercase bg-success/5 border border-success/20 px-2.5 py-1 rounded-sm">
                          <ShieldCheck size={12} /> Verified Purchase
                        </span>
                      )}
                    </div>
                    <p className="text-[15px] sm:text-base text-text-secondary leading-relaxed font-medium">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Checkout Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              {submitted ? (
                <div className="bg-card border border-success/20 shadow-2xl rounded-3xl p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-success/5"></div>
                  <div className="w-20 h-20 bg-success/10 border border-success/20 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-sm">
                    <Check size={32} className="text-success" />
                  </div>
                  <h3 className="text-xl font-black font-heading uppercase tracking-widest text-text-primary mb-3 relative z-10">Checkout Initiated!</h3>
                  <p className="text-sm text-text-secondary font-medium mb-6 relative z-10">
                    Payment integration will be connected in a future update. Your order will be processed to{' '}
                    <strong className="text-text-primary bg-secondary-background border border-border px-2 py-0.5 rounded ml-1 font-mono">{email}</strong>.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-black font-heading tracking-widest uppercase text-primary hover:text-primary-hover transition-colors relative z-10 border-b border-primary/35 hover:border-primary pb-0.5"
                  >
                    Edit Order
                  </button>
                </div>
              ) : (
                <div className="bg-card border border-border shadow-2xl rounded-3xl overflow-hidden">
                  {/* Header */}
                  <div className="bg-secondary-background border-b border-border px-8 py-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                    <h2 className="text-lg font-black font-heading uppercase tracking-widest text-text-primary mb-1">Complete Order</h2>
                    <p className="text-primary text-xs sm:text-sm font-black font-heading tracking-widest uppercase">Instant Email Delivery</p>
                  </div>

                  <div className="p-8 space-y-8">
                    {/* Email */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-black font-heading tracking-widest uppercase text-text-secondary mb-3">
                        <Mail size={14} className="text-primary" /> Email Address *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                        placeholder="your@email.com"
                        className={`w-full px-4 py-3 rounded-xl border bg-white text-text-primary text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-text-secondary/40 ${emailError ? 'border-hazard ring-1 ring-hazard/10' : 'border-border'}`}
                      />
                      {emailError && <p className="text-xs font-black tracking-wide text-hazard mt-2">{emailError}</p>}
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-black font-heading tracking-widest uppercase text-text-secondary mb-3">Quantity</label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 rounded-xl bg-slate-50 border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-primary transition-colors font-bold"
                        >
                          −
                        </button>
                        <span className="w-10 text-center font-black text-text-primary text-lg font-mono">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(10, quantity + 1))}
                          className="w-10 h-10 rounded-xl bg-slate-50 border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-primary transition-colors font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-black font-heading tracking-widest uppercase text-text-secondary mb-3">Payment Method</label>
                      <div className="space-y-3">
                        {PAYMENT_METHODS.map(({ id, label, desc, icon: Icon }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setPaymentMethod(id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                              paymentMethod === id
                                ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,158,227,0.1)]'
                                : 'border-border bg-white hover:border-primary/50'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${paymentMethod === id ? 'border-primary' : 'border-border'}`}>
                              {paymentMethod === id && <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_5px_rgba(0,158,227,0.5)]" />}
                            </div>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${paymentMethod === id ? 'bg-primary/15 text-primary' : 'bg-slate-50 border border-border text-text-secondary/55'}`}>
                              <Icon size={18} />
                            </div>
                            <div className="text-left font-mono">
                              <p className={`text-sm font-black tracking-widest uppercase mb-0.5 ${paymentMethod === id ? 'text-text-primary font-extrabold' : 'text-text-secondary'}`}>{label}</p>
                              <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-text-secondary/50">{desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-slate-50 border border-border rounded-xl p-5 space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[20px]"></div>
                      <div className="flex justify-between text-sm font-black tracking-widest uppercase text-text-secondary/70 relative z-10 font-mono">
                        <span>Unit Price</span>
                        <span>{formatCurrency(product.price)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-black tracking-widest uppercase text-text-secondary/70 relative z-10 font-mono">
                        <span>Quantity</span>
                        <span>× {quantity}</span>
                      </div>
                      <div className="border-t border-border pt-3 mt-1 flex justify-between items-center relative z-10">
                        <span className="text-base font-black font-heading tracking-widest uppercase text-text-primary">Total</span>
                        <span className="text-2xl font-black font-heading text-primary drop-shadow-[0_0_8px_rgba(0,158,227,0.2)]">{formatCurrency(total)}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      onClick={handleCheckout}
                      disabled={!product.inStock}
                      className="w-full py-4 rounded-xl bg-primary text-white font-black font-heading tracking-widest uppercase hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_15px_rgba(0,158,227,0.15)] hover:shadow-[0_0_25px_rgba(0,158,227,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Continue to Checkout
                    </button>

                    <div className="flex items-center justify-center gap-2 text-xs font-black font-heading tracking-widest uppercase text-text-secondary/50">
                      <Shield size={12} className="text-primary" />
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

