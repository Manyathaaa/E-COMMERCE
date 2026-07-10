import React from "react";
import { Menu, Search, Bell } from "lucide-react";
import { useAuth } from "../../context/auth";
import { useLocation } from "react-router-dom";

const AdminHeader = ({ toggleSidebar, setMobileOpen }) => {
  const [auth] = useAuth();
  const location = useLocation();

  // Helper to generate breadcrumbs from path
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) return "Pages / Dashboard";
    if (path.includes("product")) return "Pages / Products";
    if (path.includes("category")) return "Pages / Categories";
    if (path.includes("order")) return "Pages / Orders";
    if (path.includes("user")) return "Pages / Customers";
    if (path.includes("review")) return "Pages / Reviews";
    if (path.includes("support")) return "Pages / Support";
    if (path.includes("setting")) return "Pages / Settings";
    return "Pages / Admin";
  };

  const getPageTitle = () => {
    const breadcrumb = getBreadcrumbs();
    return breadcrumb.split(" / ")[1];
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <button
          className="hamburger-btn d-none d-lg-flex"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
        <button
          className="hamburger-btn d-lg-none"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={24} />
        </button>

        <div>
          <div className="breadcrumb-nav">{getBreadcrumbs()}</div>
          <h1 className="page-title">{getPageTitle()}</h1>
        </div>
      </div>

      <div className="header-right">
        <div className="search-bar">
          <Search size={18} color="#A3AED1" />
          <input type="text" placeholder="Search..." />
        </div>

        <button className="icon-btn">
          <Bell size={20} />
        </button>

        <div className="profile-dropdown">
          <div className="profile-avatar">
            {auth?.user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
