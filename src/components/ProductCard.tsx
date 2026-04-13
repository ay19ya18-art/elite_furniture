import { Link } from "react-router-dom";
import type { Product } from "../types";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

type Props = { product: Product };

export function ProductCard({ product }: Props) {
  const { toggle, has } = useWishlist();
  const { add } = useCart();
  const sale =
    product.originalPrice && product.originalPrice > product.price ? product.originalPrice : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white">
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-paper">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-muted">
            No image
          </div>
        )}
        {product.discountPercent ? (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
            {product.discountPercent}% off
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
            {product.category ?? "Collection"}
          </p>
          <Link to={`/product/${product.id}`} className="mt-2 block">
            <h3 className="font-display text-lg text-ink group-hover:underline">{product.name}</h3>
          </Link>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            {sale ? (
              <p className="text-xs text-muted line-through">{sale.toLocaleString()} EGP</p>
            ) : null}
            <p className="text-sm font-semibold text-ink">{product.price.toLocaleString()} EGP</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => toggle(product)}
              className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-widest ${
                has(product.id)
                  ? "border-ink bg-ink text-white"
                  : "border-black/15 text-ink hover:border-ink"
              }`}
            >
              ♡
            </button>
            <button
              type="button"
              onClick={() => add(product, 1)}
              className="rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-black"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
