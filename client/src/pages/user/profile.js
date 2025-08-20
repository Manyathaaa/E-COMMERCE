import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { useOrder } from "../../context/order";
import { toast } from "react-toastify";
import axios from "axios";
import "./profile.css";

const Profile = () => {
  const [auth, setAuth] = useAuth();
  const { getUserOrders } = useOrder();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    question: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    wishlist: 0,
    reviews: 0,
  });

  // Initialize form data with user info
  useEffect(() => {
    if (auth?.user) {
      setFormData({
        name: auth.user.name || "",
        email: auth.user.email || "",
        password: "",
        phone: auth.user.phone || "",
        address: auth.user.address || "",
        question: auth.user.question || "",
      });
    }
  }, [auth?.user]);

  // Fetch user statistics (orders, wishlist, reviews)
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        if (auth?.user) {
          // Fetch real order data
          const result = await getUserOrders(1, "all");
          if (result.success) {
            const userOrders = result.orders || [];
            setOrderStats({
              total: userOrders.length,
              wishlist: 0, // TODO: Replace with actual wishlist count
              reviews: 0, // TODO: Replace with actual reviews count
            });
          } else {
            // If no orders or error, set empty state
            setOrderStats({
              total: 0,
              wishlist: 0,
              reviews: 0,
            });
          }
        }
      } catch (error) {
        console.log("Error fetching user stats:", error);
        setOrderStats({
          total: 0,
          wishlist: 0,
          reviews: 0,
        });
      }
    };

    fetchUserStats();
  }, [auth?.user, getUserOrders]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/user/profile`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
        }
      );

      if (data?.success) {
        setAuth({
          ...auth,
          user: data.updatedUser,
        });

        const authData = localStorage.getItem("auth");
        const parsedAuth = JSON.parse(authData);
        parsedAuth.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(parsedAuth));

        toast.success("Profile updated successfully!");
        setIsEditing(false);
        setFormData({ ...formData, password: "" });
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({
      name: auth.user.name || "",
      email: auth.user.email || "",
      password: "",
      phone: auth.user.phone || "",
      address: auth.user.address || "",
      question: auth.user.question || "",
    });
    setIsEditing(false);
  };

  return (
    <Layout title={"Your Profile - Magica"}>
      <div className="profile-container">
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-3 col-md-4">
              <UserMenu />
            </div>

            {/* Main Content */}
            <div className="col-lg-9 col-md-8">
              <div className="profile-content">
                {/* Profile Header */}
                <div className="profile-header mb-4">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <div className="d-flex align-items-center">
                        <div className="profile-avatar me-4">
                          <div className="avatar-large">
                            {auth?.user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="avatar-status online"></div>
                        </div>
                        <div>
                          <h1 className="profile-name">{auth?.user?.name}</h1>
                          <p className="profile-email">{auth?.user?.email}</p>
                          <div className="profile-badges">
                            <span className="badge verified-badge">
                              <i className="fas fa-check-circle"></i> Verified
                            </span>
                            <span className="badge member-badge">
                              <i className="fas fa-star"></i> Member since 2024
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 text-end">
                      {!isEditing ? (
                        <button
                          className="btn btn-primary edit-profile-btn"
                          onClick={() => setIsEditing(true)}
                        >
                          <i className="fas fa-edit"></i> Edit Profile
                        </button>
                      ) : (
                        <div className="edit-actions">
                          <button
                            className="btn btn-outline-secondary me-2"
                            onClick={handleCancel}
                          >
                            <i className="fas fa-times"></i> Cancel
                          </button>
                          <button
                            className="btn btn-success"
                            onClick={handleSubmit}
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Saving...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-save"></i> Save Changes
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="profile-form-section">
                  <div className="row">
                    <div className="col-lg-8">
                      <div className="form-card">
                        <div className="form-header">
                          <h4>
                            <i className="fas fa-user-circle"></i> Personal
                            Information
                          </h4>
                          <p>
                            Manage your personal information and account details
                          </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                          <div className="row">
                            <div className="col-md-6 mb-4">
                              <label className="form-label">
                                <i className="fas fa-user"></i> Full Name
                              </label>
                              <input
                                type="text"
                                className="form-control modern-input"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                required
                                placeholder="Enter your full name"
                              />
                            </div>

                            <div className="col-md-6 mb-4">
                              <label className="form-label">
                                <i className="fas fa-envelope"></i> Email
                                Address
                              </label>
                              <input
                                type="email"
                                className="form-control modern-input"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                required
                                placeholder="Enter your email"
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6 mb-4">
                              <label className="form-label">
                                <i className="fas fa-phone"></i> Phone Number
                              </label>
                              <input
                                type="tel"
                                className="form-control modern-input"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="Enter your phone number"
                              />
                            </div>

                            <div className="col-md-6 mb-4">
                              <label className="form-label">
                                <i className="fas fa-lock"></i> New Password
                              </label>
                              <div className="password-input-group">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  className="form-control modern-input"
                                  name="password"
                                  value={formData.password}
                                  onChange={handleChange}
                                  disabled={!isEditing}
                                  placeholder="Enter new password (optional)"
                                />
                                {isEditing && (
                                  <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                  >
                                    <i
                                      className={`fas ${
                                        showPassword ? "fa-eye-slash" : "fa-eye"
                                      }`}
                                    ></i>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="form-label">
                              <i className="fas fa-map-marker-alt"></i> Address
                            </label>
                            <textarea
                              className="form-control modern-input"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              disabled={!isEditing}
                              rows="3"
                              placeholder="Enter your complete address"
                            ></textarea>
                          </div>
                        </form>
                      </div>
                    </div>

                    {/* Profile Stats Sidebar */}
                    <div className="col-lg-4">
                      <div className="stats-card mb-4">
                        <h5>
                          <i className="fas fa-chart-bar"></i> Account Stats
                        </h5>
                        <div className="stat-item">
                          <div className="stat-icon orders">
                            <i className="fas fa-shopping-bag"></i>
                          </div>
                          <div className="stat-info">
                            <span className="stat-number">
                              {orderStats.total}
                            </span>
                            <span className="stat-label">Total Orders</span>
                          </div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-icon wishlist">
                            <i className="fas fa-heart"></i>
                          </div>
                          <div className="stat-info">
                            <span className="stat-number">
                              {orderStats.wishlist}
                            </span>
                            <span className="stat-label">Wishlist Items</span>
                          </div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-icon reviews">
                            <i className="fas fa-star"></i>
                          </div>
                          <div className="stat-info">
                            <span className="stat-number">
                              {orderStats.reviews}
                            </span>
                            <span className="stat-label">Reviews Written</span>
                          </div>
                        </div>
                      </div>

                      <div className="security-card">
                        <h5>
                          <i className="fas fa-shield-alt"></i> Account Security
                        </h5>
                        <div className="security-item">
                          <div className="security-status verified">
                            <i className="fas fa-check-circle"></i>
                            <span>Email Verified</span>
                          </div>
                        </div>
                        <div className="security-item">
                          <div className="security-status verified">
                            <i className="fas fa-check-circle"></i>
                            <span>Phone Verified</span>
                          </div>
                        </div>
                        <div className="security-item">
                          <div className="security-status pending">
                            <i className="fas fa-clock"></i>
                            <span>Two-Factor Auth</span>
                          </div>
                          <button className="btn btn-sm btn-outline-primary">
                            Enable
                          </button>
                        </div>
                      </div>
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

export default Profile;
