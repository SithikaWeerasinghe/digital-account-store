'use client';

import { useState } from 'react';
import { CreditCard, Bitcoin, Banknote, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const price = 9.99;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!email.includes('@')) {
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
      <div className="bg-[#050509] min-h-[calc(100vh-80px)] py-12 flex flex-col items-center justify-center font-[family-name:var(--font-body)]">
        <div className="bg-[#11111A] border border-[#25253A] rounded-2xl p-8 max-w-md w-full mx-4 shadow-[0_0_30px_rgba(139,92,246,0.15)] text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] blur-[2px]"></div>
          
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/50 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <ShieldCheck size={32} className="text-[#A855F7]" />
          </div>
          
          <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-white mb-2 tracking-wide">Order preview created</h2>
          <p className="text-[#A1A1AA] text-sm sm:text-base mb-6">
            Your checkout details are ready. Real payment processing will be connected in the backend phase.
          </p>
          
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-8">
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
    <div className="bg-[#050509] min-h-screen py-12 font-[family-name:var(--font-body)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black font-[family-name:var(--font-heading)] text-white uppercase tracking-widest mb-3 drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">
            SECURE CHECKOUT
          </h1>
          <p className="text-[#A1A1AA] max-w-2xl text-sm md:text-base">
            Review your digital product, enter your delivery email, and complete your order through a simple checkout process.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Form */}
          <div className="flex-1 space-y-6">
            <div className="bg-[#11111A] border border-[#25253A] rounded-2xl p-6 relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              {/* Decorative top border glow */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-50"></div>
              
              <form onSubmit={handleCheckout} className="space-y-6">
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm sm:text-base font-bold text-white mb-2 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for delivery"
                    className="w-full bg-[#050509] border border-[#25253A] rounded-lg px-4 py-3 text-white text-base placeholder:text-[#4A4A5A] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label htmlFor="quantity" className="block text-sm sm:text-base font-bold text-white mb-2 uppercase tracking-wider">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#050509] border border-[#25253A] rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm sm:text-base font-bold text-white mb-3 uppercase tracking-wider">Payment Method</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Card */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-200 ${
                        paymentMethod === 'card' 
                          ? 'border-[#A855F7] bg-primary/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                          : 'border-[#25253A] bg-[#050509] hover:border-[#4A4A5A]'
                      }`}
                    >
                      <CreditCard size={24} className={`mb-2 ${paymentMethod === 'card' ? 'text-[#A855F7]' : 'text-[#A1A1AA]'}`} />
                      <span className="font-bold text-white text-base mb-1">Card Payment</span>
                      <span className="text-xs sm:text-sm text-[#A1A1AA] leading-tight">Pay securely using a debit or credit card.</span>
                    </button>

                    {/* Crypto */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('crypto')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-200 ${
                        paymentMethod === 'crypto' 
                          ? 'border-[#A855F7] bg-primary/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                          : 'border-[#25253A] bg-[#050509] hover:border-[#4A4A5A]'
                      }`}
                    >
                      <Bitcoin size={24} className={`mb-2 ${paymentMethod === 'crypto' ? 'text-[#A855F7]' : 'text-[#A1A1AA]'}`} />
                      <span className="font-bold text-white text-base mb-1">Crypto Payment</span>
                      <span className="text-xs sm:text-sm text-[#A1A1AA] leading-tight">Pay using supported cryptocurrency options.</span>
                    </button>

                    {/* Manual */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('manual')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-200 ${
                        paymentMethod === 'manual' 
                          ? 'border-[#A855F7] bg-primary/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                          : 'border-[#25253A] bg-[#050509] hover:border-[#4A4A5A]'
                      }`}
                    >
                      <Banknote size={24} className={`mb-2 ${paymentMethod === 'manual' ? 'text-[#A855F7]' : 'text-[#A1A1AA]'}`} />
                      <span className="font-bold text-white text-base mb-1">Manual Payment</span>
                      <span className="text-xs sm:text-sm text-[#A1A1AA] leading-tight">Submit an order request and complete payment manually.</span>
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-destructive/20 border border-destructive/50 text-destructive text-sm px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="pt-4">
                  <button type="submit" className="mp-button-primary w-full py-4 text-lg tracking-widest font-bold">
                    Continue to Checkout
                  </button>
                </div>
              </form>
            </div>
            
            <div className="bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-xl p-4 flex items-start gap-3">
              <ShieldCheck className="text-[#8B5CF6] flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-[#E4D4FF]">
                <span className="font-bold">Delivery Notice:</span> Digital products are delivered to your email after payment confirmation.
              </p>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:w-96 space-y-6">
            <div className="bg-[#11111A] border border-[#25253A] rounded-2xl p-6 relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <h3 className="font-bold font-[family-name:var(--font-heading)] text-white text-xl uppercase tracking-wider mb-6 pb-4 border-b border-[#25253A]">
                Order Summary
              </h3>

              <div className="flex gap-4 mb-6">
                <div className="w-16 h-16 bg-[#050509] border border-[#25253A] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary tracking-widest uppercase">GAME</span>
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold tracking-widest uppercase text-primary border border-primary/30 px-2 py-0.5 rounded-md bg-primary/5 inline-block mb-1">
                    Gaming
                  </span>
                  <h4 className="font-bold text-white leading-tight mb-1">Gaming Digital Bundle</h4>
                  <p className="text-[#A1A1AA] text-sm sm:text-base">${price.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-[#25253A] text-sm sm:text-base">
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
                <span className="font-bold text-white text-lg sm:text-xl">Total</span>
                <span className="font-black text-[#A855F7] text-2xl drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
                  ${(price * quantity).toFixed(2)}
                </span>
              </div>

              <div className="space-y-2 mb-2">
                <div className="flex items-center gap-2 text-sm font-medium text-[#A1A1AA]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></div> Instant Delivery
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-[#A1A1AA]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></div> Verified Stock
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-[#A1A1AA]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></div> Support Available
                </div>
              </div>
            </div>

            <div className="bg-[#11111A] border border-[#25253A] rounded-2xl p-6">
              <h4 className="font-bold text-white text-base uppercase tracking-wider mb-4">Important Before Purchase</h4>
              <ul className="space-y-3 text-sm sm:text-base text-[#A1A1AA]">
                <li className="flex gap-2">
                  <span className="text-[#8B5CF6]">•</span> Enter a valid email address.
                </li>
                <li className="flex gap-2">
                  <span className="text-[#8B5CF6]">•</span> Your product details will be sent after payment confirmation.
                </li>
                <li className="flex gap-2">
                  <span className="text-[#8B5CF6]">•</span> Keep your order ID safe for support requests.
                </li>
                <li className="flex gap-2">
                  <span className="text-[#8B5CF6]">•</span> Refunds are handled according to the refund policy.
                </li>
                <li className="flex gap-2">
                  <span className="text-[#8B5CF6]">•</span> Contact support if you face any issue.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
