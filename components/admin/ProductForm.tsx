'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { ProductFormInput, fetchCategories } from '@/lib/api';
import { X, Plus, Trash2, Loader2, ImageOff } from 'lucide-react';

// Fallback used until categories load from the database.
const FALLBACK_CATEGORIES = ['Streaming', 'Gaming', 'AI Tools', 'Software', 'Productivity'];

interface GuaranteeRow {
  id: string;
  label: string;
  months: string;
  total_price: string;
}

interface VariantRow {
  id: string;
  label: string;
  price: string;
  originalPrice: string;
  /** Per-plan warranty/duration prices. Empty = use the shared options below. */
  guarantees: GuaranteeRow[];
}

const newGuaranteeRow = (): GuaranteeRow => ({
  id: `g-${Math.random().toString(36).substring(2, 8)}`,
  label: '',
  months: '',
  total_price: '',
});

const mapGuaranteeRows = (options?: { id: string; label: string; months: number; total_price: number }[]): GuaranteeRow[] =>
  options?.map((g) => ({
    id: g.id,
    label: g.label,
    months: String(g.months),
    total_price: String(g.total_price),
  })) || [];

/**
 * One editable warranty/duration row (label · months · total £) + delete.
 * Responsive: a single stacked column on mobile (no horizontal cut-off), a
 * compact aligned row on sm+. Reused for both shared and per-plan warranties.
 */
function GuaranteeRowEditor({
  row,
  onChange,
  onRemove,
}: {
  row: GuaranteeRow;
  onChange: (field: keyof GuaranteeRow, value: string) => void;
  onRemove: () => void;
}) {
  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-sm text-slate-900';
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_5rem_6rem_auto] gap-2 sm:items-center">
      <input
        type="text"
        value={row.label}
        onChange={(e) => onChange('label', e.target.value)}
        placeholder="Label (e.g. 3 Months)"
        className={inputClass}
      />
      <input
        type="number"
        min="1"
        value={row.months}
        onChange={(e) => onChange('months', e.target.value)}
        placeholder="Months"
        className={inputClass}
      />
      <input
        type="number"
        step="0.01"
        min="0"
        value={row.total_price}
        onChange={(e) => onChange('total_price', e.target.value)}
        placeholder="Total £"
        className={inputClass}
      />
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove warranty"
        className="justify-self-start sm:justify-self-auto p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

interface ProductFormProps {
  product?: Product | null; // when present => edit mode
  onClose: () => void;
  onSave: (input: ProductFormInput) => Promise<void>;
}

export default function ProductForm({ product, onClose, onSave }: ProductFormProps) {
  const isEdit = !!product;

  const [name, setName] = useState('');
  const [categoryOptions, setCategoryOptions] = useState<string[]>(FALLBACK_CATEGORIES);
  const [category, setCategory] = useState(FALLBACK_CATEGORIES[0]);
  const [imagePreviewError, setImagePreviewError] = useState(false);

  // Load active categories from the database (falls back to the constant list).
  useEffect(() => {
    (async () => {
      const cats = await fetchCategories();
      if (cats.length > 0) {
        const names = cats.map((c) => c.name);
        setCategoryOptions(names);
        // Keep current selection if valid, else default to the first.
        setCategory((prev) => (names.includes(prev) ? prev : names[0]));
      }
    })();
  }, []);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [usageInstructions, setUsageInstructions] = useState('');
  const [inStock, setInStock] = useState(true);
  const [isInstantDelivery, setIsInstantDelivery] = useState(true);
  const [isActive, setIsActive] = useState(true); // visible on storefront
  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [guarantees, setGuarantees] = useState<GuaranteeRow[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Prefill form in edit mode
  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setDescription(product.description || '');
      setPrice(String(product.price));
      setOriginalPrice(product.originalPrice ? String(product.originalPrice) : '');
      setImageUrl(product.imageUrl || '');
      setFeatures(product.features?.length ? product.features : ['']);
      setUsageInstructions(product.usage_instructions || '');
      setInStock(product.inStock);
      setIsInstantDelivery(product.isInstantDelivery);
      setIsActive(product.is_active !== false); // default visible
      setVariants(
        product.variants?.map((v) => ({
          id: v.id,
          label: v.label,
          price: String(v.price),
          originalPrice: v.originalPrice ? String(v.originalPrice) : '',
          guarantees: mapGuaranteeRows(v.guarantee_options),
        })) || []
      );
      setGuarantees(mapGuaranteeRows(product.guarantee_options));
    }
  }, [product]);

  const updateFeature = (index: number, value: string) => {
    setFeatures((prev) => prev.map((f, i) => (i === index ? value : f)));
  };
  const addFeature = () => setFeatures((prev) => [...prev, '']);
  const removeFeature = (index: number) =>
    setFeatures((prev) => prev.filter((_, i) => i !== index));

  const addVariant = () =>
    setVariants((prev) => [
      ...prev,
      { id: `v-${Math.random().toString(36).substring(2, 8)}`, label: '', price: '', originalPrice: '', guarantees: [] },
    ]);
  const updateVariant = (index: number, field: 'label' | 'price' | 'originalPrice', value: string) =>
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  const removeVariant = (index: number) =>
    setVariants((prev) => prev.filter((_, i) => i !== index));

  // Per-plan warranty rows (live inside a single variant).
  const addVariantGuarantee = (vIndex: number) =>
    setVariants((prev) =>
      prev.map((v, i) => (i === vIndex ? { ...v, guarantees: [...v.guarantees, newGuaranteeRow()] } : v))
    );
  const updateVariantGuarantee = (vIndex: number, gIndex: number, field: keyof GuaranteeRow, value: string) =>
    setVariants((prev) =>
      prev.map((v, i) =>
        i === vIndex
          ? { ...v, guarantees: v.guarantees.map((g, j) => (j === gIndex ? { ...g, [field]: value } : g)) }
          : v
      )
    );
  const removeVariantGuarantee = (vIndex: number, gIndex: number) =>
    setVariants((prev) =>
      prev.map((v, i) => (i === vIndex ? { ...v, guarantees: v.guarantees.filter((_, j) => j !== gIndex) } : v))
    );

  const addGuarantee = () => setGuarantees((prev) => [...prev, newGuaranteeRow()]);
  const updateGuarantee = (index: number, field: keyof GuaranteeRow, value: string) =>
    setGuarantees((prev) => prev.map((g, i) => (i === index ? { ...g, [field]: value } : g)));
  const removeGuarantee = (index: number) =>
    setGuarantees((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Product name is required.');
    if (!price || isNaN(Number(price)) || Number(price) < 0)
      return setError('A valid price is required.');

    // Validate the image URL: allow empty (a clean fallback is shown), an
    // absolute https URL, or a local path starting with "/". Reject anything
    // else so obviously-broken URLs aren't saved silently.
    const trimmedImage = imageUrl.trim();
    if (trimmedImage && !/^https:\/\//i.test(trimmedImage) && !trimmedImage.startsWith('/')) {
      return setError('Image URL must start with https:// (or leave it blank to use a fallback image).');
    }

    const cleanFeatures = features.map((f) => f.trim()).filter(Boolean);

    // Warranty/guarantee options: keep rows with a label + price; derive the
    // monthly price from total ÷ months. Shared by the product-level list and
    // each plan's own list, so pricing rules stay identical everywhere.
    const cleanGuaranteeRows = (rows: GuaranteeRow[]) =>
      rows
        .filter((g) => g.label.trim() && g.total_price)
        .map((g, i) => {
          const months = Math.max(1, Number(g.months) || 1);
          const total = Number(g.total_price);
          return {
            id: g.id,
            label: g.label.trim(),
            months,
            total_price: total,
            monthly_price: Number((total / months).toFixed(2)),
            is_default: i === 0 ? true : undefined,
          };
        });

    const cleanVariants = variants
      .filter((v) => v.label.trim() && v.price)
      .map((v) => {
        const planGuarantees = cleanGuaranteeRows(v.guarantees);
        return {
          id: v.id,
          label: v.label.trim(),
          price: Number(v.price),
          originalPrice: v.originalPrice ? Number(v.originalPrice) : undefined,
          // This plan's own warranty prices (overrides the shared list for this
          // plan). Omitted when the admin left it empty.
          guarantee_options: planGuarantees.length > 0 ? planGuarantees : undefined,
        };
      });

    // Product-level (shared) warranty options — used for any plan that doesn't
    // define its own.
    const cleanGuarantees = cleanGuaranteeRows(guarantees);

    const input: ProductFormInput = {
      name: name.trim(),
      category,
      description: description.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      imageUrl: imageUrl.trim(),
      features: cleanFeatures,
      usageInstructions: usageInstructions.trim() || null,
      inStock,
      isInstantDelivery,
      isActive,
      variants: cleanVariants.length > 0 ? cleanVariants : null,
      guaranteeOptions: cleanGuarantees.length > 0 ? cleanGuarantees : null,
    };

    try {
      setIsSaving(true);
      await onSave(input);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save product.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-black text-slate-900 font-heading tracking-wide uppercase">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEdit ? 'Update the product details below' : 'Fill in the details to create a product'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body (scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs font-black tracking-widest uppercase text-slate-600 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Netflix Premium"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900"
              />
            </div>

            {/* Category + Image URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black tracking-widest uppercase text-slate-600 mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 bg-white"
                >
                  {(categoryOptions.includes(category) ? categoryOptions : [category, ...categoryOptions]).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black tracking-widest uppercase text-slate-600 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => { setImageUrl(e.target.value); setImagePreviewError(false); }}
                  placeholder="https://... or /images/logos/x.svg"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900"
                />
                <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
                  Recommended: 1200×900px, JPG/PNG/WebP, under 3MB. Leave blank to use a fallback image.
                </p>
              </div>
            </div>

            {/* Live image preview */}
            <div>
              <label className="block text-xs font-black tracking-widest uppercase text-slate-600 mb-2">
                Image Preview
              </label>
              <div className="w-40 aspect-[4/3] rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
                {imageUrl.trim() && !imagePreviewError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl.trim()}
                    alt="Preview"
                    onError={() => setImagePreviewError(true)}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="text-center px-3">
                    <ImageOff size={22} className="mx-auto text-slate-300 mb-1" />
                    <p className="text-[11px] text-slate-400">
                      {imageUrl.trim()
                        ? 'Image preview failed. Check the URL or use another image.'
                        : 'No image — a branded fallback will be shown.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-black tracking-widest uppercase text-slate-600 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Short description of the product"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 resize-none"
              />
            </div>

            {/* Usage Instructions (included in the delivery email) */}
            <div>
              <label className="block text-xs font-black tracking-widest uppercase text-slate-600 mb-2">
                Usage Instructions
              </label>
              <textarea
                value={usageInstructions}
                onChange={(e) => setUsageInstructions(e.target.value)}
                rows={4}
                placeholder="How to use this product — sent to the customer in the delivery email after payment.&#10;e.g. 1) Go to netflix.com  2) Log in with the email/password above  3) Select your profile."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 resize-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Shown to the customer under &quot;How to use your product&quot; in the delivery email.
              </p>
            </div>

            {/* Price + Original Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black tracking-widest uppercase text-slate-600 mb-2">
                  Price (£) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="9.99"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-black tracking-widest uppercase text-slate-600 mb-2">
                  Original Price (£)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="Optional (for discounts)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary"
                />
                <span className="text-sm font-semibold text-slate-700">In Stock</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInstantDelivery}
                  onChange={(e) => setIsInstantDelivery(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary"
                />
                <span className="text-sm font-semibold text-slate-700">Instant Delivery</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded accent-primary"
                />
                <span className="text-sm font-semibold text-slate-700">
                  Visible on store
                  <span className="block text-[11px] font-normal text-slate-400">Uncheck to hide; storefront shows &quot;not found&quot;.</span>
                </span>
              </label>
            </div>

            {/* Features */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-black tracking-widest uppercase text-slate-600">
                  Features
                </label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-hover"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 text-sm"
                    />
                    {features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Variants */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-black tracking-widest uppercase text-slate-600">
                  Product Options / Plans (optional)
                </label>
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-hover"
                >
                  <Plus size={14} /> Add Plan
                </button>
              </div>
              {variants.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No plans. The base price will be used. Add plans like &quot;1 Month&quot;, &quot;3 Months&quot;, etc.
                  These appear in the customer-facing product dropdown.
                </p>
              ) : (
                <div className="space-y-3">
                  {variants.map((variant, index) => (
                    <div key={variant.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-3">
                      {/* Plan name + remove */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={variant.label}
                          onChange={(e) => updateVariant(index, 'label', e.target.value)}
                          placeholder="Plan name / tier (e.g. Mega Fan)"
                          className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-sm text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          aria-label="Remove plan"
                          className="flex-shrink-0 p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Plan price + compare-at — stack on mobile */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Plan Price £
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={variant.price}
                            onChange={(e) => updateVariant(index, 'price', e.target.value)}
                            placeholder="9.99"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-sm text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            Compare-at £ (optional)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={variant.originalPrice}
                            onChange={(e) => updateVariant(index, 'originalPrice', e.target.value)}
                            placeholder="For showing a discount"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none text-sm text-slate-900"
                          />
                        </div>
                      </div>

                      {/* Per-plan warranty prices */}
                      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-3">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 min-w-0 truncate">
                            Warranty prices for &ldquo;{variant.label.trim() || 'this plan'}&rdquo;
                          </span>
                          <button
                            type="button"
                            onClick={() => addVariantGuarantee(index)}
                            className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-hover flex-shrink-0"
                          >
                            <Plus size={14} /> Add
                          </button>
                        </div>
                        {variant.guarantees.length === 0 ? (
                          <p className="text-[11px] text-slate-400">
                            Uses the shared warranty options below. Add rows here to give THIS plan its own warranty prices.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {variant.guarantees.map((g, gIndex) => (
                              <GuaranteeRowEditor
                                key={g.id}
                                row={g}
                                onChange={(field, value) => updateVariantGuarantee(index, gIndex, field, value)}
                                onRemove={() => removeVariantGuarantee(index, gIndex)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <p className="text-[11px] text-slate-400">
                    Shown in the customer&apos;s &quot;Product / Plan&quot; dropdown. Each plan can set its own
                    warranty prices; leave a plan&apos;s warranty list empty to use the shared options below.
                  </p>
                </div>
              )}
            </div>

            {/* Shared Warranty / Guarantee Options (fallback for plans without their own) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-black tracking-widest uppercase text-slate-600">
                  Shared Warranty / Guarantee Options (optional)
                </label>
                <button
                  type="button"
                  onClick={addGuarantee}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-hover"
                >
                  <Plus size={14} /> Add Warranty
                </button>
              </div>
              {guarantees.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No shared warranty options. These apply to any plan that doesn&apos;t set its own warranty
                  prices above. Add options like &quot;1 Month&quot;, &quot;3 Months&quot;, or &quot;Lifetime&quot; with a price.
                </p>
              ) : (
                <div className="space-y-2">
                  {/* Column hints on sm+ */}
                  <div className="hidden sm:grid sm:grid-cols-[minmax(0,1fr)_5rem_6rem_auto] gap-2 px-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Label</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Months</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total £</span>
                    <span />
                  </div>
                  {guarantees.map((g, index) => (
                    <GuaranteeRowEditor
                      key={g.id}
                      row={g}
                      onChange={(field, value) => updateGuarantee(index, field, value)}
                      onRemove={() => removeGuarantee(index)}
                    />
                  ))}
                  <p className="text-[11px] text-slate-400">
                    Shown on the product page under &quot;Warranty / Guarantee&quot; for plans without their own
                    prices. Monthly price is calculated from total ÷ months.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-black font-heading tracking-widest uppercase text-sm hover:bg-primary-hover shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && <Loader2 size={16} className="animate-spin" />}
              {isEdit ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
