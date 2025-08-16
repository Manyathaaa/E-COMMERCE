import React from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
      toast.success("Cart cleared successfully");
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    // Navigate to checkout page (to be implemented)
    navigate("/checkout");
  };

  return (
    <Layout title="Shopping Cart - Your Store">
      {/* Cart Hero */}
      <div className="cart-hero">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="hero-title">Shopping Cart</h1>
              <p className="hero-subtitle">
                {getCartItemCount()}{" "}
                {getCartItemCount() === 1 ? "item" : "items"} in your cart
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="cart-section">
        <div className="container">
          {cart.length === 0 ? (
            /* Empty Cart */
            <div className="empty-cart">
              <div className="row">
                <div className="col-12 text-center">
                  <div className="empty-cart-icon">🛒</div>
                  <h3>Your cart is empty</h3>
                  <p>Looks like you haven't added anything to your cart yet</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/")}
                  >
                    Start Shopping
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Cart Items */
            <div className="row">
              <div className="col-lg-8">
                <div className="cart-items-section">
                  <div className="cart-header">
                    <h3>Cart Items</h3>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={handleClearCart}
                    >
                      Clear Cart
                    </button>
                  </div>

                  <div className="cart-items">
                    {cart.map((item) => (
                      <div key={item._id} className="cart-item">
                        <div className="item-image">
                          <img
                            src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${item._id}`}
                            alt={item.name}
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/150x150?text=No+Image";
                            }}
                          />
                        </div>

                        <div className="item-details">
                          <h5 className="item-name">{item.name}</h5>
                          <p className="item-description">
                            {item.description?.substring(0, 100)}...
                          </p>
                          <div className="item-price">
                            <span className="price">₹{item.price}</span>
                            <span className="total-price">
                              Total: ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="item-actions">
                          <div className="quantity-controls">
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  item.quantity + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>

                          <button
                            className="btn btn-sm btn-outline-danger remove-btn"
                            onClick={() =>
                              handleRemoveItem(item._id, item.name)
                            }
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cart Summary */}
              <div className="col-lg-4">
                <div className="cart-summary">
                  <h4>Order Summary</h4>

                  <div className="summary-details">
                    <div className="summary-row">
                      <span>Subtotal ({getCartItemCount()} items)</span>
                      <span>₹{getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span className="free">Free</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax</span>
                      <span>₹{(getCartTotal() * 0.18).toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>₹{(getCartTotal() * 1.18).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="checkout-actions">
                    <button
                      className="btn btn-primary btn-lg w-100 mb-3"
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </button>
                    <button
                      className="btn btn-outline-primary w-100"
                      onClick={() => navigate("/")}
                    >
                      Continue Shopping
                    </button>
                  </div>

                  {/* Security Badge */}
                  <div className="security-badge">
                    <div className="badge-icon">🔒</div>
                    <div className="badge-text">
                      <small>Secure Checkout</small>
                      <p>Your payment information is safe and secure</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Products */}
      {cart.length > 0 && (
        <div className="recommended-section">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h3 className="text-center mb-4">You might also like</h3>
                {/* This can be populated with recommended products */}
                <div className="text-center">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate("/")}
                  >
                    Browse More Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CartPage;
