'use client';

import { useEffect, useState } from 'react';
import { PromoBanner as PromoBannerType, PromoPlacement } from '@/types/promo';
import { fetchActivePromos } from '@/lib/api';
import PromoBanner from './PromoBanner';

interface PromoBannerListProps {
  placement: PromoPlacement;
  /** Optional wrapper classes (e.g. spacing / max-width) for the page context. */
  className?: string;
}

/**
 * Fetches and renders active promo banners for a placement (global banners
 * included). Renders nothing while loading, on error, or when there are no
 * banners — so it never disrupts the page layout.
 */
export default function PromoBannerList({ placement, className = '' }: PromoBannerListProps) {
  const [banners, setBanners] = useState<PromoBannerType[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await fetchActivePromos(placement);
      if (!cancelled) setBanners(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [placement]);

  if (banners.length === 0) return null;

  return (
    <div className={`w-full max-w-full space-y-3 ${className}`}>
      {banners.map((banner) => (
        <PromoBanner key={banner.id} banner={banner} />
      ))}
    </div>
  );
}
