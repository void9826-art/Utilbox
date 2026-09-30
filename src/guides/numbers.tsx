import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-09-27";
const UPDATED = "2026-09-30";

export const numberGuides: Guide[] = [
  {
    slug: "test-score-to-percentage-and-grade",
    topic: "Calculations",
    title: "How to turn a test score into a percentage and a letter grade",
    seoTitle: "Test Score to Percentage and Letter Grade",
    description:
      "Convert any score such as 61/80 into a percentage and a letter grade, see common scores out of 80, and work out what you need on the final.",
    published: PUBLISHED,
    updated: UPDATED,
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
          <p>
            It works backwards as well. To find the marks that make a given percentage, multiply the
            total by the percentage and divide by 100: 70% of 80 marks is 80 × 70 ÷ 100 = 56 marks.
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

          <h2>What each mark is worth on other totals</h2>
          <p>
            The smaller the total, the more each mark matters. This table shows the value of one
            mark, and the marks needed to reach 70%, 80% and 90%:
          </p>
          <table>
            <thead>
              <tr>
                <th>Out of</th>
                <th>One mark</th>
                <th>70%</th>
                <th>80%</th>
                <th>90%</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>20</td>
                <td>5%</td>
                <td>14</td>
                <td>16</td>
                <td>18</td>
              </tr>
              <tr>
                <td>25</td>
                <td>4%</td>
                <td>17.5</td>
                <td>20</td>
                <td>22.5</td>
              </tr>
              <tr>
                <td>40</td>
                <td>2.5%</td>
                <td>28</td>
                <td>32</td>
                <td>36</td>
              </tr>
              <tr>
                <td>50</td>
                <td>2%</td>
                <td>35</td>
                <td>40</td>
                <td>45</td>
              </tr>
              <tr>
                <td>60</td>
                <td>1.67%</td>
                <td>42</td>
                <td>48</td>
                <td>54</td>
              </tr>
              <tr>
                <td>80</td>
                <td>1.25%</td>
                <td>56</td>
                <td>64</td>
                <td>72</td>
              </tr>
              <tr>
                <td>120</td>
                <td>0.83%</td>
                <td>84</td>
                <td>96</td>
                <td>108</td>
              </tr>
            </tbody>
          </table>
          <p>
            Where the table shows a half mark, such as 17.5 out of 25, you need the next whole mark
            up — 18 — unless your test awards half marks.
          </p>

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
          <p>
            To show how far the same number can travel: 76.25% is a C on the US scale above, but at
            a UK university, where 70% and over is a First, 60–69 an upper second, 50–59 a lower
            second and 40–49 a Third, the same percentage is first-class work. Neither is wrong.
            The tests are marked to different standards, and the bands are set to match.
          </p>

          <h2>Rounding, and the grade boundary problem</h2>
          <p>
            Whether 89.5% counts as an A is a policy, not a piece of arithmetic. Some teachers round
            to the nearest whole number, some round only the final course grade, and some never
            round at all, so that 89.99% is a B. If you are close to a boundary, read the syllabus
            or ask — and do the calculation with unrounded figures, because rounding each test first
            and then averaging can shift the answer by a point.
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

          <h2>Weights or total points? Check which your course uses</h2>
          <p>
            Some courses do not use weights at all. They add up every mark you earned and divide by
            every mark available. The two methods give different answers from the same scores. Take
            42/50, 61/80 and 70/100:
          </p>
          <ul>
            <li>
              <strong>Total points:</strong> 42 + 61 + 70 = 173 marks out of 230, which is 75.2%.
            </li>
            <li>
              <strong>Weighted 20/30/50:</strong> 74.7%, as worked out above.
            </li>
          </ul>
          <p>
            Half a percentage point is enough to cross a boundary, so check the syllabus to see which
            method applies before you rely on either figure.
          </p>

          <h2>What do I need on the final?</h2>
          <p>
            Carrying on with the weighted example: before the final, coursework has banked 16.8
            points and the midterm 22.875, a total of 39.675 out of the 50 available so far. The
            final is worth the other 50%. The score needed on it is:
          </p>
          <p>
            <strong>(target − points banked) ÷ weight of the final</strong>
          </p>
          <ul>
            <li>For 70% overall: (70 − 39.675) ÷ 0.5 = 60.65% on the final.</li>
            <li>For 80% overall: (80 − 39.675) ÷ 0.5 = 80.65% on the final.</li>
            <li>
              For 90% overall: (90 − 39.675) ÷ 0.5 = 100.65% — more than full marks, so an A is no
              longer possible in this course.
            </li>
          </ul>
          <p>
            That last line is the useful one. Knowing a target is out of reach tells you where not to
            spend your revision time.
          </p>

          <h2>Percentage is not percentile</h2>
          <p>
            A percentage is how much of the test you got right. A percentile is how you did compared
            with everyone else: the 90th percentile means you scored higher than 90% of the people
            who took it. A hard exam can leave you with 61% and the 95th percentile at the same
            time. Standardised tests usually report percentiles; classroom tests usually report
            percentages.
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
    updated: UPDATED,
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
          <p>Three rows from the same loan show how far it moves:</p>
          <ul>
            <li>
              <strong>Month 1:</strong> 3,750 interest, 6,629 off the loan.
            </li>
            <li>
              <strong>Month 30:</strong> about 2,146 interest, 8,233 off the loan.
            </li>
            <li>
              <strong>Month 60:</strong> about 77 interest, 10,302 off the loan.
            </li>
          </ul>
          <p>
            After the first twelve payments you have paid about 124,550, but the balance has only
            fallen by about 82,915, to roughly 417,085. The other 41,635 was interest. This is why a
            loan feels as though it barely moves in its first year.
          </p>

          <h2>What a longer tenure really costs</h2>
          <p>Stretching the same 500,000 loan at 9% over more years lowers the payment but raises the total:</p>
          <table>
            <thead>
              <tr>
                <th>Tenure</th>
                <th>EMI</th>
                <th>Total interest</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>3 years</td>
                <td>about 15,900</td>
                <td>about 72,400</td>
              </tr>
              <tr>
                <td>5 years</td>
                <td>10,379.18</td>
                <td>about 122,750</td>
              </tr>
              <tr>
                <td>7 years</td>
                <td>about 8,045</td>
                <td>about 175,700</td>
              </tr>
              <tr>
                <td>10 years</td>
                <td>about 6,334</td>
                <td>about 260,000</td>
              </tr>
              <tr>
                <td>20 years</td>
                <td>about 4,499</td>
                <td>about 580,000</td>
              </tr>
            </tbody>
          </table>
          <p>
            The 20-year loan costs more in interest than the amount borrowed. A lower EMI is easier
            month to month, but you pay for that comfort.
          </p>

          <h2>What one percentage point costs</h2>
          <p>The rate matters as much as the tenure. The same 500,000 over five years:</p>
          <ul>
            <li>at 8%: about 10,138 a month, about 108,300 in interest;</li>
            <li>at 9%: 10,379.18 a month, about 122,750 in interest;</li>
            <li>at 10%: about 10,624 a month, about 137,400 in interest.</li>
          </ul>
          <p>
            Each point adds roughly 240 to the monthly payment and about 14,500 to the total over
            five years. On a twenty-year loan the same one-point difference is far larger, because
            the money is borrowed for four times as long — which is why it is worth comparing
            lenders carefully on long loans.
          </p>

          <h2>Paying extra: what prepayment does</h2>
          <p>
            Any payment beyond the EMI goes entirely to the loan, because the interest for that
            month has already been covered. That reduces every later month&apos;s interest. Two
            examples on the same loan, worked out with a simple month-by-month model:
          </p>
          <ul>
            <li>
              <strong>An extra 1,000 every month</strong> clears the loan in 54 months instead of 60
              and saves about 13,900 in interest.
            </li>
            <li>
              <strong>A single extra payment of 50,000 at the end of the first year</strong>, with
              the EMI left unchanged, also clears it in 54 months and saves about 20,000.
            </li>
          </ul>
          <p>
            The one-off payment saves more because it arrives early, when the balance and the
            interest are highest. After a prepayment, lenders usually let you choose between a
            shorter tenure and a lower EMI; keeping the EMI and shortening the tenure saves the most
            interest. Check the loan agreement first, because some loans charge a fee for early
            repayment.
          </p>

          <h2>Flat rate and reducing balance are not the same</h2>
          <p>
            Everything above assumes a reducing-balance loan, where interest is charged only on what
            you still owe. Some loans are quoted at a flat rate instead: interest is charged on the
            full original amount for the whole term, however much you have repaid.
          </p>
          <p>
            At a flat 9%, the same loan costs 500,000 × 9% × 5 = 225,000 in interest, making the
            instalment 725,000 ÷ 60 = 12,083.33 a month. That is the payment a reducing-balance loan
            would charge at about 15.7%. A flat rate always sounds cheaper than it is, so when you
            compare offers, ask which method the rate uses — or compare the total amount repaid,
            which cannot be disguised.
          </p>

          <h2>Fixed and floating rates</h2>
          <p>
            On a fixed-rate loan the EMI is set at the start and stays there. On a floating-rate loan
            the rate moves with the market. When it rises, the lender either raises the EMI or, more
            often, keeps the EMI and lengthens the tenure — which can quietly add years to a long
            loan. If your rate changes, recalculate with the new rate and the outstanding balance to
            see what it has done to the end date.
          </p>

          <h2>Why your bank&apos;s figure may differ</h2>
          <p>
            Lenders add processing fees and insurance, and use their own rounding and day-count
            rules, so treat a calculator as a close estimate rather than a quote. This is a general
            illustration, not financial advice — always check the figures with the lender before you
            commit.
          </p>

          <h2>Related calculators</h2>
          <p>
            If you repay weekly or fortnightly rather than monthly, the{" "}
            <Link href="/calculators/loan-calculator">Loan Calculator</Link> compares payment
            frequencies. For a home loan, the{" "}
            <Link href="/calculators/mortgage-calculator">Mortgage Calculator</Link> adds property
            tax and insurance to the monthly figure. And to see the same compounding working in your
            favour, the{" "}
            <Link href="/calculators/compound-interest-calculator">Compound Interest Calculator</Link>{" "}
            projects how savings grow with regular contributions.
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
    updated: UPDATED,
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

          <h2>Letter grades as grade points</h2>
          <p>A common version of the 4.0 scale, with plus and minus grades, looks like this:</p>
          <table>
            <thead>
              <tr>
                <th>Grade</th>
                <th>Points</th>
                <th>Grade</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A</td>
                <td>4.0</td>
                <td>C+</td>
                <td>2.3</td>
              </tr>
              <tr>
                <td>A−</td>
                <td>3.7</td>
                <td>C</td>
                <td>2.0</td>
              </tr>
              <tr>
                <td>B+</td>
                <td>3.3</td>
                <td>C−</td>
                <td>1.7</td>
              </tr>
              <tr>
                <td>B</td>
                <td>3.0</td>
                <td>D</td>
                <td>1.0</td>
              </tr>
              <tr>
                <td>B−</td>
                <td>2.7</td>
                <td>F</td>
                <td>0.0</td>
              </tr>
            </tbody>
          </table>
          <p>
            Institutions vary in the details — some have no plus or minus grades, some give an A+
            extra points — so use the table printed on your own transcript or in your handbook.
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
          <p>The example above makes this concrete. Suppose you could improve one grade:</p>
          <ul>
            <li>
              Raising <strong>Art</strong> (2 credits) from A− to A adds 0.6 points: 45.9 ÷ 13 ={" "}
              <strong>3.53</strong>.
            </li>
            <li>
              Raising <strong>Maths</strong> (4 credits) from B to A adds 4.0 points: 49.3 ÷ 13 ={" "}
              <strong>3.79</strong>.
            </li>
          </ul>
          <p>
            The Maths grade moves the GPA more than six times as far, partly because it has twice the credits
            and partly because there is more room to improve. When time is short, the course with
            the most credits and the lowest current grade is where an hour of work pays best.
          </p>

          <h2>Which scale?</h2>
          <p>
            Use the one your institution publishes. The common scale tops out at 4.0; a 4.3 scale adds
            an A+ worth 4.3; a 5.0 scale is used where honours or AP courses carry extra weight. If
            your transcript lists grade points, you can enter those directly.
          </p>
          <p>
            Schools that use the 5.0 approach often report two figures. The <strong>unweighted</strong>{" "}
            GPA treats every course the same, so an A is always 4.0. The <strong>weighted</strong>{" "}
            GPA adds a bonus for harder courses — commonly half a point for honours and a full point
            for AP or IB — so an A in one of those counts as 4.5 or 5.0. When an application asks
            for your GPA, check which one it wants; if it does not say, give the figure on your
            transcript and state the scale.
          </p>

          <h2>Pass/fail courses</h2>
          <p>
            At most institutions they earn credit but no grade points, so they are left out of both
            the points and the credits. Mark them as excluded in the calculator and they will not
            drag your average in either direction.
          </p>

          <h2>Failed, repeated and withdrawn courses</h2>
          <ul>
            <li>
              <strong>A failed course</strong> usually counts in full: zero grade points, but its
              credits stay in the total you divide by. That is why one F does far more damage than
              one C.
            </li>
            <li>
              <strong>A repeated course</strong> is handled differently from place to place. Some
              institutions replace the old grade with the new one; others keep both in the average.
              The difference can be large, so find out before deciding to retake.
            </li>
            <li>
              <strong>A withdrawal</strong> normally appears on the transcript without affecting the
              GPA, provided it happens before the deadline. After the deadline it may be recorded as
              a fail.
            </li>
          </ul>

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
            A worked example: a first semester with a GPA of 3.48 over 13 credits, and a second with
            3.80 over 17 credits.
          </p>
          <p>
            <strong>(3.48 × 13 + 3.80 × 17) ÷ 30 = 109.84 ÷ 30 = a CGPA of 3.66</strong>
          </p>
          <p>
            Simply averaging the two GPAs would give 3.64. The true figure is higher because the
            better semester carried more credits.
          </p>

          <h2>What do I need next semester?</h2>
          <p>
            The same sum runs backwards. Suppose you want a CGPA of 3.70 after a third semester of 15
            credits. You will then have 45 credits, so you need 3.70 × 45 = 166.5 points in total.
            You already have 109.84, so the third semester must supply 56.66 points over 15 credits:
          </p>
          <p>
            <strong>56.66 ÷ 15 = a semester GPA of 3.78</strong>
          </p>
          <p>
            Notice how the target gets harder to move as credits pile up. With 30 credits behind you,
            one semester can still shift the CGPA noticeably; with 100 behind you, even a perfect
            semester moves it only slightly. Early semesters set the baseline, which is the strongest
            argument for taking the first year seriously.
          </p>

          <h2>Comparing across systems</h2>
          <p>
            There is no universal conversion between a 4.0 GPA, a 10-point CGPA and a percentage.
            Each institution defines its own, and formulas found online are approximations. If you
            are applying abroad, send the transcript exactly as issued and let the receiving
            institution or a credential evaluation service convert it — a self-converted figure can
            look like an error even when the arithmetic is right.
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
    updated: UPDATED,
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
          <p>
            The imperial version worked through: someone 5 ft 9 in tall is 69 inches, and 69 × 69 =
            4,761. At 160 lb, 703 × 160 = 112,480, and 112,480 ÷ 4,761 = <strong>23.6</strong>. If
            your measurements are in a mixture of units, convert them first with the{" "}
            <Link href="/converters/weight-converter">Weight Converter</Link> or the{" "}
            <Link href="/converters/length-converter">Length Converter</Link>.
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
            The obese range is further divided into class I (30 to 34.9), class II (35 to 39.9) and
            class III (40 and above). The categories are the same for men and women.
          </p>
          <p>
            Working backwards gives a healthy weight range for a height. At 1.75 m that is roughly
            56.7–76.3 kg — the weights that put BMI between 18.5 and 24.9. The table shows the weight
            at each end of that range for a few heights.
          </p>
          <table>
            <thead>
              <tr>
                <th>Height</th>
                <th>BMI 18.5</th>
                <th>BMI 24.9</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1.60 m</td>
                <td>47.4 kg</td>
                <td>63.7 kg</td>
              </tr>
              <tr>
                <td>1.70 m</td>
                <td>53.5 kg</td>
                <td>72.0 kg</td>
              </tr>
              <tr>
                <td>1.75 m</td>
                <td>56.7 kg</td>
                <td>76.3 kg</td>
              </tr>
              <tr>
                <td>1.80 m</td>
                <td>59.9 kg</td>
                <td>80.7 kg</td>
              </tr>
            </tbody>
          </table>
          <p>
            Notice how wide each range is — about 16 to 21 kg. BMI does not name an ideal weight; it
            describes a broad band.
          </p>

          <h2>Where the number came from</h2>
          <p>
            The formula was devised in the 1830s by the Belgian statistician Adolphe Quetelet, who
            was studying the proportions of populations, not the health of patients. The name
            &ldquo;body mass index&rdquo; came much later, from a 1972 paper by the physiologist
            Ancel Keys, who recommended it as a convenient measure for studies of large groups. That
            history explains both its strength and its weakness: it was built to describe
            populations cheaply, and it still does that well.
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
          <p>
            The ethnicity point has a practical consequence. Research reviewed by a WHO expert group
            found that health risks rise at lower BMI values in many Asian populations, and it
            suggested 23 and 27.5 as additional points at which to take action. Several countries
            use lower thresholds in their own guidance for that reason.
          </p>
          <p>
            Height is a quieter problem. Because the formula squares height, it tends to read a
            little high for tall people and a little low for short people of the same build. At
            average heights the effect is small; at the extremes it is one more reason not to
            over-read a single number.
          </p>

          <h2>Other useful measures</h2>
          <p>
            Waist circumference and waist-to-height ratio say more about where fat is carried, which
            is why clinicians often use them alongside BMI. A tape measure and a doctor&apos;s
            appointment tell you more than any calculator.
          </p>
          <ul>
            <li>
              <strong>Waist-to-height ratio.</strong> A widely used rule of thumb is to keep your
              waist measurement below half your height. It needs no chart and applies to both sexes.
            </li>
            <li>
              <strong>Waist circumference.</strong> WHO guidance associates increased risk with a
              waist above 94 cm for men and 80 cm for women, and substantially increased risk above
              102 cm and 88 cm. As with BMI, the thresholds were drawn mainly from European
              populations.
            </li>
          </ul>
          <p>
            To measure your waist, stand up, breathe out normally, and pass the tape around your
            middle midway between the bottom of your ribs and the top of your hip bones — usually
            just above the navel, not where your trousers sit.
          </p>

          <h2>Getting a reliable reading</h2>
          <p>
            Small measuring errors move the result more than you might expect, because height is
            squared. Measure height without shoes, standing against a wall, and do not rely on a
            figure from years ago. Weigh yourself at the same time of day, ideally in the morning,
            since body weight varies by a kilogram or more over a day. If you are tracking change,
            the trend over several weeks means far more than any single reading.
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
    updated: UPDATED,
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
          <table>
            <thead>
              <tr>
                <th>On the box</th>
                <th>In binary units</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>64 GB</td>
                <td>59.60 GiB</td>
              </tr>
              <tr>
                <td>128 GB</td>
                <td>119.21 GiB</td>
              </tr>
              <tr>
                <td>256 GB</td>
                <td>238.42 GiB</td>
              </tr>
              <tr>
                <td>500 GB</td>
                <td>465.66 GiB</td>
              </tr>
              <tr>
                <td>1 TB</td>
                <td>931.32 GiB</td>
              </tr>
              <tr>
                <td>2 TB</td>
                <td>1.82 TiB</td>
              </tr>
              <tr>
                <td>4 TB</td>
                <td>3.64 TiB</td>
              </tr>
            </tbody>
          </table>
          <p>
            The right-hand column is what Windows reports, except that it labels the figures GB and
            TB and shows fewer digits. A kilobyte and a kibibyte differ by 2.4%, a megabyte and a mebibyte by
            4.9%, a gigabyte and a gibibyte by 7.4%, and a terabyte and a tebibyte by nearly 10%. On
            a new phone or laptop the operating system and pre-installed apps take a further share,
            so the free space you see is lower still.
          </p>

          <h2>Why are there two systems at all?</h2>
          <p>
            Computers work in powers of two, and 2¹⁰ happens to be 1,024 — close enough to 1,000
            that early engineers borrowed the prefix &ldquo;kilo&rdquo; for it. When memory was
            measured in kilobytes, the 2.4% difference did not matter. As sizes grew, the gap grew
            with them. In 1998 the International Electrotechnical Commission introduced the separate
            names kibibyte, mebibyte and gibibyte so that kilo, mega and giga could go back to
            meaning exactly a thousand, a million and a billion. The new names are correct, but they
            never fully caught on in everyday use, which is why both meanings are still in
            circulation.
          </p>

          <h2>Which system shows which</h2>
          <ul>
            <li>
              <strong>Windows</strong> measures in binary units and labels them GB and TB. This is
              where the 931 figure comes from.
            </li>
            <li>
              <strong>macOS</strong> has used decimal units since 2009, so a 1 TB drive is shown as
              about 1 TB.
            </li>
            <li>
              <strong>Drive, phone and memory-card packaging</strong> uses decimal units.
            </li>
            <li>
              <strong>RAM</strong> is the exception among hardware: memory is sold in binary units,
              so 16 GB of RAM really is 16 GiB.
            </li>
            <li>
              <strong>Linux tools</strong> vary, and many let you choose. Where you see KiB, MiB or
              GiB written out, the figure is binary.
            </li>
          </ul>
          <p>
            So the same drive can honestly be described as 1 TB on a Mac and 931 GB on a Windows PC
            sitting beside it.
          </p>

          <h2>Where the rest of the space goes</h2>
          <p>
            The unit difference explains most of the gap, but not always all of it. A little space is
            used by the file system itself, which keeps the index of where every file lives.
            Computers and external drives may also ship with a hidden recovery partition or bundled
            software. And every file occupies whole blocks on the drive, so thousands of tiny files
            take up more room than their sizes add up to — which is why Windows shows both
            &ldquo;size&rdquo; and &ldquo;size on disk&rdquo; in a file&apos;s properties.
          </p>

          <h2>The ladder: MB, GB, TB, PB</h2>
          <p>
            In decimal units each step is 1,000 times the one before: 1 GB = 1,000 MB, 1 TB = 1,000
            GB, 1 PB = 1,000 TB. In binary units each step is 1,024: 1 GiB = 1,024 MiB, 1 TiB = 1,024
            GiB. To turn bytes into megabytes, divide by 1,000,000 (MB) or by 1,048,576 (MiB).
          </p>

          <h2>What a terabyte actually holds</h2>
          <p>
            Rough figures help when choosing a drive. At about 4 MB each, 1 TB holds around 250,000
            phone photos. At about 4 GB each, it holds around 250 feature films in high definition.
            Video recorded on a recent phone at its highest resolution can use a few hundred
            megabytes a minute, which is what actually fills phones and drives. Work out your own number from the
            sizes of the files you really keep — and leave headroom, because drives slow down and
            become awkward to manage when they are nearly full.
          </p>

          <h2>Mbps is not MB/s</h2>
          <p>
            Internet speeds are quoted in megabits per second (Mbps); download progress is usually
            shown in megabytes per second (MB/s). A byte is eight bits, so a 100 Mbps connection
            downloads at most 12.5 MB/s — before any overhead.
          </p>
          <p>
            The capital letter is the clue: a lower-case b means bits, a capital B means bytes. To
            estimate a download, convert the speed to megabytes per second and divide. A 50 GB game
            is 50,000 MB; at 12.5 MB/s that is 4,000 seconds, or about 67 minutes on a 100 Mbps line
            running at full speed.
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
