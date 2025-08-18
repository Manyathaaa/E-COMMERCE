import { useState, useContext, createContext, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user from localStorage
    const authData = localStorage.getItem("auth");
    const currentUserId = authData
      ? JSON.parse(authData).user?._id || JSON.parse(authData).user?.id
      : null;

    // If user changed, clear cart
    if (currentUser && currentUser !== currentUserId) {
      setCart([]);
      localStorage.removeItem("cart");
    }

    // Update current user
    setCurrentUser(currentUserId);

    // Load cart only if user exists
    if (currentUserId) {
      let existingCartItem = localStorage.getItem("cart");
      if (existingCartItem) {
        try {
          setCart(JSON.parse(existingCartItem));
        } catch (error) {
          console.log("Error parsing cart data:", error);
          setCart([]);
          localStorage.removeItem("cart");
        }
      }
    } else {
      // Clear cart if no user is logged in
      setCart([]);
      localStorage.removeItem("cart");
    }
  }, [currentUser]);

  // Additional effect to monitor auth changes and clear cart accordingly
  useEffect(() => {
    const checkAuthChange = () => {
      const authData = localStorage.getItem("auth");
      const currentUserId = authData
        ? JSON.parse(authData).user?._id || JSON.parse(authData).user?.id
        : null;

      if (currentUser !== currentUserId) {
        setCurrentUser(currentUserId);
        if (!currentUserId) {
          setCart([]);
          localStorage.removeItem("cart");
        }
      }
    };

    // Check for auth changes periodically
    const interval = setInterval(checkAuthChange, 1000);

    return () => clearInterval(interval);
  }, [currentUser]);

  // Add to cart
  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      // Update quantity if item already exists
      const updatedCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      // Add new item to cart
      const newCart = [...cart, { ...product, quantity }];
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Update quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // Clear cart on user change
  const clearCartOnUserChange = () => {
    setCart([]);
    localStorage.removeItem("cart");
    setCurrentUser(null);
  };

  // Get cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearCartOnUserChange,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
