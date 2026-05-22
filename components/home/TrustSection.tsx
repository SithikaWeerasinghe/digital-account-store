import { Zap, Shield, Users, CheckCircle } from 'lucide-react';

const benefits = [
  {
    icon: Zap,
    title: 'Instant Delivery',
    description: 'Credentials and licenses are instantly sent to your email after verification. Zero delays.',
    color: 'bg-blue-50 text-[#009ee3] border border-blue-100/50',
    glowClass: 'glow-cyan-hover',
  },
  {
    icon: Shield,
    title: 'Secure Checkout',
    description: 'All payments are routed through military-grade encrypted processing networks to keep data safe.',
    color: 'bg-green-50 text-green-600 border border-green-100/50',
    glowClass: 'glow-green-hover',
  },
  {
    icon: Users,
    title: 'Real Support',
    description: 'A dedicated team is online to solve order inquiries, credentials setup, or refund questions.',
    color: 'bg-purple-50 text-purple-600 border border-purple-100/50',
    glowClass: 'glow-violet-hover',
  },
  {
    icon: CheckCircle,
    title: 'Verified Stock',
    description: 'Every product undergoes rigorous validation checks prior to listing to guarantee stability.',
    color: 'bg-amber-50 text-amber-600 border border-amber-100/50',
    glowClass: 'glow-gold-hover',
  },
];

export default function TrustSection() {
  return (
    <section className="py-20 bg-white relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-[#009ee3]/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-900 tracking-tight">
            Fast, Safe & <span className="text-[#009ee3] font-black">Secure Shopping</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Apex Digital is designed to provide the fastest and most secure checkout for digital goods.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map(({ icon: Icon, title, description, color, glowClass }) => (
            <div 
              key={title} 
              className={`group p-8 rounded-2xl bg-gray-50 border border-gray-100/80 transition-all duration-300 hover:bg-white hover:border-gray-200 hover:-translate-y-1.5 ${glowClass}`}
            >
              {/* Icon Container */}
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-5 group-hover:scale-105 transition-all duration-300`}>
                <Icon size={22} />
              </div>
              
              <h3 className="font-bold text-gray-900 text-base mb-3 group-hover:text-[#009ee3] transition-colors">
                {title}
              </h3>
              
              <p className="text-xs text-gray-500 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
