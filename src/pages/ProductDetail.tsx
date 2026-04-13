import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getProduct } from "../services/productsService";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const { toggle, has } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const p = await getProduct(id);
      if (!cancelled) {
        setProduct(p);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center text-sm text-muted sm:px-6 lg:px-8">
        Loading…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-muted">Product not found.</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 text-xs font-semibold uppercase tracking-widest text-ink underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const sale =
    product.originalPrice && product.originalPrice > product.price ? product.originalPrice : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <Link to="/shop" className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-ink">
        ← Back to shop
      </Link>
      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-paper">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex aspect-square items-center justify-center text-sm text-muted">
              No image
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
            {product.category ?? "Elite Furniture"}
          </p>
          <h1 className="mt-4 font-display text-4xl text-ink">{product.name}</h1>
          <div className="mt-6 flex items-baseline gap-4">
            <p className="text-2xl font-semibold">{product.price.toLocaleString()} EGP</p>
            {sale ? <p className="text-sm text-muted line-through">{sale.toLocaleString()} EGP</p> : null}
          </div>
          <p className="mt-8 text-sm leading-relaxed text-muted">
            {product.description ?? "Thoughtfully selected for comfort, proportion, and longevity."}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => {
                add(product, 1);
                toast.success("Added to cart");
              }}
              className="rounded-md bg-ink px-8 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white hover:bg-black"
            >
              Add to cart
            </button>
            <button
              type="button"
              onClick={() => {
                toggle(product);
                toast.success(has(product.id) ? "Removed from wishlist" : "Saved to wishlist");
              }}
              className="rounded-md border border-black/15 px-8 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-ink hover:border-ink"
            >
              {has(product.id) ? "Saved" : "Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
