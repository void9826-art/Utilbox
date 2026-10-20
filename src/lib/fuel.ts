/**
 * Fuel cost for a trip, with every common way of stating fuel economy and
 * fuel price. All quantities are converted to kilometres and litres first.
 */

export const KM_PER_MILE = 1.609344;
export const LITRES_PER_US_GALLON = 3.785411784;
export const LITRES_PER_UK_GALLON = 4.54609;

export type EconomyUnit = "l100km" | "kml" | "mpgUS" | "mpgUK";
export type DistanceUnit = "km" | "mi";
export type PriceUnit = "litre" | "galUS" | "galUK";

/** Converts any economy figure to litres per 100 km. */
export function toLitresPer100km(value: number, unit: EconomyUnit): number {
  switch (unit) {
    case "l100km":
      return value;
    case "kml":
      return 100 / value;
    case "mpgUS":
      return (100 * LITRES_PER_US_GALLON) / (value * KM_PER_MILE);
    case "mpgUK":
      return (100 * LITRES_PER_UK_GALLON) / (value * KM_PER_MILE);
  }
}

export function pricePerLitre(price: number, unit: PriceUnit): number {
  if (unit === "galUS") return price / LITRES_PER_US_GALLON;
  if (unit === "galUK") return price / LITRES_PER_UK_GALLON;
  return price;
}

export interface TripInput {
  distance: number;
  distanceUnit: DistanceUnit;
  economy: number;
  economyUnit: EconomyUnit;
  price: number;
  priceUnit: PriceUnit;
  roundTrip: boolean;
  people: number;
}

export interface TripResult {
  km: number;
  litres: number;
  usGallons: number;
  ukGallons: number;
  cost: number;
  costPerPerson: number;
  costPerKm: number;
  costPerMile: number;
  litresPer100km: number;
}

export function tripCost(input: TripInput): TripResult | null {
  const { distance, economy, price, people } = input;
  if (!(distance > 0) || !(economy > 0) || !(price >= 0) || !(people >= 1)) return null;
  const km = (input.distanceUnit === "mi" ? distance * KM_PER_MILE : distance) * (input.roundTrip ? 2 : 1);
  const litresPer100km = toLitresPer100km(economy, input.economyUnit);
  const litres = (km * litresPer100km) / 100;
  const cost = litres * pricePerLitre(price, input.priceUnit);
  return {
    km,
    litres,
    usGallons: litres / LITRES_PER_US_GALLON,
    ukGallons: litres / LITRES_PER_UK_GALLON,
    cost,
    costPerPerson: cost / Math.floor(people),
    costPerKm: cost / km,
    costPerMile: (cost / km) * KM_PER_MILE,
    litresPer100km,
  };
}
