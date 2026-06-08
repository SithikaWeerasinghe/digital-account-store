'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

/**
 * Enables Lenis smooth scrolling on PUBLIC pages only.
 *
 * - Disabled on /admin routes (the dashboard manages its own scroll containers;
 *   smoothing the window would fight tables/forms).
 * - Disabled when the user prefers reduced motion (accessibility).
 * - Smooth wheel only; touch stays native so mobile feels responsive.
 * - Cleans up the rAF loop and Lenis instance on unmount / route change.
 */
export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') ?? false;

  useEffect(() => {
    if (isAdmin) return;
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      // Native touch scrolling keeps mobile snappy.
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [isAdmin]);

  return <>{children}</>;
}
