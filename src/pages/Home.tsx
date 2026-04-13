import { Link } from "react-router-dom";

const hero =
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=2200&q=80";

const categories = [
  {
    title: "Living Room",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Bedroom",
    image:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Dining",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Office",
    image:
      "https://images.unsplash.com/photo-1518455027357-f3f816188ba5?auto=format&fit=crop&w=1200&q=80",
  },
];

export function HomePage() {
  return (
    <div>
      <section className="relative min-h-[88vh] overflow-hidden bg-black">
        <img
          src={hero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 pb-20 pt-40 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            New collection {new Date().getFullYear()}
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            Spaces that feel intentional, warm, and unmistakably yours.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            Browse living, dining, and bedroom collections crafted for the way you truly live — with
            secure checkout and cash-on-delivery convenience.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="rounded-md bg-white px-8 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-ink hover:bg-white/90"
            >
              Shop collection
            </Link>
            <Link
              to="/offers"
              className="rounded-md border border-white/60 px-8 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white hover:bg-white/10"
            >
              View offers
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
          Browse by room
        </p>
        <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Shop by category</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.title}
              to={`/shop?room=${encodeURIComponent(c.title)}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-black/5 bg-paper"
            >
              <img
                src={c.image}
                alt={c.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <p className="absolute bottom-4 left-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">
                {c.title}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-black/5 bg-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
              Featured pieces
            </p>
            <h3 className="mt-3 font-display text-3xl text-ink">Hand-picked for longevity</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Enterprise-grade security, OTP-ready accounts, and delivery you can trust — without
              sacrificing the warmth of home.
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-flex rounded-md border border-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-ink hover:bg-ink hover:text-white"
            >
              Learn more
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-black/5 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80"
              alt="Living room vignette"
              className="h-full max-h-[420px] w-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
