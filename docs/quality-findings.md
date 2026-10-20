# Quality findings — 2026-10-20

A correctness, robustness, accessibility, mobile, performance and SEO pass over the existing tools. Fixes are small and local; anything risky is listed under "Not fixed".

## 1. Calculators and converters

Every formula was checked against its standard definition. These were correct and are now covered by edge-case tests:

- EMI and loan amortisation (reducing balance)
- compound interest
- mortgage (PITI)
- GPA and CGPA (credit-weighted)
- grade needed on the final
- percentage of, change, and add/subtract
- adding and removing tax
- stacked and reverse discounts
- BMI (exact lb and inch factors)
- salary periods (52.1775 weeks a year)
- every unit factor (the international foot and pound, US and imperial volumes, Gregorian year, decimal and binary data units)
- temperature
- the newer libraries (date maths, time card, fuel, SIP, BMR, number words, bases, loans)

### Bugs fixed

| Tool | Input | Before | After |
|---|---|---|---|
| Age Calculator | born 31 Jan 2000, on 1 Mar 2026 | 26 years, 1 month, **−2 days** | 26 years, 1 month, 1 day |
| Age Calculator | born 30 Jan 2000, on 1 Mar 2026 | 26 years, 1 month, **−1 day** | 26 years, 1 month, 1 day |
| Age Calculator | born 31 Jan, on 28 Feb (common year) | 0 months, 28 days (the page's own how-it-works said "1 month") | 1 month, 0 days |
| Attendance Calculator | 7 of 10 attended, 80% required | must attend **6** more | 5 more (12/15 = 80%) — `1 − 0.8` is `0.19999999999999996` in floating point |
| CGPA Calculator | 4-point scale, CGPA 3.5 | "Percentage (CGPA × 9.5): **33.3%**" | The × 9.5 figure is shown only on 10-point scales |
| CGPA Calculator | 8.5 typed on a 4-point scale | counted, inflating the CGPA | left out, with a note saying so |
| Percentage Calculator | change from −50 to −25 | working showed −50% next to "increase" | 50% increase (measured against \|start\|), working consistent |
| All money output | 1,234.5 in yen | ¥1,234.50 | ¥1,235 (each currency's own decimals: 0 for JPY, 3 for KWD) |

What moved into libraries:

- The age logic is now `src/lib/age.ts`. It counts whole months from the last birthday, clamps short months to their last day, and keeps the 1 March rule for 29 February birthdays that the page and guide describe. The page text was updated to describe the method accurately.
- Attendance logic is now `src/lib/attendance.ts`, using whole-percent arithmetic.

### Tests added

- `scripts/test-lib.mjs` → "QUALITY AUDIT TESTS". 49 checks:
  - age: month ends, leap birthdays, the same day, future dates, DST weeks, impossible dates
  - attendance: 70, 75, 80 and 72.5%, the exact boundary, invalid input
  - currency formatting: JPY, USD, KWD, NaN, unknown codes
  - half-up rounding of negatives
  - single-period, 30-year and huge loans
  - negative and zero-year growth
  - temperature at −40 and absolute zero
  - zero, negative, NaN and huge unit inputs
- `scripts/verify-examples.mjs`: the age page's 25 years 5 months 21 days and 191-day examples now run through the real code, plus the 31 January cases.

## Part 2: file tools with odd inputs

Tested in a real browser (Chromium 141) with these files: encrypted (user password), restricted (owner password only), truncated, empty, renamed non-PDF, PDF with bytes before the `%PDF` header, a 9000 × 9000 PNG, a transparent PNG, an EXIF-rotated JPEG, a fake HEIC, and mixed good and bad batches.

### Bugs fixed

- **PDF page previews failed in every tool that renders pages** (rotate, delete pages, watermark, page numbers, PDF to JPG and others). pdf.js 6's modern build calls `Map.prototype.getOrInsertComputed`, which browsers released before 2026 (Chromium 141 here, and current Safari) do not have. These tools now load pdf.js's legacy build, which includes the polyfill. The worker file has a new name (`/pdfjs/pdf.worker.legacy.min.mjs`), so a service-worker cache can't pair the old worker with the new library. `public/sw.js` is unchanged.
- **Encrypted and restricted PDFs gave a generic "could not be processed" message.** pdf-lib refuses any encrypted file, including ones that open without a password but have editing restrictions. The message now says the file is encrypted or restricted and how to fix it. Damaged files (parse, xref or structure errors) and out-of-memory failures also get their own clear messages.
- **PDFs with junk before the header were rejected as "not a PDF".** Acrobat accepts the `%PDF-` marker anywhere in the first 1,024 bytes, and pdf.js does too. The file check now matches that.
- **In a mixed batch, the message about rejected files vanished.** Dropzone reported the error first and then passed on the good files, and the tools clear their errors when new files arrive. Good files now go first, so the rejection message stays (checked in image converter, merge PDF, JPG to PDF, compress image and combine images).

Already fine: empty files, oversized files, fake HEIC (clear decode error), huge, transparent and EXIF-rotated images.

### Tests added

- `scripts/test-lib.mjs` → "FILE ROBUSTNESS TESTS": 14 checks.
  - Error messages, tested with pdf-lib and pdf.js's exact error text: encryption, password, parse failure, invalid structure, memory, unknown.
  - File sniffing: a PDF, a PDF after a junk prefix, a renamed JPEG, text, HEIC brands.
  - Rejection messages for empty, wrong-type and oversized files.

### Not tested (no way to check it here)

- Real HEIC photos from iPhones: no HEIC encoder was available to make test files.
- Safari's canvas limit (about 16.7 million pixels) and other browsers' maximum canvas sizes. Very large images may still fail on iOS with the generic decode message.

## Part 3: accessibility

Method: axe-core (WCAG 2.x A/AA rules) on every tool page, category page, the home page and a sample of guides (177 pages), in both light and dark mode. Then a keyboard pass on eight representative pages, checking that every element reached with Tab has a visible focus indicator.

### Fixed

| Problem | Where | Fix |
| --- | --- | --- |
| Invalid `<dl>` markup: a `<p>` hint inside the dt/dd group, so screen readers mis-announce the label/value pairs | `Stat`, `StatStrip` and the text tools' `Metric`, which together cover 16 tool pages and the home page | The hint is now a second `<dd>` (same look) |
| Invalid `<dl>`: copy buttons outside the `<dd>` | Timestamp converter, checksum verifier | Button moved into a `<dd>` |
| Two unlabelled `<aside>` landmarks on one page | Scientific calculator, QR code and barcode generators | Tool sidebars named "Calculation history", "QR code preview" and "Barcode preview" |
| Empty table header | Take-home pay deductions table | First column is now "Item" |
| Placeholder text at about 2.5:1 contrast | Resume preview, invoice blank lines, PDF page placeholders | `neutral-400` changed to `neutral-500` (4.7:1 on white) |
| `aria-describedby` pointed at the hint even while it was hidden by an error | `Field` (every form) | Only the visible hint or error describes the control |
| A checkbox's description wasn't linked to it | `Checkbox` | `aria-describedby` added |
| Sliders announced the raw number ("12") instead of the label shown ("12 months") | `Slider` | `aria-valuetext` set from the visible label |
| Progress bars re-announced every percent inside a live region | `Progress` | The percent text is `aria-hidden`; the progressbar still exposes its value |
| No visible keyboard focus on the scientific calculator's expression input; the code editor lost its focus border while showing an error | Scientific calculator, `CodeEditor` (JSON, YAML, XML and similar tools) | The same focus ring the other inputs use |

Already fine: skip link, the `Field` label/error wiring, segmented controls (real radio inputs), `role="alert"` on errors, a polite live region on the toast, and the colour-token contrast script (`npm run contrast`).

### Left as is

- **Markdown to HTML:** task-list checkboxes have no label (axe "label", critical). They are disabled `<input type="checkbox">` elements in the HTML the tool generates, which is the same markup GitHub produces. Adding labels would change what users copy out, so this needs a product decision.

## Part 4: mobile at 320px

Method: all 410 pages in the sitemap loaded at 320 × 700, flagging any page whose document is wider than the viewport. For each one, the cause was narrowed down by hiding elements one at a time. Before: 7 pages overflowed by 1 to 42 px. After: 0 of 410.

| Cause | Pages | Fix |
| --- | --- | --- |
| Long URLs in prose (e.g. `https%3A%2F%2Fexample.com…`) couldn't break | URL encoder how-it-works, SSL name-mismatch guide, and any future text with long tokens | Shared CSS: `overflow-wrap: break-word` on `body` (wraps only words that would otherwise overflow) |
| Segmented control options couldn't shrink below their label width | Lorem ipsum, UUID and text reverser, and every tool that uses `Segmented` | Shared component: the options wrap to a second row when they don't fit |
| 13-digit values in the "every unit" table | Time converter and every other unit converter | Result cells may break inside long numbers |
| Fixed 176 px + 96 px columns around the limit bars | Character counter | Narrower columns below the `sm` breakpoint |

Not covered: pages in states that need input (results tables, long file names) were checked only for the tools exercised in Parts 2 and 3.

## Part 5: performance

Method:
- JS downloaded on first load for every non-guide page, measured in a fresh browser context with the service worker blocked. Sizes are uncompressed.
- Cumulative layout shift (CLS) for the same pages at 390 px and 1280 px.
- A search for heavy libraries imported at the top level of a module.

Every heavy library (pdf-lib, pdf.js, heic-to, mammoth, qrcode, JsBarcode, exifr) is already loaded with `import()` when it's needed. Each tool is its own chunk. Pages load 600–700 KB of JS, almost all of it the shared React/Next runtime. The font is a subset `next/font`, and no image in `public/` is over 100 KB.

### Fixed

| Problem | Before | After |
| --- | --- | --- |
| The hash generator loaded the whole hash-wasm package (every algorithm, 214 KB) as soon as the page opened, only to compute MD5 | 870 KB JS | 673 KB JS. It now imports hash-wasm's single-algorithm MD5 build (10 KB). Output was checked against the existing MD5 test and in the browser. |
| Timestamp converter layout shift: the "Starting the clock…" line was shorter than the clock row that replaced it | CLS 0.074 (desktop) | 0.016. The row's height is reserved. |

Every other page measured CLS ≤ 0.05. One engine cc to hp reading of 0.104 happened only on a cold first load and was 0 on three repeat runs.

### Left as is (needs a decision)

- **Tool UIs are streamed behind a Suspense fallback.** `next/dynamic` in `src/tools/index.tsx` suspends during static prerender. The HTML therefore holds the `ToolSkeleton` in place, and the real tool markup sits in a hidden `<div>` that an inline script swaps in.
  - With JavaScript off, visitors and non-rendering crawlers see only the skeleton. With JavaScript on, the swap usually happens before first paint, but on a cold load it can show the skeleton briefly.
  - Fixing it means changing how the generated tool map loads components, for example importing the active tool statically per route. That affects every page and the bundle split, so I haven't changed it.
- `public/sw.js`, caching headers and the offline warm-up list were not touched. The warm-up still loads the full hash-wasm for the checksum tool, which uses several algorithms.
