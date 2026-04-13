import type { AnalyticsSnapshot, Order } from "../types";

const VISIT_LOG_KEY = "elite_visit_events";
const SESSION_KEY = "elite_visitor_session";

export type VisitEvent = { at: string; sessionId: string; path: string };

function readVisits(): VisitEvent[] {
  try {
    const raw = localStorage.getItem(VISIT_LOG_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as VisitEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeVisits(events: VisitEvent[]) {
  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
  const pruned = events.filter((e) => new Date(e.at).getTime() >= cutoff);
  localStorage.setItem(VISIT_LOG_KEY, JSON.stringify(pruned.slice(-50_000)));
}

export function getOrCreateSessionId(): string {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  sessionStorage.setItem(SESSION_KEY, id);
  return id;
}

export function trackPageView(path: string) {
  if (path.startsWith("/admin")) return;
  const sessionId = getOrCreateSessionId();
  const events = readVisits();
  events.push({ at: new Date().toISOString(), sessionId, path });
  writeVisits(events);
}

export function computeAnalytics(orders: Order[], windowDays = 30): AnalyticsSnapshot {
  const since = Date.now() - windowDays * 24 * 60 * 60 * 1000;
  const visits = readVisits().filter((v) => new Date(v.at).getTime() >= since);
  const sessions = new Set(visits.map((v) => v.sessionId));

  const recentOrders = orders.filter((o) => new Date(o.createdAt).getTime() >= since);
  const revenue = recentOrders.reduce((s, o) => s + o.total, 0);

  const orderedSessions = new Set(
    recentOrders.map((o) => o.sessionId).filter(Boolean) as string[],
  );

  const uniqueSessions = sessions.size || 1;
  const conversionRate = Math.min(100, (orderedSessions.size / uniqueSessions) * 100);

  return {
    visits: visits.length,
    uniqueSessions,
    orders: recentOrders.length,
    conversionRate: Number.isFinite(conversionRate) ? conversionRate : 0,
    revenue,
    windowDays,
  };
}

export function sessionsBrowsedNoOrder(orders: Order[], windowDays = 30): number {
  const snap = computeAnalytics(orders, windowDays);
  return Math.max(0, snap.uniqueSessions - new Set(orders.map((o) => o.sessionId)).size);
}
