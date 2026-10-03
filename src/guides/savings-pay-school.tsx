import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-03";

export const savingsPaySchoolGuides: Guide[] = [
  {
    slug: "monthly-investment-growth",
    topic: "Calculations",
    title: "How much will a monthly investment grow to? (SIP returns explained)",
    seoTitle: "How Much Will a Monthly Investment (SIP) Grow To?",
    description:
      "What 5,000 a month becomes after 5, 10, 15 and 20 years at 12%, why the later years add most of the growth, and what these projections can and cannot promise.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["compound-interest-calculator", "percentage-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Investing a fixed amount every month, called a systematic investment plan or SIP in India and a
            regular savings plan or monthly contribution elsewhere, is how most people build savings. The
            question everyone asks is the same: if I put in this much each month, what will I have?
          </p>

          <h2>5,000 a month at 12% a year</h2>
          <table>
            <thead>
              <tr>
                <th>Years</th>
                <th>You put in</th>
                <th>Projected value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>5</td>
                <td>3,00,000</td>
                <td>4,12,432</td>
              </tr>
              <tr>
                <td>10</td>
                <td>6,00,000</td>
                <td>11,61,695</td>
              </tr>
              <tr>
                <td>15</td>
                <td>9,00,000</td>
                <td>25,22,880</td>
              </tr>
              <tr>
                <td>20</td>
                <td>12,00,000</td>
                <td>49,95,740</td>
              </tr>
            </tbody>
          </table>
          <p>
            These figures assume 1% growth each month (12% a year divided by 12), with each payment made at the
            start of the month, which is how most SIP calculators work. With payments at the end of each month,
            every figure is about 1% lower.
          </p>

          <h2>The later years do the heavy lifting</h2>
          <p>
            Look at the gaps. Over the first ten years, the investment grows to 11.6 lakh. Over the next ten, with
            exactly the same monthly amount, it grows by another 38 lakh. That is compounding: growth on earlier
            growth. It is also why stopping a plan for a few years in the middle costs much more than the
            payments you skipped.
          </p>

          <h2>Run your own projection</h2>
          <ol>
            <li>
              Open the <Link href="/calculators/compound-interest-calculator">Compound Interest Calculator</Link>.
            </li>
            <li>Set the starting balance to 0, or to what you already have invested.</li>
            <li>Enter your monthly amount as the regular contribution, and choose monthly.</li>
            <li>Enter the expected yearly return and the number of years.</li>
            <li>Choose monthly compounding and start-of-period timing to match a typical SIP calculator.</li>
          </ol>
          <p>
            The result shows the final balance, the total you put in, and the growth earned. Try a few different
            returns to see the range rather than relying on one number.
          </p>

          <h2>What the projection cannot tell you</h2>
          <ul>
            <li>
              <strong>Returns are not fixed.</strong> Equity funds have averaged high returns over long periods
              in many markets, but individual years swing widely, and past returns do not guarantee future ones.
              A projection at a single steady rate is a planning tool, not a promise.
            </li>
            <li>
              <strong>Inflation reduces what the money buys.</strong> 50 lakh in twenty years will buy far less
              than 50 lakh today. Subtract expected inflation from the return to see the result in today&apos;s
              money.
            </li>
            <li>
              <strong>Fees and taxes</strong> reduce the return. A fund charging 1.5% a year turns a 12% market
              return into about 10.5% for you.
            </li>
          </ul>

          <h2>Increasing the amount each year</h2>
          <p>
            Many people raise their monthly investment as their salary grows, often called a step-up SIP. Even a
            modest yearly increase makes a large difference to the final value. To estimate it, run the
            calculator in stages: five years at the first amount, then use that balance as the starting balance
            for the next five years at the higher amount.
          </p>

          <h2>Quick estimates</h2>
          <p>
            For a single lump sum, the <Link href="/guides/rule-of-72">rule of 72</Link> tells you how long money
            takes to double: at 12%, about six years. For how compounding frequency changes the result, see{" "}
            <Link href="/guides/compound-interest-explained">compound interest explained</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "fixed-deposit-interest-quarterly-compounding",
    topic: "Calculations",
    title: "How fixed deposit interest is calculated with quarterly compounding",
    seoTitle: "Fixed Deposit Interest With Quarterly Compounding",
    description:
      "Why a 7% fixed deposit pays more than 7% a year, a worked example for 1,00,000 over five years, and how payout options and tax change what you receive.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["compound-interest-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Banks quote fixed deposit rates per year, but many, including most banks in India, compound the
            interest every quarter. Interest earned in one quarter starts earning interest in the next, so the
            amount at maturity is higher than the headline rate suggests.
          </p>

          <h2>Worked example: 1,00,000 at 7% for 5 years</h2>
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Maturity</th>
                <th>Interest</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Simple interest</td>
                <td>1,35,000</td>
                <td>35,000</td>
              </tr>
              <tr>
                <td>Compounded yearly</td>
                <td>1,40,255</td>
                <td>40,255</td>
              </tr>
              <tr>
                <td>Compounded quarterly</td>
                <td>1,41,478</td>
                <td>41,478</td>
              </tr>
              <tr>
                <td>Compounded monthly</td>
                <td>1,41,763</td>
                <td>41,763</td>
              </tr>
            </tbody>
          </table>

          <h2>The formula</h2>
          <p>Maturity amount = principal × (1 + rate ÷ n)^(n × years)</p>
          <p>
            Here n is the number of compounding periods per year: 4 for quarterly. For the example: 1,00,000 ×
            (1 + 0.07 ÷ 4)^20 = 1,00,000 × 1.0175^20 = 1,41,478.
          </p>
          <p>
            The <Link href="/calculators/compound-interest-calculator">Compound Interest Calculator</Link> does
            this for you: enter the deposit as the starting balance, choose no regular contributions, set the rate
            and term, and pick quarterly compounding. It also shows the effective annual rate, which for 7%
            compounded quarterly is about 7.19%.
          </p>

          <h2>Effective annual rate</h2>
          <p>
            The effective annual rate, sometimes called the annualised yield, is the simple yearly rate that would
            give the same result. It is the fair way to compare deposits that compound differently: a 7% deposit
            compounded quarterly (7.19% effective) beats a 7.1% deposit compounded yearly (7.1% effective).
          </p>

          <h2>Cumulative versus payout deposits</h2>
          <ul>
            <li>
              <strong>Cumulative:</strong> interest is added to the deposit and paid at maturity. This is the
              option that compounds.
            </li>
            <li>
              <strong>Quarterly or monthly payout:</strong> interest is paid out to your account as it is earned.
              It does not compound inside the deposit, so the total interest is the simple-interest figure. Banks
              sometimes pay a slightly lower rate on monthly payout to reflect that you receive the money sooner.
            </li>
          </ul>
          <p>Choose payout if you need the income; choose cumulative if you do not.</p>

          <h2>Short deposits</h2>
          <p>
            Deposits of less than a few months are often paid as simple interest at maturity, because there are
            not enough quarters to compound. Check the bank&apos;s terms for the tenure you choose.
          </p>

          <h2>Tax and inflation</h2>
          <ul>
            <li>
              <strong>Tax:</strong> fixed deposit interest is usually taxable as income in the year it is earned,
              even on a cumulative deposit where you have not received it yet. Banks may deduct tax at source
              above a threshold.
            </li>
            <li>
              <strong>Inflation:</strong> a 7% deposit when prices rise 5% a year grows your buying power by only
              about 2% a year, before tax.
            </li>
          </ul>

          <h2>Senior citizen rates</h2>
          <p>
            Many banks add a small extra rate for depositors over 60, often a quarter to half a percentage point.
            On a five-year deposit that compounds quarterly, half a point adds noticeably to the maturity amount.
            If a parent is investing, check whether the deposit should be in their name to get the higher rate.
          </p>

          <h2>Breaking a deposit early</h2>
          <p>
            Premature withdrawal usually means the bank recalculates interest at the rate for the period you
            actually stayed, often minus a penalty. If you might need part of the money, splitting it into several
            smaller deposits with different maturities lets you break only one.
          </p>
          <p>
            For regular monthly deposits rather than a lump sum, see{" "}
            <Link href="/guides/monthly-investment-growth">how much a monthly investment grows to</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "overtime-pay-time-and-a-half",
    topic: "Calculations",
    title: "How to calculate overtime pay (time and a half, double time)",
    seoTitle: "How to Calculate Overtime Pay: Time and a Half",
    description:
      "Work out time-and-a-half and double-time pay from an hourly rate or a salary, with a worked weekly example, and check your payslip for the usual mistakes.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["salary-calculator", "percentage-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Overtime is usually paid at a premium: one and a half times the normal hourly rate (&ldquo;time and a
            half&rdquo;), or twice it (&ldquo;double time&rdquo;). The arithmetic is simple once you know your
            hourly rate, which salaried workers often have to work out first.
          </p>

          <h2>Worked example</h2>
          <p>
            You earn 18 an hour, work 46 hours this week, and overtime starts after 40 hours at time and a half.
          </p>
          <ul>
            <li>Regular pay: 40 × 18 = 720</li>
            <li>Overtime rate: 18 × 1.5 = 27</li>
            <li>Overtime pay: 6 × 27 = 162</li>
            <li>Total for the week: 720 + 162 = 882</li>
          </ul>
          <p>
            At double time, the overtime rate would be 36 and the overtime pay 216, for a total of 936.
          </p>

          <h2>If you are paid a salary</h2>
          <p>
            Turn the salary into an hourly rate first. Annual salary ÷ (contracted hours per week × 52) gives the
            hourly figure. The <Link href="/calculators/salary-calculator">Salary Calculator</Link> does it for you
            using your hours per week and days per week: enter the annual figure and read the hourly rate. For
            example, 39,000 a year at 37.5 hours a week is 20 an hour, so time and a half is 30.
          </p>

          <h2>Partial hours</h2>
          <p>
            Convert minutes to a decimal before multiplying: 45 minutes is 0.75 of an hour, so 2 hours 45 minutes
            of overtime is 2.75 hours. The guide to{" "}
            <Link href="/guides/minutes-to-decimal-hours">converting minutes to decimal hours</Link> has a table.
            Multiplying 2.45 instead of 2.75 is a surprisingly common payslip error.
          </p>

          <h2>What the law says varies</h2>
          <ul>
            <li>
              <strong>United States:</strong> under federal law, non-exempt employees must be paid at least time
              and a half for hours over 40 in a workweek. Some states add daily overtime rules.
            </li>
            <li>
              <strong>United Kingdom:</strong> there is no legal right to overtime pay; it depends on your
              contract. But your average pay for all hours worked must not fall below the minimum wage.
            </li>
            <li>
              <strong>India:</strong> the Factories Act requires overtime at twice the ordinary rate for covered
              workers; other employment depends on state law and contracts.
            </li>
          </ul>
          <p>
            Check your contract, staff handbook or collective agreement for the threshold and the multiplier, and
            whether weekends and public holidays have their own rates.
          </p>

          <h2>Check your payslip</h2>
          <ul>
            <li>Is the overtime threshold weekly or daily, and was it applied correctly?</li>
            <li>Were paid holidays or sick days counted towards the threshold? Contracts differ.</li>
            <li>Were partial hours converted to decimals correctly?</li>
            <li>Does the hourly rate include regular bonuses or allowances where the rules require it?</li>
          </ul>

          <h2>Is the overtime worth it?</h2>
          <p>
            Overtime is taxed as normal income, so a large overtime month can push part of your pay into a higher
            tax band for that period. Over the year it usually evens out, but the extra on a single payslip can be
            smaller than expected. To see how much extra pay changes your take-home, use the{" "}
            <Link href="/calculators/take-home-pay-calculator">Take-Home Pay Calculator</Link> with and without it.
            For what an hourly rate means over a year, see{" "}
            <Link href="/guides/hourly-to-annual-salary">converting hourly pay to annual salary</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "pro-rata-salary",
    topic: "Calculations",
    title: "Pro rata salary: how part-time and part-year pay is worked out",
    seoTitle: "Pro Rata Salary: How to Calculate Part-Time Pay",
    description:
      "A job advertised at 30,000 pro rata for 22.5 hours a week pays 18,000. How to calculate pro rata pay, holiday and part-year salaries, with worked examples.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["salary-calculator", "percentage-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            &ldquo;30,000 pro rata&rdquo; in a job advert does not mean you will earn 30,000. It means 30,000
            is the full-time salary, and you will be paid the proportion that matches the hours or time you
            actually work. Pro rata is Latin for &ldquo;in proportion&rdquo;.
          </p>

          <h2>Part-time hours</h2>
          <p>Pro rata salary = full-time salary × (your hours ÷ full-time hours)</p>
          <p>
            A job at 30,000 for a 37.5-hour week, worked for 22.5 hours: 30,000 × 22.5 ÷ 37.5 = 18,000 a year.
            Three days of a five-day week works the same way: 30,000 × 3 ÷ 5 = 18,000.
          </p>
          <p>
            Make sure you know the full-time hours the employer uses. 30,000 pro rata for 20 hours is 16,000 if
            full time is 37.5 hours, but 15,000 if full time is 40.
          </p>

          <h2>Check the hourly rate</h2>
          <p>
            Pro rata pay should give the same hourly rate as the full-time job. The{" "}
            <Link href="/calculators/salary-calculator">Salary Calculator</Link> shows it: enter 18,000 a year at
            22.5 hours a week, then 30,000 at 37.5 hours. Both come to about 15.38 an hour. If a part-time offer
            works out lower per hour than the full-time rate, ask why.
          </p>

          <h2>Starting or leaving part-way through the year</h2>
          <p>
            Pay for part of a year is pro-rated by time. Monthly-paid staff usually just receive their monthly
            salary for each full month worked, plus a part-month for the first and last month. A part-month is
            often worked out by days:
          </p>
          <p>Part-month pay = monthly salary × (days worked ÷ days in that month)</p>
          <p>
            Some employers divide by working days instead of calendar days. Both are common; your contract or
            payroll policy says which.
          </p>

          <h2>Holiday entitlement</h2>
          <p>
            Paid holiday is usually pro-rated too. In the UK, for example, the statutory minimum is 5.6 weeks a
            year. For someone working three days a week, that is 5.6 × 3 = 16.8 days. Part-year workers get the
            same proportion of the year: starting on 1 October in a January-to-December holiday year gives three
            twelfths of the annual entitlement.
          </p>

          <h2>Benefits and bonuses</h2>
          <ul>
            <li>
              <strong>Bonuses</strong> set as a percentage of salary are naturally pro-rated. Fixed-amount bonuses
              may or may not be; check.
            </li>
            <li>
              <strong>Pension contributions</strong> as a percentage of salary follow the pro rata figure.
            </li>
            <li>
              <strong>Allowances</strong> such as a phone allowance are sometimes paid in full; ask.
            </li>
          </ul>

          <h2>After tax, part-time can be worth more than it looks</h2>
          <p>
            Because tax is progressive, a lower salary is taxed at a lower average rate. A part-time salary that
            is 60% of full-time often gives more than 60% of full-time take-home pay. Compare take-home figures
            for both with the <Link href="/calculators/take-home-pay-calculator">Take-Home Pay Calculator</Link>{" "}
            before deciding whether to reduce your hours.
          </p>
          <p>
            For the proportions themselves, the <Link href="/calculators/percentage-calculator">Percentage Calculator</Link>{" "}
            turns hours into a percentage of full time. To convert the result between yearly, monthly and hourly,
            see <Link href="/guides/hourly-to-annual-salary">hourly to annual salary</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "ctc-vs-in-hand-salary",
    topic: "Calculations",
    title: "CTC vs in-hand salary: why 12 LPA is not 1 lakh a month",
    seoTitle: "CTC vs In-Hand Salary: What You Actually Receive",
    description:
      "An Indian job offer quotes cost to company, not what reaches your bank. What CTC includes, a worked example for 12 lakh, and how to estimate monthly in-hand pay.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["take-home-pay-calculator", "salary-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Indian job offers are usually stated as CTC, cost to company: everything the employer spends on you
            in a year. Divide 12 LPA by twelve and you expect 1 lakh a month. The first salary credit is
            noticeably less, and not mainly because of income tax.
          </p>

          <h2>What CTC includes</h2>
          <ul>
            <li>
              <strong>Gross salary:</strong> basic pay, house rent allowance, special allowance and other
              allowances.
            </li>
            <li>
              <strong>Employer&apos;s provident fund contribution:</strong> 12% of basic pay, paid into your PF
              account, not to you.
            </li>
            <li>
              <strong>Gratuity provision:</strong> often shown as 4.81% of basic, but only paid when you leave
              after qualifying service, usually five years.
            </li>
            <li>
              <strong>Variable pay and benefits:</strong> performance bonus, insurance premiums, meal cards.
              Variable pay depends on targets and may be paid yearly.
            </li>
          </ul>

          <h2>Worked example: 12 lakh CTC</h2>
          <p>
            Assume basic pay is 50% of CTC (6,00,000), no variable pay, the new tax regime, and professional tax
            of 2,500 a year.
          </p>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Per year</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CTC</td>
                <td>12,00,000</td>
              </tr>
              <tr>
                <td>Less employer PF (12% of basic)</td>
                <td>−72,000</td>
              </tr>
              <tr>
                <td>Less gratuity (4.81% of basic)</td>
                <td>−28,860</td>
              </tr>
              <tr>
                <td>Gross salary</td>
                <td>10,99,140</td>
              </tr>
              <tr>
                <td>Less employee PF</td>
                <td>−72,000</td>
              </tr>
              <tr>
                <td>Less professional tax</td>
                <td>−2,500</td>
              </tr>
              <tr>
                <td>Income tax (new regime)</td>
                <td>0</td>
              </tr>
              <tr>
                <td>In-hand</td>
                <td>10,24,640</td>
              </tr>
            </tbody>
          </table>
          <p>
            That is about 85,400 a month. Income tax is zero because, after the 75,000 standard deduction, taxable
            income is under 12 lakh, where the section 87A rebate cancels the tax for FY 2026–27. The gap from 1
            lakh a month is almost all provident fund and gratuity, which are still your money, just not this
            month.
          </p>

          <h2>At higher salaries</h2>
          <p>
            On the same structure, 18 lakh CTC gives a gross salary of about 16.5 lakh and taxable income of about
            15.7 lakh. Tax plus cess comes to about 1,20,700, and in-hand pay is about 14.2 lakh, or roughly
            1,18,100 a month. Once taxable income passes 12 lakh, the rebate stops applying (apart from marginal
            relief just above the line) and tax is charged through every slab.
          </p>

          <h2>Estimate your own</h2>
          <ol>
            <li>Ask HR for the salary breakup: basic, allowances, employer PF, gratuity, variable pay.</li>
            <li>Subtract employer PF, gratuity and any variable pay from CTC to get the fixed gross.</li>
            <li>
              Enter the gross in the <Link href="/calculators/take-home-pay-calculator">Take-Home Pay Calculator</Link>{" "}
              with India selected, your regime, employee PF and professional tax.
            </li>
            <li>Divide the annual take-home by 12.</li>
          </ol>

          <h2>Things that change the figure</h2>
          <ul>
            <li>
              <strong>PF on capped wages.</strong> Some employers calculate PF on a wage ceiling of 15,000 a
              month (1,800 a month each side) rather than on full basic. That raises in-hand pay.
            </li>
            <li>
              <strong>Old tax regime.</strong> With large deductions for 80C investments, health insurance and HRA,
              the old regime can still be cheaper. The calculator lets you compare both.
            </li>
            <li>
              <strong>Variable pay</strong> is not guaranteed and is often paid once a year.
            </li>
            <li>
              <strong>Professional tax</strong> depends on the state; some states do not levy it.
            </li>
          </ul>
          <p>
            Comparing offers? Compare fixed in-hand pay first, then the benefits. For converting between yearly,
            monthly and hourly figures, use the <Link href="/calculators/salary-calculator">Salary Calculator</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "cgpa-to-percentage",
    topic: "Calculations",
    title: "How to convert CGPA to percentage",
    seoTitle: "How to Convert CGPA to Percentage (× 9.5 and More)",
    description:
      "CBSE multiplies CGPA by 9.5, but universities use their own formulas. How each one works, a worked example, and what to write when a form asks for a percentage.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["cgpa-calculator", "gpa-calculator", "percentage-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Application forms, especially for jobs and further study, often ask for a percentage even though your
            marksheet shows a CGPA on a 10-point scale. The conversion depends on who issued the grades, and
            using the wrong formula can understate or overstate your result.
          </p>

          <h2>The CBSE formula: CGPA × 9.5</h2>
          <p>
            CBSE has used the rule percentage ≈ CGPA × 9.5 for its grade-point results. A CGPA of 8.2 becomes 8.2 ×
            9.5 = 77.9%. A perfect 10 becomes 95%.
          </p>
          <p>
            The 9.5 comes from an analysis of how grade points related to marks across many students. It is an
            approximation for a whole cohort, not an exact reversal of your own marks.
          </p>

          <h2>Universities use their own formulas</h2>
          <p>
            Many universities and autonomous colleges publish their own conversion, and it often differs from
            × 9.5. Common patterns include CGPA × 10, a subtraction before multiplying such as (CGPA − 0.75) × 10,
            or a lookup table. Your institution&apos;s official formula usually appears on the back of the
            marksheet, in the academic regulations, or in a conversion certificate the examination office can
            issue.
          </p>
          <table>
            <thead>
              <tr>
                <th>CGPA</th>
                <th>×9.5</th>
                <th>×10</th>
                <th>Other</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>6.0</td>
                <td>57.0%</td>
                <td>60.0%</td>
                <td>52.5%</td>
              </tr>
              <tr>
                <td>7.0</td>
                <td>66.5%</td>
                <td>70.0%</td>
                <td>62.5%</td>
              </tr>
              <tr>
                <td>8.0</td>
                <td>76.0%</td>
                <td>80.0%</td>
                <td>72.5%</td>
              </tr>
              <tr>
                <td>9.0</td>
                <td>85.5%</td>
                <td>90.0%</td>
                <td>82.5%</td>
              </tr>
            </tbody>
          </table>
          <p>
            The Other column uses (CGPA − 0.75) × 10. The same CGPA can be ten percentage points apart depending on
            the formula, which is why the formula
            matters more than the arithmetic.
          </p>

          <h2>Calculate it</h2>
          <ol>
            <li>
              If you have semester GPAs and credits, combine them first in the{" "}
              <Link href="/calculators/cgpa-calculator">CGPA Calculator</Link>. It credit-weights each semester.
            </li>
            <li>
              The CGPA Calculator also shows the CGPA × 9.5 percentage, and the plain percentage of the scale
              (CGPA ÷ 10 × 100), which is the same as the × 10 rule.
            </li>
            <li>For any other formula, apply it to the CGPA by hand or with a calculator.</li>
          </ol>

          <h2>SGPA and CGPA</h2>
          <p>
            SGPA is the grade point average for one semester; CGPA is the cumulative average across all semesters
            so far, weighted by the credits in each. Convert the CGPA, not an average of SGPAs, unless the form
            asks for a particular semester. A simple average of SGPAs gives the wrong answer when semesters carry
            different numbers of credits, which the CGPA Calculator handles automatically.
          </p>

          <h2>What to write on a form</h2>
          <ul>
            <li>Use the formula of the institution that awarded the grades, and mention which formula you used.</li>
            <li>If the form allows it, give the CGPA as well as the percentage.</li>
            <li>
              If the institution gives no formula, CGPA × 10 is the most neutral choice, but say so, because some
              employers will apply × 9.5 themselves.
            </li>
            <li>Keep a copy of the official conversion rule or certificate in case of verification.</li>
          </ul>

          <h2>Converting the other way</h2>
          <p>
            To estimate a CGPA from a percentage with the CBSE rule, divide by 9.5: 85% ÷ 9.5 ≈ 8.9. For 4-point
            GPA systems used in the US and elsewhere, see{" "}
            <Link href="/guides/how-to-calculate-gpa">how to calculate GPA and CGPA</Link>. To plan the CGPA you
            need by the end of next semester, the CGPA Calculator has a target planner.
          </p>
        </>
      );
    },
  },

  {
    slug: "what-grade-do-i-need-on-my-final",
    topic: "Calculations",
    title: "What grade do I need on my final exam?",
    seoTitle: "What Grade Do I Need on My Final Exam?",
    description:
      "Work out the final exam score you need for the overall grade you want, from your current grade and the exam's weight, with worked examples and the formula.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["grade-calculator", "percentage-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            With the final exam a few weeks away, the useful question is not your current grade but what you need
            on the exam to finish where you want. If the answer is 52%, you can relax a little. If it is 118%,
            you know to aim for the next grade down and plan accordingly.
          </p>

          <h2>The formula</h2>
          <p>Needed on final = (target − current × (1 − final weight)) ÷ final weight</p>
          <p>Use decimals for the weight: 30% is 0.3.</p>

          <h2>Worked example</h2>
          <p>
            Your coursework and midterms so far average 78%, and they make up 70% of the course. The final exam is
            the remaining 30%.
          </p>
          <ul>
            <li>
              For 80% overall: (80 − 78 × 0.7) ÷ 0.3 = (80 − 54.6) ÷ 0.3 = 84.7%.
            </li>
            <li>For 70% overall: (70 − 54.6) ÷ 0.3 = 51.3%.</li>
            <li>For 90% overall: (90 − 54.6) ÷ 0.3 = 118%. Not reachable.</li>
          </ul>

          <h2>Let the calculator do it</h2>
          <ol>
            <li>
              Open the <Link href="/calculators/grade-calculator">Grade Calculator</Link> and enter each assessment
              so far with its score and weight.
            </li>
            <li>
              In the &ldquo;What do I need on the final?&rdquo; section, enter the weight of the remaining
              assessment and your target overall grade.
            </li>
            <li>
              Read the result. The calculator tells you if the target is already secured even with a zero, or if
              it is not reachable even with full marks.
            </li>
          </ol>

          <h2>Check the weights add up</h2>
          <p>
            The most common mistake is using weights that do not total 100%. If coursework is 40%, midterm 20% and
            final 40%, your &ldquo;current grade&rdquo; must be the weighted average of the coursework and midterm
            only, covering 60% of the course. The Grade Calculator shows the total weight entered, so you can see
            when something is missing.
          </p>

          <h2>Letter grade cut-offs</h2>
          <p>
            Courses differ on where an A starts: 90% in many US courses, 70% for a first in UK universities, and
            other scales elsewhere. Some courses also round, so 89.5% might count as 90%. Use your syllabus. The
            Grade Calculator lets you choose a grading scale so the letter matches.
          </p>

          <h2>Rules that change the sum</h2>
          <ul>
            <li>
              <strong>Dropped lowest score:</strong> some courses ignore your worst quiz. Leave it out before
              calculating.
            </li>
            <li>
              <strong>Final replaces midterm:</strong> some courses use the final score instead of a lower midterm.
            </li>
            <li>
              <strong>Minimum exam mark:</strong> some courses require a pass on the exam itself, whatever your
              overall average.
            </li>
            <li>
              <strong>Curved grades:</strong> if grades are scaled after the exam, the calculation is only a guide.
            </li>
          </ul>

          <h2>Courses graded in points</h2>
          <p>
            Some courses add up points rather than percentages: 1,000 points available, 900 for an A. Then the
            arithmetic is simpler. Subtract the points you already have from the points you need; the result is
            what you must score on the remaining work. With 640 points so far and a 300-point final, an A needs
            260 of those 300, or about 87%.
          </p>

          <h2>Using the answer</h2>
          <p>
            If the number you need is high, start with past papers and the topics with the most marks. If it is
            low, do not coast: exam scores often come in under what students expect. Aim a few points above the
            target. For turning raw marks into a percentage and grade, see{" "}
            <Link href="/guides/test-score-to-percentage-and-grade">test score to percentage and grade</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "weighted-vs-unweighted-gpa",
    topic: "Calculations",
    title: "Weighted vs unweighted GPA: what is the difference?",
    seoTitle: "Weighted vs Unweighted GPA Explained",
    description:
      "Why one transcript can show a 3.5 and a 3.9 for the same student. How weighted GPA rewards honors and AP classes, a worked example, and what colleges look at.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["gpa-calculator", "cgpa-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Many US high schools report two GPAs. The unweighted GPA treats every class the same. The weighted GPA
            gives extra points for harder classes such as honors, Advanced Placement (AP) and International
            Baccalaureate (IB). The same report card can show a 3.5 unweighted and a 3.9 weighted.
          </p>

          <h2>Unweighted GPA</h2>
          <p>
            On the standard 4.0 scale, an A is worth 4 points, a B 3, a C 2, a D 1 and an F 0, whatever the class.
            The highest possible unweighted GPA is 4.0. It answers the question &ldquo;how high were your
            grades?&rdquo;
          </p>

          <h2>Weighted GPA</h2>
          <p>
            A weighted scale adds a bonus for difficulty. A common scheme adds 0.5 for honors and 1.0 for AP or IB:
            an A in an AP class counts as 5.0, a B in an honors class as 3.5. Weighted GPAs can therefore go above
            4.0, often up to 5.0. They answer &ldquo;how high were your grades, given how hard your classes
            were?&rdquo; Schools set their own bonuses, so check yours.
          </p>

          <h2>Worked example</h2>
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Unweighted</th>
                <th>Weighted</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>AP Biology (A)</td>
                <td>4.0</td>
                <td>5.0</td>
              </tr>
              <tr>
                <td>Honors English (B)</td>
                <td>3.0</td>
                <td>3.5</td>
              </tr>
              <tr>
                <td>Spanish (A)</td>
                <td>4.0</td>
                <td>4.0</td>
              </tr>
              <tr>
                <td>Geometry (B)</td>
                <td>3.0</td>
                <td>3.0</td>
              </tr>
              <tr>
                <td>Average</td>
                <td>3.50</td>
                <td>3.88</td>
              </tr>
            </tbody>
          </table>
          <p>This assumes equal credits; with different credits, each class is weighted by its credits as well.</p>

          <h2>Calculate both</h2>
          <ol>
            <li>
              Open the <Link href="/calculators/gpa-calculator">GPA Calculator</Link>, choose the 4.0 scale, and
              enter each class with its credits and letter grade. That is your unweighted GPA.
            </li>
            <li>
              For the weighted GPA, tick &ldquo;Enter grade points directly&rdquo; and type the weighted points
              for each class, such as 5.0 for an A in an AP class. The calculator still weights by credits.
            </li>
          </ol>
          <p>
            The calculator also has a 5.0 scale, but schools assign weighted points differently, so typing your
            school&apos;s points is the most accurate method.
          </p>

          <h2>Credits change the result</h2>
          <p>
            A full-year AP class worth 1 credit counts twice as much as a half-year elective worth 0.5. If your
            school gives classes different credits, enter them, because a strong grade in a small class moves the
            GPA less than you might expect. The GPA Calculator multiplies each class&apos;s points by its credits
            before averaging, in both the weighted and unweighted calculations.
          </p>

          <h2>What colleges look at</h2>
          <p>
            Admissions offices see GPAs calculated in dozens of different ways, so many of them recalculate GPA
            with their own method, often unweighted and sometimes only for core academic subjects. They also look
            at the transcript itself: which courses you took and how demanding your schedule was compared with
            what your school offered. A weighted GPA is therefore not a way to look stronger than the transcript
            shows, and an unweighted GPA does not hide a hard schedule.
          </p>

          <h2>Should you take the harder class?</h2>
          <p>
            Generally, a strong grade in a harder course is valued more than a top grade in an easier one. But a
            schedule that is so heavy your grades collapse helps nobody. Choose the level you can do well in.
          </p>
          <p>
            For combining semesters into a cumulative figure, see{" "}
            <Link href="/guides/how-to-calculate-gpa">how to calculate GPA and CGPA</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "age-on-a-specific-date",
    topic: "Calculations",
    title: "How to calculate age on a specific date (for exam and job eligibility)",
    seoTitle: "How to Calculate Age as on a Specific Date",
    description:
      "Exam and job notices set age limits as on a cut-off date. How to work out your exact age on that date, read born-between ranges, and avoid the leap-day traps.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["age-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            &ldquo;Candidates must be between 21 and 30 years of age as on 1 January 2026.&rdquo; Recruitment
            notices, school admissions and sports categories all use a cut-off date like this. Your age today does
            not matter; your age on that date does, often to the day.
          </p>

          <h2>Calculate it step by step</h2>
          <ol>
            <li>
              Open the <Link href="/calculators/age-calculator">Age Calculator</Link> and enter your date of birth.
            </li>
            <li>Change &ldquo;Age at this date&rdquo; from today to the cut-off date in the notice.</li>
            <li>Read your exact age in years, months and days on that date.</li>
          </ol>
          <p>
            Example: born 15 August 2003, age on 1 January 2026 is 22 years, 4 months and 17 days. That person is
            eligible for a 21–30 limit.
          </p>

          <h2>How the counting works</h2>
          <p>
            Count whole years first: from 15 August 2003 to 15 August 2025 is 22 years. Then whole months: from 15
            August to 15 December is 4 months. Then the remaining days: from 15 December to 1 January is 17 days.
            Doing it by hand is easy to get wrong around month ends, which is why the calculator is worth using
            for anything that matters.
          </p>

          <h2>Reading age limits correctly</h2>
          <ul>
            <li>
              <strong>&ldquo;Not more than 30 years&rdquo;</strong> usually means you have not had your 31st
              birthday on the cut-off date: 30 years and 364 days is still eligible. Some notices say &ldquo;must
              not have attained 30&rdquo;, which is stricter. Read the exact words.
            </li>
            <li>
              <strong>&ldquo;Born not earlier than … and not later than …&rdquo;</strong> gives a date range
              instead. Compare your date of birth directly; no age calculation needed. These ranges usually include
              both end dates.
            </li>
            <li>
              <strong>Relaxations:</strong> many notices raise the upper limit for certain categories by a few
              years. Add the relaxation to the limit, then check your age against it.
            </li>
          </ul>

          <h2>The date that counts</h2>
          <p>
            Use the date of birth on the document the notice names, usually a school-leaving certificate, birth
            certificate or passport. If two documents disagree, sort it out before applying, because eligibility is
            checked against the official record.
          </p>

          <h2>Born on 29 February</h2>
          <p>
            In years without a 29 February, legal systems differ on whether your birthday falls on 28 February or
            1 March. For an age limit, that one day only matters if your birthday is exactly at the cut-off. If it
            is, check the rules of the organisation running the exam.
          </p>

          <h2>Other uses</h2>
          <ul>
            <li>School admission age as on a set date in the academic year.</li>
            <li>Sports age groups, which often use 1 January or 31 December.</li>
            <li>Retirement or pension eligibility on a specific date.</li>
            <li>Insurance quotes based on age at the policy start date.</li>
          </ul>
          <p>
            For how exact age is counted in years, months and days, see{" "}
            <Link href="/guides/how-to-calculate-exact-age">how to calculate exact age</Link>. To count days between
            any two dates, see <Link href="/guides/days-between-two-dates">days between two dates</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "days-between-two-dates",
    topic: "Calculations",
    title: "How to count the days between two dates",
    seoTitle: "How to Count the Days Between Two Dates",
    description:
      "Count days, weeks and months between two dates, decide whether to include the end date, and avoid the month-length and leap-year mistakes of counting by hand.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["age-calculator", "time-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            How many days until a wedding, since a project started, or between invoice and payment? Counting on a
            calendar works for short spans and goes wrong for long ones, because months have different lengths and
            some years have 366 days.
          </p>

          <h2>Count days with the age calculator</h2>
          <p>
            An age calculation is a count between two dates, so the{" "}
            <Link href="/calculators/age-calculator">Age Calculator</Link> works for any pair of dates:
          </p>
          <ol>
            <li>Enter the earlier date as the date of birth.</li>
            <li>Enter the later date as &ldquo;Age at this date&rdquo;.</li>
            <li>
              Read the total days, along with total weeks, months and the difference in years, months and days.
            </li>
          </ol>
          <p>
            Example: from 14 March 2026 to 25 December 2026 is 286 days. From 3 October 2026 to 1 January 2027 is
            90 days.
          </p>

          <h2>Include the end date or not?</h2>
          <p>
            A date calculator counts the gap between dates, which excludes one end. From Monday to Wednesday is 2
            days. If you are counting days of an event that includes both the first and last day, such as a
            hotel stay or a leave period, add one: a conference from Monday to Wednesday lasts 3 days.
          </p>
          <ul>
            <li>Nights in a hotel: the gap (check-in to check-out). Monday to Wednesday is 2 nights.</li>
            <li>Days of leave or of an event: the gap plus one. Monday to Wednesday is 3 days.</li>
            <li>Days until a deadline: the gap. Counting down from today, today is not included.</li>
          </ul>

          <h2>Counting by hand</h2>
          <p>Remember the month lengths:</p>
          <ul>
            <li>31 days: January, March, May, July, August, October, December.</li>
            <li>30 days: April, June, September, November.</li>
            <li>February: 28, or 29 in a leap year (2028 is the next).</li>
          </ul>
          <p>
            Count the days left in the first month, add every full month in between, then add the days in the last
            month. For 14 March to 25 December: 17 (rest of March) + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30 (April to
            November) + 25 = 286.
          </p>

          <h2>Weeks and months</h2>
          <p>
            Divide days by 7 for weeks: 286 days is 40 weeks and 6 days. Months are trickier because they are not
            all the same length. &ldquo;Three months from 31 January&rdquo; is ambiguous. For contracts and
            notice periods, use the wording of the agreement, which usually counts calendar months to the same
            date. To convert days into hours, minutes or average months and years, use the{" "}
            <Link href="/converters/time-converter">Time Converter</Link>.
          </p>

          <h2>Working days</h2>
          <p>
            Business deadlines often count working days only, excluding weekends and public holidays. A quick
            estimate: total days × 5 ÷ 7, then subtract the public holidays in the period. For anything with legal
            consequences, count on a calendar that shows your local holidays.
          </p>

          <h2>Time zones</h2>
          <p>
            For dates in different time zones, such as a flight that crosses the date line, count in one zone. For
            meetings across zones, see{" "}
            <Link href="/guides/schedule-a-meeting-across-time-zones">scheduling a meeting across time zones</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "cat-years-to-human-years",
    topic: "Calculations",
    title: "Cat years to human years: how old is my cat?",
    seoTitle: "Cat Years to Human Years: How Old Is My Cat?",
    description:
      "A one-year-old cat is roughly 15 in human years and a two-year-old about 24. The chart vets use, cat life stages, and what changes as your cat gets older.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pet-age-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            The old rule of &ldquo;seven years for every human year&rdquo; is wrong for cats in both directions.
            Cats grow up very fast in their first two years and then age more slowly. A one-year-old cat is
            already roughly a teenager, while a ten-year-old is in late middle age, not seventy.
          </p>

          <h2>The usual conversion</h2>
          <p>Veterinary guidance commonly uses this pattern:</p>
          <ul>
            <li>First year: about 15 human years.</li>
            <li>Second year: about 9 more, so a two-year-old cat is about 24.</li>
            <li>Every year after that: about 4 human years.</li>
          </ul>
          <table>
            <thead>
              <tr>
                <th>Cat age</th>
                <th>Human age</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>6 months</td>
                <td>10</td>
              </tr>
              <tr>
                <td>1 year</td>
                <td>15</td>
              </tr>
              <tr>
                <td>2 years</td>
                <td>24</td>
              </tr>
              <tr>
                <td>5 years</td>
                <td>36</td>
              </tr>
              <tr>
                <td>10 years</td>
                <td>56</td>
              </tr>
              <tr>
                <td>15 years</td>
                <td>76</td>
              </tr>
              <tr>
                <td>20 years</td>
                <td>96</td>
              </tr>
            </tbody>
          </table>
          <p>
            Unlike dogs, cats do not differ much in size, so one chart works for most breeds. The{" "}
            <Link href="/calculators/pet-age-calculator">Pet Age Calculator</Link> uses this pattern, accepts years
            and months, and shows your cat&apos;s life stage.
          </p>

          <h2>Cat life stages</h2>
          <ul>
            <li>
              <strong>Kitten (up to 1 year):</strong> rapid growth, vaccinations, neutering.
            </li>
            <li>
              <strong>Young adult (1 to 6):</strong> full size, high energy, usually healthy.
            </li>
            <li>
              <strong>Mature adult (7 to 10):</strong> roughly 40s to mid-50s in human terms. Weight gain is
              common as activity drops.
            </li>
            <li>
              <strong>Senior (over 10):</strong> kidney, thyroid and dental problems become more common. Many vets
              suggest checks every six months from this stage.
            </li>
          </ul>

          <h2>Why the human-age figure is useful</h2>
          <p>
            It is not exact science, but it helps people understand care. A seven-year-old cat sounds young; at
            about 44 in human terms, it is time to watch its weight, teeth and water intake. A 15-year-old cat is
            in its mid-seventies, so stiffness, weight loss and changes in toilet habits deserve a vet visit
            rather than being put down to age.
          </p>

          <h2>How long do cats live?</h2>
          <p>
            Indoor cats commonly live into their mid-teens, and many reach 20. Outdoor cats face more risks, from
            traffic to fights and disease, and on average live shorter lives. Diet, weight, dental care and
            regular check-ups all make a difference.
          </p>

          <h2>Signs of ageing worth a vet visit</h2>
          <ul>
            <li>Drinking or urinating more than usual, which can point to kidney disease or diabetes.</li>
            <li>Weight loss despite a good appetite, a common sign of an overactive thyroid.</li>
            <li>Bad breath, drooling or dropping food, often dental pain.</li>
            <li>Missing the litter tray or avoiding jumps, frequently caused by stiff joints.</li>
            <li>Night-time crying or confusion in very old cats.</li>
          </ul>

          <h2>Not sure of your cat&apos;s age?</h2>
          <p>
            For rescue cats, vets estimate age from teeth, eyes, coat and muscle tone. The estimate is good for
            kittens and young cats and becomes rougher after a few years. Use the vet&apos;s estimate in the
            calculator and treat the result as approximate.
          </p>
          <p>
            For dogs, size changes the answer a lot; see{" "}
            <Link href="/guides/dog-years-to-human-years">dog years to human years</Link>.
          </p>
        </>
      );
    },
  },
];
