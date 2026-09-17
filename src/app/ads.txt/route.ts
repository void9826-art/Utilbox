import { adsConfig } from "@/config/site";

/** Google's certification authority ID, the same for every AdSense account. */
const GOOGLE_CERTIFICATION_ID = "f08c47fec0942fa0";

/**
 * Serves /ads.txt from the configured AdSense publisher ID.
 *
 * Built from the environment rather than committed as a static file so the
 * publisher ID lives in one place: the same variable that loads the ad script.
 * Until it is set there is no ads.txt, because a file naming no seller would
 * tell ad buyers nothing.
 */
export function GET() {
  // The script tag takes "ca-pub-…"; ads.txt names the account as "pub-…".
  const publisher = adsConfig.publisherId.trim().replace(/^ca-/, "");

  if (!/^pub-\d{16}$/.test(publisher)) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(`google.com, ${publisher}, DIRECT, ${GOOGLE_CERTIFICATION_ID}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
