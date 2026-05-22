import { Zap, Shield, HeadphonesIcon, CheckCircle } from 'lucide-react';

const benefits = [
  {
    icon: Zap,
    title: 'Fast Digital Delivery',
    description: 'Your purchase is delivered to your email within seconds of payment confirmation. No waiting, no delays ever.',
    gradient: 'from-[#009ee3] to-[#0066cc]',
    soft: 'bg-blue-50',
    iconColor: 'text-[#009ee3]',
  },
  {
    icon: Shield,
    title: 'Secure Checkout Ready',
    description: 'All transactions go through encrypted secure gateways. Your data and payment details stay 100% protected.',
    gradient: 'from-emerald-500 to-emerald-700',
    soft: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: HeadphonesIcon,
    title: 'Support Ticket System',
    description: 'A dedicated support team is ready to assist you with order issues, delivery concerns, or product questions.',
    gradient: 'from-purple-500 to-purple-700',
    soft: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: CheckCircle,
    title: 'Verified Stock Management',
    description: 'Every product is quality-checked before publication to ensure it works exactly as described in our store.',
    gradient: 'from-amber-400 to-orange-500',
    soft: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
];

export default function TrustSection() {
  return (
    <section className="py-16 sm:py-20 bg-[#f0f4f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* White rounded card wrapper */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12">

          {/* Header */}
          <div className="text-center mb-12">
            <span className="apex-badge-blue mb-3 inline-flex">Why Choose Us</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d1b2a] mb-3 tracking-tight">
              Built for Fast, Safe & Simple Digital Shopping
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-base">
              We built Apex Digital around four principles that matter most to our customers.
            </p>
          </div>

          {/* Benefits grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map(({ icon: Icon, title, description, soft, iconColor, gradient }) => (
              <div
                key={title}
                className="group flex flex-col items-start p-6 rounded-2xl border border-gray-100 hover:border-[#009ee3]/20 hover:shadow-md transition-all duration-200 bg-gray-50/50"
              >
                <div className={`w-13 h-13 w-12 h-12 rounded-2xl ${soft} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={24} className={iconColor} />
                </div>
                <h3 className="font-bold text-[#0d1b2a] mb-2 text-sm">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
