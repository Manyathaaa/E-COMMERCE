import React from "react";
import Layout from "./../components/Layout/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";

const Contact = () => {
  return (
    <Layout>
      <div className="row contactus">
        <div className="col-md-6">
          <img
            src="https://tse4.mm.bing.net/th/id/OIP.7t5Nm4kqSy1_O-mDgnw1owHaHa?pid=Api&P=0&h=180"
            alt="contactus"
            style={{ width: "100%", height: "90%" }}
          />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
          <p className="text-justify mt-2">
            Any queries or information about our products? Feel free to call
            anytime, we are available 24x7.
          </p>
          <p className="mt-3">
            <BiMailSend /> : help@ecommerceapp.com
          </p>
          <p className="mt-3">
            <BiPhoneCall /> : 012-3456789
          </p>
          <p className="mt-3">
            <BiSupport /> : 1800-0000-0000 (Toll Free)
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
