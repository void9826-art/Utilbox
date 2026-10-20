/**
 * Numbers written out in English words, for cheques, invoices and forms.
 *
 * Works on the digits as text (with BigInt for the whole part), so large and
 * decimal amounts are never rounded by floating point. Supports the
 * international short scale (thousand, million, billion…) and the Indian
 * system (thousand, lakh, crore), British "and", ordinals and currency.
 */

const ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const SHORT_SCALE = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion"];

export type Scale = "international" | "indian";

export interface WordsOptions {
  scale: Scale;
  /** British and Indian English: "one hundred and five". */
  useAnd: boolean;
}

export const DEFAULT_WORDS: WordsOptions = { scale: "international", useAnd: false };

function underHundred(n: number): string {
  if (n < 20) return ONES[n];
  const tens = TENS[Math.floor(n / 10)];
  return n % 10 === 0 ? tens : `${tens}-${ONES[n % 10]}`;
}

function underThousand(n: number, useAnd: boolean): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  if (hundreds === 0) return underHundred(rest);
  const head = `${ONES[hundreds]} hundred`;
  if (rest === 0) return head;
  return `${head}${useAnd ? " and" : ""} ${underHundred(rest)}`;
}

function internationalWords(value: bigint, useAnd: boolean): string {
  if (value === BigInt(0)) return "zero";
  const groups: number[] = [];
  let remaining = value;
  const thousand = BigInt(1000);
  while (remaining > BigInt(0)) {
    groups.push(Number(remaining % thousand));
    remaining /= thousand;
  }
  if (groups.length > SHORT_SCALE.length) throw new RangeError("too large");
  const parts: string[] = [];
  for (let index = groups.length - 1; index >= 0; index -= 1) {
    const group = groups[index];
    if (group === 0) continue;
    // "one thousand and five": British usage adds "and" before a final group under 100.
    const needsAnd = useAnd && index === 0 && group < 100 && groups.length > 1;
    parts.push(`${needsAnd ? "and " : ""}${underThousand(group, useAnd)}${SHORT_SCALE[index] ? ` ${SHORT_SCALE[index]}` : ""}`);
  }
  return parts.join(" ");
}

function indianWords(value: bigint, useAnd: boolean): string {
  if (value === BigInt(0)) return "zero";
  const crore = BigInt(10_000_000);
  const parts: string[] = [];
  if (value >= crore) {
    parts.push(`${indianWords(value / crore, useAnd)} crore`);
    value %= crore;
  }
  const n = Number(value);
  const lakhs = Math.floor(n / 100_000);
  const thousands = Math.floor((n % 100_000) / 1000);
  const rest = n % 1000;
  if (lakhs) parts.push(`${underHundred(lakhs)} lakh`);
  if (thousands) parts.push(`${underHundred(thousands)} thousand`);
  if (rest) {
    const needsAnd = useAnd && rest < 100 && parts.length > 0;
    parts.push(`${needsAnd ? "and " : ""}${underThousand(rest, useAnd)}`);
  }
  return parts.join(" ");
}

export function integerToWords(value: bigint, options: WordsOptions = DEFAULT_WORDS): string {
  const negative = value < BigInt(0);
  const abs = negative ? -value : value;
  const words = options.scale === "indian" ? indianWords(abs, options.useAnd) : internationalWords(abs, options.useAnd);
  return negative ? `minus ${words}` : words;
}

export interface ParsedNumber {
  negative: boolean;
  whole: bigint;
  /** Digits after the decimal point, exactly as typed. */
  fraction: string;
}

/** Accepts 1234.56, 1,234.56, 12 34 567, -5 and .5. */
export function parseDecimal(input: string): ParsedNumber | null {
  const text = input.trim().replace(/[\s,_']/g, "").replace(/^−/, "-");
  const match = text.match(/^(-)?(\d*)(?:\.(\d*))?$/);
  if (!match || (!match[2] && !match[3])) return null;
  return { negative: Boolean(match[1]), whole: BigInt(match[2] || "0"), fraction: match[3] ?? "" };
}

const DIGIT_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

export function numberToWords(input: string, options: WordsOptions = DEFAULT_WORDS): string | null {
  const parsed = parseDecimal(input);
  if (!parsed) return null;
  try {
    let words = integerToWords(parsed.whole, options);
    if (parsed.fraction) words += ` point ${[...parsed.fraction].map((digit) => DIGIT_WORDS[Number(digit)]).join(" ")}`;
    const isZero = parsed.whole === BigInt(0) && /^0*$/.test(parsed.fraction);
    return parsed.negative && !isZero ? `minus ${words}` : words;
  } catch {
    return null;
  }
}

const ORDINAL_EXCEPTIONS: Record<string, string> = {
  one: "first", two: "second", three: "third", five: "fifth", eight: "eighth", nine: "ninth", twelve: "twelfth",
};

/** "twenty-one" → "twenty-first", "one hundred" → "one hundredth". */
export function toOrdinal(words: string): string {
  const match = words.match(/^(.*?)([a-z]+)$/);
  if (!match) return words;
  const [, head, last] = match;
  if (ORDINAL_EXCEPTIONS[last]) return head + ORDINAL_EXCEPTIONS[last];
  if (last.endsWith("y")) return `${head}${last.slice(0, -1)}ieth`;
  return `${head}${last}th`;
}

export interface CurrencyWords {
  id: string;
  label: string;
  major: [string, string];
  minor: [string, string];
  scale: Scale;
}

export const CURRENCY_WORDS: CurrencyWords[] = [
  { id: "USD", label: "US dollars", major: ["dollar", "dollars"], minor: ["cent", "cents"], scale: "international" },
  { id: "GBP", label: "Pounds sterling", major: ["pound", "pounds"], minor: ["penny", "pence"], scale: "international" },
  { id: "EUR", label: "Euros", major: ["euro", "euros"], minor: ["cent", "cents"], scale: "international" },
  { id: "INR", label: "Indian rupees", major: ["rupee", "rupees"], minor: ["paisa", "paise"], scale: "indian" },
  { id: "AUD", label: "Australian dollars", major: ["dollar", "dollars"], minor: ["cent", "cents"], scale: "international" },
  { id: "CAD", label: "Canadian dollars", major: ["dollar", "dollars"], minor: ["cent", "cents"], scale: "international" },
];

export interface AmountWords {
  /** "One thousand two hundred thirty-four dollars and fifty-six cents" */
  spoken: string;
  /** Cheque style: "One thousand two hundred thirty-four and 56/100 dollars" */
  cheque: string;
}

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Money in words, rounded half-up to two decimal places using the digits as typed. */
export function amountToWords(input: string, currency: CurrencyWords, options: WordsOptions): AmountWords | null {
  const parsed = parseDecimal(input);
  if (!parsed || parsed.negative) return null;
  let whole = parsed.whole;
  const padded = (parsed.fraction + "000").slice(0, 3);
  let minor = Number(padded.slice(0, 2));
  if (Number(padded[2]) >= 5) minor += 1;
  if (minor === 100) {
    minor = 0;
    whole += BigInt(1);
  }
  try {
    const majorWords = integerToWords(whole, options);
    const majorUnit = whole === BigInt(1) ? currency.major[0] : currency.major[1];
    const minorUnit = minor === 1 ? currency.minor[0] : currency.minor[1];
    const spoken =
      minor > 0
        ? `${majorWords} ${majorUnit} and ${integerToWords(BigInt(minor), options)} ${minorUnit}`
        : `${majorWords} ${majorUnit}`;
    const cheque = `${majorWords} and ${String(minor).padStart(2, "0")}/100 ${currency.major[1]}`;
    return { spoken: capitalise(spoken), cheque: capitalise(cheque) };
  } catch {
    return null;
  }
}
