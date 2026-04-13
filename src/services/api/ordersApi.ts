import type { Order, OrderShipping, OrderStatus } from "../../types";
import { api, isApiConfigured } from "./client";

function pickShipping(raw: Record<string, unknown>): OrderShipping | undefined {
  const nested = raw.shipping as Record<string, unknown> | undefined;
  const src = nested && typeof nested === "object" ? nested : raw;
  const phone = String(src.phone ?? src.customerPhone ?? "").trim();
  const addressLine = String(src.addressLine ?? src.address ?? src.street ?? "").trim();
  const governorate = String(src.governorate ?? src.city ?? src.state ?? "").trim();
  const out: OrderShipping = {
    phone: phone || String(src.customerPhone ?? ""),
    phoneSecondary:
      src.phoneSecondary != null && String(src.phoneSecondary).trim()
        ? String(src.phoneSecondary)
        : src.phone2 != null && String(src.phone2).trim()
          ? String(src.phone2)
          : null,
    governorate: governorate || String(src.city ?? ""),
    district: src.district != null ? String(src.district) : src.area != null ? String(src.area) : null,
    addressLine: addressLine || String(src.fullAddress ?? ""),
    landmark: src.landmark != null ? String(src.landmark) : null,
    postalCode: src.postalCode != null ? String(src.postalCode) : src.zip != null ? String(src.zip) : null,
    notes: src.notes != null ? String(src.notes) : src.deliveryNotes != null ? String(src.deliveryNotes) : null,
  };
  if (!out.phone.trim() && !out.governorate.trim() && !out.addressLine.trim()) return undefined;
  return out;
}

function normalizeOrder(raw: Record<string, unknown>): Order {
  const shipping = pickShipping(raw);
  return {
    id: String(raw.id ?? raw._id ?? crypto.randomUUID()),
    customerEmail: String(raw.customerEmail ?? raw.email ?? ""),
    customerName: raw.customerName != null ? String(raw.customerName) : undefined,
    items: Array.isArray(raw.items)
      ? (raw.items as Record<string, unknown>[]).map((l) => ({
          productId: String(l.productId ?? ""),
          name: String(l.name ?? ""),
          qty: Number(l.qty ?? 1),
          price: Number(l.price ?? 0),
        }))
      : [],
    total: Number(raw.total ?? 0),
    status: (raw.status as OrderStatus) ?? "pending",
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    rating: raw.rating != null ? Number(raw.rating) : null,
    ratingEmailSent: Boolean(raw.ratingEmailSent),
    sessionId: raw.sessionId != null ? String(raw.sessionId) : null,
    shipping,
  };
}

export async function fetchOrdersApi(): Promise<Order[] | null> {
  if (!isApiConfigured()) return null;
  try {
    const { data } = await api.get<unknown>("/orders");
    const list = Array.isArray(data) ? data : (data as { orders?: unknown }).orders;
    if (!Array.isArray(list)) return [];
    return list.map((o) => normalizeOrder(o as Record<string, unknown>));
  } catch {
    return null;
  }
}

export async function updateOrderStatusApi(id: string, status: OrderStatus): Promise<Order | null> {
  if (!isApiConfigured()) return null;
  try {
    const { data } = await api.patch<unknown>(`/orders/${id}`, { status });
    const body = (data as { order?: unknown }).order ?? data;
    if (!body || typeof body !== "object") return null;
    return normalizeOrder(body as Record<string, unknown>);
  } catch {
    try {
      const { data } = await api.put<unknown>(`/orders/${id}`, { status });
      const body = (data as { order?: unknown }).order ?? data;
      if (!body || typeof body !== "object") return null;
      return normalizeOrder(body as Record<string, unknown>);
    } catch {
      return null;
    }
  }
}

export async function createOrderApi(order: Omit<Order, "id"> & { id?: string }): Promise<Order | null> {
  if (!isApiConfigured()) return null;
  try {
    const { data } = await api.post<unknown>("/orders", order);
    const body = (data as { order?: unknown }).order ?? data;
    if (!body || typeof body !== "object") return null;
    return normalizeOrder(body as Record<string, unknown>);
  } catch {
    return null;
  }
}
