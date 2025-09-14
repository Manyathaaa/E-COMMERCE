import React, { useState, useEffect } from "react";
import { dummyOrders } from "./orders";
import { dummyUsers } from "./user";
import { dummyProducts } from "./createproduct";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [theme, setTheme] = useState("light");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalOrders: 0,
  });

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    // You can add logic to update the app theme here
  };

  useEffect(() => {
    // Use dummy data for analytics
    setStats({
      totalProducts: dummyProducts?.length || 0,
      totalCategories: 5, // You can update this if you have dummy categories
      totalUsers: dummyUsers?.length || 0,
      totalOrders: dummyOrders?.length || 0,
    });
  }, []);
  // ...existing code...

  return (
    <Layout title="Admin Dashboard - Magica">
      <div className="admin-dashboard">
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-3 col-md-4">
              <AdminMenu />
            </div>

            {/* Main Content */}
            <div className="col-lg-9 col-md-8">
              <div className="admin-content">
                {/* Analytics Section */}
                <div className="row mb-4">
                  <div className="col-md-3">
                    <div className="card text-center shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Total Orders</h5>
                        <p className="display-6 fw-bold text-primary">
                          {stats.totalOrders}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card text-center shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Total Revenue</h5>
                        <p className="display-6 fw-bold text-success">
                          ₹{dummyOrders.reduce((sum, o) => sum + o.amount, 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card text-center shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Total Products</h5>
                        <p className="display-6 fw-bold text-info">
                          {stats.totalProducts}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card text-center shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Total Users</h5>
                        <p className="display-6 fw-bold text-warning">
                          {stats.totalUsers}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Welcome Section */}
                <div className="admin-welcome">
                  <div className="welcome-content">
                    <h1>Welcome back, {auth?.user?.name}! 👋</h1>
                    <p>Here's what's happening with your store today.</p>
                  </div>
                  <div className="admin-avatar">
                    <div className="avatar-circle">
                      {auth?.user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="theme-toggle">
                    <label className="form-label me-2">Theme:</label>
                    <select
                      className="form-select form-select-sm"
                      style={{ width: "auto", display: "inline-block" }}
                      value={theme}
                      onChange={handleThemeChange}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon products">📦</div>
                    <div className="stat-info">
                      <h3>{stats.totalProducts}</h3>
                      <p>Total Products</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon categories">🏷️</div>
                    <div className="stat-info">
                      <h3>{stats.totalCategories}</h3>
                      <p>Categories</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon users">👥</div>
                    <div className="stat-info">
                      <h3>{stats.totalUsers}</h3>
                      <p>Total Users</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon orders">🛒</div>
                    <div className="stat-info">
                      <h3>{stats.totalOrders}</h3>
                      <p>Orders</p>
                    </div>
                  </div>
                </div>

                {/* Admin Info Card */}
                <div className="admin-info-card">
                  <h3>Admin Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Full Name</label>
                      <p>{auth?.user?.name}</p>
                    </div>
                    <div className="info-item">
                      <label>Email Address</label>
                      <p>{auth?.user?.email}</p>
                    </div>
                    <div className="info-item">
                      <label>Contact Number</label>
                      <p>{auth?.user?.contact || "Not provided"}</p>
                    </div>
                    <div className="info-item">
                      <label>Role</label>
                      <p>Administrator</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="recent-activity">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-icon">📦</div>
                      <div className="activity-content">
                        <p>
                          <strong>Product "Nike Air Max" updated</strong>
                        </p>
                        <span>15 minutes ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">🏷️</div>
                      <div className="activity-content">
                        <p>
                          <strong>Category "Footwear" deleted</strong>
                        </p>
                        <span>1 hour ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">�</div>
                      <div className="activity-content">
                        <p>
                          <strong>Product "Apple Watch" added</strong>
                        </p>
                        <span>2 hours ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">🛒</div>
                      <div className="activity-content">
                        <p>
                          <strong>Order #5678 marked as shipped</strong>
                        </p>
                        <span>3 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
