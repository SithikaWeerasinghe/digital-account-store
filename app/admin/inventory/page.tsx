'use client';

import { useState, useEffect } from 'react';
import AdminProtected from '@/components/admin/AdminProtected';
import { InventoryItem } from '@/types/inventory';
import { Product } from '@/types/product';
import { fetchProducts, fetchAdminApi } from '@/lib/api';
import { Trash2, Eye, EyeOff, Plus, Edit2 } from 'lucide-react';

function AdminInventoryContent() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    product_id: '',
    title: '',
    delivery_content: '',
  });

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

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_id || !formData.delivery_content) {
      setError('Product and delivery content are required');
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

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        await loadData();
        setFormData({ product_id: '', title: '', delivery_content: '' });
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
      title: item.title || '',
      delivery_content: item.delivery_content,
    });
    setEditingId(item.id);
    setShowForm(true);
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
            setFormData({ product_id: '', title: '', delivery_content: '' });
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
                onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
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
                  setFormData({ product_id: '', title: '', delivery_content: '' });
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
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Product</th>
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
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.customer_email || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 flex justify-end">
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
