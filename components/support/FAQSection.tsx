"use client";

import { useState } from 'react';
import { faqs } from '@/data/faqs';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-text-primary mb-6">Frequently Asked Questions</h2>
      
      {faqs.map((faq, index) => (
        <div 
          key={index} 
          className="bg-white border border-border rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggleFaq(index)}
            className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
          >
            <span className="font-medium text-text-primary">{faq.question}</span>
            {openIndex === index ? (
              <ChevronUp size={20} className="text-text-muted flex-shrink-0" />
            ) : (
              <ChevronDown size={20} className="text-text-muted flex-shrink-0" />
            )}
          </button>
          
          {openIndex === index && (
            <div className="px-6 pb-4 text-text-secondary text-sm leading-relaxed border-t border-gray-100 pt-3">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
