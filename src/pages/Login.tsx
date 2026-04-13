import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BrandLogo } from "../components/BrandLogo";
import { CopyrightWatermark } from "../components/CopyrightWatermark";
import { GoogleSignInButton } from "../components/GoogleSignInButton";
import { useCustomerAuth } from "../context/CustomerAuthContext";

const sideImage =
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80";

type Mode = "signin" | "signup";

export function LoginPage() {
  const navigate = useNavigate();
  const { signInPassword, signUp } = useCustomerAuth();
  const googleConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");

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
          <h1 className="font-display text-4xl text-ink">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-3 text-sm text-muted">
            {mode === "signin"
              ? "Sign in with email or Google — wishlist, orders, and more."
              : "Register with email and password (stored on this device until you connect a backend)."}
          </p>

          <div className="mt-6 flex rounded-lg border border-black/10 bg-paper p-1 text-xs font-semibold uppercase tracking-widest">
            <button
              type="button"
              className={`flex-1 rounded-md py-2 transition ${
                mode === "signin" ? "bg-ink text-white" : "text-muted hover:text-ink"
              }`}
              onClick={() => setMode("signin")}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`flex-1 rounded-md py-2 transition ${
                mode === "signup" ? "bg-ink text-white" : "text-muted hover:text-ink"
              }`}
              onClick={() => setMode("signup")}
            >
              Register
            </button>
          </div>

          {mode === "signup" ? (
            <form
              className="mt-8 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (password !== confirm) {
                  toast.error("Passwords do not match.");
                  return;
                }
                const res = signUp(name, email, password);
                if (!res.ok) {
                  toast.error(res.error);
                  return;
                }
                toast.success("Account created — you're signed in.");
                navigate("/account");
              }}
            >
              <Field
                label="Full name"
                value={name}
                onChange={setName}
                autoComplete="name"
                placeholder="Your name"
              />
              <Field
                label="Email"
                type="email"
                required
                value={email}
                onChange={setEmail}
                autoComplete="email"
              />
              <Field
                label="Password (min 8 characters)"
                type="password"
                required
                value={password}
                onChange={setPassword}
                autoComplete="new-password"
              />
              <Field
                label="Confirm password"
                type="password"
                required
                value={confirm}
                onChange={setConfirm}
                autoComplete="new-password"
              />
              <button
                type="submit"
                className="w-full rounded-md bg-ink py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white hover:bg-black"
              >
                Create account
              </button>
            </form>
          ) : (
            <form
              className="mt-8 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (signInPassword(email, password)) {
                  toast.success("Signed in");
                  navigate("/account");
                } else {
                  toast.error("Invalid email or password. Create an account if you're new.");
                }
              }}
            >
              <Field
                label="Email"
                type="email"
                required
                value={email}
                onChange={setEmail}
                autoComplete="email"
              />
              <Field
                label="Password"
                type="password"
                required
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
              />
              <button
                type="submit"
                className="w-full rounded-md bg-ink py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white hover:bg-black"
              >
                Sign in
              </button>
            </form>
          )}

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center" aria-hidden>
              <div className="w-full border-t border-black/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest text-muted">
              <span className="bg-white px-3">Or continue with</span>
            </div>
          </div>

          {googleConfigured ? (
            <GoogleSignInButton />
          ) : (
            <p className="text-sm text-muted">
              Google: add <code className="rounded bg-paper px-1">VITE_GOOGLE_CLIENT_ID</code> in{" "}
              <code className="rounded bg-paper px-1">.env</code>.
            </p>
          )}
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

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">{label}</label>
      <input
        required={required}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-md border border-black/15 px-4 py-3 text-sm outline-none focus:border-ink"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
