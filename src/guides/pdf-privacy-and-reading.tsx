import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-01";

export const pdfPrivacyAndReadingGuides: Guide[] = [
  {
    slug: "how-to-compare-two-pdfs",
    topic: "PDF",
    title: "How to compare two versions of a PDF and see exactly what changed",
    seoTitle: "How to Compare Two PDF Versions and See Changes",
    description:
      "Spot every added and removed line between two versions of a contract, policy or report, see what a comparison can't catch, and check drafts privately.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-compare", "pdf-to-text", "image-to-text"],
    Body: function Body() {
      return (
        <>
          <p>
            &ldquo;Here is the revised version — only a couple of small changes.&rdquo; Anyone who has
            signed a contract, approved a policy or checked a resubmitted report has heard that
            sentence. Reading both versions side by side is slow and unreliable; the eye skips over a
            changed date or a missing &ldquo;not&rdquo;. A text comparison finds every difference in
            seconds.
          </p>

          <h2>When it is worth comparing</h2>
          <ul>
            <li>A revised contract or lease before you sign it.</li>
            <li>An updated policy, terms of service or handbook, to see what actually changed.</li>
            <li>A report or thesis returned after edits, to check every change was intended.</li>
            <li>Two copies of a document that should be identical, to confirm they are.</li>
          </ul>
          <p>
            Even when the other side has listed their changes, a comparison is a useful check. Edits
            get forgotten in a summary far more often than anyone admits.
          </p>

          <h2>Compare two PDFs step by step</h2>
          <ol>
            <li>
              Open <Link href="/pdf/pdf-compare">Compare Two PDFs</Link>.
            </li>
            <li>Add the original document on the left and the revised one on the right.</li>
            <li>Press Compare. Both files are read page by page.</li>
            <li>
              Work through the pages that changed. Added lines are marked with a plus, removed lines
              with a minus and a strike-through, as well as with colour.
            </li>
            <li>Download the comparison as a text file if you need to send it on or keep a record.</li>
          </ol>
          <p>
            Both documents are read in your browser and neither is uploaded — which matters when the
            files are contract drafts or confidential reports.
          </p>

          <h2>How the comparison works</h2>
          <p>
            The text of each page is extracted from both documents and matched using the same method
            version-control software uses to compare code. It finds the smallest set of additions and
            deletions that turns one version into the other, so a paragraph inserted at the top does
            not make every line after it look changed. Pages with no differences are left out of the
            report, so what remains is only what matters.
          </p>

          <h2>Reading the results</h2>
          <ul>
            <li>
              <strong>A changed word shows as a removed line and an added line.</strong> Look at the
              pair together to see exactly which word moved.
            </li>
            <li>
              <strong>A moved paragraph shows as a removal in one place and an addition in
              another.</strong> If the same text appears on both sides, nothing was rewritten, only
              relocated.
            </li>
            <li>
              <strong>A warning about page counts</strong> means a page was added or removed. Content
              after that point can legitimately appear changed, so start reading from the first real
              difference.
            </li>
          </ul>

          <h2>What a text comparison cannot see</h2>
          <p>Only the words are compared. That has some consequences worth knowing:</p>
          <ul>
            <li>
              <strong>Layout, fonts and colours</strong> are ignored. A document redesigned with the
              same wording reports no differences.
            </li>
            <li>
              <strong>Pictures are not compared.</strong> A changed figure in a chart, a swapped
              signature image or an edited table that is embedded as a picture will not show up.
            </li>
            <li>
              <strong>Scanned pages have no text to compare.</strong> If one version is a scan, run it
              through <Link href="/image/image-to-text">Image to Text (OCR)</Link> first, or compare
              the scan by eye.
            </li>
          </ul>
          <p>
            For anything important, combine the comparison with a quick look at the pages that carry
            figures and signatures.
          </p>

          <h2>Tips for reliable comparisons</h2>
          <ul>
            <li>
              <strong>Compare the exact files.</strong> Make sure the &ldquo;original&rdquo; really is
              the version you agreed to, not a later draft.
            </li>
            <li>
              <strong>Expect noise from re-exports.</strong> A document saved from a different program
              can break lines differently. Changes in line breaks alone may show as lines removed and
              added with the same words.
            </li>
            <li>
              <strong>Check the numbers twice.</strong> A changed amount, date or percentage is a
              one-character difference that is easy to skim past in a long report.
            </li>
          </ul>

          <h2>Comparing Word documents</h2>
          <p>
            If you have both versions as Word files, Word&apos;s own Compare feature shows changes
            in place with formatting. If you only have PDFs, or one side is a PDF, compare the PDFs.
            To get the full text of a single document for searching or quoting,{" "}
            <Link href="/pdf/pdf-to-text">PDF to Text</Link> extracts it page by page.
          </p>
        </>
      );
    },
  },

  {
    slug: "remove-hidden-data-from-a-pdf",
    topic: "PDF",
    title: "What a PDF can reveal about you — and how to remove it before sharing",
    seoTitle: "How to Remove Hidden Data From a PDF Before Sharing",
    description:
      "PDFs carry author names, software, dates, comments and sometimes earlier versions. See what yours holds and clean it before sending it outside your organisation.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-metadata-editor", "pdf-redact", "pdf-flatten-form", "pdf-to-text"],
    Body: function Body() {
      return (
        <>
          <p>
            A PDF looks like a finished page, but the file around that page often carries more: who
            wrote it, on which software, when it was edited, and sometimes text you thought was long
            gone. Most of the time that is harmless. When the document is going to a client, a
            journalist, a court or the public, it is worth a two-minute check.
          </p>

          <h2>What a PDF can carry</h2>
          <ul>
            <li>
              <strong>Document properties.</strong> Title, author, subject and keywords, plus the
              program the document was written in, the software that produced the PDF, and when it
              was created and last changed. The author is often a full name or a computer username.
            </li>
            <li>
              <strong>A second copy of those properties</strong>, stored as an XMP metadata stream,
              which some readers show instead of the first.
            </li>
            <li>
              <strong>Comments and annotations</strong> — review notes, highlights and sticky notes.
            </li>
            <li>
              <strong>Form field values</strong>, which are stored separately from the page.
            </li>
            <li>
              <strong>Text hidden under shapes</strong>, such as names &ldquo;blacked out&rdquo; with
              a rectangle that is still selectable underneath.
            </li>
            <li>
              <strong>Earlier versions.</strong> Many editors save changes by appending them to the
              end of the file, so a previous version can sometimes be recovered from the same PDF.
            </li>
          </ul>

          <h2>See what your file holds</h2>
          <p>
            Open the PDF in your reader and look at its document properties, usually under File, then
            Properties. Or add it to the <Link href="/pdf/pdf-metadata-editor">PDF Metadata
            Editor</Link>, which fills in every property it finds so you can read them all at once. To
            see every word the pages contain, including text a viewer might not show, run the file
            through <Link href="/pdf/pdf-to-text">PDF to Text</Link> and read the result.
          </p>

          <h2>Clean the properties</h2>
          <ol>
            <li>Add the PDF to the PDF Metadata Editor.</li>
            <li>Press Clear all, or edit the fields to what you are happy to share — a neutral title, your organisation as author.</li>
            <li>Leave &ldquo;Remove the XMP metadata stream&rdquo; ticked, so no second copy survives.</li>
            <li>Save. The new file is opened again and its properties read back, so you see what it really contains.</li>
          </ol>
          <p>
            Only the properties are rewritten. The pages, fonts and images are carried over unchanged.
            Do this as the last step, because other tools often set the producer and dates again when
            they save.
          </p>

          <h2>Deal with what is on the pages</h2>
          <ul>
            <li>
              <strong>Filled-in forms:</strong> flatten them with{" "}
              <Link href="/pdf/pdf-flatten-form">Flatten PDF Form</Link> so the answers become part of
              the page and the editable fields disappear.
            </li>
            <li>
              <strong>Names, numbers or passages that must go:</strong> use{" "}
              <Link href="/pdf/pdf-redact">Redact PDF</Link>, which removes the text itself rather than
              covering it. A black box drawn in an editor hides nothing. See{" "}
              <Link href="/guides/how-to-redact-a-pdf">how to redact a PDF properly</Link>.
            </li>
            <li>
              <strong>Comments:</strong> delete or resolve them in the program you reviewed in,
              before exporting the final PDF.
            </li>
          </ul>

          <h2>Start from a clean export where you can</h2>
          <p>
            The tidiest PDF is one exported fresh from the source document after the comments, tracked
            changes and hidden text have been dealt with there. Word processors usually have an option
            to inspect a document for hidden information before saving — use it, then export. Cleaning
            a finished PDF is the fallback when you no longer have the source.
          </p>

          <h2>Do not forget the file name and the email</h2>
          <p>
            A file named &ldquo;Smith-settlement-final-v7.pdf&rdquo; says more than its properties
            ever could. Rename the file to something neutral, and check the body of the email you
            send it with: forwarded threads below your message often carry more than the attachment.
          </p>

          <h2>A short checklist</h2>
          <ul>
            <li>Properties cleared or set deliberately, XMP stream removed.</li>
            <li>Comments removed and forms flattened.</li>
            <li>Sensitive text redacted, and the redacted copy searched to prove it is gone.</li>
            <li>Neutral file name, and nothing extra in the covering email.</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "read-pdfs-on-a-tablet",
    topic: "PDF",
    title: "How to read PDFs comfortably on a tablet, phone or e-reader",
    seoTitle: "How to Read PDFs Comfortably on a Tablet",
    description:
      "Make small print on A4 and Letter PDFs readable on a smaller screen: crop the wasted margins, read at night without the glare, and handle two-column papers.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-crop-margins", "pdf-invert-colors", "pdf-resize-page"],
    Body: function Body() {
      return (
        <>
          <p>
            Most PDFs are designed for a sheet of A4 or Letter paper. On a tablet or e-reader the whole
            page is squeezed onto a smaller screen, the text becomes tiny, and a lot of the screen is
            spent on white margins. A few adjustments to the file make a large difference.
          </p>

          <h2>Why PDFs read badly on small screens</h2>
          <p>
            Unlike a web page or an e-book, a PDF has a fixed layout: every line sits at an exact
            position on the page. A reader can zoom, but cannot reflow the text to fit the screen. So
            the useful question is how much of the screen the text actually fills — and on a typical
            document, margins take up a surprising share.
          </p>

          <h2>Crop the margins</h2>
          <p>
            Trimming the white border is the single most effective change. Removing a 20 mm border
            from an A4 page makes the text roughly a third larger on the same screen.
          </p>
          <ol>
            <li>
              Add the PDF to <Link href="/pdf/pdf-crop-margins">Crop PDF Margins</Link>. The first page
              appears with a dashed outline.
            </li>
            <li>
              Drag the margin slider until the outline sits just outside the text. Everything inside
              the outline is kept.
            </li>
            <li>
              Untick the equal-margins option if one side is wider, as with documents that have a
              binding margin.
            </li>
            <li>Crop and download, then copy the new file to your tablet.</li>
          </ol>
          <p>
            Cropping hides the margins rather than deleting them, so text stays sharp and selectable
            and the file size barely changes. Leave a few millimetres of margin; text that touches the
            screen edge is tiring to read. If page numbers or headers sit in the margins, decide
            whether you need them before cropping them off.
          </p>

          <h2>Pages that differ</h2>
          <p>
            A cover or title page often has different margins from the body. Crop only the main pages
            by entering a page range, such as 3-120, and leave the rest alone.
          </p>

          <h2>Reading at night</h2>
          <p>
            A bright white page in a dark room is uncomfortable. Many reading apps have a night mode,
            but it belongs to the app: open the same file elsewhere and you are back to white.{" "}
            <Link href="/pdf/pdf-invert-colors">Invert PDF Colours</Link> turns the file itself into
            light text on a dark page, so it looks the same in every app.
          </p>
          <ul>
            <li>It suits text documents, papers and slides with plain backgrounds.</li>
            <li>Photographs come out like film negatives, so it is a poor fit for picture-heavy documents.</li>
            <li>The inverted pages are re-drawn as pictures, so their text can no longer be selected — keep the original for searching and quoting.</li>
          </ul>

          <h2>Two-column academic papers</h2>
          <p>
            Two narrow columns on a portrait page are the hardest layout on a small screen. Some
            approaches that help:
          </p>
          <ul>
            <li>Crop the margins first, then read in landscape, zoomed to one column&apos;s width.</li>
            <li>Use your reader&apos;s column or &ldquo;fit width&rdquo; zoom, if it has one, and scroll down each column.</li>
            <li>On a large tablet, portrait with cropped margins is often readable without zooming.</li>
          </ul>

          <h2>E-readers</h2>
          <p>
            E-ink readers have smaller screens than most tablets and refresh slowly when you zoom, so
            cropping matters even more. Some e-readers and their companion apps can convert a PDF into
            a reflowable format; this can work well for plain text but often scrambles tables, figures
            and equations. A cropped PDF keeps the layout intact, which is the safer choice for anything
            technical.
          </p>

          <h2>Printing a document you have cropped</h2>
          <p>
            Most printers honour the crop, so only the visible area prints, possibly enlarged to fill
            the paper. To print the original page with its margins, use the original file. If you need
            a document on a different paper size for printing, the{" "}
            <Link href="/pdf/pdf-resize-page">PDF Page Size Converter</Link> scales it properly.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-watermark-a-pdf",
    topic: "PDF",
    title: "How to watermark a PDF — draft, confidential or copy",
    seoTitle: "How to Watermark a PDF (Draft, Confidential, Copy)",
    description:
      "Add a DRAFT, CONFIDENTIAL or COPY watermark to a PDF, choose a placement that is hard to crop out, keep the text readable, and know what a watermark cannot do.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-watermark", "pdf-header-footer", "pdf-redact"],
    Body: function Body() {
      return (
        <>
          <p>
            A watermark is a label written across the page: DRAFT, CONFIDENTIAL, COPY, SAMPLE, or a
            name and date. It tells everyone who sees the document what status it has, and it travels
            with every printout and screenshot.
          </p>

          <h2>When to use one</h2>
          <ul>
            <li>
              <strong>Drafts</strong>, so an unfinished version is never mistaken for the final one.
            </li>
            <li>
              <strong>Confidential documents</strong> shared with a small group.
            </li>
            <li>
              <strong>Samples and previews</strong> — a portfolio piece, a sample chapter, a
              specimen certificate.
            </li>
            <li>
              <strong>Copies for a specific person</strong>, marked with their name, which discourages
              passing them on.
            </li>
          </ul>

          <h2>Add a watermark step by step</h2>
          <ol>
            <li>
              Open <Link href="/pdf/pdf-watermark">Add Watermark to PDF</Link> and add the document.
            </li>
            <li>Type the wording.</li>
            <li>
              Choose a placement: diagonal across the page, tiled in a repeating pattern, or in the
              footer.
            </li>
            <li>Set the opacity and size, and enter a page range if only some pages need marking.</li>
            <li>Press Add watermark, check the preview of the saved file, and download.</li>
          </ol>
          <p>
            The wording is drawn as real text in a standard bold font with a transparency setting,
            not as a picture. The file stays small, the mark stays sharp at any zoom, and the
            original text underneath remains selectable and searchable.
          </p>

          <h2>Choosing a placement</h2>
          <ul>
            <li>
              <strong>Diagonal</strong> runs corner to corner and reads clearly. It is the classic
              DRAFT look. A single mark is easy to crop out of a screenshot, though.
            </li>
            <li>
              <strong>Tiled</strong> repeats the wording across the page at a shallow angle. It is much
              harder to remove or crop around, which makes it the right choice when you are
              discouraging reuse.
            </li>
            <li>
              <strong>Footer</strong> is quiet and professional — suitable for &ldquo;Confidential —
              do not distribute&rdquo; on every page of a report people still need to read easily.
            </li>
          </ul>

          <h2>Keep it readable</h2>
          <p>
            A watermark that makes the document hard to read defeats the point. Start with a low
            opacity and increase it only until the mark is clearly visible on a printed page. Short
            wording works best; long phrases are drawn at the size you set rather than shrunk, so they
            can run off the edges. If that happens, reduce the size or shorten the text.
          </p>

          <h2>Personalised copies</h2>
          <p>
            When you send the same document to several people, a copy marked with each
            recipient&apos;s name — &ldquo;Prepared for J. Smith, 1 October 2026&rdquo; — makes it much
            less likely to be forwarded, because the source of a leaked copy is obvious. Tiled
            placement makes the name hard to remove. It takes one pass per recipient.
          </p>

          <h2>What a watermark cannot do</h2>
          <p>
            A watermark is a visible label, not a lock. Anyone with a PDF editor and some patience can
            remove it, and it does not stop copying, printing or forwarding. Keep two things separate:
          </p>
          <ul>
            <li>
              To <strong>label</strong> a document, watermark it.
            </li>
            <li>
              To <strong>remove</strong> sensitive details from it, redact them with{" "}
              <Link href="/pdf/pdf-redact">Redact PDF</Link> before sharing. A watermark printed over a
              bank account number still leaves the number readable.
            </li>
          </ul>

          <h2>Watermark or header?</h2>
          <p>
            For a small, consistent label such as a document reference, version number or date on
            every page,{" "}
            <Link href="/pdf/pdf-header-footer">Add Header and Footer to PDF</Link> may suit better. It
            writes your wording along the top or bottom edge and can include the page number and
            total. Use a watermark when the label must be impossible to miss.
          </p>

          <h2>Order of steps</h2>
          <p>
            Watermark the final version of the document: after merging, reordering and adding page
            numbers, so every page carries the mark. If the document is a form, flatten it first so
            the answers sit underneath the watermark like the rest of the page.
          </p>
        </>
      );
    },
  },
];
