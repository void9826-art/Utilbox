import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-20";

export const whyPdfAndImagesGuides: Guide[] = [
  {
    slug: "file-got-bigger-after-compressing",
    topic: "PDF",
    title: "Why a PDF or image got bigger after compressing it",
    seoTitle: "Why a File Got Bigger After Compressing It",
    description:
      "Compressing a text PDF or an already-small JPG can make it larger. Why it happens, how to tell in advance, and what to do instead to get a smaller file.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["compress-pdf", "compress-image", "image-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            A file gets bigger after compressing when it was already efficient. A PDF of typed text stores
            letters as tiny instructions, so turning its pages into pictures adds data. A JPG that was
            already compressed, re-saved at a high quality or converted to PNG, also grows. Keep the
            original, and compress only files made of photos or scans.
          </p>

          <h2>Why “compress” does not always mean “smaller”</h2>
          <p>
            Compression is not a single operation that squeezes any file. Each tool makes a trade: it
            replaces what is in the file with a different way of storing it, and hopes the new way is
            shorter. That works when the original is wasteful — a 12-megapixel photo of a receipt, a scan
            saved at 600 dpi in full colour. It backfires when the original was already lean.
          </p>

          <h3>Text PDFs</h3>
          <p>
            A PDF exported from Word or Google Docs does not contain a picture of each page. It contains the
            words, the font to draw them with, and their positions. A page of text can be a few kilobytes.
            Browser-based PDF compressors, including{" "}
            <Link href="/pdf/compress-pdf">Compress PDF</Link> on this site, get their big savings by
            redrawing every page as an image and re-encoding it. For a scan that is a huge win, because the
            page was an oversized image already. For a typed document it replaces a few kilobytes of text
            with a picture of that text, which is larger — and the words can no longer be selected. The tool
            warns you when the result is bigger than what you started with; when it does, keep the original.
          </p>

          <h3>Images that were already compressed</h3>
          <p>
            JPG compression throws away detail the eye is unlikely to miss. Once that has happened,
            re-saving the image cannot throw the same detail away twice, so the savings get smaller each
            time. Worse, if the original was saved at quality 70 and you re-save it at quality 95, the
            encoder faithfully preserves the blocky artefacts from the first save at high quality, and the
            file grows while looking no better.
          </p>

          <h3>Changing format in the wrong direction</h3>
          <p>
            PNG is lossless: it keeps every pixel exactly. That is ideal for screenshots and logos with flat
            colour, and wasteful for photos. Converting a 300 KB JPG photo to PNG commonly produces a file
            several times larger. The same happens converting WebP or AVIF to JPG — the newer formats are
            more efficient, so the JPG version is bigger even at a similar quality.
          </p>

          <h2>How to tell in advance</h2>
          <ul>
            <li>
              <strong>For a PDF, try selecting a word.</strong> If you can highlight text, the page is
              stored as text, and image-based compression will probably make it bigger. If the whole page
              highlights as one block, or nothing highlights, it is a scan and will shrink well.
            </li>
            <li>
              <strong>Compare size with page count.</strong> A typed document under about 100 KB per page
              has little left to lose. A scan at 1–3 MB per page has plenty.
            </li>
            <li>
              <strong>For an image, check the format and size together.</strong> A photo that is a PNG, or
              a JPG of several megabytes straight off a phone, will shrink. A JPG already a few hundred
              kilobytes at a modest pixel size will not shrink much more without visible damage.
            </li>
          </ul>

          <h2>What to do instead</h2>
          <ol>
            <li>
              <strong>Typed PDF too big?</strong> Look for what is heavy inside it — usually photos or a
              logo placed at print resolution. Re-export from the original program with a smaller image
              setting, or replace the photos with smaller copies before exporting.
            </li>
            <li>
              <strong>Photo too big?</strong> Reduce the pixel dimensions first. A photo going on a web form
              or into an email rarely needs more than 1600–2000 pixels on its long side, and halving the
              width and height removes about three quarters of the pixels.{" "}
              <Link href="/image/compress-image">Compress Image</Link> can resize and compress in one pass,
              or aim at a target such as 200 KB directly.
            </li>
            <li>
              <strong>Always start from the original.</strong> Compress the best copy you have, once, at
              the setting you need. Compressing an already compressed copy loses quality without saving
              much space.
            </li>
            <li>
              <strong>Pick the format to suit the content.</strong> Photos as JPG or WebP; screenshots,
              diagrams and anything with transparency as PNG. The{" "}
              <Link href="/image/image-converter">Image Converter</Link> converts in batches and shows you
              the output size, so you can compare before you commit.
            </li>
          </ol>

          <h2>Mistakes that make it worse</h2>
          <ul>
            <li>Running a file through several compressors in a row, hoping each one helps a bit.</li>
            <li>Taking a screenshot of a PDF page to “make it smaller” — it usually does the opposite.</li>
            <li>Zipping a PDF or JPG. Both are already compressed, so a ZIP saves almost nothing.</li>
            <li>
              Choosing the maximum quality setting “to be safe”. Near 100, size climbs steeply while the
              visible difference is negligible.
            </li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Is it a scan or photo (will shrink) or typed text (will not)?</li>
            <li>Compressing the original, not a copy that was already compressed?</li>
            <li>Pixel size reduced to what the destination actually needs?</li>
            <li>Format matched to the content: JPG/WebP for photos, PNG for flat graphics?</li>
            <li>Result compared with the original before you delete anything?</li>
          </ul>
          <p>
            For hitting a specific upload limit, see{" "}
            <Link href="/guides/get-a-pdf-under-an-upload-limit">getting a PDF under 100 KB, 500 KB or 1 MB</Link>
            .
          </p>
        </>
      );
    },
  },

  {
    slug: "pdf-rejected-by-upload-form",
    topic: "PDF",
    title: "Why a form rejects your PDF even though it is under the size limit",
    seoTitle: "Why a Form Rejects Your PDF Under the Size Limit",
    description:
      "Upload portals reject PDFs for more than size: passwords, form fields, odd file names, the wrong file type and page limits. How to find the cause and fix it.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-flatten-form", "compress-pdf", "jpg-to-pdf", "merge-pdf"],
    Body: function Body() {
      return (
        <>
          <p>
            When a form rejects a PDF that is under its size limit, the cause is usually one of five things:
            a password or restrictions, fillable form fields, a file that is not really a PDF, a file name
            the portal dislikes, or a page count or page size rule. Each has a quick test and a fix.
          </p>

          <h2>1. The PDF is password-protected or restricted</h2>
          <p>
            Bank statements, payslips and documents from government sites are often encrypted. Some need a
            password to open; others open freely but carry restrictions on printing or editing. Many portals
            reject both, because their systems need to read or stamp the file.
          </p>
          <p>
            <strong>Test:</strong> open the PDF and look at its properties or security information. A lock
            icon, a password prompt, or “Security: password encryption” is the sign.
          </p>
          <p>
            <strong>Fix:</strong> if you are entitled to the document and know its password, open it and
            use your viewer’s Print → Save as PDF (or Microsoft Print to PDF on Windows). The new copy has no
            password. If that option is blocked, ask the issuer for an unprotected copy rather than trying to
            break the protection.
          </p>

          <h2>2. It still has fillable form fields</h2>
          <p>
            A filled-in form keeps your answers in separate, editable fields. Some upload systems strip or
            ignore those fields, so the reviewer sees a blank form, and some reject interactive PDFs
            outright. <Link href="/pdf/pdf-flatten-form">Flatten PDF Form</Link> paints each answer onto the
            page and removes the fields, so the file looks the same everywhere. Keep the editable copy in
            case you need to change an answer.
          </p>

          <h2>3. It is not actually a PDF</h2>
          <p>
            Renaming <code>scan.jpg</code> to <code>scan.pdf</code> changes the label, not the contents.
            Many portals check the first few bytes of the file, which say what it really is, and refuse a
            mismatch. The same happens with a Word file saved with a .pdf ending, or a “PDF” that is
            actually a web page saved from a browser.
          </p>
          <p>
            <strong>Fix:</strong> convert it properly. Photos and scans go through{" "}
            <Link href="/pdf/jpg-to-pdf">JPG to PDF</Link>; Word files through Word to PDF or your word
            processor’s export. If several separate files need to become one upload, combine them with{" "}
            <Link href="/pdf/merge-pdf">Merge PDF</Link>.
          </p>

          <h2>4. The file name trips the system</h2>
          <p>
            Older portals can fail on spaces, accents, brackets, ampersands, apostrophes or very long names
            — <code>Résumé (final) v2 – copy.pdf</code> is a good way to find out. Some also refuse an
            upper-case extension such as <code>.PDF</code>. Rename it to plain letters, numbers and hyphens:{" "}
            <code>resume-jane-smith-2026.pdf</code>.
          </p>

          <h2>5. Page count, page size or orientation rules</h2>
          <p>
            Some forms want one page per slot, A4 only, or portrait pages only, and check those quietly. If
            the instructions mention any of them, believe them: a 3-page upload in a 1-page slot can fail
            with a generic error. Split the document, or delete instruction and blank pages before uploading.
          </p>

          <h2>Still rejected? Less common causes</h2>
          <ul>
            <li>
              <strong>The size check counts differently.</strong> Some sites treat 1 MB as 1,000 KB, others
              as 1,024 KB. Aim about 5% below the stated limit. If you need to shrink a scanned file,{" "}
              <Link href="/pdf/compress-pdf">Compress PDF</Link> does it in your browser.
            </li>
            <li>
              <strong>The PDF is damaged.</strong> A download that was interrupted, or a file emailed through
              a system that altered it, may open in a forgiving viewer but fail a strict check. Re-download
              it, or re-save it via Print → Save as PDF.
            </li>
            <li>
              <strong>The portal wants a particular kind of PDF.</strong> Some court and archive systems ask
              for PDF/A, or for text-searchable files rather than images. These requirements vary, so check
              the current instructions for the specific portal.
            </li>
            <li>
              <strong>The browser is the problem.</strong> Ad blockers, an expired session or an outdated
              browser can break upload widgets. Try a private window or another browser before changing the
              file again.
            </li>
          </ul>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Changing the extension to make a file “become” a PDF.</li>
            <li>Uploading a screenshot of a PDF, which is often blurry and may be rejected as the wrong type.</li>
            <li>Compressing over and over until the text is unreadable, when the real problem was a password.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Opens without a password, with no security restrictions?</li>
            <li>Form fields flattened?</li>
            <li>Made by a real conversion, not renamed?</li>
            <li>Simple file name ending in lower-case .pdf?</li>
            <li>Page count, size and orientation match the instructions?</li>
            <li>Size about 5% under the limit?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "pdf-text-blurry-and-cannot-be-selected",
    topic: "PDF",
    title: "Why the text in a PDF looks blurry and cannot be selected",
    seoTitle: "Why PDF Text Looks Blurry and Can't Be Selected",
    description:
      "Blurry, unselectable text means the PDF holds pictures of pages, not text. How to check, why it happened, and how to get crisp, searchable text back.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["image-to-text", "pdf-to-text", "word-to-pdf"],
    Body: function Body() {
      return (
        <>
          <p>
            If PDF text turns fuzzy when you zoom in and you cannot highlight a word, the PDF contains
            pictures of the pages rather than real text. That happens with scans, phone photos, screenshots,
            “print as image” and heavy compression. Re-export from the original document if you have it;
            otherwise run OCR to recover the words.
          </p>

          <h2>Text vs a picture of text</h2>
          <p>
            A PDF can hold two very different things that look the same at normal size. Real text is stored
            as characters plus a font, and the viewer draws each letter fresh at whatever zoom you choose, so
            it stays razor sharp at 400%. A picture of text is a grid of pixels, fixed when it was made.
            Zoom in and the pixels grow: edges go soft, then blocky.
          </p>
          <p>
            Because a picture has no characters in it, there is nothing to select, search or copy. That is
            also why screen readers cannot read it aloud, and why recruiters’ or courts’ systems may treat
            it as empty.
          </p>

          <h2>A 10-second test</h2>
          <ol>
            <li>Open the PDF and press Ctrl+F (Cmd+F on a Mac). Search for a word you can see on the page.</li>
            <li>Try to drag across a single line of text.</li>
          </ol>
          <p>
            Found and highlighted word by word: real text. Not found, or the whole page highlights as one
            rectangle: an image. Some PDFs mix both — a typed letter with a scanned signature page — so test
            more than one page.
          </p>

          <h2>How the text became a picture</h2>
          <ul>
            <li>
              <strong>It was scanned or photographed.</strong> Scanners and phone scanning apps produce
              images unless they run text recognition.
            </li>
            <li>
              <strong>Image-based compression.</strong> Compressors that redraw pages as images to shrink
              them turn text into pixels. Good for scans; bad for typed documents.
            </li>
            <li>
              <strong>“Print as image” or screenshots.</strong> Printing to PDF with a “print as image”
              option, or pasting screenshots into a document, flattens everything.
            </li>
            <li>
              <strong>A low scan resolution.</strong> Text scanned at 150 dpi or less looks soft even at
              100% zoom. For documents with small print, 300 dpi is the usual recommendation.
            </li>
          </ul>

          <h2>How to get sharp, selectable text back</h2>
          <ol>
            <li>
              <strong>Go back to the source.</strong> If the document was typed, the cleanest fix is to
              export it again from Word, Google Docs or wherever it came from, using Save as PDF or Export,
              not Print as image. If you only have a .docx, <Link href="/pdf/word-to-pdf">Word to PDF</Link>{" "}
              produces a text PDF in your browser.
            </li>
            <li>
              <strong>Recover the words with OCR.</strong> Optical character recognition reads the shapes of
              letters and turns them back into text. Export a page as an image and use{" "}
              <Link href="/image/image-to-text">Image to Text</Link>, which runs in your browser after a
              one-time model download. Check names and numbers carefully afterwards; OCR mistakes 0 for O and
              1 for l, especially on poor scans.
            </li>
            <li>
              <strong>Rescan if the scan is the problem.</strong> At 300 dpi in grayscale, small print is
              much clearer, and OCR gets far more right.
            </li>
          </ol>
          <p>
            Already have a PDF that does contain text and just want to copy it out cleanly?{" "}
            <Link href="/pdf/pdf-to-text">PDF to Text</Link> extracts it with sensible line breaks. On an
            image-only PDF it finds nothing, which is itself a useful confirmation.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Compressing a typed CV or contract with an image-based compressor before sending it.</li>
            <li>Sharpening a blurry scan: it adds contrast, not detail, and can make OCR worse.</li>
            <li>Trusting OCR output on figures — amounts, dates and ID numbers — without proofreading.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Ctrl+F finds a visible word on every page that matters?</li>
            <li>Typed documents exported directly, not printed as images?</li>
            <li>Scans made at 300 dpi for small print?</li>
            <li>OCR results proofread for numbers and names?</li>
          </ul>
          <p>
            For a longer walk-through of OCR on whole documents, see{" "}
            <Link href="/guides/get-text-from-a-scanned-pdf">getting editable text out of a scanned PDF</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "filled-pdf-form-shows-blank",
    topic: "PDF",
    title: "Why your filled-in PDF form looks blank to someone else",
    seoTitle: "Why a Filled-In PDF Form Looks Blank to Others",
    description:
      "You filled in a PDF form, but the recipient sees empty boxes or the printout is blank. Why viewers disagree about form fields, and how flattening fixes it.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-flatten-form", "pdf-signature", "merge-pdf"],
    Body: function Body() {
      return (
        <>
          <p>
            A filled PDF form can look blank to someone else because the answers live in interactive fields,
            not on the page. If the file was not saved after filling, if their viewer ignores the fields, or
            if an upload system strips them, the boxes appear empty. Flattening the form paints the answers
            onto the page so they show everywhere.
          </p>

          <h2>Where your answers actually live</h2>
          <p>
            A fillable PDF has two layers: the printed page, and floating fields on top. When you type into a
            field, the viewer stores your answer in the field and draws a small picture of it, called its
            appearance. Another viewer can either redraw the field from the stored value, use that saved
            picture, or — in some cases — ignore both. Most do the right thing most of the time. The gaps
            show up when files move between phones, browsers, Preview on a Mac, Adobe Reader and upload
            portals.
          </p>

          <h2>The common causes</h2>
          <ul>
            <li>
              <strong>The answers were never saved.</strong> Filling a form in a browser tab and then using
              the original download, rather than saving the filled copy, is the most common cause of all.
              Open the file you are about to send and check it.
            </li>
            <li>
              <strong>The viewer did not save an appearance.</strong> Some apps store the value but no
              picture of it, and rely on the next viewer to redraw it. If that viewer does not, the field
              looks empty until someone clicks into it.
            </li>
            <li>
              <strong>An upload system strips interactive content.</strong> Document portals and some email
              previews show only the page layer.
            </li>
            <li>
              <strong>Printing “document only” rather than “document and markups”.</strong> In some print
              dialogs the field layer is a separate option.
            </li>
            <li>
              <strong>A dynamic (XFA) form.</strong> Some government and corporate forms are built with an
              older Adobe technology that many viewers other than Adobe Reader cannot display. If the form
              shows a message telling you to use Adobe Reader, use it to fill and save that form.
            </li>
          </ul>

          <h2>The fix: flatten before you send</h2>
          <ol>
            <li>Fill in the form and save it. Reopen the saved copy to confirm the answers are there.</li>
            <li>
              Add it to <Link href="/pdf/pdf-flatten-form">Flatten PDF Form</Link>. It lists the fields it
              found, so you can see your answers were picked up.
            </li>
            <li>
              Press Flatten form. Each answer is drawn onto the page and the editable field removed, in your
              browser — the file is not uploaded.
            </li>
            <li>Open the flattened copy in a different app — a phone, another browser — and check every page.</li>
            <li>Send the flattened copy. Keep the editable one in case you need to change an answer.</li>
          </ol>
          <p>
            If the form needs a signature, add it before or after flattening with{" "}
            <Link href="/pdf/pdf-signature">Sign PDF</Link>. If you have to return the form with supporting
            documents as one file, flatten first and then combine them with{" "}
            <Link href="/pdf/merge-pdf">Merge PDF</Link>.
          </p>

          <h2>When not to flatten</h2>
          <p>
            Do not flatten a form that the recipient needs to process automatically — some organisations
            read the field values straight into their systems. If the instructions say to submit the
            fillable form, send the saved, unflattened copy and check it in a second viewer instead. If in
            doubt, ask which they want.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Sending the file you downloaded instead of the copy you filled and saved.</li>
            <li>Checking only in the app you filled it in; that is the one viewer guaranteed to show it.</li>
            <li>Flattening your only copy, then finding a typo.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Filled copy saved and reopened?</li>
            <li>Checked in a second viewer, ideally on another device?</li>
            <li>Flattened, unless the recipient asked for a fillable form?</li>
            <li>Editable original kept?</li>
          </ul>
          <p>
            For forms that are not fillable at all, see{" "}
            <Link href="/guides/how-to-fill-in-a-pdf-form">how to fill in any PDF form</Link>, and for what
            flattening does in general, <Link href="/guides/what-does-flattening-a-pdf-mean">what flattening a PDF means</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "signature-white-box-on-pdf",
    topic: "PDF",
    title: "Why your signature has a white box around it on a PDF",
    seoTitle: "Why Your Signature Has a White Box on a PDF",
    description:
      "A signature photo pasted onto a PDF covers lines and text with a white rectangle. Why JPG can't be transparent, and how to sign so only the ink shows.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-signature", "crop-image", "png-to-jpg"],
    Body: function Body() {
      return (
        <>
          <p>
            A signature shows a white box on a PDF because the image has a solid background. Photos and
            scans are usually JPG, and JPG cannot store transparency, so the paper around your ink is pasted
            too, covering lines and text. Draw the signature directly onto the PDF, or use a PNG whose
            background is truly transparent.
          </p>

          <h2>Why it happens</h2>
          <p>
            When you sign a sheet of paper and photograph it, the camera records the paper as well as the
            ink. Your eye treats the paper as “nothing”, but to the file it is thousands of light-grey
            pixels. Paste that image onto a contract and those pixels sit on top of whatever is underneath —
            the signature line, the date box, sometimes a word of the clause above.
          </p>
          <p>
            Two details make it worse. First, a phone photo of white paper is rarely pure white; it is
            slightly grey or yellow, so the box is visible even on a white page. Second, JPG has no way to
            mark a pixel as see-through. Converting a JPG to PNG does not help on its own: the PNG keeps the
            same opaque background, now losslessly.
          </p>

          <h2>The simplest fix: draw the signature on the PDF</h2>
          <ol>
            <li>
              Open <Link href="/pdf/pdf-signature">Sign PDF</Link> and add the document.
            </li>
            <li>Draw your signature with a mouse, finger or stylus.</li>
            <li>Click where it should go and set its width so it sits on the line.</li>
            <li>Download, and zoom in to check nothing underneath is hidden.</li>
          </ol>
          <p>
            The drawn signature is placed as an image with a transparent background, so the signature line
            and any text show through around the strokes. The document stays in your browser throughout.
          </p>

          <h2>If you must use a photo of your signature</h2>
          <ul>
            <li>
              <strong>Sign with a dark pen on plain white paper</strong>, in good, even light, with no shadow
              from your phone.
            </li>
            <li>
              <strong>Crop tightly</strong> to the ink with{" "}
              <Link href="/image/crop-image">Crop Image</Link>, so the box is as small as possible.
            </li>
            <li>
              <strong>Make the background transparent</strong> in an image editor that has a “remove
              background” or “select colour range” feature, then save as PNG — not JPG.
            </li>
            <li>
              <strong>Or place it where nothing is underneath</strong>, in empty space just above the line,
              so an opaque background covers nothing.
            </li>
          </ul>
          <p>
            Going the other way and need a JPG for a form that only accepts JPG? Transparency is replaced
            with a colour when you convert; <Link href="/image/png-to-jpg">PNG to JPG</Link> lets you choose
            white so the result looks clean on a white form.
          </p>

          <h2>Getting a neat signature when drawing</h2>
          <p>
            Signatures drawn with a mouse often look shaky, which is the main reason people fall back on a
            photo. A few habits help:
          </p>
          <ul>
            <li>
              <strong>Use a phone or tablet.</strong> A finger on a touchscreen is far steadier than a mouse;
              a stylus is better still.
            </li>
            <li>
              <strong>Draw it large, then shrink it.</strong> Sign across most of the drawing area and set a
              smaller width when you place it. Shrinking hides wobble; enlarging exaggerates it.
            </li>
            <li>
              <strong>Sign at your normal speed.</strong> Slow, careful strokes look less like your
              handwriting than a quick, natural one.
            </li>
            <li>
              <strong>Redo rather than patch.</strong> Clear and sign again instead of adding strokes to fix a
              line; corrections are easy to spot.
            </li>
          </ul>

          <h2>A note on what kind of signature this is</h2>
          <p>
            A drawn or pasted signature is a picture of your signature. Many everyday documents accept it,
            but some — certain contracts, government filings, financial forms — require a certificate-based
            digital signature, a wet-ink original, or a specific e-signing service. Check the requirement for
            the document in front of you.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Renaming signature.jpg to signature.png and expecting transparency.</li>
            <li>Covering the printed name or date with the signature’s background.</li>
            <li>Leaving a full-page photo of your signature in a shared folder where anyone can reuse it.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Signature drawn directly, or a PNG with a real transparent background?</li>
            <li>Zoomed to 200% around the signature: nothing hidden?</li>
            <li>Electronic signature acceptable for this document?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "website-says-image-format-not-supported",
    topic: "Images",
    title: "Why a website says your photo’s format is not supported",
    seoTitle: "Why a Website Says Your Image Isn't Supported",
    description:
      "Upload forms reject photos that look like JPGs. Usually the file is really HEIC, WebP or AVIF, or renamed. How to check what a file is and convert it properly.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["heic-to-jpg", "webp-to-jpg", "avif-to-jpg", "image-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            A website says your image format is not supported when the file is not a type it accepts, even
            if it looks like a normal photo. Usually it is an iPhone HEIC, a WebP or AVIF saved from a web
            page, or a file renamed rather than converted. Convert it properly to JPG and the upload will
            usually go through.
          </p>

          <h2>The usual suspects</h2>
          <ul>
            <li>
              <strong>HEIC from an iPhone or iPad.</strong> Apple devices save photos as HEIC by default.
              They usually convert to JPG when you share by email or upload in Safari, but not always —
              copying via a cable, AirDrop to a Mac, or a cloud folder keeps the HEIC.
            </li>
            <li>
              <strong>WebP or AVIF saved from a website.</strong> Right-click → Save image often saves the
              format the site served, which is now commonly WebP or AVIF. Older forms accept only JPG and
              PNG.
            </li>
            <li>
              <strong>A renamed file.</strong> Changing <code>photo.heic</code> to <code>photo.jpg</code>{" "}
              changes the name only. Many sites read the first bytes of the file, which reveal its true type,
              and reject the mismatch.
            </li>
            <li>
              <strong>A screenshot or scan in an unexpected format</strong>, such as TIFF, BMP or PDF, when
              the form wants an image.
            </li>
            <li>
              <strong>An upper-case or doubled extension.</strong> A few old portals reject <code>.JPG</code>{" "}
              or <code>.jpeg</code> when they expect <code>.jpg</code>, or a name like{" "}
              <code>photo.jpg.png</code>.
            </li>
          </ul>

          <h2>Why sites still refuse newer formats</h2>
          <p>
            HEIC, WebP and AVIF are well supported by phones and current browsers, so it can seem strange
            that a form rejects them. The upload page is only the front door, though. Behind it, the photo
            may be checked, resized, printed onto an ID card or passed to another organisation’s system,
            and every one of those steps has to understand the format. Sticking to JPG and PNG is the
            simplest way for a site to be sure the photo works all the way through, so many simply list
            those two and refuse the rest. There is nothing wrong with your photo; it just needs to be in
            the format the whole chain can read.
          </p>

          <h2>How to see what the file really is</h2>
          <ul>
            <li>
              <strong>Windows:</strong> turn on File name extensions in File Explorer’s View menu. Right-click
              the file → Properties shows the type.
            </li>
            <li>
              <strong>Mac:</strong> select the file and press Cmd+I. “Kind” shows the real format, such as
              HEIF Image or WebP.
            </li>
            <li>
              <strong>iPhone:</strong> in Photos, swipe up on a picture or tap the info button; the format is
              shown alongside the camera details.
            </li>
          </ul>
          <p>
            If the name says JPG but the Kind says HEIF or WebP, you have found the problem.
          </p>

          <h2>Convert it properly</h2>
          <p>Pick the converter that matches the real format. All of these run in your browser:</p>
          <ul>
            <li>
              HEIC or HEIF → <Link href="/image/heic-to-jpg">HEIC to JPG</Link>, which handles batches and
              downloads a ZIP.
            </li>
            <li>
              WebP → <Link href="/image/webp-to-jpg">WebP to JPG</Link>, with a background colour for any
              transparent areas.
            </li>
            <li>
              AVIF → <Link href="/image/avif-to-jpg">AVIF to JPG</Link>.
            </li>
            <li>
              Mixed batch, or JPG/PNG/WebP in any direction →{" "}
              <Link href="/image/image-converter">Image Converter</Link>, which can also cap the width so the
              result fits a size limit.
            </li>
          </ul>
          <p>
            After converting, rename the file to plain lower-case letters, numbers and hyphens, such as{" "}
            <code>passport-photo.jpg</code>, and upload the new copy.
          </p>

          <h2>Stop it happening again</h2>
          <ul>
            <li>
              On an iPhone, Settings → Camera → Formats → Most Compatible makes the camera save JPG. Photos
              take more space, so many people prefer to keep HEIC and convert when needed.
            </li>
            <li>
              Settings → Photos → Transfer to Mac or PC → Automatic converts photos to a compatible format
              when copied by cable.
            </li>
            <li>When saving a picture from a site, check the format before using it in a form.</li>
          </ul>

          <h2>When the format is right but it still fails</h2>
          <p>
            Check the other rules the form sets: file size, pixel dimensions, and sometimes the aspect ratio.
            Those failures can show the same vague error. See{" "}
            <Link href="/guides/photo-and-signature-size-for-online-forms">resizing a photo and signature for an online form</Link>
            .
          </p>

          <h2>Checklist</h2>
          <ul>
            <li>Real format checked, not just the name?</li>
            <li>Converted with a converter, not renamed?</li>
            <li>Plain lower-case file name ending in .jpg?</li>
            <li>Size and dimensions within the form’s limits?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "image-blurry-after-making-it-bigger",
    topic: "Images",
    title: "Why an image goes blurry when you make it bigger",
    seoTitle: "Why an Image Goes Blurry When You Enlarge It",
    description:
      "Enlarging a small image spreads the same pixels further, so edges go soft. How far you can safely upscale, why DPI won't help, and what to do instead.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["resize-image", "svg-to-png", "image-dpi-changer"],
    Body: function Body() {
      return (
        <>
          <p>
            An image goes blurry when enlarged because it has a fixed number of pixels, and making it bigger
            only spreads them out. Software fills the gaps by blending neighbouring colours, which softens
            edges. Up to about 150% the loss is usually acceptable; beyond that, find a larger original or
            a vector version instead.
          </p>

          <h2>What happens when you upscale</h2>
          <p>
            A 400 × 300 image contains 120,000 pixels. Resize it to 1600 × 1200 and the new image needs
            1.92 million. The other 1.8 million have to be invented. Ordinary resizing invents them by
            averaging the pixels nearby. That is the best guess available, but an average of a black edge and
            a white background is grey, so every sharp edge becomes a soft gradient. Text and logos suffer
            most, because they are almost all edges.
          </p>
          <p>
            The alternative — copying each pixel into a bigger block — keeps edges hard but produces visible
            staircases, which is what “pixelated” means. Either way, no detail is added that was not there.
          </p>

          <h2>How much can you enlarge?</h2>
          <p>
            There is no hard rule, but in practice:
          </p>
          <ul>
            <li>
              <strong>Up to about 150%:</strong> usually fine for photos viewed on screen.{" "}
              <Link href="/image/resize-image">Resize Image</Link> warns when you go beyond this.
            </li>
            <li>
              <strong>150–200%:</strong> noticeable softness on close inspection; often acceptable for a
              background or a small print.
            </li>
            <li>
              <strong>Beyond 200%:</strong> clearly blurry. Find another source.
            </li>
          </ul>
          <p>
            Photos tolerate it better than screenshots, text, line art and logos, where any softness shows.
          </p>

          <h2>Why changing DPI does not fix it</h2>
          <p>
            DPI is only an instruction about how big to print the pixels. Changing 72 DPI to 300 DPI without
            changing the pixel count leaves the image identical; it just prints smaller. Raising the pixel
            count to reach 300 DPI at a larger print size is the same as enlarging, with the same blur. The{" "}
            <Link href="/image/image-dpi-changer">DPI changer</Link> shows the pixel count a print really
            needs — for example, 1800 × 1200 for a 6 × 4 inch print at 300 DPI — so you can see whether the
            image you have is big enough.
          </p>

          <h2>Better options than enlarging</h2>
          <ol>
            <li>
              <strong>Find the original.</strong> A photo sent through a messaging app, or downloaded from
              social media, is usually a reduced copy. The original on the sender’s phone or camera is
              often four times larger in each direction.
            </li>
            <li>
              <strong>Use the vector version of logos and icons.</strong> An SVG has no pixels; it is a set of
              shapes that can be drawn at any size. Ask for the SVG, then use{" "}
              <Link href="/image/svg-to-png">SVG to PNG</Link> to draw it at exactly the size you need — it
              stays sharp at any width.
            </li>
            <li>
              <strong>Display it smaller.</strong> On a web page or document, a 600-pixel image looks fine in
              a 600-pixel space. Use a layout that does not stretch it.
            </li>
            <li>
              <strong>Recreate simple graphics.</strong> A small logo with text can often be retyped and
              redrawn faster than it can be rescued.
            </li>
            <li>
              <strong>AI upscalers</strong> generate plausible detail rather than recovering real detail.
              They can look good for photos but may invent wrong text, faces or numbers, so do not use them
              for documents, ID photos or anything evidential.
            </li>
          </ol>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Enlarging, then compressing heavily: the blur and the artefacts stack.</li>
            <li>Enlarging in several small steps; it is no better than one step.</li>
            <li>Sharpening to hide the blur on text, which adds halos instead.</li>
            <li>Upscaling an ID or passport photo to meet a pixel minimum — it may be rejected as unclear.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Is there a larger original or an SVG?</li>
            <li>Enlargement kept under about 150%?</li>
            <li>Pixel count checked against the print size you need?</li>
          </ul>
          <p>
            For the opposite problem — photos that were sharp but went soft once uploaded — see{" "}
            <Link href="/guides/why-photos-look-blurry-after-upload">why photos look blurry after uploading</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "same-size-photos-different-file-sizes",
    topic: "Images",
    title: "Why two photos the same size in pixels have very different file sizes",
    seoTitle: "Why Same-Size Photos Have Different File Sizes",
    description:
      "Two 4000 × 3000 photos can be 2 MB and 8 MB. Detail, noise, format, quality and hidden metadata decide the file size. What each does and how to shrink it.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["compress-image", "exif-remover", "image-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            Two photos with identical pixel dimensions can differ several times in file size because
            compression depends on content. Smooth skies and plain walls compress well; grass, gravel, text
            and noise from low light do not. Format, quality setting and embedded data such as thumbnails and
            location add to the difference.
          </p>

          <h2>Pixels set the ceiling, content sets the size</h2>
          <p>
            An uncompressed 4000 × 3000 photo would be about 36 MB: 12 million pixels, three bytes each.
            Formats such as JPG, WebP and HEIC get that down by describing the image more cleverly — “this
            whole patch is roughly the same blue” is shorter than listing every pixel. How much they can
            save depends on how predictable the picture is.
          </p>
          <ul>
            <li>
              <strong>Low detail compresses well:</strong> sky, a blurred background, a white wall, a
              document with lots of white paper.
            </li>
            <li>
              <strong>Fine detail does not:</strong> foliage, gravel, fabric, crowds, small text.
            </li>
            <li>
              <strong>Noise is the hidden culprit.</strong> Photos taken in dim light carry random speckle,
              and random detail is the hardest thing to compress. The same room photographed at night can be
              much larger than by day.
            </li>
          </ul>

          <h2>Other things that change the size</h2>
          <ul>
            <li>
              <strong>Quality setting.</strong> JPG quality 95 can be two to three times the size of quality
              80, with very little visible difference.
            </li>
            <li>
              <strong>Format.</strong> PNG is lossless and is several times larger than JPG for photos. HEIC
              and WebP are typically smaller than JPG at similar quality.
            </li>
            <li>
              <strong>Metadata.</strong> Camera details, GPS location, a preview thumbnail and sometimes depth
              or editing data ride along inside the file. Usually this is tens of kilobytes, occasionally
              more.
            </li>
            <li>
              <strong>Editing history.</strong> A photo that was edited and re-saved, or passed through
              several apps, may have been re-encoded at a different quality each time.
            </li>
          </ul>

          <h2>See it for yourself</h2>
          <p>
            Take two photos on the same phone, one after the other: one of a plain wall or the sky, one of a
            bush or a bookshelf. Then compare the file sizes. Same camera, same settings, same pixel count —
            and often a large difference in size, because the bush gives the encoder far more to describe.
            Then take the same bookshelf shot again with the lights dimmed. The extra noise from low light
            usually pushes the size up again, even though the picture looks darker and “emptier”. It is a
            quick way to see that file size measures how much information there is to store, not how big
            the picture is.
          </p>

          <h2>Why it matters for upload limits</h2>
          <p>
            Forms that ask for a photo “under 200 KB” do not care about pixels, only bytes. This is why
            advice like “resize to 1200 pixels” works for one photo and fails for the next. A busy outdoor
            shot at 1200 pixels may still be over the limit when a portrait against a plain wall is well
            under.
          </p>

          <h2>How to shrink a big one</h2>
          <ol>
            <li>
              <strong>Aim at the number, not the pixels.</strong>{" "}
              <Link href="/image/compress-image">Compress Image</Link> can target a file size such as 200 KB
              and work out the quality for you, resizing if needed. It runs in your browser.
            </li>
            <li>
              <strong>Strip what you do not need.</strong>{" "}
              <Link href="/image/exif-remover">EXIF Remover</Link> cuts out location, camera data and
              embedded previews without re-compressing the image — a modest saving, and a privacy win.
            </li>
            <li>
              <strong>Switch format if allowed.</strong> If the destination accepts WebP, the{" "}
              <Link href="/image/image-converter">Image Converter</Link> will usually produce a smaller file
              than JPG at similar quality. Never save a photo as PNG to make it smaller.
            </li>
            <li>
              <strong>Crop away busy areas.</strong> Cropping out grass, gravel or a cluttered background
              removes the most expensive pixels first.
            </li>
          </ol>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Assuming a smaller file means a worse photo; a plain subject is simply cheaper to store.</li>
            <li>Running a denoise filter and expecting a small file — some help, many re-save at high quality.</li>
            <li>Converting to PNG to “keep quality” before an upload with a size limit.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Target is in KB or MB? Compress to the size, not the pixels.</li>
            <li>Metadata removed if location or device details are not needed?</li>
            <li>Format suited to photos: JPG, WebP or HEIC, not PNG?</li>
          </ul>
        </>
      );
    },
  },
];
