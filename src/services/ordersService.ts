import type { Order, OrderStatus } from "../types";
import { createOrderApi, fetchOrdersApi, updateOrderStatusApi } from "./api/ordersApi";
import {
  getLocalOrders,
  markRatingEmailSent,
  saveLocalOrder,
  setLocalOrderRating,
  setLocalOrderStatus,
} from "./local/localOrders";

export async function listOrders(): Promise<Order[]> {
  const local = getLocalOrders();
  const remote = await fetchOrdersApi();
  if (remote && remote.length) return remote;
  return local.length ? local : remote ?? [];
}

export async function persistOrder(order: Order): Promise<Order> {
  const created = await createOrderApi(order);
  if (created) return created;
  saveLocalOrder(order);
  return order;
}

export async function setOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const updated = await updateOrderStatusApi(id, status);
  if (updated) return;
  setLocalOrderStatus(id, status);
}

export function notifyRatingRequest(id: string) {
  markRatingEmailSent(id);
}

export async function submitOrderRating(id: string, rating: number) {
  setLocalOrderRating(id, rating);
}
