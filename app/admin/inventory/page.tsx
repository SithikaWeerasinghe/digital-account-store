'use client';

import { useState, useEffect, useMemo, Fragment } from 'react';
import AdminProtected from '@/components/admin/AdminProtected';
import { InventoryItem } from '@/types/inventory';
import { Product, GuaranteeOption } from '@/types/product';
import { fetchProducts, fetchAdminApi } from '@/lib/api';
import { resolveGuaranteeOptions, guaranteeSourceForPlan } from '@/lib/productUtils';
import { parseBulkAccounts, type BulkSplitMode } from '@/lib/utils';
import { Trash2, Eye, EyeOff, Plus, Edit2, ChevronRight, Layers } from 'lucide-react';

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

/**
 * A display-only grouping of inventory rows that share the exact same
 * product + plan/option + warranty/guarantee. The database still stores one
 * row per account (safe for stock counting and delivery); this only collapses
 * the admin table so many pasted accounts appear as a single line.
 */
interface InventoryGroup {
  key: string;
  product_id: string;
  product_option_id: string | null;
  product_option_label: string | null;
  guarantee_id: string | null;
  guarantee_label: string | null;
  items: InventoryItem[];
  available: number;
  sold: number;
  other: number;
}

/** Group key = the exact stock-separation combination. */
const groupKeyOf = (i: { product_id: string; product_option_id?: string | null; guarantee_id?: string | null }) =>
  `${i.product_id}|${i.product_option_id || ''}|${i.guarantee_id || ''}`;

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
  const [expandedId, setExpandedId] = useState<string | null>(null); // a single account's revealed content
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null); // an expanded product
  const [expandedGroupKey, setExpandedGroupKey] = useState<string | null>(null); // an expanded plan/warranty group
  const [reassignSelections, setReassignSelections] = useState<Record<string, string>>({}); // per-group chosen warranty id
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // How a paste is split into individual accounts. 'single' = one item (legacy
  // flow); 'lines'/'blocks' = bulk, one deliverable stock unit per account.
  const [splitMode, setSplitMode] = useState<'single' | BulkSplitMode>('single');

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
  // The selected plan as a guarantee source — option OR variant — using the
  // SAME rule as the storefront so per-plan warranties resolve identically.
  const selectedPlanObj = useMemo(() => {
    if (!selectedProduct) return null;
    const opt = selectedProduct.options?.find((o) => o.id === formData.product_option_id) ?? null;
    const v = selectedProduct.variants?.find((x) => x.id === formData.product_option_id) ?? null;
    return guaranteeSourceForPlan(opt, v);
  }, [selectedProduct, formData.product_option_id]);
  // The product's real warranty axis — i.e. what a customer can actually pick.
  const resolvedGuarantees: GuaranteeOption[] = useMemo(
    () => resolveGuaranteeOptions(selectedProduct ?? null, selectedPlanObj),
    [selectedProduct, selectedPlanObj]
  );
  // Whether this product/plan genuinely offers warranties to customers. Only
  // then is a warranty selection required (and only then can stock be split by
  // warranty). Products that just use plans/variants have no warranty axis.
  const productHasWarranties = resolvedGuarantees.length > 0;

  // The list rendered in the warranty dropdown. When editing an item whose
  // stored guarantee is no longer part of the product's resolved set (e.g.
  // legacy data created before this product's warranties changed/were removed),
  // we still surface it so the admin can SEE it and correct or clear it — it is
  // never silently stuck/hidden.
  const guaranteeChoices: GuaranteeOption[] = useMemo(() => {
    const list = [...resolvedGuarantees];
    if (formData.guarantee_id && !list.some((g) => g.id === formData.guarantee_id)) {
      list.push({
        id: formData.guarantee_id,
        label: formData.guarantee_label || formData.guarantee_id,
        months: 0,
        total_price: 0,
        monthly_price: 0,
      });
    }
    return list;
  }, [resolvedGuarantees, formData.guarantee_id, formData.guarantee_label]);

  // Live preview of how many stock items a bulk paste will create.
  const bulkAccounts = useMemo(
    () => (splitMode === 'single' ? [] : parseBulkAccounts(formData.delivery_content, splitMode)),
    [splitMode, formData.delivery_content]
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

    // When the selected product/plan actually offers warranties to customers, a
    // warranty is mandatory: inventory is separated per warranty, so an untagged
    // item would never match any warranty-specific order. Products that only use
    // plans/variants have no warranty axis and are saved without one.
    if (productHasWarranties && !formData.guarantee_id) {
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

      // Bulk only applies when creating: split the paste into one account each.
      const isBulk = !editingId && splitMode !== 'single';
      const accounts = isBulk ? parseBulkAccounts(formData.delivery_content, splitMode) : [];
      if (isBulk && accounts.length === 0) {
        setError('Paste at least one account.');
        return;
      }

      // Send null (not empty string) for unset option/guarantee. For bulk we
      // send delivery_contents[] (one row per account); otherwise a single
      // delivery_content (unchanged single-item flow).
      const payload: Record<string, any> = {
        product_id: formData.product_id,
        title: formData.title,
        product_option_id: formData.product_option_id || null,
        product_option_label: formData.product_option_label || null,
        guarantee_id: formData.guarantee_id || null,
        guarantee_label: formData.guarantee_label || null,
        usage_instructions: formData.usage_instructions || null,
      };
      if (isBulk) {
        payload.delivery_contents = accounts;
      } else {
        payload.delivery_content = formData.delivery_content;
      }

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
        const count = Number(data.count ?? 1);
        const message = editingId
          ? 'Inventory item updated.'
          : count > 1
            ? `Created ${count} stock items from your paste.`
            : 'Inventory item added.';
        await loadData();
        setFormData(EMPTY_FORM);
        setSplitMode('single');
        setShowForm(false);
        setEditingId(null);
        setSuccessMessage(message);
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
    setSplitMode('single'); // editing is always a single item
    setSuccessMessage('');
    setEditingId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Returns the admin access token (or null, after setting an error).
  const getAccessToken = async (): Promise<string | null> => {
    const supabaseModule = await import('@/lib/supabase');
    const supabase = supabaseModule.supabase;
    if (!supabase) {
      setError('Supabase is not configured');
      return null;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      setError('Session expired. Please log in again.');
      return null;
    }
    return session.access_token;
  };

  // Deletes one inventory row by id. Returns true on success.
  const deleteItemById = async (id: string, token: string): Promise<boolean> => {
    const res = await fetch(`/api/admin/inventory/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return !!data.success;
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this account from inventory?')) return;
    try {
      setError('');
      const token = await getAccessToken();
      if (!token) return;
      const ok = await deleteItemById(id, token);
      if (ok) {
        await loadData();
        setSuccessMessage('Account deleted.');
      } else {
        setError('Failed to delete account.');
      }
    } catch (err: any) {
      setError(err.message || 'Error deleting item');
    }
  };

  // Opens the Add form pre-filled with a group's product + plan + warranty so
  // pasted accounts join the SAME group (grouping is keyed by those fields).
  const handleAddToGroup = (group: InventoryGroup) => {
    setFormData({
      product_id: group.product_id,
      product_option_id: group.product_option_id || '',
      product_option_label: group.product_option_label || '',
      guarantee_id: group.guarantee_id || '',
      guarantee_label: group.guarantee_label || '',
      title: '',
      delivery_content: '',
      usage_instructions: '',
    });
    setEditingId(null);
    setSplitMode('lines'); // adding to a group is usually a bulk paste
    setSuccessMessage('');
    setError('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Deletes every deletable (non-sold) account in a group. Sold/delivered rows
  // are kept for order history and never hard-deleted.
  const handleDeleteGroup = async (group: InventoryGroup) => {
    const deletable = group.items.filter((i) => i.status !== 'sold');
    if (deletable.length === 0) {
      setError('This group only contains sold/delivered accounts, which are kept for order history.');
      return;
    }
    const soldNote =
      group.sold > 0 ? `\n\n${group.sold} sold/delivered account(s) will be kept for order history.` : '';
    if (!confirm(`Delete ${deletable.length} account(s) in this group?${soldNote}`)) return;

    try {
      setError('');
      const token = await getAccessToken();
      if (!token) return;
      let failed = 0;
      for (const it of deletable) {
        const ok = await deleteItemById(it.id, token);
        if (!ok) failed++;
      }
      await loadData();
      if (failed > 0) {
        setError(`Deleted ${deletable.length - failed} of ${deletable.length}; ${failed} could not be deleted.`);
      } else {
        setSuccessMessage(`Deleted ${deletable.length} account(s) from the group.`);
      }
    } catch (err: any) {
      setError(err.message || 'Error deleting group');
    }
  };

  // The warranty options a group's stock can be (re)assigned to — exactly the
  // ones the product/plan really offers customers (so tagged stock matches an
  // order). Empty when the product has no warranty layer → only "No warranty".
  const warrantiesForGroup = (group: InventoryGroup): GuaranteeOption[] => {
    const product = products.find((p) => p.id === group.product_id);
    if (!product) return [];
    const opt = product.options?.find((o) => o.id === group.product_option_id) ?? null;
    const v = product.variants?.find((x) => x.id === group.product_option_id) ?? null;
    return resolveGuaranteeOptions(product, guaranteeSourceForPlan(opt, v));
  };

  // Reassigns the warranty tag on every editable (non-sold) account in a group.
  // Fixes legacy/mismatched rows: e.g. accounts saved with no warranty (or the
  // wrong one) can be set to the warranty customers actually select, so the
  // exact product+plan+warranty stock lookup finds them.
  const handleReassignGroup = async (group: InventoryGroup, guaranteeId: string, guaranteeLabel: string | null) => {
    const targets = group.items.filter((i) => i.status !== 'sold');
    if (targets.length === 0) {
      setError('No editable accounts in this group (sold/delivered accounts are locked).');
      return;
    }
    if (!confirm(`Set warranty to "${guaranteeLabel || 'No warranty (general stock)'}" for ${targets.length} account(s)?`)) return;
    try {
      setError('');
      const token = await getAccessToken();
      if (!token) return;
      let failed = 0;
      for (const it of targets) {
        const res = await fetch(`/api/admin/inventory/${it.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ guarantee_id: guaranteeId || null, guarantee_label: guaranteeLabel || null }),
        });
        const data = await res.json();
        if (!data.success) failed++;
      }
      await loadData();
      setExpandedGroupKey(null);
      if (failed > 0) setError(`Reassigned ${targets.length - failed} of ${targets.length}; ${failed} failed.`);
      else setSuccessMessage(`Reassigned ${targets.length} account(s) to "${guaranteeLabel || 'No warranty (general stock)'}".`);
    } catch (err: any) {
      setError(err.message || 'Error reassigning warranty');
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

  // Group rows by the exact product + plan + warranty combination for display.
  // Counts (available / sold) are derived from the underlying rows, so the
  // "Available" number always equals the real deliverable stock for that combo.
  const groups: InventoryGroup[] = useMemo(() => {
    const map = new Map<string, InventoryGroup>();
    for (const item of items) {
      const key = groupKeyOf(item);
      let g = map.get(key);
      if (!g) {
        g = {
          key,
          product_id: item.product_id,
          product_option_id: item.product_option_id ?? null,
          product_option_label: item.product_option_label ?? null,
          guarantee_id: item.guarantee_id ?? null,
          guarantee_label: item.guarantee_label ?? null,
          items: [],
          available: 0,
          sold: 0,
          other: 0,
        };
        map.set(key, g);
      }
      // Backfill labels from whichever row carries them.
      if (!g.product_option_label && item.product_option_label) g.product_option_label = item.product_option_label;
      if (!g.guarantee_label && item.guarantee_label) g.guarantee_label = item.guarantee_label;
      g.items.push(item);
      if (item.status === 'available') g.available++;
      else if (item.status === 'sold') g.sold++;
      else g.other++;
    }
    return Array.from(map.values()).sort((a, b) => {
      const pa = getProductName(a.product_id);
      const pb = getProductName(b.product_id);
      if (pa !== pb) return pa.localeCompare(pb);
      return (a.product_option_label || '').localeCompare(b.product_option_label || '');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, products]);

  // Product-first view: one top row per PRODUCT, with its plan/warranty combos
  // nested inside (the customer wants fewer top-level lines).
  const productGroups = useMemo(() => {
    const map = new Map<
      string,
      { product_id: string; name: string; combos: InventoryGroup[]; available: number; sold: number; accounts: number }
    >();
    for (const g of groups) {
      let pg = map.get(g.product_id);
      if (!pg) {
        pg = { product_id: g.product_id, name: getProductName(g.product_id), combos: [], available: 0, sold: 0, accounts: 0 };
        map.set(g.product_id, pg);
      }
      pg.combos.push(g);
      pg.available += g.available;
      pg.sold += g.sold;
      pg.accounts += g.items.length;
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, products]);

  // The expanded detail for one plan/warranty combo: a reassign-warranty tool,
  // a mismatch note, and the individual accounts (reveal/edit/delete).
  const renderComboDetail = (group: InventoryGroup) => {
    const choices = warrantiesForGroup(group);
    const current = reassignSelections[group.key] ?? (group.guarantee_id ?? '');
    const siblings = groups.filter(
      (s) =>
        s.key !== group.key &&
        s.product_id === group.product_id &&
        (s.product_option_id ?? '') === (group.product_option_id ?? '')
    );
    return (
      <>
        {/* #6 — why a warranty might show 0 at checkout */}
        {siblings.length > 0 && (
          <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
            This plan also has stock under other warranties:{' '}
            {siblings.map((s) => `${s.guarantee_label || 'No warranty'} (${s.available} avail.)`).join(', ')}. A customer
            only receives stock matching the EXACT warranty they select — if they pick a warranty with 0 here, checkout
            shows &quot;0 available&quot;. Reassign below to fix.
          </div>
        )}
        {/* Reassign-warranty tool: fixes legacy/mismatched rows. */}
        <div className="flex flex-wrap items-end gap-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="min-w-[200px]">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Reassign warranty for all accounts
            </label>
            <select
              value={current}
              onChange={(e) => setReassignSelections((prev) => ({ ...prev, [group.key]: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">No warranty (general stock for this plan)</option>
              {choices.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => {
              const g = choices.find((x) => x.id === current);
              handleReassignGroup(group, current, g?.label ?? null);
            }}
            className="px-3 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-900 transition-colors"
          >
            Apply to {group.items.filter((i) => i.status !== 'sold').length} account(s)
          </button>
        </div>

        {group.items.map((item) => (
          <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{item.title || 'Account'}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadgeStyle(item.status)}`}>
                    {item.status}
                  </span>
                  {item.customer_email && <span className="text-xs text-slate-500">{item.customer_email}</span>}
                  {item.created_at && (
                    <span className="text-xs text-slate-400">{new Date(item.created_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
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
                    title="Edit account"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
                {item.status !== 'sold' && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete account"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
            {expandedId === item.id && (
              <div className="mt-3">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Delivery Content</p>
                <pre className="bg-white border border-slate-300 rounded p-3 text-sm text-slate-900 overflow-x-auto font-mono whitespace-pre-wrap">
                  {item.delivery_content}
                </pre>
              </div>
            )}
          </div>
        ))}

        <div className="pt-1">
          <button
            onClick={() => handleAddToGroup(group)}
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <Plus size={15} /> Add accounts to this plan/warranty
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
          <p className="text-slate-600 mt-1">
            Grouped by product · plan · warranty ({groups.length} group{groups.length === 1 ? '' : 's'} ·{' '}
            {items.length} account{items.length === 1 ? '' : 's'})
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData(EMPTY_FORM);
            setSplitMode('single');
            setSuccessMessage('');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <Plus size={18} />
          {showForm ? 'Cancel' : 'Add Item'}
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

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
                      {o.label} — £{Number(o.price).toFixed(2)}
                      {o.badge ? ` (${o.badge})` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-1">
                  Stock added here is delivered only when the customer selects this exact option.
                </p>
              </div>
            ) : null}

            {/* Warranty / Duration — shown whenever the product/plan offers
                warranties to customers, OR when the item being edited already
                carries a stored warranty (so legacy/orphaned values stay
                visible and editable). Required only when the product genuinely
                has a warranty axis, so inventory is separated per warranty
                (1 Month stock is never delivered for a 3 Months order). */}
            {guaranteeChoices.length > 0 ? (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Warranty / Duration{' '}
                  {productHasWarranties ? (
                    <span className="text-red-500">*</span>
                  ) : (
                    <span className="font-normal text-slate-400">— stored on this item</span>
                  )}
                </label>
                <select
                  value={formData.guarantee_id}
                  onChange={(e) => {
                    const g = guaranteeChoices.find((x) => x.id === e.target.value);
                    setFormData({
                      ...formData,
                      guarantee_id: g?.id || '',
                      guarantee_label: g?.label || '',
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">
                    {productHasWarranties ? 'Select a warranty / duration' : 'No warranty (clear)'}
                  </option>
                  {guaranteeChoices.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-1">
                  {productHasWarranties
                    ? 'Stock added here is delivered only when the customer selects this exact warranty / duration.'
                    : 'This product has no warranty options, so this item is delivered for any purchase of the selected plan. Choose “No warranty (clear)” to remove a leftover warranty tag.'}
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                <label className="block text-sm font-semibold text-slate-700">
                  {editingId || splitMode === 'single' ? 'Delivery Content (required)' : 'Accounts (required)'}
                </label>
                {/* Bulk control — only when adding (editing is a single item). */}
                {!editingId && (
                  <div className="flex items-center gap-2">
                    <label htmlFor="split-mode" className="text-xs font-medium text-slate-500 whitespace-nowrap">
                      Add as
                    </label>
                    <select
                      id="split-mode"
                      value={splitMode}
                      onChange={(e) => setSplitMode(e.target.value as 'single' | BulkSplitMode)}
                      className="px-2 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="single">Single item</option>
                      <option value="lines">Multiple — one account per line</option>
                      <option value="blocks">Multiple — one account per blank-line block</option>
                    </select>
                  </div>
                )}
              </div>
              <textarea
                value={formData.delivery_content}
                onChange={(e) => setFormData({ ...formData, delivery_content: e.target.value })}
                placeholder={
                  !editingId && splitMode === 'blocks'
                    ? 'Email / Password\nExtra notes\n\nEmail / Password\nExtra notes\n\n(separate each account with a blank line)'
                    : !editingId && splitMode === 'lines'
                      ? 'email1:password1\nemail2:password2\nemail3:password3'
                      : 'Email / Password\nLicense Key\nActivation Code\nSetup Notes'
                }
                rows={!editingId && splitMode !== 'single' ? 10 : 6}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-sm"
              />
              {!editingId && splitMode !== 'single' ? (
                <p className="text-xs text-slate-500 mt-1">
                  {splitMode === 'lines'
                    ? 'One account per line — each non-empty line becomes a separate deliverable stock item.'
                    : 'One account per block, separated by a blank line — each block becomes a separate deliverable stock item.'}{' '}
                  <span className="font-semibold text-slate-700">
                    {bulkAccounts.length} stock item{bulkAccounts.length === 1 ? '' : 's'}
                  </span>{' '}
                  will be created for the selected product / plan / warranty.
                </p>
              ) : (
                <p className="text-xs text-slate-400 mt-1">
                  The exact credentials delivered to the customer for this one account.
                </p>
              )}
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
                  setSplitMode('single');
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inventory — one row per PRODUCT; expand for the plan/warranty breakdown
          and individual accounts (storage stays one row per account internally). */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : productGroups.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
          <p className="text-slate-600 text-lg">No inventory items yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Plan / Warranty Groups</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Available</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Sold</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {productGroups.map((pg) => {
                const productOpen = expandedProductId === pg.product_id;
                return (
                  <Fragment key={pg.product_id}>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-800 font-semibold">{pg.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {pg.combos.length} group{pg.combos.length === 1 ? '' : 's'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold border bg-green-50 text-green-700 border-green-200">
                          {pg.available}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {pg.sold > 0 ? (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold border bg-blue-50 text-blue-700 border-blue-200">
                            {pg.sold}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setExpandedProductId(productOpen ? null : pg.product_id);
                            setExpandedGroupKey(null);
                            setExpandedId(null);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title={productOpen ? 'Hide breakdown' : 'View plan/warranty breakdown'}
                        >
                          <ChevronRight size={16} className={`transition-transform ${productOpen ? 'rotate-90' : ''}`} />
                          <span className="text-xs font-semibold">
                            {pg.accounts} acct{pg.accounts === 1 ? '' : 's'}
                          </span>
                        </button>
                      </td>
                    </tr>

                    {productOpen && (
                      <tr>
                        <td colSpan={5} className="bg-slate-50 p-0">
                          <div className="p-4 space-y-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                              <Layers size={14} /> Plan / warranty breakdown
                            </div>
                            {pg.combos.map((group) => {
                              const isOpen = expandedGroupKey === group.key;
                              return (
                                <div key={group.key} className="bg-white border border-slate-200 rounded-lg">
                                  <div className="flex flex-wrap items-center justify-between gap-3 p-3">
                                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                                      {group.product_option_label ? (
                                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold border bg-indigo-50 text-indigo-700 border-indigo-200">
                                          {group.product_option_label}
                                        </span>
                                      ) : (
                                        <span className="text-xs text-slate-400 italic">Product-level</span>
                                      )}
                                      <span className="text-xs text-slate-500">
                                        {group.guarantee_label ? `· ${group.guarantee_label}` : '· No warranty'}
                                      </span>
                                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-green-50 text-green-700 border-green-200">
                                        {group.available} available
                                      </span>
                                      {group.sold > 0 && (
                                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-blue-50 text-blue-700 border-blue-200">
                                          {group.sold} sold
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      <button
                                        onClick={() => {
                                          setExpandedGroupKey(isOpen ? null : group.key);
                                          setExpandedId(null);
                                        }}
                                        className="inline-flex items-center gap-1 px-2 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        title={isOpen ? 'Hide accounts' : 'View accounts'}
                                      >
                                        <ChevronRight size={16} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                                        <span className="text-xs font-semibold">{group.items.length}</span>
                                      </button>
                                      <button
                                        onClick={() => handleAddToGroup(group)}
                                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        title="Add accounts to this plan/warranty"
                                      >
                                        <Plus size={16} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteGroup(group)}
                                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Delete available stock in this plan/warranty"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </div>
                                  {isOpen && (
                                    <div className="border-t border-slate-200 p-3 space-y-2">{renderComboDetail(group)}</div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
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
