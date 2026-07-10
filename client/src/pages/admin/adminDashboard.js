import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import { useAuth } from "../../context/auth";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const COLORS = ["#4318FF", "#6AD2FF", "#E1E9F8", "#2B3674", "#05CD99"];

const AdminDashboard = () => {
  const [auth] = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [graphs, setGraphs] = useState(null);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!auth?.token) return; 
      try {
        const { data } = await axios.get("/api/v1/analytics/dashboard-stats");
        if (data.success) {
          setStats(data.stats);
          setGraphs(data.graphs);
          setTopProducts(data.topProducts || []);
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [auth?.token]);

  return (
    <AdminLayout title="Overview">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="kpi-grid">
            <div className="ent-card kpi-card">
              <div className="kpi-info">
                <p className="kpi-label">Total Revenue</p>
                <h2 className="kpi-value">${(stats?.totalRevenue || 0).toLocaleString()}</h2>
                <div className="kpi-trend trend-up">
                  <ArrowUpRight size={14} /> +12.5% this month
                </div>
              </div>
              <div className="kpi-icon-wrapper" style={{ backgroundColor: "var(--status-info-bg)", color: "var(--status-info-text)" }}>
                <DollarSign size={24} />
              </div>
            </div>

            <div className="ent-card kpi-card">
              <div className="kpi-info">
                <p className="kpi-label">Total Orders</p>
                <h2 className="kpi-value">{(stats?.totalOrders || 0).toLocaleString()}</h2>
                <div className="kpi-trend trend-up">
                  <ArrowUpRight size={14} /> +8.2% this month
                </div>
              </div>
              <div className="kpi-icon-wrapper" style={{ backgroundColor: "var(--status-success-bg)", color: "var(--status-success-text)" }}>
                <ShoppingCart size={24} />
              </div>
            </div>

            <div className="ent-card kpi-card">
              <div className="kpi-info">
                <p className="kpi-label">Total Customers</p>
                <h2 className="kpi-value">{(stats?.totalUsers || 0).toLocaleString()}</h2>
                <div className="kpi-trend trend-down">
                  <ArrowDownRight size={14} /> -3.4% this month
                </div>
              </div>
              <div className="kpi-icon-wrapper" style={{ backgroundColor: "var(--status-warning-bg)", color: "var(--status-warning-text)" }}>
                <Users size={24} />
              </div>
            </div>

            <div className="ent-card kpi-card">
              <div className="kpi-info">
                <p className="kpi-label">Products Sold</p>
                <h2 className="kpi-value">{(stats?.totalSoldProducts || 0).toLocaleString()}</h2>
                <div className="kpi-trend trend-up">
                  <ArrowUpRight size={14} /> +15.1% this month
                </div>
              </div>
              <div className="kpi-icon-wrapper" style={{ backgroundColor: "var(--status-danger-bg)", color: "var(--status-danger-text)" }}>
                <Package size={24} />
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="row mb-4">
            <div className="col-lg-8 mb-4 mb-lg-0">
              <div className="ent-card h-100">
                <div className="chart-header">
                  <h3 className="chart-title">Revenue Overview</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={graphs?.incomeByMonth || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4318FF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4318FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" stroke="#A3AED1" axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="#A3AED1" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--admin-shadow-hover)' }}
                      formatter={(value) => [`$${value}`, "Revenue"]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#4318FF" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="ent-card h-100">
                <div className="chart-header">
                  <h3 className="chart-title">Traffic Source</h3>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={graphs?.productsByCategory || []}
                      cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none"
                    >
                      {(graphs?.productsByCategory || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="mt-3">
                  {(graphs?.productsByCategory || []).slice(0, 4).map((entry, index) => {
                    const total = (graphs?.productsByCategory || []).reduce((acc, curr) => acc + curr.value, 0);
                    const percentage = total > 0 ? Math.round((entry.value / total) * 100) : 0;
                    return (
                      <div className="d-flex justify-content-between align-items-center mb-2" key={index}>
                        <div className="d-flex align-items-center gap-2">
                          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <span style={{ color: 'var(--admin-text-secondary)', fontSize: '14px' }}>{entry.name}</span>
                        </div>
                        <span style={{ fontWeight: '600', color: 'var(--admin-text-main)' }}>{percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Top Products & Recent Orders */}
          <div className="row mb-4">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="ent-card h-100">
                <div className="chart-header">
                  <h3 className="chart-title">Top Selling Products</h3>
                </div>
                <div className="ent-table-container">
                  <table className="ent-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Units Sold</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((p, index) => (
                        <tr key={p.id || index}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              {p.image ? (
                                <img src={p.image} alt={p.name} style={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: 40, height: 40, borderRadius: '8px', backgroundColor: 'var(--admin-bg-light)' }}></div>
                              )}
                              <span style={{ fontWeight: '600' }}>{p.name.length > 25 ? p.name.substring(0, 25) + "..." : p.name}</span>
                            </div>
                          </td>
                          <td>{p.unitsSold}</td>
                          <td style={{ fontWeight: '700' }}>${p.revenue?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="ent-card h-100">
                <div className="chart-header">
                  <h3 className="chart-title">Recent Orders</h3>
                  <a href="/admin/orders" className="btn btn-sm btn-outline-primary" style={{ borderRadius: '6px' }}>View All</a>
                </div>
                <div className="ent-table-container">
                  <table className="ent-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(stats?.recentOrders || []).map((order) => (
                        <tr key={order._id}>
                          <td style={{ fontWeight: '600' }}>{order.orderNumber?.split('-')[2] || order._id.substring(0,6)}</td>
                          <td>{order.shippingAddress?.fullName || order.user?.name}</td>
                          <td>
                            <span className={`status-badge ${order.status === 'delivered' ? 'status-success' : order.status === 'cancelled' ? 'status-danger' : 'status-warning'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td style={{ fontWeight: '700' }}>${(order.orderSummary?.total || order.totalAmount || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                      {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                        <tr>
                          <td colSpan="4" className="text-center py-4">No recent orders found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
