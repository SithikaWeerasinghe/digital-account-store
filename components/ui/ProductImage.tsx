'use client';

import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';

/**
 * Safe product image with graceful fallback.
 *
 * - Shows the image when the URL is present and loads successfully.
 * - On load error (dead/invalid/private URL) or when no URL is set, shows a
 *   branded placeholder with the product/category name — never the browser's
 *   broken-image icon.
 *
 * `compact` renders a simple contained thumbnail (admin tables); the default
 * renders the premium blurred-backdrop + contained image used on cards/detail.
 */
export default function ProductImage({
  src,
  productName,
  category,
  compact = false,
  imgClassName,
}: {
  src?: string | null;
  productName?: string;
  category?: string;
  compact?: boolean;
  imgClassName?: string;
}) {
  const isUsable = !!src && (/^https?:\/\//i.test(src) || src.startsWith('/'));
  const [failed, setFailed] = useState(false);

  // Reset the error state if the src changes (e.g. admin edits the URL).
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const showImage = isUsable && !failed;
  const label = productName || category || 'ApexFled';

  if (showImage) {
    if (compact) {
      return (
        <img
          src={src as string}
          alt={label}
          onError={() => setFailed(true)}
          className={imgClassName || 'w-full h-full object-contain'}
        />
      );
    }
    return (
      <div className="w-full h-full relative overflow-hidden flex items-center justify-center p-3">
        <img
          src={src as string}
          alt=""
          aria-hidden="true"
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none"
        />
        <img
          src={src as string}
          alt={label}
          onError={() => setFailed(true)}
          className={imgClassName || 'relative w-full h-full object-contain z-10 transition-transform duration-500 ease-out group-hover:scale-105'}
        />
      </div>
    );
  }

  // Fallback placeholder
  if (compact) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
        <Package size={18} />
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,158,227,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,158,227,0.03)_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />
      <Package size={30} className="text-primary/50" />
      <span className="relative z-10 max-w-[85%] text-center text-[11px] font-semibold tracking-wide text-slate-300 line-clamp-2">
        {label}
      </span>
    </div>
  );
}
