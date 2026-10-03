import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-03";

export const workLongTailGuides: Guide[] = [
  {
    slug: "invoice-vs-receipt-vs-quote",
    topic: "Work & documents",
    title: "Invoice vs receipt vs quote vs estimate: which document when",
    seoTitle: "Invoice vs Receipt vs Quote vs Estimate",
    description:
      "A quote offers a price, an invoice asks for payment and a receipt proves it was paid. What each document is for, what goes on it, and where pro forma invoices fit.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["invoice-generator", "tax-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Freelancers and small businesses send several kinds of money document, and clients sometimes ask for the
            wrong one: &ldquo;Can you send me an invoice?&rdquo; when the work has not been agreed, or &ldquo;I need
            a receipt&rdquo; when the bill is still unpaid. Each document has a specific job.
          </p>

          <h2>The documents in order</h2>
          <table>
            <thead>
              <tr>
                <th>Document</th>
                <th>Sent</th>
                <th>Says</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Estimate</td>
                <td>Before work</td>
                <td>Roughly what it will cost</td>
              </tr>
              <tr>
                <td>Quote</td>
                <td>Before work</td>
                <td>Exactly what it will cost</td>
              </tr>
              <tr>
                <td>Pro forma invoice</td>
                <td>Before payment</td>
                <td>What the invoice will be</td>
              </tr>
              <tr>
                <td>Invoice</td>
                <td>After delivery</td>
                <td>Please pay this amount</td>
              </tr>
              <tr>
                <td>Receipt</td>
                <td>After payment</td>
                <td>This amount was paid</td>
              </tr>
            </tbody>
          </table>

          <h2>Estimate and quote</h2>
          <p>
            An estimate is a best guess, useful when the work is uncertain, such as repairs where the problem is not
            yet known. A quote is a fixed price for a defined job; once the client accepts it, you are normally
            expected to keep to it. Put a validity period on quotes (&ldquo;valid for 30 days&rdquo;), describe
            exactly what is included and what is not, and say how extra work will be charged.
          </p>

          <h2>Pro forma invoice</h2>
          <p>
            A pro forma invoice looks like an invoice but is a preview. It is used to request payment in advance, to
            let a client raise a purchase order, or for customs with international shipments. It is usually not a
            tax invoice, so do not record it as a sale. When the goods ship or the work is done, issue the real
            invoice.
          </p>

          <h2>Invoice</h2>
          <p>An invoice is a formal request for payment and a record of the sale. It should include:</p>
          <ul>
            <li>Your name or business, address and contact details, and the client&apos;s.</li>
            <li>A unique invoice number and the issue date.</li>
            <li>What was supplied, quantities, prices and the total.</li>
            <li>Tax, if you are registered for it, with your tax number.</li>
            <li>The due date and how to pay.</li>
          </ul>
          <p>
            The <Link href="/generators/invoice-generator">Invoice Generator</Link> builds one with line items,
            discount, tax and notes, and exports a real PDF. For what makes an invoice get paid on time, see{" "}
            <Link href="/guides/how-to-make-an-invoice">how to make an invoice</Link>.
          </p>

          <h2>Receipt</h2>
          <p>
            A receipt confirms payment. It shows what was paid, how much, when, and by what method. Many small
            businesses issue a receipt by sending the invoice again marked as paid, for example with a note such as
            &ldquo;Paid in full on 3 October 2026 by bank transfer. Thank you.&rdquo; in the Invoice Generator&apos;s
            notes field. That is often all a client needs for their records.
          </p>

          <h2>Credit notes</h2>
          <p>
            If an invoice was wrong or goods are returned, do not delete or edit the invoice. Issue a credit note that
            reduces or cancels it, with its own number, and send a new invoice if needed. Accountants and tax
            authorities expect the trail to be complete.
          </p>

          <h2>Tax amounts on every document</h2>
          <p>
            If you charge VAT, GST or sales tax, show prices before tax, the tax amount and the total on quotes and
            invoices alike, so nothing changes between them. The <Link href="/calculators/tax-calculator">Tax Calculator</Link>{" "}
            adds or removes tax at common rates. For numbering, see{" "}
            <Link href="/guides/how-to-number-invoices">how to number invoices</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-number-invoices",
    topic: "Work & documents",
    title: "How to number invoices: formats that keep accountants happy",
    seoTitle: "How to Number Invoices (With Format Examples)",
    description:
      "Invoice numbers must be unique and usually sequential. Good formats, whether to restart each year, what to do with cancelled invoices, and mistakes to avoid.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["invoice-generator", "sort-lines"],
    Body: function Body() {
      return (
        <>
          <p>
            Invoice numbers look like an administrative detail until a client pays &ldquo;invoice 12&rdquo; and you
            have two of them, or a tax inspector asks why numbers 40 to 45 are missing. A simple, consistent scheme
            avoids both problems.
          </p>

          <h2>The rules</h2>
          <ul>
            <li>
              <strong>Unique:</strong> no two invoices ever share a number.
            </li>
            <li>
              <strong>Sequential:</strong> numbers go up without gaps. In the EU, the VAT rules require invoices to
              carry a sequential number that uniquely identifies them; the UK requires a unique identifying number on
              VAT invoices; and many other tax systems expect the same.
            </li>
            <li>
              <strong>Never reused or deleted:</strong> a mistaken invoice is cancelled with a credit note, not
              renumbered.
            </li>
          </ul>

          <h2>Formats that work</h2>
          <table>
            <thead>
              <tr>
                <th>Format</th>
                <th>Example</th>
                <th>Good for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Simple sequence</td>
                <td>0001, 0002</td>
                <td>Very small businesses</td>
              </tr>
              <tr>
                <td>Prefix and sequence</td>
                <td>INV-0042</td>
                <td>Clear in emails and bank references</td>
              </tr>
              <tr>
                <td>Year and sequence</td>
                <td>2026-0042</td>
                <td>Yearly bookkeeping</td>
              </tr>
              <tr>
                <td>Series by type</td>
                <td>INV-2026-0042, CN-2026-0003</td>
                <td>Invoices and credit notes</td>
              </tr>
            </tbody>
          </table>
          <p>
            Pad numbers with leading zeros, such as 0042 rather than 42, so they sort correctly in file lists and
            spreadsheets. Choose enough digits for several years of growth.
          </p>

          <h2>Should you restart each year?</h2>
          <p>
            You can, as long as the year is part of the number, so 2026-0001 and 2027-0001 are still unique. Without
            the year, never restart. A continuous sequence is simplest if you are unsure.
          </p>

          <h2>Starting at 1 looks small?</h2>
          <p>
            Some new businesses start at 1001 or similar so that the first client does not receive invoice 1. That is
            fine as long as you continue sequentially from there. Starting high is a presentation choice; skipping
            numbers later is what causes questions.
          </p>

          <h2>Client-specific numbers</h2>
          <p>
            Some freelancers put a client code in the number, such as ACME-007. If you do, keep a separate overall
            sequence too, or make sure your bookkeeping can show every invoice in order. Several parallel series can
            satisfy the rules, but each series must be sequential and unique on its own.
          </p>

          <h2>Keeping track</h2>
          <ol>
            <li>Keep a simple log: number, date, client, amount, paid date.</li>
            <li>
              Fill in the next number in the <Link href="/generators/invoice-generator">Invoice Generator</Link>, which
              also uses it in the PDF&apos;s title.
            </li>
            <li>
              Name each PDF with the number first, such as <code>INV-2026-0042-acme.pdf</code>, so files sort in
              order. <Link href="/text/sort-lines">Sort Lines</Link> with natural order sorts a pasted list of numbers
              correctly.
            </li>
          </ol>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Using the date alone as the number, which fails when you send two invoices in one day.</li>
            <li>Editing a sent invoice and re-sending it with the same number but a different amount.</li>
            <li>Deleting a cancelled invoice instead of crediting it.</li>
            <li>Mixing quotes and invoices in one series; quotes need their own numbering.</li>
          </ul>
          <p>
            For the difference between invoices, quotes and receipts, see{" "}
            <Link href="/guides/invoice-vs-receipt-vs-quote">invoice vs receipt vs quote</Link>. For naming files so
            they sort, see <Link href="/guides/name-files-so-they-sort-correctly">naming files so they sort correctly</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "invoice-a-client-in-another-currency",
    topic: "Work & documents",
    title: "How to invoice a client in another currency",
    seoTitle: "How to Invoice a Client in Another Currency",
    description:
      "Which currency to bill in, how to show it so nobody is confused, who pays bank and conversion fees, and what to record for tax when you invoice clients abroad.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["invoice-generator", "currency-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            Working with clients abroad raises questions a local invoice never does. Bill in your currency or theirs?
            What exchange rate? Who pays the fees when the money crosses borders? Settling these up front avoids
            short payments and awkward emails.
          </p>

          <h2>Choose the currency</h2>
          <ul>
            <li>
              <strong>Your currency:</strong> you know exactly what you will receive; the client takes the exchange
              risk. Simple for you, slightly less attractive for them.
            </li>
            <li>
              <strong>Their currency:</strong> easier for the client to approve and pay, which can mean faster
              payment. You take the risk that the rate moves before payment.
            </li>
            <li>
              <strong>A major third currency</strong> such as US dollars or euros, common in international
              contracting, especially when neither side&apos;s currency is widely traded.
            </li>
          </ul>
          <p>Agree the currency in the contract or quote, not on the invoice for the first time.</p>

          <h2>Show it unambiguously</h2>
          <p>
            The $ sign is used by the US, Canada, Australia, Singapore and many others. Use the three-letter currency
            code next to the total: &ldquo;Total due: USD 2,400.00&rdquo;. The{" "}
            <Link href="/generators/invoice-generator">Invoice Generator</Link> lets you choose the currency for the
            whole invoice, so every line and the total are formatted consistently.
          </p>

          <h2>Fees: who pays what</h2>
          <p>
            International bank transfers can carry fees from the sending bank, intermediary banks and the receiving
            bank, plus a margin on the exchange rate. Without an agreement, you may receive less than the invoice.
          </p>
          <ul>
            <li>
              Write the expectation on the invoice: &ldquo;Please ensure all bank charges are paid by the sender so
              that the full amount is received.&rdquo;
            </li>
            <li>
              For SWIFT transfers, the &ldquo;OUR&rdquo; charge option means the sender pays all fees;
              &ldquo;SHA&rdquo; splits them; &ldquo;BEN&rdquo; puts them all on you.
            </li>
            <li>
              Multi-currency business accounts and payment services often cost less than traditional transfers.
              Compare total cost, including the rate margin, not just the fee.
            </li>
          </ul>

          <h2>The exchange rate</h2>
          <p>
            For a quote in their currency, convert your price with a current rate, then add a buffer for movement
            and fees. The <Link href="/converters/currency-converter">Currency Converter</Link> uses daily reference
            rates, which are a fair mid-market benchmark; banks pay out at a less favourable rate. The guide to{" "}
            <Link href="/guides/currency-conversion-and-fees">currency conversion and hidden fees</Link> explains the
            difference.
          </p>

          <h2>Payment details for abroad</h2>
          <ul>
            <li>Your account name exactly as the bank holds it.</li>
            <li>IBAN, or account number and the relevant national code, and the bank&apos;s SWIFT/BIC code.</li>
            <li>The bank&apos;s name and address.</li>
            <li>Ask the client to quote the invoice number as the payment reference.</li>
          </ul>

          <h2>Tax and records</h2>
          <p>
            Your own tax records usually need amounts in your home currency, converted at an accepted rate, typically
            the rate on the invoice date or the date paid, depending on local rules. If you charge VAT or GST, the
            rules for foreign clients differ: services to businesses abroad are often outside your country&apos;s
            VAT, with a note on the invoice. In the UK, for example, a VAT invoice issued in another currency must
            also show the VAT amount in sterling. Check with an accountant for your situation.
          </p>

          <h2>When payment arrives short</h2>
          <p>
            Record what you actually received and the fee that was deducted. If the shortfall broke your terms, raise
            it politely with the next invoice. Small, consistent shortfalls are a sign to agree the fee arrangement
            more clearly or change payment method.
          </p>
        </>
      );
    },
  },

  {
    slug: "resume-vs-cv",
    topic: "Work & documents",
    title: "Resume vs CV: what is the difference?",
    seoTitle: "Resume vs CV: The Difference by Country",
    description:
      "In the US a CV is a long academic record; in the UK it is a two-page job application. What each term means by country, how long each should be, and which to send.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["resume-generator", "resume-ats-checker", "word-counter"],
    Body: function Body() {
      return (
        <>
          <p>
            A job advert asks for a CV. Another asks for a resume. Are they different documents? It depends on
            where you are applying. The words mean different things in different countries, and sending the wrong
            kind can cost you an interview.
          </p>

          <h2>By country</h2>
          <table>
            <thead>
              <tr>
                <th>Where</th>
                <th>Term</th>
                <th>Length</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>US, Canada</td>
                <td>Resume</td>
                <td>1–2 pages</td>
              </tr>
              <tr>
                <td>US, Canada (academic)</td>
                <td>CV</td>
                <td>As long as needed</td>
              </tr>
              <tr>
                <td>UK, Ireland, New Zealand</td>
                <td>CV</td>
                <td>2 pages</td>
              </tr>
              <tr>
                <td>Australia, India</td>
                <td>Either</td>
                <td>1–2 pages (more for senior roles)</td>
              </tr>
              <tr>
                <td>Much of Europe</td>
                <td>CV</td>
                <td>1–2 pages</td>
              </tr>
            </tbody>
          </table>

          <h2>The resume (and the UK-style CV)</h2>
          <p>
            A short, targeted summary of your experience for a particular job. It selects what is relevant and leaves
            the rest out. Typical sections: contact details, a short profile, experience with achievements,
            education and skills. A North American resume and a British CV are essentially the same document, with
            small differences in style and length.
          </p>

          <h2>The academic CV</h2>
          <p>
            In US and Canadian academia, medicine and research, curriculum vitae means a complete record: every
            degree, publication, presentation, grant, award, teaching role and professional membership. It grows
            throughout a career and can run to many pages. Selectivity is not the goal; completeness is.
          </p>

          <h2>Which to send</h2>
          <ul>
            <li>Follow the employer&apos;s word and their country&apos;s convention.</li>
            <li>
              A US company asking for a CV for a non-academic job usually means a resume. A UK company asking for a CV
              means a two-page one.
            </li>
            <li>For academic, research and medical posts anywhere, assume the full academic CV unless told otherwise.</li>
            <li>If the advert gives a page limit, that overrides everything else.</li>
          </ul>

          <h2>Turning an academic CV into a resume</h2>
          <ol>
            <li>Start from the job advert and list the four or five things it asks for most.</li>
            <li>Keep only the roles, projects and publications that show those things.</li>
            <li>Replace lists of papers with one line, such as &ldquo;12 peer-reviewed papers on battery chemistry&rdquo;.</li>
            <li>Describe research as outcomes an employer values: budgets managed, teams led, results delivered.</li>
            <li>Cut to two pages at most, then read it as a stranger would.</li>
          </ol>

          <h2>Personal details</h2>
          <p>
            Conventions differ here too. US and UK applications usually leave out photos, date of birth and marital
            status, partly because of anti-discrimination rules. In some other countries, a photo and date of birth
            are still common. When in doubt, leave them out; nothing is lost.
          </p>

          <h2>Build one</h2>
          <p>
            The <Link href="/generators/resume-generator">Resume Generator</Link> makes a clean one-page document
            suitable as a resume or a UK-style CV, laid out so that applicant tracking systems can read it. Check it
            against a specific job advert with the <Link href="/text/resume-ats-checker">Resume ATS Checker</Link>. For
            keeping it to a page, see <Link href="/guides/one-page-resume">how to write a one-page resume</Link>.
          </p>

          <h2>Biodata</h2>
          <p>
            In parts of South Asia, &ldquo;biodata&rdquo; was traditionally used for a document with personal details,
            education and experience. For most professional jobs today, a modern resume or CV is expected instead.
          </p>
        </>
      );
    },
  },

  {
    slug: "resume-with-no-experience",
    topic: "Work & documents",
    title: "How to write a resume with no work experience",
    seoTitle: "How to Write a Resume With No Work Experience",
    description:
      "Students, graduates and career changers can fill a page without job history. What to include instead, how to describe it, and a layout that works for a first resume.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["resume-generator", "resume-ats-checker"],
    Body: function Body() {
      return (
        <>
          <p>
            Everyone&apos;s first resume has the same problem: the experience section is empty. Employers hiring for
            entry-level roles know that. They are looking for evidence that you can learn, show up and get things
            done, and that evidence can come from many places other than paid jobs.
          </p>

          <h2>What to include instead</h2>
          <ul>
            <li>
              <strong>Education</strong>, placed first: degree or qualification, institution, dates, and relevant
              results, modules or a final project.
            </li>
            <li>
              <strong>Projects:</strong> coursework, personal projects, things you built, organised or wrote. Give
              each a line on what you did and what came of it.
            </li>
            <li>
              <strong>Internships and work experience placements</strong>, however short.
            </li>
            <li>
              <strong>Volunteering:</strong> events, charity shops, tutoring, community groups.
            </li>
            <li>
              <strong>Part-time and casual work:</strong> retail, hospitality, delivery and babysitting all show
              reliability and dealing with people.
            </li>
            <li>
              <strong>Responsibilities:</strong> club treasurer, team captain, class representative, organising a
              fundraiser.
            </li>
            <li>
              <strong>Skills</strong> with evidence: languages, software, certifications, driving licence.
            </li>
          </ul>

          <h2>Describe it like experience</h2>
          <p>
            Use the same format as a job entry: what you did, using action verbs, with a result where possible.
          </p>
          <ul>
            <li>Weak: &ldquo;Member of the debating society.&rdquo;</li>
            <li>
              Better: &ldquo;Organised four inter-college debates, booking venues and coordinating 40 participants.&rdquo;
            </li>
            <li>Weak: &ldquo;Worked at a café.&rdquo;</li>
            <li>
              Better: &ldquo;Served up to 150 customers a shift; trained two new staff on the till and opening
              routine.&rdquo;
            </li>
          </ul>

          <h2>A layout for a first resume</h2>
          <ol>
            <li>Name and contact details.</li>
            <li>
              A short profile: two lines on what you are studying or have studied, and what role you are looking for.
            </li>
            <li>Education.</li>
            <li>Projects or relevant experience.</li>
            <li>Other experience (part-time work, volunteering).</li>
            <li>Skills.</li>
          </ol>
          <p>
            One page is plenty. The <Link href="/generators/resume-generator">Resume Generator</Link> has fields for a
            headline, profile summary, experience, education and skills, and exports a clean PDF; put projects and
            volunteering in the experience section with clear labels.
          </p>

          <h2>Tailor it to each job</h2>
          <p>
            Read the job advert and make sure the words it uses for skills appear in your resume where they are true.
            Paste the advert and your resume into the <Link href="/text/resume-ats-checker">Resume ATS Checker</Link>{" "}
            to see which key terms are missing. See{" "}
            <Link href="/guides/find-keywords-in-a-job-description">finding keywords in a job description</Link> for
            how to choose them.
          </p>

          <h2>Things to leave out</h2>
          <ul>
            <li>Secondary school grades, once you have a degree, unless asked.</li>
            <li>Hobbies with no link to the job, unless they show something real, such as competitive sport.</li>
            <li>&ldquo;References available on request&rdquo;, which is assumed.</li>
            <li>Exaggeration. Interviewers ask about everything on the page.</li>
          </ul>

          <h2>Career changers</h2>
          <p>
            If you have work experience but not in the new field, lead with a profile that names the move, then
            emphasise transferable skills and any training or projects in the new area. Your previous jobs still
            belong on the page; describe them in terms the new field values.
          </p>
          <p>
            For keeping it readable by applicant tracking systems, see{" "}
            <Link href="/guides/how-to-make-your-resume-ats-friendly">how to make your resume ATS-friendly</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "find-keywords-in-a-job-description",
    topic: "Work & documents",
    title: "How to find the keywords in a job description",
    seoTitle: "How to Find Keywords in a Job Description",
    description:
      "Which words in a job advert matter for applicant tracking systems and recruiters, how to pick them out, and how to use them honestly in your resume and cover letter.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["resume-ats-checker", "word-counter"],
    Body: function Body() {
      return (
        <>
          <p>
            Recruiters skim, and applicant tracking systems search. Both look for the words from the job advert: the
            skills, tools and qualifications the employer actually asked for. A strong resume that describes the same
            skills in different words can still be overlooked. Finding the right keywords takes ten minutes per
            application and makes a measurable difference.
          </p>

          <h2>What counts as a keyword</h2>
          <ul>
            <li>
              <strong>Hard skills:</strong> &ldquo;financial modelling&rdquo;, &ldquo;customer onboarding&rdquo;,
              &ldquo;patient assessment&rdquo;.
            </li>
            <li>
              <strong>Tools and technologies:</strong> named software, platforms, programming languages, equipment.
            </li>
            <li>
              <strong>Qualifications:</strong> degrees, licences and certifications by name.
            </li>
            <li>
              <strong>The job title itself</strong>, and close variants.
            </li>
            <li>
              <strong>Industry terms:</strong> the vocabulary of the field, such as &ldquo;procurement&rdquo; or
              &ldquo;compliance&rdquo;.
            </li>
          </ul>
          <p>
            Soft skills like &ldquo;team player&rdquo; appear in almost every advert and carry little weight on their
            own. Show them through examples instead.
          </p>

          <h2>Find them step by step</h2>
          <ol>
            <li>Copy the full job advert, including requirements and responsibilities.</li>
            <li>
              Paste it into the <Link href="/text/word-counter">Word Counter</Link> and look at the most used words.
              Repeated terms are usually what the employer cares about.
            </li>
            <li>
              Highlight anything under &ldquo;requirements&rdquo; or &ldquo;essential&rdquo;; those are the must-haves.
            </li>
            <li>
              Paste the advert and your resume into the <Link href="/text/resume-ats-checker">Resume ATS Checker</Link>.
              It shows an overall match and lists key terms from the advert that your resume does not contain.
            </li>
          </ol>

          <h2>A quick example</h2>
          <p>
            Suppose an advert for a marketing coordinator says: &ldquo;You will plan email campaigns in HubSpot,
            report on results in Google Analytics, and coordinate with designers. Experience with SEO and a
            bachelor&apos;s degree in marketing or similar required.&rdquo; The keywords to look for in your resume are
            email campaigns, HubSpot, Google Analytics, reporting, SEO, marketing degree and coordinator. &ldquo;Plan&rdquo;
            and &ldquo;coordinate with designers&rdquo; matter less as words, but are worth showing through an example.
          </p>

          <h2>Use them honestly</h2>
          <ul>
            <li>
              Add a keyword only where it is true. If you have used the skill, say so in the advert&apos;s words.
            </li>
            <li>
              Put keywords in context: &ldquo;Built monthly financial models in Excel for a 2 million budget&rdquo;
              beats a bare list.
            </li>
            <li>Mirror exact spellings and phrasing: if they write &ldquo;CRM&rdquo;, write CRM.</li>
            <li>Include both the acronym and the full form once: &ldquo;search engine optimisation (SEO)&rdquo;.</li>
            <li>Use the important ones in your profile summary, where readers look first.</li>
          </ul>

          <h2>What not to do</h2>
          <ul>
            <li>
              <strong>Keyword stuffing:</strong> repeating terms or listing every word from the advert reads badly to
              the human who opens the file.
            </li>
            <li>
              <strong>Hidden text:</strong> pasting the advert in white text is detected by many systems and
              recruiters and can get an application rejected.
            </li>
            <li>
              <strong>Claiming skills you do not have:</strong> interviews test them.
            </li>
          </ul>

          <h2>Missing a requirement?</h2>
          <p>
            If you lack one or two must-haves, apply anyway if you meet most of the rest, and address the gap in your
            cover letter with related experience or a plan to learn. If you lack most of them, the role is probably a
            stretch too far for now.
          </p>

          <h2>Cover letters too</h2>
          <p>
            Use two or three of the most important keywords naturally in your cover letter as well. See{" "}
            <Link href="/guides/how-long-should-a-cover-letter-be">how long a cover letter should be</Link>, and{" "}
            <Link href="/guides/how-to-make-your-resume-ats-friendly">how to make your resume ATS-friendly</Link> for
            formatting that systems can read.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-long-should-a-cover-letter-be",
    topic: "Work & documents",
    title: "How long should a cover letter be?",
    seoTitle: "How Long Should a Cover Letter Be? Words, Pages",
    description:
      "Most cover letters work best at 250 to 400 words, under one page. What to put in each paragraph, when shorter or longer is right, and how to cut one down.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["word-counter", "character-counter"],
    Body: function Body() {
      return (
        <>
          <p>
            Recruiters read many cover letters in a day, often for less than a minute each. A letter that makes its
            case in three or four short paragraphs gets read; a two-page essay gets skimmed. Length is one of the
            easiest things to get right.
          </p>

          <h2>The short answer</h2>
          <ul>
            <li>
              <strong>250 to 400 words</strong> for most jobs.
            </li>
            <li>
              <strong>Under one page</strong> with normal margins and a readable font.
            </li>
            <li>
              <strong>Three or four paragraphs</strong>, each a few sentences long.
            </li>
          </ul>
          <p>
            Paste your draft into the <Link href="/text/word-counter">Word Counter</Link>, set 400 as the target, and
            check the reading time too: a good letter reads in under two minutes.
          </p>

          <h2>What goes in each paragraph</h2>
          <ol>
            <li>
              <strong>Opening:</strong> the role you are applying for and one sentence on why you are a strong fit.
              Skip &ldquo;I am writing to apply for…&rdquo; as a whole sentence; get to the point.
            </li>
            <li>
              <strong>Evidence:</strong> one or two specific achievements that match the job&apos;s main requirements,
              with numbers where possible.
            </li>
            <li>
              <strong>Why them:</strong> something specific about the organisation, its work or its customers that
              makes you want this job rather than any job.
            </li>
            <li>
              <strong>Close:</strong> a short, confident line about discussing it further, and thanks.
            </li>
          </ol>

          <h2>Openings that work</h2>
          <ul>
            <li>
              &ldquo;I have spent four years running customer support for a 30,000-user software product, and your
              Support Lead role is the next step I have been working towards.&rdquo;
            </li>
            <li>
              &ldquo;Your advert asks for someone who can rebuild a reporting process from scratch; I did exactly that
              at Northfield last year, cutting the monthly close from ten days to four.&rdquo;
            </li>
          </ul>
          <p>Both name the role and give a reason to read on in the first two lines.</p>

          <h2>When shorter is better</h2>
          <ul>
            <li>
              <strong>Online forms</strong> with a cover letter box often have a character limit. Use the{" "}
              <Link href="/text/character-counter">Character Counter</Link>, which counts spaces too.
            </li>
            <li>
              <strong>Email applications</strong> where the email itself is the cover letter: 150 to 200 words, with
              the resume attached.
            </li>
            <li>
              <strong>Internal moves</strong>, where people already know you.
            </li>
          </ul>

          <h2>When longer is acceptable</h2>
          <p>
            Academic posts, some senior and public-sector roles, and applications that ask you to address each
            selection criterion can need more, sometimes a page and a half or a separate statement. Follow the
            instructions; if they ask you to address criteria one by one, use headings for each.
          </p>

          <h2>Cutting a long letter</h2>
          <ul>
            <li>Remove anything that repeats your resume without adding context.</li>
            <li>Keep the two strongest examples and drop the rest.</li>
            <li>Cut openers like &ldquo;I believe that&rdquo; and &ldquo;I feel I would be&rdquo;.</li>
            <li>Replace general claims (&ldquo;excellent communicator&rdquo;) with one concrete example.</li>
            <li>Shorten long sentences; most can lose a third of their words.</li>
          </ul>

          <h2>Format</h2>
          <ul>
            <li>Same font and header style as your resume, so they look like a set.</li>
            <li>Address a named person if you can find one; &ldquo;Dear Hiring Manager&rdquo; otherwise.</li>
            <li>Save as PDF unless asked for another format, and name it clearly: <code>alex-morgan-cover-letter.pdf</code>.</li>
          </ul>
          <p>
            Use the advert&apos;s key terms naturally; see{" "}
            <Link href="/guides/find-keywords-in-a-job-description">finding keywords in a job description</Link>. For
            the resume itself, see <Link href="/guides/one-page-resume">how to write a one-page resume</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "name-files-so-they-sort-correctly",
    topic: "Work & documents",
    title: "How to name files so they sort in the right order",
    seoTitle: "How to Name Files So They Sort in the Right Order",
    description:
      "Dates as YYYY-MM-DD, numbers with leading zeros and no final_FINAL_v2. A file naming scheme that sorts correctly on every computer and makes files easy to find.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["sort-lines", "case-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            A folder where &ldquo;report 10&rdquo; sorts before &ldquo;report 2&rdquo;, where March comes before
            January, and where three files are called &ldquo;final&rdquo; costs a few seconds every time you open
            it. A handful of naming habits fixes this for good, and they work on Windows, macOS, phones and cloud
            storage alike.
          </p>

          <h2>Rule 1: dates as year-month-day</h2>
          <p>
            Write dates as <code>2026-10-03</code>, the ISO 8601 format. Because the biggest unit comes first, an
            alphabetical sort is also a date sort. <code>03-10-2026</code> and <code>10-03-2026</code> sort by day or
            month first, scattering a year&apos;s files, and they mean different dates in different countries.
          </p>

          <h2>Rule 2: pad numbers with zeros</h2>
          <p>
            Computers often sort names character by character, so &ldquo;10&rdquo; comes before &ldquo;2&rdquo;
            because 1 is less than 2. Pad numbers to the same width: <code>01</code>, <code>02</code> …{" "}
            <code>10</code>, or <code>001</code> for hundreds. Some file managers use natural sorting and cope
            without padding, but many tools, uploads and archives do not.
          </p>

          <h2>Rule 3: most important part first</h2>
          <p>Decide what you will search and sort by, and put it at the front:</p>
          <ul>
            <li>
              By date: <code>2026-10-03-board-minutes.pdf</code>
            </li>
            <li>
              By client: <code>acme-2026-10-03-proposal.pdf</code>
            </li>
            <li>
              By sequence: <code>03-chapter-three.docx</code>
            </li>
          </ul>

          <h2>Rule 4: safe characters only</h2>
          <ul>
            <li>Use letters, numbers, hyphens and underscores.</li>
            <li>
              Avoid spaces in files you will share online or use in scripts; web addresses turn them into %20.
            </li>
            <li>
              Never use <code>/ \ : * ? &quot; &lt; &gt; |</code>, which Windows does not allow in file names.
            </li>
            <li>
              Pick one case and stick to it. All lowercase with hyphens, known as kebab-case, is the easiest to read
              and type. The <Link href="/text/case-converter">Case Converter</Link> turns a title into kebab-case.
            </li>
          </ul>

          <h2>Rule 5: versions with numbers, not words</h2>
          <p>
            &ldquo;final&rdquo;, &ldquo;final2&rdquo; and &ldquo;FINAL-really&rdquo; tell nobody which is newest.
            Use <code>v01</code>, <code>v02</code>, <code>v03</code>, and keep the date if versions span days. When a
            document is truly finished, keep the version number and record it as approved elsewhere, or move it to
            an &ldquo;issued&rdquo; folder.
          </p>

          <h2>Check a list of names</h2>
          <p>
            To see how a set of names will sort, paste them one per line into{" "}
            <Link href="/text/sort-lines">Sort Lines</Link>. Sort A–Z to see the plain alphabetical order that many
            systems use, then turn on natural order for numbers to see the order a person would expect. If the two
            differ, add zero padding. The guide to{" "}
            <Link href="/guides/how-to-sort-a-list-naturally">sorting a list naturally</Link> explains the
            difference.
          </p>

          <h2>Renaming files you already have</h2>
          <p>
            You do not have to rename a folder of hundreds by hand. In Windows File Explorer, select several files
            and press F2; type one name and Windows numbers the rest in brackets. In the macOS Finder, select files,
            right-click and choose Rename, which can add a sequence number or replace text in every name at once.
            For anything more complex, a dedicated bulk-rename utility is worth installing.
          </p>

          <h2>A team convention</h2>
          <p>
            Write the scheme down in one short paragraph and share it, with two or three examples. A convention that
            everyone follows is worth more than a perfect one that nobody remembers. A good default:{" "}
            <code>YYYY-MM-DD-topic-v01.ext</code>.
          </p>
        </>
      );
    },
  },

  {
    slug: "vcard-qr-code-for-business-cards",
    topic: "Work & documents",
    title: "How to put a QR code on your business card",
    seoTitle: "How to Put a vCard QR Code on a Business Card",
    description:
      "A vCard QR code lets people save your details to their phone in one scan. What to include, how big to print it, and why a smaller code scans more reliably.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["qr-code-wifi-vcard", "qr-code-generator"],
    Body: function Body() {
      return (
        <>
          <p>
            Most business cards end up in a drawer, and the details never reach the recipient&apos;s phone. A QR code
            containing a vCard, the standard contact-card format, fixes that: the person scans it, their phone offers
            to add a new contact, and your name, number and email are saved without any typing.
          </p>

          <h2>vCard or a link?</h2>
          <ul>
            <li>
              <strong>vCard QR code:</strong> the contact details are inside the code itself. It works offline, needs
              no website and never expires. But you cannot change the details after printing.
            </li>
            <li>
              <strong>Link QR code:</strong> points to a web page, such as your profile or website. Easy to update,
              but it depends on the page staying online, and saving the contact takes extra steps.
            </li>
          </ul>
          <p>
            For a business card, a vCard is usually the better choice: saving the contact is exactly what you want
            people to do.
          </p>

          <h2>Make the code step by step</h2>
          <ol>
            <li>
              Open the <Link href="/generators/qr-code-wifi-vcard">Wi-Fi and vCard QR Code Generator</Link> and choose
              Contact.
            </li>
            <li>
              Fill in the fields you want: first and last name, organisation, job title, mobile, work phone, email,
              website and address.
            </li>
            <li>Keep the code colour dark and the background light.</li>
            <li>Download it and scan it with an iPhone and an Android phone to check the contact preview.</li>
          </ol>
          <p>The details are encoded in your browser; they are not stored on any server.</p>

          <h2>Fewer fields, better scanning</h2>
          <p>
            Every field adds data, and more data means a denser code with smaller squares. On a business card, where
            the code may be only 2 cm wide, a dense code becomes hard to scan. Include what people actually need:
            name, company, title, one phone number, email and website. Leave the full street address out unless
            visitors really come to you.
          </p>

          <h2>Size and placement</h2>
          <ul>
            <li>
              Print the code at least 2 cm (about 0.8 inch) wide, larger if it contains many fields. See{" "}
              <Link href="/guides/qr-code-minimum-print-size">QR code print sizes</Link>.
            </li>
            <li>Keep a clear margin around it; do not let card text or borders touch the code.</li>
            <li>The back of the card is a good place, with a short label such as &ldquo;Scan to save my details&rdquo;.</li>
            <li>Avoid glossy or textured finishes over the code, which can cause reflections.</li>
          </ul>

          <h2>Check the details</h2>
          <p>
            Scan the final proof, open the contact preview and check every field. Phone numbers should include the
            country code, such as +44 or +1, so they work for contacts abroad. An email typo printed on 500 cards is
            an expensive mistake.
          </p>

          <h2>Other uses</h2>
          <ul>
            <li>Conference badges and name tags.</li>
            <li>Email signatures, as an image beside your text details.</li>
            <li>Shop counters, so customers can save the business number.</li>
          </ul>
          <p>
            To link to a profile instead, use the <Link href="/generators/qr-code-generator">QR Code Generator</Link>{" "}
            with a link. For Wi-Fi cards for an office or venue, see{" "}
            <Link href="/guides/how-to-make-a-wifi-qr-code">how to make a Wi-Fi QR code</Link>.
          </p>
        </>
      );
    },
  },
];
