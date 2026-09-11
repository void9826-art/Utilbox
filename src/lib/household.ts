/**
 * Arithmetic for the household calculators: paint and wallpaper, EV charging,
 * pet ages and subscriptions. Kept free of DOM and path-alias imports so
 * scripts/test-lib.mjs and scripts/verify-examples.mjs can run it under Node.
 */

export type UnitSystem = "metric" | "imperial";

/* -------------------------------------------------------------------------- */
/* Paint and wallpaper                                                         */
/* -------------------------------------------------------------------------- */

export interface PaintInput {
  length: number;
  width: number;
  height: number;
  doors: number;
  windows: number;
  doorArea: number;
  windowArea: number;
  coats: number;
  /** Area one litre (or gallon) covers in one coat. */
  coverage: number;
  wastePercent: number;
  includeCeiling: boolean;
}

export interface PaintResult {
  wallArea: number;
  openingsArea: number;
  ceilingArea: number;
  paintableArea: number;
  paint: number;
}

export function paintNeeded(input: PaintInput): PaintResult {
  const wallArea = 2 * (input.length + input.width) * input.height;
  const openingsArea = input.doors * input.doorArea + input.windows * input.windowArea;
  const ceilingArea = input.includeCeiling ? input.length * input.width : 0;
  const paintableArea = Math.max(0, wallArea - openingsArea) + ceilingArea;
  const paint = ((paintableArea * input.coats) / input.coverage) * (1 + input.wastePercent / 100);
  return { wallArea, openingsArea, ceilingArea, paintableArea, paint };
}

/** Standard retail container sizes, with the step used to search combinations. */
export const CAN_SIZES: Record<UnitSystem, { sizes: number[]; step: number }> = {
  metric: { sizes: [10, 5, 2.5, 1], step: 0.5 },
  imperial: { sizes: [5, 1, 0.25], step: 0.25 },
};

/**
 * The combination of containers that covers `required` with the fewest
 * containers, choosing the smallest total volume first. Unbounded coin-change
 * over integer steps, so it is exact rather than greedy.
 */
export function bestCans(required: number, system: UnitSystem): { counts: Array<{ size: number; count: number }>; total: number } {
  const { sizes, step } = CAN_SIZES[system];
  const need = Math.max(0, Math.ceil(required / step - 1e-9));
  const units = sizes.map((size) => Math.round(size / step));
  const limit = need + Math.max(...units);

  const fewest = new Array<number>(limit + 1).fill(Number.POSITIVE_INFINITY);
  const choice = new Array<number>(limit + 1).fill(-1);
  fewest[0] = 0;
  for (let total = 1; total <= limit; total += 1) {
    units.forEach((unit, index) => {
      if (unit <= total && fewest[total - unit] + 1 < fewest[total]) {
        fewest[total] = fewest[total - unit] + 1;
        choice[total] = index;
      }
    });
  }

  let reached = need;
  while (reached <= limit && !Number.isFinite(fewest[reached])) reached += 1;

  const counts = sizes.map((size) => ({ size, count: 0 }));
  for (let rest = reached; rest > 0; rest -= units[choice[rest]]) counts[choice[rest]].count += 1;
  return { counts: counts.filter((entry) => entry.count > 0), total: reached * step };
}

export interface WallpaperInput {
  /** All lengths in one unit: metres or feet. */
  perimeter: number;
  height: number;
  rollWidth: number;
  rollLength: number;
  patternRepeat: number;
  trim: number;
}

export function wallpaperRolls(input: WallpaperInput): { dropLength: number; dropsPerRoll: number; drops: number; rolls: number } | null {
  const dropLength = input.height + input.patternRepeat + input.trim;
  const dropsPerRoll = Math.floor(input.rollLength / dropLength + 1e-9);
  if (dropsPerRoll < 1 || input.rollWidth <= 0) return null;
  const drops = Math.ceil(input.perimeter / input.rollWidth - 1e-9);
  return { dropLength, dropsPerRoll, drops, rolls: Math.ceil(drops / dropsPerRoll) };
}

/* -------------------------------------------------------------------------- */
/* EV charging                                                                  */
/* -------------------------------------------------------------------------- */

export const KM_PER_MILE = 1.609344;
export const LITRES_PER_US_GALLON = 3.785411784;
export const LITRES_PER_UK_GALLON = 4.54609;

export function chargeCost(input: {
  batteryKwh: number;
  fromPercent: number;
  toPercent: number;
  efficiencyPercent: number;
  pricePerKwh: number;
}): { energyAdded: number; energyFromGrid: number; cost: number } {
  const energyAdded = (input.batteryKwh * (input.toPercent - input.fromPercent)) / 100;
  const energyFromGrid = energyAdded / (input.efficiencyPercent / 100);
  return { energyAdded, energyFromGrid, cost: energyFromGrid * input.pricePerKwh };
}

/** Grid energy needed per single distance unit, from a dashboard consumption figure. */
export function gridKwhPerUnit(consumptionPerUnit: number, efficiencyPercent: number): number {
  return consumptionPerUnit / (efficiencyPercent / 100);
}

/* -------------------------------------------------------------------------- */
/* Pet ages                                                                     */
/* -------------------------------------------------------------------------- */

export type DogSize = "small" | "medium" | "large" | "giant";

/** Human-equivalent age at dog ages 1–16, by adult size. */
export const DOG_CHART: Record<DogSize, number[]> = {
  small: [15, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80],
  medium: [15, 24, 28, 32, 36, 42, 47, 51, 56, 60, 65, 69, 74, 78, 83, 87],
  large: [15, 24, 28, 32, 36, 45, 50, 55, 61, 66, 72, 77, 82, 88, 93, 99],
  giant: [12, 22, 31, 38, 45, 49, 56, 64, 71, 79, 86, 93, 100, 107, 114, 121],
};

export const DOG_SIZE_LABELS: Record<DogSize, string> = {
  small: "Small — up to 9 kg (20 lb)",
  medium: "Medium — 9 to 23 kg (20–50 lb)",
  large: "Large — 23 to 45 kg (50–100 lb)",
  giant: "Giant — over 45 kg (100 lb)",
};

export const DOG_BREEDS: Array<{ name: string; size: DogSize }> = [
  { name: "Beagle", size: "medium" },
  { name: "Belgian Malinois", size: "large" },
  { name: "Border Collie", size: "medium" },
  { name: "Boxer", size: "large" },
  { name: "Cavalier King Charles Spaniel", size: "small" },
  { name: "Chihuahua", size: "small" },
  { name: "Cocker Spaniel", size: "medium" },
  { name: "Dachshund (miniature)", size: "small" },
  { name: "Dobermann", size: "large" },
  { name: "English Bulldog", size: "medium" },
  { name: "French Bulldog", size: "medium" },
  { name: "German Shepherd", size: "large" },
  { name: "Golden Retriever", size: "large" },
  { name: "Great Dane", size: "giant" },
  { name: "Irish Wolfhound", size: "giant" },
  { name: "Jack Russell Terrier", size: "small" },
  { name: "Labrador Retriever", size: "large" },
  { name: "Maltese", size: "small" },
  { name: "Mastiff", size: "giant" },
  { name: "Newfoundland", size: "giant" },
  { name: "Pomeranian", size: "small" },
  { name: "Poodle (toy)", size: "small" },
  { name: "Poodle (standard)", size: "medium" },
  { name: "Pug", size: "small" },
  { name: "Rottweiler", size: "large" },
  { name: "Saint Bernard", size: "giant" },
  { name: "Shih Tzu", size: "small" },
  { name: "Siberian Husky", size: "medium" },
  { name: "Staffordshire Bull Terrier", size: "medium" },
  { name: "Yorkshire Terrier", size: "small" },
];

export function dogSizeFromWeightKg(kilograms: number): DogSize {
  if (kilograms <= 9) return "small";
  if (kilograms <= 23) return "medium";
  if (kilograms <= 45) return "large";
  return "giant";
}

/** Chart age, interpolated between whole years and extended past 16 at the last year's rate. */
export function dogHumanAge(years: number, size: DogSize): number {
  const chart = DOG_CHART[size];
  if (years <= 0) return 0;
  if (years < 1) return chart[0] * years;
  if (years >= 16) return chart[15] + (years - 16) * (chart[15] - chart[14]);
  const whole = Math.floor(years);
  return chart[whole - 1] + (years - whole) * (chart[whole] - chart[whole - 1]);
}

/** Wang et al., Cell Systems (2020): human age ≈ 16 ln(dog age) + 31, from one year old. */
export function dogEpigeneticAge(years: number): number | null {
  return years >= 1 ? 16 * Math.log(years) + 31 : null;
}

const CAT_POINTS: Array<[number, number]> = [
  [0, 0],
  [1 / 12, 1],
  [3 / 12, 4],
  [6 / 12, 10],
  [1, 15],
  [1.5, 21],
  [2, 24],
];

export function catHumanAge(years: number): number {
  if (years <= 0) return 0;
  if (years >= 2) return 24 + (years - 2) * 4;
  for (let index = 1; index < CAT_POINTS.length; index += 1) {
    const [x1, y1] = CAT_POINTS[index];
    if (years <= x1) {
      const [x0, y0] = CAT_POINTS[index - 1];
      return y0 + ((years - x0) / (x1 - x0)) * (y1 - y0);
    }
  }
  return 24;
}

/* -------------------------------------------------------------------------- */
/* Subscriptions                                                                */
/* -------------------------------------------------------------------------- */

export type BillingCycle = "weekly" | "monthly" | "quarterly" | "yearly";

const PER_YEAR: Record<BillingCycle, number> = { weekly: 52, monthly: 12, quarterly: 4, yearly: 1 };

export function yearlyCost(price: number, cycle: BillingCycle): number {
  return price * PER_YEAR[cycle];
}

export function monthlyCost(price: number, cycle: BillingCycle): number {
  return (price * PER_YEAR[cycle]) / 12;
}

/** Rolls a renewal date forward by whole billing cycles until it is today or later. */
export function nextRenewal(date: string, cycle: BillingCycle, today: Date): string | null {
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]) - 1, Number(match[3])];
  const start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

  const at = (steps: number): number => {
    if (cycle === "weekly") return Date.UTC(year, month, day + 7 * steps);
    const months = month + steps * (cycle === "monthly" ? 1 : cycle === "quarterly" ? 3 : 12);
    // Clamp to the last day of shorter months, so the 31st renews on the 30th or 28th.
    const lastDay = new Date(Date.UTC(year, months + 1, 0)).getUTCDate();
    return Date.UTC(year, months, Math.min(day, lastDay));
  };

  let steps = 0;
  while (at(steps) < start && steps < 5000) steps += 1;
  return new Date(at(steps)).toISOString().slice(0, 10);
}
