/**
 * Currency metadata, shared by the server route that fetches rates and by the
 * converter that runs in the browser.
 *
 * It lives apart from `rates.ts` on purpose: that module reads
 * EXCHANGE_RATE_API_KEY, and importing it from a client component would pull
 * the provider code into the browser bundle for the sake of a lookup table.
 */

/** Currencies the ECB feed covers, with the metadata the UI needs. */
export const CURRENCY_INFO: Record<string, { name: string; symbol: string }> = {
  AUD: { name: "Australian Dollar", symbol: "A$" },
  BGN: { name: "Bulgarian Lev", symbol: "лв" },
  BRL: { name: "Brazilian Real", symbol: "R$" },
  CAD: { name: "Canadian Dollar", symbol: "C$" },
  CHF: { name: "Swiss Franc", symbol: "CHF" },
  CNY: { name: "Chinese Yuan", symbol: "¥" },
  CZK: { name: "Czech Koruna", symbol: "Kč" },
  DKK: { name: "Danish Krone", symbol: "kr" },
  EUR: { name: "Euro", symbol: "€" },
  GBP: { name: "Pound Sterling", symbol: "£" },
  HKD: { name: "Hong Kong Dollar", symbol: "HK$" },
  HUF: { name: "Hungarian Forint", symbol: "Ft" },
  IDR: { name: "Indonesian Rupiah", symbol: "Rp" },
  ILS: { name: "Israeli Shekel", symbol: "₪" },
  INR: { name: "Indian Rupee", symbol: "₹" },
  ISK: { name: "Icelandic Króna", symbol: "kr" },
  JPY: { name: "Japanese Yen", symbol: "¥" },
  KRW: { name: "South Korean Won", symbol: "₩" },
  MXN: { name: "Mexican Peso", symbol: "MX$" },
  MYR: { name: "Malaysian Ringgit", symbol: "RM" },
  NOK: { name: "Norwegian Krone", symbol: "kr" },
  NZD: { name: "New Zealand Dollar", symbol: "NZ$" },
  PHP: { name: "Philippine Peso", symbol: "₱" },
  PLN: { name: "Polish Złoty", symbol: "zł" },
  RON: { name: "Romanian Leu", symbol: "lei" },
  SEK: { name: "Swedish Krona", symbol: "kr" },
  SGD: { name: "Singapore Dollar", symbol: "S$" },
  THB: { name: "Thai Baht", symbol: "฿" },
  TRY: { name: "Turkish Lira", symbol: "₺" },
  USD: { name: "US Dollar", symbol: "$" },
  ZAR: { name: "South African Rand", symbol: "R" },
};

export function currencyLabel(code: string): string {
  const info = CURRENCY_INFO[code];
  return info ? `${code} — ${info.name}` : code;
}
