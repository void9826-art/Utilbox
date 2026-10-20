/**
 * Roman numerals in their standard form, 1 to 3,999 — the range that can be
 * written without the overlines once used for thousands.
 */

const VALUES: Array<[number, string]> = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

const STANDARD = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
const LETTERS: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

export function toRoman(value: number): string | null {
  if (!Number.isInteger(value) || value < 1 || value > 3999) return null;
  let remaining = value;
  let out = "";
  for (const [amount, symbol] of VALUES) {
    while (remaining >= amount) {
      out += symbol;
      remaining -= amount;
    }
  }
  return out;
}

/** The parts of a numeral and what each is worth, for showing the working. */
export function romanParts(value: number): Array<{ symbol: string; value: number }> {
  const parts: Array<{ symbol: string; value: number }> = [];
  let remaining = value;
  for (const [amount, symbol] of VALUES) {
    while (remaining >= amount) {
      parts.push({ symbol, value: amount });
      remaining -= amount;
    }
  }
  return parts;
}

export type RomanParse =
  | { ok: true; value: number; standard: true }
  | { ok: true; value: number; standard: false; suggestion: string }
  | { ok: false; message: string };

/**
 * Reads a numeral. Standard numerals are validated exactly; non-standard
 * ones that still add up (IIII, IC, MDCCCCX) are read the way they were
 * meant and the standard spelling suggested.
 */
export function fromRoman(input: string): RomanParse {
  const text = input.trim().toUpperCase();
  if (!text) return { ok: false, message: "Enter a Roman numeral." };
  if (!/^[IVXLCDM]+$/.test(text)) {
    return { ok: false, message: "Roman numerals use only the letters I, V, X, L, C, D and M." };
  }
  let total = 0;
  for (let index = 0; index < text.length; index += 1) {
    const current = LETTERS[text[index]];
    const next = LETTERS[text[index + 1]] ?? 0;
    total += current < next ? -current : current;
  }
  if (total < 1 || total > 3999) return { ok: false, message: "Standard Roman numerals go from 1 (I) to 3,999 (MMMCMXCIX)." };
  if (STANDARD.test(text)) return { ok: true, value: total, standard: true };
  return { ok: true, value: total, standard: false, suggestion: toRoman(total) ?? "" };
}
