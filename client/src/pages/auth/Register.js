import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/register`,
        { name, email, password, phone, address, answer },
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
    <Layout title="Register - Magica">
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
        <div
          className="card p-4"
          style={{
            minWidth: "350px",
            opacity: 0.95,
            borderRadius: "10px",
            maxWidth: "450px",
          }}
        >
          <h2 className="text-center mb-4">REGISTER</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>NAME</label>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>EMAIL</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="mb-3">
              <label>PASSWORD</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="mb-3">
              <label>PHONE</label>
              <input
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>ADDRESS</label>
              <input
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label>SECURITY ANSWER</label>
              <input
                className="form-control"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your school"
                required
              />
            </div>
            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="check" />
              <label className="form-check-label" htmlFor="check">
                Agree to terms
              </label>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
