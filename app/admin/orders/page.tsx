'use client';

import { useState, useEffect, useMemo } from 'react';
import OrderTable from '@/components/admin/OrderTable';
import OrderDetail from '@/components/admin/OrderDetail';
import { fetchAdminOrders, updateOrderStatus, OrderStatusUpdate } from '@/lib/api';
import { Order } from '@/types/order';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Paid', value: 'paid' },
  { label: 'Pending', value: 'pending' },
  { label: 'Undelivered', value: 'undelivered' },
  { label: 'Delivered', value: 'delivered' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAdminOrders();
      setOrders(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdate = async (id: string, update: OrderStatusUpdate): Promise<Order> => {
    const updated = await updateOrderStatus(id, update);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    return updated;
  };

  const handleQuickDeliver = async (order: Order) => {
    try {
      await handleUpdate(order.id, { delivery_status: 'delivered' });
    } catch (err: any) {
      setError(err.message || 'Failed to update order');
    }
  };

  const filteredOrders = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter((o) => {
      const payment = o.payment_status || o.status;
      const delivery = o.delivery_status || 'pending';
      if (filter === 'paid') return payment === 'paid' || payment === 'completed';
      if (filter === 'pending') return payment === 'pending';
      if (filter === 'undelivered') return delivery !== 'delivered';
      if (filter === 'delivered') return delivery === 'delivered';
      return true;
    });
  }, [orders, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Orders</h1>
          <p className="text-text-secondary mt-1">
            View and manage customer orders ({orders.length} total)
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${
              filter === f.value
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-xl">
          <h3 className="font-bold text-lg mb-1">Error Loading Orders</h3>
          <p>{error}</p>
        </div>
      ) : filteredOrders.length > 0 ? (
        <OrderTable
          orders={filteredOrders}
          onView={(order) => setSelectedOrder(order)}
          onQuickDeliver={handleQuickDeliver}
        />
      ) : (
        <div className="text-center py-12 bg-white border border-border rounded-xl">
          <p className="text-text-secondary">
            {orders.length === 0 ? 'No orders yet.' : 'No orders match this filter.'}
          </p>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
