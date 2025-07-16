import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";

const profile = () => {
  return (
    <Layout title={"Your Profile"}>
      <div className="container-flui p-3 m-3">
        <div className="row">
          <div className="col-md-3"></div>
          <UserMenu />
          <div className="col-md-9">
            <h1>Your profile</h1>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default profile;
