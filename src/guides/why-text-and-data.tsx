import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-20";

export const whyTextAndDataGuides: Guide[] = [
  {
    slug: "unexpected-token-in-json-at-position-0",
    topic: "Web & developer",
    title: "“Unexpected token < in JSON at position 0”: what it means and how to fix it",
    seoTitle: "Unexpected Token < in JSON at Position 0: Fix",
    description:
      "This error means your code expected JSON but got HTML, usually an error page or a login redirect. How to see what really came back and fix the cause.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["json-validator", "json-formatter"],
    Body: function Body() {
      return (
        <>
          <p>
            “Unexpected token &lt; in JSON at position 0” means code tried to parse a response as JSON, but
            its first character was &lt;, the start of an HTML page. The server sent HTML instead, usually a
            404 or 500 error page, a login redirect or the site’s home page. Look at the raw response to see
            which.
          </p>

          <h2>Reading the error</h2>
          <p>
            JSON must start with <code>{"{"}</code>, <code>[</code>, a quote, a number, or true, false or
            null. “Position 0” is the first character. A &lt; there is almost always <code>&lt;!DOCTYPE
            html&gt;</code> or <code>&lt;html&gt;</code>. Newer browsers word the same failure differently,
            for example “Unexpected token &apos;&lt;&apos;, &quot;&lt;!DOCTYPE &quot;... is not valid JSON”. Related
            variants point to the same family of problems:
          </p>
          <ul>
            <li>
              <strong>Unexpected end of JSON input</strong> — the response was empty, often a 204 No Content
              or a failed request.
            </li>
            <li>
              <strong>Unexpected token u</strong> — the code parsed the text <code>undefined</code>, meaning a
              variable was never set.
            </li>
            <li>
              <strong>Unexpected token o</strong> — the code called JSON.parse on something that was already
              an object, which turns into the text <code>[object Object]</code>.
            </li>
          </ul>

          <h2>See what actually came back</h2>
          <ol>
            <li>Open the browser’s developer tools (F12) and the Network tab, then trigger the request again.</li>
            <li>Click the request. Check the status code and the Content-Type header.</li>
            <li>Open the Response tab. If it begins with &lt;!DOCTYPE html&gt;, read the page — it usually says what went wrong.</li>
          </ol>
          <p>
            In code, read the body as text first and log it before parsing, so the error tells you what you
            received instead of hiding it. Tools such as curl show the same raw response from the command line,
            outside the browser, which rules out browser extensions and cached pages.
          </p>

          <h2>The usual causes</h2>
          <ul>
            <li>
              <strong>Wrong URL.</strong> A typo, a missing <code>/api</code> prefix or a relative path resolved
              against the wrong page returns the site’s 404 page. Many single-page apps return their
              index.html for every unknown path, with status 200, which makes this hard to spot.
            </li>
            <li>
              <strong>Server error.</strong> The API crashed and the framework sent an HTML error page with
              status 500. Check the server logs.
            </li>
            <li>
              <strong>Not logged in, or session expired.</strong> The request was redirected to a login page.
              The status may be 200 after the redirect.
            </li>
            <li>
              <strong>Development proxy not set up.</strong> In local development the front-end server answers
              <code>/api/...</code> itself, with its own HTML, because the request never reached the API.
            </li>
            <li>
              <strong>A firewall, captive portal or maintenance page</strong> intercepted the request and
              returned its own HTML.
            </li>
          </ul>

          <h2>Fixing it properly</h2>
          <ol>
            <li>Fix the root cause above: the URL, the server error, the authentication or the proxy.</li>
            <li>
              Make the client check before parsing: confirm the response status is OK and that the
              Content-Type contains <code>application/json</code>. If not, show the status and the start of
              the body in the error message.
            </li>
            <li>
              Make the API return JSON errors, such as <code>{`{"error": "Not found"}`}</code> with status 404,
              rather than HTML pages, so clients can handle them.
            </li>
          </ol>

          <h2>When the JSON itself is broken</h2>
          <p>
            If the response really is JSON but parsing fails at a later position, the problem is in the data:
            a trailing comma, single quotes, a comment or an unescaped character. Paste the body into the{" "}
            <Link href="/developer/json-validator">JSON Validator</Link>, which explains the likely cause at the
            exact position, or the <Link href="/developer/json-formatter">JSON Formatter</Link> to indent it
            and see its structure. Both run in your browser, so API responses with real data stay private.
            For the full list of syntax errors, see{" "}
            <Link href="/guides/how-to-fix-invalid-json">how to fix invalid JSON</Link>.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Wrapping the parse in try/catch and ignoring the error, which hides the real failure.</li>
            <li>Assuming status 200 means JSON; redirects and catch-all routes return 200 HTML.</li>
            <li>Calling JSON.parse on data your HTTP library has already parsed.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Raw response inspected in the Network tab?</li>
            <li>Status code and Content-Type checked?</li>
            <li>URL, authentication and proxy correct?</li>
            <li>API returns JSON for errors too?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "fix-garbled-characters-in-text",
    topic: "Codes, passwords & text",
    title: "Why text shows â€™, Ã© or � instead of apostrophes and accents",
    seoTitle: "Why Text Shows â€™ or Ã© Instead of Characters",
    description:
      "Garbled characters like â€™ and Ã© appear when UTF-8 text is read with the wrong encoding. What causes it, how to fix the file, and how to stop it recurring.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["text-cleaner", "character-counter", "url-decoder"],
    Body: function Body() {
      return (
        <>
          <p>
            Sequences like â€™ or Ã© appear when text saved as UTF-8 is opened as an older encoding such as
            Windows-1252. Each accented letter or curly quote is stored as two or three bytes, and the wrong
            decoder shows each byte as its own character. The fix is to reopen the text as UTF-8, not to edit
            the symbols by hand.
          </p>

          <h2>What the garbage tells you</h2>
          <p>
            The pattern, sometimes called mojibake, is consistent enough to read backwards:
          </p>
          <ul>
            <li>
              <strong>â€™</strong> was a curly apostrophe (’). <strong>â€œ</strong> and <strong>â€</strong>{" "}
              were curly double quotes. <strong>â€“</strong> and <strong>â€”</strong> were dashes.
            </li>
            <li>
              <strong>Ã©</strong> was é, <strong>Ã¨</strong> was è, <strong>Ã¼</strong> was ü,{" "}
              <strong>Ã±</strong> was ñ.
            </li>
            <li>
              <strong>Â</strong> appearing before a space or symbol, as in “Â£” or “price:Â 10”, was a
              non-breaking space or a symbol like £.
            </li>
            <li>
              <strong>�</strong>, the replacement character, means the reader hit bytes that were not valid in
              the encoding it was using. That can mean the opposite mistake: older-encoded text opened as UTF-8.
            </li>
          </ul>

          <h2>Why one character becomes two or three</h2>
          <p>
            Older encodings such as Windows-1252 or ISO-8859-1 store every character in a single byte, which
            limits them to 256 characters. UTF-8 can store every character in every language by using one byte
            for plain English letters and two to four bytes for everything else. Plain ASCII text looks the same
            in both, which is why the problem hides until an apostrophe, a pound sign or a name like José
            appears. A program that wrongly assumes single bytes then prints each byte of é — C3 and A9 — as the
            two characters those bytes mean in its table: Ã and ©.
          </p>

          <h2>Where it happens</h2>
          <ul>
            <li>
              <strong>Opening a CSV in Excel</strong> by double-clicking. Excel may assume your system’s legacy
              encoding unless the file starts with a byte-order mark.
            </li>
            <li>
              <strong>Copying between systems</strong> — a database, an old CMS, an email template — where one
              side declares the wrong encoding.
            </li>
            <li>
              <strong>Web pages</strong> whose server or HTML declares one encoding while the file is saved in
              another.
            </li>
            <li>
              <strong>Text that was garbled twice</strong>, producing longer runs like Ã¢â‚¬â„¢. Each round
              of misreading adds a layer.
            </li>
          </ul>

          <h2>How to fix it</h2>
          <h3>Reopen with the right encoding</h3>
          <ul>
            <li>
              <strong>Excel:</strong> instead of double-clicking, use Data → From Text/CSV, and choose 65001:
              Unicode (UTF-8) as the file origin. The preview updates immediately.
            </li>
            <li>
              <strong>Text editors:</strong> most have a “Reopen with encoding” or “Encoding” menu. Choose UTF-8.
              Then save the file as UTF-8 so it stays fixed.
            </li>
            <li>
              <strong>Web pages you control:</strong> save files as UTF-8, put{" "}
              <code>&lt;meta charset=&quot;utf-8&quot;&gt;</code> near the top of the head, and make sure the server sends{" "}
              <code>charset=utf-8</code> in its Content-Type header.
            </li>
          </ul>
          <h3>If you only have the garbled text</h3>
          <p>
            When the original file is gone, a short find-and-replace for the patterns above repairs most
            English text: â€™ → ’, â€œ → “, Ã© → é and so on. Do the longest sequences first. Programmers
            can reverse it exactly by encoding the text back to Windows-1252 bytes and decoding those bytes as
            UTF-8.
          </p>
          <p>
            Afterwards, the <Link href="/text/text-cleaner">Text Cleaner</Link> can straighten the restored
            curly quotes into plain ones and strip leftover invisible characters such as stray non-breaking
            spaces, which is often the safest form for systems that mishandle encodings. The{" "}
            <Link href="/text/character-counter">Character Counter</Link> shows the byte count next to the
            character count — if a short line is far more bytes than characters, it still contains multi-byte
            characters.
          </p>

          <h2>A related case: %C3%A9 in web addresses</h2>
          <p>
            Text like <code>caf%C3%A9</code> is not garbled; it is the same UTF-8 bytes written as URL
            percent-escapes. The <Link href="/developer/url-decoder">URL Decoder</Link> turns it back into
            café.
          </p>

          <h2>Prevent it</h2>
          <ul>
            <li>Use UTF-8 everywhere: files, databases, HTML, email templates and exports.</li>
            <li>Import CSVs into Excel through Data → From Text/CSV, not by double-clicking.</li>
            <li>When pasting into old systems that cannot handle UTF-8, convert smart quotes to straight first.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Original file reopened as UTF-8, not edited by hand?</li>
            <li>Saved back as UTF-8?</li>
            <li>Encoding declared consistently by server, page and database?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "csv-opens-in-one-column-in-excel",
    topic: "Work & documents",
    title: "Why a CSV file opens in one column in Excel — and how to fix it",
    seoTitle: "Why a CSV Opens in One Column in Excel",
    description:
      "Everything lands in column A when Excel expects a different separator. Why commas and semicolons clash between regions, and three ways to split it properly.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["json-to-csv", "pdf-table-to-excel", "text-cleaner"],
    Body: function Body() {
      return (
        <>
          <p>
            A CSV opens in one column when Excel expects a different separator from the one the file uses.
            Where the comma is the decimal mark, Excel splits on semicolons, so a comma-separated file stays in
            column A. Import it with Data → From Text/CSV and choose the comma, or save the file with the
            separator your Excel expects.
          </p>

          <h2>Why the separator differs</h2>
          <p>
            “CSV” means comma-separated values, but there is no single rule. Excel follows your computer’s
            regional settings. Where numbers are written 1.234,56 — much of continental Europe and South
            America — the comma is needed for decimals, so the list separator is a semicolon. A file made with
            commas in the US or UK then looks like one long field per row to that Excel, and the reverse
            happens too.
          </p>

          <h2>Fix 1: import instead of double-clicking</h2>
          <ol>
            <li>Open a blank workbook.</li>
            <li>Go to Data → From Text/CSV and pick the file.</li>
            <li>In the preview, set Delimiter to Comma (or Semicolon, Tab — whatever the file uses).</li>
            <li>Set File origin to 65001: Unicode (UTF-8) if accents look wrong.</li>
            <li>Click Transform Data if you need to set column types (see below), otherwise Load.</li>
          </ol>
          <p>This leaves the file unchanged and does not touch your system settings.</p>

          <h2>Fix 2: Text to Columns on data already open</h2>
          <ol>
            <li>Select column A.</li>
            <li>Data → Text to Columns → Delimited.</li>
            <li>Tick the right separator and finish.</li>
          </ol>
          <p>
            This is quick, but it can split badly if values contain the separator inside quotes, and Excel may
            already have changed some values when it opened the file.
          </p>

          <h2>Fix 3: produce the file with the right separator</h2>
          <p>
            If you generate the file, give it the separator your readers’ Excel expects. The{" "}
            <Link href="/developer/json-to-csv">JSON to CSV</Link> converter offers comma, semicolon or tab,
            with semicolon labelled for European locales. Tab-separated files are a good neutral choice for
            data passed between countries, because tabs almost never appear inside values.
          </p>
          <p>
            A small trick for files you only open yourself: adding a first line that reads{" "}
            <code>sep=,</code> tells Excel which separator to use. Other programs will treat that line as data,
            so do not use it for files shared with other tools.
          </p>

          <h2>Other reasons columns go wrong</h2>
          <ul>
            <li>
              <strong>Values containing the separator</strong> must be wrapped in double quotes:{" "}
              <code>&quot;Smith, John&quot;</code>. Without quotes, the row splits in the wrong place and later columns
              shift.
            </li>
            <li>
              <strong>Line breaks inside a value</strong> must also be quoted, or one record becomes two rows.
            </li>
            <li>
              <strong>Text pasted from a PDF or web page</strong> may use runs of spaces instead of separators.
              Clean it first with the <Link href="/text/text-cleaner">Text Cleaner</Link>, or extract tables
              straight into a workbook with the{" "}
              <Link href="/pdf/pdf-table-to-excel">PDF Table Extractor</Link>, which writes an Excel file and
              avoids separators altogether.
            </li>
          </ul>

          <h2>Opening CSVs in Google Sheets or Numbers</h2>
          <p>
            Google Sheets’ File → Import detects the separator automatically and lets you override it, so a file
            that fails in Excel often opens correctly there. Apple Numbers also detects common separators. If
            a colleague’s file opens fine for them and not for you, the difference is almost always the
            regional setting, not the file.
          </p>

          <h2>Should you change your regional settings?</h2>
          <p>
            You can change Windows’ list separator, or turn off “Use system separators” in Excel’s advanced
            options, but that affects every file and every formula you type. It is better to import each file
            correctly than to change how your whole system reads numbers.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Find-and-replacing all commas with semicolons — it also breaks quoted text and decimals.</li>
            <li>Saving over the original after Excel has reformatted it.</li>
            <li>Sending a semicolon file to a system that expects commas, or the reverse.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Which separator does the file actually use? Open it in a text editor to see.</li>
            <li>Imported through Data → From Text/CSV with that separator?</li>
            <li>Values containing separators or line breaks quoted?</li>
          </ul>
          <p>
            Once the columns are right, Excel may still change the values themselves — see{" "}
            <Link href="/guides/stop-excel-changing-numbers-in-a-csv">how to stop Excel changing numbers to dates</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "stop-excel-changing-numbers-in-a-csv",
    topic: "Work & documents",
    title: "How to stop Excel turning numbers into dates and dropping leading zeros",
    seoTitle: "Stop Excel Changing Numbers to Dates in a CSV",
    description:
      "Excel turns 1-2 into 1 Feb, 00042 into 42 and long IDs into 1.23E+15. Why it guesses, which changes cannot be undone, and how to import a CSV as text.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["json-to-csv", "pdf-table-to-excel"],
    Body: function Body() {
      return (
        <>
          <p>
            Excel changes CSV values because it guesses each cell’s type when opening the file: 1-2 looks like
            a date, 00042 like the number 42, and a 16-digit ID like a huge number. Import the file with Data →
            From Text/CSV and set those columns to Text before loading. Double-clicking a CSV gives you no
            chance to do this.
          </p>

          <h2>What Excel changes, and what you lose</h2>
          <ul>
            <li>
              <strong>Dates from codes:</strong> part numbers like 1-2, 3/4 or MAR1 become dates. Gene names and
              product codes are famous victims. Once converted, the original text is gone from that cell.
            </li>
            <li>
              <strong>Leading zeros:</strong> postcodes, phone numbers and IDs such as 00042 become 42.
            </li>
            <li>
              <strong>Long numbers:</strong> card-style or account numbers longer than 15 digits are shown as
              1.23457E+15, and digits after the fifteenth are replaced with zeros, because Excel stores numbers
              with 15 significant digits. That damage cannot be undone by reformatting.
            </li>
            <li>
              <strong>Fractions and ratios:</strong> 1/2 can become a date; a score like 3-1 too.
            </li>
            <li>
              <strong>Decimal marks:</strong> in comma-decimal regions, 1.5 may be read as a date or as text.
            </li>
          </ul>
          <p>
            Reformatting a damaged cell as Text afterwards shows the converted value, not the original. The fix
            has to happen on the way in.
          </p>

          <h2>Import with the columns set to Text</h2>
          <ol>
            <li>In a blank workbook, go to Data → From Text/CSV and choose the file.</li>
            <li>Check the delimiter, then click Transform Data to open Power Query.</li>
            <li>
              Power Query adds a “Changed Type” step automatically. Delete that step, or select the sensitive
              columns and set Data Type to Text.
            </li>
            <li>Close &amp; Load. The values arrive exactly as written.</li>
          </ol>
          <p>
            In older Excel versions, the legacy Text Import Wizard (Data → Get External Data → From Text, or
            enabled under Options → Data) lets you mark each column as Text in step 3.
          </p>

          <h2>Recent Excel versions: turn off automatic conversion</h2>
          <p>
            Newer versions of Excel for Microsoft 365 have options under File → Options → Data → Automatic
            Data Conversion to stop removing leading zeros, stop converting long numbers to scientific
            notation, and stop converting text to dates. If your version has them, switching them off protects
            files you open by double-clicking too. Check whether your version includes these settings.
          </p>

          <h2>When you create the CSV</h2>
          <ul>
            <li>
              <strong>Keep a source of truth that is not the spreadsheet.</strong> Generate CSVs from the
              database or JSON, and treat Excel copies as views.{" "}
              <Link href="/developer/json-to-csv">JSON to CSV</Link> converts records without changing values.
            </li>
            <li>
              <strong>Prefer .xlsx for people who will use Excel.</strong> A workbook stores types explicitly, so
              a text cell stays text. Tables in PDFs can go straight to .xlsx with the{" "}
              <Link href="/pdf/pdf-table-to-excel">PDF Table Extractor</Link>.
            </li>
            <li>
              <strong>Use unambiguous formats</strong> for real dates: 2026-10-20 (ISO 8601) is read the same way
              everywhere, unlike 10/11/2026.
            </li>
            <li>
              <strong>Avoid tricks</strong> like adding an apostrophe or <code>=&quot;00042&quot;</code> to the CSV. They work in
              Excel but leave junk characters for every other program that reads the file.
            </li>
          </ul>

          <h2>Google Sheets does it too</h2>
          <p>
            Google Sheets also converts values on import unless you untick “Convert text to numbers, dates and
            formulas” in the File → Import dialog. LibreOffice Calc’s import dialog lets you set column types the
            same way as Excel’s. Whatever program you use, look for the import screen rather than opening the
            file directly.
          </p>

          <h2>Recovering a file that was saved over</h2>
          <p>
            If someone opened a CSV, Excel converted it, and it was saved, the converted values are now in the
            file. Leading zeros can sometimes be restored if every value had a fixed length (format the column
            as 00000), but dates from codes and truncated long numbers cannot be reconstructed. Go back to the
            original export.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Double-clicking CSVs that contain IDs, codes or phone numbers.</li>
            <li>Saving a CSV from Excel and sending it back into a system as if nothing changed.</li>
            <li>Storing phone numbers or IDs as numbers anywhere; they are text that happens to be digits.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Imported via Data → From Text/CSV?</li>
            <li>ID, code, postcode and phone columns set to Text?</li>
            <li>Original export kept untouched?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "word-count-differs-between-apps",
    topic: "Codes, passwords & text",
    title: "Why Word, Google Docs and online counters give different word counts",
    seoTitle: "Why Word Counts Differ Between Apps",
    description:
      "The same essay can show different word counts in Word, Google Docs and online tools. Hyphens, dashes, numbers, links and footnotes are counted differently.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["word-counter", "character-counter", "text-cleaner"],
    Body: function Body() {
      return (
        <>
          <p>
            Word counts differ because there is no universal definition of a word. Apps disagree on hyphenated
            words, words joined by dashes or slashes, numbers, links and symbols, and on whether footnotes,
            text boxes and headers count. For ordinary prose the gap is usually small. If a limit matters, use
            the counter your teacher, publisher or form uses.
          </p>

          <h2>Where the counts split</h2>
          <ul>
            <li>
              <strong>Dashes without spaces.</strong> “Results—though limited—were clear” is one long string
              to a counter that splits only on spaces, and five words to one that treats the dash as a break.
            </li>
            <li>
              <strong>Hyphens and slashes.</strong> “well-known” and “and/or” are one word to some counters and
              two to others.
            </li>
            <li>
              <strong>Numbers and symbols.</strong> “£1,200”, “3.5” and “&amp;” may count as words or be
              skipped.
            </li>
            <li>
              <strong>Links and email addresses.</strong> A URL can count as one word or be split at its dots
              and slashes into many.
            </li>
            <li>
              <strong>Footnotes, endnotes, text boxes, headers and captions.</strong> Microsoft Word’s Word
              Count dialog has a tick box to include text boxes, footnotes and endnotes; the figure in the
              status bar may differ from the dialog depending on that choice. Other apps make their own choices
              about what is in or out.
            </li>
            <li>
              <strong>Selected text.</strong> Many apps count only the selection if something is highlighted. A
              stray selection is a common reason for a surprisingly small count.
            </li>
            <li>
              <strong>Hidden characters.</strong> Text pasted from PDFs or the web can contain non-breaking
              spaces or zero-width characters that glue words together or split them.
            </li>
          </ul>

          <h2>How much can it differ?</h2>
          <p>
            In plain prose with few dashes, numbers or links, different counters usually land within a percent
            or two of each other. Technical writing, legal text full of section numbers, and reports with many
            URLs or footnotes can differ by much more. If you are within a few words of a hard limit, check in
            the tool that will be used to judge it.
          </p>

          <h2>Which count is “right”?</h2>
          <p>
            The one your reader uses. Universities and journals usually specify — often Microsoft Word, and
            often with rules about what is excluded, such as the reference list, title, tables or footnotes.
            If no rule is given, Word’s count is the most common reference. The{" "}
            <Link href="/text/word-counter">Word Counter</Link> on this site is built to match Microsoft Word
            for ordinary prose and runs in your browser, so you can paste a draft without uploading it. For
            what usually counts in an essay, see{" "}
            <Link href="/guides/what-counts-in-an-essay-word-count">what is included in an essay word count</Link>.
          </p>

          <h2>Making two counts agree</h2>
          <ol>
            <li>Make sure nothing is selected, then compare whole-document counts.</li>
            <li>Check whether footnotes, text boxes and headers are included in each.</li>
            <li>
              Paste the text into a plain-text tool after removing invisible characters with the{" "}
              <Link href="/text/text-cleaner">Text Cleaner</Link>; if the count jumps, hidden characters were
              the cause.
            </li>
            <li>Search the draft for em dashes and slashes without spaces; they account for many gaps.</li>
          </ol>

          <h2>An example</h2>
          <p>
            Take the sentence: “The 2025–26 results—see example.com/report—were well-known.” A counter that
            splits only on spaces sees five words, because “results—see” and “example.com/report—were” have no
            spaces. A counter that also splits on dashes and slashes may find nine or more. Neither is broken;
            they define a word differently. Add spaces around the dashes and most counters agree.
          </p>

          <h2>Character limits are another story</h2>
          <p>
            Forms and platforms that limit characters rather than words disagree even more, because emoji,
            accented letters and line breaks are counted differently. The{" "}
            <Link href="/text/character-counter">Character Counter</Link> shows characters with and without
            spaces, bytes, and what readers actually see as single characters.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Writing to the exact limit in one app and submitting in another.</li>
            <li>Joining words with dashes or slashes to squeeze under a limit; markers notice.</li>
            <li>Forgetting that the bibliography may or may not count.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Counted in the tool your reader uses?</li>
            <li>Inclusions and exclusions (footnotes, references, captions) confirmed?</li>
            <li>A margin of a few words left below a hard limit?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "ssl-certificate-name-mismatch-www",
    topic: "Web & developer",
    title: "Why a site shows a certificate name error on www or without it",
    seoTitle: "SSL Name Mismatch on www or Non-www: How to Fix",
    description:
      "A certificate covering example.com but not www.example.com (or the reverse) triggers a browser warning. How to confirm which names are covered and fix it.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["ssl-expiry-checker", "url-decoder"],
    Body: function Body() {
      return (
        <>
          <p>
            A certificate name error appears when the certificate does not list the exact address visitors
            typed. The classic case is a certificate for example.com but not www.example.com, or the reverse.
            Browsers show a warning such as NET::ERR_CERT_COMMON_NAME_INVALID. Reissue the certificate to
            cover both names, then redirect one to the other.
          </p>

          <h2>Why www and non-www are different</h2>
          <p>
            To a browser, example.com and www.example.com are two different host names. A certificate lists
            the names it is valid for, in a field called the Subject Alternative Name. If a visitor reaches a
            name not on that list, the browser cannot be sure it is talking to the right site and shows a
            warning — even if the certificate is valid and in date for the other name.
          </p>
          <p>
            Wildcards do not fully solve it either. A certificate for <code>*.example.com</code> covers
            www.example.com and shop.example.com, but not the bare example.com, and not deeper names like
            a.b.example.com.
          </p>

          <h2>Check which names are covered</h2>
          <ol>
            <li>
              Enter each form of the address — with and without www — in the{" "}
              <Link href="/developer/ssl-expiry-checker">SSL Certificate Checker</Link>.
            </li>
            <li>Look at “Name matches” and the list of names covered.</li>
            <li>Note the expiry date and whether the chain is trusted while you are there.</li>
          </ol>
          <p>
            The check runs on this site’s server, because browsers cannot read certificate details from
            another site; only the domain name is sent, and nothing is stored.
          </p>

          <h2>Common causes</h2>
          <ul>
            <li>
              <strong>The certificate was requested for one name only.</strong> Many hosting panels and
              certificate tools ask which names to include; it is easy to add just one.
            </li>
            <li>
              <strong>DNS points www somewhere else.</strong> If www is a CNAME to a different service, such as
              an old host or a page builder, that service presents its own certificate.
            </li>
            <li>
              <strong>A new domain was added without reissuing.</strong> Adding a domain or subdomain to a site
              does not add it to the existing certificate.
            </li>
            <li>
              <strong>A CDN or proxy</strong> in front of the site serves a different certificate from the one
              you installed on the server.
            </li>
            <li>
              <strong>Links to the wrong name.</strong> Old links, email signatures or printed material point to
              a name you never meant to serve.
            </li>
          </ul>

          <h2>How to fix it</h2>
          <ol>
            <li>
              Reissue the certificate with both names, for example example.com and www.example.com. Most
              automated certificate tools accept several names in one certificate.
            </li>
            <li>Make sure both names’ DNS records point at the same server or service.</li>
            <li>
              Choose one preferred address and send the other there with a permanent (301) redirect. The
              redirect only works after the certificate is valid for both, because the browser checks the
              certificate before it sees the redirect.
            </li>
            <li>Re-run the checker for both names, and test in a private browser window.</li>
          </ol>

          <h2>Subdomains and other names</h2>
          <p>
            The same rule applies to every name you serve: mail.example.com, shop.example.com, an old domain you
            redirect from, or a country domain. Each needs to be on a certificate, even if all it does is
            redirect. Make a list of every host name that appears in your DNS records and on printed material,
            and check each one. Names you no longer use are better removed from DNS than left pointing at a
            server with the wrong certificate.
          </p>

          <h2>Other errors that look similar</h2>
          <ul>
            <li>
              <strong>Expired certificate</strong> — NET::ERR_CERT_DATE_INVALID. Renew it; see{" "}
              <Link href="/guides/check-ssl-certificate-expiry">checking certificate expiry</Link>.
            </li>
            <li>
              <strong>Incomplete chain</strong> — some devices fail while others work. See{" "}
              <Link href="/guides/ssl-certificate-chain-incomplete">fixing an incomplete chain</Link>.
            </li>
            <li>
              <strong>Wrong clock</strong> on the visitor’s device makes valid certificates look expired or not
              yet valid.
            </li>
          </ul>
          <p>
            If a link that should work is malformed — for example with encoded characters in the host name —
            the <Link href="/developer/url-decoder">URL Decoder</Link> splits it into scheme, host and path so
            you can see exactly which host it points to.
          </p>

          <h2>Checklist</h2>
          <ul>
            <li>Both www and non-www listed on the certificate?</li>
            <li>Both names resolve to the same place?</li>
            <li>One permanent redirect to the preferred name?</li>
            <li>Checked with and without www after the change?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "link-breaks-when-pasted",
    topic: "Web & developer",
    title: "Why a link breaks when you paste it into an email, chat or document",
    seoTitle: "Why a Link Breaks When You Paste It",
    description:
      "Pasted links fail when trailing punctuation, spaces, line wraps or unencoded characters change the address. How to spot the cause and share links that work.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["url-encoder", "url-decoder", "utm-builder"],
    Body: function Body() {
      return (
        <>
          <p>
            A pasted link breaks when the app that turns it into a clickable link guesses wrongly where it
            ends. A trailing full stop or bracket gets included, a space or line break cuts it short, or
            characters like spaces and accents are not encoded. Encode the address properly and keep
            punctuation away from its end.
          </p>

          <h2>The usual culprits</h2>
          <ul>
            <li>
              <strong>Punctuation at the end.</strong> “See example.com/page.” — some apps include the full
              stop, and example.com/page. is a different address. Closing brackets cause the same problem, and
              some apps cut off brackets that belong to the link, as in Wikipedia-style addresses.
            </li>
            <li>
              <strong>Spaces.</strong> Links with spaces, such as file paths from shared drives, stop at the
              first space. Spaces must be encoded as %20.
            </li>
            <li>
              <strong>Line wrapping.</strong> Plain-text emails and some document exports wrap long lines,
              splitting a link in two. Only the first half becomes clickable.
            </li>
            <li>
              <strong>Smart quotes and dashes.</strong> Word processors may turn a hyphen into a dash or straight
              quotes into curly ones inside a link, producing an address that does not exist.
            </li>
            <li>
              <strong>Characters with special meaning.</strong> # starts a fragment, ? starts the query, &amp;
              separates parameters, + can mean a space. If they are part of a value — say a search for “C#” —
              they must be encoded.
            </li>
            <li>
              <strong>Tracking or safe-link rewriting.</strong> Some email systems rewrite links through their
              own scanning service, and expired rewritten links stop working.
            </li>
          </ul>

          <h2>How to diagnose a broken link</h2>
          <ol>
            <li>Hover over or long-press the link to see the full address the app actually used.</li>
            <li>Compare it with the original: look at the very end, and at any space or symbol.</li>
            <li>
              Paste it into the <Link href="/developer/url-decoder">URL Decoder</Link>, which shows the host,
              path and every query parameter separately, so a truncated value or a stray character stands
              out. If % signs remain after decoding, the link was encoded twice.
            </li>
          </ol>

          <h2>How to share links that survive</h2>
          <ul>
            <li>
              <strong>Encode it.</strong> The <Link href="/developer/url-encoder">URL Encoder</Link> turns
              spaces into %20 and accented characters into UTF-8 escapes while leaving the structure of the
              address alone. Use component mode for a single value going inside a query parameter.
            </li>
            <li>
              <strong>Put the link on its own line</strong>, or wrap it in angle brackets, such as
              &lt;https://example.com/page&gt;, a long-standing convention in plain-text email.
            </li>
            <li>
              <strong>Use link text in rich editors.</strong> Inserting a link behind words avoids wrapping and
              punctuation problems entirely.
            </li>
            <li>
              <strong>Keep it short.</strong> Remove tracking parameters you did not add yourself. When you do
              want campaign tags, build them with the <Link href="/generators/utm-builder">UTM Link Builder</Link>{" "}
              so each value is encoded correctly.
            </li>
            <li>
              <strong>Always include https://</strong>. Without it, some apps do not recognise the text as a
              link at all.
            </li>
          </ul>

          <h2>Links to files on shared drives</h2>
          <p>
            Copied file paths such as <code>\\server\Shared Files\Report.xlsx</code> or a local{" "}
            <code>C:\</code> path work only for people with access to that drive, and they contain spaces and
            backslashes that most apps will not recognise as a link. Share the cloud storage link instead, set
            to the right access level, and check it from an account that is not yours.
          </p>

          <h2>Links in PDFs and printed material</h2>
          <p>
            PDFs made from documents keep links clickable only if the export supports it, and long links can
            still break across lines on the page. For print, use a short, memorable address that redirects to
            the long one, or a QR code. Test by clicking every link in the exported file, not in the source
            document.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Typing links by hand in a word processor with autocorrect on.</li>
            <li>Encoding an already encoded link, which turns %20 into %2520.</li>
            <li>Ending a sentence with a bare link followed by a full stop in plain-text email.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Starts with https:// and contains no raw spaces?</li>
            <li>No punctuation stuck to the end?</li>
            <li>Special characters inside values encoded once, not twice?</li>
            <li>Clicked and tested in the final format — email, PDF or chat?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "site-rejects-strong-password",
    topic: "Codes, passwords & text",
    title: "Why a website rejects your strong password",
    seoTitle: "Why a Website Rejects Your Strong Password",
    description:
      "Long random passwords can still fail a site's rules: maximum lengths, banned symbols, required character types or breach checks. How to find the rule.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["password-generator", "password-strength-checker"],
    Body: function Body() {
      return (
        <>
          <p>
            A site can reject a strong password because its rules are about format, not strength. Common
            reasons are a maximum length, symbols it does not allow, a missing required character type, or a
            match against lists of leaked passwords. Read the exact rule, then generate a password that fits
            it instead of weakening yours by guesswork.
          </p>

          <h2>The rules that trip people up</h2>
          <ul>
            <li>
              <strong>Maximum length.</strong> Some sites cap passwords at 16, 20 or 32 characters. A 30-character
              password from a manager fails without a clear message.
            </li>
            <li>
              <strong>Allowed symbols.</strong> Systems may refuse quotes, angle brackets, spaces, backslashes or
              anything outside a short list such as ! @ # $ %.
            </li>
            <li>
              <strong>Required character types.</strong> “At least one upper-case letter, one number and one
              symbol”. A long random password can, by chance, lack one of them.
            </li>
            <li>
              <strong>Starting or ending rules.</strong> Some systems refuse a password that starts with a symbol
              or a number, or ends with a space.
            </li>
            <li>
              <strong>Breached password checks.</strong> Some sites compare new passwords against lists of
              passwords exposed in data breaches. Anything found is rejected, however complex it looks.
            </li>
            <li>
              <strong>Similarity checks.</strong> Passwords containing your name, email or username, or too
              close to the previous one, can be refused.
            </li>
            <li>
              <strong>Silent truncation.</strong> The worst case: an older system quietly cuts the password at a
              fixed length when you set it, then compares the full version at login. If a new password works
              once and then fails, try only its first part to confirm, then change it to one under the limit.
            </li>
          </ul>

          <h2>Find the rule</h2>
          <ol>
            <li>Look under the password box for the full rule list; some forms show it only after an error.</li>
            <li>Check the site’s help pages for “password requirements”.</li>
            <li>
              If there is no information, test methodically: try 16 characters of letters and numbers only. If
              that works, add symbols; if it does not, the issue is length or a required type.
            </li>
          </ol>

          <h2>Generate a password that fits</h2>
          <p>
            The <Link href="/generators/password-generator">Password Generator</Link> lets you set the length and
            switch off symbols, numbers or either case, or exclude look-alike characters. Passwords are made by
            your browser’s cryptographic random number generator and never sent anywhere. If symbols are
            restricted, make up for it with length: 20 random letters and digits are far stronger than 12
            characters with a symbol.
          </p>
          <p>
            If a site insists on at least one of each type and the generated password lacks one, generate
            again rather than editing it by hand — your edits are less random than the generator.
          </p>

          <h2>Check strength honestly</h2>
          <p>
            A site’s green bar measures its own rules. The{" "}
            <Link href="/developer/password-strength-checker">Password Strength Checker</Link> estimates how long
            a password would take to crack and flags patterns such as dictionary words, dates and keyboard runs.
            It runs in your browser and does not send the password anywhere, which also means it does not check
            breach lists.
          </p>

          <h2>When the error message is vague</h2>
          <p>
            “Invalid password” without detail often means a rule the form does not show. Paste the password into
            a plain text field first to check that the password manager or clipboard did not add a trailing
            space or line break, a frequent invisible cause. If you are changing a password, also check the new
            one was not used recently on the same account; many systems refuse reuse.
          </p>

          <h2>What not to do</h2>
          <ul>
            <li>Shortening a strong password to a memorable word plus “1!” to get past the rules.</li>
            <li>Reusing a password that another site accepted.</li>
            <li>Emailing yourself the password to “remember” it; use a password manager.</li>
          </ul>

          <h2>A note on passphrases</h2>
          <p>
            Several random words — for example four or five chosen by a generator — are easy to type and strong.
            Many sites accept them; if spaces are refused, join the words with hyphens. If a maximum length makes
            a passphrase impossible, switch to a random character password at the maximum length allowed.
          </p>

          <h2>Checklist</h2>
          <ul>
            <li>Full password rules read, including maximum length?</li>
            <li>Generated, not edited by hand?</li>
            <li>Unique to this site and stored in a password manager?</li>
            <li>Tested by logging out and in again straight away?</li>
          </ul>
        </>
      );
    },
  },
];
