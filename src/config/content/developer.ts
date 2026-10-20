import type { ToolContent } from "@/types/tool";

const PRIVACY_NOTE =
  "Everything runs in this page. Nothing you paste is transmitted, logged or stored, which is what makes it safe to drop a production payload in here while you are debugging.";

export const developerContent: Record<string, ToolContent> = {
  "ssl-expiry-checker": {
    seoTitle: "SSL Certificate Expiry Checker — Check Any Domain",
    seoDescription:
      "Check an SSL certificate's expiry date for any domain, plus whether its chain is trusted, the name matches, and which TLS version the server uses.",
    intro:
      "Enter a domain to see when its SSL certificate expires, who issued it, whether the name matches and whether the chain is trusted. The check runs on this site's server, because browsers cannot read certificate details, and nothing is stored. Renew with at least two weeks to spare; under 30 days left often means auto-renewal has failed.",
    howToUse: [
      "Type the domain, such as example.com, or paste a full address.",
      "Leave the port at 443 for a website, or choose the port of a mail or other TLS service.",
      "Press Check certificate.",
      "Read the expiry date and any chain or name problems, and add a renewal reminder to your calendar if you like.",
    ],
    howItWorks: [
      "Browsers do not let web pages see certificate details, so this check runs on this site's server. It opens a TLS connection to the domain as a browser would — sending the domain name so the server presents the right certificate — reads the certificate and the chain the server sends, and closes the connection. Nothing about the check is stored.",
      "Three things must all be right for a certificate to work. It must be within its validity dates; it must name the domain being visited, either exactly or through a wildcard such as *.example.com; and it must chain up to a root certificate authority that devices trust. The tool checks all three, verifying the chain against the root certificates bundled with Node.js, which follow Mozilla's trusted list.",
      "The most common problem after expiry is a missing intermediate certificate. Desktop browsers can often fetch the missing piece themselves, so the site looks fine in Chrome while phone apps, API clients, payment providers and older devices refuse to connect. A chain error is worth fixing even when your browser shows a padlock.",
      "Public certificate lifetimes are being shortened in stages under CA/Browser Forum rules — to a maximum of 200 days from March 2026, falling to 47 days by 2029 — so automated renewal and regular expiry checks matter more each year. Before connecting, every address the domain points to is checked to be on the public internet, so the tool cannot be used to probe private networks.",
    ],
    faq: [
      {
        question: "When should I renew my certificate?",
        answer:
          "With at least two weeks to spare. Automated clients such as Certbot for Let's Encrypt try to renew when about 30 days remain, so a certificate with fewer than 30 days left often means automatic renewal has stopped working.",
      },
      {
        question: "Why does my browser show a padlock when this tool reports a chain problem?",
        answer:
          "Browsers can fill in a missing intermediate certificate from their cache or by downloading it. Many other clients cannot, so they fail where the browser succeeds. Configure your server to send the full chain.",
      },
      {
        question: "Can it check mail servers?",
        answer:
          "Yes, on ports that use TLS from the first byte: 465 for SMTP, 993 for IMAP and 995 for POP3. Ports that upgrade a plain connection with STARTTLS, such as 25 and 587, are not supported.",
      },
      {
        question: "Is the domain I check stored?",
        answer:
          "No. The domain is sent to this site's server only to make the connection, and the result goes straight back to your browser without being saved.",
      },
    ],
  },

  "email-syntax-checker": {
    seoTitle: "Check If Email Address Is Valid — Format and MX",
    seoDescription:
      "Check if an email address is in a valid format, with a plain-English reason when it isn't, typo suggestions like gmial.com, and optional MX record lookups.",
    intro:
      "Paste one email address per line to check each one's format, with any problem explained in plain English and likely typos such as gmial.com corrected. The format check runs in your browser; the optional mail-server check sends only the domain names to this site's server for a DNS lookup. No check can prove a mailbox exists.",
    howToUse: [
      "Paste one email address per line.",
      "Read the verdict next to each address — problems are explained in plain English.",
      "Press Use this to accept a suggested correction, such as gmail.com for gmial.com.",
      "Optionally press Check mail servers to confirm each domain can receive email.",
    ],
    howItWorks: [
      "The format check follows the rules mail servers apply (RFC 5321 and RFC 5322): exactly one @; up to 64 characters before it, made of letters, digits, dots and a small set of symbols such as + and _; no leading, trailing or doubled dots; and a domain made of labels of letters, digits and hyphens with a real ending. The whole address can be at most 254 characters.",
      "Some addresses are technically legal but rejected by most websites — quoted names such as \"john smith\"@example.com, IP addresses in brackets, and international characters. Those pass with a note, so you decide rather than the tool guessing.",
      "The mail server check looks up the domain's MX records, which say where its email is delivered. A domain with no MX record can still receive mail at its own address; a domain with a “null MX” record has declared it accepts no email; and a domain that does not exist cannot receive anything. Only the domain name is sent for this lookup, never the full address.",
      "No check can prove a mailbox exists without sending it an email. Many mail servers accept every address at a domain and bounce undeliverable mail later, and probing them address by address is unreliable and treated as abuse — so this tool deliberately stops at format and domain.",
    ],
    faq: [
      {
        question: "Does a valid result mean the email address exists?",
        answer:
          "No. It means the address is correctly formed and, if you ran the MX check, that its domain can receive email. Whether that particular mailbox exists can only be confirmed by sending a message to it.",
      },
      {
        question: "Is a plus sign allowed in an email address?",
        answer:
          "Yes. Addresses like jane+newsletter@example.com are valid, and many providers deliver them to jane@example.com. Some websites wrongly reject them.",
      },
      {
        question: "Do capital letters make an address invalid?",
        answer:
          "No. Domains are not case-sensitive, and in practice almost every mail provider treats the part before the @ as case-insensitive too.",
      },
      {
        question: "Is my list uploaded?",
        answer:
          "The format check runs entirely in your browser. If you run the mail server check, only the domain names — the part after each @ — are sent to this site's server for a DNS lookup.",
      },
    ],
  },

  "password-strength-checker": {
    seoTitle: "Password Strength Checker — Private, Nothing Sent",
    seoDescription:
      "Test how strong a password really is. See the estimated time to crack it, the patterns that weaken it and how to fix them — checked in your browser, never sent.",
    intro:
      "Type a password to see its strength score from 0 to 4, the estimated time to crack it and the patterns that weaken it, such as dictionary words, dates and keyboard runs. It uses the zxcvbn estimator in your browser, and the password is never sent anywhere — so it is not checked against breach lists.",
    howToUse: [
      "Type or paste a password into the box.",
      "Read the strength score and the estimated time to crack it.",
      "Look at the patterns found — dictionary words, dates, keyboard runs — and the suggestions.",
      "Clear the box when you have finished.",
    ],
    howItWorks: [
      "Counting character types is a poor measure of strength: “P@ssw0rd1!” ticks every box but falls almost instantly, because attackers try common words with predictable substitutions first. This tool uses zxcvbn, an estimator originally developed at Dropbox, which looks for the patterns people actually use — dictionary words and names, look-alike substitutions, keyboard runs such as qwerty, repeats, sequences and dates — and estimates how many guesses an attacker would need.",
      "That guess count becomes a crack time under four scenarios: an online attack limited to 100 guesses an hour, an online attack at 10 guesses a second, an offline attack on a slow password hash at 10,000 guesses a second, and an offline attack on a fast hash at 10 billion guesses a second. The score from 0 to 4 summarises the result; aim for 4 and treat anything below 3 as weak.",
      "The estimator and its word lists are downloaded to your browser the first time you use the tool and run there. The password is not sent to this site or anyone else — which is also why the tool does not check it against lists of breached passwords, since that would mean contacting an outside service.",
      "The estimate describes how guessable a password is, not whether it is safe. A strong password that has leaked in a breach, or that is reused on several sites, is still unsafe.",
    ],
    faq: [
      {
        question: "Is it safe to type my real password here?",
        answer:
          "The check runs entirely in your browser and nothing is transmitted — you can confirm this in your browser's developer tools. Even so, the safest habit is to test a password with the same structure rather than the real one.",
      },
      {
        question: "What makes a password strong?",
        answer:
          "Length and unpredictability. A passphrase of four or more random, unrelated words, or a long random string from a password manager, beats a short password stuffed with symbols.",
      },
      {
        question: "Why is my long password rated weak?",
        answer:
          "Length only helps when it is unpredictable. A lyric, a keyboard pattern or a word repeated several times is long, but guessing tools try exactly those things first.",
      },
      {
        question: "Does it check whether my password has been leaked?",
        answer:
          "No. That requires sending part of a hash of the password to a breach database, and this tool deliberately contacts nothing. Use your password manager's breach monitoring for that.",
      },
    ],
  },

  "og-preview": {
    seoTitle: "Open Graph Preview Tool — Test Social Share Cards",
    seoDescription:
      "Preview how a link appears on Facebook, LinkedIn, X and chat apps. Check a page's Open Graph and Twitter tags for problems, or write new tags and copy them.",
    intro:
      "Enter a page address to preview how its link looks on Facebook, LinkedIn, X and chat apps, with a list of problems such as a missing og:image or one smaller than 1200 × 630. The page is fetched by this site's server, because browsers cannot read other sites. Or switch to Write tags to create them.",
    howToUse: [
      "Enter a page address and press Preview — or switch to Write tags to create them.",
      "Read the list of problems, such as a missing og:image or an image that is too small.",
      "Compare the Facebook, X and chat-app style previews.",
      "Fix the tags on your page, or copy the generated tags into its head.",
    ],
    howItWorks: [
      "When a link is shared, the platform's crawler downloads the page and reads its Open Graph tags — og:title, og:description, og:image and og:url — along with X's twitter:card tags. Pages without them get a bare link, or a preview built from whatever the crawler can guess.",
      "Browsers cannot read another site's HTML, so the page is fetched by this site's server. Only public http and https addresses are allowed, redirects are followed up to five times with each one re-checked, and no more than the head of the page is read. The tags come back to your browser, where the previews are drawn; the preview image is loaded directly from the page's own server.",
      "The checks flag what most often breaks previews: missing tags, http image addresses, images below the 200 × 200 pixel minimum Facebook accepts, images smaller than the recommended 1200 × 630, missing image descriptions, and overlong titles.",
      "Platforms cache previews, sometimes for days. After fixing your tags, use the platform's own tool — such as Facebook's Sharing Debugger — to make it fetch the page again.",
    ],
    faq: [
      {
        question: "Why is my link preview showing an old image?",
        answer:
          "The platform cached the page when it was first shared. Update the tags, then ask the platform to fetch the page again — Facebook's Sharing Debugger and LinkedIn's Post Inspector both do this.",
      },
      {
        question: "What size should an og:image be?",
        answer:
          "1200 × 630 pixels, a 1.91:1 ratio, works well across Facebook, LinkedIn and X's large card. Keep important content away from the edges, because some layouts crop the image.",
      },
      {
        question: "Do I need Twitter tags if I have Open Graph tags?",
        answer:
          "X reads og:title, og:description and og:image when its own tags are missing, but it uses twitter:card to decide the card type. Add twitter:card with the value summary_large_image for a large picture.",
      },
      {
        question: "Can it preview pages behind a login?",
        answer:
          "No. It sees the page as a logged-out visitor, the same way a platform's crawler does — which is exactly what matters for previews.",
      },
    ],
  },

  "checksum-verifier": {
    seoTitle: "Verify File Checksum Online — MD5, SHA-1, SHA-256",
    seoDescription:
      "Verify a file checksum online. Calculate MD5, SHA-1, SHA-256 and SHA-512 and compare with the published value — any file size, never uploaded.",
    intro:
      "Add the file you downloaded, paste the publisher's checksum and press Calculate checksums for a clear match or mismatch. MD5, SHA-1, SHA-256 and SHA-512 are computed in one pass at any file size, and the file is never uploaded. Rely on SHA-256: MD5 and SHA-1 catch accidental corruption, not deliberate tampering.",
    howToUse: [
      "Add the file you downloaded.",
      "Paste the checksum from the download page — the algorithm is detected from its length.",
      "Press Calculate checksums.",
      "Read the verdict: the checksums either match exactly or they do not.",
    ],
    howItWorks: [
      "A cryptographic hash turns any file into a short fingerprint. Change a single bit anywhere in the file and the fingerprint changes completely, so if the hash of your copy equals the one the publisher printed, your copy is identical to theirs — nothing was corrupted in transit or swapped along the way.",
      "The file is read from your disk in chunks and fed to every selected algorithm at once, so even a multi-gigabyte disk image is read only once and memory use stays flat. The hashing runs as WebAssembly in your browser, and the file is never uploaded — which matters for exactly the files people check, such as installers, backups and disk images.",
      "SHA-256 is the one to rely on. MD5 and SHA-1 still catch accidental corruption, but both are broken against deliberate tampering: it is practical to craft two different files with the same MD5 or SHA-1. When a publisher offers SHA-256 or SHA-512, compare that.",
      "The comparison ignores letter case and surrounding spaces, and accepts the “hash  filename” lines written by sha256sum and the “SHA256 (file) = hash” lines written by BSD and macOS tools.",
    ],
    faq: [
      {
        question: "Where do I find the checksum to compare against?",
        answer:
          "On the download page, in the release notes, or in a file such as SHA256SUMS next to the download. Take it from the publisher's own site over HTTPS — a checksum from the same untrusted mirror as the file proves little.",
      },
      {
        question: "What does a mismatch mean?",
        answer:
          "The files are not identical. The download may be incomplete or corrupted, so download it again — or the checksum may be for a different version or file.",
      },
      {
        question: "Is MD5 still good enough?",
        answer:
          "For spotting accidental corruption, yes. For proving a file has not been tampered with, no — use SHA-256 or SHA-512 where the publisher provides them.",
      },
      {
        question: "Is there a file size limit?",
        answer:
          "No fixed limit. Large files simply take longer — roughly the time your disk takes to read them plus the hashing — while memory use stays the same.",
      },
    ],
  },

  "json-formatter": {
    seoTitle: "JSON Formatter — Pretty Print and Minify JSON Online",
    seoDescription:
      "Format, minify and validate JSON with syntax highlighting and precise error positions. Runs entirely in your browser — nothing is uploaded.",
    intro:
      "Paste JSON or drop in a .json file, then press Format to indent it or Minify to strip whitespace. Invalid JSON is reported with the exact line and column and a caret under the problem — usually a trailing comma, single quotes or a comment. Parsing is strict (RFC 8259) and runs in your browser, so real data stays private.",
    howToUse: [
      "Paste your JSON, or drop in a .json file.",
      "Press Format to indent it, or Minify to strip whitespace.",
      "If the JSON is invalid, the error message points at the exact line and column.",
      "Copy the result or download it.",
    ],
    howItWorks: [
      "The text is parsed with the JavaScript engine's own JSON parser, which follows RFC 8259 strictly. That strictness is deliberate: it means anything this tool accepts will be accepted by every other conforming parser, so you are not lulled into shipping something that works here and fails in production.",
      "Error reporting is where most formatters fall short. The native parser reports a character offset, which is useless in a 4,000-line file. That offset is translated into a line and column, and the offending line is shown with a caret under the problem — so you can see immediately that it was a trailing comma on line 812.",
      "Sorting keys alphabetically is available as an option, which makes two versions of the same document diffable.",
      PRIVACY_NOTE,
    ],
    example: {
      scenario: "Finding an error in a large config file",
      steps: [
        "Paste 400 lines of JSON.",
        "The parser reports: Unexpected token } at line 218, column 3.",
        "The line is shown with a caret under the closing brace.",
      ],
      result: "A trailing comma on line 217 — found in seconds instead of by bisecting the file.",
    },
    faq: [
      {
        question: "Why does my JSON say it is invalid?",
        answer:
          "The usual culprits are trailing commas, single quotes instead of double, unquoted keys, and comments. JSON allows none of these — the error message names the exact position.",
      },
      {
        question: "Can JSON have comments?",
        answer:
          "No. The specification has no comment syntax. Formats like JSON5 and JSONC add them, but standard parsers reject them.",
      },
      {
        question: "What indentation should I use?",
        answer:
          "Two spaces is the most common convention and keeps deeply nested documents readable. Four spaces and tabs are both supported.",
      },
      {
        question: "Is my JSON sent to a server?",
        answer:
          "No. Parsing and formatting happen in your browser, which is why it is safe to paste real data here.",
      },
    ],
  },

  "json-validator": {
    seoTitle: "JSON Validator — Check JSON Syntax With Clear Errors",
    seoDescription:
      "Validate JSON and get a plain-English explanation of what is wrong and where, plus statistics about the document's structure.",
    intro:
      "Paste JSON to check it as you type. If it is invalid, you get a plain-English explanation of the likely cause — a trailing comma, single quotes, an unquoted key or a comment — with the exact position. Valid documents get a structure summary that flags duplicate keys. It checks syntax, not a schema, and runs in your browser.",
    howToUse: [
      "Paste the JSON you want to check.",
      "Validation runs as you type.",
      "If it fails, read the explanation and the highlighted line.",
      "If it passes, review the structure summary underneath.",
    ],
    howItWorks: [
      "Validation uses the strict native parser, so a pass here means a pass anywhere. What this tool adds is interpretation: raw parser errors are terse and vary between engines, so common failure patterns are recognised and translated into a plain sentence naming the likely cause.",
      "A trailing comma, a single-quoted string, an unquoted key, a stray comment, an unescaped newline inside a string and an unbalanced bracket each produce their own message rather than a generic 'unexpected token'.",
      "When the document is valid, a summary reports its depth, the number of keys and arrays, the largest array, and any duplicate keys. Duplicates are worth flagging because JSON permits them but parsers silently keep only the last, which is a genuinely difficult bug to spot by eye.",
      PRIVACY_NOTE,
    ],
    faq: [
      {
        question: "What makes JSON invalid?",
        answer:
          "Trailing commas, single quotes, unquoted keys, comments, undefined or NaN values, and unescaped control characters inside strings are the usual causes.",
      },
      {
        question: "Are duplicate keys allowed?",
        answer:
          "The specification permits them but leaves the behaviour undefined; in practice parsers keep the last one and discard the rest silently. The validator flags them because they are almost always a mistake.",
      },
      {
        question: "Does it check against a schema?",
        answer:
          "No. This checks syntax only. Validating structure and types requires a JSON Schema validator, which is a different job.",
      },
    ],
  },

  "json-to-csv": {
    seoTitle: "JSON to CSV Converter — Flatten Nested JSON Free",
    seoDescription:
      "Convert JSON arrays and objects into CSV, flattening nested structures into dotted column names. Configurable delimiter and quoting.",
    intro:
      "Paste a JSON array of objects, choose the delimiter and how arrays are handled, check the preview and download the CSV. Every record is scanned for columns, so missing fields become empty cells, and nested objects become dotted columns such as user.name. Values that look like spreadsheet formulas are kept literal. Nothing is uploaded.",
    howToUse: [
      "Paste a JSON array of objects, or an object containing one.",
      "Choose the delimiter and how nested values should be handled.",
      "Check the preview table.",
      "Download the CSV or copy it.",
    ],
    howItWorks: [
      "The converter walks every record to build the complete column set, rather than assuming the first record has all the fields. Records with missing fields get empty cells, so nothing is silently dropped when the data is uneven — which real API responses usually are.",
      "Nested objects are flattened into dotted paths, so { user: { name: 'Ada' } } becomes a column called user.name. Arrays can either be flattened into indexed columns (tags.0, tags.1) or joined into a single cell, depending on which is more useful for your data.",
      "CSV escaping follows RFC 4180: a value containing the delimiter, a quote or a line break is wrapped in double quotes, and quotes inside are doubled. That is what stops an address with a comma from splitting into two columns.",
      "There is one thing to watch when the CSV reaches Excel: a leading value like +44 or =SUM is interpreted as a formula. The tool prefixes such values with an apostrophe by default so they stay literal.",
      PRIVACY_NOTE,
    ],
    faq: [
      {
        question: "How are nested objects handled?",
        answer:
          "They are flattened into dotted column names, so a nested name field becomes user.name. Arrays can be indexed or joined into a single cell.",
      },
      {
        question: "What happens if records have different fields?",
        answer:
          "Every record is scanned to build the full column set, and missing values become empty cells. Nothing is dropped.",
      },
      {
        question: "Which delimiter should I use?",
        answer:
          "A comma for most purposes. Semicolons are the convention in locales where the comma is the decimal separator, and tabs are useful when values contain commas.",
      },
      {
        question: "Why is there an apostrophe before some values?",
        answer:
          "Values starting with =, +, - or @ are treated as formulas by spreadsheet software. The apostrophe keeps them as literal text; you can turn it off if you know your data is safe.",
      },
    ],
  },

  "base64-encoder": {
    seoTitle: "Base64 Encoder — Encode Text and Files Online Free",
    seoDescription:
      "Encode text or files to Base64, with URL-safe output and data URI generation. Handles Unicode correctly and runs entirely in your browser.",
    intro:
      "Paste text or drop in a file to encode it as Base64, in standard or URL-safe form, or as a complete data URI with the right MIME type. Unicode such as 'café' encodes correctly via UTF-8, and the output is about 33% larger than the input. Base64 is an encoding, not encryption. Nothing is uploaded.",
    howToUse: [
      "Paste text, or drop in a file.",
      "Choose standard or URL-safe encoding.",
      "For files, optionally produce a full data URI with the correct MIME type.",
      "Copy the result or download it.",
    ],
    howItWorks: [
      "Base64 represents binary data using 64 printable ASCII characters, taking three bytes at a time and rewriting them as four characters. The cost is size: output is always about 33% larger than the input. The benefit is that the data survives transport through systems that only handle text — email bodies, JSON strings, HTTP headers, URLs.",
      "Unicode needs care. The browser's btoa() only accepts bytes, so passing it a string with an accented character or an emoji throws an error. Text here is encoded to UTF-8 bytes first, which is why 'café' and '日本語' encode correctly rather than failing.",
      "URL-safe encoding swaps + and / for - and _, because the standard characters have their own meaning in a URL and would otherwise need percent-encoding on top. Padding is usually dropped in this variant.",
      "Base64 is an encoding, not encryption. Anyone can decode it instantly. It hides nothing.",
      PRIVACY_NOTE,
    ],
    faq: [
      {
        question: "Is Base64 encryption?",
        answer:
          "No. It is a reversible encoding with no key and no secret. Anyone who has the string can decode it in a second. Never use it to protect anything.",
      },
      {
        question: "Why is my encoded text larger?",
        answer:
          "Base64 turns every three bytes into four characters, so output is roughly 33% larger. That is inherent to the encoding.",
      },
      {
        question: "When should I use URL-safe encoding?",
        answer:
          "Whenever the result goes into a URL path, query string or filename, since + and / have special meanings there.",
      },
      {
        question: "What is a data URI?",
        answer:
          "A complete inline resource — data:image/png;base64,… — that embeds a file directly in HTML or CSS. It removes a network request at the cost of a larger document.",
      },
    ],
  },

  "base64-decoder": {
    seoTitle: "Base64 Decoder — Decode Base64 to Text or File",
    seoDescription:
      "Decode Base64 back to readable text or download it as a file. Detects the content type automatically and handles URL-safe input.",
    intro:
      "Paste a Base64 string or a data URI to decode it instantly. Readable text is shown directly; binary data such as a PNG, JPEG, PDF or ZIP is identified from its file signature so you can download it with the right name. URL-safe input, line breaks and missing padding are fixed automatically. Nothing is uploaded.",
    howToUse: [
      "Paste the Base64 string, or a complete data URI.",
      "The decoded text appears immediately.",
      "If the data is binary, use the download button to save it as a file.",
      "Copy the text if that is what you needed.",
    ],
    howItWorks: [
      "Input is normalised before decoding: URL-safe characters are converted back, whitespace and line breaks are stripped, and missing padding is restored. That means a string copied out of a wrapped email header decodes without manual cleanup.",
      "The decoded bytes are then examined. If they form valid UTF-8, the text is shown directly. If not, the data is binary, and the first bytes are checked against known file signatures to identify what it is — PNG, JPEG, PDF, ZIP and so on — so the download gets a sensible name and type.",
      "Invalid Base64 is reported clearly. The most common causes are a truncated string, a mix of standard and URL-safe alphabets, or stray characters picked up during copying.",
      PRIVACY_NOTE,
    ],
    faq: [
      {
        question: "Why does my Base64 fail to decode?",
        answer:
          "Usually because it is truncated, has missing padding, or mixes the standard and URL-safe alphabets. Padding and whitespace are corrected automatically, so a genuine failure normally means the string is incomplete.",
      },
      {
        question: "How do I decode a Base64 image?",
        answer:
          "Paste the string, including the data:image/... prefix if you have it. The type is detected and a download button appears.",
      },
      {
        question: "Can I decode without knowing the original format?",
        answer:
          "Yes. The decoded bytes are inspected — valid UTF-8 is shown as text, and binary data is identified by its file signature.",
      },
    ],
  },

  "url-encoder": {
    seoTitle: "URL Encoder — Percent-Encode URLs and Parameters",
    seoDescription:
      "Percent-encode a full URL or a single query parameter. Explains the difference between encodeURI and encodeURIComponent.",
    intro:
      "Paste a URL or a value and choose the mode: full URL keeps structural characters such as / ? and & intact, while component mode escapes them for use inside a query parameter. Non-ASCII characters become UTF-8 escapes, so é is %C3%A9, and a space is %20, which is always safe. Nothing is uploaded.",
    howToUse: [
      "Paste the URL or the value you want to encode.",
      "Choose the mode: full URL, or a single component.",
      "Copy the encoded result.",
      "Switch to component mode if you are building a query string.",
    ],
    howItWorks: [
      "There are two different jobs here and using the wrong one is the classic URL bug. Encoding a full URL must leave the structural characters alone — the :// , the / between path segments, the ? and the & — or the URL stops being a URL. Encoding a single parameter value must escape those same characters, or a value containing & will be read as the start of another parameter.",
      "So encoding https://example.com/a b as a full URL gives https://example.com/a%20b, with the slashes intact. Encoding the same string as a component escapes everything: https%3A%2F%2Fexample.com%2Fa%20b — which is exactly right when that URL is being passed as a redirect parameter.",
      "Percent-encoding writes each disallowed byte as % followed by two hex digits. Non-ASCII characters are converted to UTF-8 first, so a single character can become several escapes: é becomes %C3%A9.",
      "Spaces have two encodings. In a path a space is %20; in a query string, +  is also accepted by most servers as a legacy convention. %20 is always safe.",
      PRIVACY_NOTE,
    ],
    faq: [
      {
        question: "What is the difference between the two modes?",
        answer:
          "Full-URL mode preserves the characters that give a URL its structure (: / ? & #). Component mode escapes them, which is what you need when a value is being embedded inside a query parameter.",
      },
      {
        question: "Why did my URL parameter break?",
        answer:
          "Almost always because a value containing &, ? or = was not encoded as a component, so the server read it as the start of a new parameter.",
      },
      {
        question: "Should a space be %20 or +?",
        answer:
          "%20 always works. The + form is a legacy convention accepted in query strings only, and it is wrong in a path.",
      },
    ],
  },

  "url-decoder": {
    seoTitle: "URL Decoder — Decode Percent-Encoding and Queries",
    seoDescription:
      "Decode percent-encoded URLs and break a query string into a readable table of parameters. Handles double-encoding.",
    intro:
      "Paste a percent-encoded URL or string to decode it to readable text, with %C3%A9 shown as é. A URL is also split into its scheme, host, path and a table of query parameters. If you still see % signs, it was encoded twice; repeat decoding unwraps every layer and reports how many. Nothing is uploaded.",
    howToUse: [
      "Paste the encoded URL or string.",
      "The decoded version appears immediately.",
      "If it is a URL, the parameter table below splits out each key and value.",
      "Use repeat decoding if the string was encoded more than once.",
    ],
    howItWorks: [
      "Percent-escapes are converted back to bytes and interpreted as UTF-8, so %C3%A9 becomes é rather than two broken characters.",
      "When the input parses as a URL, it is also broken into its parts — scheme, host, path, and each query parameter as its own row. That is far easier to read than a long single line, particularly for tracking-heavy URLs with a dozen parameters.",
      "Double-encoded strings turn up regularly, usually where a URL passed through a redirect that encoded it again. You can spot them by the %25 sequences, which are encoded percent signs. Repeat decoding unwraps each layer, and the tool reports how many it removed.",
      PRIVACY_NOTE,
    ],
    faq: [
      {
        question: "What does %20 mean?",
        answer:
          "A space. Percent-encoding writes each byte as % followed by its hex value, and 20 is the hex code for a space.",
      },
      {
        question: "Why does my decoded text still contain % signs?",
        answer:
          "It was encoded more than once. Look for %25 — that is an encoded percent sign. Turn on repeat decoding to unwrap every layer.",
      },
      {
        question: "Can I see the query parameters separately?",
        answer:
          "Yes. Anything that parses as a URL is broken into a table with each parameter decoded individually.",
      },
    ],
  },

  "html-formatter": {
    seoTitle: "HTML Formatter — Beautify and Minify HTML Online",
    seoDescription:
      "Indent messy HTML into a readable structure, or minify it for production. Preserves the content of pre, script and style blocks.",
    intro:
      "Paste HTML and press Format to indent it by nesting depth, or Minify to strip whitespace and comments for production. The contents of pre, textarea, script and style blocks are left exactly as they were, so the page renders the same. The markup is only handled as text, so pasted scripts cannot run. Nothing is uploaded.",
    howToUse: [
      "Paste your HTML.",
      "Press Format to indent it, or Minify to compress it.",
      "Set your preferred indentation width.",
      "Copy the result or download it.",
    ],
    howItWorks: [
      "The formatter tokenises the markup into tags, text, comments and doctype declarations, then re-emits it with indentation tracking the nesting depth. Void elements such as img, br and input do not increase the depth, since they never close.",
      "Some content must not be touched. Text inside pre and textarea is whitespace-significant — reindenting it changes what the page displays. Script and style blocks contain other languages entirely, where reindentation could break a template literal or a string. All four are passed through verbatim.",
      "Minifying collapses whitespace between tags, removes comments and drops trailing spaces, while applying the same protections. It is a safe structural minify rather than an aggressive one: attribute quotes and optional closing tags are left alone, because removing them is where minifiers break pages.",
      "The markup is only ever handled as text. It is never inserted into this page, so pasting hostile HTML here cannot execute anything.",
      PRIVACY_NOTE,
    ],
    faq: [
      {
        question: "Will formatting change how my page renders?",
        answer:
          "No. Whitespace between block-level tags is not significant, and the places where it is — pre, textarea, script and style — are left exactly as they were.",
      },
      {
        question: "How much does minifying save?",
        answer:
          "Typically 10–25% on indented HTML before gzip. After gzip the difference is smaller, since compression already handles repeated whitespace well.",
      },
      {
        question: "Is it safe to paste HTML with scripts?",
        answer:
          "Yes. The markup is processed as text and never rendered, so nothing in it runs.",
      },
    ],
  },

  "css-formatter": {
    seoTitle: "CSS Formatter — Beautify and Minify Stylesheets Free",
    seoDescription:
      "Format CSS with consistent indentation, or minify it for production. Handles nested rules, media queries and preserves comments.",
    intro:
      "Paste a stylesheet and press Format for consistent indentation, or Minify to remove comments and whitespace, usually saving 20–35% before gzip. Nested rules, media queries, keyframes and native CSS nesting indent correctly, and strings and url() values are never misread. Values and rules are not rewritten. Nothing is uploaded.",
    howToUse: [
      "Paste your stylesheet.",
      "Press Format to expand it, or Minify to compress it.",
      "Choose indentation and whether each selector goes on its own line.",
      "Copy or download the result.",
    ],
    howItWorks: [
      "The formatter walks the stylesheet character by character, tracking brace depth so nested structures indent correctly. That handles media queries, supports queries, keyframes and native CSS nesting, all of which put rules inside rules.",
      "Strings, url() values and comments are tracked as their own states, so a semicolon inside a url() or a brace inside a string does not confuse the depth counter — a common failure in naive formatters.",
      "Minifying removes comments and unnecessary whitespace, collapses the space around braces, colons and semicolons, and drops the final semicolon in each block. It deliberately stops short of rewriting values or merging rules, since those transformations can change behaviour in edge cases.",
      PRIVACY_NOTE,
    ],
    faq: [
      {
        question: "Does it handle CSS nesting and media queries?",
        answer:
          "Yes. Brace depth is tracked properly, so nested rules, media queries, supports blocks and keyframes all indent correctly.",
      },
      {
        question: "Are my comments kept?",
        answer:
          "Formatting keeps them. Minifying removes them, which is usually what you want in production.",
      },
      {
        question: "How much does minifying save?",
        answer:
          "Usually 20–35% on a formatted stylesheet before gzip. Well-organised CSS with lots of indentation saves the most.",
      },
    ],
  },

  "timestamp-converter": {
    seoTitle: "Unix Timestamp Converter — Epoch to Date and Back",
    seoDescription:
      "Convert Unix timestamps to readable dates in UTC and your local timezone, and convert dates back to epoch seconds or milliseconds.",
    intro:
      "Paste a Unix timestamp to see the date in UTC, in your local time zone and in ISO 8601 form; ten digits are read as seconds and thirteen as milliseconds. Unix time counts seconds since 1 January 1970 UTC. The reverse panel turns a date back into a timestamp, and a live clock shows the current epoch time.",
    howToUse: [
      "Paste a timestamp in seconds or milliseconds; the unit is detected automatically.",
      "Read the date in UTC, in your local timezone, and in ISO 8601 form.",
      "Use the reverse panel to turn a date into a timestamp.",
      "The live clock shows the current epoch time, which you can copy.",
    ],
    howItWorks: [
      "Unix time counts the seconds since 1 January 1970 UTC, ignoring leap seconds. Because it has no timezone of its own, the same timestamp means the same instant everywhere — which is exactly why it is used for storage and for APIs.",
      "Seconds and milliseconds are told apart by magnitude. A ten-digit number is seconds, a thirteen-digit number is milliseconds. The tool detects this and says which it assumed, so you can override it when working with a system that uses microseconds.",
      "Both readings are always shown together, because the gap between them is where bugs live. A timestamp that reads 23:30 on the 5th in UTC may be 00:30 on the 6th where you are — a different date, from the same number.",
      "The 2038 problem is worth a mention: systems storing Unix time in a signed 32-bit integer overflow on 19 January 2038. Modern platforms use 64-bit values and are unaffected, but the limit still turns up in older data.",
      PRIVACY_NOTE,
    ],
    example: {
      scenario: "Decoding a timestamp from a log file",
      steps: [
        "Paste 1788604200.",
        "Ten digits, so it is read as seconds.",
      ],
      result: "Saturday, 5 September 2026, 10:30:00 UTC — shown alongside the same instant in your local timezone.",
    },
    faq: [
      {
        question: "What is a Unix timestamp?",
        answer:
          "The number of seconds since midnight UTC on 1 January 1970. It identifies an instant without reference to any timezone.",
      },
      {
        question: "Seconds or milliseconds?",
        answer:
          "Ten digits means seconds, thirteen means milliseconds. JavaScript uses milliseconds; most databases and Unix tools use seconds.",
      },
      {
        question: "Why is my date one day out?",
        answer:
          "You are probably comparing UTC with local time. A timestamp late in the UTC day falls on the following day in eastern timezones. Both are shown side by side for that reason.",
      },
      {
        question: "What is the year 2038 problem?",
        answer:
          "Signed 32-bit storage of Unix time overflows on 19 January 2038. Modern systems use 64-bit values, but legacy data and embedded devices can still be affected.",
      },
    ],
  },

  "csv-to-json": {
    seoTitle: "CSV to JSON Converter — Free, Private, No Upload",
    seoDescription:
      "Convert CSV, TSV or a spreadsheet export to a JSON array of objects. Detects the delimiter, keeps leading zeros and nests dotted headers. Runs in your browser.",
    intro:
      "To convert CSV to JSON, paste the data or load a file, check the detected delimiter and download the JSON. The first row becomes the keys of each object, numbers and true/false become real values, and codes with leading zeros such as 00042 stay as text. Quoted commas and line breaks are handled. Nothing is uploaded.",
    howToUse: [
      "Paste CSV, or load a .csv or .tsv file.",
      "Check the delimiter — it is detected automatically — and whether the first row is a header.",
      "Choose whether to detect numbers and whether to nest dotted headers such as address.city.",
      "Copy the JSON or download it as a .json file.",
    ],
    howItWorks: [
      "The parser follows RFC 4180, the closest thing CSV has to a standard. A value wrapped in double quotes may contain the delimiter, a line break or a doubled quote (\"\") that stands for one quote mark. A byte-order mark at the start, CRLF or LF line endings and a missing final line break are all accepted.",
      "The delimiter is detected by parsing the first lines with a comma, semicolon, tab and pipe, and choosing the one that gives the most columns consistently. Separators inside quoted values are ignored, so an address with a comma does not fool it.",
      "With type detection on, a cell becomes a number only when nothing can be lost: 3.5 and -12 become numbers, but 00042 keeps its leading zero and a 19-digit ID stays text because JavaScript numbers hold only about 15 significant digits exactly. TRUE and false become booleans, and empty cells become null.",
      "Duplicate or blank header names are made unique (name, name_2, column3), so no column silently overwrites another. Rows with fewer cells get null for the missing values, and extra cells get their own column.",
      PRIVACY_NOTE,
    ],
    example: {
      scenario: "Two rows with a header, one value containing a comma",
      steps: [
        "id,name,postcode",
        "1,\"Hopper, Grace\",01234",
        "→ [{ \"id\": 1, \"name\": \"Hopper, Grace\", \"postcode\": \"01234\" }]",
      ],
      result: "The quoted comma stays inside the name, and the postcode keeps its leading zero as text.",
    },
    faq: [
      {
        question: "How do I convert an Excel file to JSON?",
        answer:
          "Save or export the sheet as CSV from Excel (File → Save As → CSV UTF-8), then load that file here. Each row becomes an object keyed by the header row.",
      },
      {
        question: "Why are some numbers kept in quotes?",
        answer:
          "Values with a leading zero, such as postcodes and account codes, and numbers longer than 15 digits stay as text so they are not changed. Turn off type detection to keep every value as text.",
      },
      {
        question: "Can it handle semicolon or tab-separated files?",
        answer:
          "Yes. The delimiter is detected automatically, and you can choose comma, semicolon, tab or pipe yourself if the guess is wrong.",
      },
      {
        question: "What if my CSV has no header row?",
        answer:
          "Untick “First row is a header” and each row becomes an array of values instead of an object.",
      },
    ],
  },

  "jwt-decoder": {
    seoTitle: "JWT Decoder — Read Token Claims and Expiry",
    seoDescription:
      "Decode a JSON Web Token to read its header, payload and claims, and see when it expires in your time zone. Decoded in your browser; nothing is sent.",
    intro:
      "Paste a JSON Web Token to read its header and payload as formatted JSON, with the exp, iat and nbf times shown as real dates and a clear expired or valid label. A “Bearer” prefix is stripped. Decoding is not verification: it cannot prove who issued the token. The token never leaves your browser.",
    howToUse: [
      "Paste the token, with or without the “Bearer ” prefix.",
      "Read the header and payload, shown as formatted JSON.",
      "Check the claims table for issue and expiry times in your time zone.",
      "Copy the parts you need, then verify the token on your server.",
    ],
    howItWorks: [
      "A JWT is three Base64URL-encoded parts joined by dots: a header, a payload and a signature. The header and payload are JSON, so decoding them is just reversing the Base64URL encoding — no key is needed, which is why anyone holding a token can read it.",
      "The registered claims from RFC 7519 are explained: iss (issuer), sub (subject), aud (audience), jti (token ID), and the three times — iat (issued at), nbf (not before) and exp (expiry). Times are Unix timestamps in seconds and are converted to dates in your time zone, with how long ago or how soon they are.",
      "Expiry is judged against this device's clock. A wrong clock, or a server that allows a minute or two of leeway, can change the answer at the boundary.",
      "The signature is shown but not checked. Verifying it needs the issuer's secret (for HS256) or public key (for RS256 and ES256), and should happen on your server with a maintained JWT library. A token with alg set to none has no signature and should always be rejected.",
      "A token with five parts is an encrypted JWE rather than a signed JWT; its contents can only be read with the recipient's private key, so it is reported rather than decoded.",
      PRIVACY_NOTE,
    ],
    faq: [
      {
        question: "Is it safe to paste a real token here?",
        answer:
          "The token is decoded in your browser and not sent anywhere. Even so, a live token is a credential: anyone who has it can use it until it expires, so avoid pasting production tokens into tools you have not checked.",
      },
      {
        question: "Does decoding verify the signature?",
        answer:
          "No. Decoding only reads the header and payload. Checking the signature needs the issuer's secret or public key, and should be done by your server.",
      },
      {
        question: "Why does my token show as expired?",
        answer:
          "The exp claim is earlier than this device's clock. Access tokens are often valid for only minutes; request a new one, or check your device's date and time.",
      },
      {
        question: "Can JWT contents be secret?",
        answer:
          "Not in a normal signed JWT: the payload is only encoded, not encrypted. Never put passwords or other secrets in a JWT payload.",
      },
    ],
  },

  "hash-generator": {
    seoTitle: "Hash Generator — SHA-256, MD5, SHA-512 and HMAC",
    seoDescription:
      "Generate MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hashes or HMACs of any text, in hex or Base64. Calculated in your browser with Web Crypto.",
    intro:
      "Type or paste text to see its MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hashes at once, in hex or Base64. Add a secret key to get HMACs for signing API requests and webhooks. Text is hashed as UTF-8, so results match sha256sum and other tools. Everything is calculated in your browser.",
    howToUse: [
      "Type or paste the text to hash.",
      "Choose hex or Base64 output, and upper-case hex if a system expects it.",
      "Tick HMAC and enter a secret key to get keyed hashes instead.",
      "Copy the hash you need with its copy button.",
    ],
    howItWorks: [
      "A hash function turns any input into a fixed-length fingerprint: SHA-256 always gives 256 bits, written as 64 hex characters. The same input always gives the same hash, and changing a single character changes it completely. It cannot be reversed to recover the input.",
      "The SHA family is calculated with your browser's built-in Web Crypto API. MD5 is not part of Web Crypto, so it comes from the same WebAssembly library the file checksum tool uses.",
      "Text is converted to UTF-8 bytes before hashing, exactly as typed. A trailing space or line break changes the result, which is the usual reason two tools seem to disagree — echo adds a line break unless you use echo -n.",
      "HMAC combines a secret key with the message, as defined in RFC 2104, so only someone with the key can produce or check the value. It is offered for the SHA family, which is what APIs and webhook signatures use.",
      "MD5 and SHA-1 have known collision attacks. They are fine for matching an existing checksum, not for security. Passwords should never be stored as plain hashes; they need a slow, salted algorithm such as Argon2 or bcrypt.",
      PRIVACY_NOTE,
    ],
    example: {
      scenario: "Hashing the text “abc” with SHA-256",
      steps: [
        "Input bytes (UTF-8): 61 62 63",
        "SHA-256 → ba7816bf 8f01cfea 414140de 5dae2223 b00361a3 96177a9c b410ff61 f20015ad (spaces added for reading)",
      ],
      result: "The standard test vector from the SHA-2 specification, so you can confirm the tool is correct.",
    },
    faq: [
      {
        question: "Why is my hash different from another tool's?",
        answer:
          "Almost always because the input differs by an invisible character — a trailing space or line break, or a different text encoding. Here, text is hashed exactly as typed, as UTF-8.",
      },
      {
        question: "Can a hash be decrypted?",
        answer:
          "No. A hash is one-way. Sites that claim to “decrypt” MD5 just look the hash up in lists of common inputs, which is why short or common inputs are not safe to hash on their own.",
      },
      {
        question: "Which algorithm should I use?",
        answer:
          "SHA-256 for anything new. Use MD5 or SHA-1 only to match a checksum that was published that way.",
      },
      {
        question: "How do I hash a file?",
        answer:
          "Use the File Checksum Verifier, which hashes files of any size in your browser and compares the result with a published checksum.",
      },
    ],
  },

  "cron-expression-explainer": {
    seoTitle: "Cron Expression Explainer — Next Run Times",
    seoDescription:
      "Paste a cron expression to see what it means in plain English, field by field, and the next 10 run times in your time zone. Standard five-field cron.",
    intro:
      "Paste a cron expression such as 0 9 * * 1-5 to see it in plain English — here, “At 09:00 on weekdays” — with each field explained and the next ten run times in your time zone. It reads standard five-field cron, including ranges, steps, names like MON and shortcuts like @daily. It runs in your browser.",
    howToUse: [
      "Type or paste a cron expression, or pick an example.",
      "Read the plain-English description and the field-by-field table.",
      "Check the next ten run times, shown in your own time zone.",
      "Adjust the expression until the schedule matches what you want.",
    ],
    howItWorks: [
      "Standard cron has five fields: minute (0–59), hour (0–23), day of month (1–31), month (1–12 or JAN–DEC) and day of week (0–6 or SUN–SAT, with 7 also meaning Sunday). Each field can be * for every value, a list (1,15), a range (1-5), a step (*/15 or 0-30/10) or a combination.",
      "The shortcuts @hourly, @daily (or @midnight), @weekly, @monthly and @yearly (or @annually) are expanded to their five-field equivalents. @reboot has no schedule, so it is explained rather than expanded.",
      "When both the day-of-month and day-of-week fields are restricted, standard cron runs on days that match either one, not both. 0 0 13 * 5 therefore runs on every 13th and on every Friday. If either field starts with *, only the other one counts.",
      "Upcoming runs are calculated in this device's time zone by checking each day for up to five years ahead, so schedules that run rarely — such as 29 February — are still found. Times that do not exist on a daylight-saving change day are skipped.",
      "Quartz and Spring schedulers use six or seven fields (adding seconds and a year) and symbols such as ?, L, W and #. Those are reported as not standard cron rather than guessed at.",
      PRIVACY_NOTE,
    ],
    example: {
      scenario: "*/15 9-17 * * 1-5",
      steps: [
        "Minute */15 → 0, 15, 30, 45",
        "Hour 9-17 → 09:00 to 17:59",
        "Day of week 1-5 → Monday to Friday",
      ],
      result: "Every 15 minutes between 09:00 and 17:59 on weekdays — the last run each day is 17:45.",
    },
    faq: [
      {
        question: "What does * * * * * mean?",
        answer:
          "Every minute of every day. Each * means “every value” for its field.",
      },
      {
        question: "How do I run a job every 5 minutes?",
        answer:
          "Use */5 * * * *. The step /5 means every fifth value, starting from 0.",
      },
      {
        question: "Which time zone does cron use?",
        answer:
          "The time zone of the machine or service running it, which on servers and many cloud schedulers is UTC. The run times here are shown in your own time zone, so adjust if your server differs.",
      },
      {
        question: "Why does my schedule run on more days than I expected?",
        answer:
          "If you restricted both day of month and day of week, cron runs when either matches. To run on the 13th only if it is a Friday, schedule the 13th and check the weekday inside the job.",
      },
    ],
  },

  "regex-tester": {
    seoTitle: "Regex Tester — Test JavaScript Regular Expressions",
    seoDescription:
      "Test a JavaScript regular expression against your text with live highlighting, capture groups, flags and replacement preview. Runs in your browser.",
    intro:
      "Type a regular expression and some test text to see every match highlighted, with its position and capture groups, as you type. Toggle the g, i, m, s, u and y flags and preview a replacement using $1 or $<name>. It uses your browser's JavaScript engine, and a runaway pattern is stopped after 1.5 seconds. Nothing is uploaded.",
    howToUse: [
      "Type the pattern without the surrounding slashes.",
      "Tick the flags you need — g to find every match, i to ignore case.",
      "Paste the text to test against and read the highlighted matches and the groups table.",
      "Optionally tick Test a replacement and enter a template such as $3/$2/$1.",
    ],
    howItWorks: [
      "Matching uses the browser's own RegExp engine, so a pattern behaves exactly as it will in JavaScript and TypeScript code. Other languages' engines — PCRE in PHP, Python's re, Java — share most syntax but differ in details such as lookbehind support and named-group syntax.",
      "Without the g flag only the first match is found, which is what JavaScript's match() and exec() return. With g, every match is listed; empty matches (from patterns like a*) are shown as a thin marker and the search moves on one character, as matchAll does.",
      "Capture groups are numbered from 1 in the order their opening brackets appear. A group that did not take part in a match is shown as “not matched”, which is different from matching an empty string.",
      "The replacement preview uses String.replace: $1 to $99 insert numbered groups, $<name> a named group, $& the whole match, $` and $' the text before and after, and $$ a literal dollar sign.",
      "The pattern runs in a background worker. Nested quantifiers such as (a+)+ can take exponentially long on some inputs — catastrophic backtracking — so the worker is stopped after 1.5 seconds and the page stays usable. The first 1,000 matches are listed.",
      PRIVACY_NOTE,
    ],
    example: {
      scenario: "Reformatting ISO dates with (\\d{4})-(\\d{2})-(\\d{2}) and the g flag",
      steps: [
        "Text: Due 2026-10-20 and 2026-11-03",
        "Matches: 2026-10-20 and 2026-11-03, each with groups $1 year, $2 month, $3 day",
        "Replacement $3/$2/$1 → Due 20/10/2026 and 03/11/2026",
      ],
      result: "Two matches, each split into three groups, and both dates rewritten day first.",
    },
    faq: [
      {
        question: "Why does my regex only find the first match?",
        answer:
          "Without the g (global) flag, JavaScript stops after the first match. Tick g to find them all.",
      },
      {
        question: "Why does the same regex behave differently in Python or PHP?",
        answer:
          "Each language has its own regex engine. Most syntax is shared, but features such as lookbehind, possessive quantifiers, named-group syntax and Unicode classes differ. This tester matches JavaScript exactly.",
      },
      {
        question: "What does the timeout message mean?",
        answer:
          "The pattern took more than 1.5 seconds, usually because nested repeats such as (a+)+ or (.*)* make the engine try an enormous number of combinations. Make the inner part more specific or use a bounded quantifier.",
      },
      {
        question: "Do I need to escape the slash?",
        answer:
          "No. Type the pattern without the surrounding slashes; a / inside it needs no escaping here, although it would in a /…/ literal in code.",
      },
    ],
  },

  "markdown-to-html": {
    seoTitle: "Markdown to HTML Converter With Live Preview",
    seoDescription:
      "Convert Markdown to clean HTML with a live preview: headings, lists, tables, task lists, code blocks and links. Download a fragment or a full page. Private.",
    intro:
      "Type or paste Markdown on the left to see a live preview, then switch to HTML code to copy or download the result. Headings, emphasis, links, images, lists, task lists, tables, quotes and fenced code are supported. Raw HTML in the input is shown as text, so the output is safe to paste. Nothing is uploaded.",
    howToUse: [
      "Type or paste Markdown, or load a .md file.",
      "Check the rendered preview on the right.",
      "Switch to HTML code to see the markup, and tick the full-page option if you need a standalone file.",
      "Copy the HTML or download it.",
    ],
    howItWorks: [
      "The converter covers the everyday syntax of CommonMark plus the GitHub-flavoured additions most people expect: # headings and underlined headings, paragraphs and line breaks, **bold**, *italic*, ~~strikethrough~~, `code`, fenced and indented code blocks, block quotes, nested bullet and numbered lists, - [ ] task lists, | tables | with alignment, horizontal rules, links, images and bare web addresses.",
      "Every piece of text is HTML-escaped, and HTML typed into the Markdown is shown as text rather than passed through. Link and image addresses are kept only for http, https, mailto and tel, or relative paths; anything else, such as a javascript: link, becomes #. That is why the preview is safe to render, and why the HTML is safe to paste into a page.",
      "Fenced code keeps its language as a class such as language-js, which syntax highlighters such as Prism and highlight.js pick up. Table alignment is written as an inline text-align style.",
      "Markdown has many dialects. Rare constructs — reference-style links, footnotes, definition lists, HTML blocks — are not converted. Check the preview if your source uses them.",
      PRIVACY_NOTE,
    ],
    faq: [
      {
        question: "Why is my HTML tag shown as text?",
        answer:
          "Raw HTML in the Markdown is escaped on purpose, so the output cannot carry scripts or broken markup. Write the content in Markdown instead, or add the HTML after converting.",
      },
      {
        question: "Does it support GitHub tables and task lists?",
        answer:
          "Yes. Pipe tables with a --- separator row (and : for alignment) become HTML tables, and - [ ] and - [x] become checkboxes.",
      },
      {
        question: "Can I get a complete HTML file?",
        answer:
          "Tick “Wrap in a complete HTML page” to add the doctype, head and a title taken from the first heading, then download.",
      },
      {
        question: "Will code blocks be highlighted?",
        answer:
          "Code blocks are output with a language-… class, which a syntax highlighter on your page can colour. The converter itself adds no colours.",
      },
    ],
  },
};
