import ApexFledLogo from '@/components/ui/ApexFledLogo';

/**
 * Intro splash overlay (server-rendered so it paints on the first frame — the
 * site is revealed only after it fades). Visibility is controlled entirely by
 * CSS via the `data-apex-splash` attribute on <html>, which an inline script
 * sets before paint (see app/layout.tsx) and SplashScreenController clears after
 * the timer. Hidden by default, so admin/repeat-session loads never see it.
 */
export default function SplashScreen() {
  return (
    <div className="apex-splash" aria-hidden="true">
      {/* Subtle premium background glows */}
      <div className="pointer-events-none absolute -top-1/4 left-1/2 -translate-x-1/2 w-[700px] max-w-[120vw] h-[700px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[420px] max-w-[80vw] h-[420px] rounded-full bg-[#fff159]/10 blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 animate-apex-reveal">
        <div className="drop-shadow-[0_0_24px_rgba(0,158,227,0.35)]">
          <ApexFledLogo size={64} id="splash" />
        </div>

        <h1 className="mt-5 text-2xl sm:text-3xl font-black font-heading tracking-[0.2em] uppercase text-slate-900">
          APEX<span className="text-primary">FLED</span>
        </h1>

        <p className="mt-3 max-w-xs sm:max-w-md text-sm sm:text-base font-medium text-text-secondary leading-relaxed">
          Customize your subscription in the modern way
        </p>

        <div className="mt-7 h-[3px] w-44 sm:w-56 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-[#60a5fa] animate-apex-bar" />
        </div>
      </div>
    </div>
  );
}
