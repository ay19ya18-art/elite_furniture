import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

export function WishlistPage() {
  const { items } = useWishlist();

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl text-ink">Wishlist</h1>
        <p className="mt-3 text-sm text-muted">Save pieces you love — they will appear here.</p>
        <Link
          to="/shop"
          className="mt-8 inline-flex rounded-md border border-ink px-6 py-3 text-xs font-semibold uppercase tracking-widest"
        >
          Browse shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-ink">Wishlist</h1>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            className="overflow-hidden rounded-2xl border border-black/5 bg-white"
          >
            <div className="aspect-[4/3] bg-paper">
              {p.image ? (
                <img src={p.image} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="p-5">
              <p className="font-display text-lg">{p.name}</p>
              <p className="mt-1 text-sm text-muted">{p.price.toLocaleString()} EGP</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
