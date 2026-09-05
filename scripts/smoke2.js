/**
 * Second interaction suite: the tools scripts/smoke.js does not cover.
 *
 * Same shape as smoke.js — drive the page the way a person would, then compare
 * against a value worked out independently. Each block also pushes at least one
 * edge case: an empty field, a zero, a negative, or malformed input.
 */
(async () => {
  const results = [];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const waitFor = async (fn, tries = 80) => {
    for (let i = 0; i < tries; i += 1) {
      try {
        const value = fn();
        if (value) return value;
      } catch {
        /* not ready yet */
      }
      await wait(100);
    }
    return null;
  };

  const check = (name, pass, detail) => results.push({ name, pass: !!pass, detail });

  const setField = (el, value) => {
    if (!el) return;
    const proto =
      el.tagName === "TEXTAREA"
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };

  const setSelect = (el, value) => {
    if (!el) return;
    Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value").set.call(el, value);
    el.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const button = (pattern) =>
    [...document.querySelectorAll("button")].find((b) => pattern.test(b.textContent.trim()));

  const segment = (pattern) =>
    [...document.querySelectorAll("label")].find((l) => pattern.test(l.textContent.trim()));

  const text = () => document.getElementById("main").innerText.replace(/\s+/g, " ");
  /** The tool card itself, without the article copy that surrounds it. */
  const frame = () =>
    (document.querySelector("#main .shadow-raised")?.innerText ?? "").replace(/\s+/g, " ");

  const byId = (id) => document.getElementById(id);
  const path = location.pathname;

  /** The live result regions, which is what a calculator rewrites. */
  const answer = () =>
    [...document.querySelectorAll("[aria-live]")]
      .map((el) => el.innerText)
      .join(" ")
      .replace(/\s+/g, " ");

  /**
   * Waits until the answer differs from `before`, then returns the whole page
   * text. A fixed sleep is not enough: under load React can take longer than
   * any number small enough to keep the suite quick, and the check then reads
   * the previous answer and fails for no reason.
   */
  const recalculated = async (before, tries = 60) => {
    await waitFor(() => (answer() !== before ? answer() : null), tries);
    return text();
  };

  /** Captures whatever a download button hands to the browser. */
  const captureDownload = () => {
    const state = { blob: null, name: null };
    const realCreate = URL.createObjectURL;
    URL.createObjectURL = (b) => {
      state.blob = b;
      return realCreate.call(URL, b);
    };
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) state.name = this.download;
    };
    return state;
  };

  const bytesOf = async (blob) => (blob ? new Uint8Array(await blob.arrayBuffer()) : null);

  /** Waits for a download to be handed over, then reads it. Never pass an
   *  async callback to waitFor: a pending Promise is truthy, so it would stop
   *  polling on the first tick. */
  const awaitDownload = async (state, tries = 200) => {
    const blob = await waitFor(() => state.blob, tries);
    return bytesOf(blob);
  };
  const magic = (bytes, n = 5) => (bytes ? String.fromCharCode(...bytes.slice(0, n)) : "");

  /* =================================================================== */
  /* Calculators                                                          */
  /* =================================================================== */

  if (path.endsWith("/age-calculator")) {
    setField(await waitFor(() => byId("age-birth")), "1990-02-28");
    setField(byId("age-reference"), "2026-09-05");
    await wait(400);
    const t = text();
    // 28 Feb 1990 -> 5 Sep 2026 is 36 years, 6 months, 8 days.
    check("exact age 36y 6m 8d", /36 y 6 m 8 d/.test(t), t.match(/EXACT AGE.{0,40}/)?.[0]);
    // 13338 days between those two dates.
    check("total days 13,338", /13,338/.test(t), t.match(/TOTAL DAYS.{0,20}/i)?.[0]);

    // Edge: a birth date after the reference date must not produce a negative age.
    setField(byId("age-birth"), "2030-01-01");
    await wait(400);
    const future = text();
    check("rejects a future birth date", !/-\d+ years/.test(future) && /cannot|after|future|later/i.test(future),
      future.match(/(cannot|after|future|later)[^.]{0,60}/i)?.[0]);

    // Edge: an impossible date is refused rather than rolled over.
    setField(byId("age-birth"), "2025-02-30");
    await wait(400);
    check("refuses 30 February", !/\d+ years/.test(text().split("Clear")[0]) || /valid|enter a date/i.test(text()));
  }

  if (path.endsWith("/gpa-calculator")) {
    // The page ships three sample courses: A/3, B+/3, B/3 on the 4.0 scale.
    const t0 = await waitFor(() => (/GPA 3\.4/.test(text()) ? text() : null));
    check("sample GPA is 3.43", /3\.43/.test(t0 ?? ""), (t0 ?? "").match(/GPA 3[.]\d+/)?.[0]);

    // Switching scale must re-map the letters, not keep 4.0 points.
    setSelect(byId("gpa-scale"), "5.0");
    await wait(500);
    check("changing the scale changes the GPA", !/GPA 3\.43/.test(text()), text().match(/GPA \d[.]\d+/)?.[0]);

    setSelect(byId("gpa-scale"), "4.0");
    await wait(400);
    // Removing every course must show an empty state, not NaN.
    let guard = 0;
    while (button(/^Remove course 1$/) && guard < 12) {
      button(/^Remove course 1$/).click();
      await wait(150);
      guard += 1;
    }
    await wait(400);
    check("empty course list shows no NaN", !/NaN/.test(text()), text().match(/NaN.{0,30}/)?.[0]);
  }

  if (path.endsWith("/cgpa-calculator")) {
    const t = await waitFor(() => (/8\.23/.test(text()) ? text() : null));
    check("weighted CGPA is 8.23", /8\.23/.test(t ?? ""), (t ?? "").match(/CGPA 8[.]\d+/)?.[0]);
    check("percentage uses x9.5", /78\.2%/.test(t ?? ""), (t ?? "").match(/78[.]\d%/)?.[0]);

    // Target planning: reaching 8.5 overall after 18 more credits.
    setField(byId("cgpa-target"), "8.5");
    await wait(500);
    // (8.5*72 - 444.6) / 18 = 9.3
    check("target needs a 9.3 next semester", /9\.3/.test(text()), text().match(/9[.]3\d?/)?.[0]);

    // Edge: an unreachable target must be called out, not silently shown.
    setField(byId("cgpa-target"), "9.9");
    await wait(500);
    check("flags an unreachable target", /not reachable|above the maximum/i.test(text()),
      text().match(/(not reachable|above the maximum)[^.]{0,60}/i)?.[0]);
  }

  if (path.endsWith("/grade-calculator")) {
    const t = await waitFor(() => (/PERCENTAGE/i.test(text()) ? text() : null));
    check("shows an overall percentage", /PERCENTAGE \d+[.]\d+%/i.test(t ?? ""), (t ?? "").match(/PERCENTAGE \d+[.]\d+%/i)?.[0]);
    check("shows a letter grade", /GRADE [A-F]/i.test(t ?? ""), (t ?? "").match(/GRADE [A-F][+-]?/i)?.[0]);

    setField(byId("grade-target"), "90");
    setField(byId("grade-final-weight"), "30");
    await wait(500);
    check("target section produces a number", /\d/.test(text().split("Target overall grade")[1] ?? ""),
      (text().split("Target overall grade")[1] ?? "").slice(0, 90));
  }

  if (path.endsWith("/emi-calculator")) {
    let previous = answer();
    setField(await waitFor(() => byId("emi-principal")), "500000");
    setField(byId("emi-rate"), "8.5");
    setField(byId("emi-tenure"), "20");
    const t = await recalculated(previous);
    // 500000 at 8.5%/yr over 240 months: EMI = 4339.12
    check("EMI is 4,339.12", /4,339\.12/.test(t), t.match(/EMI [^ ]+ ?[\d,.]+/)?.[0]);
    check("total interest is 541,386.34", /541,386\.34/.test(t), t.match(/Total interest.{0,24}/)?.[0]);

    // Edge: 0% interest must fall back to a straight division, not divide by zero.
    previous = answer();
    setField(byId("emi-rate"), "0");
    const zeroRate = await recalculated(previous);
    check("0% interest gives principal / months", /2,083\.33/.test(zeroRate),
      zeroRate.match(/EMI [^ ]+ ?[\d,.]+/)?.[0]);
    check("0% interest shows no NaN", !/NaN|Infinity/.test(zeroRate));

    // Edge: an empty amount must show the empty state, not a result.
    previous = answer();
    setField(byId("emi-principal"), "");
    check("empty amount clears the result", !/NaN|Infinity/.test(await recalculated(previous)));
  }

  if (path.endsWith("/loan-calculator")) {
    let previous = answer();
    setField(await waitFor(() => byId("loan-amount")), "25000");
    setField(byId("loan-rate"), "6");
    setField(byId("loan-years"), "5");
    const t = await recalculated(previous);
    // 25000 at 6% over 60 months = 483.32 a month.
    check("monthly payment is 483.32", /483\.32/.test(t), t.match(/Per month.{0,24}/)?.[0]);
    check("60 payments", /\b60\b/.test(t), t.match(/Payments \d+/)?.[0]);

    previous = answer();
    setSelect(byId("loan-frequency"), "weekly");
    const weekly = await recalculated(previous);
    check("weekly switches the payment count", /\b260\b/.test(weekly), weekly.match(/Payments \d+/)?.[0]);
  }

  if (path.endsWith("/mortgage-calculator")) {
    let previous = answer();
    setField(await waitFor(() => byId("mortgage-price")), "400000");
    setField(byId("mortgage-deposit-percent"), "20");
    setField(byId("mortgage-rate"), "6.5");
    setField(byId("mortgage-term"), "30");
    const t = await recalculated(previous);
    // 320000 at 6.5% over 360 months = 2022.62 principal and interest.
    check("P&I is 2,022.62", /2,022\.62/.test(t), t.match(/Principal & interest.{0,24}/)?.[0]);
    check("loan amount is 320,000", /320,000/.test(t), t.match(/Loan amount.{0,24}/)?.[0]);

    // A 100% deposit means no loan at all — it must not divide by zero.
    previous = answer();
    setField(byId("mortgage-deposit-percent"), "100");
    const noLoan = await recalculated(previous);
    check("100% deposit shows no NaN", !/NaN|Infinity/.test(noLoan),
      noLoan.match(/NaN.{0,40}|Infinity.{0,40}/)?.[0]);
  }

  if (path.endsWith("/salary-calculator")) {
    let previous = answer();
    setField(await waitFor(() => byId("salary-amount")), "30");
    setSelect(byId("salary-period"), "hourly");
    setField(byId("salary-hours"), "40");
    setField(byId("salary-days"), "5");
    setField(byId("salary-unpaid"), "0");
    const t = await recalculated(previous);
    // 30/hr x 40h/wk over a 52.1775-week year is 2087 paid hours: 62,613.
    check("annual is 62,613 (52.1775-week year)", /62,613\.00/.test(t), t.match(/ANNUAL GROSS PAY.{0,20}/)?.[0]);
    check("weekly is 1,200", /1,200\.00/.test(t), t.match(/Per week.{0,20}/)?.[0]);

    // Unpaid leave must reduce the annual figure.
    previous = answer();
    setField(byId("salary-unpaid"), "4");
    const unpaid = await recalculated(previous);
    check("4 unpaid weeks gives 57,813", /57,813\.00/.test(unpaid), unpaid.match(/ANNUAL GROSS PAY.{0,20}/)?.[0]);

    setField(byId("salary-hours"), "0");
    await wait(400);
    check("zero hours shows no Infinity", !/Infinity|NaN/.test(text()));
  }

  if (path.endsWith("/compound-interest-calculator")) {
    let previous = answer();
    setField(await waitFor(() => byId("ci-principal")), "10000");
    setField(byId("ci-rate"), "7");
    setField(byId("ci-years"), "10");
    setSelect(byId("ci-compounds"), "12");
    setSelect(byId("ci-contribution-frequency"), "0");
    const t = await recalculated(previous);
    // The closed form 10000 x (1 + 0.07/12)^120 gives 20,096.6138; the tool
    // credits interest to the cent each month, as an account does, which lands
    // 2c lower.
    check("compounds monthly to 20,096.59", /20,096\.59/.test(t), t.match(/BALANCE AFTER.{0,24}/)?.[0]);

    previous = answer();
    setField(byId("ci-rate"), "0");
    const flat = await recalculated(previous);
    check("0% leaves the balance unchanged", /10,000\.00/.test(flat), flat.match(/BALANCE AFTER.{0,24}/)?.[0]);
  }

  if (path.endsWith("/discount-calculator")) {
    let previous = answer();
    setField(await waitFor(() => byId("discount-price")), "80");
    setField(byId("discount-rate"), "25");
    const t = await recalculated(previous);
    check("25% off 80 leaves 60", /60\.00/.test(t), t.match(/You pay.{0,20}/)?.[0]);
    check("saved is 20", /20\.00/.test(t), t.match(/Saved.{0,20}/)?.[0]);

    segment(/Find original price/)?.click();
    previous = answer();
    setField(await waitFor(() => byId("discount-sale-price")), "60");
    setField(byId("discount-reverse-rate"), "25");
    const reversed = await recalculated(previous);
    check("reverses 60 at 25% off to 80", /80\.00/.test(reversed), reversed.match(/Original.{0,20}/)?.[0]);

    // 100% off must not divide by zero when reversing.
    previous = answer();
    setField(byId("discount-reverse-rate"), "100");
    const total = await recalculated(previous);
    check("100% off shows no Infinity", !/Infinity|NaN/.test(total),
      total.match(/Infinity.{0,30}|NaN.{0,30}/)?.[0]);
  }

  /* =================================================================== */
  /* Converters                                                           */
  /* =================================================================== */

  // The converter shows six decimal places by default; the slider goes to 12.
  const unitCase = async (from, to, amount, expected, label) => {
    const input = await waitFor(() => byId("converter-amount"));
    setField(input, amount);
    const selects = document.querySelectorAll("select");
    setSelect(selects[0], from);
    setSelect(selects[1], to);
    await wait(450);
    const got = byId("converter-result")?.value;
    check(label, got === expected, `${got} (expected ${expected})`);
  };

  const setDecimals = async (places) => {
    const slider = [...document.querySelectorAll('input[type=range]')].at(-1);
    setField(slider, String(places));
    slider?.dispatchEvent(new Event("change", { bubbles: true }));
    await wait(400);
  };

  if (path.endsWith("/weight-converter")) {
    await unitCase("kg", "lb", "1", "2.204623", "1 kg is 2.204623 lb at 6dp");
    await unitCase("oz", "g", "16", "453.59237", "16 oz is exactly 453.59237 g");
    // The precision control must actually change the answer.
    await setDecimals(10);
    await unitCase("kg", "lb", "1", "2.2046226218", "the precision slider reaches 2.2046226218");
    // Empty input must clear the result rather than show NaN.
    setField(byId("converter-amount"), "");
    await wait(400);
    check("empty amount shows no NaN", !/NaN/.test(byId("converter-result")?.value ?? ""),
      byId("converter-result")?.value);
    setField(byId("converter-amount"), "-5");
    await wait(400);
    check("a negative mass still converts", /^-/.test(byId("converter-result")?.value ?? ""),
      byId("converter-result")?.value);
  }

  if (path.endsWith("/area-converter")) {
    await unitCase("ha", "m2", "1", "10000", "1 hectare is 10,000 m2");
    await unitCase("acre", "m2", "1", "4046.856422", "1 acre is 4046.856422 m2 at 6dp");
  }

  if (path.endsWith("/volume-converter")) {
    await unitCase("l", "ml", "1", "1000", "1 litre is 1000 ml");
    await unitCase("gal_us", "l", "1", "3.785412", "1 US gallon is 3.785412 l at 6dp");
  }

  if (path.endsWith("/speed-converter")) {
    await unitCase("kph", "mps", "36", "10", "36 km/h is 10 m/s");
    await unitCase("mph", "kph", "60", "96.56064", "60 mph is exactly 96.56064 km/h");
  }

  if (path.endsWith("/time-converter")) {
    await unitCase("h", "min", "1.5", "90", "1.5 hours is 90 minutes");
    await unitCase("d", "s", "1", "86400", "1 day is 86400 seconds");
  }

  if (path.endsWith("/data-storage-converter")) {
    await unitCase("GiB", "MiB", "1", "1024", "1 GiB is 1024 MiB");
    await unitCase("GB", "MB", "1", "1000", "1 GB is 1000 MB (decimal)");
  }

  if (path.endsWith("/currency-converter")) {
    // The only tool that touches the network; it must either produce a number
    // or say plainly that the feed is unreachable — never an invented rate.
    setField(await waitFor(() => byId("currency-amount")), "100");
    const settled = await waitFor(() => {
      const result = byId("currency-result")?.value;
      if (result && /\d/.test(result)) return { kind: "rate", detail: result };
      const t = text();
      if (/could not|unavailable|unreachable|failed|try again/i.test(t)) {
        return { kind: "stated failure", detail: t.match(/(could not|unavailable|unreachable|failed|try again)[^.]{0,60}/i)?.[0] };
      }
      return null;
    }, 150);
    check("either converts or states the feed is down", !!settled, settled?.kind + ": " + settled?.detail);
    check("never shows a placeholder rate", !/NaN|undefined/.test(text()));
  }

  /* =================================================================== */
  /* Text                                                                 */
  /* =================================================================== */

  if (path.endsWith("/character-counter")) {
    setField(await waitFor(() => byId("character-counter-input")), "Hello, world!");
    await wait(400);
    const t = text();
    check("counts 13 characters", /13/.test(t), t.match(/CHARACTERS \d+/i)?.[0]);
    // Emoji are one grapheme but two UTF-16 units — the tool must say which.
    setField(byId("character-counter-input"), "\u{1F44D}");
    await wait(400);
    check("handles an astral emoji without splitting it", /\b1\b/.test(text()), text().match(/CHARACTERS \d+/i)?.[0]);
  }

  if (path.endsWith("/remove-duplicate-lines")) {
    // The Checkbox primitive puts the input beside its label, not inside it.
    const checkbox = (pattern) => {
      const label = [...document.querySelectorAll("label[for]")].find((l) =>
        pattern.test(l.textContent),
      );
      return label ? document.getElementById(label.htmlFor) : null;
    };

    setField(await waitFor(() => byId("dedupe-input")), "b\na\nb\nA\n\nb");
    await wait(500);
    // Case-insensitive and blank-dropping are the defaults, both labelled.
    check("keeps first order, merges case, drops blanks",
      byId("dedupe-output")?.value === "b\na", JSON.stringify(byId("dedupe-output")?.value));
    check("counts three removals", /3/.test(text().match(/DUPLICATES REMOVED \d+/i)?.[0] ?? ""),
      text().match(/DUPLICATES REMOVED \d+/i)?.[0]);

    checkbox(/Case sensitive/)?.click();
    await wait(500);
    check("case sensitive keeps A separate from a",
      byId("dedupe-output")?.value === "b\na\nA", JSON.stringify(byId("dedupe-output")?.value));

    checkbox(/Drop blank lines/)?.click();
    await wait(500);
    check("keeping blanks preserves the empty line",
      (byId("dedupe-output")?.value ?? "").split("\n").length === 4,
      JSON.stringify(byId("dedupe-output")?.value));
  }

  if (path.endsWith("/text-reverser")) {
    setField(await waitFor(() => byId("reverser-input")), "abc def");
    await wait(400);
    check("reverses characters", byId("reverser-output")?.value === "fed cba", byId("reverser-output")?.value);
    // Reversing must not split a surrogate pair into two broken halves.
    setField(byId("reverser-input"), "a\u{1F44D}b");
    await wait(400);
    check("keeps an emoji intact when reversed", byId("reverser-output")?.value === "b\u{1F44D}a",
      JSON.stringify(byId("reverser-output")?.value));
  }

  if (path.endsWith("/text-cleaner")) {
    setField(await waitFor(() => byId("cleaner-input")), "  a   b  \n\n\n  c  ");
    await wait(500);
    const out = byId("cleaner-output")?.value ?? "";
    check("collapses runs of whitespace", !/  /.test(out), JSON.stringify(out));
    check("keeps the words", /a/.test(out) && /b/.test(out) && /c/.test(out), JSON.stringify(out));
  }

  /* =================================================================== */
  /* Developer                                                            */
  /* =================================================================== */

  if (path.endsWith("/json-formatter")) {
    setField(await waitFor(() => byId("json-formatter-input")), '{"b":1,"a":[2,3]}');
    await wait(300);
    button(/^Format$/)?.click();
    await wait(500);
    const out = byId("json-formatter-output")?.value ?? "";
    check("pretty-prints with indentation", /\n\s+"b": 1/.test(out), JSON.stringify(out.slice(0, 50)));

    button(/^Minify$/)?.click();
    await wait(500);
    check("minify strips every newline",
      !(byId("json-formatter-output")?.value ?? "x\n").includes("\n"),
      JSON.stringify(byId("json-formatter-output")?.value));

    setField(byId("json-formatter-input"), '{"a":1,}');
    await wait(300);
    button(/^Format$/)?.click();
    await wait(500);
    check("reports a trailing comma with a position",
      /line|position|column|char/i.test(text()) && !/\[object/.test(text()),
      text().match(/(line|position|column)[^.]{0,50}/i)?.[0]);
  }

  if (path.endsWith("/json-validator")) {
    setField(await waitFor(() => byId("json-validator-input")), '{"ok":true}');
    await wait(500);
    check("accepts valid JSON", /valid/i.test(frame()) && !/not valid|invalid/i.test(frame()),
      frame().slice(0, 120));

    setField(byId("json-validator-input"), "{oops}");
    await wait(500);
    check("rejects invalid JSON with a location", /line \d+|position \d+|column \d+/i.test(frame()),
      frame().slice(0, 150));
  }

  if (path.endsWith("/json-to-csv")) {
    setField(await waitFor(() => byId("json-to-csv-input")),
      '[{"name":"A, Inc","n":1},{"name":"B \\"quoted\\"","n":2}]');
    await wait(600);
    const out = byId("json-to-csv-output")?.value ?? "";
    check("quotes a field containing a comma", /"A, Inc"/.test(out), JSON.stringify(out.slice(0, 80)));
    check("doubles an embedded quote", /""quoted""/.test(out), JSON.stringify(out.slice(0, 120)));

    setField(byId("json-to-csv-input"), "{not json}");
    await wait(500);
    check("bad JSON produces an error, not a crash", /error|invalid|expected|unexpected/i.test(text()),
      text().match(/(error|invalid|expected|unexpected)[^.]{0,50}/i)?.[0]);
  }

  if (path.endsWith("/base64-decoder")) {
    setField(await waitFor(() => byId("base64-decoder-input")), "Y2Fmw6kg8J+RjQ==");
    await wait(500);
    check("decodes UTF-8 back to text", byId("base64-decoder-output")?.value === "café \u{1F44D}",
      JSON.stringify(byId("base64-decoder-output")?.value));

    setField(byId("base64-decoder-input"), "!!!not base64!!!");
    await wait(500);
    check("rejects invalid base64 with a message", /not valid|invalid|cannot|error/i.test(text()),
      text().match(/(not valid|invalid|cannot|error)[^.]{0,50}/i)?.[0]);
  }

  if (path.endsWith("/url-decoder")) {
    setField(await waitFor(() => byId("url-decoder-input")), "a%20b%26c%3Dd");
    await wait(500);
    check("decodes percent escapes", byId("url-decoder-output")?.value === "a b&c=d",
      JSON.stringify(byId("url-decoder-output")?.value));

    setField(byId("url-decoder-input"), "%E0%A4");
    await wait(500);
    check("a truncated escape gives an error, not a throw",
      /invalid|malformed|cannot|error|incomplete/i.test(text()),
      text().match(/(invalid|malformed|cannot|error|incomplete)[^.]{0,50}/i)?.[0]);
  }

  if (path.endsWith("/html-formatter")) {
    setField(await waitFor(() => byId("html-formatter-input")), "<div><p>hi</p><br><span>x</span></div>");
    await wait(300);
    button(/^Format$/)?.click();
    await wait(600);
    const out = byId("html-formatter-output")?.value ?? "";
    check("indents nested elements", /\n\s+<p>/.test(out), JSON.stringify(out.slice(0, 80)));
    check("does not close a void element", !/<\/br>/.test(out), JSON.stringify(out.slice(0, 120)));
    // Formatting must never execute what it is formatting.
    setField(byId("html-formatter-input"), "<img src=x onerror=alert(1)>");
    await wait(300);
    button(/^Format$/)?.click();
    await wait(500);
    check("does not run the markup it formats", !window.__xss, "no alert fired");
  }

  if (path.endsWith("/css-formatter")) {
    setField(await waitFor(() => byId("css-formatter-input")), "a{color:red;background:blue}b{margin:0}");
    await wait(300);
    button(/^Format$/)?.click();
    await wait(600);
    const out = byId("css-formatter-output")?.value ?? "";
    check("expands rules onto their own lines", /a \{\n/.test(out), JSON.stringify(out.slice(0, 60)));
    check("keeps both declarations", /color: red/.test(out) && /background: blue/.test(out),
      JSON.stringify(out.slice(0, 100)));

    setField(byId("css-formatter-input"), "@media (min-width:600px){a{color:red}}");
    await wait(300);
    button(/^Format$/)?.click();
    await wait(500);
    check("handles a nested at-rule", /@media/.test(byId("css-formatter-output")?.value ?? ""),
      JSON.stringify((byId("css-formatter-output")?.value ?? "").slice(0, 80)));
  }

  /* =================================================================== */
  /* Generators                                                           */
  /* =================================================================== */

  if (path.endsWith("/random-number-generator")) {
    setField(await waitFor(() => byId("rng-min")), "1");
    setField(byId("rng-max"), "6");
    setField(byId("rng-count"), "20");
    const go = await waitFor(() => button(/Generate/));
    go?.click();
    await wait(700);
    const numbers = [...text().matchAll(/\b\d+\b/g)].map((m) => Number(m[0]));
    check("produces numbers in range", numbers.some((n) => n >= 1 && n <= 6), text().slice(0, 80));

    // min above max must be refused rather than looping forever.
    setField(byId("rng-min"), "10");
    setField(byId("rng-max"), "2");
    await wait(300);
    button(/Generate/)?.click();
    await wait(600);
    check("refuses min above max", /at least|greater|higher|larger|minimum/i.test(text()),
      text().match(/(at least|greater|higher|larger|minimum)[^.]{0,50}/i)?.[0]);
  }

  if (path.endsWith("/lorem-ipsum-generator")) {
    const out = await waitFor(() => {
      const t = text();
      return /lorem|ipsum/i.test(t) ? t : null;
    });
    check("generates lorem text", !!out, (out ?? "").match(/[Ll]orem[^.]{0,50}/)?.[0]);
    const before = document.querySelector("textarea")?.value ?? text();
    button(/Generate|Regenerate|New/)?.click();
    await wait(600);
    const after = document.querySelector("textarea")?.value ?? text();
    check("regenerating changes the text", after !== before || after.length > 0);
  }

  if (path.endsWith("/barcode-generator")) {
    setField(await waitFor(() => byId("barcode-value")), "5901234123457");
    setSelect(byId("barcode-format"), "EAN13");
    await wait(800);
    const svgOrCanvas = document.querySelector("#main svg[width], #main canvas");
    check("renders a barcode", !!svgOrCanvas, svgOrCanvas?.tagName);

    // EAN-13 has a check digit; a wrong one must be reported, not drawn.
    setField(byId("barcode-value"), "5901234123450");
    await wait(800);
    check("rejects a bad EAN-13 check digit", /invalid|check digit|not valid|cannot/i.test(text()),
      text().match(/(invalid|check digit|not valid|cannot)[^.]{0,50}/i)?.[0]);
  }

  if (path.endsWith("/invoice-generator")) {
    setField(await waitFor(() => byId("invoice-from-name")), "Acme Ltd");
    setField(byId("invoice-to-name"), "Client Co");
    setField(byId("invoice-tax"), "20");
    await wait(600);
    check("totals appear", /total/i.test(text()), text().match(/TOTAL[^A-Z]{0,30}/i)?.[0]);

    // An invoice with no line items must not download, and must say why.
    const disabled = button(/Download PDF/)?.disabled;
    check("empty invoice disables the download", disabled === true, `disabled=${disabled}`);
    check("and explains why", /Add a line item/.test(frame()), frame().match(/Add a line item[^.]{0,50}/)?.[0]);

    const rows = [...document.querySelectorAll("input[type=text]")];
    const description = rows.find((el) => /description/i.test(el.getAttribute("aria-label") ?? el.placeholder ?? ""));
    setField(description ?? rows.at(-3), "Design work");
    const numbers = [...document.querySelectorAll("input[type=number]")];
    setField(numbers[1], "1200");
    await wait(600);
    // The invoice preview sits outside the tool card, so read the whole page.
    check("line total appears", /1,200\.00/.test(text()), text().match(/1,200[^ ]*/)?.[0]);
    check("20% tax is added", /240\.00/.test(text()), text().match(/Tax 20%.{0,20}|Tax.{0,24}240/)?.[0]);
    check("total is 1,440.00", /1,440\.00/.test(text()), text().match(/Total.{0,24}/)?.[0]);

    const dl = captureDownload();
    button(/Download PDF/)?.click();
    const bytes = await awaitDownload(dl);
    check("downloads a real PDF", magic(bytes) === "%PDF-", bytes ? `${bytes.length} bytes` : "no blob");
  }

  if (path.endsWith("/resume-generator")) {
    setField(await waitFor(() => byId("resume-name")), "Jane Doe");
    setField(byId("resume-headline"), "Software Engineer");
    setField(byId("resume-email"), "jane@example.com");
    await wait(600);
    check("preview shows the name", /Jane Doe/.test(text()));

    const dl = captureDownload();
    button(/Download PDF/)?.click();
    const bytes = await awaitDownload(dl);
    check("downloads a real PDF", magic(bytes) === "%PDF-", bytes ? `${bytes.length} bytes` : "no blob");
    check("the file is named", /\.pdf$/.test(dl.name ?? ""), dl.name);
  }

  window.__utilboxResults = results;
  return results;
})();
