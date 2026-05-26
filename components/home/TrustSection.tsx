'use client';

import { Zap, Shield, Users, CheckCircle } from 'lucide-react';

const features = [
  {
    badge: 'P-01',
    icon: Shield,
    iconAnim: 'animate-shield-shine',
    title: 'Secure Checkout',
    description: 'All transactions are encrypted end-to-end with tokenized authorization. Your payment data stays safe at every step.',
    stat: '100% Secure',
    color: 'text-primary',
    iconBg: 'bg-primary/8 border-primary/20 group-hover:bg-primary/12 group-hover:border-primary/40 group-hover:shadow-[0_0_20px_rgba(0,158,227,0.15)]',
    borderHover: 'group-hover:border-primary/35 group-hover:shadow-[0_8px_30px_rgba(0,158,227,0.08)]',
  },
  {
    badge: 'P-02',
    icon: Zap,
    iconAnim: 'animate-zap-bolt',
    title: 'Instant Delivery',
    description: 'Receive your digital product details directly to your inbox moments after payment confirmation. No waiting.',
    stat: 'In Seconds',
    color: 'text-primary',
    iconBg: 'bg-primary/8 border-primary/20 group-hover:bg-primary/12 group-hover:border-primary/40 group-hover:shadow-[0_0_20px_rgba(0,158,227,0.15)]',
    borderHover: 'group-hover:border-primary/35 group-hover:shadow-[0_8px_30px_rgba(0,158,227,0.08)]',
  },
  {
    badge: 'P-03',
    icon: CheckCircle,
    iconAnim: 'animate-check-pop',
    title: 'Verified Products',
    description: 'Every product listing is pre-verified on our validation systems before going live. Zero tolerance for invalid keys.',
    stat: '100% Verified',
    color: 'text-emerald-500',
    iconBg: 'bg-emerald-50 border-emerald-100 group-hover:bg-emerald-100/60 group-hover:border-emerald-300/60 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.12)]',
    borderHover: 'group-hover:border-emerald-200 group-hover:shadow-[0_8px_30px_rgba(34,197,94,0.06)]',
  },
  {
    badge: 'P-04',
    icon: Users,
    iconAnim: 'animate-users-hug',
    title: 'Support Ticket System',
    description: 'Submit a support ticket any time and our team will respond with detailed help for setup, activation, and more.',
    stat: '24/7 Online',
    color: 'text-primary',
    iconBg: 'bg-primary/8 border-primary/20 group-hover:bg-primary/12 group-hover:border-primary/40 group-hover:shadow-[0_0_20px_rgba(0,158,227,0.15)]',
    borderHover: 'group-hover:border-primary/35 group-hover:shadow-[0_8px_30px_rgba(0,158,227,0.08)]',
  },
];

export default function TrustSection() {
  return (
    <section className="py-16 sm:py-20 bg-background border-y border-border relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,158,227,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(0,158,227,0.012)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-primary font-bold text-sm tracking-widest uppercase mb-3">Why Apex Digital</p>
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight mb-4">
            Built Around Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Trust</span>
          </h2>
          <p className="text-text-secondary text-base max-w-lg mx-auto leading-relaxed">
            Every feature of Apex Digital is designed to give you a fast, safe, and reliable experience.
          </p>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto mt-6" />
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ badge, icon: Icon, iconAnim, title, description, stat, color, iconBg, borderHover }) => (
            <div
              key={title}
              className={`group relative flex flex-col p-6 rounded-2xl bg-white border border-border ${borderHover} hover:-translate-y-1 transition-all duration-300 shadow-sm`}
            >
              {/* Badge label */}
              <span className="absolute top-4 right-4 text-[10px] font-bold text-text-secondary/30 font-mono">{badge}</span>

              {/* Animated Icon */}
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 transition-all duration-300 ${iconBg}`}>
                <Icon size={22} className={`${color} ${iconAnim}`} />
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-text-primary mb-2.5 group-hover:text-primary transition-colors duration-200">
                {title}
              </h3>

              {/* Description */}
              <p className="text-sm text-text-secondary leading-relaxed flex-grow mb-5">
                {description}
              </p>

              {/* Stat Footer */}
              <div className="border-t border-border pt-4">
                <span className={`text-sm font-bold ${color}`}>{stat}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
