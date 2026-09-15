/**
 * Interaction suite for the 13 image tools added in batch 2.
 *
 * Same shape as smoke5.js: build a test picture in the page, feed it to the
 * tool, drive the controls and check what the tool reports. Run through
 * scripts/smoke6.ps1, which reads this file as UTF-8 — the multiplication sign
 * in the dimension checks is mangled if the script is read as ANSI.
 */
(async () => {
  const out = [];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const waitFor = async (fn, tries = 120) => { for (let i = 0; i < tries; i++) { try { const v = fn(); if (v) return v; } catch {} await wait(100); } return null; };
  const frame = () => (document.querySelector("#main .shadow-raised")?.innerText ?? "").replace(/\s+/g, " ");
  const button = (re) => [...document.querySelectorAll("button")].find((b) => re.test(b.textContent.trim()));
  const check = (n, p, d) => out.push({ name: n, pass: !!p, detail: String(d ?? "").slice(0, 120) });
  await waitFor(() => [...document.querySelectorAll("#main .shadow-raised input, #main .shadow-raised button")].some((el) => Object.keys(el).some((k) => k.startsWith("__reactProps"))), 300);
  await wait(300);
  const put = async (file) => { const i = document.querySelector("input[type=file]"); const t = new DataTransfer(); t.items.add(file); i.files = t.files; i.dispatchEvent(new Event("change", { bubbles: true })); await wait(1200); };
  const canvasFile = (type, name) => new Promise((res) => { const c = document.createElement("canvas"); c.width = 400; c.height = 300; const x = c.getContext("2d"); x.fillStyle = "#c0392b"; x.fillRect(0,0,400,300); x.fillStyle = "#2980b9"; x.fillRect(0,0,200,300); c.toBlob((b) => res(new File([b], name, { type })), type, 0.9); });
  const path = location.pathname;

  if (path.endsWith("/circle-crop-image")) {
    await put(await canvasFile("image/png", "t.png"));
    check("circle crop produces a picture", await waitFor(() => /Your picture is ready/.test(frame()), 150), frame().match(/\d+ × \d+/)?.[0]);
    check("output is the square side (300)", /300 × 300/.test(frame()), frame().match(/\d+ × \d+/)?.[0]);
  }
  if (path.endsWith("/grayscale-image")) {
    await put(await canvasFile("image/png", "t.png"));
    check("grayscale produces a picture", await waitFor(() => /Your picture is ready/.test(frame()), 150), frame().slice(0, 90));
  }
  if (path.endsWith("/color-blindness-simulator")) {
    await put(await canvasFile("image/png", "t.png"));
    check("simulator produces a picture", await waitFor(() => /Your picture is ready/.test(frame()), 150), frame().slice(0, 90));
  }
  if (path.endsWith("/svg-to-png")) {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><rect width="100" height="50" fill="#16a34a"/></svg>';
    await put(new File([svg], "t.svg", { type: "image/svg+xml" }));
    check("svg renders to png", await waitFor(() => /Your PNG is ready/.test(frame()), 200), frame().match(/\d+ × \d+/)?.[0]);
    check("aspect ratio kept at 2:1", /1,?024 × 512/.test(frame()), frame().match(/\d+ × \d+/)?.[0]);
  }
  if (path.endsWith("/jpg-to-avif")) {
    // A browser that cannot encode AVIF shows a notice instead of a dropzone,
    // which is the honest behaviour and must not read as a failure here.
    const unsupported = /cannot create AVIF/.test(frame());
    if (unsupported) {
      check("a browser without AVIF encoding is told plainly", true, frame().slice(0, 110));
    } else {
      await put(await canvasFile("image/jpeg", "t.jpg"));
      check("avif encodes", await waitFor(() => /AVIF is ready/.test(frame()), 250), frame().slice(0, 110));
    }
  }
  if (path.endsWith("/blur-faces-in-photo")) {
    await put(await canvasFile("image/jpeg", "t.jpg"));
    const surface = await waitFor(() => document.querySelector("#main .cursor-crosshair"), 150);
    const box = surface.getBoundingClientRect();
    const at = (fx, fy, type) => surface.dispatchEvent(new PointerEvent(type, { clientX: box.left + box.width * fx, clientY: box.top + box.height * fy, bubbles: true, pointerId: 1, isPrimary: true }));
    at(0.1, 0.1, "pointerdown"); at(0.5, 0.5, "pointermove"); at(0.5, 0.5, "pointerup");
    await wait(400);
    check("area is marked", /1 area marked/.test(frame()), frame().match(/\d+ areas? marked/)?.[0]);
    button(/^Apply blur$/)?.click();
    check("blur applies", await waitFor(() => /Your picture is ready/.test(frame()), 200), frame().slice(0, 90));
  }
  if (path.endsWith("/youtube-thumbnail-downloader")) {
    const input = document.getElementById("yt-input");
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await wait(1500);
    const shown = document.querySelectorAll("#main li img").length;
    check("thumbnail sizes are listed", shown > 0, shown + " previews");
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, "not a link");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await wait(400);
    check("a bad link is refused", /does not look like a YouTube link/.test(frame()), frame().slice(0, 80));
  }
  if (path.endsWith("/passport-photo-maker")) {
    await put(await canvasFile("image/jpeg", "t.jpg"));
    check("passport size is produced", await waitFor(() => /Your picture is ready/.test(frame()), 150), frame().match(/\d+ × \d+/)?.[0]);
    check("413 x 531 px at 300 DPI", /413 × 531/.test(frame()), frame().match(/\d+ × \d+/)?.[0]);
  }
  if (path.endsWith("/image-watermark")) {
    await put(await canvasFile("image/jpeg", "t.jpg"));
    check("watermark produces a picture", await waitFor(() => /Your picture is ready/.test(frame()), 150), frame().slice(0, 90));
  }
  if (path.endsWith("/image-dpi-changer")) {
    await put(await canvasFile("image/jpeg", "t.jpg"));
    check("dpi tool produces a picture", await waitFor(() => /Your picture is ready/.test(frame()), 150), frame().match(/\d+ × \d+/)?.[0]);
  }
  if (path.endsWith("/instagram-image-resizer")) {
    await put(await canvasFile("image/jpeg", "t.jpg"));
    check("instagram size is produced", await waitFor(() => /Your picture is ready/.test(frame()), 150), frame().match(/\d+ × \d+/)?.[0]);
    check("square post is 1080 x 1080", /1080 × 1080/.test(frame()), frame().match(/\d+ × \d+/)?.[0]);
  }
  if (path.endsWith("/png-to-webp") || path.endsWith("/jpg-to-webp")) {
    const type = path.endsWith("/png-to-webp") ? "image/png" : "image/jpeg";
    await put(await canvasFile(type, type === "image/png" ? "t.png" : "t.jpg"));
    button(/Convert to WebP/)?.click();
    check("converts to webp", await waitFor(() => /ready|WebP/i.test(frame()), 200), frame().slice(0, 100));
  }
  return out;
})()
