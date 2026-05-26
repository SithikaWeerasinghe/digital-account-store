import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType; 
  trend?: { value: number; isPositive: boolean } 
}) {
  // Generate sparkline points based on the title to represent a visual trend line
  const getSparklinePoints = () => {
    switch (title) {
      case "Total Revenue":
        return "10,35 25,25 40,30 55,18 70,22 85,12 100,5";
      case "Total Orders":
        return "10,30 25,28 40,15 55,20 70,12 85,14 100,8";
      case "Active Tickets":
        return "10,8 25,12 40,20 55,25 70,22 85,28 100,32"; // Downward/growing tickets path
      case "New Customers":
      default:
        return "10,32 25,24 40,28 55,15 70,18 85,8 100,6";
    }
  };

  const isPositive = trend?.isPositive ?? true;
  const strokeColor = isPositive ? "#22C55E" : "#EF4444";

  // Color theme mapping for the card icons
  const getIconTheme = () => {
    switch (title) {
      case "Total Revenue":
        return {
          bg: "bg-[#009ee3]/10 border-[#009ee3]/20 text-[#009ee3]",
          glow: "shadow-[0_4px_12px_rgba(0,158,227,0.05)]"
        };
      case "Total Orders":
        return {
          bg: "bg-[#fff159]/15 border-[#fff159]/30 text-amber-600",
          glow: "shadow-[0_4px_12px_rgba(255,241,89,0.05)]"
        };
      case "Active Tickets":
        return {
          bg: "bg-rose-500/10 border-rose-500/20 text-rose-500",
          glow: "shadow-[0_4px_12px_rgba(244,63,94,0.05)]"
        };
      case "New Customers":
      default:
        return {
          bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600",
          glow: "shadow-[0_4px_12px_rgba(52,211,153,0.05)]"
        };
    }
  };

  const theme = getIconTheme();

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-primary/20 hover:shadow-[0_8px_30px_rgba(0,158,227,0.05)] hover:-translate-y-[1px] transition-all duration-300 relative overflow-hidden group shadow-sm">
      {/* Glow highlight inside card */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#009ee3]/3 rounded-full blur-2xl group-hover:bg-[#009ee3]/6 transition-all duration-300"></div>

      <div className="flex justify-between items-start z-10 relative">
        <div className="space-y-2">
          <p className="text-slate-400 text-xs font-black tracking-widest uppercase font-mono">{title}</p>
          <h3 className="text-3xl font-black text-slate-800 font-heading tracking-wide mt-1">{value}</h3>
          
          {trend && (
            <div className="flex items-center gap-1 text-[11px] font-black tracking-wider uppercase font-mono mt-3">
              <span className={`flex items-center gap-0.5 px-2 py-0.5 rounded-lg ${
                isPositive ? 'text-emerald-650 bg-emerald-50 border border-emerald-200/50' : 'text-rose-650 bg-rose-50 border border-rose-200/50'
              }`}>
                {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-slate-450 pl-1">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 ${theme.bg} ${theme.glow}`}>
          <Icon size={20} className="stroke-[2.5]" />
        </div>
      </div>

      {/* Mini Trend Sparkline embedded at the bottom of the card */}
      <div className="absolute bottom-0 left-0 right-0 h-10 w-full opacity-20 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 110 40" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`sparkline-grad-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.15" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Fill Area under the Sparkline */}
          <path
            d={`M 10,40 L ${getSparklinePoints()} L 100,40 Z`}
            fill={`url(#sparkline-grad-${title.replace(/\s+/g, '')})`}
          />
          {/* Sparkline Path */}
          <path
            d={`M ${getSparklinePoints()}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
