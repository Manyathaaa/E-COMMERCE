import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/login`,
        { email, password }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        const { token, user } = res.data;

        // Update auth context
        setAuth({ token, user });

        // Save to localStorage
        localStorage.setItem(
          "auth",
          JSON.stringify({
            token,
            user: {
              name: user.name,
              email: user.email,
              role: user.role,
            },
          })
        );

        // Optional: set default header for future axios requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Redirect based on user role
        if (user.role === 1) {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Login - Your Store">
      {/* Auth Hero Section */}
      <div className="auth-hero">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="hero-title">Welcome Back</h1>
              <p className="hero-subtitle">
                Sign in to your account to continue shopping
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Form Section */}
      <div className="auth-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7 col-sm-9">
              <div className="auth-card">
                <div className="auth-header">
                  <div className="auth-icon">👋</div>
                  <h2>Sign In</h2>
                  <p>Enter your credentials to access your account</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="username"
                      />
                      <div className="input-icon">📧</div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="form-control"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <div className="form-options">
                    <div className="remember-me">
                      <input
                        type="checkbox"
                        id="remember"
                        className="form-check-input"
                      />
                      <label htmlFor="remember" className="form-check-label">
                        Remember me
                      </label>
                    </div>
                    <Link to="/forgot-password" className="forgot-link">
                      Forgot Password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-auth"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <div className="auth-divider">
                    <span>or</span>
                  </div>

                  <div className="auth-footer">
                    <p>Don't have an account?</p>
                    <Link to="/register" className="btn btn-outline-primary">
                      Create Account
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="auth-features">
        <div className="container">
          <div className="row">
            <div className="col-md-4 text-center">
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <h5>Secure Login</h5>
                <p>Your data is protected with industry-standard encryption</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="feature-item">
                <div className="feature-icon">🛍️</div>
                <h5>Save Cart</h5>
                <p>Your cart items are saved and synced across devices</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="feature-item">
                <div className="feature-icon">📦</div>
                <h5>Order History</h5>
                <p>Track all your orders and reorder your favorites</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
