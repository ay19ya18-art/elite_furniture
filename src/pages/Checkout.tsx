import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { EGYPT_GOVERNORATES } from "../data/egGovernorates";
import { getOrCreateSessionId } from "../services/analyticsService";
import { persistOrder } from "../services/ordersService";
import type { Order, OrderShipping } from "../types";

const GOV_WITH_OTHER = [...EGYPT_GOVERNORATES, "أخرى"] as const;

function normalizePhone(v: string) {
  return v.replace(/\s+/g, "").replace(/^\+2/, "");
}

function isValidEgyptPhone(v: string) {
  const d = normalizePhone(v).replace(/\D/g, "");
  return d.length >= 10 && d.length <= 11;
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();
  const { user } = useCustomerAuth();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneSecondary, setPhoneSecondary] = useState("");
  const [governorateChoice, setGovernorateChoice] = useState("");
  const [governorateOther, setGovernorateOther] = useState("");
  const [district, setDistrict] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [landmark, setLandmark] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (user?.email) setEmail(user.email);
    if (user?.name) setName(user.name);
  }, [user]);

  if (!items.length) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-sm text-muted">Nothing to checkout.</p>
      </div>
    );
  }

  const governorateFinal =
    governorateChoice === "أخرى" ? governorateOther.trim() : governorateChoice.trim();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-ink">إتمام الطلب</h1>
      <p className="mt-2 text-sm text-muted">
        الدفع عند الاستلام — يرجى تعبئة بيانات التوصيل بدقة لضمان وصول الشحنة بسلاسة.
      </p>

      <form
        className="mt-10 space-y-10"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!name.trim()) {
            toast.error("الاسم بالكامل مطلوب.");
            return;
          }
          if (!email.trim()) {
            toast.error("البريد الإلكتروني مطلوب.");
            return;
          }
          if (!isValidEgyptPhone(phone)) {
            toast.error("رقم هاتف صحيح مطلوب (مثال: 01xxxxxxxxx).");
            return;
          }
          if (phoneSecondary.trim() && !isValidEgyptPhone(phoneSecondary)) {
            toast.error("رقم الهاتف البديل غير صالح.");
            return;
          }
          if (!governorateChoice) {
            toast.error("اختر المحافظة.");
            return;
          }
          if (governorateChoice === "أخرى" && !governorateOther.trim()) {
            toast.error("اكتب اسم المحافظة أو المدينة.");
            return;
          }
          if (!district.trim()) {
            toast.error("أدخل المنطقة / الحي / المركز.");
            return;
          }
          if (addressLine.trim().length < 10) {
            toast.error("العنوان التفصيلي قصير جدًا — أضف الشارع والمبنى والدور.");
            return;
          }

          const shipping: OrderShipping = {
            phone: normalizePhone(phone),
            phoneSecondary: phoneSecondary.trim() ? normalizePhone(phoneSecondary) : null,
            governorate: governorateFinal,
            district: district.trim(),
            addressLine: addressLine.trim(),
            landmark: landmark.trim() || null,
            postalCode: postalCode.trim() || null,
            notes: notes.trim() || null,
          };

          const order: Order = {
            id: crypto.randomUUID(),
            customerEmail: email.trim(),
            customerName: name.trim(),
            items: items.map((l) => ({
              productId: l.product.id,
              name: l.product.name,
              qty: l.qty,
              price: l.product.price,
            })),
            total: subtotal,
            status: "pending",
            createdAt: new Date().toISOString(),
            sessionId: getOrCreateSessionId(),
            shipping,
          };
          await persistOrder(order);
          clear();
          toast.success("تم تأكيد الطلب");
          navigate(`/track-order?id=${encodeURIComponent(order.id)}`);
        }}
      >
        <section className="space-y-5">
          <h2 className="border-b border-black/10 pb-2 font-display text-lg text-ink">
            بيانات التواصل
          </h2>
          <Field
            label="الاسم بالكامل"
            sub="Full name"
            required
            value={name}
            onChange={setName}
            autoComplete="name"
          />
          <Field
            label="البريد الإلكتروني"
            sub="Email"
            type="email"
            required
            value={email}
            onChange={setEmail}
            autoComplete="email"
          />
        </section>

        <section className="space-y-5">
          <h2 className="border-b border-black/10 pb-2 font-display text-lg text-ink">
            بيانات التوصيل
          </h2>
          <Field
            label="رقم الهاتف الأساسي"
            sub="Primary mobile (for delivery calls)"
            required
            value={phone}
            onChange={setPhone}
            placeholder="01xxxxxxxxx"
            autoComplete="tel"
          />
          <Field
            label="رقم هاتف بديل (اختياري)"
            sub="Secondary phone"
            value={phoneSecondary}
            onChange={setPhoneSecondary}
            placeholder="01xxxxxxxxx"
            autoComplete="tel"
          />
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
              المحافظة
              <span className="ms-2 font-body normal-case text-muted">Governorate</span>
            </label>
            <select
              required
              className="mt-2 w-full rounded-md border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-ink"
              value={governorateChoice}
              onChange={(e) => setGovernorateChoice(e.target.value)}
            >
              <option value="">— اختر —</option>
              {GOV_WITH_OTHER.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {governorateChoice === "أخرى" ? (
              <input
                className="mt-3 w-full rounded-md border border-black/15 px-4 py-3 text-sm outline-none focus:border-ink"
                placeholder="اكتب المحافظة أو المدينة"
                value={governorateOther}
                onChange={(e) => setGovernorateOther(e.target.value)}
              />
            ) : null}
          </div>
          <Field
            label="المنطقة / الحي / المركز"
            sub="District / neighborhood"
            required
            value={district}
            onChange={setDistrict}
            placeholder="مثال: مدينة نصر — الحي السابع"
          />
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
              العنوان بالتفصيل
              <span className="ms-2 font-body normal-case text-muted">
                Street, building, floor, apartment
              </span>
            </label>
            <textarea
              required
              rows={4}
              className="mt-2 w-full rounded-md border border-black/15 px-4 py-3 text-sm outline-none focus:border-ink"
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              placeholder="رقم المبنى، الدور، الشقة، اسم العمارة…"
            />
          </div>
          <Field
            label="علامة مميزة قريبة (اختياري)"
            sub="Landmark near you"
            value={landmark}
            onChange={setLandmark}
            placeholder="مثال: بجوار صيدلية…"
          />
          <Field
            label="الرمز البريدي (إن وُجد)"
            sub="Postal code (optional)"
            value={postalCode}
            onChange={setPostalCode}
          />
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
              ملاحظات للمندوب
              <span className="ms-2 font-body normal-case text-muted">Delivery notes</span>
            </label>
            <textarea
              rows={3}
              className="mt-2 w-full rounded-md border border-black/15 px-4 py-3 text-sm outline-none focus:border-ink"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أوقات التوصيل المناسبة، بوابة معيّنة، إلخ."
            />
          </div>
        </section>

        <div className="rounded-xl border border-black/5 bg-paper p-6 text-sm">
          <p className="font-semibold">الإجمالي عند الاستلام</p>
          <p className="mt-2 text-2xl font-semibold">{subtotal.toLocaleString()} EGP</p>
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-ink py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white"
        >
          تأكيد الطلب
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  sub,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  autoComplete,
}: {
  label: string;
  sub?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
        {label}
        {sub ? (
          <span className="ms-2 font-body normal-case text-muted">{sub}</span>
        ) : null}
      </label>
      <input
        required={required}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-md border border-black/15 px-4 py-3 text-sm outline-none focus:border-ink"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
