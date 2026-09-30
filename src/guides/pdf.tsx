import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-09-27";
const UPDATED = "2026-09-30";

export const pdfGuides: Guide[] = [
  {
    slug: "how-to-merge-pdf-files",
    topic: "PDF",
    title: "How to merge PDF files into one — without uploading them",
    seoTitle: "How to Merge PDF Files Into One (No Upload)",
    description:
      "Combine several PDFs into one document in the order you want, keep full quality, and avoid sending private files to an upload site.",
    published: PUBLISHED,
    updated: UPDATED,
    tools: ["merge-pdf", "pdf-reorder-pages", "compress-pdf", "split-pdf"],
    Body: function Body() {
      return (
        <>
          <p>
            Application packs, expense claims, contracts with annexes — sooner or later you need to
            send several PDFs as one file. Merging is simple, but a few details decide whether the
            result is clean: the order, what survives the merge, and where your documents go while
            it happens.
          </p>

          <h2>Before you merge: get the pieces ready</h2>
          <p>
            A merged file is only as tidy as the documents that go into it, and a problem page is
            much easier to fix before it is buried in the middle of a forty-page pack. Two minutes
            of preparation saves redoing the merge.
          </p>
          <ul>
            <li>
              <strong>Turn sideways pages upright.</strong> Scans often come out rotated. Fix them
              with <Link href="/pdf/rotate-pdf">Rotate PDF</Link> so nobody has to tilt their head
              halfway through.
            </li>
            <li>
              <strong>Drop blank and duplicate pages</strong> with{" "}
              <Link href="/pdf/delete-pdf-pages">Delete PDF Pages</Link>. Double-sided scanning of
              single-sided paper leaves a blank after every page.
            </li>
            <li>
              <strong>Convert anything that is not a PDF yet.</strong> Photos of receipts and
              certificates go through <Link href="/pdf/jpg-to-pdf">JPG to PDF</Link>, which puts one
              image on each page. For a Word document with images or tables, export it to PDF from
              your word processor so the layout comes across intact.
            </li>
            <li>
              <strong>Give the files names that show their order</strong>, such as 01-cover-letter,
              02-cv, 03-references. The list is then easy to check at a glance before you press the
              button.
            </li>
          </ul>

          <h2>Merge PDFs step by step</h2>
          <ol>
            <li>
              Open <Link href="/pdf/merge-pdf">Merge PDF</Link> and drop your files onto the upload
              area, or click it to browse. You can add more later; they go to the end of the list.
            </li>
            <li>Use the arrows beside each file to put them in the order you want.</li>
            <li>Press Merge PDFs and download the combined document.</li>
          </ol>
          <p>
            The files are read and combined inside your browser, so nothing is uploaded — worth
            knowing when the documents are payslips, IDs or contracts.
          </p>

          <h2>A worked example</h2>
          <p>
            Say a job application asks for a single attachment. You have four files: a cover letter,
            a CV, a page of references and a portfolio. Add all four, move the cover letter to the
            top so it is the first thing the reader sees, and merge. The result is one PDF with the
            pages in exactly the order you arranged — twelve pages if the four files had one, two,
            one and eight pages. Open it and scroll through once before sending: the page count
            should equal the sum of the originals, and the first page should be the one you meant.
          </p>

          <h2>What survives a merge</h2>
          <p>
            A proper merge copies pages rather than re-drawing them. Text stays selectable, fonts
            stay embedded and images keep their original quality, so the merged file looks exactly
            like the originals placed one after another.
          </p>
          <p>
            Document-level extras are a different matter. Bookmarks, fillable form fields and
            annotations belong to each original document&apos;s structure rather than to its pages,
            and they are not carried into the merged file. If one of the documents is a filled-in
            form, flatten it first with <Link href="/pdf/pdf-flatten-form">Flatten PDF Form</Link> so
            the answers become part of the page.
          </p>

          <h2>Mixed page sizes and orientations</h2>
          <p>
            Every page keeps its own size and rotation, because pages are copied as they are. A pack
            that mixes A4 with US Letter, or portrait pages with a landscape spreadsheet, is a
            perfectly valid PDF and reads fine on screen. Printing is where it shows: a printer
            loaded with one paper size has to shrink or crop the odd pages. If the pack will be
            printed, run the merged file through the{" "}
            <Link href="/pdf/pdf-resize-page">PDF Page Size Converter</Link>, which scales every page
            to fit one size such as A4 or Letter.
          </p>

          <h2>Finishing touches</h2>
          <p>A long merged document is easier to use with a little navigation added afterwards:</p>
          <ul>
            <li>
              <strong>Page numbers.</strong> The originals each start at page 1, which is confusing
              in a combined file. <Link href="/pdf/pdf-add-page-numbers">Add Page Numbers to PDF</Link>{" "}
              numbers the whole pack in one sequence.
            </li>
            <li>
              <strong>Bookmarks.</strong> Since the originals&apos; bookmarks are not carried over,
              add fresh ones with the <Link href="/pdf/pdf-bookmarks">PDF Bookmarks Editor</Link> —
              one entry per document lets a reader jump straight to the section they want.
            </li>
            <li>
              <strong>A header or footer</strong>, such as your name or a reference number on every
              page, with <Link href="/pdf/pdf-header-footer">Add Header and Footer to PDF</Link>.
            </li>
          </ul>

          <h2>Common problems</h2>
          <ul>
            <li>
              <strong>A file will not open.</strong> Password-protected PDFs cannot be read without
              the password. Remove the protection in the app that created it, then merge.
            </li>
            <li>
              <strong>Pages end up in the wrong order.</strong> Merge first, then fine-tune with{" "}
              <Link href="/pdf/pdf-reorder-pages">Rearrange PDF Pages</Link>, which lets you move
              individual pages rather than whole files.
            </li>
            <li>
              <strong>The result is too big to email.</strong> Merging adds sizes together. If the
              combined file is over your email limit, see{" "}
              <Link href="/guides/how-to-reduce-pdf-file-size">how to reduce PDF file size</Link>.
            </li>
            <li>
              <strong>You only need part of a document.</strong> Take the pages you want out first
              with <Link href="/pdf/extract-pdf-pages">Extract PDF Pages</Link>, then merge the
              smaller file.
            </li>
          </ul>

          <h2>How many files can you merge?</h2>
          <p>
            There is no fixed limit, because the work happens on your own device. Dozens of ordinary
            PDFs merge in seconds. Very large scanned documents use a lot of memory, so on an older
            phone it can help to merge them in two batches and then merge the two results.
          </p>

          <h2>Why it matters where the merge happens</h2>
          <p>
            Most merge websites work by uploading your files to their servers, combining them there
            and sending the result back. For a restaurant menu that is fine. For bank statements, a
            passport scan or a signed contract, it means a copy of each document has been handed to
            a company whose storage and deletion practices you have to take on trust. Merging in the
            browser avoids the question: the files are opened by the page itself and never sent. You
            can check this yourself by opening your browser&apos;s network tools while you merge —
            no request carries your documents.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-reduce-pdf-file-size",
    topic: "PDF",
    title: "How to reduce PDF file size for email and upload limits",
    seoTitle: "How to Reduce PDF File Size for Email",
    description:
      "Why some PDFs are huge, which ones shrink well, and how to get a PDF under an email or upload limit without making it unreadable.",
    published: PUBLISHED,
    updated: UPDATED,
    tools: ["compress-pdf", "delete-pdf-pages", "split-pdf", "compress-image"],
    Body: function Body() {
      return (
        <>
          <p>
            Most email services cap attachments at around 20–25 MB, and many upload forms allow far
            less. When a PDF is too big, the fix depends on what is making it big — and for most
            large PDFs, that is pictures.
          </p>

          <h2>How small does it need to be?</h2>
          <p>
            Start with the target, because it decides how hard you have to squeeze. Job portals,
            government forms and university systems often set limits of 2, 5 or 10 MB and state
            them next to the upload button. Email is less obvious. Attachments are re-encoded for
            sending in a way that adds about a third to their size, so a 19 MB file can be refused
            by a 25 MB limit. For email, aim to stay under about 18 MB, and well under that if you
            do not know the limit on the receiving side.
          </p>

          <h2>What makes a PDF large</h2>
          <p>
            Text is tiny: a hundred pages of plain text is usually well under a megabyte. The weight
            comes from images — scanned pages, photographs, high-resolution graphics. A document
            scanned at high quality stores every page as a detailed picture, which is why a
            twenty-page scan can be larger than a thousand-page novel.
          </p>
          <p>
            You can tell which kind you have in a few seconds. Open the PDF and try to select a
            sentence with the mouse. If individual words highlight, the file contains real text and
            is probably small per page already. If nothing highlights, or the whole page selects as
            one block, the pages are pictures — and pictures are what compression is good at.
          </p>

          <h2>Compress the PDF</h2>
          <ol>
            <li>
              Open <Link href="/pdf/compress-pdf">Compress PDF</Link> and add your file.
            </li>
            <li>
              Pick a level. Balanced suits most documents; Strong gives the smallest file for email;
              Light keeps the most detail for printing.
            </li>
            <li>Press Compress and compare the before and after sizes before you download.</li>
          </ol>
          <p>
            Compression works by re-drawing each page as an image at a lower resolution and quality.
            On scans and image-heavy brochures that typically removes 60–90% of the size. It has one
            trade-off to know about: the compressed pages are pictures, so their text can no longer
            be selected or searched.
          </p>

          <h2>A worked example</h2>
          <p>
            A 24-page contract scanned in colour comes out at 38 MB — too big for almost any inbox.
            Because it is a scan, it is exactly the kind of file that compresses well: a 60–90%
            reduction would bring it to somewhere between about 4 and 15 MB. Start with Balanced and
            look at the size it reports. If that is under your limit, open the result and read the
            smallest print on one page. If it is still too large, try Strong and check the small
            print again. The right level is the strongest one at which you can still read
            everything comfortably.
          </p>

          <h2>When compression does not help</h2>
          <p>
            A PDF that is mostly text is already stored efficiently. Turning its crisp text into
            page images can make it bigger, not smaller — the tool tells you when that happens and
            lets you keep the original. For those files, reduce what is in them instead:
          </p>
          <ul>
            <li>
              Remove pages nobody needs with{" "}
              <Link href="/pdf/delete-pdf-pages">Delete PDF Pages</Link>.
            </li>
            <li>
              Send it in parts: <Link href="/pdf/split-pdf">Split PDF</Link> can cut it every few
              pages or into ranges you choose.
            </li>
            <li>
              If you are building the PDF from photos, shrink the photos first with{" "}
              <Link href="/image/compress-image">Compress Image</Link> — a phone photo rarely needs
              to be 4,000 pixels wide to be read on a screen.
            </li>
          </ul>

          <h2>Choosing a level</h2>
          <p>
            Check the result at the size it will actually be read. A document someone will skim on a
            laptop can take Strong compression; one that will be printed, or that contains small
            print or fine drawings, should use Light. Always open the compressed copy and read a page
            of the smallest text before you send it.
          </p>
          <p>
            Keep the original file. Compression cannot be reversed — the detail that was removed is
            gone from the smaller copy — so treat the compressed PDF as the version you send and the
            original as the version you keep.
          </p>

          <h2>Make smaller PDFs in the first place</h2>
          <p>
            If you scan documents regularly, the scanner settings matter more than anything you do
            afterwards:
          </p>
          <ul>
            <li>
              <strong>Resolution.</strong> 150–200 dots per inch is enough for a text document that
              will be read on screen. 300 is the usual choice for printing or for archiving. Anything
              higher mostly adds megabytes.
            </li>
            <li>
              <strong>Colour mode.</strong> A page of black text does not need a colour scan.
              Greyscale is much smaller than colour, and black-and-white smaller again.
            </li>
            <li>
              <strong>Phone scans.</strong> Use the scanning mode in your notes or files app rather
              than the camera. It crops to the page and saves a far smaller image than a full
              photograph.
            </li>
          </ul>
          <p>
            When you create a PDF from a word processor, look in the export dialog for a
            minimum-size or reduced-size option. It shrinks embedded pictures while leaving the
            text as real, searchable text — the best of both.
          </p>

          <h2>If it still will not fit</h2>
          <p>
            Some documents are simply large: a hundred-page scanned report will not go under 5 MB
            and stay readable. In that case, stop fighting the limit. Upload the file to a cloud
            storage service you already use and send a share link instead of an attachment, or split
            the document and send it as clearly numbered parts. If it is going to an upload form
            with a strict limit, ask the organisation what they would prefer — they meet this
            problem every day.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-split-a-pdf",
    topic: "PDF",
    title: "How to split a PDF or pull out only the pages you need",
    seoTitle: "How to Split a PDF or Extract Pages",
    description:
      "Split a PDF into several files, save every page separately, or pull a few pages into a new document — with page ranges explained.",
    published: PUBLISHED,
    updated: UPDATED,
    tools: ["split-pdf", "extract-pdf-pages", "delete-pdf-pages", "merge-pdf"],
    Body: function Body() {
      return (
        <>
          <p>
            &ldquo;Split a PDF&rdquo; can mean three different jobs, and each has its own tool. Pick
            the one that matches what you want to end up with.
          </p>

          <h2>Which job is yours?</h2>
          <ul>
            <li>
              <strong>Divide the whole document into several files</strong> — every page ends up
              somewhere. Use <Link href="/pdf/split-pdf">Split PDF</Link>.
            </li>
            <li>
              <strong>Take a few pages out into a new file</strong> and ignore the rest. Use{" "}
              <Link href="/pdf/extract-pdf-pages">Extract PDF Pages</Link>.
            </li>
            <li>
              <strong>Keep the document but drop some pages.</strong> Use{" "}
              <Link href="/pdf/delete-pdf-pages">Delete PDF Pages</Link>.
            </li>
          </ul>
          <p>
            Extracting and deleting are two ways of reaching the same result, so choose whichever
            list is shorter. To keep three pages out of fifty, name the three you want and extract
            them. To lose three pages out of fifty, name the three you do not want and delete them.
          </p>

          <h2>How to write page ranges</h2>
          <p>
            All three accept the same notation you would type into a print dialog. A hyphen makes a
            range, a single number is one page, and commas separate the parts:
          </p>
          <ul>
            <li>
              <code>1-5</code> — pages 1 to 5
            </li>
            <li>
              <code>8</code> — page 8 only
            </li>
            <li>
              <code>1-5, 8, 12-20</code> — all of the above together
            </li>
          </ul>
          <p>Spaces are ignored, and a range that runs past the last page is flagged before anything is created.</p>
          <p>
            One thing catches people out: ranges count pages by their position in the file, not by
            the number printed on the page. A report with a cover, a contents page and a preface
            numbered i to iv may print &ldquo;1&rdquo; on what is really the seventh page of the
            file. Go by the page counter in your PDF reader — &ldquo;7 of 40&rdquo; — rather than by
            the number in the footer.
          </p>

          <h2>Split a PDF step by step</h2>
          <ol>
            <li>
              Add your file to <Link href="/pdf/split-pdf">Split PDF</Link>.
            </li>
            <li>
              Choose a mode: ranges you type, every N pages (for example, every 2 pages for a stack of
              two-page forms), or one file per page.
            </li>
            <li>Check the summary, which lists exactly which pages go into each file.</li>
            <li>Press Split and download the files individually or together as a ZIP.</li>
          </ol>

          <h2>Three worked examples</h2>
          <p>
            <strong>Chapters of a report.</strong> A 40-page report has three chapters. Choose custom
            ranges and enter <code>1-12, 13-28, 29-40</code>. You get three PDFs of 12, 16 and 12
            pages, each named after the range it contains.
          </p>
          <p>
            <strong>A stack of scanned forms.</strong> Thirty pages came out of the scanner as one
            file, but they are really ten three-page forms. Choose every N pages with N set to 3,
            and you get ten files of three pages each — no ranges to type.
          </p>
          <p>
            <strong>One page per file.</strong> A set of certificates or payslips that each need to
            go to a different person: choose one file per page and every page becomes its own
            numbered PDF, delivered together in a ZIP.
          </p>

          <h2>Extracting also reorders</h2>
          <p>
            Extract PDF Pages copies pages in the order you list them. Typing <code>5, 1, 3</code>{" "}
            produces a new document in exactly that order, which makes it a quick way to pull a
            summary page to the front. You can choose the pages by clicking their thumbnails instead
            of typing, and you can have the extracted pages as one file or as separate files in a
            ZIP.
          </p>

          <h2>Does splitting reduce quality?</h2>
          <p>
            No. Pages are copied, not re-drawn, so text stays selectable and images are untouched.
            Your original file is only read, never changed, and it is not uploaded anywhere — the
            splitting happens in your browser. If you later need the pieces back together,{" "}
            <Link href="/pdf/merge-pdf">Merge PDF</Link> recombines them.
          </p>

          <h2>What splitting does not change</h2>
          <ul>
            <li>
              <strong>Numbers printed on the pages.</strong> A page that says &ldquo;Page 14 of
              40&rdquo; in its footer still says so after it becomes page 1 of a new file, because
              that text is part of the page. If the new file needs its own numbering, add it with{" "}
              <Link href="/pdf/pdf-add-page-numbers">Add Page Numbers to PDF</Link>.
            </li>
            <li>
              <strong>The size of each page&apos;s content.</strong> Splitting a scan in half gives
              two files that together weigh about the same as the original. If the goal is a smaller
              file rather than fewer pages, see{" "}
              <Link href="/guides/how-to-reduce-pdf-file-size">how to reduce PDF file size</Link>.
            </li>
            <li>
              <strong>Anything hidden in the pages you keep.</strong> Splitting removes whole pages.
              It does not remove a name or a number from a page you are still sending — for that,
              see <Link href="/guides/how-to-redact-a-pdf">how to redact a PDF properly</Link>.
            </li>
          </ul>

          <h2>Splitting to get under a size limit</h2>
          <p>
            There is no mode that splits by megabytes, because the size of a page is not known until
            it is written out. Split by page count instead and check the sizes of the pieces: if a
            60 MB scan of 120 pages has to go through a 25 MB limit, splitting every 40 pages gives
            three files of roughly 20 MB each, provided the pages are similar. If one part is still
            too large, split that part again. Number the parts in the file names — part 1 of 3, part
            2 of 3 — so the person receiving them knows when they have everything.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-convert-pdf-to-word",
    topic: "PDF",
    title: "How to convert a PDF to Word — and what to expect from the result",
    seoTitle: "How to Convert PDF to Word (What to Expect)",
    description:
      "Turn a PDF into an editable Word document, understand why layouts rarely survive perfectly, and what to do when a scanned PDF gives no text.",
    published: PUBLISHED,
    updated: UPDATED,
    tools: ["pdf-to-word", "pdf-to-text", "image-to-text", "word-to-pdf"],
    Body: function Body() {
      return (
        <>
          <p>
            You have a PDF and you need to change it: fix a typo in a letter, reuse a paragraph, fill
            in a form that was never meant to be filled. Converting it to Word is the usual answer,
            and it works well — as long as you know what a PDF can and cannot give back.
          </p>

          <h2>Do you need to convert at all?</h2>
          <p>
            Converting is the right move when you want to rewrite the words. Several common jobs do
            not need it, and are quicker and safer done on the PDF directly:
          </p>
          <ul>
            <li>
              <strong>Signing.</strong> Use <Link href="/pdf/pdf-signature">Sign PDF</Link> — see{" "}
              <Link href="/guides/how-to-sign-a-pdf-without-printing">
                how to sign a PDF without printing it
              </Link>
              .
            </li>
            <li>
              <strong>Filling in a form.</strong> Most PDF readers and browsers let you type into
              form fields, and the layout stays exactly as the sender designed it.
            </li>
            <li>
              <strong>Removing or reordering pages.</strong>{" "}
              <Link href="/pdf/delete-pdf-pages">Delete PDF Pages</Link> and{" "}
              <Link href="/pdf/pdf-reorder-pages">Rearrange PDF Pages</Link> do this without touching
              the content.
            </li>
            <li>
              <strong>Copying a paragraph.</strong> <Link href="/pdf/pdf-to-text">PDF to Text</Link>{" "}
              gives you the words without a Word file in between.
            </li>
          </ul>

          <h2>Why PDFs are hard to edit</h2>
          <p>
            A PDF is built for printing, not editing. It does not store paragraphs; it stores
            individual pieces of text at exact positions on the page. Converting to Word means
            rebuilding the reading order from those positions — grouping pieces into lines, and
            lines into paragraphs.
          </p>

          <h2>Convert step by step</h2>
          <ol>
            <li>
              Add your file to <Link href="/pdf/pdf-to-word">PDF to Word</Link>.
            </li>
            <li>Wait while each page is read, then check the preview of the extracted text.</li>
            <li>
              Download the .docx file. It opens in Microsoft Word, Google Docs, LibreOffice and Apple
              Pages.
            </li>
          </ol>
          <p>
            The conversion runs in your browser, so the document is not uploaded, and there is no
            account, email step or watermark.
          </p>

          <h2>What comes across, and what does not</h2>
          <p>
            You get the text, in reading order, with a page break between pages. For letters,
            reports and essays the result is very close to the original.
          </p>
          <p>
            Multi-column layouts, tables, floating images and exact fonts are part of the PDF&apos;s
            visual design, and they cannot be rebuilt reliably from text positions alone — no
            converter can promise that honestly. A magazine page will come out as plain paragraphs.
            If tables are what you need, <Link href="/pdf/pdf-to-excel">PDF to Excel</Link> is built
            for that job, and <Link href="/pdf/pdf-extract-images">Extract Images From PDF</Link>{" "}
            pulls out the pictures at their original size so you can place them back by hand.
          </p>

          <h2>Tidying the document in Word</h2>
          <p>
            A converted document usually needs five minutes of clean-up before it is pleasant to
            work in. The common jobs, in a sensible order:
          </p>
          <ul>
            <li>
              <strong>Delete repeated headers and footers.</strong> A running title or a page number
              is just text on each page as far as a PDF is concerned, so it arrives as a stray line
              at every page break. Search for it and remove the copies.
            </li>
            <li>
              <strong>Re-apply headings.</strong> Headings come across as ordinary text. Select each
              one and give it a heading style; the document then gets a working outline and table of
              contents again.
            </li>
            <li>
              <strong>Check words split across lines.</strong> If the original hyphenated a word at
              the end of a line, the hyphen may survive in the middle of a sentence. A quick search
              for a hyphen followed by a space finds most of them.
            </li>
            <li>
              <strong>Rebuild lists.</strong> Bullets and numbers may arrive as typed characters
              rather than real list formatting. Select the lines and apply a list style.
            </li>
            <li>
              <strong>Proofread numbers and names.</strong> The words are copied, not retyped, so
              errors are rare — but it is your name on the edited version.
            </li>
          </ul>

          <h2>Nothing came out? It is probably a scan</h2>
          <p>
            A scanned PDF is a photograph of a page. It contains no text at all, only a picture of
            text, so there is nothing to extract. You need optical character recognition (OCR)
            instead:
          </p>
          <ol>
            <li>
              Turn the pages into images with <Link href="/pdf/pdf-to-png">PDF to PNG</Link>.
            </li>
            <li>
              Read the words out of each image with{" "}
              <Link href="/image/image-to-text">Image to Text</Link>. See{" "}
              <Link href="/guides/how-to-copy-text-from-an-image">how to copy text from an image</Link>{" "}
              for tips on getting clean results.
            </li>
          </ol>
          <p>
            Some PDFs are a mixture — typed pages with a scanned signature page or a scanned
            appendix. The typed pages convert normally and the scanned ones come out empty. Run only
            the empty pages through OCR rather than the whole document.
          </p>

          <h2>Other ways to open a PDF in a word processor</h2>
          <p>
            Recent versions of Microsoft Word can open a PDF directly from the File menu and will
            attempt to rebuild the layout, including tables and images. Google Docs can do something
            similar for a PDF stored in Google Drive, and will run OCR on scanned pages. Both are
            worth trying when the layout matters more than anything else. The trade-offs are the
            ones you would expect: the result still needs checking, complex pages still break, and
            the Google route means uploading the document to your Drive.
          </p>

          <h2>Only need the words?</h2>
          <p>
            If you are copying text into an email or another document, skip Word entirely:{" "}
            <Link href="/pdf/pdf-to-text">PDF to Text</Link> gives you plain text page by page, with
            an option to join the PDF&apos;s line breaks back into flowing paragraphs. When you have
            finished editing, <Link href="/pdf/word-to-pdf">Word to PDF</Link> turns a text document
            back into a PDF; for a document with images or tables, export to PDF from your word
            processor instead so the layout is kept.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-sign-a-pdf-without-printing",
    topic: "PDF",
    title: "How to sign a PDF without printing it",
    seoTitle: "How to Sign a PDF Without Printing It",
    description:
      "Add your handwritten signature to a PDF on a phone or computer, without printing, scanning or uploading the document to a signing service.",
    published: PUBLISHED,
    updated: UPDATED,
    tools: ["pdf-signature", "pdf-flatten-form", "merge-pdf", "compress-pdf"],
    Body: function Body() {
      return (
        <>
          <p>
            Print, sign, scan, email: for a one-page form it is a remarkable amount of effort, and it
            usually produces a crooked, grey scan. You can put the same handwritten signature on the
            PDF directly.
          </p>

          <h2>Sign a PDF step by step</h2>
          <ol>
            <li>
              Open <Link href="/pdf/pdf-signature">Sign PDF</Link> and add your document.
            </li>
            <li>
              Draw your signature in the box. A finger on a phone or a stylus on a tablet looks the
              most natural; a mouse works too.
            </li>
            <li>Choose the page, then click the preview where the signature should go.</li>
            <li>Adjust the width, press Place signature, and download the signed PDF.</li>
          </ol>
          <p>
            The signature is saved with a transparent background, so it sits on the line like ink
            rather than as a white rectangle covering the text. To sign more than one page, download
            the signed file, load it again and place the next signature.
          </p>

          <h2>Getting a signature that looks right</h2>
          <ul>
            <li>
              <strong>Use the best input you have.</strong> A phone or tablet screen gives a far more
              natural line than a mouse or a laptop trackpad. If you are at a desk, it is often
              quicker to open the page on your phone and sign there.
            </li>
            <li>
              <strong>Sign big, then shrink.</strong> Draw the signature across most of the box. A
              large drawing scaled down looks smooth; a tiny one scaled up looks shaky.
            </li>
            <li>
              <strong>Set the width to match the line.</strong> The width is a share of the page
              width, so it stays in proportion on any paper size. A signature somewhere between a
              fifth and a third of the page width suits most forms — look at the space the form
              leaves and match it.
            </li>
            <li>
              <strong>Click on the line, not above it.</strong> Where you click on the preview is
              where the signature lands on the full-size page. If it is slightly off, place it again
              on a fresh copy rather than sending a signature that floats above the line.
            </li>
          </ul>

          <h2>Dates, initials and printed names</h2>
          <p>
            Forms often want more than a signature. Typed details such as a printed name or a date
            belong in the form&apos;s own fields where it has them — see the next section. Where it
            does not, remember that the signature box is simply a drawing area: you can write the
            date or your initials in it by hand and place them the same way, one pass for each. For
            a contract that needs initials on every page, that means one pass per page, so check how
            many are really required before you start.
          </p>

          <h2>If the PDF is a form</h2>
          <p>
            Fill in the fields first in your PDF reader, then run the file through{" "}
            <Link href="/pdf/pdf-flatten-form">Flatten PDF Form</Link> so the answers become a fixed
            part of the page. Sign the flattened copy last, so nothing can be changed after your
            signature is on it.
          </p>

          <h2>Is a drawn signature legally valid?</h2>
          <p>
            In many countries a drawn electronic signature is accepted for everyday agreements —
            rental forms, consent slips, delivery notes — but the rules depend on where you are and
            what you are signing. Some documents require a certificate-based digital signature, which
            proves who signed and that nothing changed afterwards. A drawn signature does not do
            that; it is the electronic equivalent of signing a printout. If a document says it needs
            a &ldquo;digital signature&rdquo;, ask the sender which kind they accept.
          </p>

          <h2>The kinds of electronic signature</h2>
          <p>
            The terms are used loosely, which causes most of the confusion. Broadly there are three
            levels:
          </p>
          <ul>
            <li>
              <strong>A simple electronic signature</strong> is any mark that shows you agreed: a
              drawn signature, a typed name, a ticked box. This is what a drawn signature on a PDF
              is.
            </li>
            <li>
              <strong>A signature from a signing service</strong> adds a record around the mark —
              who was emailed the document, when they opened it and when they signed. That audit
              trail is what makes it easier to prove later.
            </li>
            <li>
              <strong>A certificate-based digital signature</strong> uses cryptography to tie the
              document to a verified identity and to show if a single character changes afterwards.
              The European Union&apos;s eIDAS rules call the strictest form a qualified electronic
              signature and treat it as equivalent to a handwritten one.
            </li>
          </ul>
          <p>
            Laws such as the ESIGN Act in the United States and eIDAS in the EU give electronic
            signatures legal effect in general, while carving out exceptions — wills and some
            property and family documents commonly still need ink, witnesses or a notary. None of
            this is legal advice: if the document matters, ask the other party or a lawyer what form
            of signature they need.
          </p>

          <h2>Before you send it</h2>
          <ul>
            <li>
              <strong>Open the signed file and look at it</strong> at full size, on the page you
              signed. Check that the signature is where you meant and that nothing is covered.
            </li>
            <li>
              <strong>Keep an unsigned copy.</strong> If the other side sends a corrected version,
              you will want to sign that one fresh rather than reuse an old file.
            </li>
            <li>
              <strong>Send it only to the people who need it.</strong> A drawn signature is an
              image in the file, and anyone who has the file has a copy of that image.
            </li>
          </ul>

          <h2>Why sign in the browser</h2>
          <p>
            Many signing websites want your document and an account before they will do anything.
            Here the document and your signature stay in your browser and are gone when you close the
            tab — nothing is uploaded or stored. If the signed file needs to go out with other
            documents, <Link href="/pdf/merge-pdf">Merge PDF</Link> combines them. If the other party
            asks for a full audit trail or a certificate-based signature, that is the moment to use
            the signing service they name instead.
          </p>
        </>
      );
    },
  },
];
