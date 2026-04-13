import * as XLSX from "xlsx";
import type { Order } from "../types";

const ORDER_COLUMNS = [
  "orderId",
  "customerEmail",
  "customerName",
  "phone",
  "phoneSecondary",
  "governorate",
  "district",
  "addressLine",
  "landmark",
  "postalCode",
  "deliveryNotes",
  "status",
  "total",
  "createdAt",
  "lineItems",
  "rating",
  "ratingEmailSent",
  "sessionId",
] as const;

type OrderRow = Record<(typeof ORDER_COLUMNS)[number], string | number>;

function toRows(orders: Order[]): OrderRow[] {
  return orders.map((o) => ({
    orderId: o.id,
    customerEmail: o.customerEmail,
    customerName: o.customerName ?? "",
    phone: o.shipping?.phone ?? "",
    phoneSecondary: o.shipping?.phoneSecondary ?? "",
    governorate: o.shipping?.governorate ?? "",
    district: o.shipping?.district ?? "",
    addressLine: o.shipping?.addressLine ?? "",
    landmark: o.shipping?.landmark ?? "",
    postalCode: o.shipping?.postalCode ?? "",
    deliveryNotes: o.shipping?.notes ?? "",
    status: o.status,
    total: o.total,
    createdAt: o.createdAt,
    lineItems: o.items.map((i) => `${i.name} ×${i.qty} @ ${i.price}`).join(" | "),
    rating: o.rating ?? "",
    ratingEmailSent: o.ratingEmailSent ? "yes" : "no",
    sessionId: o.sessionId ?? "",
  }));
}

/**
 * تصدير طلبات الإدمن إلى Excel (.xlsx) — يفتح مباشرة في Microsoft Excel و Google Sheets.
 * الصفوف الأولى تحتوي إقرار حقوق واستخدام داخلي فقط.
 */
export function exportOrdersToExcel(orders: Order[]) {
  const rows = toRows(orders);
  const headers = [...ORDER_COLUMNS];

  const metaLine1 =
    "© Elite Furniture — جميع الحقوق محفوظة | All rights reserved. هذا الملف للاستخدام الداخلي للإدارة فقط — يُحظر إعادة النشر أو التوزيع دون إذن كتابي.";
  const metaLine2 = `تاريخ التصدير / Exported: ${new Date().toLocaleString("ar-EG", { dateStyle: "full", timeStyle: "short" })} | عدد الطلبات: ${orders.length}`;

  const headerRow = headers.map((h) => h as string);
  const dataRows = rows.map((r) => headers.map((h) => r[h]));

  const aoa: (string | number)[][] = [
    [metaLine1],
    [metaLine2],
    [],
    headerRow,
    ...dataRows,
  ];

  const sheet = XLSX.utils.aoa_to_sheet(aoa);
  const colCount = Math.max(headers.length, 1);

  sheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: colCount - 1 } },
  ];

  sheet["!cols"] = headers.map((h) => ({
    wch: h === "addressLine" || h === "lineItems" || h === "deliveryNotes" ? 42 : h === "orderId" ? 38 : 16,
  }));

  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Orders");
  const name = `elite-furniture-orders-${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(book, name);
}
