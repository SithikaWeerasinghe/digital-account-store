'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, Menu, User, LogOut, Pencil } from 'lucide-react';
import { signOutAdmin, getCurrentAuthUser } from '@/lib/adminAuth';
import { fetchAdminOrders, fetchAdminReviews, fetchAdminTickets } from '@/lib/api';

export default function AdminHeader({
  onMenuClick
}: {
  onMenuClick: () => void
}) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string>('admin@example.com');
  const [adminName, setAdminName] = useState<string>('Admin User');
  const [ordersCount, setOrdersCount] = useState<number>(0);
  const [reviewsCount, setReviewsCount] = useState<number>(0);
  const [ticketsCount, setTicketsCount] = useState<number>(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
        setIsEditingName(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function fetchAdminInfo() {
      try {
        const user = await getCurrentAuthUser();
        if (user && user.email) {
          setAdminEmail(user.email);
          
          if (typeof window !== 'undefined') {
            const savedName = localStorage.getItem(`admin_name_${user.email}`);
            if (savedName) {
              setAdminName(savedName);
              setIsEditingName(false);
            } else {
              const prefix = user.email.split('@')[0];
              if (prefix) {
                const capitalizedName = prefix
                  .split(/[._-]/)
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                setAdminName(capitalizedName);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching admin auth info:', error);
      }
    }
    fetchAdminInfo();
  }, []);

  const handleSaveName = () => {
    const trimmed = newName.trim();
    if (trimmed) {
      setAdminName(trimmed);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`admin_name_${adminEmail}`, trimmed);
      }
    } else {
      // Revert to email prefix default
      const prefix = adminEmail.split('@')[0];
      if (prefix) {
        const capitalizedName = prefix
          .split(/[._-]/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        setAdminName(capitalizedName);
        if (typeof window !== 'undefined') {
          localStorage.removeItem(`admin_name_${adminEmail}`);
        }
      }
    }
    setIsEditingName(false);
  };

  useEffect(() => {
    let active = true;
    async function loadNotifications() {
      try {
        const [orders, reviews, tickets] = await Promise.all([
          fetchAdminOrders().catch(() => []),
          fetchAdminReviews().catch(() => []),
          fetchAdminTickets().catch(() => [])
        ]);
        if (!active) return;

        // Pending orders: delivery_status is 'pending' or status is 'pending'
        const pendingOrders = orders.filter(o => o.delivery_status === 'pending' || o.status === 'pending').length;

        // Pending reviews: not approved yet
        const pendingReviews = reviews.filter(r => !r.isApproved).length;

        // Active tickets: open or in_progress
        const activeTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;

        setOrdersCount(pendingOrders);
        setReviewsCount(pendingReviews);
        setTicketsCount(activeTickets);
      } catch (error) {
        console.error('Failed to load notifications in header:', error);
      }
    }

    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const totalNotifications = ordersCount + reviewsCount + ticketsCount;

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
        

      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 relative text-slate-500 hover:text-primary transition-colors bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:border-slate-300"
          >
            <Bell size={18} />
            {totalNotifications > 0 && (
              <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] rounded-full h-3.5 w-3.5 flex items-center justify-center font-black shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                {totalNotifications}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Popover */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2.5 w-64 bg-white border border-slate-200/80 rounded-2xl shadow-xl p-5 z-50 animate-fade-in-up origin-top-right">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3.5">
                  <h4 className="text-xs font-black tracking-wider uppercase text-slate-800 font-heading">Notifications</h4>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Alerts</span>
                </div>

                <div className="space-y-2.5">
                  <Link 
                    href="/admin/orders" 
                    onClick={() => setNotificationsOpen(false)}
                    className="flex justify-between items-center text-[10px] font-mono font-bold uppercase py-2 px-3 bg-slate-50 border border-slate-150 rounded-lg hover:bg-slate-100 hover:border-slate-200 transition-colors"
                  >
                    <span className="text-slate-500">Orders</span>
                    <span className={ordersCount > 0 ? "text-primary font-black" : "text-slate-400"}>({ordersCount})</span>
                  </Link>

                  <Link 
                    href="/admin/reviews" 
                    onClick={() => setNotificationsOpen(false)}
                    className="flex justify-between items-center text-[10px] font-mono font-bold uppercase py-2 px-3 bg-slate-50 border border-slate-150 rounded-lg hover:bg-slate-100 hover:border-slate-200 transition-colors"
                  >
                    <span className="text-slate-500">Reviews</span>
                    <span className={reviewsCount > 0 ? "text-amber-600 font-black" : "text-slate-400"}>({reviewsCount})</span>
                  </Link>

                  <Link 
                    href="/admin/tickets" 
                    onClick={() => setNotificationsOpen(false)}
                    className="flex justify-between items-center text-[10px] font-mono font-bold uppercase py-2 px-3 bg-slate-50 border border-slate-150 rounded-lg hover:bg-slate-100 hover:border-slate-200 transition-colors"
                  >
                    <span className="text-slate-500">Tickets</span>
                    <span className={ticketsCount > 0 ? "text-rose-500 font-black" : "text-slate-400"}>({ticketsCount})</span>
                  </Link>
                </div>
              </div>
          )}
        </div>
        
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => {
              setProfileOpen(!profileOpen);
              setIsEditingName(false);
            }}
            className="flex items-center gap-3 pl-4 border-l border-slate-200/80 ml-2 cursor-pointer group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black tracking-wider uppercase text-slate-800 font-heading group-hover:text-primary transition-colors">{adminName}</p>
            </div>
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_4px_12px_rgba(0,158,227,0.05)] group-hover:bg-primary/20 transition-all duration-200">
              <User size={14} />
            </div>
          </button>

          {/* Profile Dropdown Popover */}
          {profileOpen && (
            <div className="absolute right-0 mt-2.5 w-60 bg-white border border-slate-200/80 rounded-2xl shadow-xl p-5 z-50 animate-fade-in-up origin-top-right">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3.5 mb-3.5">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/25">
                    <User size={18} />
                  </div>
                  <div className="text-left flex-1">
                    {isEditingName ? (
                      <div className="flex flex-col gap-1.5 mt-0.5">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="Admin Name"
                          className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveName();
                            if (e.key === 'Escape') setIsEditingName(false);
                          }}
                        />
                        <div className="flex gap-1.5">
                          <button
                            onClick={handleSaveName}
                            className="text-[9px] font-black tracking-widest uppercase bg-primary hover:bg-primary/95 text-white px-2 py-1 rounded-md transition-colors cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setIsEditingName(false)}
                            className="text-[9px] font-black tracking-widest uppercase bg-slate-100 hover:bg-slate-200 text-slate-650 px-2 py-1 rounded-md transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 group/name">
                        <h4 className="text-xs font-black tracking-wider uppercase text-slate-800 font-heading">{adminName}</h4>
                        <button
                          onClick={() => {
                            setNewName(adminName);
                            setIsEditingName(true);
                          }}
                          className="opacity-0 group-hover/name:opacity-100 p-0.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-all cursor-pointer"
                          title="Edit name"
                        >
                          <Pencil size={11} />
                        </button>
                      </div>
                    )}
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">{adminEmail}</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase py-1.5 px-2.5 bg-slate-50 border border-slate-150 rounded-lg">
                    <span className="text-slate-400">Security core</span>
                    <span className="text-emerald-500">Active</span>
                  </div>
                </div>

                <button
                  className="flex items-center justify-center gap-2.5 px-4 py-2.5 w-full mt-4 rounded-xl text-xs font-black font-heading tracking-widest uppercase text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-100 hover:bg-rose-100/50 hover:border-rose-200 transition-all duration-200 cursor-pointer disabled:opacity-50"
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
                >
                  <LogOut size={13} />
                  {isLoggingOut ? 'Logging out...' : 'Logout Session'}
                </button>
              </div>
          )}
        </div>
      </div>
    </header>
  );
}
