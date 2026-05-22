import { Order } from '@/types/order';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

export default function OrderTable({ orders }: { orders: Order[] }) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'refunded': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-text-secondary font-medium border-b border-border">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-text-primary">{order.id}</td>
                <td className="px-6 py-4">User {order.userId.substring(0, 5)}...</td>
                <td className="px-6 py-4">{formatDate(order.createdAt)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold">{formatCurrency(order.totalAmount)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-text-muted hover:text-primary transition-colors"><Eye size={16} /></button>
                    {order.status === 'pending' && (
                      <>
                        <button className="p-1.5 text-text-muted hover:text-success transition-colors"><CheckCircle size={16} /></button>
                        <button className="p-1.5 text-text-muted hover:text-danger transition-colors"><XCircle size={16} /></button>
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
