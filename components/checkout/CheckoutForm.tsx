"use client";

import { useState } from 'react';

export default function CheckoutForm() {
  const [email, setEmail] = useState('');

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-border">
      <h2 className="text-xl font-bold text-text-primary mb-6">Contact Information</h2>
      
      <div className="mb-8">
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
          Email Address <span className="text-danger">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Where should we send your product?"
          className="w-full bg-white border border-input rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
          required
        />
        <p className="text-xs text-text-muted mt-2">
          Your digital product access will be sent directly to this email address.
        </p>
      </div>

      <h2 className="text-xl font-bold text-text-primary mb-6">Payment Details</h2>
      
      <div className="space-y-4">
        {/* Placeholder for real payment form (Stripe/PayPal) */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Card Information
          </label>
          <div className="w-full h-12 bg-gray-50 border border-input rounded-md flex items-center px-4 text-text-muted text-sm">
            Card number, expiration, CVC placeholder
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Name on Card
          </label>
          <input
            type="text"
            placeholder="Name as it appears on card"
            className="w-full bg-white border border-input rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
          />
        </div>
      </div>
      
      <button className="mp-button-primary w-full mt-8 py-4 text-lg font-bold flex justify-center items-center gap-2">
        Complete Purchase
      </button>
      
      <p className="text-xs text-center text-text-muted mt-4">
        By completing this purchase, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
