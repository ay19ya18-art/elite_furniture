import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { listOffers, removeOffer, saveOffer } from "../../services/offersService";
import type { Offer } from "../../types";

export function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [draft, setDraft] = useState<Offer>({
    id: "",
    title: "",
    subtitle: "",
    badge: "",
    endsAt: "",
    productIds: [],
  });

  async function refresh() {
    setOffers(await listOffers());
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">Merchandising</p>
      <h1 className="mt-2 font-display text-3xl text-ink">Offers</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Create promotional stories on the storefront. Product IDs are optional comma-separated values
        matching your catalog IDs.
      </p>

      <form
        className="mt-10 max-w-2xl space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          void (async () => {
            const id = draft.id || `local-${crypto.randomUUID()}`;
            const productIds = Array.isArray(draft.productIds)
              ? draft.productIds.filter(Boolean)
              : [];
            await saveOffer({
              ...draft,
              id,
              productIds,
            });
            toast.success("Offer saved");
            setDraft({
              id: "",
              title: "",
              subtitle: "",
              badge: "",
              endsAt: "",
              productIds: [],
            });
            await refresh();
          })();
        }}
      >
        <Field label="Title" value={draft.title} onChange={(v) => setDraft((d) => ({ ...d, title: v }))} />
        <Field
          label="Subtitle"
          value={draft.subtitle ?? ""}
          onChange={(v) => setDraft((d) => ({ ...d, subtitle: v }))}
        />
        <Field label="Badge" value={draft.badge ?? ""} onChange={(v) => setDraft((d) => ({ ...d, badge: v }))} />
        <Field
          label="Ends at (ISO, optional)"
          value={draft.endsAt ?? ""}
          onChange={(v) => setDraft((d) => ({ ...d, endsAt: v }))}
          placeholder="2026-12-31"
        />
        <Field
          label="Product IDs (comma separated)"
          value={Array.isArray(draft.productIds) ? draft.productIds.join(", ") : ""}
          onChange={(v) =>
            setDraft((d) => ({
              ...d,
              productIds: v.split(",").map((s) => s.trim()).filter(Boolean),
            }))
          }
        />
        <button
          type="submit"
          className="rounded-md bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white"
        >
          Save offer
        </button>
      </form>

      <div className="mt-12 space-y-4">
        <h2 className="font-display text-xl">Current</h2>
        {offers.length === 0 ? (
          <p className="text-sm text-muted">No offers yet.</p>
        ) : (
          offers.map((o) => (
            <div
              key={o.id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
            >
              <div>
                <p className="font-semibold">{o.title}</p>
                <p className="text-sm text-muted">{o.subtitle}</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="text-xs font-semibold uppercase tracking-widest text-ink underline"
                  onClick={() => setDraft({ ...o, productIds: o.productIds ?? [] })}
                >
                  Load into form
                </button>
                <button
                  type="button"
                  className="text-xs font-semibold uppercase tracking-widest text-red-600"
                  onClick={() => {
                    if (!confirm("Delete this offer?")) return;
                    void (async () => {
                      await removeOffer(o.id);
                      toast.success("Removed");
                      await refresh();
                    })();
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
        {label}
      </label>
      <input
        className="mt-2 w-full rounded-md border border-black/15 px-4 py-3 text-sm outline-none focus:border-ink"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
