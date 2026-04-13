import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BrandLogo } from "../components/BrandLogo";
import { CopyrightWatermark } from "../components/CopyrightWatermark";
import { GoogleSignInButton } from "../components/GoogleSignInButton";
import { useCustomerAuth } from "../context/CustomerAuthContext";

const sideImage =
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80";

export function LoginPage() {
  const navigate = useNavigate();
  const { signInPassword } = useCustomerAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const googleConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  return (
    <div className="relative flex min-h-dvh flex-col bg-white">
      <CopyrightWatermark />
      <header className="relative z-[1] border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <BrandLogo />
          <nav className="flex items-center gap-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
            <Link className="hover:text-ink" to="/shop">
              Shop
            </Link>
            <Link className="hover:text-ink" to="/offers">
              Offers
            </Link>
            <Link className="hover:text-ink" to="/about">
              About
            </Link>
          </nav>
        </div>
      </header>
      <div className="relative z-[1] mx-auto grid min-h-0 flex-1 max-w-6xl md:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-16">
          <h1 className="font-display text-4xl text-ink">Welcome back</h1>
          <p className="mt-3 text-sm text-muted">
            Sign in to access your wishlist, orders, and more.
          </p>

          <form
            className="mt-10 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (signInPassword(email, password)) {
                toast.success("Signed in");
                navigate("/account");
              } else {
                toast.error("Invalid email or password.");
              }
            }}
          >
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
                Email address
              </label>
              <input
                className="mt-2 w-full rounded-md border border-black/15 px-4 py-3 text-sm outline-none focus:border-ink"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
                Password
              </label>
              <input
                className="mt-2 w-full rounded-md border border-black/15 px-4 py-3 text-sm outline-none focus:border-ink"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-right">
              <span className="text-xs text-muted">Forgot password?</span>
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-ink py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white hover:bg-black"
            >
              Sign in
            </button>
          </form>

          {googleConfigured ? (
            <GoogleSignInButton />
          ) : (
            <p className="mt-6 text-xs text-muted">
              Google sign-in: add <code className="rounded bg-paper px-1">VITE_GOOGLE_CLIENT_ID</code>{" "}
              in <code className="rounded bg-paper px-1">.env</code>.
            </p>
          )}

          <p className="mt-10 text-sm text-muted">
            Demo account:{" "}
            <span className="text-ink">
              demo@elitefurniture.com / demo1234
            </span>
          </p>
          <p className="mt-6 text-sm text-muted">
            Staff?{" "}
            <Link className="text-ink underline" to="/admin/login">
              Admin login
            </Link>
          </p>
        </div>
        <div className="relative hidden min-h-dvh md:block">
          <img src={sideImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
            <p className="font-display text-xl italic leading-relaxed">
              “The Oslo Velvet Sofa transformed our living room — it’s the centerpiece every guest asks
              about.”
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-white/70">
              — Sara M., Cairo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
