import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { useSupport } from "../../context/support";
import "./SupportTicket.css";

const SupportTicketDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [auth] = useAuth();
  const {
    currentTicket,
    loading,
    getSupportTicket,
    addMessageToTicket,
    closeSupportTicket,
    getPriorityColor,
    getStatusColor,
    getCategoryDisplayName,
  } = useSupport();

  const [newMessage, setNewMessage] = useState("");
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ticketId) {
      getSupportTicket(ticketId);
    }
  }, [ticketId, getSupportTicket]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const result = await addMessageToTicket(ticketId, newMessage);
    if (result.success) {
      setNewMessage("");
    }
  };

  const handleCloseTicket = async () => {
    setSubmitting(true);
    const result = await closeSupportTicket(ticketId, rating, feedback);
    if (result.success) {
      setShowCloseModal(false);
      setRating(0);
      setFeedback("");
    }
    setSubmitting(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canAddMessage =
    currentTicket && !["closed"].includes(currentTicket.status);

  const canCloseTicket =
    currentTicket &&
    ["resolved", "in-progress", "waiting-response"].includes(
      currentTicket.status
    );

  if (loading || !currentTicket) {
    return (
      <Layout title="Support Ticket - Magica">
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
                  <p className="mt-3">Loading ticket details...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Ticket ${currentTicket.ticketNumber} - Magica`}>
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
                {/* Ticket Header */}
                <div className="ticket-detail-header">
                  <div className="d-flex align-items-center mb-3">
                    <button
                      className="btn btn-light btn-sm me-3"
                      onClick={() => navigate("/user/support")}
                    >
                      <i className="fas fa-arrow-left"></i>
                    </button>
                    <div>
                      <h1>{currentTicket.subject}</h1>
                      <p className="mb-0">
                        Ticket #{currentTicket.ticketNumber}
                      </p>
                    </div>
                  </div>

                  <div className="ticket-detail-meta">
                    <div>
                      <strong>Status:</strong>
                      <span
                        className={`badge bg-${getStatusColor(
                          currentTicket.status
                        )} ms-2`}
                      >
                        {currentTicket.status.replace("-", " ").toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <strong>Priority:</strong>
                      <span
                        className={`badge bg-${getPriorityColor(
                          currentTicket.priority
                        )} ms-2`}
                      >
                        {currentTicket.priority.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <strong>Category:</strong>{" "}
                      {getCategoryDisplayName(currentTicket.category)}
                    </div>
                    <div>
                      <strong>Created:</strong>{" "}
                      {formatDate(currentTicket.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Ticket Info */}
                <div className="row mb-4">
                  <div className="col-md-8">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="mb-0">
                          <i className="fas fa-info-circle me-2"></i>
                          Ticket Information
                        </h5>
                      </div>
                      <div className="card-body">
                        <p>
                          <strong>Description:</strong>
                        </p>
                        <p className="text-muted">
                          {currentTicket.description}
                        </p>

                        {currentTicket.orderId && (
                          <p>
                            <strong>Related Order:</strong>
                            <span className="ms-2">
                              {currentTicket.orderId.orderNumber ||
                                currentTicket.orderId}
                            </span>
                          </p>
                        )}

                        {currentTicket.tags &&
                          currentTicket.tags.length > 0 && (
                            <div>
                              <strong>Tags:</strong>
                              <div className="mt-2">
                                {currentTicket.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="badge bg-secondary me-1"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="mb-0">
                          <i className="fas fa-user me-2"></i>
                          Contact Details
                        </h5>
                      </div>
                      <div className="card-body">
                        <p>
                          <strong>Name:</strong> {currentTicket.user?.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {currentTicket.user?.email}
                        </p>
                        {currentTicket.user?.phone && (
                          <p>
                            <strong>Phone:</strong> {currentTicket.user.phone}
                          </p>
                        )}
                        {currentTicket.assignedTo && (
                          <div className="mt-3">
                            <p>
                              <strong>Assigned to:</strong>
                            </p>
                            <p className="text-muted">
                              {currentTicket.assignedTo.name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-comments me-2"></i>
                      Conversation ({currentTicket.messages?.length || 0}{" "}
                      messages)
                    </h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="messages-container">
                      {currentTicket.messages &&
                      currentTicket.messages.length > 0 ? (
                        currentTicket.messages.map((message, index) => (
                          <div
                            key={index}
                            className={`message ${message.sender}`}
                          >
                            <div className="message-header">
                              <span className="message-sender">
                                {message.senderName}
                                {message.sender === "support" && (
                                  <span className="badge bg-info ms-2">
                                    Support
                                  </span>
                                )}
                              </span>
                              <span className="message-time">
                                {formatDate(message.timestamp)}
                              </span>
                            </div>
                            <p className="message-content">{message.message}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted py-3">
                          No messages yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Add Message Form */}
                {canAddMessage && (
                  <div className="card mb-4">
                    <div className="card-header">
                      <h5 className="mb-0">
                        <i className="fas fa-reply me-2"></i>
                        Add Message
                      </h5>
                    </div>
                    <div className="card-body">
                      <form
                        onSubmit={handleSendMessage}
                        className="message-form"
                      >
                        <div className="mb-3">
                          <textarea
                            className="form-control"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message here..."
                            rows="4"
                            required
                          ></textarea>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading || !newMessage.trim()}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Sending...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-paper-plane me-2"></i>
                              Send Message
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* Close Ticket Button */}
                {canCloseTicket && (
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-success"
                      onClick={() => setShowCloseModal(true)}
                    >
                      <i className="fas fa-check me-2"></i>
                      Close Ticket
                    </button>
                  </div>
                )}

                {/* Resolution Info */}
                {currentTicket.resolution && (
                  <div className="card mt-4">
                    <div className="card-header bg-success text-white">
                      <h5 className="mb-0">
                        <i className="fas fa-check-circle me-2"></i>
                        Resolution
                      </h5>
                    </div>
                    <div className="card-body">
                      <p>{currentTicket.resolution.summary}</p>
                      <div className="text-muted">
                        <small>
                          Resolved by{" "}
                          {currentTicket.resolution.resolvedBy?.name} on{" "}
                          {formatDate(currentTicket.resolution.resolvedAt)}
                        </small>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Satisfaction */}
                {currentTicket.customerSatisfaction && (
                  <div className="card mt-4">
                    <div className="card-header">
                      <h5 className="mb-0">
                        <i className="fas fa-star me-2"></i>
                        Your Feedback
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="mb-2">
                        <strong>Rating:</strong>
                        <div className="rating-stars d-inline-block ms-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`rating-star ${
                                star <=
                                currentTicket.customerSatisfaction.rating
                                  ? "active"
                                  : ""
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      {currentTicket.customerSatisfaction.feedback && (
                        <p>
                          <strong>Feedback:</strong>{" "}
                          {currentTicket.customerSatisfaction.feedback}
                        </p>
                      )}
                      <small className="text-muted">
                        Submitted on{" "}
                        {formatDate(
                          currentTicket.customerSatisfaction.submittedAt
                        )}
                      </small>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Close Ticket Modal */}
        {showCloseModal && (
          <div
            className="modal d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Close Support Ticket</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCloseModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    Please rate your support experience and provide feedback
                    (optional):
                  </p>

                  <div className="mb-3">
                    <label className="form-label">Rating (1-5 stars):</label>
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`rating-star ${
                            star <= rating ? "active" : ""
                          }`}
                          onClick={() => setRating(star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Feedback (optional):</label>
                    <textarea
                      className="form-control"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Tell us about your experience..."
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCloseModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleCloseTicket}
                    disabled={submitting || rating === 0}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Closing...
                      </>
                    ) : (
                      "Close Ticket"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SupportTicketDetail;
