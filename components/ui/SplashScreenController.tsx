'use client';

import { useEffect } from 'react';

/**
 * Drives the splash timing. The overlay is shown by an inline script (which sets
 * data-apex-splash="active" on <html> before paint). This controller, after
 * hydration, keeps it visible long enough to read, then fades it out and clears
 * the attribute — revealing the site. Honours prefers-reduced-motion.
 *
 * Renders nothing; the attribute is on <html> (outside React's managed props),
 * so it survives hydration and is never clobbered.
 */
export default function SplashScreenController() {
  useEffect(() => {
    const html = document.documentElement;
    if (!html.hasAttribute('data-apex-splash')) return; // not showing (admin / repeat session)

    try {
      sessionStorage.setItem('apexfled_splash_shown', '1');
    } catch {
      /* ignore */
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const visibleMs = reduced ? 600 : 3500;
    const fadeMs = reduced ? 250 : 750;

    const hideTimer = setTimeout(() => html.setAttribute('data-apex-splash', 'hiding'), visibleMs);
    const removeTimer = setTimeout(() => html.removeAttribute('data-apex-splash'), visibleMs + fadeMs);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return null;
}
