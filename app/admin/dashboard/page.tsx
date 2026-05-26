'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/admin/StatCard';
import { DollarSign, ShoppingCart, Ticket, Users } from 'lucide-react';
import OrderTable from '@/components/admin/OrderTable';
import { fetchOrders, fetchTickets, fetchProducts, fetchReviews } from '@/lib/api';
import { Order } from '@/types/order';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeTickets: 0,
    newCustomers: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [ordersData, ticketsData] = await Promise.allSettled([
          fetchOrders(),
          fetchTickets(),
          fetchProducts(),
          fetchReviews()
        ]);

        const loadedOrders = ordersData.status === 'fulfilled' ? ordersData.value : [];
        const loadedTickets = ticketsData.status === 'fulfilled' ? ticketsData.value : [];
        
        const totalRevenue = loadedOrders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + o.totalAmount, 0);
        
        const activeTickets = loadedTickets
          .filter(t => t.status === 'open' || t.status === 'in_progress').length;
        
        const uniqueCustomers = new Set(loadedOrders.map(o => o.userId)).size;

        setOrders(loadedOrders);
        setStats({
          totalRevenue,
          totalOrders: loadedOrders.length,
          activeTickets,
          newCustomers: uniqueCustomers
        });

      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard Overview</h1>
        <p className="text-text-secondary mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Revenue" 
              value={formatCurrency(stats.totalRevenue)} 
              icon={DollarSign} 
              trend={{ value: 12.5, isPositive: true }} 
            />
            <StatCard 
              title="Total Orders" 
              value={stats.totalOrders.toString()} 
              icon={ShoppingCart} 
              trend={{ value: 5.2, isPositive: true }} 
            />
            <StatCard 
              title="Active Tickets" 
              value={stats.activeTickets.toString()} 
              icon={Ticket} 
              trend={{ value: 2.4, isPositive: false }} 
            />
            <StatCard 
              title="New Customers" 
              value={stats.newCustomers.toString()} 
              icon={Users} 
              trend={{ value: 8.1, isPositive: true }} 
            />
          </div>
          
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-text-primary">Recent Orders</h2>
              <button className="text-sm text-primary font-medium hover:underline">View All</button>
            </div>
            {orders.length > 0 ? (
              <OrderTable orders={orders.slice(0, 5)} />
            ) : (
              <div className="text-center py-12 bg-white border border-border rounded-xl">
                <p className="text-text-secondary">No recent orders.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
