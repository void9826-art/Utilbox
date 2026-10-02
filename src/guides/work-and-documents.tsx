import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-02";

export const workAndDocumentsGuides: Guide[] = [
  {
    slug: "how-to-make-an-invoice",
    topic: "Work & documents",
    title: "How to make an invoice that gets paid on time",
    seoTitle: "How to Make an Invoice That Gets Paid on Time",
    description:
      "What to put on an invoice, how to number it, clear payment terms, tax and discounts, and how to create a professional PDF invoice without an account.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["invoice-generator", "tax-calculator", "merge-pdf"],
    Body: function Body() {
      return (
        <>
          <p>
            For freelancers and small businesses, the invoice is the last step between doing the work and
            being paid. A clear, complete invoice gets processed quickly; a vague one sits in someone&apos;s
            inbox waiting for a question to be answered.
          </p>

          <h2>What an invoice should include</h2>
          <ul>
            <li>The word &ldquo;Invoice&rdquo; and a unique invoice number.</li>
            <li>The invoice date and the payment due date.</li>
            <li>Your name or business name, address and contact details.</li>
            <li>The client&apos;s name and address, and a purchase order number if they gave you one.</li>
            <li>A line for each item or service, with quantity, price and line total.</li>
            <li>The subtotal, any discount, tax, and the total due.</li>
            <li>How to pay: bank details or a payment link.</li>
            <li>Your tax registration number, if you are registered.</li>
          </ul>
          <p>
            Requirements differ between countries, especially around tax, so check what your tax authority
            expects an invoice to show.
          </p>

          <h2>Make an invoice step by step</h2>
          <ol>
            <li>
              Open the <Link href="/generators/invoice-generator">Invoice Generator</Link> and fill in your
              details and your client&apos;s.
            </li>
            <li>Add a line for each item with its quantity and unit price.</li>
            <li>Set the tax rate, any discount and the currency.</li>
            <li>Add your logo if you have one.</li>
            <li>Check the live preview, then download the PDF.</li>
          </ol>
          <p>
            Totals are recalculated as you type in whole cents, so the figures always add up exactly. The
            PDF is a real document with selectable text rather than a picture of a page, which keeps it
            small and readable by clients&apos; accounting systems. There is no account and no watermark,
            and nothing you type leaves your browser — which also means nothing is saved, so keep every PDF
            you download.
          </p>

          <h2>Numbering invoices</h2>
          <p>
            Use a simple sequence that never repeats, such as 2026-001, 2026-002. Many tax authorities expect
            invoice numbers to be unique and in order, and a clear sequence makes your own records and any
            questions much easier. Never reuse a number, even for a cancelled invoice; issue a credit note
            instead.
          </p>

          <h2>Payment terms that work</h2>
          <ul>
            <li>
              <strong>State a date, not just a period.</strong> &ldquo;Due 30 October 2026&rdquo; is
              clearer than &ldquo;30 days&rdquo;.
            </li>
            <li>
              <strong>Make paying easy.</strong> Put full bank details or a payment link on the invoice
              itself.
            </li>
            <li>
              <strong>Agree terms before the work starts</strong>, so the invoice holds no surprises.
            </li>
            <li>
              <strong>Invoice promptly.</strong> An invoice sent the day the work is delivered is paid
              sooner than one sent a month later.
            </li>
          </ul>

          <h2>Tax and discounts</h2>
          <p>
            Show the amount before tax, the tax and the total separately. If you quoted a price including
            tax and need to work backwards, divide rather than subtract — the{" "}
            <Link href="/calculators/tax-calculator">Tax Calculator</Link> does it correctly. Show a
            discount as its own line so the client can see the original price and the reduction.
          </p>

          <h2>Sending it</h2>
          <p>
            Name the file clearly — &ldquo;Invoice 2026-014 Your Business.pdf&rdquo; — and send it to the
            person or address that handles payments, not only to your contact. If a timesheet or receipt
            needs to go with it, combine them into one file with <Link href="/pdf/merge-pdf">Merge PDF</Link>.
          </p>

          <h2>Keeping records</h2>
          <p>
            Keep a copy of every invoice you issue, in order, together with a note of when each was paid.
            Tax authorities usually require business records to be kept for several years. A simple
            spreadsheet with the invoice number, client, amount, date sent and date paid makes chasing late
            payments and doing your accounts straightforward.
          </p>
        </>
      );
    },
  },

  {
    slug: "one-page-resume",
    topic: "Work & documents",
    title: "How to write a one-page resume that works",
    seoTitle: "How to Write a One-Page Resume That Works",
    description:
      "Fit your experience onto one page without cramming: what to include, what to cut, how to write strong bullet points, and a layout tracking systems can read.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["resume-generator", "resume-ats-checker", "word-counter"],
    Body: function Body() {
      return (
        <>
          <p>
            Recruiters often spend well under a minute on a first look at a resume. A focused single page
            that shows your most relevant experience clearly does better than three pages of everything you
            have ever done.
          </p>

          <h2>One page or two?</h2>
          <p>
            One page suits most people, especially those early in their careers or changing direction. Two
            pages are reasonable with more than about ten years of relevant experience. Academic CVs and
            some countries&apos; conventions differ, so follow what the employer or field expects.
          </p>

          <h2>What to include</h2>
          <ul>
            <li>
              <strong>Contact details:</strong> name, phone, email, city, and a professional profile link
              if you have one. A full home address is rarely needed.
            </li>
            <li>
              <strong>A short summary:</strong> two or three lines on who you are and what you are looking
              for.
            </li>
            <li>
              <strong>Experience:</strong> job title, employer, dates and three to five bullet points for
              each recent role.
            </li>
            <li>
              <strong>Education</strong> and relevant qualifications.
            </li>
            <li>
              <strong>Skills</strong> that match the job advert.
            </li>
          </ul>

          <h2>What to cut</h2>
          <ul>
            <li>Duties that are obvious from the job title.</li>
            <li>Roles from long ago that do not relate to the job — summarise them in one line.</li>
            <li>&ldquo;References available on request&rdquo; — it is assumed.</li>
            <li>Hobbies, unless they are relevant or genuinely distinctive.</li>
          </ul>

          <h2>Writing bullet points that count</h2>
          <p>Start with a verb and show a result, with a number where you can:</p>
          <ul>
            <li>Weak: &ldquo;Responsible for customer emails.&rdquo;</li>
            <li>Strong: &ldquo;Answered 60+ customer emails a day and cut average response time from two days to four hours.&rdquo;</li>
          </ul>
          <p>
            Numbers — time saved, money made, people helped, errors reduced — are what make a line stand out
            on a quick read.
          </p>

          <h2>Build it step by step</h2>
          <ol>
            <li>
              Open the <Link href="/generators/resume-generator">Resume Generator</Link> and enter your
              contact details and summary.
            </li>
            <li>Add your experience, education and skills.</li>
            <li>Reorder or remove any section you do not need.</li>
            <li>Check the preview — it shows page breaks, so you can see whether you fit on one page.</li>
            <li>Download the PDF.</li>
          </ol>
          <p>
            The layout is deliberately plain: one column, standard headings and real text, which is what
            applicant tracking systems read most reliably. Your details stay in your browser and are not
            uploaded.
          </p>

          <h2>Should you add a photo?</h2>
          <p>
            In the UK and North America, photos are generally discouraged: they raise bias concerns and can
            confuse automated parsing. In parts of Europe and Asia they are expected. The template leaves
            one out; follow local custom for where you are applying.
          </p>

          <h2>Tailor it for each job</h2>
          <p>
            Keep a complete master version, then make a tailored copy for each application: adjust the
            summary, reorder the bullet points so the most relevant come first, and use the advert&apos;s
            wording for skills you genuinely have. Check the result against the advert with the{" "}
            <Link href="/text/resume-ats-checker">Resume ATS Checker</Link> — see{" "}
            <Link href="/guides/how-to-make-your-resume-ats-friendly">how to make your resume ATS-friendly</Link>.
          </p>

          <h2>Before you send it</h2>
          <ul>
            <li>Proofread twice, then ask someone else to read it.</li>
            <li>Check that dates are consistent and that no role is missing an end date.</li>
            <li>Name the file with your name: firstname-lastname-resume.pdf.</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "how-to-format-a-linkedin-post",
    topic: "Work & documents",
    title: "How to format a LinkedIn post: bold text, spacing and the “see more” cut",
    seoTitle: "How to Format a LinkedIn Post: Bold and Spacing",
    description:
      "Add bold and italic text to LinkedIn posts, keep line breaks intact, write an opening that survives the “see more” cut, and avoid the accessibility traps.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["linkedin-formatter", "character-counter", "text-cleaner"],
    Body: function Body() {
      return (
        <>
          <p>
            LinkedIn posts are plain text: there is no bold button, no italics and no bullet tool. Yet many
            posts show bold words and neat lists. The trick is special characters, and using them well
            means knowing what they cost.
          </p>

          <h2>How bold text on LinkedIn works</h2>
          <p>
            Unicode, the standard that defines every character computers display, includes complete
            alphabets of mathematical bold, italic and monospace letters. They look like styled text, but
            they are different characters. Paste them into a post and the styling travels with them.
          </p>

          <h2>Format a post step by step</h2>
          <ol>
            <li>
              Write or paste your post into the{" "}
              <Link href="/text/linkedin-formatter">LinkedIn Post Formatter</Link>.
            </li>
            <li>Select a word or phrase and press Bold, Italic or another style.</li>
            <li>Select several lines and choose a bullet style to turn them into a list.</li>
            <li>Check the preview and the character count, then copy the post and paste it into LinkedIn.</li>
          </ol>
          <p>The post is formatted in your browser and not sent anywhere.</p>

          <h2>The costs of styled letters</h2>
          <ul>
            <li>
              <strong>Accessibility.</strong> Screen readers handle these characters inconsistently; some
              read each letter out separately, or skip the word entirely.
            </li>
            <li>
              <strong>Search.</strong> A word in styled letters does not match a search for the ordinary
              word.
            </li>
            <li>
              <strong>Length.</strong> Each styled letter is stored as two text units, so styled text uses
              up the limit faster.
            </li>
          </ul>
          <p>
            Use bold for a word or a short phrase that genuinely needs emphasis, not for whole paragraphs.
            Select styled text and press Plain to turn it back.
          </p>

          <h2>Write for the &ldquo;see more&rdquo; cut</h2>
          <p>
            In the feed, a post is shortened after its first few lines — roughly the first 200 characters,
            and sooner if you use short lines. Most people decide whether to click from those lines alone.
            The preview marks an approximate cut point; put your hook, question or key result in the first
            two lines.
          </p>

          <h2>Line breaks and spacing</h2>
          <p>
            Short paragraphs of one or two lines, separated by blank lines, read far better on a phone than
            a block of text. Line breaks paste into LinkedIn unchanged; if runs of empty lines are collapsed
            after posting, turn on the option that protects blank lines by placing an invisible character
            on each one.
          </p>

          <h2>Length</h2>
          <p>
            Posts can be up to 3,000 characters. Because styled letters count double, a heavily styled post
            can be rejected even when it looks shorter. The formatter shows both counts; keep the larger one
            under the limit. For text that arrived from a document with odd spacing or curly quotes, tidy it
            first with <Link href="/text/text-cleaner">Text Cleaner</Link>.
          </p>

          <h2>A simple structure that works</h2>
          <ol>
            <li>A first line that states the point or asks the question.</li>
            <li>Two or three short paragraphs, or a short list, with the detail.</li>
            <li>A closing line inviting a response, if you want one.</li>
          </ol>
          <p>
            Hashtags and emoji are ordinary characters and count towards the limit like any other. Use a
            few relevant hashtags at the end rather than many through the text.
          </p>
        </>
      );
    },
  },

  {
    slug: "pick-a-random-winner",
    topic: "Work & documents",
    title: "How to pick a random winner fairly — and prove it",
    seoTitle: "How to Pick a Random Winner Fairly",
    description:
      "Run a fair prize draw or giveaway: number the entries, draw without repeats, record the result so anyone can check it, and avoid the common mistakes.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["random-number-generator", "sort-lines", "remove-duplicate-lines"],
    Body: function Body() {
      return (
        <>
          <p>
            A raffle at a school fair, a social media giveaway, a team prize, a rota: whenever a winner is
            picked at random, people want to know it was fair. A sound method is simple, and a little
            record-keeping makes it easy to show.
          </p>

          <h2>Step 1: make a clean list of entries</h2>
          <ol>
            <li>Collect all valid entries in one list, one per line.</li>
            <li>
              Remove duplicates if each person should have one entry, with{" "}
              <Link href="/text/remove-duplicate-lines">Remove Duplicate Lines</Link>. Turn off case
              sensitivity so &ldquo;Ann&rdquo; and &ldquo;ann&rdquo; count once.
            </li>
            <li>Remove entries that break the rules — late, ineligible, incomplete — before the draw, not after.</li>
            <li>Number the final list from 1 upwards and save a copy.</li>
          </ol>

          <h2>Step 2: draw the winner</h2>
          <ol>
            <li>
              Open the <Link href="/generators/random-number-generator">Random Number Generator</Link>.
            </li>
            <li>Set the range from 1 to the number of entries. Both ends are included.</li>
            <li>For several prizes, set how many numbers you need and turn off duplicates, so no one can win twice.</li>
            <li>Generate, and match the numbers to the list.</li>
          </ol>
          <p>
            The numbers come from your browser&apos;s cryptographically secure random generator, using a
            method that makes every number equally likely. With duplicates off, numbers are drawn without
            replacement, exactly as in a lottery draw.
          </p>

          <h2>Step 3: make it checkable</h2>
          <p>
            The draw itself leaves no trail, so the record has to come from you. For anything people care
            about:
          </p>
          <ul>
            <li>Publish or share the numbered entry list, or the number of entries, before the draw.</li>
            <li>Record the screen while you generate the number, or draw it live.</li>
            <li>Note the date, time, range and result.</li>
            <li>Announce the result with the winning number as well as the name.</li>
          </ul>

          <h2>Extra entries</h2>
          <p>
            Some giveaways give extra entries — one for following, another for sharing. The fair way to
            handle that is to list each entry separately: a person with three entries appears on three
            numbered lines. Every line then has the same chance, and a person with more entries has
            proportionally more chance, which is what the rules promised. Skip the duplicate-removal step in
            that case, and decide in advance whether one person can win more than one prize.
          </p>

          <h2>Drawing for a running order or teams</h2>
          <p>
            To put a whole list in random order — for presentation slots, a rota or seating — use the random
            option in <Link href="/text/sort-lines">Sort Lines</Link>. It shuffles the lines so every
            possible order is equally likely. To split people into teams, shuffle the list and divide it into
            consecutive groups.
          </p>

          <h2>Mistakes that make a draw unfair</h2>
          <ul>
            <li>
              <strong>Re-drawing until you like the result.</strong> Decide in advance what happens if the
              winner is ineligible or does not respond — usually, draw again from the remaining entries — and
              stick to it.
            </li>
            <li>
              <strong>Changing the list after drawing.</strong> Freeze it first.
            </li>
            <li>
              <strong>Biased shortcuts</strong>, such as picking a comment by scrolling and stopping, or
              taking the first person who replied.
            </li>
          </ul>

          <h2>Rules and law</h2>
          <p>
            Prize draws and giveaways are regulated in many countries, and social media platforms have their
            own promotion rules. For competitions with valuable prizes, paid entry or many entrants, check
            the rules that apply before you start. Keep the entry list and your record of the draw for a
            while afterwards in case anyone asks.
          </p>
        </>
      );
    },
  },
];
