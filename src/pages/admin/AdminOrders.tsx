import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { listOrders, notifyRatingRequest, setOrderStatus } from "../../services/ordersService";
import type { Order, OrderStatus } from "../../types";
import { exportOrdersToExcel } from "../../utils/exportOrdersExcel";

const statuses: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function refresh() {
    setOrders(await listOrders());
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">Operations</p>
          <h1 className="mt-2 font-display text-3xl text-ink">Orders</h1>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <button
            type="button"
            onClick={() => {
              exportOrdersToExcel(orders);
              toast.success("تم تنزيل ملف .xlsx — افتحه بـ Excel أو Google Sheets");
            }}
            className="rounded-md bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:bg-black"
          >
            تنزيل Excel (.xlsx)
          </button>
          <p className="max-w-md text-right text-[11px] leading-relaxed text-muted sm:text-left">
            الملف جاهز للعمل المباشر: جداول، فرز، وفلترة. الصفوف الأولى فيه إقرار حقوق — لا تشاركه خارج
            الشركة.
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-6">
        {orders.length === 0 ? (
          <p className="text-sm text-muted">No orders yet.</p>
        ) : (
          orders.map((o) => (
            <article
              key={o.id}
              className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-mono text-muted">{o.id}</p>
                  <p className="mt-2 text-sm font-semibold">{o.customerEmail}</p>
                  {o.customerName ? (
                    <p className="text-sm text-ink">{o.customerName}</p>
                  ) : null}
                  <p className="text-xs text-muted">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                    Status
                  </label>
                  <select
                    className="rounded-md border border-black/15 px-3 py-2 text-sm"
                    value={o.status}
                    onChange={(e) => {
                      const status = e.target.value as OrderStatus;
                      void (async () => {
                        await setOrderStatus(o.id, status);
                        toast.success("Status updated");
                        await refresh();
                      })();
                    }}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {o.shipping ? (
                <div className="mt-4 rounded-xl border border-black/5 bg-paper p-4 text-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                    Delivery
                  </p>
                  <p className="mt-2">
                    <span className="text-muted">Phone:</span> {o.shipping.phone}
                    {o.shipping.phoneSecondary ? (
                      <span className="ms-2 text-muted">Alt: {o.shipping.phoneSecondary}</span>
                    ) : null}
                  </p>
                  <p className="mt-1">
                    <span className="text-muted">Governorate:</span> {o.shipping.governorate}
                    {o.shipping.district ? (
                      <span className="ms-2 text-muted">· {o.shipping.district}</span>
                    ) : null}
                  </p>
                  <p className="mt-2 leading-relaxed">
                    <span className="text-muted">Address:</span> {o.shipping.addressLine}
                  </p>
                  {o.shipping.landmark ? (
                    <p className="mt-1 text-muted">Landmark: {o.shipping.landmark}</p>
                  ) : null}
                  {o.shipping.postalCode ? (
                    <p className="mt-1 text-muted">Postal: {o.shipping.postalCode}</p>
                  ) : null}
                  {o.shipping.notes ? (
                    <p className="mt-2 border-t border-black/10 pt-2 text-muted">Notes: {o.shipping.notes}</p>
                  ) : null}
                </div>
              ) : (
                <p className="mt-4 text-xs text-amber-800">No structured shipping data (legacy order).</p>
              )}
              <ul className="mt-4 space-y-1 text-sm text-muted">
                {o.items.map((i) => (
                  <li key={`${o.id}-${i.productId}`}>
                    {i.name} × {i.qty} — {i.price.toLocaleString()} EGP
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-black/5 pt-4">
                <p className="text-sm font-semibold">Total: {o.total.toLocaleString()} EGP</p>
                {o.rating != null ? (
                  <p className="text-sm text-muted">Rating: {o.rating}/5</p>
                ) : null}
                {o.status === "delivered" && !o.ratingEmailSent ? (
                  <button
                    type="button"
                    className="text-xs font-semibold uppercase tracking-widest text-ink underline"
                    onClick={() => {
                      notifyRatingRequest(o.id);
                      toast.success("Rating request recorded (connect email provider in production)");
                      void refresh();
                    }}
                  >
                    Mark rating email sent
                  </button>
                ) : o.ratingEmailSent ? (
                  <span className="text-xs text-muted">Rating email sent</span>
                ) : null}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
