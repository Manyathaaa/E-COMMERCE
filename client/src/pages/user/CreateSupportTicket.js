import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { useSupport } from "../../context/support";
import { useOrder } from "../../context/order";
import "../../css/SupportTicket.css";

const CreateSupportTicket = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { createSupportTicket, loading } = useSupport();
  const { orders, getUserOrders } = useOrder();

  const [formData, setFormData] = useState({
    subject: "",
    category: "general-inquiry",
    priority: "medium",
    description: "",
    orderId: "",
  });

  // Get order ID from URL params if coming from order page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderIdFromUrl = params.get("orderId");
    if (orderIdFromUrl) {
      setFormData((prev) => ({ ...prev, orderId: orderIdFromUrl }));
    }
  }, [location]);

  // Fetch user orders for order selection
  useEffect(() => {
    if (auth?.user) {
      getUserOrders(1, "all");
    }
  }, [auth?.user, getUserOrders]);

  const categories = [
    { value: "general-inquiry", label: "General Inquiry" },
    { value: "order-issue", label: "Order Issue" },
    { value: "payment-issue", label: "Payment Issue" },
    { value: "product-inquiry", label: "Product Inquiry" },
    { value: "shipping-issue", label: "Shipping Issue" },
    { value: "return-refund", label: "Return/Refund" },
    { value: "account-issue", label: "Account Issue" },
    { value: "technical-support", label: "Technical Support" },
    { value: "complaint", label: "Complaint" },
    { value: "suggestion", label: "Suggestion" },
  ];

  const priorities = [
    { value: "low", label: "Low", color: "success" },
    { value: "medium", label: "Medium", color: "warning" },
    { value: "high", label: "High", color: "danger" },
    { value: "urgent", label: "Urgent", color: "danger" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.description.trim()) {
      return;
    }

    const ticketData = {
      ...formData,
      orderId: formData.orderId || undefined,
    };

    const result = await createSupportTicket(ticketData);

    if (result.success) {
      navigate(`/user/support/ticket/${result.ticket._id}`);
    }
  };

  return (
    <Layout title="Create Support Ticket - Magica">
      <div className="support-container">
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-3 col-md-4">
              <UserMenu />
            </div>

            {/* Main Content */}
            <div className="col-lg-9 col-md-8">
              <div className="support-content">
                {/* Header */}
                <div className="support-header mb-4">
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-outline-secondary me-3"
                      onClick={() => navigate("/user/support")}
                    >
                      <i className="fas fa-arrow-left"></i>
                    </button>
                    <div>
                      <h1>Create Support Ticket</h1>
                      <p className="text-muted">
                        Describe your issue and we'll help you resolve it
                        quickly
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Help */}
                <div className="card mb-4">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="fas fa-lightbulb text-warning me-2"></i>
                      Quick Help
                    </h5>
                    <p className="card-text">
                      Before creating a ticket, check if your question is
                      answered in our{" "}
                      <a href="/faq" className="text-decoration-none">
                        FAQ section
                      </a>{" "}
                      or{" "}
                      <a href="/contact" className="text-decoration-none">
                        Contact page
                      </a>
                      .
                    </p>
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="fw-bold">Common Issues:</h6>
                        <ul className="list-unstyled">
                          <li>• Order tracking problems</li>
                          <li>• Payment failures</li>
                          <li>• Product returns</li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h6 className="fw-bold">Response Times:</h6>
                        <ul className="list-unstyled">
                          <li>• Low Priority: 24-48 hours</li>
                          <li>• Medium Priority: 12-24 hours</li>
                          <li>• High/Urgent: 2-6 hours</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Support Form */}
                <div className="card">
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-8 mb-3">
                          <label className="form-label">
                            <i className="fas fa-heading me-1"></i>
                            Subject *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="Brief description of your issue"
                            required
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label">
                            <i className="fas fa-flag me-1"></i>
                            Priority
                          </label>
                          <select
                            className="form-select"
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                          >
                            {priorities.map((priority) => (
                              <option
                                key={priority.value}
                                value={priority.value}
                              >
                                {priority.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">
                            <i className="fas fa-tags me-1"></i>
                            Category *
                          </label>
                          <select
                            className="form-select"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                          >
                            {categories.map((category) => (
                              <option
                                key={category.value}
                                value={category.value}
                              >
                                {category.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">
                            <i className="fas fa-shopping-bag me-1"></i>
                            Related Order (Optional)
                          </label>
                          <select
                            className="form-select"
                            name="orderId"
                            value={formData.orderId}
                            onChange={handleInputChange}
                          >
                            <option value="">
                              Select an order (if applicable)
                            </option>
                            {orders?.map((order) => (
                              <option key={order._id} value={order._id}>
                                {order.orderNumber} - {order.status} - ₹
                                {(
                                  order.orderSummary?.total ||
                                  order.totalAmount ||
                                  0
                                ).toLocaleString()}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label">
                          <i className="fas fa-comment me-1"></i>
                          Description *
                        </label>
                        <textarea
                          className="form-control"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows="6"
                          placeholder="Please provide detailed information about your issue, including any error messages, steps you've taken, and what you expected to happen."
                          required
                        ></textarea>
                        <div className="form-text">
                          <i className="fas fa-info-circle me-1"></i>
                          The more details you provide, the faster we can help
                          you resolve your issue.
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <div className="text-muted">
                          <small>
                            <i className="fas fa-lock me-1"></i>
                            Your information is secure and confidential
                          </small>
                        </div>
                        <div>
                          <button
                            type="button"
                            className="btn btn-outline-secondary me-2"
                            onClick={() => navigate("/user/support")}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={
                              loading ||
                              !formData.subject.trim() ||
                              !formData.description.trim()
                            }
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Creating Ticket...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-paper-plane me-2"></i>
                                Create Support Ticket
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
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

export default CreateSupportTicket;
