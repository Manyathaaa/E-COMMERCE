import React from "react";
import { NavLink } from "react-router-dom";
import "./UserMenu.css";

const UserMenu = () => {
  return (
    <div className="user-menu-container">
      <div className="user-menu-card">
        <div className="menu-header">
          <i className="fas fa-user-circle"></i>
          <h4>User Dashboard</h4>
        </div>

        <div className="menu-items">
          <NavLink
            to="/user/dashboard"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/user/profile"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <i className="fas fa-user-edit"></i>
            <span>Profile</span>
          </NavLink>

          <NavLink
            to="/user/orders"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <i className="fas fa-shopping-bag"></i>
            <span>Orders</span>
          </NavLink>

          <NavLink
            to="/user/support"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <i className="fas fa-headset"></i>
            <span>Support</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
