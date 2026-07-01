'use client';

import { useState, useEffect, use } from 'react';
import { fetchProductBySlug, fetchReviews, fetchInventoryCount } from '@/lib/api';
import { Product, ProductVariant, ProductOption, GuaranteeOption } from '@/types/product';
import { Review } from '@/types/review';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { useCart } from '@/lib/contexts/CartContext';
import { resolveGuaranteeOptions, guaranteeSourceForPlan } from '@/lib/productUtils';
import ProductImage from '@/components/ui/ProductImage';
import ProductConfigurator, { ConfiguratorPlan } from '@/components/products/ProductConfigurator';
import {
  Star, ShieldCheck, Zap, Shield, Package,
  ChevronRight, Mail, CreditCard, Bitcoin, Banknote, Check, AlertCircle, ShoppingCart
} from 'lucide-react';

// ApexFled change request: currency adjustment (EUR → GBP). Canonical helper: lib/utils.ts.
function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={16}
          className={i <= Math.round(rating) ? 'fill-amber-500 text-amber-500' : 'text-slate-200 fill-slate-200'}
        />
      ))}
    </div>
  );
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch (e) {
    return dateString;
  }
};

const getAvatarGradient = (name: string) => {
  const gradients = [
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-500',
    'from-emerald-400 to-teal-600',
    'from-amber-400 to-orange-500',
    'from-rose-500 to-red-600',
    'from-cyan-500 to-blue-600'
  ];
  let hash = 0;
  const cleanName = name || 'Anonymous';
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

const PAYMENT_METHODS = [
  { id: 'card', label: 'Card Payment', desc: 'Visa, Mastercard, AMEX', icon: CreditCard },
  { id: 'crypto', label: 'Crypto Payment', desc: 'BTC, ETH, USDT', icon: Bitcoin },
  { id: 'manual', label: 'Manual Payment', desc: 'Bank transfer', icon: Banknote },
];

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();
  const { addToCart, items } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [selectedGuarantee, setSelectedGuarantee] = useState<GuaranteeOption | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  // Inline message when a stock limit blocks adding more to the cart.
  const [stockMsg, setStockMsg] = useState('');
  // Variant-aware stock: available inventory count for the selected option.
  // null = not loaded yet / not applicable.
  const [variantStock, setVariantStock] = useState<number | null>(null);
  const [stockLoading, setStockLoading] = useState(false);


  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const productData = await fetchProductBySlug(slug);
        setProduct(productData);

        // Initialize the selected plan: a variant and/or an option.
        const initialVariant = productData?.variants?.length ? productData.variants[0] : null;
        const initialOption = productData?.options?.length
          ? (productData.options.find((o) => o.is_default) || productData.options[0])
          : null;
        if (initialVariant) setSelectedVariant(initialVariant);
        if (initialOption) setSelectedOption(initialOption);

        // Initialize the selected warranty from the SAME resolver the rest of
        // the page uses, so per-plan warranty prices are picked up on load.
        const gOptions = resolveGuaranteeOptions(
          productData ?? null,
          guaranteeSourceForPlan(initialOption, initialVariant)
        );
        setSelectedGuarantee(
          gOptions.length > 0 ? (gOptions.find((g) => g.is_default) || gOptions[0]) : null
        );

        if (productData) {
          const reviewsData = await fetchReviews({ productId: productData.id });
          setReviews(reviewsData);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [slug]);

  // This product's stock is managed by variant inventory when it has either
  // product options or variants (the customer-facing selector keys the stock).
  const usesVariantInventory = !!(product?.options?.length || product?.variants?.length);

  // The active selection drives the stock lookup: prefer the option selector,
  // otherwise fall back to the variant selector (DB products often only have
  // variants once mapped).
  const activeSelectionId = selectedOption?.id ?? selectedVariant?.id ?? null;
  const activeSelectionLabel = selectedOption?.label ?? selectedVariant?.label ?? null;
  // Stock is scoped to the EXACT plan + warranty the customer has selected, so
  // the badge/cap never reflects another warranty's stock.
  const activeGuaranteeId = selectedGuarantee?.id ?? null;

  // Fetch available inventory count for the current product + active selection.
  // For variant products this scopes to the selected option/variant AND the
  // selected warranty; for simple products it reads product-level stock (used
  // only for display, never to block).
  useEffect(() => {
    if (!product) return;
    let cancelled = false;
    const optionId = usesVariantInventory ? activeSelectionId ?? undefined : undefined;
    const guaranteeId = activeGuaranteeId ?? undefined;
    // For a variant product, wait until a selection is actually made.
    if (usesVariantInventory && !optionId) return;

    (async () => {
      setStockLoading(true);
      // Clear the previous selection's count so we never flash a stale number.
      setVariantStock(null);
      const result = await fetchInventoryCount(product.id, optionId, guaranteeId);
      if (!cancelled) {
        setVariantStock(result.available_count);
        setStockLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [product, usesVariantInventory, activeSelectionId, activeGuaranteeId]);

  // Out of stock when a variant product's selected option has 0 inventory.
  // Simple products keep the existing product.inStock behavior (fallback).
  const variantOutOfStock = usesVariantInventory && variantStock === 0;
  const isOutOfStock = !(product?.inStock ?? false) || variantOutOfStock;

  // Human-readable stock label for variant products (used by badge + selector).
  // Returns null for simple products so they keep the plain In/Out badge.
  const variantStockLabel: string | null = !usesVariantInventory
    ? null
    : stockLoading || variantStock === null
      ? 'Checking stock...'
      : variantStock > 0
        ? `In Stock: ${variantStock}`
        : 'Out of Stock';

  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [emailError, setEmailError] = useState('');

  // Warranty/duration options for the current plan. Resolves per-plan (the
  // selected option OR variant's own guarantee_options) → product-level →
  // generated (options only); variant plans with no warranty data resolve to []
  // so the charged price stays the plan price.
  const guaranteeOptions: GuaranteeOption[] = resolveGuaranteeOptions(
    product,
    guaranteeSourceForPlan(selectedOption, selectedVariant)
  );

  // Plans shown in the configurator dropdown — built from the product's REAL
  // data: options if it has them, otherwise variants. No hardcoded content.
  const planSource: 'option' | 'variant' = product?.options?.length ? 'option' : 'variant';
  const plans: ConfiguratorPlan[] = product?.options?.length
    ? product.options.map((o) => ({ id: o.id, label: o.label, price: o.price, badge: o.badge, description: o.description }))
    : product?.variants?.length
      ? product.variants.map((v) => ({ id: v.id, label: v.label, price: v.price }))
      : [];
  const selectedPlanId = selectedOption?.id ?? selectedVariant?.id ?? null;

  // Selecting a plan updates the option/variant state (whichever this product
  // uses) and resets the warranty to that plan's default — without changing any
  // cart/checkout/order logic, which keys off selectedOption/selectedVariant.
  const handleSelectPlan = (planId: string) => {
    if (!product) return;
    if (planSource === 'option') {
      const opt = product.options?.find((o) => o.id === planId);
      if (!opt) return;
      setSelectedOption(opt);
      const g = resolveGuaranteeOptions(product, guaranteeSourceForPlan(opt, null));
      setSelectedGuarantee(g.find((x) => x.is_default) || g[0] || null);
    } else {
      const v = product.variants?.find((x) => x.id === planId);
      if (!v) return;
      setSelectedVariant(v);
      // Use THIS plan's own warranties (per-plan pricing) when it has them.
      const g = resolveGuaranteeOptions(product, guaranteeSourceForPlan(null, v));
      setSelectedGuarantee(g.find((x) => x.is_default) || g[0] || null);
    }
    setStockMsg('');
  };

  const handleSelectGuarantee = (g: GuaranteeOption) => {
    setSelectedGuarantee(g);
    setStockMsg('');
  };

  const activePrice = selectedGuarantee?.total_price
    ?? selectedOption?.price
    ?? selectedVariant?.price
    ?? product?.price ?? 0;
  const total = activePrice * quantity;

  // Cap the quantity selector at the available stock for the selected plan
  // (variant products), keeping the existing sane upper bound for simple ones.
  const HARD_MAX_QTY = 10;
  const maxSelectableQty = usesVariantInventory
    ? Math.min(HARD_MAX_QTY, Math.max(1, variantStock ?? 1))
    : HARD_MAX_QTY;

  // How many of this exact selection (same product + variant + option +
  // guarantee) are already in the cart, so we never exceed stock in total.
  const selectionCartId = product
    ? `${product.id}-${selectedVariant?.id || 'base'}-${selectedOption?.id || 'noopt'}-${selectedGuarantee?.id || 'noguar'}`
    : '';
  const cartQtyForSelection = items.find((i) => i.id === selectionCartId)?.quantity ?? 0;

  // If the selected plan's stock drops below the chosen quantity (e.g. the
  // selection changed, or stock was just refreshed), clamp the quantity down.
  useEffect(() => {
    if (!usesVariantInventory || variantStock === null) return;
    setQuantity((q) => Math.min(Math.max(1, q), Math.max(1, variantStock)));
    setStockMsg('');
  }, [variantStock, usesVariantInventory]);

  /**
   * Validates the combined (cart + requested) quantity against stock for the
   * current selection. Returns true when it's safe to add; otherwise sets a
   * clear message and returns false.
   */
  const canAddSelectedQuantity = (): boolean => {
    if (!usesVariantInventory || variantStock === null) return true;
    if (cartQtyForSelection + quantity > variantStock) {
      const remaining = Math.max(0, variantStock - cartQtyForSelection);
      setStockMsg(
        cartQtyForSelection > 0
          ? `Only ${variantStock} available in stock. You already have ${cartQtyForSelection} in your cart${remaining > 0 ? ` — you can add ${remaining} more.` : '.'}`
          : `Only ${variantStock} available in stock for this option.`
      );
      return false;
    }
    setStockMsg('');
    return true;
  };

  const handleCheckout = () => {
    if (!product) return;
    // Never let the combined cart quantity exceed available stock.
    if (!canAddSelectedQuantity()) return;
    // Add the selected plan/warranty to the cart and go straight to the real
    // checkout, which redirects to the chosen payment provider. (No placeholder.)
    addToCart(product, quantity, selectedVariant || undefined, selectedOption || undefined, selectedGuarantee || undefined);
    router.push(ROUTES.CHECKOUT);
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (!canAddSelectedQuantity()) return;
    addToCart(product, quantity, selectedVariant || undefined, selectedOption || undefined, selectedGuarantee || undefined);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-background flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h1 className="text-xl font-black font-heading uppercase tracking-widest text-text-primary">Loading Product...</h1>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] bg-background flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-24 h-24 bg-card border border-border rounded-full flex items-center justify-center shadow-2xl">
          <Package size={40} className="text-text-secondary/50" />
        </div>
        <h1 className="text-3xl font-black font-heading uppercase tracking-widest text-text-primary">Product Not Found</h1>
        <p className="text-text-secondary tracking-wide font-medium">The product you are looking for does not exist or has been removed.</p>
        <Link href={ROUTES.PRODUCTS} className="btn-premium-shine px-6 py-3 bg-primary text-white font-black font-heading tracking-widest uppercase rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 hover:shadow-[0_0_20px_rgba(0,158,227,0.35)]">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative text-text-primary font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>

      {/* Breadcrumb */}
      <div className="border-b border-border bg-secondary-background relative z-10 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-text-secondary">
            <Link href={ROUTES.HOME} className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={12} className="text-primary/70 stroke-[2.5]" />
            <Link href={ROUTES.PRODUCTS} className="hover:text-primary transition-colors">Products</Link>
            <ChevronRight size={12} className="text-primary/70 stroke-[2.5]" />
            <span className="text-text-primary truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT COLUMN: Product Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Image Showcase Card */}
            <div className="bg-card border border-border shadow-2xl rounded-3xl overflow-hidden p-6 flex items-center justify-center bg-white relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none"></div>
              
              <div className="aspect-[16/10] w-full relative overflow-hidden rounded-2xl flex items-center justify-center bg-slate-50/50 border border-slate-100/70">
                <ProductImage
                  src={product.imageUrl}
                  productName={product.name}
                  category={product.category}
                  imgClassName="relative max-h-[85%] max-w-[85%] object-contain z-10 transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
            </div>

            {/* 2. Product Info Card */}
            <div className="bg-card border border-border shadow-2xl rounded-3xl p-8 sm:p-10 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
                <div>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-black font-heading tracking-widest uppercase px-3.5 py-1.5 rounded-full border mb-4 ${
                    variantStockLabel === 'Checking stock...'
                      ? 'text-text-secondary border-border bg-slate-50'
                      : !isOutOfStock
                        ? 'text-success border-success/20 bg-success/5'
                        : 'text-hazard border-hazard/20 bg-hazard/5'
                  }`}>
                    {variantStockLabel
                      ? `${variantStockLabel === 'Out of Stock' ? '○' : variantStockLabel === 'Checking stock...' ? '◌' : '●'} ${variantStockLabel}`
                      : isOutOfStock
                        ? '○ Out of Stock'
                        : '● In Stock'}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-black font-heading uppercase tracking-wider text-text-primary leading-tight">{product.name}</h1>
                </div>
                
                <div className="flex flex-col sm:items-end gap-1 flex-shrink-0">
                  {product.variants?.length ? (
                    <span className="text-xs font-black font-heading tracking-widest uppercase text-text-secondary">Starting From</span>
                  ) : null}
                  <span className="text-4xl sm:text-5xl font-black font-heading text-primary tracking-wider">{formatCurrency(product.price)}</span>
                </div>
              </div>

              {/* Rating Summary */}
              <div className="flex items-center gap-4 bg-secondary-background border border-border rounded-2xl p-4 w-fit">
                <StarRating rating={product.rating} />
                <span className="font-black text-text-primary font-heading text-lg leading-none">{product.rating.toFixed(1)}</span>
                <span className="text-text-secondary text-sm font-semibold">({product.reviewsCount} verified reviews)</span>
              </div>

              {/* Product Description */}
              <div className="space-y-3">
                <h2 className="text-lg font-black font-heading uppercase tracking-widest text-text-primary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(0,158,227,0.4)]"></span>
                  Product Description
                </h2>
                <p className="text-text-secondary leading-relaxed font-medium text-base sm:text-lg">
                  {product.description || 'Access to premium digital license keys and accounts. Delivered instantly to your email upon payment.'}
                </p>
              </div>

              {/* Key Features */}
              {product.features?.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-border/50">
                  <h2 className="text-lg font-black font-heading uppercase tracking-widest text-text-primary flex items-center gap-2">
                    <Zap size={18} className="text-warning fill-warning" />
                    Key Features
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.features.map((f) => (
                      <div key={f} className="flex items-center gap-3 text-sm sm:text-base font-medium text-text-secondary bg-secondary-background border border-border p-4 rounded-xl hover:border-primary/30 transition-colors">
                        <div className="w-6 h-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                          <Check size={12} className="text-primary" />
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Customer Reviews Section */}
            {reviews.length > 0 && (
              <div className="bg-card border border-border shadow-2xl rounded-3xl p-8 sm:p-10 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px]"></div>
                
                <h2 className="text-2xl font-black font-heading uppercase tracking-widest text-text-primary mb-6 relative z-10">
                  Customer <span className="text-primary">Reviews</span>
                </h2>
                
                <div className="max-h-[380px] overflow-y-auto border border-border bg-secondary-background rounded-2xl p-6 relative z-10 custom-scrollbar divide-y divide-border/60">
                  {reviews.map((review) => (
                    <div key={review.id} className="py-4 first:pt-0 last:pb-0 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <StarRating rating={review.rating} />
                        <span className="text-xs text-text-secondary font-semibold font-mono">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <p className="text-[14px] sm:text-base text-text-secondary leading-relaxed font-medium">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Checkout Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              {(
                <div className="bg-card border border-border shadow-2xl rounded-3xl overflow-hidden">
                  {/* Header */}
                  <div className="bg-secondary-background border-b border-border px-8 py-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                    <h2 className="text-lg font-black font-heading uppercase tracking-widest text-text-primary">Complete Order</h2>
                  </div>

                  <div className="p-8 space-y-8">
                    {/* Email */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-black font-heading tracking-widest uppercase text-text-secondary mb-3">
                        <Mail size={14} className="text-primary" /> Email Address *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                        placeholder="your@email.com"
                        className={`w-full px-4 py-3 rounded-xl border bg-white text-text-primary text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-text-secondary/40 ${emailError ? 'border-hazard ring-1 ring-hazard/10' : 'border-border'}`}
                      />
                      {emailError && <p className="text-xs font-black tracking-wide text-hazard mt-2">{emailError}</p>}
                    </div>

                    {/* Product / Plan dropdown + Warranty cards (data-driven). */}
                    {(plans.length > 0 || guaranteeOptions.length > 0) && (
                      <ProductConfigurator
                        product={product}
                        plans={plans}
                        selectedPlanId={selectedPlanId}
                        onSelectPlan={handleSelectPlan}
                        guaranteeOptions={guaranteeOptions}
                        selectedGuaranteeId={selectedGuarantee?.id ?? null}
                        onSelectGuarantee={handleSelectGuarantee}
                      />
                    )}

                    {/* Selected option/variant stock count — visible above Quantity,
                        updates immediately when the selection changes */}
                    {usesVariantInventory && variantStockLabel && (
                      <div
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-black font-heading tracking-wider uppercase ${
                          variantStockLabel === 'Checking stock...'
                            ? 'text-text-secondary border-border bg-slate-50'
                            : variantOutOfStock
                              ? 'text-hazard border-hazard/20 bg-hazard/5'
                              : 'text-success border-success/20 bg-success/5'
                        }`}
                      >
                        {variantStockLabel === 'Checking stock...' ? (
                          <span className="w-4 h-4 border-2 border-text-secondary/40 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                        ) : (
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${variantOutOfStock ? 'bg-hazard' : 'bg-success animate-pulse'}`} />
                        )}
                        <span>
                          Selected plan stock:{' '}
                          {variantStockLabel === 'Checking stock...' ? 'Checking stock...' : variantStockLabel}
                        </span>
                      </div>
                    )}

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-black font-heading tracking-widest uppercase text-text-secondary mb-3">Quantity</label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => { setStockMsg(''); setQuantity(Math.max(1, quantity - 1)); }}
                          disabled={quantity <= 1}
                          className="w-10 h-10 rounded-xl bg-slate-50 border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-primary transition-colors font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          −
                        </button>
                        <span className="w-10 text-center font-black text-text-primary text-lg font-mono">{quantity}</span>
                        <button
                          onClick={() => {
                            if (quantity >= maxSelectableQty) {
                              if (usesVariantInventory && variantStock !== null) {
                                setStockMsg(`Only ${variantStock} available in stock for this option.`);
                              }
                              return;
                            }
                            setStockMsg('');
                            setQuantity(quantity + 1);
                          }}
                          disabled={quantity >= maxSelectableQty}
                          className="w-10 h-10 rounded-xl bg-slate-50 border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-primary transition-colors font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                      {usesVariantInventory && variantStock !== null && variantStock > 0 && (
                        <p className="mt-2 text-xs font-semibold text-text-secondary">
                          {cartQtyForSelection > 0
                            ? `${variantStock} in stock · ${cartQtyForSelection} already in cart`
                            : `${variantStock} available in stock for this option`}
                        </p>
                      )}
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-black font-heading tracking-widest uppercase text-text-secondary mb-3">Payment Method</label>
                      <div className="grid grid-cols-3 gap-3">
                        {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setPaymentMethod(id)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                              paymentMethod === id
                                ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,158,227,0.1)]'
                                : 'border-border bg-white hover:border-primary/50'
                            }`}
                          >
                            <Icon size={20} className={`${paymentMethod === id ? 'text-primary' : 'text-text-secondary'} mb-2`} />
                            <span className={`text-[11px] font-black font-heading tracking-wider uppercase ${paymentMethod === id ? 'text-text-primary' : 'text-text-secondary'}`}>
                              {id === 'card' ? 'Card' : id === 'crypto' ? 'Crypto' : 'Manual'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-slate-50 border border-border rounded-xl p-5 space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[20px]"></div>
                      {selectedOption && (
                        <div className="flex justify-between gap-4 text-sm font-black tracking-widest uppercase text-text-secondary/70 relative z-10 font-mono">
                          <span>Product / Plan</span>
                          <span className="text-right">{selectedOption.label}</span>
                        </div>
                      )}
                      {selectedVariant && !selectedOption && (
                        <div className="flex justify-between gap-4 text-sm font-black tracking-widest uppercase text-text-secondary/70 relative z-10 font-mono">
                          <span>Product / Plan</span>
                          <span className="text-right">{selectedVariant.label}</span>
                        </div>
                      )}
                      {selectedGuarantee && (
                        <div className="flex justify-between gap-4 text-sm font-black tracking-widest uppercase text-text-secondary/70 relative z-10 font-mono">
                          <span>Warranty</span>
                          <span className="text-right">{selectedGuarantee.label}</span>
                        </div>
                      )}
                      <div className="flex justify-between gap-4 text-sm font-black tracking-widest uppercase text-text-secondary/70 relative z-10 font-mono">
                        <span>Unit Price</span>
                        <span className="text-right">{formatCurrency(activePrice)}</span>
                      </div>
                      <div className="flex justify-between gap-4 text-sm font-black tracking-widest uppercase text-text-secondary/70 relative z-10 font-mono">
                        <span>Quantity</span>
                        <span className="text-right">× {quantity}</span>
                      </div>
                      <div className="border-t border-border pt-3 mt-1 flex justify-between gap-4 items-center relative z-10">
                        <span className="text-base font-black font-heading tracking-widest uppercase text-text-primary">Total</span>
                        <span className="text-2xl font-black font-heading text-primary drop-shadow-[0_0_8px_rgba(0,158,227,0.2)] text-right">{formatCurrency(total)}</span>
                      </div>
                    </div>

                    {/* Out-of-stock notice for the selected option */}
                    {isOutOfStock && (
                      <div className="flex items-center gap-2 bg-hazard/5 border border-hazard/20 text-hazard rounded-xl px-4 py-3 text-sm font-bold">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        {usesVariantInventory && activeSelectionLabel
                          ? `${activeSelectionLabel} is out of stock. Please choose another plan.`
                          : 'This product is currently out of stock.'}
                      </div>
                    )}

                    {/* Stock limit message (combined cart + requested quantity) */}
                    {stockMsg && (
                      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 text-sm font-bold">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        {stockMsg}
                      </div>
                    )}

                    {/* CTAs */}
                    <div className="space-y-3">
                      <button
                        onClick={handleCheckout}
                        disabled={isOutOfStock || stockLoading}
                        className="w-full py-4 rounded-xl bg-primary text-white font-black font-heading tracking-widest uppercase hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_15px_rgba(0,158,227,0.15)] hover:shadow-[0_0_25px_rgba(0,158,227,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                      >
                        {isOutOfStock ? 'Out of Stock' : 'Continue to Checkout'}
                      </button>
                      <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock || stockLoading}
                        className={`w-full py-3 rounded-xl border-2 font-black font-heading tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                          addedToCart
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-slate-300 bg-white text-slate-700 hover:border-primary hover:text-primary'
                        }`}
                      >
                        <ShoppingCart size={18} />
                        {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs font-black font-heading tracking-widest uppercase text-text-secondary/50">
                      <Shield size={12} className="text-primary" />
                      Secure payment processing
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

