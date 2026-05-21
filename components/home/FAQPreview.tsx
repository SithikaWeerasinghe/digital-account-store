'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const homeFaqs = [
  { q: 'How fast is delivery?', a: 'Digital products are delivered instantly to your email address, typically within seconds of payment confirmation.' },
  { q: 'Where will I receive my product?', a: 'All product details are sent to the email address you provide during checkout. Please ensure it is correct before completing your purchase.' },
  { q: 'Can I contact support after purchase?', a: 'Yes, our support team is available to help with any post-purchase questions or issues. Submit a ticket on our Support page.' },
  { q: 'Do you offer refunds?', a: 'Refunds are handled on a case-by-case basis. If the product does not work as described and we cannot provide a replacement, a refund may be issued.' },
];

export default function FAQPreview() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
          <p className="text-gray-500">Quick answers to our most common questions.</p>
        </div>

        <div className="space-y-3">
          {homeFaqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#009ee3]"
              >
                <span className="font-medium text-gray-900">{faq.q}</span>
                {open === i
                  ? <ChevronUp size={18} className="text-[#009ee3] flex-shrink-0" />
                  : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                }
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
