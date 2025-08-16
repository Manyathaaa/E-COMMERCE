import React from "react";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
        <p>Manage your store</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-text">Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/create-category"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <span className="nav-icon">🏷️</span>
          <span className="nav-text">Create Category</span>
        </NavLink>

        <NavLink
          to="/admin/create-product"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <span className="nav-icon">📦</span>
          <span className="nav-text">Create Product</span>
        </NavLink>

        <NavLink
          to="/admin/product"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <span className="nav-icon">📋</span>
          <span className="nav-text">Manage Products</span>
        </NavLink>

        <NavLink
          to="/admin/user"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <span className="nav-icon">👥</span>
          <span className="nav-text">Manage Users</span>
        </NavLink>

        <div className="nav-divider"></div>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <span className="nav-icon">🛒</span>
          <span className="nav-text">Orders</span>
        </NavLink>

        <NavLink
          to="/admin/analytics"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <span className="nav-icon">📈</span>
          <span className="nav-text">Analytics</span>
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <span className="nav-icon">⚙️</span>
          <span className="nav-text">Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="admin-info">
          <p>Logged in as Admin</p>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
