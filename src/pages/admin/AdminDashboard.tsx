import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { listOrders } from "../../services/ordersService";
import { listProducts } from "../../services/productsService";
import { computeAnalytics } from "../../services/analyticsService";
import { exportOrdersToExcel } from "../../utils/exportOrdersExcel";
import type { Order, Product } from "../../types";

export function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    void (async () => {
      const [p, o] = await Promise.all([listProducts(), listOrders()]);
      setProducts(p);
      setOrders(o);
    })();
  }, []);

  const analytics = computeAnalytics(orders, 30);
  const pending = orders.filter((o) => o.status === "pending").length;

  const cards = [
    { label: "Products live", value: products.length },
    { label: "Orders (30d)", value: analytics.orders },
    { label: "Revenue (30d)", value: `${Math.round(analytics.revenue).toLocaleString()} EGP` },
    { label: "Conversion", value: `${analytics.conversionRate.toFixed(1)}%` },
  ];

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">Overview</p>
      <h1 className="mt-2 font-display text-3xl text-ink">Dashboard</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Snapshot of catalog health, demand, and funnel performance. Connect{" "}
        <code className="rounded bg-white px-1">VITE_API_URL</code> for live Railway data; otherwise
        local catalog and orders apply.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">{c.label}</p>
            <p className="mt-3 text-2xl font-semibold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          to="/admin/products/add"
          className="rounded-md bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white"
        >
          Add product
        </Link>
        <Link
          to="/admin/orders"
          className="rounded-md border border-black/15 px-5 py-3 text-xs font-semibold uppercase tracking-widest"
        >
          Manage orders ({pending} pending)
        </Link>
        <button
          type="button"
          onClick={() => {
            exportOrdersToExcel(orders);
            toast.success("تم تنزيل ملف الطلبات .xlsx");
          }}
          className="rounded-md border border-gold/40 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-widest text-ink hover:border-gold"
        >
          تنزيل كل الطلبات Excel
        </button>
        <Link
          to="/admin/analytics"
          className="rounded-md border border-black/15 px-5 py-3 text-xs font-semibold uppercase tracking-widest"
        >
          Analytics
        </Link>
      </div>
    </div>
  );
}
