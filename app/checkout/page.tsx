'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Bitcoin, Banknote, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { createOrder } from '@/lib/api';
import { useCart } from '@/lib/contexts/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto' | 'manual'>('card');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      router.push('/cart');
    }
  }, [items, isSuccess, router]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setIsLoading(true);
    try {
      for (const item of items) {
        const amount = (item.selectedVariant?.price ?? item.product.price) * item.quantity;
        await createOrder({
          customerEmail: email,
          productId: item.product.id,
          quantity: item.quantity,
          amount: amount,
          paymentMethod: paymentMethod
        });
      }
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
          
          <h2 className="text-2xl font-bold font-heading text-text-primary mb-2 tracking-wide">Order preview created</h2>
          <p className="text-text-secondary text-sm sm:text-base mb-6">
            Your checkout details are ready. Real payment processing will be connected in the backend phase.
          </p>
          
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8">
            <p className="text-sm sm:text-base text-primary font-medium">Checkout request created successfully. Payment integration will be connected later.</p>
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

        {/* Order Items Summary */}
        {items.length > 0 && (
          <div className="bg-card border border-border rounded-3xl p-6 mb-8 shadow-2xl">
            <h2 className="text-xl font-black font-heading uppercase tracking-widest text-text-primary mb-4">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item) => {
                const itemPrice = item.selectedVariant?.price ?? item.product.price;
                return (
                  <div key={item.id} className="flex justify-between items-center pb-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-semibold text-text-primary">{item.product.name}</p>
                      {item.selectedVariant && (
                        <p className="text-xs text-text-secondary">{item.selectedVariant.label}</p>
                      )}
                    </div>
                    <p className="font-black text-text-primary">
                      €{(itemPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
              <div className="pt-3 border-t-2 border-primary flex justify-between items-center">
                <span className="text-lg font-black text-text-primary font-heading uppercase">Total</span>
                <span className="text-3xl font-black text-primary">€{cartTotal.toFixed(2)}</span>
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
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for delivery"
                    className="w-full bg-white border border-border rounded-xl px-4 py-3.5 text-text-primary text-base placeholder:text-text-secondary/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                  />
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
                      <span className="font-bold text-text-primary text-base mb-1">Card Payment</span>
                      <span className="text-xs sm:text-sm text-text-secondary leading-tight">Pay securely using a debit or credit card.</span>
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
                    const itemPrice = item.selectedVariant?.price ?? item.product.price;
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
                          {item.selectedVariant && (
                            <p className="text-xs text-text-secondary mb-1">{item.selectedVariant.label}</p>
                          )}
                          <p className="text-text-secondary text-sm sm:text-base font-semibold">
                            €{(itemPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  <div className="space-y-3 mb-6 pb-6 border-b border-border text-sm sm:text-base">
                    <div className="flex justify-between text-text-secondary">
                      <span>Items</span>
                      <span>{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                      <span>Subtotal</span>
                      <span>€{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-text-primary text-lg sm:text-xl">Total</span>
                    <span className="font-black text-primary text-2xl drop-shadow-[0_0_8px_rgba(0,158,227,0.15)]">
                      €{cartTotal.toFixed(2)}
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
