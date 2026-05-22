import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { Tv, Bot, Gamepad2, Cpu, Briefcase, Gift, ShieldAlert, CheckCircle2 } from 'lucide-react';

const categories = [
  {
    name: 'Gaming Armory',
    description: 'Battle-tested gaming profiles, macro scripts, performance boosters, and game access keys.',
    icon: Gamepad2,
    query: 'Gaming',
    modCode: 'MOD-01',
    status: 'OPERATIONAL',
    bandwidth: 'Instant Drop',
    reliability: '99.9% Up',
    color: 'text-primary'
  },
  {
    name: 'Streaming Channels',
    description: 'Shared streaming access nodes, movie networks, and audio passes delivered to your email.',
    icon: Tv,
    query: 'Streaming',
    modCode: 'MOD-02',
    status: 'ACTIVE_NODE',
    bandwidth: 'Secure Drop',
    reliability: '100% Up time',
    color: 'text-accent'
  },
  {
    name: 'AI Synthetics',
    description: 'Neural generation tools, writing engines, and code assistants configured for priority access.',
    icon: Bot,
    query: 'AI Tools',
    modCode: 'MOD-03',
    status: 'DEPLOYED',
    bandwidth: 'Instant Key',
    reliability: '99.8% Sync',
    color: 'text-emerald-500'
  },
  {
    name: 'Tactical Software',
    description: 'Full utility software keys, virtual environment tools, and priority system enhancers.',
    icon: Cpu,
    query: 'Software',
    modCode: 'MOD-04',
    status: 'STANDBY',
    bandwidth: 'Immediate key',
    reliability: 'Verified Key',
    color: 'text-primary'
  },
  {
    name: 'Productivity Cores',
    description: 'Design suites, organizers, and development licenses for high-impact task pipelines.',
    icon: Briefcase,
    query: 'Productivity',
    modCode: 'MOD-05',
    status: 'OPERATIONAL',
    bandwidth: 'Auto Delivery',
    reliability: '100% Tested',
    color: 'text-[#00F0FF]'
  },
  {
    name: 'Secure Vouchers',
    description: 'Prepaid tokens, retail codes, and multi-platform digital cards sent as redeemable keys.',
    icon: Gift,
    query: 'Gift Cards',
    modCode: 'MOD-06',
    status: 'IN_STOCK',
    bandwidth: 'Instant drop',
    reliability: 'Valid Global',
    color: 'text-[#FF5500]'
  },
];

export default function CategorySection() {
  return (
    <section className="py-24 bg-[#0A0B10] relative overflow-hidden">
      {/* Background cyber grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header telemetry style */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-sm border border-[#25253A] bg-[#111219] font-mono text-[9px] font-black tracking-widest text-[#A1A1AA]/50 uppercase">
            <ShieldAlert size={10} className="text-primary animate-pulse" />
            OPERATIONAL DATA :: MODULE DIRECTORY
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-[family-name:var(--font-heading)] uppercase tracking-wider text-white mb-4">
            LOADOUT CONFIGURATOR
          </h2>
          <p className="text-xs font-mono text-text-secondary tracking-widest uppercase max-w-xl mx-auto">
            SELECT A SYSTEM COMPONENT MODULE TO DECRYPT SPECIFIC PRODUCT ACCESS INVENTORY
          </p>
          <div className="w-16 h-[2px] bg-primary mx-auto mt-6 shadow-[0_0_10px_rgba(139,92,246,0.6)]"></div>
        </div>

        {/* Loadout Config Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`${ROUTES.PRODUCTS}?category=${encodeURIComponent(cat.query)}`}
                className="mp-card group flex flex-col justify-between p-6 cursor-pointer relative overflow-hidden bg-[#11131E] border border-[#202230] cyber-corners"
              >
                {/* Tech corner markings inside card */}
                <div className="absolute top-3 right-3 font-mono text-[9px] font-black text-white/20 select-none">
                  {cat.modCode}
                </div>

                <div className="flex items-start gap-4 mb-8">
                  {/* Glowing Icon */}
                  <div className="w-12 h-12 rounded-sm bg-[#161826] border border-[#2A2D40] flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.25)] transition-all duration-300 relative z-10">
                    <Icon size={22} className={`${cat.color} group-hover:text-white transition-colors`} />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-sm font-black font-[family-name:var(--font-heading)] tracking-wider uppercase text-white mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed font-medium">
                      {cat.description}
                    </p>
                  </div>
                </div>

                {/* Simulated Telemetry Stats at Card Footer */}
                <div className="border-t border-[#1C1E2D] pt-4 mt-auto flex items-center justify-between font-mono text-[9px] text-[#A1A1AA]/50 font-bold">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-white/30 tracking-widest">TRANSMISSION</span>
                    <span className="text-white/80 uppercase">{cat.bandwidth}</span>
                  </div>
                  <div className="flex flex-col text-center">
                    <span className="text-[8px] text-white/30 tracking-widest">RELIABILITY</span>
                    <span className="text-white/80 uppercase">{cat.reliability}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[8px] text-white/30 tracking-widest">STATUS</span>
                    <span className="text-[#39FF14] bg-[#39FF14]/5 px-1.5 py-0.5 rounded-sm border border-[#39FF14]/20 uppercase">
                      {cat.status}
                    </span>
                  </div>
                </div>

                {/* Subtle laser background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
