'use client';

import { Terminal, Zap, Shield, Key } from 'lucide-react';

const tickerEvents = [
  { type: 'drop', icon: Zap, label: 'SECURE_DROP', user: 'Ghost_x88', item: 'Vanguard FPS Latency Booster', stat: '+18% FPS Boost', color: 'text-primary' },
  { type: 'decrypt', icon: Key, label: 'DECRYPTED', user: 'Viper_Stryke', item: 'Apex Recoil Macro Profile', stat: 'Ping Match OK', color: 'text-primary' },
  { type: 'verify', icon: Shield, label: 'VERIFIED', user: 'Alpha_Stream', item: 'Glitch Stream Overlays Pack', stat: 'Key Deployed', color: 'text-emerald-500' },
  { type: 'drop', icon: Zap, label: 'SECURE_DROP', user: 'Neon_Rider', item: 'Discord Mod Bot Pro Key', stat: 'Active Node 12', color: 'text-primary' },
  { type: 'decrypt', icon: Key, label: 'DECRYPTED', user: 'Zealot_V', item: 'Warzone Combat Script', stat: '0ms Latency', color: 'text-primary' },
  { type: 'verify', icon: Shield, label: 'VERIFIED', user: 'Lobby_King', item: 'Premium VPN Access Node', stat: 'AES-256 OK', color: 'text-emerald-500' },
];

export default function KillFeedTicker() {
  // Triple the items to ensure seamless infinite scrolling without gaps
  const triplicatedEvents = [...tickerEvents, ...tickerEvents, ...tickerEvents];

  return (
    <div className="w-full bg-slate-100 border-y border-border py-3.5 overflow-hidden relative z-20 select-none">
      {/* Tactical scan pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,158,227,0.03)_1px,transparent_1px)] bg-[size:32px_100%] pointer-events-none"></div>
      
      {/* Left indicator tag */}
      <div className="absolute left-0 top-0 bottom-0 bg-slate-200 border-r border-border px-4 flex items-center gap-2 z-30 font-mono text-xs font-black text-text-secondary tracking-wider">
        <Terminal size={11} className="text-primary animate-pulse" />
        FEED: LIVE_DROP_LOGGER
      </div>

      <div className="flex w-max pl-[190px] animate-ticker">
        {triplicatedEvents.map((evt, idx) => {
          const Icon = evt.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 mx-12 font-mono text-sm font-bold whitespace-nowrap"
            >
              {/* Event Badge */}
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-white border border-border text-[11px] font-black tracking-widest uppercase ${evt.color}`}>
                <Icon size={10} className="animate-pulse" />
                {evt.label}
              </span>

              {/* User */}
              <span className="text-text-primary">{evt.user}</span>

              {/* Action symbol */}
              <span className="text-slate-400 font-light">&gt;&gt;</span>

              {/* Item details */}
              <span className="text-text-secondary font-medium">{evt.item}</span>

              {/* Latency/Telemetry data */}
              <span className="text-text-secondary/60 text-xs bg-white px-1.5 py-0.5 border border-border rounded-sm font-mono font-medium">
                [{evt.stat}]
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Right shadow fade overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-100 to-transparent pointer-events-none z-20"></div>
    </div>
  );
}
