import { Zap, Shield, Users, CheckCircle } from 'lucide-react';

const stats = [
  {
    number: '10,000+',
    label: 'Orders Delivered',
    description: 'Trusted by thousands of digital buyers across the globe.',
    icon: Zap,
  },
  {
    number: '4.9★',
    label: 'Average Rating',
    description: 'Consistently rated top-tier by verified customers.',
    icon: CheckCircle,
  },
  {
    number: '<30s',
    label: 'Delivery Speed',
    description: 'Products arrive in your inbox within seconds of payment.',
    icon: Shield,
  },
  {
    number: '24/7',
    label: 'Support Available',
    description: 'Our team is always ready to resolve any issue fast.',
    icon: Users,
  },
];

export default function TrustSection() {
  return (
    <section className="py-20 bg-[#0B0B12] relative">
      <div className="neon-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center mb-14">
          <span className="section-label mb-4 inline-flex">Why Choose Us</span>
          <h2
            className="text-3xl sm:text-4xl font-black uppercase text-white mt-4 mb-3 tracking-wide"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Built for Fast, Safe &amp; Simple Shopping
          </h2>
          <p className="text-[#A1A1AA] max-w-xl mx-auto text-sm">
            We built Apex Digital around four principles that matter most to our customers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ number, label, description, icon: Icon }) => (
            <div
              key={label}
              className="group p-6 rounded-xl bg-[#11111A] border border-[#25253A] hover:border-[#8B5CF6]/40 hover:bg-[#16161F] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(139,92,246,0.1)] transition-all duration-300 relative overflow-hidden text-center"
            >
              {/* Top glow on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon circle */}
              <div className="w-12 h-12 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#8B5CF6]/20 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all duration-300">
                <Icon size={22} className="text-[#8B5CF6]" />
              </div>

              {/* Stat number */}
              <div
                className="text-4xl font-black text-[#A855F7] mb-1 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.7)] transition-all duration-300"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                {number}
              </div>

              <div
                className="text-xs font-bold uppercase tracking-[0.15em] text-white mb-2"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                {label}
              </div>
              <p className="text-xs text-[#6B7280] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
