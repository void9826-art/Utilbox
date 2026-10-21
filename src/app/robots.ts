import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The rates endpoint returns JSON, not a page, so it has nothing to
        // offer a crawler. Everything else is intentionally indexable.
        disallow: ["/api/"],
      },
    ],
    // No Host line: it was a Yandex-only directive that Google and Bing ignore.
    // The canonical host is set by the www redirect and every page's canonical.
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
