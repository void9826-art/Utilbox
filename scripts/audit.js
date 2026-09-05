/**
 * Accessibility and layout audit, run in real Chrome against a live page.
 *
 * Checks the things that are cheap to get wrong and expensive to discover
 * later: unlabelled controls, nameless buttons, heading order, focus
 * visibility, text contrast, and layout that overflows a narrow phone.
 */
(async () => {
  await new Promise((r) => setTimeout(r, 800));

  const problems = [];
  const note = (rule, detail) => problems.push({ rule, detail });

  const describe = (el) =>
    `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${
      el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : ""
    }`;

  const visible = (el) => {
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
    return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
  };

  /* --- the page actually loaded --------------------------------------- */
  // A Chrome network-error page has no stylesheet, no landmarks and two inline
  // images, so it reports as five ordinary accessibility problems rather than
  // as "the server was not running". Say what actually happened.
  if (location.protocol !== "http:" && location.protocol !== "https:") {
    return {
      url: location.href,
      width: window.innerWidth,
      theme: "n/a",
      problems: [{ rule: "PAGE DID NOT LOAD", detail: `${location.href} — ${document.title}` }],
    };
  }

  /* --- the stylesheet actually applied ------------------------------- */
  // Without this, an unstyled page passes every check below: contrast is
  // black-on-white, nothing overflows, and no target is undersized because
  // nothing has a size. A production server left running across a rebuild
  // serves HTML pointing at a chunk hash that no longer exists on disk, and
  // the result looks like a clean audit rather than a 500.
  {
    const linked = [...document.querySelectorAll('link[rel="stylesheet"]')].length;
    const applied = [...document.styleSheets].reduce((total, sheet) => {
      try {
        return total + sheet.cssRules.length;
      } catch {
        return total; // cross-origin sheet; not ours to count
      }
    }, 0);
    if (linked > 0 && applied === 0) {
      note("stylesheet linked but no rules applied", `${linked} link(s), 0 rules — page is unstyled`);
    }
  }

  /* --- every form control needs a name ------------------------------- */
  for (const el of document.querySelectorAll("input, select, textarea")) {
    if (el.type === "hidden") continue;
    const labelled =
      el.labels?.length ||
      el.getAttribute("aria-label") ||
      el.getAttribute("aria-labelledby") ||
      el.getAttribute("title");
    if (!labelled) note("control has no label", describe(el));
  }

  /* --- every button needs an accessible name ------------------------- */
  for (const el of document.querySelectorAll("button, [role=button]")) {
    if (!visible(el)) continue;
    const name = (el.textContent || "").trim() || el.getAttribute("aria-label");
    if (!name) note("button has no accessible name", describe(el));
  }

  /* --- images need alt text ------------------------------------------ */
  for (const el of document.querySelectorAll("img")) {
    if (el.getAttribute("alt") === null) note("image has no alt attribute", el.src.slice(0, 60));
  }

  /* --- exactly one h1, and headings must not skip a level ------------ */
  const headings = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")].filter(visible);
  const h1Count = headings.filter((h) => h.tagName === "H1").length;
  if (h1Count !== 1) note("h1 count is not 1", String(h1Count));

  let previous = 1;
  for (const heading of headings) {
    const level = Number(heading.tagName[1]);
    if (level > previous + 1) {
      note("heading level skipped", `${heading.tagName} after H${previous}: ${heading.textContent.trim().slice(0, 40)}`);
    }
    previous = level;
  }

  /* --- landmarks ------------------------------------------------------ */
  if (!document.querySelector("main")) note("no main landmark", "");
  if (!document.querySelector("header")) note("no header landmark", "");
  if (!document.querySelector("footer")) note("no footer landmark", "");

  /* --- language ------------------------------------------------------- */
  if (!document.documentElement.lang) note("html has no lang", "");

  /* --- text contrast --------------------------------------------------- */
  const luminance = (rgb) => {
    const channel = (value) => {
      const v = value / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
  };
  const parse = (value) => (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);

  /** Walks up until an element paints an opaque background. */
  const backgroundOf = (el) => {
    let node = el;
    while (node && node !== document.documentElement) {
      const bg = getComputedStyle(node).backgroundColor;
      const parts = (bg.match(/[\d.]+/g) || []).map(Number);
      if (parts.length >= 3 && (parts.length === 3 || parts[3] > 0.95)) return parts.slice(0, 3);
      node = node.parentElement;
    }
    return [255, 255, 255];
  };

  const sample = [...document.querySelectorAll("p, span, a, li, dt, dd, label, h1, h2, h3, button")]
    .filter((el) => visible(el) && el.children.length === 0 && (el.textContent || "").trim().length > 2)
    .slice(0, 220);

  for (const el of sample) {
    const style = getComputedStyle(el);
    const fg = parse(style.color);
    const bg = backgroundOf(el);
    if (fg.length < 3) continue;

    const l1 = luminance(fg);
    const l2 = luminance(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    const size = parseFloat(style.fontSize);
    const bold = Number(style.fontWeight) >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const required = large ? 3 : 4.5;

    if (ratio < required) {
      note(
        "contrast below AA",
        `${ratio.toFixed(2)}:1 (needs ${required}) ${Math.round(size)}px "${el.textContent.trim().slice(0, 34)}"`,
      );
    }
  }

  /* --- focus must be visible ------------------------------------------ */
  // Chrome only matches :focus-visible for keyboard-like focus, and there is
  // no way to fake that from script — calling focus() reports nothing on every
  // control. What can be checked is that the rule exists and paints an outline.
  // Tailwind v4 emits its base rules inside @layer, and grouping rules hold
  // their children in a nested cssRules list, so the walk has to recurse.
  const findFocusRule = (rules) => {
    for (const rule of rules ?? []) {
      if (rule.selectorText?.includes(":focus-visible")) {
        const outline = rule.style?.outline || rule.style?.outlineWidth;
        if (outline) return `${rule.selectorText} { outline: ${outline} }`;
      }
      if (rule.cssRules) {
        const nested = findFocusRule(rule.cssRules);
        if (nested) return nested;
      }
    }
    return null;
  };

  let focusRule = null;
  for (const sheet of document.styleSheets) {
    let rules;
    try {
      rules = sheet.cssRules;
    } catch {
      continue; // cross-origin stylesheet
    }
    focusRule = findFocusRule(rules);
    if (focusRule) break;
  }
  if (!focusRule) note("no global :focus-visible outline rule", "");

  /* --- nothing may overflow the viewport ------------------------------ */
  const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  if (overflow > 1) {
    const wide = [...document.querySelectorAll("body *")]
      .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
      .slice(0, 3)
      .map(describe);
    note("horizontal overflow", `${overflow}px past the viewport: ${wide.join(", ")}`);
  }

  /* --- touch targets on a phone --------------------------------------- */
  if (window.innerWidth < 500) {
    for (const el of document.querySelectorAll("button, a[href]")) {
      if (!visible(el)) continue;
      const rect = el.getBoundingClientRect();
      // Inline links inside a paragraph are exempt; standalone controls are not.
      const inline = el.tagName === "A" && el.closest("p, li");
      // A visually-hidden control (the skip link) is 1px by design and only
      // takes up space once focused, so the size rule does not apply to it.
      const visuallyHidden = rect.height <= 2 || rect.width <= 2;
      if (!inline && !visuallyHidden && rect.height > 0 && rect.height < 24) {
        note("touch target under 24px", `${Math.round(rect.height)}px ${describe(el)}`);
      }
    }
  }

  return {
    url: location.pathname,
    width: window.innerWidth,
    theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
    problems,
  };
})();
