import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  Users,
  MessageSquare,
  LifeBuoy,
  Settings,
  LogOut,
  Hexagon
} from "lucide-react";

const AdminSidebar = ({ isCollapsed, setMobileOpen }) => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout successfully");
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Products", path: "/admin/product", icon: <Package size={20} /> },
    { name: "Categories", path: "/admin/create-category", icon: <Layers size={20} /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingCart size={20} /> },
    { name: "Customers", path: "/admin/user", icon: <Users size={20} /> },
    { name: "Reviews", path: "/admin/reviews", icon: <MessageSquare size={20} /> },
    { name: "Support Tickets", path: "/admin/support", icon: <LifeBuoy size={20} /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className={`admin-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <Link to="/admin/dashboard" className="sidebar-logo">
          <Hexagon className="icon" size={28} />
          <span>AdminPro</span>
        </Link>
      </div>

      <div className="sidebar-menu">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className="sidebar-link"
            onClick={() => setMobileOpen && setMobileOpen(false)}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}

        <div style={{ flexGrow: 1 }}></div>

        <button onClick={handleLogout} className="sidebar-link" style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
          <LogOut size={20} color="#EE5D50" />
          <span style={{ color: '#EE5D50' }}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
