import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-02";

export const webBasicsGuides: Guide[] = [
  {
    slug: "what-is-base64",
    topic: "Web & developer",
    title: "What is Base64, and when should you use it?",
    seoTitle: "What Is Base64 and When Should You Use It?",
    description:
      "How Base64 turns any data into plain text, why it makes things a third bigger, where it is used — data URIs, email, tokens — and why it is not encryption.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["base64-encoder", "base64-decoder", "url-encoder"],
    Body: function Body() {
      return (
        <>
          <p>
            You meet Base64 as long strings of letters and numbers ending in one or two equals signs: in
            email source, inside web pages, in API responses and login tokens. It looks like gibberish, but
            it is a simple and completely reversible way of writing data as text.
          </p>

          <h2>What problem it solves</h2>
          <p>
            Many systems were built to carry text, not arbitrary bytes. Email, JSON, URLs and HTTP headers
            can mangle binary data such as an image or a file. Base64 rewrites any data using only 64 safe
            characters — A to Z, a to z, 0 to 9, plus and slash — so it survives the journey intact and can
            be turned back into the original bytes at the other end.
          </p>

          <h2>How it works</h2>
          <p>
            Base64 takes three bytes at a time — 24 bits — and splits them into four groups of six bits.
            Each group is a number from 0 to 63, written as one of the 64 characters. When the data does
            not divide evenly into threes, one or two equals signs pad the end.
          </p>
          <ul>
            <li>&ldquo;Man&rdquo; becomes <code>TWFu</code>.</li>
            <li>&ldquo;Hi&rdquo; becomes <code>SGk=</code> — one padding sign.</li>
            <li>&ldquo;café&rdquo; becomes <code>Y2Fmw6k=</code>, because é is two bytes in UTF-8.</li>
          </ul>

          <h2>Why Base64 is a third bigger</h2>
          <p>
            Every three bytes become four characters, so encoded data is about 33% larger than the original.
            That is the price of making it text-safe, and it is why embedding large files as Base64 is
            usually a poor idea.
          </p>

          <h2>Base64 is not encryption</h2>
          <p>
            There is no key and no secret. Anyone who has a Base64 string can decode it in a second. A
            password, token or personal detail &ldquo;hidden&rdquo; in Base64 is not hidden at all. Use real
            encryption to protect data; use Base64 only to transport it.
          </p>

          <h2>Encode and decode step by step</h2>
          <ol>
            <li>
              Paste text or drop in a file in the <Link href="/developer/base64-encoder">Base64 Encoder</Link>.
            </li>
            <li>Choose standard or URL-safe output, and optionally a complete data URI for a file.</li>
            <li>Copy the result.</li>
          </ol>
          <p>
            To reverse it, paste into the <Link href="/developer/base64-decoder">Base64 Decoder</Link>. If
            the result is text, it is shown; if it is a file, the type is recognised from its first bytes and
            you can download it. Text is converted to UTF-8 bytes first, so accented letters and emoji work.
            Everything runs in your browser.
          </p>

          <h2>URL-safe Base64</h2>
          <p>
            Plus and slash have special meanings in web addresses, so a URL-safe variant swaps them for minus
            and underscore and usually drops the padding. Use it for values that go into URLs, file names and
            tokens. The decoder accepts both forms. For ordinary text in URLs, percent-encoding is the right
            tool instead — see the <Link href="/developer/url-encoder">URL Encoder</Link>.
          </p>

          <h2>Where you will meet Base64</h2>
          <ul>
            <li>
              <strong>Data URIs</strong> such as <code>data:image/png;base64,…</code>, which embed a small
              image directly in HTML or CSS, saving a request at the cost of a bigger page.
            </li>
            <li>
              <strong>Email attachments</strong>, which are Base64-encoded behind the scenes — one reason a
              file grows when emailed.
            </li>
            <li>
              <strong>JSON Web Tokens</strong>, whose three dot-separated parts are Base64url. Decoding the
              middle part shows what a token claims; it does not prove the token is genuine.
            </li>
            <li>
              <strong>Basic authentication headers</strong>, where a username and password are Base64-encoded
              — readable by anyone who sees them, which is why they must only travel over HTTPS.
            </li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "url-encoding-explained",
    topic: "Web & developer",
    title: "URL encoding explained: what %20 means and when to encode",
    seoTitle: "URL Encoding Explained: What %20 Means",
    description:
      "Why web addresses contain %20 and %C3%A9, which characters must be encoded, the difference between encoding a whole URL and a single value, and %20 versus +.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["url-encoder", "url-decoder", "utm-builder"],
    Body: function Body() {
      return (
        <>
          <p>
            Web addresses can only contain a limited set of characters. Anything else — a space, an accented
            letter, an ampersand inside a value — has to be written in a special form: a percent sign
            followed by two hexadecimal digits. That is URL encoding, also called percent-encoding.
          </p>

          <h2>Some common encodings</h2>
          <table>
            <thead>
              <tr>
                <th>Character</th>
                <th>Encoded</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>space</td>
                <td>%20</td>
              </tr>
              <tr>
                <td>&amp;</td>
                <td>%26</td>
              </tr>
              <tr>
                <td>=</td>
                <td>%3D</td>
              </tr>
              <tr>
                <td>?</td>
                <td>%3F</td>
              </tr>
              <tr>
                <td>/</td>
                <td>%2F</td>
              </tr>
              <tr>
                <td>#</td>
                <td>%23</td>
              </tr>
              <tr>
                <td>é</td>
                <td>%C3%A9</td>
              </tr>
            </tbody>
          </table>
          <p>
            Non-English characters are first turned into their UTF-8 bytes, and each byte is encoded, so one
            character can become several escapes, as é does.
          </p>

          <h2>Characters that never need encoding</h2>
          <p>
            The URL standard defines a small set of &ldquo;unreserved&rdquo; characters that are always safe:
            the letters A to Z and a to z, the digits 0 to 9, and four symbols — hyphen, full stop, underscore
            and tilde. Anything else either has a special job in addresses or is not allowed, and is encoded
            when it appears as data. That is why readable web addresses tend to use only lower-case letters,
            digits and hyphens.
          </p>

          <h2>Why some characters must be encoded</h2>
          <p>
            Characters such as ?, &amp;, = and # give an address its structure: ? starts the query string, &amp;
            separates parameters, = joins a name to its value and # starts a fragment. If one of them
            appears inside a value — a search for &ldquo;salt &amp; pepper&rdquo;, say — it must be encoded,
            or the server reads it as structure and the value is cut short.
          </p>

          <h2>Whole URL or single value?</h2>
          <p>This is where most encoding bugs come from. There are two different jobs:</p>
          <ul>
            <li>
              <strong>Encoding a whole address</strong> must leave its structure alone — the ://, the slashes,
              the ? and the &amp; — and encode only what is not allowed, such as spaces.
            </li>
            <li>
              <strong>Encoding a single value</strong> that goes into an address must encode those same
              structural characters, so they are treated as data.
            </li>
          </ul>
          <p>
            The <Link href="/developer/url-encoder">URL Encoder</Link> has a mode for each. Encoding{" "}
            <code className="break-all">https://example.com/a b</code> as a whole URL gives{" "}
            <code className="break-all">https://example.com/a%20b</code>. Encoding it as a single value
            gives <code className="break-all">https%3A%2F%2Fexample.com%2Fa%20b</code> — exactly right when
            that address is itself a parameter, such as a redirect target.
          </p>

          <h2>%20 or +?</h2>
          <p>
            In the query part of an address, many servers also accept + for a space, a convention from web
            forms. In the path, + means a literal plus sign. %20 is correct everywhere, so use it when in
            doubt.
          </p>

          <h2>Decoding</h2>
          <p>
            The <Link href="/developer/url-decoder">URL Decoder</Link> turns an encoded address back into
            readable text and splits the query string into a table of parameters — far easier to read than a
            long tracking link on one line. If the result still contains percent signs, the address was
            encoded twice; look for %25, which is an encoded percent sign, and decode again. Both tools run
            in your browser.
          </p>

          <h2>Double encoding</h2>
          <p>
            Encoding a value that is already encoded turns %20 into %2520, and the receiving server sees the
            literal text &ldquo;%20&rdquo; instead of a space. Encode each value exactly once, at the point
            where it is added to the address.
          </p>

          <h2>Campaign links</h2>
          <p>
            When building tagged links for analytics, the <Link href="/generators/utm-builder">UTM Link
            Builder</Link> encodes values for you and keeps the address&apos;s existing parameters and anchor
            intact.
          </p>
        </>
      );
    },
  },

  {
    slug: "check-ssl-certificate-expiry",
    topic: "Web & developer",
    title: "How to check when an SSL certificate expires — and why it matters",
    seoTitle: "How to Check When an SSL Certificate Expires",
    description:
      "See when a site's HTTPS certificate expires, spot chain problems browsers hide, and keep automatic renewal from failing silently as lifetimes get shorter.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["ssl-expiry-checker", "og-preview", "robots-txt-generator"],
    Body: function Body() {
      return (
        <>
          <p>
            When a website&apos;s certificate expires, visitors see a full-page security warning and most
            leave. Payment providers, apps and other services that connect to the site simply stop working.
            It is one of the most common avoidable outages, and checking takes seconds.
          </p>

          <h2>What a certificate does</h2>
          <p>
            An SSL/TLS certificate lets a browser confirm it is talking to the real site and encrypt the
            connection. For it to work, three things must be true: it must be within its validity dates, it
            must name the domain being visited, and it must chain up to a certificate authority that devices
            trust.
          </p>

          <h2>Check a certificate step by step</h2>
          <ol>
            <li>
              Enter the domain in the <Link href="/developer/ssl-expiry-checker">SSL Certificate Checker</Link>.
            </li>
            <li>Read the expiry date and the days remaining.</li>
            <li>Check who issued it and which names it covers.</li>
            <li>Look at the chain result — whether devices will trust it.</li>
          </ol>
          <p>
            Browsers do not let web pages read certificate details, so this check is made by this site&apos;s
            server, which connects to the domain and reads the certificate it presents. The domain is not
            stored, and only public addresses can be checked.
          </p>

          <h2>When to worry</h2>
          <p>
            Renew with at least two weeks to spare. Automated clients such as Certbot for Let&apos;s Encrypt
            usually renew when about 30 days remain, so a certificate with fewer than 30 days left often means
            automatic renewal has stopped working — a full disk, a changed DNS record, a firewall rule or an
            expired account. Investigate then, not on the last day.
          </p>

          <h2>Chain problems your browser hides</h2>
          <p>
            A server should send its certificate together with the intermediate certificates linking it to a
            trusted root. If an intermediate is missing, desktop browsers can often fill the gap from their
            cache or by fetching it, so the site looks fine. Phones, apps, payment providers and other servers
            often cannot, and refuse to connect. A chain warning is worth fixing even when your own browser
            shows a padlock.
          </p>

          <h2>Check every name</h2>
          <p>
            The bare domain and www, and every subdomain that serves visitors — shop, api, mail — can each use
            a different certificate, or none. A certificate must name the exact host, or cover it with a
            wildcard such as *.example.com. Check each one separately.
          </p>

          <h2>Lifetimes are getting shorter</h2>
          <p>
            Under rules agreed by browser makers and certificate authorities, the maximum lifetime of public
            certificates is being reduced in stages — to 200 days from March 2026, falling to 47 days by 2029.
            Renewing by hand once a year is no longer viable; automated renewal, plus a regular independent
            check like this one, is the safe arrangement.
          </p>

          <h2>Mail servers</h2>
          <p>
            Mail servers use certificates too. The checker can test ports that use TLS from the first byte —
            465 for sending mail, 993 for IMAP and 995 for POP3. Ports that upgrade a plain connection, such as
            25 and 587, are not supported.
          </p>

          <h2>While you are checking</h2>
          <p>
            A site&apos;s health is more than its certificate. The{" "}
            <Link href="/developer/og-preview">Open Graph Preview</Link> shows how its links look when shared,
            and the <Link href="/generators/robots-txt-generator">Robots.txt Generator and Tester</Link>{" "}
            confirms search engines can reach its pages.
          </p>
        </>
      );
    },
  },

  {
    slug: "validate-email-addresses",
    topic: "Web & developer",
    title: "How to check an email address is valid before you send",
    seoTitle: "How to Check an Email Address Is Valid",
    description:
      "Catch typos and badly formed email addresses, check that a domain can receive mail, clean a list in bulk, and understand what validation cannot prove.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["email-syntax-checker", "remove-duplicate-lines", "text-cleaner"],
    Body: function Body() {
      return (
        <>
          <p>
            A single mistyped character sends an important email nowhere. On a mailing list, bad addresses
            cause bounces that can harm how reliably your mail is delivered. Checking addresses first catches
            most problems before they cost anything.
          </p>

          <h2>What a valid address looks like</h2>
          <ul>
            <li>Exactly one @.</li>
            <li>Before it, up to 64 characters: letters, digits, dots and a few symbols such as + and _.</li>
            <li>No dot at the start or end of that part, and no two dots in a row.</li>
            <li>After it, a domain made of letters, digits and hyphens, with a real ending such as .com.</li>
            <li>At most 254 characters in total.</li>
          </ul>

          <h2>Check addresses step by step</h2>
          <ol>
            <li>
              Paste one address, or a whole list with one per line, into the{" "}
              <Link href="/developer/email-syntax-checker">Email Address Validator</Link>.
            </li>
            <li>Read the result for each: valid, or what is wrong, in plain words.</li>
            <li>Accept the suggested fix for likely typos in common domains.</li>
            <li>Optionally check the domains&apos; mail servers.</li>
          </ol>
          <p>
            The format check runs in your browser. The optional mail server check sends only the domain names
            — the part after each @ — to this site&apos;s server for a DNS lookup, never the full addresses.
          </p>

          <h2>Things that are valid, though people doubt it</h2>
          <ul>
            <li>
              <strong>Plus addressing</strong>, such as jane+newsletter@example.com. Many providers deliver it
              to jane@example.com, and it is useful for filtering. Some websites wrongly reject it.
            </li>
            <li>
              <strong>Capital letters.</strong> Domains are not case-sensitive, and in practice almost every
              provider treats the part before the @ the same way.
            </li>
            <li>
              <strong>Long domain endings</strong> such as .photography or .international.
            </li>
          </ul>

          <h2>Does the domain receive email?</h2>
          <p>
            A domain&apos;s MX records say which servers accept its email. The mail server check looks them
            up and tells you whether the domain can receive mail, has declared that it accepts none, or does
            not exist at all — which catches addresses at mistyped or defunct domains.
          </p>

          <h2>Typos worth catching</h2>
          <p>
            Most bad addresses are not malformed; they are mistyped. The validator flags likely typos in
            common domains — the kind of slip that turns gmail.com into gmial.com or gmail.con, or drops the
            dot before the ending. Such an address may be perfectly well formed, and even point at a real
            domain someone has registered, so it is worth confirming with the person rather than silently
            correcting it. On sign-up forms, showing a &ldquo;did you mean…?&rdquo; suggestion at the moment
            of typing prevents most of these.
          </p>

          <h2>What validation cannot prove</h2>
          <p>
            A correctly formed address at a working domain can still belong to no one. The only way to know a
            particular mailbox exists is to send it a message. Many mail servers accept every address at first
            and bounce later, and probing mailboxes one by one is unreliable and treated as abuse. That is why
            sign-up forms send a confirmation email: it proves the address works and that its owner agreed.
          </p>

          <h2>Cleaning a list</h2>
          <ol>
            <li>
              Tidy stray spaces and invisible characters with <Link href="/text/text-cleaner">Text Cleaner</Link>.
            </li>
            <li>
              Remove duplicates with <Link href="/text/remove-duplicate-lines">Remove Duplicate Lines</Link>,
              with case sensitivity off.
            </li>
            <li>Validate the list and fix or remove what fails.</li>
          </ol>
          <p>
            Only email people who have agreed to hear from you. A clean list of people who asked to be on it
            is worth far more than a long list of addresses gathered elsewhere — and in many countries the law
            requires consent.
          </p>
        </>
      );
    },
  },

  {
    slug: "what-is-a-uuid",
    topic: "Web & developer",
    title: "What is a UUID — and should you use version 4 or version 7?",
    seoTitle: "What Is a UUID? Version 4 vs Version 7",
    description:
      "How UUIDs identify things without a central counter, how to read one, why collisions are not a practical worry, and which version to use for database keys.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["uuid-generator", "random-number-generator", "timestamp-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            A UUID — universally unique identifier — is a 128-bit label such as{" "}
            <code className="break-all">0189d5f2-1e4c-7a3b-9c2d-4e5f6a7b8c9d</code>. Its purpose is to let any
            computer create an identifier on its own, without asking a central database for the next number,
            and still be confident no one else will ever create the same one.
          </p>

          <h2>Why not just count?</h2>
          <p>
            A simple counter — 1, 2, 3 — needs one place that hands out numbers. That becomes a problem when
            records are created on many servers, on phones that are offline, or in systems that are merged
            later. Counters also reveal how many records exist, and let anyone guess the next one. UUIDs avoid
            both.
          </p>

          <h2>Reading a UUID</h2>
          <p>
            A UUID is written as 32 hexadecimal digits in five groups: 8-4-4-4-12. The first digit of the
            third group is the version — 7 in the example above. The first digit of the fourth group encodes
            the variant, and for standard UUIDs it is always 8, 9, a or b. Lower-case, hyphenated form is the
            standard; braced and upper-case versions exist mainly for older Microsoft tooling, which calls
            them GUIDs.
          </p>

          <h2>Version 4: random</h2>
          <p>
            A version 4 UUID fills 122 of its 128 bits with random data. With that many possibilities, you
            would need to generate around 2.7 × 10¹⁸ of them before a collision became likely — far beyond any
            real system. Because they are unpredictable, version 4 UUIDs suit public identifiers and tokens
            where the creation time should not be guessable.
          </p>

          <h2>Version 7: time-ordered</h2>
          <p>
            Random identifiers have a weakness in databases. Rows arrive with keys scattered all over the
            range, so new entries land all over the index, which grows fragmented and slow. Version 7 puts a
            48-bit timestamp, in milliseconds, at the front, followed by random bits. Identifiers created later
            sort later, new rows land at the end of the index, and you can sort or filter by creation time.
          </p>
          <p>
            The trade-off is that a version 7 UUID reveals roughly when it was created. For an internal
            primary key that is usually fine; for a public token, use version 4.
          </p>

          <h2>Generate UUIDs step by step</h2>
          <ol>
            <li>
              Open the <Link href="/generators/uuid-generator">UUID Generator</Link> and choose version 4 or 7.
            </li>
            <li>Set how many you need — up to ten thousand at once, enough to seed a test database.</li>
            <li>Pick the format: standard, upper-case, braced or without hyphens.</li>
            <li>Copy the list or download it as a text file.</li>
          </ol>
          <p>
            Both versions are generated with your browser&apos;s cryptographic random number generator and
            set the version and variant bits correctly, so they validate against the current standard, RFC
            9562.
          </p>

          <h2>Practical tips</h2>
          <ul>
            <li>Store UUIDs in a native UUID column where your database has one; it is smaller and faster than text.</li>
            <li>Do not treat a UUID as a secret. Unguessable is not the same as access control.</li>
            <li>Pick one format and stick to it across systems, so comparisons do not fail on case or hyphens.</li>
          </ul>
          <p>
            For a plain random number rather than an identifier, use the{" "}
            <Link href="/generators/random-number-generator">Random Number Generator</Link>; to read the time
            inside a timestamp, the <Link href="/developer/timestamp-converter">Timestamp Converter</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "structured-data-schema-basics",
    topic: "Web & developer",
    title: "Structured data for beginners: FAQ and Product schema",
    seoTitle: "Structured Data for Beginners: FAQ and Product",
    description:
      "What schema markup is, what FAQ and Product structured data can and cannot do for search results today, and how to add JSON-LD to a page correctly.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["schema-generator", "barcode-generator", "og-preview"],
    Body: function Body() {
      return (
        <>
          <p>
            Search engines read pages and infer what they are about. Structured data removes the guesswork: a
            short block of code that states, in a shared vocabulary, &ldquo;this is a product, its price is
            this, it is in stock&rdquo; or &ldquo;these are questions and their answers&rdquo;.
          </p>

          <h2>What it looks like</h2>
          <p>
            The recommended format is JSON-LD: a script block in the page&apos;s HTML containing data that
            uses the schema.org vocabulary. It does not change what visitors see. It can go in the head or the
            body; search engines read it either way. Many website builders have a field for custom header code
            where it can be pasted.
          </p>

          <h2>Product markup</h2>
          <p>
            Product structured data describes an item&apos;s name, images and identifiers, with an offer
            giving its price, currency and availability, and optionally an aggregate rating. For Google to show
            product details in results, a product needs a name and at least one of an offer, a rating or a
            review. Common mistakes:
          </p>
          <ul>
            <li>Prices must be plain numbers — 1299.99, not &ldquo;$1,299.99&rdquo; — with the currency code in its own field.</li>
            <li>
              A GTIN, the number behind a retail barcode, must have 8, 12, 13 or 14 digits and a correct check
              digit. The <Link href="/generators/barcode-generator">Barcode Generator</Link> explains and
              verifies check digits.
            </li>
            <li>Availability and condition must use schema.org&apos;s standard values.</li>
          </ul>

          <h2>FAQ markup: valid, but rarely shown</h2>
          <p>
            FAQPage markup lists questions and their accepted answers. Since August 2023, Google shows FAQ rich
            results only for well-known, authoritative government and health websites. On other sites the
            markup is still valid and still read, but it will not produce expandable questions under your
            listing. Add it if it describes your page accurately; do not expect it to change how the page
            looks in results.
          </p>

          <h2>Create markup step by step</h2>
          <ol>
            <li>
              Open the <Link href="/generators/schema-generator">Schema Markup Generator</Link> and choose FAQ
              page or Product.
            </li>
            <li>Fill in the questions and answers, or the product&apos;s details, price and rating.</li>
            <li>Fix anything flagged as an error, and read the notes.</li>
            <li>Copy the script tag into your page&apos;s HTML.</li>
            <li>Confirm it with Google&apos;s Rich Results Test.</li>
          </ol>
          <p>
            The checks follow Google&apos;s published guidance, and the output is escaped so that text inside an
            answer cannot break your page.
          </p>

          <h2>The two rules that matter most</h2>
          <ul>
            <li>
              <strong>Mark up only what visitors can see.</strong> The same questions and answers, the same
              price. Markup that contradicts the page can be ignored or treated as spam.
            </li>
            <li>
              <strong>Use genuine reviews only.</strong> Ratings must come from real customer reviews shown on
              the page. Marking up ratings you wrote yourself is against Google&apos;s guidelines.
            </li>
          </ul>

          <h2>What structured data does not do</h2>
          <p>
            It is not a ranking boost. It helps search engines understand a page and can make it eligible for
            rich results, which can make a listing more noticeable — but content, usefulness and links still
            decide where a page ranks. A page can contain several blocks, such as a Product and a breadcrumb
            trail; describe each thing once.
          </p>

          <h2>Related</h2>
          <p>
            Structured data is for search engines; Open Graph tags control how links look when shared. Check
            those with the <Link href="/developer/og-preview">Open Graph Preview</Link> — see{" "}
            <Link href="/guides/open-graph-link-previews">how to fix link previews</Link>.
          </p>
        </>
      );
    },
  },
];
