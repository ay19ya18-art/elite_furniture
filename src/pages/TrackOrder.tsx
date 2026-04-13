import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { listOrders, submitOrderRating } from "../services/ordersService";
import type { Order } from "../types";

const labels: Record<Order["status"], string> = {
  pending: "Received",
  processing: "Preparing",
  shipped: "Shipped",
  delivered: "Delivered",
};

export function TrackOrderPage() {
  const [params] = useSearchParams();
  const initial = params.get("id") ?? "";
  const [query, setQuery] = useState(initial);
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initial) void search(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load only
  }, []);

  async function search(id: string) {
    const orders = await listOrders();
    const found = orders.find((o) => o.id === id.trim());
    setOrder(found ?? null);
    setSearched(true);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Support</p>
      <h1 className="mt-3 font-display text-3xl text-ink">Track your order</h1>
      <form
        className="mt-8 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void search(query);
        }}
      >
        <input
          className="flex-1 rounded-md border border-black/15 px-4 py-3 text-sm outline-none focus:border-ink"
          placeholder="Order ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-md bg-ink px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white"
        >
          Track
        </button>
      </form>
      {searched && !order ? (
        <p className="mt-8 text-sm text-muted">No order found for that ID.</p>
      ) : null}
      {order ? (
        <div className="mt-10 rounded-2xl border border-black/5 bg-paper p-6">
          <p className="text-xs uppercase tracking-widest text-muted">Status</p>
          <p className="mt-2 text-lg font-semibold">{labels[order.status]}</p>
          <p className="mt-6 text-xs uppercase tracking-widest text-muted">Email</p>
          <p className="mt-1 text-sm">{order.customerEmail}</p>
          <p className="mt-6 text-xs uppercase tracking-widest text-muted">Total</p>
          <p className="mt-1 text-sm font-semibold">{order.total.toLocaleString()} EGP</p>
          {order.shipping ? (
            <div className="mt-6 border-t border-black/10 pt-6 text-sm">
              <p className="text-xs uppercase tracking-widest text-muted">Delivery details</p>
              <p className="mt-2 text-muted">
                Phone: <span className="text-ink">{order.shipping.phone}</span>
              </p>
              {order.shipping.phoneSecondary ? (
                <p className="mt-1 text-muted">
                  Alt: <span className="text-ink">{order.shipping.phoneSecondary}</span>
                </p>
              ) : null}
              <p className="mt-2">
                {order.shipping.governorate}
                {order.shipping.district ? ` — ${order.shipping.district}` : ""}
              </p>
              <p className="mt-2 leading-relaxed">{order.shipping.addressLine}</p>
              {order.shipping.landmark ? (
                <p className="mt-2 text-xs text-muted">Near: {order.shipping.landmark}</p>
              ) : null}
              {order.shipping.notes ? (
                <p className="mt-2 text-xs text-muted">Notes: {order.shipping.notes}</p>
              ) : null}
            </div>
          ) : null}
          {order.status === "delivered" && order.rating == null ? (
            <div className="mt-8 border-t border-black/10 pt-6">
              <p className="text-sm font-medium">How was your delivery?</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="h-10 w-10 rounded-md border border-black/15 text-sm font-semibold hover:border-ink"
                    onClick={() => {
                      void (async () => {
                        await submitOrderRating(order.id, star);
                        toast.success("Thanks for rating");
                        await search(order.id);
                      })();
                    }}
                  >
                    {star}
                  </button>
                ))}
              </div>
            </div>
          ) : order.rating != null ? (
            <p className="mt-6 text-sm text-muted">Your rating: {order.rating}/5</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
