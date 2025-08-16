import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import { useNavigate } from "react-router-dom";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/category/get-category`
        );
        console.log(data);
        setCategories(data.categories || data.category || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categorySlug) => {
    navigate(`/category/${categorySlug}`);
  };

  return (
    <Layout title="Shop by Categories - Your Store">
      {/* Hero Section */}
      <div className="category-hero">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="hero-title">Shop by Categories</h1>
              <p className="hero-subtitle">
                Discover our wide range of products organized by categories
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="categories-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-header text-center">
                <h2>Browse All Categories</h2>
                <p>Find exactly what you're looking for</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-section">
              <div className="row">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div className="category-card skeleton">
                      <div className="category-icon skeleton-icon"></div>
                      <div className="category-content">
                        <div className="skeleton-title"></div>
                        <div className="skeleton-subtitle"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="empty-categories">
              <div className="row">
                <div className="col-12 text-center">
                  <div className="empty-icon">📁</div>
                  <h3>No Categories Available</h3>
                  <p>
                    Categories will appear here once they are added to the
                    store.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/")}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="categories-grid">
              <div className="row">
                {categories.map((category, index) => (
                  <div
                    key={category._id}
                    className="col-lg-3 col-md-4 col-sm-6 mb-4"
                  >
                    <div
                      className="category-card"
                      onClick={() =>
                        handleCategoryClick(
                          category.slug ||
                            category.name.toLowerCase().replace(/\s+/g, "-")
                        )
                      }
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="category-icon">
                        {getCategoryIcon(category.name)}
                      </div>
                      <div className="category-content">
                        <h4 className="category-title">{category.name}</h4>
                        <p className="category-description">
                          {category.description ||
                            `Explore our ${category.name.toLowerCase()} collection`}
                        </p>
                        <div className="category-arrow">
                          <span>Shop Now</span>
                          <i className="fas fa-arrow-right"></i>
                        </div>
                      </div>
                      <div className="category-overlay"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h3>Can't find what you're looking for?</h3>
              <p>Browse all our products or contact us for assistance</p>
              <div className="cta-buttons">
                <button
                  className="btn btn-primary me-3"
                  onClick={() => navigate("/products")}
                >
                  View All Products
                </button>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate("/contact")}
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Helper function to get category icons
const getCategoryIcon = (categoryName) => {
  const iconMap = {
    electronics: "💻",
    clothing: "👕",
    fashion: "👗",
    books: "📚",
    home: "🏠",
    sports: "⚽",
    toys: "🧸",
    beauty: "💄",
    health: "🏥",
    automotive: "🚗",
    jewelry: "💎",
    shoes: "👟",
    bags: "👜",
    music: "🎵",
    games: "🎮",
    food: "🍕",
    garden: "🌱",
    tools: "🔧",
    pet: "🐕",
    baby: "👶",
  };

  const lowerName = categoryName.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerName.includes(key)) {
      return icon;
    }
  }
  return "🛍️"; // Default icon
};

export default CategoryPage;
