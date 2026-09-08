/**
 * Single source of truth for branding and deployment-specific values.
 * Everything here can be overridden with environment variables so the project
 * can be rebranded or moved to a custom domain without touching components.
 */

function env(key: string, fallback: string): string {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value.trim() : fallback;
}

const rawUrl = env(
  "NEXT_PUBLIC_SITE_URL",
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000",
);

/**
 * Resolved once so everything that mentions the brand derives from it. The
 * legal-entity fallback used to carry its own copy of the name and went stale
 * the moment the site was renamed, leaving "the operator of Utilbox" on
 * /privacy and /terms while every other surface read Utilboxes.
 */
const siteName = env("NEXT_PUBLIC_SITE_NAME", "Utilboxes");

export const siteConfig = {
  name: siteName,
  /**
   * Appended to every page title as ` | ${shortName}`, so its length is part
   * of all 87 of them. `npm run validate` reports the remaining headroom.
   */
  shortName: env("NEXT_PUBLIC_SITE_SHORT_NAME", siteName),
  url: rawUrl.replace(/\/+$/, ""),
  tagline: "Free tools for work, school, and everyday life",
  description:
    `Convert files, calculate anything, and clean up text right in your browser. ${siteName} is a set of fast, free utilities that keep your files on your device.`,
  locale: "en_US",
  themeColor: { light: "#ffffff", dark: "#171717" },

  /** Legal/contact details. Replace these before publishing. */
  legalEntity: env("NEXT_PUBLIC_LEGAL_ENTITY", `the operator of ${siteName}`),
  contactEmail: env("NEXT_PUBLIC_CONTACT_EMAIL", "hello@example.com"),
  postalAddress: env("NEXT_PUBLIC_POSTAL_ADDRESS", ""),

  /** Optional social handle used for Twitter/X card metadata. */
  twitterHandle: env("NEXT_PUBLIC_TWITTER_HANDLE", ""),
} as const;

export const adsConfig = {
  /** e.g. "ca-pub-0000000000000000". Slots stay reserved but empty until set. */
  publisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? "",
  slots: {
    leaderboard: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD ?? "",
    inContent: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT ?? "",
    footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER ?? "",
  },
  get enabled(): boolean {
    return this.publisherId.length > 0;
  },
} as const;

export const analyticsConfig = {
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
  get enabled(): boolean {
    return this.googleAnalyticsId.length > 0;
  },
} as const;

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
