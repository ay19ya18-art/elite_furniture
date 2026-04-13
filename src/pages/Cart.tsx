import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export function CartPage() {
  const { items, setQty, remove, subtotal, clear } = useCart();

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl text-ink">Your cart is empty</h1>
        <p className="mt-3 text-sm text-muted">Discover pieces curated for real rooms.</p>
        <Link
          to="/shop"
          className="mt-8 inline-flex rounded-md border border-ink px-6 py-3 text-xs font-semibold uppercase tracking-widest"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-ink">Cart</h1>
      <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
        {items.map((line) => (
          <div key={line.product.id} className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center">
            <div className="h-28 w-40 overflow-hidden rounded-lg bg-paper">
              {line.product.image ? (
                <img src={line.product.image} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="flex-1">
              <p className="font-display text-lg">{line.product.name}</p>
              <p className="text-sm text-muted">{line.product.price.toLocaleString()} EGP</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min={1}
                className="w-20 rounded-md border border-black/15 px-3 py-2 text-sm"
                value={line.qty}
                onChange={(e) => setQty(line.product.id, Number(e.target.value))}
              />
              <button
                type="button"
                className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-ink"
                onClick={() => remove(line.product.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={clear}
          className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-ink"
        >
          Clear cart
        </button>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-muted">Subtotal</p>
          <p className="mt-1 text-2xl font-semibold">{subtotal.toLocaleString()} EGP</p>
          <Link
            to="/checkout"
            className="mt-6 inline-flex rounded-md bg-ink px-8 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
