import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      <main style={{ minHeight: "76vh" }}>
        <ToastContainer />
        {children}
      </main>
      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: "Ecommerce app -shope now ",
  description: "mern stack project",
  keywords: "mern,react,node,mongodb",
  author: "kuchbhi",
};

export default Layout;

//props are mainly used to pass data from a parent component to a child component
