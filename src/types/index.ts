export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  description?: string | null;
  image?: string | null;
  category?: string | null;
  /** 0–100 discount for offers UI */
  discountPercent?: number | null;
};

export type Offer = {
  id: string;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  /** ISO date optional */
  endsAt?: string | null;
  productIds?: string[] | null;
};

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered";

export type OrderLine = {
  productId: string;
  name: string;
  qty: number;
  price: number;
};

/** بيانات التوصيل — تُرسل مع الطلب للـ API والتخزين المحلي */
export type OrderShipping = {
  phone: string;
  phoneSecondary?: string | null;
  /** المحافظة */
  governorate: string;
  /** المنطقة / الحي / المركز */
  district?: string | null;
  /** الشارع والمبنى والدور والشقة — بالتفصيل */
  addressLine: string;
  /** علامة مميزة (مثلاً: بجوار مسجد …) */
  landmark?: string | null;
  postalCode?: string | null;
  /** ملاحظات للمندوب */
  notes?: string | null;
};

export type Order = {
  id: string;
  customerEmail: string;
  customerName?: string;
  items: OrderLine[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  rating?: number | null;
  ratingEmailSent?: boolean;
  /** visitor session id when order placed (for funnel) */
  sessionId?: string | null;
  /** بيانات التوصيل (إن وُجدت — الطلبات القديمة قد تكون بدونها) */
  shipping?: OrderShipping;
};

export type AnalyticsSnapshot = {
  visits: number;
  uniqueSessions: number;
  orders: number;
  conversionRate: number;
  revenue: number;
  windowDays: number;
};
