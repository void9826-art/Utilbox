# Technical SEO + sitemap audit, https://www.utilboxes.xyz (2026-11-19)

Method: live curl/HTTP checks (about 45 requests, 1 req/s) plus read-only source inspection of src/app/sitemap.ts. About 40 URLs were sampled across hub, tool, converter, calculator, generator, guide and static sections. The repo crawler's title, description and canonical results were not re-run.

**Technical score: 84 / 100.** Crawlability, indexability and rendering are clean. Nothing technical explains Bing's 14 of 344. The likely causes are off-page or discovery-related (see F1).

## What works (verified live)
- **Redirects:** `http://utilboxes.xyz`, `http://www.`, `https://utilboxes.xyz` all give 308 to `https://www.utilboxes.xyz/`. A trailing-slash URL (`/tools/`) gives 308 to `/tools`. The canonical host is www, matching the sitemap and canonicals.
- **Status codes:** an unknown URL gives a real 404 (not a soft 404). `/PDF/pdf-redact` also gives 404, so there is no case-duplicate. `?x=1` returns 200 but the canonical stays the clean URL.
- **Indexability:** 0 of 40 sampled pages had `X-Robots-Tag`. Every sampled page has `<meta robots="index, follow, max-image-preview:large, max-snippet:-1">`. The canonical is self-referencing and equals the sitemap URL on all 40.
- **robots.txt:** `Allow: /`, `Disallow: /api/`, and a Sitemap line pointing at the www sitemap (HTTP 200).
- **Sitemap:** 410 URLs, all www and https, 410 unique. They match urls.txt and the crawler's 410 pages. The Sitemap is served as `application/xml`.
- **Server-side rendering:** all content is in the initial HTML, with no CSR dependence. Visible `<main>` word counts: hubs `/pdf` 3077, `/text` 2138, `/tools` 2870, `/guides` 9187. Tools are 620-810 words. Guides are 765-1116 words. Each page has one h1.
- **Structured data:** tools carry WebApplication, FAQPage and BreadcrumbList. Guides carry Article and BreadcrumbList. Hubs carry CollectionPage and ItemList.
- **Security headers:** HSTS (`max-age=63072000`, no includeSubDomains or preload), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, a Permissions-Policy, and CSP (frame-ancestors, object-src, base-uri only).
- **IndexNow:** the key file `/a6da860cbc0eeeb09d78c598dea90143.txt` is live (200, text/plain) and its content matches the key.
- **Other files:** `/llms.txt` and `/ads.txt` both return 200.
- **Sitemap lastmod:** the dates are not build time. sitemap.ts uses per-tool `toolUpdated()` and per-guide `guide.updated`. The live dates range from 2026-09-27 to 2026-10-21 in 8 distinct values, which fits real content dates. Guide JSON-LD `dateModified` is fed from the same field.

## Findings

### F1 (High, explanatory, off-page): Bing's low indexing is not a technical block
- **Evidence:** no noindex, no X-Robots-Tag, no redirect chains, no duplicate canonicals, no soft 404s, no render dependence, and the sitemap is reachable and consistent.
- **Likely causes:**
  1. A young domain on the `.xyz` TLD with no external backlinks, so Bing's crawl budget is tiny.
  2. About 154 near-identical tool templates. Each page is about 120-180 KB of HTML but only about 600-800 words of unique text, so Bing may treat them as templated/low-value and defer them.
  3. Heavy AdSense on every page, in a utility niche that Bing treats cautiously.
  4. No evidence that IndexNow is ever submitted. The key file exists, but I found no submission script in my checks, though I did not search the repo exhaustively (see Not checked).
- **Fix:** do the following.
  1. Verify the site in Bing Webmaster Tools and submit the sitemap there.
  2. Add a post-deploy IndexNow ping (`https://api.indexnow.org/indexnow` with the host, key, keyLocation and URL list), covering the sitemap URLs changed in that deploy.
  3. Earn a few real backlinks.
  4. Prioritise unique value on tool pages.

### F2 (Medium): Sitemap changefreq and priority are noise
- **Evidence:** 396 of 410 URLs have `monthly`. All 242 guides share priority 0.6 and all tools sit at 0.7 or 0.8. Neither Google nor Bing uses these fields.
- **Fix:** drop `changeFrequency` and `priority` in `src/app/sitemap.ts`, and keep only truthful `lastModified`. This is cosmetic, not blocking.

### F3 (Medium): Sitemap lastmod looks stale and clustered
- **Evidence:** the newest lastmod is 2026-10-21, 29 days before this audit. 113 URLs share 2026-10-19 and 96 share 2026-10-20, which looks like bulk edits. Date-only values are emitted as `T00:00:00.000Z`.
- **Risk:** crawlers learn to distrust lastmod if it is bumped for non-substantive edits. I could not confirm this for individual pages.
- **Fix:** bump `updated` only when the visible content changes materially.

### F4 (Low): Guide and tool overlap (duplicate intent)
- **Evidence:** `/pdf/pdf-redact` (title "Redact PDF Online - Really Remove the Text") and `/guides/how-to-redact-a-pdf` (title "How to Redact a PDF Properly") target the same topic. The tool page links to the guide. This pattern is likely repeated for many of the 240 guides.
- **Mitigation already present:** the intents differ (tool vs how-to), and each page has its own self-canonical, so this is a deliberate pairing and not true duplication.
- **Fix:** keep the cross-links. Make sure the guide targets "how to..." queries and the tool targets "... online/free". Watch Search Console for cannibalisation on the head terms.

### F5 (Low): Redirect from HTTP on apex is 2 hops
- **Evidence:** `http://utilboxes.xyz/` gives 308 to `https://utilboxes.xyz/`, then 308 to `https://www.utilboxes.xyz/`.
- **Fix:** in the Vercel domain settings, redirect the apex straight to https://www. This is a minor optimisation.

### F6 (Low): HSTS lacks includeSubDomains and preload
- **Evidence:** the header is `Strict-Transport-Security: max-age=63072000`.
- **Fix:** add `includeSubDomains; preload` in next.config headers, only if all subdomains are HTTPS.

### F7 (Low): CSP only covers framing
- **Evidence:** the CSP is `frame-ancestors 'self'; object-src 'none'; base-uri 'self'`. There is no script-src.
- **Fix:** consider a report-only full CSP. AdSense makes this fiddly, so treat it as optional.

### F8 (Low): HTML caching is revalidate-only
- **Evidence:** `Cache-Control: public, max-age=0, must-revalidate`, with Vercel edge `X-Vercel-Cache: HIT` and Age of up to 21 days (static prerender). This is normal for Next on Vercel and the content is fresh on revalidation. Revalidation costs one conditional request per crawl.
- **Fix:** none required.

### F9 (Info): No hreflang
- **Evidence:** 0 hreflang tags on 40 pages. The site is a single-language product, so none is needed. Do not add hreflang unless a localised version is shipped.

### F10 (Info): Minor count mismatch
- **Evidence:** 241 URLs live under /guides, which is the hub plus 240 guides. The brief says 242 guides. The sitemap priority-0.6 count is 242, which includes the hub. Check that the intended count is correct.

### F11 (Info): Pagination
- **Evidence:** none. The hubs are single pages (`/tools` has 323 links and `/guides` 242). No rel=next/prev is needed. `/tools` and `/guides` are large link hubs, which is good for discovery.

## Not checked
- All 410 pages individually (about 40 sampled).
- Core Web Vitals (no field data).
- Bing Webmaster Tools data.
- Whether an IndexNow submission step exists in the repo or CI (a repo-wide grep timed out, so I did not confirm either way).
- `/_next/static` cache headers.
- The service worker `public/sw.js` effects.
- True per-page content change dates behind lastmod.
