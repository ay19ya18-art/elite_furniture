import type { Product } from "../../types";

const KEY = "elite_local_products";

function read(): Product[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: Product[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function getLocalProducts(): Product[] {
  return read();
}

export function upsertLocalProduct(product: Product) {
  const items = read();
  const idx = items.findIndex((p) => p.id === product.id);
  if (idx === -1) items.push(product);
  else items[idx] = product;
  write(items);
}

export function removeLocalProduct(id: string) {
  write(read().filter((p) => p.id !== id));
}

export function seedLocalProductsIfEmpty(seed: Product[]) {
  if (read().length > 0) return;
  write(seed);
}
