import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
// import axios from "axios";
import "./OrderDetails.css";

const OrderDetails = () => {
  const [auth] = useAuth();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/orders/${orderId}`);
        // setOrder(data.order);

        // For now, using dummy data
        const dummyOrders = [
          {
            _id: "1",
            orderNumber: "ORD-001",
            status: "delivered",
            totalAmount: 2999,
            createdAt: "2024-01-15T10:30:00Z",
            shippingAddress: {
              fullName: "John Doe",
              address: "123 Main Street, Apt 4B",
              city: "Mumbai",
              state: "Maharashtra",
              zipCode: "400001",
              phone: "+91 9876543210",
            },
            paymentMethod: "Credit Card",
            paymentStatus: "Paid",
            estimatedDelivery: "2024-01-20T18:00:00Z",
            trackingNumber: "TRK123456789",
            products: [
              {
                _id: "1",
                name: "Wireless Bluetooth Headphones",
                price: 1499,
                quantity: 2,
                slug: "wireless-headphones",
              },
            ],
          },
          {
            _id: "2",
            orderNumber: "ORD-002",
            status: "shipped",
            totalAmount: 1599,
            createdAt: "2024-01-10T14:20:00Z",
            shippingAddress: {
              fullName: "Jane Smith",
              address: "456 Oak Avenue",
              city: "Delhi",
              state: "Delhi",
              zipCode: "110001",
              phone: "+91 9876543211",
            },
            paymentMethod: "UPI",
            paymentStatus: "Paid",
            estimatedDelivery: "2024-01-25T18:00:00Z",
            trackingNumber: "TRK987654321",
            products: [
              {
                _id: "2",
                name: "Premium Smartphone Case",
                price: 799,
                quantity: 2,
                slug: "premium-case",
              },
            ],
          },
        ];

        const foundOrder = dummyOrders.find((o) => o._id === orderId);
        setOrder(foundOrder);
      } catch (error) {
        console.log("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      getOrderDetails();
    }
  }, [orderId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "success";
      case "shipped":
        return "info";
      case "processing":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return "fas fa-check-circle";
      case "shipped":
        return "fas fa-truck";
      case "processing":
        return "fas fa-clock";
      case "cancelled":
        return "fas fa-times-circle";
      default:
        return "fas fa-hourglass-half";
    }
  };

  if (loading) {
    return (
      <Layout title="Order Details - Magica">
        <div className="order-details-container">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-md-4">
                <UserMenu />
              </div>
              <div className="col-lg-9 col-md-8">
                <div className="loading-section">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p>Loading order details...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout title="Order Not Found - Magica">
        <div className="order-details-container">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-md-4">
                <UserMenu />
              </div>
              <div className="col-lg-9 col-md-8">
                <div className="order-not-found">
                  <div className="not-found-icon">
                    <i className="fas fa-search"></i>
                  </div>
                  <h3>Order Not Found</h3>
                  <p>
                    The order you're looking for doesn't exist or may have been
                    removed.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/user/orders")}
                  >
                    <i className="fas fa-arrow-left"></i> Back to Orders
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Order ${order.orderNumber} - Magica`}>
      <div className="order-details-container">
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-3 col-md-4">
              <UserMenu />
            </div>

            {/* Main Content */}
            <div className="col-lg-9 col-md-8">
              <div className="order-details-content">
                {/* Header */}
                <div className="order-details-header">
                  <div className="header-left">
                    <button
                      className="back-btn"
                      onClick={() => navigate("/user/orders")}
                    >
                      <i className="fas fa-arrow-left"></i>
                    </button>
                    <div className="header-info">
                      <h1>Order #{order.orderNumber}</h1>
                      <p>Placed on {formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="header-right">
                    <span
                      className={`status-badge status-${getStatusColor(
                        order.status
                      )}`}
                    >
                      <i className={getStatusIcon(order.status)}></i>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="row">
                  {/* Order Summary */}
                  <div className="col-lg-8 mb-4">
                    <div className="details-card">
                      <h3 className="card-title">
                        <i className="fas fa-box"></i> Order Items
                      </h3>
                      <div className="order-items">
                        {order.products?.map((product, index) => (
                          <div key={product._id} className="order-item">
                            <div className="item-image">
                              <img
                                src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${product._id}`}
                                alt={product.name}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0zMiAyOEg0OEM0OC41NTIzIDI4IDQ5IDI4LjQ0NzcgNDkgMjlWNDVDNDkgNDUuNTUyMyA0OC41NTIzIDQ2IDQ4IDQ2SDMyQzMxLjQ0NzcgNDYgMzEgNDUuNTUyMyAzMSA0NVYyOUMzMSAyOC40NDc3IDMxLjQ0NzcgMjggMzIgMjhaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik00MiAzNkM0Mi41NTIzIDM2IDQzIDM1LjU1MjMgNDMgMzVDNDMgMzQuNDQ3NyA0Mi41NTIzIDM0IDQyIDM0QzQxLjQ0NzcgMzQgNDEgMzQuNDQ3NyA0MSAzNUM0MSAzNS41NTIzIDQxLjQ0NzcgMzYgNDIgMzZaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=";
                                }}
                                className="product-image"
                              />
                            </div>
                            <div className="item-details">
                              <h5>{product.name}</h5>
                              <div className="item-meta">
                                <span className="quantity">
                                  Quantity: {product.quantity}
                                </span>
                                <span className="price">
                                  ₹{product.price.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <div className="item-total">
                              <strong>
                                ₹
                                {(
                                  product.quantity * product.price
                                ).toLocaleString()}
                              </strong>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="order-summary">
                        <div className="summary-row">
                          <span>Subtotal:</span>
                          <span>₹{order.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                          <span>Shipping:</span>
                          <span>Free</span>
                        </div>
                        <div className="summary-row total">
                          <span>Total:</span>
                          <span>₹{order.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="col-lg-4">
                    {/* Shipping Address */}
                    <div className="details-card mb-3">
                      <h3 className="card-title">
                        <i className="fas fa-shipping-fast"></i> Shipping
                        Address
                      </h3>
                      <div className="address-details">
                        <p>
                          <strong>{order.shippingAddress.fullName}</strong>
                        </p>
                        <p>{order.shippingAddress.address}</p>
                        <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}{" "}
                          {order.shippingAddress.zipCode}
                        </p>
                        <p>
                          <i className="fas fa-phone"></i>{" "}
                          {order.shippingAddress.phone}
                        </p>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="details-card mb-3">
                      <h3 className="card-title">
                        <i className="fas fa-credit-card"></i> Payment
                        Information
                      </h3>
                      <div className="payment-details">
                        <div className="payment-row">
                          <span>Method:</span>
                          <span>{order.paymentMethod}</span>
                        </div>
                        <div className="payment-row">
                          <span>Status:</span>
                          <span className="payment-status paid">
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tracking Info */}
                    {order.trackingNumber && (
                      <div className="details-card">
                        <h3 className="card-title">
                          <i className="fas fa-route"></i> Tracking Information
                        </h3>
                        <div className="tracking-details">
                          <div className="tracking-row">
                            <span>Tracking Number:</span>
                            <span className="tracking-number">
                              {order.trackingNumber}
                            </span>
                          </div>
                          {order.estimatedDelivery && (
                            <div className="tracking-row">
                              <span>Estimated Delivery:</span>
                              <span>{formatDate(order.estimatedDelivery)}</span>
                            </div>
                          )}
                          <button className="btn btn-outline-primary btn-sm track-btn">
                            <i className="fas fa-external-link-alt"></i> Track
                            Package
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="order-actions-section">
                  <div className="actions-card">
                    <h3>Order Actions</h3>
                    <div className="action-buttons">
                      {order.status === "delivered" && (
                        <>
                          <button className="btn btn-success">
                            <i className="fas fa-redo"></i> Reorder
                          </button>
                          <button className="btn btn-outline-primary">
                            <i className="fas fa-download"></i> Download Invoice
                          </button>
                          <button className="btn btn-outline-warning">
                            <i className="fas fa-star"></i> Rate Products
                          </button>
                        </>
                      )}
                      {(order.status === "processing" ||
                        order.status === "shipped") && (
                        <button className="btn btn-outline-danger">
                          <i className="fas fa-times"></i> Cancel Order
                        </button>
                      )}
                      <button className="btn btn-outline-secondary">
                        <i className="fas fa-headset"></i> Contact Support
                      </button>
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

export default OrderDetails;
