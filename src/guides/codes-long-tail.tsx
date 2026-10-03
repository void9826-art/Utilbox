import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-03";

export const codesLongTailGuides: Guide[] = [
  {
    slug: "qr-code-for-google-reviews",
    topic: "Codes, passwords & text",
    title: "How to make a QR code for Google reviews",
    seoTitle: "How to Make a QR Code for Google Reviews",
    description:
      "Turn your Google review link into a QR code for the counter, receipts and table cards. Where to find the link, how to print it, and the review rules to follow.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["qr-code-generator", "qr-code-wifi-vcard"],
    Body: function Body() {
      return (
        <>
          <p>
            Happy customers rarely leave reviews unprompted, mostly because finding the right page takes effort. A QR
            code that opens your Google review form directly removes that effort: a customer points their camera at
            it on the way out, taps, and is already on the star rating.
          </p>

          <h2>Step 1: get your review link</h2>
          <ol>
            <li>Sign in to the Google account that manages your Business Profile.</li>
            <li>Search for your business name on Google or open Google Maps; your profile tools appear.</li>
            <li>
              Choose the option to ask for reviews (Google has labelled it &ldquo;Ask for reviews&rdquo; or
              &ldquo;Get more reviews&rdquo;).
            </li>
            <li>Copy the short link it gives you. It opens the review form for your business.</li>
          </ol>
          <p>
            Test the link on your phone while signed out of the business account. It should open your profile with
            the review box ready.
          </p>

          <h2>Step 2: make the QR code</h2>
          <ol>
            <li>
              Open the <Link href="/generators/qr-code-generator">QR Code Generator</Link> and choose Link.
            </li>
            <li>Paste your review link.</li>
            <li>
              Pick colours if you like, keeping a dark code on a light background, and set error correction to M or
              Q.
            </li>
            <li>Download the PNG and scan it with two different phones before printing.</li>
          </ol>
          <p>
            The code contains your link directly. It does not pass through a redirect service, so it keeps working
            as long as the link does and there is no subscription to expire. See{" "}
            <Link href="/guides/do-qr-codes-expire">do QR codes expire?</Link> for why that matters.
          </p>

          <h2>Where to put it</h2>
          <ul>
            <li>At the till or reception, at eye level, with a short line: &ldquo;Enjoyed your visit? Tell us on Google.&rdquo;</li>
            <li>On receipts, invoices and delivery notes.</li>
            <li>On table cards in cafés and restaurants.</li>
            <li>On a thank-you card in deliveries.</li>
            <li>In email signatures and follow-up emails, as a plain link as well as a code.</li>
          </ul>
          <p>
            For a printable table card with your venue name, the{" "}
            <Link href="/generators/qr-code-wifi-vcard">Wi-Fi and vCard QR Code Generator</Link> makes cards with a
            caption; its Menu mode works for any web address, including a review link.
          </p>

          <h2>Follow the review rules</h2>
          <p>Google&apos;s review policies are strict, and breaking them can get reviews removed. In general:</p>
          <ul>
            <li>Do not offer discounts, gifts or entries into draws in exchange for reviews.</li>
            <li>
              Do not ask only happy customers and steer unhappy ones elsewhere. Asking everyone is fine; filtering is
              not.
            </li>
            <li>Do not write reviews for your own business or ask staff and family to.</li>
          </ul>
          <p>Ask every customer, make it easy, and reply politely to every review, good or bad.</p>

          <h2>Printing it well</h2>
          <p>
            For a counter sign read from arm&apos;s length, a code around 3 to 4 cm across is comfortable. For a
            poster read from across a room, it must be much larger. The guide to{" "}
            <Link href="/guides/qr-code-minimum-print-size">QR code print sizes</Link> gives the rule of thumb. Leave
            a clear white margin around the code; text or borders touching it make scanning unreliable.
          </p>
        </>
      );
    },
  },

  {
    slug: "qr-code-for-a-restaurant-menu",
    topic: "Codes, passwords & text",
    title: "How to make a QR code for a restaurant menu",
    seoTitle: "How to Make a QR Code for a Restaurant Menu",
    description:
      "Put your menu online, make a QR code for it and print table cards with no monthly fee. How to keep one code working when the menu changes, and keep it readable.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["qr-code-wifi-vcard", "qr-code-generator", "compress-pdf"],
    Body: function Body() {
      return (
        <>
          <p>
            A QR code on each table lets guests read the menu on their phone, saves reprinting when prices change,
            and can carry a menu in several languages. Many services sell this as a subscription, but the code
            itself is just a web address, and you can make it free.
          </p>

          <h2>Step 1: put the menu online</h2>
          <ul>
            <li>
              <strong>A page on your website</strong> is best: it loads fast, reads well on phones and can be updated
              at any time.
            </li>
            <li>
              <strong>A PDF</strong> is the quickest option if you already have one. Upload it to your website or a
              file-sharing service and copy a public link. Keep it small: run it through{" "}
              <Link href="/pdf/compress-pdf">Compress PDF</Link> if it is several megabytes, because guests may be
              on slow mobile data.
            </li>
          </ul>

          <h2>Step 2: use an address that will not change</h2>
          <p>
            The QR code contains the web address. If the address changes, every printed code breaks. Choose a stable
            address, such as <code>yourcafe.com/menu</code>, and update what is at that address instead. If you use a
            PDF, replace the file at the same link rather than uploading a new one with a new link.
          </p>

          <h2>Step 3: make the code and table cards</h2>
          <ol>
            <li>
              Open the <Link href="/generators/qr-code-wifi-vcard">Wi-Fi and vCard QR Code Generator</Link> and choose
              Menu.
            </li>
            <li>Enter the menu web address and your venue name for the card.</li>
            <li>Add a card caption such as &ldquo;Scan for our menu&rdquo;.</li>
            <li>Choose colours that suit your branding while keeping the code dark on a light background.</li>
            <li>Print a test card and scan it from a seated position at a real table.</li>
          </ol>
          <p>
            The same tool can also make a Wi-Fi card, so guests can join your network without asking for the
            password. Many cafés print both on one table tent.
          </p>

          <h2>Make the menu readable on a phone</h2>
          <ul>
            <li>Use large text and a single column. A printed A3 menu shrunk to a phone screen is hard to read.</li>
            <li>Put prices next to dishes, not in a separate column far away.</li>
            <li>Mark allergens and dietary symbols clearly, with a key.</li>
            <li>Test on an older, smaller phone, not just your own.</li>
          </ul>

          <h2>Keep paper menus available</h2>
          <p>
            Not every guest has a smartphone, a charged battery or mobile data, and some simply prefer paper. Older
            guests and people with visual impairments may find phone menus hard to use. Keep a few printed menus
            ready and offer them without being asked.
          </p>

          <h2>Durable cards</h2>
          <p>
            Table cards get splashed and handled. Laminate them or use acrylic stands, and print the code at least 3
            cm across. Check the cards weekly: a scratched or faded code stops working. Higher error correction (Q or
            H) helps codes survive minor damage. For sizing, see{" "}
            <Link href="/guides/qr-code-minimum-print-size">what size a QR code should be when printed</Link>. For the
            Wi-Fi card, see <Link href="/guides/how-to-make-a-wifi-qr-code">how to make a Wi-Fi QR code</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "qr-code-minimum-print-size",
    topic: "Codes, passwords & text",
    title: "What size should a QR code be when printed?",
    seoTitle: "QR Code Print Size: Minimum Size and Distance",
    description:
      "The 10-to-1 distance rule, the practical minimum size, how the amount of data and error correction change it, and how colour, quiet zone and paper affect scanning.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["qr-code-generator", "qr-code-wifi-vcard"],
    Body: function Body() {
      return (
        <>
          <p>
            A QR code that scans perfectly on your screen can fail on a poster across the room or on a tiny label.
            Size, distance, the amount of data and print quality all matter. Get them right before printing a
            thousand flyers.
          </p>

          <h2>The distance rule</h2>
          <p>
            A widely used rule of thumb is that a QR code should be at least one tenth as wide as the distance it will
            be scanned from.
          </p>
          <table>
            <thead>
              <tr>
                <th>Scanning distance</th>
                <th>Minimum width</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>20 cm (business card, label)</td>
                <td>2 cm</td>
              </tr>
              <tr>
                <td>50 cm (table card, flyer)</td>
                <td>5 cm</td>
              </tr>
              <tr>
                <td>1 m (counter sign)</td>
                <td>10 cm</td>
              </tr>
              <tr>
                <td>3 m (wall poster)</td>
                <td>30 cm</td>
              </tr>
              <tr>
                <td>10 m (banner, window)</td>
                <td>1 m</td>
              </tr>
            </tbody>
          </table>
          <p>
            Around 2 cm (0.8 inch) is a practical minimum for anything scanned up close. Smaller codes can work with
            short links and good printing, but test them carefully.
          </p>

          <h2>More data needs a bigger code</h2>
          <p>
            A QR code is a grid of squares called modules. A short link needs few modules; a long web address, a full
            contact card or a Wi-Fi password needs many more, so each module is smaller at the same printed size. If
            a code looks dense, either shorten the content, for example by using a shorter page address, or print
            it larger.
          </p>

          <h2>Error correction</h2>
          <p>
            QR codes carry spare data so they still scan when partly damaged. The{" "}
            <Link href="/generators/qr-code-generator">QR Code Generator</Link> offers four levels: L recovers about
            7%, M about 15%, Q about 25% and H about 30%. Higher levels survive scratches and dirt but add modules,
            making the code denser. M is a good default; use Q or H for codes that will be handled or exposed to
            weather.
          </p>

          <h2>The quiet zone</h2>
          <p>
            Scanners need a clear margin around the code, ideally four modules wide. Text, borders or images touching
            the edge of the code are a common cause of failed scans. The generator lets you set the quiet zone; keep
            it when placing the code in a design.
          </p>

          <h2>Colour and contrast</h2>
          <ul>
            <li>Dark code on a light background. Inverted codes (light on dark) fail on some scanner apps.</li>
            <li>Strong contrast: navy on white works, pale grey on white does not.</li>
            <li>Avoid gradients and patterned backgrounds behind the code.</li>
            <li>Glossy and curved surfaces reflect light; test on the real material.</li>
          </ul>

          <h2>Export for print</h2>
          <p>
            Download the code at a large pixel size so it prints crisply; enlarging a small image blurs the module
            edges. A code that is 1000 pixels wide prints sharply up to about 8 cm at 300 DPI. For posters, export at
            the largest size the generator offers.
          </p>

          <h2>Test before you print the run</h2>
          <ol>
            <li>Print one copy at the final size on the final paper.</li>
            <li>Scan it from the real distance, with at least two phones, including an older one.</li>
            <li>Check it opens the right page, not just that it scans.</li>
          </ol>
          <p>
            For cards with a caption ready to print, see the{" "}
            <Link href="/generators/qr-code-wifi-vcard">Wi-Fi and vCard QR Code Generator</Link>. For whether a code
            will keep working, see <Link href="/guides/do-qr-codes-expire">do QR codes expire?</Link>
          </p>
        </>
      );
    },
  },

  {
    slug: "barcodes-for-inventory-labels",
    topic: "Codes, passwords & text",
    title: "How to make barcodes for inventory and stock labels",
    seoTitle: "How to Make Barcodes for Inventory Labels",
    description:
      "Internal barcodes for stock, assets and storage bins do not need GS1 numbers. Which format to use, how to number items, and how to print labels that scan.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["barcode-generator", "sort-lines", "remove-duplicate-lines"],
    Body: function Body() {
      return (
        <>
          <p>
            A small warehouse, a school equipment cupboard or a workshop full of tools can be tracked with a barcode
            scanner and a spreadsheet. The barcodes only need to be read inside your organisation, which makes them
            much simpler than retail barcodes: no registration, no fees, any numbering scheme you like.
          </p>

          <h2>Internal codes versus retail codes</h2>
          <p>
            Retail barcodes such as EAN-13 and UPC-A carry numbers issued by GS1, so that every product in every shop
            worldwide is unique. Making one up risks clashing with a real product. For internal use, use a format that
            does not imply a registered number. Code 128 is the usual choice. The guide to{" "}
            <Link href="/guides/upc-vs-ean-vs-code-128">UPC vs EAN vs Code 128</Link> explains the difference.
          </p>

          <h2>Choose the format</h2>
          <ul>
            <li>
              <strong>Code 128:</strong> letters, numbers and symbols, compact, read by every modern scanner. The
              default for stock, assets and bins.
            </li>
            <li>
              <strong>Code 39:</strong> older, wider, uppercase letters and numbers only. Use it only if existing
              equipment needs it.
            </li>
            <li>
              <strong>ITF-14:</strong> for outer shipping cartons, usually printed on corrugated board.
            </li>
          </ul>

          <h2>Design the numbering scheme</h2>
          <ul>
            <li>
              <strong>Keep it short.</strong> Shorter values make smaller, easier-to-scan barcodes. TOOL-0042 beats
              WORKSHOP-POWER-TOOLS-DRILL-0042.
            </li>
            <li>
              <strong>Use a prefix by type:</strong> ASSET-, BIN-, SKU-, so a scan tells you what kind of thing it is.
            </li>
            <li>
              <strong>Pad numbers with zeros</strong>, such as 0042, so they sort in order; see{" "}
              <Link href="/guides/how-to-sort-a-list-naturally">sorting a list naturally</Link>.
            </li>
            <li>
              <strong>Avoid look-alike characters</strong> such as O and 0, I and 1, in case someone types a code by
              hand.
            </li>
            <li>
              <strong>Never reuse a number</strong> for a different item, even after the first is retired.
            </li>
          </ul>
          <p>
            Keep the master list in a spreadsheet. Before printing, check it for repeats with{" "}
            <Link href="/text/remove-duplicate-lines">Remove Duplicate Lines</Link> and put it in order with{" "}
            <Link href="/text/sort-lines">Sort Lines</Link>.
          </p>

          <h2>Make the barcodes</h2>
          <ol>
            <li>
              Open the <Link href="/generators/barcode-generator">Barcode Generator</Link> and choose CODE128.
            </li>
            <li>Type the value, such as BIN-A-014.</li>
            <li>
              Keep &ldquo;Show the value under the bars&rdquo; on, so a person can read the code when a scanner
              fails.
            </li>
            <li>Adjust bar width and height for your label size, then download.</li>
          </ol>

          <h2>Printing labels that scan</h2>
          <ul>
            <li>
              <strong>Leave a quiet zone</strong>, a clear margin either side of the bars. Cutting too close is the
              commonest failure.
            </li>
            <li>
              <strong>Do not squash the bars.</strong> Resize proportionally; narrow bars printed on a low-resolution
              label printer can merge.
            </li>
            <li>
              <strong>Use durable labels</strong> for tools and outdoor assets: thermal-transfer or laminated labels
              last far longer than paper.
            </li>
            <li>
              <strong>Test the first sheet</strong> with your actual scanner before printing hundreds.
            </li>
          </ul>

          <h2>QR codes for inventory?</h2>
          <p>
            QR codes hold more data and can be scanned with any phone camera, which suits asset tags that link to a
            maintenance page. Linear barcodes scan faster with handheld scanners. Many organisations use Code 128 on
            shelves and bins and QR codes on equipment. For QR printing sizes, see{" "}
            <Link href="/guides/qr-code-minimum-print-size">QR code print sizes</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "isbn-barcode-for-a-book",
    topic: "Codes, passwords & text",
    title: "How to make an ISBN barcode for a self-published book",
    seoTitle: "How to Make an ISBN Barcode for Your Book",
    description:
      "An ISBN barcode is an EAN-13 made from your 13-digit ISBN. Where the ISBN comes from, how to create the barcode, the price add-on, and where it goes on the cover.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["barcode-generator"],
    Body: function Body() {
      return (
        <>
          <p>
            The barcode on the back of a book is not a special book format. It is an ordinary EAN-13 retail barcode
            that encodes the book&apos;s 13-digit ISBN. Once you have an ISBN, making the barcode takes a minute.
          </p>

          <h2>First, get an ISBN</h2>
          <p>
            ISBNs are issued by a national ISBN agency in each country, for example Bowker in the United States and
            Nielsen in the UK and Ireland. Some countries issue them free; others charge, often less per number when
            bought in blocks. Self-publishing platforms may also offer a free ISBN, but it may list the platform as
            the publisher.
          </p>
          <p>
            Each format needs its own ISBN: paperback, hardback and ebook are separate. A new edition with real
            changes needs a new ISBN; a reprint with typo fixes does not.
          </p>

          <h2>ISBN-13 is an EAN-13</h2>
          <p>
            Modern ISBNs have 13 digits and start with 978 or 979, a prefix reserved for books. That makes them valid
            EAN-13 numbers, readable by every shop scanner. The last digit is a check digit calculated from the
            other twelve. If you have an old 10-digit ISBN, the agency&apos;s 13-digit version is the one to encode.
          </p>

          <h2>Make the barcode</h2>
          <ol>
            <li>
              Open the <Link href="/generators/barcode-generator">Barcode Generator</Link> and choose EAN-13.
            </li>
            <li>
              Type the ISBN without hyphens: 978 and the rest, 13 digits. If you enter 12, the check digit is added;
              if you enter 13, it is checked and you are told if it is wrong.
            </li>
            <li>Keep the digits shown under the bars.</li>
            <li>Download and place the image on your cover file.</li>
          </ol>
          <p>
            Many cover designs also print the ISBN in human-readable form above the barcode, with hyphens, such as
            &ldquo;ISBN 978-1-234567-89-7&rdquo;. Add that as normal text in your cover design.
          </p>

          <h2>The price add-on</h2>
          <p>
            Books sold in North American bookshops often carry a small second barcode to the right of the main one: a
            five-digit price add-on. The first digit is a currency code, 5 for US dollars, followed by the price, so
            51299 means $12.99, and 90000 means no price is encoded. This generator does not create the add-on. Check
            whether your distributor needs it; many print-on-demand services add their own barcode, and many markets
            do not use add-ons at all.
          </p>

          <h2>Size and placement</h2>
          <ul>
            <li>
              Place the barcode on the back cover, usually in the lower right, away from the spine and the trim edge.
            </li>
            <li>
              Print it black on a white box, even if the cover is coloured. Red, gold and pale bars do not scan.
            </li>
            <li>
              Keep it near standard size. EAN-13 can be scaled down only a little before scanners struggle; resize
              proportionally and never squash it to fit.
            </li>
            <li>Leave a clear margin on both sides of the bars.</li>
          </ul>

          <h2>Check before sending to print</h2>
          <ol>
            <li>Compare the digits under the bars with your ISBN record, digit by digit.</li>
            <li>Scan a printed proof with a phone barcode app.</li>
            <li>Check your printer&apos;s cover template for any area reserved for their own barcode.</li>
          </ol>
          <p>
            For other retail barcode types and when you need GS1 numbers, see{" "}
            <Link href="/guides/upc-vs-ean-vs-code-128">UPC vs EAN vs Code 128</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-long-to-crack-a-password",
    topic: "Codes, passwords & text",
    title: "How long would it take to crack my password?",
    seoTitle: "How Long Would It Take to Crack My Password?",
    description:
      "From seconds to millions of years, depending on length, randomness and how a site stores it. Worked examples, why patterns ruin estimates, and a safe check.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["password-strength-checker", "password-generator"],
    Body: function Body() {
      return (
        <>
          <p>
            Password meters promise answers like &ldquo;3 centuries&rdquo;. Those numbers depend on assumptions: how
            the attacker gets to try guesses, how fast they can guess, and whether your password is truly random or
            follows a pattern people commonly use. Understanding the assumptions tells you what really keeps an account
            safe.
          </p>

          <h2>Two very different attacks</h2>
          <ul>
            <li>
              <strong>Online guessing:</strong> trying passwords on the real login page. Sites limit attempts, lock
              accounts or add delays, so an attacker may get only a handful of guesses per hour. Even weak-ish
              passwords survive, unless they are among the most common ones.
            </li>
            <li>
              <strong>Offline cracking:</strong> after a data breach, attackers have the stored password hashes and
              can test guesses on their own hardware, with no limits. Speed then depends on how the site stored the
              passwords. A fast, outdated hash allows billions of guesses per second; a slow, modern one allows far
              fewer.
            </li>
          </ul>

          <h2>Worked examples</h2>
          <p>
            Assuming truly random characters and an offline attacker making ten billion guesses per second against a
            fast hash:
          </p>
          <table>
            <thead>
              <tr>
                <th>Password</th>
                <th>Worst case</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>8 random lowercase letters</td>
                <td>about 21 seconds</td>
              </tr>
              <tr>
                <td>8 random characters, all types</td>
                <td>about 7 days</td>
              </tr>
              <tr>
                <td>16 random lowercase letters</td>
                <td>about 138,000 years</td>
              </tr>
              <tr>
                <td>12 random characters, all types</td>
                <td>about 1.5 million years</td>
              </tr>
            </tbody>
          </table>
          <p>
            Length beats complexity: sixteen lowercase letters outlast eight characters with symbols by a huge
            margin. On average an attacker finds a password in half the worst-case time.
          </p>

          <h2>Why your real password is weaker than the maths</h2>
          <p>
            Those figures apply only to random passwords. Human passwords follow patterns: a word, a capital at the
            start, a number and a symbol at the end, such as <code>Summer2026!</code>. Cracking software tries
            dictionary words, names, dates, keyboard runs like qwerty and common substitutions like @ for a first. A
            password that would take centuries by brute force can fall in seconds if it matches a pattern.
          </p>

          <h2>Check yours safely</h2>
          <ol>
            <li>
              Open the <Link href="/developer/password-strength-checker">Password Strength Checker</Link>. It runs in
              your browser and never sends the password anywhere.
            </li>
            <li>
              Type a password. It estimates the guesses needed using pattern recognition, not just length, and shows
              how an attacker would break it into parts.
            </li>
            <li>
              Read the times for four scenarios: online with and without rate limiting, and a stolen database with a
              slow or fast hash.
            </li>
          </ol>
          <p>
            Even with a private tool, it is good practice to test a password similar to yours rather than your actual
            one.
          </p>

          <h2>What actually protects you</h2>
          <ul>
            <li>
              <strong>A unique password for every site.</strong> Reused passwords are the main way accounts are taken
              over: one breach unlocks the others.
            </li>
            <li>
              <strong>Random passwords or passphrases</strong> from the{" "}
              <Link href="/generators/password-generator">Password Generator</Link>, stored in a password manager.
            </li>
            <li>
              <strong>Two-step verification</strong> on email, banking and anything important, so a stolen password
              alone is not enough.
            </li>
          </ul>
          <p>
            For creating passwords you can remember, see{" "}
            <Link href="/guides/how-to-create-a-strong-password">how to create a strong password</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "strong-wifi-password-easy-to-type",
    topic: "Codes, passwords & text",
    title: "A strong Wi-Fi password that is still easy to type",
    seoTitle: "Strong Wi-Fi Password Ideas That Are Easy to Type",
    description:
      "Wi-Fi passwords get typed on TVs, consoles and guests' phones. How to make one that is long and strong but painless to enter, and how to share it with a QR code.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["password-generator", "qr-code-wifi-vcard", "password-strength-checker"],
    Body: function Body() {
      return (
        <>
          <p>
            A Wi-Fi password has an unusual job. It must resist anyone nearby trying to break into your network, yet
            it gets typed with a TV remote, a games controller and the tiny keyboard of a visitor&apos;s phone. Random
            strings like <code>x7#Qp!2v</code> are strong but miserable to enter. There is a better way.
          </p>

          <h2>Length over symbols</h2>
          <p>
            Wi-Fi passwords on WPA2 and WPA3 networks can be 8 to 63 characters long. Anyone who captures the
            network&apos;s handshake can try guesses offline at high speed, so a short password is the main risk. A
            long passphrase of ordinary words is both stronger and easier to type than a short string full of
            symbols.
          </p>

          <h2>Make a passphrase step by step</h2>
          <ol>
            <li>
              Open the <Link href="/generators/password-generator">Password Generator</Link> and choose Word
              passphrase.
            </li>
            <li>Choose four or five words.</li>
            <li>
              Pick a separator. A hyphen is easy on every keyboard; avoid spaces, which some devices handle
              inconsistently.
            </li>
            <li>
              Decide on capitals and a number. Many routers accept passphrases without them, but if your router or
              devices insist, use &ldquo;Capitalise each word&rdquo; and &ldquo;Append a two-digit number&rdquo;.
            </li>
            <li>Generate a few and pick one that is easy to say aloud and spell.</li>
          </ol>
          <p>
            The result looks like four random words joined by hyphens: long, strong against offline guessing because
            the words are chosen randomly from a large list, and quick to type on a TV keyboard.
          </p>

          <h2>Avoid characters that cause trouble</h2>
          <ul>
            <li>Look-alike characters, such as 0 and O or l and 1, which guests misread from a card.</li>
            <li>Symbols that are hidden in a sub-menu on TV and console keyboards.</li>
            <li>Non-English letters with accents, which some devices cannot type.</li>
          </ul>
          <p>
            For random-character passwords, the generator&apos;s &ldquo;Exclude look-alike characters&rdquo; option
            removes the confusing pairs.
          </p>

          <h2>Share it with a QR code</h2>
          <p>
            The easiest way for guests to join is to scan a code instead of typing. In the{" "}
            <Link href="/generators/qr-code-wifi-vcard">Wi-Fi and vCard QR Code Generator</Link>, choose Wi-Fi,
            enter the network name exactly as it appears and the password, choose the security type, and print a
            card. Untick &ldquo;Print the password on the card&rdquo; if you only want the code visible. The full
            walkthrough is in <Link href="/guides/how-to-make-a-wifi-qr-code">how to make a Wi-Fi QR code</Link>.
          </p>

          <h2>Guest networks</h2>
          <p>
            Most routers can run a separate guest network. Give visitors that password, and keep your main network&apos;s
            password for your own devices. Then you can change the guest password after a party without reconnecting
            your smart TV, printer and thermostat.
          </p>

          <h2>Do not forget the router itself</h2>
          <ul>
            <li>
              The router&apos;s admin password, used to change its settings, is separate from the Wi-Fi password.
              Change it from the default.
            </li>
            <li>Choose WPA3, or WPA2/WPA3 mixed mode if older devices need it. Avoid WEP entirely.</li>
            <li>Keep the router&apos;s firmware updated.</li>
          </ul>
          <p>
            To test a candidate, the <Link href="/developer/password-strength-checker">Password Strength Checker</Link>{" "}
            estimates how many guesses it would take, privately in your browser.
          </p>
        </>
      );
    },
  },
];
