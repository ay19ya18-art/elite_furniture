import type { Order, OrderStatus } from "../../types";

const KEY = "elite_local_orders";

function read(): Order[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Order[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: Order[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function getLocalOrders(): Order[] {
  return read().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function saveLocalOrder(order: Order) {
  const items = read();
  const idx = items.findIndex((o) => o.id === order.id);
  if (idx === -1) items.unshift(order);
  else items[idx] = order;
  write(items);
}

export function updateLocalOrder(id: string, patch: Partial<Order>) {
  const items = read();
  const idx = items.findIndex((o) => o.id === id);
  if (idx === -1) return;
  items[idx] = { ...items[idx], ...patch };
  write(items);
}

export function setLocalOrderStatus(id: string, status: OrderStatus) {
  updateLocalOrder(id, { status });
}

export function markRatingEmailSent(id: string) {
  updateLocalOrder(id, { ratingEmailSent: true });
}

export function setLocalOrderRating(id: string, rating: number) {
  updateLocalOrder(id, { rating });
}
