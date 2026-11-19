# Structured data audit - utilboxes.xyz (2026-11-19)

Score: 78/100. Valid, consistent, no deprecated types. Gaps: entity linking, sameAs, thin page-level typing.

Method: live fetch of 16 URLs (home, /tools, /pdf, /calculators, 6 tools, 4 guides, /about, /contact), all JSON-LD parsed. No Microdata/RDFa. All blocks valid JSON, @context https://schema.org.
Generators: src/lib/seo.ts (all types), src/app/layout.tsx (Organization + WebSite on every page), src/app/[category]/[slug]/page.tsx (tool), src/app/guides/[slug]/page.tsx (Article), src/app/tools/page.tsx and src/app/[category]/page.tsx (hubs), src/app/guides/page.tsx (breadcrumb only). src/lib/schema-markup.ts is the user-facing FAQ/Product generator tool, not site markup.

## Detected per page
- Every page: WebSite + Organization (layout). Organization @id = https://www.utilboxes.xyz#organization; WebSite.publisher references it. PASS: Organization is on every page, not only home.
- /tools, category hubs: + BreadcrumbList + CollectionPage/ItemList. PASS.
- Tools: + BreadcrumbList (4 levels) + WebApplication + FAQPage. WebApplication has applicationCategory UtilitiesApplication, operatingSystem Any, offers price 0 USD, dates, isAccessibleForFree. PASS.
- Guides: + BreadcrumbList + Article (headline, dates, image, author Organization, publisher @id). PASS.
- /about, /contact: only the site-wide WebSite + Organization. No page type, no breadcrumb.
- HowTo: none found (good, even though guides are "how to" titled).

## Findings
1. MEDIUM - Entities are not linked by @id. WebApplication.publisher and Article.author are inline Organization copies (seo.ts:102, :187) with no @id, so Google sees extra unnamed organisation nodes. WebSite has no @id. Fix: use {"@id": ORGANISATION_ID} for both; add WebSite @id.
2. MEDIUM - Organization has no sameAs at all (omitted, not empty; seo.ts:210, siteConfig.socialProfiles is empty). Weak brand-disambiguation signal, which the code comment itself says matters (look-alike tool sites). Fix: add real profiles when they exist. Do not add placeholders.
3. LOW - @id "https://www.utilboxes.xyz#organization" lacks the slash. Valid but non-canonical; prefer https://www.utilboxes.xyz/#organization. Change the constant once; all references follow.
4. LOW - Tool WebApplication lacks @id, image/screenshot, and mainEntityOfPage. Tool name is "X - Utilboxes" in the name property; Google prefers the plain tool name. No fake aggregateRating (correct, keep it that way).
5. LOW - Article.author is an Organization. Valid; Google accepts it. A named Person would give stronger E-E-A-T but only if true.
6. LOW - Guide BreadcrumbList last item uses the full H1 (e.g. "How to redact a PDF properly - and why black boxes don't work"). Shorten the crumb label. Also the redact guide has dateModified = datePublished, fine; just confirm updates bump it.
7. LOW - Article image is /opengraph-image shared by all guides; use a per-guide image at 1200 px wide if available.
8. INFO - FAQPage on every tool page. No Google rich result any more; no harm, keep or drop at will. Do not expect SERP benefit. AI/GEO benefit unconfirmed.
9. INFO - /about and /contact have no typed WebPage; /guides has breadcrumb only (per code) with no CollectionPage. /tools and category hubs already have CollectionPage, so those are covered.
10. INFO - No Product/aggregateRating/Review markup is present, so no spam risk.

## Ready-to-use JSON-LD

Fix 1 and 3, in seo.ts (shape of output):
```json
{"@context":"https://schema.org","@type":"WebSite","@id":"https://www.utilboxes.xyz/#website","name":"Utilboxes","url":"https://www.utilboxes.xyz","publisher":{"@id":"https://www.utilboxes.xyz/#organization"}}
```
WebApplication: replace publisher with {"@id":"https://www.utilboxes.xyz/#organization"}, add "@id":"<tool url>#webapp", "mainEntityOfPage":"<tool url>". Article: replace author with {"@id":"https://www.utilboxes.xyz/#organization"}.

About page (add to src/app/about/page.tsx):
```json
{"@context":"https://schema.org","@type":"AboutPage","@id":"https://www.utilboxes.xyz/about#webpage","url":"https://www.utilboxes.xyz/about","name":"About Utilboxes","isPartOf":{"@id":"https://www.utilboxes.xyz/#website"},"about":{"@id":"https://www.utilboxes.xyz/#organization"}}
```
Contact page:
```json
{"@context":"https://schema.org","@type":"ContactPage","@id":"https://www.utilboxes.xyz/contact#webpage","url":"https://www.utilboxes.xyz/contact","name":"Contact Utilboxes","isPartOf":{"@id":"https://www.utilboxes.xyz/#website"}}
```
Guides index: reuse collectionSchema() from seo.ts with a guides ItemList (CollectionPage).

Priority order: 1, 3 (one constant), 2 (when profiles exist), 9, 6.
