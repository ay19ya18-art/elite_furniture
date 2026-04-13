import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "../types";

type Value = {
  items: Product[];
  toggle: (product: Product) => void;
  has: (id: string) => boolean;
};

const KEY = "elite_wishlist_products";

function load(): Product[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const Ctx = createContext<Value | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>(() => load());

  const persist = (next: Product[]) => {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const value = useMemo<Value>(
    () => ({
      items,
      has: (id) => items.some((p) => p.id === id),
      toggle: (product) => {
        if (items.some((p) => p.id === product.id)) {
          persist(items.filter((p) => p.id !== product.id));
        } else persist([product, ...items]);
      },
    }),
    [items],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useWishlist must be used within WishlistProvider");
  return v;
}
