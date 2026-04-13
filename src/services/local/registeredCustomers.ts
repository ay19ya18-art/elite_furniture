/**
 * حسابات العملاء المسجّلة محليًا (localStorage) — لغاية ما يتوفر API حقيقي.
 * كلمات المرور مخزّنة كنص (غير مناسب للإنتاج الحساس بدون HTTPS + backend).
 */
export type RegisteredCustomer = {
  email: string;
  name: string;
  password: string;
  createdAt: string;
};

const KEY = "elite_registered_customers";

function read(): RegisteredCustomer[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RegisteredCustomer[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(list: RegisteredCustomer[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function getRegisteredCustomers(): RegisteredCustomer[] {
  return read();
}

export function findRegisteredByEmail(email: string): RegisteredCustomer | undefined {
  const e = email.trim().toLowerCase();
  return read().find((c) => c.email.toLowerCase() === e);
}

export function registerCustomer(
  name: string,
  email: string,
  password: string,
): { ok: true; customer: RegisteredCustomer } | { ok: false; error: string } {
  const e = email.trim().toLowerCase();
  if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
    return { ok: false, error: "بريد إلكتروني غير صالح." };
  }
  if (password.length < 8) {
    return { ok: false, error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل." };
  }
  const list = read();
  if (list.some((c) => c.email.toLowerCase() === e)) {
    return { ok: false, error: "هذا البريد مسجّل بالفعل. سجّل الدخول." };
  }
  const customer: RegisteredCustomer = {
    email: e,
    name: name.trim() || (e.split("@")[0] ?? "Customer"),
    password,
    createdAt: new Date().toISOString(),
  };
  list.push(customer);
  write(list);
  return { ok: true, customer };
}
