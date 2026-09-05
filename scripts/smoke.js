/**
 * Interaction smoke test, run in real Chrome via .claude/cdp.ps1.
 *
 * The script dispatches on the current path, drives that tool the way a person
 * would — set an input, press the button, read what appears — and checks the
 * result against a known-good value computed by hand.
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

  /** Sets a React-controlled field the way a keystroke would. */
  const setField = (el, value) => {
    const proto =
      el.tagName === "TEXTAREA"
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };

  const setSelect = (el, value) => {
    Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value").set.call(el, value);
    el.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const button = (pattern) =>
    [...document.querySelectorAll("button")].find((b) => pattern.test(b.textContent.trim()));

  /** Segmented controls are styled radio labels, so they are clicked by label. */
  const segment = (pattern) =>
    [...document.querySelectorAll("label")].find((l) => pattern.test(l.textContent.trim()));

  const text = () => document.getElementById("main").innerText.replace(/\s+/g, " ");
  const byId = (id) => document.getElementById(id);

  const injectFile = async (accept, name, type, base64) => {
    const input = await waitFor(() =>
      document.querySelector(`input[type=file]${accept ? `[accept*="${accept}"]` : ""}`),
    );
    if (!input) return false;
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
    const dt = new DataTransfer();
    dt.items.add(new File([bytes], name, { type }));
    input.files = dt.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  };

  const path = location.pathname;

  /* ------------------------------------------------------------------ */

  if (path.endsWith("/percentage-calculator")) {
    const a = await waitFor(() => byId("percentage-a"));
    const b = byId("percentage-b");
    setField(a, "15");
    setField(b, "240");
    await wait(300);
    check("15% of 240 is 36", /\b36\b/.test(text()), text().match(/15% of 240.{0,40}/)?.[0]);

    // Percentage change: 80 -> 60 is a 25% decrease.
    segment(/% change/)?.click();
    await wait(300);
    setField(byId("percentage-a"), "80");
    setField(byId("percentage-b"), "60");
    await wait(300);
    const changeText = text();
    check(
      "80 to 60 is a 25% decrease",
      /25%/.test(changeText) && /decrease/.test(changeText),
      changeText.match(/Change from.{0,90}/)?.[0],
    );
  }

  if (path.endsWith("/bmi-calculator")) {
    setField(await waitFor(() => byId("bmi-height-cm")), "175");
    setField(byId("bmi-weight-kg"), "72");
    await wait(400);
    const t = text();
    check("BMI of 175cm/72kg is 23.5", /23\.5/.test(t), t.match(/Body mass index.{0,60}/)?.[0]);
    check("healthy category shown", /Healthy weight/.test(t));
  }

  if (path.endsWith("/attendance-calculator")) {
    setField(await waitFor(() => byId("attendance-held")), "52");
    setField(byId("attendance-attended"), "38");
    setField(byId("attendance-required"), "75");
    await wait(400);
    const t = text();
    // (0.75*52 - 38) / 0.25 = 4
    check("needs 4 more classes", /next 4 class/.test(t), t.match(/Attend the next.{0,60}/)?.[0]);
    check("current percentage 73.08", /73\.08/.test(t), t.match(/Current attendance.{0,40}/)?.[0]);
  }

  if (path.endsWith("/tax-calculator")) {
    segment(/Remove tax from a total/)?.click();
    await wait(200);
    setField(await waitFor(() => byId("tax-amount")), "240");
    setField(byId("tax-rate"), "20");
    await wait(400);
    const t = text();
    // 240 / 1.2 = 200 net, 40 tax — not 48.
    check("removes VAT by dividing", /200\.00/.test(t) && /40\.00/.test(t), t.match(/Net.{0,60}/)?.[0]);
  }

  if (path.endsWith("/temperature-converter")) {
    setField(await waitFor(() => byId("temp-c")), "180");
    await wait(400);
    check("180C is 356F", byId("temp-f")?.value === "356", byId("temp-f")?.value);
    check("180C is 453.15K", byId("temp-k")?.value === "453.15", byId("temp-k")?.value);
  }

  if (path.endsWith("/length-converter")) {
    const amount = await waitFor(() => byId("converter-amount"));
    setField(amount, "1");
    const selects = document.querySelectorAll("select");
    setSelect(selects[0], "in");
    setSelect(selects[1], "cm");
    await wait(400);
    check("1 inch is exactly 2.54 cm", byId("converter-result")?.value === "2.54", byId("converter-result")?.value);
  }

  if (path.endsWith("/word-counter")) {
    const input = await waitFor(() => byId("word-counter-input"));
    setField(input, "The quick brown fox jumps over the lazy dog. It ran away.");
    await wait(400);
    const t = text();
    // Stat labels are uppercased by CSS, and innerText reflects that.
    check("counts 12 words", /WORDS 12/i.test(t), t.match(/WORDS \d+/i)?.[0]);
    check("counts 2 sentences", /SENTENCES 2/i.test(t), t.match(/SENTENCES \d+/i)?.[0]);
  }

  if (path.endsWith("/case-converter")) {
    const input = await waitFor(() => byId("case-converter-input"));
    setField(input, "the rise and fall of the house");
    await wait(300);
    const out = byId("case-converter-output");
    check(
      "title case keeps minor words lowercase",
      out?.value === "The Rise and Fall of the House",
      out?.value,
    );

    button(/^snake_case$/)?.click();
    await wait(300);
    check(
      "snake_case",
      byId("case-converter-output")?.value === "the_rise_and_fall_of_the_house",
      byId("case-converter-output")?.value,
    );
  }

  if (path.endsWith("/sort-lines")) {
    const input = await waitFor(() => byId("sort-lines-input"));
    setField(input, "item10\nitem2\nitem1");
    await wait(400);
    check(
      "natural sort puts item2 before item10",
      byId("sort-lines-output")?.value === "item1\nitem2\nitem10",
      JSON.stringify(byId("sort-lines-output")?.value),
    );
  }

  if (path.endsWith("/base64-encoder")) {
    const input = await waitFor(() => byId("base64-input"));
    // Built from escapes: literal non-ASCII does not survive the shell hand-off.
    setField(input, "caf\u00e9 \u{1F44D}");
    await wait(400);
    check(
      "encodes unicode via UTF-8",
      byId("base64-output")?.value === "Y2Fmw6kg8J+RjQ==",
      byId("base64-output")?.value,
    );
  }

  if (path.endsWith("/url-encoder")) {
    const input = await waitFor(() => byId("url-encoder-input"));
    setField(input, "https://example.com/a b?x=1&y=2");
    await wait(400);
    const componentMode = byId("url-encoder-output")?.value;
    check(
      "component mode escapes structure",
      componentMode === "https%3A%2F%2Fexample.com%2Fa%20b%3Fx%3D1%26y%3D2",
      componentMode,
    );

    segment(/Whole URL/)?.click();
    await wait(400);
    check(
      "whole-URL mode preserves structure",
      byId("url-encoder-output")?.value === "https://example.com/a%20b?x=1&y=2",
      byId("url-encoder-output")?.value,
    );
  }

  if (path.endsWith("/timestamp-converter")) {
    const input = await waitFor(() => byId("timestamp-input"));
    setField(input, "1788604200");
    await wait(500);
    const t = text();
    check("decodes to 5 Sep 2026 UTC", /05 Sep 2026 10:30:00 GMT/.test(t), t.match(/UTC.{0,40}/)?.[0]);
    check("shows ISO 8601", /2026-09-05T10:30:00[.]000Z/.test(t));
  }

  if (path.endsWith("/password-generator")) {
    const first = await waitFor(() => document.querySelector("code")?.textContent);
    check("generates a password", (first ?? "").length >= 20, `${(first ?? "").length} chars`);
    button(/Generate a new one/)?.click();
    await wait(500);
    const second = document.querySelector("code")?.textContent;
    check("regenerates a different password", second && second !== first);
    check("reports entropy", /bits of entropy/.test(text()), text().match(/\d+ bits of entropy/)?.[0]);
  }

  if (path.endsWith("/uuid-generator")) {
    const codes = await waitFor(() => {
      const list = [...document.querySelectorAll("code")].map((c) => c.textContent.trim());
      return list.length >= 5 ? list : null;
    });
    const valid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
    check("generates valid v4 UUIDs", codes?.every((c) => valid.test(c)), codes?.[0]);
    check("all distinct", new Set(codes).size === codes?.length);
  }

  if (path.endsWith("/qr-code-generator")) {
    const canvas = await waitFor(() => {
      const c = document.querySelector("canvas");
      return c && c.width > 0 ? c : null;
    });
    check("renders a QR canvas", !!canvas, canvas ? `${canvas.width}x${canvas.height}` : null);
    const pixels = canvas?.getContext("2d")?.getImageData(0, 0, canvas.width, canvas.height).data;
    let dark = 0;
    if (pixels) for (let i = 0; i < pixels.length; i += 4) if (pixels[i] < 128) dark += 1;
    check("QR has a real pattern", dark > 500, `${dark} dark pixels`);
  }

  if (path.endsWith("/scientific-calculator")) {
    const input = await waitFor(() => byId("calc-expression"));
    setField(input, "log(1000) + sqrt(144) + sin(30)");
    await wait(300);
    button(/^=$/)?.click();
    await wait(400);
    check("evaluates in degrees", byId("calc-expression")?.value === "15.5", byId("calc-expression")?.value);

    setField(byId("calc-expression"), "-3^2");
    await wait(200);
    button(/^=$/)?.click();
    await wait(300);
    check("unary minus binds looser than power", byId("calc-expression")?.value === "-9", byId("calc-expression")?.value);
  }


  /* ---------------------------------------------------------------- */
  /* File tools. Fixtures are served from /__test-fixtures.json, which  */
  /* the runner copies into public for the duration of the run only.    */
  /* ---------------------------------------------------------------- */

  // Injected by scripts/smoke.ps1 before the page script runs.
  const fixtures = async () => window.__fixtures;

  if (path.endsWith('/merge-pdf')) {
    const f = await fixtures();
    const ok = await injectFile('pdf', 'alpha.pdf', 'application/pdf', f.alpha);
    check('merge accepts a PDF', ok);
    await wait(1500);
    await injectFile('pdf', 'beta.pdf', 'application/pdf', f.beta);
    await wait(1500);
    check('reads both page counts', /3 pages/.test(text()), text().match(/\d+ PDFs.{0,40}/)?.[0]);

    let captured = null;
    const realCreate = URL.createObjectURL;
    URL.createObjectURL = (b) => { captured = b; return realCreate.call(URL, b); };
    HTMLAnchorElement.prototype.click = function () {};

    (await waitFor(() => button(/Merge 2 PDFs/)))?.click();
    const ready = await waitFor(() => (/Your merged PDF is ready/.test(text()) ? text() : null));
    check('merges to 3 pages', /3 pages/.test(ready ?? ''), ready?.match(/ready.{0,40}/)?.[0]);

    button(/Download PDF/)?.click();
    await wait(600);
    const bytes = captured ? new Uint8Array(await captured.arrayBuffer()) : null;
    check(
      'produces a real PDF',
      bytes && String.fromCharCode(...bytes.slice(0, 5)) === '%PDF-',
      bytes ? bytes.length + ' bytes' : 'no blob',
    );
  }

  if (path.endsWith('/pdf-to-text')) {
    const f = await fixtures();
    await injectFile('pdf', 'alpha.pdf', 'application/pdf', f.alpha);
    const out = await waitFor(() => byId('pdf-text-output')?.value || null, 120);
    check('extracts the heading', /Utilbox Test Alpha/.test(out ?? ''), (out ?? '').slice(0, 40));
    check('keeps table columns spaced', /Widget 2 9[.]99/.test(out ?? ''));
    check('marks both pages', /Page 1 ---/.test(out ?? '') && /Page 2 ---/.test(out ?? ''));
  }

  if (path.endsWith('/pdf-to-excel')) {
    const f = await fixtures();
    await injectFile('pdf', 'alpha.pdf', 'application/pdf', f.alpha);
    const rows = await waitFor(() => {
      const r = [...document.querySelectorAll('table tbody tr')].map((tr) =>
        [...tr.querySelectorAll('td')].map((td) => td.innerText.trim()).join('|'),
      );
      return r.length ? r : null;
    }, 120);
    check('detects three columns', rows?.some((r) => r === 'Item|Qty|Price'), rows?.[3]);
    check('splits a data row', rows?.some((r) => r === 'Gadget|10|24.50'), rows?.[5]);
  }

  if (path.endsWith('/compress-image')) {
    // A canvas-generated PNG keeps this test self-contained.
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 240, 240);
    gradient.addColorStop(0, '#ff0000');
    gradient.addColorStop(1, '#0000ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 240, 240);
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/png'));

    const input = await waitFor(() => document.querySelector('input[type=file][accept*=image]'));
    const dt = new DataTransfer();
    dt.items.add(new File([blob], 'gradient.png', { type: 'image/png' }));
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));

    const run = await waitFor(() => button(/Compress images/));
    check('accepts the image', !!run);
    run?.click();
    const done = await waitFor(() => (/SAVED|INCREASE/i.test(text()) ? text() : null), 120);
    check(
      'reports a size reduction',
      /KB . 240 . 240 . [\d.]+ KB/.test(done ?? '') && /8[0-9]%/.test(done ?? ''),
      done?.match(/gradient[.]png.{0,90}/)?.[0],
    );
    check('keeps the dimensions', /240 × 240/.test(done ?? ''));
  }

  window.__utilboxResults = results;
  return results;
})();
