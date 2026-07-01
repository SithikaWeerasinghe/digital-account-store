'use client';

import { useState, useEffect } from 'react';
import AdminProtected from '@/components/admin/AdminProtected';
import { DiscountCode, DiscountType } from '@/types/discount';
import { fetchAdminApi } from '@/lib/api';
import { Trash2, Plus, Edit2, Power, Tag } from 'lucide-react';

type FormState = {
  code: string;
  description: string;
  discount_type: DiscountType;
  discount_value: string;
  min_order_amount: string;
  max_discount_amount: string;
  usage_limit: string;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
};

const EMPTY_FORM: FormState = {
  code: '',
  description: '',
  discount_type: 'percentage',
  discount_value: '',
  min_order_amount: '',
  max_discount_amount: '',
  usage_limit: '',
  starts_at: '',
  expires_at: '',
  is_active: true,
};

// Convert an ISO timestamp to the value a <input type="datetime-local"> expects.
function toLocalInput(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toIsoOrNull(local: string): string | null {
  if (!local) return null;
  const d = new Date(local);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

async function getToken(): Promise<string | null> {
  const { supabase } = await import('@/lib/supabase');
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

function AdminDiscountsContent() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await fetchAdminApi<DiscountCode[]>('/api/admin/discounts');
      setCodes(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load coupons');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim() || !form.discount_value) {
      setError('Coupon code and discount value are required');
      return;
    }

    try {
      setError('');
      const token = await getToken();
      if (!token) {
        setError('Session expired. Please log in again.');
        return;
      }

      const payload = {
        code: form.code.trim().toUpperCase(),
        description: form.description.trim() || null,
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        min_order_amount: form.min_order_amount ? Number(form.min_order_amount) : 0,
        max_discount_amount: form.max_discount_amount ? Number(form.max_discount_amount) : null,
        usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
        starts_at: toIsoOrNull(form.starts_at),
        expires_at: toIsoOrNull(form.expires_at),
        is_active: form.is_active,
      };

      const endpoint = editingId ? `/api/admin/discounts/${editingId}` : '/api/admin/discounts';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        await loadData();
        resetForm();
      } else {
        setError(data.message || 'Failed to save coupon');
      }
    } catch (err: any) {
      setError(err.message || 'Error saving coupon');
    }
  };

  const handleEdit = (c: DiscountCode) => {
    setForm({
      code: c.code,
      description: c.description || '',
      discount_type: c.discount_type,
      discount_value: String(c.discount_value),
      min_order_amount: c.min_order_amount != null ? String(c.min_order_amount) : '',
      max_discount_amount: c.max_discount_amount != null ? String(c.max_discount_amount) : '',
      usage_limit: c.usage_limit != null ? String(c.usage_limit) : '',
      starts_at: toLocalInput(c.starts_at),
      expires_at: toLocalInput(c.expires_at),
      is_active: c.is_active,
    });
    setEditingId(c.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleActive = async (c: DiscountCode) => {
    try {
      const token = await getToken();
      if (!token) {
        setError('Session expired. Please log in again.');
        return;
      }
      const res = await fetch(`/api/admin/discounts/${c.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_active: !c.is_active }),
      });
      const data = await res.json();
      if (data.success) await loadData();
      else setError(data.message || 'Failed to update coupon');
    } catch (err: any) {
      setError(err.message || 'Error updating coupon');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon? (Used coupons are disabled instead of deleted.)')) return;
    try {
      const token = await getToken();
      if (!token) {
        setError('Session expired. Please log in again.');
        return;
      }
      const res = await fetch(`/api/admin/discounts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) await loadData();
      else setError(data.message || 'Failed to delete coupon');
    } catch (err: any) {
      setError(err.message || 'Error deleting coupon');
    }
  };

  const formatValue = (c: DiscountCode) =>
    c.discount_type === 'percentage' ? `${c.discount_value}%` : `£${Number(c.discount_value).toFixed(2)}`;

  const inputClass =
    'w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Tag size={22} className="text-blue-600" /> Coupons
          </h1>
          <p className="text-slate-600 mt-1">Create and manage discount codes ({codes.length} total)</p>
        </div>
        <button
          onClick={() => {
            setForm(EMPTY_FORM);
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <Plus size={18} />
          {showForm ? 'Cancel' : 'Create Coupon'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      {/* Create / Edit form */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            {editingId ? 'Edit Coupon' : 'New Coupon'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Code</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="SAVE10"
                className={`${inputClass} font-mono uppercase`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="10% off everything"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Discount Type</label>
              <select
                value={form.discount_type}
                onChange={(e) => setForm({ ...form, discount_type: e.target.value as DiscountType })}
                className={inputClass}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Discount Value {form.discount_type === 'percentage' ? '(%)' : '(£)'}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.discount_value}
                onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                placeholder={form.discount_type === 'percentage' ? '10' : '5.00'}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Minimum Order Amount (£)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.min_order_amount}
                onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
                placeholder="0.00"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Maximum Discount Amount (£) <span className="font-normal text-slate-400">— optional</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.max_discount_amount}
                onChange={(e) => setForm({ ...form, max_discount_amount: e.target.value })}
                placeholder="No cap"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Usage Limit <span className="font-normal text-slate-400">— optional</span>
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={form.usage_limit}
                onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
                placeholder="Unlimited"
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-3 pt-7">
              <input
                id="is_active"
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="is_active" className="text-sm font-semibold text-slate-700">
                Active
              </label>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Starts At <span className="font-normal text-slate-400">— optional</span>
              </label>
              <input
                type="datetime-local"
                value={form.starts_at}
                onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Expires At <span className="font-normal text-slate-400">— optional</span>
              </label>
              <input
                type="datetime-local"
                value={form.expires_at}
                onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2 flex gap-3 pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {editingId ? 'Update Coupon' : 'Create Coupon'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : codes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
          <p className="text-slate-600 text-lg">No coupons yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Value</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Used</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Expires</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {codes.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 text-sm">
                    <span className="font-mono font-bold text-slate-900">{c.code}</span>
                    {c.description && <p className="text-xs text-slate-500 mt-0.5">{c.description}</p>}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700 capitalize">{c.discount_type}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-900">{formatValue(c)}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                        c.is_active
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}
                    >
                      {c.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {c.used_count}
                    {c.usage_limit != null ? ` / ${c.usage_limit}` : ''}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(c)}
                      className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                      title={c.is_active ? 'Disable' : 'Enable'}
                    >
                      <Power size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(c)}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminDiscountsPage() {
  return (
    <AdminProtected>
      <AdminDiscountsContent />
    </AdminProtected>
  );
}
