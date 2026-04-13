import type { Offer } from "../types";
import { deleteOfferApi, fetchOffersApi, upsertOfferApi } from "./api/offersApi";
import { getLocalOffers, saveLocalOffers } from "./local/localOffers";

export async function listOffers(): Promise<Offer[]> {
  const remote = await fetchOffersApi();
  if (remote && remote.length) return remote;
  const local = getLocalOffers();
  return local.length ? local : remote ?? [];
}

export async function saveOffer(offer: Offer): Promise<Offer> {
  const saved = await upsertOfferApi(offer);
  if (saved) return saved;
  const local = getLocalOffers();
  const idx = local.findIndex((o) => o.id === offer.id);
  if (idx === -1) local.unshift(offer);
  else local[idx] = offer;
  saveLocalOffers(local);
  return offer;
}

export async function removeOffer(id: string): Promise<void> {
  const ok = await deleteOfferApi(id);
  if (ok) return;
  saveLocalOffers(getLocalOffers().filter((o) => o.id !== id));
}
