import React from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";

const createproduct = () => {
  return (
    <Layout title={"Dashboard =create-product"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>create product</h1>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default createproduct;
