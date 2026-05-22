import Link from 'next/link';
import { Product } from '@/types/product';
import { ROUTES } from '@/lib/constants';
import { Star, Zap, Package, Eye, ShieldAlert, Cpu } from 'lucide-react';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function ProductCard({ product }: { product: Product }) {
  // Mock category-specific telemetry stats for gaming immersive theme
  const getTelemetry = (category: string) => {
    switch (category.toLowerCase()) {
      case 'gaming':
        return { metric: 'LATENCY', value: '0.2ms', statName: 'STABILITY', statVal: '99.9%' };
      case 'streaming':
        return { metric: 'BANDWIDTH', value: '4K HDR', statName: 'DECRYPT', statVal: 'INSTANT' };
      case 'ai tools':
        return { metric: 'SYNC RATE', value: '99.8%', statName: 'INTELLIGENCE', statVal: 'PREMIUM' };
      default:
        return { metric: 'INTEGRITY', value: 'VERIFIED', statName: 'SECURITY', statVal: 'AES-256' };
    }
  };

  const tele = getTelemetry(product.category);

  return (
    <div className="mp-card group flex flex-col relative overflow-hidden h-full bg-[#11131E] border border-[#202230] rounded-sm cyber-corners">
      {/* Dynamic scan grid background overlay */}
      <div className="mp-card-grid-overlay"></div>

      {/* Rotating hover top indicators */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-40 group-hover:via-[#8B5CF6] group-hover:opacity-100 transition-all duration-500"></div>

      {/* Cyber Corner Bracket Notches */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-white/10 group-hover:border-primary/50 transition-colors"></div>
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-white/10 group-hover:border-primary/50 transition-colors"></div>
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-white/10 group-hover:border-primary/50 transition-colors"></div>
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-white/10 group-hover:border-primary/50 transition-colors"></div>

      {/* Technical coordinate code watermark */}
      <div className="absolute top-2 right-12 font-mono text-[7px] text-white/10 group-hover:text-white/20 transition-colors">
        SYS_NODE_{product.id.toUpperCase()}
      </div>

      {/* Image Area with Chromatic Aberration / Glitch Zoom */}
      <div className="relative overflow-hidden aspect-[16/10] bg-[#08090D] border-b border-[#202230]">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover glitch-hover-img opacity-60 group-hover:opacity-85 transition-all duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={32} className="text-[#202230]" />
          </div>
        )}
        
        {/* Dark Screen Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#11131E] via-transparent to-transparent"></div>

        {/* Instock / Outofstock overlays */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="flex items-center gap-1.5 bg-[#EF4444]/5 border border-[#EF4444]/40 text-[#EF4444] text-[9px] font-black font-mono px-3 py-1 rounded-sm tracking-widest uppercase">
              <ShieldAlert size={10} /> DEPLETED_STOCK
            </span>
          </div>
        )}
        
        {/* Instant delivery tag */}
        {product.isInstantDelivery && (
          <div className="absolute top-3 right-3 z-10">
            <span className="flex items-center gap-1 bg-[#090A10]/95 backdrop-blur-sm border border-primary/50 text-primary text-[8px] font-black font-mono tracking-wider uppercase px-2 py-0.5 rounded-sm shadow-[0_0_10px_rgba(139,92,246,0.15)]">
              <Zap size={9} className="fill-primary text-primary" /> SECURE_DROP
            </span>
          </div>
        )}

        {/* Tactical sweeping scanning line */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_49%,rgba(139,92,246,0.06)_50%,transparent_51%)] bg-[size:100%_15px] pointer-events-none"></div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow relative z-10">
        
        {/* Category & Star Rating */}
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-[8px] font-black font-mono tracking-widest uppercase text-primary border border-primary/20 px-2 py-0.5 rounded-sm bg-primary/5">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-[10px] font-bold text-white/95">
            <Star size={11} className="fill-[#FACC15] text-[#FACC15] drop-shadow-[0_0_3px_rgba(250,204,21,0.4)]" />
            <span className="font-mono text-[10px]">{product.rating.toFixed(1)}</span>
            <span className="text-white/20">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="font-black font-[family-name:var(--font-heading)] text-white text-sm tracking-wider mb-2.5 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Product Description */}
        <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2 mb-5 font-medium">
          {product.description}
        </p>

        {/* Tactical Keycard Telemetry Widget */}
        <div className="grid grid-cols-2 gap-2 bg-[#0A0B10] border border-[#202230] p-2.5 rounded-sm mb-5 font-mono text-[9px] text-[#A1A1AA]/50 font-bold">
          <div>
            <span className="text-white/20 block text-[8px] tracking-wider uppercase">{tele.metric}</span>
            <span className="text-white/80">{tele.value}</span>
          </div>
          <div className="text-right border-l border-[#202230] pl-2.5">
            <span className="text-white/20 block text-[8px] tracking-wider uppercase">{tele.statName}</span>
            <span className="text-[#39FF14]">{tele.statVal}</span>
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="mt-auto border-t border-[#25253A]/60 pt-4">
          <div className="flex items-end justify-between mb-4">
            <div>
              <span className="text-lg font-black font-[family-name:var(--font-heading)] text-white tracking-wider">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="ml-2 text-[10px] text-text-secondary line-through font-medium font-mono">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[8px] font-mono font-black tracking-widest text-white/30 uppercase">
              NODE_{product.id.split('-')[1]}
            </span>
          </div>

          {/* Glint & Glow Outline CTA Button */}
          <Link
            href={`${ROUTES.PRODUCTS}/${product.slug}`}
            className={`glow-border-button flex items-center justify-center gap-2 w-full py-3.5 rounded-sm text-[10px] font-black font-mono tracking-widest uppercase transition-all duration-300 ${
              product.inStock
                ? 'bg-[#12141C] text-primary border border-primary/30 hover:text-white hover:bg-primary/5 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                : 'bg-border/30 text-text-secondary/40 cursor-not-allowed pointer-events-none border border-transparent'
            }`}
          >
            <Eye size={12} /> DECRYPT LOADOUT
          </Link>
        </div>

      </div>
    </div>
  );
}
