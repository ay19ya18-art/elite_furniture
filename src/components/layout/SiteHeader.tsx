import { Link, NavLink, useLocation } from "react-router-dom";
import { BrandLogo } from "../BrandLogo";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

const nav = [
  { to: "/shop", label: "Shop" },
  { to: "/offers", label: "Offers" },
  { to: "/about", label: "About" },
];

type Props = { transparent?: boolean };

export function SiteHeader({ transparent }: Props) {
  const { pathname } = useLocation();
  const { user } = useCustomerAuth();
  const onHero = transparent ?? pathname === "/";

  return (
    <header
      className={`z-50 border-b transition-colors ${
        onHero
          ? "absolute inset-x-0 top-0 border-white/15 bg-gradient-to-b from-black/60 via-black/25 to-transparent text-white"
          : "sticky top-0 border-black/5 bg-white/90 text-ink backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <BrandLogo
          className={onHero ? "[&_span]:text-white" : ""}
          variant="header"
        />

        <nav className="hidden items-center gap-10 md:flex">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `text-xs font-semibold uppercase tracking-[0.28em] transition ${
                  onHero
                    ? isActive
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                    : isActive
                      ? "text-ink"
                      : "text-muted hover:text-ink"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-widest transition ${
              onHero
                ? "border-white/40 text-white hover:bg-white/10"
                : "border-black/15 text-ink hover:bg-black/[0.03]"
            }`}
          >
            ♡
          </Link>
          <Link
            to="/cart"
            aria-label="Cart"
            className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-widest transition ${
              onHero
                ? "border-white/40 text-white hover:bg-white/10"
                : "border-black/15 text-ink hover:bg-black/[0.03]"
            }`}
          >
            Cart
          </Link>
          <Link
            to={user ? "/account" : "/login"}
            className={`rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
              onHero
                ? "border-white text-white hover:bg-white/10"
                : "border-ink text-ink hover:bg-ink hover:text-white"
            }`}
          >
            {user ? "Account" : "Sign in"}
          </Link>
        </div>
      </div>
    </header>
  );
}
