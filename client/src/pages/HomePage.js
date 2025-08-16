import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/prices";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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

  // Load all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/products/get-products`
      );
      setProducts(data.products || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching products:", error);
    }
  };

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
    try {
      setLoading(true);
      const { data } = await axios.get(`api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [page, products]);

  useEffect(() => {
    if (page === 1) return;
    loadmore();
  }, [page, loadmore]);

  useEffect(() => {
    getAllCategory();
    getAllProducts();
    getTotal();
  }, []);

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
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/products/product-filters`,
        {
          checked,
          selectedPrice,
        }
      );
      setProducts(data?.products || []);
    } catch (error) {
      console.error("Error filtering products:", error);
    }
  }, [checked, selectedPrice]);

  useEffect(() => {
    if (checked.length || selectedPrice !== null) {
      filterProducts();
    }
  }, [checked, selectedPrice, filterProducts]);

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
                      getAllProducts();
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className={`col-lg-${showFilters ? "9" : "12"}`}>
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
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
                          <button className="btn btn-primary btn-sm">
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
              )}

              {/* Load More */}
              {products && products.length < total && (
                <div className="load-more-section">
                  <button
                    className="btn btn-outline-primary btn-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(page + 1);
                    }}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Load More Products"}
                  </button>
                </div>
              )}

              <div className="products-count">
                <p>
                  Showing {products.length} of {total} products
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
