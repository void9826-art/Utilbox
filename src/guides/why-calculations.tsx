import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-20";

export const whyCalculationsGuides: Guide[] = [
  {
    slug: "why-you-cant-average-percentages",
    topic: "Calculations",
    title: "Why you can’t just average percentages",
    seoTitle: "Why You Can't Just Average Percentages",
    description:
      "Averaging 90% and 60% gives 75%, but your real score may be 63%. Why percentages with different bases need a weighted average, and how to do it right.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["percentage-calculator", "grade-calculator", "gpa-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            You can only average percentages directly when each is out of the same total. Otherwise the
            percentage from the bigger total must count for more. Add up the amounts and the totals, then
            divide: 9 out of 10 and 60 out of 100 is 69 out of 110, or 62.7%, not the 75% a simple average
            gives.
          </p>

          <h2>The mistake in one example</h2>
          <p>
            You score 90% on a 10-mark quiz and 60% on a 100-mark exam. The simple average of 90 and 60 is
            75. But the quiz gave you 9 marks and the exam 60, so you earned 69 marks out of 110 available:
          </p>
          <ul>
            <li>Simple average: (90 + 60) ÷ 2 = 75%</li>
            <li>Real result: (9 + 60) ÷ (10 + 100) = 69 ÷ 110 = 62.7%</li>
          </ul>
          <p>
            The simple average treats a 10-mark quiz as if it mattered as much as a 100-mark exam. A
            percentage hides the size of the thing it came from, and averaging throws that information away.
          </p>

          <h2>When a simple average is fine</h2>
          <ul>
            <li>
              <strong>Every percentage has the same base.</strong> Four tests each out of 50: averaging the
              percentages gives exactly the same answer as pooling the marks.
            </li>
            <li>
              <strong>The rules say so.</strong> Some courses deliberately give every assessment equal weight
              regardless of marks. Then the simple average is the official answer, even if it differs from
              pooled marks. Check your course handbook.
            </li>
          </ul>

          <h2>The two correct methods</h2>
          <h3>1. Pool the raw numbers</h3>
          <p>
            Add all the parts, add all the totals, divide once. This works for marks, sales, survey responses
            — anything where you know the underlying counts.
          </p>
          <h3>2. Use a weighted average</h3>
          <p>
            When you only know the percentages and their weights, multiply each percentage by its weight, add
            the results, and divide by the total weight. If coursework is worth 40% of the grade and you
            scored 80%, and the exam is worth 60% and you scored 55%:
          </p>
          <ul>
            <li>(80 × 40 + 55 × 60) ÷ (40 + 60) = (3,200 + 3,300) ÷ 100 = 65%</li>
          </ul>
          <p>
            The <Link href="/calculators/grade-calculator">Grade Calculator</Link> does exactly this: enter
            each assessment with its weight and it returns the overall percentage, even if the weights do not
            add up to 100. For credit-weighted grade point averages, the{" "}
            <Link href="/calculators/gpa-calculator">GPA Calculator</Link> weights each course by its credits
            for the same reason.
          </p>

          <h2>The same trap outside school</h2>
          <ul>
            <li>
              <strong>Conversion or success rates.</strong> A shop converts 10% of 1,000 visitors on Monday and
              2% of 100 visitors on Tuesday. The two-day rate is 102 ÷ 1,100 = 9.3%, not the 6% average.
            </li>
            <li>
              <strong>Discounts across a basket.</strong> 50% off a 2.00 item and 10% off a 50.00 item is not
              an average 30% saving. You saved 1.00 + 5.00 = 6.00 on 52.00, which is 11.5%.
            </li>
            <li>
              <strong>Growth rates over several years.</strong> +50% then −50% does not average to 0%: 100
              becomes 150, then 75. Successive percentage changes multiply; to find the average yearly rate,
              use a compound (geometric) average instead.
            </li>
            <li>
              <strong>Averages of averages.</strong> Averaging the class averages of a class of 10 and a class
              of 40 overweights the small class. Pool the students instead.
            </li>
          </ul>

          <h2>Why the simple average feels right</h2>
          <p>
            Percentages look like they are already on the same scale — everything out of 100 — so averaging
            them seems natural. But the “out of 100” is a presentation, not a fact about the data. 90% of a
            10-mark quiz represents 9 real marks; 60% of a 100-mark exam represents 60. Once you picture the
            marks rather than the percentages, the weighting becomes obvious.
          </p>

          <h2>Quick check before you average</h2>
          <p>
            Ask: “Are all these percentages out of the same thing?” If the answer is no, find the counts or the
            weights. If you just need a single “what percent is X of Y” after pooling, the{" "}
            <Link href="/calculators/percentage-calculator">Percentage Calculator</Link> shows the working.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Averaging your module percentages when modules carry different credits.</li>
            <li>Reporting the average of monthly percentages as the yearly figure.</li>
            <li>Rounding each percentage before combining them; round only the final answer.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Same base for every percentage? A simple average is fine.</li>
            <li>Different bases? Pool the raw numbers, or weight each percentage.</li>
            <li>Changes over time? Multiply, do not average.</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "why-percentages-dont-add-up-to-100",
    topic: "Calculations",
    title: "Why percentages don’t add up to 100% — and how to fix it",
    seoTitle: "Why Percentages Don't Add Up to 100%",
    description:
      "A breakdown shows 33%, 33% and 33%, or 101% in total. Rounding, overlapping answers and different bases are why. How to present figures that add up honestly.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["percentage-calculator", "scientific-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Percentages usually fail to add to 100% because each one was rounded separately. Three equal
            shares are 33.33% each, which round to 33%, totalling 99%. Other causes are answers that overlap,
            such as “tick all that apply”, and figures taken from different totals. Rounding gaps are normal
            and can be fixed or footnoted.
          </p>

          <h2>Cause 1: rounding each figure separately</h2>
          <p>
            Each rounding can move a figure by up to half a unit. Across several categories, those small
            errors can push the total above or below 100.
          </p>
          <ul>
            <li>Three equal parts: 33.33 + 33.33 + 33.33 → 33 + 33 + 33 = 99%.</li>
            <li>
              Shares of 12.5%, 12.5%, 37.5% and 37.5% round half-up to 13 + 13 + 38 + 38 = 102%.
            </li>
          </ul>
          <p>
            Neither figure is wrong; each is the nearest whole number to the truth. The total is simply not
            the rounded value of the true total.
          </p>

          <h3>The fixes</h3>
          <ul>
            <li>
              <strong>Show a decimal place.</strong> 33.3 + 33.3 + 33.3 = 99.9% is close enough that readers
              rarely notice. More decimals shrink the gap further.
            </li>
            <li>
              <strong>Add a note</strong> such as “Figures may not total 100% because of rounding.” This is
              standard in published statistics.
            </li>
            <li>
              <strong>Use the largest remainder method</strong> when the total must be exactly 100 — for a
              pie chart label or a budget split. Round every figure down, see how many points are missing,
              then give one point each to the figures with the largest leftover decimals.
            </li>
          </ul>

          <h3>Largest remainder, worked through</h3>
          <p>Shares of 45.6%, 30.3% and 24.1%:</p>
          <ol>
            <li>Round down: 45 + 30 + 24 = 99. One point is missing.</li>
            <li>Leftovers: 0.6, 0.3 and 0.1. The largest is 0.6.</li>
            <li>Give it the point: 46 + 30 + 24 = 100.</li>
          </ol>
          <p>
            Never force the total by adjusting whichever figure is easiest, or always the last one. That
            biases one category every time.
          </p>

          <h2>Cause 2: answers that overlap</h2>
          <p>
            In a “choose all that apply” question, one person can count in several categories. If 70% use
            email and 60% use chat, the total is 130%, and that is correct: each percentage is a share of
            people, and people were allowed more than one answer. Do not rescale such figures to 100%; say
            that respondents could pick more than one option.
          </p>

          <h2>Cause 3: different totals</h2>
          <p>
            Percentages only add up when they share one base. “40% of men and 60% of women” is not 100% of
            anything. Nor is “15% of sales in Q1 and 25% in Q2” if each is a share of its own quarter. To
            combine them, go back to the counts.
          </p>

          <h2>In spreadsheets and charts</h2>
          <p>
            Spreadsheets add to the confusion because a cell formatted to show 33% still holds 33.333…. The
            column total is calculated from the hidden decimals, so it shows 100% even though the visible
            figures add to 99%. Readers who check with a calculator then think the sheet is wrong. Either
            show one more decimal place, or round each cell with a ROUND() formula and apply the largest
            remainder adjustment so the visible figures and the total agree. Chart tools behave the same way:
            pie slice labels are rounded individually, so the labels on a pie can total 99% or 101% while the
            slices themselves are exact.
          </p>

          <h2>Cause 4: something is missing</h2>
          <p>
            A total of 92% may mean a category was left out: “other”, “don’t know”, or blanks. If rounding
            cannot explain a gap of more than about half a point per category, look for a missing group or a
            wrong base. The <Link href="/calculators/percentage-calculator">Percentage Calculator</Link>{" "}
            shows each “X is what percent of Y” with the working, which makes a missing category obvious;
            the <Link href="/calculators/scientific-calculator">Scientific Calculator</Link> is handy for
            totalling the raw counts first.
          </p>

          <h2>How big a gap is normal?</h2>
          <p>
            With whole-number rounding, the total can be off by up to half a point times the number of
            categories, though in practice it is usually within one or two points. Five categories rounding to
            98% or 102% is plausible; 90% is not a rounding problem.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Rounding intermediate results, then calculating more percentages from them.</li>
            <li>Squeezing multi-answer results into a pie chart; use a bar chart instead.</li>
            <li>Quietly editing one figure so the column totals 100.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Same base for every figure?</li>
            <li>Could one person or item count twice?</li>
            <li>Gap small enough to be rounding? Add a footnote or one decimal.</li>
            <li>Must total exactly 100? Use the largest remainder method.</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "pay-rise-higher-tax-bracket",
    topic: "Calculations",
    title: "Will a pay rise put me in a higher tax bracket and cut my take-home pay?",
    seoTitle: "Can a Pay Rise Cut Your Take-Home Pay?",
    description:
      "A higher tax band only taxes the extra at the higher rate, so take-home pay still rises. How bands work, a UK example, and the real catches to watch for.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["take-home-pay-calculator", "salary-calculator", "percentage-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            No. In banded income tax systems such as the UK’s, only the part of your income above a threshold
            is taxed at the higher rate. Everything below it is taxed exactly as before, so as far as income
            tax goes, a rise always increases take-home pay. You keep less of the extra, but never end up with
            less overall.
          </p>

          <h2>How tax bands actually work</h2>
          <p>
            Picture your income filling a series of buckets. The first bucket is taxed at 0%, the next at the
            basic rate, the next at the higher rate. A rise only adds to the top bucket. Nothing already in
            the lower buckets is re-taxed. The rate on your last pound — the marginal rate — goes up; the
            average rate on all your income goes up only slightly.
          </p>

          <h2>A UK example</h2>
          <p>
            For an employee in England in 2026/27, with no pension contributions or student loan, a rise
            from £50,000 to £52,000 crosses the £50,270 point where the higher rate starts:
          </p>
          <ul>
            <li>
              The first £270 of the rise is taxed at 20% income tax plus 8% National Insurance: £75.60.
            </li>
            <li>
              The remaining £1,730 is taxed at 40% plus 2% National Insurance: £726.60.
            </li>
            <li>
              Total deductions on the rise: £802.20. You keep about <strong>£1,198 of the £2,000</strong>.
            </li>
          </ul>
          <p>
            Your take-home pay goes up, just by less than it would have done below the threshold. Check your
            own figures with the{" "}
            <Link href="/calculators/take-home-pay-calculator">Take-Home Pay Calculator</Link>, which itemises
            each deduction for the UK, Canada, Australia and India. Scotland has its own income tax bands, so
            the split differs there.
          </p>

          <h2>Where the myth comes from</h2>
          <ul>
            <li>
              <strong>High marginal rates feel like a loss.</strong> Keeping 60p of each extra pound feels
              meagre, but it is still a gain.
            </li>
            <li>
              <strong>Payslip timing.</strong> A back-dated rise, or a bonus paid in one month, can push that
              month’s PAYE deduction up sharply. It usually evens out over the tax year, and any overpayment
              can be corrected.
            </li>
            <li>
              <strong>Real cliff edges do exist — but elsewhere.</strong> Some benefits, allowances and
              support schemes stop or taper at an income threshold, and losing them can outweigh a small
              rise. These depend on your circumstances, so check the rules for anything you receive.
            </li>
          </ul>

          <h2>Steep spots worth knowing about</h2>
          <ul>
            <li>
              <strong>UK, £100,000 to £125,140:</strong> the tax-free personal allowance shrinks by £1 for
              every £2 earned above £100,000. Combined with the 40% rate, that makes an effective marginal
              rate of about 60% in this range, before National Insurance. Take-home pay still rises, but
              slowly. Pension contributions reduce the income this taper is measured on.
            </li>
            <li>
              <strong>India, new regime:</strong> a rebate means no tax is due on taxable income up to ₹12
              lakh. Just above that, marginal relief caps the tax at the amount by which income exceeds ₹12
              lakh, so earning slightly more still cannot leave you worse off.
            </li>
          </ul>

          <h2>How to judge a rise</h2>
          <ol>
            <li>
              Work out the percentage rise on gross pay with the{" "}
              <Link href="/calculators/percentage-calculator">Percentage Calculator</Link>.
            </li>
            <li>Put the old and new salaries into the take-home calculator and compare the net figures.</li>
            <li>
              If the offer is hourly or weekly, convert it to annual first with the{" "}
              <Link href="/calculators/salary-calculator">Salary Calculator</Link>.
            </li>
            <li>Check whether any benefit, childcare support or loan threshold applies to you.</li>
          </ol>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Turning down a rise or extra hours because of “the next bracket”.</li>
            <li>Applying the higher rate to your whole salary when estimating.</li>
            <li>Comparing gross offers when one includes a pension or benefit the other lacks.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Only income above each threshold pays the higher rate.</li>
            <li>Compare take-home pay before and after, not tax rates.</li>
            <li>Check benefits and allowances with income limits separately.</li>
          </ul>
          <p>
            Tax rules change each year; these figures are for illustration, and the calculator is an estimate,
            not tax advice.
          </p>
        </>
      );
    },
  },

  {
    slug: "emi-does-not-match-bank-quote",
    topic: "Calculations",
    title: "Why your EMI calculation doesn’t match the bank’s figure",
    seoTitle: "Why Your EMI Doesn't Match the Bank's Figure",
    description:
      "An online EMI result a few rupees or dollars off the lender's quote is normal. Fees, rounding, first-month interest and rate type explain most differences.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["emi-calculator", "loan-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            An EMI calculator and a bank’s quote usually differ because they are not using exactly the same
            inputs. Common reasons are fees or insurance added to the loan amount, rounding the instalment
            up, extra interest for a part-month at the start, and a different interest rate type or tenure.
            Match each input and the figures should agree closely.
          </p>

          <h2>First, check the formula is the same</h2>
          <p>
            Standard EMIs use the reducing-balance formula: EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1), where P
            is the amount borrowed, r the annual rate divided by 12, and n the number of months. The{" "}
            <Link href="/calculators/emi-calculator">EMI Calculator</Link> uses this formula and shows the full
            schedule. If the lender is quoting a <em>flat</em> rate, the instalment will be much higher than
            this formula gives; see{" "}
            <Link href="/guides/flat-vs-reducing-interest-rate">flat vs reducing interest rates</Link>.
          </p>

          <h2>The usual reasons for a gap</h2>
          <h3>1. The loan amount is not what you think</h3>
          <p>
            Processing fees, loan insurance or other charges are sometimes added to the amount you borrow
            rather than paid up front. A ₹10,00,000 loan with ₹20,000 of charges financed is a ₹10,20,000
            loan, and the EMI is about 2% higher. Ask for the exact sanctioned amount.
          </p>
          <h3>2. Rounding</h3>
          <p>
            Many lenders round the instalment up to the next whole rupee, dollar or ten. The last instalment
            is then adjusted to settle the remainder. A difference of a few units is just this.
          </p>
          <h3>3. Interest for the first part-month</h3>
          <p>
            If the loan is paid out on the 12th and EMIs fall due on the 5th, there is a gap that does not
            match a whole month. Lenders handle this differently: some charge separate interest for those
            days (sometimes called pre-EMI or broken-period interest), some add it to the first instalment,
            and some calculate interest daily. The regular EMI is unaffected, but the first payment looks
            wrong.
          </p>
          <h3>4. The rate is not the rate you entered</h3>
          <ul>
            <li>A floating rate may have been reset between the quote and the disbursement.</li>
            <li>The advertised rate may need a credit score, salary account or insurance you did not take.</li>
            <li>An APR includes fees; an EMI is calculated on the interest rate, not the APR.</li>
          </ul>
          <h3>5. The tenure is different</h3>
          <p>
            A “20-year” loan may be scheduled as 239 or 241 instalments depending on start dates, and a
            lender may cap the tenure by your age. One month either way changes the EMI slightly.
          </p>
          <h3>6. Daily interest calculation</h3>
          <p>
            Some lenders calculate interest on a daily balance with a 365-day year, so months with 31 days
            cost a little more than months with 28. The fixed EMI then pays slightly different amounts of
            principal each month, and the final instalment absorbs the difference.
          </p>

          <h2>How to reconcile the figures</h2>
          <ol>
            <li>Ask the lender for the sanctioned amount, the exact rate, the rate type and the number of instalments.</li>
            <li>Enter those into the EMI Calculator and compare the instalment.</li>
            <li>Compare the first two or three rows of the bank’s repayment schedule with the calculator’s.</li>
            <li>
              For weekly or fortnightly repayments, use the{" "}
              <Link href="/calculators/loan-calculator">Loan Calculator</Link>, which handles those
              frequencies.
            </li>
          </ol>
          <p>
            If the inputs match and the instalment still differs by more than rounding, ask the lender to
            explain the calculation in writing. You are entitled to understand what you are signing.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Entering a monthly rate where the calculator expects an annual one.</li>
            <li>Comparing an EMI calculated on the loan amount with one on the property price.</li>
            <li>Ignoring fees because “the EMI is the same” — they change the true cost.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Same amount, including any financed fees?</li>
            <li>Same annual rate, and reducing rather than flat?</li>
            <li>Same number of instalments?</li>
            <li>Gap only a few units? That is rounding.</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "monthly-interest-rate-vs-annual-rate",
    topic: "Calculations",
    title: "Why 1.5% a month is not 18% a year",
    seoTitle: "Why 1.5% a Month Is Not 18% a Year",
    description:
      "A monthly rate × 12 understates the yearly cost when interest compounds: 1.5% a month is about 19.6% a year. How to convert monthly and annual rates.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["compound-interest-calculator", "emi-calculator", "loan-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Multiplying a monthly rate by 12 gives the nominal annual rate, but if unpaid interest is added to
            the balance each month, you pay interest on interest. Then the true yearly cost is higher: 1.5% a
            month compounds to about 19.56% a year, not 18%. To convert, use (1 + monthly rate)¹² − 1.
          </p>

          <h2>Two different “annual” rates</h2>
          <ul>
            <li>
              <strong>Nominal rate:</strong> monthly rate × 12. Simple, and the convention lenders use when
              they divide an annual rate by 12 to calculate monthly interest. 1.5% × 12 = 18%.
            </li>
            <li>
              <strong>Effective rate:</strong> what a balance actually grows by over a year if interest is
              added monthly and nothing is paid off. (1.015)¹² − 1 = 19.56%.
            </li>
          </ul>
          <p>
            The gap grows with the rate. At 2% a month, nominal is 24% but effective is about 26.8%. At 0.5% a
            month, nominal 6% becomes about 6.17%.
          </p>

          <h2>Worked through month by month</h2>
          <p>Borrow 1,000 at 1.5% a month and pay nothing:</p>
          <ul>
            <li>Month 1: interest 15.00, balance 1,015.00</li>
            <li>Month 2: interest 15.23, balance 1,030.23</li>
            <li>Month 3: interest 15.45, balance 1,045.68</li>
          </ul>
          <p>
            Each month’s interest is a little larger than the last because it is charged on the previous
            interest too. After 12 months the balance is about 1,195.62 — 195.62 of interest, not 180.
          </p>

          <h2>Converting either way</h2>
          <ul>
            <li>Monthly to effective annual: (1 + m)¹² − 1. For m = 1.5%: 1.015¹² − 1 = 19.56%.</li>
            <li>
              Effective annual to monthly: (1 + a)^(1/12) − 1. For a = 12%: 1.12^(1/12) − 1 ≈ 0.949% a month,
              not 1%.
            </li>
            <li>Nominal annual to monthly: divide by 12. 12% nominal = 1% a month.</li>
          </ul>
          <p>
            The <Link href="/calculators/compound-interest-calculator">Compound Interest Calculator</Link>{" "}
            lets you pick the compounding frequency, so you can see the difference between monthly, quarterly
            and yearly compounding on the same nominal rate.
          </p>

          <h2>Where this matters</h2>
          <ul>
            <li>
              <strong>Credit cards and store finance</strong> often quote a monthly rate. A card at 3% a month
              costs about 42.6% a year if the balance is left to grow.
            </li>
            <li>
              <strong>Informal loans and moneylenders</strong> commonly quote “2 per cent a month” — about 26.8%
              a year effective, more than many people expect.
            </li>
            <li>
              <strong>Savings accounts</strong> work in your favour: interest credited monthly earns slightly
              more than the same nominal rate credited yearly. That is why some banks quote an AER or APY,
              which is the effective rate.
            </li>
          </ul>

          <h2>Daily rates</h2>
          <p>
            Some cards and overdrafts calculate interest daily. A daily rate of 0.05% sounds tiny, but × 365
            is 18.25% nominal, and compounded daily it is about 20% a year. The same conversion applies with
            365 in place of 12: (1 + daily rate)³⁶⁵ − 1. Short-term loans quoted “per week” work the same way
            with 52, and the effective annual figures can be startling. Whenever a rate is quoted over a short
            period, convert it to an effective annual rate before comparing it with anything else.
          </p>

          <h2>What about EMIs?</h2>
          <p>
            Standard loan EMIs use the nominal convention: an annual rate of 12% means 1% on the outstanding
            balance each month. Because each EMI pays that month’s interest in full, interest does not pile up
            on interest, and the 12% figure describes the cost fairly. Enter the annual rate in the{" "}
            <Link href="/calculators/emi-calculator">EMI Calculator</Link> or the{" "}
            <Link href="/calculators/loan-calculator">Loan Calculator</Link>; do not convert it to an
            effective rate first.
          </p>

          <h2>Reading the small print</h2>
          <p>
            Look for the words that tell you which rate you are seeing: “per month”, “p.m.” or “monthly” for
            a monthly rate; “p.a.” or “per annum” for yearly; “APR” for a yearly figure that, in many
            countries, must also include certain fees; “AER” or “APY” for an effective savings rate.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Typing a monthly rate into a calculator that expects an annual one, or the reverse.</li>
            <li>Comparing one lender’s monthly rate with another’s annual rate.</li>
            <li>Assuming a savings rate and a loan rate with the same number cost the same.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Is the quoted rate per month or per year?</li>
            <li>Nominal or effective (APR vs AER/APY)?</li>
            <li>Does interest compound if unpaid?</li>
            <li>Comparing like with like across offers?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "tip-before-or-after-tax",
    topic: "Calculations",
    title: "Tip before or after tax? And does the discount come first?",
    seoTitle: "Tip Before or After Tax? And Discounts First?",
    description:
      "Should you tip on the pre-tax or post-tax total, or the price before a coupon? What's customary, how big the difference is, and when the order matters.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["tip-calculator", "tax-calculator", "discount-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            There is no fixed rule. Etiquette guides commonly suggest tipping on the pre-tax amount, but
            tipping on the total including tax is also widely accepted, and the difference is small. When you
            use a coupon or voucher, tipping on the price before the discount is considered courteous, since
            the service was the same.
          </p>

          <h2>How much difference does it make?</h2>
          <p>
            With an 80.00 bill and 8% sales tax, the total is 86.40. A 20% tip is:
          </p>
          <ul>
            <li>On the pre-tax amount: 20% × 80.00 = 16.00</li>
            <li>On the total: 20% × 86.40 = 17.28</li>
          </ul>
          <p>
            The gap is the tip rate times the tax: 20% × 6.40 = 1.28. With low sales taxes it is pocket change;
            where tax is higher, it grows proportionally. Customs vary by country and by type of service, so if
            you are travelling, check what is usual where you are.
          </p>
          <p>
            The <Link href="/calculators/tip-calculator">Tip Calculator</Link> works on whichever amount you
            enter, so type the subtotal for a pre-tax tip or the total for a post-tax one, then split it
            between the group.
          </p>

          <h2>Coupons, vouchers and discounts</h2>
          <p>
            If a 25% voucher brings an 80.00 meal down to 60.00, the server still served an 80.00 meal. Many
            people tip on the original 80.00 for that reason. Tipping on 60.00 at 20% gives 12.00; on 80.00, it
            gives 16.00. Either is your choice — just be aware which one you are calculating.
          </p>

          <h2>Does the order of discount and tax matter?</h2>
          <h3>Percentage discounts: no</h3>
          <p>
            Multiplying is order-free. 25% off then 8% tax on 80.00: 80 × 0.75 × 1.08 = 64.80. Tax first then
            25% off: 80 × 1.08 × 0.75 = 64.80. Same answer.
          </p>
          <h3>Fixed-amount discounts: yes</h3>
          <p>
            Take 10.00 off before tax: (80 − 10) × 1.08 = 75.60. Take 10.00 off after tax: 80 × 1.08 − 10 =
            76.40. The second is 0.80 more, because tax was charged on the 10.00 you did not pay.
          </p>
          <p>
            In most places, sales tax or VAT is charged on the price actually paid after a shop’s own discount.
            Some jurisdictions treat certain coupons, such as manufacturer coupons, differently, so if the
            receipt surprises you, check the local rule. The{" "}
            <Link href="/calculators/discount-calculator">Discount Calculator</Link> can add a tax rate after
            the discount to show the price at the till, and the{" "}
            <Link href="/calculators/tax-calculator">Tax Calculator</Link> separates tax from a total that
            already includes it.
          </p>

          <h2>Where prices already include tax</h2>
          <p>
            In the UK, the EU, Australia and many other countries, menu prices include VAT or GST, so the bill
            shows one figure and the question of tipping before or after tax never comes up. If you want to
            tip on the pre-tax amount anyway, divide by one plus the tax rate: a 60.00 bill including 20% VAT
            is 50.00 before tax. In practice, people in those countries tip on the total shown.
          </p>

          <h2>Service charges</h2>
          <p>
            If a service charge is already on the bill, it often serves the same purpose as a tip. Read the
            bill: some restaurants add a charge only for large groups, and whether it goes to staff varies.
            Adding a full tip on top of a service charge is optional, not expected by default.
          </p>

          <h2>Splitting fairly</h2>
          <ul>
            <li>Agree first whether you are tipping on the subtotal or the total.</li>
            <li>
              Split the tip in the same proportion as the food if orders were very different; an equal split is
              simpler when they were similar.
            </li>
            <li>Rounding each share up for cash adds a little to the tip; that is usually welcome.</li>
          </ul>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Tipping on a total that already includes a service charge without noticing.</li>
            <li>Taking a fixed discount after tax when the shop applies it before.</li>
            <li>Splitting the subtotal evenly but forgetting to split the tax and tip.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Service charge already included?</li>
            <li>Tipping on subtotal, total or pre-voucher price — decided on purpose?</li>
            <li>Fixed discount applied before tax, as most shops do?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "invoice-tax-total-off-by-a-cent",
    topic: "Work & documents",
    title: "Why an invoice’s tax total is off by a cent",
    seoTitle: "Why an Invoice's Tax Total Is Off by a Cent",
    description:
      "Tax rounded on each line rarely matches tax on the total. Why one-cent gaps appear between invoices, spreadsheets and accounts, and how to pick one rule.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["invoice-generator", "tax-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            A one-cent difference in an invoice’s tax usually comes from rounding at different stages.
            Rounding the tax on each line and adding the results gives a slightly different figure from
            calculating tax once on the subtotal. Both methods are legitimate; the problem is mixing them.
            Choose one rule and use it everywhere.
          </p>

          <h2>A small example</h2>
          <p>Three items at 0.99 each, with 20% tax:</p>
          <ul>
            <li>
              <strong>Tax per line:</strong> 20% of 0.99 is 0.198, which rounds to 0.20. Three lines: 0.60.
            </li>
            <li>
              <strong>Tax on the total:</strong> the subtotal is 2.97; 20% of 2.97 is 0.594, which rounds to
              0.59.
            </li>
          </ul>
          <p>
            One cent apart, and neither calculation is wrong. Each rounding moves a figure by up to half a cent,
            and per-line rounding does that once per line. On long invoices with many cheap items, the gap can
            reach several cents.
          </p>

          <h2>Other places cents go missing</h2>
          <ul>
            <li>
              <strong>Unit prices with more than two decimals.</strong> 0.3333 × 3 is 0.9999, which an invoice
              shows as 1.00 — but if the line is rounded before multiplying, 0.33 × 3 is 0.99.
            </li>
            <li>
              <strong>Tax-inclusive prices.</strong> Removing 20% from 9.99 gives 8.325 net, which must round to
              8.33 or 8.32, leaving tax of 1.66 or 1.67. The{" "}
              <Link href="/calculators/tax-calculator">Tax Calculator</Link> shows the split from either
              direction.
            </li>
            <li>
              <strong>Discounts.</strong> A percentage discount rounded per line differs from one rounded on the
              subtotal, for the same reason as tax.
            </li>
            <li>
              <strong>Spreadsheets.</strong> A cell formatted to two decimals still holds the full value. The sum
              of displayed values can differ from the displayed sum. Wrap calculations in ROUND() if what you
              see must add up.
            </li>
            <li>
              <strong>Currency conversion.</strong> Converting each line and then totalling rarely matches
              converting the total.
            </li>
          </ul>

          <h2>Which rule should you use?</h2>
          <p>
            Many tax authorities let businesses round per line or per invoice, provided they are consistent,
            and some set specific rounding rules. The rules depend on where you are registered, so check your
            tax authority’s guidance or ask your accountant. In practice:
          </p>
          <ul>
            <li>
              <strong>Per invoice</strong> (tax on the subtotal) is simple and gives the result closest to the
              true figure.
            </li>
            <li>
              <strong>Per line</strong> suits invoices where items carry different tax rates, or where each line
              must be complete on its own.
            </li>
          </ul>
          <p>
            Whatever you choose, make the invoice show the method: list the tax on the subtotal, or show tax on
            each line and total those.
          </p>

          <h2>How this site’s invoice generator does it</h2>
          <p>
            The <Link href="/generators/invoice-generator">Invoice Generator</Link> works in whole cents to avoid
            floating-point drift. Each line is quantity × unit price, rounded to the cent. The lines are added,
            any discount is applied to that subtotal, and tax is calculated once on the discounted subtotal, so
            the totals always add up on the page. If your accounting software rounds per line, expect an
            occasional one-cent difference and record the invoice as issued.
          </p>

          <h2>Rounding half-up, half-even and truncating</h2>
          <p>
            Even “round to the nearest cent” has variants. Half-up turns 0.125 into 0.13. Half-even, or
            banker’s rounding, turns it into 0.12 and 0.135 into 0.14, rounding exact halves to the even
            digit. Some systems simply truncate. Two programs rounding the same tax “correctly” can therefore
            differ by a cent on exact halves. If your invoices and your accounts disagree only on lines ending
            in a half cent, this is why.
          </p>

          <h2>When a client’s payment is a cent short</h2>
          <ul>
            <li>Compare their figure with yours line by line; it is usually rounding, not a dispute.</li>
            <li>Many businesses write off sub-unit differences rather than chase them. Decide a policy.</li>
            <li>Record the payment against the invoice and note the difference, so the books reconcile.</li>
          </ul>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Mixing per-line and per-invoice rounding in the same invoice.</li>
            <li>Rounding unit prices before multiplying by large quantities.</li>
            <li>Editing a total by hand so it matches, which breaks the arithmetic on the page.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>One rounding rule, used in the invoice, spreadsheet and accounts?</li>
            <li>Tax shown per line or on the subtotal — clearly?</li>
            <li>Local tax rounding guidance checked?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "buy-one-get-one-free-real-discount",
    topic: "Calculations",
    title: "Buy one get one free, 3 for 2, second half price: what discount is it really?",
    seoTitle: "BOGOF, 3 for 2, Half Price: The Real Discount",
    description:
      "Buy one get one free is 50% off only if you want two. The real percentage behind 3 for 2, second item half price and buy 2 get 1 half price, and how to compare.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["discount-calculator", "percentage-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Multi-buy offers are discounts on the whole bundle, not on each item. Buy one get one free is 50%
            off two items, 3 for 2 is 33.3% off three, and second item half price is only 25% off two. Each is
            a saving only if you would have bought that many anyway; otherwise it is extra spending.
          </p>

          <h2>The real percentages</h2>
          <p>
            Divide what you save by what the items would normally cost together. With items priced at 10 each:
          </p>
          <ul>
            <li>
              <strong>Buy one get one free:</strong> pay 10 for 20 of goods. Saving 10 ÷ 20 = <strong>50%</strong>.
            </li>
            <li>
              <strong>3 for 2:</strong> pay 20 for 30. Saving 10 ÷ 30 = <strong>33.3%</strong>.
            </li>
            <li>
              <strong>Second item half price:</strong> pay 15 for 20. Saving 5 ÷ 20 = <strong>25%</strong>.
            </li>
            <li>
              <strong>Buy 2, get a third half price:</strong> pay 25 for 30. Saving 5 ÷ 30 ={" "}
              <strong>16.7%</strong>.
            </li>
            <li>
              <strong>4 for the price of 3:</strong> pay 30 for 40. Saving <strong>25%</strong>.
            </li>
          </ul>
          <p>
            The general rule: the discount is the number of free (or cut-price) items’ worth divided by the
            total number of items. “Half price” on one of two items is half of one item’s worth out of two.
          </p>

          <h2>When items have different prices</h2>
          <p>
            Most mix-and-match deals give the cheapest item free. Buy a 12.00 item and a 7.00 item on 3 for
            2, add a 5.00 item, and the 5.00 one is free: you save 5 ÷ 24 = 20.8%, not 33.3%. To get the full
            percentage, pick items with similar prices. To check a mixed basket, use the{" "}
            <Link href="/calculators/percentage-calculator">Percentage Calculator</Link>’s “X is what percent
            of Y” with your saving and the full price.
          </p>

          <h2>Comparing a multi-buy with a straight discount</h2>
          <p>
            Turn both into a price per item. If one shop sells something at 10 with buy one get one free, and
            another sells it at 6.50 with no offer, the first works out at 5 each — but only if you take two.
            If you want one, the second shop is cheaper. The{" "}
            <Link href="/calculators/discount-calculator">Discount Calculator</Link> handles straight and
            stacked percentage discounts, and its reverse mode finds an original price from a sale price.
          </p>

          <h2>Things that quietly reduce the saving</h2>
          <ul>
            <li>
              <strong>A raised “normal” price.</strong> A deal is measured against the usual price. Compare
              with the price per item, kg or litre elsewhere, not just the shelf label.
            </li>
            <li>
              <strong>Waste.</strong> Free food that goes off before you eat it saved nothing. If you use only
              one of the two items, you paid full price for it and the deal was no saving at all.
            </li>
            <li>
              <strong>Bigger pack sizes.</strong> Sometimes the multi-buy price per kg is still higher than the
              large single pack.
            </li>
            <li>
              <strong>Stacking.</strong> A multi-buy plus a percentage voucher does not add up: 3 for 2 then 10%
              off is 1 − (0.667 × 0.9) = 40% off, not 43.3%. Discounts multiply; see{" "}
              <Link href="/guides/how-to-calculate-a-discount">how stacked discounts work</Link>.
            </li>
          </ul>

          <h2>Quick mental shortcuts</h2>
          <ul>
            <li>“Buy N, get 1 free” = 1 ÷ (N + 1) off. Buy 2 get 1 free: 33%. Buy 3 get 1 free: 25%.</li>
            <li>“Buy N, get 1 half price” = 0.5 ÷ (N + 1) off. Buy 1 get 1 half price: 25%.</li>
            <li>“N for the price of M” = (N − M) ÷ N off. 5 for 4: 20%.</li>
          </ul>

          <h2>Offers worded as “free”</h2>
          <p>
            “Free gift with purchase” and “free delivery over 40” are discounts too. If you add a 9.00 item you
            did not want to reach free delivery that would have cost 4.00, you paid 5.00 more. Measure every
            offer by what you would have paid without it for the things you actually wanted.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Reading “second item half price” as 50% off.</li>
            <li>Mixing expensive and cheap items in a deal that frees the cheapest.</li>
            <li>Adding a multi-buy saving and a voucher percentage together.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Would you buy this many without the offer?</li>
            <li>Price per item (or per kg/litre) compared with other options?</li>
            <li>Items in a mix-and-match deal similarly priced?</li>
          </ul>
        </>
      );
    },
  },
];
