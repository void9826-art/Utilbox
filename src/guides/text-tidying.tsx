import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-02";

export const textTidyingGuides: Guide[] = [
  {
    slug: "title-case-rules",
    topic: "Codes, passwords & text",
    title: "Title case rules: which words to capitalise in a headline",
    seoTitle: "Title Case Rules: Which Words to Capitalise",
    description:
      "How title case works, which small words stay lowercase, how AP, APA and Chicago styles differ, and when sentence case is the better choice.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["case-converter", "word-counter", "text-cleaner"],
    Body: function Body() {
      return (
        <>
          <p>
            &ldquo;The Rise And Fall Of The House&rdquo; looks wrong to most readers, and &ldquo;The Rise
            and Fall of the House&rdquo; looks right. The difference is title case, which capitalises the
            important words of a heading and leaves the small ones alone.
          </p>

          <h2>The basic rules</h2>
          <ul>
            <li>Capitalise the first and last word, whatever they are.</li>
            <li>Capitalise nouns, verbs, adjectives, adverbs and pronouns.</li>
            <li>
              Lowercase short articles (a, an, the), short conjunctions (and, but, or, nor) and short
              prepositions (in, on, at, of, to, by, for) — unless they are the first or last word.
            </li>
          </ul>
          <p>
            So: &ldquo;How to Fill In a Form&rdquo;, &ldquo;A Guide to the Stars&rdquo;, &ldquo;What Is It
            For?&rdquo; — note that &ldquo;Is&rdquo; is a verb and &ldquo;For&rdquo; is the last word, so
            both are capitalised.
          </p>

          <h2>Where style guides disagree</h2>
          <p>The main difference is how they treat longer small words:</p>
          <ul>
            <li>
              <strong>Chicago style</strong> lowercases prepositions whatever their length: &ldquo;Walking
              through the Woods&rdquo;.
            </li>
            <li>
              <strong>AP and APA styles</strong> capitalise words of four letters or more, including
              prepositions: &ldquo;Walking Through the Woods&rdquo;.
            </li>
          </ul>
          <p>
            Neither is wrong. Pick the style your publication, school or company uses and apply it
            consistently; inconsistency is what readers notice.
          </p>

          <h2>Convert text step by step</h2>
          <ol>
            <li>
              Paste your headline or list of headings into the{" "}
              <Link href="/text/case-converter">Case Converter</Link>.
            </li>
            <li>Choose Title Case. The result appears immediately.</li>
            <li>Read it through and adjust any words the rules cannot know about.</li>
            <li>Copy the result.</li>
          </ol>
          <p>
            Title case here follows publishing convention using a standard list of minor words, so you get
            &ldquo;The Rise and Fall of the House&rdquo; rather than capitalising every word. The text is
            converted in your browser and not sent anywhere.
          </p>

          <h2>What to check by hand</h2>
          <ul>
            <li>
              <strong>Names and brands</strong> with unusual capitals, such as iPhone or eBay.
            </li>
            <li>
              <strong>Acronyms</strong> such as NASA, PDF or UK, which should stay in capitals.
            </li>
            <li>
              <strong>Words that change role.</strong> &ldquo;Up&rdquo; is capitalised in &ldquo;Set Up
              Your Account&rdquo;, where it is part of the verb, but often lowercase as a preposition.
            </li>
            <li>
              <strong>Hyphenated words</strong>, where styles differ on capitalising the second part.
            </li>
          </ul>

          <h2>Title case or sentence case?</h2>
          <p>
            Sentence case capitalises only the first word and proper nouns: &ldquo;The rise and fall of the
            house&rdquo;. Many websites, apps and news organisations now prefer it for headings, because it
            is easier to read, avoids style-guide arguments and is easier to apply consistently. Title case
            remains standard for book titles, many academic references and some publications. Whichever you
            choose, use it throughout.
          </p>

          <h2>Other cases</h2>
          <p>
            The same converter switches between twelve cases, including UPPER, lower and sentence case for
            prose, and camelCase, PascalCase, snake_case and kebab-case for code. Sentence case is the
            quickest fix for text that arrived in all capitals.
          </p>

          <h2>Headline length</h2>
          <p>
            Headlines for web pages and articles are best kept short enough to show in full in search
            results — roughly 50–60 characters. The <Link href="/text/word-counter">Word Counter</Link>{" "}
            counts characters as well as words.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-remove-duplicate-lines",
    topic: "Codes, passwords & text",
    title: "How to remove duplicate lines from a list",
    seoTitle: "How to Remove Duplicate Lines From a List",
    description:
      "Clean duplicates out of email lists, product codes and copied data, keep the original order, catch near-duplicates, and find out which lines were repeated.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["remove-duplicate-lines", "sort-lines", "text-cleaner"],
    Body: function Body() {
      return (
        <>
          <p>
            Merge two contact lists, paste a column from a spreadsheet, or combine exports from several
            systems, and duplicates appear. Removing them by eye is slow and unreliable in a list of a few
            hundred lines. A deduplication tool does it in a moment — if you set it up for the kind of
            duplicates your list actually contains.
          </p>

          <h2>Remove duplicates step by step</h2>
          <ol>
            <li>
              Paste the list into <Link href="/text/remove-duplicate-lines">Remove Duplicate Lines</Link>,
              one item per line.
            </li>
            <li>Decide whether capital letters and surrounding spaces should matter.</li>
            <li>Keep unique lines, or invert the mode to see only the lines that were repeated.</li>
            <li>Copy the cleaned list. The tool tells you how many lines were removed.</li>
          </ol>
          <p>
            The first occurrence of each line stays where it was, so the list keeps its original order.
            Even very long lists are handled quickly, and the text never leaves your browser.
          </p>

          <h2>A worked example</h2>
          <p>Take a list of six lines pasted from two sign-up sheets:</p>
          <ul>
            <li>Ann Lee</li>
            <li>Ravi Shah</li>
            <li>ann lee</li>
            <li>Tom Burke </li>
            <li>Tom Burke</li>
            <li>Ravi Shah</li>
          </ul>
          <p>
            With default settings only the exact repeat of &ldquo;Ravi Shah&rdquo; is removed: five lines
            remain. Turn off case sensitivity and &ldquo;ann lee&rdquo; goes too. Turn on whitespace trimming
            and the second &ldquo;Tom Burke&rdquo;, which had a trailing space, goes as well. Three lines
            remain — Ann Lee, Ravi Shah and Tom Burke — in their original order.
          </p>

          <h2>Near-duplicates: the real problem</h2>
          <p>Lines that look identical to a person often differ to a computer:</p>
          <ul>
            <li>
              <strong>Capital letters.</strong> &ldquo;Apple&rdquo; and &ldquo;apple&rdquo;. Turn off case
              sensitivity for names, email addresses and most everyday lists.
            </li>
            <li>
              <strong>Trailing spaces.</strong> Extremely common in data pasted from spreadsheets, and
              invisible. Turn on whitespace trimming.
            </li>
            <li>
              <strong>Invisible characters</strong> such as non-breaking or zero-width spaces, which arrive
              from web pages and documents. Run the list through{" "}
              <Link href="/text/text-cleaner">Text Cleaner</Link> first if duplicates survive that should
              not.
            </li>
          </ul>

          <h2>Find the duplicates instead</h2>
          <p>
            Sometimes the useful question is not &ldquo;give me a clean list&rdquo; but &ldquo;which items
            were entered twice?&rdquo; — a double booking, a product listed under two codes, a person who
            signed up twice. Inverting the mode shows only the lines that appeared more than once, with
            their counts.
          </p>

          <h2>Email lists</h2>
          <p>
            For mailing lists, turn off case sensitivity and turn on trimming, so &ldquo;Ann@Example.com
            &rdquo; and &ldquo;ann@example.com&rdquo; count as the same address. Note that addresses which
            differ in other ways — a plus tag such as ann+news@example.com — are different text, and a
            deduplication tool rightly keeps both.
          </p>

          <h2>Sorting afterwards</h2>
          <p>
            Deduplication keeps the original order. If you want the result alphabetical or numeric, run it
            through <Link href="/text/sort-lines">Sort Lines</Link> afterwards. Doing it in that order
            keeps the first occurrence of each line — useful when the order means something, such as the
            date people signed up.
          </p>

          <h2>Spreadsheets and databases</h2>
          <p>
            Spreadsheets have their own remove-duplicates command, which works on whole rows or chosen
            columns. Use that when the data has several columns and a row only counts as a duplicate if
            several fields match. A line-based tool is quicker for a single column you have just copied,
            and shows you exactly what it removed.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-sort-a-list-naturally",
    topic: "Codes, passwords & text",
    title: "How to sort a list properly — and why item10 comes before item2",
    seoTitle: "How to Sort a List: Alphabetical and Natural Order",
    description:
      "Sort lines alphabetically, numerically or by length, fix the item10-before-item2 problem with natural sorting, handle accents, and shuffle a list fairly.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["sort-lines", "remove-duplicate-lines", "random-number-generator"],
    Body: function Body() {
      return (
        <>
          <p>
            Sorting looks like the simplest thing a computer does, until a list of files comes out as
            file1, file10, file11, file2. The computer is not wrong — it is sorting a different way from
            the one you meant.
          </p>

          <h2>Sort a list step by step</h2>
          <ol>
            <li>
              Paste the lines into <Link href="/text/sort-lines">Sort Lines</Link>.
            </li>
            <li>Choose a method: alphabetical, numeric, by length, or random.</li>
            <li>Choose the direction — A to Z or Z to A, smallest or largest first.</li>
            <li>Turn on natural sorting if the lines contain numbers, then copy the result.</li>
          </ol>
          <p>The text is sorted in your browser and never sent anywhere.</p>

          <h2>Why item10 comes before item2</h2>
          <p>
            A plain alphabetical sort compares text character by character. &ldquo;item10&rdquo; and
            &ldquo;item2&rdquo; match up to &ldquo;item&rdquo;, then compare &ldquo;1&rdquo; with
            &ldquo;2&rdquo;. Since 1 comes before 2, item10 wins — the computer never looks at the number as
            a whole.
          </p>
          <p>
            Natural sorting reads runs of digits as numbers, so the order becomes item2, item10, item100 —
            the order a person would use. Turn it on for file names, version numbers, chapter titles, house
            numbers and anything else that mixes words and numbers.
          </p>

          <h2>Numeric sorting</h2>
          <p>
            For a list of plain numbers, numeric mode sorts by value: 9 before 10 before 100. Alphabetical
            mode would give 10, 100, 9. If a list contains currency symbols or units, the numbers may not be
            recognised; strip them first, or use natural sorting.
          </p>

          <h2>Accents and other languages</h2>
          <p>
            Alphabetical sorting here uses your browser&apos;s language-aware comparison, so &ldquo;é&rdquo;
            sorts next to &ldquo;e&rdquo; rather than after &ldquo;z&rdquo;, as a plain byte comparison would
            put it. Names such as Émile and Eva end up where a reader expects them.
          </p>

          <h2>Sorting dates</h2>
          <p>
            Dates written as text sort badly. 01/03/2026, 15/02/2026 and 28/12/2025 sort by day first, which
            mixes up months and years. The fix is to write dates in year-month-day order, as in the ISO 8601
            format: 2025-12-28, 2026-02-15, 2026-03-01. Dates in that form sort correctly with a plain
            alphabetical sort, which is why it is used for file names, logs and spreadsheets that will be
            sorted.
          </p>

          <h2>Sorting by length</h2>
          <p>
            Ordering lines from shortest to longest is handy for spotting outliers — a product code that is
            too long, an empty or truncated entry — and for laying out lists of keywords or tags.
          </p>

          <h2>Shuffling fairly</h2>
          <p>
            The random option puts the lines in a random order using a method that gives every possible
            order an equal chance, driven by your browser&apos;s cryptographic random numbers. The common
            shortcut of sorting by a random key does not do that. Use it for seating plans, presentation
            orders or a fair running order. For picking winners by number, see the{" "}
            <Link href="/generators/random-number-generator">Random Number Generator</Link>.
          </p>

          <h2>Tidy first</h2>
          <ul>
            <li>
              Remove duplicates with <Link href="/text/remove-duplicate-lines">Remove Duplicate Lines</Link>{" "}
              if the list may contain repeats.
            </li>
            <li>Watch for leading spaces, which make a line sort before everything else.</li>
            <li>Decide whether &ldquo;The Beatles&rdquo; should sort under T or B; computers sort under T.</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "fix-text-copied-from-a-pdf",
    topic: "Codes, passwords & text",
    title: "How to fix text copied from a PDF: broken lines, odd spaces and quotes",
    seoTitle: "How to Fix Text Copied From a PDF",
    description:
      "Text pasted from a PDF or web page arrives with a break after every line, strange spaces and curly quotes. Here is why, and how to clean it in seconds.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["text-cleaner", "pdf-to-text", "character-counter"],
    Body: function Body() {
      return (
        <>
          <p>
            Copy a paragraph out of a PDF and paste it into an email, and it arrives as a column of short
            lines, each ending where the line ended on the page. Text from web pages and word processors
            brings its own invisible extras. None of this is visible until it causes trouble.
          </p>

          <h2>Why PDF text breaks into lines</h2>
          <p>
            A PDF does not store paragraphs. It stores lines of text at fixed positions on the page, so
            copying gives you each line followed by a line break. A paragraph of ten lines becomes ten
            separate lines when pasted.
          </p>

          <h2>Clean it step by step</h2>
          <ol>
            <li>
              Paste the text into <Link href="/text/text-cleaner">Text Cleaner</Link>.
            </li>
            <li>
              Turn on <strong>joining broken lines</strong>. Single line breaks are merged into flowing
              paragraphs, while blank lines — real paragraph breaks — are kept.
            </li>
            <li>Turn on the other fixes you need, watching the preview after each one.</li>
            <li>Copy the result.</li>
          </ol>
          <p>
            Each fix is a separate switch, so you change only what you mean to. The text is cleaned in your
            browser.
          </p>

          <h2>The invisible problems</h2>
          <ul>
            <li>
              <strong>Non-breaking spaces</strong> look like ordinary spaces but stop text from wrapping
              and break searches.
            </li>
            <li>
              <strong>Zero-width characters</strong> have no appearance at all, yet make two identical-looking
              words compare as different.
            </li>
            <li>
              <strong>Runs of extra spaces</strong>, left over from layout.
            </li>
            <li>
              <strong>Smart quotes and dashes</strong> — curly quotation marks and long dashes that word
              processors insert. They look good in prose but break code, CSV files and data imports, and they
              can push a text message over its character limit.
            </li>
          </ul>

          <h2>Hyphenated line ends</h2>
          <p>
            Justified PDFs often split words across lines with a hyphen: &ldquo;docu-&rdquo; on one line and
            &ldquo;ment&rdquo; on the next. After joining lines, search for a hyphen followed by a space to
            find these and remove the hyphen. Be careful with words that really are hyphenated.
          </p>

          <h2>Getting all the text from a PDF</h2>
          <p>
            For more than a paragraph, copying from a viewer is tedious and often scrambles columns.{" "}
            <Link href="/pdf/pdf-to-text">PDF to Text</Link> extracts the whole document page by page, with
            its own option to join lines into paragraphs. If nothing comes out, the PDF is a scan — a
            picture of text — and needs OCR instead.
          </p>

          <h2>Text from web pages</h2>
          <p>
            Pasting from a web page can bring formatting, links and invisible characters with it. Pasting
            as plain text — Ctrl+Shift+V in many programs, or Cmd+Shift+Option+V on a Mac — avoids most of
            the formatting; the cleaner handles the characters that remain. If you have copied raw HTML,
            the cleaner can strip the tags and turn entities such as &amp;amp; back into ordinary
            characters.
          </p>

          <h2>Check the length</h2>
          <p>
            Cleaned text is often shorter, because extra spaces and invisible characters are gone. If the
            text is going somewhere with a character limit, count it afterwards with the{" "}
            <Link href="/text/character-counter">Character Counter</Link>.
          </p>
        </>
      );
    },
  },
];
