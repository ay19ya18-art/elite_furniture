import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listOffers } from "../services/offersService";
import { listProducts } from "../services/productsService";
import type { Offer, Product } from "../types";

const defaultOffers: Offer[] = [
  {
    id: "builtin-1",
    title: "Spring refresh",
    subtitle: "Up to 20% off living room anchors",
    badge: "Limited",
    endsAt: undefined,
  },
  {
    id: "builtin-2",
    title: "Dining sets",
    subtitle: "Bundle pricing on tables + seating",
    badge: "Bundle",
  },
];

export function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      const [o, p] = await Promise.all([listOffers(), listProducts()]);
      setOffers(o.length ? o : defaultOffers);
      setProducts(p);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Offers</p>
      <h1 className="mt-3 font-display text-4xl text-ink">Seasonal value, same standards</h1>
      <p className="mt-4 max-w-2xl text-sm text-muted">
        Promotions update regularly. When an offer targets specific pieces, you will see them linked
        below each card.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {offers.map((offer) => {
          const linked = products.filter((p) => offer.productIds?.includes(p.id)).slice(0, 3);
          return (
            <div
              key={offer.id}
              className="flex flex-col rounded-2xl border border-black/5 bg-paper p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-display text-2xl text-ink">{offer.title}</h2>
                {offer.badge ? (
                  <span className="rounded-full border border-ink px-3 py-1 text-[10px] font-semibold uppercase tracking-widest">
                    {offer.badge}
                  </span>
                ) : null}
              </div>
              {offer.subtitle ? (
                <p className="mt-3 text-sm text-muted">{offer.subtitle}</p>
              ) : null}
              {linked.length ? (
                <ul className="mt-6 space-y-2 text-sm">
                  {linked.map((p) => (
                    <li key={p.id}>
                      <Link className="text-ink underline-offset-4 hover:underline" to={`/product/${p.id}`}>
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <Link
                  to="/shop"
                  className="mt-8 inline-flex text-xs font-semibold uppercase tracking-widest text-ink underline-offset-4 hover:underline"
                >
                  Browse shop →
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
