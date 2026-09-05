/**
 * Image to Text (OCR), tested on its own because Tesseract downloads a
 * language model of several megabytes on first use — more than one CDP
 * evaluation budget allows.
 *
 * The runner loads the page twice. The first pass checks the progress states
 * are shown while the model downloads; the second, with the model cached,
 * checks the text that comes back. Set window.__ocrWarmOnly for the first.
 */
(async () => {
  const results = [];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const check = (name, pass, detail) => results.push({ name, pass: !!pass, detail });

  const waitFor = async (fn, tries = 60) => {
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

  const button = (pattern) =>
    [...document.querySelectorAll("button")].find(
      (b) => pattern.test(b.textContent.trim()) && !b.disabled,
    );
  const frame = () =>
    (document.querySelector("#main .shadow-raised")?.innerText ?? "").replace(/\s+/g, " ");

  // Large, high-contrast, horizontal type is the case the tool claims to be
  // reliable on, so that is what it is given.
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 200;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 640, 200);
  ctx.fillStyle = "#000000";
  ctx.font = "bold 64px Georgia, serif";
  ctx.fillText("UTILBOX", 40, 90);
  ctx.font = "48px Georgia, serif";
  ctx.fillText("READS TEXT", 40, 165);
  const blob = await new Promise((r) => canvas.toBlob(r, "image/png"));

  const input = await waitFor(() => document.querySelector("input[type=file][accept*=image]"), 60);
  const dt = new DataTransfer();
  dt.items.add(new File([blob], "sign.png", { type: "image/png" }));
  input.files = dt.files;
  input.dispatchEvent(new Event("change", { bubbles: true }));
  await wait(800);

  const go = await waitFor(() => button(/Extract text/), 60);
  check("an image enables recognition", !!go, go?.textContent.trim());
  go?.click();

  if (window.__ocrWarmOnly) {
    // A silent multi-second wait is what makes a tool feel broken, so the
    // download has to narrate itself.
    const progress = await waitFor(
      () => (/Loading|Downloading|Preparing|Reading/i.test(frame()) ? frame() : null),
      60,
    );
    check("shows what it is doing while the model downloads", !!progress,
      progress?.match(/(Loading|Downloading|Preparing|Reading)[^.]{0,40}/i)?.[0]);
    // Let the download finish so the measured pass starts from a warm cache.
    await waitFor(() => document.getElementById("ocr-output")?.value, 300);
    return results;
  }

  const output = await waitFor(() => {
    const value = document.getElementById("ocr-output")?.value;
    if (value && value.trim()) return value;
    if (/could not be recognised|failed to download/i.test(frame())) return "ERROR";
    return null;
  }, 380);

  check("produced text", !!output && output !== "ERROR",
    output ? String(output).replace(/\s+/g, " ").slice(0, 60) : "nothing after 38s");
  check("recognised both lines", /UTILBOX/i.test(String(output ?? "")) && /READS/i.test(String(output ?? "")),
    String(output ?? "").replace(/\s+/g, " ").slice(0, 60));
  check("reports a confidence figure", /\d+% confidence/i.test(frame()),
    frame().match(/\d+% confidence/i)?.[0]);
  check("counts the words it found", /WORDS FOUND \d+/i.test(frame()),
    frame().match(/WORDS FOUND \d+/i)?.[0]);

  return results;
})();
