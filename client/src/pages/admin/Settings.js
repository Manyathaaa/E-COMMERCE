import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

const Settings = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
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
      <div className="row g-0 flex-column flex-md-row">
        <div className="col-12 col-md-3 mb-3 mb-md-0">
          <AdminMenu />
        </div>
        <div className="col-12 col-md-9">
          <h1 className="mb-4">Settings</h1>
          <div className="card p-3 p-md-4 shadow-sm">
            <h4 className="mb-3">Preferences</h4>
            <div className="row">
              <div className="col-12 col-md-6 mb-4">
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
            </div>
            <div className="mb-4">
              <label className="form-label">Notifications</label>
              <div className="row">
                <div className="col-12 col-sm-4 mb-2">
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
                </div>
                <div className="col-12 col-sm-4 mb-2">
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
                </div>
                <div className="col-12 col-sm-4 mb-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="systemMessages"
                      checked={notifications.systemMessages}
                      onChange={handleNotificationChange}
                      id="systemMessages"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="systemMessages"
                    >
                      System Messages
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <h4>Account Actions</h4>
            <button
              className="btn btn-danger mt-3 w-100 w-md-auto"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
