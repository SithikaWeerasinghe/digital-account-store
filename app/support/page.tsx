'use client';

import { useState } from 'react';
import { faqs } from '@/data/faqs';
import {
  ChevronDown, Send, Ticket, Mail, MessageSquare, Check, AlertCircle
} from 'lucide-react';

type FormData = {
  name: string;
  email: string;
  orderId: string;
  issueType: string;
  subject: string;
  message: string;
};

const ISSUE_TYPES = [
  'Order not received',
  'Payment issue',
  'Product not working',
  'Need replacement',
  'Refund request',
  'General question',
];

const CONTACT_OPTIONS = [
  {
    icon: Ticket,
    title: 'Support Tickets',
    desc: 'Best for order issues and product problems.',
    detail: 'Submit a detailed ticket and our team will review and respond.',
  },
  {
    icon: Mail,
    title: 'Email Support',
    desc: 'Best for detailed questions and business inquiries.',
    detail: 'Send us a message and expect a reply within 24 hours.',
  },
  {
    icon: MessageSquare,
    title: 'Community / Social',
    desc: 'Best for quick updates and announcements.',
    detail: 'Follow our social channels for news and community discussions.',
  },
];

function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className={`bg-[#11111A] rounded-xl border overflow-hidden transition-all duration-300 ${
            open === i ? 'border-[#8B5CF6]/50 shadow-[0_0_15px_rgba(139,92,246,0.1)]' : 'border-[#25253A]'
          }`}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left focus:outline-none group"
          >
            <span className={`text-sm font-bold pr-4 transition-colors ${open === i ? 'text-[#A855F7]' : 'text-white group-hover:text-[#A855F7]'}`}>
              {faq.question}
            </span>
            <ChevronDown
              size={17}
              className={`flex-shrink-0 transition-all duration-300 ${open === i ? 'rotate-180 text-[#A855F7]' : 'text-[#6B7280]'}`}
            />
          </button>
          {open === i && (
            <div className="px-5 pb-5 text-sm text-[#A1A1AA] leading-relaxed border-t border-[#25253A] pt-4">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function SupportPage() {
  const [form, setForm] = useState<FormData>({
    name: '', email: '', orderId: '', issueType: '', subject: '', message: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'A valid email is required.';
    if (!form.issueType) newErrors.issueType = 'Please select an issue type.';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required.';
    if (!form.message.trim() || form.message.trim().length < 20)
      newErrors.message = 'Please describe your issue in at least 20 characters.';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }
    setErrors({});
    setSubmitted(true);
  };

  const inputClass = (field: keyof FormData) =>
    `mp-input ${errors[field] ? 'border-[#EF4444] focus:border-[#EF4444]' : ''}`;

  return (
    <div className="min-h-screen bg-[#050509]">

      {/* Hero Header */}
      <div className="relative bg-[#0B0B12] border-b border-[#25253A] hex-grid-bg overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.3) 0%, transparent 70%)' }}
          />
        </div>
        <div className="neon-divider" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="section-label mb-4 inline-flex">Help Center</span>
          <h1
            className="text-3xl sm:text-5xl font-black uppercase text-white mt-4 mb-3 tracking-wide neon-text"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Need Support?
          </h1>
          <p className="text-[#A1A1AA] max-w-xl mx-auto text-sm">
            Submit a ticket for order, payment, delivery, or product issues. Our team will review and respond as soon as possible.
          </p>
        </div>
        <div className="neon-divider" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Contact Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {CONTACT_OPTIONS.map(({ icon: Icon, title, desc, detail }) => (
            <div
              key={title}
              className="group bg-[#11111A] rounded-xl border border-[#25253A] p-6 hover:border-[#8B5CF6]/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(139,92,246,0.1)] transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center mb-4 group-hover:bg-[#8B5CF6]/20 group-hover:shadow-[0_0_12px_rgba(139,92,246,0.25)] transition-all">
                <Icon size={22} className="text-[#8B5CF6]" />
              </div>
              <h3
                className="text-sm font-black uppercase tracking-wider text-white mb-1"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                {title}
              </h3>
              <p className="text-xs text-[#A1A1AA] mb-1">{desc}</p>
              <p className="text-[10px] text-[#6B7280]">{detail}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Ticket Form */}
          <div className="bg-[#11111A] rounded-xl border border-[#25253A] overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/60 to-transparent" />

            <div className="bg-gradient-to-r from-[#8B5CF6]/20 to-[#A855F7]/10 border-b border-[#25253A] px-6 py-5">
              <h2
                className="text-base font-black uppercase tracking-wider text-white"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                Submit a Support Ticket
              </h2>
              <p className="text-[#A1A1AA] text-xs mt-1">Fill in the details below and we&apos;ll respond as soon as possible.</p>
            </div>

            {submitted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                  <Check size={28} className="text-[#22C55E]" />
                </div>
                <h3
                  className="text-lg font-black uppercase text-white mb-2"
                  style={{ fontFamily: 'var(--font-orbitron)' }}
                >
                  Ticket Submitted!
                </h3>
                <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-sm mx-auto">
                  Your ticket has been submitted successfully. Our support team will review it and respond as soon as possible.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', orderId: '', issueType: '', subject: '', message: '' }); }}
                  className="mt-6 mp-button-primary px-6 py-2.5 text-xs"
                >
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">

                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Full Name *</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Smith" className={inputClass('name')} />
                    {errors.name && <p className="text-xs text-[#EF4444] mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Email *</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" className={inputClass('email')} />
                    {errors.email && <p className="text-xs text-[#EF4444] mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.email}</p>}
                  </div>
                </div>

                {/* Order ID + Issue Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">
                      Order ID <span className="text-[#6B7280] normal-case font-normal tracking-normal">(optional)</span>
                    </label>
                    <input type="text" value={form.orderId} onChange={(e) => setForm({ ...form, orderId: e.target.value })} placeholder="ORD-12345" className="mp-input" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Issue Type *</label>
                    <select value={form.issueType} onChange={(e) => setForm({ ...form, issueType: e.target.value })} className={`${inputClass('issueType')} appearance-none`}>
                      <option value="" className="bg-[#11111A]">Select issue type...</option>
                      {ISSUE_TYPES.map((t) => <option key={t} value={t} className="bg-[#11111A]">{t}</option>)}
                    </select>
                    {errors.issueType && <p className="text-xs text-[#EF4444] mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.issueType}</p>}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Subject *</label>
                  <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Brief summary of the issue" className={inputClass('subject')} />
                  {errors.subject && <p className="text-xs text-[#EF4444] mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Message *</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Please describe your issue in detail. Include any relevant order information."
                    className={`${inputClass('message')} resize-none`}
                  />
                  {errors.message && <p className="text-xs text-[#EF4444] mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.message}</p>}
                </div>

                {/* Screenshot upload placeholder */}
                <div>
                  <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">
                    Screenshot <span className="text-[#6B7280] normal-case font-normal tracking-normal">(optional)</span>
                  </label>
                  <div className="w-full px-4 py-6 rounded-xl border border-dashed border-[#25253A] bg-[#050509] text-center text-xs text-[#6B7280] hover:border-[#8B5CF6]/40 hover:text-[#A1A1AA] transition-colors cursor-pointer">
                    Click to upload or drag and drop a screenshot (JPG, PNG)
                  </div>
                </div>

                <button type="submit" className="mp-button-primary w-full py-4 text-sm">
                  <Send size={15} /> Submit Ticket
                </button>
              </form>
            )}
          </div>

          {/* FAQ Section */}
          <div>
            <h2
              className="text-xl font-black uppercase tracking-wide text-white mb-6"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Frequently Asked Questions
            </h2>
            <FAQAccordion />
          </div>
        </div>
      </div>
    </div>
  );
}
