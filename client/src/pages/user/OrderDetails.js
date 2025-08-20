import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { useOrder } from "../../context/order";
import { toast } from "react-hot-toast";
import "./OrderDetails.css";

const OrderDetails = () => {
  const [auth] = useAuth();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrder, cancelOrder, loading } = useOrder();
  const [order, setOrder] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    const getOrderDetails = async () => {
      if (orderId) {
        try {
          const result = await getOrder(orderId);
          if (result.success) {
            setOrder(result.order);
          } else {
            toast.error("Failed to load order details");
            navigate("/user/orders");
          }
        } catch (error) {
          console.log("Error fetching order details:", error);
          toast.error("Error loading order details");
          navigate("/user/orders");
        }
      }
    };

    getOrderDetails();
  }, [orderId, getOrder, navigate]);

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    try {
      setCancelling(true);
      const result = await cancelOrder(orderId, cancelReason);
      if (result.success) {
        setOrder(result.order);
        setShowCancelModal(false);
        setCancelReason("");
        toast.success("Order cancelled successfully");
      } else {
        toast.error(result.message || "Failed to cancel order");
      }
    } catch (error) {
      console.log("Error cancelling order:", error);
      toast.error("Error cancelling order");
    } finally {
      setCancelling(false);
    }
  };

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
                          <div
                            key={product._id || index}
                            className="order-item"
                          >
                            <div className="item-image">
                              <img
                                src={
                                  product.product?._id
                                    ? `${process.env.REACT_APP_API}/api/v1/products/product-photo/${product.product._id}`
                                    : `${process.env.REACT_APP_API}/api/v1/products/product-photo/${product._id}`
                                }
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
                                  product.total ||
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
                          <span>
                            ₹
                            {(
                              order.orderSummary?.subtotal ||
                              order.totalAmount ||
                              0
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="summary-row">
                          <span>Shipping:</span>
                          <span>
                            {order.orderSummary?.shipping === 0
                              ? "Free"
                              : order.orderSummary?.shipping
                              ? `₹${order.orderSummary.shipping}`
                              : "Free"}
                          </span>
                        </div>
                        {order.orderSummary?.tax && (
                          <div className="summary-row">
                            <span>Tax (GST):</span>
                            <span>
                              ₹{order.orderSummary.tax.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {order.orderSummary?.discount > 0 && (
                          <div className="summary-row">
                            <span>Discount:</span>
                            <span className="text-success">
                              -₹{order.orderSummary.discount.toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className="summary-row total">
                          <span>Total:</span>
                          <span>
                            ₹
                            {(
                              order.orderSummary?.total ||
                              order.totalAmount ||
                              0
                            ).toLocaleString()}
                          </span>
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
                          <span>{order.paymentMethod || "N/A"}</span>
                        </div>
                        <div className="payment-row">
                          <span>Status:</span>
                          <span className="payment-status paid">
                            {order.paymentDetails?.paymentStatus ||
                              order.paymentStatus ||
                              "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tracking Info */}
                    {(order.trackingNumber ||
                      order.tracking?.trackingNumber) && (
                      <div className="details-card">
                        <h3 className="card-title">
                          <i className="fas fa-route"></i> Tracking Information
                        </h3>
                        <div className="tracking-details">
                          <div className="tracking-row">
                            <span>Tracking Number:</span>
                            <span className="tracking-number">
                              {order.trackingNumber ||
                                order.tracking?.trackingNumber}
                            </span>
                          </div>
                          {(order.estimatedDelivery ||
                            order.tracking?.estimatedDelivery) && (
                            <div className="tracking-row">
                              <span>Estimated Delivery:</span>
                              <span>
                                {formatDate(
                                  order.estimatedDelivery ||
                                    order.tracking.estimatedDelivery
                                )}
                              </span>
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
                      {(order.status === "pending" ||
                        order.status === "confirmed") && (
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => setShowCancelModal(true)}
                        >
                          <i className="fas fa-times"></i> Cancel Order
                        </button>
                      )}
                      <Link
                        to={`/user/support/create?orderId=${order._id}`}
                        className="btn btn-outline-secondary"
                      >
                        <i className="fas fa-headset"></i> Contact Support
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Cancel Order Modal */}
                {showCancelModal && (
                  <div
                    className="modal d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Cancel Order</h5>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowCancelModal(false)}
                          ></button>
                        </div>
                        <div className="modal-body">
                          <p>Are you sure you want to cancel this order?</p>
                          <div className="mb-3">
                            <label className="form-label">
                              Reason for cancellation:
                            </label>
                            <textarea
                              className="form-control"
                              rows="3"
                              value={cancelReason}
                              onChange={(e) => setCancelReason(e.target.value)}
                              placeholder="Please provide a reason for cancellation"
                            ></textarea>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setShowCancelModal(false)}
                          >
                            Keep Order
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={handleCancelOrder}
                            disabled={cancelling || !cancelReason.trim()}
                          >
                            {cancelling ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Cancelling...
                              </>
                            ) : (
                              "Cancel Order"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetails;
