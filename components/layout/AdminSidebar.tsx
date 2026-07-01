"use client";

import { useState, useEffect } from 'react';
import { fetchAdminTickets, fetchAdminReviews } from '@/lib/api';
import { Review } from '@/types/review';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Archive, Ticket, Star, LogOut, X, Globe, Tag, Megaphone, CreditCard, FolderTree } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import ApexFledLogo from '@/components/ui/ApexFledLogo';
import { signOutAdmin } from '@/lib/adminAuth';
// ApexFled temporary admin tab visibility change — restore by setting the flag
// to true in lib/adminNav.ts. Controls which tabs appear in the sidebar.
import {
  SHOW_DASHBOARD_TAB,
  SHOW_CATEGORIES_TAB,
  SHOW_PRODUCTS_TAB,
  SHOW_ORDERS_TAB,
  SHOW_INVENTORY_TAB,
  SHOW_PAYMENT_METHODS_TAB,
  SHOW_COUPONS_TAB,
  SHOW_PROMOS_TAB,
  SHOW_TICKETS_TAB,
  SHOW_REVIEWS_TAB,
} from '@/lib/adminNav';

export default function AdminSidebar({
  isOpen,
  setIsOpen
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [openTicketsCount, setOpenTicketsCount] = useState<number>(0);
  const [pendingReviewsCount, setPendingReviewsCount] = useState<number>(0);

  useEffect(() => {
    let active = true;
    const loadCounts = async () => {
      try {
        const tickets = await fetchAdminTickets();
        if (!active) return;

        // If currently viewing the tickets page, count is 0 and we update viewed timestamp
        if (pathname === ROUTES.ADMIN.TICKETS) {
          localStorage.setItem('admin_tickets_last_viewed', new Date().toISOString());
          setOpenTicketsCount(0);
        } else {
          const lastViewed = localStorage.getItem('admin_tickets_last_viewed');
          if (lastViewed) {
            const lastViewedDate = new Date(lastViewed);
            const count = tickets.filter(
              t => t.status === 'open' && new Date(t.createdAt) > lastViewedDate
            ).length;
            setOpenTicketsCount(count);
          } else {
            const count = tickets.filter(t => t.status === 'open').length;
            setOpenTicketsCount(count);
          }
        }
      } catch (err) {
        console.error('Failed to load tickets count for sidebar:', err);
      }

      try {
        const reviews = await fetchAdminReviews();
        if (!active) return;

        // If currently viewing the reviews page, count is 0 and we update viewed timestamp
        if (pathname === ROUTES.ADMIN.REVIEWS) {
          localStorage.setItem('admin_reviews_last_viewed', new Date().toISOString());
          setPendingReviewsCount(0);
        } else {
          const lastViewed = localStorage.getItem('admin_reviews_last_viewed');
          if (lastViewed) {
            const lastViewedDate = new Date(lastViewed);
            const count = reviews.filter(
              (r: Review) => !r.isApproved && new Date(r.createdAt) > lastViewedDate
            ).length;
            setPendingReviewsCount(count);
          } else {
            const count = reviews.filter((r: Review) => !r.isApproved).length;
            setPendingReviewsCount(count);
          }
        }
      } catch (err) {
        console.error('Failed to load reviews count for sidebar:', err);
      }
    };
    
    loadCounts();
    
    // Poll every 30 seconds
    const interval = setInterval(loadCounts, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [pathname]);

  // ApexFled temporary admin tab visibility change — hidden tabs are filtered
  // out via the flags in lib/adminNav.ts. Restore by setting a flag to true.
  const navItems = [
    { href: ROUTES.ADMIN.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, visible: SHOW_DASHBOARD_TAB },
    { href: ROUTES.ADMIN.PRODUCTS, label: 'Products', icon: Package, visible: SHOW_PRODUCTS_TAB },
    { href: ROUTES.ADMIN.CATEGORIES, label: 'Categories', icon: FolderTree, visible: SHOW_CATEGORIES_TAB },
    { href: ROUTES.ADMIN.ORDERS, label: 'Orders', icon: ShoppingCart, visible: SHOW_ORDERS_TAB },
    { href: ROUTES.ADMIN.INVENTORY, label: 'Inventory', icon: Archive, visible: SHOW_INVENTORY_TAB },
    { href: ROUTES.ADMIN.PAYMENT_METHODS, label: 'Payment Methods', icon: CreditCard, visible: SHOW_PAYMENT_METHODS_TAB },
    { href: ROUTES.ADMIN.DISCOUNTS, label: 'Coupons', icon: Tag, visible: SHOW_COUPONS_TAB },
    { href: ROUTES.ADMIN.PROMOS, label: 'Promos', icon: Megaphone, visible: SHOW_PROMOS_TAB },
    { href: ROUTES.ADMIN.TICKETS, label: 'Tickets', icon: Ticket, visible: SHOW_TICKETS_TAB },
    { href: ROUTES.ADMIN.REVIEWS, label: 'Reviews', icon: Star, visible: SHOW_REVIEWS_TAB },
  ].filter((item) => item.visible);

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
              <span>{item.label}</span>
              {item.label === 'Tickets' && openTicketsCount > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-[10px] font-black font-sans px-2 py-0.5 rounded-full flex items-center justify-center min-w-[20px] h-5 shadow-[0_0_10px_rgba(244,63,94,0.45)]">
                  {openTicketsCount}
                </span>
              )}
              {item.label === 'Reviews' && pendingReviewsCount > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-[10px] font-black font-sans px-2 py-0.5 rounded-full flex items-center justify-center min-w-[20px] h-5 shadow-[0_0_10px_rgba(244,63,94,0.45)]">
                  {pendingReviewsCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200/80 relative space-y-3">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center justify-center gap-2.5 px-4 py-3 w-full rounded-xl text-xs font-black font-heading tracking-widest uppercase text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200"
        >
          <Globe size={15} />
          View Store
        </Link>
        <button
          onClick={async () => {
            setIsLoggingOut(true);
            try {
              await signOutAdmin();
              router.push('/admin/login');
            } catch (error) {
              console.error('Logout error:', error);
              router.push('/admin/login');
            }
          }}
          disabled={isLoggingOut}
          className="flex items-center justify-center gap-2.5 px-4 py-3 w-full rounded-xl text-xs font-black font-heading tracking-widest uppercase text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-100 hover:bg-rose-100/50 hover:border-rose-200 transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          <LogOut size={15} />
          {isLoggingOut ? 'Logging out...' : 'Logout System'}
        </button>
      </div>
    </aside>
  );
}
