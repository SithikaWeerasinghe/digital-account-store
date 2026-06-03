'use client';

import { useState } from 'react';
import { Order } from '@/types/order';
import { OrderStatusUpdate, resendOrderEmail } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  X, Mail, Package, CreditCard, Hash, Calendar, Loader2,
  CheckCircle, Truck, Send, Tag, Shield, DollarSign,
} from 'lucide-react';

interface OrderDetailProps {
  order: Order;
  onClose: () => void;
  onUpdate: (id: string, update: OrderStatusUpdate) => Promise<Order>;
}

const PAYMENT_BADGES: Record<string, string> = {
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  failed: 'bg-rose-50 text-rose-700 border-rose-200',
  refunded: 'bg-slate-100 text-slate-600 border-slate-200',
};

const DELIVERY_BADGES: Record<string, string> = {
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  failed: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function OrderDetail({ order: initialOrder, onClose, onUpdate }: OrderDetailProps) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const paymentStatus = order.payment_status || 'pending';
  const deliveryStatus = order.delivery_status || 'pending';
  const productName = order.items?.[0]?.product?.name || order.product_id || '—';

  const runUpdate = async (action: string, update: OrderStatusUpdate) => {
    try {
      setBusyAction(action);
      setError('');
      const updated = await onUpdate(order.id, update);
      setOrder(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to update order');
    } finally {
      setBusyAction(null);
    }
  };

  const handleResendEmail = async () => {
    try {
      setBusyAction('email');
      setError('');
      setEmailSent(false);
      await resendOrderEmail(order.id);
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to send email');
    } finally {
      setBusyAction(null);
    }
  };

  const handleDeliverOrder = async () => {
    try {
      setBusyAction('deliver');
      setError('');

      // Import Supabase to get auth token
      const supabaseModule = await import('@/lib/supabase');
      const supabase = supabaseModule.supabase;

      if (!supabase) {
        setError('Supabase is not configured');
        setBusyAction(null);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setError('Session expired. Please log in again.');
        setBusyAction(null);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${session.access_token}`,
      };

      const res = await fetch(`/api/admin/orders/${order.id}/deliver`, {
        method: 'POST',
        headers,
      });
      const data = await res.json();
      if (data.success) {
        // Refresh order status
        const newRes = await fetch(`/api/admin/orders/${order.id}`, {
          headers,
        });
        const newData = await newRes.json();
        if (newData.success) {
          setOrder(newData.data);
        }
        setError('');
      } else {
        setError(data.message || 'Failed to deliver order');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to deliver order');
    } finally {
      setBusyAction(null);
    }
  };

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <Icon size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-800 break-words">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-black text-slate-900 font-heading tracking-wide uppercase">
              Order Details
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              {order.invoice_number || order.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Status badges */}
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-1.5">Payment</p>
              <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase border ${PAYMENT_BADGES[paymentStatus]}`}>
                {paymentStatus}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-1.5">Delivery</p>
              <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase border ${DELIVERY_BADGES[deliveryStatus]}`}>
                {deliveryStatus}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="bg-slate-50 rounded-xl px-4">
            <InfoRow icon={Mail} label="Customer Email" value={order.customer_email || order.userId} />
            <InfoRow icon={Package} label="Product" value={productName} />
            <InfoRow icon={Hash} label="Quantity" value={String(order.quantity ?? order.items?.[0]?.quantity ?? 1)} />
            <InfoRow icon={CreditCard} label="Payment Method" value={(order.payment_method || order.paymentMethod || '—').toUpperCase()} />
            <InfoRow icon={Calendar} label="Order Date" value={formatDate(order.createdAt)} />
          </div>

          {/* Amount */}
          <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
            <span className="text-sm font-black tracking-widest uppercase text-slate-600">Total Amount</span>
            <span className="text-2xl font-black text-primary">{formatCurrency(order.totalAmount)}</span>
          </div>

          {/* Mercado Pago gateway details (only shown when present) */}
          {(order.mercadopago_payment_id ||
            order.mercadopago_preference_id ||
            order.mercadopago_merchant_order_id ||
            order.mercadopago_status ||
            order.paid_at) && (
            <div className="bg-slate-50 rounded-xl px-4">
              <p className="text-[10px] font-black tracking-widest uppercase text-slate-400 pt-3 -mb-1">
                Mercado Pago
              </p>
              {order.mercadopago_payment_id && (
                <InfoRow icon={CreditCard} label="Payment ID" value={order.mercadopago_payment_id} />
              )}
              {order.mercadopago_status && (
                <InfoRow icon={CreditCard} label="MP Status" value={order.mercadopago_status} />
              )}
              {order.mercadopago_preference_id && (
                <InfoRow icon={Hash} label="Preference ID" value={order.mercadopago_preference_id} />
              )}
              {order.mercadopago_merchant_order_id && (
                <InfoRow icon={Hash} label="Merchant Order ID" value={order.mercadopago_merchant_order_id} />
              )}
              {order.paid_at && (
                <InfoRow icon={Calendar} label="Paid At" value={formatDate(order.paid_at)} />
              )}
            </div>
          )}

          {/* Product Option & Guarantee (order_metadata) */}
          {(order.order_metadata?.product_option || order.order_metadata?.guarantee) && (
            <div className="bg-slate-50 rounded-xl px-4">
              <p className="text-[10px] font-black tracking-widest uppercase text-slate-400 pt-3 -mb-1">
                Selection Details
              </p>
              {order.order_metadata.product_option && (
                <InfoRow
                  icon={Tag}
                  label="Product Option"
                  value={`${order.order_metadata.product_option.label}${
                    order.order_metadata.product_option.price != null
                      ? ` · ${formatCurrency(order.order_metadata.product_option.price)}`
                      : ''
                  }`}
                />
              )}
              {order.order_metadata.guarantee && (
                <>
                  <InfoRow
                    icon={Shield}
                    label="Guarantee"
                    value={order.order_metadata.guarantee.label}
                  />
                  {order.order_metadata.guarantee.total_price && (
                    <InfoRow
                      icon={DollarSign}
                      label="Guarantee Total"
                      value={formatCurrency(order.order_metadata.guarantee.total_price)}
                    />
                  )}
                </>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">Admin Actions</p>

            {/* Mark Paid */}
            {paymentStatus !== 'paid' && (
              <button
                onClick={() => runUpdate('paid', { payment_status: 'paid' })}
                disabled={!!busyAction}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white font-black font-heading tracking-widest uppercase text-sm hover:bg-emerald-700 transition-all disabled:opacity-50"
              >
                {busyAction === 'paid' ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                Mark as Paid
              </button>
            )}

            {/* Deliver Order (send digital access) */}
            {deliveryStatus !== 'delivered' && (
              <button
                onClick={() => handleDeliverOrder()}
                disabled={!!busyAction}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white font-black font-heading tracking-widest uppercase text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {busyAction === 'deliver' ? <Loader2 size={16} className="animate-spin" /> : <Package size={16} />}
                Send Delivery / Access Details
              </button>
            )}

            {/* Mark Delivered */}
            {deliveryStatus !== 'delivered' && (
              <button
                onClick={() => runUpdate('delivered', { delivery_status: 'delivered' })}
                disabled={!!busyAction}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white font-black font-heading tracking-widest uppercase text-sm hover:bg-primary-hover transition-all disabled:opacity-50"
              >
                {busyAction === 'delivered' ? <Loader2 size={16} className="animate-spin" /> : <Truck size={16} />}
                Mark as Delivered
              </button>
            )}

            {/* Resend confirmation email */}
            <button
              onClick={handleResendEmail}
              disabled={!!busyAction}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border font-black font-heading tracking-widest uppercase text-sm transition-all disabled:opacity-50 ${
                emailSent
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 text-slate-600 hover:border-primary hover:text-primary'
              }`}
            >
              {busyAction === 'email' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {emailSent ? 'Email Sent!' : 'Resend Confirmation Email'}
            </button>

            {/* Secondary status controls */}
            <div className="flex gap-2 pt-1">
              {paymentStatus !== 'refunded' && (
                <button
                  onClick={() => runUpdate('refunded', { payment_status: 'refunded' })}
                  disabled={!!busyAction}
                  className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                  Mark Refunded
                </button>
              )}
              {paymentStatus !== 'failed' && (
                <button
                  onClick={() => runUpdate('failed', { payment_status: 'failed' })}
                  disabled={!!busyAction}
                  className="flex-1 py-2 rounded-lg border border-slate-200 text-rose-600 font-bold text-xs hover:bg-rose-50 transition-all disabled:opacity-50"
                >
                  Mark Failed
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
