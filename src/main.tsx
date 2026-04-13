import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";
import { WishlistProvider } from "./context/WishlistContext";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

function Root() {
  const tree = (
    <StrictMode>
      <BrowserRouter>
        <CustomerAuthProvider>
          <WishlistProvider>
            <CartProvider>
              <App />
            <Toaster position="top-center" toastOptions={{ duration: 3500 }} />
            </CartProvider>
          </WishlistProvider>
        </CustomerAuthProvider>
      </BrowserRouter>
    </StrictMode>
  );

  if (googleClientId) {
    return <GoogleOAuthProvider clientId={googleClientId}>{tree}</GoogleOAuthProvider>;
  }
  return tree;
}

createRoot(document.getElementById("root")!).render(<Root />);
