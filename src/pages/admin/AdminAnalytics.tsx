import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { listOrders } from "../../services/ordersService";
import type { Order } from "../../types";
import { computeAnalytics, type VisitEvent } from "../../services/analyticsService";

function readVisits(): VisitEvent[] {
  try {
    const raw = localStorage.getItem("elite_visit_events");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as VisitEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function visitsByDay(events: VisitEvent[], days: number) {
  const since = Date.now() - days * 86400000;
  const map = new Map<string, number>();
  for (const e of events) {
    const t = new Date(e.at).getTime();
    if (t < since) continue;
    const day = e.at.slice(0, 10);
    map.set(day, (map.get(day) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, views]) => ({ date, views }));
}

function ordersByDay(orders: Order[], days: number) {
  const since = Date.now() - days * 86400000;
  const map = new Map<string, number>();
  for (const o of orders) {
    const t = new Date(o.createdAt).getTime();
    if (t < since) continue;
    const day = o.createdAt.slice(0, 10);
    map.set(day, (map.get(day) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, ordersCount]) => ({ date, orders: ordersCount }));
}

export function AdminAnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [windowDays, setWindowDays] = useState(14);

  useEffect(() => {
    void (async () => {
      setOrders(await listOrders());
      setLoaded(true);
    })();
  }, []);

  const visits = readVisits();
  const analytics = computeAnalytics(orders, 30);
  const chartVisit = visitsByDay(visits, windowDays);
  const chartOrders = ordersByDay(orders, windowDays);

  const merged = useMemo(() => {
    const keys = new Set([...chartVisit.map((d) => d.date), ...chartOrders.map((d) => d.date)]);
    return [...keys]
      .sort()
      .map((date) => ({
        date,
        views: chartVisit.find((d) => d.date === date)?.views ?? 0,
        orders: chartOrders.find((d) => d.date === date)?.orders ?? 0,
      }));
  }, [chartVisit, chartOrders]);

  const orderedSessions = new Set(orders.map((o) => o.sessionId).filter(Boolean)).size;
  const sessionsWithVisits = new Set(visits.map((v) => v.sessionId)).size;
  const browsedNoOrder = Math.max(0, sessionsWithVisits - orderedSessions);

  if (!loaded) {
    return <p className="text-sm text-muted">Loading analytics…</p>;
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">Insights</p>
      <h1 className="mt-2 font-display text-3xl text-ink">Analytics</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Visit data is stored in the browser for this build. Wire your Railway analytics endpoint later
        without changing the UI.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {[7, 14, 30].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setWindowDays(d)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest ${
              windowDays === d ? "border-ink bg-ink text-white" : "border-black/10 text-muted"
            }`}
          >
            {d} days
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Visits (window)" value={chartVisit.reduce((s, d) => s + d.views, 0)} />
        <Stat label="Orders (window)" value={chartOrders.reduce((s, d) => s + d.orders, 0)} />
        <Stat label="Conversion (30d)" value={`${analytics.conversionRate.toFixed(1)}%`} />
        <Stat label="Sessions w/o order (est.)" value={browsedNoOrder} />
      </div>

      <div className="mt-10 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl">Traffic vs orders</h2>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={merged}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="views" fill="#111" radius={[4, 4, 0, 0]} name="Views" />
              <Bar dataKey="orders" fill="#b08d57" radius={[4, 4, 0, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl">Revenue trend</h2>
        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={orders
                .filter((o) => Date.now() - new Date(o.createdAt).getTime() < windowDays * 86400000)
                .reduce<{ date: string; revenue: number }[]>((acc, o) => {
                  const date = o.createdAt.slice(0, 10);
                  const row = acc.find((r) => r.date === date);
                  if (row) row.revenue += o.total;
                  else acc.push({ date, revenue: o.total });
                  return acc;
                }, [])
                .sort((a, b) => a.date.localeCompare(b.date))}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#111" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
