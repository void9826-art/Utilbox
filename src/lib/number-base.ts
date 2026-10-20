/**
 * Conversion between number bases (binary, octal, decimal, hexadecimal and
 * any base from 2 to 36) using BigInt, so there is no size limit and no
 * precision loss.
 */

const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";

const PREFIXES: Record<string, number> = { "0x": 16, "0b": 2, "0o": 8 };

export type BaseParse = { ok: true; value: bigint } | { ok: false; message: string };

/** Reads a number in `base`. Spaces, underscores and a matching 0x/0b/0o prefix are allowed. */
export function parseInBase(input: string, base: number): BaseParse {
  let text = input.trim().toLowerCase().replace(/[\s_]/g, "");
  if (!text) return { ok: false, message: "Enter a number." };
  let negative = false;
  if (text.startsWith("-") || text.startsWith("−")) {
    negative = true;
    text = text.slice(1);
  }
  const prefix = text.slice(0, 2);
  if (PREFIXES[prefix] === base) text = text.slice(2);
  if (!text) return { ok: false, message: "Enter some digits after the prefix." };

  const allowed = DIGITS.slice(0, base);
  let value = BigInt(0);
  const big = BigInt(base);
  for (const char of text) {
    const digit = allowed.indexOf(char);
    if (digit < 0) {
      return {
        ok: false,
        message: `“${char}” is not a digit in base ${base}. Base ${base} uses ${base <= 10 ? `0–${base - 1}` : `0–9 and a–${DIGITS[base - 1]}`}.`,
      };
    }
    value = value * big + BigInt(digit);
  }
  return { ok: true, value: negative ? -value : value };
}

export function formatInBase(value: bigint, base: number, uppercase = false): string {
  const text = value.toString(base);
  return uppercase ? text.toUpperCase() : text;
}

/** Groups digits from the right: 4 for binary and hex, 3 for decimal and octal. */
export function groupDigits(text: string, size: number, separator = " "): string {
  const negative = text.startsWith("-");
  const digits = negative ? text.slice(1) : text;
  const groups: string[] = [];
  for (let end = digits.length; end > 0; end -= size) groups.unshift(digits.slice(Math.max(0, end - size), end));
  return (negative ? "-" : "") + groups.join(separator);
}

/** Bits needed to store the magnitude, minimum 1. */
export function bitLength(value: bigint): number {
  const abs = value < BigInt(0) ? -value : value;
  return abs === BigInt(0) ? 1 : abs.toString(2).length;
}

/**
 * Two's complement bit pattern of a value in a fixed width, or null if it
 * does not fit. 8, 16, 32 and 64 bits are the usual integer sizes.
 */
export function twosComplement(value: bigint, bits: number): string | null {
  const width = BigInt(bits);
  const one = BigInt(1);
  const min = -(one << (width - one));
  const max = (one << (width - one)) - one;
  if (value < min || value > max) return null;
  const pattern = value < BigInt(0) ? (one << width) + value : value;
  return pattern.toString(2).padStart(bits, "0");
}
