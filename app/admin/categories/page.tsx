'use client';

import { useState, useEffect } from 'react';
import AdminProtected from '@/components/admin/AdminProtected';
import { fetchAdminCategories, createCategory, updateCategory, CategoryDTO } from '@/lib/api';
import { Plus, Loader2, AlertCircle, CheckCircle2, ArrowUp, ArrowDown, Power } from 'lucide-react';

function AdminCategoriesContent() {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // New category form
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await fetchAdminCategories();
      setCategories(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const flashSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setError('Category name is required.');
      return;
    }
    try {
      setCreating(true);
      setError('');
      const created = await createCategory({
        name: newName.trim(),
        description: newDescription.trim() || null,
        sort_order: categories.length + 1,
      });
      setCategories((prev) => [...prev, created].sort((a, b) => a.sort_order - b.sort_order));
      setNewName('');
      setNewDescription('');
      flashSuccess(`"${created.name}" added.`);
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
    } finally {
      setCreating(false);
    }
  };

  const patch = async (id: string, payload: Parameters<typeof updateCategory>[1], action: string) => {
    try {
      setBusyId(`${id}:${action}`);
      setError('');
      const updated = await updateCategory(id, payload);
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? updated : c)).sort((a, b) => a.sort_order - b.sort_order)
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update category');
    } finally {
      setBusyId(null);
    }
  };

  const move = (cat: CategoryDTO, dir: -1 | 1) => {
    const sorted = [...categories].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((c) => c.id === cat.id);
    const swapWith = sorted[idx + dir];
    if (!swapWith) return;
    // Swap sort_order values via two updates.
    patch(cat.id, { sort_order: swapWith.sort_order }, 'move');
    patch(swapWith.id, { sort_order: cat.sort_order }, 'move2');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
        <p className="text-slate-600 mt-1">Add, edit, sort, and archive product categories.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm font-semibold">
          {success}
        </div>
      )}

      {/* Add new */}
      <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-3">Add Category</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name (e.g. Gift Cards)"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Short description (optional)"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={creating}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
          >
            {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Add
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100">
          {categories.map((cat, i) => (
            <CategoryRow
              key={cat.id}
              cat={cat}
              isFirst={i === 0}
              isLast={i === categories.length - 1}
              busyId={busyId}
              onSave={(payload) => patch(cat.id, payload, 'save')}
              onToggle={() => patch(cat.id, { is_active: !cat.is_active }, 'toggle')}
              onMoveUp={() => move(cat, -1)}
              onMoveDown={() => move(cat, 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryRow({
  cat,
  isFirst,
  isLast,
  busyId,
  onSave,
  onToggle,
  onMoveUp,
  onMoveDown,
}: {
  cat: CategoryDTO;
  isFirst: boolean;
  isLast: boolean;
  busyId: string | null;
  onSave: (payload: { name: string; description: string | null }) => void;
  onToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [name, setName] = useState(cat.name);
  const [description, setDescription] = useState(cat.description || '');
  const dirty = name !== cat.name || description !== (cat.description || '');

  return (
    <div className={`p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${cat.is_active ? '' : 'opacity-60'}`}>
      <div className="flex flex-col gap-1">
        <button onClick={onMoveUp} disabled={isFirst || !!busyId} className="p-1 rounded border border-slate-200 text-slate-400 hover:text-slate-700 disabled:opacity-30">
          <ArrowUp size={12} />
        </button>
        <button onClick={onMoveDown} disabled={isLast || !!busyId} className="p-1 rounded border border-slate-200 text-slate-400 hover:text-slate-700 disabled:opacity-30">
          <ArrowDown size={12} />
        </button>
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 w-full sm:w-48"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-blue-500"
      />

      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${cat.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
        {cat.is_active ? 'Active' : 'Archived'}
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onSave({ name: name.trim(), description: description.trim() || null })}
          disabled={!dirty || !!busyId}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:border-blue-500 hover:text-blue-600 disabled:opacity-40"
        >
          {busyId === `${cat.id}:save` ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
          Save
        </button>
        <button
          onClick={onToggle}
          disabled={!!busyId}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white disabled:opacity-50 ${cat.is_active ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
        >
          {busyId === `${cat.id}:toggle` ? <Loader2 size={14} className="animate-spin" /> : <Power size={14} />}
          {cat.is_active ? 'Archive' : 'Enable'}
        </button>
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  return (
    <AdminProtected>
      <AdminCategoriesContent />
    </AdminProtected>
  );
}
