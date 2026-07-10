import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useWishlist } from "../context/wishlist";
import { toast } from "react-toastify";
import ProductCard from "../components/Cards/ProductCard";

const CategoryProductsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name");

  // Fetch category products
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/products/product-category/${slug}`
        );
        setProducts(data.products || []);
        setCategory(data.category || {});
      } catch (error) {
        console.error("Error fetching category products:", error);
        toast.error("Failed to load category products");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryProducts();
    }
  }, [slug]);

  // Handle add to cart
  const handleAddToCart = (product) => {
    try {
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (product) => {
    console.log("Wishlist toggle clicked for:", product.name);
    console.log("Current wishlist status:", isInWishlist(product._id));

    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success(`${product.name} removed from wishlist!`);
    } else {
      const success = addToWishlist(product);
      if (success) {
        toast.success(`${product.name} added to wishlist!`);
      } else {
        toast.info(`${product.name} is already in wishlist!`);
      }
    }
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="category-page-container">
          <div className="container">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${category.name || "Category"} - Shop Collection`}>
      <div className="category-page-container">
        {/* Category Header */}
        <div className="category-header">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-8">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <button
                        onClick={() => navigate("/")}
                        className="breadcrumb-link"
                      >
                        Home
                      </button>
                    </li>
                    <li className="breadcrumb-item">
                      <button
                        onClick={() => navigate("/category")}
                        className="breadcrumb-link"
                      >
                        Categories
                      </button>
                    </li>
                    <li className="breadcrumb-item active">{category.name}</li>
                  </ol>
                </nav>
                <h1 className="category-title">{category.name}</h1>
                <p className="category-description">
                  {category.description ||
                    `Explore our ${category.name?.toLowerCase()} collection`}
                </p>
                <div className="products-count">
                  {products.length}{" "}
                  {products.length === 1 ? "Product" : "Products"} Found
                </div>
              </div>
              <div className="col-md-4">
                <div className="sort-controls">
                  <label htmlFor="sortBy">Sort by:</label>
                  <select
                    id="sortBy"
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-section">
          <div className="container">
            {sortedProducts.length === 0 ? (
              <div className="no-products">
                <div className="no-products-icon">📦</div>
                <h3>No Products Found</h3>
                <p>Sorry, there are no products in this category.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/category")}
                >
                  Browse Other Categories
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {sortedProducts.map((product, index) => (
                  <div
                    key={product._id}
                    className="col-lg-3 col-md-4 col-sm-6"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard 
                      product={product}
                      isInWishlist={isInWishlist}
                      handleWishlistToggle={handleWishlistToggle}
                      addToCart={(cartItem) => {
                        handleAddToCart(product); // Existing logic inside CategoryProductsPage uses this wrapper
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Back to Categories */}
        <div className="back-section">
          <div className="container">
            <div className="text-center">
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/category")}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to All Categories
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProductsPage;
