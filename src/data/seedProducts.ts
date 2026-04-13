import type { Product } from "../types";

export const SEED_PRODUCTS: Product[] = [
  {
    id: "seed-oslo",
    name: "Oslo Velvet Sofa",
    price: 18990,
    originalPrice: 21990,
    description: "Deep seats, soft velvet, and a silhouette made for slow evenings.",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80",
    category: "Living Room",
    discountPercent: 12,
  },
  {
    id: "seed-aria",
    name: "Aria Oak Dining Table",
    price: 12450,
    originalPrice: null,
    description: "Solid oak with a hand-rubbed finish and generous seating for eight.",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1600&q=80",
    category: "Dining",
  },
  {
    id: "seed-lumen",
    name: "Lumen Bed Frame",
    price: 9990,
    originalPrice: 11200,
    description: "Low platform profile with whisper-quiet support and linen upholstery.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    category: "Bedroom",
    discountPercent: 8,
  },
  {
    id: "seed-atlas",
    name: "Atlas Executive Desk",
    price: 7650,
    description: "Cable-managed workspace with leather inlay and steel legs.",
    image:
      "https://images.unsplash.com/photo-1518455027357-f3f816188ba5?auto=format&fit=crop&w=1600&q=80",
    category: "Office",
  },
];
