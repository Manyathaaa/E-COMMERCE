import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import PageNotFound from "./pages/PageNotFound";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/user/dashboard";
import PrivateRoute from "./components/Layout/routes/private";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AdminRoute from "./components/Layout/routes/adminroute";
import AdminDashboard from "./pages/admin/adminDashboard";
import CreateCategory from "./pages/admin/CreateCategory";
import CreateProduct from "./pages/admin/createproduct";
import Products from "./pages/admin/Products";
import Users from "./pages/admin/user";
import Orders from "./pages/user/orders";
import Profile from "./pages/user/profile";
import UpdateProduct from "./pages/admin/UpdateProduct";
import CategoryPage from "./pages/CategoryPage";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/about"
          element={
            <div className="main-content">
              <About />
            </div>
          }
        />
        <Route
          path="/contact"
          element={
            <div className="main-content">
              <Contact />
            </div>
          }
        />
        <Route
          path="/policy"
          element={
            <div className="main-content">
              <Policy />
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div className="main-content">
              <Login />
            </div>
          }
        />
        <Route
          path="/register"
          element={
            <div className="main-content">
              <Register />
            </div>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <div className="main-content">
              <ForgotPassword />
            </div>
          }
        />
        <Route
          path="/products"
          element={
            <div className="main-content">
              <Products />
            </div>
          }
        />
        <Route
          path="/categories"
          element={
            <div className="main-content">
              <CategoryPage />
            </div>
          }
        />
        {/* Private User Route */}
        <Route path="/user" element={<PrivateRoute />}>
          <Route
            path="dashboard"
            element={
              <div className="main-content">
                <Dashboard />
              </div>
            }
          />
          <Route
            path="user/orders"
            element={
              <div className="main-content">
                <Orders />
              </div>
            }
          />
          <Route
            path="user/profile"
            element={
              <div className="main-content">
                <Profile />
              </div>
            }
          />
        </Route>
        {/* Private Admin Route */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route
            path="dashboard"
            element={
              <div className="main-content">
                <AdminDashboard />
              </div>
            }
          />
          <Route
            path="create-category"
            element={
              <div className="main-content">
                <CreateCategory />
              </div>
            }
          />
          <Route
            path="create-product"
            element={
              <div className="main-content">
                <CreateProduct />
              </div>
            }
          />
          <Route
            path="product/:slug"
            element={
              <div className="main-content">
                <UpdateProduct />
              </div>
            }
          />
          <Route
            path="product"
            element={
              <div className="main-content">
                <Products />
              </div>
            }
          />
          <Route
            path="user"
            element={
              <div className="main-content">
                <Users />
              </div>
            }
          />
        </Route>
        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="main-content">
              <PageNotFound />
            </div>
          }
        />
      </Routes>
      <ToastContainer />
    </>
  );
}

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Magica</div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/policy">Policy</Link>
        </li>
      </ul>
    </nav>
  );
}

export default App;
