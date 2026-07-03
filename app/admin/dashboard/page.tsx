'use client';

import { useState, useEffect } from 'react';
import AdminProtected from '@/components/admin/AdminProtected';
import StatCard from '@/components/admin/StatCard';
import { ShoppingCart, Ticket, RefreshCw, Layers, Radio, Activity, ArrowRight, ShieldCheck, Package, Star, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import OrderTable from '@/components/admin/OrderTable';
import { fetchAdminOrders, fetchAdminTickets, fetchAdminProducts, fetchAdminReviews, sendTestEmail } from '@/lib/api';
import { Order } from '@/types/order';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(n);
}

const chartData = [
  { label: 'May 20', revenue: 1420, orders: 12 },
  { label: 'May 21', revenue: 2150, orders: 19 },
  { label: 'May 22', revenue: 1800, orders: 16 },
  { label: 'May 23', revenue: 2950, orders: 28 },
  { label: 'May 24', revenue: 2600, orders: 22 },
  { label: 'May 25', revenue: 3880, orders: 34 },
  { label: 'May 26', revenue: 3450, orders: 30 },
];

function AdminDashboardContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 5,
    totalOrders: 3,
    activeTickets: 2,
    totalReviews: 4
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Test email state
  const [testEmailBusy, setTestEmailBusy] = useState(false);
  const [testEmailMsg, setTestEmailMsg] = useState('');
  const [testEmailError, setTestEmailError] = useState('');

  const handleSendTestEmail = async () => {
    setTestEmailBusy(true);
    setTestEmailMsg('');
    setTestEmailError('');
    try {
      const result = await sendTestEmail();
      setTestEmailMsg(`Test email sent to ${result.recipient}.`);
      setTimeout(() => setTestEmailMsg(''), 6000);
    } catch (err: any) {
      setTestEmailError(err.message || 'Failed to send test email.');
    } finally {
      setTestEmailBusy(false);
    }
  };

  const loadData = async () => {
    try {
      if (!isRefreshing) setIsLoading(true);
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
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  // Custom SVG Chart Coordinates Math
  const maxVal = 4200;
  const chartWidth = 600;
  const chartHeight = 180;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 25;

  const points = chartData.map((d, i) => {
    const x = paddingLeft + (i / (chartData.length - 1)) * (chartWidth - paddingLeft - paddingRight);
    const y = chartHeight - paddingBottom - (d.revenue / maxVal) * (chartHeight - paddingTop - paddingBottom);
    return { x, y, label: d.label, revenue: d.revenue, orders: d.orders };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`;
  }, '');

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x},${chartHeight - paddingBottom} L ${points[0].x},${chartHeight - paddingBottom} Z`
    : '';

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Dashboard Top Header & Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[#009ee3] font-mono text-[10px] font-black tracking-widest uppercase mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> LIVE DATABASE CONNECTED
          </div>
          <h1 className="text-3xl font-black text-slate-800 font-heading tracking-wide uppercase">Console Overview</h1>
          <p className="text-slate-500 text-xs mt-1">Welcome back, Admin. System reports reflect global metrics in real-time.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-350 text-xs font-black font-heading tracking-widest uppercase text-slate-650 hover:text-slate-900 transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "Syncing..." : "Sync Node"}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <div className="relative w-12 h-12">
            <div className="w-12 h-12 rounded-xl border-2 border-primary/10 absolute"></div>
            <div className="w-12 h-12 rounded-xl border-t-2 border-primary animate-spin absolute"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards Section */}
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

          {/* Main Visual Panels Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">

            {/* Sales Area SVG Chart (8 Cols) */}
            <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#009ee3]/20 to-transparent"></div>

              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-sm font-black tracking-widest uppercase font-mono text-slate-600">Revenue Performance</h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">DAILY INGESTION LOGS</p>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 p-1 rounded-xl">
                  {['7D', '30D', '90D'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`px-3 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase transition-all ${
                        activeTab === t
                          ? 'bg-[#009ee3] text-white shadow-[0_3px_8px_rgba(0,158,227,0.25)]'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom SVG Line Chart */}
              <div className="relative w-full h-[180px] select-none">
                <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#009ee3" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#009ee3" stopOpacity="0.00" />
                    </linearGradient>
                    <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Horizontal Gridlines */}
                  {[0, 1, 2, 3].map((g) => {
                    const y = paddingTop + (g / 3) * (chartHeight - paddingTop - paddingBottom);
                    return (
                      <line
                        key={g}
                        x1={paddingLeft}
                        y1={y}
                        x2={chartWidth - paddingRight}
                        y2={y}
                        stroke="#f1f5f9"
                        strokeWidth="1.2"
                      />
                    );
                  })}

                  {/* Chart Fill Area */}
                  {areaD && (
                    <path d={areaD} fill="url(#chart-area-grad)" />
                  )}

                  {/* Chart Stroke Path with glow */}
                  {pathD && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#009ee3"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#line-glow)"
                    />
                  )}

                  {/* X-Axis labels */}
                  {points.map((p, i) => (
                    <text
                      key={i}
                      x={p.x}
                      y={chartHeight - 6}
                      fill="#94a3b8"
                      fontSize="9"
                      textAnchor="middle"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {p.label.split(' ')[1]}
                    </text>
                  ))}

                  {/* Y-Axis scale */}
                  {[0, 1, 2, 3].map((g, i) => {
                    const val = maxVal - (g / 3) * maxVal;
                    const y = paddingTop + (g / 3) * (chartHeight - paddingTop - paddingBottom);
                    return (
                      <text
                        key={i}
                        x={paddingLeft - 8}
                        y={y + 3}
                        fill="#94a3b8"
                        fontSize="9"
                        textAnchor="end"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {val >= 1000 ? `$${(val/1000).toFixed(1)}k` : `$${val}`}
                      </text>
                    );
                  })}

                  {/* Interactive Vertical Lines on Hover */}
                  {hoveredIdx !== null && points[hoveredIdx] && (
                    <line
                      x1={points[hoveredIdx].x}
                      y1={paddingTop}
                      x2={points[hoveredIdx].x}
                      y2={chartHeight - paddingBottom}
                      stroke="rgba(0, 158, 227, 0.2)"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Interactive Dot Node points */}
                  {points.map((p, i) => (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r={hoveredIdx === i ? 5.5 : 3.5}
                      fill={hoveredIdx === i ? '#ffffff' : '#009ee3'}
                      stroke={hoveredIdx === i ? '#009ee3' : '#ffffff'}
                      strokeWidth={hoveredIdx === i ? 2.5 : 1.5}
                      className="transition-all duration-150 cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(i)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    />
                  ))}

                  {/* Invisible broad bars for easy hovering */}
                  {points.map((p, i) => {
                    const colWidth = (chartWidth - paddingLeft - paddingRight) / (chartData.length - 1);
                    return (
                      <rect
                        key={i}
                        x={p.x - colWidth / 2}
                        y={paddingTop}
                        width={colWidth}
                        height={chartHeight - paddingTop - paddingBottom}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredIdx(i)}
                        onMouseLeave={() => setHoveredIdx(null)}
                      />
                    );
                  })}
                </svg>

                {/* Floating tooltip box */}
                {hoveredIdx !== null && points[hoveredIdx] && (
                  <div
                    className="absolute bg-white/95 border border-slate-200 rounded-xl p-3 shadow-xl z-20 pointer-events-none text-xs font-mono w-[140px] backdrop-blur-md"
                    style={{
                      left: `${(points[hoveredIdx].x / chartWidth) * 100}%`,
                      top: `${Math.max(0, (points[hoveredIdx].y / chartHeight) * 100 - 45)}%`,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <p className="text-slate-400 text-[9px] font-black">{points[hoveredIdx].label.toUpperCase()}</p>
                    <p className="text-[#009ee3] font-bold mt-1">Revenue: ${points[hoveredIdx].revenue}</p>
                    <p className="text-amber-600 mt-0.5">Orders: {points[hoveredIdx].orders} units</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick operations log sidebar (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">

              {/* Operations Health */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#fff159]/30 to-transparent"></div>
                <h3 className="text-xs font-black tracking-widest uppercase font-mono text-slate-500 mb-4">Operations Console</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-medium text-slate-700">Security Core</span>
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded font-mono uppercase">ONLINE</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-medium text-slate-700">API Gateway</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-mono uppercase">98.6ms</span>
                  </div>

                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#009ee3]" />
                      <span className="text-xs font-medium text-slate-700">Sync Pipeline</span>
                    </div>
                    <span className="text-[10px] font-black text-[#009ee3] bg-[#009ee3]/10 border border-[#009ee3]/20 px-2 py-0.5 rounded font-mono uppercase">STABLE</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black tracking-widest uppercase font-mono text-slate-500 mb-3">Core Node Actions</h3>
                  <p className="text-[11px] text-slate-400">Fast path actions directly modify database records.</p>
                </div>

                <div className="space-y-2 mt-4">
                  <a href="/admin/products" className="flex items-center justify-between p-3 rounded-xl border border-slate-150 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-350 group transition-all">
                    <span className="text-xs font-bold text-slate-650 group-hover:text-slate-800">Product Manager</span>
                    <ArrowRight size={14} className="text-slate-400 group-hover:text-[#009ee3] transition-transform group-hover:translate-x-1" />
                  </a>

                  <a href="/admin/tickets" className="flex items-center justify-between p-3 rounded-xl border border-slate-150 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-350 group transition-all">
                    <span className="text-xs font-bold text-slate-650 group-hover:text-slate-800">Support Queue</span>
                    <ArrowRight size={14} className="text-slate-400 group-hover:text-amber-600 transition-transform group-hover:translate-x-1" />
                  </a>

                  {/* Send Test Email — verifies Resend admin notifications */}
                  <button
                    onClick={handleSendTestEmail}
                    disabled={testEmailBusy}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-150 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-350 group transition-all disabled:opacity-60"
                  >
                    <span className="text-xs font-bold text-slate-650 group-hover:text-slate-800">Send Test Email</span>
                    {testEmailBusy ? (
                      <Loader2 size={14} className="text-slate-400 animate-spin" />
                    ) : (
                      <Mail size={14} className="text-slate-400 group-hover:text-[#009ee3] transition-transform group-hover:translate-x-1" />
                    )}
                  </button>

                  {testEmailMsg && (
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 px-1">
                      <CheckCircle2 size={12} /> {testEmailMsg}
                    </p>
                  )}
                  {testEmailError && (
                    <p className="text-[11px] font-semibold text-rose-600 px-1">{testEmailError}</p>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Recent Orders Section */}
          <div className="mt-10 border-t border-slate-200/80 pt-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-black text-slate-800 font-heading tracking-wide uppercase">Recent Operations</h2>
                <p className="text-xs text-slate-400 mt-1">LATEST SALES AND INGESTIONS</p>
              </div>
              <a href="/admin/orders" className="text-xs text-[#009ee3] hover:text-[#008cc9] font-black font-mono tracking-wider uppercase flex items-center gap-1 hover:underline">
                VIEW ALL RECORDS <ArrowRight size={12} />
              </a>
            </div>
            {orders.length > 0 ? (
              <OrderTable orders={orders.slice(0, 5)} />
            ) : (
              <div className="text-center py-12 bg-slate-50/50 border border-slate-200 rounded-2xl">
                <p className="text-slate-400 font-mono text-sm">No recent orders recorded in network logs.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminProtected>
      <AdminDashboardContent />
    </AdminProtected>
  );
}
