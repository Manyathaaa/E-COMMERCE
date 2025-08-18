import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { Link } from "react-router-dom";
// import axios from "axios";
import "./dashboard.css";

const Dashboard = () => {
  const [auth] = useAuth();
  const { getCartItemCount } = useCart();
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
  });

  // Fetch recent orders (you might need to implement this API)
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        // This is a placeholder - you'll need to implement these APIs
        // const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/orders/user-orders`);
        // setRecentOrders(data.orders || []);
        // setOrderStats(data.stats || {});

        // For now, set some dummy data to demonstrate the UI
        const dummyOrders = [
          {
            _id: "1",
            orderNumber: "ORD-001",
            status: "delivered",
            totalAmount: 2999,
            createdAt: "2024-01-15T10:30:00Z",
            products: [
              {
                _id: "1",
                name: "Wireless Bluetooth Headphones",
                price: 1499,
                quantity: 2,
              },
            ],
          },
          {
            _id: "2",
            orderNumber: "ORD-002",
            status: "shipped",
            totalAmount: 1599,
            createdAt: "2024-01-10T14:20:00Z",
            products: [
              {
                _id: "2",
                name: "Premium Smartphone Case",
                price: 799,
                quantity: 2,
              },
            ],
          },
        ];

        setRecentOrders(dummyOrders);

        // Calculate stats from dummy data
        const stats = {
          total: dummyOrders.length,
          pending: dummyOrders.filter((order) => order.status === "pending")
            .length,
          completed: dummyOrders.filter((order) => order.status === "delivered")
            .length,
          cancelled: dummyOrders.filter((order) => order.status === "cancelled")
            .length,
        };

        setOrderStats(stats);
      } catch (error) {
        console.log("Error fetching user stats:", error);
      }
    };

    if (auth?.user) {
      fetchUserStats();
    }
  }, [auth?.user, setRecentOrders, setOrderStats]);

  return (
    <Layout title={"Dashboard - Magica"}>
      <div className="dashboard-container">
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-3 col-md-4">
              <UserMenu />
            </div>

            {/* Main Content */}
            <div className="col-lg-9 col-md-8">
              <div className="dashboard-content">
                {/* Welcome Header */}
                <div className="welcome-section mb-4">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h1 className="dashboard-title">
                        Welcome back, {auth?.user?.name}! 👋
                      </h1>
                      <p className="dashboard-subtitle">
                        Here's what's happening with your account today.
                      </p>
                    </div>
                    <div className="col-md-4 text-end">
                      <div className="user-avatar">
                        <div className="avatar-circle">
                          {auth?.user?.name?.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Cards */}
                <div className="row mb-4">
                  <div className="col-lg-3 col-md-6 mb-3">
                    <div className="stat-card">
                      <div className="stat-icon cart-icon">
                        <i className="fas fa-shopping-cart"></i>
                      </div>
                      <div className="stat-content">
                        <h3>{getCartItemCount()}</h3>
                        <p>Items in Cart</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3 col-md-6 mb-3">
                    <div className="stat-card">
                      <div className="stat-icon orders-icon">
                        <i className="fas fa-box"></i>
                      </div>
                      <div className="stat-content">
                        <h3>{orderStats.total}</h3>
                        <p>Total Orders</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3 col-md-6 mb-3">
                    <div className="stat-card">
                      <div className="stat-icon pending-icon">
                        <i className="fas fa-clock"></i>
                      </div>
                      <div className="stat-content">
                        <h3>{orderStats.pending}</h3>
                        <p>Pending Orders</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3 col-md-6 mb-3">
                    <div className="stat-card">
                      <div className="stat-icon completed-icon">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <div className="stat-content">
                        <h3>{orderStats.completed}</h3>
                        <p>Completed Orders</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="quick-actions-card">
                      <h4 className="card-title">
                        <i className="fas fa-bolt" aria-hidden="true"></i> Quick
                        Actions
                      </h4>
                      <div className="row g-3">
                        <div className="col-lg-3 col-md-6 col-sm-6 mb-3">
                          <Link to="/category" className="action-btn">
                            <div className="action-icon">
                              <i
                                className="fas fa-shopping-bag"
                                aria-hidden="true"
                              ></i>
                            </div>
                            <span>Shop Now</span>
                          </Link>
                        </div>

                        <div className="col-lg-3 col-md-6 col-sm-6 mb-3">
                          <Link to="/user/orders" className="action-btn">
                            <div className="action-icon">
                              <i
                                className="fas fa-clock-rotate-left"
                                aria-hidden="true"
                              ></i>
                            </div>
                            <span>Order History</span>
                          </Link>
                        </div>

                        <div className="col-lg-3 col-md-6 col-sm-6 mb-3">
                          <Link to="/user/profile" className="action-btn">
                            <div className="action-icon">
                              <i
                                className="fas fa-user-pen"
                                aria-hidden="true"
                              ></i>
                            </div>
                            <span>Edit Profile</span>
                          </Link>
                        </div>

                        <div className="col-lg-3 col-md-6 col-sm-6 mb-3">
                          <Link to="/cart" className="action-btn">
                            <div className="action-icon">
                              <i
                                className="fas fa-cart-shopping"
                                aria-hidden="true"
                              ></i>
                            </div>
                            <span>View Cart</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Information Card */}
                <div className="row mb-4">
                  <div className="col-lg-6 mb-3">
                    <div className="info-card">
                      <h4 className="card-title">
                        <i className="fas fa-user"></i> Account Information
                      </h4>
                      <div className="info-content">
                        <div className="info-item">
                          <span className="info-label">Name:</span>
                          <span className="info-value">
                            {auth?.user?.name || "Not provided"}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Email:</span>
                          <span className="info-value">
                            {auth?.user?.email || "Not provided"}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Address:</span>
                          <span className="info-value">
                            {auth?.user?.address || "Not provided"}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Phone:</span>
                          <span className="info-value">
                            {auth?.user?.phone || "Not provided"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 mb-3">
                    <div className="info-card">
                      <h4 className="card-title">
                        <i className="fas fa-chart-line"></i> Account Activity
                      </h4>
                      <div className="activity-content">
                        <div className="activity-item">
                          <div className="activity-icon success">
                            <i className="fas fa-check"></i>
                          </div>
                          <div className="activity-text">
                            <span>Account created successfully</span>
                            <small>Welcome to Magica!</small>
                          </div>
                        </div>
                        <div className="activity-item">
                          <div className="activity-icon info">
                            <i className="fas fa-info"></i>
                          </div>
                          <div className="activity-text">
                            <span>Profile information</span>
                            <small>Keep your details updated</small>
                          </div>
                        </div>
                        <div className="activity-item">
                          <div className="activity-icon warning">
                            <i className="fas fa-shopping-cart"></i>
                          </div>
                          <div className="activity-text">
                            <span>Ready to shop</span>
                            <small>Explore our categories</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="row">
                  <div className="col-12">
                    <div className="orders-card">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="card-title">
                          <i className="fas fa-receipt"></i> Recent Orders
                        </h4>
                        <Link to="/user/orders" className="view-all-btn">
                          View All Orders <i className="fas fa-arrow-right"></i>
                        </Link>
                      </div>

                      {recentOrders.length > 0 ? (
                        <div className="orders-list">
                          {recentOrders.slice(0, 3).map((order, index) => (
                            <div key={order._id} className="order-item">
                              <div className="order-info">
                                <span className="order-id">
                                  #{order.orderNumber}
                                </span>
                                <span className="order-date">
                                  {new Date(order.createdAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </span>
                                <span
                                  className={`order-status ${order.status}`}
                                >
                                  {order.status.charAt(0).toUpperCase() +
                                    order.status.slice(1)}
                                </span>
                                <span className="order-total">
                                  ₹{order.totalAmount.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="no-orders">
                          <div className="no-orders-icon">
                            <i className="fas fa-shopping-bag"></i>
                          </div>
                          <h5>No Orders Yet</h5>
                          <p>Start shopping to see your orders here!</p>
                          <Link to="/category" className="btn btn-primary">
                            Start Shopping
                          </Link>
                        </div>
                      )}
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

export default Dashboard;
