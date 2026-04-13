import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { listProducts, removeProduct } from "../../services/productsService";
import type { Product } from "../../types";

export function AdminProductsPage() {
  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      setRows(await listProducts());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">Catalog</p>
          <h1 className="mt-2 font-display text-3xl text-ink">Products</h1>
        </div>
        <Link
          to="/admin/products/add"
          className="inline-flex justify-center rounded-md bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white"
        >
          Add product
        </Link>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        {loading ? (
          <p className="p-8 text-sm text-muted">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-sm text-muted">No products yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-black/5 bg-paper text-xs font-semibold uppercase tracking-widest text-muted">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} className="border-b border-black/5 last:border-0">
                    <td className="px-6 py-4">
                      <div className="h-14 w-20 overflow-hidden rounded-md bg-paper">
                        {p.image ? (
                          <img src={p.image} alt="" className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{p.name}</td>
                    <td className="px-6 py-4 text-muted">{p.category ?? "—"}</td>
                    <td className="px-6 py-4">{p.price.toLocaleString()} EGP</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/products/edit/${p.id}`}
                        className="mr-4 text-xs font-semibold uppercase tracking-widest text-ink underline-offset-4 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="text-xs font-semibold uppercase tracking-widest text-red-600 hover:underline"
                        onClick={() => {
                          if (!confirm(`Delete “${p.name}”?`)) return;
                          void (async () => {
                            try {
                              await removeProduct(p.id);
                              toast.success("Product removed");
                              await refresh();
                            } catch {
                              toast.error("Delete failed");
                            }
                          })();
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
