'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { ChevronDown, ArrowRight } from 'lucide-react';

const homeFaqs = [
  {
    q: 'How fast is delivery?',
    a: 'Digital products are delivered instantly to your email address, typically within seconds of payment confirmation.',
  },
  {
    q: 'Where will I receive my product?',
    a: 'All product details are sent to the email address you provide during checkout. Please ensure it is correct before completing your purchase.',
  },
  {
    q: 'Can I contact support after purchase?',
    a: 'Yes, our support team is available to help with any post-purchase questions or issues. Submit a ticket on our Support page.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Refunds are handled on a case-by-case basis. If the product does not work as described and we cannot provide a replacement, a refund may be issued.',
  },
];

export default function FAQPreview() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 bg-[#050509] relative">
      <div className="neon-divider" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center mb-12">
          <span className="section-label mb-4 inline-flex">FAQ</span>
          <h2
            className="text-3xl sm:text-4xl font-black uppercase text-white mt-4 mb-3 tracking-wide"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-[#A1A1AA] text-sm">Quick answers to our most common questions.</p>
        </div>

        <div className="space-y-3">
          {homeFaqs.map((faq, i) => (
            <div
              key={i}
              className={`bg-[#11111A] rounded-xl border transition-all duration-300 overflow-hidden ${
                open === i ? 'border-[#8B5CF6]/50 shadow-[0_0_15px_rgba(139,92,246,0.1)]' : 'border-[#25253A] hover:border-[#25253A]/80'
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left focus:outline-none group"
              >
                <span
                  className={`font-bold text-sm tracking-wide transition-colors ${open === i ? 'text-[#A855F7]' : 'text-white group-hover:text-[#A855F7]'}`}
                >
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 transition-all duration-300 ${
                    open === i ? 'rotate-180 text-[#A855F7] drop-shadow-[0_0_4px_rgba(168,85,247,0.8)]' : 'text-[#6B7280]'
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-[#A1A1AA] leading-relaxed border-t border-[#25253A] pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={ROUTES.SUPPORT}
            className="inline-flex items-center gap-2 text-[#8B5CF6] hover:text-[#A855F7] font-bold text-sm tracking-wider uppercase transition-colors group"
          >
            View All FAQs
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
