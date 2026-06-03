'use client';

import { useState, useEffect } from 'react';
import AdminProtected from '@/components/admin/AdminProtected';
import { PromoBanner, PromoBannerType, PromoPlacement } from '@/types/promo';
import { fetchAdminApi } from '@/lib/api';
import { Trash2, Plus, Edit2, Power, Megaphone } from 'lucide-react';

type FormState = {
  title: string;
  subtitle: string;
  description: string;
  banner_type: PromoBannerType;
  placement: PromoPlacement;
  cta_text: string;
  cta_link: string;
  image_url: string;
  background_style: string;
  priority: string;
  is_active: boolean;
  starts_at: string;
  expires_at: string;
};

const EMPTY_FORM: FormState = {
  title: '',
  subtitle: '',
  description: '',
  banner_type: 'announcement',
  placement: 'home',
  cta_text: '',
  cta_link: '',
  image_url: '',
  background_style: '',
  priority: '0',
  is_active: true,
  starts_at: '',
  expires_at: '',
};

const BANNER_TYPES: { value: PromoBannerType; label: string }[] = [
  { value: 'announcement', label: 'Announcement' },
  { value: 'sale', label: 'Sale Banner' },
  { value: 'featured', label: 'Featured Banner' },
  { value: 'warning', label: 'Warning' },
  { value: 'info', label: 'Info Notice' },
];

const PLACEMENTS: { value: PromoPlacement; label: string }[] = [
  { value: 'home', label: 'Home' },
  { value: 'products', label: 'Products' },
  { value: 'checkout', label: 'Checkout' },
  { value: 'global', label: 'Global (all pages)' },
];

const BACKGROUND_STYLES: { value: string; label: string }[] = [
  { value: '', label: 'Default (based on type)' },
  { value: 'linear-gradient(90deg, #009ee3, #0072ff)', label: 'Blue Gradient' },
  { value: 'linear-gradient(90deg, #7c3aed, #4f46e5)', label: 'Violet Gradient' },
  { value: 'linear-gradient(90deg, #f59e0b, #ef4444)', label: 'Sunset Gradient' },
  { value: 'linear-gradient(90deg, #10b981, #059669)', label: 'Green Gradient' },
  { value: '#0f172a', label: 'Solid Dark' },
];

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

const TYPE_BADGE: Record<string, string> = {
  sale: 'bg-blue-50 text-blue-700 border-blue-200',
  featured: 'bg-violet-50 text-violet-700 border-violet-200',
  announcement: 'bg-slate-50 text-slate-700 border-slate-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
};

function AdminPromosContent() {
  const [banners, setBanners] = useState<PromoBanner[]>([]);
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
      const data = await fetchAdminApi<PromoBanner[]>('/api/admin/promos');
      setBanners(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load promo banners');
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
    if (!form.title.trim()) {
      setError('Banner title is required');
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
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        description: form.description.trim() || null,
        banner_type: form.banner_type,
        placement: form.placement,
        cta_text: form.cta_text.trim() || null,
        cta_link: form.cta_link.trim() || null,
        image_url: form.image_url.trim() || null,
        background_style: form.background_style || null,
        priority: form.priority ? Number(form.priority) : 0,
        is_active: form.is_active,
        starts_at: toIsoOrNull(form.starts_at),
        expires_at: toIsoOrNull(form.expires_at),
      };

      const endpoint = editingId ? `/api/admin/promos/${editingId}` : '/api/admin/promos';
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
        setError(data.message || 'Failed to save banner');
      }
    } catch (err: any) {
      setError(err.message || 'Error saving banner');
    }
  };

  const handleEdit = (b: PromoBanner) => {
    setForm({
      title: b.title,
      subtitle: b.subtitle || '',
      description: b.description || '',
      banner_type: b.banner_type,
      placement: b.placement,
      cta_text: b.cta_text || '',
      cta_link: b.cta_link || '',
      image_url: b.image_url || '',
      background_style: b.background_style || '',
      priority: String(b.priority ?? 0),
      is_active: b.is_active,
      starts_at: toLocalInput(b.starts_at),
      expires_at: toLocalInput(b.expires_at),
    });
    setEditingId(b.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggle = async (b: PromoBanner) => {
    try {
      const token = await getToken();
      if (!token) {
        setError('Session expired. Please log in again.');
        return;
      }
      const res = await fetch(`/api/admin/promos/${b.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_active: !b.is_active }),
      });
      const data = await res.json();
      if (data.success) await loadData();
      else setError(data.message || 'Failed to update banner');
    } catch (err: any) {
      setError(err.message || 'Error updating banner');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this promo banner?')) return;
    try {
      const token = await getToken();
      if (!token) {
        setError('Session expired. Please log in again.');
        return;
      }
      const res = await fetch(`/api/admin/promos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) await loadData();
      else setError(data.message || 'Failed to delete banner');
    } catch (err: any) {
      setError(err.message || 'Error deleting banner');
    }
  };

  const inputClass =
    'w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Megaphone size={22} className="text-blue-600" /> Promo Banners
          </h1>
          <p className="text-slate-600 mt-1">Manage store advertising banners ({banners.length} total)</p>
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
          {showForm ? 'Cancel' : 'Create Promo'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      {/* Create / edit form */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            {editingId ? 'Edit Promo Banner' : 'New Promo Banner'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Summer Sale"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Subtitle</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Save 10% today"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Priority</label>
              <input
                type="number"
                step="1"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Use coupon SAVE10 at checkout."
                rows={2}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Banner Type</label>
              <select
                value={form.banner_type}
                onChange={(e) => setForm({ ...form, banner_type: e.target.value as PromoBannerType })}
                className={inputClass}
              >
                {BANNER_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Placement</label>
              <select
                value={form.placement}
                onChange={(e) => setForm({ ...form, placement: e.target.value as PromoPlacement })}
                className={inputClass}
              >
                {PLACEMENTS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Call to Action Text <span className="font-normal text-slate-400">— optional</span>
              </label>
              <input
                type="text"
                value={form.cta_text}
                onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
                placeholder="Shop Now"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                CTA Link <span className="font-normal text-slate-400">— /products or https://…</span>
              </label>
              <input
                type="text"
                value={form.cta_link}
                onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
                placeholder="/products"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Image URL <span className="font-normal text-slate-400">— optional</span>
              </label>
              <input
                type="text"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://…"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Background Style</label>
              <select
                value={form.background_style}
                onChange={(e) => setForm({ ...form, background_style: e.target.value })}
                className={inputClass}
              >
                {BACKGROUND_STYLES.map((b) => (
                  <option key={b.label} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
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

            <div className="md:col-span-2 flex gap-3 pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {editingId ? 'Update Banner' : 'Create Banner'}
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
      ) : banners.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
          <p className="text-slate-600 text-lg">No promo banners yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Placement</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Window</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {banners.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 text-sm">
                    <span className="font-semibold text-slate-900">{b.title}</span>
                    {b.subtitle && <p className="text-xs text-slate-500 mt-0.5">{b.subtitle}</p>}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700 capitalize">{b.placement}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border capitalize ${
                        TYPE_BADGE[b.banner_type] || TYPE_BADGE.announcement
                      }`}
                    >
                      {b.banner_type}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                        b.is_active
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}
                    >
                      {b.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">{b.priority}</td>
                  <td className="px-4 py-4 text-xs text-slate-600">
                    {b.starts_at ? new Date(b.starts_at).toLocaleDateString() : '—'}
                    {' → '}
                    {b.expires_at ? new Date(b.expires_at).toLocaleDateString() : '∞'}
                  </td>
                  <td className="px-4 py-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => handleToggle(b)}
                      className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                      title={b.is_active ? 'Disable' : 'Enable'}
                    >
                      <Power size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(b)}
                      className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
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

export default function AdminPromosPage() {
  return (
    <AdminProtected>
      <AdminPromosContent />
    </AdminProtected>
  );
}
