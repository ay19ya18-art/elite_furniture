import type { Offer } from "../../types";

const KEY = "elite_local_offers";

function read(): Offer[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Offer[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: Offer[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function getLocalOffers(): Offer[] {
  return read();
}

export function saveLocalOffers(items: Offer[]) {
  write(items);
}
