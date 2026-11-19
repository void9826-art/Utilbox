# Utilboxes SEO audit, 19 November 2026

Audited: https://www.utilboxes.xyz at a212c16 (`origin/main`). DNS is correct: apex A 216.198.79.1, www CNAME to Vercel, and the google-site-verification TXT is present.
Tool: the claude-seo plugin v2.6.2, with seven specialist passes: technical and sitemap, content, schema, performance, visual, GEO and agentic, and SXO. The evidence is in `findings/*.md`. The repo's own `scripts/audit-seo.mjs` was clean on all 410 pages and 410 link targets before the audit started.

## Executive summary

**SEO Health Score: 80 / 100** for the live site, before this branch.

| Category | Weight | Score |
|---|---|---|
| Technical SEO | 22% | 84 |
| Content quality | 23% | 80 |
| On-page SEO | 20% | 88 |
| Schema | 10% | 78 |
| Performance (lab) | 10% | 90 |
| AI search readiness | 10% | 57 |
| Images | 5% | 60 (none in content, one og:image for the whole site) |

**Other scores:**
- **SXO gap score:** 63. SXO means search experience: does the page type match what the search results reward.
- **Visual / mobile:** 78.
- **Lab mobile LCP:** 1.1–1.3 s on tool, hub and guide pages.

**Not measured:** Bing and Google index coverage (Webmaster Tools and Search Console were not available to this audit), field Core Web Vitals, and live AI-answer mentions.

## Fixed in branch `seo/claude-seo-audit-2026-11-19`

| Change | File |
|---|---|
| WebApplication and Article reference the Organization by `@id`; before, each tool and guide carried a second, id-less organisation copy | `src/lib/seo.ts` |
| WebApplication gets `@id` and `mainEntityOfPage`; its `name` is the tool's own name, not "Tool — Utilboxes" | `src/lib/seo.ts` |
| WebSite gets an `@id`; Organization and WebSite ids use the canonical `/#…` form | `src/lib/seo.ts` |
| Sitemap: `changefreq` and `priority` removed (Google and Bing both ignore them) | `src/app/sitemap.ts` |
| Phone tool header: the intro runs full width under the title instead of 9 lines beside the icon (desktop unchanged) | `src/components/tool/sections.tsx` |
| Phone cookie banner: about 240 px down to about 160 px; the Merge PDF drop zone is no longer covered on a first visit. The wording is unchanged, and the label is no longer an `<h2>` in every page outline | `src/components/layout/cookie-consent.tsx` |
| Guides link to up to 4 related guides (shared tools first, then the same topic); before, 8 of 11 sampled guides linked to no other guide | `src/app/guides/[slug]/page.tsx` |
| `llms.txt`: guides moved out of `## Optional` (the section AI tools may skip) into `## Guides`; the tool-date line no longer implies every page changed on the newest date | `src/app/llms.txt/route.ts` |
| /about title was "About Utilboxes \| Utilboxes" | `src/app/about/page.tsx` |

## Checked and fine (no change)

- **FAQ answers.** Native `<details>`, so all of them are in the server HTML (10/10 on Merge PDF, 9/9 on EMI).
- **Server-sent vs rendered.** Counters render without JavaScript, and the raw HTML differs from the rendered page by about 3%.
- **No templated metadata.** Body copy overlap between pages is 12% at most.
- **IndexNow.** It runs: `.github/workflows/indexnow.yml` fires on every successful Vercel deployment. The technical pass missed this.
- **Indexing signals.** Canonicals, redirects, 404s, robots, hreflang (none needed) and security headers are clean.
- **No HowTo markup.** It was already removed, with a reason in the code.

## Action plan: what is left

### High
1. **Owner: Bing Webmaster Tools.** Bing had 14 of 344 indexed in October, and ChatGPT search relies on Bing. Nothing on-site blocks Bing, so the "Crawled / Discovered – not indexed" report is the only way to know why. After this deploy, a one-time `node scripts/indexnow.mjs` full submission covers pages that have not changed since launch; the workflow only sends changed pages.
2. **Product: Compress PDF turns every page into an image** (the page says text stops being selectable). Adobe, Smallpdf and PDF2Go keep the text. It also takes a single file only. This is the biggest quality gap against the results for "compress pdf".
3. **Owner decision: AdSense loads before consent on every page,** about 222 KB, over half of all JS bytes (`src/app/layout.tsx`, `afterInteractive`). Only GA waits for consent. For EEA and UK visitors Google requires a certified CMP. Choose: a certified CMP, or limit ads to after consent.
4. **Owner: no manual ad units render in production.** `NEXT_PUBLIC_ADSENSE_SLOT_*` is empty, so the ad slots render nothing, and guide pages have no slots at all. Check whether this is intended (Auto ads only) before assuming revenue is configured.

### Medium
5. **Content: guides were published in bulk.** 239 of 241 are dated to 5 days (100 on 3 October), the pattern scaled-content checks look for. Pause new guides, and deepen the existing ones with measured runs of the site's own tools, screenshots and citations to the standards they rely on (IEC prefixes, RFC 9562, 3GPP SMS, ISO 32000). Do not change the dates.
6. **Entity:** four different one-line descriptions (home meta, schema, llms.txt, Product Hunt, which still says "129 tools"). Pick one, and add `sameAs` once profiles exist (`siteConfig.socialProfiles`).
7. **SXO:**
   - Add a "compress image to 100 KB" landing state. The tool already supports a target size, but those results are exact-size pages.
   - Give the EMI calculator ₹/lakh formatting and a schedule export.
   - Review the overlap between compress-pdf and two or three PDF-size guides, and between json-formatter and json-validator.
8. **Tap targets:** header buttons are 36 px, breadcrumbs 20 px tall, and calculator inputs 38 px. Raise them to 44 px.
9. **No images in content,** and one og:image for the whole site. Add tool screenshots and per-page share images.

### Low
10. Mortgage calculator: the HTML is 397 KB, 263 KB of it a hidden 360-row amortisation table. Render it on demand.
11. The pdf.js worker is warmed with no user interaction. Skip that on Save-Data or slow connections.
12. HSTS has no `includeSubDomains` or `preload`. Several titles run 63–65 characters. Footer headings are `<h2>`s.
13. Add a `Content-Signal` line to robots.txt once a training policy is chosen.

## Unverified (check before acting)

- The SXO pass's search tool was not Google, so no ranking positions are claimed.
- "Utilboxes did not appear for any of the 8 queries" says nothing reliable about Google.
- Competitor features came from search snippets only.
