import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useCart();
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (id) getProduct();
  }, [id]);

  const getProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/products/${id}`);
      if (data?.success) {
        setProduct(data.product);
        setSelectedImage(data.product.images?.[0] || data.product.photoUrl);
      } else {
        toast.error("Failed to load product");
      }
    } catch (error) {
      console.log(error);
      toast.error("Product not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title={"Loading Product - E-Commerce App"}>
        <div className="container mt-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product._id) {
    return (
      <Layout title={"Product Not Found"}>
        <div className="container mt-5 text-center">
          <h3>Product Not Found</h3>
        </div>
      </Layout>
    );
  }

  const finalPrice = product.price - (product.price * (product.discount || 0)) / 100;

  return (
    <Layout title={`${product.name} - E-Commerce App`}>
      <div className="container mt-4 mb-5">
        <div className="row">
          {/* Image Gallery */}
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <img
                  src={selectedImage || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"}
                  alt={product.name}
                  className="img-fluid rounded"
                  style={{ maxHeight: "500px", objectFit: "contain" }}
                />
              </div>
            </div>
            {product.images && product.images.length > 1 && (
              <div className="d-flex mt-3 gap-2 overflow-auto py-2">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className={`img-thumbnail cursor-pointer ${
                      selectedImage === img ? "border-primary border-2" : ""
                    }`}
                    style={{ width: "80px", height: "80px", objectFit: "cover", cursor: "pointer" }}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="col-md-6">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item text-muted">Home</li>
                <li className="breadcrumb-item text-muted">{product.category?.name || "Category"}</li>
                <li className="breadcrumb-item active" aria-current="page">
                  {product.name}
                </li>
              </ol>
            </nav>

            <h1 className="display-5 fw-bold mb-2">{product.name}</h1>
            <p className="text-muted mb-3">Brand: {product.brand || "Generic"}</p>
            
            <div className="d-flex align-items-center mb-4">
              <div className="text-warning me-2">
                {"★".repeat(Math.round(product.rating || 0)) + "☆".repeat(5 - Math.round(product.rating || 0))}
              </div>
              <span className="text-muted">({product.rating || "No"} Rating)</span>
            </div>

            <div className="mb-4">
              {product.discount > 0 ? (
                <div>
                  <div className="d-flex align-items-center mb-1">
                    <span className="fs-3 fw-bold text-danger me-3">
                      ₹{finalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                    <span className="badge bg-danger rounded-pill">
                      {product.discount}% OFF
                    </span>
                  </div>
                  <span className="text-muted text-decoration-line-through">
                    M.R.P: ₹{product.price.toLocaleString('en-IN')}
                  </span>
                </div>
              ) : (
                <span className="fs-3 fw-bold">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="lead mb-4" style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
              {product.description}
            </p>

            <div className="mb-4">
              <span
                className={`badge fs-6 ${
                  product.availabilityStatus === "In Stock"
                    ? "bg-success text-white"
                    : "bg-danger text-white"
                }`}
              >
                {product.availabilityStatus || "In Stock"}
              </span>
              <span className="ms-3 text-muted">
                {product.quantity > 0 ? `${product.quantity} items left` : "Out of stock"}
              </span>
            </div>

            <hr className="my-4" />

            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              <button
                className="btn btn-primary btn-lg px-4 me-md-2 rounded-pill shadow-sm"
                disabled={product.quantity <= 0 || product.availabilityStatus !== "In Stock"}
                onClick={() => {
                  const cartItem = {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    discount: product.discount,
                    finalPrice: finalPrice,
                    image: selectedImage || product.photoUrl,
                    quantity: 1, // Default quantity for cart
                  };
                  
                  // Check if already in cart
                  const existingItemIndex = cart.findIndex((item) => item._id === product._id);
                  if (existingItemIndex !== -1) {
                    toast.info("Item is already in cart");
                    return;
                  }
                  
                  setCart([...cart, cartItem]);
                  localStorage.setItem("cart", JSON.stringify([...cart, cartItem]));
                  toast.success("Item Added to cart");
                }}
              >
                <i className="fa-solid fa-cart-shopping me-2"></i>
                {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailsPage;
