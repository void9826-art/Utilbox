# SXO findings: utilboxes.xyz (2026-11-19)

**SXO Gap Score: 63 / 100.** This is separate from the SEO Health Score. It is a site-level score built from the 7 key tool pages and 5 guides.

Method:
- 12 pages fetched with `render_page.py --mode auto`. All returned 200, `is_spa: false` and `sandbox: null`, so Chromium was never launched. Requests were spaced about 1.5 s apart.
- Pages parsed with a local HTML parser (headings, JSON-LD, inputs, buttons, visible text).
- 8 queries run through the WebSearch tool.
- Raw page JSON stayed in the session scratchpad and was not saved to the repo.

**The search tool is not Google.** Its results include tunnel and DuckDNS hosts, `.md` doc endpoints and scraped spam pages. It also gave no information about featured snippets, PAA, ads or AI Overviews. **No ranking positions are claimed anywhere in this report.** Utilboxes did not appear in any of the 8 result sets (16 to 33 links each). That says nothing reliable about its Google rank.

## Score breakdown

| Dimension | Score | Evidence |
|---|---|---|
| Page type | 12/15 | 6 of 7 tool queries return mostly tool pages, and Utilboxes answers each with a tool page. "compress image to 100kb" returns dedicated exact-size pages, and Utilboxes only has the generic compressor (F2). The guide query lines up with an Article page. |
| Content depth | 12/15 | Tool `<main>` holds 743 to 1206 words: answer-first intro, How to use, How it works, Worked example, Tips, FAQ. Guides run 548 to 1255 words. That matches or beats the tool pages competitors show. |
| UX signals | 9/15 | The tool comes straight after a 3-sentence intro, with clear "Files never leave your device" badges. Against that: compress-pdf turns pages into images (F1), compress-pdf takes one file only (F4), and the widget arrives as a streamed Suspense block (F9). |
| Schema | 12/15 | Tools: WebApplication + Offer + FAQPage + BreadcrumbList + WebSite/SearchAction. Guides: Article with dateModified and an Organization author. FAQPage no longer earns rich results for non-gov/health sites. No fake ratings were added, which is correct. |
| Media | 4/15 | `<main>` has 0 `<img>`, 0 `<video>`, 0 `<figure>` on every page sampled. Only icon SVGs are present. The words-to-pages guide has 1 table. |
| Authority | 5/15 | Young domain, absent from every result set. Competitors are Adobe, Smallpdf, Grammarly, QuillBot, banks and brokers (EMI). Guides use an Organization author with no named person. |
| Freshness | 9/10 | Tools show "Updated 19/20 October 2026". Guide dateModified falls between 2026-09-30 and 2026-10-03. |

## Query by query

| Query | Results mostly (taxonomy) | Utilboxes page | Match | What top results offer that Utilboxes doesn't |
|---|---|---|---|---|
| compress pdf | Tool pages (Adobe, Sejda, Smallpdf, Soda, PDF2Go, BentoPDF), plus dev docs/APIs (Stirling, PDF.co, Nutrient) | /pdf/compress-pdf | ALIGNED type, HIGH feature gap | PDF2Go compresses to a chosen file size. BentoPDF has 100 KB/200 KB/500 KB/1 MB/2 MB presets. Adobe shows the size after compression and accepts up to 2 GB. Their compressors keep text selectable; Utilboxes turns every page into an image (F1). |
| merge pdf online free | Tool pages (Adobe, Smallpdf, PDF2Go, PDFgear, Docfly, Picsart, Cloudinary) | /pdf/merge-pdf | ALIGNED | Smallpdf and PDFgear headline "no file size limit" and "unlimited, watermark-free". Utilboxes says the same ("no fixed limit", "no watermarks"). No page-thumbnail or page-level reorder was found ("thumbnail" appears 0 times); you can only reorder whole files. |
| compress image to 100kb | Exact-size tool pages (cloudinary /compress-image-to-100kb plus jpg/png variants, imageonline, pythonware, scanapp, zamzar, softwarehow bulk) and how-to posts (CapCut, ShortPixel, compresto) | /image/compress-image (generic) | **MEDIUM mismatch** (F2) | A URL, H1 and title that match the query. Presets tied to exam and government forms (imageonline: job/KYC; PyToolsHub: SSC/UPSC/Railway). scanapp promises "runs on your phone, no upload". Advice to resize the pixels as well. |
| json formatter | Tool pages (JSONLint, Toptal, jam.dev, Geekflare, convertcase, many small sites) plus GitHub and a Chrome extension | /developer/json-formatter | ALIGNED | The common feature set is format + validate + minify + highlight + indent options + sort keys. Utilboxes has 2-space/4-space/tab indent, Format, Minify, Copy, Download, Load file and Load sample. No tree or collapsible view was found ("tree" appears 0 times). |
| word counter | Tool pages (Grammarly, QuillBot, Coddy, CodeShack, MiniWebTool, dcode) | /text/word-counter | ALIGNED | Grammarly and QuillBot pair the count with grammar or paraphrasing. Utilboxes has a target count, reading and speaking time, most-used words and file load. No autosave was found, so text is lost on reload (bad for a student on a phone). |
| emi calculator | Calculators from Indian finance brands (Zerodha, Upstox, 5paisa, ClearTax, Axis Bank, ICICI Pru, Paisabazaar, CRED, Groww-type sites) plus apps | /calculators/emi-calculator | ALIGNED type, **HIGH authority gap** (F5) | ₹/lakh formatting, sliders, a principal-vs-interest chart, versions for home/car/personal loans, notes on floating rates. The server-rendered HTML has 3 `type=number` inputs and no range input. "chart", "₹", "lakh", "download", "CSV" each appear 0 times. |
| heic to jpg | Mixed. Tool pages (Zamzar, Adobe Express, ezgif, Cloudinary, Kapwing, Wix, Aftershoot), how-to guides (Cloudinary guide, Shotkit, iLoveIMG blog, freeCodeCamp), iOS/Windows apps | /image/heic-to-jpg, plus /guides/how-to-open-heic-photos | ALIGNED (tool and guide each serve one slice) | Utilboxes is strong here. Its title already says "Batch, No Upload" and it has ZIP download and a quality setting, while ezgif deletes uploads after 1 h and caps at 200 MB. The gap is that results also offer a PNG target and per-OS steps (Mac Preview, iPhone Settings > Camera > Formats), which only the guide covers. |
| how many pages is 1000 words (guide query) | Blog posts and articles (ONLYOFFICE, Immerse Education, Spines), with heavy scraped-spam copies | /guides/how-many-pages-is-1000-words | ALIGNED | The intro answer ("about two pages single-spaced and four double-spaced, at 12 point") matches what the results agree on. The page has a words-to-pages table and a handwriting section. Missing: a words-to-pages converter on the page, and an image of a sample page. |

## Findings

**F1. HIGH: Compress PDF turns pages into images, and the results promise lossless-looking output.**
- *Evidence:* The intro on the page reads "Each page is re-rendered and its images re-encoded... Text in the result is no longer selectable, so use it for scans rather than text documents." Adobe, Smallpdf and PDF2Go all sell compression that keeps the layout and text ("text and layout stay unchanged").
- *Why it matters:* An office worker compressing a contract or CV gets a file that can't be searched or copied, and that ATS parsers can't read. That pushes them back to the results page, which is the worst SXO signal.
- *Fix:* Add a lossless "Light" mode that only downsamples embedded images and recompresses streams, leaving text alone (pdf-lib or qpdf-wasm style), and make it the default. Keep the rasterise mode as "Strong (scans only)".

**F2. MEDIUM: No dedicated page for "compress image to 100kb", and the same applies to "compress pdf to 1mb / 200kb".**
- *Evidence:* The results are full of exact-size URLs (cloudinary has 3 variants, imageonline, pythonware, scanapp, zamzar). Utilboxes covers the intent inside /image/compress-image ("100 KB" appears 5 times) and in the guide section "How to get under a specific limit".
- *Fix:* Ship a small set of preset pages, for example /image/compress-image-to-100kb, -50kb, -20kb and /pdf/compress-pdf-to-1mb. Each should reuse the existing widget with the target pre-filled, have its own H1 and title, and add genuinely different guidance, such as the pixel sizes that typical exam and government forms ask for. Stop at a few; dozens of near-identical pages would be doorway pages.

**F3. MEDIUM: Tool and guide compete for "reduce pdf file size".**
- *Evidence:* The tool title is "Compress PDF Online — Reduce PDF File Size Free". The guide title is "How to Reduce PDF File Size for Email". The same intent is also served by /guides/get-a-pdf-under-an-upload-limit and /guides/pdf-rejected-by-upload-form, and partly by /guides/file-got-bigger-after-compressing. That makes three or four URLs for one transactional intent, and the results for it are tools.
- *Fix:* Let the tool own "reduce pdf file size". Retitle the guide around the problem, for example "PDF Too Big to Email? Get It Under 10 MB". Merge get-a-pdf-under-an-upload-limit into it or move it to a clearly separate angle (portal limits), and link each guide to the tool in its first paragraph.

**F4. MEDIUM: Compress PDF handles one file at a time.**
- *Evidence:* The compress-pdf file input has no `multiple` attribute and the page says "one file" twice. Merge, Compress Image and HEIC to JPG all accept several files. Office users compressing a batch of scans, and PDF2Go/Smallpdf, expect several at once.
- *Fix:* Accept several files and offer a ZIP download, using the same pattern as the image tools.

**F5. HIGH (strategic): EMI calculator is up against finance brands in a YMYL results page.**
- *Evidence:* Nearly every result is an Indian bank, broker or fintech. The Utilboxes page has no ₹/lakh formatting, no sliders, no chart and no schedule export (counts above). Its strengths are the formula shown up front, the worked example and the processing-fee note.
- *Fix:* Add ₹ and lakh/crore formatting with a currency switch, sliders next to the number inputs, a principal/interest donut, a CSV/print export of the schedule, and a prepayment option linked to /guides/prepay-a-loan-reduce-emi-or-tenure. Be realistic: authority, not features, is the limit here. Long-tail wins such as "emi does not match bank quote" (an existing guide) are more reachable than the head term.

**F6. MEDIUM: Merge PDF tool vs merge guide.**
- *Evidence:* The tool title is "Merge PDF Files Online — Free, No Upload". The guide title is "How to Merge PDF Files Into One (No Upload)". Both use the same no-upload framing for the same intent. The guide has 1011 extracted words and the tool 391, so a search engine could choose the guide for a query whose results are all tools.
- *Fix:* Move the guide toward a different angle, for example "merge PDFs on iPhone / Windows without Acrobat", or "what survives a merge (bookmarks, forms)", which it already covers. Drop "(No Upload)" from the guide title.

**F7. MEDIUM: JSON Formatter vs JSON Validator, a tool-vs-tool overlap.**
- *Evidence:* The formatter meta reads "Format, minify and validate JSON..." with "precise error positions". /developer/json-validator also exists, as does /guides/how-to-fix-invalid-json. Formatter results (JSONLint) treat format and validate as one tool.
- *Fix:* Make the formatter the main page for both intents and give the validator a different role, such as schema validation (JSON Schema) or a strict-vs-lenient check. Alternatively, cross-canonicalise if the validator really is the same widget. Add a collapsible tree view, which developers expect.

**F8. LOW: HEIC tool vs HEIC guide.**
- *Evidence:* The "heic to jpg" results really are mixed between tools and how-to guides, so having both pages is legitimate. The guide's H2 "Convert HEIC to JPG" is the only overlap.
- *Fix:* None needed beyond keeping the guide focused on OS steps (iPhone Settings > Camera > Formats, Windows codec, Mac Preview) and linking to the tool.

**F9. LOW: Tool widgets arrive as a streamed Suspense block.**
- *Evidence:* In the raw HTML the tool area is an `aria-label="Loading the tool"` skeleton. The real dropzone or textarea comes about 37 KB later, after `</main>` (compress-pdf: h1 at char 16815, skeleton just before "How to use" at 18860, `type="file"` at 53656). The browser swaps it in with an inline script, so users with JS see it in place.
- *Risk:* The skeleton shows for a moment on slow mobile connections, and non-JS crawlers or AI fetchers see a skeleton where the tool should be.
- *Fix:* None required. If CLS or LCP field data looks bad on tool pages, server-render the empty widget in place.

**F10. MEDIUM: No visual media on any tool or guide page.**
- *Evidence:* 0 img, figure or video inside `<main>` on all 6 pages checked.
- *Fix:* Add one annotated screenshot or a short looping before/after per top tool, for example compress-image at q80 vs the original with sizes, or the merge order UI. On guides add one figure, for example a rendered sample page of 1,000 words single vs double spaced. This also gives Image search an entry point.

**F11. LOW: Guides use an Organization author only.**
- *Evidence:* Article JSON-LD on both guides checked has `author: {"@type":"Organization","name":"Utilboxes"}`. There is no person, no reviewer and no About-the-author block.
- *Fix:* This only matters for YMYL guides (EMI, prepayment, password). Add a named reviewer there, or a "How we checked this" methodology line. See `/seo content` for an E-E-A-T pass.

## User stories (each tied to a results signal)

1. Awareness/decision. *"As a job applicant whose portal rejects files over 100 KB, I want to type 100 and get a JPG under that size on my phone."* Signal: imageonline is pitched at job/KYC forms, PyToolsHub at SSC/UPSC/Railway, and scanapp says "runs on your phone · no upload".
2. Decision. *"As an office worker emailing a contract, I want a smaller PDF that still has selectable text."* Signal: Adobe shows a size preview, and PDF2Go says "text and layout stay unchanged".
3. Decision. *"As someone with confidential files, I want proof they are not uploaded."* Signal: the merge results' own summary warns that "several sites claim files are deleted automatically, but these are self-reported", and shadcn and scanapp headline "sends nothing to a server" or "no upload".
4. Consideration. *"As a borrower comparing a bank quote, I want the EMI in ₹ with a principal/interest split and the effect of prepaying."* Signal: almost every result is an Indian bank or broker, there is a reducing-vs-flat warning, and Zerodha has a floating-rate caveat.
5. Awareness. *"As a student given a 1,000-word essay, I want to know how many pages that is in my format."* Signal: the results agree on "2 single / 4 double at 12 pt", with variants for handwriting and novel-page formats.

## Personas (score out of 100: Relevance / Clarity / Trust / Action, each out of 25)

Personas as briefed. Student on a phone: SERP evidence is exam/form presets, "runs on your phone" and essay page counts. Office worker on desktop: email and upload limits, contracts, batch work. Developer: JSON tools, GitHub/npm/API results.

| Page | Student, phone | Office worker, desktop | Developer |
|---|---|---|---|
| compress-pdf | 66 (20/16/18/12) | **58** (16/17/18/7) F1, F4 | 62 (17/18/19/8) no CLI/API mention |
| merge-pdf | 74 (21/19/18/16) | 80 (22/20/19/19) | 68 (17/19/19/13) |
| compress-image | 72 (20/17/18/17) F2 | 79 (21/20/19/19) | 75 (20/20/19/16) |
| json-formatter | n/a | 60 (14/18/18/10) | 76 (21/20/20/15) no tree view |
| word-counter | 74 (22/20/17/15) no autosave | 77 (21/20/18/18) | 65 (15/19/17/14) |
| emi-calculator | 55 (16/16/12/11) | **57** (18/17/11/11) F5 | 60 (15/20/13/12) |
| heic-to-jpg | 70 (19/18/18/15) iOS mostly converts on its own | 84 (23/21/20/20) | 76 (20/20/19/17) |
| guide: 1000 words | 78 (23/21/17/17) | 70 (19/20/17/14) | n/a |

Weakest first, with concrete fixes:
1. **EMI, office worker (57) and student (55).** Trust and Action are low: no ₹, no chart, no export, Organization byline in a YMYL topic. Fix per F5, and add a "checked against [bank] formula" worked example.
2. **Compress PDF, office worker (58).** Action fails because text is lost and there is no batch. Fix per F1 and F4, and add a "target size (MB)" field to match PDF2Go and BentoPDF.
3. **JSON formatter, office worker (60).** This persona comes from Excel or CSV work. Link "Open JSON in Excel" (/guides/open-a-json-file-in-excel) and /developer/json-to-csv beside the output.
4. **Compress PDF, developer (62).** State that the work is client-side (pdf.js/wasm) and give a command-line equivalent (qpdf or Ghostscript), since the results include npm and API options.
5. **Word counter, developer (65) and student (74).** Save the text to localStorage with a "clear" control, and add a pages estimate that links to the 1000-words guide.
6. **Compress image, student (72).** Add one-tap 20/50/100/200 KB chips, and preset pages per F2.

## Limitations

- The search engine is not Google, and its results are noisy (spam mirrors, tunnel hosts). There were no SERP features, ads, PAA or AI Overview data, and no real ranking positions. Utilboxes not appearing in a result set is not evidence of its rank.
- Competitor pages were not fetched. Competitor features come from the search tool's snippets and summaries only.
- No screenshots were taken. Above-the-fold placement on a 360 px phone is inferred from DOM order (breadcrumb, H1, 3-sentence intro, then the tool), not measured. Widget behaviour (sliders, target-size accuracy, ZIP) was not tested by hand. Feature absence is based on server-rendered markup and word counts, so a client-only control could be missed. For example, the compress-image quality slider was not found as `type=range` in the markup.
- No Search Console data on queries, CTR or which URL Google currently picks for each intent. That data would confirm or rule out cannibalisation F3, F6 and F7.
- Only 12 of 410 URLs were sampled.

## Structured findings (for audit-data.json, category "Search Experience")

```json
{"category":"Search Experience","sxo_gap_score":63,"findings":[
{"id":"SXO-F1","severity":"high","page":"/pdf/compress-pdf","title":"Compression rasterises pages; text no longer selectable","fix":"Add lossless image-downsample mode as default"},
{"id":"SXO-F2","severity":"medium","page":"/image/compress-image","title":"No exact-target pages for 'compress image to 100kb' SERP","fix":"Few preset pages (100/50/20 KB, PDF 1 MB) with unique guidance"},
{"id":"SXO-F3","severity":"medium","page":"/pdf/compress-pdf + /guides/how-to-reduce-pdf-file-size + /guides/get-a-pdf-under-an-upload-limit","title":"Tool vs guide cannibalisation on 'reduce pdf file size'","fix":"Tool owns head term; retitle/merge guides to problem angles"},
{"id":"SXO-F4","severity":"medium","page":"/pdf/compress-pdf","title":"Single-file only","fix":"multiple + ZIP"},
{"id":"SXO-F5","severity":"high","page":"/calculators/emi-calculator","title":"YMYL SERP of finance brands; no INR format, chart, sliders, export","fix":"INR/lakh, sliders, donut, CSV, prepayment; target long tail"},
{"id":"SXO-F6","severity":"medium","page":"/pdf/merge-pdf + /guides/how-to-merge-pdf-files","title":"Tool vs guide same intent and framing","fix":"Re-angle guide, drop '(No Upload)' from title"},
{"id":"SXO-F7","severity":"medium","page":"/developer/json-formatter + /developer/json-validator","title":"Tool vs tool overlap on validate","fix":"Differentiate validator (schema) or consolidate; add tree view"},
{"id":"SXO-F8","severity":"low","page":"/image/heic-to-jpg + /guides/how-to-open-heic-photos","title":"Legit mixed SERP; minor overlap","fix":"Keep guide OS-focused"},
{"id":"SXO-F9","severity":"low","page":"all tools","title":"Widget streamed after </main>; skeleton in SSR position","fix":"Monitor CLS/LCP; SSR in place if needed"},
{"id":"SXO-F10","severity":"medium","page":"all tools/guides","title":"No content images/video","fix":"One annotated screenshot or before/after per top page"},
{"id":"SXO-F11","severity":"low","page":"YMYL guides","title":"Organization-only author","fix":"Named reviewer/methodology on finance and security guides"}]}
```

Next steps: `/seo content` (E-E-A-T on EMI and password guides), `/seo schema` (no new types needed; review FAQPage value), `/seo page` on /pdf/compress-pdf. Generate a PDF report? Use `/seo google report`.
