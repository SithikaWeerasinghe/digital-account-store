import { Bell, Menu, Search, User } from 'lucide-react';

export default function AdminHeader({ 
  onMenuClick 
}: { 
  onMenuClick: () => void 
}) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        
        <div className="hidden md:flex relative w-64 lg:w-96">
          <input
            type="text"
            placeholder="Search console..."
            className="w-full bg-slate-100/70 text-slate-800 placeholder-slate-400 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all focus:bg-white"
          />
          <Search size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 relative text-slate-500 hover:text-primary transition-colors bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:border-slate-300">
          <Bell size={18} />
          <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] rounded-full h-3.5 w-3.5 flex items-center justify-center font-black shadow-[0_0_8px_rgba(244,63,94,0.4)]">
            3
          </span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200/80 ml-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black tracking-wider uppercase text-slate-800 font-heading">Admin User</p>
            <p className="text-[9px] font-black tracking-widest text-amber-600 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded font-mono uppercase mt-0.5">Superadmin</p>
          </div>
          <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_4px_12px_rgba(0,158,227,0.05)]">
            <User size={14} />
          </div>
        </div>
      </div>
    </header>
  );
}
