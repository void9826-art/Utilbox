import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-01";

export const webAndTextGuides: Guide[] = [
  {
    slug: "how-to-make-a-wifi-qr-code",
    topic: "Codes, passwords & text",
    title: "How to make a Wi-Fi QR code so guests can connect in one scan",
    seoTitle: "How to Make a Wi-Fi QR Code for Guests",
    description:
      "Create a QR code that connects phones to your Wi-Fi without typing the password, print it so it scans reliably, and fix the usual reasons it fails.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["qr-code-wifi-vcard", "qr-code-generator", "password-generator"],
    Body: function Body() {
      return (
        <>
          <p>
            Reading out a long Wi-Fi password, letter by letter, to every guest gets old quickly.
            A Wi-Fi QR code does the job instead: a guest points their phone&apos;s camera at it,
            taps the prompt, and is connected.
          </p>

          <h2>What the code contains</h2>
          <p>
            A Wi-Fi QR code holds a short text record in a format phones recognise: the network name,
            the security type and the password. The camera apps on current iPhones and Android phones
            read that record and offer to join the network. Nothing is looked up online — everything
            the phone needs is in the pattern itself, which is also why the code never expires.
          </p>

          <h2>Make one step by step</h2>
          <ol>
            <li>
              Open the <Link href="/generators/qr-code-wifi-vcard">Wi-Fi and vCard QR Code Generator</Link>{" "}
              and choose Wi-Fi.
            </li>
            <li>
              Enter the network name (SSID) exactly as your router shows it, including capital
              letters and spaces.
            </li>
            <li>Enter the password, again exactly.</li>
            <li>
              Choose the security type. WPA covers WPA2 and most WPA3 networks, which is what nearly
              every home and office router uses. Choose no password only for an open network.
            </li>
            <li>Add a caption such as &ldquo;Scan to join our Wi-Fi&rdquo;, then download the code or print the ready-made card.</li>
          </ol>
          <p>
            Your network details stay in your browser while the code is made; they are not sent
            anywhere. Passwords containing awkward characters such as semicolons, commas or quotes
            are handled correctly, because they are escaped the way the Wi-Fi format requires.
          </p>

          <h2>Where to find the network name and password</h2>
          <p>
            Most routers have a sticker on the back or underneath with the default network name and
            password. If you changed them, they are in the router&apos;s settings page or app. Many
            routers broadcast separate names for their 2.4 GHz and 5 GHz bands; pick the one you want
            guests on, or the combined name if your router offers one.
          </p>

          <h2>Test it before printing</h2>
          <p>
            Scan the code on screen with your own phone first. Then, on a second phone that has never
            joined the network, scan the printed copy. If both work, the details are right and the
            print is readable.
          </p>

          <h2>Printing it so it keeps working</h2>
          <ul>
            <li>
              <strong>Dark on light.</strong> Keep the pattern dark on a light background. Light codes
              on dark backgrounds fail on many phones.
            </li>
            <li>
              <strong>Big enough.</strong> A code around 3–5 cm across scans easily from arm&apos;s
              length. Make it larger if people will scan it from further away, such as from a table
              across the room.
            </li>
            <li>
              <strong>Keep the margin.</strong> Leave the white border around the code empty.
            </li>
            <li>
              <strong>Protect it.</strong> A higher error-correction level helps a code survive
              smudges and wear. Laminating the card or putting it behind glass helps even more.
            </li>
          </ul>

          <h2>Security: think before you display it</h2>
          <p>
            A Wi-Fi QR code contains your password in readable form. Anyone who scans it — or
            photographs it — can see the password. So:
          </p>
          <ul>
            <li>
              Put guests on a <strong>separate guest network</strong> if your router supports one. It
              keeps visitors away from your own computers, printers and smart devices.
            </li>
            <li>
              Give the guest network a <strong>strong password</strong>. Since nobody has to type it,
              length costs nothing — the{" "}
              <Link href="/generators/password-generator">Password Generator</Link> can make a long
              one.
            </li>
            <li>
              Display the code only where you would be happy to write the password on the wall.
            </li>
            <li>
              When you change the password, <strong>make a new code</strong>. The old one stops
              working, because the password is stored inside it.
            </li>
          </ul>

          <h2>When the code will not connect</h2>
          <ul>
            <li>
              <strong>Wrong name or password.</strong> Both must match exactly, including capitals.
              This is the cause most of the time.
            </li>
            <li>
              <strong>Wrong security type.</strong> Try WPA if you chose something else.
            </li>
            <li>
              <strong>Old phone.</strong> Very old phones may need a separate QR scanning app, or the
              password typed in by hand.
            </li>
            <li>
              <strong>Router restrictions.</strong> If the router only allows approved devices, a
              correct code still cannot get a new phone on.
            </li>
          </ul>

          <h2>Built-in alternatives</h2>
          <p>
            Phones can already share Wi-Fi with each other. On an iPhone, a nearby Apple device that
            is trying to join your network can be offered the password automatically. Recent Android
            phones can show a QR code for the network they are connected to, from the Wi-Fi settings.
            These are handy for one-off sharing; a printed code is better for a home, office, shop or
            holiday let where many people need to connect. For a QR code that opens a link, a menu or
            other text instead, use the <Link href="/generators/qr-code-generator">QR Code Generator</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-make-your-resume-ats-friendly",
    topic: "Codes, passwords & text",
    title: "How to make your resume ATS-friendly without keyword stuffing",
    seoTitle: "How to Make Your Resume ATS-Friendly",
    description:
      "What applicant tracking systems actually do with your resume, the formatting that trips them up, and how to match a job advert honestly.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["resume-ats-checker", "resume-generator", "pdf-to-text"],
    Body: function Body() {
      return (
        <>
          <p>
            Most medium and large employers collect applications through an applicant tracking
            system, or ATS. There is a lot of folklore about these systems — that they
            &ldquo;reject&rdquo; most resumes automatically, or that a secret score decides
            everything. The reality is more ordinary, and easier to prepare for.
          </p>

          <h2>What an ATS actually does</h2>
          <p>
            An applicant tracking system stores applications and helps recruiters manage them. To do
            that, it converts your resume into plain text and pulls out details such as your name,
            contact information, job titles, dates and skills. Recruiters then search and filter that
            text, often using words from the job advert. Whether anything is filtered out
            automatically depends on how the employer has set the system up; very often, a person
            reads the resumes that match their search.
          </p>
          <p>Two things follow from that:</p>
          <ul>
            <li>your resume has to convert to clean text, or parts of it effectively disappear;</li>
            <li>it has to contain the words a recruiter is likely to search for.</li>
          </ul>

          <h2>Make sure it reads as text</h2>
          <p>
            Save your resume as a text-based PDF or a Word document, whichever the application asks
            for. A scanned resume, or a design exported as one big picture, contains no text at all.
            A quick test: run your PDF through <Link href="/pdf/pdf-to-text">PDF to Text</Link>. What
            comes out is roughly what a parser sees. If sections are missing, jumbled or out of
            order, the layout is the problem.
          </p>

          <h2>Formatting that causes trouble</h2>
          <ul>
            <li>
              <strong>Two or more columns.</strong> Text can be read straight across the columns,
              mixing your skills list into your job history. A single column is safest.
            </li>
            <li>
              <strong>Tables and text boxes.</strong> Content inside them is often read out of order
              or skipped.
            </li>
            <li>
              <strong>Icons instead of words.</strong> A phone icon next to your number is fine for a
              person, but icon fonts are not readable text. Write &ldquo;Phone&rdquo; and
              &ldquo;Email&rdquo; or simply give the details.
            </li>
            <li>
              <strong>Important details in the header or footer.</strong> Some systems miss text
              placed there, so keep your name and contact details in the main body.
            </li>
            <li>
              <strong>Unusual section headings.</strong> &ldquo;Where I&apos;ve been&rdquo; is
              charming but harder to recognise than &ldquo;Experience&rdquo;. Use conventional
              headings: Summary, Experience, Education, Skills.
            </li>
          </ul>
          <p>
            The <Link href="/generators/resume-generator">Resume Generator</Link> produces a plain,
            single-column CV with standard headings and real text for exactly these reasons.
          </p>

          <h2>Match the job advert — honestly</h2>
          <p>
            Read the advert and note the skills, tools, qualifications and phrases it repeats. If you
            genuinely have them, make sure your resume uses the same words, in context:
          </p>
          <ul>
            <li>
              Use the employer&apos;s term. If the advert says &ldquo;stakeholder management&rdquo;,
              write that rather than a synonym.
            </li>
            <li>
              Give both the abbreviation and the full form once, such as &ldquo;search engine
              optimisation (SEO)&rdquo;, so either search finds you.
            </li>
            <li>
              Put keywords where they show what you did: &ldquo;Built monthly reports in Power BI for
              the finance team&rdquo; beats a bare list of tools.
            </li>
          </ul>
          <p>
            Do not paste the job description into your resume or add skills you do not have.
            Recruiters recognise keyword stuffing immediately, and a person reads the resume next —
            then interviews you on it.
          </p>

          <h2>Check it against the advert</h2>
          <ol>
            <li>
              Open the <Link href="/text/resume-ats-checker">Resume ATS Checker</Link>.
            </li>
            <li>Add your resume as a PDF, Word file or plain text.</li>
            <li>Paste the whole job advert, including the requirements and responsibilities.</li>
            <li>
              Work through the missing keywords and the failed format checks, update your resume, and
              check again.
            </li>
          </ol>
          <p>
            The checker reads your file in your browser; nothing is uploaded. Its score is a checklist
            for tailoring, not a prediction. There is no universal ATS score — every system works
            differently — so use it to find gaps, not to chase a number.
          </p>

          <h2>The details recruiters search for</h2>
          <ul>
            <li>
              <strong>Job titles</strong> that match the role you want, where they honestly describe
              what you did.
            </li>
            <li>
              <strong>Dates</strong> for every role, in one consistent format such as &ldquo;March
              2023 – June 2025&rdquo;.
            </li>
            <li>
              <strong>Qualifications and certifications</strong> written out in full.
            </li>
            <li>
              <strong>Location</strong>, at least the city, if the role is location-based.
            </li>
          </ul>

          <h2>Write for the person who reads it next</h2>
          <p>
            Getting through the system only earns your resume a human reader. What persuades that
            person is evidence: results with numbers where you can give them — time saved, revenue
            grown, customers served, errors reduced — in short bullet points under each role. One or
            two pages is usual for most roles, with your most relevant experience first.
          </p>
          <p>
            Keep one complete master resume, and make a tailored copy for each application. It takes
            ten minutes and is the single most effective thing you can do.
          </p>
        </>
      );
    },
  },

  {
    slug: "utm-parameters-explained",
    topic: "Web & developer",
    title: "UTM parameters explained: how to see which links bring you visitors",
    seoTitle: "UTM Parameters Explained: Track Your Links",
    description:
      "What utm_source, utm_medium and utm_campaign do, how to name them consistently, where the results appear, and the mistakes that corrupt your data.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["utm-builder", "qr-code-generator", "url-encoder"],
    Body: function Body() {
      return (
        <>
          <p>
            You post a link in a newsletter, on social media and on a printed flyer. A week later your
            analytics shows a jump in visitors — but from where? Without tags, much of that traffic
            shows up as &ldquo;direct&rdquo; or under a vague referrer. UTM parameters fix that by
            labelling each link.
          </p>

          <h2>What a UTM link looks like</h2>
          <p>A tagged link is your normal address with a few labels added after a question mark:</p>
          <p>
            <code className="break-all">
              example.com/sale?utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=spring-sale
            </code>
          </p>
          <p>
            The labels do not change the page. When a visitor arrives, analytics tools such as Google
            Analytics read them and record where the visit came from.
          </p>

          <h2>The parameters</h2>
          <ul>
            <li>
              <strong>utm_source</strong> — where the visitor came from: newsletter, facebook,
              linkedin, flyer.
            </li>
            <li>
              <strong>utm_medium</strong> — the kind of channel: email, social, cpc for paid ads,
              print.
            </li>
            <li>
              <strong>utm_campaign</strong> — the campaign or promotion: spring-sale, product-launch.
            </li>
            <li>
              <strong>utm_content</strong> (optional) — which link, when one campaign has several:
              header-button versus footer-link, poster versus flyer.
            </li>
            <li>
              <strong>utm_term</strong> (optional) — traditionally the paid search keyword.
            </li>
            <li>
              <strong>utm_id</strong> (optional) — a campaign ID, used to join up with cost data.
            </li>
          </ul>
          <p>
            Source, medium and campaign are the three that reports rely on. Leave one out and those
            visits show &ldquo;(not set)&rdquo; in its place.
          </p>

          <h2>Build a link step by step</h2>
          <ol>
            <li>
              Open the <Link href="/generators/utm-builder">UTM Link Builder</Link> and paste the
              address of the page you are linking to.
            </li>
            <li>Fill in source, medium and campaign — pick a suggestion or type your own.</li>
            <li>Add utm_content if you want to tell apart several links in the same campaign.</li>
            <li>Copy the tagged link, save it to your history, or download a QR code for print.</li>
          </ol>
          <p>
            The builder keeps any query parameters and #section anchor already in the address, and
            places the tags where browsers expect them.
          </p>

          <h2>Naming: the part that decides whether your data is usable</h2>
          <p>
            Analytics tools treat the values as exact text. &ldquo;Newsletter&rdquo;,
            &ldquo;newsletter&rdquo; and &ldquo;news-letter&rdquo; become three separate sources,
            splitting your numbers three ways. A few rules prevent that:
          </p>
          <ul>
            <li>
              <strong>Lower case only.</strong> The builder lower-cases values by default.
            </li>
            <li>
              <strong>Hyphens instead of spaces.</strong> Spaces turn into %20 or + in the address and
              are easy to mistype.
            </li>
            <li>
              <strong>A fixed list of sources and mediums</strong>, written down and shared with
              anyone else who makes links.
            </li>
            <li>
              <strong>Standard medium names.</strong> Analytics tools group visits into channels such
              as Email, Organic Social and Paid Search partly by the medium. Using common values like
              email, social and cpc helps your visits land in the right channel.
            </li>
          </ul>
          <p>
            The builder&apos;s history can be exported as a CSV file, which makes a simple record of
            every link you have created and the names you used.
          </p>

          <h2>Where the results appear</h2>
          <p>
            In Google Analytics 4, open Reports, then Acquisition, then Traffic acquisition. Change
            the main column to session source / medium or session campaign to see each tagged link
            separately. Other analytics tools have similar campaign reports.
          </p>

          <h2>Mistakes that corrupt your data</h2>
          <ul>
            <li>
              <strong>Tagging links inside your own site.</strong> When a visitor clicks a UTM link on
              your own pages, the visit is re-labelled with that internal campaign, overwriting where
              they really came from. Use UTM tags only on links that point to your site from
              elsewhere.
            </li>
            <li>
              <strong>Putting personal information in tags.</strong> Never put email addresses, names
              or customer IDs in UTM values. They end up stored in analytics, and Google Analytics
              forbids sending personally identifiable information.
            </li>
            <li>
              <strong>Inconsistent names</strong> across a team — the most common problem of all.
            </li>
          </ul>

          <h2>UTM links in print and QR codes</h2>
          <p>
            Nobody types a long tagged address from a poster, so put it in a QR code. Give each printed
            item its own utm_content value — poster, flyer, table-card — to see which one worked. The
            builder downloads a QR code for any link, and for other QR uses there is the{" "}
            <Link href="/generators/qr-code-generator">QR Code Generator</Link>. Because the code holds
            your own tagged address directly, there is no third-party redirect in between.
          </p>

          <h2>Special characters</h2>
          <p>
            If a value must contain characters that have a meaning in addresses, such as &amp; or =,
            they have to be percent-encoded. The builder handles this for you; to check an address by
            hand, the <Link href="/developer/url-encoder">URL Encoder</Link> encodes a single value
            safely.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-verify-a-file-checksum",
    topic: "Web & developer",
    title: "How to verify a file checksum (SHA-256) — and what it proves",
    seoTitle: "How to Verify a File Checksum (SHA-256)",
    description:
      "Check that a download is exactly what its publisher released: find the checksum, compare it in your browser or from the command line, and understand its limits.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["checksum-verifier", "ssl-expiry-checker"],
    Body: function Body() {
      return (
        <>
          <p>
            Download pages for operating systems, software installers and firmware often list a long
            string of letters and numbers labelled SHA-256 or MD5. That is a checksum, and comparing
            it with your downloaded file takes under a minute.
          </p>

          <h2>What a checksum is</h2>
          <p>
            A cryptographic hash function turns any file — a few kilobytes or many gigabytes — into a
            short, fixed-length fingerprint. Change a single bit anywhere in the file and the
            fingerprint changes completely. So if the fingerprint of your copy matches the one the
            publisher printed, your copy is byte-for-byte identical to theirs.
          </p>
          <p>
            To see how sensitive it is, here are the SHA-256 fingerprints of two words that differ by a
            single capital letter:
          </p>
          <ul>
            <li>
              hello →{" "}
              <code className="break-all">2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824</code>
            </li>
            <li>
              Hello →{" "}
              <code className="break-all">185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969</code>
            </li>
          </ul>
          <p>
            Nothing about the second value hints at how close the inputs were. That is what makes a
            matching checksum convincing.
          </p>
          <p>That catches two different problems:</p>
          <ul>
            <li>
              <strong>Corruption</strong> — a download that was cut short or damaged on the way.
            </li>
            <li>
              <strong>Tampering</strong> — a file swapped for a modified one, for example on a
              compromised mirror site.
            </li>
          </ul>

          <h2>Where to find the checksum</h2>
          <p>
            Look on the download page, in the release notes, or in a small text file next to the
            download with a name such as SHA256SUMS. Take it from the publisher&apos;s own website,
            over HTTPS. A checksum copied from the same unofficial mirror as the file proves very
            little: anyone able to swap the file could swap the checksum too.
          </p>

          <h2>Verify a file step by step</h2>
          <ol>
            <li>
              Open the <Link href="/developer/checksum-verifier">File Checksum Verifier</Link> and add
              the downloaded file.
            </li>
            <li>
              Paste the published checksum. The algorithm is recognised from its length, and whole
              lines copied from a checksum file are accepted.
            </li>
            <li>Press Calculate checksums.</li>
            <li>Read the verdict: the values either match exactly or they do not.</li>
          </ol>
          <p>
            The file is read from your disk in chunks and hashed in your browser. It is never
            uploaded, which matters for the kinds of files people check — installers, backups and disk
            images — and memory use stays flat even for very large files.
          </p>

          <h2>Recognising the algorithm</h2>
          <p>
            Each algorithm produces a fingerprint of a fixed length, counted in hexadecimal
            characters, so the length alone tells you which one a published checksum uses:
          </p>
          <table>
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Length</th>
                <th>Catches</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>MD5</td>
                <td>32</td>
                <td>Accidental corruption only</td>
              </tr>
              <tr>
                <td>SHA-1</td>
                <td>40</td>
                <td>Accidental corruption only</td>
              </tr>
              <tr>
                <td>SHA-256</td>
                <td>64</td>
                <td>Corruption and tampering</td>
              </tr>
              <tr>
                <td>SHA-512</td>
                <td>128</td>
                <td>Corruption and tampering</td>
              </tr>
            </tbody>
          </table>
          <p>
            MD5 and SHA-1 are broken against deliberate attacks: it is practical to construct two
            different files with the same MD5 or SHA-1 fingerprint. When a publisher offers SHA-256
            or SHA-512, compare that.
          </p>

          <h2>From the command line</h2>
          <p>Every major operating system can calculate a SHA-256 checksum without extra software:</p>
          <ul>
            <li>
              <strong>Windows (PowerShell):</strong> <code>Get-FileHash .\file.iso</code> — SHA-256 is
              the default. In Command Prompt, <code>certutil -hashfile file.iso SHA256</code>.
            </li>
            <li>
              <strong>macOS:</strong> <code>shasum -a 256 file.iso</code>
            </li>
            <li>
              <strong>Linux:</strong> <code>sha256sum file.iso</code>, or{" "}
              <code>sha256sum -c SHA256SUMS</code> to check every file listed in a checksum file.
            </li>
          </ul>
          <p>
            Comparing two 64-character strings by eye is error-prone. Check the whole value, not just
            the first and last few characters — or paste both into the verifier and let it compare.
          </p>

          <h2>If the checksums do not match</h2>
          <ol>
            <li>Make sure you are comparing the right file and the right version; checksums are listed per file.</li>
            <li>Download the file again, preferably from the publisher&apos;s main site.</li>
            <li>If a fresh download from the official source still does not match, do not run or install it. Report it to the publisher.</li>
          </ol>
          <p>
            In practice, nearly every mismatch is an incomplete download or a checksum for a different
            version. But the point of checking is that you do not have to guess.
          </p>

          <h2>What a checksum does not prove</h2>
          <p>
            A matching checksum proves your file is identical to the one the checksum describes. It
            does not prove who made it. If an attacker controls the website, they can publish a
            modified file and a matching checksum together. Stronger guarantees come from digital
            signatures:
          </p>
          <ul>
            <li>
              <strong>Signed checksum files</strong>, often published with a .sig or .asc file, can be
              verified with the publisher&apos;s public key.
            </li>
            <li>
              <strong>Code signing</strong> on Windows and macOS shows the verified publisher of an
              installer; on Windows, look at the Digital Signatures tab in the file&apos;s properties.
            </li>
          </ul>
          <p>
            Downloading over HTTPS from the official site is the first line of defence; if a site&apos;s
            certificate looks wrong, the <Link href="/developer/ssl-expiry-checker">SSL Certificate Checker</Link>{" "}
            shows who issued it and whether browsers trust it.
          </p>
        </>
      );
    },
  },
];
