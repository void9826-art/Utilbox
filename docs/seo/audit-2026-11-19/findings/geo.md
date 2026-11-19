# GEO / AI search readiness: utilboxes.xyz (2026-11-19)

Scope: live site https://www.utilboxes.xyz. I fetched robots.txt, llms.txt and 20 discovery paths, sent one tool page to 10 user agents, and rendered 10 pages (6 tools, 4 guides) with render_page.py `--mode never`, which gives raw HTML plus trafilatura text. Off-site checks were partly blocked, see section 7. I did not edit the repo.

## GEO Readiness Score: 57 / 100

| Dimension | Weight | Score | Weighted | Main reason |
|---|---|---|---|---|
| Citability | 25% | 68 | 17.0 | Direct answers open each tool page. No sources cited, generic section headings |
| Structural readability | 20% | 75 | 15.0 | Clean H1/H2, lists, FAQPage, breadcrumbs. Same template headings on every tool page |
| Multi-modal | 15% | 20 | 3.0 | No `<img>` on any sampled page. One og:image shared by the whole site |
| Authority & brand | 20% | 30 | 6.0 | No `sameAs`, author is the Organization only, almost no off-site footprint |
| Technical accessibility | 20% | 82 | 16.4 | Prerendered pages, every bot allowed, good llms.txt, IndexNow. Bing coverage is weak |

Platform estimates (my judgement, not measured): Google AI Overviews 50, ChatGPT Search 30, Perplexity 40, Bing Copilot 30. ChatGPT Search and Copilot both depend on Bing's index, and Bing had 14 of 344 pages indexed in October.

## 1. AI crawler access: PASS

Live robots.txt is just `User-Agent: * / Allow: / / Disallow: /api/` plus the sitemap line, so every crawler is allowed.

Test: GET /pdf/merge-pdf with 10 user agents, 1 request per second. Every one got HTTP 200, 138,862 bytes and the same md5 (`f6c18739`). The page was served from cache (`X-Vercel-Cache: HIT`, `X-Nextjs-Prerender: 1`). `is_spa=false`, so the full content is in the raw HTML.

| Bot | What it governs | Status |
|---|---|---|
| OAI-SearchBot | ChatGPT Search citations | Allowed, identical HTML |
| ChatGPT-User | User-triggered fetches | Allowed, identical HTML |
| GPTBot | OpenAI training only | Allowed, identical HTML |
| Claude-SearchBot | Claude search citations | Allowed, identical HTML |
| ClaudeBot | Anthropic training only | Allowed, identical HTML |
| PerplexityBot | Perplexity index | Allowed, identical HTML |
| Bingbot | Bing, which feeds Copilot and ChatGPT Search | Allowed, identical HTML |
| Googlebot | Google Search and AI Overviews | Allowed, identical HTML |
| CCBot | Common Crawl, used for training | Allowed, identical HTML |
| Google-Extended / Applebot-Extended / cohere-ai | Training (plus Gemini grounding for Google-Extended) | Allowed by `*`. Not fetched because they are tokens, not separate fetchers |

There is no WAF or UA-based blocking. Training bots are allowed too; that is a policy choice, not a defect.

## 2. llms.txt: PRESENT, well formed, counts accurate

- `/llms.txt`: 200, text/plain, 90,022 bytes. It has the H1, a blockquote summary and 9 H2 sections.
- **Coverage:** it links 406 of the 410 sitemap URLs. The only ones missing are `/`, `/tools`, `/terms` and `/cookies`, which is fine.
  - Tools: PDF 31, Calculators 31, Image 31, Converters 16, Generators 14, Text 14, Developer 22. That adds up to 154 and matches the sitemap.
  - Guides: all 241, plus the /guides hub.
- **Counts:** "154 tools", and the split 149 local + 2 that download reference data + 3 networked = 154, are consistent. The 3 networked and 2 reference-data tools are named.
- Missing: `/llms-full.txt` (404) and `/.well-known/llms.txt` (404).

| Sev | Finding | Fix |
|---|---|---|
| Medium | All 241 guides sit under `## Optional`. The llms.txt spec says consumers may skip that section when context is short, yet the guides are the most citable long-form pages. | Rename it to `## Guides`, ideally split by topic (PDF / Image / Numbers / Web & dev). Keep `## Optional` for legal pages only. |
| Low | "Tool pages were last updated on 2026-10-20" is not accurate. 113 sitemap URLs have lastmod 2026-10-19, and so does Currency Converter's `dateModified`. | Change it to "between 2026-10-19 and 2026-10-20", or drop the line. |
| Low | The blockquote does not use the same entity sentence as the Organization schema (section 4). | Use the single brand line. |

## 3. Discovery files, Content-Signal, Markdown

| Item | Status |
|---|---|
| sitemap.xml | 410 URLs, lastmod per URL, also sends changefreq/priority (Google and Bing ignore those) |
| IndexNow | Live key `/a6da860cbc0eeeb09d78c598dea90143.txt` (200). `.github/workflows/indexnow.yml` submits **only URLs changed since the previous prod deploy** |
| Content-Signal in robots.txt | Absent |
| Markdown delivery | None: `/pdf/merge-pdf.md` 404, `Accept: text/markdown` returns HTML, no `Link` header pointing at llms.txt |
| RSL licence (`/license.xml`, `.well-known/rsl.xml`) | Absent |
| security.txt, humans.txt, web manifest, RSS/Atom feed | All 404 |
| Agent/MCP cards (`.well-known/mcp.json`, `agent.json`, `agent-card.json`, `api-catalog`) | All 404. Fine for a no-API tools site |

| Sev | Finding | Fix |
|---|---|---|
| Low | No Content-Signal. It is a Cloudflare-proposed convention, not a standard, but it costs one line. | Add `Content-Signal: search=yes, ai-input=yes, ai-train=no` (or `yes`, the owner's choice) to the `User-agent: *` group in `src/app/robots.ts`. |
| Low | No guides feed. | An Atom feed of guides gives Bing, Feedly and aggregators another discovery path. |
| Low | No Markdown versions. Google says AI features need no special formats, so this is optional. | Skip for now. If added later, serve `/guides/<slug>.md` and link it from llms.txt. |
| Low | No security.txt. | Add `/.well-known/security.txt` with the contact email. Cheap trust signal. |

## 4. Entity clarity for "Utilboxes": INCONSISTENT

| Surface | Text |
|---|---|
| Home `<title>` | Utilboxes — Free Online PDF, Image, Text & Calculator Tools |
| Home meta description | 154 free online tools to merge and compress PDFs, resize images, calculate EMI and GPA, convert units and format JSON. No sign-up; files stay on your device. |
| Organization + WebSite `description` (on every page) | Convert files, calculate anything, and clean up text right in your browser. Utilboxes is a set of fast, free utilities that keep your files on your device. |
| llms.txt summary | 154 free browser-based tools for PDFs, images, calculations, unit conversion, text and developer data. No sign-up and no usage limits. |
| Product Hunt tagline | 129 free PDF & image tools that never upload your files (**stale count**) |

| Sev | Finding | Fix |
|---|---|---|
| High | There are four different descriptions, one of them with a stale count. The name collides with physical utility boxes and Bud "Utiliboxes", so models need one repeated, explicit "website / online tools" line before they can resolve the entity. | Use one sentence everywhere (schema, home meta, llms.txt, About, Product Hunt, AlternativeTo, socials). For example: "Utilboxes (utilboxes.xyz) is a free website of 154 browser-based tools for PDFs, images, calculators, text and developer data; files stay on your device." |
| High | The Organization schema has no `sameAs`. It is `name/url/logo/image/description` only. | Add `sameAs` with the Product Hunt URL, AlternativeTo once it is live, and any GitHub or social profiles. Add `alternateName: "utilboxes.xyz"` and a `disambiguatingDescription` ("an online tools website, not physical utility boxes"). |
| Medium | Article author is the Organization on all guides. There is no Person and no editorial-policy link. | Optionally add a named editor, only if the owner wants one. Otherwise add `publisher` and a "How we write and test" page linked from each guide. |
| Medium | Product Hunt says "129 tools", has 1 upvote, 1 follower and 0 reviews. | Update the tagline to the brand line and 154. |

## 5. Passage citability: 10 pages

| Page | Extracted words | Question-style H2/H3 | 40–200-word blocks | Outbound citations |
|---|---|---|---|---|
| /pdf/merge-pdf | 391 | 2 (FAQ, how-to) | 3 | 0 |
| /image/compress-image | 464 | 2 | 4 | 0 |
| /calculators/percentage-calculator | 442 | 2 | 3 | 0 |
| /converters/currency-converter | 346 | 2 | 3 | 0 (names the ECB but does not link it) |
| /developer/json-formatter | 398 | 2 | 3 | 0 (names RFC 8259 but does not link it) |
| /generators/password-generator | 373 | 2 | 4 | 0 |
| /guides/how-to-redact-a-pdf | 982 | 5 | 6 | 0 |
| /guides/jpg-vs-png-vs-webp | 836 | 2 | 5 | 0 |
| /guides/how-to-create-a-strong-password | 1128 | 3 | 11 | 0 |
| /guides/how-to-calculate-percentage-change | 809 | 1 | 6 | 0 |

The question-style count includes the generic "How to use X" heading.

**Strengths.** Every tool page opens with a direct answer of about 50–60 words that includes a concrete fact. For example: "At quality 80, photos typically lose 50–80% of their size…" and "a 16-character password … has about 105 bits of entropy". Guides have strong, specific H2s ("Why a black box is not redaction") and worked formulas. Visible `<time datetime>` dates and `dateModified`/`datePublished` are present. Each tool page has 10 FAQ answers in FAQPage schema.

| Sev | Finding | Fix |
|---|---|---|
| Medium | No sampled page links a single external source, even when it names one (RFC 8259, ECB reference rates, NIST-style password advice). Citation engines favour claims they can verify. | Add 1–3 authoritative outbound links on each guide and on tools that make factual claims. Attribute statistics ("50–80%", "105 bits") to a source or to "measured on N files". |
| Medium | Every tool page uses the same H2 set: "How it works / Tips and common mistakes / Frequently asked questions". Generic headings tell an extractor nothing about the query. | Phrase them as the query: "How does merging PDFs work without uploading?", "Why is my compressed image still too big?". |
| Medium | Tool pages are thin once boilerplate is stripped (346–464 words). Most paragraphs are 11–18 words. | Expand the top 20 tools by traffic or prompt list with one 130–170-word "what you need to know" block and a short comparison or edge-case section. This also helps Bing (section 6). |
| Low | The 10 FAQ answers are in `<details>`. They are in the SSR HTML and the JSON-LD, but trafilatura-style extractors drop them; they were missing from `extracted_text`. | Optional: render the first 3 FAQs open, or as plain H3 + paragraph. |
| Low | No sampled passage is in the 130–170-word range. This is a third-party heuristic; Google says content need not be chunked. | Do not restructure for this alone. Fold it into the Medium item above. |

## 6. Bing coverage: the main lever (14 of 344 indexed in October)

ChatGPT Search and Copilot ground on Bing, so Bing indexation is the bottleneck for 2 of the 4 platforms. I could not verify the current Bing count: WebFetch's Bing `site:` query returned unrelated Microsoft results, which is a tool limitation, not evidence either way.

On-site changes, highest impact first:
1. **High: one-time IndexNow backfill of all 410 URLs.** The workflow only submits URLs changed since the last deploy, so pages that have not changed since launch may never have been submitted. Run `scripts/indexnow.mjs` once with the full sitemap list (check whether it has an all-URLs mode, or add one), then repeat after major content batches.
2. **High: reduce template sameness.** About 150 tool pages share the same skeleton and run to about 400 words of unique text. Bing holds back near-duplicate, templated pages ("Discovered/Crawled – not indexed"). Make the top tools more distinctive first (section 5), and make sure each one links to its guide.
3. **Medium: per-page images.** The site has no `<img>`, and og:image is a single `/opengraph-image` for the whole site. Add a real screenshot of each tool UI with descriptive alt text, and a per-page og:image. That feeds Bing Images, Copilot cards and multimodal answers.
4. **Medium: entity consistency and `sameAs`** (section 4). Bing's entity pane and Copilot use them to resolve "Utilboxes".
5. **Off-site, owner action:** `docs/seo/outreach-tracker.csv` still lists Bing Webmaster Tools as "not started". The steps are: verify the site (there is no `msvalidate` meta and `/BingSiteAuth.xml` returns 404, so DNS verification is assumed), submit the sitemap, use the URL Submission API, and read the "crawled – not indexed" report. That report will settle whether #1 or #2 is the actual blocker.

## 7. Off-site brand mentions

| Channel | Result |
|---|---|
| Product Hunt | Live at /products/utilboxes: 1 upvote, 1 follower, 0 reviews, stale "129 tools" tagline |
| AlternativeTo | /software/utilboxes/ returned 403 (bot wall) and the /about path returned 404. The tracker says submitted, moderation unconfirmed. **Owner should check it in a browser** |
| Wikipedia / Wikidata | None expected at this stage. Not checked |
| Reddit | Search API returned 403. Unverified |
| YouTube | The search page only echoed the query. No evidence of mentions |
| LinkedIn | Not checked |
| Web search "Utilboxes" | DuckDuckGo returned a CAPTCHA and Bing returned unrelated results. Unverified. The October baseline showed results for physical utility boxes |

So the off-site footprint is close to zero, which matches the October baseline of 0 mentions in 10 prompts. YouTube and Reddit correlate most strongly with AI citations. A short demo video per category (for example "merge PDFs without uploading"), plus genuine answers in r/pdf, r/privacy and r/webdev, is the highest-value off-site work.

## Top 5 changes

| # | Change | Impact | Effort |
|---|---|---|---|
| 1 | IndexNow full backfill + Bing Webmaster sitemap/URL submission + review of the not-indexed report | High (ChatGPT Search, Copilot) | 1–2 h |
| 2 | One brand line everywhere + `sameAs`/`alternateName`/`disambiguatingDescription` in Organization + update Product Hunt to 154 | High (entity resolution, name collision) | 1 h |
| 3 | Make the top 20 tool pages distinctive: query-phrased H2s, one 130–170-word answer block, 1–3 outbound source links | High (citability, Bing quality) | 1–2 days |
| 4 | Real tool screenshots with alt text + per-page og:image | Medium | 0.5–1 day (scripted capture) |
| 5 | llms.txt: move guides out of `## Optional`, fix the date line, use the brand line; add a Content-Signal line in robots | Medium/Low | 30 min |

Not checked: live Bing/Google index counts, the AlternativeTo listing, Reddit/LinkedIn/Wikidata, and DataForSEO (no MCP available). Pages were fetched raw without Playwright, which was valid because `is_spa=false`. The sandbox flag was not applicable.
