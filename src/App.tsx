import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { SiteShell } from "./components/layout/SiteShell";
import { HomePage } from "./pages/Home";
import { ShopPage } from "./pages/Shop";
import { ProductDetailPage } from "./pages/ProductDetail";
import { OffersPage } from "./pages/Offers";
import { AboutPage } from "./pages/About";
import { LoginPage } from "./pages/Login";
import { AccountPage } from "./pages/Account";
import { CartPage } from "./pages/Cart";
import { CheckoutPage } from "./pages/Checkout";
import { WishlistPage } from "./pages/Wishlist";
import { TrackOrderPage } from "./pages/TrackOrder";
import { ADMIN_LOGIN_PATH } from "./config/adminRoutes";
import { SEED_PRODUCTS } from "./data/seedProducts";
import { seedLocalProductsIfEmpty } from "./services/local/localProducts";

const AdminLayout = lazy(async () => {
  const m = await import("./components/admin/AdminLayout");
  return { default: m.AdminLayout };
});
const AdminRoute = lazy(async () => {
  const m = await import("./components/admin/AdminRoute");
  return { default: m.AdminRoute };
});
const AdminLoginPage = lazy(async () => {
  const m = await import("./pages/admin/AdminLogin");
  return { default: m.AdminLoginPage };
});
const AdminDashboardPage = lazy(async () => {
  const m = await import("./pages/admin/AdminDashboard");
  return { default: m.AdminDashboardPage };
});
const AdminProductsPage = lazy(async () => {
  const m = await import("./pages/admin/AdminProducts");
  return { default: m.AdminProductsPage };
});
const AdminProductFormPage = lazy(async () => {
  const m = await import("./pages/admin/AdminProductForm");
  return { default: m.AdminProductFormPage };
});
const AdminOrdersPage = lazy(async () => {
  const m = await import("./pages/admin/AdminOrders");
  return { default: m.AdminOrdersPage };
});
const AdminAnalyticsPage = lazy(async () => {
  const m = await import("./pages/admin/AdminAnalytics");
  return { default: m.AdminAnalyticsPage };
});
const AdminOffersPage = lazy(async () => {
  const m = await import("./pages/admin/AdminOffers");
  return { default: m.AdminOffersPage };
});

function AdminFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper text-sm text-muted">
      Loading admin…
    </div>
  );
}

export default function App() {
  useEffect(() => {
    seedLocalProductsIfEmpty(SEED_PRODUCTS);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<SiteShell />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="offers" element={<OffersPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="track-order" element={<TrackOrderPage />} />
      </Route>

      <Route path="/admin/login" element={<Navigate to="/" replace />} />
      <Route
        path={ADMIN_LOGIN_PATH}
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLoginPage />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </Suspense>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/add" element={<AdminProductFormPage />} />
        <Route path="products/edit/:id" element={<AdminProductFormPage />} />
        <Route path="offers" element={<AdminOffersPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
