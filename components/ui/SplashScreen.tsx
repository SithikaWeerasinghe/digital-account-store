'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import ApexFledLogo from '@/components/ui/ApexFledLogo';

const SESSION_KEY = 'apexfled_splash_shown';

/**
 * Modern intro splash. Shows ONCE per browser session on public pages.
 * - Never on /admin routes.
 * - Honours prefers-reduced-motion (shorter, gentle fade).
 * - Locks body scroll only while visible, then restores it.
 * - Renders nothing on the server (avoids hydration mismatch); it mounts client
 *   side, so payment redirects / navigation are never blocked.
 */
export default function SplashScreen() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') ?? false;

  const [show, setShow] = useState(false);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    if (isAdmin) return;

    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      /* sessionStorage unavailable → show once, best-effort */
    }
    if (alreadyShown) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setShow(true);
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* ignore */
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const visibleMs = prefersReduced ? 600 : 2000;
    const fadeMs = prefersReduced ? 200 : 650;

    const hideTimer = setTimeout(() => setHiding(true), visibleMs);
    const removeTimer = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = previousOverflow;
    }, visibleMs + fadeMs);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [isAdmin]);

  if (isAdmin || !show) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center px-6 overflow-hidden bg-white transition-all duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        hiding ? 'opacity-0 scale-[1.03] pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle premium background glows */}
      <div className="pointer-events-none absolute -top-1/4 left-1/2 -translate-x-1/2 w-[700px] max-w-[120vw] h-[700px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[420px] max-w-[80vw] h-[420px] rounded-full bg-[#fff159]/10 blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center animate-apex-reveal">
        <div className="drop-shadow-[0_0_24px_rgba(0,158,227,0.35)]">
          <ApexFledLogo size={64} id="splash" />
        </div>

        <h1 className="mt-5 text-2xl sm:text-3xl font-black font-heading tracking-[0.2em] uppercase text-slate-900">
          APEX<span className="text-primary">FLED</span>
        </h1>

        <p className="mt-3 max-w-xs sm:max-w-md text-sm sm:text-base font-medium text-text-secondary leading-relaxed">
          Customize your subscription in the modern way
        </p>

        {/* Loading bar */}
        <div className="mt-7 h-[3px] w-44 sm:w-56 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-[#60a5fa] animate-apex-bar" />
        </div>
      </div>
    </div>
  );
}
