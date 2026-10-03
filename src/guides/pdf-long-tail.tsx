import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-03";

export const pdfLongTailGuides: Guide[] = [
  {
    slug: "get-a-pdf-under-an-upload-limit",
    topic: "PDF",
    title: "How to get a PDF under an upload limit (100 KB, 500 KB or 1 MB)",
    seoTitle: "How to Get a PDF Under 100 KB, 500 KB or 1 MB",
    description:
      "Exam, job and government portals cap PDF uploads. How to shrink a PDF to fit a 100 KB, 500 KB or 1 MB limit, and what to try when it still will not fit.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["compress-pdf", "delete-pdf-pages", "split-pdf"],
    Body: function Body() {
      return (
        <>
          <p>
            Application portals rarely say why, but most of them refuse anything over a fixed size: 100 KB
            for a certificate, 500 KB for a marksheet, 1 or 2 MB for a full document. The upload fails, the
            form times out, and the deadline is tonight. This guide is about hitting a specific number, not
            just &ldquo;making it smaller&rdquo;.
          </p>

          <h2>First, find out what is making the file big</h2>
          <p>
            A PDF typed in Word and exported directly is mostly text, and text is tiny: a ten-page report is
            often well under 500 KB. A PDF made from a scanner or phone camera is a stack of photographs, and
            a single photo of a page can be several megabytes on its own. Almost every oversized upload is the
            second kind.
          </p>
          <p>
            If your document is a typed one that is still large, look for embedded photos or a logo saved at
            print resolution. Re-exporting from the original program with a &ldquo;minimum size&rdquo; or
            &ldquo;web&rdquo; setting often fixes it without touching the PDF.
          </p>

          <h2>Shrink it step by step</h2>
          <ol>
            <li>
              Open <Link href="/pdf/compress-pdf">Compress PDF</Link> and add the file. It is processed in
              your browser and not uploaded anywhere.
            </li>
            <li>Start with the Balanced level. It halves most scans while staying comfortably readable.</li>
            <li>Compare the new size with the limit. If it is still over, run the original again on Strong.</li>
            <li>
              Open the result and zoom to 100%. If you can still read the smallest print, such as a
              registration number, it is good enough to upload.
            </li>
          </ol>
          <p>
            Compress the original each time rather than compressing an already compressed copy. Each pass
            loses a little detail, and two passes on Balanced usually look worse than one pass on Strong.
          </p>

          <h2>What compression changes</h2>
          <p>
            To get large savings, the compressor redraws every page as an image. That means the text in the
            compressed file can no longer be selected or searched. For scanned certificates that makes no
            difference, because they were images already. For a typed CV or cover letter it matters, because
            recruiters&apos; systems read the text. Keep typed documents as text: re-export them instead of
            compressing them.
          </p>

          <h2>When it still will not fit</h2>
          <ul>
            <li>
              <strong>Drop pages the portal did not ask for.</strong> Instruction pages, blank backs and
              duplicate copies all add size. Remove them with{" "}
              <Link href="/pdf/delete-pdf-pages">Delete PDF Pages</Link>.
            </li>
            <li>
              <strong>Upload in parts.</strong> If the form has separate slots, use{" "}
              <Link href="/pdf/split-pdf">Split PDF</Link> to send each document to its own slot.
            </li>
            <li>
              <strong>Rescan at a lower setting.</strong> For a 100 KB limit, a single page scanned in
              grayscale at 150 dpi is a realistic target; full-colour scans at 600 dpi are not.
            </li>
            <li>
              <strong>Crop the edges.</strong> A phone photo that shows the table around the paper wastes
              pixels on wood grain. Crop to the page before converting.
            </li>
          </ul>

          <h2>KB, MB and the limit itself</h2>
          <p>
            Some portals treat 1 MB as 1,000 KB and others as 1,024 KB, and some count the limit slightly
            differently from your computer. Aim about 5% under the stated limit so you are not caught by
            the difference. A file shown as 98 KB will pass a 100 KB limit everywhere; a file shown as 100 KB
            may not.
          </p>

          <h2>Mistakes that waste time</h2>
          <ul>
            <li>Renaming the file or zipping it. Neither changes what the portal measures.</li>
            <li>Taking a screenshot of the PDF. It usually makes the file bigger and blurrier.</li>
            <li>
              Spaces and symbols in the file name. Some older portals reject them; use something like{" "}
              <code>marksheet-2026.pdf</code>.
            </li>
          </ul>
          <p>
            For shrinking documents to send by email rather than to a fixed limit, see{" "}
            <Link href="/guides/how-to-reduce-pdf-file-size">how to reduce PDF file size for email</Link>. To
            build the PDF from phone photos in the first place, see{" "}
            <Link href="/guides/photos-of-documents-to-pdf">turning photos of documents into one PDF</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "remove-blank-pages-from-a-pdf",
    topic: "PDF",
    title: "How to remove blank pages from a scanned PDF",
    seoTitle: "How to Remove Blank Pages From a Scanned PDF",
    description:
      "Duplex scanners and Word exports leave empty pages behind. How to spot them, remove them all in one pass, and stop them appearing next time.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["delete-pdf-pages", "extract-pdf-pages", "rotate-pdf"],
    Body: function Body() {
      return (
        <>
          <p>
            Scan a stack of single-sided letters with the scanner set to double-sided, and every second page
            of the PDF is empty. Export a Word document with a stray page break, and the last page is blank.
            Blank pages make a document look careless, add to the file size and confuse anyone counting
            pages. Removing them takes a minute.
          </p>

          <h2>Remove them step by step</h2>
          <ol>
            <li>
              Open <Link href="/pdf/delete-pdf-pages">Delete PDF Pages</Link> and add the PDF. The pages appear
              as thumbnails, rendered in your browser.
            </li>
            <li>
              Click each blank thumbnail, or type the page numbers, such as <code>2, 4, 9-11</code>.
            </li>
            <li>Download the new file and flick through it once before sending.</li>
          </ol>
          <p>
            If the document is mostly blank pages with a few good ones, it is quicker to say which pages to
            keep. <Link href="/pdf/extract-pdf-pages">Extract PDF Pages</Link> takes the same kind of list and
            builds a new PDF from just those pages.
          </p>

          <h2>The double-sided scan pattern</h2>
          <p>
            When a whole stack of single-sided originals went through a duplex scanner, the blanks follow a
            pattern: every even page. For a 20-page scan you can type <code>2, 4, 6, 8, 10, 12, 14, 16, 18, 20</code>{" "}
            in one go. Check the thumbnails before saving, because a letter with writing on the back breaks
            the pattern.
          </p>

          <h2>Pages that only look blank</h2>
          <p>
            Some &ldquo;blank&rdquo; pages are not empty. Thin paper shows the other side through, so the scan
            contains a faint mirror image of the text. Others carry a small page number, a scanner timestamp
            or a punch-hole shadow. They still count as pages, and a scanner&apos;s automatic blank-page
            setting may keep them. Deciding by eye from the thumbnails is the reliable way.
          </p>
          <p>
            Pages printed with &ldquo;This page intentionally left blank&rdquo; are a different case. They are
            there so that chapters start on a right-hand page when the document is printed double-sided.
            Remove them only if the PDF will be read on screen.
          </p>

          <h2>Stop blank pages appearing next time</h2>
          <ul>
            <li>
              <strong>Scanners:</strong> look for a setting called &ldquo;skip blank pages&rdquo;, &ldquo;blank
              page removal&rdquo; or similar, or switch to single-sided when the originals are single-sided.
            </li>
            <li>
              <strong>Word documents ending in a blank page:</strong> turn on formatting marks (the ¶ button)
              and delete the empty paragraphs or page break at the end. If the document ends in a table, Word
              always keeps one paragraph after it; select that paragraph and set its font size to 1 point.
            </li>
            <li>
              <strong>Section breaks:</strong> an &ldquo;odd page&rdquo; section break deliberately inserts a
              blank page. Change it to &ldquo;next page&rdquo; if you do not need it.
            </li>
          </ul>

          <h2>After removing pages</h2>
          <p>
            Printed page numbers on the pages themselves do not change, so a removed blank in the middle can
            leave a gap in the numbering. If that matters, number the cleaned file with{" "}
            <Link href="/pdf/pdf-add-page-numbers">Add Page Numbers to PDF</Link>. If some of the scans came out
            sideways, fix them with <Link href="/pdf/rotate-pdf">Rotate PDF</Link>. If the file is now going
            to a portal with a size limit, see{" "}
            <Link href="/guides/get-a-pdf-under-an-upload-limit">getting a PDF under an upload limit</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "reverse-pdf-page-order",
    topic: "PDF",
    title: "How to reverse the page order of a PDF",
    seoTitle: "How to Reverse the Page Order of a PDF",
    description:
      "Scanned a stack face up and got the last page first? How to flip a whole PDF into the right order in one click, then fix any stray pages by hand.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-reorder-pages", "merge-pdf", "split-pdf"],
    Body: function Body() {
      return (
        <>
          <p>
            Many sheet-fed scanners take the top page first. Put the stack in face up and the PDF comes out
            backwards: page 12 first, page 1 last. The same happens with some print-to-PDF setups and with
            documents assembled in the wrong order. Reading a reversed PDF is irritating, and sending one to
            someone else looks careless. Fixing it does not need a rescan.
          </p>

          <h2>Reverse a PDF step by step</h2>
          <ol>
            <li>
              Open <Link href="/pdf/pdf-reorder-pages">Rearrange PDF Pages</Link> and add the file. Each page
              appears as a thumbnail.
            </li>
            <li>Press Reverse order. The last page moves to the front and the whole order flips.</li>
            <li>If one or two pages are still out of place, move them with the arrows next to each page.</li>
            <li>Save the reordered PDF.</li>
          </ol>
          <p>
            The pages themselves are copied unchanged, so text stays selectable and quality does not drop.
            The file is processed in your browser, which matters for scanned contracts, bank statements and
            medical letters.
          </p>

          <h2>When only part of the file is backwards</h2>
          <p>
            Sometimes a document is put together from several scans and only one batch came out reversed. Two
            ways to fix it:
          </p>
          <ul>
            <li>
              For a short document, reverse the whole thing and then move the correct pages back with the
              arrows.
            </li>
            <li>
              For a longer one, cut the reversed batch out with <Link href="/pdf/split-pdf">Split PDF</Link>,
              reverse that piece on its own, and join the pieces again in{" "}
              <Link href="/pdf/merge-pdf">Merge PDF</Link>.
            </li>
          </ul>

          <h2>Double-sided originals scanned in two passes</h2>
          <p>
            Without a duplex scanner, people often scan all the fronts, flip the stack and scan all the backs.
            The backs then arrive in reverse order. Reverse the backs file first, then merge the two files.
            The result has all the fronts followed by all the backs, so you still need to interleave them: page
            1 front, page 1 back, and so on. That is quick with the arrows for a few sheets, but slow for
            forty. For long documents, a scanner or copier with a duplex setting saves real time.
          </p>

          <h2>You may not need to change the file at all</h2>
          <p>
            If the only problem is that a printer delivers pages in the wrong order, look in the print dialog
            for &ldquo;Reverse order&rdquo; or &ldquo;Print in reverse&rdquo;. Many printers deliver pages face
            up, so the stack comes out backwards; the print setting fixes that without editing the PDF.
          </p>

          <h2>Check before you send</h2>
          <ul>
            <li>Look at the first and last thumbnails: the title page should be first.</li>
            <li>
              If the pages carry printed numbers, scan through and confirm they run in order. A missing number
              usually means a page was skipped during scanning, not a reordering problem.
            </li>
            <li>
              If some pages came out sideways as well, straighten them with{" "}
              <Link href="/pdf/rotate-pdf">Rotate PDF</Link>. See{" "}
              <Link href="/guides/how-to-rotate-a-pdf-permanently">how to rotate a PDF permanently</Link> for
              why some viewers forget a rotation.
            </li>
          </ul>
          <p>
            Blank backs mixed in with the reversed pages? Remove them afterwards; the guide to{" "}
            <Link href="/guides/remove-blank-pages-from-a-pdf">removing blank pages from a scanned PDF</Link>{" "}
            covers the quick way to pick them out.
          </p>
        </>
      );
    },
  },

  {
    slug: "add-a-header-or-footer-to-a-pdf",
    topic: "PDF",
    title: "How to add a header or footer to every page of a PDF",
    seoTitle: "How to Add a Header or Footer to a PDF",
    description:
      "Stamp a title, date, reference number or Confidential along the top or bottom of every PDF page, skip the cover page, and keep the text clear of the content.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-header-footer", "pdf-add-page-numbers", "pdf-watermark"],
    Body: function Body() {
      return (
        <>
          <p>
            A line of text at the top or bottom of every page tells a reader what they are holding, even when
            one page has been printed and separated from the rest. Lawyers add case references, finance teams
            add &ldquo;Draft&rdquo; and a date, and consultants add the client&apos;s name. You can add one to a
            finished PDF without going back to the original document.
          </p>

          <h2>What to put in a header or footer</h2>
          <ul>
            <li>
              <strong>Document title</strong>, shortened: &ldquo;Q3 report — board pack&rdquo;.
            </li>
            <li>
              <strong>Status and date</strong>: &ldquo;Draft for comment, 3 October 2026&rdquo;.
            </li>
            <li>
              <strong>Reference number</strong>: a case, claim, order or invoice number.
            </li>
            <li>
              <strong>Confidentiality</strong>: &ldquo;Confidential — not for distribution&rdquo;.
            </li>
            <li>
              <strong>Who it is for</strong>: &ldquo;Prepared for Northfield Ltd&rdquo;.
            </li>
          </ul>
          <p>Keep each line short. A header that runs into the page content is harder to read than none.</p>

          <h2>Add it step by step</h2>
          <ol>
            <li>
              Open <Link href="/pdf/pdf-header-footer">Add Header and Footer to PDF</Link> and add your file.
            </li>
            <li>Type the header text, the footer text, or both.</li>
            <li>Choose left, centre or right alignment and a text size.</li>
            <li>
              Set the distance from the edge so the text sits inside the printable area, about 10 mm on most
              office printers.
            </li>
            <li>Tick &ldquo;Skip the first page&rdquo; if the document opens with a cover or title page.</li>
            <li>Save, then check the first page of the saved file, which is shown as a preview.</li>
          </ol>

          <h2>Headers, page numbers and watermarks together</h2>
          <p>
            Page numbers are added with a separate tool,{" "}
            <Link href="/pdf/pdf-add-page-numbers">Add Page Numbers to PDF</Link>, which offers formats such as
            &ldquo;Page 3 of 12&rdquo;. Run one after the other and put them in different places: for example
            the reference in the footer on the left and the page number on the right. Both tools have a
            first-page option, so the cover stays clean.
          </p>
          <p>
            A watermark does a different job. It crosses the page diagonally and is hard to ignore, which suits
            &ldquo;Draft&rdquo; or &ldquo;Copy&rdquo;. A header is quieter and suits reference information. If
            you need both, use <Link href="/pdf/pdf-watermark">Add Watermark to PDF</Link> for the status and a
            footer for the details. The <Link href="/guides/how-to-watermark-a-pdf">guide to watermarking a PDF</Link>{" "}
            has wording that works.
          </p>

          <h2>Things to check</h2>
          <ul>
            <li>
              <strong>Existing headers.</strong> Many documents already have a header from Word. Put yours at
              the other edge, or in a different corner, so the two do not overlap.
            </li>
            <li>
              <strong>Landscape pages.</strong> Tables are often on rotated pages. Look at those thumbnails
              specifically.
            </li>
            <li>
              <strong>Full-bleed pages.</strong> Photographs and slides that run to the page edge may hide light
              text. Choose a text colour that shows on both white and dark areas, or move the line inwards.
            </li>
          </ul>

          <h2>It becomes part of the page</h2>
          <p>
            The text is drawn onto each page, so the recipient sees it in every viewer and on paper. It is not
            a form field that can be switched off. That is the point, but it also means you should keep the
            original file: if the date or the status changes, start again from the clean copy rather than
            stamping over the old line.
          </p>
        </>
      );
    },
  },

  {
    slug: "change-the-title-a-pdf-shows",
    topic: "PDF",
    title: "How to change the title a PDF shows in the browser tab",
    seoTitle: "How to Change the Title a PDF Shows in a Browser",
    description:
      "A PDF opened in a browser can show a title like Microsoft Word - Document1 instead of its name. Why it happens and how to set a proper title and author.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-metadata-editor", "word-to-pdf"],
    Body: function Body() {
      return (
        <>
          <p>
            You publish a price list as <code>price-list-2026.pdf</code>, open it in a browser, and the tab
            says &ldquo;Microsoft Word - Document1&rdquo; or &ldquo;Untitled&rdquo;. The file name is fine; the
            problem is a hidden field inside the PDF called the title. Fixing it takes a minute and makes the
            document look finished.
          </p>

          <h2>Where the wrong title comes from</h2>
          <p>
            A PDF carries document properties alongside its pages: title, author, subject, keywords, the
            program that made it and two dates. Most browser PDF viewers show the title in the tab when one
            is set, and fall back to the file name when it is empty. Programs fill in the title themselves,
            often with whatever the original document was called on the author&apos;s computer, or with the
            name of a template.
          </p>
          <p>
            The same properties can be read by anyone who receives the file. An author field might show a
            person&apos;s full name or a work account, and a title might reveal an embarrassing working name
            such as &ldquo;final FINAL v7&rdquo;.
          </p>

          <h2>Set a proper title step by step</h2>
          <ol>
            <li>
              Open the <Link href="/pdf/pdf-metadata-editor">PDF Metadata Editor</Link> and add the file. It
              reads the current properties in your browser.
            </li>
            <li>
              Type a clear title, such as &ldquo;Price list 2026 — Northfield Garden Supplies&rdquo;.
            </li>
            <li>Change or clear the author, subject and keywords.</li>
            <li>
              Decide on the dates. You can set &ldquo;last modified&rdquo; to the time you save, and remove the
              XMP metadata stream, which is a second copy of the properties that some programs read instead.
            </li>
            <li>Save and open the new file in a browser to see the tab.</li>
          </ol>

          <h2>Why removing the XMP stream helps</h2>
          <p>
            Many PDFs store their properties twice: in the classic document information dictionary and in an
            XML block called XMP. If you change one and not the other, different programs can show different
            titles. Clearing the XMP copy when you save leaves one consistent set of properties.
          </p>

          <h2>Writing a good PDF title</h2>
          <ul>
            <li>Describe the document, not the file: &ldquo;Annual report 2026&rdquo;, not &ldquo;AR26_v3&rdquo;.</li>
            <li>Put the distinctive words first, because a browser tab shows only the beginning.</li>
            <li>
              Include the organisation name if the PDF will be found through search. Search engines can index
              PDFs, and a meaningful title gives them something better than a file name to show.
            </li>
            <li>Keep it under about 60 characters.</li>
          </ul>

          <h2>Check that it worked</h2>
          <p>
            Open the saved file in two places: a browser tab and a desktop PDF reader. Both should show the new
            title. If one still shows the old name, the file you opened may be a cached copy; rename it or
            clear the download and open it again. On a website, the browser may also be showing the cached
            version of the old file, so add a version to the file name when you replace it, such as{" "}
            <code>price-list-2026-v2.pdf</code>.
          </p>
          <p>
            The link text on your own pages matters as much as the title inside the file. &ldquo;Download the
            2026 price list (PDF, 240 KB)&rdquo; tells visitors what they will get and how big it is before
            they click.
          </p>

          <h2>Fix it at the source next time</h2>
          <p>
            In Word, the title comes from File → Info → Properties → Title. Fill it in before exporting and the
            PDF inherits it. When converting with <Link href="/pdf/word-to-pdf">Word to PDF</Link>, the same
            applies: set the property in the document first.
          </p>
          <p>
            If you are cleaning a PDF before sharing it outside your organisation, the title is only one of
            several hidden details. The guide to{" "}
            <Link href="/guides/remove-hidden-data-from-a-pdf">removing hidden data from a PDF</Link> covers
            comments, attachments and the rest.
          </p>
        </>
      );
    },
  },

  {
    slug: "what-does-flattening-a-pdf-mean",
    topic: "PDF",
    title: "What does flattening a PDF mean, and when should you do it?",
    seoTitle: "What Does Flattening a PDF Mean?",
    description:
      "Flattening turns form fields and their answers into ordinary page content. When it helps, when a portal requires it, and why you should keep an unflattened copy.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-flatten-form", "pdf-signature", "merge-pdf"],
    Body: function Body() {
      return (
        <>
          <p>
            &ldquo;Please flatten the PDF before uploading&rdquo; is an instruction that confuses a lot of
            people, because the document already looks flat on screen. It refers to what sits underneath:
            the interactive layer of form fields.
          </p>

          <h2>Fields versus page content</h2>
          <p>
            A fillable PDF has two layers. The page itself contains the printed text, lines and boxes. On top
            of it, the form fields hold your answers. A viewer draws the answers over the page, and anyone with
            a PDF editor can click a field and change it.
          </p>
          <p>
            Flattening merges the two. The answers are drawn into the page as ordinary content, and the fields
            are removed. The document looks the same, but there is nothing left to click or edit.
          </p>

          <h2>Why people ask you to flatten</h2>
          <ul>
            <li>
              <strong>So answers cannot be changed.</strong> A signed application or a completed checklist
              should arrive exactly as you sent it.
            </li>
            <li>
              <strong>So it looks the same everywhere.</strong> Some viewers, especially on phones, show field
              values in a different font, cut long answers short or do not show them at all.
            </li>
            <li>
              <strong>So it prints correctly.</strong> Certain print settings skip form fields, leaving blanks
              on paper.
            </li>
            <li>
              <strong>So merging works.</strong> When two filled-in forms with the same field names are merged,
              the fields can clash and one set of answers can overwrite the other. Flatten each form before
              combining them in <Link href="/pdf/merge-pdf">Merge PDF</Link>.
            </li>
          </ul>

          <h2>Flatten a form step by step</h2>
          <ol>
            <li>Fill in the form and save it in your PDF viewer.</li>
            <li>
              Open <Link href="/pdf/pdf-flatten-form">Flatten PDF Form</Link> and add the filled file. It looks
              for form fields first.
            </li>
            <li>Download the flattened copy and check that every answer is visible.</li>
          </ol>
          <p>
            If the tool reports that no form fields were found, the file is already flat. That is common when
            a form was completed by typing text boxes on top of the page or by printing to PDF.
          </p>

          <h2>Keep the unflattened copy</h2>
          <p>
            Flattening cannot be undone. If you spot a typo after flattening, you have to fill the form again
            from the original. Save the filled, still-editable version under a different name, such as{" "}
            <code>application-editable.pdf</code>, and send the flattened one.
          </p>

          <h2>Flattening and digital signatures</h2>
          <p>
            A drawn or typed signature is just part of the page and survives flattening. A certificate-based
            digital signature is different: it seals the file as it was at the moment of signing, and any later
            change, including flattening, breaks the seal and shows the signature as invalid. If a document will
            be digitally signed, fill it, flatten it, and only then sign it. If you receive one that is already
            digitally signed, do not flatten it.
          </p>

          <h2>What flattening does not do</h2>
          <ul>
            <li>
              It does not hide information. The answers are still text that can be copied out. To remove
              something for good, use proper redaction; see{" "}
              <Link href="/guides/how-to-redact-a-pdf">how to redact a PDF properly</Link>.
            </li>
            <li>
              It does not add a signature. Add one with <Link href="/pdf/pdf-signature">Sign PDF</Link>, then
              flatten if the recipient asked for it.
            </li>
            <li>It does not make the file much smaller, because the answers are only a little text.</li>
          </ul>
          <p>
            Filling a form that has no fields at all is a different problem; the guide to{" "}
            <Link href="/guides/how-to-fill-in-a-pdf-form">filling in a PDF form</Link> explains the options.
          </p>
        </>
      );
    },
  },

  {
    slug: "read-a-pdf-in-dark-mode",
    topic: "PDF",
    title: "How to read a PDF in dark mode",
    seoTitle: "How to Read a PDF in Dark Mode (Light Text)",
    description:
      "Most PDF viewers ignore your dark theme. How to make a PDF dark with light text for night reading, what happens to photos, and when a viewer setting is enough.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-invert-colors", "pdf-crop-margins", "pdf-grayscale"],
    Body: function Body() {
      return (
        <>
          <p>
            Your phone, browser and operating system can all be set to dark mode, and then you open a PDF and
            get a bright white page. That is because a PDF describes exactly what each page looks like,
            including its white background, and most viewers draw it faithfully. To read it with light text on
            a dark page, either the viewer has to repaint it or the file has to change.
          </p>

          <h2>Option 1: a viewer setting</h2>
          <p>
            Some readers can repaint pages for you. Adobe Acrobat Reader has an accessibility preference to
            replace document colours, and many e-reader and tablet apps offer a night or inverted mode. This
            is the best option if your app has it, because the file stays untouched. The catch is that it
            only works in that app, and the setting often resets.
          </p>

          <h2>Option 2: make a dark copy of the file</h2>
          <ol>
            <li>
              Open <Link href="/pdf/pdf-invert-colors">Invert PDF Colours</Link> and add the PDF.
            </li>
            <li>Download the inverted copy: white pages become black and black text becomes white.</li>
            <li>Open that copy in any viewer, on any device, for night reading.</li>
          </ol>
          <p>
            Because the change is in the file, it works everywhere: in a browser, on a phone, on an e-reader
            that ignores themes. The conversion runs in your browser, so the document is not uploaded.
          </p>

          <h2>What happens to images and colours</h2>
          <ul>
            <li>
              <strong>Photographs become negatives.</strong> Faces look strange. For a text-heavy book that
              hardly matters; for a photo-heavy brochure, a viewer setting is better.
            </li>
            <li>
              <strong>Colours flip to their opposites.</strong> Blue links turn orange and red warnings turn
              cyan. Charts remain readable but the colour key changes meaning.
            </li>
            <li>
              <strong>Scanned pages</strong> invert well, but the grey paper of a scan becomes dark grey rather
              than black. Converting to <Link href="/pdf/pdf-grayscale">grayscale</Link> first can give cleaner
              contrast.
            </li>
          </ul>

          <h2>Make it easier to read on a small screen</h2>
          <p>
            Dark mode helps at night, but on a phone the bigger problem is often wide white margins that shrink
            the text. Trim them first with <Link href="/pdf/pdf-crop-margins">Crop PDF Margins</Link>, then
            invert. The text fills more of the screen, so you zoom less. The guide to{" "}
            <Link href="/guides/read-pdfs-on-a-tablet">reading PDFs comfortably on a tablet</Link> covers the
            rest of the set-up.
          </p>

          <h2>Which documents invert well</h2>
          <ul>
            <li>Novels, reports, contracts and course notes: almost entirely text, so they invert cleanly.</li>
            <li>Code listings and technical manuals: fine, though syntax colours change.</li>
            <li>
              Maps, colour-coded charts and photo books: better left as they are, or read with a viewer setting
              that only repaints the background.
            </li>
          </ul>

          <h2>Comfort tips</h2>
          <ul>
            <li>
              Pure white text on pure black can look harsh. Turn screen brightness down rather than reading at
              full brightness in a dark room.
            </li>
            <li>
              If your phone has a warm-colour night setting, use it as well; it changes the screen, not the
              file.
            </li>
            <li>Keep the original for printing. An inverted PDF prints mostly black and drains toner.</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "count-words-in-a-pdf",
    topic: "PDF",
    title: "How to count the words in a PDF",
    seoTitle: "How to Count the Words in a PDF",
    description:
      "Translators, editors and students often need a PDF word count. How to get one, why a scanned PDF counts as zero, and why two tools can disagree.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-to-text", "word-counter", "image-to-text"],
    Body: function Body() {
      return (
        <>
          <p>
            Word processors show a word count in the status bar, but PDF viewers rarely do. Yet a word count is
            exactly what a translation quote, an editing estimate or a submission limit is based on. Here is
            how to get an accurate one, and how to decide what should count.
          </p>

          <h2>Get the count step by step</h2>
          <ol>
            <li>
              Open <Link href="/pdf/pdf-to-text">PDF to Text</Link> and add the file. The text is extracted in
              your browser.
            </li>
            <li>Read the Words figure, along with characters and the number of pages that contain text.</li>
            <li>
              If you need to exclude parts, such as the references, copy the text into the{" "}
              <Link href="/text/word-counter">Word Counter</Link>, delete what should not count and read the new
              total.
            </li>
          </ol>

          <h2>Why a scanned PDF shows zero words</h2>
          <p>
            A scanned PDF is a set of pictures of pages. There is no text inside it to count, so the extractor
            reports that some or all pages contain no text. To count it, the pages must be read with OCR
            first: export them as images and run them through{" "}
            <Link href="/image/image-to-text">Image to Text</Link>. The guide to{" "}
            <Link href="/guides/get-text-from-a-scanned-pdf">getting text out of a scanned PDF</Link> walks
            through it. Expect the OCR count to be close but not exact.
          </p>

          <h2>Why two counts disagree</h2>
          <p>Different tools can give different totals for the same file. The usual reasons:</p>
          <ul>
            <li>
              <strong>Headers, footers and page numbers.</strong> A running title on every page of a 40-page
              document adds a few hundred words.
            </li>
            <li>
              <strong>Hyphenated line breaks.</strong> A word split across two lines, such as
              &ldquo;docu-&rdquo; and &ldquo;ment&rdquo;, may be counted as two words.
            </li>
            <li>
              <strong>Tables and figures.</strong> Every cell becomes separate text, including numbers.
            </li>
            <li>
              <strong>Footnotes, captions and references.</strong> Some counts include them; many submission
              rules do not.
            </li>
            <li>
              <strong>Dashes and symbols.</strong> Some tools count &ldquo;—&rdquo; or &ldquo;&amp;&rdquo; as
              words, others do not.
            </li>
          </ul>
          <p>
            For a quote or a limit, a difference of 1–2% is normal. Agree with the other party which tool and
            which parts count, and state it on the quote.
          </p>

          <h2>Counting for a translation quote</h2>
          <p>
            Translators normally quote on source words. Before counting, decide whether repeated boilerplate,
            such as the same disclaimer on every page, should be charged in full. Remove repeats in the Word
            Counter to see the difference. The &ldquo;Mark where each page starts&rdquo; option in PDF to Text
            helps when you need a count per page or per section.
          </p>

          <h2>When the quote is per character</h2>
          <p>
            For Chinese, Japanese and Korean, which do not separate words with spaces, translators and agencies
            usually count characters instead of words. Some publishers and subtitle services do the same in any
            language. PDF to Text gives a character count alongside the word count. Whether spaces are included
            changes the figure by roughly a sixth in English, so say which you mean; the guide to{" "}
            <Link href="/guides/characters-with-and-without-spaces">characters with and without spaces</Link>{" "}
            explains the difference.
          </p>

          <h2>Turning a count into time</h2>
          <p>
            Once you have the total, the Word Counter also estimates reading and speaking time. For how those
            estimates work, see{" "}
            <Link href="/guides/words-to-reading-time">how long it takes to read or say 1,000 words</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "make-a-pdf-portfolio-from-images",
    topic: "PDF",
    title: "How to make a PDF portfolio from your images",
    seoTitle: "How to Make a PDF Portfolio From Images",
    description:
      "Turn your best images into one PDF portfolio that opens anywhere: page order, page size, keeping under a file size limit, and bookmarks for each project.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["image-to-pdf", "resize-image", "pdf-bookmarks"],
    Body: function Body() {
      return (
        <>
          <p>
            Design schools, architecture practices, photography clients and illustration agents often ask for
            &ldquo;a PDF portfolio&rdquo; rather than a link. A single file opens on any computer, can be read
            offline and is easy to forward to a colleague. Building one from your images is mostly a matter of
            choosing well and controlling the file size.
          </p>

          <h2>Choose and order the work</h2>
          <ul>
            <li>
              <strong>Edit hard.</strong> Ten to twenty strong pieces beat forty mixed ones. Reviewers often look
              at the first few pages only.
            </li>
            <li>
              <strong>Lead and close with your best.</strong> Put the strongest project first and a strong one
              last.
            </li>
            <li>
              <strong>Match the request.</strong> If the job is for packaging, show packaging first, even if
              your favourite piece is a poster.
            </li>
            <li>
              <strong>Name files in order</strong>, such as <code>01-cover.jpg</code>, <code>02-project.jpg</code>,
              so they load in the right sequence.
            </li>
          </ul>

          <h2>Resize the images first</h2>
          <p>
            Camera files are much larger than a screen needs. A portfolio is read on a monitor, so around 2,000
            to 2,500 pixels on the long side is plenty. Use <Link href="/image/resize-image">Resize Image</Link>{" "}
            on the whole set before building the PDF. This is the single biggest factor in the final file size,
            and it is far better than shrinking the finished PDF, which can blur fine detail.
          </p>

          <h2>Build the PDF step by step</h2>
          <ol>
            <li>
              Open <Link href="/image/image-to-pdf">Image to PDF</Link> and add the images. JPG, PNG and WebP can
              be mixed.
            </li>
            <li>Move them into order with the up and down arrows.</li>
            <li>
              Choose the page size. &ldquo;Match image&rdquo; gives each page the shape of its picture, which
              looks best on screen. Choose A4 or Letter if the portfolio may be printed.
            </li>
            <li>Choose landscape or portrait, and add a margin if you want white space around the work.</li>
            <li>Create the PDF. Everything happens in your browser, so unreleased work is not uploaded.</li>
          </ol>

          <h2>Add a cover and navigation</h2>
          <p>
            A cover page with your name, discipline and contact details can be made in any word processor and
            exported as a PDF, then joined to the front with <Link href="/pdf/merge-pdf">Merge PDF</Link>. For a
            portfolio with several projects, add bookmarks with the{" "}
            <Link href="/pdf/pdf-bookmarks">PDF Bookmarks Editor</Link>: one entry per project, so a reviewer
            can jump straight to the one they care about. The guide to{" "}
            <Link href="/guides/how-to-add-bookmarks-to-a-pdf">adding bookmarks to a PDF</Link> explains how
            readers show them.
          </p>

          <h2>Landscape or portrait?</h2>
          <p>
            Most portfolios are read on laptop screens, which are wide. Landscape pages fill the screen without
            black bars, so they are usually the better choice for a mixed portfolio. Portrait suits a portfolio
            of posters, book covers or fashion photography. Do not mix the two within one project; a reader
            should not have to rotate their head between pages.
          </p>

          <h2>Stay under the size limit</h2>
          <p>
            Application forms and email both have limits; check the one you are sending to. If the file is too
            big, resize the largest images further rather than compressing the PDF. Compressing redraws every
            page as an image, which is fine for scans but can soften crisp graphic work. For more detail on
            image sizes and quality, see{" "}
            <Link href="/guides/how-to-compress-images">how to compress images without losing quality</Link>.
          </p>

          <h2>Final checks</h2>
          <ul>
            <li>Open the PDF on a phone as well as a computer.</li>
            <li>Check colour-critical work on more than one screen.</li>
            <li>
              Name the file with your name: <code>alex-morgan-portfolio-2026.pdf</code>, not{" "}
              <code>portfolio.pdf</code>.
            </li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "get-text-from-a-scanned-pdf",
    topic: "PDF",
    title: "How to get editable text out of a scanned PDF",
    seoTitle: "How to Get Text From a Scanned PDF (OCR)",
    description:
      "A scanned PDF is a stack of pictures, so copying and searching do nothing. How to tell, how to run OCR on the pages, and how to check the text it produces.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-to-png", "image-to-text", "pdf-to-text"],
    Body: function Body() {
      return (
        <>
          <p>
            You try to copy a paragraph from a PDF and nothing highlights. You press Ctrl+F and the search finds
            nothing, even though the word is right there on the page. The PDF is a scan: each page is a
            photograph of paper, with no text inside it. To edit, search or quote it, the text has to be read
            from the pictures with optical character recognition, or OCR.
          </p>

          <h2>Check whether the PDF has text</h2>
          <p>
            Try selecting a line with the mouse. If whole pages highlight as a block, or nothing highlights,
            it is a scan. For a definite answer, open <Link href="/pdf/pdf-to-text">PDF to Text</Link>: it
            reports which pages contained no text. If every page has text already, you do not need OCR; copy it
            directly or use <Link href="/pdf/pdf-to-word">PDF to Word</Link>.
          </p>

          <h2>Run OCR on the pages</h2>
          <ol>
            <li>
              Turn the pages into images with <Link href="/pdf/pdf-to-png">PDF to PNG</Link>. PNG keeps every
              pixel, which helps recognition more than JPG.
            </li>
            <li>
              Open <Link href="/image/image-to-text">Image to Text</Link> and add a page image.
            </li>
            <li>Choose the language of the text. Recognition is much better with the right language set.</li>
            <li>Copy the result into your document and repeat for the other pages.</li>
          </ol>
          <p>
            Both steps run in your browser. That matters for scanned contracts, payslips and medical records,
            which should not be uploaded to a stranger&apos;s server just to read them.
          </p>

          <h2>Get better results</h2>
          <ul>
            <li>
              <strong>Straighten pages first.</strong> Sideways or upside-down pages are read poorly. Fix them
              with <Link href="/pdf/rotate-pdf">Rotate PDF</Link> before exporting.
            </li>
            <li>
              <strong>Resolution matters.</strong> Small print scanned at low resolution blurs into shapes. If
              you can rescan, 300 dpi is the usual recommendation for OCR.
            </li>
            <li>
              <strong>Contrast matters.</strong> Faint photocopies, coloured paper and stamps over text all
              reduce accuracy.
            </li>
            <li>
              <strong>Simple layouts work best.</strong> Single columns come out cleanly. Multi-column pages,
              tables and forms may be read across the columns, so check the order.
            </li>
          </ul>

          <h2>Check the text carefully</h2>
          <p>
            OCR is very good on clean print but never perfect. The errors are predictable, so look for them:
          </p>
          <ul>
            <li>
              Look-alike characters: 0 and O, 1, l and I, 5 and S, rn and m.
            </li>
            <li>Numbers in amounts, dates and account numbers, where one wrong digit matters most.</li>
            <li>Words split by line-end hyphens.</li>
            <li>Missing accents and symbols.</li>
          </ul>
          <p>
            If the extracted text has broken line breaks and odd spacing, the{" "}
            <Link href="/text/text-cleaner">Text Cleaner</Link> joins lines and fixes spacing in one pass. The
            guide to <Link href="/guides/fix-text-copied-from-a-pdf">fixing text copied from a PDF</Link> covers
            the same clean-up for text PDFs.
          </p>

          <h2>Make a searchable copy for later</h2>
          <p>
            Once the text is out, you can keep it in two forms: an editable document for quoting and reusing,
            and the original scan as the record of what the paper said. Store them side by side with matching
            names, such as <code>lease-2026-scan.pdf</code> and <code>lease-2026-text.docx</code>. Your
            computer&apos;s file search will then find the lease by any word inside it, which the scan alone
            could never do.
          </p>

          <h2>Compressed PDFs lose their text too</h2>
          <p>
            A PDF that was originally typed can still end up as pictures. Heavy compression often redraws pages
            as images, and printing to a scanner-style &ldquo;image PDF&rdquo; does the same. If an older copy
            of the file exists, use that instead of running OCR on the compressed one. The guide to{" "}
            <Link href="/guides/how-to-copy-text-from-an-image">copying text from an image</Link> covers OCR on
            screenshots and photos.
          </p>
        </>
      );
    },
  },

  {
    slug: "pdf-prints-too-small-or-cut-off",
    topic: "PDF",
    title: "Why a PDF prints too small or gets cut off, and how to fix it",
    seoTitle: "PDF Prints Too Small or Cut Off? How to Fix It",
    description:
      "Big white margins, text chopped at the edges, or a page shrunk into the middle of the sheet. What causes each printing problem and how to fix it.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-resize-page", "pdf-crop-margins", "pdf-n-up"],
    Body: function Body() {
      return (
        <>
          <p>
            The PDF looks perfect on screen. On paper, the text is tiny with wide white borders, or the bottom
            line is missing, or the right edge is cut off. Nearly every case comes down to one of three things:
            the paper size, the scaling setting, or white space built into the PDF itself.
          </p>

          <h2>Diagnose the problem</h2>
          <table>
            <thead>
              <tr>
                <th>Symptom</th>
                <th>Cause</th>
                <th>Fix</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Bottom lines missing on A4</td>
                <td>Letter or Legal PDF, actual size</td>
                <td>Fit to page, or convert</td>
              </tr>
              <tr>
                <td>Sides cut off on Letter</td>
                <td>A4 PDF, actual size</td>
                <td>Fit to page, or convert</td>
              </tr>
              <tr>
                <td>Page shrunk with big borders</td>
                <td>Scaling, or white space in the PDF</td>
                <td>Actual size, or crop margins</td>
              </tr>
              <tr>
                <td>Edge text clipped slightly</td>
                <td>Printer&apos;s unprintable edge</td>
                <td>Fit to printable area</td>
              </tr>
            </tbody>
          </table>

          <h2>Paper size mismatches</h2>
          <p>
            A4 (210 × 297 mm) is narrower and taller than US Letter (8.5 × 11 in, 216 × 279 mm). Print a Letter
            PDF at actual size on A4 and the bottom is cut; print an A4 PDF on Letter and the sides and bottom
            are tight. Legal paper is taller again. The full comparison is in{" "}
            <Link href="/guides/a4-vs-letter-paper-size">A4 vs Letter paper sizes</Link>.
          </p>
          <p>
            The quick fix is the print dialog: choose &ldquo;Fit&rdquo;, &ldquo;Shrink oversized pages&rdquo; or
            &ldquo;Fit to printable area&rdquo;. The lasting fix is to convert the file, so it prints correctly
            for anyone: open the <Link href="/pdf/pdf-resize-page">PDF Page Size Converter</Link>, choose the
            new paper size and pick Scale to fit. Use Keep content size if you only want the paper changed and
            the content to stay exactly as large as it was.
          </p>

          <h2>White space built into the PDF</h2>
          <p>
            Scans often include the scanner glass around the paper, and documents exported from slides or
            spreadsheets can have large built-in margins. Fitting such a page to paper leaves the content small
            in the middle. Trim the white space with{" "}
            <Link href="/pdf/pdf-crop-margins">Crop PDF Margins</Link>, using the same margin on every side or
            different values for each edge, then print with Fit. The content now fills the sheet.
          </p>

          <h2>The printer&apos;s own margin</h2>
          <p>
            Most office and home printers cannot print right to the edge; a few millimetres around the sheet
            stay blank. A PDF designed edge to edge, such as a flyer, loses that strip at actual size. Choose
            &ldquo;Fit to printable area&rdquo; to shrink it slightly, or accept a thin white border. Borderless
            photo printing is a separate printer setting and only works on some paper types.
          </p>

          <h2>Printing slides or small pages</h2>
          <p>
            Presentation PDFs printed one slide per sheet waste paper and still look small. Put several on each
            sheet with <Link href="/pdf/pdf-n-up">Multiple PDF Pages Per Sheet</Link>; two or four per sheet are
            readable for most slides. See{" "}
            <Link href="/guides/print-multiple-pages-per-sheet">printing multiple pages on one sheet</Link> for
            which layouts stay legible.
          </p>

          <h2>Check before printing a long document</h2>
          <ul>
            <li>Print one page first, ideally the one with the most text near the edges.</li>
            <li>Check the printer&apos;s paper tray setting matches the paper actually loaded.</li>
            <li>Look for &ldquo;Auto rotate and centre&rdquo;, which helps when pages mix portrait and landscape.</li>
          </ul>
        </>
      );
    },
  },
];
