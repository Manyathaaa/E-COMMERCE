import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.umltr7KSyHS1iymsksz42AHaFj?pid=Api&P=0&h=180"
            alt="contactus"
            style={{ width: "100%", height: "90%" }}
          />
        </div>
        <div className="col-md-4">
          <h4>Privacy Policy</h4>
          <p>
            Privacy Policy Summary: This eCommerce app collects user data such
            as name, email, address, and order history to process purchases and
            improve user experience. We ensure data is securely stored and never
            sold to third parties. Cookies are used to enhance browsing. Users
            can access, update, or delete their data anytime by contacting
            support.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
