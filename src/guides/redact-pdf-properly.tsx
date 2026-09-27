import Link from "next/link";

import type { Guide } from "./index";

function Body() {
  return (
    <>
      <p>
        Every few months a court filing, a government report or a company document leaks the very
        details it was meant to hide. Nobody hacked anything. Someone drew black boxes over the
        names, saved the PDF, and sent it out — and the names were still in the file, one copy and
        paste away. This guide explains why that happens, where hidden text survives, and how to
        redact a PDF so the words are actually gone.
      </p>

      <h2>Why a black box is not redaction</h2>
      <p>
        A PDF page is built in layers. The text is stored as real characters, and anything you draw
        on top — a black rectangle, a black highlight, a shape added in Word before exporting — is a
        separate object sitting above them. It hides the words from your eyes, but not from the
        file. Anyone who opens it can:
      </p>
      <ul>
        <li>select the text under the box and paste it somewhere else;</li>
        <li>search the document with Ctrl+F and land on the “hidden” word;</li>
        <li>delete or move the rectangle in any PDF editor;</li>
        <li>run the file through a text extractor, which ignores the box completely.</li>
      </ul>
      <p>
        Turning the text white, shrinking it or covering it with an image fails for the same reason:
        the characters are still stored in the page.
      </p>

      <h2>Where else the text hides</h2>
      <p>
        Removing the visible words is only part of the job. Before you send a redacted document,
        think about these places too:
      </p>
      <ul>
        <li>
          <strong>Other pages.</strong> A name you blacked out on page 1 may appear again in a header,
          a signature block or an appendix.
        </li>
        <li>
          <strong>Scanned pages with OCR.</strong> A scan that has been made searchable carries an
          invisible text layer behind the picture. Blacking out the picture leaves that layer intact.
        </li>
        <li>
          <strong>Comments and form fields.</strong> Sticky notes, review comments and the values
          typed into fillable fields are stored separately from the page text.
        </li>
        <li>
          <strong>Document properties.</strong> The title, author and subject fields often contain a
          client name or a case number.
        </li>
        <li>
          <strong>Earlier versions inside the file.</strong> Many editors save changes by appending
          them to the end of the PDF, so the previous version can still be recovered from the same
          file.
        </li>
        <li>
          <strong>The file name.</strong> “Smith-divorce-settlement-final.pdf” gives away what the
          redactions were hiding.
        </li>
      </ul>

      <h2>How to redact a PDF properly, step by step</h2>
      <p>
        Proper redaction removes the content itself rather than covering it. The{" "}
        <Link href="/pdf/pdf-redact">Redact PDF</Link> tool does this by rebuilding each page you mark:
        it renders the page to a picture, paints the marked areas solid black on that picture, and
        puts the picture in place of the original page. The characters under your marks are never
        written into the new file, so there is nothing left to select or copy. It runs in your
        browser, so the document is not uploaded anywhere.
      </p>
      <ol>
        <li>
          <strong>Find every occurrence first.</strong> Open the original and search it with Ctrl+F
          for each name, number or phrase you need to remove, and note the pages. For a long document,
          the <Link href="/pdf/pdf-to-text">PDF to Text</Link> tool gives you the full text to search
          through.
        </li>
        <li>
          <strong>Flatten fillable forms.</strong> If the document has form fields, run it through{" "}
          <Link href="/pdf/pdf-flatten-form">Flatten PDF Form</Link> first, so the typed values
          become part of the page and are redacted along with it.
        </li>
        <li>
          <strong>Mark the areas.</strong> Add the file to <Link href="/pdf/pdf-redact">Redact PDF</Link>,
          pick a page, and drag across everything that must go. Repeat for every page on your list;
          the page list shows how many areas each page has.
        </li>
        <li>
          <strong>Apply and download.</strong> Press Apply redactions. You get a new file, and the
          original on your computer is left unchanged.
        </li>
        <li>
          <strong>Give it a neutral file name</strong> before you send it.
        </li>
      </ol>
      <p>
        If whole pages should not be shared at all, remove them with{" "}
        <Link href="/pdf/delete-pdf-pages">Delete PDF Pages</Link> instead of blacking out every line.
      </p>

      <h2>How to check the redaction worked</h2>
      <p>Never send a redacted file without testing it. Open the new copy — not the original — and:</p>
      <ol>
        <li>Search it with Ctrl+F for each word you removed. There should be no matches.</li>
        <li>
          Try to select text on a redacted page. A properly redacted page is a picture, so nothing
          highlights.
        </li>
        <li>
          Run it through <Link href="/pdf/pdf-to-text">PDF to Text</Link> and search the result. This
          catches text that a viewer might not show you.
        </li>
        <li>
          Open the document properties — or the{" "}
          <Link href="/pdf/pdf-metadata-editor">PDF Metadata Editor</Link> — and make sure the title,
          author and subject fields give nothing away.
        </li>
      </ol>

      <h2>What proper redaction costs</h2>
      <p>
        Because each marked page becomes a picture, you cannot search or select text on those pages
        any more, and they take up more space than text does. Pages you did not mark are copied across
        unchanged and stay searchable, so the cost is limited to the pages that needed it. If the
        finished file is too large to email, <Link href="/pdf/compress-pdf">Compress PDF</Link> can
        bring it down.
      </p>
      <p>
        Desktop software can do the same job. Adobe Acrobat Pro, for example, has a dedicated Redact
        tool that removes the marked content rather than covering it. Whatever you use, the test is
        the same: search the finished file for the words you removed, and trust the result of that
        search rather than what the page looks like.
      </p>

      <h2>A quick checklist</h2>
      <ul>
        <li>Every occurrence found — on every page, including headers and appendices.</li>
        <li>Form fields flattened before redacting.</li>
        <li>Redactions applied with a tool that removes content, not one that draws boxes.</li>
        <li>Finished file searched with Ctrl+F and run through a text extractor.</li>
        <li>Document properties checked.</li>
        <li>File renamed to something neutral.</li>
      </ul>
    </>
  );
}

export const redactPdfProperly: Guide = {
  slug: "how-to-redact-a-pdf",
  topic: "PDF",
  title: "How to redact a PDF properly — and why black boxes don’t work",
  seoTitle: "How to Redact a PDF Properly (Black Boxes Fail)",
  description:
    "Black boxes don't remove text from a PDF. Learn where hidden text survives, how to redact a PDF so the words are really gone, and how to check it worked.",
  published: "2026-09-27",
  updated: "2026-09-27",
  tools: ["pdf-redact", "pdf-to-text", "pdf-flatten-form", "pdf-metadata-editor", "delete-pdf-pages"],
  Body,
};
