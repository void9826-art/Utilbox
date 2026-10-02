import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-02";

export const pdfPagesAndPrintingGuides: Guide[] = [
  {
    slug: "how-to-rotate-a-pdf-permanently",
    topic: "PDF",
    title: "How to rotate a PDF permanently — so it stays the right way up",
    seoTitle: "How to Rotate a PDF Permanently and Save It",
    description:
      "Fix sideways or upside-down PDF pages for good, rotate only the pages that need it, and understand why rotating in a viewer does not stick.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["rotate-pdf", "pdf-reorder-pages", "merge-pdf"],
    Body: function Body() {
      return (
        <>
          <p>
            A scanned contract with every other page on its side. A landscape table that opens upside
            down. A form someone photographed the wrong way round. You can turn the page in your PDF
            viewer, but close the file, open it again — and it is sideways once more.
          </p>

          <h2>Why rotating in a viewer does not stick</h2>
          <p>
            Most PDF viewers have a rotate button, but it usually changes only how the page is shown on
            your screen, for this session. The file itself is untouched, so everyone you send it to sees
            the page exactly as it was. To fix it for good, the rotation has to be saved into the
            document.
          </p>

          <h2>How rotation is stored in a PDF</h2>
          <p>
            Every page in a PDF carries a rotation value — 0, 90, 180 or 270 degrees — that viewers and
            printers apply when they draw it. Rotating a page properly means changing that value and
            saving a new file. The page&apos;s content is not redrawn, so nothing is re-compressed and
            the quality is exactly the same as before. Text stays selectable and the file size barely
            changes.
          </p>

          <h2>Rotate a PDF step by step</h2>
          <ol>
            <li>
              Open <Link href="/pdf/rotate-pdf">Rotate PDF</Link> and add the file.
            </li>
            <li>
              Rotate every page at once if the whole document is sideways, or click the thumbnails of
              just the pages that are wrong.
            </li>
            <li>Check the previews — they show exactly how the saved file will look.</li>
            <li>Press Save and download the corrected PDF.</li>
          </ol>
          <p>The file is processed in your browser and is not uploaded.</p>

          <h2>Which way to turn</h2>
          <ul>
            <li>
              <strong>Text reads from bottom to top:</strong> the page needs a quarter turn clockwise.
            </li>
            <li>
              <strong>Text reads from top to bottom:</strong> a quarter turn anticlockwise.
            </li>
            <li>
              <strong>Upside down:</strong> a half turn — two quarter turns.
            </li>
          </ul>
          <p>
            If you are unsure, rotate one thumbnail and look; nothing is written until you save.
          </p>

          <h2>Mixed documents</h2>
          <p>
            Scans of mixed paperwork often have a few landscape pages — a spreadsheet, a diagram — among
            portrait ones. Those landscape pages should usually stay landscape; rotate them only so their
            text reads correctly, not so they match the others. Turning a landscape table into portrait
            does not make it fit the page better; it just puts the text on its side.
          </p>

          <h2>Pages that are slightly crooked</h2>
          <p>
            A PDF can only store rotation in quarter turns. A page scanned a few degrees off straight
            cannot be fixed by rotating the PDF; it needs to be scanned again with the paper squarely in
            the scanner, or straightened in the scanning app before saving. Most phone scanning apps
            straighten pages automatically if the edges of the paper are visible.
          </p>

          <h2>Fix rotation before anything else</h2>
          <p>
            Rotate pages before merging, numbering or sending a document. If pages are also out of order
            — common with double-sided scans — put them right with{" "}
            <Link href="/pdf/pdf-reorder-pages">Rearrange PDF Pages</Link>, then combine documents with{" "}
            <Link href="/pdf/merge-pdf">Merge PDF</Link>. Page numbers added afterwards are placed
            according to each page&apos;s rotation, so they appear the right way up.
          </p>

          <h2>Will the rotation stick everywhere?</h2>
          <p>
            Yes. Because the rotation is part of the document, every viewer, browser and printer honours
            it, and it survives being emailed, uploaded or merged with other files.
          </p>
        </>
      );
    },
  },

  {
    slug: "pdf-to-jpg-or-png",
    topic: "PDF",
    title: "How to turn PDF pages into images: JPG or PNG?",
    seoTitle: "PDF to JPG or PNG: How to Turn Pages Into Images",
    description:
      "Save PDF pages as pictures for slides, social media or image-only upload forms, choose between JPG and PNG, and pick a resolution that stays sharp.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-to-jpg", "pdf-to-png", "pdf-extract-images", "compress-image"],
    Body: function Body() {
      return (
        <>
          <p>
            Some places will not take a PDF: an upload form that only accepts images, a social media
            post, a slide in a presentation, a chat app that shows images inline. Turning the page into a
            picture solves it. The choice of format and resolution decides whether the result looks crisp
            or blurry.
          </p>

          <h2>JPG or PNG?</h2>
          <ul>
            <li>
              <strong>JPG</strong> suits pages that are mostly photographs — brochures, magazines,
              scanned photos. Files are small, and the slight softening of lossy compression is hard to
              see on photos.
            </li>
            <li>
              <strong>PNG</strong> suits pages of text, diagrams, charts and line drawings. It is
              lossless, so edges stay sharp. It can also keep a transparent background where the PDF
              draws nothing, which is useful for logos and diagrams placed on coloured slides.
            </li>
          </ul>
          <p>
            For a typical document page — mostly text — PNG looks clearly better and JPG is clearly
            smaller. If the image is going somewhere with a strict file size limit, JPG is often the
            practical choice.
          </p>

          <h2>Convert step by step</h2>
          <ol>
            <li>
              Add the PDF to <Link href="/pdf/pdf-to-jpg">PDF to JPG</Link> or{" "}
              <Link href="/pdf/pdf-to-png">PDF to PNG</Link>.
            </li>
            <li>Choose a resolution.</li>
            <li>Press Convert and watch the page thumbnails appear.</li>
            <li>Download a single page, or all of them as a ZIP.</li>
          </ol>
          <p>
            Pages are drawn by the same engine browsers use to display PDFs, in your own browser; the
            document is not uploaded.
          </p>

          <h2>Choosing a resolution</h2>
          <p>In PDF to JPG, the settings correspond roughly to:</p>
          <ul>
            <li>
              <strong>Screen (1×)</strong> — for viewing on a display, sharing in chats and posting
              online.
            </li>
            <li>
              <strong>Print (2×)</strong> — about 150 dots per inch on an A4 page; good for zooming in or
              for printing.
            </li>
            <li>
              <strong>High (3×)</strong> — about 220 dots per inch; for maps, technical drawings and fine
              print.
            </li>
          </ul>
          <p>
            Higher resolutions make bigger files and use more memory, so long documents at the highest
            setting can be slow on a phone. Convert only the pages you need at high resolution.
          </p>

          <h2>A page or a picture from the page?</h2>
          <p>
            Converting renders the whole page, text and margins included. If you want a single photo that
            sits on the page — a product image in a catalogue, a figure in a report —{" "}
            <Link href="/pdf/pdf-extract-images">Extract Images From PDF</Link> pulls out the embedded
            picture itself, at its own resolution and without the surrounding text.
          </p>

          <h2>Things to know about the result</h2>
          <ul>
            <li>
              <strong>The text becomes part of the picture.</strong> It cannot be selected, searched or
              copied. Keep the PDF for that.
            </li>
            <li>
              <strong>JPG has no transparency</strong>, so any transparent areas become white.
            </li>
            <li>
              <strong>A transparent PNG may still look white</strong> — many PDFs draw their own white
              page background, and transparency only shows where the document draws nothing.
            </li>
          </ul>

          <h2>Getting the size down</h2>
          <p>
            If an upload form limits the file size, convert at Screen resolution first. If it is still
            too large, run the image through <Link href="/image/compress-image">Compress Image</Link>,
            which shows the estimated size as you adjust the quality. For text pages, check that the
            smallest print is still readable after compressing.
          </p>

          <h2>Sharing a multi-page document as images</h2>
          <p>
            Converting every page of a long document to images makes it heavier and harder to read than
            the PDF. For anything over a few pages, send the PDF where you can, and use images only for
            the page or two that need to appear inline.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-extract-images-from-a-pdf",
    topic: "PDF",
    title: "How to extract the images from a PDF at full quality",
    seoTitle: "How to Extract Images From a PDF at Full Quality",
    description:
      "Pull the original photos and graphics out of a PDF instead of screenshotting them, understand why some PDFs give nothing, and what to do then.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-extract-images", "pdf-to-png", "image-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            A screenshot of a picture in a PDF is limited to the size it appears on your screen. The PDF
            itself usually holds the picture at a much higher resolution. Extracting it gets you that
            original, without the surrounding page.
          </p>

          <h2>How pictures are stored in a PDF</h2>
          <p>
            A PDF keeps each picture as a separate object, and pages refer to it when they draw. A logo
            used on every page is usually stored once and drawn many times. Extraction reads those objects
            directly, so you get the pixels the document actually carries — not a re-rendered copy of the
            page.
          </p>

          <h2>Extract images step by step</h2>
          <ol>
            <li>
              Add the PDF to <Link href="/pdf/pdf-extract-images">Extract Images From PDF</Link>. Each page
              is scanned as it loads.
            </li>
            <li>Look through the pictures found, with their pixel sizes and the pages they appear on.</li>
            <li>Download a single picture, or all of them together as a ZIP.</li>
          </ol>
          <p>
            Nothing is uploaded, so it is safe to use on scanned contracts and private documents.
          </p>

          <h2>What you get</h2>
          <ul>
            <li>
              <strong>The stored resolution.</strong> If a 4,000-pixel photo was placed small on a page,
              you get all 4,000 pixels.
            </li>
            <li>
              <strong>Each picture once.</strong> A logo repeated on every page appears once, listed with
              all the pages it is on.
            </li>
            <li>
              <strong>Lossless PNG files.</strong> The pixels are saved exactly. If the picture was
              compressed when the PDF was made, that compression is already part of it and cannot be
              undone.
            </li>
          </ul>

          <h2>Scanned documents</h2>
          <p>
            A scanned page is usually one large image per page, so extraction gives you each page as a
            picture at full scan resolution — handy for re-cropping a scan or pulling out a single
            signature or stamp. Black-and-white scans stored at one bit per pixel are handled too.
          </p>

          <h2>When nothing is found</h2>
          <p>Some PDFs give no pictures at all. There are two usual reasons:</p>
          <ul>
            <li>
              <strong>The graphics are drawings, not pictures.</strong> Charts, diagrams and logos made in
              design or office software are often stored as shapes and text, which are not images.
            </li>
            <li>
              <strong>The pictures are stored inline</strong> inside the page&apos;s drawing
              instructions rather than as separate objects.
            </li>
          </ul>
          <p>
            In both cases, render the page instead with <Link href="/pdf/pdf-to-png">PDF to PNG</Link> at
            a high resolution, then crop out the part you want.
          </p>

          <h2>A worked example: a figure from a report</h2>
          <p>
            You need a chart from page 37 of an annual report for a presentation. Screenshotting it gives a
            soft image the size of your screen. Instead:
          </p>
          <ol>
            <li>Add the report and look for page 37 in the list of pictures found.</li>
            <li>
              If the chart is listed, download it — you get it at the resolution the report&apos;s designer
              placed.
            </li>
            <li>
              If it is not listed, it was drawn as shapes; render page 37 with PDF to PNG at a high
              resolution and crop the chart out.
            </li>
            <li>Credit the source on the slide.</li>
          </ol>

          <h2>Large files</h2>
          <p>
            PNG keeps every pixel, so an extracted photograph can be larger than you expect. To share it,
            convert it to JPG or WebP with the <Link href="/image/image-converter">Image Converter</Link>,
            which can also cap the width.
          </p>

          <h2>Who owns the pictures?</h2>
          <p>
            Extracting a picture does not change who owns it. Photos and illustrations in brochures,
            reports and books are usually someone&apos;s copyright. Extracting your own images from your
            own documents, or using a picture with permission, is fine; republishing someone else&apos;s
            is a different matter.
          </p>
        </>
      );
    },
  },

  {
    slug: "photos-of-documents-to-pdf",
    topic: "PDF",
    title: "How to turn photos of receipts and documents into one PDF",
    seoTitle: "How to Turn Photos of Documents Into One PDF",
    description:
      "Combine phone photos of receipts, forms and certificates into a single PDF for expenses or applications, with tips for clean, small, readable pages.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["jpg-to-pdf", "image-to-pdf", "crop-image", "compress-image"],
    Body: function Body() {
      return (
        <>
          <p>
            Expense claims, rental applications and visa forms often ask for &ldquo;a single PDF&rdquo;
            of supporting documents. If what you have is a camera roll full of receipts, certificates and
            ID photos, a few minutes of preparation gives you one tidy, readable file.
          </p>

          <h2>Take better photos first</h2>
          <ul>
            <li>Lay the document flat on a dark, plain surface so its edges stand out.</li>
            <li>Hold the phone directly above it, parallel to the paper.</li>
            <li>Use daylight from a window; turn the flash off on glossy paper.</li>
            <li>Fill the frame with the document, and keep every edge in view.</li>
          </ul>
          <p>
            The scanning feature in a notes or files app does much of this automatically — it finds the
            edges, straightens the page and boosts contrast — and is worth using if your phone has one.
          </p>

          <h2>Tidy the photos</h2>
          <p>
            Crop away the table and background with <Link href="/image/crop-image">Crop Image</Link>, and
            rotate any that are sideways. A cropped receipt reads larger on the page and looks far more
            professional than a small slip in the middle of a kitchen table.
          </p>

          <h2>Make the PDF step by step</h2>
          <ol>
            <li>
              Add the photos to <Link href="/pdf/jpg-to-pdf">JPG to PDF</Link>. JPG and PNG can be mixed;
              for WebP, GIF or BMP, use <Link href="/image/image-to-pdf">Image to PDF</Link>.
            </li>
            <li>Put them in order with the arrows. The PDF follows exactly the order shown.</li>
            <li>
              Choose the page size: <strong>Match image</strong> for receipts and screenshots, or{" "}
              <strong>A4 / Letter</strong> if the PDF will be printed.
            </li>
            <li>Set the margins, press Create PDF and download.</li>
          </ol>
          <p>
            Each image goes on its own page, scaled to fit without stretching or cropping. JPEG photos are
            placed in the PDF exactly as they are, without re-compression. Everything happens in your
            browser, which matters for ID documents and bank cards.
          </p>

          <h2>Keep the file a sensible size</h2>
          <p>
            Phone photos are often 3–5 MB each, and the PDF is roughly the sum of its pictures. Ten
            receipts can easily make a 40 MB file — too big for most email and upload limits. Before
            building the PDF, shrink the photos with{" "}
            <Link href="/image/compress-image">Compress Image</Link>, resizing them to around 1,600 pixels
            on the long side. A receipt stays perfectly readable and the PDF comes out a fraction of the
            size.
          </p>

          <h2>Order and naming</h2>
          <ul>
            <li>Follow the order the form lists the documents in, or date order for expenses.</li>
            <li>Put a summary or covering page first if you have one.</li>
            <li>Name the file clearly, such as surname-expenses-september-2026.pdf.</li>
          </ul>

          <h2>Sensitive documents</h2>
          <p>
            Before sending ID or bank documents, consider what the recipient actually needs. Covering a
            card number except the last four digits, or a passport&apos;s machine-readable lines when not
            required, reduces the harm if the file goes astray. Remember that a shape drawn in a PDF
            editor does not remove what is underneath — see{" "}
            <Link href="/guides/how-to-redact-a-pdf">how to redact a PDF properly</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-convert-word-to-pdf",
    topic: "PDF",
    title: "How to convert a Word document to PDF — and keep it looking right",
    seoTitle: "How to Convert Word to PDF and Keep the Layout",
    description:
      "The best way to turn a Word document into a PDF for each situation, why layouts sometimes shift, and how to make a small, searchable PDF to send.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["word-to-pdf", "compress-pdf", "merge-pdf"],
    Body: function Body() {
      return (
        <>
          <p>
            A PDF looks the same on every device and cannot be accidentally edited, which is why CVs,
            reports and letters are usually sent that way. There are several ways to make one from a Word
            document, and the right one depends on what is in the document.
          </p>

          <h2>Option 1: export from your word processor</h2>
          <p>
            If you have Microsoft Word, LibreOffice, Pages or Google Docs, the most faithful PDF comes from
            the program itself: Save As or Export, then choose PDF. In Google Docs it is File → Download →
            PDF. This keeps images, tables, columns, text boxes and your exact fonts, because the program
            that laid out the page is also the one drawing the PDF.
          </p>
          <p>Use this route for anything with pictures, tables or careful layout.</p>

          <h2>Option 2: convert in the browser</h2>
          <p>
            When you only have the file — on a borrowed computer, or a phone without an office app —{" "}
            <Link href="/pdf/word-to-pdf">Word to PDF</Link> converts it in your browser without
            uploading it.
          </p>
          <ol>
            <li>Add the .docx file.</li>
            <li>Choose a page size and margin width.</li>
            <li>Press Convert, check the preview and download.</li>
          </ol>
          <p>
            It reads the document&apos;s structure — headings, paragraphs, bold and italic text, bulleted
            and numbered lists — and lays it out on PDF pages in a standard font. The result is a tidy,
            searchable PDF with real text. It does not reproduce images, tables, text boxes, columns or
            custom fonts, so it suits letters, essays, notes and simple reports.
          </p>

          <h2>Old .doc files</h2>
          <p>
            The pre-2007 .doc format is a binary format that browsers cannot read. Open it in Word or
            LibreOffice and save it as .docx first.
          </p>

          <h2>Why layouts sometimes shift</h2>
          <ul>
            <li>
              <strong>Fonts.</strong> If the document uses a font the converting program does not have, a
              substitute is used, and line and page breaks move. Exporting from the computer the document
              was written on avoids this.
            </li>
            <li>
              <strong>Paper size.</strong> A document set up for A4 and exported as Letter, or the other
              way round, reflows. Set the page size in the document before exporting — see{" "}
              <Link href="/guides/a4-vs-letter-paper-size">A4 vs Letter</Link>.
            </li>
            <li>
              <strong>Tracked changes and comments.</strong> Accept or reject changes and delete comments
              first, or they may appear in the PDF.
            </li>
          </ul>

          <h2>Make it searchable and accessible</h2>
          <p>
            Use real headings styles in Word rather than large bold text. When exported, they become
            proper headings that screen readers and the PDF&apos;s navigation can use, and they make the
            document easier to scan for everyone. Add alternative text to important images in the word
            processor before exporting.
          </p>

          <h2>Keep it small</h2>
          <p>
            A text document exported to PDF is usually small. Large files come from large pictures. Many
            word processors offer a smaller-file option in the export dialog that reduces image
            resolution. For a PDF that is already too large, see{" "}
            <Link href="/guides/how-to-reduce-pdf-file-size">how to reduce PDF file size</Link>.
          </p>

          <h2>Sending several documents</h2>
          <p>
            If a cover letter and a CV need to go as one attachment, export each to PDF and combine them
            with <Link href="/pdf/merge-pdf">Merge PDF</Link>. Open the final file once before sending, and
            check the page count and the first page.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-add-bookmarks-to-a-pdf",
    topic: "PDF",
    title: "How to add bookmarks to a PDF so readers can jump to each section",
    seoTitle: "How to Add Bookmarks to a PDF",
    description:
      "Give a long PDF a clickable outline in the reader's sidebar: when bookmarks help, how to add and edit them, and the order to do it in.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-bookmarks", "merge-pdf", "pdf-add-page-numbers"],
    Body: function Body() {
      return (
        <>
          <p>
            In a 120-page report, finding section four means scrolling and guessing. Bookmarks — the
            clickable outline that appears in a PDF reader&apos;s sidebar — let a reader jump straight
            there. They take a few minutes to add and make a long document far more usable.
          </p>

          <h2>When bookmarks are worth adding</h2>
          <ul>
            <li>Reports, theses and manuals with chapters or sections.</li>
            <li>Application packs and bundles merged from several documents.</li>
            <li>Course packs, handbooks and anything people will return to.</li>
          </ul>
          <p>
            A two-page letter does not need them. As a rule of thumb, anything long enough to need a
            contents page benefits from bookmarks.
          </p>

          <h2>Add bookmarks step by step</h2>
          <ol>
            <li>
              Add the PDF to the <Link href="/pdf/pdf-bookmarks">PDF Bookmarks Editor</Link>. Any
              bookmarks it already has are read and listed.
            </li>
            <li>Type a title for each entry and choose the page it should open.</li>
            <li>Add as many entries as you need, or remove the ones you do not want.</li>
            <li>Press Save bookmarks, then open the result in a reader to check the sidebar.</li>
          </ol>
          <p>The document is edited in your browser and is not uploaded.</p>

          <h2>Do it last</h2>
          <p>
            A bookmark points at a page. If you merge in another document, delete pages or reorder them
            afterwards, bookmarks can end up pointing at the wrong place or disappear. Merging in
            particular does not carry the original documents&apos; bookmarks across. So finish the
            document first:
          </p>
          <ol>
            <li>Combine the files with <Link href="/pdf/merge-pdf">Merge PDF</Link>.</li>
            <li>Put the pages in their final order.</li>
            <li>
              Add page numbers with <Link href="/pdf/pdf-add-page-numbers">Add Page Numbers to PDF</Link>.
            </li>
            <li>Add the bookmarks.</li>
          </ol>

          <h2>Writing good bookmark titles</h2>
          <ul>
            <li>Keep them short; the sidebar is narrow and long titles are cut off.</li>
            <li>Use the same wording as the headings in the document, so readers recognise where they land.</li>
            <li>Number them if the document numbers its sections: &ldquo;3. Results&rdquo;.</li>
            <li>One bookmark per chapter or major section is usually enough.</li>
          </ul>

          <h2>A flat list</h2>
          <p>
            The editor creates a single level of bookmarks rather than nested sub-entries. For most
            documents that is exactly what readers need, and it displays consistently in every reader. If
            you need deep nesting, it is best created in the program that produced the document, where
            headings can be turned into a nested outline automatically on export.
          </p>

          <h2>Editing existing bookmarks</h2>
          <p>
            Existing bookmarks are read in first, so you can correct a title or a page rather than starting
            over. Saving replaces the outline with whatever the list contains, so keep the entries you want
            in the list.
          </p>

          <h2>Where readers find them</h2>
          <p>
            Most readers keep the sidebar closed by default. In Adobe Acrobat Reader and the PDF viewers
            built into browsers, look for a sidebar or outline button near the top left. The bookmarks are
            in the file either way, and some readers open the sidebar automatically when a document has
            them.
          </p>
        </>
      );
    },
  },

  {
    slug: "print-multiple-pages-per-sheet",
    topic: "PDF",
    title: "How to print several PDF pages on one sheet of paper",
    seoTitle: "How to Print Multiple PDF Pages on One Sheet",
    description:
      "Put 2, 4 or more PDF pages on each sheet to save paper for handouts, slides and drafts, choose a layout that stays readable, and print it at the right scale.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-n-up", "pdf-booklet", "pdf-grayscale"],
    Body: function Body() {
      return (
        <>
          <p>
            Printing a 40-slide presentation one slide per page uses 40 sheets. Two slides per page halves
            that; four per page uses ten. This is called n-up printing, and it is one of the simplest ways
            to save paper on drafts, handouts and notes.
          </p>

          <h2>Choose a layout</h2>
          <table>
            <thead>
              <tr>
                <th>Pages per sheet</th>
                <th>Best for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2</td>
                <td>Reading drafts, slide handouts, A4 pages printed at A5 size</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Slides, reference notes with large text</td>
              </tr>
              <tr>
                <td>6</td>
                <td>Slide handouts with room for small text</td>
              </tr>
              <tr>
                <td>9 or 16</td>
                <td>Overviews and thumbnails, checking a layout at a glance</td>
              </tr>
            </tbody>
          </table>
          <p>
            Each step down shrinks every page. At 4-up, each page is about half its original width, so
            small print becomes hard to read; slides with large text cope far better than documents.
          </p>

          <h2>Make the sheets step by step</h2>
          <ol>
            <li>
              Add the PDF to <Link href="/pdf/pdf-n-up">Multiple PDF Pages Per Sheet</Link>.
            </li>
            <li>Choose how many pages per sheet and the paper size.</li>
            <li>Set the margin and the gap between pages.</li>
            <li>Turn on the light outline if you plan to cut the pages apart.</li>
            <li>Save the new PDF and print it at 100% — no further scaling.</li>
          </ol>
          <p>
            Each page is placed as a scaled copy of its content rather than as a picture, so text stays
            sharp and selectable. Pages read left to right, then down. The sheet turns landscape
            automatically when the grid is wider than it is tall, as a 2-up layout needs.
          </p>

          <h2>Why not use the printer&apos;s own setting?</h2>
          <p>
            Many print dialogs have a pages-per-sheet option, and it works well when you print the file
            yourself. Making an n-up PDF is better when someone else will print it, when you want to check
            the layout before printing, or when you want to keep or share the handout version.
          </p>

          <h2>Print it properly</h2>
          <ul>
            <li>
              <strong>Print at actual size.</strong> The sheets are already the paper size you chose, so
              scaling them again only makes everything smaller.
            </li>
            <li>
              <strong>Leave a margin</strong> of at least 5 mm. Most printers cannot print right to the
              edge of the paper.
            </li>
            <li>
              <strong>Print double-sided</strong> to halve the paper again.
            </li>
            <li>
              <strong>Print in black and white</strong> for drafts, or convert the file with{" "}
              <Link href="/pdf/pdf-grayscale">Convert PDF to Grayscale</Link> when a print shop charges by
              colour page.
            </li>
          </ul>

          <h2>How much paper it saves</h2>
          <p>For a 40-page document:</p>
          <ul>
            <li>printed normally, one side: 40 sheets;</li>
            <li>2-up, one side: 20 sheets;</li>
            <li>2-up, double-sided: 10 sheets;</li>
            <li>4-up, double-sided: 5 sheets.</li>
          </ul>
          <p>
            For a slide deck, 4-up double-sided is often perfectly readable. For a text document, 2-up is
            usually the limit before the print becomes too small.
          </p>

          <h2>Odd page counts</h2>
          <p>
            The last sheet is filled as far as the pages go, with the remaining spaces left empty. Nothing
            is stretched to fill them.
          </p>

          <h2>N-up is not a booklet</h2>
          <p>
            Pages on an n-up sheet run in reading order across the sheet. A folded booklet needs a
            different order, so that pages read correctly once the sheets are nested and folded. For that,
            use the <Link href="/pdf/pdf-booklet">PDF Booklet Maker</Link> — see{" "}
            <Link href="/guides/how-to-print-a-booklet-from-a-pdf">how to print a booklet from a PDF</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "print-pdf-in-black-and-white",
    topic: "PDF",
    title: "How to print a PDF in black and white — and save ink",
    seoTitle: "How to Print a PDF in Black and White",
    description:
      "Print colour PDFs in greyscale from any printer, make a black-and-white copy for print shops that charge by colour page, and keep charts readable in grey.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-grayscale", "pdf-n-up", "grayscale-image"],
    Body: function Body() {
      return (
        <>
          <p>
            Colour ink and colour pages at a print shop cost more than black and white, and drafts rarely
            need colour. There are two ways to get a black-and-white print, and they suit different
            situations.
          </p>

          <h2>Option 1: the print dialog</h2>
          <p>
            Most printers offer a greyscale or black-and-white option in the print dialog, sometimes under
            &ldquo;more settings&rdquo; or the printer&apos;s own properties. For printing a document
            yourself, this is the quickest route and keeps the original file unchanged.
          </p>
          <p>
            Some printers still use colour ink to make greys look richer even in greyscale mode. If you
            want to save colour cartridges specifically, look for a setting that prints with black ink
            only.
          </p>

          <h2>Option 2: convert the file</h2>
          <p>Make a black-and-white copy of the PDF itself when:</p>
          <ul>
            <li>a print shop charges by colour page and will print exactly what you send;</li>
            <li>a submission must be supplied in black and white;</li>
            <li>you want to check how the document looks in grey before printing many copies.</li>
          </ul>
          <ol>
            <li>
              Add the PDF to <Link href="/pdf/pdf-grayscale">Convert PDF to Grayscale</Link>.
            </li>
            <li>Choose Standard for ordinary documents, or Print for small text and fine lines.</li>
            <li>Press Convert and download the black-and-white copy. The original is untouched.</li>
          </ol>
          <p>
            Every page is converted using weights that match how the eye judges brightness, so colours
            that look equally bright become similar greys. The paper size and margins stay exactly the
            same. One trade-off: the pages are re-drawn as pictures, so their text can no longer be
            selected or searched. Keep the colour original for that.
          </p>

          <h2>Check charts and highlights</h2>
          <p>
            Conversion keeps brightness, not colour. A red line and a green line of similar brightness
            become nearly the same grey, and a yellow highlighter mark may almost disappear. Before
            printing a document with charts:
          </p>
          <ul>
            <li>look at the converted pages and check every chart&apos;s lines and bars can be told apart;</li>
            <li>where they cannot, add labels or use different line styles in the source document;</li>
            <li>replace pale highlights with bold or underlining if they carry meaning.</li>
          </ul>
          <p>
            The same idea applies to single images: the{" "}
            <Link href="/image/grayscale-image">Black and White Image Converter</Link> offers a high-contrast
            mode that makes photographed text easier to read in grey.
          </p>

          <h2>Save more paper</h2>
          <p>
            For drafts and handouts, combine greyscale with printing two or four pages per sheet using{" "}
            <Link href="/pdf/pdf-n-up">Multiple PDF Pages Per Sheet</Link>, and print double-sided. A
            40-page colour report printed 2-up, double-sided and in greyscale uses ten sheets and no colour
            ink.
          </p>

          <h2>File size</h2>
          <p>
            A converted file can be larger than the original, especially for text documents, because
            pictures take more space than text. If you only need the file for printing, that does not
            matter. If you need to email it, Standard resolution keeps it smaller than Print.
          </p>
        </>
      );
    },
  },
];
