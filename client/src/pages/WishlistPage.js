import React from "react";
import Layout from "../components/Layout/Layout";
import { useWishlist } from "../context/wishlist";
import { useCart } from "../context/cart";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./WishlistPage.css";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Handle move to cart
  const handleMoveToCart = (product) => {
    const success = addToCart(product);
    if (success) {
      removeFromWishlist(product._id);
      toast.success(`${product.name} moved to cart!`);
    } else {
      toast.info(`${product.name} is already in cart!`);
    }
  };

  // Handle remove from wishlist
  const handleRemoveFromWishlist = (product) => {
    removeFromWishlist(product._id);
    toast.success(`${product.name} removed from wishlist!`);
  };

  // Handle clear all wishlist
  const handleClearWishlist = () => {
    if (
      window.confirm("Are you sure you want to clear your entire wishlist?")
    ) {
      clearWishlist();
      toast.success("Wishlist cleared!");
    }
  };

  return (
    <Layout title="My Wishlist - Magica">
      <div className="wishlist-container">
        <div className="container">
          <div className="wishlist-header">
            <h1>
              <i className="fas fa-heart"></i>
              My Wishlist
            </h1>
            <p>Your favorite items are here</p>
          </div>

          {wishlist.length === 0 ? (
            <div className="empty-wishlist">
              <div className="empty-icon">
                <i className="far fa-heart"></i>
              </div>
              <h3>Your wishlist is empty</h3>
              <p>Save items you love so you don't lose sight of them.</p>
              <button className="btn btn-primary" onClick={() => navigate("/")}>
                <i className="fas fa-shopping-bag"></i>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="wishlist-actions">
                <div className="wishlist-count">
                  <span>
                    {wishlist.length} item{wishlist.length > 1 ? "s" : ""} in
                    your wishlist
                  </span>
                </div>
                <button
                  className="btn btn-outline-danger"
                  onClick={handleClearWishlist}
                >
                  <i className="fas fa-trash"></i>
                  Clear All
                </button>
              </div>

              <div className="wishlist-items">
                <div className="row">
                  {wishlist.map((product) => (
                    <div
                      key={product._id}
                      className="col-lg-3 col-md-4 col-sm-6 mb-4"
                    >
                      <div className="wishlist-card">
                        <div className="card-image">
                          <img
                            src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${product._id}`}
                            alt={product.name}
                            onError={(e) => {
                              e.target.src = "/api/placeholder/300/300";
                            }}
                          />
                          <div className="card-overlay">
                            <button
                              className="btn btn-white btn-sm"
                              onClick={() =>
                                navigate(`/product/${product.slug}`)
                              }
                            >
                              <i className="fas fa-eye"></i>
                              Quick View
                            </button>
                          </div>
                        </div>

                        <div className="card-content">
                          <h5 className="product-name">{product.name}</h5>
                          <p className="product-description">
                            {product.description.substring(0, 60)}...
                          </p>
                          <div className="product-price">
                            <span className="current-price">
                              ₹{product.price}
                            </span>
                          </div>

                          <div className="card-actions">
                            <button
                              className="btn btn-primary flex-fill"
                              onClick={() => handleMoveToCart(product)}
                            >
                              <i className="fas fa-shopping-cart"></i>
                              Move to Cart
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleRemoveFromWishlist(product)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="wishlist-footer">
                <div className="row">
                  <div className="col-md-6">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => navigate("/")}
                    >
                      <i className="fas fa-arrow-left"></i>
                      Continue Shopping
                    </button>
                  </div>
                  <div className="col-md-6 text-end">
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        // Move all items to cart
                        let movedCount = 0;
                        wishlist.forEach((product) => {
                          const success = addToCart(product);
                          if (success) {
                            movedCount++;
                          }
                        });
                        if (movedCount > 0) {
                          clearWishlist();
                          toast.success(`${movedCount} items moved to cart!`);
                          navigate("/cart");
                        }
                      }}
                    >
                      <i className="fas fa-shopping-cart"></i>
                      Move All to Cart
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default WishlistPage;
