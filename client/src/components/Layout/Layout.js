import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Helmet } from "react-helmet";

const Layout = ({ children, title, description, keywords, author }) => {
  //props is an object that contains all the properties passed to the component
  // This component serves as a layout wrapper for the application
  // It can be used to include common elements like headers, footers, or sidebars
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: "76vh" }}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

//props are mainly used to pass data from a parent component to a child component
