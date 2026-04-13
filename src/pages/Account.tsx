import { Link } from "react-router-dom";
import { useCustomerAuth } from "../context/CustomerAuthContext";

export function AccountPage() {
  const { user, signOut } = useCustomerAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <p className="text-sm text-muted">You are not signed in.</p>
        <Link
          to="/login"
          className="mt-6 inline-flex rounded-md bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Account</p>
      <h1 className="mt-3 font-display text-3xl text-ink">Hello{user.name ? `, ${user.name}` : ""}</h1>
      <p className="mt-2 text-sm text-muted">{user.email}</p>
      {user.picture ? (
        <img src={user.picture} alt="" className="mt-8 h-20 w-20 rounded-full object-cover" />
      ) : null}
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          to="/wishlist"
          className="rounded-md border border-black/15 px-5 py-3 text-xs font-semibold uppercase tracking-widest hover:border-ink"
        >
          Wishlist
        </Link>
        <Link
          to="/track-order"
          className="rounded-md border border-black/15 px-5 py-3 text-xs font-semibold uppercase tracking-widest hover:border-ink"
        >
          Track order
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="rounded-md bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
