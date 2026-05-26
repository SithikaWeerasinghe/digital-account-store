'use client';

import { useState } from 'react';
import { Bell, Menu, Search, User, LogOut } from 'lucide-react';

export default function AdminHeader({ 
  onMenuClick 
}: { 
  onMenuClick: () => void 
}) {
  const [profileOpen, setProfileOpen] = useState(false);

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
            className="w-full bg-slate-100/70 text-slate-800 placeholder-slate-400 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary/44 focus:border-primary/44 transition-all focus:bg-white"
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
        
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 pl-4 border-l border-slate-200/80 ml-2 cursor-pointer group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black tracking-wider uppercase text-slate-800 font-heading group-hover:text-primary transition-colors">Admin User</p>
              <p className="text-[9px] font-black tracking-widest text-amber-600 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded font-mono uppercase mt-0.5">Superadmin</p>
            </div>
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_4px_12px_rgba(0,158,227,0.05)] group-hover:bg-primary/20 transition-all duration-200">
              <User size={14} />
            </div>
          </button>

          {/* Profile Dropdown Popover */}
          {profileOpen && (
            <>
              {/* Backdrop clickable overlay */}
              <div 
                className="fixed inset-0 z-40 cursor-default" 
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2.5 w-60 bg-white border border-slate-200/80 rounded-2xl shadow-xl p-5 z-50 animate-fade-in-up origin-top-right">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3.5 mb-3.5">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/25">
                    <User size={18} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-black tracking-wider uppercase text-slate-800 font-heading">Admin User</h4>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">admin@example.com</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase py-1.5 px-2.5 bg-slate-50 border border-slate-150 rounded-lg">
                    <span className="text-slate-400">Role Status</span>
                    <span className="text-amber-600">Superadmin</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase py-1.5 px-2.5 bg-slate-50 border border-slate-150 rounded-lg">
                    <span className="text-slate-400">Security core</span>
                    <span className="text-emerald-500">Active</span>
                  </div>
                </div>

                <button 
                  className="flex items-center justify-center gap-2.5 px-4 py-2.5 w-full mt-4 rounded-xl text-xs font-black font-heading tracking-widest uppercase text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-100 hover:bg-rose-100/50 hover:border-rose-200 transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    setProfileOpen(false);
                    window.location.href = '/admin/login';
                  }}
                >
                  <LogOut size={13} />
                  Logout Session
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
