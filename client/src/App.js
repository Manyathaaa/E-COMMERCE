import { Routes, Route } from "react-router-dom";
//import "bootstrap/dist/css/bootstrap.min.css";
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

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/PageNotFound" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
