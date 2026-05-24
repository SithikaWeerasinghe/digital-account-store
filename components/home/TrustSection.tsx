'use client';

import { Zap, Shield, Users, CheckCircle, Database } from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: 'COVERT ENCRYPTION',
    statName: 'SECURE_TUNNEL',
    statValue: 'AES_256_ACTIVE',
    description: 'All network transactions are routed through fully encrypted gateways with tokenized authorization protocols, keeping billing logs safe.',
    percentage: '100% Secure',
    color: 'text-primary'
  },
  {
    icon: Zap,
    title: 'ULTRA LATENCY DROP',
    statName: 'DROP_TIME',
    statValue: '1.2s_AVERAGE',
    description: 'Bypass all delivery waiting times. Keys and file downloads are decrypted and dropped directly to your client terminal and inbox instantly.',
    percentage: 'Instant Drop',
    color: 'text-primary'
  },
  {
    icon: Users,
    title: 'LIVE LOBBY COMMS',
    statName: 'AGENT_PING',
    statValue: '14min_RESPONSE',
    description: 'Connect immediately to technical alignment team logs. Get detailed setup help, optimization support, and key decryption assistance.',
    percentage: '24/7 Online',
    color: 'text-primary'
  },
  {
    icon: CheckCircle,
    title: 'INTEGRITY ASSURED',
    statName: 'KEY_CHECK',
    statValue: '0_VALIDATION_ERR',
    description: 'Every software license key and overlay asset is pre-verified on our sandbox nodes before list activation to ensure full system compliance.',
    percentage: '100% Verified',
    color: 'text-emerald-500'
  },
];

export default function TrustSection() {
  return (
    <section className="py-24 bg-secondary-background border-y border-border relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,158,227,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(0,158,227,0.012)_1px,transparent_1px)] bg-[size:25px_25px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-sm border border-border bg-slate-100 font-mono text-xs font-black tracking-widest text-text-secondary uppercase">
            <Database size={10} className="text-primary animate-pulse" />
            DIAGNOSTICS PROTOCOL :: SECURE CORE INTEGRITY
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
            SYSTEM DIAGNOSTIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 drop-shadow-[0_0_10px_rgba(0,158,227,0.2)]">INTEL</span>
          </h2>
          <p className="text-sm font-mono text-text-secondary tracking-widest uppercase max-w-xl mx-auto">
            OPERATING PARAMETERS DESIGNED TO ENSURE PRECISE AND SECURE DIGITAL TRANSACTIONS
          </p>
          <div className="w-16 h-[2px] bg-primary mx-auto mt-6 shadow-[0_0_10px_rgba(0,158,227,0.4)]"></div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map(({ icon: Icon, title, statName, statValue, description, percentage, color }) => (
            <div 
              key={title} 
              className="group relative p-6 rounded-sm bg-card border border-border hover:border-primary/45 transition-all duration-300 flex flex-col justify-between cyber-corners shadow-sm hover:shadow-md"
            >
              <div className="relative z-10">
                {/* Tech icon wrap */}
                <div className="w-12 h-12 rounded-sm bg-slate-50 border border-border flex items-center justify-center mb-6 group-hover:scale-105 group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(0,158,227,0.15)] transition-all duration-300">
                  <Icon size={20} className={`${color} transition-colors`} />
                </div>
                
                {/* Title */}
                <h3 className="text-base font-extrabold font-heading tracking-wider uppercase text-text-primary mb-3 group-hover:text-primary transition-colors">
                  {title}
                </h3>
                
                {/* Description */}
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-medium mb-6">
                  {description}
                </p>
              </div>

              {/* Dynamic telemetry footer info */}
              <div className="border-t border-slate-100 pt-4 mt-auto font-mono text-xs font-bold">
                <div className="flex justify-between items-center text-text-secondary/60 mb-1.5">
                  <span>{statName}</span>
                  <span className="text-emerald-600">{statValue}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary/40">INTEGRITY_INDEX:</span>
                  <span className="text-text-secondary/80">{percentage}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
