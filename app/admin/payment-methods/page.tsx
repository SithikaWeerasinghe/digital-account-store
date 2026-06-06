'use client';

import { useState, useEffect } from 'react';
import AdminProtected from '@/components/admin/AdminProtected';
import { PaymentMethod } from '@/types/paymentMethod';
import { CreditCard, Bitcoin, Banknote, Loader2, CheckCircle2, AlertCircle, Power } from 'lucide-react';

const METHOD_ICONS: Record<string, any> = {
  card: CreditCard,
  crypto: Bitcoin,
  manual: Banknote,
};

type Draft = {
  display_name: string;
  description: string;
  maintenance_message: string;
};

async function authHeaders(): Promise<Record<string, string> | null> {
  const { supabase } = await import('@/lib/supabase');
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return null;
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  };
}

function AdminPaymentMethodsContent() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const headers = await authHeaders();
      if (!headers) {
        setError('Session expired. Please log in again.');
        return;
      }
      const res = await fetch('/api/admin/payment-methods', { headers, cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        const list = (data.data as PaymentMethod[]) || [];
        setMethods(list);
        const d: Record<string, Draft> = {};
        list.forEach((m) => {
          d[m.method_key] = {
            display_name: m.display_name || '',
            description: m.description || '',
            maintenance_message: m.maintenance_message || '',
          };
        });
        setDrafts(d);
      } else {
        setError(data.message || 'Failed to load payment methods');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load payment methods');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const patchMethod = async (methodKey: string, body: Record<string, any>, action: string) => {
    try {
      setBusyKey(`${methodKey}:${action}`);
      setError('');
      setSavedKey(null);
      const headers = await authHeaders();
      if (!headers) {
        setError('Session expired. Please log in again.');
        return;
      }
      const res = await fetch(`/api/admin/payment-methods/${methodKey}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setMethods((prev) => prev.map((m) => (m.method_key === methodKey ? (data.data as PaymentMethod) : m)));
        setSavedKey(methodKey);
        setTimeout(() => setSavedKey((k) => (k === methodKey ? null : k)), 2500);
      } else {
        setError(data.message || 'Failed to update payment method');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update payment method');
    } finally {
      setBusyKey(null);
    }
  };

  const toggleActive = (m: PaymentMethod) =>
    patchMethod(m.method_key, { is_active: !m.is_active }, 'toggle');

  const saveDetails = (m: PaymentMethod) => {
    const draft = drafts[m.method_key];
    if (!draft) return;
    patchMethod(
      m.method_key,
      {
        display_name: draft.display_name,
        description: draft.description,
        maintenance_message: draft.maintenance_message,
      },
      'save'
    );
  };

  const setDraft = (key: string, field: keyof Draft, value: string) =>
    setDrafts((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payment Methods</h1>
        <p className="text-slate-600 mt-1">
          Enable or put payment methods on maintenance. Disabled methods cannot be used at checkout.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {methods.map((m) => {
            const Icon = METHOD_ICONS[m.method_key] || CreditCard;
            const draft = drafts[m.method_key] || { display_name: '', description: '', maintenance_message: '' };
            return (
              <div
                key={m.method_key}
                className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col gap-4 ${
                  m.is_active ? 'border-slate-200' : 'border-amber-300'
                }`}
              >
                {/* Title + status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      m.is_active ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">{m.display_name}</h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
                    m.is_active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {m.is_active ? 'Active' : 'Maintenance'}
                  </span>
                </div>

                {/* Editable fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Display Name</label>
                    <input
                      type="text"
                      value={draft.display_name}
                      onChange={(e) => setDraft(m.method_key, 'display_name', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Description</label>
                    <input
                      type="text"
                      value={draft.description}
                      onChange={(e) => setDraft(m.method_key, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Maintenance Message</label>
                    <textarea
                      value={draft.maintenance_message}
                      onChange={(e) => setDraft(m.method_key, 'maintenance_message', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Shown to customers when this method is on maintenance.</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto space-y-2 pt-2">
                  <button
                    onClick={() => toggleActive(m)}
                    disabled={!!busyKey}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-black uppercase text-sm tracking-widest transition-all disabled:opacity-50 ${
                      m.is_active
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {busyKey === `${m.method_key}:toggle` ? <Loader2 size={16} className="animate-spin" /> : <Power size={16} />}
                    {m.is_active ? 'Put on Maintenance' : 'Enable'}
                  </button>
                  <button
                    onClick={() => saveDetails(m)}
                    disabled={!!busyKey}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-black uppercase text-sm tracking-widest hover:border-blue-500 hover:text-blue-600 transition-all disabled:opacity-50"
                  >
                    {busyKey === `${m.method_key}:save` ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : savedKey === m.method_key ? (
                      <CheckCircle2 size={16} className="text-emerald-600" />
                    ) : null}
                    {savedKey === m.method_key ? 'Saved!' : 'Save Changes'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminPaymentMethodsPage() {
  return (
    <AdminProtected>
      <AdminPaymentMethodsContent />
    </AdminProtected>
  );
}
