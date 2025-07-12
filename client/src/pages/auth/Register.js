import React from "react";
import Layout from "../../components/Layout/Layout";

const register = () => {
  return (
    <Layout title="register -Ecommerce app">
      <div className="register">
        <form className="register-form">
          <h2 className="text-center mb-4">Register</h2>
          <div className="mb-3">
            <label htmlFor="email">Email address</label>
            <input type="email" id="email" className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" className="form-control" />
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

export default register;
