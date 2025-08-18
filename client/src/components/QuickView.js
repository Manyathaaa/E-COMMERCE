import React from "react";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";

const QuickView = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Added to cart successfully!");
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="quick-view-overlay" onClick={handleOverlayClick}>
      <div className="quick-view-modal">
        <button className="quick-view-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="quick-view-content">
          <div className="row">
            <div className="col-md-6">
              <div className="quick-view-image">
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${product._id}`}
                  alt={product.name}
                  className="img-fluid"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x400?text=No+Image";
                  }}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="quick-view-details">
                <h2 className="product-title">{product.name}</h2>

                <div className="product-price">
                  <span className="price">₹{product.price}</span>
                </div>

                <div className="product-description">
                  <p>{product.description}</p>
                </div>

                <div className="product-info">
                  <div className="info-item">
                    <strong>Category:</strong> {product.category?.name || "N/A"}
                  </div>
                  <div className="info-item">
                    <strong>Quantity:</strong>{" "}
                    {product.quantity > 0
                      ? `${product.quantity} in stock`
                      : "Out of stock"}
                  </div>
                  <div className="info-item">
                    <strong>Shipping:</strong>{" "}
                    {product.shipping ? "Available" : "Not available"}
                  </div>
                </div>

                <div className="quick-view-actions">
                  <button
                    className="btn btn-add-to-cart"
                    onClick={handleAddToCart}
                    disabled={product.quantity === 0}
                  >
                    <i className="fas fa-shopping-cart"></i>
                    {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>

                  <button
                    className="btn btn-view-details"
                    onClick={() => {
                      window.open(`/product/${product.slug}`, "_blank");
                    }}
                  >
                    <i className="fas fa-eye"></i>
                    View Full Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
