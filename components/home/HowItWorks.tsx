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
    color: 'text-primary'
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
    color: 'text-primary'
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,158,227,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,158,227,0.015)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title telemetry */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-sm border border-border bg-slate-100 font-mono text-xs font-black tracking-widest text-text-secondary uppercase">
            <HelpCircle size={10} className="text-primary animate-pulse" />
            DEPLOYMENT PIPELINE :: STANDARD DRILL
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
            DEPLOYMENT <span className="text-primary drop-shadow-[0_0_12px_rgba(0,158,227,0.2)]">PROTOCOL</span>
          </h2>
          <p className="text-sm font-mono text-text-secondary tracking-widest uppercase max-w-xl mx-auto">
            SYSTEMATIC LOGISTICS PIPELINE SECURING ACQUISITION IN LESS THAN 90 SECONDS
          </p>
          <div className="w-16 h-[2px] bg-primary mx-auto mt-6 shadow-[0_0_10px_rgba(0,158,227,0.4)]"></div>
        </div>

        {/* Phase steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting digital timeline border for large screens */}
          <div className="hidden lg:block absolute top-[44px] left-[12%] right-[12%] h-[1px] bg-border z-0">
            <div className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_8px_#009ee3] w-1/4 animate-[techPipeline_4s_linear_infinite]"></div>
          </div>

          {steps.map(({ step, title, subtitle, description, icon: Icon, color }) => (
            <div 
              key={step} 
              className="relative z-10 flex flex-col items-center text-center group bg-card border border-border p-6 rounded-sm cyber-corners shadow-sm hover:border-primary/40 transition-colors hover:shadow-md"
            >
              {/* Step indicator circle with icon */}
              <div className="w-14 h-14 bg-slate-50 border border-border rounded-sm flex items-center justify-center text-slate-700 mb-6 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(0,158,227,0.15)] transition-all duration-300 relative">
                <Icon size={18} className={`${color} group-hover:scale-110 transition-transform`} />
                <span className="absolute -bottom-2 -right-2 bg-primary border border-primary-hover px-1.5 py-0.5 rounded-sm font-mono text-xs font-black text-white">
                  P-{step}
                </span>
              </div>

              {/* Title & subtitle code */}
              <span className="text-xs font-mono font-bold text-slate-400 tracking-widest uppercase mb-1 block">
                {subtitle}
              </span>
              <h3 className="text-base font-extrabold font-heading uppercase tracking-wider text-text-primary mb-3 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-medium">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes techPipeline {
          0% { transform: translateX(-100%) scaleX(0); }
          50% { transform: translateX(150%) scaleX(1.5); }
          100% { transform: translateX(400%) scaleX(0); }
        }
      `}</style>
    </section>
  );
}
