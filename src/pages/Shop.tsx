import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listProducts } from "../services/productsService";
import type { Product } from "../types";
import { ProductCard } from "../components/ProductCard";

export function ShopPage() {
  const [params] = useSearchParams();
  const room = params.get("room") ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await listProducts();
        if (!cancelled) setProducts(list);
      } catch {
        if (!cancelled) setError("Unable to load products.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!room) return products;
    return products.filter(
      (p) => (p.category ?? "").toLowerCase() === room.toLowerCase(),
    );
  }, [products, room]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
        Shop
      </p>
      <h1 className="mt-3 font-display text-4xl text-ink">Curated for real rooms</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
        Every piece is photographed honestly, priced clearly, and ready to ship with care.
      </p>

      {room ? (
        <p className="mt-6 text-xs uppercase tracking-widest text-muted">
          Filtering: <span className="text-ink">{room}</span>
        </p>
      ) : null}

      {loading ? (
        <p className="mt-16 text-center text-sm text-muted">Loading collection…</p>
      ) : error ? (
        <p className="mt-16 text-center text-sm text-red-600">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="mt-16 text-center text-sm text-muted">No products match this view yet.</p>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
