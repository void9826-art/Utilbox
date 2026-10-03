import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-03";

export const textLongTailGuides: Guide[] = [
  {
    slug: "characters-with-and-without-spaces",
    topic: "Codes, passwords & text",
    title: "Character count with spaces vs without spaces: which one to use",
    seoTitle: "Characters With Spaces vs Without Spaces",
    description:
      "Forms, translators and social apps count characters differently. When spaces count, when they do not, how big the difference is, and how to get both figures.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["character-counter", "word-counter"],
    Body: function Body() {
      return (
        <>
          <p>
            &ldquo;Maximum 2,000 characters&rdquo; on an application form, &ldquo;priced per 1,000
            characters&rdquo; on a translation quote, and &ldquo;280 characters&rdquo; on a social post all sound
            like the same measure. They are not always. Some count every space, some ignore spaces, and the gap
            between the two is bigger than most people expect.
          </p>

          <h2>How big is the difference?</h2>
          <p>
            In ordinary English, the average word is around five letters, followed by a space. Spaces therefore
            make up roughly one character in six. A text of 1,000 characters including spaces is usually around
            830–850 without them. For a form with a 2,000-character limit, misreading which count applies can mean
            cutting 300 characters you did not need to cut, or submitting 300 too many.
          </p>

          <h2>Who counts what</h2>
          <ul>
            <li>
              <strong>Social media and SMS:</strong> spaces count. Every character you type, including spaces and
              line breaks, uses the limit.
            </li>
            <li>
              <strong>Online application forms:</strong> almost always include spaces, because the form simply
              counts what is in the box. If unsure, assume spaces count.
            </li>
            <li>
              <strong>Translation and typesetting quotes:</strong> vary. Many agencies in Europe quote per character
              or per standard page, often including spaces; others exclude them. The quote should say.
            </li>
            <li>
              <strong>Academic limits:</strong> usually words, not characters. Where characters are used, such as
              abstracts in some journals, the guidelines normally state whether spaces count.
            </li>
          </ul>

          <h2>Get both counts</h2>
          <ol>
            <li>
              Paste your text into the <Link href="/text/character-counter">Character Counter</Link>.
            </li>
            <li>
              Read Characters (with spaces) and Without spaces. It also shows bytes and compares the text with common
              limits such as an X post, a meta description and an SMS.
            </li>
            <li>
              For words, sentences and reading time as well, use the <Link href="/text/word-counter">Word Counter</Link>,
              which shows characters with and without spaces too.
            </li>
          </ol>

          <h2>Other things that change the count</h2>
          <ul>
            <li>
              <strong>Line breaks</strong> usually count as one character each, sometimes two on Windows systems.
              A form that counts them can reject text that looks short enough.
            </li>
            <li>
              <strong>Emoji and some symbols</strong> are stored as two or more units, and some systems count them as
              two characters. The Character Counter warns when text contains these.
            </li>
            <li>
              <strong>Double spaces</strong> after full stops add characters invisibly. The{" "}
              <Link href="/text/text-cleaner">Text Cleaner</Link> collapses them.
            </li>
            <li>
              <strong>Word processors</strong> may count footnotes, text boxes or headers differently from a plain
              paste. Count the exact text you will submit.
            </li>
          </ul>

          <h2>Cutting to fit a limit</h2>
          <p>
            Long words and filler phrases cost the most. &ldquo;In order to&rdquo; becomes &ldquo;to&rdquo;;
            &ldquo;at this point in time&rdquo; becomes &ldquo;now&rdquo;. Remove adjectives that do not add
            meaning, and replace a list of three examples with the best one. Each change of this kind saves 10 to 20
            characters, which adds up quickly on a tight limit.
          </p>
          <p>
            For how many characters fit in a text message, see{" "}
            <Link href="/guides/sms-character-limit">how many characters fit in a text message</Link>. For social
            posts, see <Link href="/guides/x-twitter-character-limit">the X character limit</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "fix-text-typed-in-caps-lock",
    topic: "Codes, passwords & text",
    title: "How to fix text typed with caps lock on",
    seoTitle: "How to Fix Text Typed in Caps Lock (All Capitals)",
    description:
      "Turn ALL CAPS or tHIS kIND oF tEXT back into normal sentences without retyping. Which case to choose, what to check by hand, and shortcuts in Word and Docs.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["case-converter", "text-cleaner"],
    Body: function Body() {
      return (
        <>
          <p>
            You type a paragraph without looking up, and it comes out as &ldquo;hELLO, i WANTED TO ASK
            ABOUT&rdquo;. Or a colleague sends a document entirely in capitals, which reads like shouting. Retyping
            is not necessary: case conversion fixes it in seconds.
          </p>

          <h2>Fix it step by step</h2>
          <ol>
            <li>
              Paste the text into the <Link href="/text/case-converter">Case Converter</Link>.
            </li>
            <li>
              Choose Sentence case. Each sentence starts with a capital and the rest becomes lower case.
            </li>
            <li>Read through, put capitals back on names and acronyms, and copy the result.</li>
          </ol>
          <p>
            For accidental caps lock specifically, where every letter&apos;s case is the opposite of what you
            meant, the iNVERSE cASE option flips each letter back exactly, including the capitals you intended.
          </p>

          <h2>Which case to choose</h2>
          <ul>
            <li>
              <strong>Sentence case</strong> for paragraphs, emails and messages.
            </li>
            <li>
              <strong>Title Case</strong> for headings, document titles and book names. See{" "}
              <Link href="/guides/title-case-rules">title case rules</Link> for which small words stay lower case.
            </li>
            <li>
              <strong>lowercase</strong> for email addresses, web addresses and tags.
            </li>
            <li>
              <strong>Inverse case</strong> for text typed with caps lock on, so that intended capitals return.
            </li>
          </ul>

          <h2>What to check by hand</h2>
          <p>
            A converter cannot know which words are names. After converting, look for:
          </p>
          <ul>
            <li>People, places and organisations: &ldquo;london&rdquo; should be &ldquo;London&rdquo;.</li>
            <li>Acronyms: &ldquo;nasa&rdquo;, &ldquo;pdf&rdquo; and &ldquo;uk&rdquo; need their capitals back.</li>
            <li>The word &ldquo;I&rdquo; in English.</li>
            <li>Brand names with unusual capitals, such as iPhone or YouTube.</li>
            <li>Days and months, which are capitalised in English but not in many other languages.</li>
          </ul>
          <p>
            For a long document, use your editor&apos;s find and replace to fix repeated names in one go.
          </p>

          <h2>Shortcuts in common programs</h2>
          <ul>
            <li>
              <strong>Microsoft Word:</strong> select the text and press Shift+F3 to cycle through lower case,
              UPPER CASE and capitalised words.
            </li>
            <li>
              <strong>Google Docs:</strong> Format → Text → Capitalisation offers lower case, UPPER CASE and Title
              Case.
            </li>
            <li>
              <strong>Phones:</strong> no built-in option in most keyboards; paste into a converter.
            </li>
          </ul>

          <h2>Stop it happening</h2>
          <ul>
            <li>
              <strong>Windows:</strong> Settings → Accessibility → Keyboard has a Toggle Keys option that plays a sound
              when Caps Lock is switched on.
            </li>
            <li>
              <strong>macOS:</strong> System Settings → Keyboard → Keyboard Shortcuts → Modifier Keys lets you
              change what Caps Lock does, or turn it off entirely.
            </li>
            <li>
              <strong>Phones:</strong> double-tapping Shift turns on caps lock on most keyboards; a single tap only
              capitalises the next letter.
            </li>
          </ul>

          <h2>Data in all capitals</h2>
          <p>
            Exports from older systems often store names and addresses in capitals, such as &ldquo;JOHN SMITH,
            12 HIGH STREET&rdquo;. &ldquo;Capitalise Every Word&rdquo; gives &ldquo;John Smith, 12 High
            Street&rdquo;, which is right for most entries. Names such as McDonald, O&apos;Brien and van der Berg, and
            postcodes, need a manual check, because simple rules cannot get them all right.
          </p>

          <h2>Clean up at the same time</h2>
          <p>
            Text pasted from emails or PDFs often has extra spaces and broken lines too. Run it through the{" "}
            <Link href="/text/text-cleaner">Text Cleaner</Link> first, then convert the case. For code-style cases
            such as camelCase and snake_case, see{" "}
            <Link href="/guides/camelcase-vs-snake-case">camelCase vs snake_case vs kebab-case</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "remove-line-breaks-from-text",
    topic: "Codes, passwords & text",
    title: "How to remove line breaks from text",
    seoTitle: "How to Remove Line Breaks From Copied Text",
    description:
      "Text copied from PDFs and emails breaks every line in the wrong place. How to join the lines into proper paragraphs, keep real paragraph breaks, and fix split words.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["text-cleaner", "pdf-to-text"],
    Body: function Body() {
      return (
        <>
          <p>
            Paste a paragraph from a PDF or an old email into a document and every line ends early, at the point
            where the original page wrapped. The text cannot reflow, so resizing the window leaves a ragged mess.
            Deleting each break by hand is slow; a cleaner can join them in one step while keeping your real
            paragraph breaks.
          </p>

          <h2>Why it happens</h2>
          <p>
            A PDF positions each line separately on the page. When you copy, many viewers insert a line break at
            the end of every visual line. Plain-text emails do something similar: older mail programs wrapped lines
            at around 72–76 characters and inserted real line breaks. The result is text where line breaks mean
            &ldquo;the page ran out&rdquo;, not &ldquo;new paragraph&rdquo;.
          </p>

          <h2>Join the lines step by step</h2>
          <ol>
            <li>
              Paste the text into the <Link href="/text/text-cleaner">Text Cleaner</Link>.
            </li>
            <li>
              Turn on &ldquo;Join broken lines&rdquo;. Single line breaks are merged into spaces, and blank lines,
              which mark real paragraphs, are kept.
            </li>
            <li>Leave &ldquo;Collapse repeated spaces&rdquo; on to tidy any double spaces left behind.</li>
            <li>Copy the cleaned text.</li>
          </ol>

          <h2>Hyphens at line ends</h2>
          <p>
            Justified PDFs often split long words across lines with a hyphen: &ldquo;docu-&rdquo; at the end of one
            line, &ldquo;ment&rdquo; at the start of the next. The cleaner rejoins these into &ldquo;document&rdquo;.
            The catch is that a genuinely hyphenated word that happened to fall at a line end, such as
            &ldquo;well-known&rdquo;, also loses its hyphen. Search the result for words that look run together.
          </p>

          <h2>When the paragraphs have no blank lines</h2>
          <p>
            Some sources do not put a blank line between paragraphs; a paragraph simply starts on a new line. Then
            the cleaner cannot tell paragraph breaks from wrapped lines, and everything joins into one block. Two
            options:
          </p>
          <ul>
            <li>Before cleaning, press Enter once at the end of each real paragraph to add a blank line.</li>
            <li>Clean everything into one block, then split paragraphs by hand where the sense changes.</li>
          </ul>

          <h2>Everything on a single line</h2>
          <p>
            Sometimes you want no breaks at all, for example to paste into a single spreadsheet cell or a form that
            rejects new lines. Join the lines first; then remove the remaining paragraph gaps with your editor&apos;s
            find and replace. In Word, search for <code>^p</code> and replace with a space. In Google Docs, enable
            regular expressions and replace <code>\n</code>.
          </p>

          <h2>Lists and addresses</h2>
          <p>
            Joining lines is wrong for text where line breaks matter: addresses, poems, code, bulleted lists and
            tables. Clean only the paragraphs that need it, or paste those parts separately. When extracting a whole
            PDF, <Link href="/pdf/pdf-to-text">PDF to Text</Link> has its own &ldquo;Join lines into paragraphs&rdquo;
            option that you can turn off for poetry, code or addresses.
          </p>
          <p>
            Other clean-up for copied text, including smart quotes and odd spacing, is covered in{" "}
            <Link href="/guides/fix-text-copied-from-a-pdf">fixing text copied from a PDF</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "curly-quotes-to-straight-quotes",
    topic: "Codes, passwords & text",
    title: "How to convert curly quotes to straight quotes",
    seoTitle: "How to Convert Curly (Smart) Quotes to Straight",
    description:
      "Smart quotes from Word and Docs break code, CSV files, passwords and search. How to straighten them, plus em dashes and ellipses, and how to stop them being added.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["text-cleaner", "json-validator"],
    Body: function Body() {
      return (
        <>
          <p>
            Word processors replace the straight quote marks you type, &quot; and &apos;, with curly
            &ldquo;typographic&rdquo; ones. In a printed letter they look better. Pasted into code, a command line,
            a spreadsheet formula or a configuration file, they break things, and the error message rarely says why.
          </p>

          <h2>Where curly quotes cause trouble</h2>
          <ul>
            <li>
              <strong>Code and JSON:</strong> <code>{"{“name”: “Ana”}"}</code> is invalid JSON; only straight double
              quotes are allowed. The <Link href="/developer/json-validator">JSON Validator</Link> flags it, but the
              cause is easy to miss.
            </li>
            <li>
              <strong>Terminal commands</strong> copied from a document: the shell does not treat curly quotes as
              quotes.
            </li>
            <li>
              <strong>Spreadsheet formulas:</strong> <code>=IF(A1=“yes”,1,0)</code> fails.
            </li>
            <li>
              <strong>Passwords and codes:</strong> a password containing an apostrophe, typed into a document and
              copied, may no longer match.
            </li>
            <li>
              <strong>Search and matching:</strong> searching for <code>don&apos;t</code> with a straight apostrophe
              may not find <code>don’t</code> with a curly one.
            </li>
          </ul>

          <h2>Straighten them step by step</h2>
          <ol>
            <li>
              Paste the text into the <Link href="/text/text-cleaner">Text Cleaner</Link>.
            </li>
            <li>
              Make sure &ldquo;Straighten smart quotes and dashes&rdquo; is on. Curly single and double quotes become
              straight ones.
            </li>
            <li>Copy the result. The panel shows how many smart characters it found.</li>
          </ol>
          <p>The text is cleaned in your browser and not sent anywhere.</p>

          <h2>Dashes, ellipses and spaces too</h2>
          <p>The same step converts other typographic characters into plain equivalents:</p>
          <ul>
            <li>Em and en dashes (— and –) become hyphens.</li>
            <li>The single ellipsis character (…) becomes three full stops.</li>
            <li>Non-breaking spaces become ordinary spaces.</li>
          </ul>
          <p>
            Non-breaking spaces are a common hidden cause of failed matches: they look exactly like spaces but are a
            different character.
          </p>

          <h2>Stop them being added</h2>
          <ul>
            <li>
              <strong>Word:</strong> File → Options → Proofing → AutoCorrect Options → AutoFormat As You Type, and
              untick &ldquo;Straight quotes with smart quotes&rdquo;.
            </li>
            <li>
              <strong>Google Docs:</strong> Tools → Preferences, and untick &ldquo;Use smart quotes&rdquo;.
            </li>
            <li>
              <strong>macOS and iOS:</strong> smart punctuation is a system keyboard setting. Turn it off if you
              often type code or commands.
            </li>
            <li>
              <strong>Best habit:</strong> write code and commands in a code editor or plain-text editor, never a
              word processor.
            </li>
          </ul>

          <h2>Checking a whole file</h2>
          <p>
            If a script or data file fails and you suspect smart quotes, search it in a code editor for the four
            curly characters: “ ” ‘ ’. Many code editors also highlight unusual Unicode characters. For a CSV exported
            from a word processor or a spreadsheet that was typed in by hand, cleaning the whole file once is quicker
            than fixing the rows that fail one by one.
          </p>

          <h2>When to keep curly quotes</h2>
          <p>
            For published prose, such as books, articles and web pages, curly quotes and proper dashes are
            correct typography. Straighten text only when it is going somewhere that needs plain characters. If you
            have stripped them from an article by mistake, a word processor can re-apply them via its AutoFormat
            feature.
          </p>
          <p>
            For invalid JSON in general, see <Link href="/guides/how-to-fix-invalid-json">how to fix invalid JSON</Link>.
            For other hidden characters, see{" "}
            <Link href="/guides/remove-invisible-characters">removing invisible characters</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "x-twitter-character-limit",
    topic: "Codes, passwords & text",
    title: "X (Twitter) character limit: what counts towards 280",
    seoTitle: "X (Twitter) Character Limit: What Counts in 280",
    description:
      "A post on X allows 280 characters, but links, emoji and some scripts count differently. What uses up the limit, what does not, and how to check a draft.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["character-counter", "word-counter"],
    Body: function Body() {
      return (
        <>
          <p>
            Standard posts on X, formerly Twitter, are limited to 280 characters. That sounds simple until a draft
            that looks short is rejected, or a long link appears to use only part of the limit. X weights certain
            characters differently, and knowing the rules saves trial and error.
          </p>

          <h2>What counts</h2>
          <ul>
            <li>
              <strong>Letters, numbers, spaces, punctuation and line breaks</strong> count as one each, for most
              Latin-script text.
            </li>
            <li>
              <strong>Links</strong> count as 23 characters each, however long or short the address is, because X
              wraps them in its own short link.
            </li>
            <li>
              <strong>Emoji</strong> count as two characters each.
            </li>
            <li>
              <strong>Chinese, Japanese and Korean characters</strong> count as two each, which halves the effective
              limit for those languages.
            </li>
          </ul>

          <h2>What does not count</h2>
          <ul>
            <li>Attached photos, videos and GIFs.</li>
            <li>Quoted posts, which are attached rather than written into the text.</li>
            <li>Usernames at the start of a reply, added automatically.</li>
          </ul>

          <h2>Check a draft</h2>
          <ol>
            <li>
              Paste the draft into the <Link href="/text/character-counter">Character Counter</Link>. It shows the
              count against the 280-character X limit.
            </li>
            <li>
              If the post contains links, mentally replace each link with 23 characters. A 60-character link only
              uses 23.
            </li>
            <li>
              If it contains emoji, add one extra character per emoji. The counter warns when text contains
              multi-unit characters like these.
            </li>
          </ol>

          <h2>Mentions, hashtags and alt text</h2>
          <p>
            Usernames you mention inside the text, as opposed to the automatic ones at the start of a reply, count in
            full, including the @. So do hashtags, including the #. Image descriptions, called alt text, have their
            own separate allowance of up to 1,000 characters per image and do not use the post&apos;s 280. Adding
            alt text makes images usable for people with screen readers and costs nothing from the limit.
          </p>

          <h2>Longer posts</h2>
          <p>
            Paid subscriptions on X allow much longer posts. But readers in the timeline see only the first part,
            with a &ldquo;Show more&rdquo; link, so the first 280 characters still need to work on their own. For
            free accounts, a long message becomes a thread: a series of replies to your own post. Number them, such as
            1/4, and make each one readable alone.
          </p>

          <h2>Writing within the limit</h2>
          <ul>
            <li>Lead with the point; the first line decides whether people read on.</li>
            <li>Cut filler: &ldquo;I just wanted to say that&rdquo; adds nothing.</li>
            <li>Use numerals instead of words for numbers.</li>
            <li>Replace a list of hashtags with one relevant tag, or none.</li>
            <li>Put a long explanation behind a link rather than squeezing it into a thread.</li>
          </ul>

          <h2>Other platforms</h2>
          <table>
            <thead>
              <tr>
                <th>Where</th>
                <th>Limit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>X post (standard)</td>
                <td>280</td>
              </tr>
              <tr>
                <td>SMS (single message)</td>
                <td>160 in GSM-7</td>
              </tr>
              <tr>
                <td>Instagram caption</td>
                <td>2,200</td>
              </tr>
              <tr>
                <td>LinkedIn post</td>
                <td>3,000</td>
              </tr>
            </tbody>
          </table>
          <p>
            For Instagram specifics, see <Link href="/guides/instagram-caption-and-bio-limits">Instagram caption and bio limits</Link>.
            For text messages, see <Link href="/guides/sms-character-limit">SMS character limits</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "instagram-caption-and-bio-limits",
    topic: "Codes, passwords & text",
    title: "Instagram caption and bio character limits",
    seoTitle: "Instagram Caption and Bio Character Limits",
    description:
      "Captions allow 2,200 characters and bios 150, but only the first line or two shows before more. How to fit the limits and write the part people actually see.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["character-counter", "text-cleaner"],
    Body: function Body() {
      return (
        <>
          <p>
            Instagram&apos;s limits are generous for captions and tight for bios. The more important limit is the
            invisible one: in the feed, only the first line or two of a caption shows before it is cut off with
            &ldquo;more&rdquo;. Most people never tap it.
          </p>

          <h2>The limits</h2>
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Limit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Caption</td>
                <td>2,200 characters</td>
              </tr>
              <tr>
                <td>Bio</td>
                <td>150 characters</td>
              </tr>
              <tr>
                <td>Username</td>
                <td>30 characters</td>
              </tr>
              <tr>
                <td>Visible in feed</td>
                <td>first line or two</td>
              </tr>
            </tbody>
          </table>
          <p>
            Spaces, line breaks, emoji and hashtags all count. Instagram changes its limits from time to time, so if
            a draft is rejected, check the app.
          </p>

          <h2>Check a caption before posting</h2>
          <ol>
            <li>
              Write the caption somewhere comfortable and paste it into the{" "}
              <Link href="/text/character-counter">Character Counter</Link>. It compares the text with the
              2,200-character Instagram caption limit.
            </li>
            <li>
              Look at the first 125 characters or so on their own. That is roughly what shows before
              &ldquo;more&rdquo;, depending on the screen.
            </li>
            <li>For a bio, keep it under 150 including spaces and emoji.</li>
          </ol>

          <h2>Write the visible part first</h2>
          <ul>
            <li>Put the hook, question or key fact in the first sentence.</li>
            <li>Do not open with hashtags, mentions or a long emoji row; they waste the visible space.</li>
            <li>Put calls to action early if they matter, such as &ldquo;Sale ends Sunday&rdquo;.</li>
            <li>Detail, story and hashtags can follow after the cut.</li>
          </ul>

          <h2>Line breaks that stay put</h2>
          <p>
            Breaking a caption into short paragraphs makes it easier to read. Line breaks typed in the app usually
            survive, but spaces at the end of a line or invisible characters copied from notes apps can cause odd
            gaps or lost breaks. If your caption collapses into one block, clean it in the{" "}
            <Link href="/text/text-cleaner">Text Cleaner</Link> to trim trailing spaces and remove invisible
            characters, then paste it again.
          </p>

          <h2>How long is 2,200 characters?</h2>
          <p>
            In English, 2,200 characters is roughly 350 to 400 words: a short blog post. Captions that long work for
            recipes, tutorials and stories, but they are read by few people. Draft long captions in the{" "}
            <Link href="/text/word-counter">Word Counter</Link>, which shows the character count and reading time, and
            make sure the first line works even for someone who reads nothing else.
          </p>

          <h2>Bio in 150 characters</h2>
          <p>
            A good bio answers three questions: who you are, what people get by following, and what to do next.
            Example, at 101 characters: &ldquo;Home baker in Leeds. Sourdough, simple recipes and the occasional
            disaster. New recipe every Friday ↓&rdquo;. The link field is separate and does not use bio characters.
          </p>

          <h2>Fancy fonts</h2>
          <p>
            Bold and script-style &ldquo;fonts&rdquo; in bios are really special Unicode symbols. They often count as
            two characters each, cannot be found by search, and are read badly by screen readers. See{" "}
            <Link href="/guides/unicode-bold-text-problems">the problems with Unicode bold text</Link> before using
            them.
          </p>
          <p>
            For image sizes, see <Link href="/guides/instagram-image-sizes">Instagram image sizes</Link>. For other
            platforms&apos; limits, see <Link href="/guides/x-twitter-character-limit">the X character limit</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-many-pages-is-1000-words",
    topic: "Codes, passwords & text",
    title: "How many pages is 1,000 words?",
    seoTitle: "How Many Pages Is 1,000 Words? Word-to-Page Table",
    description:
      "About two pages single-spaced and four double-spaced, at 12 point. A words-to-pages table, what changes the answer, and how to estimate pages for any word count.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["word-counter", "character-counter"],
    Body: function Body() {
      return (
        <>
          <p>
            Assignment briefs give word counts, but students think in pages. Publishers quote per page, but writers
            count words. The rough conversion is easy to remember, as long as you know the assumptions behind it.
          </p>

          <h2>Words to pages</h2>
          <p>
            With a standard 12-point font such as Times New Roman or Arial, 2.5 cm (1 inch) margins, and A4 or Letter
            paper:
          </p>
          <table>
            <thead>
              <tr>
                <th>Words</th>
                <th>Single</th>
                <th>Double</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>250</td>
                <td>½ page</td>
                <td>1 page</td>
              </tr>
              <tr>
                <td>500</td>
                <td>1 page</td>
                <td>2 pages</td>
              </tr>
              <tr>
                <td>1,000</td>
                <td>2 pages</td>
                <td>4 pages</td>
              </tr>
              <tr>
                <td>1,500</td>
                <td>3 pages</td>
                <td>6 pages</td>
              </tr>
              <tr>
                <td>2,000</td>
                <td>4 pages</td>
                <td>8 pages</td>
              </tr>
              <tr>
                <td>3,000</td>
                <td>6 pages</td>
                <td>12 pages</td>
              </tr>
              <tr>
                <td>5,000</td>
                <td>10 pages</td>
                <td>20 pages</td>
              </tr>
            </tbody>
          </table>
          <p>
            The rule of thumb is about 500 words per single-spaced page and 250 per double-spaced page. Real pages
            vary by 10–20% either way.
          </p>

          <h2>What changes the answer</h2>
          <ul>
            <li>
              <strong>Font:</strong> Arial and Calibri are wider than Times New Roman at the same size, so fewer
              words fit. Calibri 11, the Word default, fits more than Arial 12.
            </li>
            <li>
              <strong>Paragraph length:</strong> many short paragraphs leave half-empty lines, so dialogue-heavy or
              list-heavy text takes more pages.
            </li>
            <li>
              <strong>Headings, tables and images</strong> take space without adding words.
            </li>
            <li>
              <strong>Spacing between paragraphs</strong> set in the style, not just line spacing.
            </li>
            <li>
              <strong>1.5 line spacing</strong> sits in between: roughly 330–350 words per page.
            </li>
          </ul>

          <h2>Count your words</h2>
          <p>
            Paste your text into the <Link href="/text/word-counter">Word Counter</Link>. Set a target word count to
            see a progress bar, and check reading and speaking time at the same time. Divide the word count by 500 or
            250 for a page estimate, or check the page count in your word processor with the required formatting.
          </p>

          <h2>Handwritten pages</h2>
          <p>
            Handwriting varies far more than type. Many people fit somewhere around 200–250 words on a lined A4 or
            Letter page, but small writers fit more. For a handwritten exam answer with a word target, count the words
            on one page of your own writing once, and use that figure.
          </p>

          <h2>Pages to words</h2>
          <p>
            Working the other way, a brief that asks for &ldquo;five pages, double-spaced&rdquo; is expecting
            around 1,250 words. If both a page count and a word count are given, the word count is usually the one
            that is checked. And if a brief gives only pages, padding with large fonts and margins is easy to spot;
            use the standard formatting it asks for.
          </p>

          <h2>Speaking time</h2>
          <p>
            For a speech, pages matter less than minutes. At a typical speaking pace, 1,000 words takes around seven
            to eight minutes. See <Link href="/guides/words-to-reading-time">how long it takes to read or say 1,000 words</Link>.
            For what counts towards an essay word limit, see{" "}
            <Link href="/guides/what-counts-in-an-essay-word-count">what counts in an essay word count</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "what-counts-in-an-essay-word-count",
    topic: "Codes, passwords & text",
    title: "Does the title count in an essay word count? What is included",
    seoTitle: "What Counts in an Essay Word Count? Title, Quotes",
    description:
      "Titles, references, quotations, footnotes and appendices: what usually counts towards an essay word limit, what usually does not, and how strict the limit is.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["word-counter", "character-counter"],
    Body: function Body() {
      return (
        <>
          <p>
            A 2,000-word limit raises immediate questions. Does the title count? The reference list? The quotations?
            The answer depends on your institution, and the course handbook is the final word. But there are common
            conventions, and knowing them helps you ask the right question.
          </p>

          <h2>Usually included</h2>
          <ul>
            <li>All the main text, from the first word of the introduction to the last of the conclusion.</li>
            <li>
              <strong>In-text citations</strong> such as (Smith, 2021). Many universities include them because they
              are part of the sentence; some exclude them.
            </li>
            <li>
              <strong>Quotations</strong> in the body of the essay. They are your choice of words to include.
            </li>
            <li>
              <strong>Headings and subheadings</strong> within the essay, in many cases.
            </li>
          </ul>

          <h2>Usually excluded</h2>
          <ul>
            <li>
              <strong>The title</strong> and any cover page information.
            </li>
            <li>
              <strong>The reference list or bibliography.</strong>
            </li>
            <li>
              <strong>Appendices</strong>, although markers may not read them, so do not put essential arguments
              there.
            </li>
            <li>
              <strong>Tables and figures</strong>, often, though their captions and any text-heavy tables may count.
            </li>
            <li>
              <strong>Footnotes</strong>, sometimes. Rules vary most here. Where footnotes are used for references
              only, they are often excluded; discursive footnotes often count.
            </li>
            <li>
              <strong>Abstract</strong> in a dissertation, which usually has its own separate limit.
            </li>
          </ul>

          <h2>Count only what counts</h2>
          <ol>
            <li>
              Copy the essay into the <Link href="/text/word-counter">Word Counter</Link>.
            </li>
            <li>Delete the title, the reference list and anything else your rules exclude.</li>
            <li>Read the word count, and set your word limit as the target to see how close you are.</li>
          </ol>
          <p>
            Word processors count differently from each other in small ways, for example with hyphenated words and
            numbers. A difference of a few words between tools is normal; a difference of hundreds means something
            is being included that should not be.
          </p>

          <h2>How strict is the limit?</h2>
          <p>
            Many institutions allow a margin of around 10% either way and may penalise text beyond it, or stop
            reading at the limit. Others are strict. Under-length work can also lose marks for lack of depth. If the
            handbook does not say, ask your tutor; aiming within 5% of the limit is a safe default.
          </p>

          <h2>Getting under the limit</h2>
          <ul>
            <li>Cut long quotations to the essential phrase, and paraphrase the rest with a citation.</li>
            <li>Remove signposting that repeats itself: &ldquo;As mentioned above&rdquo;, &ldquo;In this essay I will&rdquo;.</li>
            <li>Merge examples that make the same point.</li>
            <li>Replace wordy phrases: &ldquo;due to the fact that&rdquo; with &ldquo;because&rdquo;.</li>
          </ul>

          <h2>Character limits in applications</h2>
          <p>
            Personal statements and application forms often use character limits instead of words. Those count every
            character, often including spaces and line breaks. Use the{" "}
            <Link href="/text/character-counter">Character Counter</Link> for those, and see{" "}
            <Link href="/guides/characters-with-and-without-spaces">characters with and without spaces</Link>. For
            converting a word count to pages, see{" "}
            <Link href="/guides/how-many-pages-is-1000-words">how many pages 1,000 words is</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "unicode-bold-text-problems",
    topic: "Codes, passwords & text",
    title: "Bold and italic text on LinkedIn and Instagram: the hidden problems",
    seoTitle: "Unicode Bold Text: Problems With Fancy Fonts",
    description:
      "Bold and italic letters in social posts are Unicode symbols, not formatting. How they work, why screen readers and search struggle, and how to use them sparingly.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["linkedin-formatter", "character-counter"],
    Body: function Body() {
      return (
        <>
          <p>
            LinkedIn, Instagram and X do not offer bold or italic in their text boxes. Yet posts appear with
            𝗯𝗼𝗹𝗱 headlines and 𝘪𝘵𝘢𝘭𝘪𝘤 phrases. These are not formatted letters: they are different characters
            from a block of Unicode designed for mathematical notation, which happen to look like bold or italic
            letters. That trick works visually and has real costs.
          </p>

          <h2>How it works</h2>
          <p>
            Unicode includes complete alphabets of mathematical bold, italic, bold italic, script and other styles,
            so that equations can distinguish, say, a bold x from an ordinary x. A formatter swaps each normal letter
            for its mathematical look-alike. The <Link href="/text/linkedin-formatter">LinkedIn Post Formatter</Link>{" "}
            does exactly this, along with bullets and line breaks that survive posting.
          </p>

          <h2>The problems</h2>
          <ul>
            <li>
              <strong>Screen readers.</strong> Assistive software may read each symbol as &ldquo;mathematical bold
              small b&rdquo;, spell it letter by letter, or skip it. A bold headline can become unintelligible for
              blind and partially sighted readers.
            </li>
            <li>
              <strong>Search.</strong> A search for &ldquo;marketing&rdquo; does not match 𝗺𝗮𝗿𝗸𝗲𝘁𝗶𝗻𝗴. Words in
              Unicode bold are effectively invisible to the platform&apos;s own search and to anyone searching your
              profile.
            </li>
            <li>
              <strong>Character limits.</strong> Each of these symbols is stored as two units in many systems, and
              some platforms count them as two characters. The{" "}
              <Link href="/text/character-counter">Character Counter</Link> warns when text contains multi-unit
              characters.
            </li>
            <li>
              <strong>Missing glyphs.</strong> Some devices and fonts do not have every symbol and show empty boxes.
            </li>
            <li>
              <strong>Copying.</strong> Text copied out of a post keeps the symbols, which then look odd in emails and
              documents and break spell-check.
            </li>
          </ul>

          <h2>How to use it responsibly</h2>
          <ul>
            <li>Limit it to a short headline or one key phrase, never whole paragraphs.</li>
            <li>
              Never put essential information, such as dates, prices, names or links, only in Unicode bold.
            </li>
            <li>Do not use it for words people might search for, such as your job title or skills.</li>
            <li>Avoid script, double-struck and other decorative styles; they are the hardest to read.</li>
            <li>
              Use structure instead: short paragraphs, line breaks and simple bullets do most of what bold is used for,
              without the downsides.
            </li>
          </ul>

          <h2>Where real formatting exists</h2>
          <p>
            LinkedIn articles, as opposed to posts, have a proper editor with real bold and headings. Emails,
            documents and most website editors support genuine formatting too. Use Unicode styling only where there
            is no alternative.
          </p>

          <h2>Undoing it</h2>
          <p>
            If you need to turn styled text back into normal letters, for example after copying a post into a
            document, retyping the styled words is often fastest for a short phrase. Applying Unicode normalisation
            (NFKC) in a code editor or script also maps most mathematical letters back to ordinary ones.
          </p>
          <p>
            For formatting LinkedIn posts in general, see{" "}
            <Link href="/guides/how-to-format-a-linkedin-post">how to format a LinkedIn post</Link>. For hidden
            characters that cause similar trouble, see{" "}
            <Link href="/guides/remove-invisible-characters">removing invisible characters</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "remove-invisible-characters",
    topic: "Codes, passwords & text",
    title: "How to find and remove invisible characters in text",
    seoTitle: "How to Remove Invisible Characters (Zero-Width)",
    description:
      "Zero-width spaces, byte-order marks and direction marks hide in copied text and break search, code and form validation. How to detect and remove them safely.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["text-cleaner", "character-counter"],
    Body: function Body() {
      return (
        <>
          <p>
            Two words look identical, yet a spreadsheet says they are different. A coupon code copied from an email
            is rejected. A config file fails with an error on line 1, column 1. Often the culprit is a character you
            cannot see: a zero-width space, a byte-order mark or a direction mark that came along with copied text.
          </p>

          <h2>The usual suspects</h2>
          <ul>
            <li>
              <strong>Zero-width space (U+200B):</strong> marks a possible line break without showing a space. Common
              in text copied from web pages and chat apps.
            </li>
            <li>
              <strong>Byte-order mark (U+FEFF):</strong> added to the start of files by some Windows editors. Breaks
              scripts, CSV headers and JSON parsers.
            </li>
            <li>
              <strong>Zero-width joiner and non-joiner (U+200D, U+200C):</strong> control how characters combine.
            </li>
            <li>
              <strong>Direction marks:</strong> left-to-right and right-to-left marks used in mixed-language text.
            </li>
            <li>
              <strong>Soft hyphen (U+00AD):</strong> shows only when a word breaks at a line end.
            </li>
            <li>
              <strong>Non-breaking space (U+00A0):</strong> visible as a space but a different character, so searches
              and comparisons fail.
            </li>
          </ul>

          <h2>Detect them</h2>
          <p>
            Paste the text into the <Link href="/text/text-cleaner">Text Cleaner</Link>. The panel shows how many
            invisible characters it found. Another clue: the{" "}
            <Link href="/text/character-counter">Character Counter</Link> shows a higher character count than the
            letters you can see, and its visible-character figure is lower than its total.
          </p>

          <h2>Remove them step by step</h2>
          <ol>
            <li>Paste the text into the Text Cleaner.</li>
            <li>
              Turn on &ldquo;Remove invisible characters&rdquo;. It removes zero-width spaces, joiners, byte-order
              marks and direction marks.
            </li>
            <li>
              Turn on &ldquo;Straighten smart quotes and dashes&rdquo; as well, which turns non-breaking spaces into
              ordinary ones.
            </li>
            <li>Copy the cleaned text and try again.</li>
          </ol>
          <p>Cleaning happens in your browser, so private text is not uploaded.</p>

          <h2>When not to remove them</h2>
          <p>
            Some invisible characters are doing a job. Removing all of them can damage text in these cases:
          </p>
          <ul>
            <li>
              <strong>Emoji sequences:</strong> family, profession and some flag emoji are built from several emoji
              glued together with zero-width joiners. Removing the joiners splits 👨‍👩‍👧 into separate people.
            </li>
            <li>
              <strong>Some scripts:</strong> Persian, Arabic and several Indian scripts use joiners and non-joiners
              to control how letters connect. Removing them can change how words display.
            </li>
            <li>
              <strong>Right-to-left text</strong> mixed with English may rely on direction marks to display in the
              right order.
            </li>
          </ul>
          <p>
            For plain English data, codes, addresses, IDs and code, removing them is safe and usually what you want.
          </p>

          <h2>Prevent them</h2>
          <ul>
            <li>Save files as UTF-8 without a byte-order mark; most code editors have this option.</li>
            <li>Type short codes and passwords instead of copying them from formatted emails.</li>
            <li>Paste into a plain-text editor first when moving text from the web into data files.</li>
          </ul>
          <p>
            For curly quotes and dashes, see <Link href="/guides/curly-quotes-to-straight-quotes">converting curly quotes to straight</Link>.
            For broken JSON, see <Link href="/guides/how-to-fix-invalid-json">how to fix invalid JSON</Link>.
          </p>
        </>
      );
    },
  },
];
