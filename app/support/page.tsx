'use client';

import { useState } from 'react';
import { faqs } from '@/data/faqs';
import {
  ChevronDown, ChevronUp, Send, Ticket,
  Mail, MessageSquare, Check, AlertCircle
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
    color: 'bg-blue-50 text-[#009ee3] border-blue-100',
  },
  {
    icon: Mail,
    title: 'Email Support',
    desc: 'Best for detailed questions and business inquiries.',
    detail: 'Send us a message and expect a reply within 24 hours.',
    color: 'bg-purple-50 text-purple-600 border-purple-100',
  },
  {
    icon: MessageSquare,
    title: 'Community / Social',
    desc: 'Best for quick updates and announcements.',
    detail: 'Follow our social channels for news and community discussions.',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
];

function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-[#009ee3]/30 transition-colors">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#009ee3]"
          >
            <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
            {open === i
              ? <ChevronUp size={18} className="text-[#009ee3] flex-shrink-0" />
              : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
            }
          </button>
          {open === i && (
            <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
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
    `w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#009ee3]/30 focus:border-[#009ee3] transition-all ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#009ee3] to-[#006fa8] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">How Can We Help?</h1>
          <p className="text-white/80 max-w-xl mx-auto text-base">
            Need help with an order, payment, delivery, or product issue? Submit a ticket and our support team will assist you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {CONTACT_OPTIONS.map(({ icon: Icon, title, desc, detail, color }) => (
            <div key={title} className={`bg-white rounded-2xl border p-6 hover:shadow-md transition-all duration-200 ${color.split(' ').pop()}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${color}`}>
                <Icon size={22} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500 mb-2">{desc}</p>
              <p className="text-xs text-gray-400">{detail}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Support Ticket Form */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-[#009ee3] to-[#006fa8] px-6 py-5">
              <h2 className="text-xl font-bold text-white">Submit a Support Ticket</h2>
              <p className="text-white/75 text-sm mt-1">
                Fill in the details below and we&apos;ll respond as soon as possible.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={30} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Ticket Submitted!</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
                  Your ticket has been submitted successfully. Our support team will review it and respond as soon as possible.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', orderId: '', issueType: '', subject: '', message: '' }); }}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-[#009ee3] text-white text-sm font-semibold hover:bg-[#008cc9] transition-colors"
                >
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Smith"
                    className={inputClass('name')}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@email.com"
                    className={inputClass('email')}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.email}</p>}
                </div>

                {/* Order ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Order ID <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    type="text"
                    value={form.orderId}
                    onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                    placeholder="ORD-12345"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#009ee3]/30 focus:border-[#009ee3] transition-all"
                  />
                </div>

                {/* Issue Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Issue Type *</label>
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
                  {errors.issueType && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.issueType}</p>}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject *</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Brief summary of the issue"
                    className={inputClass('subject')}
                  />
                  {errors.subject && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Please describe your issue in detail. Include any relevant order information."
                    className={`${inputClass('message')} resize-none`}
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.message}</p>}
                </div>

                {/* Screenshot (placeholder) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Screenshot <span className="text-gray-400 font-normal">(optional)</span></label>
                  <div className="w-full px-4 py-6 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-center text-sm text-gray-400 hover:border-[#009ee3]/40 transition-colors cursor-pointer">
                    Click to upload or drag and drop a screenshot (JPG, PNG)
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#009ee3] text-white font-bold text-base hover:bg-[#008cc9] transition-all duration-150 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  <Send size={17} /> Submit Ticket
                </button>
              </form>
            )}
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <FAQAccordion />
          </div>
        </div>
      </div>
    </div>
  );
}
