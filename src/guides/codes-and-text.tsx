import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-09-27";
const UPDATED = "2026-09-30";

export const codesAndTextGuides: Guide[] = [
  {
    slug: "do-qr-codes-expire",
    topic: "Codes, passwords & text",
    title: "Do QR codes expire? How to make one that never does",
    seoTitle: "Do QR Codes Expire? Make One That Never Does",
    description:
      "Why some QR codes stop working and others last forever, how to make a free QR code with no expiry, and how to print one that always scans.",
    published: PUBLISHED,
    updated: UPDATED,
    tools: ["qr-code-generator", "qr-code-wifi-vcard", "utm-builder"],
    Body: function Body() {
      return (
        <>
          <p>
            A QR code on a poster or a business card has to keep working for years. Whether it will
            depends on one thing people rarely check when they make it: whether it is static or
            dynamic.
          </p>

          <h2>Static and dynamic QR codes</h2>
          <ul>
            <li>
              <strong>A static QR code</strong> stores your content — the web address, the text, the
              Wi-Fi details — directly in the pattern. A phone reads it and goes straight there. There
              is nothing in between that can expire.
            </li>
            <li>
              <strong>A dynamic QR code</strong> stores a short link belonging to the service that
              made it. Scanning it visits that service, which forwards the visitor to your real
              address. That allows scan counts and editing the destination later — but if the service
              shuts down, or the plan lapses, the short link stops working and so does every printed
              copy of your code.
            </li>
          </ul>
          <p>
            So QR codes themselves do not expire. Dynamic codes can stop working because they depend
            on someone else&apos;s server.
          </p>

          <h2>How to tell which kind you have</h2>
          <p>
            Scan the code and look at the address your phone shows before you tap it. If it is your
            own address — your website, your menu, your booking page — the code is static. If it is
            a short link on a domain you do not recognise, the code is dynamic, and it will only work
            for as long as that domain keeps forwarding it.
          </p>
          <p>
            This is worth checking before anything goes to print. Some generator sites create dynamic
            codes by default and switch them off when a free trial ends unless you subscribe. People
            usually discover this after the flyers have been handed out, when the code starts
            leading to a payment page instead of their menu.
          </p>

          <h2>Make a QR code that never expires</h2>
          <ol>
            <li>
              Open the <Link href="/generators/qr-code-generator">QR Code Generator</Link>.
            </li>
            <li>Choose what the code holds: a link, plain text, an email, a phone number, an SMS or Wi-Fi details.</li>
            <li>Fill in the fields; the code redraws as you type.</li>
            <li>Download it as PNG for screens and documents, or SVG for print and anything large.</li>
          </ol>
          <p>
            These codes are static: your content is in the pattern itself, with no redirect, no
            account, no watermark and no expiry. They keep working even if this site disappears.
          </p>

          <h2>When a static code can still stop working</h2>
          <p>
            The code never changes, but the thing it points to can. A static code fails when the page
            it links to is deleted or moved, when the domain name is not renewed, or — for a Wi-Fi
            code — when the network password changes. None of that is the code expiring; the
            destination has gone.
          </p>
          <p>
            You can protect yourself and keep the code static. Point it at an address on a domain
            you control, and choose one you can keep stable, such as yoursite.com/menu rather than a
            link to this season&apos;s PDF. When the menu changes, update what that page shows. The
            printed code carries on working because the address it holds never changed.
          </p>

          <h2>What you give up</h2>
          <p>
            A static code cannot be edited after printing, and it cannot count scans. If you need to
            know how many people scanned a poster, point the code at a link tagged with the{" "}
            <Link href="/generators/utm-builder">UTM Link Builder</Link> and your website analytics
            will count the visits — without any third-party redirect.
          </p>
          <p>
            Dynamic codes are not a trick; they solve a real problem. If you are printing something
            at large scale and genuinely need to repoint it later to addresses you cannot predict,
            or you need scan reports without running analytics on your own site, a paid dynamic
            service does that. Go in knowing the terms: what it costs each year, what happens to
            existing codes if you stop paying, and whether you can export or move them.
          </p>

          <h2>Print it so it always scans</h2>
          <ul>
            <li>
              <strong>Dark on light.</strong> Inverted codes (light on dark) fail on many scanners,
              and low contrast fails on all of them.
            </li>
            <li>
              <strong>Keep the margin.</strong> The empty border around the pattern, called the quiet
              zone, is part of the code. Do not crop it or print over it.
            </li>
            <li>
              <strong>Size for the distance.</strong> A common rule of thumb is that a code can be
              scanned from about ten times its own width, so a 3 cm code works at arm&apos;s length
              and a poster read from across a room needs a much bigger one.
            </li>
            <li>
              <strong>Keep the content short.</strong> The more you encode, the denser and harder to
              scan the pattern becomes.
            </li>
            <li>
              <strong>Raise error correction for tough conditions.</strong> Level L recovers about 7%
              damage, M 15%, Q 25% and H 30%. Use H for small prints, curved surfaces, or a logo in
              the middle.
            </li>
            <li>Test the printed code with two or three different phones before printing hundreds.</li>
          </ul>

          <h2>How much a QR code can hold</h2>
          <p>
            A QR code is a grid of small squares called modules. The smallest version is 21 modules
            on each side and the largest is 177, and the generator picks the smallest grid that fits
            your content at the error-correction level you chose. In theory the largest grid holds
            about 4,300 letters and digits. In practice a code that dense is hard for a phone to
            read, so keep the content under a couple of hundred characters.
          </p>
          <p>
            This is the practical reason to shorten what you encode. A long address with tracking
            parameters produces a fine, dense pattern that needs to be printed large; a short
            address produces a coarse pattern that scans from further away and survives a poor
            print. As a minimum, print a code holding a short link at about 2 cm across for
            something held in the hand, and scale up from there using the ten-times rule.
          </p>

          <h2>Adding a logo</h2>
          <p>
            A logo in the middle works because of error correction: the scanner rebuilds the covered
            modules from the redundant data. Set error correction to H and keep the logo under about
            a fifth of the code&apos;s width. Leave the three large corner squares completely clear
            — the scanner uses them to find and orient the code, and they cannot be reconstructed.
            Then test it on several phones, because a logo spends the safety margin that would
            otherwise cover scuffs and bad lighting.
          </p>

          <h2>Wi-Fi codes for guests</h2>
          <p>
            A Wi-Fi QR code lets guests join your network by pointing their camera at it. The{" "}
            <Link href="/generators/qr-code-wifi-vcard">Wi-Fi and vCard QR Code Generator</Link> makes
            one — enter the network name, password and security type exactly as your router shows
            them — and lays it out as a printable card.
          </p>
          <p>
            Remember that a Wi-Fi code contains the password in readable form: anyone who scans it
            can see it. Display it only where you would be happy to write the password on the wall,
            and make a new code whenever you change the password.
          </p>

          <h2>Scanning other people&apos;s codes safely</h2>
          <p>
            The same directness that makes static codes reliable means a code can point anywhere.
            Before you open a scanned link, read the address your phone shows. Be wary of a sticker
            placed over another code on a parking meter, a menu or a poster, and of any code that
            leads to a page asking for a password or card details. A QR code is only a way of typing
            an address for you; treat the address with the same care as a link in an email.
          </p>
        </>
      );
    },
  },

  {
    slug: "upc-vs-ean-vs-code-128",
    topic: "Codes, passwords & text",
    title: "UPC, EAN or Code 128: which barcode do you need?",
    seoTitle: "UPC vs EAN vs Code 128: Which Barcode to Use",
    description:
      "The main barcode types explained — 12-digit UPC-A, 13-digit EAN-13, EAN-8, ITF-14, Code 128 and Code 39 — and which one fits your products or labels.",
    published: PUBLISHED,
    updated: UPDATED,
    tools: ["barcode-generator", "qr-code-generator"],
    Body: function Body() {
      return (
        <>
          <p>
            Barcodes look alike, but each format has its own rules about what it can hold and where
            it is accepted. Choosing the right one comes down to a single question: will it be
            scanned at a shop till, or only inside your own business?
          </p>

          <h2>Retail barcodes</h2>
          <ul>
            <li>
              <strong>UPC-A — 12 digits.</strong> The standard retail barcode in North America, also
              called UCC-12.
            </li>
            <li>
              <strong>EAN-13 — 13 digits.</strong> The retail standard across most of the rest of the
              world. In Japan it is called JAN.
            </li>
            <li>
              <strong>EAN-8 — 8 digits.</strong> A shorter version for products too small for an
              EAN-13.
            </li>
            <li>
              <strong>ITF-14 — 14 digits.</strong> Used on outer cartons and cases rather than on the
              product itself.
            </li>
          </ul>
          <p>
            All of these end in a <strong>check digit</strong>, calculated from the others so a
            scanner can detect a misread. The{" "}
            <Link href="/generators/barcode-generator">Barcode Generator</Link> adds it for you: type
            12 digits for an EAN-13 and it supplies the 13th, or type all 13 and it verifies them.
          </p>

          <h2>What the digits mean</h2>
          <p>
            A retail barcode number is not random. It is a Global Trade Item Number, or GTIN, made
            of three parts: a company prefix that GS1 assigns to the brand owner, an item number the
            company chooses for each product, and the check digit.
          </p>
          <p>
            The first digits show which national GS1 organisation issued the prefix — numbers
            beginning 50 come from the UK, 400 to 440 from Germany, 890 from India, and most numbers
            beginning 0 or 1 from the United States and Canada. That is where the company registered, not where the
            product was made: goods manufactured in one country routinely carry a prefix from
            another. Two ranges have special uses. Numbers beginning 978 or 979 are books, where the
            barcode is the ISBN. And EAN-13 numbers beginning with 2 are reserved for a shop&apos;s
            own use, such as the labels printed for cheese or meat weighed at the counter.
          </p>

          <h2>How the check digit is calculated</h2>
          <p>
            The check digit is simple enough to work out by hand, which is useful when a number will
            not scan and you want to know whether it was mistyped. For an EAN-13, take the first 12
            digits, add up the digits in the odd positions, add three times the digits in the even
            positions, and find what you must add to reach the next multiple of ten.
          </p>
          <p>Take 400638133393:</p>
          <ol>
            <li>Odd positions: 4 + 0 + 3 + 1 + 3 + 9 = 20.</li>
            <li>Even positions: 0 + 6 + 8 + 3 + 3 + 3 = 23, and 23 × 3 = 69.</li>
            <li>Total: 20 + 69 = 89. The next multiple of ten is 90, so the check digit is 1.</li>
          </ol>
          <p>
            The full number is 4006381333931. UPC-A works the same way with the weights swapped: the
            odd positions are multiplied by three. If a scanner reads a digit wrongly, the sum no
            longer ends in zero and the scan is rejected instead of ringing up the wrong product.
          </p>

          <h2>You need a registered number to sell in shops</h2>
          <p>
            Any barcode will scan, but a retailer&apos;s system identifies products by the number,
            and numbers for retail are allocated by GS1, the organisation that runs the system. A
            number you invent will scan as a number that means nothing — or, worse, as someone
            else&apos;s product. If you are selling through shops or large marketplaces, get your
            numbers from GS1 in your country first, then generate the barcodes.
          </p>
          <p>
            Be careful with very cheap barcodes sold by resellers. They are usually numbers from
            prefixes issued to another company years ago. They scan, but the prefix is registered to
            that other company, and retailers and marketplaces that check numbers against
            GS1&apos;s database may refuse the listing. If a retailer has told you which source they
            accept, follow that.
          </p>

          <h2>Barcodes for your own use</h2>
          <ul>
            <li>
              <strong>Code 128</strong> encodes any printable text — letters, numbers and symbols —
              compactly. It is the workhorse for shipping labels, stock control, asset tags and
              anything internal.
            </li>
            <li>
              <strong>Code 39</strong> is an older format with a smaller character set, still common
              in automotive and defence logistics.
            </li>
            <li>
              <strong>Codabar</strong> turns up in libraries and laboratories.
            </li>
          </ul>
          <p>For internal use you can encode any value you like — no registration needed.</p>
          <p>
            Between the first two, choose Code 128 unless something forces Code 39 on you. Code 39
            holds only capital letters, digits and seven symbols (space, hyphen, full stop, dollar,
            slash, plus and percent), and it produces a wider barcode for the same content. Code 128
            handles lower-case letters and packs digits tightly, so a long serial number fits on a
            small label. Code 39 survives mainly where an industry standard or an old scanner
            requires it.
          </p>

          <h2>A quick way to choose</h2>
          <ul>
            <li>
              <strong>A product sold in shops in North America:</strong> UPC-A, with a GS1 number.
            </li>
            <li>
              <strong>A product sold in shops elsewhere:</strong> EAN-13, with a GS1 number. Tills
              in North America read EAN-13 as well.
            </li>
            <li>
              <strong>A very small product:</strong> EAN-8, which needs its own short number from
              GS1.
            </li>
            <li>
              <strong>A carton or case of products:</strong> ITF-14.
            </li>
            <li>
              <strong>Stock, assets, shelves, internal shipping labels:</strong> Code 128.
            </li>
            <li>
              <strong>A link, contact details or Wi-Fi for a phone to read:</strong> not a barcode
              at all — use a QR code.
            </li>
          </ul>

          <h2>Converting UPC to EAN</h2>
          <p>
            Put a 0 in front. A 12-digit UPC-A with a leading zero is a valid 13-digit EAN-13, and the
            check digit stays the same, because the extra zero adds nothing to the calculation.
          </p>
          <p>
            For example, the UPC-A number 036000291452 becomes the EAN-13 number 0036000291452. Both
            end in 2, and both describe the same product. This is why one number from GS1 works in
            both systems.
          </p>

          <h2>Code 128 is not GS1-128</h2>
          <p>
            GS1-128 — once called EAN-128 or UCC-128 — is Code 128 with a special start character
            (FNC1) and standard &ldquo;application identifiers&rdquo; for things like batch numbers
            and expiry dates. It is used on logistics labels that trading partners must be able to
            read automatically. The Barcode Generator produces standard Code 128, which suits
            internal and shipping labels, but it does not add FNC1, so it cannot make certified
            GS1-128 labels.
          </p>

          <h2>Printing tips</h2>
          <p>
            Download SVG for print so the bars stay sharp at any size, keep a clear margin either
            side, print dark bars on a light background, and test with a real scanner or phone app
            before printing a full run. For links, contact details or Wi-Fi, a{" "}
            <Link href="/generators/qr-code-generator">QR code</Link> is the better fit — phones read
            them with the camera app.
          </p>
          <ul>
            <li>
              <strong>Size.</strong> The standard size of an EAN-13 symbol, including its margins, is
              37.29 mm wide by 25.93 mm high. The GS1 rules allow it to be printed between 80% and
              200% of that. Going smaller risks scan failures at the till.
            </li>
            <li>
              <strong>Do not squash it.</strong> Reducing the height of the bars to save space makes
              the code harder to scan at an angle. Scale the whole symbol instead.
            </li>
            <li>
              <strong>Colour.</strong> Black on white is safest. Scanners use red light, so red bars
              look the same as the background and cannot be read, and a red or dark background
              swallows the bars.
            </li>
            <li>
              <strong>Surface.</strong> Avoid seams, folds, curves and shrink wrap across the bars.
              On a bottle, turn the barcode so the bars run around the curve like the rungs of a
              ladder.
            </li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "how-to-create-a-strong-password",
    topic: "Codes, passwords & text",
    title: "How to create a strong password you can actually use",
    seoTitle: "How to Create a Strong Password You'll Use",
    description:
      "Why length beats symbols, what makes passwords easy to crack, when to use a passphrase, and how to generate and check strong passwords safely.",
    published: PUBLISHED,
    updated: UPDATED,
    tools: ["password-generator", "password-strength-checker"],
    Body: function Body() {
      return (
        <>
          <p>
            Most advice about passwords — add a capital, a number and a symbol — produces passwords
            that are hard for people to remember and easy for computers to guess. Here is what
            actually makes a password strong.
          </p>

          <h2>How passwords get cracked</h2>
          <p>
            Attackers do not try random combinations first. They try the passwords people actually
            choose: common words, names, dates, keyboard runs like &ldquo;qwerty&rdquo;, and the
            predictable substitutions people use to meet the rules. &ldquo;P@ssw0rd1!&rdquo; ticks
            every box on a sign-up form and falls almost instantly, because it is a dictionary word
            with the most obvious changes.
          </p>
          <p>
            It also helps to know where the guessing happens. Nobody sits typing guesses into a
            login page; sites lock accounts after a few failures. The real danger is a breach. When
            a site&apos;s database is stolen, the attacker gets a list of scrambled passwords and
            can test guesses against it on their own hardware, as fast as that hardware will go and
            with nothing to lock them out. A strong password is one that survives that.
          </p>

          <h2>Length beats complexity</h2>
          <p>
            Strength is measured in bits of entropy — the number of guesses an attacker needs, where
            every extra bit doubles the work. A random 16-character password drawn from letters,
            numbers and symbols has about 105 bits, far beyond brute force. Adding length adds far
            more than swapping a letter for a symbol. Aim for at least 16 characters for anything
            important.
          </p>
          <p>
            The arithmetic is worth seeing once. Each random character adds a fixed number of bits,
            depending on how many characters it was picked from: about 4.7 bits from lower-case
            letters alone, about 6 from letters and digits, and about 6.6 from letters, digits and
            symbols. The last column below assumes an attacker testing 10 billion guesses a
            second against a stolen database:
          </p>
          <table>
            <thead>
              <tr>
                <th>Password</th>
                <th>Entropy</th>
                <th>Time to try all</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>8 random characters</td>
                <td>52 bits</td>
                <td>about a week</td>
              </tr>
              <tr>
                <td>12 random characters</td>
                <td>79 bits</td>
                <td>1.5 million years</td>
              </tr>
              <tr>
                <td>16 random characters</td>
                <td>105 bits</td>
                <td>effectively never</td>
              </tr>
            </tbody>
          </table>
          <p>
            Four more characters turned a week into a million years. No amount of clever punctuation
            in an eight-character password comes close to that. These figures apply only to
            passwords chosen at random — a password a person made up has far less entropy than its
            length suggests, because people are predictable.
          </p>

          <h2>Generate one step by step</h2>
          <ol>
            <li>
              Open the <Link href="/generators/password-generator">Password Generator</Link>.
            </li>
            <li>Choose a random password or a word-based passphrase.</li>
            <li>Set the length and the character types.</li>
            <li>
              If you will type it by hand, exclude ambiguous characters — 0 and O, 1, l and I — so it
              cannot be misread.
            </li>
            <li>Copy it straight into your password manager or the sign-up form.</li>
          </ol>
          <p>
            Passwords are generated in your browser using its cryptographic random number generator,
            and nothing is sent or stored. Close the tab and it is gone.
          </p>

          <h2>When to use a passphrase</h2>
          <p>
            For the few passwords you have to type or remember — your computer login, your password
            manager&apos;s master password — a passphrase of random words is easier. Four random
            words from a large list give roughly 52 bits: weaker than a long random string, but far
            stronger than anything a person invents, and much easier to type on a phone. Five or six
            words is better still. The words must be chosen at random, not picked by you; a phrase
            from a song or film is guessable.
          </p>
          <p>
            Each random word adds about 13 bits, so five words give roughly 65 bits and six about 78
            — the same strength as a 12-character random password, in a form you can actually
            remember. For a master password that protects everything else, six words is a sensible
            choice.
          </p>

          <h2>Check a password you already use</h2>
          <p>
            The <Link href="/developer/password-strength-checker">Password Strength Checker</Link>{" "}
            estimates how quickly a password could be guessed and names the patterns that weaken it —
            dictionary words, dates, keyboard runs. It runs on your device, so the password is never
            sent anywhere.
          </p>
          <p>
            Keep in mind what it measures. It estimates how guessable a password is; it cannot know
            whether that password has already appeared in a breach, because checking would mean
            sending something to an outside service. A strong password that has leaked, or that you
            use on several sites, is still unsafe. Password managers and some browsers offer breach
            alerts, which cover that side.
          </p>

          <h2>The habits that matter more</h2>
          <ul>
            <li>
              <strong>One password per site.</strong> When one site leaks its passwords, attackers try
              them everywhere else. A unique password contains the damage.
            </li>
            <li>
              <strong>Use a password manager.</strong> It remembers a different strong password for
              every account, so you only need one good passphrase.
            </li>
            <li>
              <strong>Turn on two-factor authentication</strong> for email, banking and anything that
              can reset your other accounts.
            </li>
          </ul>
          <p>
            Your email account deserves the most care of all. Almost every other account can be
            reset by a message sent to it, so whoever controls your inbox controls the rest. Give it
            a long unique password and two-factor authentication before anything else.
          </p>

          <h2>What a strong password does not protect against</h2>
          <p>
            Phishing. If you type a perfect password into a fake login page, the attacker simply has
            a perfect password. Two things help here. A password manager fills in passwords only on
            the real site&apos;s address, so it will not offer your bank password on a look-alike
            page — take it as a warning when it does not fill. And two-factor authentication means a
            stolen password alone is not enough. Where a site offers passkeys, consider them: they
            are tied to the genuine site and cannot be typed into a fake one.
          </p>

          <h2>Old advice you can drop</h2>
          <ul>
            <li>
              <strong>Changing passwords every few months.</strong> Current guidance from standards
              bodies such as the US National Institute of Standards and Technology is to change a
              password when there is reason to think it was exposed, not on a schedule. Forced
              changes push people towards predictable patterns such as adding a number to the end.
            </li>
            <li>
              <strong>Requiring a symbol and a capital.</strong> The same guidance favours length
              over mandatory character types.
            </li>
            <li>
              <strong>Never writing anything down.</strong> A master passphrase written on paper and
              kept somewhere safe at home is a reasonable backup. The threat to most people is a
              stranger on the internet, not someone searching their desk.
            </li>
            <li>
              <strong>Honest answers to security questions.</strong> A mother&apos;s maiden name or
              a first school can often be looked up. Treat these answers as extra passwords: give a
              random answer and store it in your password manager.
            </li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "sms-character-limit",
    topic: "Codes, passwords & text",
    title: "How many characters fit in a text message?",
    seoTitle: "How Many Characters Fit in a Text Message?",
    description:
      "The real SMS limits — 160 characters, or 70 with emoji — why long messages split into 153-character parts, and how to check before you send.",
    published: PUBLISHED,
    updated: UPDATED,
    tools: ["character-counter", "word-counter", "text-cleaner"],
    Body: function Body() {
      return (
        <>
          <p>
            A single SMS holds 160 characters — except when it holds 70. The difference comes down to
            which characters you use, and it matters most when you are paying per message, as with
            bulk texts and reminder services.
          </p>

          <h2>160 or 70: the alphabet decides</h2>
          <p>
            Text messages use a compact alphabet called GSM 7-bit. It covers the English alphabet,
            numbers, common punctuation and a set of accented letters. If every character in your
            message is in that alphabet, one SMS holds <strong>160 characters</strong>.
          </p>
          <p>
            One character outside it switches the whole message to a different encoding (UCS-2),
            and the limit drops to <strong>70 characters</strong>. Common culprits:
          </p>
          <ul>
            <li>emoji;</li>
            <li>curly &ldquo;smart&rdquo; quotes and apostrophes, which phones and word processors insert automatically;</li>
            <li>em dashes (—) and ellipsis characters (…);</li>
            <li>some accented letters and most non-Latin scripts.</li>
          </ul>
          <p>
            A single emoji in an otherwise plain message can therefore turn one SMS into two or
            three.
          </p>

          <h2>Where the numbers come from</h2>
          <p>
            An SMS carries 140 bytes of text, which is 1,120 bits. The GSM alphabet uses 7 bits for
            each character, and 1,120 ÷ 7 = 160. UCS-2 uses 16 bits for each character, and 1,120 ÷
            16 = 70. The limit was never really a number of characters; it is a fixed amount of
            space, and how many characters fit depends on how much space each one takes.
          </p>

          <h2>Why long messages split into 153 characters</h2>
          <p>
            A message longer than one SMS is sent as several parts that the phone joins back
            together. Each part spends a few characters on the information that says how to join
            them, so a part holds <strong>153 characters</strong> in GSM 7-bit, or{" "}
            <strong>67</strong> in UCS-2. A 300-character plain-text message is two parts; the same
            message with one emoji becomes five.
          </p>
          <table>
            <thead>
              <tr>
                <th>Parts</th>
                <th>Plain text</th>
                <th>With emoji</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>up to 160</td>
                <td>up to 70</td>
              </tr>
              <tr>
                <td>2</td>
                <td>161–306</td>
                <td>71–134</td>
              </tr>
              <tr>
                <td>3</td>
                <td>307–459</td>
                <td>135–201</td>
              </tr>
              <tr>
                <td>4</td>
                <td>460–612</td>
                <td>202–268</td>
              </tr>
            </tbody>
          </table>
          <p>
            &ldquo;Plain text&rdquo; means every character is in the GSM 7-bit alphabet; &ldquo;with
            emoji&rdquo; covers any message that has switched to UCS-2. The jump that catches people
            is the first one. Going from 160 to 161 characters does not
            add one character to your bill; it doubles it.
          </p>

          <h2>Characters that quietly cost extra</h2>
          <p>
            Even inside the GSM alphabet, a handful of characters take two spaces instead of one,
            because they are stored as an escape code followed by the character. They are the square
            brackets, the curly braces, the backslash, the caret (^), the tilde (~), the vertical
            bar (|) and the euro sign (€). A message with several of them fills up faster than its
            length suggests.
          </p>
          <p>
            Accented letters are less predictable than you would expect. The GSM alphabet includes é,
            è, ù, ì, ò, à, ä, ö, ü, ñ and the German ß — but not á, í, ó, ú, â, ê or lower-case ç. So
            a French or Spanish message can be plain text or UCS-2 depending on a single word. The
            only safe approach is to check the actual text rather than guess.
          </p>

          <h2>Check before you send</h2>
          <ol>
            <li>
              Paste your message into the{" "}
              <Link href="/text/character-counter">Character Counter</Link>.
            </li>
            <li>
              Look at the SMS line: it says whether the text fits the GSM 7-bit alphabet and how many
              messages it will take.
            </li>
            <li>
              If it has switched to the 70-character limit, look for curly quotes, dashes and emoji.
              Replacing them with plain quotes and hyphens usually brings it back to 160.
            </li>
          </ol>
          <p>
            Text copied from a document often carries invisible extras and smart punctuation.{" "}
            <Link href="/text/text-cleaner">Text Cleaner</Link> can straighten quotes and strip stray
            spacing before you count.
          </p>

          <h2>If you send bulk or automated texts</h2>
          <p>
            Providers bill for each part, so the difference between one part and two is the
            difference between one price and double, multiplied by every recipient. A few habits
            keep messages in a single part:
          </p>
          <ul>
            <li>
              <strong>Count the longest version, not the template.</strong> A placeholder such as a
              first name is replaced by names of different lengths. Test with the longest name and
              the longest appointment time you are likely to send.
            </li>
            <li>
              <strong>Watch the names themselves.</strong> A customer called Zoë or Seán has a
              letter outside the GSM alphabet, so that one message is sent as UCS-2.
            </li>
            <li>
              <strong>Include everything that is added.</strong> Opt-out wording such as &ldquo;Reply
              STOP to unsubscribe&rdquo;, your business name and any link all count towards the
              limit.
            </li>
            <li>
              <strong>Leave a margin.</strong> Aim for about 150 characters rather than exactly 160,
              so a slightly longer name does not tip the message into two parts.
            </li>
            <li>
              <strong>Write the template in a plain-text editor.</strong> Word processors and phone
              keyboards turn straight quotes into curly ones as you type.
            </li>
          </ul>

          <h2>Why your own phone does not seem to have a limit</h2>
          <p>
            Most messages between phones are no longer SMS. iMessage, WhatsApp, Signal and RCS chat
            send text over the internet and have no 160-character limit, which is why long messages
            and emoji normally just work. The SMS rules apply when a message actually travels as SMS:
            texts to and from businesses, verification codes, reminders, and conversations where one
            side has no data connection. Phones also hide the splitting, showing a long SMS as one
            message even though it was sent and charged as several. Some phones and networks convert
            a very long text into a multimedia message instead, which may be billed differently.
          </p>

          <h2>Other limits worth knowing</h2>
          <p>
            The same counter checks your text against other common limits: 280 characters for a post
            on X, about 160 for a search result description, 2,200 for an Instagram caption and 3,000
            for a LinkedIn post. For essays and articles measured in words, use the{" "}
            <Link href="/text/word-counter">Word Counter</Link>.
          </p>
          <p>
            These platforms do not all count the same way. Some count an emoji as one character and
            some as two or more, which is why the counter shows more than one figure. If a post is
            rejected as too long when your count says it fits, emoji and other special characters
            are the first thing to look at.
          </p>
        </>
      );
    },
  },
];
