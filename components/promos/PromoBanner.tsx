'use client';

import Link from 'next/link';
import { PromoBanner as PromoBannerType } from '@/types/promo';
import { Megaphone, Sparkles, Tag, AlertTriangle, Info, ArrowRight } from 'lucide-react';

interface PromoBannerProps {
  banner: PromoBannerType;
}

// Visual style per banner type. `background_style` (if set by admin) overrides the
// container classes so admins can fine-tune individual banners.
const TYPE_STYLES: Record<
  string,
  { container: string; icon: typeof Megaphone; iconWrap: string; cta: string; eyebrow: string }
> = {
  sale: {
    container: 'bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/30',
    icon: Tag,
    iconWrap: 'bg-primary/15 text-primary border-primary/30',
    cta: 'bg-primary text-white hover:bg-primary-hover',
    eyebrow: 'text-primary',
  },
  featured: {
    container: 'bg-gradient-to-r from-violet-500/10 via-violet-500/5 to-transparent border-violet-400/30',
    icon: Sparkles,
    iconWrap: 'bg-violet-500/15 text-violet-600 border-violet-400/30',
    cta: 'bg-violet-600 text-white hover:bg-violet-700',
    eyebrow: 'text-violet-600',
  },
  announcement: {
    container: 'bg-card border-border',
    icon: Megaphone,
    iconWrap: 'bg-slate-100 text-slate-600 border-slate-200',
    cta: 'bg-primary text-white hover:bg-primary-hover',
    eyebrow: 'text-slate-500',
  },
  warning: {
    container: 'bg-gradient-to-r from-amber-400/10 via-amber-400/5 to-transparent border-amber-400/40',
    icon: AlertTriangle,
    iconWrap: 'bg-amber-400/15 text-amber-600 border-amber-400/40',
    cta: 'bg-amber-500 text-white hover:bg-amber-600',
    eyebrow: 'text-amber-600',
  },
  info: {
    container: 'bg-gradient-to-r from-sky-400/10 via-sky-400/5 to-transparent border-sky-400/30',
    icon: Info,
    iconWrap: 'bg-sky-400/15 text-sky-600 border-sky-400/30',
    cta: 'bg-sky-600 text-white hover:bg-sky-700',
    eyebrow: 'text-sky-600',
  },
};

function isExternal(link: string): boolean {
  return /^https?:\/\//i.test(link) || link.startsWith('//');
}

export default function PromoBanner({ banner }: PromoBannerProps) {
  const style = TYPE_STYLES[banner.banner_type] || TYPE_STYLES.announcement;
  const Icon = style.icon;
  const hasCta = !!(banner.cta_text && banner.cta_link);

  const ctaClasses = `inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-200 shadow-sm flex-shrink-0 ${style.cta}`;

  const ctaContent = (
    <>
      {banner.cta_text}
      <ArrowRight size={15} />
    </>
  );

  return (
    <div
      className={`w-full max-w-full overflow-hidden rounded-2xl border px-5 py-4 sm:px-6 sm:py-5 shadow-sm ${
        banner.background_style ? '' : style.container
      }`}
      style={banner.background_style ? { background: banner.background_style } : undefined}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Icon / image */}
        {banner.image_url ? (
          <img
            src={banner.image_url}
            alt=""
            className="w-12 h-12 rounded-xl object-cover border border-black/5 flex-shrink-0"
          />
        ) : (
          <div
            className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${style.iconWrap}`}
          >
            <Icon size={20} />
          </div>
        )}

        {/* Text */}
        <div className="flex-1 min-w-0">
          {banner.subtitle && (
            <p className={`text-[11px] font-black uppercase tracking-widest mb-0.5 ${style.eyebrow}`}>
              {banner.subtitle}
            </p>
          )}
          <h3 className="text-base sm:text-lg font-black font-heading text-text-primary leading-tight break-words">
            {banner.title}
          </h3>
          {banner.description && (
            <p className="text-sm text-text-secondary mt-1 leading-relaxed break-words">
              {banner.description}
            </p>
          )}
        </div>

        {/* CTA */}
        {hasCta && (
          <div className="flex-shrink-0">
            {isExternal(banner.cta_link as string) ? (
              <a
                href={banner.cta_link as string}
                target="_blank"
                rel="noopener noreferrer"
                className={ctaClasses}
              >
                {ctaContent}
              </a>
            ) : (
              <Link href={banner.cta_link as string} className={ctaClasses}>
                {ctaContent}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
