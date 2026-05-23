'use client';

import { Terminal, Shield, Cpu, HelpCircle, Activity } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'INTEL PREPARATION',
    subtitle: 'LOADOUT CHOSEN',
    description: 'Browse our operational database and choose the stream package, overlay interface, or speed optimization boosters that fits your system config.',
    icon: Cpu,
    color: 'text-primary'
  },
  {
    step: '02',
    title: 'ACCESS DECRYPTION',
    subtitle: 'SECURE HANDSHAKE',
    description: 'Complete secure validation protocol. All transactions are routed through encrypted gateways with instantaneous verification checks.',
    icon: Shield,
    color: 'text-accent'
  },
  {
    step: '03',
    title: 'TACTICAL DELIVERY',
    subtitle: 'AIRDROP ACQUIRED',
    description: 'Our automated network releases instant access key hashes and download coordinate links to your secure mailbox in seconds.',
    icon: Terminal,
    color: 'text-emerald-500'
  },
  {
    step: '04',
    title: 'FIRE SUPPORT',
    subtitle: 'COMM PROTOCOL',
    description: 'Establish live contact with tactical assistance agents via our 24/7 ticketing mainframe for immediate technical alignment.',
    icon: Activity,
    color: 'text-[#00F0FF]'
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-[#0A0B10] relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.015)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title telemetry */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-sm border border-[#25253A] bg-[#111219] font-mono text-[9px] font-black tracking-widest text-[#A1A1AA]/50 uppercase">
            <HelpCircle size={10} className="text-primary animate-pulse" />
            DEPLOYMENT PIPELINE :: STANDARD DRILL
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-[family-name:var(--font-heading)] uppercase tracking-wider text-white mb-4">
            DEPLOYMENT <span className="text-primary drop-shadow-[0_0_12px_rgba(139,92,246,0.4)]">PROTOCOL</span>
          </h2>
          <p className="text-xs font-mono text-text-secondary tracking-widest uppercase max-w-xl mx-auto">
            SYSTEMATIC LOGISTICS PIPELINE SECURING ACQUISITION IN LESS THAN 90 SECONDS
          </p>
          <div className="w-16 h-[2px] bg-primary mx-auto mt-6 shadow-[0_0_10px_rgba(139,92,246,0.6)]"></div>
        </div>

        {/* Phase steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting digital timeline border for large screens */}
          <div className="hidden lg:block absolute top-[44px] left-[12%] right-[12%] h-[1px] bg-[#25253A] z-0">
            <div className="absolute top-0 left-0 h-full bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6] w-1/4 animate-[techPipeline_4s_linear_infinite]"></div>
          </div>

          {steps.map(({ step, title, subtitle, description, icon: Icon, color }) => (
            <div 
              key={step} 
              className="relative z-10 flex flex-col items-center text-center group bg-[#11131E] border border-[#202230] p-6 rounded-sm cyber-corners shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-primary/40 transition-colors"
            >
              {/* Step indicator circle with icon */}
              <div className="w-14 h-14 bg-[#161826] border border-[#2D3048] rounded-sm flex items-center justify-center text-white mb-6 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(139,92,246,0.25)] transition-all duration-300 relative">
                <Icon size={18} className={`${color} group-hover:scale-110 transition-transform`} />
                <span className="absolute -bottom-2 -right-2 bg-primary border border-primary-hover px-1.5 py-0.5 rounded-sm font-mono text-[8px] font-black text-white">
                  P-{step}
                </span>
              </div>

              {/* Title & subtitle code */}
              <span className="text-[8px] font-mono font-bold text-white/30 tracking-widest uppercase mb-1 block">
                {subtitle}
              </span>
              <h3 className="text-xs font-black font-[family-name:var(--font-heading)] uppercase tracking-wider text-white mb-3 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-[11px] text-text-secondary leading-relaxed font-medium">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes techPipeline {
          0% { left: 0%; width: 0%; }
          50% { left: 25%; width: 50%; }
          100% { left: 100%; width: 0%; }
        }
      `}</style>
    </section>
  );
}
