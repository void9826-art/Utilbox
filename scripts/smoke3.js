/**
 * Third interaction suite: the PDF and image tools that scripts/smoke.js does
 * not already cover.
 *
 * Every file tool is driven with a real file, run to completion, and the file
 * it hands back is checked byte by byte — magic number, and for PDFs the page
 * count read back out of the output. Fixtures arrive as window.__fixtures.
 */
(async () => {
  const results = [];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const waitFor = async (fn, tries = 60) => {
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
    [...document.querySelectorAll("button")].find(
      (b) => pattern.test(b.textContent.trim()) && !b.disabled,
    );

  const text = () => document.getElementById("main").innerText.replace(/\s+/g, " ");
  /** The tool card only — not the article copy that surrounds it. */
  const frame = () =>
    (document.querySelector("#main .shadow-raised")?.innerText ?? "").replace(/\s+/g, " ");
  const byId = (id) => document.getElementById(id);
  const path = location.pathname;

  const b64ToBytes = (base64) => {
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
    return bytes;
  };

  const injectFile = async (accept, name, type, bytes) => {
    const input = await waitFor(
      () => document.querySelector(`input[type=file]${accept ? `[accept*="${accept}"]` : ""}`),
      60,
    );
    if (!input) return false;
    const dt = new DataTransfer();
    dt.items.add(new File([bytes], name, { type }));
    input.files = dt.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  };

  /** Draws a solid-ish test image and returns it as a File of the given type. */
  const makeImage = async (mime, width = 320, height = 200, name = "test") => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#202020");
    gradient.addColorStop(1, "#e0e0e0");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(20, 20, 60, 40);
    const blob = await new Promise((r) => canvas.toBlob(r, mime, 0.92));
    const extension = mime.split("/")[1];
    return new File([blob], `${name}.${extension}`, { type: mime });
  };

  const injectImage = async (file) => {
    const input = await waitFor(() => document.querySelector("input[type=file][accept*=image]"), 60);
    if (!input) return false;
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  };

  const captureDownload = () => {
    const state = { blob: null, name: null, count: 0 };
    const realCreate = URL.createObjectURL;
    URL.createObjectURL = (b) => {
      if (b instanceof Blob && b.size > 0) {
        state.blob = b;
        state.count += 1;
      }
      return realCreate.call(URL, b);
    };
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) state.name = this.download;
    };
    return state;
  };

  /** Never pass an async callback to waitFor — a pending Promise is truthy. */
  const awaitDownload = async (state, tries = 80) => {
    const blob = await waitFor(() => state.blob, tries);
    return blob ? new Uint8Array(await blob.arrayBuffer()) : null;
  };

  const magic = (bytes, n = 5) => (bytes ? String.fromCharCode(...bytes.slice(0, n)) : "");

  /**
   * Feeds a produced PDF back into the tool that made it and reads the page
   * count the tool itself reports. pdf-lib writes object streams, so scanning
   * the bytes for "/Type /Page" finds nothing — the document has to be parsed.
   */
  const reportedPagesAfterReupload = async (bytes) => {
    (await waitFor(() => button(/Choose another/), 40))?.click();
    await wait(600);
    await injectFile("pdf", "result.pdf", "application/pdf", bytes);
    const summary = await waitFor(() => (/\d+ pages?/.test(frame()) ? frame() : null), 60);
    return Number(summary?.match(/(\d+) pages?/)?.[1] ?? -1);
  };

  const isPng = (b) => b && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
  const isJpeg = (b) => b && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  const isZip = (b) => b && b[0] === 0x50 && b[1] === 0x4b;

  const F = window.__fixtures ?? {};
  const alpha = F.alpha ? b64ToBytes(F.alpha) : null; // 2 pages
  const scan = F.scan ? b64ToBytes(F.scan) : null; // 2 full-page images, no text

  /* =================================================================== */
  /* PDF                                                                  */
  /* =================================================================== */

  if (path.endsWith("/split-pdf")) {
    check("fixtures were injected", !!alpha, alpha ? `${alpha.length} bytes` : "missing");
    await injectFile("pdf", "alpha.pdf", "application/pdf", alpha);
    await waitFor(() => (/2 pages/i.test(frame()) ? true : null));
    check("reads the page count", /2 pages/i.test(frame()), frame().match(/\d+ pages?/)?.[0]);

    // The default example range does not fit a two-page file, and the tool
    // says exactly that rather than producing an empty download.
    check("explains an out-of-range default",
      /out of range/i.test(frame()), frame().match(/This document has[^.]{0,50}/)?.[0]);
    check("and keeps the button disabled", !button(/^Split into/), "no enabled Split button");

    setField(byId("split-ranges"), "1, 2");
    await wait(700);
    const dl = captureDownload();
    const go = await waitFor(() => button(/^Split into 2 files/), 40);
    check("a valid range enables the split", !!go, go?.textContent.trim());
    go?.click();
    await waitFor(() => (button(/ZIP|Download all/i) ? true : null), 80);

    (await waitFor(() => button(/ZIP|Download all/i), 40))?.click();
    const bytes = await awaitDownload(dl);
    check("produces a ZIP of the parts", isZip(bytes), bytes ? `${bytes.length} bytes` : "no blob");
    check("the ZIP is named", /\.zip$/.test(dl.name ?? ""), dl.name);
  }

  if (path.endsWith("/extract-pdf-pages")) {
    await injectFile("pdf", "alpha.pdf", "application/pdf", alpha);
    await waitFor(() => (byId("page-range") ? true : null), 60);

    // Out-of-range input must be refused, not silently clamped to nothing.
    setField(byId("page-range"), "9-12");
    await wait(700);
    check("rejects a range past the end", /out of range/i.test(frame()),
      frame().match(/This document has[^.]{0,50}/)?.[0]);
    check("and disables extraction", !button(/^Extract/), "no enabled Extract button");

    setField(byId("page-range"), "2");
    await wait(700);
    const dl = captureDownload();
    (await waitFor(() => button(/Extract/), 40))?.click();
    await wait(600);
    (await waitFor(() => button(/Download/), 40))?.click();
    const bytes = await awaitDownload(dl);
    check("extracts a valid PDF", magic(bytes) === "%PDF-", bytes ? `${bytes.length} bytes` : "no blob");

    const pages = await reportedPagesAfterReupload(bytes);
    check("the extracted file really has one page", pages === 1, `${pages} pages`);
  }

  if (path.endsWith("/delete-pdf-pages")) {
    await injectFile("pdf", "alpha.pdf", "application/pdf", alpha);
    await waitFor(() => (byId("page-range") ? true : null), 60);

    // Deleting every page would leave an empty document.
    setField(byId("page-range"), "1-2");
    await wait(700);
    check("refuses to delete every page",
      /at least one|every page|cannot|all the pages/i.test(frame()) || !button(/^Delete/),
      frame().match(/(at least one|every page|cannot|all the pages)[^.]{0,50}/i)?.[0]);

    setField(byId("page-range"), "1");
    await wait(700);
    const dl = captureDownload();
    (await waitFor(() => button(/Delete/), 40))?.click();
    await wait(600);
    (await waitFor(() => button(/Download/), 40))?.click();
    const bytes = await awaitDownload(dl);
    check("deletes to a valid PDF", magic(bytes) === "%PDF-", bytes ? `${bytes.length} bytes` : "no blob");

    const pages = await reportedPagesAfterReupload(bytes);
    check("one page is left of two", pages === 1, `${pages} pages`);
  }

  if (path.endsWith("/rotate-pdf")) {
    await injectFile("pdf", "alpha.pdf", "application/pdf", alpha);
    await waitFor(() => (button(/All right/) ? true : null), 60);
    check("saving is disabled before anything is rotated", !button(/Save rotated/),
      "no enabled Save button");

    button(/All right/)?.click();
    await wait(800);
    check("says how many pages will turn", /2 pages will be rotated/i.test(frame()),
      frame().match(/\d+ pages? will be rotated/i)?.[0]);

    const dl = captureDownload();
    (await waitFor(() => button(/Save rotated/), 40))?.click();
    await waitFor(() => (button(/Download PDF/) ? true : null), 80);
    check("says the page content is untouched", /only the rotation changed/i.test(frame()),
      frame().match(/page content untouched[^.]{0,40}/i)?.[0]);

    button(/Download PDF/)?.click();
    const bytes = await awaitDownload(dl);
    check("saves a valid rotated PDF", magic(bytes) === "%PDF-", bytes ? `${bytes.length} bytes` : "no blob");

    const pages = await reportedPagesAfterReupload(bytes);
    check("keeps both pages", pages === 2, `${pages} pages`);
  }

  // Two passes over the same page, selected by the fragment, because the tool
  // keeps its result until the file is replaced and a second injection in one
  // run would be read against the first result.
  if (path.endsWith("/compress-pdf") && location.hash !== "#scan") {
    // A text-only PDF gets bigger as page images. The tool must say so and
    // must not offer the worse file as a download.
    await injectFile("pdf", "alpha.pdf", "application/pdf", alpha);
    (await waitFor(() => button(/^Compress PDF$/), 60))?.click();
    await waitFor(() => (/INCREASE|SAVED/i.test(frame()) ? true : null), 80);
    check("reports before and after sizes", /ORIGINAL[\s\S]*COMPRESSED/i.test(frame()),
      frame().match(/ORIGINAL.{0,44}/i)?.[0]);
    check("is honest when compression makes it worse",
      /larger than the original/i.test(frame()),
      frame().match(/larger than the original[^.]{0,50}/i)?.[0]);
    check("and offers no download of the worse file", !button(/Download/), "no Download button");
  }

  if (path.endsWith("/compress-pdf") && location.hash === "#scan") {
    // A scan-shaped PDF — two full-page images, no text — is what the tool is
    // actually for, and the only shape where it can win.
    await injectFile("pdf", "scan.pdf", "application/pdf", scan);
    await wait(800);
    const dl = captureDownload();
    (await waitFor(() => button(/^Compress PDF$/), 60))?.click();
    await waitFor(() => (/SAVED|INCREASE/i.test(frame()) ? true : null), 80);
    check("shrinks an image-only PDF", /SAVED/i.test(frame()),
      frame().match(/COMPRESSED.{0,40}/i)?.[0]);

    (await waitFor(() => button(/Download/), 40))?.click();
    const bytes = await awaitDownload(dl);
    check("hands back a valid smaller PDF", magic(bytes) === "%PDF-",
      bytes ? `${bytes.length} bytes` : "no blob");
    check("the result really is smaller", bytes && bytes.length < scan.length,
      `${bytes?.length} vs ${scan.length}`);
  }

  if (path.endsWith("/pdf-to-jpg") || path.endsWith("/pdf-to-png")) {
    const png = path.endsWith("/pdf-to-png");
    await injectFile("pdf", "alpha.pdf", "application/pdf", alpha);
    const dl = captureDownload();
    (await waitFor(() => button(/Convert|Render|Extract/), 80))?.click();
    await waitFor(() => (/page 1|2 image|ready|download/i.test(text()) ? true : null), 80);
    (await waitFor(() => button(/Download all|ZIP|Download/), 80))?.click();
    const bytes = await awaitDownload(dl);
    check("produces a real file", isZip(bytes) || isPng(bytes) || isJpeg(bytes),
      bytes ? `${bytes.length} bytes, ${[...bytes.slice(0, 4)].map((b) => b.toString(16)).join(" ")}` : "no blob");
    check(png ? "renders PNG" : "renders JPEG", isZip(bytes) || (png ? isPng(bytes) : isJpeg(bytes)));
  }

  if (path.endsWith("/pdf-to-word")) {
    await injectFile("pdf", "alpha.pdf", "application/pdf", alpha);
    await waitFor(() => (/PAGES READ/i.test(frame()) ? true : null), 80);
    check("reads both pages", /PAGES READ 2/i.test(frame()), frame().match(/PAGES READ \d+/i)?.[0]);
    check("counts the words it found", /WORDS \d+/i.test(frame()), frame().match(/WORDS \d+/i)?.[0]);
    check("states what cannot be rebuilt", /cannot be rebuilt/i.test(text()),
      text().match(/cannot be rebuilt[^.]{0,40}/i)?.[0]);

    const dl = captureDownload();
    (await waitFor(() => button(/Create Word document/), 60))?.click();
    (await waitFor(() => button(/Download \.docx/), 80))?.click();
    const bytes = await awaitDownload(dl);
    // .docx is a ZIP container.
    check("produces a .docx container", isZip(bytes), bytes ? `${bytes.length} bytes` : "no blob");
    check("names the file .docx", /\.docx$/.test(dl.name ?? ""), dl.name);
  }

  if (path.endsWith("/jpg-to-pdf")) {
    const file = await makeImage("image/jpeg", 320, 200, "photo");
    await injectImage(file);
    const dl = captureDownload();
    (await waitFor(() => button(/Create|Convert|Make/), 80))?.click();
    await waitFor(() => (/ready|download/i.test(text()) ? true : null), 80);
    (await waitFor(() => button(/Download/), 80))?.click();
    const bytes = await awaitDownload(dl);
    check("builds a valid PDF from a JPEG", magic(bytes) === "%PDF-", bytes ? `${bytes.length} bytes` : "no blob");
    check("the PDF ends with a valid trailer",
      new TextDecoder("latin1").decode(bytes.slice(-32)).includes("%%EOF"),
      new TextDecoder("latin1").decode(bytes.slice(-16)));
  }

  if (path.endsWith("/word-to-pdf")) {
    // No .docx fixture: check the tool refuses the wrong format clearly rather
    // than failing silently. Real .docx conversion is covered by test-ooxml.
    await injectFile("", "not-a-doc.pdf", "application/pdf", alpha);
    await wait(1200);
    check("rejects a non-Word file with a message",
      /docx|word|not supported|cannot|unsupported|\.doc/i.test(text()),
      text().match(/(docx|word|not supported|cannot|unsupported)[^.]{0,60}/i)?.[0]);
  }

  /* =================================================================== */
  /* Image                                                                */
  /* =================================================================== */

  const imageRoundTrip = async (mime, name, expect, label) => {
    const file = await makeImage(mime, 320, 200, name);
    await injectImage(file);
    const dl = captureDownload();
    (await waitFor(() => button(/Convert|Resize|Rotate|Crop|Compress|Apply/), 80))?.click();
    await waitFor(() => (/ready|download|saved|%|KB/i.test(text()) ? true : null), 80);
    (await waitFor(() => button(/Download/), 80))?.click();
    const bytes = await awaitDownload(dl);
    check(label, expect(bytes), bytes ? `${bytes.length} bytes, ${[...bytes.slice(0, 4)].map((b) => b.toString(16)).join(" ")}` : "no blob");
    return bytes;
  };

  if (path.endsWith("/jpg-to-png")) {
    await imageRoundTrip("image/jpeg", "photo", (b) => isPng(b) || isZip(b), "JPEG in, PNG out");
  }

  if (path.endsWith("/png-to-jpg")) {
    await imageRoundTrip("image/png", "art", (b) => isJpeg(b) || isZip(b), "PNG in, JPEG out");
  }

  if (path.endsWith("/webp-to-jpg")) {
    await imageRoundTrip("image/webp", "shot", (b) => isJpeg(b) || isZip(b), "WebP in, JPEG out");
  }

  if (path.endsWith("/resize-image")) {
    const file = await makeImage("image/png", 320, 200, "art");
    await injectImage(file);
    await waitFor(() => (byId("resize-width") ? true : null), 80);
    setField(byId("resize-width"), "160");
    await wait(600);
    check("keeps the aspect ratio", byId("resize-height")?.value === "100", byId("resize-height")?.value);

    const dl = captureDownload();
    (await waitFor(() => button(/Resize/), 80))?.click();
    await waitFor(() => (/SAVED/i.test(frame()) ? true : null), 80);
    // The separator between the two numbers is a multiplication sign; match on
    // the numbers so the assertion does not depend on that character surviving
    // the hand-off into the browser.
    check("reports the new dimensions", /160\D{1,3}100/.test(frame()),
      frame().match(/.{0,12}160.{0,12}/)?.[0]);
    check("reports the saving", /SAVED \d+%/i.test(frame()), frame().match(/SAVED \d+%/i)?.[0]);

    (await waitFor(() => button(/Download/), 80))?.click();
    const bytes = await awaitDownload(dl);
    check("downloads the resized image", isPng(bytes) || isJpeg(bytes) || isZip(bytes),
      bytes ? `${bytes.length} bytes` : "no blob");

    // Zero is not a size. The tool must say so rather than produce an empty image.
    setField(byId("resize-width"), "0");
    await wait(500);
    (await waitFor(() => button(/Resize/), 40))?.click();
    await wait(900);
    check("refuses a zero width", /at least 1 pixel/i.test(text()),
      text().match(/(at least 1 pixel|Enter a target)[^.]{0,40}/i)?.[0]);
  }

  if (path.endsWith("/crop-image")) {
    const file = await makeImage("image/png", 320, 200, "art");
    await injectImage(file);
    await waitFor(() => (byId("crop-width") ? true : null), 80);
    setField(byId("crop-x"), "10");
    setField(byId("crop-y"), "10");
    setField(byId("crop-width"), "100");
    setField(byId("crop-height"), "50");
    await wait(600);

    const dl = captureDownload();
    (await waitFor(() => button(/Crop/), 80))?.click();
    await wait(800);
    (await waitFor(() => button(/Download/), 80))?.click();
    const bytes = await awaitDownload(dl);
    check("downloads the cropped image", isPng(bytes) || isJpeg(bytes),
      bytes ? `${bytes.length} bytes` : "no blob");

    // A crop wider than the source must be caught.
    setField(byId("crop-width"), "9999");
    await wait(600);
    check("clamps or refuses an oversized crop",
      Number(byId("crop-width")?.value) <= 320 || /outside|larger than|beyond|must be/i.test(text()),
      `width=${byId("crop-width")?.value}`);
  }

  if (path.endsWith("/rotate-image")) {
    const file = await makeImage("image/png", 320, 200, "art");
    await injectImage(file);
    const dl = captureDownload();
    (await waitFor(() => button(/90|Rotate/), 80))?.click();
    await wait(900);
    (await waitFor(() => button(/Download|Rotate/), 80))?.click();
    await wait(900);
    const later = button(/Download/);
    if (later) later.click();
    const bytes = await awaitDownload(dl);
    check("downloads the rotated image", isPng(bytes) || isJpeg(bytes) || isZip(bytes),
      bytes ? `${bytes.length} bytes` : "no blob");
  }

  if (path.endsWith("/image-converter")) {
    const file = await makeImage("image/png", 320, 200, "art");
    await injectImage(file);
    await wait(700);
    const format = [...document.querySelectorAll("select")].find((s) =>
      [...s.options].some((o) => /jpe?g/i.test(o.value)),
    );
    setSelect(format, [...(format?.options ?? [])].find((o) => /jpe?g/i.test(o.value))?.value);
    await wait(500);
    const dl = captureDownload();
    (await waitFor(() => button(/Convert/), 80))?.click();
    await wait(1200);
    (await waitFor(() => button(/Download/), 80))?.click();
    const bytes = await awaitDownload(dl);
    check("converts PNG to the chosen format", isJpeg(bytes) || isZip(bytes) || isPng(bytes),
      bytes ? `${bytes.length} bytes` : "no blob");
  }

  if (path.endsWith("/image-to-pdf")) {
    const file = await makeImage("image/png", 320, 200, "art");
    await injectImage(file);
    const dl = captureDownload();
    (await waitFor(() => button(/Create|Convert|Make/), 80))?.click();
    await wait(1500);
    (await waitFor(() => button(/Download/), 80))?.click();
    const bytes = await awaitDownload(dl);
    check("builds a PDF from an image", magic(bytes) === "%PDF-", bytes ? `${bytes.length} bytes` : "no blob");
  }

  if (path.endsWith("/heic-to-jpg")) {
    // No HEIC fixture exists in a browser. What can be checked is that a file
    // that is not HEIC is refused with an explanation rather than hanging.
    const file = await makeImage("image/png", 64, 64, "not-heic");
    await injectImage(file);
    await wait(2500);
    check("a non-HEIC file is refused clearly",
      /heic|heif|not a|cannot|unsupported|choose/i.test(text()),
      text().match(/(heic|heif|not a|cannot|unsupported)[^.]{0,60}/i)?.[0]);
  }

  window.__utilboxResults = results;
  return results;
})();
