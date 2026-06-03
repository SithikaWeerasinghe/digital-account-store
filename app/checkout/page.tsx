'use client';

import { useState, useEffect, useRef } from 'react';
import { CreditCard, Bitcoin, Banknote, ShieldCheck, AlertCircle, Tag, X, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { createOrder, startMercadoPagoCheckout, validateCoupon, ApplyDiscountResult } from '@/lib/api';
import { useCart } from '@/lib/contexts/CartContext';
import { useRouter } from 'next/navigation';
import PromoBannerList from '@/components/promos/PromoBannerList';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto' | 'manual'>('card');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Coupon / discount state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<ApplyDiscountResult | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const discountAmount = appliedCoupon?.valid ? appliedCoupon.discount_amount ?? 0 : 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      router.push('/cart');
    }
  }, [items, isSuccess, router]);

  // If the cart changes while a coupon is applied, re-validate it against the
  // new total. If it's no longer valid (e.g. below the minimum), remove it.
  useEffect(() => {
    if (!appliedCoupon?.valid || !appliedCoupon.code) return;
    let cancelled = false;
    (async () => {
      const result = await validateCoupon(appliedCoupon.code as string, cartTotal);
      if (cancelled) return;
      if (result.valid) {
        setAppliedCoupon(result);
        setCouponError('');
      } else {
        setAppliedCoupon(null);
        setCouponError(result.message || 'Coupon is no longer valid.');
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartTotal]);

  const handleApplyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    setCouponLoading(true);
    setCouponError('');
    try {
      const result = await validateCoupon(code, cartTotal);
      if (result.valid) {
        setAppliedCoupon(result);
        setCouponError('');
      } else {
        setAppliedCoupon(null);
        setCouponError(result.message || 'Invalid coupon code.');
      }
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    // Validate email
    if (!email) {
      setEmailError('Please enter your email address.');
      emailInputRef.current?.focus();
      emailInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      emailInputRef.current?.focus();
      emailInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setIsLoading(true);
    try {
      // Per-item pre-discount amounts.
      const itemAmounts = items.map((item) => {
        const itemPrice = item.selectedGuarantee?.total_price
          ?? item.selectedOption?.price
          ?? item.selectedVariant?.price
          ?? item.product.price;
        return itemPrice * item.quantity;
      });
      const subtotal = itemAmounts.reduce((sum, a) => sum + a, 0);

      // Distribute the coupon discount proportionally across the per-item orders
      // so it is applied exactly once across the whole cart (never per item).
      // The last order absorbs any rounding remainder so the shares sum exactly.
      const totalDiscount = appliedCoupon?.valid ? appliedCoupon.discount_amount ?? 0 : 0;
      const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
      let remainingDiscount = round2(totalDiscount);
      const discountShares = itemAmounts.map((amount, i) => {
        if (totalDiscount <= 0 || subtotal <= 0) return 0;
        if (i === itemAmounts.length - 1) return round2(remainingDiscount);
        const share = round2((totalDiscount * amount) / subtotal);
        remainingDiscount = round2(remainingDiscount - share);
        return share;
      });

      // 1. Create one pending order per cart item in Supabase.
      const createdOrders: any[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const originalAmount = round2(itemAmounts[i]);
        const share = Math.min(discountShares[i], originalAmount);
        const finalAmount = round2(originalAmount - share);
        const created = await createOrder({
          customerEmail: email,
          productId: item.product.id,
          quantity: item.quantity,
          amount: finalAmount,
          paymentMethod: paymentMethod,
          selectedOptionId: item.selectedOption?.id,
          selectedOptionLabel: item.selectedOption?.label,
          selectedOptionPrice: item.selectedOption?.price,
          selectedGuaranteeId: item.selectedGuarantee?.id,
          selectedGuaranteeLabel: item.selectedGuarantee?.label,
          selectedGuaranteeMonths: item.selectedGuarantee?.months,
          selectedGuaranteeTotalPrice: item.selectedGuarantee?.total_price,
          selectedGuaranteeMonthlyPrice: item.selectedGuarantee?.monthly_price,
          // Coupon: server re-validates the code and clamps the share.
          discountCode: appliedCoupon?.valid ? appliedCoupon.code : undefined,
          discountAmount: share,
          originalAmount: originalAmount,
          finalAmount: finalAmount,
          // Increment usage once per checkout — only on the first order.
          incrementCoupon: i === 0 && !!appliedCoupon?.valid,
        });
        createdOrders.push(created);
      }

      // 2. Online card payment → Mercado Pago Checkout Pro (redirect).
      //    Payment is confirmed ONLY by the webhook, never on this redirect.
      if (paymentMethod === 'card') {
        const ids = createdOrders.map((o) => o?.id).filter(Boolean) as string[];
        if (ids.length > 0) {
          const result = await startMercadoPagoCheckout({ order_id: ids[0], order_ids: ids });
          const redirectUrl = result?.data?.init_point || result?.data?.sandbox_init_point;

          if (result.success && redirectUrl) {
            clearCart();
            window.location.href = redirectUrl; // leave the app for Mercado Pago
            return;
          }

          // Gateway not configured yet → fall back to a pending confirmation
          // instead of failing the order the customer just placed.
          if (result.code === 'not_configured') {
            clearCart();
            setIsSuccess(true);
            return;
          }

          throw new Error(result.message || 'Could not start the Mercado Pago checkout. Please try again.');
        }
      }

      // 3. Manual / crypto → keep the existing pending/manual flow.
      clearCart();
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to process checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-background min-h-[calc(100vh-80px)] py-12 flex flex-col items-center justify-center font-sans text-text-primary">
        <div className="bg-card border border-border rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-primary to-[#008cc9] blur-[1px]"></div>
          
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-[0_0_15px_rgba(0,158,227,0.15)]">
            <ShieldCheck size={32} className="text-primary" />
          </div>
          
          <h2 className="text-2xl font-bold font-heading text-text-primary mb-2 tracking-wide">Order Received</h2>
          <p className="text-text-secondary text-sm sm:text-base mb-6">
            Your order has been created and is <span className="font-bold">pending confirmation</span>. Once payment is
            confirmed, your digital products will be sent to your email.
          </p>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8">
            <p className="text-sm sm:text-base text-primary font-medium">Keep your order details safe. You can reference them when contacting support.</p>
          </div>

          <Link href="/" className="mp-button-primary w-full inline-block text-center py-3">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-12 text-text-primary font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black font-heading text-text-primary uppercase tracking-widest mb-3 drop-shadow-[0_0_10px_rgba(0,158,227,0.15)]">
            SECURE CHECKOUT
          </h1>
          <p className="text-text-secondary max-w-2xl text-sm md:text-base">
            Review your digital product, enter your delivery email, and complete your order through a simple checkout process.
          </p>
        </div>

        {/* Active checkout + global promo banners (coupon reminders, delivery notices) */}
        <PromoBannerList placement="checkout" className="mb-8" />

        {/* Order Items Summary */}
        {items.length > 0 && (
          <div className="bg-card border border-border rounded-3xl p-6 mb-8 shadow-2xl">
            <h2 className="text-xl font-black font-heading uppercase tracking-widest text-text-primary mb-4">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item) => {
                const itemPrice = item.selectedGuarantee?.total_price
                  ?? item.selectedOption?.price
                  ?? item.selectedVariant?.price
                  ?? item.product.price;
                return (
                  <div key={item.id} className="flex justify-between items-center pb-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-semibold text-text-primary">{item.product.name}</p>
                      {item.selectedOption && (
                        <p className="text-xs text-text-secondary">Option: {item.selectedOption.label}</p>
                      )}
                      {item.selectedGuarantee && (
                        <p className="text-xs text-text-secondary">Guarantee: {item.selectedGuarantee.label}</p>
                      )}
                      {item.selectedVariant && !item.selectedOption && (
                        <p className="text-xs text-text-secondary">{item.selectedVariant.label}</p>
                      )}
                    </div>
                    <p className="font-black text-text-primary">
                      €{(itemPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
              {appliedCoupon?.valid && discountAmount > 0 && (
                <>
                  <div className="flex justify-between items-center pt-1 text-text-secondary">
                    <span>Subtotal</span>
                    <span>€{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-600 font-semibold">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-€{discountAmount.toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="pt-3 border-t-2 border-primary flex justify-between items-center">
                <span className="text-lg font-black text-text-primary font-heading uppercase">Total</span>
                <span className="text-3xl font-black text-primary">€{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Column: Form */}
          <div className="flex-1 space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
              {/* Decorative top border glow */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

              <form onSubmit={handleCheckout} className="space-y-6">

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm sm:text-base font-bold text-text-secondary mb-2 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <input
                      ref={emailInputRef}
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      placeholder="Enter your email for delivery"
                      className={`w-full bg-white border rounded-xl px-4 py-3.5 text-text-primary text-base placeholder:text-text-secondary/40 focus:outline-none transition-all shadow-sm ${
                        emailError
                          ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500/50'
                          : 'border-border focus:border-primary focus:ring-1 focus:ring-primary'
                      }`}
                    />
                    {emailError && (
                      <div className="flex items-center gap-1.5 mt-2 text-red-600">
                        <AlertCircle size={14} className="flex-shrink-0" />
                        <span className="text-sm font-medium">{emailError}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm sm:text-base font-bold text-text-secondary mb-3 uppercase tracking-wider">Payment Method</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Card */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-200 ${
                        paymentMethod === 'card' 
                          ? 'border-primary bg-primary/5 shadow-[0_0_15px_rgba(0,158,227,0.1)]' 
                          : 'border-border bg-white hover:border-primary/50 hover:bg-slate-50/50 shadow-sm'
                      }`}
                    >
                      <CreditCard size={24} className={`mb-2 ${paymentMethod === 'card' ? 'text-primary' : 'text-text-secondary'}`} />
                      <span className="font-bold text-text-primary text-base mb-1">Online Payment</span>
                      <span className="text-xs sm:text-sm text-text-secondary leading-tight">Pay securely via Mercado Pago — cards, wallet &amp; local methods.</span>
                    </button>

                    {/* Crypto */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('crypto')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-200 ${
                        paymentMethod === 'crypto' 
                          ? 'border-primary bg-primary/5 shadow-[0_0_15px_rgba(0,158,227,0.1)]' 
                          : 'border-border bg-white hover:border-primary/50 hover:bg-slate-50/50 shadow-sm'
                      }`}
                    >
                      <Bitcoin size={24} className={`mb-2 ${paymentMethod === 'crypto' ? 'text-primary' : 'text-text-secondary'}`} />
                      <span className="font-bold text-text-primary text-base mb-1">Crypto Payment</span>
                      <span className="text-xs sm:text-sm text-text-secondary leading-tight">Pay using supported cryptocurrency options.</span>
                    </button>

                    {/* Manual */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('manual')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-200 ${
                        paymentMethod === 'manual' 
                          ? 'border-primary bg-primary/5 shadow-[0_0_15px_rgba(0,158,227,0.1)]' 
                          : 'border-border bg-white hover:border-primary/50 hover:bg-slate-50/50 shadow-sm'
                      }`}
                    >
                      <Banknote size={24} className={`mb-2 ${paymentMethod === 'manual' ? 'text-primary' : 'text-text-secondary'}`} />
                      <span className="font-bold text-text-primary text-base mb-1">Manual Payment</span>
                      <span className="text-xs sm:text-sm text-text-secondary leading-tight">Submit an order request and complete payment manually.</span>
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="pt-4">
                  <button type="submit" disabled={isLoading} className="mp-button-primary w-full py-4 text-lg tracking-widest font-bold disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                    {isLoading ? (
                      <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing...</>
                    ) : (
                      'Continue to Checkout'
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
              <ShieldCheck className="text-primary flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-text-secondary">
                <span className="font-bold">Delivery Notice:</span> Digital products are delivered to your email after payment confirmation.
              </p>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:w-96 space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
              <h3 className="font-bold font-heading text-text-primary text-xl uppercase tracking-wider mb-6 pb-4 border-b border-border">
                Order Summary
              </h3>

              {items.length > 0 && (
                <>
                  {items.map((item) => {
                    const itemPrice = item.selectedGuarantee?.total_price
                      ?? item.selectedOption?.price
                      ?? item.selectedVariant?.price
                      ?? item.product.price;
                    return (
                      <div key={item.id} className="flex gap-4 mb-6">
                        <div className="w-16 h-16 bg-slate-50 border border-border rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {item.product.imageUrl?.startsWith('http') ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-primary tracking-widest uppercase">
                              {item.product.category.substring(0, 3)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-bold tracking-widest uppercase text-primary border border-primary/20 px-2 py-0.5 rounded-md bg-primary/5 inline-block mb-1">
                            {item.product.category}
                          </span>
                          <h4 className="font-bold text-text-primary leading-tight mb-1 line-clamp-2">
                            {item.product.name}
                          </h4>
                          {item.selectedOption && (
                            <p className="text-xs text-text-secondary mb-1">Opt: {item.selectedOption.label}</p>
                          )}
                          {item.selectedGuarantee && (
                            <p className="text-xs text-text-secondary mb-1">Guar: {item.selectedGuarantee.label}</p>
                          )}
                          {item.selectedVariant && !item.selectedOption && (
                            <p className="text-xs text-text-secondary mb-1">{item.selectedVariant.label}</p>
                          )}
                          <p className="text-text-secondary text-sm sm:text-base font-semibold">
                            €{(itemPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Coupon / Discount Code */}
                  <div className="mb-6 pb-6 border-b border-border">
                    <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Tag size={14} /> Coupon Code
                    </label>
                    {appliedCoupon?.valid ? (
                      <div className="flex items-center justify-between gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                          <span className="font-mono font-bold text-emerald-700 text-sm truncate">
                            {appliedCoupon.code}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex-shrink-0"
                        >
                          <X size={14} /> Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value.toUpperCase());
                            if (couponError) setCouponError('');
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleApplyCoupon();
                            }
                          }}
                          placeholder="Enter discount code"
                          className="flex-1 min-w-0 bg-white border border-border rounded-xl px-3 py-2.5 text-text-primary text-sm font-mono uppercase placeholder:text-text-secondary/40 placeholder:normal-case focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading}
                          className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold uppercase tracking-wider hover:bg-primary-hover transition-all disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {couponLoading ? <Loader2 size={15} className="animate-spin" /> : 'Apply'}
                        </button>
                      </div>
                    )}
                    {couponError && (
                      <div className="flex items-center gap-1.5 mt-2 text-red-600">
                        <AlertCircle size={13} className="flex-shrink-0" />
                        <span className="text-xs font-medium">{couponError}</span>
                      </div>
                    )}
                    {appliedCoupon?.valid && (
                      <p className="text-xs text-emerald-600 font-medium mt-2">Coupon applied successfully.</p>
                    )}
                  </div>

                  <div className="space-y-3 mb-6 pb-6 border-b border-border text-sm sm:text-base">
                    <div className="flex justify-between text-text-secondary">
                      <span>Items</span>
                      <span>{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                      <span>Subtotal</span>
                      <span>€{cartTotal.toFixed(2)}</span>
                    </div>
                    {appliedCoupon?.valid && discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>-€{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-text-primary text-lg sm:text-xl">Total</span>
                    <span className="font-black text-primary text-2xl drop-shadow-[0_0_8px_rgba(0,158,227,0.15)]">
                      €{finalTotal.toFixed(2)}
                    </span>
                  </div>
                </>
              )}

              <div className="space-y-2 mb-2">
                <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Instant Delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Verified Stock
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Support Available
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl">
              <h4 className="font-bold text-text-primary text-base uppercase tracking-wider mb-4">Important Before Purchase</h4>
              <ul className="space-y-3 text-sm sm:text-base text-text-secondary">
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Enter a valid email address.
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Your product details will be sent after payment confirmation.
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Keep your order ID safe for support requests.
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Refunds are handled according to the refund policy.
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span> Contact support if you face any issue.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
