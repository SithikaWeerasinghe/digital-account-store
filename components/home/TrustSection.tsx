import { Zap, Shield, Users, CheckCircle } from 'lucide-react';

const benefits = [
  {
    icon: Zap,
    title: 'Instant Delivery',
    description: 'Your purchase is delivered to your email within seconds of payment confirmation. No waiting, no delays.',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'All transactions are processed through encrypted, secure payment gateways. Your data stays protected.',
  },
  {
    icon: Users,
    title: 'Real Support',
    description: 'A dedicated support team is ready to assist you with any order issue, delivery concern, or product question.',
  },
  {
    icon: CheckCircle,
    title: 'Verified Quality',
    description: 'Every product listed in our store is verified before publication to ensure it meets quality standards.',
  },
];

export default function TrustSection() {
  return (
    <section className="py-24 bg-secondary border-y border-border relative">
      {/* Subtle overlay texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider text-white mb-4">
            Built for <span className="text-accent drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">Gamers</span> & Pros
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-[0_0_10px_rgba(139,92,246,0.6)] mb-4"></div>
          <p className="text-text-secondary max-w-xl mx-auto tracking-wide">
            We built Apex Digital around four principles that matter most to our customers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div key={title} className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-[#1A1A24] border border-border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all duration-300">
                  <Icon size={26} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold font-[family-name:var(--font-heading)] tracking-widest uppercase text-white mb-3 group-hover:text-primary transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
