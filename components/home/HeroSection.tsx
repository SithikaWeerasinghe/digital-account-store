import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import {
  ArrowRight, Zap, Shield, Clock, CheckCircle,
  ShoppingBag, Package, CreditCard, Star
} from 'lucide-react';

export default function HeroSection() {
  const trustBadges = [
    { icon: Zap, label: 'Instant Delivery', sub: 'Seconds after payment' },
    { icon: Shield, label: 'Secure Checkout', sub: 'Encrypted & safe' },
    { icon: Clock, label: '24/7 Support', sub: 'Always available' },
    { icon: CheckCircle, label: 'Verified Stock', sub: 'Quality checked' },
  ];

  return (
    /* Yellow top section */
    <section className="bg-[#ffd700] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Large rounded hero card with blue gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0059a6] via-[#009ee3] to-[#00c4ff] shadow-2xl">

          {/* Background circles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[520px]">

            {/* Left: Content */}
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 w-fit bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-6">
                <Zap size={13} className="text-[#ffd700]" fill="#ffd700" />
                <span className="text-sm font-semibold text-white">Instant Digital Delivery</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.12] mb-5 tracking-tight">
                Premium Digital Products,{' '}
                <span className="text-[#ffd700]">Delivered Instantly.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8 max-w-lg">
                Buy trusted digital products, subscriptions, gaming items, and productivity tools
                with fast delivery and friendly support.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link href={ROUTES.PRODUCTS} className="apex-btn-yellow text-[#0d1b2a] font-bold rounded-xl px-7 py-3.5">
                  Browse Products <ArrowRight size={17} />
                </Link>
                <Link href={ROUTES.SUPPORT} className="apex-btn-ghost font-semibold rounded-xl px-7 py-3.5">
                  Contact Support
                </Link>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-2.5">
                {trustBadges.map(({ icon: Icon, label, sub }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-3.5 py-2.5"
                  >
                    <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold leading-tight">{label}</p>
                      <p className="text-white/60 text-[10px] leading-tight">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Premium dashboard visual */}
            <div className="hidden lg:flex items-center justify-center p-8 lg:p-12 relative">
              <div className="w-full max-w-sm space-y-3">

                {/* Central card */}
                <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#ffd700] rounded-xl flex items-center justify-center">
                      <ShoppingBag size={18} className="text-[#0d1b2a]" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Digital Products Store</p>
                      <p className="text-white/60 text-xs">Apex Digital Platform</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { n: '9+', l: 'Products' },
                      { n: '4.7★', l: 'Rating' },
                      { n: '100%', l: 'Digital' },
                    ].map(({ n, l }) => (
                      <div key={l} className="bg-white/10 rounded-xl py-2.5 px-1">
                        <p className="text-white font-extrabold text-base leading-none mb-0.5">{n}</p>
                        <p className="text-white/60 text-[10px]">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating cards */}
                <div className="grid grid-cols-2 gap-3">

                  {/* Order Confirmed */}
                  <div className="bg-white rounded-2xl p-3.5 shadow-xl apex-float">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <CheckCircle size={13} className="text-emerald-600" />
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700">Confirmed</span>
                    </div>
                    <p className="text-[#0d1b2a] font-bold text-xs leading-snug">Order Confirmed</p>
                    <p className="text-gray-400 text-[10px] mt-0.5">Processing delivery</p>
                  </div>

                  {/* Digital Access Ready */}
                  <div className="bg-white rounded-2xl p-3.5 shadow-xl apex-float-delay">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package size={13} className="text-[#009ee3]" />
                      </div>
                      <span className="text-[10px] font-semibold text-[#009ee3]">Ready</span>
                    </div>
                    <p className="text-[#0d1b2a] font-bold text-xs leading-snug">Access Ready</p>
                    <p className="text-gray-400 text-[10px] mt-0.5">Sent to email</p>
                  </div>

                  {/* Secure Payment */}
                  <div className="bg-white rounded-2xl p-3.5 shadow-xl apex-float-delay">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                        <CreditCard size={13} className="text-purple-600" />
                      </div>
                      <span className="text-[10px] font-semibold text-purple-700">Secure</span>
                    </div>
                    <p className="text-[#0d1b2a] font-bold text-xs leading-snug">Safe Payment</p>
                    <p className="text-gray-400 text-[10px] mt-0.5">Encrypted checkout</p>
                  </div>

                  {/* Top Rated */}
                  <div className="bg-white rounded-2xl p-3.5 shadow-xl apex-float">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Star size={13} className="text-yellow-500" fill="currentColor" />
                      </div>
                      <span className="text-[10px] font-semibold text-yellow-700">Top Rated</span>
                    </div>
                    <p className="text-[#0d1b2a] font-bold text-xs leading-snug">4.8 / 5 Stars</p>
                    <p className="text-gray-400 text-[10px] mt-0.5">Verified buyers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
