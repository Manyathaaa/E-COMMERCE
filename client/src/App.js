import { Routes, Route } from "react-router-dom";
import "./App.css";
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
import CreateCategory from "./pages/admin/createcategory";
import CreateProduct from "./pages/admin/createproduct";
import Products from "./pages/admin/Products";
import Users from "./pages/admin/user";
import Orders from "./pages/user/orders";
import Profile from "./pages/user/profile";
import OrderDetails from "./pages/user/OrderDetails";
import UpdateProduct from "./pages/admin/UpdateProduct";
import CategoryPage from "./pages/CategoryPage";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import Header from "./components/Layout/Header";
function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/category/:slug" element={<CategoryProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        {/* Private User Route */}
        <Route path="/user" element={<PrivateRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="order-details/:orderId" element={<OrderDetails />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        {/* Private Admin Route */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="create-category" element={<CreateCategory />} />
          <Route path="create-product" element={<CreateProduct />} />
          <Route path="product/:slug" element={<UpdateProduct />} />
          <Route path="product" element={<Products />} />
          <Route path="user" element={<Users />} />
        </Route>
        {/* 404 Route */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
