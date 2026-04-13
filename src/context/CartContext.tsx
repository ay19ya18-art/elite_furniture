import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "../types";

export type CartLine = { product: Product; qty: number };

type CartContextValue = {
  items: CartLine[];
  add: (product: Product, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const KEY = "elite_cart";

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l) => l?.product?.id)
      .map((l) => ({ product: l.product, qty: Math.max(1, Number(l.qty) || 1) }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(() => load());

  const persist = (next: CartLine[]) => {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const value = useMemo<CartContextValue>(() => {
    const add = (product: Product, qty = 1) => {
      const next = [...items];
      const idx = next.findIndex((l) => l.product.id === product.id);
      if (idx === -1) next.push({ product, qty });
      else next[idx] = { ...next[idx], qty: next[idx].qty + qty };
      persist(next);
    };
    const remove = (productId: string) => persist(items.filter((l) => l.product.id !== productId));
    const setQty = (productId: string, qty: number) => {
      if (qty <= 0) return remove(productId);
      persist(
        items.map((l) => (l.product.id === productId ? { ...l, qty } : l)),
      );
    };
    const clear = () => persist([]);
    const subtotal = items.reduce((s, l) => s + l.product.price * l.qty, 0);
    return { items, add, remove, setQty, clear, subtotal };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
