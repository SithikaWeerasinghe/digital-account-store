'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/admin/StatCard';
import { ShoppingCart, Ticket, Package, Star } from 'lucide-react';
import OrderTable from '@/components/admin/OrderTable';
import { fetchAdminOrders, fetchAdminTickets, fetchAdminProducts, fetchAdminReviews } from '@/lib/api';
import { Order } from '@/types/order';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 5,   // Fallback mock value
    totalOrders: 3,     // Fallback mock value
    activeTickets: 2,   // Fallback mock value
    totalReviews: 4     // Fallback mock value
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [ordersRes, ticketsRes, productsRes, reviewsRes] = await Promise.allSettled([
          fetchAdminOrders(),
          fetchAdminTickets(),
          fetchAdminProducts(),
          fetchAdminReviews()
        ]);

        const loadedOrders = ordersRes.status === 'fulfilled' ? ordersRes.value : [];
        const loadedTickets = ticketsRes.status === 'fulfilled' ? ticketsRes.value : [];
        const loadedProducts = productsRes.status === 'fulfilled' ? productsRes.value : [];
        const loadedReviews = reviewsRes.status === 'fulfilled' ? reviewsRes.value : [];

        setOrders(loadedOrders);
        setStats(prev => ({
          totalProducts: productsRes.status === 'fulfilled' ? loadedProducts.length : prev.totalProducts,
          totalOrders: ordersRes.status === 'fulfilled' ? loadedOrders.length : prev.totalOrders,
          activeTickets: ticketsRes.status === 'fulfilled' 
            ? loadedTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length 
            : prev.activeTickets,
          totalReviews: reviewsRes.status === 'fulfilled' ? loadedReviews.length : prev.totalReviews,
        }));

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
              title="Total Products" 
              value={stats.totalProducts.toString()} 
              icon={Package} 
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
              title="Total Reviews" 
              value={stats.totalReviews.toString()} 
              icon={Star} 
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
