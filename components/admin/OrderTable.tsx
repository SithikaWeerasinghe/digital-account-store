import { Order } from '@/types/order';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

export default function OrderTable({ orders }: { orders: Order[] }) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
      case 'pending': return 'bg-amber-50 text-amber-700 border border-amber-200/60';
      case 'failed': return 'bg-rose-50 text-rose-700 border border-rose-200/60';
      case 'refunded': return 'bg-slate-150/55 text-slate-600 border border-slate-200/60';
      default: return 'bg-slate-150/55 text-slate-600 border border-slate-250';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] tracking-widest uppercase border-b border-slate-200/80">
            <tr>
              <th className="px-6 py-4.5">Order ID</th>
              <th className="px-6 py-4.5">Customer ID</th>
              <th className="px-6 py-4.5">Date</th>
              <th className="px-6 py-4.5">Status</th>
              <th className="px-6 py-4.5">Amount</th>
              <th className="px-6 py-4.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-[#009ee3]">{order.id}</td>
                <td className="px-6 py-4 text-xs font-mono text-slate-600">
                  usr_{order.userId.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">{formatDate(order.createdAt)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black tracking-wider uppercase border inline-flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      order.status === 'completed' ? 'bg-emerald-500' :
                      order.status === 'pending' ? 'bg-amber-500 animate-pulse' :
                      order.status === 'failed' ? 'bg-rose-500' : 'bg-slate-400'
                    }`} />
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono font-black text-slate-800">{formatCurrency(order.totalAmount)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2.5">
                    <button 
                      className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-350 text-slate-400 hover:text-primary transition-all duration-200 cursor-pointer"
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>
                    {order.status === 'pending' && (
                      <>
                        <button 
                          className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-emerald-500/30 text-slate-400 hover:text-emerald-500 transition-all duration-200 cursor-pointer"
                          title="Complete Order"
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button 
                          className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-rose-500/30 text-slate-400 hover:text-rose-500 transition-all duration-200 cursor-pointer"
                          title="Cancel Order"
                        >
                          <XCircle size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
