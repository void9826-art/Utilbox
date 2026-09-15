/**
 * Interaction suite for the 14 PDF tools added in batch 1.
 *
 * Same shape as smoke4.js: build a real PDF in the page, feed it to the tool's
 * file input, drive the controls a person would, and check the saved bytes
 * rather than trusting the on-screen message. Run through scripts/smoke5.ps1.
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
  const check = (name, pass, detail) =>
    results.push({ name, pass: !!pass, detail: detail === undefined || detail === null ? "" : String(detail).slice(0, 200) });

  const protoOf = (el) =>
    el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : el.tagName === "SELECT" ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  const setField = (el, value) => {
    if (!el) return;
    Object.getOwnPropertyDescriptor(protoOf(el), "value").set.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  };
  const button = (pattern) =>
    [...document.querySelectorAll("button")].find(
      (b) => pattern.test(b.textContent.trim()) || pattern.test(b.getAttribute("aria-label") ?? "") || pattern.test(b.title ?? ""),
    );
  const byId = (id) => document.getElementById(id);
  const frame = () => (document.querySelector("#main .shadow-raised")?.innerText ?? "").replace(/\s+/g, " ");
  const path = location.pathname;

  const captureDownload = () => {
    const state = { blob: null, name: null };
    const realCreate = URL.createObjectURL.bind(URL);
    URL.createObjectURL = (b) => {
      state.blob = b;
      return realCreate(b);
    };
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) state.name = this.download;
    };
    return state;
  };
  const awaitDownload = async (state, tries = 200) => {
    await waitFor(() => state.name && state.blob, tries);
    return state.blob ? new Uint8Array(await state.blob.arrayBuffer()) : null;
  };
  const asText = (bytes) => (bytes ? new TextDecoder('latin1').decode(bytes) : '');
  const head = (bytes, n = 5) => (bytes ? String.fromCharCode(...bytes.slice(0, n)) : '');

  /**
   * Feeds a tool its own output back. pdf-lib writes compressed object streams,
   * so the saved bytes cannot be checked by searching for strings; loading the
   * result back into the same tool is both possible and a stronger check.
   */
  const reinject = async (bytes, name = 'result.pdf') => {
    // Each tool labels its reset differently (Combine another PDF, Do another
    // PDF, and so on), so match the shape rather than one exact label.
    (button(/another (PDF|booklet)/i) ?? button(/Choose another/i))?.click();
    await wait(400);
    const input = document.querySelector('input[type=file]');
    if (!input || !bytes) return false;
    const transfer = new DataTransfer();
    transfer.items.add(new File([bytes], name, { type: 'application/pdf' }));
    input.files = transfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await wait(1400);
    return true;
  };

  const inject = async (file, input = document.querySelector("input[type=file]")) => {
    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await wait(900);
  };

  /** A valid multi-page PDF, one line of text per page. */
  const makePdf = (pageCount = 1, word = "Hello", name = "test.pdf") => {
    const objects = [];
    const kids = [];
    const fontNumber = 3 + pageCount * 2;
    for (let page = 0; page < pageCount; page += 1) kids.push(`${3 + page * 2} 0 R`);

    objects.push("<< /Type /Catalog /Pages 2 0 R >>");
    objects.push(`<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${pageCount} >>`);
    for (let page = 0; page < pageCount; page += 1) {
      const contentRef = 4 + page * 2;
      const stream = `BT /F1 24 Tf 72 700 Td (${word} page ${page + 1}) Tj ET`;
      objects.push(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents ${contentRef} 0 R /Resources << /Font << /F1 ${fontNumber} 0 R >> >> >>`,
      );
      objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    }
    objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

    let out = "%PDF-1.4\n";
    const offsets = [];
    objects.forEach((object, index) => {
      offsets.push(out.length);
      out += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });
    const xref = out.length;
    out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}`;
    out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    return new File([out], name, { type: "application/pdf" });
  };

  // Tool components are lazy chunks, and the HTML is server-rendered, so wait
  // until React owns a control before touching anything.
  await waitFor(() => !document.querySelector('[aria-label="Loading the tool"]') && document.querySelector("#main .shadow-raised"), 150);
  await waitFor(
    () =>
      [...document.querySelectorAll("#main .shadow-raised input, #main .shadow-raised button")].some((el) =>
        Object.keys(el).some((key) => key.startsWith("__reactProps")),
      ),
    300,
  );
  await wait(300);

  try {
    if (path.endsWith("/pdf-watermark")) {
      await inject(makePdf(2));
      await waitFor(() => byId("watermark-text"), 100);
      setField(byId("watermark-text"), "CONFIDENTIAL");
      const download = captureDownload();
      button(/^Add watermark$/)?.click();
      await waitFor(() => /watermarked PDF is ready/.test(frame()), 300);
      check("watermark applied to both pages", /2 pages stamped/.test(frame()), frame().match(/\d+ pages? stamped/)?.[0]);
      button(/^Download PDF$/)?.click();
      const bytes = await awaitDownload(download);
      check("a real PDF is produced", head(bytes) === "%PDF-", head(bytes));
      await reinject(bytes, "watermarked.pdf");
      check("the saved file reopens with both pages", /2 pages/.test(frame()), frame().slice(0, 80));
    }

    if (path.endsWith("/pdf-reorder-pages")) {
      await inject(makePdf(3));
      await waitFor(() => button(/Reverse order/), 100);
      button(/Reverse order/)?.click();
      await wait(300);
      const download = captureDownload();
      button(/^Save new order$/)?.click();
      await waitFor(() => /reordered PDF is ready/.test(frame()), 200);
      check("reordered file reports three pages", /3 pages in the new order/.test(frame()), frame().match(/\d+ pages in the new order/)?.[0]);
      button(/^Download PDF$/)?.click();
      const bytes = await awaitDownload(download);
      check("a real PDF is produced", head(bytes) === "%PDF-", head(bytes));
      await reinject(bytes, "reordered.pdf");
      check("the saved file reopens with three pages", /3 pages/.test(frame()), frame().slice(0, 80));
    }

    if (path.endsWith("/pdf-n-up")) {
      await inject(makePdf(4));
      await waitFor(() => byId("nup-per-sheet"), 100);
      setField(byId("nup-per-sheet"), "4");
      await wait(300);
      const download = captureDownload();
      button(/^Combine pages$/)?.click();
      await waitFor(() => /combined PDF is ready/.test(frame()), 300);
      check("four pages land on one sheet", /4 pages on 1 sheet/.test(frame()), frame().match(/\d+ pages on \d+ sheets?/)?.[0]);
      button(/^Download PDF$/)?.click();
      const bytes = await awaitDownload(download);
      check("a real PDF is produced", head(bytes) === "%PDF-", head(bytes));
      await reinject(bytes, "nup.pdf");
      check("the saved file is a single sheet", /1 page/.test(frame()), frame().slice(0, 80));
    }

    if (path.endsWith("/pdf-booklet")) {
      await inject(makePdf(3));
      await waitFor(() => button(/^Make booklet$/), 100);
      const download = captureDownload();
      button(/^Make booklet$/)?.click();
      await waitFor(() => /booklet is ready/.test(frame()), 300);
      check("three pages become two sheets", /2 sheets/.test(frame()), frame().match(/\d+ sheets?/)?.[0]);
      check("one blank page is added", /1 blank page added/.test(frame()), frame().match(/\d+ blank pages? added/)?.[0]);
      button(/^Download PDF$/)?.click();
      const bytes = await awaitDownload(download);
      check("a real PDF is produced", head(bytes) === "%PDF-", head(bytes));
    }

    if (path.endsWith("/pdf-crop-margins")) {
      await inject(makePdf(1));
      await waitFor(() => button(/^Crop margins$/), 100);
      const download = captureDownload();
      button(/^Crop margins$/)?.click();
      await waitFor(() => /cropped PDF is ready/.test(frame()), 200);
      check("one page cropped", /1 page cropped/.test(frame()), frame().match(/\d+ pages? cropped/)?.[0]);
      button(/^Download PDF$/)?.click();
      const bytes = await awaitDownload(download);
      check("a real PDF is produced", head(bytes) === "%PDF-", head(bytes));
      await reinject(bytes, "cropped.pdf");
      check("the reopened page is smaller than A4", /7\.\d+ . 10\.\d+ in/.test(frame()), frame().match(/[\d.]+ . [\d.]+ in/)?.[0]);
    }

    if (path.endsWith("/pdf-header-footer")) {
      await inject(makePdf(2));
      await waitFor(() => byId("hf-header"), 100);
      setField(byId("hf-header"), "Quarterly report");
      await wait(200);
      const download = captureDownload();
      button(/^Add header and footer$/)?.click();
      await waitFor(() => /Your PDF is ready/.test(frame()), 300);
      button(/^Download PDF$/)?.click();
      const bytes = await awaitDownload(download);
      check("a real PDF is produced", head(bytes) === "%PDF-", head(bytes));
      await reinject(bytes, "headed.pdf");
      check("the saved file reopens with both pages", /2 pages/.test(frame()), frame().slice(0, 80));
    }

    if (path.endsWith("/pdf-flatten-form")) {
      await inject(makePdf(1));
      await waitFor(() => /No form fields found|fields? found/.test(frame()), 200);
      check("a form-free PDF is reported honestly", /No form fields found/.test(frame()), frame().slice(0, 120));
      check("the flatten button is disabled", button(/^Flatten form$/)?.disabled === true, String(button(/^Flatten form$/)?.disabled));
    }

    if (path.endsWith("/pdf-grayscale")) {
      await inject(makePdf(1));
      await waitFor(() => button(/^Convert to grayscale$/), 100);
      check("the rasterising trade-off is stated", /no longer selectable or searchable/.test(frame()), frame().match(/Pages become images[^.]*\./)?.[0]);
      const download = captureDownload();
      button(/^Convert to grayscale$/)?.click();
      await waitFor(() => /grayscale PDF is ready/.test(frame()), 400);
      button(/^Download PDF$/)?.click();
      const bytes = await awaitDownload(download);
      check("a real PDF is produced", head(bytes) === "%PDF-", head(bytes));
      check("the rendered page carries image data", (bytes?.length ?? 0) > 5000, String(bytes?.length));
    }

    if (path.endsWith("/pdf-invert-colors")) {
      await inject(makePdf(1));
      await waitFor(() => button(/^Invert colours$/), 100);
      const download = captureDownload();
      button(/^Invert colours$/)?.click();
      await waitFor(() => /inverted PDF is ready/.test(frame()), 400);
      button(/^Download PDF$/)?.click();
      const bytes = await awaitDownload(download);
      check("a real PDF is produced", head(bytes) === "%PDF-", head(bytes));
      check("the rendered page carries image data", (bytes?.length ?? 0) > 5000, String(bytes?.length));
    }

    if (path.endsWith("/pdf-extract-images")) {
      await inject(makePdf(1));
      await waitFor(() => /No embedded images found|images? found/.test(frame()), 300);
      check("a picture-free PDF is reported honestly", /No embedded images found/.test(frame()), frame().slice(0, 140));
    }

    if (path.endsWith("/pdf-bookmarks")) {
      await inject(makePdf(3));
      await waitFor(() => document.querySelector('input[id$="-title"]'), 200);
      setField(document.querySelector('input[id$="-title"]'), "Chapter one");
      await wait(200);
      const download = captureDownload();
      button(/^Save bookmarks$/)?.click();
      await waitFor(() => /now has bookmarks/.test(frame()), 200);
      button(/^Download PDF$/)?.click();
      const bytes = await awaitDownload(download);
      check("a real PDF is produced", head(bytes) === "%PDF-", head(bytes));
      await reinject(bytes, "bookmarked.pdf");
      check("the saved outline is read back by the PDF engine", /1 existing bookmark/.test(frame()), frame().slice(0, 110));
    }

    if (path.endsWith("/pdf-compare")) {
      // Once a file is chosen its dropzone becomes a filename, so the second
      // input moves into first place; re-query rather than holding an index.
      await inject(makePdf(1, "Alpha", "before.pdf"), document.querySelectorAll("input[type=file]")[0]);
      await inject(makePdf(1, "Beta", "after.pdf"), document.querySelectorAll("input[type=file]")[0]);
      await waitFor(() => button(/^Compare$/) && !button(/^Compare$/).disabled, 200);
      button(/^Compare$/)?.click();
      await waitFor(() => /Pages with changes/.test(frame()), 200);
      // Stat labels are uppercased by CSS, and innerText returns the transformed text.
      check("one page differs", /pages with changes 1/i.test(frame()), frame().match(/pages with changes \d+/i)?.[0]);
      check("one line added and one removed", /lines added 1/i.test(frame()) && /lines removed 1/i.test(frame()), frame().match(/lines added \d+ lines removed \d+/i)?.[0]);
      check("the changed wording is shown", /Beta page 1/.test(frame()), frame().match(/Beta page 1/)?.[0]);
    }

    if (path.endsWith("/pdf-signature")) {
      await inject(makePdf(1));
      await waitFor(() => document.querySelector("#main canvas"), 200);
      const pad = document.querySelector("#main canvas");
      const box = pad.getBoundingClientRect();
      const stroke = (x, y, type) =>
        pad.dispatchEvent(
          new PointerEvent(type, { clientX: box.left + x, clientY: box.top + y, bubbles: true, pointerId: 1, isPrimary: true }),
        );
      stroke(20, 40, "pointerdown");
      stroke(80, 90, "pointermove");
      stroke(140, 40, "pointermove");
      stroke(140, 40, "pointerup");
      await wait(300);
      const download = captureDownload();
      button(/^Place signature$/)?.click();
      await waitFor(() => /signed PDF is ready/.test(frame()), 300);
      button(/^Download PDF$/)?.click();
      const bytes = await awaitDownload(download);
      check("a real PDF is produced", head(bytes) === "%PDF-", head(bytes));
      check("the signature adds image data to the file", (bytes?.length ?? 0) > 2000, String(bytes?.length));
    }

    if (path.endsWith("/pdf-redact")) {
      // One page keeps the render-and-flatten pass inside the evaluate budget.
      await inject(makePdf(1));
      await waitFor(() => document.querySelector("#main .cursor-crosshair"), 200);
      const surface = document.querySelector("#main .cursor-crosshair");
      const box = surface.getBoundingClientRect();
      const at = (fx, fy, type) =>
        surface.dispatchEvent(
          new PointerEvent(type, {
            clientX: box.left + box.width * fx,
            clientY: box.top + box.height * fy,
            bubbles: true,
            pointerId: 1,
            isPrimary: true,
          }),
        );
      at(0.1, 0.1, "pointerdown");
      at(0.6, 0.25, "pointermove");
      at(0.6, 0.25, "pointerup");
      await wait(300);
      check("the marked area is counted", /1 area marked/.test(frame()), frame().match(/\d+ areas? marked/)?.[0]);
      const download = captureDownload();
      button(/^Apply redactions$/)?.click();
      await waitFor(() => /redacted PDF is ready|could not/.test(frame()), 200);
      check("the marked page is flattened", /1 page flattened/.test(frame()), frame().match(/\d+ pages? flattened/)?.[0]);
      button(/^Download PDF$/)?.click();
      const bytes = await awaitDownload(download);
      check("a real PDF is produced", head(bytes) === "%PDF-", head(bytes));
      check("the flattened page carries image data", (bytes?.length ?? 0) > 5000, String(bytes?.length));
    }
  } catch (error) {
    check("page script ran without throwing", false, error?.stack ?? error);
  }

  return results;
})()
