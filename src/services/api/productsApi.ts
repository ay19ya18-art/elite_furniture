import type { Product } from "../../types";
import { api, getApiErrorMessage, isApiConfigured } from "./client";

function normalizeProduct(raw: Record<string, unknown>): Product {
  const id = String(raw.id ?? raw._id ?? "");
  return {
    id,
    name: String(raw.name ?? ""),
    price: Number(raw.price ?? 0),
    originalPrice:
      raw.originalPrice != null && raw.originalPrice !== ""
        ? Number(raw.originalPrice)
        : null,
    description: raw.description != null ? String(raw.description) : null,
    image: raw.image != null ? String(raw.image) : null,
    category: raw.category != null ? String(raw.category) : null,
    discountPercent:
      raw.discountPercent != null && raw.discountPercent !== ""
        ? Number(raw.discountPercent)
        : null,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  if (!isApiConfigured()) return [];
  const { data } = await api.get<unknown>("/products");
  const list = Array.isArray(data) ? data : (data as { products?: unknown }).products;
  if (!Array.isArray(list)) return [];
  return list.map((p) => normalizeProduct(p as Record<string, unknown>));
}

export async function fetchProduct(id: string): Promise<Product | null> {
  if (!isApiConfigured()) return null;
  try {
    const { data } = await api.get<unknown>(`/products/${id}`);
    const body = (data as { product?: unknown }).product ?? data;
    if (!body || typeof body !== "object") return null;
    return normalizeProduct(body as Record<string, unknown>);
  } catch {
    const all = await fetchProducts();
    return all.find((p) => p.id === id) ?? null;
  }
}

export async function createProduct(payload: Omit<Product, "id">): Promise<Product> {
  const { data } = await api.post<unknown>("/products", payload);
  const body = (data as { product?: unknown }).product ?? data;
  return normalizeProduct(body as Record<string, unknown>);
}

export async function updateProduct(id: string, payload: Partial<Product>): Promise<Product> {
  const { data } = await api.put<unknown>(`/products/${id}`, payload);
  const body = (data as { product?: unknown }).product ?? data;
  return normalizeProduct(body as Record<string, unknown>);
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}

export { getApiErrorMessage };
