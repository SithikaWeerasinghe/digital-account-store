import OrderTable from '@/components/admin/OrderTable';

export default function AdminOrdersPage() {
  const mockOrders = [
    { id: 'ORD-123', userId: 'user-1', items: [], totalAmount: 45.99, status: 'completed' as const, paymentMethod: 'card', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'ORD-124', userId: 'user-2', items: [], totalAmount: 19.99, status: 'pending' as const, paymentMethod: 'paypal', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'ORD-125', userId: 'user-3', items: [], totalAmount: 89.99, status: 'completed' as const, paymentMethod: 'crypto', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'ORD-126', userId: 'user-4', items: [], totalAmount: 14.99, status: 'failed' as const, paymentMethod: 'card', createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 'ORD-127', userId: 'user-5', items: [], totalAmount: 29.99, status: 'refunded' as const, paymentMethod: 'paypal', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Orders</h1>
        <p className="text-text-secondary mt-1">View and manage customer orders</p>
      </div>
      
      <OrderTable orders={mockOrders} />
    </div>
  );
}
