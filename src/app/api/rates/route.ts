import { NextResponse } from "next/server";

import { CURRENCY_INFO } from "@/lib/currencies";
import { RateProviderError, fetchRates } from "@/lib/rates";

/**
 * Exchange rates, fetched server-side and cached.
 *
 * Running the fetch here rather than in the browser keeps any API key on the
 * server and lets one upstream request serve every visitor. The source
 * publishes once each working day, so an hour of caching is generous.
 */
export const revalidate = 3600;

export async function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get("base")?.toUpperCase() ?? "EUR";

  // Only known currency codes reach the upstream service.
  // Object.hasOwn, not `in`: `in` also matches inherited keys, so a base of
  // CONSTRUCTOR or TOSTRING would otherwise be treated as a known currency.
  const base = Object.hasOwn(CURRENCY_INFO, requested) ? requested : "EUR";

  try {
    const snapshot = await fetchRates(base);
    return NextResponse.json(snapshot, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    const message =
      error instanceof RateProviderError
        ? error.message
        : "Exchange rates are unavailable at the moment.";

    if (process.env.NODE_ENV === "development") {
      console.error("[rates]", error);
    }

    return NextResponse.json({ error: message }, { status: 503 });
  }
}
