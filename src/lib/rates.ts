/**
 * Exchange rate provider abstraction.
 *
 * Rates are never hardcoded. The default provider republishes the European
 * Central Bank's daily reference rates and needs no API key; a keyed provider
 * can be swapped in through environment variables without touching the tool.
 *
 * The fetch runs on the server so no API key ever reaches the browser and the
 * response can be cached across all visitors. The currency table the UI needs
 * lives in ./currencies so the browser never imports this file.
 */

export interface RateSnapshot {
  base: string;
  /** How many units of each currency one unit of `base` buys. */
  rates: Record<string, number>;
  /** ISO date the source published these rates. */
  date: string;
  providerName: string;
  providerUrl: string;
}

export class RateProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateProviderError";
  }
}

interface RateProvider {
  id: string;
  name: string;
  url: string;
  fetchRates(base: string): Promise<RateSnapshot>;
}

/** Free, no key required. Publishes ECB reference rates each working day. */
const frankfurterProvider: RateProvider = {
  id: "frankfurter",
  name: "European Central Bank (via Frankfurter)",
  url: "https://frankfurter.dev",
  async fetchRates(base) {
    const response = await fetch(
      `https://api.frankfurter.dev/v1/latest?base=${encodeURIComponent(base)}`,
      { signal: AbortSignal.timeout(8000) },
    );

    if (!response.ok) {
      throw new RateProviderError(`The rate service responded with status ${response.status}.`);
    }

    const payload = (await response.json()) as {
      base?: string;
      date?: string;
      rates?: Record<string, number>;
    };

    if (!payload.rates || Object.keys(payload.rates).length === 0) {
      throw new RateProviderError("The rate service returned no rates.");
    }

    return {
      base: payload.base ?? base,
      // The feed omits the base currency itself; adding it keeps lookups simple.
      rates: { ...payload.rates, [payload.base ?? base]: 1 },
      date: payload.date ?? new Date().toISOString().slice(0, 10),
      providerName: frankfurterProvider.name,
      providerUrl: frankfurterProvider.url,
    };
  },
};

/**
 * Optional keyed provider, enabled by setting EXCHANGE_RATE_API_KEY.
 * Kept behind the same interface so switching is a configuration change.
 */
const openExchangeRatesProvider: RateProvider = {
  id: "openexchangerates",
  name: "Open Exchange Rates",
  url: "https://openexchangerates.org",
  async fetchRates(base) {
    const key = process.env.EXCHANGE_RATE_API_KEY;
    if (!key) throw new RateProviderError("No API key is configured for this provider.");

    const response = await fetch(
      `https://openexchangerates.org/api/latest.json?app_id=${encodeURIComponent(key)}&base=${encodeURIComponent(base)}`,
      { signal: AbortSignal.timeout(8000) },
    );

    if (!response.ok) {
      throw new RateProviderError(`The rate service responded with status ${response.status}.`);
    }

    const payload = (await response.json()) as {
      base?: string;
      timestamp?: number;
      rates?: Record<string, number>;
    };

    if (!payload.rates) throw new RateProviderError("The rate service returned no rates.");

    return {
      base: payload.base ?? base,
      rates: payload.rates,
      date: new Date((payload.timestamp ?? Date.now() / 1000) * 1000).toISOString().slice(0, 10),
      providerName: openExchangeRatesProvider.name,
      providerUrl: openExchangeRatesProvider.url,
    };
  },
};

const PROVIDERS: Record<string, RateProvider> = {
  [frankfurterProvider.id]: frankfurterProvider,
  [openExchangeRatesProvider.id]: openExchangeRatesProvider,
};

export function activeProvider(): RateProvider {
  const configured = process.env.EXCHANGE_RATE_PROVIDER;
  if (configured && PROVIDERS[configured]) return PROVIDERS[configured];
  return process.env.EXCHANGE_RATE_API_KEY ? openExchangeRatesProvider : frankfurterProvider;
}

export function fetchRates(base: string): Promise<RateSnapshot> {
  return activeProvider().fetchRates(base);
}
