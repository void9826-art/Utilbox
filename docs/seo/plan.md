# Utilboxes SEO + AEO + GEO plan

Written 2026-10-19. Phases 1–7 of the master prompt. Data files sit next to this one:

| File | What it holds |
|---|---|
| `keywords.csv` | 564 keywords: the head term plus up to 4 real long-tails for each of the 129 tools. Each has its intent, an AI-filter verdict, whether the page already mentions the modifier, and where the keyword came from. |
| `prompts.csv` | 60 conversational prompts mapped to target pages. 10 have a logged baseline; 6 point at tools that don't exist yet (`GAP:`). |
| `outreach-tracker.csv` | 12-week off-site plan. Every target is one the AI answers actually cited. |

**Data limits, stated once.** No search-volume data was available (the Ahrefs connector isn't authorised and there's no Keyword Planner access). The keywords come from Google and Bing autocomplete, which proves people type them but gives no volumes. Competitor visibility comes from a web search engine that isn't Google, so it's a rough signal, not real rankings. The AI baseline was run on one engine (Claude web search). ChatGPT, Gemini and Perplexity still need to be checked by hand (see Measurement).

---

## Status by phase

| Phase | Status |
|---|---|
| 1 Audit | Done. On-site SEO is strong (schema, server-rendered text, LCP 1.8 s). The blocker is that **Bing has zero pages indexed**. |
| 2 Keywords and prompts | Done (`keywords.csv`, `prompts.csv`). |
| 3 Technical | Done and live (commit 552fa76): llms.txt, real "Updated" dates, sitemap lastmod, dateModified, guide-to-tool links. The rest already existed. |
| 4 Tool-page template | **Done 2026-10-19.** All 129 tool pages open with a 48–60-word answer-first intro built only from claims each page already makes. Shipped in six batches, each verified live. |
| 5 Authority | Plan and tracker written. Nothing posted: every item needs your accounts or your OK. |
| 6 Measurement | Setup steps below. GA4 AI channel and the monthly prompt check are yours to switch on. |
| 7 Roadmap | Below. |

---

## What the evidence says

1. **Utilboxes was mentioned in 0 of the 10 baseline prompts.** The answers cited Product Hunt pages (4 of 10), dev.to posts, AlternativeTo, Indie Hackers, SaaSHub and open-source GitHub projects. Those are the places to get listed (`outreach-tracker.csv`).
2. **The brand name collides.** A search for "utilboxes" returns physical utility boxes and Bud Industries' "Utiliboxes" enclosures. Always write the brand with its descriptor: *"Utilboxes — free online tools that run in your browser"*.
3. **AI answers tell users to test privacy claims**: "turn off Wi-Fi and see if it still works", "check the network tab". Utilboxes passes the network-tab test today but **fails the offline test, because there is no service worker**. Fixing that turns the privacy claim into something an AI can repeat as verified.
4. **People search for "without losing quality", "without limit / unlimited", "without login / sign up", "multiple / batch" and "without watermark" far more than "without uploading"**, which appears only for Merge PDF. Lead with *no limits, no sign-up, no watermark, no quality loss*. Keep privacy as the reason to trust it, not the headline.
5. **Head terms are taken.** Adobe, iLovePDF, Smallpdf, PDF24 and big calculator sites own "merge pdf", "compress pdf", "percentage calculator" and the like. The winnable ground is long-tail modifiers and privacy-led prompts, where the results are small independent sites.
6. **Two product gaps cost real queries.** "Compress image to 100kb / 1mb" is won by dedicated pages, and our compressor has no target-size mode. "Remove a password from a PDF" has no Utilboxes tool.

---

## Phase 2: keyword research

- **Coverage:** 129 head terms + 435 long-tails = 564 rows.
- **P1 set (135 rows):** the 27 popular tools. This is the "~150 priority keywords" list.
- **AI filter:**
  - PDF, image, text, generator and developer actions are marked **"Needs a tool (high click value)"**.
  - Calculators and converters are marked **"Mixed"**: an AI answers one-off sums, but schedules, batches and repeat use still need the tool.
  - Only one tail is purely informational ("formula", "how to"). Utilboxes' keyword set is overwhelmingly action intent, which is the good kind.
- **Content gaps:** 130 long-tails name a modifier the page never mentions (`page_mentions_modifier = no`), and 48 do partly. P1 examples:
  - *heic to jpg … unlimited / multiple* (the tool does both, but the copy doesn't say so)
  - *pdf to jpg without losing quality*
  - *pdf to word without losing formatting*
  - *image to text without login / without limit*
  - *invoice generator without login*
  - *qr code generator without subscription / no expiration*
  - *json formatter offline*
- **Fix:** where the tool genuinely does it, work the phrase into a FAQ answer or the intro. **Don't add "offline" anywhere until a service worker ships.**
- **Caution:** autocomplete still returns some noise (e.g. "image to text art"). Skim each row before acting on it.

## Competitor gap: top 25 keywords

Engine: Claude web search, 2026-10-19. The results include spam pages, so read this as "who is visible", not as rankings.

| Keyword | Who was visible | What Utilboxes lacks |
|---|---|---|
| merge pdf, compress pdf, split pdf, pdf to word, jpg to pdf, pdf to jpg | Adobe, iLovePDF, PDF24, i2pdf, Smallpdf mentions, plus spam guides | Authority and backlinks. Not winnable head-on yet. |
| merge pdf without uploading | dev.to, thedrive.ai, besthomepageever, otranslator | Any presence. **Winnable**: small sites only. |
| compress image, resize image, png to jpg | TinyPNG/Squoosh mentions, i2img, cloudinary, gumlet | Authority. |
| compress image to 100kb | imageonline, codia, cloudinary (dedicated pages) | **A target-size feature**, then a page or section for it |
| heic to jpg (online / without uploading) | Adobe Express, Picflow, selfboot, Chrome extensions, dev.to | Presence. The batch and no-upload features already match. |
| image to text / OCR without uploading | Tesseract.js tools via dev.to, ChatSlide, Bushe | Presence. The tool is equivalent (it uses Tesseract.js). |
| percentage, age, EMI calculators | Symbolab, calculator portals, Indian brokers (EMI) | Authority. The EMI formula is already on the page. |
| qr code generator no expiration | qr-code-generator.com, Scanova, QR TIGER, commmerce, EZQR | A clear "static, never expires, no account" line in the copy |
| password generator | Wikipedia, password managers | Not winnable. Low priority. |
| invoice generator without sign up | BoldSign, Product Hunt and Indie Hackers makers, dev.to | **Listings.** The tool matches the request exactly. |
| json formatter | JSONLint, jam.dev, openreplay, small tools | Presence |
| word counter, case converter | small tool sites, AlternativeTo | Presence |
| free PDF tools that don't upload | CoolPDF, PDFQuokka, PDFkind, PDFBase, EdgeDocs (via Product Hunt and hunted.space) | **Product Hunt launch + AlternativeTo** |
| tinywow alternative | FreeConvert.cc, AlternativeTo, SaaSHub, Capterra | AlternativeTo and SaaSHub listings |
| utilboxes (brand) | Physical utility boxes | Brand mentions anywhere |

## Phase 3: technical (status)

- **Done before this plan:**
  - Organization, WebSite and SearchAction schema; WebApplication with a price of 0; FAQPage and BreadcrumbList on every tool page.
  - XML sitemap in robots.txt, IndexNow on every production deploy.
  - Unique titles and descriptions, clean `/category/tool` URLs, related-tool blocks.
- **Done 2026-10-19:** `/llms.txt`; visible "Updated" dates (sitemap lastmod and schema dateModified match); "Tools for this job" and "More tools for this job" on all 200 guides.
- **Deliberately skipped:**
  - **HowTo schema:** Google stopped showing HowTo rich results in 2023.
  - **H1 rewrites:** titles already carry the benefit, and a bare tool-name H1 matches what people search for.
- **Open:**
  - **Service worker for offline use (P1).** Ship it before any copy says "offline".
  - **Bing indexing:** you're checking Bing Webmaster Tools.

## Phase 4: tool-page template (done)

Every page already had H1, intro, the tool, numbered steps, how it works, tips, 4–8 FAQs, guides, related tools and a date. 33 pages have worked examples and 27 have formulas. The gap was the intro: 11–33 words (median 21), none answer-first. **All 129 have now been rewritten** to 48–60 words, using only claims the page already makes. The convention is recorded on `ToolContent.intro` in `src/types/tool.ts`. The five approved pilots below set the style.

**Merge PDF** (now 20 words)
> To merge PDFs, add the files, drag them into the order you want and press Merge — the combined PDF downloads straight away. Pages are copied as they are, so text stays selectable and images are not re-compressed. Everything runs in your browser, with no upload, no sign-up and no fixed limit on the number of files.

**Compress PDF** (now 23)
> To make a PDF smaller, add it, choose a level from Light to Strong, check the size saving, then download. Each page is re-rendered and its images re-encoded, which often shrinks scans and image-heavy files by 60–90%. Text in the result is no longer selectable, so use it for scans rather than text documents.

**HEIC to JPG** (now 26)
> To convert iPhone HEIC photos to JPG, add as many as you like, choose the quality and download them together as a ZIP. Windows cannot open HEIC without a paid codec, and JPG opens everywhere. Conversion happens in your browser, so your photos are never uploaded, and there is no limit on how many you convert.

**Compress Image** (now 22)
> To shrink a JPG, PNG or WebP image, drag the quality slider and watch the estimated file size update before you download. At quality 80, photos typically lose 50–80% of their size with no visible change, and resizing at the same time saves far more. Images are processed in your browser and never uploaded.

**EMI Calculator** (now 22)
> Your EMI is the fixed monthly payment that repays a loan with interest: EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1), where r is the monthly rate and n the number of months. Enter the amount, annual rate and tenure to see the instalment, the total interest and every payment in the schedule.

Also on the template list:
- A **limits line** where a real limit exists (Merge PDF's copy already says the ceiling is device memory).
- Work the **content-gap modifiers** from `keywords.csv` into FAQs.

## Phase 5: authority and mentions

**New tools and features the data asks for.** These are product work, with priority taken from the prompt and keyword gaps:

| Item | Why | Effort |
|---|---|---|
| Target file size in Compress Image ("to 100 KB / 1 MB") | Dedicated pages win this query; form uploads need it | M |
| Offline support (service worker) | Lets the privacy claim pass the test AI answers tell users to run | M |
| Unlock PDF (remove a password you know) | Prompt 6; no tool exists | M |
| GST/VAT calculator | Prompt 33 | S |
| Tip / bill-split calculator | Prompt 34 | S |
| Text diff (compare two texts) | Prompt 52; `src/lib/text-diff.ts` already exists | S |
| Cooking converter (cups to grams) | Prompt 42; needs a sourced density table | M |

**Hub pages.** The 200 guides already cover HEIC formats, PDFs under 1 MB, the EMI formula, merging without uploading and redaction. Only these *new types* are proposed. **Each needs your OK before publishing**, and any claim about a competitor must be checked on the day and dated.

1. How to check that an online tool really doesn't upload your files (network tab + offline test)
2. Free alternatives to TinyWow, with what each one uploads (verified table, dated)
3. Free alternatives to Smallpdf and iLovePDF for everyday PDF jobs
4. PDF tools that work without an account: what you can and can't do for free
5. Compress an image to 100 KB, 200 KB or 1 MB for application forms (after the target-size feature ships)
6. Remove a password from a PDF you own (after Unlock PDF ships)
7. Static vs dynamic QR codes: which ones expire, and why
8. Private invoice generators: what "no account" really means for your data
9. OCR in the browser: how accurate it is and when to use it (with test results)
10. Batch-converting iPhone photos on Windows without installing anything

**Off-site.** See `outreach-tracker.csv`, weeks 1–12. Rules:
- Disclose "I built this" every time.
- Never post the same text twice, and never buy links or reviews.
- Use the same brand facts everywhere (below).

### Brand facts (copy exactly)

- **Name:** Utilboxes
- **One-liner:** Free online tools that run in your browser: PDF, image, text, calculators and converters. No sign-up, no limits.
- **Longer:** 129 free tools for PDFs, images, calculations, unit conversion, text and developer data. 124 run entirely in your browser; 2 fetch public reference data (exchange rates, YouTube thumbnails); 3 send only a domain or URL to the site's own server for a network check. Nothing is stored.
- **URL:** https://www.utilboxes.xyz
- **Logo:** `public/logo-mark.png`

## Phase 6: measurement

**1. Search Console and Bing Webmaster Tools**
- Already verified by DNS TXT record. Bing: you're checking it now.
- Monthly, note: indexed pages, impressions and clicks per P1 tool, and queries in positions 4–20 (the cheapest wins).

**2. GA4 "AI assistants" channel**
- Go to Admin → Data display → Channel groups → copy the default group → Add new channel "AI assistants".
- Condition: *Source* matches regex:
  ```
  (^|\.)(chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|bard\.google\.com|copilot\.microsoft\.com|claude\.ai|you\.com|phind\.com|meta\.ai|chat\.deepseek\.com|grok\.com)$
  ```
- Drag it **above "Referral"** so it matches first.
- Caveats:
  - It undercounts. Many AI clicks arrive with no referrer and land in "Direct".
  - GA4 here only loads after cookie consent, so every channel undercounts. Read trends, not totals.

**3. Monthly AI visibility check (1st of each month, about an hour)**
- Run the 60 prompts in `prompts.csv` on ChatGPT (search on), Gemini, Perplexity and Google AI Mode.
- Add columns per run: date, engine, mentioned (y/n), cited link (y/n), sentiment, competitors named.
- I can re-run the Claude-search column for you any time.

**4. "How did you hear about us?"**
- Spec, not built: a one-tap optional chip row after a successful download, shown once per visitor and dismissible. Options: Google, ChatGPT/AI assistant, Reddit, YouTube, A friend, Other.
- Store it as a GA4 event only after consent.
- **Needs your go-ahead**: it adds UI to every tool.

**5. KPIs**

| KPI | Baseline 2026-10-19 | 90-day target (direction, not a promise) |
|---|---|---|
| Bing indexed pages | 0 | Most of the 344 sitemap URLs |
| Google indexed pages | check GSC | ≥ 330 |
| AI prompts mentioning Utilboxes | 0 / 10 logged | ≥ 5 / 60 |
| P1 keywords in Google top 10 | check GSC | rising month on month |
| AI-assistant sessions (GA4) | 0 measured (channel not set up) | measurable and rising |
| Brand searches "utilboxes" (GSC) | check GSC | rising |
| Directory and listing mentions | 0 found | ≥ 10 |

## Phase 7: roadmap

### 30 days (quick wins)
- ✅ llms.txt, real dates, guide-to-tool links (live)
- You: Bing Webmaster Tools + Search Console noindex check
- You: GA4 AI channel
- ✅ Answer-first intros on all 129 tool pages (live)
- Build target-size compression and offline support (service worker)
- You: AlternativeTo, SaaSHub; prepare the Product Hunt launch

### 60 days
- Product Hunt launch (after offline support ships)
- 2 dev.to articles; Indie Hackers post
- New tools: Unlock PDF, GST/VAT, tip/bill split, text diff
- Hub pages 1–4 (after your OK)
- First monthly AI visibility run across the four engines

### 90 days
- Show HN (only if offline support holds up), Reddit and Stack Exchange answers, listicle outreach, YouTube Shorts
- Hub pages 5–10 and the cooking converter
- Content-gap modifiers worked into the FAQs of all P1 tools
- Quarterly review against the KPI table

### Summary table

| Task | Effort | Expected impact | Status |
|---|---|---|---|
| Fix Bing indexing (BWT) | S | **High**: gates ChatGPT search visibility | You, in progress |
| GSC noindex re-check | S | Medium | You |
| llms.txt + dates + guide links | S | Low–medium | ✅ Live |
| Answer-first intros (129 pages) | M | Medium (AEO) | ✅ Live |
| Content-gap modifiers in FAQs | M | Medium | Not started |
| Target-size image compression | M | High for a high-demand long-tail | Not started |
| Offline support (service worker) | M | High for GEO trust | Not started |
| New tools (unlock, GST, tip, diff, cooking) | M | Medium | Not started |
| Product Hunt + AlternativeTo + SaaSHub | M | **High**: the sources AI cites | You |
| dev.to / Indie Hackers articles | M | Medium–high | You (I can draft) |
| Hub pages (10) | L | Medium | Needs your OK |
| GA4 AI channel + monthly prompt runs | S | Measurement | You |
| "How did you hear" prompt | S | Measurement | Needs your OK |

### Checklist: things only you can do
- [ ] Bing Webmaster Tools: sitemap status, URL inspection, request indexing
- [ ] Search Console: Pages report → noindex exclusions → request indexing
- [ ] GA4: add the "AI assistants" channel (regex above)
- [ ] Create accounts: Product Hunt, AlternativeTo, SaaSHub, dev.to, Indie Hackers (Reddit, YouTube optional)
- [ ] Decide: promote the public GitHub repo? (AI answers favour open-source, verifiable tools)
- [x] Approve or edit the 5 pilot intros (approved; all 129 shipped)
- [ ] Approve or skip the "How did you hear" prompt
- [ ] Pick which hub pages to publish
