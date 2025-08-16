import React from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineShoppingBag,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
        color: "white",
        padding: "3rem 2rem 1rem",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Main Footer Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            marginBottom: "2rem",
          }}
        >
          {/* Company Info */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <HiOutlineShoppingBag style={{ fontSize: "2rem" }} />
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
                ETREND FASHION
              </h3>
            </div>
            <p
              style={{
                color: "#bdc3c7",
                lineHeight: "1.6",
                marginBottom: "1.5rem",
              }}
            >
              Your ultimate destination for the latest fashion trends. Discover
              premium quality clothing and accessories that define your style.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <FaFacebook
                style={{
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  transition: "color 0.3s ease",
                  color: "#bdc3c7",
                }}
              />
              <FaTwitter
                style={{
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  transition: "color 0.3s ease",
                  color: "#bdc3c7",
                }}
              />
              <FaInstagram
                style={{
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  transition: "color 0.3s ease",
                  color: "#bdc3c7",
                }}
              />
              <FaLinkedin
                style={{
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  transition: "color 0.3s ease",
                  color: "#bdc3c7",
                }}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                color: "#ecf0f1",
              }}
            >
              Quick Links
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <Link
                to="/"
                style={{
                  color: "#bdc3c7",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
              >
                Home
              </Link>
              <Link
                to="/category"
                style={{
                  color: "#bdc3c7",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
              >
                Categories
              </Link>
              <Link
                to="/about"
                style={{
                  color: "#bdc3c7",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                style={{
                  color: "#bdc3c7",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                color: "#ecf0f1",
              }}
            >
              Customer Service
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <Link
                to="/policy"
                style={{
                  color: "#bdc3c7",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                style={{
                  color: "#bdc3c7",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
              >
                Terms & Conditions
              </Link>
              <Link
                to="/shipping"
                style={{
                  color: "#bdc3c7",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
              >
                Shipping Info
              </Link>
              <Link
                to="/returns"
                style={{
                  color: "#bdc3c7",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
              >
                Returns & Exchanges
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                color: "#ecf0f1",
              }}
            >
              Contact Info
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <HiOutlineLocationMarker
                  style={{ fontSize: "1.2rem", color: "#ff6b6b" }}
                />
                <span style={{ color: "#bdc3c7" }}>
                  123 Fashion Street, Style City, SC 12345
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <HiOutlinePhone
                  style={{ fontSize: "1.2rem", color: "#ff6b6b" }}
                />
                <span style={{ color: "#bdc3c7" }}>+1 (555) 123-4567</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <HiOutlineMail
                  style={{ fontSize: "1.2rem", color: "#ff6b6b" }}
                />
                <span style={{ color: "#bdc3c7" }}>info@etrendfashion.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div
          style={{
            borderTop: "1px solid #34495e",
            paddingTop: "1.5rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#bdc3c7",
              margin: 0,
              fontSize: "0.9rem",
            }}
          >
            © 2025 Etrend Fashion. All Rights Reserved. | Designed with ❤️ for
            Fashion Lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
