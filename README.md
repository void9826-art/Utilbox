# Utilbox

73 free browser utilities — PDF tools, calculators, image tools, unit
converters, generators, text tools and developer tools — in one Next.js app.

71 of the 73 run entirely in the visitor's browser. Files are read into memory,
changed there, and handed straight back as a download. Nothing is uploaded, so
there is no queue, no server-imposed size cap, and nothing left behind when the
tab closes. The two exceptions are stated on the tools themselves.

---

## Running it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

`npm install` and `npm run dev` both copy the pdf.js worker and its support
assets (CMaps, standard fonts, WebAssembly modules) into `public/pdfjs`, so
nothing is fetched from a third-party CDN at runtime.

Copy `.env.example` to `.env.local` if you want to change the brand name, add
your contact details, or switch on ads and analytics. Everything is optional.

### Scripts

| Command                | What it does                                                     |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run dev`          | Development server                                                |
| `npm run build`        | Copies pdf.js assets, regenerates the tool map, builds            |
| `npm start`            | Serves the production build                                       |
| `npm run lint`         | ESLint                                                            |
| `npm run typecheck`    | `tsc --noEmit`                                                    |
| `npm test`             | Unit tests for the calculation, parsing and formatting libraries  |
| `npm run validate`     | Checks the registry is complete and every icon resolves           |
| `npm run generate:tools` | Rewrites `src/tools/index.tsx` from the registry                |

Further suites need the production server running. One is plain Node; the rest
drive the machine's own Chrome, because the embedded preview pane does not
composite reliably.

```bash
npm start                      # in one terminal, then:
npm run test:seo               # 87 pages: titles, canonicals, headings, links
./scripts/smoke.ps1            # 41 checks over 20 tools
./scripts/smoke2.ps1           # 96 checks over the other 33 non-file tools
./scripts/smoke3.ps1           # 51 checks over the PDF and image file tools
./scripts/smoke-ocr.ps1        # 7 checks; two passes, the first warms the model
./scripts/smoke-keyboard.ps1   # 43 checks: skip link, palette, focus, Escape
./scripts/audit.ps1            # 11 pages x 6 widths, dark mode at two of them
```

Between them the interaction suites drive all 73 tools. Each takes `-Only` to
narrow the run to matching pages, e.g. `./scripts/smoke2.ps1 -Only calculators`.

---

## How it is put together

```
src/
  app/                     Routes. Two dynamic segments cover every tool page.
    [category]/page.tsx        category landing pages
    [category]/[slug]/page.tsx tool pages — server-rendered content + lazy tool
    api/rates/route.ts         the only server endpoint (exchange rates)
    sitemap.ts, robots.ts      generated from the registry
  components/
    layout/                header, footer, search palette, theme toggle
    tool/                  dropzone, file list, code editor, result panel, …
    ui/                    button, field, surfaces — the design primitives
    ads/                   AdSlot
  config/
    site.ts                brand, ads and analytics configuration
    categories.ts          the seven categories
    tools/                 the registry: metadata only, safe for the client
    content/               long-form page copy — server-only, never bundled
  lib/                     the actual work: pdf, image, money, units, csv, …
  tools/
    <category>/<slug>.tsx  one file per tool
    index.tsx              generated map of lazily-imported tools
```

### The registry is the source of truth

`src/config/tools/` holds one entry per tool. From it the app derives
navigation, the mega menu, search, category pages, related-tool links, the
sitemap, breadcrumbs and structured data. Nothing about a tool is written down
twice.

Long-form copy lives separately in `src/config/content/`, which is marked
`server-only`. That keeps roughly 150 KB of prose out of the client bundle
while still rendering it as crawlable HTML.

### Adding a tool

1. Add a `ToolMeta` entry to the right file in `src/config/tools/`.
2. Add a matching `ToolContent` entry in `src/config/content/`.
3. Create `src/tools/<category>/<slug>.tsx` with a default-exported component.
4. `npm run generate:tools && npm run validate`

The page, the card, the search entry, the sitemap row and the internal links
all appear on their own. `npm run validate` fails the build if a tool is
missing its content, or if a related-tool link points at a slug that does not
exist.

### Bundles

Every tool is a separate lazily-imported chunk, so opening the word counter
does not download a PDF engine. The heavy libraries are imported inside the
handler that needs them:

| Library      | Loaded by                        | Roughly |
| ------------ | -------------------------------- | ------- |
| pdf.js       | any tool that reads a PDF        | 1.2 MB  |
| pdf-lib      | any tool that writes a PDF       | 350 KB  |
| tesseract.js | Image to Text, on first run      | several MB incl. the language model |
| libheif      | HEIC to JPG, on first run        | several MB |
| mammoth      | Word to PDF                      | 200 KB  |

---

## Design

The palette is four colours — `#FFFFFF`, `#E0E0E0`, `#616161`, `#212121` —
with a small number of derived steps where AA contrast demands them. The
primary action inverts with the theme: near-black on light, near-white on dark.

Because there is no hue to lean on, status is carried three ways at once: a
distinct icon, a heavier rule, and a darker fill, with danger inverting
entirely. Nothing in the interface depends on colour alone.

`npm run` the contrast checker to prove the scale:

```bash
node scripts/contrast.mjs
```

Tokens live in `src/app/globals.css`. Light is the base; `.dark` redefines only
the raw values, so every utility built on them flips automatically.

---

## Testing

- `scripts/test-lib.mjs` — money arithmetic, unit factors, JSON error
  positions, CSV escaping, Base64 round-trips, PDF page ranges, table detection
  and filename sanitisation.
- `scripts/test-expression.mjs` — the scientific calculator's parser, including
  operator precedence and every error path.
- `scripts/test-ooxml.mjs` — unpacks the generated `.docx` and `.xlsx` and
  checks every required part is present and well-formed.
- `scripts/verify-examples.mjs` — recomputes every worked example printed on a
  tool page and fails if the copy and the code disagree.
- `scripts/smoke.ps1`, `smoke2.ps1`, `smoke3.ps1`, `smoke-ocr.ps1` — every one
  of the 73 tools driven in real Chrome, with valid, empty, zero and malformed
  input. File tools are given real files and the file they hand back is checked
  byte by byte; a produced PDF is fed back into the tool that made it so its
  page count is read from a parser rather than guessed at.
- `scripts/smoke-keyboard.ps1` — the skip link, the Ctrl+K palette, focus
  restoration, and Escape closing the mobile menu.
- `scripts/audit-seo.mjs` — crawls all 87 sitemap URLs for unique titles and
  descriptions, self-referencing canonicals, one h1, unskipped heading levels,
  Open Graph tags, parseable JSON-LD, broken internal links and orphan pages.
- `scripts/audit.ps1` — labels, heading order, landmarks, contrast, focus,
  overflow and touch-target size, over 11 pages at 320, 375, 390, 430, 768 and
  1440px, with dark mode checked at 390 and 1440 — 88 combinations. It first checks the page loaded at all and then
  that the stylesheet applied, because a Chrome error page and an unstyled page
  both otherwise pass every one of those checks.

---

## Deploying to Vercel

1. Push the repository to GitHub.
2. Import it at <https://vercel.com/new>. The framework is detected
   automatically; no build settings need changing.
3. Add any environment variables you want from `.env.example`. None are
   required for a working deployment.
4. Deploy.

After adding a custom domain, set `NEXT_PUBLIC_SITE_URL` to it so canonical
URLs, Open Graph tags and the sitemap all point at the right origin.

Every page except `/api/rates` is statically generated at build time — 94
pages in total — so the site serves from the edge cache.

---

## What needs an external service

Only the currency converter. It calls `/api/rates`, which fetches the European
Central Bank's daily reference rates through Frankfurter — free, no key, no
account. The request carries a three-letter currency code and nothing else; the
amount the visitor types is converted in the browser. Responses are cached for
an hour, since the source publishes once a working day. If the feed cannot be
reached the tool says so and shows no figure, rather than a stale or invented
rate.

`src/lib/rates.ts` defines a provider interface so a keyed service can be
swapped in through `EXCHANGE_RATE_PROVIDER` and `EXCHANGE_RATE_API_KEY` without
touching the tool.

---

## Known limitations

These are properties of the approach, and each is stated on the tool's own page
rather than left for a visitor to discover:

- **PDF to Word** recovers text and page structure, not layout. Columns,
  tables and exact fonts belong to the PDF's visual layer and cannot be rebuilt
  from text positions.
- **Compress PDF** works by re-rendering pages as images, which is very
  effective on scans and ineffective on text-only documents. The text layer
  does not survive; the tool warns when the output would be larger and offers
  the original instead.
- **PDF to Excel** infers columns from where text sits on the page, because a
  PDF stores no table structure. Merged and wrapped cells are where it is most
  likely to be wrong, which is why the grid is shown before you download.
- **Word to PDF** rebuilds the document from its text structure. Images,
  embedded fonts and table borders are not reproduced.
- **Scanned PDFs** have no text layer at all. The PDF text tools detect this
  and point at the OCR tool.
- **OCR** is accurate on clear printed text and unreliable on handwriting,
  angled photographs and poor lighting.
- **Very large files** are bounded by device memory rather than a server limit,
  so a long document at high resolution can be slow on an older phone.
- **Legacy `.doc`** is a binary format browsers cannot read. Resave as `.docx`.
- **Encrypted PDFs** cannot be opened without the password; the tool says so
  rather than failing silently.

---

## Licence and third-party code

Built on Next.js, React and Tailwind CSS, with pdf.js, pdf-lib, Tesseract,
libheif, mammoth, fflate, qrcode, JsBarcode and lucide-react each used under
its own licence.
