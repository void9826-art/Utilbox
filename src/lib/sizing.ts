/**
 * Shoe sizes and engine displacement and power.
 *
 * Shoe sizes use the standard definitions of each system in terms of foot
 * length (UK ≈ 3L − 23, US men ≈ 3L − 22, US women ≈ 3L − 21 with L in
 * inches; EU ≈ 1.5L + 2 with L in cm; Japan and Mondopoint state the length).
 * Brand charts use their own lasts and can differ by up to a full size.
 *
 * No imports: scripts/test-lib.mjs runs this under Node.
 */

export type ShoeSystem = "us-men" | "us-women" | "uk" | "eu" | "jp" | "mondopoint";

export const SHOE_SYSTEMS: Array<{ id: ShoeSystem; label: string; unit: string; step: number; min: number; max: number }> = [
  { id: "us-men", label: "US men's", unit: "", step: 0.5, min: 1, max: 18 },
  { id: "us-women", label: "US women's", unit: "", step: 0.5, min: 2, max: 19 },
  { id: "uk", label: "UK", unit: "", step: 0.5, min: 0, max: 17 },
  { id: "eu", label: "European (EU)", unit: "", step: 0.5, min: 30, max: 54 },
  { id: "jp", label: "Japan", unit: "cm", step: 0.5, min: 19, max: 35 },
  { id: "mondopoint", label: "Mondopoint / Korea", unit: "mm", step: 5, min: 190, max: 350 },
];

const CM_PER_INCH = 2.54;

export function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

/** Estimated foot length in centimetres for a size in any system. */
export function footLengthFromSize(system: ShoeSystem, size: number): number {
  switch (system) {
    case "uk":
      return ((size + 23) / 3) * CM_PER_INCH;
    case "us-men":
      return ((size + 22) / 3) * CM_PER_INCH;
    case "us-women":
      return ((size + 21) / 3) * CM_PER_INCH;
    case "eu":
      return (size - 2) / 1.5;
    case "jp":
      return size;
    case "mondopoint":
      return size / 10;
  }
}

/** The size in a system for a foot length in centimetres, rounded to that system's step. */
export function sizeFromFootLength(system: ShoeSystem, centimetres: number): number {
  const inches = centimetres / CM_PER_INCH;
  switch (system) {
    case "uk":
      return roundToStep(3 * inches - 23, 0.5);
    case "us-men":
      return roundToStep(3 * inches - 22, 0.5);
    case "us-women":
      return roundToStep(3 * inches - 21, 0.5);
    case "eu":
      return roundToStep(1.5 * centimetres + 2, 0.5);
    case "jp":
      return roundToStep(centimetres, 0.5);
    case "mondopoint":
      return roundToStep(centimetres * 10, 5);
  }
}

/* -------------------------------------------------------------------------- */
/* Engines                                                                     */
/* -------------------------------------------------------------------------- */

/** Exact by definition of the inch. */
export const CC_PER_CUBIC_INCH = 16.387064;
/** Mechanical horsepower: 550 ft·lbf/s. */
export const WATTS_PER_HP = 745.69987158227022;
/** Metric horsepower (PS): 75 kgf·m/s. */
export const WATTS_PER_PS = 735.49875;

/** Typical specific output, in horsepower per litre of displacement. */
export const ENGINE_TYPES: Array<{ id: string; label: string; low: number; typical: number; high: number }> = [
  { id: "scooter", label: "Scooter or commuter motorcycle", low: 60, typical: 75, high: 95 },
  { id: "petrol", label: "Petrol car, naturally aspirated", low: 70, typical: 85, high: 110 },
  { id: "turbo-petrol", label: "Petrol car, turbocharged", low: 100, typical: 120, high: 160 },
  { id: "diesel", label: "Diesel car, turbocharged", low: 55, typical: 75, high: 100 },
  { id: "sport-bike", label: "Sport motorcycle", low: 150, typical: 180, high: 220 },
  { id: "truck-diesel", label: "Truck or heavy-duty diesel", low: 25, typical: 32, high: 40 },
];

export function estimateHorsepower(cc: number, typeId: string): { low: number; typical: number; high: number } {
  const type = ENGINE_TYPES.find((entry) => entry.id === typeId) ?? ENGINE_TYPES[1];
  const litres = cc / 1000;
  return { low: litres * type.low, typical: litres * type.typical, high: litres * type.high };
}

export type PowerUnit = "hp" | "ps" | "kw";

export function convertPower(value: number, from: PowerUnit): { hp: number; ps: number; kw: number } {
  const watts = from === "hp" ? value * WATTS_PER_HP : from === "ps" ? value * WATTS_PER_PS : value * 1000;
  return { hp: watts / WATTS_PER_HP, ps: watts / WATTS_PER_PS, kw: watts / 1000 };
}
