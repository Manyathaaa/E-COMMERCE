import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-dark text-light py-4">
      <div className="text-center">
        <h4>All Rights Reserved &copy; 2025</h4>
        <p className="mt-3">
          <Link to="/about" className="text-light mx-3">
            About
          </Link>
          <Link to="/contact" className="text-light mx-3">
            Contact
          </Link>
          <Link to="/policy" className="text-light mx-3">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Footer;
