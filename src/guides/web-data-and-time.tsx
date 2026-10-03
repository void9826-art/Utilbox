import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-03";

export const webDataAndTimeGuides: Guide[] = [
  {
    slug: "open-a-json-file-in-excel",
    topic: "Web & developer",
    title: "How to open a JSON file in Excel",
    seoTitle: "How to Open a JSON File in Excel (or Convert to CSV)",
    description:
      "Two ways to get JSON data into a spreadsheet: Excel's Power Query import, or converting to CSV first. How nested data is flattened and how to avoid broken numbers.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["json-to-csv", "json-formatter", "json-validator"],
    Body: function Body() {
      return (
        <>
          <p>
            Data exports from apps, APIs and online services often arrive as JSON. Double-click the file and you get
            a wall of brackets in a text editor, not a table. Spreadsheets work in rows and columns, so the data has
            to be flattened first, either by Excel itself or by converting it to CSV.
          </p>

          <h2>Option 1: import with Excel</h2>
          <p>
            Excel for Microsoft 365 on Windows can read JSON directly through Power Query: Data → Get Data → From
            File → From JSON. Excel opens the Power Query editor, where you convert the data to a table and expand
            nested records into columns, then load it into a sheet. This is powerful and can be refreshed when the
            file changes, but it takes a few clicks to learn, and not every version of Excel has it.
          </p>

          <h2>Option 2: convert to CSV first</h2>
          <ol>
            <li>
              Paste the JSON into <Link href="/developer/json-to-csv">JSON to CSV</Link>. It expects an array of
              objects, or an object that contains one.
            </li>
            <li>
              Choose how to handle nested arrays: separate columns (tags.0, tags.1), joined into one cell, or kept as
              JSON text in one cell.
            </li>
            <li>
              Choose the delimiter. Use a semicolon if your Excel uses commas as decimal separators, as in much of
              Europe.
            </li>
            <li>Keep the header row on, check the preview, and download the CSV.</li>
          </ol>
          <p>
            Nested objects become dotted column names, such as <code>address.city</code>. The tool warns when some
            records are missing fields, so empty cells do not surprise you later. The conversion runs in your browser,
            which matters for customer data.
          </p>

          <h2>If the JSON will not convert</h2>
          <p>
            Exports are sometimes truncated or contain errors. Paste the file into the{" "}
            <Link href="/developer/json-validator">JSON Validator</Link> first; it shows the exact line and a
            plain-English explanation. The guide to{" "}
            <Link href="/guides/how-to-fix-invalid-json">fixing invalid JSON</Link> covers the common causes. Very
            large exports may contain one JSON object per line (often called JSON Lines); those need wrapping into an
            array before conversion.
          </p>

          <h2>Opening the CSV without breaking the data</h2>
          <p>Double-clicking a CSV lets Excel guess each column&apos;s type, and it guesses wrong in predictable ways:</p>
          <ul>
            <li>
              <strong>Leading zeros vanish:</strong> postcodes, phone numbers and IDs like 00042 become 42.
            </li>
            <li>
              <strong>Long numbers turn into scientific notation</strong> and lose digits after the fifteenth.
            </li>
            <li>
              <strong>Text that looks like a date becomes a date</strong>, such as gene names or product codes like
              MAR1.
            </li>
            <li>
              <strong>Accented characters garble</strong> if Excel reads a UTF-8 file in another encoding.
            </li>
          </ul>
          <p>
            Instead, use Data → From Text/CSV, choose UTF-8 as the file origin, and set ID and code columns to Text
            before loading.
          </p>

          <h2>Spreadsheet safety</h2>
          <p>
            A value beginning with =, +, - or @ can be treated as a formula when a CSV is opened in a spreadsheet,
            which attackers can abuse. If the data came from users or the internet, turn on &ldquo;Protect against
            formula injection&rdquo; in JSON to CSV, which prefixes those values so they are shown as text.
          </p>

          <h2>Just want to read it?</h2>
          <p>
            If you only need to look at the data, the <Link href="/developer/json-formatter">JSON Formatter</Link>{" "}
            indents it so the structure is readable, without converting anything.
          </p>
        </>
      );
    },
  },

  {
    slug: "year-2038-problem",
    topic: "Web & developer",
    title: "The year 2038 problem explained",
    seoTitle: "The Year 2038 Problem Explained Simply",
    description:
      "On 19 January 2038, 32-bit Unix time runs out and some systems will jump back to 1901. What exactly happens, what is affected, and how to check your own software.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["timestamp-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            Many computer systems store time as a count of seconds since 1 January 1970, UTC. When that count is kept
            in a signed 32-bit integer, it has a ceiling, and the ceiling arrives at 03:14:07 UTC on 19 January 2038.
            One second later, affected systems overflow, and the date can jump back to December 1901.
          </p>

          <h2>The numbers</h2>
          <ul>
            <li>A signed 32-bit integer can hold values up to 2,147,483,647.</li>
            <li>2,147,483,647 seconds after the Unix epoch is 2038-01-19 03:14:07 UTC.</li>
            <li>
              Adding one more second wraps the value to −2,147,483,648, which counts backwards from 1970 to 13
              December 1901, 20:45:52 UTC.
            </li>
          </ul>
          <p>
            You can see the boundary yourself: enter <code>2147483647</code> in the{" "}
            <Link href="/developer/timestamp-converter">Timestamp Converter</Link> and it shows the last second
            before the limit. For how Unix time works in general, see{" "}
            <Link href="/guides/unix-timestamps-explained">Unix timestamps explained</Link>.
          </p>

          <h2>What is affected</h2>
          <ul>
            <li>
              <strong>Embedded devices</strong> with long lives and 32-bit processors: industrial controllers, older
              routers, car systems, medical and building equipment. These are the biggest concern because they are
              hard to update.
            </li>
            <li>
              <strong>File formats and protocols</strong> that define a 32-bit seconds field, even on modern
              computers.
            </li>
            <li>
              <strong>Databases</strong> with 32-bit timestamp columns. Some database timestamp types have a range
              that ends in January 2038.
            </li>
            <li>
              <strong>Old compiled software</strong> built for 32-bit systems.
            </li>
          </ul>

          <h2>What is not affected</h2>
          <p>
            Modern 64-bit operating systems, languages and libraries store time in 64 bits, which lasts for billions
            of years. JavaScript dates use a 64-bit floating-point count of milliseconds and are fine. Most phones,
            laptops and servers in use today will not notice 2038.
          </p>

          <h2>Problems can start early</h2>
          <p>
            Software that calculates dates in the future hits the limit before 2038. A system computing an expiry
            date 15 years ahead, a loan schedule or a certificate validity can fail as soon as the result crosses
            January 2038, and that has already happened in some systems. Anything that works with long future dates
            should be tested now.
          </p>

          <h2>How to check your systems</h2>
          <ol>
            <li>List devices and software expected to still be running in 2038.</li>
            <li>Check whether timestamps are stored in 32-bit fields, in code, database columns and file formats.</li>
            <li>
              Test with dates after the limit: set a test system&apos;s clock to 2038-01-19 03:14:00 UTC and watch
              what happens, or feed future dates into functions that parse and store them.
            </li>
            <li>Migrate columns and fields to 64-bit types or to proper date-time types.</li>
          </ol>

          <h2>Milliseconds versus seconds</h2>
          <p>
            Many systems now store milliseconds, which never fit in 32 bits at all and are always 64-bit. If you see
            a 13-digit timestamp, it is milliseconds. A 10-digit one is seconds, and if it is stored in a 32-bit
            field, it is the kind to check. The Timestamp Converter detects the unit automatically.
          </p>

          <h2>Is it like Y2K?</h2>
          <p>
            In spirit, yes: a known limit with a known date, mostly fixable with time and money. The difference is
            that the riskiest systems are embedded devices that nobody thinks of as computers. As with Y2K, the
            outcome depends on how much checking happens before the date.
          </p>
        </>
      );
    },
  },

  {
    slug: "iso-8601-date-format",
    topic: "Web & developer",
    title: "ISO 8601 date format explained (YYYY-MM-DD and beyond)",
    seoTitle: "ISO 8601 Date Format Explained With Examples",
    description:
      "2026-10-03T14:30:00Z decoded: the international date and time format, time zones and offsets, week numbers and durations, and why it is the safest format to use.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["timestamp-converter", "timezone-meeting-planner"],
    Body: function Body() {
      return (
        <>
          <p>
            Is 03/10/2026 the 3rd of October or the 10th of March? It depends on who wrote it. ISO 8601, the
            international standard for dates and times, removes the guesswork: 2026-10-03 can only mean one day.
            It is used in data files, APIs, databases and file names around the world.
          </p>

          <h2>Dates</h2>
          <ul>
            <li>
              <code>2026-10-03</code>: year, month, day, always four-two-two digits, separated by hyphens.
            </li>
            <li>
              <code>2026-10</code>: a month.
            </li>
            <li>
              <code>2026-W40</code>: ISO week 40 of 2026; <code>2026-W40-6</code> is its Saturday.
            </li>
            <li>
              <code>2026-276</code>: day 276 of the year, an ordinal date, which is the same 3 October.
            </li>
          </ul>

          <h2>Times and time zones</h2>
          <ul>
            <li>
              <code>14:30:00</code>: 24-hour clock, hours, minutes, seconds.
            </li>
            <li>
              <code>2026-10-03T14:30:00</code>: date and time joined by T. Without a zone, this is local time
              somewhere unspecified, which is ambiguous for anything shared.
            </li>
            <li>
              <code>2026-10-03T14:30:00Z</code>: Z means UTC.
            </li>
            <li>
              <code>2026-10-03T20:15:00+05:45</code>: an offset from UTC, here Nepal time. It is the same moment as
              14:30 UTC.
            </li>
            <li>
              <code>2026-10-03T14:30:00.250Z</code>: fractions of a second after a decimal point.
            </li>
          </ul>
          <p>
            The <Link href="/developer/timestamp-converter">Timestamp Converter</Link> shows any Unix timestamp in ISO
            8601 form, both in UTC and with your own offset, along with the day of the year. Pick a date and time and
            it gives the timestamp and ISO form the other way round.
          </p>

          <h2>Durations</h2>
          <p>
            ISO 8601 also writes lengths of time, starting with P for period: <code>P3D</code> is three days,{" "}
            <code>PT2H30M</code> is two and a half hours, and <code>P1Y2M</code> is one year and two months. The T
            separates date parts from time parts, which is why <code>P1M</code> is a month but <code>PT1M</code> is a
            minute. You meet these in video lengths, schema markup and calendar data.
          </p>

          <h2>Why it is the safest format</h2>
          <ul>
            <li>
              <strong>Unambiguous</strong> in every country: nobody reads 2026-10-03 as March.
            </li>
            <li>
              <strong>Sorts correctly</strong> as plain text, because the largest unit comes first. That makes it
              ideal for file names; see <Link href="/guides/name-files-so-they-sort-correctly">naming files so they sort</Link>.
            </li>
            <li>
              <strong>Machine-readable:</strong> every major programming language and database can parse it.
            </li>
          </ul>

          <h2>ISO weeks</h2>
          <p>
            ISO weeks start on Monday, and week 1 is the week containing the year&apos;s first Thursday. So the first
            days of January can belong to the last week of the previous year, and the ISO week-year can differ from
            the calendar year around New Year. Week numbers in some countries&apos; calendars, and in some
            spreadsheet functions, follow different rules, so state which system you mean.
          </p>

          <h2>In spreadsheets</h2>
          <p>
            Excel and Google Sheets store dates as numbers and display them in your regional format. To write a date
            as ISO 8601 text, use <code>=TEXT(A2,&quot;yyyy-mm-dd&quot;)</code>. To keep dates in that form when
            typing, set the column&apos;s number format to <code>yyyy-mm-dd</code>. Exported CSV files are safest with
            ISO dates, because every program reads them the same way.
          </p>

          <h2>Common mistakes</h2>
          <ul>
            <li>Leaving out the zone or offset on times shared between systems.</li>
            <li>Writing single-digit months or days, such as 2026-1-5. Use 2026-01-05.</li>
            <li>Using a space instead of T. Many systems accept it, but strict parsers do not.</li>
            <li>Confusing the offset sign: +05:45 means ahead of UTC.</li>
          </ul>
          <p>
            For time zone abbreviations, see <Link href="/guides/est-edt-utc-gmt-explained">EST vs EDT, GMT vs UTC</Link>.
            For planning across zones, use the <Link href="/converters/timezone-meeting-planner">Time Zone Meeting Planner</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "base64-data-uri-images",
    topic: "Web & developer",
    title: "How to embed an image in HTML or CSS with a Base64 data URI",
    seoTitle: "Base64 Data URI Images: How and When to Use Them",
    description:
      "A data URI puts an image directly inside HTML, CSS or JSON. How to make one, the 33% size cost, where it helps, and why it often fails in emails.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["base64-encoder", "base64-decoder", "compress-image"],
    Body: function Body() {
      return (
        <>
          <p>
            Normally an image on a web page is a separate file the browser fetches. A data URI puts the image
            directly in the code instead, as a long string of text. That saves a request and keeps a component
            self-contained, at a cost that is easy to underestimate.
          </p>

          <h2>What a data URI looks like</h2>
          <p>
            <code className="break-all">data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA…</code>
          </p>
          <ul>
            <li>
              <code>data:</code> says the content follows inline.
            </li>
            <li>
              <code>image/png</code> is the media type.
            </li>
            <li>
              <code>;base64,</code> says the bytes are Base64-encoded.
            </li>
            <li>The rest is the image itself, as text.</li>
          </ul>

          <h2>Make one step by step</h2>
          <ol>
            <li>
              Shrink the image first with <Link href="/image/compress-image">Compress Image</Link>. Every byte saved
              here saves a third more in the data URI.
            </li>
            <li>
              Open the <Link href="/developer/base64-encoder">Base64 Encoder</Link>, choose a file and tick
              &ldquo;Produce a data URI&rdquo;.
            </li>
            <li>Copy the output and use it where you would normally put an image address.</li>
          </ol>
          <p>
            In HTML: <code>&lt;img src=&quot;data:image/png;base64,…&quot; alt=&quot;…&quot;&gt;</code>. In CSS:{" "}
            <code>background-image: url(&quot;data:image/png;base64,…&quot;)</code>.
          </p>

          <h2>The size cost</h2>
          <p>
            Base64 represents every 3 bytes as 4 characters, so the encoded image is about 33% larger than the file.
            The encoder shows the overhead. A 30 KB image becomes about 40 KB of text. Compression on the web server
            claws some of that back, but not all.
          </p>

          <h2>When a data URI helps</h2>
          <ul>
            <li>Tiny icons and decorations, a few hundred bytes to a couple of kilobytes, where a separate request costs more than the extra bytes.</li>
            <li>Self-contained HTML files, such as a report or an offline page that must work without other files.</li>
            <li>Small images inside JSON or configuration, where a file path is not possible.</li>
          </ul>

          <h2>When it hurts</h2>
          <ul>
            <li>
              <strong>Large images:</strong> the page or stylesheet becomes much bigger and must be fully downloaded
              before anything renders.
            </li>
            <li>
              <strong>Repeated images:</strong> a separate file is cached once and reused across pages; a data URI is
              downloaded again with every page or stylesheet that contains it.
            </li>
            <li>
              <strong>Emails:</strong> many email programs, including popular webmail services, block or strip
              data-URI images. Use hosted images or attachments for email instead.
            </li>
          </ul>

          <h2>Fonts as data URIs</h2>
          <p>
            Some tools inline web fonts into CSS as data URIs. It avoids a separate request, but a font file is often
            tens of kilobytes, so the stylesheet grows by a third more than that, and the browser cannot show any
            styled text until the whole stylesheet has arrived. For most sites, a normal WOFF2 file, preloaded if it
            matters, is faster.
          </p>

          <h2>SVG without Base64</h2>
          <p>
            SVG images are already text. Instead of Base64, they can be URL-encoded into a data URI such as{" "}
            <code>data:image/svg+xml,%3Csvg…</code>, which is usually smaller than the Base64 version. The{" "}
            <Link href="/developer/url-encoder">URL Encoder</Link> handles the escaping.
          </p>

          <h2>Turn one back into a file</h2>
          <p>
            Found a data URI in someone&apos;s code and want the image? Paste it into the{" "}
            <Link href="/developer/base64-decoder">Base64 Decoder</Link>, which accepts data URIs directly and lets you
            download the result as a file. For Base64 in general, see{" "}
            <Link href="/guides/what-is-base64">what Base64 is and when to use it</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-decode-a-jwt",
    topic: "Web & developer",
    title: "How to decode a JWT and read its claims",
    seoTitle: "How to Decode a JWT (JSON Web Token) Safely",
    description:
      "A JWT is three Base64URL parts separated by dots. How to read the header and payload, what the common claims mean, and why decoding is not the same as verifying.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["base64-decoder", "timestamp-converter", "json-formatter"],
    Body: function Body() {
      return (
        <>
          <p>
            JSON Web Tokens, or JWTs, carry login sessions and API permissions in countless applications. When
            something goes wrong, such as a user being logged out too early or an API refusing a request, the first
            step is often to look inside the token. That is easy, because a standard JWT is encoded, not encrypted.
          </p>

          <h2>The three parts</h2>
          <p>
            A JWT looks like <code className="break-all">eyJhbGciOi….eyJzdWIiOi….SflKxwRJ…</code>: three sections
            separated by dots.
          </p>
          <ol>
            <li>
              <strong>Header:</strong> the token type and signing algorithm, such as HS256 or RS256.
            </li>
            <li>
              <strong>Payload:</strong> the claims: who the token is for, who issued it, when it expires, and any
              custom data.
            </li>
            <li>
              <strong>Signature:</strong> proof that the header and payload have not been changed, created with a
              secret or private key.
            </li>
          </ol>
          <p>The header and payload are JSON, encoded with Base64URL, a web-safe variant of Base64 without padding.</p>

          <h2>Decode it step by step</h2>
          <ol>
            <li>Copy the token and split it at the dots.</li>
            <li>
              Paste the second part, the payload, into the <Link href="/developer/base64-decoder">Base64 Decoder</Link>.
              It handles the URL-safe alphabet and missing padding automatically.
            </li>
            <li>
              Read the JSON, or paste it into the <Link href="/developer/json-formatter">JSON Formatter</Link> to make
              it easier to scan.
            </li>
            <li>Do the same with the first part to see the header.</li>
          </ol>
          <p>
            The decoding happens in your browser. That matters: a live token is a key to an account, and pasting it
            into a website that sends it to a server is a real risk.
          </p>

          <h2>Common claims</h2>
          <ul>
            <li>
              <code>iss</code>: issuer, the service that created the token.
            </li>
            <li>
              <code>sub</code>: subject, usually the user ID.
            </li>
            <li>
              <code>aud</code>: audience, which service the token is meant for.
            </li>
            <li>
              <code>exp</code>: expiry time, as a Unix timestamp in seconds.
            </li>
            <li>
              <code>iat</code> and <code>nbf</code>: issued at, and not valid before.
            </li>
          </ul>
          <p>
            To read the times, paste <code>exp</code> or <code>iat</code> into the{" "}
            <Link href="/developer/timestamp-converter">Timestamp Converter</Link>. A token that expires a few minutes
            after it was issued explains sudden logouts; a token whose <code>nbf</code> is in the future suggests a
            clock problem on one of the servers.
          </p>

          <h2>Decoding is not verifying</h2>
          <p>
            Anyone can decode a JWT, and anyone can create one with any claims they like. What makes a token
            trustworthy is the signature, checked with the right key by the server. Never make security decisions in
            client code based on decoded claims alone, and never trust a token whose header says{" "}
            <code>&quot;alg&quot;: &quot;none&quot;</code>. Verification belongs in the server, using a well-maintained
            library.
          </p>

          <h2>Do not put secrets in a JWT</h2>
          <p>
            Because the payload is readable by anyone who holds the token, it should never contain passwords,
            personal data beyond what is necessary, or internal secrets. If the contents must be hidden, the token
            needs to be encrypted (a JWE, which has five parts rather than three), not just signed.
          </p>

          <h2>Handle real tokens with care</h2>
          <ul>
            <li>Prefer a token from a test account when debugging.</li>
            <li>Do not paste tokens into chat, tickets or logs.</li>
            <li>If a production token has been exposed, revoke it or rotate the signing key.</li>
          </ul>
          <p>
            For the encoding itself, see <Link href="/guides/what-is-base64">what Base64 is</Link>. For timestamps, see{" "}
            <Link href="/guides/unix-timestamps-explained">Unix timestamps explained</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "url-query-parameters-explained",
    topic: "Web & developer",
    title: "URL query parameters explained: what comes after the ?",
    seoTitle: "URL Query Parameters Explained (?, &, # and =)",
    description:
      "How to read the part of a web address after the question mark: keys and values, ampersands, fragments, encoding and tracking tags, and what not to put in a URL.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["url-decoder", "url-encoder", "utm-builder"],
    Body: function Body() {
      return (
        <>
          <p>
            Web addresses often end in a long tail like <code className="break-all">?q=red+shoes&amp;size=8&amp;sort=price#reviews</code>.
            That tail is not random. It is a set of instructions to the page, and once you can read it, you can
            debug links, strip tracking and build URLs that work.
          </p>

          <h2>The parts of a URL</h2>
          <p>
            Take <code className="break-all">https://shop.example.com/search?q=red+shoes&amp;size=8#reviews</code>:
          </p>
          <ul>
            <li>
              <code>https</code>: the protocol.
            </li>
            <li>
              <code>shop.example.com</code>: the host.
            </li>
            <li>
              <code>/search</code>: the path, which page.
            </li>
            <li>
              <code>?q=red+shoes&amp;size=8</code>: the query string, the parameters.
            </li>
            <li>
              <code>#reviews</code>: the fragment, a position or state within the page.
            </li>
          </ul>

          <h2>How parameters are written</h2>
          <ul>
            <li>The query starts after the first <code>?</code>.</li>
            <li>
              Each parameter is a <code>key=value</code> pair.
            </li>
            <li>
              Pairs are separated by <code>&amp;</code>.
            </li>
            <li>
              Keys can repeat, such as <code>colour=red&amp;colour=blue</code>; how the site handles that is up to the
              site.
            </li>
            <li>The order usually does not matter, though some systems treat different orders as different URLs.</li>
          </ul>

          <h2>Encoding: why you see %20 and +</h2>
          <p>
            Some characters have special meaning in URLs, and others, such as spaces and non-English letters, are not
            allowed as-is. They are percent-encoded: a space becomes <code>%20</code>, an ampersand inside a value
            becomes <code>%26</code>. In query strings submitted by forms, a space is often written as <code>+</code>.
            The guide to <Link href="/guides/url-encoding-explained">URL encoding</Link> covers the details.
          </p>

          <h2>Break a URL down</h2>
          <p>
            Paste any long address into the <Link href="/developer/url-decoder">URL Decoder</Link>. It decodes the
            percent-encoding and breaks the address into protocol, host, path, each query parameter and the fragment.
            It can treat + as a space and unwrap addresses that were encoded more than once. To build a value safely,
            use the <Link href="/developer/url-encoder">URL Encoder</Link> on that value only, not the whole URL.
          </p>

          <h2>The fragment stays in the browser</h2>
          <p>
            Everything after <code>#</code> is not sent to the server. It tells the browser where to scroll or, in
            web apps, which view to show. That is why changing only the fragment does not reload a page.
          </p>

          <h2>Tracking parameters</h2>
          <p>
            Many links carry parameters that only exist for analytics: <code>utm_source</code>,{" "}
            <code>utm_campaign</code> and click IDs added by ad and social platforms. They do not change the page.
            Removing them before sharing a link makes it shorter and stops passing on tracking information. To add
            your own campaign tags properly, use the <Link href="/generators/utm-builder">UTM Link Builder</Link>; see{" "}
            <Link href="/guides/utm-parameters-explained">UTM parameters explained</Link>.
          </p>

          <h2>Parameters and search engines</h2>
          <p>
            To a search engine, <code>/shoes?sort=price</code> and <code>/shoes?sort=name</code> are different URLs
            showing the same products. Sites with many filter and sort options can create thousands of near-duplicate
            addresses. A canonical tag on each variation pointing to the main version tells search engines which one
            to index, and keeping internal links to the clean version helps too.
          </p>

          <h2>What not to put in a URL</h2>
          <ul>
            <li>
              Passwords, tokens and personal data. URLs are saved in browser history, server logs and analytics, and
              can be passed to other sites in the Referer header.
            </li>
            <li>Very long data. Browsers and servers have length limits; use a form submission instead.</li>
            <li>Anything that must not be bookmarked or shared, since a URL is made to be copied.</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "uuid-vs-auto-increment-id",
    topic: "Web & developer",
    title: "UUID vs auto-increment ID: which primary key to use",
    seoTitle: "UUID vs Auto-Increment ID: Which Primary Key?",
    description:
      "Auto-increment IDs are small and ordered; UUIDs are unique anywhere and hard to guess. The trade-offs for databases and APIs, and why UUIDv7 changes the answer.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["uuid-generator"],
    Body: function Body() {
      return (
        <>
          <p>
            Every database table needs a primary key. The two common choices are an auto-incrementing integer, where
            the database hands out 1, 2, 3, and a UUID, a 128-bit identifier generated by anyone, anywhere. Both work.
            The right choice depends on how records are created, exposed and stored.
          </p>

          <h2>Auto-increment integers</h2>
          <ul>
            <li>
              <strong>Small:</strong> 4 or 8 bytes, so indexes and foreign keys stay compact.
            </li>
            <li>
              <strong>Ordered:</strong> new rows go at the end of the index, which is efficient for inserts.
            </li>
            <li>
              <strong>Readable:</strong> &ldquo;order 4821&rdquo; is easy to say on a phone call.
            </li>
            <li>
              <strong>Guessable:</strong> if <code>/invoice/4821</code> exists, so does 4822. Without proper
              permission checks, people can walk through other customers&apos; records.
            </li>
            <li>
              <strong>Revealing:</strong> IDs leak how many users or orders you have and how fast they grow.
            </li>
            <li>
              <strong>Central:</strong> only the database can hand them out, which complicates offline creation,
              merging databases and sharding.
            </li>
          </ul>

          <h2>UUIDs</h2>
          <ul>
            <li>
              <strong>Unique anywhere:</strong> a phone, a browser or a second database can create IDs with no
              coordination, and merging data never clashes.
            </li>
            <li>
              <strong>Not guessable:</strong> random UUIDs cannot be enumerated (though permission checks are still
              required).
            </li>
            <li>
              <strong>Larger:</strong> 16 bytes, four times a standard integer, and more if stored as 36-character
              text.
            </li>
            <li>
              <strong>Awkward for humans</strong> to read aloud or type.
            </li>
          </ul>

          <h2>The index problem with UUIDv4, and v7</h2>
          <p>
            Version 4 UUIDs are fully random. In databases that keep table rows ordered by primary key, random keys
            land all over the index, which causes page splits, more disk writes and poorer caching as the table grows.
            Version 7 UUIDs, standardised in 2024, start with a timestamp, so new IDs sort after older ones and insert
            efficiently, like an auto-increment, while remaining unique without coordination. For new projects that
            want UUIDs as primary keys, v7 is usually the better choice. See{" "}
            <Link href="/guides/what-is-a-uuid">what a UUID is: version 4 vs version 7</Link>.
          </p>

          <h2>Store them properly</h2>
          <ul>
            <li>Use the database&apos;s native UUID type where there is one.</li>
            <li>Otherwise store 16 bytes of binary, not a 36-character string, which more than doubles the size.</li>
            <li>Generate v7 in the application or database consistently, so ordering holds.</li>
          </ul>

          <h2>Sorting by creation time</h2>
          <p>
            With auto-increment IDs, sorting by ID gives creation order for free. With UUIDv4 it does not, so tables
            need a separate <code>created_at</code> column for that. UUIDv7 restores the property, because its leading
            timestamp makes IDs sort roughly by creation time, though a real timestamp column is still clearer for
            reports.
          </p>

          <h2>A common compromise</h2>
          <p>
            Many systems use both: an integer primary key for internal joins, and a UUID column, indexed and unique,
            as the public identifier in URLs and APIs. Internal efficiency stays, and public IDs cannot be guessed or
            counted.
          </p>

          <h2>Quick decision guide</h2>
          <ul>
            <li>Small internal app, single database: auto-increment is fine.</li>
            <li>IDs visible in URLs or APIs: UUID, or a separate public UUID.</li>
            <li>Offline or client-side creation, multiple databases: UUIDv7.</li>
          </ul>
          <p>
            The <Link href="/generators/uuid-generator">UUID Generator</Link> creates version 4 and version 7 UUIDs,
            plus NIL and ULID-style output, for testing schemas and seeding data.
          </p>
        </>
      );
    },
  },

  {
    slug: "camelcase-vs-snake-case",
    topic: "Web & developer",
    title: "camelCase vs snake_case vs kebab-case: which naming style where",
    seoTitle: "camelCase vs snake_case vs kebab-case",
    description:
      "The naming conventions used in JavaScript, Python, CSS, URLs, databases and environment variables, with examples, and how to convert between them quickly.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["case-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            Code names cannot contain spaces, so programmers join words in several ways: <code>userName</code>,{" "}
            <code>user_name</code>, <code>user-name</code>, <code>UserName</code>, <code>USER_NAME</code>. None is
            better in general. Each language and context has a convention, and following it makes code easier to
            read and avoids bugs.
          </p>

          <h2>The styles</h2>
          <table>
            <thead>
              <tr>
                <th>Style</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>camelCase</td>
                <td>
                  <code>orderTotal</code>
                </td>
              </tr>
              <tr>
                <td>PascalCase</td>
                <td>
                  <code>OrderTotal</code>
                </td>
              </tr>
              <tr>
                <td>snake_case</td>
                <td>
                  <code>order_total</code>
                </td>
              </tr>
              <tr>
                <td>CONSTANT_CASE</td>
                <td>
                  <code>ORDER_TOTAL</code>
                </td>
              </tr>
              <tr>
                <td>kebab-case</td>
                <td>
                  <code>order-total</code>
                </td>
              </tr>
            </tbody>
          </table>

          <h2>Where each is used</h2>
          <ul>
            <li>
              <strong>JavaScript and TypeScript:</strong> camelCase for variables and functions, PascalCase for
              classes and React components, CONSTANT_CASE for fixed constants.
            </li>
            <li>
              <strong>Python:</strong> snake_case for variables and functions, PascalCase for classes, CONSTANT_CASE
              for constants, as set out in the PEP 8 style guide.
            </li>
            <li>
              <strong>Java, C# and Kotlin:</strong> camelCase for variables and methods (PascalCase for methods in
              C#), PascalCase for types.
            </li>
            <li>
              <strong>CSS:</strong> kebab-case for property names and usually for class names, such as{" "}
              <code>font-size</code> and <code>.nav-link</code>.
            </li>
            <li>
              <strong>URLs and file names:</strong> kebab-case. Google&apos;s guidance recommends hyphens rather than
              underscores to separate words in URLs.
            </li>
            <li>
              <strong>SQL databases:</strong> snake_case for tables and columns, because many databases are
              case-insensitive or fold case.
            </li>
            <li>
              <strong>Environment variables:</strong> CONSTANT_CASE, such as <code>DATABASE_URL</code>.
            </li>
            <li>
              <strong>JSON APIs:</strong> varies. JavaScript-heavy APIs tend to use camelCase; many others use
              snake_case. Pick one per API and never mix them.
            </li>
          </ul>

          <h2>Why kebab-case cannot be used everywhere</h2>
          <p>
            In most programming languages, a hyphen is the minus sign, so <code>order-total</code> means
            &ldquo;order minus total&rdquo;. That is why kebab-case lives in CSS, URLs, file names and HTML
            attributes, where hyphens are allowed, and not in variable names.
          </p>

          <h2>Convert between styles</h2>
          <p>
            Paste names or a list into the <Link href="/text/case-converter">Case Converter</Link> and choose
            camelCase, PascalCase, snake_case, CONSTANT_CASE or kebab-case. It is handy when mapping database columns
            to object properties, turning headings into URL slugs, or renaming a batch of variables.
          </p>

          <h2>Mapping between layers</h2>
          <p>
            A typical web app meets several conventions at once: snake_case columns in the database, camelCase
            properties in JavaScript, kebab-case in URLs. Convert at the boundary, in one place, rather than letting
            both styles leak through the code. Most database libraries and serialisers can map{" "}
            <code>order_total</code> to <code>orderTotal</code> automatically; turn that on once and the rest of the
            code only ever sees one style.
          </p>

          <h2>Acronyms</h2>
          <p>
            Decide how to treat acronyms and be consistent: <code>userId</code> or <code>userID</code>,{" "}
            <code>HttpClient</code> or <code>HTTPClient</code>. Many style guides prefer treating acronyms as words
            (<code>userId</code>, <code>HttpClient</code>), because <code>parseHTMLURL</code> is hard to read.
          </p>

          <h2>Good names, not just good case</h2>
          <ul>
            <li>Start booleans with is, has or can: <code>isActive</code>, <code>has_paid</code>.</li>
            <li>Use plurals for lists: <code>orders</code>, not <code>orderList</code> or <code>order</code>.</li>
            <li>Spell words out: <code>customerAddress</code> beats <code>custAddr</code>.</li>
            <li>Name functions with verbs: <code>calculateTotal</code>, <code>send_invoice</code>.</li>
            <li>Include units where they matter: <code>timeoutMs</code>, <code>price_cents</code>.</li>
          </ul>

          <h2>Consistency beats preference</h2>
          <p>
            When joining an existing project, follow its style even if you prefer another. Linters and formatters can
            enforce naming rules automatically. For capitalising headings in prose, see{" "}
            <Link href="/guides/title-case-rules">title case rules</Link>.
          </p>
        </>
      );
    },
  },
];
