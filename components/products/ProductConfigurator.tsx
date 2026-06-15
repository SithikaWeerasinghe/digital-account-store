'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Product, GuaranteeOption } from '@/types/product';
import ProductImage from '@/components/ui/ProductImage';
import { formatCurrency } from '@/lib/utils';

/** A normalized plan shown in the dropdown (built from options or variants). */
export interface ConfiguratorPlan {
  id: string;
  label: string;
  price: number;
  badge?: string;
  description?: string;
}

interface ProductConfiguratorProps {
  product: Product;
  /** Plans to choose from (mapped by the page from product.options or .variants). */
  plans: ConfiguratorPlan[];
  selectedPlanId: string | null;
  onSelectPlan: (planId: string) => void;
  /** Warranty/duration options for the selected plan (already resolved). */
  guaranteeOptions: GuaranteeOption[];
  selectedGuaranteeId: string | null;
  onSelectGuarantee: (guarantee: GuaranteeOption) => void;
}

/**
 * Customer-facing product configurator:
 *  - a rounded dropdown to pick the product plan/tier, and
 *  - a row of selectable warranty/duration cards for the chosen plan.
 *
 * Fully data-driven: it renders whatever plans/warranties the page passes in
 * (from the product's real options/variants/guarantee_options). It does not own
 * any product data or pricing — it only reports the selection back via the
 * callbacks, so cart/checkout/order/stock wiring stays in the page.
 */
export default function ProductConfigurator({
  product,
  plans,
  selectedPlanId,
  onSelectPlan,
  guaranteeOptions,
  selectedGuaranteeId,
  onSelectGuarantee,
}: ProductConfiguratorProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close the dropdown on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) ?? plans[0] ?? null;

  const PricePill = ({ amount }: { amount: number }) => (
    <span className="flex-shrink-0 text-xs font-bold text-emerald-600 border border-emerald-500/70 rounded-full px-2.5 py-1">
      {formatCurrency(amount)}
    </span>
  );

  const Icon = ({ size }: { size: number }) => (
    <span
      className="rounded-full overflow-hidden bg-slate-50 border border-border flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <ProductImage src={product.imageUrl} productName={product.name} category={product.category} compact />
    </span>
  );

  return (
    <div className="space-y-6">
      {/* ── Product / Plan dropdown ── */}
      {plans.length > 0 && (
        <div>
          <label className="block text-sm font-black font-heading tracking-widest uppercase text-text-secondary mb-3">
            Product / Plan
          </label>

          <div className="relative" ref={wrapRef}>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={open}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl border border-border bg-white hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors text-left"
            >
              <Icon size={40} />
              <span className="flex-1 min-w-0">
                <span className="block font-bold text-text-primary truncate">
                  {selectedPlan?.label ?? 'Select a plan'}
                </span>
                {selectedPlan?.description && (
                  <span className="block text-[11px] text-text-secondary/70 truncate">
                    {selectedPlan.description}
                  </span>
                )}
              </span>
              {selectedPlan && <PricePill amount={selectedPlan.price} />}
              <ChevronDown
                size={18}
                className={`flex-shrink-0 text-text-secondary transition-transform ${open ? 'rotate-180' : ''}`}
              />
            </button>

            {open && (
              <ul
                role="listbox"
                className="absolute z-30 mt-2 w-full max-h-72 overflow-y-auto bg-white border border-border rounded-2xl shadow-xl py-1"
              >
                {plans.map((plan) => {
                  const isSel = selectedPlan?.id === plan.id;
                  return (
                    <li key={plan.id} role="option" aria-selected={isSel}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectPlan(plan.id);
                          setOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                          isSel ? 'bg-primary/5' : 'hover:bg-slate-50'
                        }`}
                      >
                        <Icon size={28} />
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-semibold text-text-primary truncate">
                            {plan.label}
                            {plan.badge && (
                              <span className="ml-2 text-[10px] font-bold text-primary uppercase tracking-wide">
                                {plan.badge}
                              </span>
                            )}
                          </span>
                          {plan.description && (
                            <span className="block text-[11px] text-text-secondary/70 truncate">
                              {plan.description}
                            </span>
                          )}
                        </span>
                        <PricePill amount={plan.price} />
                        {isSel && <Check size={16} className="text-primary flex-shrink-0" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* ── Warranty / Duration cards ── */}
      {guaranteeOptions.length > 0 && (
        <div>
          <label className="block text-sm font-black font-heading tracking-widest uppercase text-text-secondary mb-3">
            Warranty
          </label>
          <div className={`grid gap-3 ${guaranteeOptions.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {guaranteeOptions.map((g) => {
              const isSel = selectedGuaranteeId === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onSelectGuarantee(g)}
                  aria-pressed={isSel}
                  className={`relative text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSel
                      ? 'bg-primary/5 border-primary shadow-[0_0_15px_rgba(0,158,227,0.1)]'
                      : 'bg-white border-border hover:border-primary/40'
                  }`}
                >
                  {/* circular check icon, top-right */}
                  <span
                    className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      isSel ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>

                  <div className="pr-7">
                    <span className="block text-sm font-black font-heading tracking-wide uppercase text-text-primary leading-tight">
                      {g.label}
                      {g.badge && (
                        <span
                          className={`ml-1.5 align-middle text-[9px] px-2 py-0.5 rounded-full inline-block ${
                            isSel ? 'bg-primary text-white' : 'bg-primary/15 text-primary'
                          }`}
                        >
                          {g.badge}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-end justify-between gap-x-2 gap-y-1">
                    <span className="text-text-secondary text-xs sm:text-sm font-semibold">
                      {formatCurrency(g.total_price)} in total
                    </span>
                    {g.monthly_price > 0 && (
                      <span className="text-primary text-xs sm:text-sm font-bold whitespace-nowrap">
                        {formatCurrency(g.monthly_price)} / mo
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
