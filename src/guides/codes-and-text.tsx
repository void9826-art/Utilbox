import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-09-27";

export const codesAndTextGuides: Guide[] = [
  {
    slug: "do-qr-codes-expire",
    topic: "Codes, passwords & text",
    title: "Do QR codes expire? How to make one that never does",
    seoTitle: "Do QR Codes Expire? Make One That Never Does",
    description:
      "Why some QR codes stop working and others last forever, how to make a free QR code with no expiry, and how to print one that always scans.",
    published: PUBLISHED,
    updated: PUBLISHED,
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

          <h2>What you give up</h2>
          <p>
            A static code cannot be edited after printing, and it cannot count scans. If you need to
            know how many people scanned a poster, point the code at a link tagged with the{" "}
            <Link href="/generators/utm-builder">UTM Link Builder</Link> and your website analytics
            will count the visits — without any third-party redirect.
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

          <h2>Wi-Fi codes for guests</h2>
          <p>
            A Wi-Fi QR code lets guests join your network by pointing their camera at it. The{" "}
            <Link href="/generators/qr-code-wifi-vcard">Wi-Fi and vCard QR Code Generator</Link> makes
            one — enter the network name, password and security type exactly as your router shows
            them — and lays it out as a printable card.
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
    updated: PUBLISHED,
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

          <h2>You need a registered number to sell in shops</h2>
          <p>
            Any barcode will scan, but a retailer&apos;s system identifies products by the number,
            and numbers for retail are allocated by GS1, the organisation that runs the system. A
            number you invent will scan as a number that means nothing — or, worse, as someone
            else&apos;s product. If you are selling through shops or large marketplaces, get your
            numbers from GS1 in your country first, then generate the barcodes.
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

          <h2>Converting UPC to EAN</h2>
          <p>
            Put a 0 in front. A 12-digit UPC-A with a leading zero is a valid 13-digit EAN-13, and the
            check digit stays the same, because the extra zero adds nothing to the calculation.
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
    updated: PUBLISHED,
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

          <h2>Length beats complexity</h2>
          <p>
            Strength is measured in bits of entropy — the number of guesses an attacker needs, where
            every extra bit doubles the work. A random 16-character password drawn from letters,
            numbers and symbols has about 105 bits, far beyond brute force. Adding length adds far
            more than swapping a letter for a symbol. Aim for at least 16 characters for anything
            important.
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

          <h2>Check a password you already use</h2>
          <p>
            The <Link href="/developer/password-strength-checker">Password Strength Checker</Link>{" "}
            estimates how quickly a password could be guessed and names the patterns that weaken it —
            dictionary words, dates, keyboard runs. It runs on your device, so the password is never
            sent anywhere.
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
    updated: PUBLISHED,
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

          <h2>Why long messages split into 153 characters</h2>
          <p>
            A message longer than one SMS is sent as several parts that the phone joins back
            together. Each part spends a few characters on the information that says how to join
            them, so a part holds <strong>153 characters</strong> in GSM 7-bit, or{" "}
            <strong>67</strong> in UCS-2. A 300-character plain-text message is two parts; the same
            message with one emoji becomes five.
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

          <h2>Other limits worth knowing</h2>
          <p>
            The same counter checks your text against other common limits: 280 characters for a post
            on X, about 160 for a search result description, 2,200 for an Instagram caption and 3,000
            for a LinkedIn post. For essays and articles measured in words, use the{" "}
            <Link href="/text/word-counter">Word Counter</Link>.
          </p>
        </>
      );
    },
  },
];
