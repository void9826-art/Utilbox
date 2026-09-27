import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-09-27";

export const pdfGuides: Guide[] = [
  {
    slug: "how-to-merge-pdf-files",
    topic: "PDF",
    title: "How to merge PDF files into one — without uploading them",
    seoTitle: "How to Merge PDF Files Into One (No Upload)",
    description:
      "Combine several PDFs into one document in the order you want, keep full quality, and avoid sending private files to an upload site.",
    published: PUBLISHED,
    updated: PUBLISHED,
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
    updated: PUBLISHED,
    tools: ["compress-pdf", "delete-pdf-pages", "split-pdf", "compress-image"],
    Body: function Body() {
      return (
        <>
          <p>
            Most email services cap attachments at around 20–25 MB, and many upload forms allow far
            less. When a PDF is too big, the fix depends on what is making it big — and for most
            large PDFs, that is pictures.
          </p>

          <h2>What makes a PDF large</h2>
          <p>
            Text is tiny: a hundred pages of plain text is usually well under a megabyte. The weight
            comes from images — scanned pages, photographs, high-resolution graphics. A document
            scanned at high quality stores every page as a detailed picture, which is why a
            twenty-page scan can be larger than a thousand-page novel.
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
    updated: PUBLISHED,
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

          <h2>Extracting also reorders</h2>
          <p>
            Extract PDF Pages copies pages in the order you list them. Typing <code>5, 1, 3</code>{" "}
            produces a new document in exactly that order, which makes it a quick way to pull a
            summary page to the front.
          </p>

          <h2>Does splitting reduce quality?</h2>
          <p>
            No. Pages are copied, not re-drawn, so text stays selectable and images are untouched.
            Your original file is only read, never changed, and it is not uploaded anywhere — the
            splitting happens in your browser. If you later need the pieces back together,{" "}
            <Link href="/pdf/merge-pdf">Merge PDF</Link> recombines them.
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
    updated: PUBLISHED,
    tools: ["pdf-to-word", "pdf-to-text", "image-to-text", "word-to-pdf"],
    Body: function Body() {
      return (
        <>
          <p>
            You have a PDF and you need to change it: fix a typo in a letter, reuse a paragraph, fill
            in a form that was never meant to be filled. Converting it to Word is the usual answer,
            and it works well — as long as you know what a PDF can and cannot give back.
          </p>

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
            for that job.
          </p>

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

          <h2>Only need the words?</h2>
          <p>
            If you are copying text into an email or another document, skip Word entirely:{" "}
            <Link href="/pdf/pdf-to-text">PDF to Text</Link> gives you plain text page by page. When
            you have finished editing, <Link href="/pdf/word-to-pdf">Word to PDF</Link> turns the
            document back into a PDF.
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
    updated: PUBLISHED,
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

          <h2>Why sign in the browser</h2>
          <p>
            Many signing websites want your document and an account before they will do anything.
            Here the document and your signature stay in your browser and are gone when you close the
            tab — nothing is uploaded or stored. If the signed file needs to go out with other
            documents, <Link href="/pdf/merge-pdf">Merge PDF</Link> combines them.
          </p>
        </>
      );
    },
  },
];
