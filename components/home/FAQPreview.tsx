'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { faqs } from '@/data/faqs';

export default function FAQPreview() {
  const [open, setOpen] = useState<number | null>(0);
  
  // Take first 4 FAQs for home page
  const homeFaqs = faqs.slice(0, 4);

  return (
    <section className="py-24 bg-background border-t border-border relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider text-white mb-4">
            Common <span className="text-primary drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">Questions</span>
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-[0_0_10px_rgba(139,92,246,0.6)] mb-4"></div>
          <p className="text-text-secondary tracking-wide">Quick answers to our most common questions.</p>
        </div>

        <div className="space-y-4">
          {homeFaqs.map((faq, i) => (
            <div key={i} className={`mp-card overflow-hidden transition-all duration-300 ${open === i ? 'border-primary shadow-[0_0_15px_rgba(139,92,246,0.15)]' : ''}`}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none group"
              >
                <span className={`font-bold font-[family-name:var(--font-heading)] tracking-wider uppercase text-sm ${open === i ? 'text-primary' : 'text-white group-hover:text-primary transition-colors'}`}>
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${open === i ? 'bg-primary/20 text-primary' : 'bg-[#1A1A24] text-text-secondary group-hover:bg-primary/10 group-hover:text-primary'}`}>
                  {open === i
                    ? <ChevronUp size={18} />
                    : <ChevronDown size={18} />
                  }
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${open === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-6 pb-6 text-sm text-text-secondary leading-relaxed border-t border-border pt-4 font-medium">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
