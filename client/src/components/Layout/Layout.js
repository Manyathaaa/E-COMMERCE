import React from "react";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  //props is an object that contains all the properties passed to the component
  // This component serves as a layout wrapper for the application
  // It can be used to include common elements like headers, footers, or sidebars
  return (
    <div>
      <Header />
      <main style={{ minHeight: "80vh" }}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

//props are mainly used to pass data from a parent component to a child component
