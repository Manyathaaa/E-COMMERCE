import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { Mail, Phone, Calendar, MoreVertical } from "lucide-react";

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users using the existing endpoint
        const { data } = await axios.get("/api/v1/auth/all-users");
        if (data.success) {
          // Filter out admins
          const customers = data.users.filter(u => u.role !== 1);
          setUsers(customers);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    };
    if (auth?.token) {
      fetchUsers();
    }
  }, [auth?.token]);

  return (
    <AdminLayout title="Customers">
      <div className="ent-card">
        <div className="chart-header">
          <h3 className="chart-title">Customer Management</h3>
        </div>

        {loading ? (
          <div className="text-center p-5">
            <i className="fas fa-spinner fa-spin fa-2x"></i>
            <p className="mt-2">Loading Customers...</p>
          </div>
        ) : (
          <div className="ent-table-container">
            <table className="ent-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Contact Info</th>
                  <th>Joined Date</th>
                  <th>Account Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="profile-avatar" style={{ backgroundColor: 'var(--admin-bg-light)', color: 'var(--admin-primary)', width: 40, height: 40 }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: '600', color: 'var(--admin-text-main)' }}>{user.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <Mail size={14} color="var(--admin-text-secondary)" />
                        <span style={{ fontSize: '13px' }}>{user.email}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Phone size={14} color="var(--admin-text-secondary)" />
                        <span style={{ fontSize: '13px', color: 'var(--admin-text-secondary)' }}>{user.phone}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <Calendar size={14} color="var(--admin-text-secondary)" />
                        <span style={{ fontSize: '13px' }}>
                          {new Date(user.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge status-success">Active</span>
                    </td>
                    <td>
                      <button className="action-btn">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4">No customers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Customers;
