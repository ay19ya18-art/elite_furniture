import type { Product } from "../types";
import {
  createProduct as apiCreate,
  deleteProduct as apiDelete,
  fetchProduct,
  fetchProducts,
  updateProduct as apiUpdate,
} from "./api/productsApi";
import { getApiErrorMessage, isApiConfigured } from "./api/client";
import {
  getLocalProducts,
  removeLocalProduct,
  upsertLocalProduct,
} from "./local/localProducts";

function newId() {
  return crypto.randomUUID();
}

export async function listProducts(): Promise<Product[]> {
  const local = getLocalProducts();
  if (!isApiConfigured()) return local;
  try {
    const remote = await fetchProducts();
    if (remote.length) return remote;
  } catch {
    // fall through
  }
  return local;
}

export async function getProduct(id: string): Promise<Product | null> {
  if (isApiConfigured()) {
    try {
      const p = await fetchProduct(id);
      if (p) return p;
    } catch {
      // ignore
    }
  }
  return getLocalProducts().find((p) => p.id === id) ?? null;
}

export async function createProduct(payload: Omit<Product, "id">): Promise<Product> {
  if (isApiConfigured()) {
    try {
      return await apiCreate(payload);
    } catch (e) {
      console.warn(getApiErrorMessage(e), "— saving locally");
    }
  }
  const product: Product = { ...payload, id: newId() };
  upsertLocalProduct(product);
  return product;
}

export async function saveProduct(id: string, payload: Partial<Product>): Promise<Product> {
  if (isApiConfigured()) {
    try {
      return await apiUpdate(id, payload);
    } catch (e) {
      console.warn(getApiErrorMessage(e), "— saving locally");
    }
  }
  const existing =
    getLocalProducts().find((p) => p.id === id) ??
    ({ id, name: "", price: 0 } as Product);
  const merged = { ...existing, ...payload, id };
  upsertLocalProduct(merged);
  return merged;
}

export async function removeProduct(id: string): Promise<void> {
  if (isApiConfigured()) {
    try {
      await apiDelete(id);
      removeLocalProduct(id);
      return;
    } catch (e) {
      console.warn(getApiErrorMessage(e), "— removing locally only");
    }
  }
  removeLocalProduct(id);
}
