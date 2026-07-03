'use client';

import { ReactNode, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
// Redirect guard for the admin tab visibility flags (lib/adminNav.ts): if a tab
// is hidden (flag = false), direct-URL access to it redirects to the dashboard.
import { isHiddenAdminPath } from '@/lib/adminNav';
import { ROUTES } from '@/lib/constants';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  // If a hidden admin tab is opened directly by URL, redirect to the dashboard.
  // Auth is untouched (AdminProtected still guards each page); this only hides
  // navigation. Restore a tab by flipping its flag in lib/adminNav.ts.
  const isHiddenTab = !isLoginPage && isHiddenAdminPath(pathname);
  useEffect(() => {
    if (isHiddenTab) router.replace(ROUTES.ADMIN.DASHBOARD);
  }, [isHiddenTab, router]);

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans relative overflow-hidden">
      {/* Background Decorative Soft Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#009ee3]/3 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#fff159]/4 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* Sidebar Navigation */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-35 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/20 p-4 md:p-6 lg:p-8">
          {/* A hidden tab (visibility flag = false) shows a "Not available"
              notice while redirecting to the dashboard, so its content never
              renders. All tabs are currently visible. */}
          {isHiddenTab ? (
            <div className="flex flex-col items-center justify-center text-center py-24">
              <h2 className="text-xl font-black uppercase tracking-widest text-slate-700">Not available</h2>
              <p className="text-slate-500 mt-2 text-sm">
                This section is temporarily hidden. Redirecting to the dashboard…
              </p>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
