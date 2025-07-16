import React from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
const user = () => {
  return (
    <Layout title={"Dashboard - all users"}>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1>all users</h1>
        </div>
      </div>
    </Layout>
  );
};

export default user;
