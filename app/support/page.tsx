'use client';

import { useState } from 'react';
import { faqs } from '@/data/faqs';
import {
  ChevronDown, ChevronUp, Send, Ticket,
  Mail, MessageSquare, Check, AlertCircle,
  Clock, Zap, Shield, HeadphonesIcon
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
  'Product not working',
  'Payment issue',
  'Replacement request',
  'General question',
];

const SUPPORT_INFO = [
  {
    icon: Clock,
    title: 'Response Time',
    desc: 'We aim to respond to all tickets within a few hours. Complex issues may take up to 24 hours.',
    color: 'bg-blue-50 text-[#009ee3]',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'All support communications are private and handled securely by our team.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Zap,
    title: 'Fast Resolution',
    desc: 'Most order and delivery issues are resolved quickly with replacement or guidance.',
    color: 'bg-purple-50 text-purple-600',
  },
];

function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden hover:border-[#009ee3]/25 transition-colors"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#009ee3]"
          >
            <span className="font-semibold text-[#0d1b2a] text-sm pr-4">{faq.question}</span>
            {open === i
              ? <ChevronUp size={16} className="text-[#009ee3] flex-shrink-0" />
              : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
            }
          </button>
          {open === i && (
            <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
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
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  const inputClass = (field: keyof FormData) =>
    `apex-input ${errors[field] ? 'error' : ''}`;

  return (
    <div className="min-h-screen bg-[#f0f4f8]">

      {/* Hero */}
      <div className="bg-[#ffd700] px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-[#0059a6] via-[#009ee3] to-[#00b8f0] rounded-2xl px-8 py-12 text-center text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/15 border border-white/25 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <HeadphonesIcon size={26} className="text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
                How Can We Help?
              </h1>
              <p className="text-white/80 max-w-lg mx-auto text-base leading-relaxed">
                Submit a ticket for order support, product help, payment issues, or replacement requests.
                Our team will respond as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Support info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {SUPPORT_INFO.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon size={18} />
              </div>
              <h3 className="font-bold text-[#0d1b2a] text-sm mb-1">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Main content: Form + FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Ticket Form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#0059a6] to-[#009ee3] px-6 py-5">
              <h2 className="text-lg font-extrabold text-white">Submit a Support Ticket</h2>
              <p className="text-white/70 text-xs mt-1">
                Fill in the details below and we&apos;ll respond as soon as possible.
              </p>
            </div>

            {submitted ? (
              <div className="p-10 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Check size={30} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-extrabold text-[#0d1b2a] mb-2">Ticket Submitted!</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto mb-1">
                  Your ticket has been submitted. Our support team will review it and reply as soon as possible.
                </p>
                <p className="text-xs text-gray-400 mb-6">
                  Check your email for a confirmation notice.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', orderId: '', issueType: '', subject: '', message: '' });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#009ee3] text-white text-sm font-bold hover:bg-[#007ec0] transition-colors shadow-sm"
                >
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-[#0d1b2a] mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Smith"
                    className={inputClass('name')}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-[#0d1b2a] mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@email.com"
                    className={inputClass('email')}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.email}</p>}
                </div>

                {/* Order ID */}
                <div>
                  <label className="block text-sm font-bold text-[#0d1b2a] mb-1.5">
                    Order ID <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.orderId}
                    onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                    placeholder="ORD-12345"
                    className="apex-input"
                  />
                </div>

                {/* Issue Type */}
                <div>
                  <label className="block text-sm font-bold text-[#0d1b2a] mb-1.5">Issue Type *</label>
                  <select
                    value={form.issueType}
                    onChange={(e) => setForm({ ...form, issueType: e.target.value })}
                    className={inputClass('issueType')}
                  >
                    <option value="">Select issue type...</option>
                    {ISSUE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.issueType && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.issueType}</p>}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-bold text-[#0d1b2a] mb-1.5">Subject *</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Brief summary of the issue"
                    className={inputClass('subject')}
                  />
                  {errors.subject && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-bold text-[#0d1b2a] mb-1.5">Message *</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Please describe your issue in detail. Include relevant order information."
                    className={`${inputClass('message')} resize-none`}
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.message}</p>}
                </div>

                {/* Screenshot placeholder */}
                <div>
                  <label className="block text-sm font-bold text-[#0d1b2a] mb-1.5">
                    Screenshot <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <div className="w-full px-4 py-5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-center text-sm text-gray-400 hover:border-[#009ee3]/40 transition-colors cursor-pointer">
                    Click to upload a screenshot (JPG, PNG)
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#009ee3] text-white font-extrabold text-sm hover:bg-[#007ec0] transition-all duration-150 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  <Send size={15} /> Submit Ticket
                </button>

                <p className="text-xs text-center text-gray-400">
                  Our support team will review your ticket and reply as soon as possible.
                </p>
              </form>
            )}
          </div>

          {/* Right: FAQ + Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-[#0d1b2a] mb-5">Frequently Asked Questions</h2>
              <FAQAccordion />
            </div>

            {/* Contact options */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-extrabold text-[#0d1b2a] mb-4 text-sm">Other Ways to Reach Us</h3>
              <div className="space-y-3">
                {[
                  { icon: Ticket, label: 'Support Tickets', desc: 'Best for order & product issues' },
                  { icon: Mail, label: 'Email Support', desc: 'General inquiries & questions' },
                  { icon: MessageSquare, label: 'Social Channels', desc: 'News & community updates' },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#009ee3]/25 transition-colors bg-gray-50">
                    <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-[#009ee3] flex-shrink-0">
                      <Icon size={17} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0d1b2a]">{label}</p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
