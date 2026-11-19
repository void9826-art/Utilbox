# Content Quality + On-Page: utilboxes.xyz (2026-11-19)

**Content Quality: 80/100 · On-Page: 88/100 · AI citation readiness: 84/100**

## Method

- **Sample (36 URLs):** home, /tools, /guides, /about, /contact, the 7 category hubs, 14 tool pages (2 per category) and 11 guides (3 of them why-*).
- **Fetching:** raw server HTML via curl at about 1 req/s. One Playwright render (/text/character-counter, `sandbox: true`) to compare raw against rendered.
- **Metrics:** metadata was checked with `metadata_template.py`, body overlap with 5-word shingles, readability with Flesch / FKGL.
- **Source:** read-only, to confirm causes. No repo files were edited.

## E-E-A-T (brand level; this skill's internal weights, not Google's)

| Factor | Score | Basis |
|---|---|---|
| Experience (20%) | 60 | Worked examples are hypothetical ("would bring it to somewhere between about 4 and 15 MB"). There are no measured outputs, before/after files or screenshots. |
| Expertise (25%) | 85 | The writing is technically precise: GSM-7 vs UCS-2, UTF-16 code units, UUIDv7 index locality, IEC vs SI prefixes, and percentage points vs percent. |
| Authoritativeness (25%) | 58 | It is a new brand with Organization-only authorship and **zero outbound citations across all 11 sampled guides**. |
| Trustworthiness (30%) | 90 | Data handling is disclosed per tool (149 in-browser / 2 lookup / 3 server, also in llms.txt), and the claims match the code. The About page has "How it is paid for", there is a contact page with an email address, and there are Privacy, Terms and Cookies pages. Dates are honest: "Updated" shows only when it differs from the published date. |
| **Weighted** | **75** | |

## What works (keep)

- **Metadata:** `site_risk: low`. 0 of 36 pairs are templated and there are no shared CTA phrases. Every title and description is unique and specific to the page's intent.
- **Bodies are not templated.** The highest 5-shingle Jaccard between any two sampled pages is 0.12 (crop-image vs resize-image), and most pairs are below 0.06. Guide H2s are topic-specific ("Mistake 2: expecting a rise and a fall to cancel out"), not one skeleton reused. Slug overlap across all 241 guides shows no cannibalising pairs: the only exact token match is pdf-to-word vs word-to-pdf, which are opposite intents.
- **The server HTML matches what users see.**
  - FAQ answers are inside SSR `<details>`.
  - Hub and homepage counters (154 / 7 / 149, "All 31 PDF Tools") render in SSR.
  - On hub pages and /tools, the Suspense fallback is the full static tool list: the BAILOUT boundary still ships 154 links.
  - Tool UIs stream as `<div hidden id="S:0">` inside the same response, with a `$RC` swap.
  - Raw vs rendered difference is 3% of words, which is not significant.
  - The "0" counters on tool widgets are correct empty-input state, not a hydration gap.
- **Readability:** FKGL is 7.3 to 10.0 and FRE is 53 to 71 across tools and guides. That is right for a general audience.
- **Size:** tool pages have 560 to 890 body words, hubs have a "Choosing the right X tool" section, and the homepage has about 1,200 words. No thin pages in the sample.
- **Internal linking from tools to guides:** tool pages carry a "Guides" block, and guides carry "Tools used in this guide". All 241 guides are reachable from /guides and from hubs (36 to 65 guide links per hub).
- **Ad layout:** the in-content slot sits behind a rule and spacing below the tool controls (to avoid mis-clicks). There are no ads beside action buttons, and the layout reserves height so the page does not shift. Ads do not crowd content in SSR.
- **Schema:** WebApplication with Offer price 0, FAQPage, BreadcrumbList, Article (datePublished/dateModified, publisher) and CollectionPage/ItemList on hubs. There is no fake aggregateRating.
- **llms.txt** (90 KB) gives an honest processing breakdown. The tool intros are already answer-first; do not redo them.

## Findings

### F1. Guide publishing velocity looks like scaled content (High)

- **Evidence:** the guide date constants in src/guides put 239 of 241 guides on 5 days: 2026-09-27 (19), 10-01 (40), 10-02 (40), **10-03 (100)** and 10-20 (40). There is brand-only authorship, and the "worked examples" are hypothetical. Google's scaled-content policy looks at mass production aimed at rankings, whatever the method. Quality here is decent, but the pattern is what a classifier or a rater sees first.
- **Fix:**
  - Do not backdate or spread the dates; that would be a trust violation. Pause bulk guide production.
  - For the next 90 days, add depth to existing guides rather than adding more of them (F2, F3).
  - After about 90 days of GSC data, consolidate or noindex guides with zero impressions that overlap a stronger page.

### F2. No first-hand evidence in guides (Medium-High, Experience)

- **Evidence:** how-to-reduce-pdf-file-size: "a 60–90% reduction would bring it to somewhere between about 4 and 15 MB". The other sampled guides follow the same pattern, with illustrative numbers rather than measured ones.
- **Fix:** run the site's own tool on a real test file and publish the measured result. For example: "38.2 MB scan → Balanced 6.1 MB, Strong 2.9 MB, small print legible at Balanced". Add one screenshot of the tool output, and a short "How we checked this" line per guide (brand voice, no personal names). Start with the 20 guides that get the most impressions.

### F3. Zero outbound citations (Medium, Authoritativeness)

- **Evidence:** 0 external links in the main content of all 11 sampled guides.
- **Fix:** cite primary standards where the guide rests on them:
  - IEC 80000-13 / NIST for binary prefixes (why-1tb)
  - RFC 9562 (uuid-vs-auto-increment)
  - 3GPP TS 23.038 (SMS limits)
  - MDN / CSS Cascade spec (why-css)
  - ISO 32000 (PDF rotation)
  - the Unicode TR for invisible characters

  One to three citations per guide, placed in the body.

### F4. Guides do not link to other guides (Medium, internal linking)

- **Evidence:** 8 of the 11 sampled guides have 0 links to other `/guides/*` pages. app/guides/[slug]/page.tsx renders only "Tools used in this guide" (getRelatedTools). Clusters such as the PDF-printing guides (booklet, black-and-white, page numbers, bookmarks, header/footer) and the QR guides (wifi, restaurant menu, Google reviews) do not reference each other.
- **Fix:** add a "Related guides" block of 3 to 4 guides. Use guides that share a tool, falling back to the same source file or cluster, and reuse the existing related-tools data.

### F5. Manual AdSense slots render nothing in production (Medium, monetisation)

- **Evidence:** the publisher id ca-pub-1777192808831363 and a preload of adsbygoogle.js are present. However, no `<ins class="adsbygoogle">` appears in any of the 36 SSR pages. `AdSlot` returns null when the `NEXT_PUBLIC_ADSENSE_SLOT_*` env vars are empty, so the placements carefully designed in page.tsx are off. Guide pages have no `AdSlot` at all.
- **Fix:**
  - If you want manual units, set the three slot env vars in Vercel and redeploy.
  - If Auto ads are on in the AdSense dashboard, exclude the tool widget area, and cap ad density on guides there.
  - Not verified: Auto ads behaviour after consent. It needs a consented browser session.

### F6. /about title repeats the brand (Low-Medium)

- **Evidence:** `<title>About Utilboxes | Utilboxes</title>`. app/about/page.tsx sets `About ${siteConfig.name}`, and the layout template appends `| Utilboxes`. `metadata_template.py` also flags the description for `brand_suffix_in_description` (low; the wording is natural).
- **Fix:** set the title to "About" so the template appends the brand once. Alternatively, use `title: { absolute: "About Utilboxes: free, private browser tools" }`.

### F7. Mortgage calculator ships 263 KB of hidden streamed markup (Low-Medium)

- **Evidence:** the page HTML is 397 KB, against 125 to 160 KB for other tools. The `S:0` hidden block is 263 KB: the default 360-row amortisation table rendered on the server. Non-JS AI crawlers get a large table of default-input numbers, and the explanatory content is diluted.
- **Fix:** render the schedule client-side or collapsed, or show the first 12 rows plus yearly totals in SSR.

### F8. Footer headings are H2s on every page (Low)

- **Evidence:** "Tools / Popular / Resources / Legal" are the last 4 H2s on every page, and the homepage has 16 H2s.
- **Fix:** change them to `<p>` or `<h3>` styled as headings, so each page's outline contains only its own content.

### F9. Some titles exceed about 60 characters (Low)

- **Evidence:** character-counter is 65 characters, age/css/json are 64, and crop-image plus the image and converters hubs are 63. The ` | Utilboxes` suffix is what gets truncated, so this is harmless but untidy.
- **Fix:** optional. Shorten the subtitle phrase on titles over 62 characters.

### F10. The extractor picks the widget over the explanation (Low, AI citation)

- **Evidence:** trafilatura's `extracted_text` for character-counter is 2.4 K characters, mostly widget labels and "0" values. The how-it-works, worked-example and FAQ sections are present in the HTML but sit partly outside the extracted block.
- **Fix:** wrap the explanatory sections in an `<article>` element separate from the tool widget, and mark the widget `role="application"`. The FAQ and quick-reference content is already well structured for quoting.

### Info: guide length

Guides run 540 to 1,065 words, below this skill's 1,500-word blog floor. They are single-intent how-tos that cover their topic fully. **Do not pad them**: add evidence (F2) and citations (F3) instead.

## Structured findings (audit-data.json, Content Quality)

```json
[
 {"id":"CQ-1","severity":"high","title":"Guide publication velocity: 100 guides on one day, 239 of 241 on 5 days","fix":"Pause bulk guides; deepen existing ones; prune zero-impression overlaps after 90 days"},
 {"id":"CQ-2","severity":"medium-high","title":"Guide examples are hypothetical, no measured first-hand results","fix":"Publish measured tool runs + screenshot + 'How we checked this'"},
 {"id":"CQ-3","severity":"medium","title":"0 outbound citations in 11/11 sampled guides","fix":"Cite primary standards (IEC, RFC 9562, 3GPP, ISO 32000, MDN)"},
 {"id":"CQ-4","severity":"medium","title":"Guides have no related-guide links","fix":"Add a 3-4 item Related guides block"},
 {"id":"CQ-5","severity":"medium","title":"AdSense manual slots inactive in prod (slot env vars empty); guides have no AdSlot","fix":"Set NEXT_PUBLIC_ADSENSE_SLOT_*; configure Auto ads exclusions"},
 {"id":"CQ-6","severity":"low-medium","title":"/about title 'About Utilboxes | Utilboxes'","fix":"title 'About' or absolute title"},
 {"id":"CQ-7","severity":"low-medium","title":"Mortgage calculator 263 KB hidden SSR amortisation table","fix":"Client-render or truncate schedule in SSR"},
 {"id":"CQ-8","severity":"low","title":"Footer headings are H2 on every page","fix":"Demote to p/h3"},
 {"id":"CQ-9","severity":"low","title":"Titles 63-65 chars on several tools/hubs","fix":"Optional trim"},
 {"id":"CQ-10","severity":"low","title":"Main-content extraction dominated by tool widget","fix":"Separate <article> for explanatory content"}
]
```
