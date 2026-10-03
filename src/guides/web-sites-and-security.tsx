import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-03";

export const webSitesAndSecurityGuides: Guide[] = [
  {
    slug: "ssl-certificate-chain-incomplete",
    topic: "Web & developer",
    title: "How to fix an incomplete SSL certificate chain",
    seoTitle: "How to Fix an Incomplete SSL Certificate Chain",
    description:
      "Your site works in a browser but apps, scripts and some phones report certificate errors. Usually the intermediate certificate is missing. How to check and fix it.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["ssl-expiry-checker"],
    Body: function Body() {
      return (
        <>
          <p>
            The site opens fine in your desktop browser, but a mobile app fails, a script reports &ldquo;unable to
            get local issuer certificate&rdquo;, or a payment provider&apos;s webhook cannot connect. The certificate
            itself is valid. What is missing is the chain that links it to a certificate authority the client already
            trusts.
          </p>

          <h2>How the chain works</h2>
          <ul>
            <li>
              <strong>Root certificate:</strong> belongs to a certificate authority and is built into operating
              systems and browsers.
            </li>
            <li>
              <strong>Intermediate certificate:</strong> issued by the root, and used by the authority to sign
              website certificates day to day.
            </li>
            <li>
              <strong>Your certificate</strong> (the leaf): issued for your domain by the intermediate.
            </li>
          </ul>
          <p>
            A client trusts your certificate by following the chain up to a root it knows. For that, your server must
            send your certificate and the intermediate. It should not send the root; clients already have it.
          </p>

          <h2>Why some clients work anyway</h2>
          <p>
            Some desktop browsers can fetch a missing intermediate themselves, using an address embedded in the
            certificate, or already have common intermediates cached. Many other clients do not: command-line tools,
            programming-language libraries, many mobile apps and embedded devices simply fail. So a site can look
            fine in your browser while being broken for a large share of real traffic.
          </p>

          <h2>Check your chain</h2>
          <ol>
            <li>
              Open the <Link href="/developer/ssl-expiry-checker">SSL Certificate Checker</Link> and enter your
              domain.
            </li>
            <li>Look at Trusted chain and the Certificate chain list.</li>
            <li>
              A complete chain shows your certificate followed by one or more intermediates, ending at a trusted
              authority. If it stops at your own certificate, the server is not sending the intermediate.
            </li>
          </ol>
          <p>
            The checker also shows expiry dates and whether the certificate covers the name you entered, which is the
            other common cause of certificate errors.
          </p>

          <h2>Fix it</h2>
          <p>Install the full chain file rather than the certificate alone:</p>
          <ul>
            <li>
              <strong>Let&apos;s Encrypt and other ACME clients</strong> usually produce a <code>fullchain.pem</code>.
              Point the server at that, not at <code>cert.pem</code>.
            </li>
            <li>
              <strong>Nginx:</strong> <code>ssl_certificate</code> must point to a file containing your certificate
              followed by the intermediate.
            </li>
            <li>
              <strong>Apache:</strong> recent versions accept the full chain in <code>SSLCertificateFile</code>;
              older set-ups use a separate chain file setting.
            </li>
            <li>
              <strong>Hosting control panels and load balancers:</strong> look for a &ldquo;CA bundle&rdquo; or
              &ldquo;certificate chain&rdquo; box and paste the intermediate there.
            </li>
          </ul>
          <p>
            If you build the file by hand, order matters: your certificate first, then the intermediate that signed
            it, then any higher intermediate. Reload the server and run the checker again.
          </p>

          <h2>Other causes of the same errors</h2>
          <ul>
            <li>An expired certificate, or an expired intermediate in an old bundle.</li>
            <li>The wrong certificate served for this name, common on servers hosting several sites.</li>
            <li>Old client devices whose trusted root list predates the authority&apos;s current root.</li>
            <li>A firewall or antivirus product intercepting connections with its own certificate.</li>
          </ul>
          <p>
            For keeping on top of renewals, see{" "}
            <Link href="/guides/check-ssl-certificate-expiry">how to check when an SSL certificate expires</Link> and{" "}
            <Link href="/guides/ssl-certificate-validity-is-getting-shorter">why certificate lifetimes are getting shorter</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "ssl-certificate-validity-is-getting-shorter",
    topic: "Web & developer",
    title: "SSL certificates are getting shorter lifetimes: what changes for you",
    seoTitle: "SSL Certificate Lifetimes Are Shrinking to 47 Days",
    description:
      "Public TLS certificates are moving from about a year to 200 days, then 100, then 47 by 2029. The schedule, why it is happening, and how to make renewals automatic.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["ssl-expiry-checker"],
    Body: function Body() {
      return (
        <>
          <p>
            For years, a public HTTPS certificate could last up to about 13 months. That is changing in steps. Under a
            schedule agreed in 2025 by the CA/Browser Forum, the body of certificate authorities and browser makers
            that sets the rules, the maximum lifetime falls to 47 days by 2029. If anyone renews your certificates by
            hand, this matters now.
          </p>

          <h2>The schedule</h2>
          <table>
            <thead>
              <tr>
                <th>Issued from</th>
                <th>Max lifetime</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Before 15 March 2026</td>
                <td>398 days</td>
              </tr>
              <tr>
                <td>15 March 2026</td>
                <td>200 days</td>
              </tr>
              <tr>
                <td>15 March 2027</td>
                <td>100 days</td>
              </tr>
              <tr>
                <td>15 March 2029</td>
                <td>47 days</td>
              </tr>
            </tbody>
          </table>
          <p>
            The first step is already in force: certificates issued since March 2026 last at most 200 days. A
            certificate bought before then can still run to its original end date.
          </p>

          <h2>Why lifetimes are shrinking</h2>
          <ul>
            <li>
              <strong>Less damage from mistakes:</strong> a certificate issued wrongly, or whose key leaks, stays
              usable for a shorter time.
            </li>
            <li>
              <strong>Revocation does not work well:</strong> browsers often cannot check reliably whether a
              certificate has been cancelled, so expiry is the dependable safety net.
            </li>
            <li>
              <strong>Fresher information:</strong> the domain ownership behind a certificate is re-checked more often.
            </li>
            <li>
              <strong>Forcing automation:</strong> frequent renewal makes manual processes impractical, and automated
              renewal is more reliable anyway.
            </li>
          </ul>

          <h2>What to do</h2>
          <ol>
            <li>
              <strong>Find every certificate you rely on</strong>: websites, APIs, mail servers, load balancers,
              internal tools with public names.
            </li>
            <li>
              <strong>Check how each one is renewed.</strong> Many hosts and CDNs already renew automatically. Others
              depend on a person and a calendar reminder.
            </li>
            <li>
              <strong>Automate the manual ones</strong> with the ACME protocol, which most certificate authorities
              support, using the client your server or platform recommends.
            </li>
            <li>
              <strong>Monitor expiry anyway.</strong> Automation fails quietly when DNS changes or a firewall blocks
              validation.
            </li>
          </ol>

          <h2>Check what you have now</h2>
          <p>
            Enter each domain in the <Link href="/developer/ssl-expiry-checker">SSL Certificate Checker</Link>. It
            shows the valid-from and valid-until dates, days remaining, the issuer and whether the chain is trusted. It
            also checks mail and other ports, such as 465, 993 and 995, which are easily forgotten. A certificate
            issued recently with a lifetime of about 200 days, or 90 days for many free authorities, tells you the
            renewal clock is short.
          </p>

          <h2>What 47 days means in practice</h2>
          <p>
            With a 47-day maximum, certificates are typically renewed about once a month, leaving a margin before
            expiry. That is roughly twelve renewals a year per certificate, every year. For an organisation with
            dozens of certificates, a manual process would mean a renewal almost every working day. Automation is
            not optional at that rate; the time to set it up is while lifetimes are still 200 or 100 days.
          </p>

          <h2>Places that tend to break</h2>
          <ul>
            <li>Certificates installed by hand on appliances, printers and older load balancers.</li>
            <li>Certificates copied between servers, where only one copy gets renewed.</li>
            <li>Pinned certificates in mobile apps, which must be updated before the old certificate is replaced.</li>
            <li>Mail servers, whose certificates are rarely checked in a browser.</li>
          </ul>
          <p>
            For a step-by-step expiry check, see{" "}
            <Link href="/guides/check-ssl-certificate-expiry">how to check when an SSL certificate expires</Link>. If
            some clients report errors after a renewal, see{" "}
            <Link href="/guides/ssl-certificate-chain-incomplete">fixing an incomplete certificate chain</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "check-mx-records-for-a-domain",
    topic: "Web & developer",
    title: "How to check a domain's MX records (can it receive email?)",
    seoTitle: "How to Check MX Records: Can a Domain Get Email?",
    description:
      "MX records say which servers accept email for a domain. How to look them up, read priorities, spot null MX and missing records, and fix email after a move.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["email-syntax-checker"],
    Body: function Body() {
      return (
        <>
          <p>
            Every email address ends in a domain, and that domain has to tell senders where its mail should go. It
            does that with MX records in DNS. Checking them answers practical questions: is this customer&apos;s
            address real, why has our email stopped arriving since we moved provider, and is this domain set up to
            receive mail at all?
          </p>

          <h2>What an MX record contains</h2>
          <ul>
            <li>
              <strong>A mail server name</strong>, such as <code>mx1.mailprovider.example</code>.
            </li>
            <li>
              <strong>A priority number</strong>. Lower numbers are tried first; higher ones are backups. Records
              with the same number share the load.
            </li>
          </ul>
          <p>A domain can have one MX record or several.</p>

          <h2>Look them up</h2>
          <ol>
            <li>
              Open the <Link href="/developer/email-syntax-checker">Email Address Validator</Link>.
            </li>
            <li>Enter one or more email addresses at the domains you want to check.</li>
            <li>
              Press &ldquo;Check mail servers (MX)&rdquo;. For each domain, it shows the mail servers and priorities, or explains what was
              found instead.
            </li>
          </ol>
          <p>
            It also checks each address&apos;s format and suggests fixes for common typos such as gmial.com. Only the
            domain names, the part after the @, are sent for the DNS lookup; the full addresses stay in your browser.
          </p>

          <h2>What the results mean</h2>
          <ul>
            <li>
              <strong>MX records found:</strong> the domain accepts email at those servers. This does not prove a
              particular mailbox exists, only that the domain takes mail.
            </li>
            <li>
              <strong>No MX, but the domain has an address:</strong> under the email standards, senders may fall back
              to delivering to the domain&apos;s own address. That works occasionally but usually indicates a domain
              not set up for email.
            </li>
            <li>
              <strong>Null MX:</strong> a single record with priority 0 and a target of &ldquo;.&rdquo; is the
              domain&apos;s explicit statement that it accepts no email. Do not send to it.
            </li>
            <li>
              <strong>Domain does not exist:</strong> the address is certainly undeliverable, often a typo.
            </li>
          </ul>

          <h2>After changing email provider</h2>
          <p>
            When you move to a new email service, its setup instructions give new MX records. Common problems:
          </p>
          <ul>
            <li>Old MX records left in place alongside the new ones, so some mail goes to the old service.</li>
            <li>Priorities copied wrongly, sending mail to a backup server first.</li>
            <li>
              DNS changes not yet visible everywhere. Records are cached for their time-to-live, often an hour or
              more, so allow time before concluding something is broken.
            </li>
            <li>MX records added at the wrong DNS provider, when the domain&apos;s nameservers point elsewhere.</li>
          </ul>

          <h2>MX is not the whole picture</h2>
          <p>
            MX records cover receiving. Whether your sent mail is trusted depends on other DNS records: SPF, DKIM and
            DMARC, which are TXT records that prove which servers may send for your domain. A domain can receive
            perfectly and still have its outgoing mail land in spam if those are missing.
          </p>

          <h2>Using MX checks on sign-up forms</h2>
          <p>
            Checking that a domain has mail servers catches typos and fake domains at sign-up, before you send a
            confirmation email into the void. It cannot confirm the mailbox itself; only a confirmation email does
            that. For address format rules, see{" "}
            <Link href="/guides/validate-email-addresses">how to check an email address is valid</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "noindex-vs-disallow",
    topic: "Web & developer",
    title: "Noindex vs disallow: how to keep a page out of Google",
    seoTitle: "Noindex vs Disallow in robots.txt: The Difference",
    description:
      "Disallow stops crawling, noindex stops indexing, and using both together can backfire. Which to use for private pages, duplicates, PDFs and staging sites.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["robots-txt-generator"],
    Body: function Body() {
      return (
        <>
          <p>
            You add a page to robots.txt to hide it from Google, and weeks later it appears in search results anyway,
            with the note that no information is available. That is not a bug. Disallow and noindex do different
            jobs, and mixing them up is one of the most common technical SEO mistakes.
          </p>

          <h2>The difference</h2>
          <ul>
            <li>
              <strong>Disallow</strong>, in robots.txt, tells crawlers not to fetch a URL. It controls crawling.
            </li>
            <li>
              <strong>Noindex</strong>, a meta robots tag in the page or an <code>X-Robots-Tag</code> HTTP header, tells
              search engines not to show the page in results. It controls indexing.
            </li>
          </ul>
          <p>
            A disallowed page can still be indexed if other pages link to it: the search engine knows the URL exists,
            even though it never read the content. In Google Search Console this shows up as &ldquo;Indexed, though
            blocked by robots.txt&rdquo;.
          </p>

          <h2>Do not use both on the same page</h2>
          <p>
            If you disallow a page and add a noindex tag, the crawler is not allowed to fetch the page, so it never
            sees the noindex. The page can stay indexed. To remove a page from results, allow crawling and use
            noindex, and wait until it has dropped out. Only then, if you also want to save crawling, add a disallow.
          </p>

          <h2>Which to use</h2>
          <table>
            <thead>
              <tr>
                <th>Situation</th>
                <th>Use</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Thank-you and login pages</td>
                <td>noindex</td>
              </tr>
              <tr>
                <td>Endless filter and search URLs</td>
                <td>disallow</td>
              </tr>
              <tr>
                <td>PDFs you do not want in search</td>
                <td>X-Robots-Tag: noindex</td>
              </tr>
              <tr>
                <td>Staging or test site</td>
                <td>password protection</td>
              </tr>
              <tr>
                <td>Truly private content</td>
                <td>authentication</td>
              </tr>
              <tr>
                <td>Duplicate versions of a page</td>
                <td>canonical tag</td>
              </tr>
            </tbody>
          </table>

          <h2>Noindex in practice</h2>
          <ul>
            <li>
              In the page head: <code>&lt;meta name=&quot;robots&quot; content=&quot;noindex&quot;&gt;</code>.
            </li>
            <li>
              For files without HTML, such as PDFs and images, send the header <code>X-Robots-Tag: noindex</code> from
              the server.
            </li>
            <li>A noindex line inside robots.txt is not supported by Google, so do not rely on it.</li>
          </ul>

          <h2>Pages that are already indexed</h2>
          <p>
            If an unwanted page is already in Google, adding a disallow rule freezes it there: Google can no longer
            crawl it to see any change. The order that works is: remove any disallow for that URL, add noindex,
            wait for Google to recrawl and drop the page (the URL Inspection tool in Search Console shows its
            status), and only then decide whether to block crawling.
          </p>

          <h2>Robots.txt is public</h2>
          <p>
            Anyone can read your robots.txt at <code>/robots.txt</code>. Listing <code>/secret-admin/</code> there
            advertises it. Robots rules are a polite request to well-behaved crawlers, not access control. Protect
            anything sensitive with a login.
          </p>

          <h2>Test your rules</h2>
          <p>
            The <Link href="/generators/robots-txt-generator">Robots.txt Generator and Tester</Link> has a Test URLs
            mode: paste your robots.txt and a list of paths, and it shows which crawler may fetch each one. That
            catches rules that accidentally block your whole site or important pages. To write a new file, see{" "}
            <Link href="/guides/how-to-write-a-robots-txt">how to write a robots.txt file</Link>.
          </p>

          <h2>Removing something urgently</h2>
          <p>
            If a page must disappear from Google quickly, for example after publishing personal data by mistake, take
            it down or protect it, and use the removals tool in Google Search Console, which hides it temporarily
            while the change is processed.
          </p>
        </>
      );
    },
  },

  {
    slug: "favicon-not-showing-in-google",
    topic: "Web & developer",
    title: "Why your favicon is not showing in Google search results",
    seoTitle: "Favicon Not Showing in Google? How to Fix It",
    description:
      "Google shows a generic globe instead of your icon. The size and format Google needs, where to declare it, how long it takes to update, and how to check each step.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["favicon-generator"],
    Body: function Body() {
      return (
        <>
          <p>
            Your favicon shows in browser tabs, but Google search results show a plain globe icon next to your site
            name. Google uses its own rules for which favicons it displays, and browsers are more forgiving. Here is
            what Google looks for.
          </p>

          <h2>What Google needs</h2>
          <ul>
            <li>
              <strong>A square image whose size is a multiple of 48 pixels</strong>: 48 × 48, 96 × 96, 144 × 144,
              192 × 192 and so on. A 16 or 32-pixel icon alone is too small.
            </li>
            <li>
              <strong>A supported format</strong>: ICO, PNG, SVG and other common image formats work.
            </li>
            <li>
              <strong>Declared on the home page</strong> with a <code>&lt;link rel=&quot;icon&quot;&gt;</code> tag in the
              head.
            </li>
            <li>
              <strong>Crawlable</strong>: Google must be able to fetch both the home page and the icon file. A
              robots.txt rule blocking the image folder stops it.
            </li>
            <li>
              <strong>A stable address</strong>: avoid changing the icon&apos;s URL frequently.
            </li>
            <li>
              <strong>Appropriate content</strong>: Google replaces icons it considers inappropriate with a default.
            </li>
          </ul>

          <h2>Make a favicon set</h2>
          <ol>
            <li>
              Open the <Link href="/image/favicon-generator">Favicon Generator</Link> and upload a square logo, or
              type a letter or emoji.
            </li>
            <li>Choose a shape and colours, and check the small preview: simple marks read best at tiny sizes.</li>
            <li>
              Download the set. It includes a <code>favicon.ico</code> with 16, 32 and 48-pixel versions, PNG files at
              16, 32, 180, 192 and 512 pixels, and a web manifest.
            </li>
            <li>Upload the files to your site&apos;s root and paste the provided tags into the page head.</li>
          </ol>

          <h2>Add a tag Google can use</h2>
          <p>
            The standard tags point browsers at the 16 and 32-pixel icons, which are fine for tabs but not multiples
            of 48. Add one more line pointing at the 192-pixel file, which meets Google&apos;s rule:
          </p>
          <p>
            <code className="break-all">
              &lt;link rel=&quot;icon&quot; type=&quot;image/png&quot; sizes=&quot;192x192&quot;
              href=&quot;/android-chrome-192x192.png&quot;&gt;
            </code>
          </p>
          <p>
            The <code>favicon.ico</code> also contains a 48-pixel version, which Google can use, but an explicit
            192-pixel PNG removes the doubt.
          </p>

          <h2>Check each step</h2>
          <ul>
            <li>Open the icon&apos;s URL directly in a browser. It should load, not redirect to a login or a 404.</li>
            <li>View the home page source and confirm the link tags are in the head, not the body.</li>
            <li>Check robots.txt does not block the icon or the folder it lives in.</li>
            <li>
              In Google Search Console, inspect the home page URL and request indexing after changing the icon.
            </li>
          </ul>

          <h2>How long it takes</h2>
          <p>
            Google picks up favicon changes when it next crawls your home page, and updating the icon in results can
            take days or weeks. Requesting indexing of the home page can speed it up but does not guarantee timing.
            Avoid changing the icon repeatedly while waiting.
          </p>
          <p>
            For designing the icon itself and the full set of sizes, see{" "}
            <Link href="/guides/how-to-make-a-favicon">how to make a favicon</Link>. For other search appearance
            issues, see <Link href="/guides/meta-description-length">how long a meta description should be</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "meta-description-length",
    topic: "Web & developer",
    title: "How long should a meta description be?",
    seoTitle: "How Long Should a Meta Description Be?",
    description:
      "Google cuts descriptions by pixel width, about 150 to 160 characters on desktop. How to write one that fits, why Google rewrites it, and what it does for clicks.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["character-counter", "og-preview"],
    Body: function Body() {
      return (
        <>
          <p>
            The meta description is the short summary a page offers search engines. Google may show it under your
            title in results, where it works as an advert for the click. Too long and it is cut off mid-sentence; too
            vague and people scroll past.
          </p>

          <h2>The practical length</h2>
          <p>
            Google does not count characters. It cuts snippets by pixel width, which depends on the letters used: a
            line of &ldquo;w&rdquo;s fills the space faster than a line of &ldquo;i&rdquo;s. In practice, around 150
            to 160 characters fit on desktop before the cut-off, and mobile results can show a little more or less
            depending on the layout. Aim for about 120 to 155 characters, and put the most important part first.
          </p>
          <p>
            The <Link href="/text/character-counter">Character Counter</Link> checks text against a 160-character meta
            description limit and a 60-character page title limit as you type.
          </p>

          <h2>What a good description does</h2>
          <ul>
            <li>Says plainly what the page offers, in the words searchers use.</li>
            <li>Gives a reason to choose this result: free, step by step, with examples, updated for this year.</li>
            <li>Matches the page. A description that promises what the page does not deliver costs trust and clicks.</li>
            <li>Is unique to each page. Duplicate descriptions across a site make every result look the same.</li>
          </ul>
          <p>
            Example for a guide page: &ldquo;Work out the deposit you need for a home, with a worked example showing
            how 5%, 10% and 20% change your monthly payment and interest.&rdquo; At 133 characters, it fits and makes
            the content clear.
          </p>

          <h2>Why Google rewrites it</h2>
          <p>
            Google often replaces the meta description with text from the page that better matches the specific
            search. That is normal, and it happens more for longer, broader queries. A well-written description is
            still used for many searches, especially the main topic of the page, and it is also used by social
            networks and messaging apps when the link is shared.
          </p>

          <h2>Does it affect ranking?</h2>
          <p>
            Google has said meta descriptions are not a ranking factor. Their value is in persuading people to click
            once the page is shown. A better description can raise the click-through rate from the same position,
            which is often the cheapest improvement available on a page that already ranks.
          </p>

          <h2>Social previews</h2>
          <p>
            Links shared on social networks and messaging apps use the Open Graph description if there is one, and
            often fall back to the meta description. The <Link href="/developer/og-preview">Open Graph Preview</Link>{" "}
            shows how a link will look when shared and lets you check or write the tags. The guide to{" "}
            <Link href="/guides/open-graph-link-previews">Open Graph link previews</Link> covers the details.
          </p>

          <h2>Common mistakes</h2>
          <ul>
            <li>Leaving it empty on important pages, so Google picks a random sentence.</li>
            <li>Stuffing it with keywords separated by commas.</li>
            <li>Using quotation marks carelessly; in some set-ups a double quote ends the attribute early.</li>
            <li>Copying the title into the description, which wastes the space.</li>
          </ul>
          <p>
            For writing to a character limit generally, see{" "}
            <Link href="/guides/characters-with-and-without-spaces">characters with and without spaces</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "what-does-lorem-ipsum-mean",
    topic: "Web & developer",
    title: "What does lorem ipsum mean, and where does it come from?",
    seoTitle: "What Does Lorem Ipsum Mean? Origin and Uses",
    description:
      "Lorem ipsum is scrambled Latin from a text by Cicero. What it says, why designers use it, its risks in real projects, and better placeholder choices.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["lorem-ipsum-generator", "word-counter"],
    Body: function Body() {
      return (
        <>
          <p>
            &ldquo;Lorem ipsum dolor sit amet, consectetur adipiscing elit…&rdquo; appears in design mock-ups,
            website templates and unfinished documents everywhere. It looks like Latin and almost is. It is filler
            text, chosen so that a reader sees the shape of the words without being distracted by their meaning.
          </p>

          <h2>Where it comes from</h2>
          <p>
            The text is a scrambled extract from <em>De finibus bonorum et malorum</em> (&ldquo;On the ends of good
            and evil&rdquo;), a philosophical work by Cicero written in 45 BC. The original passage discusses pain and
            pleasure: roughly, that nobody loves pain for its own sake. &ldquo;Lorem&rdquo; is a fragment of
            &ldquo;dolorem&rdquo;, pain, cut off when the passage was chopped up. Words were dropped, altered and
            rearranged, so the familiar version is not real Latin and has no meaning as a whole.
          </p>
          <p>
            It is often claimed that printers have used it since the 1500s, but that claim is not well supported. Its
            wide use is well documented from the 1960s, when it appeared on dry-transfer lettering sheets, and it
            spread further with desktop publishing software from the 1980s onwards.
          </p>

          <h2>Why designers use it</h2>
          <ul>
            <li>It has a natural mix of word lengths, so a layout looks realistic.</li>
            <li>Nobody reads it, so reviewers look at the design rather than editing the copy.</li>
            <li>It is clearly placeholder, so readers do not mistake it for final wording.</li>
          </ul>

          <h2>Generate it</h2>
          <p>
            The <Link href="/generators/lorem-ipsum-generator">Lorem Ipsum Generator</Link> produces placeholder text
            by paragraphs, sentences, words or list items. Choose an amount close to the real content you expect, which
            the <Link href="/text/word-counter">Word Counter</Link> can help you estimate from an existing page.
          </p>

          <h2>The risks</h2>
          <ul>
            <li>
              <strong>It hides content problems.</strong> A layout designed around three neat lines of lorem ipsum may
              break when the real headline is two words or twenty.
            </li>
            <li>
              <strong>It gets published.</strong> Search the web for the phrase and you will find live pages, product
              listings and even printed signs that went out with placeholder text.
            </li>
            <li>
              <strong>It delays the hard part.</strong> Writing the content is often what decides whether a page
              works; leaving it to the end leads to rushed copy.
            </li>
          </ul>

          <h2>Better habits</h2>
          <ul>
            <li>Use real or realistic draft copy whenever it exists, even if rough.</li>
            <li>Test layouts with very short and very long versions of each text.</li>
            <li>Before launch, search the site and documents for &ldquo;lorem&rdquo; and &ldquo;ipsum&rdquo;.</li>
            <li>
              For data-heavy designs, use realistic placeholder data: names of varied lengths, prices with different
              digit counts, long email addresses.
            </li>
          </ul>

          <h2>What the passage actually says</h2>
          <p>
            The original sentences from Cicero, before they were scrambled, say in essence that no one loves, seeks
            or wants pain for its own sake, but that circumstances sometimes arise in which toil and pain can bring
            some great pleasure. A fitting thought for anyone waiting on final copy.
          </p>

          <h2>Other languages</h2>
          <p>
            Lorem ipsum approximates the look of European languages. For designs in Arabic, Hindi, Chinese or other
            scripts, use placeholder text in that script, because line height, word length and text direction all
            change the layout.
          </p>
        </>
      );
    },
  },
];
