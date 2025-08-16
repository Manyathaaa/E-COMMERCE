import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import axios from "axios";

const AdminDashboard = () => {
  const [auth] = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch products count
      const productsRes = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/products/product-count`
      );

      // Fetch categories count
      const categoriesRes = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );

      setStats({
        totalProducts: productsRes.data?.total || 0,
        totalCategories: categoriesRes.data?.category?.length || 0,
        totalUsers: 150, // Mock data
        totalOrders: 45, // Mock data
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

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

                {/* Quick Actions */}
                <div className="quick-actions">
                  <h3>Quick Actions</h3>
                  <div className="actions-grid">
                    <div className="action-card">
                      <div className="action-icon">➕</div>
                      <h4>Add Product</h4>
                      <p>Create a new product listing</p>
                      <button className="btn btn-primary">
                        Create Product
                      </button>
                    </div>
                    <div className="action-card">
                      <div className="action-icon">🏷️</div>
                      <h4>Add Category</h4>
                      <p>Create a new product category</p>
                      <button className="btn btn-primary">
                        Create Category
                      </button>
                    </div>
                    <div className="action-card">
                      <div className="action-icon">📊</div>
                      <h4>View Analytics</h4>
                      <p>Check sales and performance</p>
                      <button className="btn btn-primary">View Reports</button>
                    </div>
                    <div className="action-card">
                      <div className="action-icon">👥</div>
                      <h4>Manage Users</h4>
                      <p>View and manage user accounts</p>
                      <button className="btn btn-primary">Manage Users</button>
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
                          <strong>New product added</strong>
                        </p>
                        <span>2 hours ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">👤</div>
                      <div className="activity-content">
                        <p>
                          <strong>New user registered</strong>
                        </p>
                        <span>4 hours ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">🛒</div>
                      <div className="activity-content">
                        <p>
                          <strong>Order #1234 completed</strong>
                        </p>
                        <span>6 hours ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">🏷️</div>
                      <div className="activity-content">
                        <p>
                          <strong>Category updated</strong>
                        </p>
                        <span>1 day ago</span>
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
