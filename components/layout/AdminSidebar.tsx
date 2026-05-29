"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Ticket, Star, LogOut, X } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import ApexFledLogo from '@/components/ui/ApexFledLogo';

export default function AdminSidebar({ 
  isOpen, 
  setIsOpen 
}: { 
  isOpen: boolean; 
  setIsOpen: (open: boolean) => void; 
}) {
  const pathname = usePathname();

  const navItems = [
    { href: ROUTES.ADMIN.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { href: ROUTES.ADMIN.PRODUCTS, label: 'Products', icon: Package },
    { href: ROUTES.ADMIN.ORDERS, label: 'Orders', icon: ShoppingCart },
    { href: ROUTES.ADMIN.TICKETS, label: 'Tickets', icon: Ticket },
    { href: ROUTES.ADMIN.REVIEWS, label: 'Reviews', icon: Star },
  ];

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 w-64 bg-white/90 backdrop-blur-2xl border-r border-slate-200/80 h-screen flex flex-col z-40 transition-transform duration-300 md:static md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/80 relative">
        <Link href={ROUTES.ADMIN.DASHBOARD} className="flex items-center gap-2 text-lg font-black tracking-widest uppercase font-heading text-slate-800">
          <div className="drop-shadow-[0_0_6px_rgba(59,130,246,0.4)]">
            <ApexFledLogo size={26} id="sidebar" />
          </div>
          APEX<span className="text-primary font-bold">FLED</span>
        </Link>
        <button 
          className="md:hidden p-1.5 text-slate-500 hover:text-slate-800 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
          onClick={() => setIsOpen(false)}
          aria-label="Close sidebar"
        >
          <X size={16} />
        </button>
        {/* Glow indicator at bottom of border */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#009ee3] to-transparent opacity-20"></div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== ROUTES.ADMIN.DASHBOARD && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black font-heading tracking-widest uppercase transition-all duration-200 relative group overflow-hidden border",
                isActive 
                  ? "bg-[#009ee3]/10 border-[#009ee3]/20 text-[#009ee3] shadow-[0_4px_12px_rgba(0,158,227,0.05)]" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent"
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-primary rounded-full shadow-[0_0_8px_#009ee3]" />
              )}
              <Icon size={16} className={cn(
                "transition-transform group-hover:scale-110",
                isActive ? "text-primary drop-shadow-[0_0_2px_rgba(0,158,227,0.3)]" : "text-slate-400 group-hover:text-slate-700"
              )} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200/80 relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <button className="flex items-center justify-center gap-2.5 px-4 py-3 w-full rounded-xl text-xs font-black font-heading tracking-widest uppercase text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-100 hover:bg-rose-100/50 hover:border-rose-200 transition-all duration-200 cursor-pointer">
          <LogOut size={15} />
          Logout System
        </button>
      </div>
    </aside>
  );
}
