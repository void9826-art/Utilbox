import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-20";

export const whyWebAndCodesGuides: Guide[] = [
  {
    slug: "text-compare-shows-invisible-differences",
    topic: "Codes, passwords & text",
    title: "Why two texts look identical but a comparison says they differ",
    seoTitle: "Why Identical-Looking Texts Show as Different",
    description:
      "A diff flags lines that look the same. Trailing spaces, tabs, line endings, curly quotes and invisible characters are usually why. How to find and fix them.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["text-compare", "text-cleaner", "character-counter"],
    Body: function Body() {
      return (
        <>
          <p>
            When a comparison flags lines that look identical, the difference is in characters you cannot see:
            trailing spaces, tabs instead of spaces, different line endings, curly versus straight quotes,
            non-breaking spaces or zero-width characters. Ignore spacing in the comparison, or clean both texts
            the same way first, and the real differences stand out.
          </p>

          <h2>The invisible culprits</h2>
          <ul>
            <li>
              <strong>Trailing spaces.</strong> “Total: 40 ” and “Total: 40” differ by a space at the end of the
              line that no editor shows.
            </li>
            <li>
              <strong>Tabs vs spaces.</strong> A tab and four spaces can look identical; they are different
              characters.
            </li>
            <li>
              <strong>Line endings.</strong> Windows ends lines with two characters (carriage return and line
              feed); macOS and Linux use one. Text that travelled between systems can carry either.
            </li>
            <li>
              <strong>Non-breaking spaces.</strong> Copying from web pages and Word often brings in non-breaking
              spaces, which look exactly like ordinary ones.
            </li>
            <li>
              <strong>Zero-width characters.</strong> Zero-width spaces and joiners take up no room at all but
              still count as characters.
            </li>
            <li>
              <strong>Look-alike punctuation.</strong> Curly quotes (“ ” ‘ ’) versus straight ones (&quot; &apos;), and
              hyphens versus en and em dashes (- – —).
            </li>
            <li>
              <strong>Look-alike letters.</strong> A Cyrillic “а” or Greek “ο” looks like a Latin a or o. Rare in
              normal text, but it happens in copied data and is a known trick in phishing addresses.
            </li>
            <li>
              <strong>Case.</strong> Easy to miss in long lines: “ID” vs “Id”.
            </li>
          </ul>

          <h2>How to see what is really different</h2>
          <ol>
            <li>
              Paste both versions into <Link href="/text/text-compare">Text Compare</Link>. Lines that were added
              or removed are marked with a plus or a minus.
            </li>
            <li>
              Turn on the option to ignore spacing and blank lines. If a flagged line disappears, the difference
              was whitespace.
            </li>
            <li>
              Turn on ignore case. If more lines disappear, those differed only in capital letters.
            </li>
            <li>
              For anything still flagged, paste each version of the line into the{" "}
              <Link href="/text/character-counter">Character Counter</Link>. If the counts differ, or the byte
              count is higher than the character count for plain English text, there is a hidden or special
              character.
            </li>
          </ol>
          <p>The comparison runs in your browser, so contracts and code can be compared without uploading them.</p>

          <h2>Clean both texts the same way</h2>
          <p>
            When the invisible differences do not matter — comparing two drafts of an article, say — normalise
            both before comparing. The <Link href="/text/text-cleaner">Text Cleaner</Link> collapses extra spaces,
            straightens curly quotes and strips invisible characters. Apply exactly the same options to both
            versions, then compare again; only real wording changes remain.
          </p>
          <p>
            When the differences do matter — code, configuration files, data, passwords, legal text where a
            character can change meaning — keep them visible and fix the source instead.
          </p>

          <h2>Comparing documents rather than plain text</h2>
          <p>
            Comparing two Word documents or PDFs by pasting their text adds its own noise: line breaks fall in
            different places when a paragraph reflows, page headers and numbers get mixed into the text, and
            hyphenated words may be split. Ignoring spacing hides most of that. For PDFs specifically,{" "}
            <Link href="/guides/how-to-compare-two-pdfs">comparing two versions of a PDF</Link> explains how to deal
            with layout differences.
          </p>

          <h2>Why the hidden characters got there</h2>
          <ul>
            <li>Copying from PDFs, web pages, email and chat apps.</li>
            <li>Word processors replacing quotes and dashes as you type.</li>
            <li>Files edited on different operating systems or by different editors.</li>
            <li>Spreadsheets exporting cells with trailing spaces.</li>
          </ul>

          <h2>When it causes real problems</h2>
          <ul>
            <li>
              <strong>Searches and lookups fail</strong> because “Smith ” with a trailing space is not “Smith”.
            </li>
            <li>
              <strong>Duplicate removal misses duplicates</strong> for the same reason; see{" "}
              <Link href="/guides/how-to-remove-duplicate-lines">removing duplicate lines</Link>.
            </li>
            <li>
              <strong>Passwords and codes pasted with a trailing space</strong> are rejected even though they
              look right.
            </li>
            <li>
              <strong>Version-control diffs</strong> show whole files changed when only line endings changed.
            </li>
          </ul>
          <p>
            For a full list of invisible characters and how to remove them, see{" "}
            <Link href="/guides/remove-invisible-characters">finding and removing invisible characters</Link>.
          </p>

          <h2>Checklist</h2>
          <ul>
            <li>Compared with spacing ignored, then with case ignored?</li>
            <li>Remaining differences checked character by character?</li>
            <li>Both versions cleaned with identical settings, if hidden characters do not matter?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "monthly-vs-annual-subscription",
    topic: "Calculations",
    title: "Monthly vs annual subscription: when the yearly plan really saves",
    seoTitle: "Monthly vs Annual Subscription: Which Saves?",
    description:
      "An annual plan is cheaper only if you keep it long enough. How to find the break-even month, compare weekly, monthly and yearly prices, and spot renewal traps.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["subscription-cost-tracker", "percentage-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            An annual subscription saves money only if you would otherwise keep paying monthly past the break-even
            point: the annual price divided by the monthly price. At 9.99 a month or 99.99 a year, that is 10
            months. If you might cancel before then, monthly is cheaper, even though the yearly plan advertises a
            discount.
          </p>

          <h2>Work out the break-even</h2>
          <ol>
            <li>Multiply the monthly price by 12: 9.99 × 12 = 119.88.</li>
            <li>Subtract the annual price: 119.88 − 99.99 = 19.89 saved over a full year.</li>
            <li>That is a 16.6% saving — about two months free.</li>
            <li>
              Divide the annual price by the monthly price: 99.99 ÷ 9.99 ≈ 10. After 10 months, monthly would have
              cost the same as the yearly plan.
            </li>
          </ol>
          <p>
            The <Link href="/calculators/percentage-calculator">Percentage Calculator</Link> turns the difference
            into a percentage saving for any pair of prices.
          </p>

          <h2>Weekly prices hide the real cost</h2>
          <p>
            Weekly pricing looks small because there are about 4.33 weeks in a month, not 4. A 6.99 weekly plan
            costs 6.99 × 52 ÷ 12 = 30.29 a month, and 363.48 a year. Multiplying weekly prices by 4 understates the
            monthly cost by about 8%. The{" "}
            <Link href="/calculators/subscription-cost-tracker">Subscription Cost Tracker</Link> converts every
            subscription to a true monthly and yearly figure, whatever its billing cycle, and shows upcoming
            renewals and what cancelling would save. The list stays in your browser’s storage, not on a server.
          </p>

          <h2>When the annual plan is the better deal</h2>
          <ul>
            <li>You have already used the service for several months and expect to keep it.</li>
            <li>It is something you need year-round: storage, a password manager, software for work.</li>
            <li>The price is likely to rise and the annual plan locks it in for a year.</li>
          </ul>

          <h2>When monthly is better</h2>
          <ul>
            <li>You are trying something new, or need it for a project or a season.</li>
            <li>You tend to rotate streaming services depending on what is showing.</li>
            <li>Your budget is tight and a large single payment would hurt.</li>
            <li>The provider’s refund policy for annual plans is unclear or strict.</li>
          </ul>

          <h2>A family or shared plan</h2>
          <p>
            Family and group plans change the sums again. A plan for six people at twice the single price is a large
            saving if four or more actually use it, and a cost increase if only one does. Divide the price by the
            number of people who really use the service, then compare that per-person figure with the individual
            plan, monthly and annual.
          </p>

          <h2>Renewal traps to check</h2>
          <ul>
            <li>
              <strong>Introductory prices.</strong> A low first-year price often renews at the standard rate. Note
              the renewal price, not just the offer.
            </li>
            <li>
              <strong>Automatic renewal.</strong> Annual plans usually renew automatically for another full year.
              Put the renewal date in a calendar a week or two before.
            </li>
            <li>
              <strong>Free trials</strong> that turn into paid plans unless cancelled, sometimes annual ones.
            </li>
            <li>
              <strong>Refunds.</strong> Rules on refunds after renewal vary by provider and by country. Read them
              before choosing the annual plan.
            </li>
            <li>
              <strong>Tax and currency.</strong> Prices shown without tax, or charged in another currency with a
              card fee, cost more than the headline.
            </li>
          </ul>

          <h2>Audit what you already pay</h2>
          <p>
            Small subscriptions add up because each feels negligible. List every one — check bank and card
            statements and the subscriptions page in your phone’s app store — with its price and cycle. Seeing
            the yearly total in one place is usually what prompts a cancellation, and it is the figure to compare
            when choosing between monthly and annual plans. Export the list from the tracker as a CSV if you want
            to keep a copy elsewhere.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Comparing a monthly price with an annual price divided by 12 without asking how long you will stay.</li>
            <li>Converting weekly prices with × 4.</li>
            <li>Forgetting that an annual plan renews automatically at full price.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Break-even month = annual price ÷ monthly price.</li>
            <li>Confident you will keep it beyond that?</li>
            <li>Renewal price and date noted?</li>
            <li>All subscriptions converted to one yearly total?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "formatting-html-changed-the-layout",
    topic: "Web & developer",
    title: "Why formatting or minifying HTML changed how the page looks",
    seoTitle: "Why Formatting HTML Changed Your Page Layout",
    description:
      "Whitespace between inline elements renders as a space, so reformatting HTML can add gaps between buttons or images. Why, and how to make layout robust.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["html-formatter", "css-formatter"],
    Body: function Body() {
      return (
        <>
          <p>
            Formatting HTML can change a page because whitespace between inline elements is not always ignored. If
            two buttons or images were written with no space between the tags, putting them on separate lines adds
            a line break, which the browser shows as a small gap. Minifying can do the opposite. Make the layout
            independent of whitespace with CSS.
          </p>

          <h2>The rule behind it</h2>
          <p>
            Browsers collapse any run of spaces, tabs and line breaks into a single space — but they do not
            remove it entirely when it sits between inline content. Text, links, spans, images and elements set
            to <code>display: inline-block</code> all flow like words in a sentence, so a space between them is
            drawn like the space between two words.
          </p>
          <p>Compare these two pieces of markup:</p>
          <ul>
            <li>
              <code>&lt;a&gt;One&lt;/a&gt;&lt;a&gt;Two&lt;/a&gt;</code> — the links touch.
            </li>
            <li>
              <code>&lt;a&gt;One&lt;/a&gt;</code> and <code>&lt;a&gt;Two&lt;/a&gt;</code> on separate lines — a
              space appears between them.
            </li>
          </ul>
          <p>
            A formatter that puts each element on its own line turns the first into the second. Block elements
            such as <code>div</code>, <code>p</code> and list items are not affected, because whitespace between
            blocks is not drawn.
          </p>

          <h2>Where it shows up</h2>
          <ul>
            <li>Navigation links or buttons styled as inline-block, suddenly a few pixels apart.</li>
            <li>Images in a row gaining gaps, or wrapping to a new line because the gaps add width.</li>
            <li>A word and an icon or a footnote marker splitting with an unwanted space.</li>
            <li>Inline elements inside a sentence, like <code>&lt;b&gt;</code>, gaining or losing a space next to punctuation.</li>
          </ul>

          <h2>Minifying: the opposite risk</h2>
          <p>
            A careless minifier that deletes all whitespace between tags can glue words together: “Hello{" "}
            <code>&lt;b&gt;world&lt;/b&gt;</code>” becomes “Helloworld”. The{" "}
            <Link href="/developer/html-formatter">HTML Formatter</Link> on this site collapses whitespace to a
            single space when minifying rather than removing it, and leaves the contents of{" "}
            <code>pre</code>, <code>textarea</code>, <code>script</code> and <code>style</code> untouched, because
            whitespace there is significant. When formatting, it puts elements on their own lines, so check
            layouts that depend on inline elements touching.
          </p>

          <h2>The robust fix: control spacing with CSS</h2>
          <ul>
            <li>
              <strong>Use flexbox or grid for rows of items.</strong> In a flex or grid container, whitespace
              between child elements is ignored, and <code>gap</code> sets the exact spacing you want.
            </li>
            <li>
              <strong>Make images block-level</strong> when they sit in their own row or container, which also
              removes the small gap under images caused by text baseline alignment.
            </li>
            <li>
              <strong>Avoid tricks</strong> such as HTML comments between tags or <code>font-size: 0</code> on the
              parent. They work, but break the next time someone edits or formats the file.
            </li>
          </ul>
          <p>
            Once layout no longer depends on whitespace, you can format and minify freely. Format the stylesheet
            too with the <Link href="/developer/css-formatter">CSS Formatter</Link> to keep it readable; it
            indents rules without rewriting values.
          </p>

          <h2>Text inside inline elements</h2>
          <p>
            The same rule applies within sentences. If markup reads <code>Read the&lt;a&gt;guide&lt;/a&gt;.</code>{" "}
            there is no space before the link, and formatting may add one. If it reads{" "}
            <code>&lt;a&gt;guide&lt;/a&gt; .</code> with a stray space before the full stop, minifying keeps that
            space, because it cannot know it was a mistake. Formatters preserve meaning as well as they can;
            spaces that were wrong in the source stay wrong. Fix them in the source.
          </p>

          <h2>Checking a change safely</h2>
          <ol>
            <li>Take a screenshot of the page before formatting.</li>
            <li>Format the HTML and reload.</li>
            <li>Compare rows of buttons, icons, images and inline text closely.</li>
            <li>Fix differences with CSS rather than reverting the formatting.</li>
          </ol>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Formatting production templates without checking inline layouts.</li>
            <li>Relying on “no whitespace between tags” for spacing.</li>
            <li>Minifying with a tool that strips whitespace inside <code>pre</code> or between words.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Rows of inline or inline-block items laid out with flex or grid instead?</li>
            <li>Before and after compared visually?</li>
            <li>Whitespace-sensitive blocks left untouched?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "why-css-is-not-applying",
    topic: "Web & developer",
    title: "Why your CSS isn’t being applied: a checklist",
    seoTitle: "Why Your CSS Isn't Being Applied: A Checklist",
    description:
      "A style that does nothing is usually overridden, mistyped, not loaded, cached or cut off by a missing brace. How to find which, using browser tools.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["css-formatter", "html-formatter"],
    Body: function Body() {
      return (
        <>
          <p>
            When CSS has no effect, the rule is usually being overridden by a more specific or later rule, the
            selector does not match the element, the stylesheet is not loading or is cached, or a syntax error
            such as a missing brace is breaking the rules after it. The browser’s developer tools show which in
            under a minute.
          </p>

          <h2>Start with the browser’s inspector</h2>
          <ol>
            <li>Right-click the element and choose Inspect.</li>
            <li>
              Look at the Styles panel. Is your rule listed at all?
              <ul>
                <li>
                  <strong>Not listed:</strong> the selector does not match, or the stylesheet did not load.
                </li>
                <li>
                  <strong>Listed but crossed out:</strong> another rule overrides it. The winning rule is shown
                  above it.
                </li>
                <li>
                  <strong>Listed with a warning icon:</strong> the property or value is invalid.
                </li>
              </ul>
            </li>
            <li>Check the Computed tab for the final value and which rule set it.</li>
          </ol>

          <h2>1. It is being overridden</h2>
          <ul>
            <li>
              <strong>Specificity.</strong> An ID beats a class, which beats an element selector.{" "}
              <code>#nav a</code> wins over <code>.link</code> however late <code>.link</code> appears.
            </li>
            <li>
              <strong>Order.</strong> With equal specificity, the later rule wins — including rules in a stylesheet
              loaded after yours.
            </li>
            <li>
              <strong>Inline styles and !important</strong> beat ordinary rules. Use !important sparingly; it
              starts an arms race.
            </li>
            <li>
              <strong>Cascade layers</strong>, if your project uses <code>@layer</code>, decide precedence by layer
              order before specificity.
            </li>
          </ul>

          <h2>2. The selector does not match</h2>
          <ul>
            <li>A typo in the class name, or a dot missing: <code>button</code> vs <code>.button</code>.</li>
            <li>Class names are case-sensitive: <code>.Card</code> does not match <code>class=&quot;card&quot;</code>.</li>
            <li>The element is not where the selector expects: <code>.menu &gt; li</code> needs a direct child.</li>
            <li>The class is added later by JavaScript, or the element is inside a shadow DOM or iframe.</li>
          </ul>

          <h2>3. A syntax error stops the rest</h2>
          <p>
            A missing closing brace makes the browser treat everything after it as part of the unfinished rule,
            so rules further down silently fail. A missing semicolon breaks the declaration after it. Paste the
            stylesheet into the <Link href="/developer/css-formatter">CSS Formatter</Link> and format it: rules
            that suddenly indent one level deeper than expected sit after an unclosed brace. The formatter only
            re-indents; it does not rewrite values, so the problem stays visible.
          </p>

          <h2>4. The stylesheet is not loading</h2>
          <ul>
            <li>Check the Network tab for the CSS file: a 404 means the path is wrong.</li>
            <li>
              A file served with the wrong content type may be ignored by the browser; check the response headers.
            </li>
            <li>Check the <code>&lt;link&gt;</code> tag is in the page and has <code>rel=&quot;stylesheet&quot;</code>.</li>
          </ul>
          <p>
            If you are unsure the markup is what you think it is, format it with the{" "}
            <Link href="/developer/html-formatter">HTML Formatter</Link> to see the nesting clearly.
          </p>

          <h2>5. You are seeing an old version</h2>
          <p>
            Browsers and CDNs cache stylesheets. Hard-reload (Ctrl+Shift+R, or Cmd+Shift+R on a Mac) or tick
            “Disable cache” in the Network tab while developing. For production, versioned file names make
            browsers fetch the new file after each change.
          </p>

          <h2>6. The rule applies, but has no visible effect</h2>
          <ul>
            <li><code>width</code> and <code>height</code> do nothing on ordinary inline elements such as span.</li>
            <li><code>z-index</code> needs a positioned element or a flex or grid item.</li>
            <li>A media query condition is not met at the current screen width.</li>
            <li>Some properties are not inherited, so setting them on a parent does not affect children.</li>
          </ul>

          <h2>Frameworks and component styles</h2>
          <p>
            Utility classes, CSS modules and component libraries add their own layers. Class names may be rewritten
            at build time, so a selector you write by hand for <code>.card</code> no longer matches. Component
            styles may load after yours and win on order. In those setups, follow the framework’s own way of
            overriding styles rather than raising specificity until something works.
          </p>

          <h2>Checklist</h2>
          <ul>
            <li>Rule present in the Styles panel? Crossed out? Warning icon?</li>
            <li>Selector spelling and case checked?</li>
            <li>Stylesheet loaded with status 200?</li>
            <li>Cache bypassed?</li>
            <li>Formatted to reveal missing braces?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "valid-email-address-still-bounces",
    topic: "Web & developer",
    title: "Why an email bounces even though the address looks valid",
    seoTitle: "Why an Email Bounces When the Address Looks Valid",
    description:
      "A correctly formatted address can still bounce: the mailbox may not exist, be full, or reject your server. How to read the bounce and what to check.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["email-syntax-checker"],
    Body: function Body() {
      return (
        <>
          <p>
            An email can bounce even when the address is correctly formatted, because format is only the first
            check. The mailbox may not exist, may be full or disabled, the domain may not accept mail, or the
            receiving server may reject your message as suspected spam. The bounce message usually says which,
            often with a code such as 5.1.1.
          </p>

          <h2>What a format check can and cannot tell you</h2>
          <p>
            A format check confirms the address could exist: one @, a valid local part, a real-looking domain. It
            catches typos such as <code>name@gmial.com</code> or a missing dot. A mail-server check goes one step
            further and asks whether the domain has mail (MX) records, meaning it is set up to receive email at
            all. Neither can prove that a particular mailbox exists, because most mail servers will not say so to
            an outsider.
          </p>
          <p>
            The <Link href="/developer/email-syntax-checker">Email Address Validator</Link> does both: the format
            check runs in your browser, and the optional mail-server check sends only the domain name to this
            site’s server for a DNS lookup.
          </p>

          <h2>Reading the bounce</h2>
          <p>
            Bounce messages include a three-part status code. The first digit tells you whether to try again:
          </p>
          <ul>
            <li>
              <strong>4.x.x — temporary.</strong> The server could not deliver right now: busy, greylisting, or a
              full mailbox. Your mail system usually retries automatically.
            </li>
            <li>
              <strong>5.x.x — permanent.</strong> Do not keep resending without changing something.
            </li>
          </ul>
          <p>Common permanent reasons, with typical wording:</p>
          <ul>
            <li>
              <strong>5.1.1, “user unknown” or “no such user”:</strong> the domain is fine but the mailbox does not
              exist. Check the spelling of the part before the @, and whether the person has left the organisation.
            </li>
            <li>
              <strong>5.1.2 or “domain not found”:</strong> the domain has no mail server, or does not exist.
            </li>
            <li>
              <strong>5.2.2, “mailbox full”:</strong> sometimes temporary, sometimes a sign the account is
              abandoned.
            </li>
            <li>
              <strong>5.7.x, “rejected”, “blocked” or “policy”:</strong> the receiving server refused your message
              — because of the content, your sending server’s reputation, or failed authentication.
            </li>
          </ul>
          <p>
            Exact codes and wording vary between providers, so read the human-readable text that comes with the
            code too.
          </p>

          <h2>If it is the address</h2>
          <ul>
            <li>Check for look-alike typos: gmial, hotmial, .con instead of .com, a missing letter.</li>
            <li>Confirm the address through another channel — a phone call, a website contact page.</li>
            <li>Old company addresses stop working when people leave or companies rebrand their domain.</li>
            <li>Plus addressing, like jane+news@example.com, works on many services but not all.</li>
          </ul>

          <h2>If it is your message or your server</h2>
          <ul>
            <li>
              <strong>Your domain’s authentication.</strong> If you send from your own domain, it needs correct
              SPF, DKIM and DMARC records; large mailbox providers increasingly reject or filter mail without them.
              Your email host’s documentation explains the records to add.
            </li>
            <li>
              <strong>Attachments and links.</strong> Large attachments, executable files and some shortened links
              trigger rejections. Share a link to the file instead.
            </li>
            <li>
              <strong>Sending volume.</strong> Sending many messages at once from an ordinary mailbox can trip rate
              limits. Use a proper mailing service for newsletters.
            </li>
          </ul>

          <h2>When nothing bounces but nothing arrives</h2>
          <p>
            A message that is accepted but never seen has usually been filtered rather than bounced. Ask the
            recipient to check spam or junk, quarantine folders and any “other” or “promotions” tab, and to add your
            address to their contacts. Organisations may hold external mail in a central quarantine that only their
            IT team can release.
          </p>

          <h2>Checking a domain can receive mail</h2>
          <p>
            If you are not sure whether a domain is set up for email at all — a new business, a typo-like domain —
            see <Link href="/guides/check-mx-records-for-a-domain">how to check a domain’s MX records</Link>.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Resending a 5.x.x bounce unchanged, which can harm your sender reputation.</li>
            <li>Treating a passed format check as proof the mailbox exists.</li>
            <li>Keeping bounced addresses on a mailing list.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Bounce code starts with 4 (wait) or 5 (fix something)?</li>
            <li>Address spelling and domain checked?</li>
            <li>Domain has MX records?</li>
            <li>Your own domain’s SPF, DKIM and DMARC set up?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "printed-barcode-wont-scan",
    topic: "Codes, passwords & text",
    title: "Why a printed barcode won’t scan — and how to fix it",
    seoTitle: "Why a Printed Barcode Won't Scan",
    description:
      "Barcodes fail when the quiet zone is missing, bars are too thin for the printer, contrast is wrong or the image was blurred. Causes and fixes in order.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["barcode-generator", "qr-code-generator"],
    Body: function Body() {
      return (
        <>
          <p>
            A printed barcode usually fails because of the print, not the number: the blank margin around it is
            too small, the bars are too thin for the printer, the image was blurred by resizing or JPG compression,
            or the colours lack contrast. Less often, the scanner is not set to read that barcode type.
          </p>

          <h2>1. The quiet zone is missing</h2>
          <p>
            Every linear barcode needs clear space on both sides so the scanner can find where it starts and ends.
            Text, a border, or the edge of a label touching the bars is one of the most common causes of failure.
            For Code 128 the usual guidance is at least ten times the width of the narrowest bar on each side;
            retail symbols such as EAN and UPC have their own, larger, specified margins. Keep the margins the
            generator adds, and do not crop them off.
          </p>

          <h2>2. The bars are too thin for the printer</h2>
          <p>
            Shrinking a barcode to fit a small label makes the narrowest bar narrower. Below what the printer can
            reproduce cleanly, bars blur together or break up — especially on thermal and inkjet printers, where ink
            spreads. Print it bigger, or shorten the encoded value so the barcode needs fewer bars: TOOL-0042 makes
            a much shorter Code 128 than a long sentence.
          </p>

          <h2>3. The image was blurred or stretched</h2>
          <ul>
            <li>
              <strong>Use SVG or PNG, never JPG.</strong> JPG compression smears the hard edges between bars. The{" "}
              <Link href="/generators/barcode-generator">Barcode Generator</Link> downloads PNG or SVG; SVG stays
              sharp at any size.
            </li>
            <li>
              <strong>Do not stretch it unevenly.</strong> Resizing only the width in a document changes the bar
              ratios. Lock the aspect ratio, or resize SVGs, which scale exactly.
            </li>
            <li>
              <strong>Check the printer’s scaling.</strong> “Fit to page” can shrink a label sheet slightly. Print at
              100% when testing.
            </li>
          </ul>

          <h2>4. Contrast and colour</h2>
          <ul>
            <li>Dark bars on a light background. Reversed (light on dark) codes fail on many scanners.</li>
            <li>
              Avoid red bars: many scanners use red light, under which red ink looks the same as white paper.
            </li>
            <li>Glossy, curved or transparent surfaces reflect or distort; test on the real material.</li>
            <li>Faded thermal labels and low-toner printouts lose contrast first in the thinnest bars.</li>
          </ul>

          <h2>5. The data or the type is wrong</h2>
          <ul>
            <li>
              <strong>Check digit.</strong> UPC, EAN and ITF-14 end in a check digit. A wrong one makes scanners
              reject the code. The generator calculates or verifies it for you.
            </li>
            <li>
              <strong>Scanner settings.</strong> Many scanners are configured to read only certain types. A Code 39
              label may not scan on a scanner set up only for EAN and UPC. Check the scanner’s manual for enabling
              symbologies.
            </li>
            <li>
              <strong>Scans, but “item not found”.</strong> The barcode is fine; the number is not in the system. For
              retail sale, products need a GS1-issued number registered to you — see{" "}
              <Link href="/guides/upc-vs-ean-vs-code-128">UPC, EAN or Code 128</Link>.
            </li>
          </ul>

          <h2>Testing before a full print run</h2>
          <ol>
            <li>Print one sheet at 100% on the real printer and label stock.</li>
            <li>Scan with the actual scanner, from the distance and angle staff will use.</li>
            <li>Try a phone scanner app as a second opinion, not as the only test.</li>
            <li>Rub or bend a label if it will be handled, then scan again.</li>
          </ol>

          <h2>Would a QR code be better?</h2>
          <p>
            QR codes carry error correction and tolerate damage and curved surfaces better, and phone cameras read
            them easily. If your scanners support 2D codes and you are not bound to a retail standard, the{" "}
            <Link href="/generators/qr-code-generator">QR Code Generator</Link> is an option for internal labels.
          </p>

          <h2>Checklist</h2>
          <ul>
            <li>Clear margin on both sides?</li>
            <li>Bars wide enough for the printer; value as short as possible?</li>
            <li>PNG or SVG, printed at 100%, not stretched?</li>
            <li>Dark, non-red bars on a light, matte background?</li>
            <li>Barcode type enabled on the scanner?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "why-random-numbers-repeat",
    topic: "Codes, passwords & text",
    title: "Why a random number generator keeps repeating numbers",
    seoTitle: "Why a Random Number Generator Repeats Numbers",
    description:
      "Repeats are normal in real randomness: pick 12 numbers from 1 to 100 and a repeat is a coin flip. When to worry, and how to draw without duplicates.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["random-number-generator", "password-generator"],
    Body: function Body() {
      return (
        <>
          <p>
            Repeats are a normal part of randomness. Drawing 12 numbers from 1 to 100, the chance of at least one
            repeat is about 50%, and streaks are common too. A generator that never repeated would be less random.
            If each number must appear only once, as in a raffle, switch duplicates off.
          </p>

          <h2>Why repeats come sooner than you expect</h2>
          <p>
            It is the same maths as the birthday problem. The question is not “will this particular number come
            up again?” but “will any two of my numbers match?” — and the number of possible pairs grows quickly.
          </p>
          <ul>
            <li>10 numbers from 1 to 100: about a 37% chance of a repeat.</li>
            <li>12 numbers from 1 to 100: about 50%.</li>
            <li>10 numbers from 1 to 10, one after another: about a 61% chance that the same number comes up twice in a row at least once.</li>
          </ul>

          <h2>Streaks are normal too</h2>
          <p>
            In 20 fair coin flips, the chance of a run of at least four heads or four tails in a row is about 77%,
            and of five or more about 46%. People asked to write down “random-looking” sequences avoid streaks
            and alternate too often. Real randomness looks clumpier than our intuition says it should.
          </p>

          <h2>When repeats are a problem</h2>
          <p>
            For a prize draw, picking students, assigning tasks or choosing lottery-style numbers, a repeat is not
            wrong mathematically but is wrong for the job. The fix is to draw without replacement: once a number is
            picked, it cannot be picked again.
          </p>
          <ol>
            <li>
              Open the <Link href="/generators/random-number-generator">Random Number Generator</Link>.
            </li>
            <li>Set the lowest and highest values — for 30 entrants, 1 to 30.</li>
            <li>Choose how many numbers you need and turn duplicates off.</li>
            <li>Generate, then copy or record the result.</li>
          </ol>
          <p>
            Numbers come from your browser’s cryptographic random generator, with rejection sampling so every value
            in the range is equally likely and both ends can be drawn. For a draw others need to trust, see{" "}
            <Link href="/guides/pick-a-random-winner">how to pick a random winner fairly</Link>.
          </p>

          <h2>When you should be suspicious</h2>
          <ul>
            <li>
              <strong>The exact same sequence every time</strong> you load a page or run a program. That suggests a
              generator started from a fixed seed — common in games and simulations, wrong for draws or security.
            </li>
            <li>
              <strong>Some numbers never appear</strong> over hundreds of draws, or the ends of the range come up
              less often than the middle. That points to a biased method, such as rounding a random decimal instead
              of flooring it.
            </li>
            <li>
              <strong>A pattern you can predict.</strong> Weak generators can repeat in cycles. For passwords and
              tokens, only a cryptographically secure generator is acceptable — the{" "}
              <Link href="/generators/password-generator">Password Generator</Link> uses the same browser source as
              the number generator.
            </li>
          </ul>

          <h2>Recording a draw</h2>
          <p>
            For a draw that matters, number the entries in a fixed list first — alphabetical, or in order of entry —
            and share the list before drawing. Then the only thing the generator decides is the number, and anyone
            can check that number 17 on the published list is the winner. Do the draw once, in front of witnesses or
            on a recorded call if possible.
          </p>

          <h2>“Shuffle” that does not feel random</h2>
          <p>
            Music apps have been known to adjust truly random shuffles because listeners complained when the same
            artist played twice in a row. A shuffle designed to feel random spreads things out on purpose; a truly
            random one does not. Neither is broken — they are doing different jobs.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Re-running a draw because the result “doesn’t look random”; that biases the outcome.</li>
            <li>Allowing duplicates in a draw where each entrant can win only once.</li>
            <li>Using a seeded or predictable generator for anything with money or security attached.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Repeats acceptable for this job? If not, switch duplicates off.</li>
            <li>Range set correctly, including both ends?</li>
            <li>Result recorded before anyone sees it, for a public draw?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "utm-links-show-as-direct-traffic",
    topic: "Web & developer",
    title: "Why visits from your UTM links show up as direct or unassigned",
    seoTitle: "Why UTM Link Visits Show as Direct Traffic",
    description:
      "Tagged links land in Direct or Unassigned when redirects strip tags, values are inconsistent, tags sit after # or analytics never loads. How to fix it.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["utm-builder", "url-decoder"],
    Body: function Body() {
      return (
        <>
          <p>
            UTM-tagged visits show up as Direct or Unassigned when the tags never reach your analytics, or arrive
            in a form it cannot classify. Common causes are redirects that drop the query string, tags placed after
            a #, inconsistent or misspelled parameter names and values, and visitors whose analytics did not load.
            Test the final landing URL first.
          </p>

          <h2>1. The tags are lost on the way</h2>
          <ul>
            <li>
              <strong>Redirects.</strong> http → https, non-www → www or a trailing-slash redirect should keep the
              query string, but misconfigured ones drop it. A link shortener or app redirect can do the same.
            </li>
            <li>
              <strong>Tags after a #.</strong> Parameters must come before any fragment:{" "}
              <code>/page?utm_source=x#section</code>, not <code>/page#section?utm_source=x</code>. Anything after #
              is not sent to the server and is usually not read as a campaign parameter.
            </li>
            <li>
              <strong>A second ? in the address.</strong> If the URL already had a query string, add tags with &amp;,
              not another ?.
            </li>
            <li>
              <strong>Privacy tools.</strong> Some browsers, extensions and apps remove tracking parameters from
              links, and some email security services rewrite links. You cannot control these; expect some loss.
            </li>
          </ul>
          <p>
            <strong>Test:</strong> click your tagged link from where people will click it — the email, the app, the
            QR code — and look at the address bar when the page has loaded. If the tags are gone, a redirect removed
            them. Paste the final URL into the <Link href="/developer/url-decoder">URL Decoder</Link> to see each
            parameter separately.
          </p>

          <h2>2. The values do not match your channel rules</h2>
          <ul>
            <li>
              <strong>Misspelled names.</strong> utm_soruce or utm-source is ignored. Only the exact parameter names
              work.
            </li>
            <li>
              <strong>Missing source or medium.</strong> Analytics tools need both to attribute a visit properly.
            </li>
            <li>
              <strong>Mediums your analytics does not recognise.</strong> Channel groups classify traffic by medium
              values such as email, social, cpc or referral. A medium like “newsletter-oct” or “Email” may fall into
              Unassigned. Check your analytics tool’s channel definitions and use matching values.
            </li>
            <li>
              <strong>Inconsistent case.</strong> “Facebook” and “facebook” are reported as different sources. Keep
              everything lower-case.
            </li>
          </ul>
          <p>
            The <Link href="/generators/utm-builder">UTM Link Builder</Link> fills in the exact parameter names,
            lower-cases values by default and encodes them properly, which removes most of these errors.
          </p>

          <h2>3. Analytics did not run</h2>
          <ul>
            <li>
              <strong>Consent.</strong> Where analytics loads only after cookie consent, visitors who decline are
              not counted at all, or are counted without campaign data, depending on the setup.
            </li>
            <li>
              <strong>Blockers.</strong> Ad and tracker blockers stop many analytics scripts.
            </li>
            <li>
              <strong>Fast bounces.</strong> A visitor who leaves before the page and its scripts finish loading may
              not be recorded.
            </li>
          </ul>

          <h2>QR codes and printed links</h2>
          <p>
            For posters and leaflets, encode the full tagged URL in the QR code, or point the code at a short
            address on your own domain that redirects to the tagged URL. In both cases, scan the printed code and
            check the address bar on the phone before printing in bulk. Redirect services and some QR scanners
            alter links, so test with more than one phone.
          </p>

          <h2>4. Tags used where they should not be</h2>
          <p>
            Do not put UTM tags on links between pages of your own site. In many analytics setups a new campaign
            value starts a new session or overwrites the original source, so the visitor’s real origin is lost.
            Use UTMs only on links that bring people in from elsewhere: emails, social posts, adverts, partner sites
            and printed material.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Testing the tagged link in a browser but never through the real redirect or app.</li>
            <li>Inventing new medium values for every campaign.</li>
            <li>Tagging internal links or navigation.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Tags visible in the address bar after the final redirect?</li>
            <li>Tags before any #, joined with &amp; when a query already exists?</li>
            <li>Exact parameter names, lower-case values, source and medium both set?</li>
            <li>Medium values match your analytics’ channel rules?</li>
          </ul>
          <p>
            For the basics of building tagged links, see{" "}
            <Link href="/guides/utm-parameters-explained">UTM parameters explained</Link>.
          </p>
        </>
      );
    },
  },
];
