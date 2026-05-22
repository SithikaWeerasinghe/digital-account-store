export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'superadmin' | 'support';
  name: string;
  avatarUrl?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeTickets: number;
  newCustomers: number;
  revenueChange: number; // percentage
  ordersChange: number; // percentage
}
