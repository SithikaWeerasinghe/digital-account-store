"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Ticket, Star, LogOut } from 'lucide-react';
import { ROUTES, APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: ROUTES.ADMIN.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { href: ROUTES.ADMIN.PRODUCTS, label: 'Products', icon: Package },
    { href: ROUTES.ADMIN.ORDERS, label: 'Orders', icon: ShoppingCart },
    { href: ROUTES.ADMIN.TICKETS, label: 'Tickets', icon: Ticket },
    { href: ROUTES.ADMIN.REVIEWS, label: 'Reviews', icon: Star },
  ];

  return (
    <aside className="w-64 bg-white border-r border-border h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href={ROUTES.ADMIN.DASHBOARD} className="text-lg font-bold text-primary">
          {APP_NAME} <span className="text-text-muted text-sm font-normal">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-text-secondary hover:bg-gray-100 hover:text-text-primary"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-danger hover:bg-red-50 transition-colors">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
