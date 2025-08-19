import { useState, useContext, createContext, useEffect } from "react";

const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    let existingWishlistItem = localStorage.getItem("wishlist");
    if (existingWishlistItem) {
      setWishlist(JSON.parse(existingWishlistItem));
    }
  }, []);

  // Add to wishlist
  const addToWishlist = (product) => {
    const isAlreadyInWishlist = wishlist.find(
      (item) => item._id === product._id
    );
    if (!isAlreadyInWishlist) {
      const updatedWishlist = [...wishlist, product];
      setWishlist(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      return true; // Added successfully
    }
    return false; // Already in wishlist
  };

  // Remove from wishlist
  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  // Clear wishlist
  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem("wishlist");
  };

  // Get wishlist count
  const getWishlistCount = () => {
    return wishlist.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook
const useWishlist = () => useContext(WishlistContext);

export { useWishlist, WishlistProvider };
