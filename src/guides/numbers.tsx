import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-09-27";

export const numberGuides: Guide[] = [
  {
    slug: "test-score-to-percentage-and-grade",
    topic: "Calculations",
    title: "How to turn a test score into a percentage and a letter grade",
    seoTitle: "Test Score to Percentage and Letter Grade",
    description:
      "Convert any score such as 61/80 into a percentage and a letter grade, see common scores out of 80, and work out what you need on the final.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["grade-calculator", "percentage-calculator", "gpa-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            You got 61 out of 80. Is that good? The raw score does not say much until it is a
            percentage — and the percentage does not say much until you know your grading scale.
          </p>

          <h2>Score to percentage: one division</h2>
          <p>Divide the marks you scored by the marks available, then multiply by 100:</p>
          <p>
            <strong>61 ÷ 80 = 0.7625, × 100 = 76.25%</strong>
          </p>
          <p>
            The same method works for any score: 42 out of 50 is 84%, 17 out of 20 is 85%. The{" "}
            <Link href="/calculators/grade-calculator">Grade Calculator</Link> does it as you type and
            gives the letter grade too.
          </p>

          <h2>Common scores out of 80</h2>
          <ul>
            <li>40/80 = 50%</li>
            <li>48/80 = 60%</li>
            <li>56/80 = 70%</li>
            <li>60/80 = 75%</li>
            <li>61/80 = 76.25%</li>
            <li>64/80 = 80%</li>
            <li>72/80 = 90%</li>
          </ul>
          <p>Each mark out of 80 is worth 1.25 percentage points.</p>

          <h2>Percentage to letter grade</h2>
          <p>
            On the common US scale, 90% and above is an A, 80–89 a B, 70–79 a C, 60–69 a D and below
            60 an F — so 76.25% is a C. On the plus/minus scale it is also a C, since C+ starts at
            77%.
          </p>
          <p>
            Boundaries are set by each school, college and exam board, and they differ widely. Some
            curve grades; UK degree classes use completely different bands. Treat the percentage as
            the reliable figure and look up your own institution&apos;s table for the letter.
          </p>

          <h2>More than one test? Use weights</h2>
          <p>
            When assessments count for different amounts, a simple average is wrong. Multiply each
            percentage by its weight and add them up. With coursework at 84% worth 20%, a midterm at
            76.25% worth 30% and a final at 70% worth 50%:
          </p>
          <p>
            <strong>16.8 + 22.9 + 35.0 = 74.7% overall</strong>
          </p>
          <p>
            Enter each assessment in the Grade Calculator with its weight and it does this for you. Its
            final exam planner works backwards too: tell it the grade you are aiming for and it tells
            you the score you need on the remaining exam — or says plainly if the target is out of
            reach.
          </p>

          <h2>Related calculations</h2>
          <p>
            For other percentage questions — a percentage of a number, or a percentage change — use
            the <Link href="/calculators/percentage-calculator">Percentage Calculator</Link>. To turn
            letter grades across several courses into a grade point average, see{" "}
            <Link href="/guides/how-to-calculate-gpa">how to calculate your GPA</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-emi-is-calculated",
    topic: "Calculations",
    title: "How EMI is calculated — with a worked example",
    seoTitle: "How EMI Is Calculated — Worked Example",
    description:
      "The EMI formula explained in plain words, a worked loan example, why early payments are mostly interest, and what a longer tenure really costs.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["emi-calculator", "loan-calculator", "mortgage-calculator", "compound-interest-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            An EMI — equated monthly instalment — is the fixed amount you pay every month on a loan
            until it is cleared. It is the same every month, but what it pays for changes completely
            over the life of the loan.
          </p>

          <h2>The formula</h2>
          <p>
            <strong>EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)</strong>
          </p>
          <ul>
            <li>
              <strong>P</strong> is the amount borrowed;
            </li>
            <li>
              <strong>r</strong> is the monthly interest rate — the annual rate ÷ 12 ÷ 100;
            </li>
            <li>
              <strong>n</strong> is the number of monthly payments.
            </li>
          </ul>
          <p>
            The formula finds the one payment that, repeated n times, covers each month&apos;s
            interest and leaves the balance at exactly zero at the end.
          </p>

          <h2>A worked example</h2>
          <p>Borrowing 500,000 for 5 years at 9% a year:</p>
          <ol>
            <li>Monthly rate r = 9 ÷ 12 ÷ 100 = 0.0075.</li>
            <li>Number of payments n = 5 × 12 = 60.</li>
            <li>EMI = 500,000 × 0.0075 × 1.0075⁶⁰ ÷ (1.0075⁶⁰ − 1) = 10,379.18 a month.</li>
          </ol>
          <p>
            Over 60 payments you repay 622,750.59 in total, of which 122,750.59 is interest. The{" "}
            <Link href="/calculators/emi-calculator">EMI Calculator</Link> shows these figures and a
            full month-by-month schedule.
          </p>

          <h2>Why early payments are mostly interest</h2>
          <p>
            Interest is charged on what you still owe, and at the start you owe everything. In the
            first month of the example the interest is 500,000 × 0.0075 = 3,750, so only 6,629.18 of
            the 10,379.18 payment reduces the loan. Each month the balance is a little lower, the
            interest a little smaller, and more of the payment goes to the loan itself. The schedule
            shows that shift row by row.
          </p>

          <h2>What a longer tenure really costs</h2>
          <p>Stretching the same 500,000 loan at 9% over more years lowers the payment but raises the total:</p>
          <ul>
            <li>5 years: 10,379.18 a month, about 122,750 in interest;</li>
            <li>10 years: about 6,334 a month, about 260,000 in interest;</li>
            <li>20 years: about 4,499 a month, about 580,000 in interest.</li>
          </ul>
          <p>
            The 20-year loan costs more in interest than the amount borrowed. A lower EMI is easier
            month to month, but you pay for that comfort.
          </p>

          <h2>Why your bank&apos;s figure may differ</h2>
          <p>
            Lenders add processing fees and insurance, and use their own rounding and day-count
            rules, so treat a calculator as a close estimate rather than a quote. This is a general
            illustration, not financial advice — always check the figures with the lender before you
            commit.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-calculate-gpa",
    topic: "Calculations",
    title: "How to calculate your GPA (and CGPA)",
    seoTitle: "How to Calculate GPA and CGPA Step by Step",
    description:
      "Work out a credit-weighted GPA step by step, see why big courses count more, handle pass/fail courses, and combine semesters into a CGPA.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["gpa-calculator", "cgpa-calculator", "grade-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            A grade point average is not a simple average of your grades. It is weighted by credits,
            which is why one course can move it far more than another.
          </p>

          <h2>The method</h2>
          <ol>
            <li>Turn each letter grade into grade points using your scale (on a 4.0 scale, A = 4.0, B = 3.0).</li>
            <li>Multiply each course&apos;s grade points by its credits.</li>
            <li>Add up those results.</li>
            <li>Divide by the total number of credits.</li>
          </ol>
          <p>
            <strong>GPA = Σ (grade points × credits) ÷ Σ credits</strong>
          </p>

          <h2>A worked example</h2>
          <p>Four courses in one semester, on a 4.0 scale:</p>
          <ul>
            <li>Biology — 4 credits, A (4.0) → 16.0 points</li>
            <li>History — 3 credits, B+ (3.3) → 9.9 points</li>
            <li>Maths — 4 credits, B (3.0) → 12.0 points</li>
            <li>Art — 2 credits, A− (3.7) → 7.4 points</li>
          </ul>
          <p>
            That is 45.3 points over 13 credits: <strong>45.3 ÷ 13 = a GPA of 3.48</strong>. The{" "}
            <Link href="/calculators/gpa-calculator">GPA Calculator</Link> does this as you add
            courses.
          </p>

          <h2>Why one course can hurt so much</h2>
          <p>
            Credits are weights. A poor grade in a five-credit course carries more than twice the
            influence of the same grade in a two-credit course — so when you are planning where to
            put your effort, the big courses matter most.
          </p>

          <h2>Which scale?</h2>
          <p>
            Use the one your institution publishes. The common scale tops out at 4.0; a 4.3 scale adds
            an A+ worth 4.3; a 5.0 scale is used where honours or AP courses carry extra weight. If
            your transcript lists grade points, you can enter those directly.
          </p>

          <h2>Pass/fail courses</h2>
          <p>
            At most institutions they earn credit but no grade points, so they are left out of both
            the points and the credits. Mark them as excluded in the calculator and they will not
            drag your average in either direction.
          </p>

          <h2>From GPA to CGPA</h2>
          <p>
            Your cumulative GPA (CGPA) combines every semester so far. It is not the average of your
            semester GPAs: each semester is weighted by the credits it carried, so a heavy semester
            counts for more than a light one. The{" "}
            <Link href="/calculators/cgpa-calculator">CGPA Calculator</Link> does the weighting and
            can also tell you what GPA next semester needs for you to reach a target. It includes a
            CGPA-to-percentage estimate using the widely published × 9.5 formula — an approximation,
            so your institution&apos;s own table always takes precedence.
          </p>
          <p>
            Working from percentages rather than letters? Start with{" "}
            <Link href="/guides/test-score-to-percentage-and-grade">
              how to turn a test score into a percentage and a letter grade
            </Link>
            .
          </p>
        </>
      );
    },
  },

  {
    slug: "what-your-bmi-means",
    topic: "Calculations",
    title: "What your BMI means — and what it cannot tell you",
    seoTitle: "What Your BMI Means — and What It Misses",
    description:
      "How BMI is calculated, what the WHO categories mean, the healthy weight range for your height, and the real limits of BMI for individuals.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["bmi-calculator", "weight-converter", "length-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            Body mass index is one number built from two measurements. It is quick and useful for
            spotting trends across large groups of people, and much blunter when applied to one
            person. Knowing both sides stops it from misleading you.
          </p>

          <h2>How BMI is calculated</h2>
          <p>
            <strong>BMI = weight (kg) ÷ height (m)²</strong>
          </p>
          <p>
            Someone 1.75 m tall weighing 72 kg: 1.75 × 1.75 = 3.0625, and 72 ÷ 3.0625 ={" "}
            <strong>23.5</strong>. In pounds and inches the equivalent is 703 × weight ÷ height², and
            the <Link href="/calculators/bmi-calculator">BMI Calculator</Link> accepts either.
          </p>

          <h2>What the categories mean</h2>
          <p>The World Health Organization&apos;s adult categories are:</p>
          <ul>
            <li>below 18.5 — underweight</li>
            <li>18.5 to 24.9 — healthy weight</li>
            <li>25 to 29.9 — overweight</li>
            <li>30 and above — obese</li>
          </ul>
          <p>
            Working backwards gives a healthy weight range for a height. At 1.75 m that is roughly
            56.7–76.3 kg — the weights that put BMI between 18.5 and 24.9.
          </p>

          <h2>What BMI cannot tell you</h2>
          <ul>
            <li>
              <strong>Muscle and fat look the same to it.</strong> BMI only knows weight, so
              muscular people often read as overweight.
            </li>
            <li>
              <strong>It ignores where fat sits.</strong> Fat around the waist matters more for
              health than fat elsewhere, and BMI cannot see the difference.
            </li>
            <li>
              <strong>It does not account for age, sex or ethnicity</strong>, all of which change
              what a healthy body composition looks like.
            </li>
            <li>
              <strong>It does not apply to children</strong> (who are assessed against growth
              charts), during pregnancy, or at very short or very tall statures.
            </li>
          </ul>

          <h2>Other useful measures</h2>
          <p>
            Waist circumference and waist-to-height ratio say more about where fat is carried, which
            is why clinicians often use them alongside BMI. A tape measure and a doctor&apos;s
            appointment tell you more than any calculator.
          </p>

          <h2>A note on using it</h2>
          <p>
            BMI is a screening measure, not a diagnosis or an assessment of your health. If your
            result worries you — in either direction — talk to a qualified healthcare professional,
            who can look at the whole picture rather than one number.
          </p>
        </>
      );
    },
  },

  {
    slug: "why-1tb-drive-shows-931gb",
    topic: "Calculations",
    title: "Why a 1 TB drive shows only 931 GB — and other storage numbers explained",
    seoTitle: "Why a 1 TB Drive Shows Only 931 GB",
    description:
      "Nobody stole your storage: drive makers and computers count in different units. Here is the maths, plus MB vs Mbps and a quick conversion list.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["data-storage-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            You buy a 1 TB drive, plug it in, and your computer says 931 GB. The missing 69 GB was
            never there to lose — the box and the computer are simply using different units under
            the same name.
          </p>

          <h2>Two ways to count bytes</h2>
          <ul>
            <li>
              <strong>Decimal units</strong> — kB, MB, GB, TB — go up in steps of 1,000. Drive and
              phone makers use these: 1 TB is 1,000,000,000,000 bytes.
            </li>
            <li>
              <strong>Binary units</strong> — KiB, MiB, GiB, TiB — go up in steps of 1,024. This is
              how computers actually measure memory and storage.
            </li>
          </ul>
          <p>
            Windows adds to the confusion by measuring in binary units but labelling them with
            decimal names. What it calls &ldquo;931 GB&rdquo; is really 931 GiB.
          </p>

          <h2>The maths</h2>
          <p>
            1,000,000,000,000 bytes ÷ 1,024 ÷ 1,024 ÷ 1,024 = <strong>931.32 GiB</strong>. Same drive,
            same number of bytes, a bigger unit.
          </p>
          <p>The gap grows with the size of the unit:</p>
          <ul>
            <li>64 GB → 59.60 GiB</li>
            <li>128 GB → 119.21 GiB</li>
            <li>500 GB → 465.66 GiB</li>
            <li>1 TB → 931.32 GiB</li>
            <li>2 TB → 1,862.65 GiB (1.82 TiB)</li>
          </ul>
          <p>
            A kilobyte and a kibibyte differ by 2.4%; a terabyte and a tebibyte by nearly 10%. On a
            new phone or laptop the operating system and pre-installed apps take a further share, so
            the free space you see is lower still.
          </p>

          <h2>The ladder: MB, GB, TB, PB</h2>
          <p>
            In decimal units each step is 1,000 times the one before: 1 GB = 1,000 MB, 1 TB = 1,000
            GB, 1 PB = 1,000 TB. In binary units each step is 1,024: 1 GiB = 1,024 MiB, 1 TiB = 1,024
            GiB. To turn bytes into megabytes, divide by 1,000,000 (MB) or by 1,048,576 (MiB).
          </p>

          <h2>Mbps is not MB/s</h2>
          <p>
            Internet speeds are quoted in megabits per second (Mbps); download progress is usually
            shown in megabytes per second (MB/s). A byte is eight bits, so a 100 Mbps connection
            downloads at most 12.5 MB/s — before any overhead.
          </p>
          <p>
            The <Link href="/converters/data-storage-converter">Data Storage Converter</Link> keeps
            decimal and binary units side by side, and includes bits, so you can check any of these
            numbers for yourself.
          </p>
        </>
      );
    },
  },
];
