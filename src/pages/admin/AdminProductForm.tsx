import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { createProduct, getProduct, saveProduct } from "../../services/productsService";
import type { Product } from "../../types";

const empty: Omit<Product, "id"> = {
  name: "",
  price: 0,
  originalPrice: null,
  description: "",
  image: "",
  category: "Living Room",
  discountPercent: null,
};

export function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<Omit<Product, "id">>(empty);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    void (async () => {
      const p = await getProduct(id);
      if (cancelled) return;
      if (!p) {
        toast.error("Product not found");
        navigate("/admin/products");
        return;
      }
      setForm({
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        description: p.description ?? "",
        image: p.image ?? "",
        category: p.category ?? "",
        discountPercent: p.discountPercent ?? null,
      });
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  if (loading) {
    return <p className="text-sm text-muted">Loading product…</p>;
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
        {isEdit ? "Edit" : "Create"}
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink">{isEdit ? "Edit product" : "Add product"}</h1>

      <form
        className="mt-10 max-w-2xl space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          void (async () => {
            try {
              if (isEdit && id) {
                await saveProduct(id, form);
                toast.success("Product updated");
              } else {
                await createProduct(form);
                toast.success("Product created");
              }
              navigate("/admin/products");
            } catch {
              toast.error("Could not save product");
            }
          })();
        }}
      >
        <Field
          label="Name"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          required
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Price (EGP)"
            type="number"
            value={String(form.price)}
            onChange={(v) => setForm((f) => ({ ...f, price: Number(v) || 0 }))}
            required
          />
          <Field
            label="Original price (optional)"
            type="number"
            value={form.originalPrice != null ? String(form.originalPrice) : ""}
            onChange={(v) =>
              setForm((f) => ({
                ...f,
                originalPrice: v === "" ? null : Number(v),
              }))
            }
          />
        </div>
        <Field
          label="Category"
          value={form.category ?? ""}
          onChange={(v) => setForm((f) => ({ ...f, category: v }))}
        />
        <Field
          label="Image URL"
          value={form.image ?? ""}
          onChange={(v) => setForm((f) => ({ ...f, image: v }))}
          placeholder="https://"
        />
        <Field
          label="Discount % (optional)"
          type="number"
          value={form.discountPercent != null ? String(form.discountPercent) : ""}
          onChange={(v) =>
            setForm((f) => ({
              ...f,
              discountPercent: v === "" ? null : Number(v),
            }))
          }
        />
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
            Description
          </label>
          <textarea
            className="mt-2 min-h-[140px] w-full rounded-md border border-black/15 px-4 py-3 text-sm outline-none focus:border-ink"
            value={form.description ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="rounded-md bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white"
          >
            Save
          </button>
          <button
            type="button"
            className="rounded-md border border-black/15 px-6 py-3 text-xs font-semibold uppercase tracking-widest"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
        {label}
      </label>
      <input
        required={required}
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border border-black/15 px-4 py-3 text-sm outline-none focus:border-ink"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
