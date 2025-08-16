import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/prices";
import { Link } from "react-router-dom";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const { addToCart } = useCart();
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  // Load all categories
  const getAllCategory = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data?.success) {
        setCategories(data.category || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Load products with pagination
  const getAllProducts = useCallback(async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      console.log("API URL:", process.env.REACT_APP_API);
      console.log("Fetching products for page:", pageNum);

      // Use the correct endpoint based on whether it's first load or pagination
      const response = await axios.get(
        pageNum === 1
          ? `${process.env.REACT_APP_API}/api/v1/products/get-products`
          : `${process.env.REACT_APP_API}/api/v1/products/product-list/${pageNum}`
      );

      const data = response.data;
      console.log("API response:", data);

      if (reset) {
        setProducts(data.products || []);
      } else {
        setProducts((prev) => [...prev, ...(data.products || [])]);
      }

      console.log("Products set:", data.products?.length || 0);

      // Check if there are more products to load
      setHasMore(data.products && data.products.length > 0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching products:", error);
      console.error("Error response:", error.response?.data);
    }
  }, []);

  // Get total product count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/products/product-count`
      );
      setTotal(data?.total || 0);
    } catch (error) {
      console.error("Error fetching total count:", error);
    }
  };

  const loadmore = useCallback(async () => {
    if (!hasMore || loading || isFiltering) return;

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/products/get-products?page=${
          page + 1
        }&limit=12`
      );

      if (data.products && data.products.length > 0) {
        setProducts((prev) => [...prev, ...data.products]);
        setPage((prev) => prev + 1);
        setHasMore(data.products.length === 12);
      } else {
        setHasMore(false);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setHasMore(false);
    }
  }, [page, hasMore, loading, isFiltering]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1000 // Load when 1000px from bottom
    ) {
      loadmore();
    }
  }, [loadmore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    console.log("Initial load started");
    getAllCategory();
    getAllProducts(1, true);
    getTotal();
  }, [getAllProducts]);

  const handleFilter = (checkedValue, id) => {
    const all = [...checked];
    if (checkedValue) {
      all.push(id);
    } else {
      const index = all.indexOf(id);
      if (index > -1) all.splice(index, 1);
    }
    setChecked(all);
  };

  const filterProducts = useCallback(async () => {
    try {
      setIsFiltering(true);
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/products/product-filters`,
        {
          checked,
          selectedPrice,
        }
      );
      setProducts(data?.products || []);
      setPage(1); // Reset page when filtering
      setHasMore(false); // Disable infinite scroll when filtering
      setLoading(false);
      setIsFiltering(false);
    } catch (error) {
      console.error("Error filtering products:", error);
      setLoading(false);
      setIsFiltering(false);
    }
  }, [checked, selectedPrice]);

  useEffect(() => {
    if (checked.length || selectedPrice !== null) {
      filterProducts();
    } else {
      // Reset to normal pagination when no filters
      setIsFiltering(false);
      setPage(1);
      setHasMore(true);
      getAllProducts(1, true);
    }
  }, [checked, selectedPrice, filterProducts, getAllProducts]);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Magica</h1>
            <p className="hero-subtitle">
              Discover amazing products at unbeatable prices
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop Now
              </Link>
              <Link to="/about" className="btn btn-outline-light btn-lg">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">🚚</div>
                <h3>Free Shipping</h3>
                <p>Free delivery on orders above ₹500</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Secure Payment</h3>
                <p>Your payment information is safe with us</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">↩️</div>
                <h3>Easy Returns</h3>
                <p>30-day return policy for all products</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories?.slice(0, 6).map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                className="category-card"
              >
                <div className="category-image">
                  <span className="category-icon">🛍️</span>
                </div>
                <h4>{category.name}</h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <button
              className="filter-toggle btn btn-outline-primary"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          <div className="row">
            {/* Filters Sidebar */}
            {showFilters && (
              <div className="col-lg-3">
                <div className="filters-sidebar">
                  <div className="filter-group">
                    <h4>Filter by Category</h4>
                    <div className="filter-options">
                      {categories?.map((c) => (
                        <Checkbox
                          key={c._id}
                          onChange={(e) =>
                            handleFilter(e.target.checked, c._id)
                          }
                          className="filter-checkbox"
                        >
                          {c.name}
                        </Checkbox>
                      ))}
                    </div>
                  </div>

                  <div className="filter-group">
                    <h4>Filter by Price</h4>
                    <div className="filter-options">
                      <Radio.Group
                        onChange={(e) => setSelectedPrice(e.target.value)}
                        value={selectedPrice}
                        className="price-filter"
                      >
                        {Prices?.map((p) => (
                          <Radio
                            key={p._id}
                            value={p.array}
                            className="price-option"
                          >
                            {p.name}
                          </Radio>
                        ))}
                      </Radio.Group>
                    </div>
                  </div>

                  <button
                    className="btn btn-secondary w-100 mt-3"
                    onClick={() => {
                      setChecked([]);
                      setSelectedPrice(null);
                      setPage(1);
                      setHasMore(true);
                      setIsFiltering(false);
                      getAllProducts(1, true);
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className={`col-lg-${showFilters ? "9" : "12"}`}>
              {loading && products.length === 0 ? (
                <div className="initial-loading">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading products...</span>
                  </div>
                  <p className="mt-3">Loading amazing products for you...</p>
                </div>
              ) : products.length > 0 ? (
                <div className="products-grid">
                  {products.map((product) => (
                    <div key={product._id} className="product-card">
                      <div className="product-image">
                        <img
                          src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${product._id}`}
                          alt={product.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/300x300?text=No+Image";
                          }}
                        />
                        <div className="product-overlay">
                          <button className="btn btn-primary">
                            Quick View
                          </button>
                        </div>
                      </div>
                      <div className="product-info">
                        <h5 className="product-name">{product.name}</h5>
                        <p className="product-description">
                          {product.description?.substring(0, 60)}...
                        </p>
                        <div className="product-price">₹{product.price}</div>
                        <div className="product-actions">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              addToCart(product);
                              toast.success(`${product.name} added to cart!`);
                            }}
                          >
                            Add to Cart
                          </button>
                          <button className="btn btn-outline-secondary btn-sm">
                            ❤️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-products">
                  <div className="no-products-content">
                    <h3>🛍️ No Products Found</h3>
                    <p>We couldn't find any products at the moment.</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        console.log("Retry button clicked");
                        getAllProducts(1, true);
                      }}
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Infinite Scroll Loading Indicator */}
              {loading && (
                <div className="infinite-scroll-loading">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">
                      Loading more products...
                    </span>
                  </div>
                  <p className="mt-2">Loading more products...</p>
                </div>
              )}

              {!hasMore && !isFiltering && products.length > 0 && (
                <div className="end-of-products">
                  <p>🎉 You've seen all our amazing products!</p>
                </div>
              )}

              <div className="products-count">
                <p>
                  {isFiltering
                    ? `Found ${products.length} products matching your filters`
                    : `Showing ${products.length} of ${total} products`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter for exclusive deals and updates</p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                className="form-control"
              />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
