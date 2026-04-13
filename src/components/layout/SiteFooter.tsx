import { Link } from "react-router-dom";
import { BrandLogo } from "../BrandLogo";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-[#0f0f0f] text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <BrandLogo to="/" variant="footer" />
          <p className="max-w-sm text-sm leading-relaxed text-white/65">
            Premium furniture marketplace — thoughtful design, honest materials, and secure shopping.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>
              <Link className="hover:text-white" to="/shop">
                Shop
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/offers">
                Offers
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/about">
                About us
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">Account</p>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>
              <Link className="hover:text-white" to="/login">
                Sign in
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/wishlist">
                Wishlist
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/cart">
                Cart
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">Support</p>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>Cash on delivery</li>
            <li>
              <Link className="hover:text-white" to="/track-order">
                Order tracking
              </Link>
            </li>
            <li>Email verification</li>
            <li>Secure checkout</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Elite Furniture. All rights reserved.</p>
          <p dir="rtl">جميع الحقوق محفوظة لـ Elite Furniture</p>
        </div>
      </div>
    </footer>
  );
}
