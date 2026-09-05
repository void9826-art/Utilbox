import { analyticsConfig } from "@/config/site";

/**
 * A deliberately narrow analytics surface.
 *
 * Only tool identifiers and coarse outcomes are ever recorded. File names, file
 * contents, extracted text, calculator inputs and anything else the visitor
 * typed or uploaded must never be passed to these functions.
 */

type Primitive = string | number | boolean;

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type AnalyticsEvent =
  | { name: "tool_view"; toolSlug: string; category: string }
  | { name: "tool_run"; toolSlug: string; outcome: "success" | "error" }
  | { name: "tool_download"; toolSlug: string; format: string }
  | { name: "search_used"; resultCount: number };

function toParams(event: AnalyticsEvent): Record<string, Primitive> {
  const { name, ...rest } = event;
  void name;
  return rest as Record<string, Primitive>;
}

export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;

  if (process.env.NODE_ENV === "development") {
    // Useful while building; never ships to production consoles.
    console.debug("[analytics]", event.name, toParams(event));
    return;
  }

  if (!analyticsConfig.enabled || typeof window.gtag !== "function") return;
  window.gtag("event", event.name, toParams(event));
}
