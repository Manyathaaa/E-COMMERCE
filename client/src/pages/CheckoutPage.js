import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useOrder } from "../context/order";
import { toast } from "react-toastify";
import "../css/CheckoutPage.css";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const [auth] = useAuth();
  const { createOrder, loading: orderLoading } = useOrder();

  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Shipping Information State
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  // Payment Information State
  const [paymentInfo, setPaymentInfo] = useState({
    method: "cod", // cod, card, upi
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    upiId: "",
  });

  // Form Validation State
  const [errors, setErrors] = useState({});

  // Initialize form with user data if logged in
  useEffect(() => {
    if (auth?.user) {
      setShippingInfo((prev) => ({
        ...prev,
        fullName: auth.user.name || "",
        email: auth.user.email || "",
        phone: auth.user.phone || "",
        address: auth.user.address || "",
      }));
    }
  }, [auth?.user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      toast.error("Your cart is empty");
      navigate("/cart");
    }
  }, [cart, navigate, orderPlaced]);

  // Handle input changes
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validation functions
  const validateShipping = () => {
    const newErrors = {};

    if (!shippingInfo.fullName.trim())
      newErrors.fullName = "Full name is required";
    if (!shippingInfo.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(shippingInfo.email))
      newErrors.email = "Email is invalid";
    if (!shippingInfo.phone.trim())
      newErrors.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(shippingInfo.phone))
      newErrors.phone = "Phone number is invalid";
    if (!shippingInfo.address.trim()) newErrors.address = "Address is required";
    if (!shippingInfo.city.trim()) newErrors.city = "City is required";
    if (!shippingInfo.state.trim()) newErrors.state = "State is required";
    if (!shippingInfo.zipCode.trim())
      newErrors.zipCode = "ZIP code is required";
    else if (!/^\d{6}$/.test(shippingInfo.zipCode))
      newErrors.zipCode = "ZIP code must be 6 digits";

    return newErrors;
  };

  const validatePayment = () => {
    const newErrors = {};

    if (paymentInfo.method === "card") {
      if (!paymentInfo.cardNumber.trim())
        newErrors.cardNumber = "Card number is required";
      else if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, "")))
        newErrors.cardNumber = "Card number must be 16 digits";
      if (!paymentInfo.expiryDate.trim())
        newErrors.expiryDate = "Expiry date is required";
      if (!paymentInfo.cvv.trim()) newErrors.cvv = "CVV is required";
      else if (!/^\d{3,4}$/.test(paymentInfo.cvv))
        newErrors.cvv = "CVV must be 3-4 digits";
      if (!paymentInfo.cardName.trim())
        newErrors.cardName = "Cardholder name is required";
    } else if (paymentInfo.method === "upi") {
      if (!paymentInfo.upiId.trim()) newErrors.upiId = "UPI ID is required";
      else if (!/^[\w.-]+@[\w.-]+$/.test(paymentInfo.upiId))
        newErrors.upiId = "UPI ID is invalid";
    }

    return newErrors;
  };

  // Calculate totals
  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  // Handle order placement
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Validate forms
    const shippingErrors = validateShipping();
    const paymentErrors = validatePayment();
    const allErrors = { ...shippingErrors, ...paymentErrors };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      // Prepare order data for new API
      const orderData = {
        products: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: shippingInfo.fullName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
        },
        paymentMethod: paymentInfo.method,
        paymentDetails: {
          ...(paymentInfo.method === "card" && {
            cardLast4: paymentInfo.cardNumber.slice(-4),
          }),
          ...(paymentInfo.method === "upi" && {
            upiId: paymentInfo.upiId,
          }),
          paymentStatus: paymentInfo.method === "cod" ? "pending" : "completed",
        },
        orderSummary: {
          subtotal,
          shipping,
          tax: Math.round(tax),
          discount: 0,
          total: Math.round(total),
        },
      };

      // Create order using new order management system
      const result = await createOrder(orderData);

      if (result.success) {
        clearCart();
        setOrderPlaced(true);
        toast.success("Order placed successfully!");

        // Navigate to order confirmation
        setTimeout(() => {
          navigate(`/order-confirmation/${result.order._id}`);
        }, 2000);
      }
    } catch (error) {
      console.log("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  // Order success component
  if (orderPlaced) {
    return (
      <Layout title="Order Placed - Magica">
        <div className="order-success-container">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8">
                <div className="success-card">
                  <div className="success-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h2>Order Placed Successfully!</h2>
                  <p>
                    Thank you for your purchase. Your order has been received
                    and is being processed.
                  </p>
                  <div className="success-details">
                    <div className="detail-item">
                      <span>Order Total:</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                    <div className="detail-item">
                      <span>Payment Method:</span>
                      <span>
                        {paymentInfo.method === "cod"
                          ? "Cash on Delivery"
                          : paymentInfo.method.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="success-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate("/user/orders")}
                    >
                      View Orders
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => navigate("/")}
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Checkout - Magica">
      <div className="checkout-container">
        <div className="container">
          <div className="checkout-header">
            <h1>
              <i className="fas fa-shopping-cart"></i>
              Checkout
            </h1>
            <p>Complete your purchase</p>
          </div>

          <form onSubmit={handlePlaceOrder}>
            <div className="row">
              {/* Left Column - Forms */}
              <div className="col-lg-8">
                {/* Shipping Information */}
                <div className="checkout-section">
                  <h3>
                    <i className="fas fa-shipping-fast"></i>
                    Shipping Information
                  </h3>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.fullName ? "is-invalid" : ""
                        }`}
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleShippingChange}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && (
                        <div className="invalid-feedback">
                          {errors.fullName}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        placeholder="Enter your email"
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        className={`form-control ${
                          errors.phone ? "is-invalid" : ""
                        }`}
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && (
                        <div className="invalid-feedback">{errors.phone}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">ZIP Code *</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.zipCode ? "is-invalid" : ""
                        }`}
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        placeholder="Enter ZIP code"
                      />
                      {errors.zipCode && (
                        <div className="invalid-feedback">{errors.zipCode}</div>
                      )}
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Street Address *</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.address ? "is-invalid" : ""
                        }`}
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        placeholder="Enter your complete address"
                      />
                      {errors.address && (
                        <div className="invalid-feedback">{errors.address}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.city ? "is-invalid" : ""
                        }`}
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        placeholder="Enter your city"
                      />
                      {errors.city && (
                        <div className="invalid-feedback">{errors.city}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">State *</label>
                      <select
                        className={`form-control ${
                          errors.state ? "is-invalid" : ""
                        }`}
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                      >
                        <option value="">Select State</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        {/* Add more states as needed */}
                      </select>
                      {errors.state && (
                        <div className="invalid-feedback">{errors.state}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="checkout-section">
                  <h3>
                    <i className="fas fa-credit-card"></i>
                    Payment Information
                  </h3>

                  {/* Payment Method Selection */}
                  <div className="payment-methods mb-4">
                    <div className="method-option">
                      <input
                        type="radio"
                        id="cod"
                        name="method"
                        value="cod"
                        checked={paymentInfo.method === "cod"}
                        onChange={handlePaymentChange}
                      />
                      <label htmlFor="cod" className="method-label">
                        <i className="fas fa-money-bill-wave"></i>
                        Cash on Delivery
                      </label>
                    </div>
                    <div className="method-option">
                      <input
                        type="radio"
                        id="card"
                        name="method"
                        value="card"
                        checked={paymentInfo.method === "card"}
                        onChange={handlePaymentChange}
                      />
                      <label htmlFor="card" className="method-label">
                        <i className="fas fa-credit-card"></i>
                        Credit/Debit Card
                      </label>
                    </div>
                    <div className="method-option">
                      <input
                        type="radio"
                        id="upi"
                        name="method"
                        value="upi"
                        checked={paymentInfo.method === "upi"}
                        onChange={handlePaymentChange}
                      />
                      <label htmlFor="upi" className="method-label">
                        <i className="fas fa-mobile-alt"></i>
                        UPI Payment
                      </label>
                    </div>
                  </div>

                  {/* Card Payment Fields */}
                  {paymentInfo.method === "card" && (
                    <div className="card-details">
                      <div className="row">
                        <div className="col-12 mb-3">
                          <label className="form-label">Card Number *</label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.cardNumber ? "is-invalid" : ""
                            }`}
                            name="cardNumber"
                            value={paymentInfo.cardNumber}
                            onChange={(e) => {
                              const formatted = formatCardNumber(
                                e.target.value
                              );
                              handlePaymentChange({
                                target: {
                                  name: "cardNumber",
                                  value: formatted,
                                },
                              });
                            }}
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                          />
                          {errors.cardNumber && (
                            <div className="invalid-feedback">
                              {errors.cardNumber}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Expiry Date *</label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.expiryDate ? "is-invalid" : ""
                            }`}
                            name="expiryDate"
                            value={paymentInfo.expiryDate}
                            onChange={handlePaymentChange}
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                          {errors.expiryDate && (
                            <div className="invalid-feedback">
                              {errors.expiryDate}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">CVV *</label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.cvv ? "is-invalid" : ""
                            }`}
                            name="cvv"
                            value={paymentInfo.cvv}
                            onChange={handlePaymentChange}
                            placeholder="123"
                            maxLength="4"
                          />
                          {errors.cvv && (
                            <div className="invalid-feedback">{errors.cvv}</div>
                          )}
                        </div>
                        <div className="col-12 mb-3">
                          <label className="form-label">
                            Cardholder Name *
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.cardName ? "is-invalid" : ""
                            }`}
                            name="cardName"
                            value={paymentInfo.cardName}
                            onChange={handlePaymentChange}
                            placeholder="Name as on card"
                          />
                          {errors.cardName && (
                            <div className="invalid-feedback">
                              {errors.cardName}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* UPI Payment Fields */}
                  {paymentInfo.method === "upi" && (
                    <div className="upi-details">
                      <div className="col-12 mb-3">
                        <label className="form-label">UPI ID *</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errors.upiId ? "is-invalid" : ""
                          }`}
                          name="upiId"
                          value={paymentInfo.upiId}
                          onChange={handlePaymentChange}
                          placeholder="yourname@upi"
                        />
                        {errors.upiId && (
                          <div className="invalid-feedback">{errors.upiId}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="col-lg-4">
                <div className="order-summary">
                  <h3>Order Summary</h3>

                  {/* Cart Items */}
                  <div className="summary-items">
                    {cart.map((item) => (
                      <div key={item._id} className="summary-item">
                        <div className="item-image">
                          <img
                            src={`${process.env.REACT_APP_API}/api/v1/products/product-photo/${item._id}`}
                            alt={item.name}
                            onError={(e) => {
                              e.target.src = "/api/placeholder/60/60";
                            }}
                          />
                        </div>
                        <div className="item-details">
                          <h6>{item.name}</h6>
                          <p>Qty: {item.quantity}</p>
                        </div>
                        <div className="item-price">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="price-breakdown">
                    <div className="price-row">
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="price-row">
                      <span>Shipping:</span>
                      <span>
                        {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="price-row">
                      <span>Tax (GST 18%):</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="price-row total">
                      <span>Total:</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={loading || orderLoading}
                  >
                    {loading || orderLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Processing...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </button>

                  {/* Security Badge */}
                  <div className="security-info">
                    <i className="fas fa-lock"></i>
                    <small>
                      Your payment information is secure and encrypted
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
