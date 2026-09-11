/**
 * Interaction suite for the 30 tools added in September 2026.
 *
 * Same shape as smoke2.js and smoke3.js: drive each page the way a person
 * would, then compare against a value worked out independently — published
 * hashes, hand-computed tax figures, reference shoe-size rows. Files are built
 * in the page (canvas images, a hand-written PDF, a synthesised WAV) and fed
 * to the real file input, and downloads are captured and checked by magic
 * bytes.
 *
 * Voice to text runs in two phases (-JsBefore starts it, -Js checks it after
 * -Settle), because downloading the model can outlast one evaluate budget.
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
  const awaitDownload = async (state, tries = 100) => {
    await waitFor(() => state.name && state.blob, tries);
    return state.blob ? new Uint8Array(await state.blob.arrayBuffer()) : null;
  };
  const head = (bytes, n = 5) => (bytes ? String.fromCharCode(...bytes.slice(0, n)) : "");

  const inject = async (file, input = document.querySelector("input[type=file]")) => {
    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await wait(700);
  };
  const canvasFile = (type, name, draw, w = 120, h = 80) =>
    new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      draw(canvas.getContext("2d"), w, h);
      canvas.toBlob((blob) => resolve(new File([blob], name, { type })), type, 0.92);
    });

  /** A minimal but valid single-page A4 PDF, with an Info dictionary. */
  const makePdf = (stream, title = "Old title") => {
    const objects = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
      `<< /Title (${title}) /Author (Tester) >>`,
    ];
    let out = "%PDF-1.4\n";
    const offsets = [];
    objects.forEach((object, index) => {
      offsets.push(out.length);
      out += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });
    const xref = out.length;
    out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}`;
    out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    return new File([out], "test.pdf", { type: "application/pdf" });
  };
  const tableStream = () => {
    const rows = [
      ["Item", "Qty", "Price"],
      ["Widget", "2", "9.99"],
      ["Gadget", "10", "1,024.50"],
      ["Bolt", "100", "0.15"],
    ];
    let stream = "BT /F1 11 Tf ";
    rows.forEach((row, r) => row.forEach((cell, c) => (stream += `1 0 0 1 ${60 + c * 150} ${700 - r * 22} Tm (${cell}) Tj `)));
    return `${stream}ET`;
  };

  // Tool components are lazy chunks; wait for the loading skeleton to go.
  await waitFor(() => !document.querySelector('[aria-label="Loading the tool"]') && document.querySelector("#main .shadow-raised"), 150);
  // The tool HTML is server-rendered, so it is visible before React hydrates.
  // Over a slow link that gap is seconds, and clicks in it are lost (a form
  // even submits natively and navigates away). Wait until React owns a control.
  await waitFor(
    () =>
      [...document.querySelectorAll("#main .shadow-raised input, #main .shadow-raised button, #main .shadow-raised textarea")].some((el) =>
        Object.keys(el).some((key) => key.startsWith("__reactProps")),
      ),
    300,
  );
  await wait(300);

  try {
    /* ------------------------------------------------------------ calculators */
    if (path.endsWith("/take-home-pay-calculator")) {
      check("UK £40,000 take-home is £32,319.60", /£32,319\.60 a year/.test(frame()), frame().match(/£[\d,]+\.\d\d a year/)?.[0]);
      byId("take-home-country-ca")?.click();
      await wait(500);
      check("Ontario $60,000 take-home is $47,339.75", /\$47,339\.75 a year/.test(frame()), frame().match(/\$[\d,]+\.\d\d a year/)?.[0]);
      byId("take-home-country-au")?.click();
      await wait(500);
      check("Australia $60,000 take-home is $50,380.00", /\$50,380\.00 a year/.test(frame()), frame().match(/\$[\d,]+\.\d\d a year/)?.[0]);
      byId("take-home-country-in")?.click();
      await wait(500);
      check("India ₹15 lakh (new regime) take-home is ₹14,02,500", /₹14,02,500\.00 a year/.test(frame()), frame().match(/₹[\d,]+\.\d\d a year/)?.[0]);
      setField(byId("take-home-salary"), "-5");
      await wait(300);
      check("a negative salary is refused", /Enter a gross salary above zero/.test(frame()));
    }

    if (path.endsWith("/paint-coverage-calculator")) {
      check("4 × 3 m bedroom needs 5.79 L", /5\.79 L/.test(frame()), frame().match(/[\d.]+ L/)?.[0]);
      check("tins: 5 L + 1 L", /1 × 5 L tin \+ 1 × 1 L tin/.test(frame()));
      byId("paint-mode-wallpaper")?.click();
      await wait(300);
      setField(byId("paper-repeat"), "26");
      await wait(300);
      check("wallpaper with a 26 cm repeat needs 9 rolls", /rolls of wallpaper 9 /i.test(frame()), frame().match(/rolls of wallpaper \d+/i)?.[0]);
    }

    if (path.endsWith("/pet-age-calculator")) {
      check("a 6-year-old Labrador is 45", /45 years/.test(frame()));
      check("DNA formula gives about 60", /60 years/.test(frame()));
      byId("pet-species-cat")?.click();
      await wait(300);
      setField(byId("pet-years"), "10");
      await wait(300);
      // International Cat Care: mature adult is 7-10 years, senior starts at 11.
      check("a 10-year-old cat is 56 and a mature adult", /56 years/.test(frame()) && /Mature adult/.test(frame()), frame().slice(0, 160));
      setField(byId("pet-years"), "11");
      await wait(300);
      check("an 11-year-old cat is senior", /\bSenior\b/.test(frame()), frame().slice(0, 160));
    }

    if (path.endsWith("/ev-charging-cost-calculator")) {
      check("60 kWh, 20→80%, $0.15/kWh costs $6.00", /\$6\.00/.test(frame()));
      setField(byId("ev-to"), "10");
      await wait(300);
      check("an end level below the start is refused", /start level below the end level/.test(frame()));
    }

    if (path.endsWith("/subscription-cost-tracker")) {
      await wait(400);
      check("example list is $54.03 a month", /\$54\.03/.test(frame()), frame().slice(0, 120));
      check("and $648.36 a year", /\$648\.36/.test(frame()));
    }

    /* ------------------------------------------------------------- converters */
    if (path.endsWith("/shoe-size-converter")) {
      check("US men's 9 is a 26.2 cm foot", /26\.2 cm/.test(frame()));
      check("which is UK 8 and EU 41.5", /\buk 8 /i.test(frame()) && /european \(eu\) 41\.5/i.test(frame()), frame().slice(0, 300));
      byId("shoe-mode-foot")?.click();
      await wait(300);
      setField(byId("shoe-foot"), "25");
      await wait(300);
      check("a 25 cm foot is UK 6.5, EU 39.5, Mondopoint 250", /\buk 6\.5/i.test(frame()) && /\(eu\) 39\.5/i.test(frame()) && /250 mm/i.test(frame()));
    }

    if (path.endsWith("/engine-cc-to-hp")) {
      check("1500 cc turbo petrol estimates 150–240 hp", /150–240 hp/.test(frame()));
      check("1500 cc is 91.5 cubic inches", /91\.5 cubic inches/.test(frame()));
      check("100 PS is 98.6 hp and 73.5 kW", /98\.6/.test(frame()) && /73\.5/.test(frame()));
    }

    if (path.endsWith("/timezone-meeting-planner")) {
      setField(byId("tz-date"), "2026-09-15");
      await wait(400);
      button(/^Remove Mumbai/)?.click();
      await wait(400);
      const summary = [...document.querySelectorAll("#main p")].map((p) => p.textContent).find((t) => /working hours everywhere|No hour falls/.test(t));
      check("London and New York overlap at 14:00, 15:00, 16:00", /14:00, 15:00, 16:00/.test(summary ?? ""), summary);
      button(/^Select 14:00/)?.click();
      await wait(300);
      const invite = document.querySelector("#main pre")?.textContent ?? "";
      check("14:00 London is 09:00 Tue in New York (EDT)", /09:00 Tue New York \(EDT\)/.test(invite), invite);
      setField(byId("tz-add"), "Asia/Kathmandu");
      button(/^Add$/)?.click();
      await wait(500);
      check("a 45-minute offset zone is added", /Kathmandu/.test(frame()) && /UTC\+5:45/.test(frame()));
    }

    /* ------------------------------------------------------------- generators */
    if (path.endsWith("/schema-generator")) {
      const out = () => byId("schema-output")?.value ?? "";
      check("FAQPage JSON-LD with two questions", /"@type": "FAQPage"/.test(out()) && (out().match(/"@type": "Question"/g) ?? []).length === 2);
      check("valid FAQ reports no errors", /No errors/.test(frame()));
      byId("schema-mode-product")?.click();
      await wait(400);
      setField(byId("schema-name"), "Mug");
      setField(byId("schema-price"), "$12");
      await wait(300);
      check("a price with a symbol is an error", /plain number/.test(frame()));
      setField(byId("schema-price"), "12.50");
      setField(byId("schema-gtin"), "4006381333932");
      await wait(300);
      check("a wrong GTIN check digit is caught", /check digit is wrong/.test(frame()));
      setField(byId("schema-gtin"), "4006381333931");
      await wait(300);
      check("a valid product has no errors", /No errors/.test(frame()) && /"priceCurrency": "USD"/.test(out()), frame().match(/\d+ errors? to fix/)?.[0]);
      setField(byId("schema-name"), "</script><b>x");
      await wait(300);
      check("</script> in a field cannot close the tag", !out().includes("</script><b>"));
    }

    if (path.endsWith("/utm-builder")) {
      check(
        "tagged link built",
        /https:\/\/example\.com\/landing-page\?utm_source=newsletter&utm_medium=email&utm_campaign=spring-sale/.test(frame()),
      );
      setField(byId("utm-utm_source"), "News Letter");
      await wait(500);
      check("values are lower-cased with hyphens", /utm_source=news-letter/.test(frame()));
      await waitFor(() => document.querySelector('img[alt="QR code for the tagged link"]'), 60);
      check("QR code generated", !!document.querySelector('img[alt="QR code for the tagged link"]'));
      button(/Save to history/)?.click();
      await wait(500);
      check("link saved to history", /Saved links \(1\)/.test(frame()), frame().match(/Saved links \(\d+\)/)?.[0]);
    }

    if (path.endsWith("/robots-txt-generator")) {
      button(/Test this file/)?.click();
      await wait(600);
      const verdict = (p) => [...document.querySelectorAll("#main li")].find((li) => li.textContent.includes(p))?.textContent ?? "";
      check("/admin/settings is blocked for Googlebot", /Blocked/.test(verdict("/admin/settings")), verdict("/admin/settings"));
      check("/blog/first-post is allowed", /Allowed/.test(verdict("/blog/first-post")));
      check("/search?q=shoes is blocked", /Blocked/.test(verdict("/search?q=shoes")));
    }

    if (path.endsWith("/qr-code-wifi-vcard")) {
      setField(byId("qr-ssid"), "Cafe;Guest");
      setField(byId("qr-password"), "pa:ss,1");
      const image = await waitFor(() => document.querySelector('img[alt^="QR code"]'), 80);
      check("Wi-Fi QR image rendered", image?.src.startsWith("data:image/png"));
      check("card shows the network name", /Network: Cafe;Guest/.test(frame()));
      const download = captureDownload();
      button(/Download PNG/)?.click();
      const png = await awaitDownload(download);
      check("PNG download", head(png, 4) === "\x89PNG", download.name);
    }

    /* -------------------------------------------------------------- developer */
    if (path.endsWith("/checksum-verifier")) {
      await inject(new File(["abc"], "abc.txt", { type: "text/plain" }));
      setField(byId("checksum-expected"), "BA7816BF8F01CFEA414140DE5DAE2223B00361A396177A9CB410FF61F20015AD  abc.txt");
      await wait(200);
      button(/Calculate checksums/)?.click();
      // The first run downloads the hash-wasm chunk, which can take several
      // seconds over a slow connection.
      await waitFor(() => /Match —|No match —/.test(frame()), 300);
      check("MD5 of abc", /900150983cd24fb0d6963f7d28e17f72/.test(frame()));
      check("SHA-256 of abc", /ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad/.test(frame()));
      check("a sha256sum line matches", /Match — the SHA-256 checksums are identical/.test(frame()), frame().match(/(No match|Match) — [^.]*/)?.[0]);
      setField(byId("checksum-expected"), "900150983cd24fb0d6963f7d28e17f73");
      await wait(200);
      button(/Calculate checksums/)?.click();
      // The verdict updates as soon as the checksum is pasted, so "No match" is
      // already on screen before this click; wait for the re-hash to finish
      // (the button comes back) rather than accepting that stale verdict.
      await wait(300);
      await waitFor(() => button(/Calculate checksums/) && /No match —/.test(frame()), 100);
      check(
        "one changed digit is a mismatch",
        /No match — the MD5 checksums differ/.test(frame()),
        `value=${byId("checksum-expected")?.value} | ${frame().match(/Recognised as [^.]*|not a recognised[^.]*/)?.[0]} | ${frame().match(/(No match|Match) — [^.]*/)?.[0]} | button=${Boolean(button(/Calculate checksums/))}`,
      );
    }

    if (path.endsWith("/password-strength-checker")) {
      const score = () => frame().match(/(Very weak|Weak|Fair|Strong|Very strong) Score (\d) of 4/);
      setField(byId("password-input"), "P@ssw0rd1!");
      await waitFor(score, 200);
      check("a common password scores 0–1", Number(score()?.[2]) <= 1, score()?.[0]);
      setField(byId("password-input"), "correct-horse-battery-staple-lantern-91");
      await waitFor(() => score() && Number(score()[2]) >= 3, 60);
      check("a long random passphrase scores 3–4", Number(score()?.[2]) >= 3, score()?.[0]);
      const sent = performance.getEntriesByType("resource").some((entry) => /ssw0rd|lantern/.test(entry.name));
      check("the password never appears in a request", !sent);
    }

    if (path.endsWith("/email-syntax-checker")) {
      check("gmial.com gets a gmail.com suggestion", /Did you mean sam@gmail\.com/.test(frame()));
      check("a double dot is explained", /two dots in a row/.test(frame()));
      // The defaults are example.com (a null MX) and gmial.com (no MX, only an
      // A record), so add a domain that really does publish mail servers.
      setField(byId("email-input"), "jane.doe@example.com\nsam@gmial.com\njo@gmail.com");
      await wait(300);
      button(/Check mail servers/)?.click();
      await waitFor(() => /Accepts mail/.test(frame()) && /null MX/.test(frame()), 200);
      check("MX lookup finds gmail.com's mail servers", /Accepts mail: [a-z0-9.-]*google\.com/.test(frame()), frame().match(/Accepts mail[^.]{0,60}/)?.[0]);
      check("example.com's null MX is explained", /null MX/.test(frame()), frame().match(/No mail delivery[^.]*/)?.[0]);
    }

    if (path.endsWith("/ssl-expiry-checker")) {
      setField(byId("ssl-domain"), "github.com");
      button(/Check certificate/)?.click();
      await waitFor(() => /github\.com: |could not|did not/.test(frame()), 150);
      check("github.com certificate is read", /github\.com: (Valid for|Expires in)/.test(frame()), frame().match(/github\.com: [^.]{0,40}|[^.]*(could not|did not)[^.]*/)?.[0]);
      check("chain and covered names listed", /Certificate chain/.test(frame()) && /Names covered/.test(frame()));
      setField(byId("ssl-domain"), "localhost");
      button(/Check certificate/)?.click();
      await waitFor(() => /not a valid public domain/.test(frame()), 80);
      check("localhost is refused", /not a valid public domain/.test(frame()));
    }

    if (path.endsWith("/og-preview")) {
      setField(byId("og-url"), "https://example.com");
      button(/^Preview$/)?.click();
      await waitFor(() => /og:image is missing|could not|did not respond|failed|not a valid/.test(frame()), 150);
      check(
        "example.com's missing og:image is reported",
        /og:image is missing/.test(frame()),
        frame().match(/Problem: [^.]*|[^.]*(could not|did not respond|failed|not a valid)[^.]*/)?.[0] ?? frame().slice(0, 160),
      );
      byId("og-mode-write")?.click();
      await wait(300);
      setField(byId("og-draft-title"), 'Say "hi" <b>');
      await wait(300);
      const snippet = byId("og-snippet")?.value ?? "";
      check("written tags are attribute-escaped", snippet.includes('content="Say &quot;hi&quot; &lt;b&gt;"'), snippet.split("\n")[0]);
    }

    /* ------------------------------------------------------------------- text */
    if (path.endsWith("/linkedin-formatter")) {
      const editor = byId("linkedin-editor");
      const start = editor.value.indexOf("Three");
      editor.focus();
      editor.setSelectionRange(start, start + 5);
      button(/^Bold$/)?.click();
      await wait(500);
      const styled = byId("linkedin-editor").value.slice(start, start + 10);
      check("Bold makes mathematical sans-serif letters", styled.codePointAt(0) === 0x1d5e7, styled.codePointAt(0)?.toString(16));
      const again = byId("linkedin-editor");
      again.focus();
      again.setSelectionRange(start, start + 10);
      button(/^Plain$/)?.click();
      await wait(500);
      check("Plain turns it back", byId("linkedin-editor").value.slice(start, start + 5) === "Three");
      check("feed preview has a see-more cut", /see more/.test(frame()));
    }

    if (path.endsWith("/resume-ats-checker")) {
      await inject(makePdf("BT /F1 12 Tf 72 700 Td (Jane Doe jane@example.com) Tj ET"));
      await waitFor(() => byId("ats-resume")?.value, 80);
      check("text is extracted from a PDF resume", /jane@example\.com/.test(byId("ats-resume")?.value ?? ""), byId("ats-resume")?.value);
      const bullets = Array.from({ length: 40 }, (_, i) => `• Led project ${i + 1} and improved delivery time by ${10 + i}% using SQL dashboards`).join("\n");
      setField(byId("ats-resume"), `Jane Doe\njane@example.com\n+44 20 7946 0958\nExperience\nAnalyst 2021 – 2024\n${bullets}\nEducation\nBSc 2017 – 2020\nSkills\nSQL, Power BI`);
      setField(byId("ats-job"), "We are hiring a Senior Data Analyst. You will build dashboards in Power BI and SQL. Power BI experience required. Strong SQL and Python skills.");
      await wait(300);
      button(/^Check resume$/)?.click();
      await wait(600);
      check("scores are shown", /overall match/i.test(frame()) && /keyword match/i.test(frame()));
      check("Python is reported missing", /Missing from your resume.*python/i.test(frame()));
    }

    if (path.endsWith("/voice-to-text")) {
      if (!window.__voiceStarted) {
        window.__voiceStarted = true;
        const rate = 16000;
        const samples = rate * 2;
        const buffer = new ArrayBuffer(44 + samples * 2);
        const view = new DataView(buffer);
        const text = (offset, value) => [...value].forEach((ch, i) => view.setUint8(offset + i, ch.charCodeAt(0)));
        text(0, "RIFF");
        view.setUint32(4, 36 + samples * 2, true);
        text(8, "WAVE");
        text(12, "fmt ");
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, rate, true);
        view.setUint32(28, rate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        text(36, "data");
        view.setUint32(40, samples * 2, true);
        for (let i = 0; i < samples; i += 1) view.setInt16(44 + i * 2, Math.round(Math.sin((2 * Math.PI * 440 * i) / rate) * 6000), true);
        await inject(new File([buffer], "tone.wav", { type: "audio/wav" }));
        check("a WAV clip is accepted", /tone\.wav/.test(frame()));
        button(/^Transcribe$/)?.click();
        await wait(2500);
        check("the speech model starts loading", /speech model|Transcribing|Transcript|No speech/.test(frame()), frame().match(/(Downloading|Loading|Transcribing)[^…]*/)?.[0]);
      } else {
        await waitFor(() => /Transcript|No speech was recognised|could not run/.test(frame()), 350);
        check("Whisper ran to completion on the device", /Transcript|No speech was recognised/.test(frame()), frame().match(/(Transcript|No speech[^.]*|could not run[^.]*|Downloading[^…]*)/)?.[0]);
        const toSite = performance.getEntriesByType("resource").filter((entry) => /\/api\//.test(entry.name)).length;
        check("no request went to this site's API", toSite === 0, toSite);
      }
    }

    /* -------------------------------------------------------------------- pdf */
    if (path.endsWith("/pdf-metadata-editor")) {
      await inject(makePdf("BT /F1 24 Tf 72 700 Td (Hello) Tj ET"));
      await waitFor(() => byId("meta-title")?.value, 100);
      check("existing title is read", byId("meta-title")?.value === "Old title", byId("meta-title")?.value);
      setField(byId("meta-title"), "New title");
      setField(byId("meta-author"), "");
      await wait(200);
      button(/^Save PDF$/)?.click();
      await waitFor(() => /has been saved/.test(frame()), 100);
      check("read-back shows the new title", /Title New title/.test(frame()), frame().match(/Title [^|]{0,20}/)?.[0]);
      check("the cleared author is removed", /Author — \(not set\)/.test(frame()));
      const download = captureDownload();
      button(/^Download PDF$/)?.click();
      check("downloads a PDF", head(await awaitDownload(download)) === "%PDF-");
    }

    if (path.endsWith("/pdf-resize-page")) {
      await inject(makePdf("BT /F1 24 Tf 72 700 Td (Hello) Tj ET"));
      // The first PDF opened on a page downloads pdf-lib, which is slow on a poor link.
      await waitFor(() => /Current pages:/.test(frame()), 300);
      check("an A4 page is detected", /1 × A4 portrait/.test(frame()), frame().match(/Current pages: .{0,30}/)?.[0] ?? frame().slice(0, 160));
      button(/^Convert to US Letter$/)?.click();
      await waitFor(() => /resized PDF is ready/.test(frame()), 150);
      check("the saved file is US Letter", /Pages in the saved file: 1 × US Letter portrait/.test(frame()));
      check("content scaled to 94.1%", /94\.1%/.test(frame()));
    }

    if (path.endsWith("/pdf-add-page-numbers")) {
      await inject(makePdf("BT /F1 24 Tf 72 700 Td (Hello) Tj ET"));
      await waitFor(() => button(/^Add page numbers$/), 100);
      button(/^Add page numbers$/)?.click();
      await waitFor(() => /numbered PDF is ready/.test(frame()), 150);
      check("numbered and previewed from the saved file", /1 page numbered/.test(frame()) && !!document.querySelector('img[alt^="Page 1 of the numbered PDF"]'));
    }

    if (path.endsWith("/pdf-table-to-excel")) {
      await inject(makePdf(tableStream(), "Table"));
      await waitFor(() => document.querySelector("#main table"), 100);
      check("4 rows × 3 columns detected", /rows 4 /i.test(frame()) && /columns 3 /i.test(frame()), frame().match(/rows \d+.{0,20}columns \d+/i)?.[0]);
      check("1,024.50 becomes a number", [...document.querySelectorAll("#main td")].some((td) => td.textContent === "1024.50"));
      const download = captureDownload();
      button(/Download Excel/)?.click();
      check("an .xlsx is downloaded", head(await awaitDownload(download), 2) === "PK");
    }

    /* ------------------------------------------------------------------ image */
    if (path.endsWith("/heic-to-jpg")) {
      check("retargeted intro is live", /Convert iPhone HEIC photos to JPG online/.test(document.body.innerText));
    }

    if (path.endsWith("/webp-to-png")) {
      const webp = await canvasFile("image/webp", "art.webp", (ctx, w, h) => {
        ctx.fillStyle = "rgba(255,0,0,0.5)";
        ctx.fillRect(0, 0, w / 2, h);
      });
      check("the browser made a WebP to test with", head(new Uint8Array(await webp.arrayBuffer()), 4) === "RIFF");
      await inject(webp);
      await waitFor(() => button(/^Convert$/), 80);
      button(/^Convert$/)?.click();
      await waitFor(() => button(/^Download PNG$/), 100);
      const download = captureDownload();
      button(/^Download PNG$/)?.click();
      check("a PNG is produced", head(await awaitDownload(download), 4) === "\x89PNG", download.name);
    }

    if (path.endsWith("/image-color-palette")) {
      const png = await canvasFile(
        "image/png",
        "two.png",
        (ctx, w, h) => {
          ctx.fillStyle = "#ff0000";
          ctx.fillRect(0, 0, w * 0.6, h);
          ctx.fillStyle = "#0000ff";
          ctx.fillRect(w * 0.6, 0, w * 0.4, h);
        },
        100,
        50,
      );
      await inject(png);
      await waitFor(() => /#FF0000/.test(frame()), 100);
      check("red is found at 60%", /#FF0000[^#]*60\.0%/.test(frame()), frame().match(/#FF0000[^#]{0,90}/)?.[0]);
      check("blue is found at 40%", /#0000FF[^#]*40\.0%/.test(frame()));
    }

    if (path.endsWith("/exif-remover")) {
      const base = new Uint8Array(await (await canvasFile("image/jpeg", "photo.jpg", (ctx, w, h) => ((ctx.fillStyle = "#33aa66"), ctx.fillRect(0, 0, w, h)))).arrayBuffer());
      const ascii = (s) => [...s].map((c) => c.charCodeAt(0));
      // Little-endian TIFF: Make "TestCam" (8 bytes, stored at offset 38) and Orientation 6.
      const tiff = [0x49, 0x49, 0x2a, 0x00, 8, 0, 0, 0, 2, 0, 0x0f, 0x01, 2, 0, 8, 0, 0, 0, 38, 0, 0, 0, 0x12, 0x01, 3, 0, 1, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, ...ascii("TestCam"), 0];
      const length = tiff.length + 8;
      const jpeg = new Uint8Array([...base.slice(0, 2), 0xff, 0xe1, length >> 8, length & 255, ...ascii("Exif"), 0, 0, ...tiff, ...base.slice(2)]);
      await inject(new File([jpeg], "photo.jpg", { type: "image/jpeg" }));
      await waitFor(() => /metadata fields/.test(frame()), 100);
      check("EXIF is read from the photo", /TestCam/.test(document.querySelector("#main details")?.textContent ?? ""), frame().match(/\d+ metadata fields/)?.[0]);
      button(/^Remove metadata from 1 photo$/)?.click();
      await waitFor(() => /Checked:/.test(frame()), 100);
      check("re-reading finds nothing but the rotation", /no readable metadata left/.test(frame()), frame().match(/Checked:[^.]*/)?.[0]);
      const download = captureDownload();
      button(/^Download$/)?.click();
      const out = await awaitDownload(download);
      check("the cleaned JPEG has no camera make", out && head(out, 2) === "\xff\xd8" && !String.fromCharCode(...out).includes("TestCam"));
    }

    if (path.endsWith("/favicon-generator")) {
      byId("favicon-mode-text")?.click();
      await waitFor(() => document.querySelectorAll('img[alt^="Icon at"]').length === 4, 80);
      check("four icon previews are drawn", document.querySelectorAll('img[alt^="Icon at"]').length === 4);
      const download = captureDownload();
      button(/Download favicon package/)?.click();
      const zip = await awaitDownload(download);
      check("a ZIP package is downloaded", head(zip, 2) === "PK", `${zip?.length} bytes`);
      const names = zip ? new TextDecoder("latin1").decode(zip) : "";
      check("it holds favicon.ico, the Apple icon and the manifest", /favicon\.ico/.test(names) && /apple-touch-icon\.png/.test(names) && /site\.webmanifest/.test(names));
    }
  } catch (error) {
    check("page script ran without throwing", false, error?.stack ?? error);
  }

  if (results.length === 0) check("this page has checks", false, path);
  window.__utilboxResults = results;
  return results;
})();
