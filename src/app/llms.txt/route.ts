import { CATEGORIES } from "@/config/categories";
import { absoluteUrl, siteConfig } from "@/config/site";
import { getToolsByCategory, newestUpdate, TOOLS, toolHref } from "@/config/tools";
import { GUIDE_TOPICS, GUIDES, guideHref } from "@/guides";

/**
 * Serves /llms.txt (https://llmstxt.org): a plain-Markdown map of the site for
 * AI assistants, built from the registry so it never lists a tool that does
 * not exist or misses one that does.
 *
 * The privacy notes come from each tool's `processing` field — the same field
 * that drives the badge on its page — so this file cannot claim a tool runs
 * locally when the page says it uses the server.
 */
export const dynamic = "force-static";

const link = (name: string, path: string, note: string) => `- [${name}](${absoluteUrl(path)}): ${note}`;

export function GET() {
  const lookups = TOOLS.filter((tool) => tool.processing === "client-with-lookup");
  const serverChecks = TOOLS.filter((tool) => tool.processing === "server-lookup");
  const names = (tools: typeof TOOLS) => tools.map((tool) => tool.name).join(", ");

  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${TOOLS.length} free browser-based tools for PDFs, images, calculations, unit conversion, text and developer data. No sign-up and no usage limits.`,
    "",
    "How the tools handle data:",
    "",
    `- ${TOOLS.length - lookups.length - serverChecks.length} of the ${TOOLS.length} tools run entirely in the browser. Files and text are processed on the visitor's device and are not uploaded.`,
    ...(lookups.length > 0
      ? [`- ${lookups.length} keep the visitor's input in the browser but download public reference data (such as exchange rates): ${names(lookups)}.`]
      : []),
    ...(serverChecks.length > 0
      ? [`- ${serverChecks.length} send only a domain name or URL — never a file — to this site's own server, which makes a network check a browser cannot, and store nothing: ${names(serverChecks)}.`]
      : []),
    `- Tool pages were last updated on ${newestUpdate(TOOLS)}. Each page shows its own date.`,
    "",
  ];

  for (const category of CATEGORIES) {
    lines.push(`## ${category.name}`, "", link(`All ${category.name}`, `/${category.id}`, category.description));
    for (const tool of getToolsByCategory(category.id)) {
      lines.push(link(tool.name, toolHref(tool), tool.description));
    }
    lines.push("");
  }

  lines.push(
    "## About",
    "",
    link("About", "/about", "Why the site exists, how the tools work and how it is paid for."),
    link("Privacy policy", "/privacy", "What is and is not collected."),
    link("Contact", "/contact", "How to reach the site."),
    "",
    // "Optional" is the llms.txt convention for links a reader can skip when
    // short on context: the guides support the tools rather than replace them.
    "## Optional",
    "",
    link("All guides", "/guides", "Plain-language guides to everyday jobs with PDFs, photos, numbers and passwords."),
  );
  for (const topic of GUIDE_TOPICS) {
    for (const guide of GUIDES.filter((candidate) => candidate.topic === topic)) {
      lines.push(link(guide.title, guideHref(guide), guide.description));
    }
  }

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
