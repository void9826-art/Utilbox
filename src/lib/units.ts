/**
 * Unit definitions for the converters.
 *
 * Every factor is "how many base units is one of these", using the exact
 * internationally agreed definitions where they exist — the inch is exactly
 * 25.4 mm, the pound exactly 0.45359237 kg, and so on. Nothing here is a
 * rounded approximation, so conversions round-trip cleanly.
 */

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  /** How many base units one of this unit represents. */
  factor: number;
  /** Grouping label shown in the unit list, e.g. "Imperial". */
  group?: string;
}

export interface UnitSet {
  baseUnit: string;
  /** Units shown in the two headline boxes by default. */
  defaults: [string, string];
  units: Unit[];
}

export const LENGTH_UNITS: UnitSet = {
  baseUnit: "m",
  defaults: ["cm", "in"],
  units: [
    { id: "nm", name: "Nanometre", symbol: "nm", factor: 1e-9, group: "Metric" },
    { id: "um", name: "Micrometre", symbol: "µm", factor: 1e-6, group: "Metric" },
    { id: "mm", name: "Millimetre", symbol: "mm", factor: 0.001, group: "Metric" },
    { id: "cm", name: "Centimetre", symbol: "cm", factor: 0.01, group: "Metric" },
    { id: "m", name: "Metre", symbol: "m", factor: 1, group: "Metric" },
    { id: "km", name: "Kilometre", symbol: "km", factor: 1000, group: "Metric" },
    { id: "in", name: "Inch", symbol: "in", factor: 0.0254, group: "Imperial" },
    { id: "ft", name: "Foot", symbol: "ft", factor: 0.3048, group: "Imperial" },
    { id: "yd", name: "Yard", symbol: "yd", factor: 0.9144, group: "Imperial" },
    { id: "mi", name: "Mile", symbol: "mi", factor: 1609.344, group: "Imperial" },
    { id: "nmi", name: "Nautical mile", symbol: "nmi", factor: 1852, group: "Nautical" },
    { id: "fathom", name: "Fathom", symbol: "ftm", factor: 1.8288, group: "Nautical" },
    { id: "furlong", name: "Furlong", symbol: "fur", factor: 201.168, group: "Other" },
    { id: "au", name: "Astronomical unit", symbol: "AU", factor: 1.495978707e11, group: "Other" },
    { id: "ly", name: "Light-year", symbol: "ly", factor: 9.4607304725808e15, group: "Other" },
  ],
};

export const WEIGHT_UNITS: UnitSet = {
  baseUnit: "kg",
  defaults: ["kg", "lb"],
  units: [
    { id: "mg", name: "Milligram", symbol: "mg", factor: 1e-6, group: "Metric" },
    { id: "g", name: "Gram", symbol: "g", factor: 0.001, group: "Metric" },
    { id: "kg", name: "Kilogram", symbol: "kg", factor: 1, group: "Metric" },
    { id: "t", name: "Tonne (metric)", symbol: "t", factor: 1000, group: "Metric" },
    { id: "oz", name: "Ounce", symbol: "oz", factor: 0.028349523125, group: "Imperial" },
    { id: "lb", name: "Pound", symbol: "lb", factor: 0.45359237, group: "Imperial" },
    { id: "st", name: "Stone", symbol: "st", factor: 6.35029318, group: "Imperial" },
    { id: "cwt", name: "Hundredweight (UK)", symbol: "cwt", factor: 50.80234544, group: "Imperial" },
    { id: "ton_us", name: "Ton (US short)", symbol: "ton", factor: 907.18474, group: "Tons" },
    { id: "ton_uk", name: "Ton (UK long)", symbol: "long ton", factor: 1016.0469088, group: "Tons" },
    { id: "ozt", name: "Troy ounce", symbol: "oz t", factor: 0.0311034768, group: "Precious metal" },
    { id: "ct", name: "Carat", symbol: "ct", factor: 0.0002, group: "Precious metal" },
  ],
};

export const TIME_UNITS: UnitSet = {
  baseUnit: "s",
  defaults: ["h", "min"],
  units: [
    { id: "ns", name: "Nanosecond", symbol: "ns", factor: 1e-9, group: "Exact" },
    { id: "us", name: "Microsecond", symbol: "µs", factor: 1e-6, group: "Exact" },
    { id: "ms", name: "Millisecond", symbol: "ms", factor: 0.001, group: "Exact" },
    { id: "s", name: "Second", symbol: "s", factor: 1, group: "Exact" },
    { id: "min", name: "Minute", symbol: "min", factor: 60, group: "Exact" },
    { id: "h", name: "Hour", symbol: "h", factor: 3600, group: "Exact" },
    { id: "d", name: "Day", symbol: "d", factor: 86400, group: "Exact" },
    { id: "wk", name: "Week", symbol: "wk", factor: 604800, group: "Exact" },
    { id: "fortnight", name: "Fortnight", symbol: "fn", factor: 1209600, group: "Exact" },
    // Calendar units have no fixed length; these use the Gregorian mean year.
    { id: "mo", name: "Month (average)", symbol: "mo", factor: 2629746, group: "Average" },
    { id: "yr", name: "Year (average)", symbol: "yr", factor: 31556952, group: "Average" },
    { id: "decade", name: "Decade", symbol: "dec", factor: 315569520, group: "Average" },
    { id: "century", name: "Century", symbol: "c", factor: 3155695200, group: "Average" },
  ],
};

export const SPEED_UNITS: UnitSet = {
  baseUnit: "mps",
  defaults: ["kph", "mph"],
  units: [
    { id: "mps", name: "Metres per second", symbol: "m/s", factor: 1 },
    { id: "kph", name: "Kilometres per hour", symbol: "km/h", factor: 1 / 3.6 },
    { id: "mph", name: "Miles per hour", symbol: "mph", factor: 0.44704 },
    { id: "fps", name: "Feet per second", symbol: "ft/s", factor: 0.3048 },
    { id: "knot", name: "Knot", symbol: "kn", factor: 1852 / 3600 },
    { id: "mach", name: "Mach (sea level, 15 °C)", symbol: "M", factor: 340.29 },
    { id: "minkm", name: "Minutes per kilometre", symbol: "min/km", factor: NaN },
    { id: "minmi", name: "Minutes per mile", symbol: "min/mi", factor: NaN },
  ],
};

export const AREA_UNITS: UnitSet = {
  baseUnit: "m2",
  defaults: ["m2", "ft2"],
  units: [
    { id: "mm2", name: "Square millimetre", symbol: "mm²", factor: 1e-6, group: "Metric" },
    { id: "cm2", name: "Square centimetre", symbol: "cm²", factor: 0.0001, group: "Metric" },
    { id: "m2", name: "Square metre", symbol: "m²", factor: 1, group: "Metric" },
    { id: "ha", name: "Hectare", symbol: "ha", factor: 10000, group: "Metric" },
    { id: "km2", name: "Square kilometre", symbol: "km²", factor: 1e6, group: "Metric" },
    { id: "in2", name: "Square inch", symbol: "in²", factor: 0.00064516, group: "Imperial" },
    { id: "ft2", name: "Square foot", symbol: "ft²", factor: 0.09290304, group: "Imperial" },
    { id: "yd2", name: "Square yard", symbol: "yd²", factor: 0.83612736, group: "Imperial" },
    { id: "acre", name: "Acre", symbol: "ac", factor: 4046.8564224, group: "Imperial" },
    { id: "mi2", name: "Square mile", symbol: "mi²", factor: 2589988.110336, group: "Imperial" },
  ],
};

export const VOLUME_UNITS: UnitSet = {
  baseUnit: "l",
  defaults: ["l", "gal_us"],
  units: [
    { id: "ml", name: "Millilitre", symbol: "ml", factor: 0.001, group: "Metric" },
    { id: "cl", name: "Centilitre", symbol: "cl", factor: 0.01, group: "Metric" },
    { id: "l", name: "Litre", symbol: "L", factor: 1, group: "Metric" },
    { id: "m3", name: "Cubic metre", symbol: "m³", factor: 1000, group: "Metric" },
    { id: "cm3", name: "Cubic centimetre", symbol: "cm³", factor: 0.001, group: "Metric" },
    { id: "tsp_us", name: "Teaspoon (US)", symbol: "tsp", factor: 0.00492892159375, group: "US" },
    { id: "tbsp_us", name: "Tablespoon (US)", symbol: "tbsp", factor: 0.01478676478125, group: "US" },
    { id: "floz_us", name: "Fluid ounce (US)", symbol: "fl oz", factor: 0.0295735295625, group: "US" },
    { id: "cup_us", name: "Cup (US)", symbol: "cup", factor: 0.2365882365, group: "US" },
    { id: "pt_us", name: "Pint (US)", symbol: "pt", factor: 0.473176473, group: "US" },
    { id: "qt_us", name: "Quart (US)", symbol: "qt", factor: 0.946352946, group: "US" },
    { id: "gal_us", name: "Gallon (US)", symbol: "gal", factor: 3.785411784, group: "US" },
    { id: "floz_uk", name: "Fluid ounce (imperial)", symbol: "fl oz", factor: 0.0284130625, group: "Imperial" },
    { id: "pt_uk", name: "Pint (imperial)", symbol: "pt", factor: 0.56826125, group: "Imperial" },
    { id: "gal_uk", name: "Gallon (imperial)", symbol: "gal", factor: 4.54609, group: "Imperial" },
    { id: "cup_metric", name: "Cup (metric)", symbol: "cup", factor: 0.25, group: "Metric" },
    { id: "ft3", name: "Cubic foot", symbol: "ft³", factor: 28.316846592, group: "Imperial" },
    { id: "in3", name: "Cubic inch", symbol: "in³", factor: 0.016387064, group: "Imperial" },
  ],
};

export const DATA_UNITS: UnitSet = {
  baseUnit: "B",
  defaults: ["MB", "MiB"],
  units: [
    { id: "bit", name: "Bit", symbol: "b", factor: 0.125, group: "Bits" },
    { id: "B", name: "Byte", symbol: "B", factor: 1, group: "Bytes" },
    { id: "kB", name: "Kilobyte", symbol: "kB", factor: 1e3, group: "Decimal (÷1000)" },
    { id: "MB", name: "Megabyte", symbol: "MB", factor: 1e6, group: "Decimal (÷1000)" },
    { id: "GB", name: "Gigabyte", symbol: "GB", factor: 1e9, group: "Decimal (÷1000)" },
    { id: "TB", name: "Terabyte", symbol: "TB", factor: 1e12, group: "Decimal (÷1000)" },
    { id: "PB", name: "Petabyte", symbol: "PB", factor: 1e15, group: "Decimal (÷1000)" },
    { id: "KiB", name: "Kibibyte", symbol: "KiB", factor: 1024, group: "Binary (÷1024)" },
    { id: "MiB", name: "Mebibyte", symbol: "MiB", factor: 1024 ** 2, group: "Binary (÷1024)" },
    { id: "GiB", name: "Gibibyte", symbol: "GiB", factor: 1024 ** 3, group: "Binary (÷1024)" },
    { id: "TiB", name: "Tebibyte", symbol: "TiB", factor: 1024 ** 4, group: "Binary (÷1024)" },
    { id: "PiB", name: "Pebibyte", symbol: "PiB", factor: 1024 ** 5, group: "Binary (÷1024)" },
  ],
};

export function getUnit(set: UnitSet, id: string): Unit {
  return set.units.find((unit) => unit.id === id) ?? set.units[0];
}

/**
 * Converts through the base unit. Pace units (min/km, min/mi) are inverse
 * measures rather than linear factors, so they are handled explicitly.
 */
export function convertUnits(set: UnitSet, value: number, fromId: string, toId: string): number {
  if (!Number.isFinite(value)) return NaN;

  const from = getUnit(set, fromId);
  const to = getUnit(set, toId);

  const inBase = isPace(from.id) ? paceToMetresPerSecond(from.id, value) : value * from.factor;
  if (!Number.isFinite(inBase)) return NaN;

  return isPace(to.id) ? metresPerSecondToPace(to.id, inBase) : inBase / to.factor;
}

function isPace(id: string): boolean {
  return id === "minkm" || id === "minmi";
}

function paceToMetresPerSecond(id: string, minutesPerUnit: number): number {
  if (minutesPerUnit <= 0) return NaN;
  const metres = id === "minkm" ? 1000 : 1609.344;
  return metres / (minutesPerUnit * 60);
}

function metresPerSecondToPace(id: string, metresPerSecond: number): number {
  if (metresPerSecond <= 0) return NaN;
  const metres = id === "minkm" ? 1000 : 1609.344;
  return metres / metresPerSecond / 60;
}

/** Groups units for rendering inside <optgroup> elements. */
export function groupUnits(set: UnitSet): Array<{ group: string; units: Unit[] }> {
  const groups = new Map<string, Unit[]>();
  for (const unit of set.units) {
    const key = unit.group ?? "";
    const existing = groups.get(key);
    if (existing) existing.push(unit);
    else groups.set(key, [unit]);
  }
  return [...groups.entries()].map(([group, units]) => ({ group, units }));
}

/* -------------------------------------------------------------------------- */
/* Temperature is affine rather than linear, so it gets its own conversion.    */
/* -------------------------------------------------------------------------- */

export type TemperatureScale = "c" | "f" | "k" | "r";

export const TEMPERATURE_SCALES: Array<{ id: TemperatureScale; name: string; symbol: string }> = [
  { id: "c", name: "Celsius", symbol: "°C" },
  { id: "f", name: "Fahrenheit", symbol: "°F" },
  { id: "k", name: "Kelvin", symbol: "K" },
  { id: "r", name: "Rankine", symbol: "°R" },
];

/** Absolute zero expressed on each scale. */
export const ABSOLUTE_ZERO: Record<TemperatureScale, number> = {
  c: -273.15,
  f: -459.67,
  k: 0,
  r: 0,
};

function toKelvin(value: number, from: TemperatureScale): number {
  switch (from) {
    case "c":
      return value + 273.15;
    case "f":
      return (value + 459.67) * (5 / 9);
    case "k":
      return value;
    case "r":
      return value * (5 / 9);
  }
}

function fromKelvin(kelvin: number, to: TemperatureScale): number {
  switch (to) {
    case "c":
      return kelvin - 273.15;
    case "f":
      return kelvin * (9 / 5) - 459.67;
    case "k":
      return kelvin;
    case "r":
      return kelvin * (9 / 5);
  }
}

export function convertTemperature(
  value: number,
  from: TemperatureScale,
  to: TemperatureScale,
): number {
  if (!Number.isFinite(value)) return NaN;
  return fromKelvin(toKelvin(value, from), to);
}
