import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductCard = ({ product, isInWishlist, handleWishlistToggle, addToCart, setQuickViewProduct }) => {
  const navigate = useNavigate();
  
  const finalPrice = product.price - (product.price * (product.discount || 0)) / 100;
  const imageUrl = product.images?.[0] || product.photoUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop";

  return (
    <div className="product-card">
      <div 
        className="product-image-container cursor-pointer" 
        onClick={() => navigate(`/products/${product._id}`)}
      >
        <div className="product-image">
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop";
            }}
          />
        </div>
        {handleWishlistToggle && (
          <button
            className={`heart-button ${isInWishlist(product._id) ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              handleWishlistToggle(product);
            }}
            title={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <i className={isInWishlist(product._id) ? "fas fa-heart" : "far fa-heart"}></i>
          </button>
        )}
        {setQuickViewProduct && (
          <div className="product-overlay">
            <button 
              className="btn btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                setQuickViewProduct(product);
              }}
            >
              Quick View
            </button>
          </div>
        )}
      </div>

      <div className="product-info" onClick={() => navigate(`/products/${product._id}`)} style={{ cursor: "pointer" }}>
        <h5 className="product-name">{product.name}</h5>
        <p className="product-description">
          {product.description?.substring(0, 60)}...
        </p>
        <div className="product-price">
          {product.discount > 0 ? (
            <div>
              <span style={{ fontWeight: 'bold', color: '#e53e3e', marginRight: '8px' }}>
                ₹{finalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
              <span style={{ textDecoration: 'line-through', color: '#718096', fontSize: '0.85em' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </div>
          ) : (
            <span style={{ fontWeight: 'bold' }}>₹{product.price.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>
      
      <div className="product-actions" style={{ padding: '0 15px 15px 15px' }}>
        <button
          className="btn btn-primary btn-sm w-100"
          disabled={product.quantity <= 0 || product.availabilityStatus !== "In Stock"}
          onClick={(e) => {
            e.stopPropagation();
            if (addToCart) {
              // Standardize cart object format
              const cartItem = {
                _id: product._id,
                name: product.name,
                price: product.price,
                discount: product.discount || 0,
                finalPrice: finalPrice,
                image: imageUrl,
                quantity: 1,
              };
              addToCart(cartItem);
              toast.success(`${product.name} added to cart!`);
            }
          }}
        >
          {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
