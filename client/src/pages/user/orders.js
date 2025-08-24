import React, { useEffect, useState, useCallback } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { useOrder } from "../../context/order";
import { Link } from "react-router-dom";
import "../../css/orders.css";

// Simple date formatter function
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const { getUserOrders, cancelOrder, loading: orderLoading } = useOrder();

  // Fetch user orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getUserOrders(currentPage, filterStatus);
      if (result.success) {
        setOrders(result.orders);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [getUserOrders, currentPage, filterStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      const result = await cancelOrder(orderId, "Cancelled by customer");
      if (result.success) {
        fetchOrders(); // Refresh the orders list
      }
    }
  };

  // Filter orders based on status
  const filteredOrders = orders.filter(
    (order) => filterStatus === "all" || order.status === filterStatus
  );

  // Get status badge class
  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return "status-delivered";
      case "processing":
        return "status-processing";
      case "shipped":
        return "status-shipped";
      case "cancelled":
        return "status-cancelled";
      case "confirmed":
        return "status-confirmed";
      case "out-for-delivery":
        return "status-shipped";
      default:
        return "status-pending";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return "fas fa-check-circle";
      case "processing":
        return "fas fa-clock";
      case "shipped":
        return "fas fa-truck";
      case "cancelled":
        return "fas fa-times-circle";
      case "confirmed":
        return "fas fa-thumbs-up";
      case "out-for-delivery":
        return "fas fa-running";
      default:
        return "fas fa-hourglass-half";
    }
  };

  return (
    <Layout title={"Your Orders - Magica"}>
      <div className="orders-container">
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-3 col-md-4">
              <UserMenu />
            </div>

            {/* Main Content */}
            <div className="col-lg-9 col-md-8">
              <div className="orders-content">
                {/* Orders Header */}
                <div className="orders-header mb-4">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h1 className="orders-title">
                        <i className="fas fa-shopping-bag"></i> My Orders
                      </h1>
                      <p className="orders-subtitle">
                        Track and manage all your orders in one place
                      </p>
                    </div>
                    <div className="col-md-4">
                      <div className="filter-section">
                        <label htmlFor="statusFilter" className="form-label">
                          Filter by Status:
                        </label>
                        <select
                          id="statusFilter"
                          className="form-select modern-select"
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                        >
                          <option value="all">All Orders</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orders Summary Cards */}
                <div className="row mb-4">
                  <div className="col-lg-3 col-md-6 mb-3">
                    <div className="summary-card">
                      <div className="summary-icon total">
                        <i className="fas fa-shopping-cart"></i>
                      </div>
                      <div className="summary-content">
                        <h3>{orders.length}</h3>
                        <p>Total Orders</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3 col-md-6 mb-3">
                    <div className="summary-card">
                      <div className="summary-icon delivered">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <div className="summary-content">
                        <h3>
                          {
                            orders.filter((o) => o.status === "delivered")
                              .length
                          }
                        </h3>
                        <p>Delivered</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3 col-md-6 mb-3">
                    <div className="summary-card">
                      <div className="summary-icon processing">
                        <i className="fas fa-clock"></i>
                      </div>
                      <div className="summary-content">
                        <h3>
                          {
                            orders.filter((o) => o.status === "processing")
                              .length
                          }
                        </h3>
                        <p>Processing</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3 col-md-6 mb-3">
                    <div className="summary-card">
                      <div className="summary-icon amount">
                        <i className="fas fa-rupee-sign"></i>
                      </div>
                      <div className="summary-content">
                        <h3>
                          ₹
                          {orders
                            .filter((order) => order.status !== "cancelled")
                            .reduce((total, order) => {
                              const orderTotal =
                                order.orderSummary?.total ||
                                order.totalAmount ||
                                0;
                              return total + orderTotal;
                            }, 0)
                            .toLocaleString()}
                        </h3>
                        <p>Total Spent</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orders List */}
                <div className="orders-list-section">
                  {loading ? (
                    <div className="loading-section">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p>Loading your orders...</p>
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="no-orders-section">
                      <div className="no-orders-icon">
                        <i className="fas fa-shopping-bag"></i>
                      </div>
                      <h3>No Orders Found</h3>
                      <p>
                        {filterStatus === "all"
                          ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                          : `No orders found with status "${filterStatus}".`}
                      </p>
                      <button
                        className="btn btn-primary"
                        onClick={() => (window.location.href = "/category")}
                      >
                        <i className="fas fa-shopping-bag"></i> Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="orders-grid">
                      {filteredOrders.map((order, index) => (
                        <div
                          key={order._id}
                          className="order-card"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="order-header">
                            <div className="order-info">
                              <h5 className="order-number">
                                #{order.orderNumber}
                              </h5>
                              <p className="order-date">
                                <i className="fas fa-calendar-alt"></i>
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <div className="order-status">
                              <span
                                className={`status-badge ${getStatusBadge(
                                  order.status
                                )}`}
                              >
                                <i className={getStatusIcon(order.status)}></i>
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              </span>
                            </div>
                          </div>

                          <div className="order-body">
                            <div className="products-list">
                              {order.products?.map((product) => (
                                <div key={product._id} className="product-item">
                                  <div className="product-info">
                                    <h6>{product.name}</h6>
                                    <p>
                                      Qty: {product.quantity} × ₹{product.price}
                                    </p>
                                  </div>
                                  <div className="product-amount">
                                    ₹
                                    {(
                                      product.quantity * product.price
                                    ).toLocaleString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="order-footer">
                            <div className="order-total">
                              <strong>
                                Total: ₹
                                {order.orderSummary?.total?.toLocaleString() ||
                                  order.totalAmount?.toLocaleString()}
                              </strong>
                            </div>
                            <div className="order-actions">
                              <Link
                                to={`/user/order-details/${order._id}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                <i className="fas fa-eye"></i> View Details
                              </Link>
                              {order.status === "delivered" && (
                                <button className="btn btn-sm btn-outline-success">
                                  <i className="fas fa-redo"></i> Reorder
                                </button>
                              )}
                              {(order.status === "pending" ||
                                order.status === "confirmed" ||
                                order.status === "processing") && (
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleCancelOrder(order._id)}
                                  disabled={orderLoading}
                                >
                                  <i className="fas fa-times"></i> Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
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

export default Orders;
