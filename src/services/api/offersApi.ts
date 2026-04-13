import type { Offer } from "../../types";
import { api, isApiConfigured } from "./client";

function normalize(raw: Record<string, unknown>): Offer {
  return {
    id: String(raw.id ?? raw._id ?? crypto.randomUUID()),
    title: String(raw.title ?? ""),
    subtitle: raw.subtitle != null ? String(raw.subtitle) : null,
    badge: raw.badge != null ? String(raw.badge) : null,
    endsAt: raw.endsAt != null ? String(raw.endsAt) : null,
    productIds: Array.isArray(raw.productIds)
      ? (raw.productIds as unknown[]).map(String)
      : null,
  };
}

export async function fetchOffersApi(): Promise<Offer[] | null> {
  if (!isApiConfigured()) return null;
  try {
    const { data } = await api.get<unknown>("/offers");
    const list = Array.isArray(data) ? data : (data as { offers?: unknown }).offers;
    if (!Array.isArray(list)) return [];
    return list.map((o) => normalize(o as Record<string, unknown>));
  } catch {
    return null;
  }
}

export async function upsertOfferApi(offer: Offer): Promise<Offer | null> {
  if (!isApiConfigured()) return null;
  try {
    if (offer.id && !offer.id.startsWith("local-")) {
      const { data } = await api.put<unknown>(`/offers/${offer.id}`, offer);
      const body = (data as { offer?: unknown }).offer ?? data;
      return normalize(body as Record<string, unknown>);
    }
    const { data } = await api.post<unknown>("/offers", offer);
    const body = (data as { offer?: unknown }).offer ?? data;
    return normalize(body as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function deleteOfferApi(id: string): Promise<boolean> {
  if (!isApiConfigured()) return false;
  try {
    await api.delete(`/offers/${id}`);
    return true;
  } catch {
    return false;
  }
}
