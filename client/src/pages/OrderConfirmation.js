import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useOrder } from "../context/order";
import Layout from "../components/Layout/Layout";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrder, loading } = useOrder();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const result = await getOrder(orderId);
      if (result.success) {
        setOrder(result.order);
      } else {
        navigate("/user/orders");
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, getOrder, navigate]);

  const getStatusIcon = (status) => {
    const icons = {
      pending: "🕐",
      confirmed: "✅",
      processing: "📦",
      shipped: "🚚",
      "out-for-delivery": "🏃",
      delivered: "🎉",
      cancelled: "❌",
    };
    return icons[status] || "📋";
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "warning",
      confirmed: "info",
      processing: "primary",
      shipped: "info",
      "out-for-delivery": "warning",
      delivered: "success",
      cancelled: "danger",
    };
    return colors[status] || "secondary";
  };

  if (loading || !order) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading order details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="order-confirmation-page">
        <div className="container py-5">
          {/* Success Header */}
          <div className="text-center mb-5">
            <div className="success-icon">
              <i className="fas fa-check-circle text-success"></i>
            </div>
            <h1 className="h2 mb-3">Order Placed Successfully!</h1>
            <p className="text-muted">
              Thank you for your order. We'll send you a confirmation email
              shortly.
            </p>
          </div>

          <div className="row">
            {/* Order Summary Card */}
            <div className="col-lg-8 mb-4">
              <div className="card order-summary-card">
                <div className="card-header">
                  <h4 className="mb-0">
                    <i className="fas fa-receipt me-2"></i>
                    Order Summary
                  </h4>
                </div>
                <div className="card-body">
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <h6 className="text-muted">Order Number</h6>
                      <p className="fw-bold">{order.orderNumber}</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-muted">Order Date</h6>
                      <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mb-4">
                    <h6 className="text-muted">Status</h6>
                    <span
                      className={`badge bg-${getStatusColor(
                        order.status
                      )} fs-6`}
                    >
                      {getStatusIcon(order.status)}{" "}
                      {order.status.replace("-", " ").toUpperCase()}
                    </span>
                  </div>

                  {/* Products */}
                  <div className="mb-4">
                    <h6 className="text-muted mb-3">Items Ordered</h6>
                    {order.products.map((item, index) => (
                      <div
                        key={index}
                        className="product-item d-flex align-items-center mb-3"
                      >
                        <img
                          src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${item.product._id}`}
                          alt={item.name}
                          className="product-image me-3"
                        />
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{item.name}</h6>
                          <p className="text-muted small mb-0">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-end">
                          <p className="fw-bold mb-0">
                            ₹{item.total.toLocaleString()}
                          </p>
                          <small className="text-muted">
                            ₹{item.price} each
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Totals */}
                  <div className="order-totals">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>
                        ₹{order.orderSummary.subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Shipping:</span>
                      <span>
                        {order.orderSummary.shipping === 0 ? (
                          <span className="text-success">FREE</span>
                        ) : (
                          `₹${order.orderSummary.shipping}`
                        )}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tax (GST):</span>
                      <span>₹{order.orderSummary.tax.toLocaleString()}</span>
                    </div>
                    {order.orderSummary.discount > 0 && (
                      <div className="d-flex justify-content-between mb-2 text-success">
                        <span>Discount:</span>
                        <span>
                          -₹{order.orderSummary.discount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <hr />
                    <div className="d-flex justify-content-between fw-bold fs-5">
                      <span>Total:</span>
                      <span>₹{order.orderSummary.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery & Payment Info */}
            <div className="col-lg-4">
              {/* Delivery Address */}
              <div className="card mb-4">
                <div className="card-header">
                  <h6 className="mb-0">
                    <i className="fas fa-truck me-2"></i>
                    Delivery Address
                  </h6>
                </div>
                <div className="card-body">
                  <address className="mb-0">
                    <strong>{order.shippingAddress.fullName}</strong>
                    <br />
                    {order.shippingAddress.address}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                    <br />
                    {order.shippingAddress.zipCode}
                    <br />
                    <abbr title="Phone">P:</abbr> {order.shippingAddress.phone}
                  </address>
                </div>
              </div>

              {/* Payment Info */}
              <div className="card mb-4">
                <div className="card-header">
                  <h6 className="mb-0">
                    <i className="fas fa-credit-card me-2"></i>
                    Payment Information
                  </h6>
                </div>
                <div className="card-body">
                  <p className="mb-2">
                    <strong>Method:</strong> {order.paymentMethod.toUpperCase()}
                  </p>
                  <p className="mb-0">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge bg-${
                        order.paymentDetails.paymentStatus === "completed"
                          ? "success"
                          : "warning"
                      }`}
                    >
                      {order.paymentDetails.paymentStatus.toUpperCase()}
                    </span>
                  </p>
                  {order.paymentMethod === "card" &&
                    order.paymentDetails.cardLast4 && (
                      <p className="mb-0 mt-2">
                        <small>
                          ****-****-****-{order.paymentDetails.cardLast4}
                        </small>
                      </p>
                    )}
                </div>
              </div>

              {/* Tracking Info */}
              {order.tracking?.trackingNumber && (
                <div className="card mb-4">
                  <div className="card-header">
                    <h6 className="mb-0">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      Tracking Information
                    </h6>
                  </div>
                  <div className="card-body">
                    <p className="mb-2">
                      <strong>Tracking ID:</strong>{" "}
                      {order.tracking.trackingNumber}
                    </p>
                    {order.tracking.carrier && (
                      <p className="mb-2">
                        <strong>Carrier:</strong> {order.tracking.carrier}
                      </p>
                    )}
                    {order.tracking.estimatedDelivery && (
                      <p className="mb-0">
                        <strong>Estimated Delivery:</strong>{" "}
                        {new Date(
                          order.tracking.estimatedDelivery
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-grid gap-2">
                <Link to="/user/orders" className="btn btn-primary">
                  <i className="fas fa-list me-2"></i>
                  View All Orders
                </Link>
                <Link to="/" className="btn btn-outline-primary">
                  <i className="fas fa-home me-2"></i>
                  Continue Shopping
                </Link>
                {(order.status === "pending" ||
                  order.status === "confirmed") && (
                  <Link
                    to={`/user/orders/${order._id}`}
                    className="btn btn-outline-danger"
                  >
                    <i className="fas fa-times me-2"></i>
                    Cancel Order
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="card mt-5">
            <div className="card-body text-center">
              <h5 className="card-title">What's Next?</h5>
              <div className="row">
                <div className="col-md-4">
                  <i className="fas fa-envelope fa-2x text-primary mb-3"></i>
                  <h6>Email Confirmation</h6>
                  <p className="small text-muted">
                    You'll receive an order confirmation email within a few
                    minutes.
                  </p>
                </div>
                <div className="col-md-4">
                  <i className="fas fa-cog fa-2x text-primary mb-3"></i>
                  <h6>Order Processing</h6>
                  <p className="small text-muted">
                    We'll process your order and prepare it for shipment.
                  </p>
                </div>
                <div className="col-md-4">
                  <i className="fas fa-shipping-fast fa-2x text-primary mb-3"></i>
                  <h6>Shipment Tracking</h6>
                  <p className="small text-muted">
                    Once shipped, you'll receive tracking information via email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
