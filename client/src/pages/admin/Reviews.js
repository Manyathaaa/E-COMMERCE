import React, { useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import { Star, CheckCircle, XCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const Reviews = () => {
  // Dummy data for reviews since backend doesn't have review routes yet
  const [reviews, setReviews] = useState([
    {
      id: 1,
      customer: "John Doe",
      product: "Nike Air Max 270",
      rating: 5,
      comment: "Absolutely love these shoes! Very comfortable for daily use and running.",
      date: "2026-07-09T10:30:00Z",
      status: "pending"
    },
    {
      id: 2,
      customer: "Sarah Williams",
      product: "Apple Watch Series 9",
      rating: 4,
      comment: "Great smartwatch, battery life could be a little better but overall very satisfied.",
      date: "2026-07-08T14:15:00Z",
      status: "approved"
    },
    {
      id: 3,
      customer: "Mike Johnson",
      product: "Sony WH-1000XM5",
      rating: 2,
      comment: "The noise cancellation is good but the headband feels very uncomfortable after 2 hours.",
      date: "2026-07-07T09:45:00Z",
      status: "rejected"
    }
  ]);

  const handleStatusChange = (id, newStatus) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
    toast.success(`Review ${newStatus} successfully!`);
  };

  const handleDelete = (id) => {
    setReviews(reviews.filter(r => r.id !== id));
    toast.success("Review deleted successfully!");
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        fill={i < rating ? "#FFCE20" : "none"} 
        color={i < rating ? "#FFCE20" : "#E2E8F0"} 
        className="me-1"
      />
    ));
  };

  return (
    <AdminLayout title="Reviews">
      <div className="ent-card">
        <div className="chart-header">
          <h3 className="chart-title">Customer Reviews</h3>
        </div>

        <div className="alert alert-info border-0 mb-4" style={{ backgroundColor: 'var(--status-info-bg)', color: 'var(--status-info-text)' }}>
          <i className="fas fa-info-circle me-2"></i>
          This is a preview of the Reviews interface. Real backend integration is pending.
        </div>

        <div className="ent-table-container">
          <table className="ent-table">
            <thead>
              <tr>
                <th>Customer & Product</th>
                <th>Review</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--admin-text-main)' }}>{review.customer}</div>
                    <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>{review.product}</div>
                  </td>
                  <td style={{ maxWidth: '300px' }}>
                    <div className="d-flex mb-1">
                      {renderStars(review.rating)}
                    </div>
                    <p style={{ fontSize: '13px', margin: 0, color: 'var(--admin-text-main)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      "{review.comment}"
                    </p>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px' }}>
                      {new Date(review.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </td>
                  <td>
                    {review.status === 'pending' && <span className="status-badge status-warning">Pending</span>}
                    {review.status === 'approved' && <span className="status-badge status-success">Approved</span>}
                    {review.status === 'rejected' && <span className="status-badge status-danger">Rejected</span>}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      {review.status !== 'approved' && (
                        <button 
                          className="action-btn" 
                          title="Approve"
                          onClick={() => handleStatusChange(review.id, 'approved')}
                        >
                          <CheckCircle size={18} color="#05CD99" />
                        </button>
                      )}
                      {review.status !== 'rejected' && (
                        <button 
                          className="action-btn" 
                          title="Reject"
                          onClick={() => handleStatusChange(review.id, 'rejected')}
                        >
                          <XCircle size={18} color="#EE5D50" />
                        </button>
                      )}
                      <button 
                        className="action-btn delete" 
                        title="Delete"
                        onClick={() => handleDelete(review.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reviews;
