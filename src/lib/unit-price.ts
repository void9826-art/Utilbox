/**
 * Unit prices for comparing packs of different sizes.
 *
 * Each quantity is converted to a base unit — grams, millilitres or items —
 * so a 1.5 kg bag and a 500 g bag can be compared per 100 g or per kg.
 * Conversion factors are exact definitions (1 lb = 453.59237 g).
 */

export type Dimension = "mass" | "volume" | "count";

export interface QuantityUnit {
  id: string;
  label: string;
  dimension: Dimension;
  /** Base units (g, ml or items) in one of this unit. */
  factor: number;
}

export const QUANTITY_UNITS: QuantityUnit[] = [
  { id: "g", label: "g", dimension: "mass", factor: 1 },
  { id: "kg", label: "kg", dimension: "mass", factor: 1000 },
  { id: "oz", label: "oz", dimension: "mass", factor: 28.349523125 },
  { id: "lb", label: "lb", dimension: "mass", factor: 453.59237 },
  { id: "ml", label: "ml", dimension: "volume", factor: 1 },
  { id: "cl", label: "cl", dimension: "volume", factor: 10 },
  { id: "l", label: "litres", dimension: "volume", factor: 1000 },
  { id: "floz_us", label: "fl oz (US)", dimension: "volume", factor: 29.5735295625 },
  { id: "floz_uk", label: "fl oz (UK)", dimension: "volume", factor: 28.4130625 },
  { id: "gal_us", label: "gallons (US)", dimension: "volume", factor: 3785.411784 },
  { id: "item", label: "items", dimension: "count", factor: 1 },
];

export const COMPARE_BASIS: Record<Dimension, Array<{ id: string; label: string; amount: number }>> = {
  mass: [
    { id: "100g", label: "per 100 g", amount: 100 },
    { id: "kg", label: "per kg", amount: 1000 },
    { id: "oz", label: "per oz", amount: 28.349523125 },
    { id: "lb", label: "per lb", amount: 453.59237 },
  ],
  volume: [
    { id: "100ml", label: "per 100 ml", amount: 100 },
    { id: "l", label: "per litre", amount: 1000 },
    { id: "floz_us", label: "per fl oz (US)", amount: 29.5735295625 },
  ],
  count: [{ id: "item", label: "per item", amount: 1 }],
};

export interface Offer {
  price: number;
  /** Size of one pack, in `unit`. */
  quantity: number;
  unit: string;
  /** Number of packs bought for the price, e.g. a 4-pack. */
  packs: number;
}

export function unitById(id: string): QuantityUnit | undefined {
  return QUANTITY_UNITS.find((unit) => unit.id === id);
}

/** Price per base unit (per gram, millilitre or item), or null if unusable. */
export function pricePerBase(offer: Offer): number | null {
  const unit = unitById(offer.unit);
  if (!unit || !(offer.price >= 0) || !(offer.quantity > 0) || !(offer.packs >= 1)) return null;
  return offer.price / (offer.quantity * unit.factor * offer.packs);
}

export interface Ranked {
  index: number;
  perBase: number;
  /** How much more expensive than the cheapest, as a fraction: 0.25 = 25% more. */
  premium: number;
  cheapest: boolean;
}

/**
 * Ranks offers of one dimension from cheapest to dearest per unit. Offers
 * whose unit belongs to another dimension are left out: grams cannot be
 * compared with millilitres without knowing the product's density.
 */
export function rankOffers(offers: Offer[], dimension: Dimension): Ranked[] {
  const valid = offers
    .map((offer, index) => ({ index, perBase: pricePerBase(offer), unit: unitById(offer.unit) }))
    .filter((entry): entry is { index: number; perBase: number; unit: QuantityUnit } =>
      entry.perBase !== null && entry.unit?.dimension === dimension,
    );
  if (valid.length === 0) return [];
  const best = Math.min(...valid.map((entry) => entry.perBase));
  return valid
    .sort((a, b) => a.perBase - b.perBase)
    .map((entry) => ({
      index: entry.index,
      perBase: entry.perBase,
      premium: best > 0 ? entry.perBase / best - 1 : 0,
      // Equal unit prices tie for cheapest, to within rounding noise.
      cheapest: Math.abs(entry.perBase - best) <= best * 1e-9,
    }));
}
