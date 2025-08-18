import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";

const CategoryProductsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [wishlist, setWishlist] = useState(new Set());

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

  const handleAddToCart = (product) => {
    try {
      console.log("Adding to cart:", product); // Debug log
      addToCart(product, 1);
      toast.success(`${product.name} added to cart successfully!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const handleToggleWishlist = (productId) => {
    setWishlist((prev) => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
        toast.info("Removed from wishlist");
      } else {
        newWishlist.add(productId);
        toast.success("Added to wishlist");
      }
      return newWishlist;
    });
  };

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      electronics: "💻",
      clothing: "👕",
      women: "👗",
      men: "👔",
      shoes: "👟",
      accessories: "💍",
      home: "🏠",
      sports: "⚽",
      books: "📚",
      beauty: "💄",
      toys: "🧸",
      food: "🍕",
    };

    const key = categoryName.toLowerCase();
    return iconMap[key] || "🛍️";
  };

  const filteredProducts = (products || []).filter(
    (product) =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
  );

  const sortedProducts = [...(filteredProducts || [])].sort((a, b) => {
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

  return (
    <Layout title={`${category.name || "Category"} - Shop Collection`}>
      {/* Category Hero Section */}
      <div className="category-products-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="breadcrumb-nav">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a
                        href="/"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/");
                        }}
                      >
                        Home
                      </a>
                    </li>
                    <li className="breadcrumb-item">
                      <a
                        href="/category"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/category");
                        }}
                      >
                        Categories
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {category.name}
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="category-info">
                <div className="category-icon-large">
                  {getCategoryIcon(category.name || "")}
                </div>
                <div className="category-details">
                  <h1 className="category-title">{category.name}</h1>
                  <p className="category-description">
                    {category.description ||
                      `Discover our amazing ${category.name?.toLowerCase()} collection`}
                  </p>
                  <div className="category-stats">
                    <span className="product-count">
                      {products.length}{" "}
                      {products.length === 1 ? "Product" : "Products"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-end">
              <div className="category-actions">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate("/category")}
                >
                  <i className="fas fa-th-large me-2"></i>
                  Browse All Categories
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="filter-group">
                <label htmlFor="sortBy" className="filter-label">
                  Sort By:
                </label>
                <select
                  id="sortBy"
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div className="filter-group">
                <label className="filter-label">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <div className="price-range-inputs">
                  <input
                    type="number"
                    className="form-control price-input"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                  />
                  <span className="price-separator">-</span>
                  <input
                    type="number"
                    className="form-control price-input"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="category-products-section">
        <div className="container">
          {loading ? (
            <div className="loading-section">
              <div className="row">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div className="product-card skeleton">
                      <div className="product-image skeleton-image"></div>
                      <div className="product-content">
                        <div className="skeleton-title"></div>
                        <div className="skeleton-price"></div>
                        <div className="skeleton-button"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="empty-products">
              <div className="row">
                <div className="col-12 text-center">
                  <div className="empty-icon">📦</div>
                  <h3>No Products Found</h3>
                  <p>
                    Sorry, there are no products in this category at the moment.
                  </p>
                  <div className="empty-actions">
                    <button
                      className="btn btn-primary me-3"
                      onClick={() => navigate("/category")}
                    >
                      Browse Other Categories
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => navigate("/")}
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="products-grid">
              <div className="row">
                {sortedProducts.map((product, index) => {
                  // Validate product data
                  if (!product || !product._id || !product.name) {
                    console.warn("Invalid product data:", product);
                    return null;
                  }

                  return (
                    <div
                      key={product._id}
                      className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4"
                    >
                      <div
                        className="product-card"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="product-image-container">
                          <img
                            src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${product._id}`}
                            alt={product.name}
                            className="product-image"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/300x250?text=No+Image";
                            }}
                          />
                          <div className="product-overlay">
                            <button
                              className="btn btn-quick-view"
                              onClick={() =>
                                navigate(`/product/${product.slug}`)
                              }
                              title="Quick View"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                          </div>
                          <div className="product-wishlist">
                            <button
                              className={`btn btn-wishlist ${
                                wishlist.has(product._id) ? "active" : ""
                              }`}
                              onClick={() => handleToggleWishlist(product._id)}
                              title={
                                wishlist.has(product._id)
                                  ? "Remove from wishlist"
                                  : "Add to wishlist"
                              }
                            >
                              <i
                                className={
                                  wishlist.has(product._id)
                                    ? "fas fa-heart"
                                    : "far fa-heart"
                                }
                              ></i>
                            </button>
                          </div>
                        </div>
                        <div className="product-content">
                          <h5 className="product-title" title={product.name}>
                            {product.name}
                          </h5>
                          <p
                            className="product-description"
                            title={product.description}
                          >
                            {product.description &&
                            product.description.length > 55
                              ? `${product.description.substring(0, 55)}...`
                              : product.description ||
                                `Premium ${product.name.toLowerCase()} with excellent quality`}
                          </p>
                          <div className="product-footer">
                            <div className="product-price-section">
                              <div className="product-price">
                                <span className="currency">$</span>
                                <span className="price">{product.price}</span>
                              </div>
                            </div>
                            <div className="product-actions">
                              <button
                                className="btn btn-add-cart"
                                onClick={() => handleAddToCart(product)}
                                title={`Add ${product.name} to cart`}
                              >
                                <i className="fas fa-shopping-cart"></i>
                                <span className="btn-text">Add to Cart</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Back to Categories */}
      <div className="back-to-categories">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <button
                className="btn btn-outline-secondary btn-lg"
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
