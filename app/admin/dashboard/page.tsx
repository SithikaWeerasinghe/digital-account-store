import StatCard from '@/components/admin/StatCard';
import { DollarSign, ShoppingCart, Ticket, Users } from 'lucide-react';
import OrderTable from '@/components/admin/OrderTable';

export default function AdminDashboard() {
  // Mock data
  const mockOrders = [
    { id: 'ORD-123', userId: 'user-1', items: [], totalAmount: 45.99, status: 'completed' as const, paymentMethod: 'card', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'ORD-124', userId: 'user-2', items: [], totalAmount: 19.99, status: 'pending' as const, paymentMethod: 'paypal', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'ORD-125', userId: 'user-3', items: [], totalAmount: 89.99, status: 'completed' as const, paymentMethod: 'crypto', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard Overview</h1>
        <p className="text-text-secondary mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="$12,456.00" 
          icon={DollarSign} 
          trend={{ value: 12.5, isPositive: true }} 
        />
        <StatCard 
          title="Total Orders" 
          value="845" 
          icon={ShoppingCart} 
          trend={{ value: 5.2, isPositive: true }} 
        />
        <StatCard 
          title="Active Tickets" 
          value="12" 
          icon={Ticket} 
          trend={{ value: 2.4, isPositive: false }} 
        />
        <StatCard 
          title="New Customers" 
          value="142" 
          icon={Users} 
          trend={{ value: 8.1, isPositive: true }} 
        />
      </div>
      
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">Recent Orders</h2>
          <button className="text-sm text-primary font-medium hover:underline">View All</button>
        </div>
        <OrderTable orders={mockOrders} />
      </div>
    </div>
  );
}
