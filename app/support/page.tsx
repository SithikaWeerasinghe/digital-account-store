'use client';

import { useState } from 'react';
import { faqs } from '@/data/faqs';
import {
  ChevronDown, ChevronUp, Send, Ticket,
  Mail, MessageSquare, Check, AlertCircle, UploadCloud
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
    color: 'text-primary border-primary bg-primary/10 group-hover:bg-primary/20',
  },
  {
    icon: Mail,
    title: 'Email Support',
    desc: 'Best for detailed questions and business inquiries.',
    detail: 'Send us a message and expect a reply within 24 hours.',
    color: 'text-accent border-accent bg-accent/10 group-hover:bg-accent/20',
  },
  {
    icon: MessageSquare,
    title: 'Community',
    desc: 'Best for quick updates and announcements.',
    detail: 'Follow our social channels for news and community discussions.',
    color: 'text-success border-success bg-success/10 group-hover:bg-success/20',
  },
];

function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <div key={i} className={`mp-card overflow-hidden transition-all duration-300 ${open === i ? 'border-primary shadow-[0_0_15px_rgba(139,92,246,0.15)]' : ''}`}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none group"
          >
            <span className={`font-bold font-[family-name:var(--font-heading)] tracking-wider uppercase text-base ${open === i ? 'text-primary' : 'text-white group-hover:text-primary transition-colors'}`}>
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
            <div className="px-6 pb-6 text-[15px] sm:text-base text-text-secondary leading-relaxed border-t border-border pt-4 font-medium">
              {faq.answer}
            </div>
          </div>
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
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'A valid email is required.';
    if (!form.issueType) newErrors.issueType = 'Please select an issue type.';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required.';
    if (!form.message.trim() || form.message.trim().length < 20) newErrors.message = 'Please describe your issue in at least 20 characters.';
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  const inputClass = (field: keyof FormData) =>
    `w-full px-4 py-3.5 rounded-xl border bg-[#0A0A0F] text-white text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] ${
      errors[field] ? 'border-destructive/50 ring-1 ring-destructive/20' : 'border-border'
    }`;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Header */}
      <div className="bg-secondary border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-black font-[family-name:var(--font-heading)] uppercase tracking-widest text-white mb-6">
            Need <span className="text-primary drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">Support?</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg font-medium tracking-wide">
            Submit a ticket for order, payment, delivery, or product issues. Our support team will review your request and respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {CONTACT_OPTIONS.map(({ icon: Icon, title, desc, detail, color }) => (
            <div key={title} className="mp-card p-6 flex flex-col group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 border transition-colors ${color} shadow-[0_0_15px_rgba(255,255,255,0.05)]`}>
                <Icon size={24} />
              </div>
              <h3 className="font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest text-white mb-2">{title}</h3>
              <p className="text-sm sm:text-base font-medium text-text-secondary mb-3">{desc}</p>
              <p className="text-[11px] sm:text-xs tracking-wider uppercase text-text-secondary/70">{detail}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Support Ticket Form */}
          <div className="mp-card overflow-hidden h-fit">
            <div className="bg-secondary border-b border-border px-8 py-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest text-white mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">Submit a Ticket</h2>
              <p className="text-primary text-xs font-bold tracking-widest uppercase">We respond within 24 hours</p>
            </div>

            {submitted ? (
              <div className="p-10 text-center border-success/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-success/5"></div>
                <div className="w-20 h-20 bg-success/10 border border-success/30 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                  <Check size={32} className="text-success drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider text-white mb-4 relative z-10">Ticket Submitted!</h3>
                <p className="text-sm text-text-secondary font-medium leading-relaxed max-w-sm mx-auto mb-8 relative z-10">
                  Your ticket has been submitted successfully. Our support team will review it and respond as soon as possible.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', orderId: '', issueType: '', subject: '', message: '' }); }}
                  className="mp-button-primary relative z-10"
                >
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-bold tracking-widest uppercase text-text-secondary mb-3">Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className={inputClass('name')}
                    />
                    {errors.name && <p className="text-xs font-bold tracking-wide text-destructive mt-2 flex items-center gap-1"><AlertCircle size={12} />{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-bold tracking-widest uppercase text-text-secondary mb-3">Email Address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@email.com"
                      className={inputClass('email')}
                    />
                    {errors.email && <p className="text-xs font-bold tracking-wide text-destructive mt-2 flex items-center gap-1"><AlertCircle size={12} />{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order ID */}
                  <div>
                    <label className="block text-sm font-bold tracking-widest uppercase text-text-secondary mb-3">Order ID <span className="text-text-secondary/50 font-medium">(optional)</span></label>
                    <input
                      type="text"
                      value={form.orderId}
                      onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                      placeholder="ORD-12345"
                      className="w-full px-4 py-3.5 rounded-xl border bg-[#0A0A0F] text-white text-base font-medium border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                    />
                  </div>

                  {/* Issue Type */}
                  <div>
                    <label className="block text-sm font-bold tracking-widest uppercase text-text-secondary mb-3">Issue Type *</label>
                    <select
                      value={form.issueType}
                      onChange={(e) => setForm({ ...form, issueType: e.target.value })}
                      className={`${inputClass('issueType')} appearance-none cursor-pointer`}
                    >
                      <option value="" className="bg-card">Select issue type...</option>
                      {ISSUE_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-card text-white">{t}</option>
                      ))}
                    </select>
                    {errors.issueType && <p className="text-xs font-bold tracking-wide text-destructive mt-2 flex items-center gap-1"><AlertCircle size={12} />{errors.issueType}</p>}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-bold tracking-widest uppercase text-text-secondary mb-3">Subject *</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Brief summary of the issue"
                    className={inputClass('subject')}
                  />
                  {errors.subject && <p className="text-xs font-bold tracking-wide text-destructive mt-2 flex items-center gap-1"><AlertCircle size={12} />{errors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-bold tracking-widest uppercase text-text-secondary mb-3">Message *</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Please describe your issue in detail. Include any relevant order information."
                    className={`${inputClass('message')} resize-none`}
                  />
                  {errors.message && <p className="text-xs font-bold tracking-wide text-destructive mt-2 flex items-center gap-1"><AlertCircle size={12} />{errors.message}</p>}
                </div>

                {/* Screenshot (placeholder) */}
                <div>
                  <label className="block text-sm font-bold tracking-widest uppercase text-text-secondary mb-3">Screenshot <span className="text-text-secondary/50 font-medium">(optional)</span></label>
                  <div className="w-full px-4 py-8 rounded-xl border-2 border-dashed border-border bg-[#0A0A0F] text-center text-sm sm:text-base font-medium text-text-secondary hover:border-primary/50 hover:text-white transition-colors cursor-pointer group flex flex-col items-center gap-2">
                    <UploadCloud size={24} className="text-text-secondary group-hover:text-primary transition-colors" />
                    <span>Click to upload or drag and drop a screenshot (JPG, PNG)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-primary text-white font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest hover:bg-primary-hover transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3"
                >
                  <Send size={18} /> Submit Ticket
                </button>
              </form>
            )}
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest text-white mb-8">
              Frequently Asked <span className="text-primary drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">Questions</span>
            </h2>
            <FAQAccordion />
          </div>
        </div>
      </div>
    </div>
  );
}
