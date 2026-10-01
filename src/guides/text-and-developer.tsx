import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-01";

export const textAndDeveloperGuides: Guide[] = [
  {
    slug: "how-to-transcribe-a-voice-message",
    topic: "Codes, passwords & text",
    title: "How to turn a voice message into text — privately",
    seoTitle: "How to Transcribe a Voice Message to Text Privately",
    description:
      "Transcribe WhatsApp and Telegram voice notes, phone recordings and short audio clips into text on your own device, and get the most accurate result.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["voice-to-text", "text-cleaner", "word-counter"],
    Body: function Body() {
      return (
        <>
          <p>
            A two-minute voice note is quick to send and slow to receive — especially in a meeting, on
            a train, or when you need to find one detail later. A transcript can be skimmed, searched
            and copied. The catch is that most transcription services upload your audio to a server,
            and voice messages are often private.
          </p>

          <h2>Transcription on your own device</h2>
          <p>
            The <Link href="/text/voice-to-text">Voice to Text Converter</Link> runs a speech
            recognition model called Whisper inside your browser. The model is downloaded once — about
            40 MB for the faster version and about 80 MB for the more accurate one — and then cached.
            Your audio is decoded and transcribed on your own processor, and it is not sent to this
            site or anyone else.
          </p>

          <h2>Step 1: save the voice message as a file</h2>
          <ul>
            <li>
              <strong>WhatsApp on a phone:</strong> press and hold the voice message, choose Share, and
              save it to your files.
            </li>
            <li>
              <strong>WhatsApp on a computer:</strong> open the message menu and choose Download.
            </li>
            <li>
              <strong>Other apps</strong> generally have a similar share or save option for voice
              messages.
            </li>
            <li>
              <strong>Phone recordings</strong> from a voice memo app can be shared or exported as a
              file.
            </li>
          </ul>
          <p>
            MP3, M4A and AAC, WAV, OGG and Opus voice notes, WebM and FLAC all work — anything your
            browser can decode. If a file will not open in one browser, try another or convert it to
            MP3.
          </p>

          <h2>Step 2: transcribe it</h2>
          <ol>
            <li>Add the audio file.</li>
            <li>Choose the language, or leave it on automatic detection.</li>
            <li>Pick the faster model for quick notes, or the more accurate one for names and detail.</li>
            <li>Press Transcribe. The first time, the model downloads; after that it starts straight away.</li>
            <li>Copy the text, or download it — with timestamps and subtitles if you turned them on.</li>
          </ol>
          <p>
            A one-minute clip takes a few seconds on a recent laptop and longer on an older phone.
            Recordings up to 10 minutes are accepted.
          </p>

          <h2>Getting an accurate transcript</h2>
          <ul>
            <li>
              <strong>Clear audio matters most.</strong> One person speaking close to the phone, with
              little background noise, transcribes far better than a recording across a busy room.
            </li>
            <li>
              <strong>Choose the language</strong> when you know it. Automatic detection can be
              misled by a short clip or a greeting in another language.
            </li>
            <li>
              <strong>Use the more accurate model</strong> for names, numbers, addresses and technical
              terms.
            </li>
            <li>
              <strong>Split long recordings</strong> into shorter clips if you have more than ten
              minutes.
            </li>
          </ul>

          <h2>Check before you rely on it</h2>
          <p>
            Speech recognition is very good on clear speech and still makes mistakes. It can mishear
            names and specialist words, struggle when people talk over each other, and occasionally
            invent words during long silences. Read the transcript before quoting it, and check every
            name, number and date against the audio.
          </p>

          <h2>Tidying the text</h2>
          <p>
            Paste the transcript into <Link href="/text/text-cleaner">Text Cleaner</Link> to remove
            stray spaces or join broken lines, and into the{" "}
            <Link href="/text/word-counter">Word Counter</Link> if you need its length or reading time.
          </p>

          <h2>Built-in transcription versus a file</h2>
          <p>
            Some messaging apps and phones now offer transcripts of voice messages themselves, for
            certain languages. If yours does, it is the quickest route for a single message. A separate
            tool is useful when the built-in option is not available in your language or on your
            device, when you are working on a computer, when the recording is a file rather than a
            message, or when you want timestamps and subtitles.
          </p>

          <h2>Making use of the transcript</h2>
          <ul>
            <li>
              <strong>Search it</strong> for the one detail you needed — an address, a time, a number.
            </li>
            <li>
              <strong>Quote it accurately</strong>, using the timestamps to find the exact moment in the
              audio.
            </li>
            <li>
              <strong>Make subtitles</strong> for your own short videos, then check the timing and
              spelling before publishing.
            </li>
            <li>
              <strong>Keep a record</strong> of spoken instructions or agreements, alongside the
              original audio.
            </li>
          </ul>

          <h2>Respect the speaker</h2>
          <p>
            A voice message was sent to you, not to be published. Transcribing it for your own
            convenience is one thing; sharing the transcript is another. Ask before passing on what
            someone said, and check the rules that apply to you before transcribing recordings of other
            people.
          </p>
        </>
      );
    },
  },

  {
    slug: "words-to-reading-time",
    topic: "Codes, passwords & text",
    title: "How long does it take to read or say 1,000 words?",
    seoTitle: "How Long Does It Take to Read or Say 1,000 Words?",
    description:
      "Reading and speaking times for any word count, how many words fit a five-minute speech, and how to hit a word limit for essays, posts and talks.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["word-counter", "character-counter", "text-cleaner"],
    Body: function Body() {
      return (
        <>
          <p>
            &ldquo;Keep it to five minutes.&rdquo; &ldquo;No more than 1,500 words.&rdquo; &ldquo;A
            three-minute read.&rdquo; Limits on time and length are everywhere, and converting between
            them only takes two numbers: how fast people read silently, and how fast they speak.
          </p>

          <h2>The two speeds</h2>
          <ul>
            <li>
              <strong>Reading:</strong> about <strong>238 words a minute</strong> — the average found in
              research on adults reading ordinary non-fiction silently.
            </li>
            <li>
              <strong>Speaking:</strong> about <strong>130 words a minute</strong> — a comfortable,
              clear pace for a presentation or speech.
            </li>
          </ul>
          <p>
            The <Link href="/text/word-counter">Word Counter</Link> uses these figures to show reading and
            speaking time as you type.
          </p>

          <h2>Quick reference</h2>
          <table>
            <thead>
              <tr>
                <th>Words</th>
                <th>Reading</th>
                <th>Speaking</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>300</td>
                <td>about 1¼ min</td>
                <td>about 2¼ min</td>
              </tr>
              <tr>
                <td>500</td>
                <td>about 2 min</td>
                <td>about 4 min</td>
              </tr>
              <tr>
                <td>1,000</td>
                <td>about 4 min</td>
                <td>about 7¾ min</td>
              </tr>
              <tr>
                <td>2,000</td>
                <td>about 8½ min</td>
                <td>about 15½ min</td>
              </tr>
              <tr>
                <td>5,000</td>
                <td>about 21 min</td>
                <td>about 38½ min</td>
              </tr>
            </tbody>
          </table>

          <h2>Planning a speech or presentation</h2>
          <p>Work backwards from the time you have, at about 130 words a minute:</p>
          <ul>
            <li>a 2-minute introduction or toast: about 260 words;</li>
            <li>a 5-minute talk: about 650 words;</li>
            <li>a 10-minute talk: about 1,300 words;</li>
            <li>a 20-minute talk: about 2,600 words.</li>
          </ul>
          <p>
            Leave room for pauses, applause, slide changes and questions — and note that most people
            speak faster when nervous. Reading your script aloud once with a timer is the only reliable
            check.
          </p>

          <h2>Scripts for video and audio</h2>
          <p>
            The same arithmetic plans videos, podcasts and voice-overs. A 60-second video script is about
            130–150 words; a 30-second advert about 65–75. Short videos usually feel better slightly
            under the limit than rushed to fit it, so cut rather than speed up. Read the script aloud with
            a timer before recording — it is the quickest way to catch sentences that look fine on the
            page but are hard to say.
          </p>

          <h2>&ldquo;Minute read&rdquo; labels on articles</h2>
          <p>
            Blogs and news sites often show an estimated reading time at the top of an article. It is
            the word count divided by an average reading speed — usually somewhere between 200 and 265
            words a minute — sometimes with a little extra for images. It helps readers decide whether
            to read now or later. If you add one to your own articles, use the same speed throughout so
            the labels are consistent.
          </p>

          <h2>Why your own speed may differ</h2>
          <ul>
            <li>
              <strong>Technical material</strong> is read more slowly than a news story or a novel.
            </li>
            <li>
              <strong>Reading on a phone</strong> and skimming behave differently from careful reading.
            </li>
            <li>
              <strong>Speaking pace</strong> varies with the speaker, the language and the occasion; an
              audiobook narrator usually speaks a little faster than a presenter.
            </li>
          </ul>
          <p>Treat the figures as a planning guide, not a promise.</p>

          <h2>Hitting a word limit</h2>
          <p>
            Set your target in the Word Counter and watch the remaining count as you edit. A few
            practical points:
          </p>
          <ul>
            <li>
              <strong>Check what counts.</strong> Many essay limits exclude references, footnotes or
              appendices; others include everything. Your assignment brief decides.
            </li>
            <li>
              <strong>Hyphenated words</strong> count as one, as they do in word processors.
            </li>
            <li>
              <strong>To cut words</strong>, remove repeated points first, then filler phrases such as
              &ldquo;in order to&rdquo; and &ldquo;it is important to note that&rdquo;. The keyword panel
              shows the words you lean on most.
            </li>
          </ul>

          <h2>Pages and words</h2>
          <p>
            A page of single-spaced text in a 12-point font with standard margins holds roughly 500
            words; double-spaced, about 250. Headings, lists and short paragraphs reduce that. When a
            page limit matters, check the real document rather than estimating.
          </p>

          <h2>Character limits are different</h2>
          <p>
            Social posts, text messages and search result descriptions are limited by characters, not
            words. For those, use the <Link href="/text/character-counter">Character Counter</Link>,
            which checks text against common platform limits. If text pasted from a document behaves
            oddly — extra spaces, broken lines — clean it first with{" "}
            <Link href="/text/text-cleaner">Text Cleaner</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-fix-invalid-json",
    topic: "Web & developer",
    title: "How to fix invalid JSON: the common errors and what they mean",
    seoTitle: "How to Fix Invalid JSON: Common Errors Explained",
    description:
      "Trailing commas, single quotes, comments, unescaped characters and the other mistakes that make JSON invalid — with examples and how to find the exact line.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["json-validator", "json-formatter", "json-to-csv"],
    Body: function Body() {
      return (
        <>
          <p>
            &ldquo;Unexpected token&rdquo;, &ldquo;Expected property name&rdquo;, &ldquo;Unexpected end
            of JSON input&rdquo;. JSON error messages are terse, and in a long file they can be hard to
            act on. Almost every one comes from a small set of mistakes, and JSON is strict about all of
            them.
          </p>

          <h2>Find the exact position first</h2>
          <p>
            Paste the JSON into the <Link href="/developer/json-validator">JSON Validator</Link>. It
            checks the text as you type, and when it fails it names the likely cause in plain words and
            highlights the line. The <Link href="/developer/json-formatter">JSON Formatter</Link> reports
            the exact line and column with a marker under the problem character. Both run in your
            browser, so it is safe to paste real data.
          </p>
          <p>
            One tip: the reported position is where the parser gave up, which is sometimes just after
            the real mistake. If the marked line looks fine, check the end of the line before it.
          </p>

          <h2>The common errors</h2>
          <ul>
            <li>
              <strong>Trailing commas.</strong> <code>{'{"a": 1, "b": 2,}'}</code> is invalid. JSON allows
              no comma after the last item in an object or array. This is the most common error of all.
            </li>
            <li>
              <strong>Single quotes.</strong> <code>{"{'name': 'Ada'}"}</code> is invalid. Keys and
              strings must use double quotes.
            </li>
            <li>
              <strong>Unquoted keys.</strong> <code>{"{name: \"Ada\"}"}</code> is valid JavaScript but not
              JSON. Every key must be a double-quoted string.
            </li>
            <li>
              <strong>Comments.</strong> <code>{"// note"}</code> and <code>{"/* note */"}</code> are not
              allowed. JSON has no comment syntax.
            </li>
            <li>
              <strong>Missing commas</strong> between items, often after copying and pasting a block.
            </li>
            <li>
              <strong>Mismatched brackets</strong> — an object opened with a brace and closed with a
              square bracket, or a missing closing bracket at the end, which produces &ldquo;unexpected
              end of input&rdquo;.
            </li>
            <li>
              <strong>Values JSON does not have:</strong> <code>undefined</code>, <code>NaN</code> and{" "}
              <code>Infinity</code> are not valid. Use <code>null</code> or a number.
            </li>
          </ul>

          <h2>Strings and escaping</h2>
          <p>Inside a string, some characters must be escaped with a backslash:</p>
          <ul>
            <li>a double quote: <code>{'\\"'}</code></li>
            <li>a backslash: <code>{"\\\\"}</code> — the usual problem with Windows file paths</li>
            <li>a line break: <code>{"\\n"}</code>; a tab: <code>{"\\t"}</code></li>
          </ul>
          <p>
            A real line break typed inside a string is invalid; it must be written as{" "}
            <code>{"\\n"}</code>. Text pasted from a word processor can also bring curly quotes, which
            are ordinary characters inside a string but break the syntax if they replace the straight
            quotes around it.
          </p>

          <h2>Numbers</h2>
          <ul>
            <li>No leading zeros: <code>012</code> is invalid; write <code>12</code>, or a string if the zero matters.</li>
            <li>No plus sign, no hexadecimal, and no trailing decimal point.</li>
            <li>Very large numbers may lose precision in some languages; long IDs are safer as strings.</li>
          </ul>

          <h2>JSON is not a JavaScript object</h2>
          <p>
            Many errors come from writing JSON as if it were JavaScript. JavaScript accepts single
            quotes, unquoted keys, trailing commas, comments and functions; JSON accepts none of them.
            Some tools use relaxed variants such as JSON5 or JSONC that allow comments and trailing
            commas, but a standard JSON parser — which is what most APIs use — rejects them.
          </p>

          <h2>Valid but probably wrong: duplicate keys</h2>
          <p>
            <code>{'{"id": 1, "id": 2}'}</code> parses, but most parsers silently keep only the last
            value. The validator flags duplicate keys because they are almost always a mistake and very
            hard to spot by eye.
          </p>

          <h2>Valid syntax is not the same as valid data</h2>
          <p>
            A validator checks that the text is well-formed JSON. It does not check that a field is the
            right type, that a required field exists, or that an API will accept the document — that
            needs a JSON Schema or the API&apos;s own documentation.
          </p>

          <h2>After it is valid</h2>
          <p>
            Format it with two-space indentation to read it comfortably, minify it for sending, or turn an
            array of records into a spreadsheet with <Link href="/developer/json-to-csv">JSON to CSV</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "unix-timestamps-explained",
    topic: "Web & developer",
    title: "Unix timestamps explained: seconds, milliseconds and time zones",
    seoTitle: "Unix Timestamps Explained (Seconds, ms, UTC)",
    description:
      "What a Unix timestamp is, how to tell seconds from milliseconds, why dates come out a day wrong, and the year 2038 problem — with examples you can check.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["timestamp-converter", "time-converter", "timezone-meeting-planner"],
    Body: function Body() {
      return (
        <>
          <p>
            Logs, databases and APIs are full of numbers like 1700000000. They are Unix timestamps — the
            most common way computers record a moment in time — and once you know the rules they are easy
            to read.
          </p>

          <h2>What a Unix timestamp is</h2>
          <p>
            A Unix timestamp counts the seconds since midnight UTC on 1 January 1970, a moment known as
            the Unix epoch. It has no time zone of its own: the same number means the same instant
            everywhere on Earth. That is exactly why systems store time this way — and convert to local
            time only when showing it to a person.
          </p>

          <h2>Some timestamps to recognise</h2>
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Moment (UTC)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0</td>
                <td>1 January 1970, 00:00:00</td>
              </tr>
              <tr>
                <td>1,000,000,000</td>
                <td>9 September 2001, 01:46:40</td>
              </tr>
              <tr>
                <td>1,700,000,000</td>
                <td>14 November 2023, 22:13:20</td>
              </tr>
              <tr>
                <td>2,000,000,000</td>
                <td>18 May 2033, 03:33:20</td>
              </tr>
              <tr>
                <td>2,147,483,647</td>
                <td>19 January 2038, 03:14:07</td>
              </tr>
            </tbody>
          </table>
          <p>
            Paste any of them into the <Link href="/developer/timestamp-converter">Timestamp Converter</Link>{" "}
            to see the date in UTC and in your own time zone side by side.
          </p>

          <h2>Seconds or milliseconds?</h2>
          <p>Count the digits of a present-day timestamp:</p>
          <ul>
            <li>
              <strong>10 digits</strong> — seconds. Used by Unix tools, most databases and many APIs.
            </li>
            <li>
              <strong>13 digits</strong> — milliseconds. Used by JavaScript, Java and many web APIs.
            </li>
            <li>
              <strong>16 digits</strong> — microseconds, used by some databases and logging systems.
            </li>
          </ul>
          <p>
            Read a millisecond value as seconds and you land tens of thousands of years in the future; read
            a seconds value as milliseconds and you land in January 1970. Both are common bugs, and the
            converter detects the unit from the size of the number and says which it assumed.
          </p>

          <h2>Why a date comes out one day wrong</h2>
          <p>
            A timestamp is an instant; a calendar date depends on where you are. 23:30 on the 5th in UTC
            is already the 6th in Asia and still the 5th in the Americas. If a date displays a day off,
            it is almost always being shown in a different time zone from the one it was recorded in. The
            fix is to decide explicitly which zone a date belongs to — store in UTC, convert at display
            time — rather than letting each system use its own default.
          </p>

          <h2>Getting the current timestamp</h2>
          <ul>
            <li>
              JavaScript: <code>Math.floor(Date.now() / 1000)</code> for seconds; <code>Date.now()</code>{" "}
              for milliseconds.
            </li>
            <li>
              Python: <code>int(time.time())</code>.
            </li>
            <li>
              Linux or macOS terminal: <code>date +%s</code>.
            </li>
          </ul>

          <h2>Writing dates for people and logs</h2>
          <p>
            When a date has to be readable, use the ISO 8601 format, such as{" "}
            <code>2026-10-01T09:30:00Z</code>. The Z means UTC; an offset such as +05:30 can be written
            instead. ISO dates sort correctly as text and are unambiguous, unlike 03/04/2026, which means
            different days in different countries.
          </p>

          <h2>Leap seconds and negative timestamps</h2>
          <p>
            Unix time ignores leap seconds: every day is treated as exactly 86,400 seconds. Dates before
            1970 are negative numbers, which most modern systems handle but some older ones do not.
          </p>

          <h2>The year 2038 problem</h2>
          <p>
            Systems that store a timestamp in a signed 32-bit integer can count only up to 2,147,483,647 —
            19 January 2038 at 03:14:07 UTC. One second later the number overflows. Modern platforms use
            64-bit values and are unaffected, but the limit still turns up in older software, embedded
            devices and data formats, which is why it is worth checking any system expected to run past
            2038.
          </p>

          <h2>Related tools</h2>
          <p>
            To convert a duration rather than a moment — seconds to hours, days to minutes — use the{" "}
            <Link href="/converters/time-converter">Time Converter</Link>. To find a meeting time across
            several real time zones, with daylight saving handled, use the{" "}
            <Link href="/converters/timezone-meeting-planner">Time Zone Meeting Planner</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "open-graph-link-previews",
    topic: "Web & developer",
    title: "How to fix link previews: Open Graph tags explained",
    seoTitle: "Open Graph Tags: How to Fix Link Previews",
    description:
      "Why a shared link shows the wrong image, no image or an old title, which Open Graph tags fix it, the right image size, and how to make platforms refresh the preview.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["og-preview", "svg-to-png", "compress-image"],
    Body: function Body() {
      return (
        <>
          <p>
            You share a link to your page and the preview shows a random image, a cookie banner, or no
            picture at all. Or you fixed the image last week and the old one still appears. Link
            previews are controlled by a handful of tags in the page&apos;s HTML, and by caches that
            are worth understanding.
          </p>

          <h2>How previews are made</h2>
          <p>
            When a link is shared, the platform&apos;s crawler downloads the page and reads its Open
            Graph tags. If they are missing, it guesses from the page title and whatever images it finds
            — which is where odd previews come from.
          </p>

          <h2>The tags that matter</h2>
          <ul>
            <li>
              <code>og:title</code> — the headline of the preview.
            </li>
            <li>
              <code>og:description</code> — one or two sentences under it.
            </li>
            <li>
              <code>og:image</code> — the picture, as a full address starting with https://.
            </li>
            <li>
              <code>og:url</code> — the canonical address of the page.
            </li>
            <li>
              <code>twitter:card</code> — for X, set to <code>summary_large_image</code> for a large
              picture. X falls back to the Open Graph title, description and image when its own tags are
              missing.
            </li>
          </ul>
          <p>Every page that will be shared should have its own title, description and image.</p>

          <h2>The image</h2>
          <ul>
            <li>
              <strong>Size:</strong> 1200 × 630 pixels, a 1.91:1 shape, works well across Facebook,
              LinkedIn and X&apos;s large card.
            </li>
            <li>
              <strong>Minimum:</strong> images below 200 × 200 pixels are not accepted by Facebook at all.
            </li>
            <li>
              <strong>Safe area:</strong> some layouts crop the edges, so keep text and logos away from
              them.
            </li>
            <li>
              <strong>Format and weight:</strong> JPG or PNG are safest. Keep the file reasonably small so
              crawlers fetch it quickly; <Link href="/image/compress-image">Compress Image</Link> helps.
            </li>
          </ul>
          <p>
            If your preview image is a logo or graphic drawn as SVG, render it to PNG first with{" "}
            <Link href="/image/svg-to-png">SVG to PNG</Link>; many platforms do not accept SVG previews.
          </p>

          <h2>Check a page&apos;s preview</h2>
          <ol>
            <li>
              Enter the page address in the <Link href="/developer/og-preview">Open Graph Preview</Link>.
            </li>
            <li>See how the link would look when shared, and read the list of tags found.</li>
            <li>Work through the flagged problems: missing tags, http image addresses, images that are too small, overlong titles.</li>
          </ol>
          <p>
            The page is fetched by this site&apos;s server — a browser is not allowed to read another
            site&apos;s HTML — as a logged-out visitor, which is how platform crawlers see it too. Only
            public addresses are accepted. To write tags from scratch, switch to the tag-writing mode
            and copy the result into your page&apos;s head.
          </p>

          <h2>Why the old preview keeps appearing</h2>
          <p>
            Platforms cache previews, sometimes for days. After fixing your tags, ask each platform to
            fetch the page again: Facebook&apos;s Sharing Debugger and LinkedIn&apos;s Post Inspector
            both have a button for it. Changing the image&apos;s file name also helps, because a cached
            image address will not be fetched again.
          </p>

          <h2>A complete set of tags</h2>
          <p>A typical page head contains lines like these, with your own values:</p>
          <ul>
            <li>
              <code className="break-all">{'<meta property="og:title" content="Spring sale: 20% off everything">'}</code>
            </li>
            <li>
              <code className="break-all">
                {'<meta property="og:description" content="Our biggest sale of the year, until 30 April.">'}
              </code>
            </li>
            <li>
              <code className="break-all">{'<meta property="og:image" content="https://example.com/share/spring-sale.jpg">'}</code>
            </li>
            <li>
              <code className="break-all">{'<meta property="og:url" content="https://example.com/sale">'}</code>
            </li>
            <li>
              <code className="break-all">{'<meta name="twitter:card" content="summary_large_image">'}</code>
            </li>
          </ul>
          <p>
            Most content management systems and website builders have fields for these, often under
            SEO or social sharing settings, so you may not need to edit HTML at all.
          </p>

          <h2>Sites built with JavaScript</h2>
          <p>
            Most preview crawlers read the HTML the server sends and do not run JavaScript. If your
            site adds its tags in the browser after loading, crawlers may never see them. The tags need
            to be in the HTML as delivered — through server-side rendering, static generation or your
            platform&apos;s settings.
          </p>

          <h2>Common mistakes</h2>
          <ul>
            <li>Relative image paths such as /images/share.png instead of a full https:// address.</li>
            <li>The same generic title and image on every page.</li>
            <li>An image behind a login, or blocked to crawlers.</li>
            <li>Pages that need a login: previews always show what a logged-out visitor sees.</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "how-to-write-a-robots-txt",
    topic: "Web & developer",
    title: "How to write a robots.txt file — with examples",
    seoTitle: "How to Write a robots.txt File (With Examples)",
    description:
      "What robots.txt can and cannot do, how the rules are matched, examples for common cases including AI crawlers, and the mistakes that hide a site from search.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["robots-txt-generator", "og-preview", "schema-generator"],
    Body: function Body() {
      return (
        <>
          <p>
            A robots.txt file tells crawlers which parts of a website they may fetch. It is a short text
            file, but a single wrong line can stop search engines crawling an entire site — so it is
            worth understanding before editing.
          </p>

          <h2>Where it goes</h2>
          <p>
            At the root of each host: <code>https://example.com/robots.txt</code>. A file in a subfolder
            is ignored, and each subdomain, such as shop.example.com, needs its own. The file name must be
            in lower case.
          </p>

          <h2>How the file is structured</h2>
          <p>
            The file is a set of groups. Each group starts with one or more <code>User-agent</code> lines
            naming crawlers, followed by <code>Allow</code> and <code>Disallow</code> rules for paths. A
            simple file that lets everyone in, keeps them out of an admin area and lists the sitemap:
          </p>
          <ul>
            <li>
              <code>User-agent: *</code>
            </li>
            <li>
              <code>Disallow: /admin/</code>
            </li>
            <li>
              <code>Sitemap: https://example.com/sitemap.xml</code>
            </li>
          </ul>
          <p>
            The asterisk group applies to every crawler not named elsewhere. An empty{" "}
            <code>Disallow:</code> line allows everything.
          </p>

          <h2>How rules are matched</h2>
          <ul>
            <li>
              <strong>A crawler follows only the groups that name it.</strong> If there is a group for
              Googlebot, Googlebot ignores the asterisk group entirely — it does not add the two together.
            </li>
            <li>
              <strong>The most specific rule wins</strong> — the one with the longest matching path. If
              an Allow and a Disallow are equally long, Allow wins.
            </li>
            <li>
              <strong>Paths are case-sensitive.</strong> <code>Disallow: /Private</code> does not block{" "}
              <code>/private</code>.
            </li>
            <li>
              <strong>Wildcards:</strong> <code>*</code> matches any run of characters and <code>$</code>{" "}
              marks the end of the address. <code>Disallow: /*.pdf$</code> blocks addresses ending in .pdf
              but not <code>/report.pdf?download=1</code>.
            </li>
          </ul>
          <p>
            These are the rules of the robots exclusion standard, RFC 9309, which Google and Bing follow.
          </p>

          <h2>Build and test a file</h2>
          <ol>
            <li>
              Open the <Link href="/generators/robots-txt-generator">Robots.txt Generator and Tester</Link>{" "}
              and start from a preset.
            </li>
            <li>Add the paths each crawler should stay out of, and your sitemap address.</li>
            <li>
              Switch to Test URLs, choose a crawler and enter some of your important addresses. The tester
              shows whether each is allowed and which rule decided it.
            </li>
            <li>Copy or download the file and upload it to the root of your site.</li>
          </ol>

          <h2>Blocking AI training crawlers</h2>
          <p>
            Several AI companies publish the names their crawlers use, such as GPTBot and Google-Extended,
            and say they respect robots.txt. A group naming them with <code>Disallow: /</code> asks them
            not to collect your content. Google-Extended and Applebot-Extended are control tokens rather
            than separate crawlers: blocking them opts content out of AI training without affecting Google
            Search or Apple&apos;s search features. Blocking does not remove anything already collected,
            and crawlers that ignore the file are not affected. The generator&apos;s AI crawler preset adds
            a group for the published names.
          </p>

          <h2>robots.txt does not remove pages from search</h2>
          <p>
            This is the most common misunderstanding. Disallow stops a crawler fetching a page, but the
            address can still appear in search results if other sites link to it — just without a
            description. To keep a page out of search results, let it be crawled and add a{" "}
            <code>noindex</code> robots meta tag. Blocking it in robots.txt would stop search engines seeing
            the noindex.
          </p>
          <p>
            Nor is robots.txt security. It is a public request that reputable crawlers honour; anyone can
            read it, and it can point curious people straight at the paths you listed. Protect private
            areas with logins.
          </p>

          <h2>Mistakes that hide a site</h2>
          <ul>
            <li>
              <strong>Leaving <code>Disallow: /</code> from a staging site</strong> on the live site — it
              blocks everything.
            </li>
            <li>
              <strong>Blocking CSS and JavaScript files.</strong> Search engines need them to render the
              page.
            </li>
            <li>
              <strong>Relying on Crawl-delay for Google.</strong> Google ignores it and sets its own pace;
              Bing and Yandex do honour it.
            </li>
          </ul>

          <h2>Related</h2>
          <p>
            Once crawlers can reach your pages, the rest is about what they find there: structured data
            from the <Link href="/generators/schema-generator">Schema Markup Generator</Link> and sharing
            tags checked with the <Link href="/developer/og-preview">Open Graph Preview</Link>.
          </p>
        </>
      );
    },
  },
];
