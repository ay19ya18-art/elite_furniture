import * as XLSX from "xlsx";
import type { Order } from "../types";
import { getRegisteredCustomers } from "../services/local/registeredCustomers";

/** أقصى عدد بنود في الـ Excel لكل طلب (أعمدة منفصلة) */
const MAX_LINE_ITEMS = 15;

function shippingFullText(o: Order): string {
  const s = o.shipping;
  if (!s) return "";
  const parts = [
    s.governorate,
    s.district,
    s.addressLine,
    s.landmark,
    s.postalCode,
    s.notes,
  ].filter((p) => p && String(p).trim());
  return parts.join(" — ");
}

function buildOrderHeaders(): string[] {
  const base = [
    "orderId",
    "customerEmail",
    "customerName",
    "customerPhonePrimary",
    "customerPhoneSecondary",
    "shipping_governorate",
    "shipping_district",
    "shipping_addressLine",
    "shipping_landmark",
    "shipping_postalCode",
    "shipping_notesForCourier",
    "shipping_fullTextCombined",
    "orderStatus",
    "orderTotalEgp",
    "orderCreatedAtIso",
    "itemsCount",
    "lineItems_concat",
    "customerRating",
    "ratingEmailSent",
    "visitorSessionId",
  ];
  const lineCols: string[] = [];
  for (let i = 1; i <= MAX_LINE_ITEMS; i++) {
    lineCols.push(
      `line${i}_productId`,
      `line${i}_productName`,
      `line${i}_qty`,
      `line${i}_unitPriceEgp`,
      `line${i}_lineTotalEgp`,
    );
  }
  return [...base, ...lineCols];
}

function orderToRow(o: Order, headers: string[]): (string | number)[] {
  const s = o.shipping;
  const map: Record<string, string | number> = {
    orderId: o.id,
    customerEmail: o.customerEmail,
    customerName: o.customerName ?? "",
    customerPhonePrimary: s?.phone ?? "",
    customerPhoneSecondary: s?.phoneSecondary ?? "",
    shipping_governorate: s?.governorate ?? "",
    shipping_district: s?.district ?? "",
    shipping_addressLine: s?.addressLine ?? "",
    shipping_landmark: s?.landmark ?? "",
    shipping_postalCode: s?.postalCode ?? "",
    shipping_notesForCourier: s?.notes ?? "",
    shipping_fullTextCombined: shippingFullText(o),
    orderStatus: o.status,
    orderTotalEgp: o.total,
    orderCreatedAtIso: o.createdAt,
    itemsCount: o.items.length,
    lineItems_concat: o.items.map((i) => `${i.name} ×${i.qty} @ ${i.price}`).join(" | "),
    customerRating: o.rating ?? "",
    ratingEmailSent: o.ratingEmailSent ? "yes" : "no",
    visitorSessionId: o.sessionId ?? "",
  };

  for (let i = 1; i <= MAX_LINE_ITEMS; i++) {
    const idx = i - 1;
    const li = o.items[idx];
    map[`line${i}_productId`] = li?.productId ?? "";
    map[`line${i}_productName`] = li?.name ?? "";
    map[`line${i}_qty`] = li ? li.qty : "";
    map[`line${i}_unitPriceEgp`] = li ? li.price : "";
    map[`line${i}_lineTotalEgp`] = li ? li.qty * li.price : "";
  }

  return headers.map((h) => map[h] ?? "");
}

/**
 * تصدير الطلبات + ورقة الحسابات المسجّلة (بيانات العميل الكاملة المتاحة محليًا).
 */
export function exportOrdersToExcel(orders: Order[]) {
  const orderHeaders = buildOrderHeaders();
  const registered = getRegisteredCustomers();

  const metaLine1 =
    "© Elite Furniture — جميع الحقوق محفوظة | Internal use only. يتضمن بيانات عملاء وطلبات — لا تشارك الملف خارج الشركة.";
  const metaLine2 = `Exported: ${new Date().toLocaleString("ar-EG", { dateStyle: "full", timeStyle: "short" })} | Orders: ${orders.length} | Registered accounts: ${registered.length}`;

  const orderDataRows = orders.map((o) => orderToRow(o, orderHeaders));
  const ordersAoa: (string | number)[][] = [
    [metaLine1],
    [metaLine2],
    [],
    orderHeaders,
    ...orderDataRows,
  ];

  const ordersSheet = XLSX.utils.aoa_to_sheet(ordersAoa);
  const colCount = Math.max(orderHeaders.length, 1);
  ordersSheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: colCount - 1 } },
  ];
  ordersSheet["!cols"] = orderHeaders.map((h) => ({
    wch:
      h.includes("addressLine") || h.includes("concat") || h.includes("Combined") || h.includes("productName")
        ? 36
        : h.startsWith("line") && h.includes("productId")
          ? 28
          : 14,
  }));

  const regHeaders = [
    "registeredEmail",
    "registeredFullName",
    "registeredAtIso",
    "password_plaintext_LOCAL_STORAGE_ONLY",
  ];
  const regMeta = [
    ["Registered customers (browser localStorage). Password column for admin support only — rotate passwords when moving to real backend."],
    [],
    regHeaders,
    ...registered.map((c) => [c.email, c.name, c.createdAt, c.password]),
  ];
  const regSheet = XLSX.utils.aoa_to_sheet(regMeta);
  regSheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: regHeaders.length - 1 } }];
  regSheet["!cols"] = [{ wch: 32 }, { wch: 24 }, { wch: 24 }, { wch: 28 }];

  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, ordersSheet, "Orders");
  XLSX.utils.book_append_sheet(book, regSheet, "RegisteredCustomers");
  const name = `elite_furniture_orders_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(book, name);
}
