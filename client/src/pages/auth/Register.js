import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  //form function
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, email, password, phone, address);
    toast.success("registered successfully");
  };
  return (
    <Layout title="register -Ecommerce app">
      <div className="register">
        <form onSubmit={handleSubmit}>
          <h2 className="text-center mb-4">REGISTER</h2>
          <div className="mb-3">
            <label htmlFor="email">NAME</label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">EMAIL</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">PASSWORD</label>
            <input
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">PHONE</label>
            <input
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">ADDRESS</label>
            <input
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="check" />
            <label className="form-check-label" htmlFor="check">
              Check me out
            </label>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
