import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreeTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/register`,
        { name, email, password, phone, answer },
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
    <Layout title="Register - Your Store">
      {/* Auth Hero Section */}
      <div className="auth-hero">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="hero-title">Join Our Community</h1>
              <p className="hero-subtitle">
                Create your account and start shopping today
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Form Section */}
      <div className="auth-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8 col-sm-10">
              <div className="auth-card">
                <div className="auth-header">
                  <div className="auth-icon">✨</div>
                  <h2>Create Account</h2>
                  <p>Fill in your details to get started</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <div className="input-wrapper">
                          <input
                            type="text"
                            id="name"
                            className="form-control"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                          <div className="input-icon">👤</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
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
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className="form-control"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <div className="input-wrapper">
                          <input
                            type="tel"
                            id="phone"
                            className="form-control"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                          />
                          <div className="input-icon">📱</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="answer">Security Question</label>
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
                      This will help you reset your password if needed
                    </small>
                  </div>

                  <div className="form-options">
                    <div className="terms-agreement">
                      <input
                        type="checkbox"
                        id="terms"
                        className="form-check-input"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        required
                      />
                      <label htmlFor="terms" className="form-check-label">
                        I agree to the{" "}
                        <Link to="/policy">Terms of Service</Link> and{" "}
                        <Link to="/policy">Privacy Policy</Link>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-auth"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  <div className="auth-divider">
                    <span>or</span>
                  </div>

                  <div className="auth-footer">
                    <p>Already have an account?</p>
                    <Link to="/login" className="btn btn-outline-primary">
                      Sign In
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="auth-features">
        <div className="container">
          <div className="row">
            <div className="col-md-4 text-center">
              <div className="feature-item">
                <div className="feature-icon">🎁</div>
                <h5>Welcome Bonus</h5>
                <p>Get exclusive discounts on your first purchase</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="feature-item">
                <div className="feature-icon">🚚</div>
                <h5>Free Shipping</h5>
                <p>Enjoy free shipping on orders above ₹999</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="feature-item">
                <div className="feature-icon">💝</div>
                <h5>Member Rewards</h5>
                <p>Earn points on every purchase and unlock rewards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
