import { Zap, Shield, Users, CheckCircle } from 'lucide-react';

const benefits = [
  {
    icon: Zap,
    title: 'Instant Digital Delivery',
    description: 'Your purchase is delivered to your email within seconds of payment confirmation. No waiting, no delays.',
    color: 'bg-blue-100 text-[#009ee3]',
  },
  {
    icon: Shield,
    title: 'Secure Payment Process',
    description: 'All transactions are processed through encrypted, secure payment gateways. Your data stays protected.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Users,
    title: 'Real Support Team',
    description: 'A dedicated support team is ready to assist you with any order issue, delivery concern, or product question.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: CheckCircle,
    title: 'Quality Checked Products',
    description: 'Every product listed in our store is verified before publication to ensure it meets quality standards.',
    color: 'bg-amber-100 text-amber-600',
  },
];

export default function TrustSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Built for Fast, Safe, and Simple Digital Shopping
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            We built Apex Digital around four principles that matter most to our customers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map(({ icon: Icon, title, description, color }) => (
            <div key={title} className="group p-6 rounded-2xl border border-gray-100 hover:border-[#009ee3]/30 hover:shadow-md transition-all duration-200 bg-white">
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <Icon size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
