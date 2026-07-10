import React, { useState } from "react";
import { Helmet } from "react-helmet";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import "../../css/admin-theme.css";

const AdminLayout = ({ children, title = "Admin Dashboard" }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`admin-layout ${isCollapsed ? "collapsed" : ""}`}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title} - E-Commerce Admin</title>
      </Helmet>

      {/* Desktop Sidebar */}
      <div className="d-none d-lg-block">
        <AdminSidebar isCollapsed={isCollapsed} />
      </div>

      {/* Mobile Sidebar */}
      <div className={`admin-sidebar d-lg-none ${mobileOpen ? "mobile-open" : ""}`}>
        <AdminSidebar isCollapsed={false} setMobileOpen={setMobileOpen} />
      </div>
      
      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
      ></div>

      <div className="admin-main-content">
        <AdminHeader 
          toggleSidebar={toggleSidebar} 
          setMobileOpen={setMobileOpen} 
        />
        
        <div className="admin-content-inner">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
