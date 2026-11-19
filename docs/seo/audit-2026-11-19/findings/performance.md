# Performance audit (LAB, 2026-11-19) - https://www.utilboxes.xyz

Method: own Playwright harness (Chrome channel), mobile emulation 412x823, CDP 150 ms RTT / 1.6 Mbps / 4x CPU, cache disabled, cold load, 6 s idle, no consent click, no interaction. One run per page (single-run lab data; field CrUX not checked). Scratch: ub-perf/run.py + out.json.

Score estimate: ~90/100 (lab). CWV (lab): LCP pass, CLS pass, INP not measurable (no interaction; longest task 266 ms at 4x CPU).

## Per page (lab)
| Page | TTFB | FCP | LCP (element) | CLS | Long tasks (4x) | JS KB (wire) | Total KB | DOM |
|---|---|---|---|---|---|---|---|---|
| / | 3211* | 3908* | 3908 (h1) | 0 | 154,82,130 ms | 413 | 588 | 1023 |
| /pdf | 409 | 1108 | 1108 (p.prose-content) | 0 | 248,160,91,120 | 415 | 613 | 1009 |
| /pdf/merge-pdf | 504 | 1236 | 1236 (hero p) | 0.0001 | 241,135,203,122 | 432 | 587 | 538 |
| /image/compress-image | 552 | 1328 | 1328 (hero p) | 0 | 230,148,105,90 | 437 | 593 | 537 |
| /calculators/emi-calculator | 284 | 1180 | 1180 (hero p) | 0 | 266,171,125,109 | 436 | 681 | 992 |
| /guides/how-to-merge-pdf-files | 322 | 1064 | 1064 (p) | 0 | 138,82,110 | 412 | 627 | 396 |

*Home TTFB 3.2 s was a one-off network stall in the first run: 3 follow-up curls from this machine gave 0.25-0.71 s. Re-run before treating as real. Excluding it, mobile LCP is 1.1-1.3 s, better than the 1.8 s baseline.

## Findings
1. MEDIUM - AdSense loads before any consent on every page. Evidence: pagead2.googlesyndication.com 222 KB (show_ads_impl 166 KB + adsbygoogle.js 56 KB) plus ep1/ep2.adtrafficquality.google 21 KB and doubleclick requests, with no consent action. That is about 54% of all JS bytes (222 of ~415 KB). Source: src/app/layout.tsx loads the script unconditionally (strategy afterInteractive); only GA is gated by CookieConsent. Perf impact is limited (afterInteractive, no CLS seen), but it is the main compliance/CWV risk (EEA/UK need CMP consent for personalised ads). Fix: gate adsbygoogle on consent or use a Google-certified CMP / non-personalised-ads mode; keep afterInteractive or move to lazyOnload.
2. LOW - CLS clean. Ad slots reserve min-h (100/90/250 px) in ad-slot.tsx; only shift 0.0001 on merge-pdf (breadcrumb LI text). Tool UIs do not shift. No action. Note: lab ads may not fill, so verify with real filled ads in field CLS.
3. LOW - Heavy libs not on critical path, but pdf.js worker is prefetched. On /pdf/merge-pdf pdf.worker.legacy.min.mjs is fetched within the idle window with no interaction (offline-warmup.tsx, requestIdleCallback timeout 4 s, loads pdf.js and the worker). It is after LCP, so no LCP/CLS impact, but it costs mobile data and competes with AdSense on a 1.6 Mbps link. Image codecs (compress-image) were not fetched before interaction. Fix: skip warmup when navigator.connection.saveData or effectiveType is slow, or only warm after first user gesture/file-input focus.
4. LOW - Main-thread: 3-6 long tasks per page, max 266 ms at 4x CPU (about 65 ms at real speed, so TBT proxy at 4x about 400-600 ms, mostly hydration at ~0.7-1.0 s plus AdSense at ~2.4-4.2 s). Not an INP failure by itself. Fix: defer AdSense to lazyOnload or after idle; check INP in field.
5. INFO - Caching is correct. HTML: public, max-age=0, must-revalidate, x-vercel-cache HIT, brotli. /_next/static: public,max-age=31536000,immutable, brotli. First-party JS ~190-230 KB wire per page across 14-21 scripts (largest chunks 71 KB and 45 KB shared). Third-party hosts: only Google ad domains; no GA/gtag before consent (gated correctly).
6. INFO - DOM sizes OK (396-1023, under 1,500). / and /pdf are largest at ~1,000.

## Not checked
INP with real interaction, tool-use heavy-lib load (merge/compress after file select), CrUX field data, repeat-visit/SW cache, filled-ad CLS, multiple runs for variance.
