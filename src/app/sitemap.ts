import type { MetadataRoute } from "next";

import { CATEGORIES } from "@/config/categories";
import { absoluteUrl } from "@/config/site";
import { TOOLS, toolHref } from "@/config/tools";

/**
 * Generated from the registry, so a new tool appears here automatically —
 * there is no list of URLs to keep in step by hand.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const newestTool = TOOLS.reduce(
    (latest, tool) => (tool.addedOn > latest ? tool.addedOn : latest),
    TOOLS[0]?.addedOn ?? "2026-09-05",
  );
  const lastModified = new Date(`${newestTool}T00:00:00Z`);

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/tools"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/about"), lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/contact"), lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy"), lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/cookies"), lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: absoluteUrl(`/${category.id}`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const toolPages: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: absoluteUrl(toolHref(tool)),
    lastModified: new Date(`${tool.addedOn}T00:00:00Z`),
    changeFrequency: "monthly",
    // Popular tools are the ones worth crawling first.
    priority: tool.popular ? 0.8 : 0.7,
  }));

  return [...staticPages, ...categoryPages, ...toolPages];
}
