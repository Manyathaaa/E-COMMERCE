import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/auth";
import { SearchProvider } from "./context/search";
import { CartProvider } from "./context/cart";
import { WishlistProvider } from "./context/wishlist";
import { OrderProvider } from "./context/order";
import { SupportProvider } from "./context/support";
import "antd/dist/reset.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <AuthProvider>
      <SearchProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <SupportProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </SupportProvider>
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </SearchProvider>
    </AuthProvider>
  </StrictMode>
);

reportWebVitals();
