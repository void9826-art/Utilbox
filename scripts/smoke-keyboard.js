/**
 * Keyboard and dialog behaviour, driven with real key events.
 *
 * Checks the things a mouse never exercises: the skip link, the search palette
 * shortcut, Escape closing an overlay and returning focus, and the mobile menu
 * toggle reporting its state.
 */
(async () => {
  const results = [];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const check = (name, pass, detail) => results.push({ name, pass: !!pass, detail });

  const waitFor = async (fn, tries = 40) => {
    for (let i = 0; i < tries; i += 1) {
      try {
        const value = fn();
        if (value) return value;
      } catch {
        /* not ready */
      }
      await wait(100);
    }
    return null;
  };

  const key = (target, init) =>
    target.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init }));

  /* --- the skip link is the first thing a keyboard reaches --------------- */
  const skip = document.querySelector("a[href^='#']");
  check("a skip link is the first link in the document",
    !!skip && /skip/i.test(skip.textContent), skip?.textContent.trim());
  if (skip) {
    skip.focus();
    check("the skip link takes focus", document.activeElement === skip,
      document.activeElement?.tagName);
    check("it points at the main landmark",
      !!document.querySelector(skip.getAttribute("href")), skip.getAttribute("href"));

    // The link is 1px until focused, and it must stop being 1px when it is.
    // :focus cannot be observed here — a window Chrome does not consider
    // focused never matches it, whether headless or not — so check the rule
    // that does the revealing is present and sets a real size.
    const revealing = (() => {
      for (const sheet of document.styleSheets) {
        let rules;
        try {
          rules = sheet.cssRules;
        } catch {
          continue;
        }
        const walk = (list) => {
          for (const rule of list ?? []) {
            if (
              rule.selectorText?.includes(":focus") &&
              rule.selectorText?.includes("not-sr-only") &&
              rule.style?.width === "auto" &&
              rule.style?.height === "auto"
            ) {
              return rule.selectorText;
            }
            if (rule.cssRules) {
              const found = walk(rule.cssRules);
              if (found) return found;
            }
          }
          return null;
        };
        const found = walk(rules);
        if (found) return found;
      }
      return null;
    })();
    check("a :focus rule un-hides it", !!revealing, revealing);
    check("and the link carries that class", /focus:not-sr-only/.test(skip.className),
      skip.className.split(" ").slice(0, 2).join(" "));
  }

  /* --- every interactive control must be reachable ----------------------- */
  const focusable = [...document.querySelectorAll("a[href], button, input, select, textarea")]
    .filter((el) => el.offsetParent !== null && !el.disabled);
  const unreachable = focusable.filter((el) => el.tabIndex < 0 && el.type !== "file");
  check("no visible control is removed from the tab order", unreachable.length === 0,
    unreachable.slice(0, 3).map((el) => el.tagName + "." + String(el.className).split(" ")[0]).join(", "));

  /* --- the search palette ------------------------------------------------ */
  // The wide header shows a labelled search box; the narrow one collapses it to
  // an icon button. Take whichever is actually on screen.
  const trigger = [...document.querySelectorAll("button")].find(
    (b) =>
      b.offsetParent !== null &&
      (/Search \d+ tools/.test(b.textContent) || /search/i.test(b.getAttribute("aria-label") ?? "")),
  );
  check("the header offers a search trigger", !!trigger,
    trigger?.textContent.trim() || trigger?.getAttribute("aria-label"));

  // Focus the trigger first: the palette restores focus to whatever held it
  // when it opened, so leaving focus on the skip link would test nothing.
  trigger?.focus();

  // Once only: the shortcut toggles, so sending both Cmd+K and Ctrl+K would
  // open the palette and immediately close it again.
  key(document.body, { key: "k", ctrlKey: true });
  const dialog = await waitFor(() => document.querySelector("[role=dialog][aria-modal=true]"));
  check("Ctrl+K opens the search palette", !!dialog, dialog?.getAttribute("aria-label"));

  if (dialog) {
    const field = dialog.querySelector("input");
    check("focus moves into the search field", document.activeElement === field,
      document.activeElement?.id || document.activeElement?.tagName);

    // Typing must narrow the list, and the list must be announced as one.
    const proto = window.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(field, "merge");
    field.dispatchEvent(new Event("input", { bubbles: true }));
    await wait(400);
    const list = dialog.querySelector("[role=listbox]");
    const options = list ? [...list.querySelectorAll("[role=option]")] : [];
    check("typing filters the results", options.length > 0 && options.length < 20,
      `${options.length} results`);
    check("the first result is the obvious one", /merge/i.test(options[0]?.textContent ?? ""),
      options[0]?.textContent.trim().slice(0, 40));

    key(field, { key: "Escape" });
    await wait(400);
    check("Escape closes it", !document.querySelector("[role=dialog][aria-modal=true]"));
    check("and focus returns to the trigger", document.activeElement === trigger,
      document.activeElement?.textContent?.trim().slice(0, 30));
  }

  /* --- the mobile menu --------------------------------------------------- */
  const burger = document.getElementById("mobile-navigation")
    ? null
    : [...document.querySelectorAll("button[aria-controls=mobile-navigation]")][0];
  if (burger && burger.offsetParent !== null) {
    check("the menu button reports it is closed", burger.getAttribute("aria-expanded") === "false",
      burger.getAttribute("aria-expanded"));
    burger.click();
    await wait(400);
    check("and reports it is open once pressed", burger.getAttribute("aria-expanded") === "true",
      burger.getAttribute("aria-expanded"));
    check("the panel it names exists", !!document.getElementById("mobile-navigation"));
    key(document.body, { key: "Escape" });
    await wait(400);
    check("Escape closes the menu", burger.getAttribute("aria-expanded") === "false",
      burger.getAttribute("aria-expanded"));
  }

  return results;
})();
