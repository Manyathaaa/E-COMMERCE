import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/forgot-password`,
        {
          email,
          answer,
          newPassword,
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Reset Password - Your Store">
      {/* Auth Hero Section */}
      <div className="auth-hero">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="hero-title">Reset Password</h1>
              <p className="hero-subtitle">
                Don't worry, we'll help you get back into your account
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
                  <div className="auth-icon">🔑</div>
                  <h2>Reset Your Password</h2>
                  <p>Enter your account details to reset your password</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                      <div className="input-icon">📧</div>
                    </div>
                    <small className="form-text">
                      We'll use this to verify your identity
                    </small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="answer">Security Answer</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="answer"
                        className="form-control"
                        placeholder="What is the name of your first school?"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        required
                      />
                      <div className="input-icon">🔐</div>
                    </div>
                    <small className="form-text">
                      Enter the answer you provided during registration
                    </small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        className="form-control"
                        placeholder="Create a new strong password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                    <small className="form-text">
                      Choose a strong password with at least 8 characters
                    </small>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-auth"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Resetting Password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>

                  <div className="auth-divider">
                    <span>or</span>
                  </div>

                  <div className="auth-footer">
                    <p>Remember your password?</p>
                    <Link to="/login" className="btn btn-outline-primary">
                      Back to Sign In
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="auth-help">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h4>Need More Help?</h4>
              <p>
                If you're still having trouble accessing your account, our
                support team is here to help.
              </p>
              <div className="help-actions">
                <Link to="/contact" className="btn btn-outline-primary me-3">
                  Contact Support
                </Link>
                <Link to="/register" className="btn btn-outline-secondary">
                  Create New Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Tips */}
      <div className="auth-features">
        <div className="container">
          <div className="row">
            <div className="col-md-4 text-center">
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <h5>Strong Password</h5>
                <p>Use a combination of letters, numbers, and symbols</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="feature-item">
                <div className="feature-icon">🔄</div>
                <h5>Regular Updates</h5>
                <p>Change your password regularly for better security</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="feature-item">
                <div className="feature-icon">🛡️</div>
                <h5>Account Safety</h5>
                <p>Never share your password with anyone</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
