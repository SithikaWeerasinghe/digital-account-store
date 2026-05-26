'use client';

import { useState, useEffect } from 'react';
import OrderTable from '@/components/admin/OrderTable';
import { fetchAdminOrders } from '@/lib/api';
import { Order } from '@/types/order';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAdminOrders();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Orders</h1>
        <p className="text-text-secondary mt-1">View and manage customer orders</p>
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
      ) : orders.length > 0 ? (
        <OrderTable orders={orders} />
      ) : (
        <div className="text-center py-12 bg-white border border-border rounded-xl">
          <p className="text-text-secondary">No orders yet.</p>
        </div>
      )}
    </div>
  );
}
