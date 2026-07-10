import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const [loading, setLoading] = useState(true);

  // Fetch all orders
  const getOrders = async () => {
    try {
      if (!auth?.token) return;
      const { data } = await axios.get("/api/v1/orders/admin/all-orders");
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getOrders();
  }, [auth?.token]);

  const handleChangeStatus = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put(`/api/v1/orders/admin/${orderId}/status`, {
        status: newStatus,
      });
      if (data.success) {
        toast.success("Order status updated!");
        // Refresh orders
        getOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating order status");
    }
  };

  return (
    <AdminLayout title="Orders">
      <div className="ent-card">
        <div className="chart-header">
          <h3 className="chart-title">All Customer Orders</h3>
        </div>
        
        {loading ? (
          <div className="text-center p-5">
            <i className="fas fa-spinner fa-spin fa-2x"></i>
            <p className="mt-2">Loading Orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="alert alert-info border-0" style={{backgroundColor: 'var(--status-info-bg)', color: 'var(--status-info-text)'}}>
            No orders found.
          </div>
        ) : (
          <div className="ent-table-container">
            <table className="ent-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <span style={{ fontWeight: '600' }}>{order.orderNumber}</span>
                      <br />
                      <span style={{ color: 'var(--admin-text-secondary)', fontSize: '12px' }}>{order.products.length} Items</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600' }}>{order.shippingAddress?.fullName || order.user?.name}</span>
                      <br />
                      <span style={{ color: 'var(--admin-text-secondary)', fontSize: '12px' }}>{order.user?.email}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700' }}>₹{(order.orderSummary?.total || 0).toLocaleString()}</span>
                      <br />
                      <span style={{ color: 'var(--admin-text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>{order.paymentMethod}</span>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                      <br />
                      <span style={{ color: 'var(--admin-text-secondary)', fontSize: '12px' }}>
                        {new Date(order.createdAt).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </td>
                    <td>
                      <select 
                        className={`status-badge ${
                          order.status === 'delivered' ? 'status-success' : 
                          order.status === 'cancelled' ? 'status-danger' : 
                          'status-warning'
                        }`}
                        value={order.status}
                        onChange={(e) => handleChangeStatus(order._id, e.target.value)}
                        style={{ outline: 'none', border: 'none', cursor: 'pointer', appearance: 'none', textAlign: 'center' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
