import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Forgot Password - Ecommerce App">
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
          <h2 className="text-center mb-4">RESET PASSWORD</h2>
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
                autoComplete="email"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="answer">SECURITY ANSWER</label>
              <input
                type="text"
                id="answer"
                className="form-control"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your school name"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="newPassword">NEW PASSWORD</label>
              <input
                type="password"
                id="newPassword"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              RESET PASSWORD
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
