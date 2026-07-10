import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
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
  Cell,
  Legend
} from "recharts";
import "../../css/adminDashboard.css"; // The new premium CSS

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];

const AdminDashboard = () => {
  const [auth] = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [graphs, setGraphs] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("/api/v1/analytics/dashboard-stats");
        if (data.success) {
          setStats(data.stats);
          setGraphs(data.graphs);
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Layout title="Admin Dashboard - Analytics">
      <div className="admin-dashboard-container">
        <div className="container-fluid py-4">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-3 col-md-4">
              <AdminMenu />
            </div>

            {/* Main Content */}
            <div className="col-lg-9 col-md-8">
              <div className="admin-header">
                <h1>
                  <i className="fas fa-chart-line"></i> Performance Dashboard
                </h1>
                <p>Welcome back, {auth?.user?.name}! Here's your real-time store overview.</p>
              </div>

              {loading ? (
                <div className="admin-loading">
                  <i className="fas fa-spinner"></i> Loading Analytics...
                </div>
              ) : (
                <>
                  {/* KPI Cards */}
                  <div className="kpi-grid">
                    <div className="kpi-card">
                      <div className="kpi-info">
                        <h4>Total Revenue</h4>
                        <h2>₹{stats?.totalRevenue?.toLocaleString() || 0}</h2>
                      </div>
                      <div className="kpi-icon revenue">
                        <i className="fas fa-wallet"></i>
                      </div>
                    </div>
                    <div className="kpi-card">
                      <div className="kpi-info">
                        <h4>Sold Products</h4>
                        <h2>{stats?.totalSoldProducts?.toLocaleString() || 0}</h2>
                      </div>
                      <div className="kpi-icon revenue" style={{ color: "#ec4899" }}>
                        <i className="fas fa-tags"></i>
                      </div>
                    </div>
                    <div className="kpi-card">
                      <div className="kpi-info">
                        <h4>Total Orders</h4>
                        <h2>{stats?.totalOrders?.toLocaleString() || 0}</h2>
                      </div>
                      <div className="kpi-icon orders">
                        <i className="fas fa-shopping-cart"></i>
                      </div>
                    </div>
                    <div className="kpi-card">
                      <div className="kpi-info">
                        <h4>Pending Orders</h4>
                        <h2>
                          {graphs?.ordersByStatus?.find(o => o.status === "pending")?.count || 0}
                        </h2>
                      </div>
                      <div className="kpi-icon users" style={{ color: "#f59e0b" }}>
                        <i className="fas fa-clock"></i>
                      </div>
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="charts-grid">
                    {/* Income Graph */}
                    <div className="chart-card">
                      <h3><i className="fas fa-chart-area"></i> Income Over Time</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart
                          data={graphs?.incomeByMonth || []}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                          <XAxis dataKey="date" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" tickFormatter={(value) => `₹${value}`} />
                          <Tooltip 
                            formatter={(value) => [`₹${value}`, "Revenue"]}
                            labelStyle={{ color: "#f8fafc" }}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Order Status Graph */}
                    <div className="chart-card">
                      <h3><i className="fas fa-chart-bar"></i> Order Status</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={graphs?.ordersByStatus || []}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="count"
                            nameKey="status"
                          >
                            {(graphs?.ordersByStatus || []).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip labelStyle={{ color: "#f8fafc" }} />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Category Distribution */}
                    <div className="chart-card">
                      <h3><i className="fas fa-chart-pie"></i> Products by Category</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={graphs?.productsByCategory || []}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {(graphs?.productsByCategory || []).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip labelStyle={{ color: "#f8fafc" }} />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
