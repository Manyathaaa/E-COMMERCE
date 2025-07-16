import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setAuth] = useAuth(); // don't use auth to avoid eslint warning
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("API URL:", process.env.REACT_APP_API);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/login`,
        { email, password }
      );
      if (res.data.success) {
        toast.success(res.data.message);

        const { token, user } = res.data;

        // Set auth context (if used globally)
        setAuth({ token, user });

        // ✅ Only store essential auth info (not full object)
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
        // Redirect to the page user originally tried to visit, or homepage
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Layout title="Login - Ecommerce App">
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "90vh",
          backgroundImage:
            'url("https://wallawallaclothing.com/cdn/shop/files/iStock-539974264_8edf1de7-0fb5-4d74-91db-9b9f15174164_640x640.jpg?v=1613769599")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="card p-4" style={{ minWidth: "350px", opacity: 0.95 }}>
          <h2 className="text-center mb-4">LOGIN</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email">EMAIL</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password">PASSWORD</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="checkLogin"
              />
              <label className="form-check-label" htmlFor="checkLogin">
                Remember me
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-100 mb-2">
              LOGIN
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={() => navigate("/forgot-password")}
            >
              FORGOT PASSWORD
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
