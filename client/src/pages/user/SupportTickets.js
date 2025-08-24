import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { useSupport } from "../../context/support";
import "../../css/SupportTicket.css";

const SupportTickets = () => {
  const [auth] = useAuth();
  // Removed unused variable 'navigate'
  const {
    tickets,
    loading,
    getUserSupportTickets,
    getTicketStats,
    getPriorityColor,
    getStatusColor,
    getCategoryDisplayName,
  } = useSupport();

  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    page: 1,
  });

  useEffect(() => {
    if (auth?.user) {
      getUserSupportTickets(filters.page, filters.status, filters.category);
    }
  }, [auth?.user, filters, getUserSupportTickets]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const stats = getTicketStats();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLastMessage = (ticket) => {
    if (!ticket.messages || ticket.messages.length === 0) {
      return "No messages yet";
    }
    const lastMessage = ticket.messages[ticket.messages.length - 1];
    const preview =
      lastMessage.message.length > 100
        ? lastMessage.message.substring(0, 100) + "..."
        : lastMessage.message;
    return `${lastMessage.senderName}: ${preview}`;
  };

  if (loading && tickets.length === 0) {
    return (
      <Layout title="Support Tickets - Magica">
        <div className="support-container">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-md-4">
                <UserMenu />
              </div>
              <div className="col-lg-9 col-md-8">
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading support tickets...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Support Tickets - Magica">
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
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h1>Support Tickets</h1>
                      <p className="text-muted">
                        Manage your support requests and get help from our team
                      </p>
                    </div>
                    <Link to="/user/support/create" className="btn btn-primary">
                      <i className="fas fa-plus me-2"></i>
                      New Ticket
                    </Link>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="row mb-4">
                  <div className="col-lg-3 col-md-6 mb-3">
                    <div className="stat-card">
                      <div className="stat-icon total">
                        <i className="fas fa-ticket-alt"></i>
                      </div>
                      <div className="stat-content">
                        <h3>{stats.total}</h3>
                        <p>Total Tickets</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 mb-3">
                    <div className="stat-card">
                      <div className="stat-icon open">
                        <i className="fas fa-clock"></i>
                      </div>
                      <div className="stat-content">
                        <h3>{stats.open}</h3>
                        <p>Open</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 mb-3">
                    <div className="stat-card">
                      <div className="stat-icon progress">
                        <i className="fas fa-cog"></i>
                      </div>
                      <div className="stat-content">
                        <h3>{stats.inProgress}</h3>
                        <p>In Progress</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 mb-3">
                    <div className="stat-card">
                      <div className="stat-icon resolved">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <div className="stat-content">
                        <h3>{stats.resolved + stats.closed}</h3>
                        <p>Resolved</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-md-4">
                        <label className="form-label">Filter by Status:</label>
                        <select
                          className="form-select"
                          value={filters.status}
                          onChange={(e) =>
                            handleFilterChange("status", e.target.value)
                          }
                        >
                          <option value="all">All Status</option>
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="waiting-response">
                            Waiting Response
                          </option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Filter by Category:
                        </label>
                        <select
                          className="form-select"
                          value={filters.category}
                          onChange={(e) =>
                            handleFilterChange("category", e.target.value)
                          }
                        >
                          <option value="all">All Categories</option>
                          <option value="order-issue">Order Issue</option>
                          <option value="payment-issue">Payment Issue</option>
                          <option value="product-inquiry">
                            Product Inquiry
                          </option>
                          <option value="shipping-issue">Shipping Issue</option>
                          <option value="return-refund">Return/Refund</option>
                          <option value="account-issue">Account Issue</option>
                          <option value="technical-support">
                            Technical Support
                          </option>
                          <option value="general-inquiry">
                            General Inquiry
                          </option>
                          <option value="complaint">Complaint</option>
                          <option value="suggestion">Suggestion</option>
                        </select>
                      </div>
                      <div className="col-md-4 d-flex align-items-end">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            setFilters({
                              status: "all",
                              category: "all",
                              page: 1,
                            })
                          }
                        >
                          <i className="fas fa-refresh me-2"></i>
                          Clear Filters
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tickets List */}
                {tickets.length > 0 ? (
                  <div className="tickets-list">
                    {tickets.map((ticket) => (
                      <div key={ticket._id} className="ticket-card">
                        <div className="ticket-header">
                          <div className="ticket-info">
                            <h5 className="ticket-title">
                              <Link
                                to={`/user/support/ticket/${ticket._id}`}
                                className="text-decoration-none"
                              >
                                {ticket.subject}
                              </Link>
                            </h5>
                            <div className="ticket-meta">
                              <span className="ticket-number">
                                #{ticket.ticketNumber}
                              </span>
                              <span className="ticket-date">
                                {formatDate(ticket.createdAt)}
                              </span>
                            </div>
                          </div>
                          <div className="ticket-badges">
                            <span
                              className={`badge bg-${getStatusColor(
                                ticket.status
                              )}`}
                            >
                              {ticket.status.replace("-", " ").toUpperCase()}
                            </span>
                            <span
                              className={`badge bg-${getPriorityColor(
                                ticket.priority
                              )}`}
                            >
                              {ticket.priority.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="ticket-body">
                          <p className="ticket-category">
                            <i className="fas fa-tag me-1"></i>
                            {getCategoryDisplayName(ticket.category)}
                          </p>
                          <p className="ticket-preview">
                            {getLastMessage(ticket)}
                          </p>
                          {ticket.orderId && (
                            <p className="ticket-order">
                              <i className="fas fa-shopping-bag me-1"></i>
                              Related to Order:{" "}
                              <strong>
                                {ticket.orderId.orderNumber || ticket.orderId}
                              </strong>
                            </p>
                          )}
                        </div>

                        <div className="ticket-footer">
                          <div className="ticket-stats">
                            <span>
                              <i className="fas fa-comments me-1"></i>
                              {ticket.messages?.length || 0} messages
                            </span>
                            {ticket.messages && ticket.messages.length > 0 && (
                              <span>
                                <i className="fas fa-clock me-1"></i>
                                Last updated:{" "}
                                {formatDate(
                                  ticket.messages[ticket.messages.length - 1]
                                    .timestamp
                                )}
                              </span>
                            )}
                          </div>
                          <div className="ticket-actions">
                            <Link
                              to={`/user/support/ticket/${ticket._id}`}
                              className="btn btn-outline-primary btn-sm"
                            >
                              <i className="fas fa-eye me-1"></i>
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-tickets">
                    <div className="no-tickets-icon">
                      <i className="fas fa-ticket-alt"></i>
                    </div>
                    <h4>No Support Tickets Yet</h4>
                    <p>
                      When you need help, create a support ticket and our team
                      will assist you.
                    </p>
                    <Link to="/user/support/create" className="btn btn-primary">
                      <i className="fas fa-plus me-2"></i>
                      Create Your First Ticket
                    </Link>
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

export default SupportTickets;
