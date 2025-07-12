import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About us-Ecommerce app"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="https://tse2.mm.bing.net/th/id/OIP.swEXMUfoDH-P_-MR8JLSiAHaE8?pid=Api&P=0&h=180"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <h3>About</h3>
          <p className="text-justify mt-2">
            Our app provides a simple, intuitive interface for users to...Browse
            products across various categories. Register and log in to a
            personal account. Add items to cart. Place orders with ease and
            Track purchases
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
