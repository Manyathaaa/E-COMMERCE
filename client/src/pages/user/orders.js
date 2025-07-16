import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";

const orders = () => {
  return (
    <Layout title={"Your orders"}>
      <div className="container-flui p-3 m-3">
        <div className="row">
          <div className="col-md-3"></div>
          <UserMenu />
          <div className="col-md-9">
            <h1>all orders</h1>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default orders;
