# Visual and mobile audit, utilboxes.xyz (2026-11-19)

Pages: /, /pdf, /pdf/merge-pdf, /image/compress-image, /calculators/emi-calculator, /guides/how-to-merge-pdf-files.
Chrome (channel=chrome), 1440x900 and 375x812 (2x, touch). Screenshots: `../screenshots/<page>-<375|1440>-<fold|full>.png`.
Measured 5 s after DOMContentLoaded, cold visit (consent banner showing, no ads rendered).

Score: 78/100. Layout is sound: no horizontal overflow, zero CLS, tool inputs sit near the top. The cold-visit consent banner and small tap targets are the real problems.

## Findings

### 1. HIGH, mobile consent banner covers the tool on first visit
Evidence: the fixed banner is 240px tall at 375px (top 572 to 812, 30% of the viewport) and has no scrim. On /pdf/merge-pdf the drop zone spans y=489 to 725, so about 153px of it (the label, the "choose files" text and the lower half) is under the banner. The screenshot confirms it: only the upload icon is visible. On the EMI calculator, input 1 is at y=491 to 529 and is clear, but input 2 (y=570 to 608) is partly behind the banner. The same banner appears on the home, hub and guide pages. On desktop it is 162px and does not overlap the tool (drop zone ends at y=616, banner starts at y=738).
Fix: on mobile, make the banner a compact bar of about 96px: one line of copy, the Reject and Accept buttons side by side, and no heading ("Analytics cookies" is redundant). Use `p-3` and `text-sm`. Keep Reject and Accept equally prominent for GDPR. Do not add a backdrop.

### 2. HIGH, tool is not fully above the fold on mobile (before the banner)
Evidence: the tool card starts at y=489 on PDF and image tools (drop zone 236px and 220px high, so it ends at y=725 to 709, inside the 812px fold). The ~120px intro paragraph at the top of the page pushes it down. The intro is rendered at about 18px or larger beside a 56px icon, so the paragraph is squeezed into a 285px column and wraps to 9 lines. The EMI calculator's first field starts at y=491, similar.
Fix: let the lead paragraph span the full width under the icon and H1 row (`flex-col` below `sm`), drop it to `text-base`, and clamp it with `line-clamp-3`, with the full text further down. This should lift the tool card to about y=330 and clear the banner too. The "Files never leave your device" pill and the "Updated" line can sit below the tool on mobile.

### 3. MEDIUM, tap targets below 44px
Evidence at 375px: header search, theme and menu buttons are 36x36, the logo link is 100x34, breadcrumb links are 36x20 (e.g. "Home"), and "View all 154 tools" is 133x24. Counts of interactive elements under 44px in either dimension: 201 of 226 on the home page, 64 of 165 on /pdf, and 44 to 56 on the other pages. Many are inline text links in the footer and the guide lists. Nothing is under 24px except the skip link, which is intentionally 1x1 until focused.
Fix: header buttons `size-11` (44px). Breadcrumb and footer links get `py-3` or `min-h-11 inline-flex items-center`. Give "View all" `py-2.5`. Keep the visual layout otherwise.

### 4. MEDIUM, calculator inputs are 38px tall
Evidence: EMI number inputs measure 309x38. The PDF hub search input is correctly 44px (`h-11`), so the calculators are inconsistent with it.
Fix: use `h-11` on calculator inputs, and `text-base` (16px) so iOS Safari does not zoom on focus. I did not verify the input font-size, so check it.

### 5. LOW, small text
Evidence: 11px text on 9 to 18 elements per page (home: 18; tool pages: 9 to 10; guide: 7). 12px on up to 16 elements on the calculator, and 13px on 35 to 349 elements (calculator tables use `text-[0.8125rem]`). Body copy and the H1 (24px mobile, 36px on the home page at 375) are fine.
Fix: raise the 11px labels to 12px at least, and the table text to 14px. No other change is needed.

### 6. LOW, calculator amortisation table is wider than the viewport
Evidence: the table is 458px wide (right edge at 505) inside a 375px page. The document does not overflow (scrollWidth 375), so it sits in a scroll wrapper. The sticky `thead` also overlaps the wrapper's edge.
Fix: confirm the wrapper has `overflow-x-auto` and a visible fade or scroll hint, or hide the least useful columns below `sm`. No change is needed if the scrolling is intended.

### 7. INFO, ad slots and layout shift
Evidence: `ins.adsbygoogle` exists on every page but renders at 0x0 (unfilled or not yet served), with two hidden Google iframes. CLS is 0 on all 12 page loads. Ads are not currently affecting the layout.
Risk: once ads fill, each slot with no reserved height will push the tool down. Fix before enabling: give each slot `min-h-[280px]` (mobile) or `min-h-[90px]` (desktop) with `contain: layout`, and do not place an ad above the tool card. Place the first ad below the tool.

### 8. PASS
- No horizontal overflow at 375px on any of the six pages (scrollWidth 375).
- The desktop tool is above the fold: drop zone y=364 to 616 of 900.
- The pages use a limited type scale, and the H1 is visible without scrolling on every page.
- The "Skip to content" link is present.

## Not checked
Consent banner after Accept or Reject (a returning visitor), landscape and tablet widths, a real ad fill, keyboard focus order, and the guide page screenshots beyond the metrics (no input, no overflow).
