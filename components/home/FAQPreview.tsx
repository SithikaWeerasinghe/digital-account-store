'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const homeFaqs = [
  {
    q: 'How fast is delivery?',
    a: 'Digital products are delivered instantly to your email address, typically within seconds of payment confirmation. No waiting, no delays.',
  },
  {
    q: 'Where will I receive my product?',
    a: 'All product details are sent to the email address you provide during checkout. Please ensure it is correct before completing your purchase.',
  },
  {
    q: 'Can I contact support after purchase?',
    a: 'Yes, our support team is available to help with any post-purchase questions or issues. Submit a ticket on our Support page and we\'ll respond promptly.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Refunds are handled on a case-by-case basis. If the product does not work as described and we cannot provide a replacement, a refund may be issued.',
  },
];

export default function FAQPreview() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-20 bg-[#f0f4f8]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="apex-badge-blue mb-3 inline-flex">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d1b2a] mb-3 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-base">Quick answers to our most common questions.</p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {homeFaqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:border-[#009ee3]/25 transition-colors"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#009ee3]"
              >
                <span className="font-semibold text-[#0d1b2a] text-sm pr-4">{faq.q}</span>
                {open === i
                  ? <ChevronUp size={17} className="text-[#009ee3] flex-shrink-0" />
                  : <ChevronDown size={17} className="text-gray-400 flex-shrink-0" />
                }
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
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
