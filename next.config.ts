import type { NextConfig } from "next";

/**
 * Response headers applied to every route.
 *
 * The Content-Security-Policy here is deliberately narrow. A full script-src
 * allowlist cannot be written without breaking AdSense, which injects scripts
 * and iframes from a set of Google domains that changes over time — a policy
 * that silently kills the ads is worse than no policy. What is included are the
 * three directives that block real attacks and cannot break a third party:
 *
 *   frame-ancestors  stops the site being framed for clickjacking
 *   object-src       there are no plugins, so nothing legitimate is lost
 *   base-uri         an injected <base> would repoint every relative URL
 *
 * Everything else is a header with a single correct value.
 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'",
  },
  // Stop the browser second-guessing a declared Content-Type. Without it a
  // .txt a visitor produced could be sniffed as HTML and run.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send the origin, not the full path, when leaving the site: tool URLs are
  // not secret, but there is no reason to hand them to an ad network either.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Belt and braces alongside frame-ancestors, for older browsers.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // No tool here needs any of these, and denying them means an injected script
  // cannot ask for them either.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
