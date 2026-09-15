import type { MetadataRoute } from "next";

import { absoluteUrl, siteConfig } from "@/config/site";

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
    sitemap: absoluteUrl("/sitemap.xml"),
    // Host takes a bare hostname — a full URL with a scheme and a trailing
    // slash is not valid there, and crawlers that read the directive ignore it.
    host: new URL(siteConfig.url).host,
  };
}
