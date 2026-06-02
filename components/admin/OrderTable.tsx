import { Order } from '@/types/order';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Eye, Truck } from 'lucide-react';

interface OrderTableProps {
  orders: Order[];
  onView?: (order: Order) => void;
  onQuickDeliver?: (order: Order) => void;
}

export default function OrderTable({ orders, onView, onQuickDeliver }: OrderTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200/60';
      case 'failed':
        return 'bg-rose-50 text-rose-700 border border-rose-200/60';
      case 'refunded':
        return 'bg-slate-150/55 text-slate-600 border border-slate-200/60';
      default:
        return 'bg-slate-150/55 text-slate-600 border border-slate-250';
    }
  };

  const dot = (status: string) =>
    status === 'completed' || status === 'paid' || status === 'delivered'
      ? 'bg-emerald-500'
      : status === 'pending'
      ? 'bg-amber-500 animate-pulse'
      : status === 'failed'
      ? 'bg-rose-500'
      : 'bg-slate-400';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] tracking-widest uppercase border-b border-slate-200/80">
            <tr>
              <th className="px-6 py-4.5">Invoice</th>
              <th className="px-6 py-4.5">Customer</th>
              <th className="px-6 py-4.5">Date</th>
              <th className="px-6 py-4.5">Payment</th>
              <th className="px-6 py-4.5">Delivery</th>
              <th className="px-6 py-4.5">Amount</th>
              <th className="px-6 py-4.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150">
            {orders.map((order) => {
              const paymentStatus = order.payment_status || order.status;
              const deliveryStatus = order.delivery_status || 'pending';
              return (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-[#009ee3] text-xs">
                    {order.invoice_number || order.id}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-600">
                    {order.customer_email || order.userId}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black tracking-wider uppercase inline-flex items-center gap-1.5 ${getStatusColor(paymentStatus)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dot(paymentStatus)}`} />
                      {paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black tracking-wider uppercase inline-flex items-center gap-1.5 ${getStatusColor(deliveryStatus)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dot(deliveryStatus)}`} />
                      {deliveryStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-black text-slate-800">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button
                        onClick={() => onView?.(order)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-350 text-slate-400 hover:text-primary transition-all duration-200 cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      {deliveryStatus !== 'delivered' && (
                        <button
                          onClick={() => onQuickDeliver?.(order)}
                          className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-emerald-500/30 text-slate-400 hover:text-emerald-500 transition-all duration-200 cursor-pointer"
                          title="Mark as Delivered"
                        >
                          <Truck size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
