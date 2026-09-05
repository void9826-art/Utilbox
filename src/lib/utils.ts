export type ClassValue = string | number | bigint | boolean | null | undefined | ClassValue[];

/** Minimal class-name joiner. Tailwind conflict resolution is handled by
 *  ordering conventions in components rather than a runtime merge library. */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];
  for (const value of values) {
    if (!value && value !== 0) continue;
    if (Array.isArray(value)) {
      const nested = cn(...value);
      if (nested) out.push(nested);
    } else {
      out.push(String(value));
    }
  }
  return out.join(" ");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

const BYTE_UNITS = ["B", "KB", "MB", "GB", "TB"] as const;

export function formatBytes(bytes: number, fractionDigits?: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${Math.round(bytes)} B`;

  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < BYTE_UNITS.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const digits = fractionDigits ?? (value < 10 ? 2 : value < 100 ? 1 : 0);
  return `${value.toFixed(digits)} ${BYTE_UNITS[unitIndex]}`;
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(undefined, options).format(value);
}

/**
 * Trims trailing zeros so converter outputs read "1.5" rather than "1.500000",
 * while still keeping enough significant digits for very small numbers.
 */
export function formatDecimal(value: number, maxSignificant = 10): string {
  if (!Number.isFinite(value)) return "";
  if (value === 0) return "0";

  const magnitude = Math.abs(value);
  if (magnitude >= 1e15 || magnitude < 1e-7) {
    return value.toExponential(6).replace(/\.?0+e/, "e");
  }

  const formatted = new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: maxSignificant,
    useGrouping: false,
  }).format(value);

  return formatted;
}

/** Yields to the event loop so long loops do not block painting. */
export function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
