import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { useOrder } from "../../context/order";
import { Link } from "react-router-dom";
import "../../css/dashboard.css";

const Dashboard = () => {
  const [auth] = useAuth();
  const { getCartItemCount } = useCart();
  const { getUserOrders } = useOrder();
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
  });

  // Fetch recent orders and stats
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        if (auth?.user) {
          const result = await getUserOrders(1, "all");
          if (result.success) {
            const userOrders = result.orders || [];
            setRecentOrders(userOrders);

            const stats = {
              total: userOrders.length,
              pending: userOrders.filter(
                (order) => order.status === "pending" || order.status === "confirmed"
              ).length,
              completed: userOrders.filter(
                (order) => order.status === "delivered"
              ).length,
              cancelled: userOrders.filter(
                (order) => order.status === "cancelled"
              ).length,
            };
            setOrderStats(stats);
          } else {
            setRecentOrders([]);
          }
        }
      } catch (error) {
        console.log("Error fetching user stats:", error);
      }
    };
    fetchUserStats();
  }, [auth?.user, getUserOrders]);

  return (
    <Layout title={"My Hub - Magica"}>
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
                
                {/* Hero Welcome Banner */}
                <div className="hero-welcome-banner">
                  <div className="welcome-text">
                    <h1>Hi, {auth?.user?.name?.split(' ')[0]}!</h1>
                    <p>Ready to discover something amazing today?</p>
                    <Link to="/category" className="shop-now-btn">
                      Explore Collections <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                  <div className="welcome-avatar">
                    {auth?.user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Minimalist Shopping Summary */}
                <div className="shopping-summary-grid">
                  <div className="summary-card">
                    <div className="summary-icon cart">
                      <i className="fas fa-shopping-bag"></i>
                    </div>
                    <div className="summary-details">
                      <h3>{getCartItemCount()}</h3>
                      <p>In your Cart</p>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-icon orders">
                      <i className="fas fa-box-open"></i>
                    </div>
                    <div className="summary-details">
                      <h3>{orderStats.total}</h3>
                      <p>Total Orders</p>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-icon pending">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="summary-details">
                      <h3>{orderStats.pending}</h3>
                      <p>On the way</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Revamp */}
                <div className="quick-actions-section">
                  <h3 className="section-title">Where to next?</h3>
                  <div className="actions-grid">
                    <Link to="/category" className="action-tile">
                      <div className="tile-icon">
                        <i className="fas fa-sparkles"></i>
                      </div>
                      <span>New Arrivals</span>
                    </Link>
                    
                    <Link to="/user/orders" className="action-tile">
                      <div className="tile-icon">
                        <i className="fas fa-truck-fast"></i>
                      </div>
                      <span>Track Orders</span>
                    </Link>
                    
                    <Link to="/user/profile" className="action-tile">
                      <div className="tile-icon">
                        <i className="fas fa-user-astronaut"></i>
                      </div>
                      <span>My Profile</span>
                    </Link>

                    <Link to="/cart" className="action-tile">
                      <div className="tile-icon">
                        <i className="fas fa-cart-shopping"></i>
                      </div>
                      <span>Checkout</span>
                    </Link>
                  </div>
                </div>

                {/* Elegant Recent Orders */}
                <div className="recent-orders-card">
                  <div className="orders-header">
                    <h3 className="section-title" style={{ marginBottom: 0 }}>Recent Purchases</h3>
                    <Link to="/user/orders" className="view-all-link">
                      View full history
                    </Link>
                  </div>

                  {recentOrders.length > 0 ? (
                    <div className="elegant-orders-list">
                      {recentOrders.slice(0, 4).map((order) => (
                        <div key={order._id} className="elegant-order-item">
                          <div className="order-main-info">
                            <h4>Order #{order.orderNumber}</h4>
                            <p>
                              Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                              })}
                            </p>
                          </div>
                          
                          <div className={`order-status-badge ${order.status}`}>
                            {order.status}
                          </div>
                          
                          <div className="order-price">
                            ₹{(order.orderSummary?.total || order.totalAmount || 0).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-orders">
                      <i className="fas fa-box-open"></i>
                      <h5>Your cart has been waiting!</h5>
                      <p>You haven't placed any orders yet. Let's fix that.</p>
                      <Link to="/category" className="shop-now-btn" style={{ background: '#4f46e5' }}>
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
    </Layout>
  );
};

export default Dashboard;
