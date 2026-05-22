import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { HeadphonesIcon, MessageSquare, ArrowRight } from 'lucide-react';

export default function HelpCTA() {
  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0d1b2a] via-[#0a2540] to-[#0d1b2a] rounded-3xl p-8 sm:p-12 text-center">

          {/* Background decoration */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#009ee3]/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-[#ffd700]/10 rounded-full pointer-events-none" />

          <div className="relative z-10">
            {/* Icon */}
            <div className="w-16 h-16 bg-[#009ee3]/15 border border-[#009ee3]/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <HeadphonesIcon size={28} className="text-[#009ee3]" />
            </div>

            {/* Content */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
              Need help before ordering?
            </h2>
            <p className="text-gray-400 text-base max-w-lg mx-auto mb-8 leading-relaxed">
              Our support team is ready to help with product questions, order issues, and replacements.
              We respond quickly.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={ROUTES.SUPPORT}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#009ee3] text-white font-bold text-sm hover:bg-[#007ec0] transition-all duration-150 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <MessageSquare size={16} /> Open Support Ticket
              </Link>
              <Link
                href={ROUTES.PRODUCTS}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all duration-150"
              >
                Browse Products <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
