import { ShoppingBag, CheckCircle, CreditCard, Zap } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: ShoppingBag,
    title: 'Choose Product',
    description: 'Browse our curated catalog and select the digital product that fits your needs and budget.',
    gradient: 'from-[#009ee3] to-[#0066cc]',
    soft: 'bg-blue-50 text-[#009ee3]',
  },
  {
    step: '02',
    icon: CreditCard,
    title: 'Place Order',
    description: 'Enter your delivery email and select your preferred payment method in seconds.',
    gradient: 'from-purple-500 to-purple-700',
    soft: 'bg-purple-50 text-purple-600',
  },
  {
    step: '03',
    icon: CheckCircle,
    title: 'Payment Confirmation',
    description: 'Your payment is verified through our secure encrypted checkout process.',
    gradient: 'from-emerald-500 to-emerald-700',
    soft: 'bg-emerald-50 text-emerald-600',
  },
  {
    step: '04',
    icon: Zap,
    title: 'Instant Delivery',
    description: 'Product details are delivered to your inbox within seconds of payment confirmation.',
    gradient: 'from-[#ffd700] to-[#e6a800]',
    soft: 'bg-yellow-50 text-yellow-600',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-12">
          <span className="apex-badge-blue mb-3 inline-flex">Simple Process</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d1b2a] mb-3 tracking-tight">
            How It Works
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            Getting your digital product is simple and takes just minutes from start to finish.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">

          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#009ee3] via-purple-400 via-emerald-400 to-[#ffd700] opacity-25" />

          {steps.map(({ step, icon: Icon, title, description, gradient, soft }) => (
            <div
              key={step}
              className="relative flex flex-col items-center text-center p-7 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              {/* Step number badge */}
              <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex flex-col items-center justify-center text-white shadow-lg mb-5 relative z-10`}>
                <span className="text-[10px] font-bold opacity-75 leading-none mb-0.5">{step}</span>
                <Icon size={22} />
              </div>

              <h3 className="font-bold text-[#0d1b2a] text-base mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
