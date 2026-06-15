'use client';

import { useState, useEffect, useMemo } from 'react';
import AdminProtected from '@/components/admin/AdminProtected';
import { InventoryItem } from '@/types/inventory';
import { Product, GuaranteeOption } from '@/types/product';
import { fetchProducts, fetchAdminApi } from '@/lib/api';
import { resolveGuaranteeOptions } from '@/lib/productUtils';
import { Trash2, Eye, EyeOff, Plus, Edit2 } from 'lucide-react';

type FormData = {
  product_id: string;
  product_option_id: string;
  product_option_label: string;
  guarantee_id: string;
  guarantee_label: string;
  title: string;
  delivery_content: string;
  usage_instructions: string;
};

const EMPTY_FORM: FormData = {
  product_id: '',
  product_option_id: '',
  product_option_label: '',
  guarantee_id: '',
  guarantee_label: '',
  title: '',
  delivery_content: '',
  usage_instructions: '',
};

function AdminInventoryContent() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  // Load inventory and products
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [items, productsRes] = await Promise.all([
        fetchAdminApi<InventoryItem[]>('/api/admin/inventory'),
        fetchProducts(),
      ]);

      setItems((items as InventoryItem[]) || []);
      setProducts(productsRes || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  // The product currently selected in the form (for option/guarantee dropdowns).
  const selectedProduct = useMemo(
    () => products.find((p) => p.id === formData.product_id),
    [products, formData.product_id]
  );

  // The customer-facing selection list keys the variant inventory. Prefer the
  // product's `options`; fall back to `variants` (DB products often only carry
  // variants). The chosen id MUST match what the product page sends as
  // product_option_id, otherwise stock counts won't line up.
  const variantChoices = useMemo(
    () => {
      if (!selectedProduct) return [] as { id: string; label: string; price: number; badge?: string }[];
      if (selectedProduct.options?.length) {
        return selectedProduct.options.map((o) => ({
          id: o.id,
          label: o.label,
          price: o.price,
          badge: o.badge,
        }));
      }
      if (selectedProduct.variants?.length) {
        return selectedProduct.variants.map((v) => ({
          id: v.id,
          label: v.label,
          price: v.price,
          badge: undefined,
        }));
      }
      return [];
    },
    [selectedProduct]
  );

  // Warranty/duration options for the selected product/plan. Resolved with the
  // SAME logic the customer product page uses (resolveGuaranteeOptions), so the
  // guarantee IDs the admin tags here line up exactly with what an order
  // carries — otherwise warranty-scoped stock would never match. For an
  // options-based product the selected option drives per-option warranties;
  // variant-only products use product-level warranties (no generated defaults).
  const selectedOptionObj = useMemo(
    () => selectedProduct?.options?.find((o) => o.id === formData.product_option_id) ?? null,
    [selectedProduct, formData.product_option_id]
  );
  const guaranteeOptions: GuaranteeOption[] = useMemo(
    () => resolveGuaranteeOptions(selectedProduct ?? null, selectedOptionObj),
    [selectedProduct, selectedOptionObj]
  );

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_id || !formData.delivery_content) {
      setError('Product and delivery content are required');
      return;
    }

    // When the product has options/variants, an option is mandatory so the
    // stock is keyed correctly (otherwise it becomes product-level inventory).
    if (variantChoices.length > 0 && !formData.product_option_id) {
      setError('Please select a product option for this inventory item.');
      return;
    }

    // When the selected product/plan has warranty options, a warranty is
    // mandatory: inventory is separated per warranty, so an untagged item would
    // never match any warranty-specific order. If no warranty exists for the
    // plan, the item is saved without one (product/plan-level stock).
    if (guaranteeOptions.length > 0 && !formData.guarantee_id) {
      setError('Please select a warranty / duration for this inventory item.');
      return;
    }

    try {
      setError('');
      const supabaseModule = await import('@/lib/supabase');
      const supabase = supabaseModule.supabase;

      if (!supabase) {
        setError('Supabase is not configured');
        return;
      }

      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setError('Session expired. Please log in again.');
        return;
      }

      const method = editingId ? 'PATCH' : 'POST';
      const endpoint = editingId ? `/api/admin/inventory/${editingId}` : '/api/admin/inventory';

      // Send null (not empty string) for unset option/guarantee.
      const payload = {
        product_id: formData.product_id,
        title: formData.title,
        delivery_content: formData.delivery_content,
        product_option_id: formData.product_option_id || null,
        product_option_label: formData.product_option_label || null,
        guarantee_id: formData.guarantee_id || null,
        guarantee_label: formData.guarantee_label || null,
        usage_instructions: formData.usage_instructions || null,
      };

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        await loadData();
        setFormData(EMPTY_FORM);
        setShowForm(false);
        setEditingId(null);
      } else {
        setError(data.message || 'Failed to save item');
      }
    } catch (err: any) {
      setError(err.message || 'Error saving item');
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setFormData({
      product_id: item.product_id,
      product_option_id: item.product_option_id || '',
      product_option_label: item.product_option_label || '',
      guarantee_id: item.guarantee_id || '',
      guarantee_label: item.guarantee_label || '',
      title: item.title || '',
      delivery_content: item.delivery_content,
      usage_instructions: item.usage_instructions || '',
    });
    setEditingId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this inventory item?')) return;

    try {
      const supabaseModule = await import('@/lib/supabase');
      const supabase = supabaseModule.supabase;

      if (!supabase) {
        setError('Supabase is not configured');
        return;
      }

      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setError('Session expired. Please log in again.');
        return;
      }

      const res = await fetch(`/api/admin/inventory/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        await loadData();
      } else {
        setError(data.message || 'Failed to delete');
      }
    } catch (err: any) {
      setError(err.message || 'Error deleting item');
    }
  };

  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || productId;
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'sold':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'disabled':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'reserved':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
          <p className="text-slate-600 mt-1">Manage digital product delivery items ({items.length} total)</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData(EMPTY_FORM);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <Plus size={18} />
          {showForm ? 'Cancel' : 'Add Item'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            {editingId ? 'Edit Item' : 'Add New Inventory Item'}
          </h2>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Product</label>
              <select
                value={formData.product_id}
                onChange={(e) =>
                  // Changing the product resets option/guarantee selection.
                  setFormData({
                    ...formData,
                    product_id: e.target.value,
                    product_option_id: '',
                    product_option_label: '',
                    guarantee_id: '',
                    guarantee_label: '',
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Select a product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Option / Variant — shown only if the product has options/variants */}
            {variantChoices.length > 0 ? (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Option / Variant <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.product_option_id}
                  onChange={(e) => {
                    const opt = variantChoices.find((o) => o.id === e.target.value);
                    setFormData({
                      ...formData,
                      product_option_id: opt?.id || '',
                      product_option_label: opt?.label || '',
                      // Reset guarantee when the option changes.
                      guarantee_id: '',
                      guarantee_label: '',
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select an option / variant</option>
                  {variantChoices.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label} — €{Number(o.price).toFixed(2)}
                      {o.badge ? ` (${o.badge})` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-1">
                  Stock added here is delivered only when the customer selects this exact option.
                </p>
              </div>
            ) : null}

            {/* Warranty / Duration — required when the plan has warranties, so
                inventory is separated per warranty (1 Month stock is never
                delivered for a 3 Months order). */}
            {guaranteeOptions.length > 0 ? (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Warranty / Duration <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.guarantee_id}
                  onChange={(e) => {
                    const g = guaranteeOptions.find((x) => x.id === e.target.value);
                    setFormData({
                      ...formData,
                      guarantee_id: g?.id || '',
                      guarantee_label: g?.label || '',
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select a warranty / duration</option>
                  {guaranteeOptions.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-1">
                  Stock added here is delivered only when the customer selects this exact warranty / duration.
                </p>
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Title (optional)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Account #12345"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Delivery Content (required)</label>
              <textarea
                value={formData.delivery_content}
                onChange={(e) => setFormData({ ...formData, delivery_content: e.target.value })}
                placeholder="Email / Password&#10;License Key&#10;Activation Code&#10;Setup Notes"
                rows={6}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Usage Instructions (optional)</label>
              <textarea
                value={formData.usage_instructions}
                onChange={(e) => setFormData({ ...formData, usage_instructions: e.target.value })}
                placeholder="How to use this product — included in the delivery email.&#10;e.g. 1) Go to the site  2) Log in with the details above  3) Enjoy."
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
              <p className="text-xs text-slate-400 mt-1">
                Overrides the product-level instructions for this specific item. Leave blank to use the product default.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {editingId ? 'Update Item' : 'Add Item'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData(EMPTY_FORM);
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Items List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
          <p className="text-slate-600 text-lg">No inventory items yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Option / Variant</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Guarantee</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Customer Email</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{item.title || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{getProductName(item.product_id)}</td>
                  <td className="px-6 py-4 text-sm">
                    {item.product_option_label ? (
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold border bg-indigo-50 text-indigo-700 border-indigo-200">
                        {item.product_option_label}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Product-level inventory</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.guarantee_label || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.customer_email || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Reveal delivery content"
                    >
                      {expandedId === item.id ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    {item.status !== 'sold' && (
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {item.status !== 'sold' && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Expanded content */}
          {expandedId && (
            <div className="bg-slate-50 border-t border-slate-200 p-6">
              {(() => {
                const item = items.find((i) => i.id === expandedId);
                return (
                  <div>
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Delivery Content</p>
                    <pre className="bg-white border border-slate-300 rounded p-4 text-sm text-slate-900 overflow-x-auto font-mono">
                      {item?.delivery_content}
                    </pre>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminInventoryPage() {
  return (
    <AdminProtected>
      <AdminInventoryContent />
    </AdminProtected>
  );
}
