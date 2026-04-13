import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BrandLogo } from "../../components/BrandLogo";
import { isAdminAuthenticated, setAdminSession, validateAdminCredentials } from "../../services/adminAuth";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/admin/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (isAdminAuthenticated()) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-4">
      <div className="w-full max-w-md rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
        <BrandLogo to="/" />
        <h1 className="mt-8 font-display text-2xl text-ink">Admin sign in</h1>
        <p className="mt-2 text-sm text-muted">
          Use credentials from your environment variables. Copy{" "}
          <code className="rounded bg-paper px-1">.env.example</code> to <code className="rounded bg-paper px-1">.env</code>{" "}
          and set <code className="rounded bg-paper px-1">VITE_ADMIN_EMAIL</code> and{" "}
          <code className="rounded bg-paper px-1">VITE_ADMIN_PASSWORD</code>.
        </p>
        <form
          className="mt-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!validateAdminCredentials(email, password)) {
              toast.error("Invalid admin credentials.");
              return;
            }
            setAdminSession({ email: email.trim(), loggedInAt: new Date().toISOString() });
            toast.success("Welcome back");
            navigate(from, { replace: true });
          }}
        >
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
              Email
            </label>
            <input
              className="mt-2 w-full rounded-md border border-black/15 px-4 py-3 text-sm outline-none focus:border-ink"
              type="email"
              autoComplete="username"
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
          <button
            type="submit"
            className="w-full rounded-md bg-ink py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white"
          >
            Enter dashboard
          </button>
        </form>
        <p className="mt-8 text-center text-xs text-muted">
          <a className="text-ink underline" href="/">
            ← Back to store
          </a>
        </p>
      </div>
    </div>
  );
}
