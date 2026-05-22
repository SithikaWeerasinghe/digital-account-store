'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const homeFaqs = [
  { q: 'How fast is delivery?', a: 'Digital credentials, activation keys, and access codes are dispatched automatically and instantly to your provided email address within seconds of transaction confirmation.' },
  { q: 'Where will I receive my product?', a: 'All license keys and login instructions are routed straight to the email address entered during purchase checkout. Please verify your email formatting prior to completing payments.' },
  { q: 'Can I contact support after purchase?', a: 'Absolutely. Our post-purchase technical support team remains online 24/7 to resolve credentials errors, subscription issues, or license activation questions. Submit a ticket on our Support page.' },
  { q: 'Do you offer refunds?', a: 'Refund requests are handled dynamically on a case-by-case basis. If the digital item is verified as defective and we cannot issue a functional replacement, a refund will be processed.' },
];

export default function FAQPreview() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 bg-white relative">
      {/* Decorative background orb */}
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-[#009ee3]/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-900 tracking-tight">
            Frequently Asked <span className="text-[#009ee3] font-black">Questions</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Quick responses to common digital account shopping questions.
          </p>
        </div>

        <div className="space-y-4">
          {homeFaqs.map((faq, i) => (
            <div 
              key={i} 
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                open === i 
                  ? 'bg-white border-[#009ee3]/50 shadow-md' 
                  : 'bg-gray-50 border-gray-200/60 hover:bg-gray-100/40 hover:border-gray-300'
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none cursor-pointer group"
              >
                <span className={`font-bold text-sm sm:text-base transition-colors duration-200 ${
                  open === i ? 'text-[#009ee3]' : 'text-gray-900 group-hover:text-[#009ee3]'
                }`}>
                  {faq.q}
                </span>
                {open === i ? (
                  <ChevronUp size={18} className="text-[#009ee3] flex-shrink-0 transition-transform duration-300" />
                ) : (
                  <ChevronDown size={18} className="text-gray-400 flex-shrink-0 group-hover:text-[#009ee3] transition-transform duration-300" />
                )}
              </button>
              
              {/* Smooth Grid transition container */}
              <div className={`accordion-grid ${open === i ? 'open' : ''}`}>
                <div className="overflow-hidden">
                  <div className="px-6 pb-5 text-xs sm:text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
