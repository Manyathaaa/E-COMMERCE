import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

const Settings = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    productAlerts: false,
    systemMessages: true,
  });
  const [language, setLanguage] = useState("en");

  const handleLogout = () => {
    setAuth({ user: null, token: "" });
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    // You can add logic to update the app theme here
  };

  const handleNotificationChange = (e) => {
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked,
    });
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    // You can add logic to update app language here
  };

  return (
    <Layout title="Admin - Settings">
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="mb-4">Settings</h1>
          <div className="card p-4 shadow-sm">
            <h4 className="mb-3">Preferences</h4>
            <div className="mb-4">
              <label className="form-label">Theme</label>
              <select
                className="form-select"
                value={theme}
                onChange={handleThemeChange}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="form-label">Notifications</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="orderUpdates"
                  checked={notifications.orderUpdates}
                  onChange={handleNotificationChange}
                  id="orderUpdates"
                />
                <label className="form-check-label" htmlFor="orderUpdates">
                  Order Updates
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="productAlerts"
                  checked={notifications.productAlerts}
                  onChange={handleNotificationChange}
                  id="productAlerts"
                />
                <label className="form-check-label" htmlFor="productAlerts">
                  Product Alerts
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="systemMessages"
                  checked={notifications.systemMessages}
                  onChange={handleNotificationChange}
                  id="systemMessages"
                />
                <label className="form-check-label" htmlFor="systemMessages">
                  System Messages
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Language</label>
              <select
                className="form-select"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
            <hr />
            <h4>Account Actions</h4>
            <button className="btn btn-danger mt-3" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
