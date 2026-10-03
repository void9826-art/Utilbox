import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-03";

export const percentagesAndLoansGuides: Guide[] = [
  {
    slug: "reverse-percentage",
    topic: "Calculations",
    title: "Reverse percentages: how to find the original number",
    seoTitle: "Reverse Percentages: Find the Original Number",
    description:
      "A price after a 20% rise is 96, so what was it before? How to work backwards from a percentage increase, discount or tax, and the common mistake that gives 76.8.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["percentage-calculator", "discount-calculator", "tax-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            A jacket costs 60 after a 25% discount. What was the full price? A bill is 150 including 20% VAT.
            How much is the VAT? These are reverse percentage questions: you know the number after the change
            and want the number before it. They trip people up because the obvious method gives the wrong
            answer.
          </p>

          <h2>The common mistake</h2>
          <p>
            Take the 150 bill with 20% VAT. The tempting move is to take 20% off: 150 − 30 = 120. But 20% of 120
            is 24, and 120 + 24 = 144, not 150. The problem is that the 20% was calculated on the original
            price, not on the total. Taking 20% of the total uses the wrong base.
          </p>

          <h2>The method that works</h2>
          <p>Turn the percentage change into a multiplier, then divide by it.</p>
          <ul>
            <li>
              <strong>After an increase of 20%:</strong> the new value is 120% of the original, a multiplier of
              1.20. Original = new ÷ 1.20.
            </li>
            <li>
              <strong>After a decrease of 25%:</strong> the new value is 75% of the original, a multiplier of
              0.75. Original = new ÷ 0.75.
            </li>
          </ul>

          <h2>Worked examples</h2>
          <table>
            <thead>
              <tr>
                <th>Situation</th>
                <th>Sum</th>
                <th>Original</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>96 after a 20% rise</td>
                <td>96 ÷ 1.20</td>
                <td>80</td>
              </tr>
              <tr>
                <td>60 after 25% off</td>
                <td>60 ÷ 0.75</td>
                <td>80</td>
              </tr>
              <tr>
                <td>150 including 20% VAT</td>
                <td>150 ÷ 1.20</td>
                <td>125 (VAT 25)</td>
              </tr>
              <tr>
                <td>1,180 including 18% GST</td>
                <td>1,180 ÷ 1.18</td>
                <td>1,000 (GST 180)</td>
              </tr>
              <tr>
                <td>Salary 46,200 after a 10% raise</td>
                <td>46,200 ÷ 1.10</td>
                <td>42,000</td>
              </tr>
            </tbody>
          </table>
          <p>
            Check any answer by applying the percentage forwards: 80 plus 20% is 96. If the check does not land
            exactly on the number you started with, the method was wrong.
          </p>

          <h2>Let a calculator do it</h2>
          <ul>
            <li>
              <strong>Discounts:</strong> the <Link href="/calculators/discount-calculator">Discount Calculator</Link>{" "}
              has a Find original price mode: enter the price you paid and the discount that was applied.
            </li>
            <li>
              <strong>Tax:</strong> the <Link href="/calculators/tax-calculator">Tax Calculator</Link> has a Remove
              tax from a total mode, with VAT and GST rates for several countries built in.
            </li>
            <li>
              <strong>Anything else:</strong> the <Link href="/calculators/percentage-calculator">Percentage Calculator</Link>{" "}
              handles percentage change in both directions, including the reverse change needed to get back to
              where you started.
            </li>
          </ul>

          <h2>Getting back to the start</h2>
          <p>
            A related trap: if a share price falls 20%, it needs to rise 25% to recover, not 20%. From 100, a 20%
            fall gives 80, and 80 needs another 20 to get back, which is 25% of 80. The bigger the fall, the
            bigger the gap: a 50% fall needs a 100% rise. The same applies to a 10% pay cut followed by a 10% pay
            rise, which leaves you 1% worse off.
          </p>

          <h2>Where reverse percentages come up</h2>
          <ul>
            <li>Checking a sale really was the discount advertised.</li>
            <li>Splitting a receipt total into net price and tax for expenses.</li>
            <li>Working out a pre-raise salary or a pre-increase rent.</li>
            <li>Finding what a figure was last year from this year&apos;s figure and the growth rate.</li>
          </ul>
          <p>
            For the forward direction, see{" "}
            <Link href="/guides/how-to-calculate-percentage-change">how to calculate percentage change</Link>. For
            tax in particular, see <Link href="/guides/how-to-add-or-remove-vat">how to add or remove VAT</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "percentage-points-vs-percent",
    topic: "Calculations",
    title: "Percentage points vs percent: what is the difference?",
    seoTitle: "Percentage Points vs Percent: The Difference",
    description:
      "An interest rate rising from 4% to 5% is up one percentage point but 25 percent. Why the two are different, when to use each, and how headlines mislead with them.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["percentage-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            &ldquo;The interest rate rose by 1%.&rdquo; &ldquo;The interest rate rose by 25%.&rdquo; If the rate
            went from 4% to 5%, both sentences describe the same change, and only one of them is clear. The
            difference between percent and percentage points matters whenever the thing you are measuring is
            itself a percentage.
          </p>

          <h2>The two measures</h2>
          <ul>
            <li>
              <strong>Percentage points</strong> are the simple difference between two percentages: 5% − 4% = 1
              percentage point.
            </li>
            <li>
              <strong>Percent change</strong> is how much the value changed relative to where it started: a rise
              of 1 on a base of 4 is 1 ÷ 4 = 25%.
            </li>
          </ul>
          <p>
            Both are correct; they answer different questions. Percentage points tell you the gap. Percent change
            tells you the scale of the change compared with the starting level.
          </p>

          <h2>Examples</h2>
          <table>
            <thead>
              <tr>
                <th>Change</th>
                <th>Points</th>
                <th>Percent</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Interest rate 4% → 5%</td>
                <td>+1</td>
                <td>+25%</td>
              </tr>
              <tr>
                <td>Vote share 40% → 44%</td>
                <td>+4</td>
                <td>+10%</td>
              </tr>
              <tr>
                <td>Unemployment 6% → 5%</td>
                <td>−1</td>
                <td>−16.7%</td>
              </tr>
              <tr>
                <td>Pass rate 80% → 88%</td>
                <td>+8</td>
                <td>+10%</td>
              </tr>
              <tr>
                <td>Risk 1% → 2%</td>
                <td>+1</td>
                <td>+100%</td>
              </tr>
            </tbody>
          </table>

          <h2>How headlines use them</h2>
          <p>
            The last row shows why this matters. &ldquo;Doubles the risk&rdquo; and &ldquo;raises the risk by one
            percentage point&rdquo; describe the same finding. The first sounds alarming; the second tells you
            that 98 people in 100 are unaffected either way. Health stories often quote the relative change
            (percent) because it is bigger, and leave out the absolute change (points). When you see a dramatic
            percentage, look for the starting level.
          </p>
          <p>
            The reverse happens too. A party whose vote share moves from 4% to 6% has grown by 50%, a big story
            for a small party, even though it gained only two points.
          </p>

          <h2>A percent of a percentage</h2>
          <p>
            Sentences like &ldquo;rates fell by 10%&rdquo; are ambiguous when the rate was 5%. Read as percent, the
            rate fell to 4.5% (10% of 5 is 0.5). Read carelessly as points, it fell to −5%, which is impossible.
            The same goes for &ldquo;tax up 2%&rdquo;: from 20% that is either 22% or 20.4%. If you are writing,
            avoid the ambiguity by giving the before and after figures.
          </p>

          <h2>Which one to use</h2>
          <ul>
            <li>
              <strong>Use percentage points</strong> when comparing two rates directly: interest rates, tax rates,
              exam pass rates, market shares, poll results.
            </li>
            <li>
              <strong>Use percent</strong> when the starting level matters to the reader: &ldquo;your mortgage
              rate rose by a quarter&rdquo; is meaningful for someone working out a budget.
            </li>
            <li>
              <strong>Give both</strong> when there is any chance of confusion: &ldquo;up 1 percentage point, from
              4% to 5%&rdquo;.
            </li>
          </ul>

          <h2>Basis points</h2>
          <p>
            In finance, small changes in rates are often given in basis points. One basis point is one hundredth
            of a percentage point, so 25 basis points is 0.25 percentage points. A central bank that &ldquo;raises
            rates by 25 basis points&rdquo; takes a rate from, say, 4.00% to 4.25%.
          </p>

          <h2>Work it out</h2>
          <p>
            For percentage points, just subtract. For percent change, use the % change mode of the{" "}
            <Link href="/calculators/percentage-calculator">Percentage Calculator</Link>: enter the old rate and
            the new rate as plain numbers, such as 4 and 5, and it gives 25%. It also shows the absolute
            difference, which is the change in points.
          </p>
          <p>
            For the general method behind percent change, see{" "}
            <Link href="/guides/how-to-calculate-percentage-change">how to calculate percentage change</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "markup-vs-margin",
    topic: "Calculations",
    title: "Markup vs margin: how to price for the profit you want",
    seoTitle: "Markup vs Margin: Formulas and Conversion Table",
    description:
      "Adding 40% to cost does not give a 40% margin. The difference between markup and margin, a conversion table, and the formula to price for a target margin.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["percentage-calculator", "discount-calculator", "tax-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            A small business owner buys a product for 60, wants a 40% margin, adds 40% and sells it for 84. The
            actual margin is 28.6%, not 40%. Markup and margin are both percentages of profit, but they are
            measured against different numbers, and mixing them up quietly erodes profit on every sale.
          </p>

          <h2>The definitions</h2>
          <ul>
            <li>
              <strong>Markup</strong> is profit as a percentage of <em>cost</em>: (price − cost) ÷ cost.
            </li>
            <li>
              <strong>Margin</strong> is profit as a percentage of <em>price</em>: (price − cost) ÷ price.
            </li>
          </ul>
          <p>
            Buy at 60, sell at 100. Profit is 40. Markup is 40 ÷ 60 = 66.7%. Margin is 40 ÷ 100 = 40%. Same sale,
            two different percentages. Margin is always smaller than markup.
          </p>

          <h2>Conversion table</h2>
          <table>
            <thead>
              <tr>
                <th>Margin</th>
                <th>Markup needed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>10%</td>
                <td>11.1%</td>
              </tr>
              <tr>
                <td>20%</td>
                <td>25%</td>
              </tr>
              <tr>
                <td>25%</td>
                <td>33.3%</td>
              </tr>
              <tr>
                <td>30%</td>
                <td>42.9%</td>
              </tr>
              <tr>
                <td>40%</td>
                <td>66.7%</td>
              </tr>
              <tr>
                <td>50%</td>
                <td>100%</td>
              </tr>
              <tr>
                <td>60%</td>
                <td>150%</td>
              </tr>
            </tbody>
          </table>
          <p>
            The formulas: markup = margin ÷ (1 − margin), and margin = markup ÷ (1 + markup), with both written as
            decimals. A 100% markup, doubling the cost, gives a 50% margin.
          </p>

          <h2>Price for a target margin</h2>
          <p>
            To hit a margin, divide the cost by (1 − margin). For a 40% margin on a cost of 60: 60 ÷ 0.60 = 100.
            This is a reverse percentage, and it works the same way as finding a price before tax. Check it with
            the <Link href="/calculators/percentage-calculator">Percentage Calculator</Link>: what percent of 100
            is 40? Exactly 40%.
          </p>

          <h2>Which one to use</h2>
          <ul>
            <li>
              <strong>Margin</strong> is what accountants, investors and most retail benchmarks quote, because it
              relates directly to revenue. &ldquo;We run at a 35% gross margin&rdquo; means 35 of every 100 in
              sales is gross profit.
            </li>
            <li>
              <strong>Markup</strong> is convenient for pricing from a supplier price list: cost × 1.5 is a 50%
              markup.
            </li>
            <li>
              <strong>Say which you mean</strong> in any price discussion, especially with partners or staff.
            </li>
          </ul>

          <h2>Discounts eat margin fast</h2>
          <p>
            A 20% discount on an item with a 40% margin cuts the profit in half. Sell at 100 with a cost of 60 and
            profit is 40; discount to 80 and profit is 20. To keep the same total profit, you would need to sell
            twice as many. Run sale prices through the{" "}
            <Link href="/calculators/discount-calculator">Discount Calculator</Link> and compare the result with
            your cost before agreeing to a promotion.
          </p>

          <h2>In a spreadsheet</h2>
          <p>
            With cost in column A and price in column B, margin is <code>=(B2-A2)/B2</code> and markup is{" "}
            <code>=(B2-A2)/A2</code>, formatted as percentages. To set a price from a target margin in cell C1,
            use <code>=A2/(1-C1)</code>. Keeping the margin in one cell means a change of target reprices every
            product at once, and nobody adds a markup by mistake.
          </p>

          <h2>Remember tax</h2>
          <p>
            Calculate margin on prices before VAT or sales tax. If you sell at 120 including 20% VAT, the price for
            margin purposes is 100; the tax belongs to the government. The{" "}
            <Link href="/calculators/tax-calculator">Tax Calculator</Link> removes tax from a total. For the
            reverse-percentage method in more detail, see{" "}
            <Link href="/guides/reverse-percentage">reverse percentages</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "salary-increment-percentage",
    topic: "Calculations",
    title: "How to calculate your salary increase percentage",
    seoTitle: "How to Calculate a Salary Increase Percentage",
    description:
      "Work out your pay rise as a percentage, find the new salary from a percentage raise, compare it with inflation, and see what it means per month and per hour.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["percentage-calculator", "salary-calculator", "take-home-pay-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Your appraisal letter gives a new salary but not the percentage, or a percentage but not the new
            figure. Either way, a few lines of arithmetic tell you what the raise is really worth, and whether it
            keeps up with prices.
          </p>

          <h2>Raise as a percentage</h2>
          <p>
            Subtract the old salary from the new one, divide by the old salary, and multiply by 100.
          </p>
          <p>
            Example: 42,000 to 46,200. The increase is 4,200. 4,200 ÷ 42,000 = 0.10, so the raise is 10%.
          </p>
          <p>
            The <Link href="/calculators/percentage-calculator">Percentage Calculator</Link> does this in its % change
            mode: enter the old and new salary.
          </p>

          <h2>New salary from a percentage</h2>
          <p>
            Multiply the old salary by (1 + raise). A 6% raise on 38,500 is 38,500 × 1.06 = 40,810. The same
            calculator&apos;s Add / subtract % mode does it directly.
          </p>

          <h2>Compare it with inflation</h2>
          <p>
            A raise only increases what you can buy if it beats inflation. The exact calculation is:
          </p>
          <p>Real raise = (1 + raise) ÷ (1 + inflation) − 1</p>
          <p>
            With a 10% raise and 4% inflation: 1.10 ÷ 1.04 − 1 = 5.8%. Simply subtracting, 10 − 4 = 6, is close
            enough for small numbers but overstates it slightly. With a 3% raise and 4% inflation, your real pay
            has fallen by about 1%, even though the number on the payslip went up.
          </p>
          <p>
            Use the inflation figure for the same period as the raise, usually the last twelve months, from your
            national statistics office.
          </p>

          <h2>Per month and per hour</h2>
          <p>
            A yearly figure is hard to feel. The <Link href="/calculators/salary-calculator">Salary Calculator</Link>{" "}
            converts between yearly, monthly, weekly, daily and hourly pay using your hours per week. A raise from
            42,000 to 46,200 is 350 more per month before tax, and at 37.5 hours a week about 2.15 more per hour.
          </p>

          <h2>After tax</h2>
          <p>
            The raise you see in your bank account is smaller than the gross figure, and how much smaller depends
            on your tax band. If the raise pushes part of your income into a higher band, only the part above the
            threshold is taxed at the higher rate; the rest of your salary is not affected. The{" "}
            <Link href="/calculators/take-home-pay-calculator">Take-Home Pay Calculator</Link> shows take-home pay
            before and after for the UK, Canada, Australia and India: run it twice and subtract.
          </p>

          <h2>Things that change the comparison</h2>
          <ul>
            <li>
              <strong>Bonuses and allowances.</strong> Compare base salary with base salary, and treat one-off
              bonuses separately.
            </li>
            <li>
              <strong>Pension contributions</strong> calculated as a percentage of salary rise with it, reducing
              take-home pay slightly while increasing savings.
            </li>
            <li>
              <strong>Hours.</strong> A raise that comes with longer hours may be a pay cut per hour. Compare
              hourly rates.
            </li>
            <li>
              <strong>Timing.</strong> A raise from mid-year only affects half of this year&apos;s income.
            </li>
          </ul>

          <h2>Back-calculating an old salary</h2>
          <p>
            If you know the new salary and the percentage, divide rather than subtract: 46,200 ÷ 1.10 = 42,000.
            Taking 10% off 46,200 gives 41,580, which is wrong. The guide to{" "}
            <Link href="/guides/reverse-percentage">reverse percentages</Link> explains why.
          </p>
        </>
      );
    },
  },

  {
    slug: "flat-vs-reducing-interest-rate",
    topic: "Calculations",
    title: "Flat rate vs reducing balance interest: why 10% flat costs more",
    seoTitle: "Flat vs Reducing Balance Interest Rate Explained",
    description:
      "A 10% flat rate loan costs far more than a 10% reducing balance loan. A worked example, the equivalent reducing rate, and how to compare loan offers fairly.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["emi-calculator", "loan-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Personal loans, vehicle loans and consumer finance are sometimes advertised at a &ldquo;flat&rdquo;
            rate, while home loans and most bank loans use a &ldquo;reducing balance&rdquo; rate. The two numbers
            look comparable and are not: a flat rate of 10% costs roughly as much as a reducing rate of 18%.
          </p>

          <h2>How each method charges interest</h2>
          <ul>
            <li>
              <strong>Flat rate:</strong> interest is calculated on the full original loan for the whole term,
              even though you repay part of it every month.
            </li>
            <li>
              <strong>Reducing balance:</strong> interest is calculated each month on what you still owe. As the
              balance falls, so does the interest.
            </li>
          </ul>

          <h2>Worked example: 5,00,000 for 3 years at 10%</h2>
          <table>
            <thead>
              <tr>
                <th />
                <th>10% flat</th>
                <th>10% reducing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total interest</td>
                <td>1,50,000</td>
                <td>80,809</td>
              </tr>
              <tr>
                <td>Monthly payment</td>
                <td>18,056</td>
                <td>16,134</td>
              </tr>
              <tr>
                <td>Total repaid</td>
                <td>6,50,000</td>
                <td>5,80,809</td>
              </tr>
            </tbody>
          </table>
          <p>
            Flat interest is simple: 5,00,000 × 10% × 3 years = 1,50,000, spread over 36 payments. The reducing
            figures come from the standard EMI formula. The flat loan costs almost twice as much interest at the
            same headline rate.
          </p>

          <h2>The equivalent reducing rate</h2>
          <p>
            To compare a flat offer with a bank loan, find the reducing rate that gives the same monthly payment.
            For the example above, a payment of 18,056 on 5,00,000 over 36 months matches a reducing rate of about
            17.9%. As a rough guide, for terms of two to five years a flat rate is equivalent to a reducing rate
            about 1.7 to 1.8 times as high: 10% flat is roughly 17–18% reducing. The exact figure depends on the term.
          </p>
          <p>
            You can find it by trial with the <Link href="/calculators/emi-calculator">EMI Calculator</Link>: enter
            the loan and term, then adjust the interest rate until the EMI matches the flat loan&apos;s payment.
          </p>

          <h2>How to tell which one you are being offered</h2>
          <ul>
            <li>
              Look for the words &ldquo;flat&rdquo;, &ldquo;add-on&rdquo; or &ldquo;simple interest on the
              principal&rdquo; in the offer.
            </li>
            <li>
              Ask for the total amount payable and the APR or annual percentage rate. Regulated lenders in many
              countries must disclose it, and it reflects the true cost.
            </li>
            <li>
              Multiply the monthly payment by the number of months and subtract the loan. If the interest equals
              loan × rate × years, it is flat.
            </li>
          </ul>

          <h2>Why flat rates exist</h2>
          <p>
            Flat interest is easy to explain and calculate by hand, which is why it persists in dealer finance and
            small lenders. It also makes the rate look lower than the true cost. There is nothing wrong with a
            flat-rate loan if you know its real cost and it is still the best option; the problem is comparing it
            with a reducing-rate loan as if the numbers were the same.
          </p>

          <h2>Early repayment</h2>
          <p>
            Paying a flat-rate loan off early often saves less than expected, because some lenders front-load the
            interest in their schedules. Ask how the settlement figure is worked out before assuming you will save
            the remaining interest. On a reducing-rate loan, early repayment saves interest directly, as shown in{" "}
            <Link href="/guides/prepay-a-loan-reduce-emi-or-tenure">prepaying a loan</Link>.
          </p>
          <p>
            For how the reducing-balance EMI formula works, see{" "}
            <Link href="/guides/how-emi-is-calculated">how EMI is calculated</Link>. To see the full schedule
            month by month, use the <Link href="/calculators/loan-calculator">Loan Calculator</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "prepay-a-loan-reduce-emi-or-tenure",
    topic: "Calculations",
    title: "Loan prepayment: should you reduce the EMI or the tenure?",
    seoTitle: "Loan Prepayment: Reduce EMI or Reduce Tenure?",
    description:
      "After a part-prepayment, lenders ask whether to cut your monthly payment or the number of months left. A worked example shows which saves more interest, and when.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["emi-calculator", "loan-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            You have a bonus or some savings and decide to pay part of your home or car loan early. The lender
            then asks a question: keep the same EMI and finish sooner, or keep the same end date and pay a smaller
            EMI? The choice makes a large difference to the interest you pay.
          </p>

          <h2>Worked example</h2>
          <p>
            A loan of 20,00,000 at 9% for 15 years has an EMI of 20,285 and total interest of about 16.5 lakh.
            After three years, 36 EMIs, about 17,82,494 is still owed and 144 months remain. You prepay 2,00,000.
          </p>
          <table>
            <thead>
              <tr>
                <th>Option</th>
                <th>Result</th>
                <th>Saved</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Reduce tenure</td>
                <td>EMI stays 20,285; 118 months left instead of 144</td>
                <td>about 3,32,900</td>
              </tr>
              <tr>
                <td>Reduce EMI</td>
                <td>EMI falls to 18,009; 144 months left</td>
                <td>about 1,27,800</td>
              </tr>
            </tbody>
          </table>
          <p>
            Reducing the tenure saves more than two and a half times as much interest, and the loan ends more than
            two years early. Reducing the EMI frees up about 2,276 a month.
          </p>

          <h2>Why reducing tenure saves more</h2>
          <p>
            Interest is charged on the outstanding balance each month. When you keep paying the same EMI on a
            smaller balance, more of every payment goes to principal, so the balance falls faster, and each
            month&apos;s interest is smaller than it would have been. Cutting the EMI instead keeps the balance
            falling at the original slower pace, so you go on paying interest for the full term.
          </p>

          <h2>When reducing the EMI makes sense</h2>
          <ul>
            <li>Your monthly budget is tight and a lower payment reduces real financial stress.</li>
            <li>Your income is uncertain and you want lower fixed commitments.</li>
            <li>
              You will invest the monthly difference at a return higher than the loan rate after tax, and you will
              actually do it every month.
            </li>
          </ul>
          <p>
            For most people with a stable income, reducing the tenure is the better default.
          </p>

          <h2>Prepay early in the loan</h2>
          <p>
            The earlier a prepayment is made, the more it saves, because it removes principal that would have
            attracted interest for longer. The same 2,00,000 paid in year one saves more than in year ten. In the
            later years of a loan, most of each EMI is already principal, so prepayment saves relatively little.
          </p>

          <h2>Before you prepay</h2>
          <ul>
            <li>
              <strong>Check for charges.</strong> Some fixed-rate loans carry a prepayment penalty. In India,
              banks are not allowed to charge one on floating-rate home loans taken by individuals, but check your
              loan agreement.
            </li>
            <li>
              <strong>Keep an emergency fund.</strong> Money paid into a loan is hard to get back if you lose your
              job.
            </li>
            <li>
              <strong>Compare with the rate.</strong> Prepaying a 9% loan is like earning a guaranteed 9% return.
              If you hold savings earning less, prepaying is usually better.
            </li>
            <li>
              <strong>Tax benefits.</strong> Where home-loan interest is tax-deductible, the effective rate is
              lower, which makes prepayment slightly less attractive.
            </li>
          </ul>

          <h2>Run your own numbers</h2>
          <p>
            Your lender&apos;s statement shows the outstanding principal. Enter that, the rate, and the remaining
            months into the <Link href="/calculators/emi-calculator">EMI Calculator</Link>, then enter the balance
            minus your prepayment to see the new EMI. The <Link href="/calculators/loan-calculator">Loan Calculator</Link>{" "}
            shows total interest for each case. The guide to{" "}
            <Link href="/guides/how-emi-is-calculated">how EMI is calculated</Link> explains the formula.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-much-car-loan-can-i-afford",
    topic: "Calculations",
    title: "How much car loan can I afford?",
    seoTitle: "How Much Car Loan Can I Afford? Work It Backwards",
    description:
      "Start from a monthly payment you can live with and work backwards to the loan amount. Worked figures for 3 to 6 years, the total cost, and the costs beyond the loan.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["loan-calculator", "emi-calculator", "percentage-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Dealers ask &ldquo;what monthly payment are you comfortable with?&rdquo; because a payment hides the
            price. A better approach is to decide the payment yourself, work out the loan it supports, and then
            shop for a car within that amount.
          </p>

          <h2>Step 1: set a monthly budget</h2>
          <p>
            A car costs more than its loan payment. Fuel or charging, insurance, servicing, tyres, parking and
            tax all come on top. A widely quoted rule of thumb is to keep total car costs, not just the loan,
            to around 10–15% of take-home pay. Start from that total and subtract your estimate of running costs.
            What is left is the loan payment you can afford.
          </p>

          <h2>Step 2: turn the payment into a loan amount</h2>
          <p>Here is what a payment of 400 a month supports at 7% interest:</p>
          <table>
            <thead>
              <tr>
                <th>Term</th>
                <th>Max loan</th>
                <th>Interest</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>3 years</td>
                <td>12,955</td>
                <td>1,445</td>
              </tr>
              <tr>
                <td>4 years</td>
                <td>16,704</td>
                <td>2,496</td>
              </tr>
              <tr>
                <td>5 years</td>
                <td>20,201</td>
                <td>3,799</td>
              </tr>
              <tr>
                <td>6 years</td>
                <td>23,462</td>
                <td>5,338</td>
              </tr>
            </tbody>
          </table>
          <p>
            Longer terms let the same payment buy more car, but the interest climbs quickly: six years costs
            nearly four times the interest of three. The figures scale with the payment, so 800 a month supports
            twice these amounts.
          </p>
          <p>
            To do this for your own numbers, open the <Link href="/calculators/loan-calculator">Loan Calculator</Link>{" "}
            or <Link href="/calculators/emi-calculator">EMI Calculator</Link>, enter the rate and term, and adjust
            the loan amount until the payment matches your budget.
          </p>

          <h2>Step 3: add the deposit</h2>
          <p>
            The car you can afford is the loan plus your deposit, or the trade-in value of your current car. A
            deposit of 10–20% is common and keeps you from owing more than the car is worth in the first years,
            when depreciation is fastest.
          </p>

          <h2>Keep the term short</h2>
          <p>
            Cars lose value quickly, often a large share in the first three years. On a long loan, the balance
            falls more slowly than the car&apos;s value, which leaves you in negative equity: if you need to sell,
            the sale does not cover the loan. A common guideline is to finance for no more than four or five
            years, and only stretch further if the rate is very low.
          </p>

          <h2>Compare offers properly</h2>
          <ul>
            <li>
              <strong>Total amount payable</strong> is the clearest comparison: monthly payment × months +
              deposit + fees.
            </li>
            <li>
              <strong>APR</strong> includes fees as well as interest; see{" "}
              <Link href="/guides/apr-vs-interest-rate">APR vs interest rate</Link>.
            </li>
            <li>
              <strong>Flat rates</strong> in some dealer finance look lower than they are; see{" "}
              <Link href="/guides/flat-vs-reducing-interest-rate">flat vs reducing balance interest</Link>.
            </li>
            <li>
              <strong>Balloon payments</strong> lower the monthly figure by leaving a large sum due at the end.
              Include it in the total.
            </li>
          </ul>

          <h2>Running costs to estimate</h2>
          <ul>
            <li>Insurance: get a real quote for the specific model before committing.</li>
            <li>
              Fuel or electricity: annual distance × consumption × price. For electric cars, see{" "}
              <Link href="/guides/ev-charging-cost">how much it costs to charge an electric car</Link>.
            </li>
            <li>Servicing, tyres and repairs: higher for older and premium cars.</li>
            <li>Parking, tolls and annual road tax where they apply.</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "how-much-house-deposit-do-i-need",
    topic: "Calculations",
    title: "How much deposit do you need to buy a house?",
    seoTitle: "How Much Deposit Do You Need to Buy a House?",
    description:
      "5%, 10% or 20%? How the size of your deposit changes the monthly payment, the interest over the term and the rate you are offered, with a worked example.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["mortgage-calculator", "compound-interest-calculator", "percentage-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            The deposit, or down payment, is the part of the price you pay yourself; the mortgage covers the rest.
            Lenders in many countries will accept as little as 5%, and sometimes less. But the size of the deposit
            affects much more than the loan amount: it changes the rate, the monthly payment and, in some
            countries, whether you pay for extra insurance.
          </p>

          <h2>What different deposits mean</h2>
          <p>
            For a home priced at 300,000, at 6% interest over 25 years, the monthly payment and the total interest
            over the term are:
          </p>
          <table>
            <thead>
              <tr>
                <th>Deposit</th>
                <th>Monthly</th>
                <th>Interest</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>5% (15,000)</td>
                <td>1,836</td>
                <td>265,878</td>
              </tr>
              <tr>
                <td>10% (30,000)</td>
                <td>1,740</td>
                <td>251,884</td>
              </tr>
              <tr>
                <td>20% (60,000)</td>
                <td>1,546</td>
                <td>223,897</td>
              </tr>
            </tbody>
          </table>
          <p>
            These figures assume the same 6% rate for every deposit. In practice, a bigger deposit usually earns
            a lower rate as well, which widens the gap further.
          </p>

          <h2>Why 20% is a common target</h2>
          <ul>
            <li>
              <strong>United States:</strong> with less than 20% down on a conventional loan, lenders usually add
              private mortgage insurance (PMI), which protects the lender, not you, and adds to the monthly
              payment until you build enough equity.
            </li>
            <li>
              <strong>United Kingdom and elsewhere:</strong> rates are priced in loan-to-value bands. Moving from a
              95% to a 90% or 85% loan-to-value band often unlocks noticeably cheaper rates.
            </li>
            <li>
              <strong>Everywhere:</strong> a larger deposit gives a cushion if prices fall, so you are less likely
              to owe more than the home is worth.
            </li>
          </ul>
          <p>
            The <Link href="/calculators/mortgage-calculator">Mortgage Calculator</Link> flags a deposit under 20%
            for this reason, and shows the monthly payment with property tax and insurance included.
          </p>

          <h2>The case for a smaller deposit</h2>
          <p>
            Waiting years to save 20% has a cost too: rent paid in the meantime, and house prices that may rise
            faster than your savings. If rent is close to what a mortgage would cost, buying sooner with 10% can
            make sense. There is no universal right answer; compare the monthly cost and total interest for the
            deposits you could realistically have, and when.
          </p>

          <h2>Deposit and loan-to-value</h2>
          <p>
            Lenders describe the same thing from the other side, as loan-to-value (LTV): the loan as a percentage
            of the property&apos;s value. A 10% deposit means a 90% LTV; a 25% deposit, 75% LTV. Rate tables are
            usually arranged by LTV band, so if you are just short of a band, a slightly bigger deposit can lower
            the rate on the whole loan. Check where the band edges are before you decide how much to put down.
          </p>

          <h2>Budget for more than the deposit</h2>
          <ul>
            <li>Purchase taxes and duties, which vary widely by country and price.</li>
            <li>Legal, survey, valuation and arrangement fees.</li>
            <li>Moving costs and immediate repairs or furniture.</li>
            <li>An emergency fund, so the first broken boiler does not go on a credit card.</li>
          </ul>

          <h2>How long will it take to save?</h2>
          <p>
            The <Link href="/calculators/compound-interest-calculator">Compound Interest Calculator</Link> shows how
            a regular monthly saving grows with interest. Enter your savings rate and the deposit target to see
            roughly how many years it takes, and how much a higher monthly amount would shorten it.
          </p>
          <p>
            For what makes up the monthly payment beyond the loan itself, see{" "}
            <Link href="/guides/what-goes-into-a-mortgage-payment">what goes into a mortgage payment</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "apr-vs-interest-rate",
    topic: "Calculations",
    title: "APR vs interest rate: which number to compare",
    seoTitle: "APR vs Interest Rate: What Is the Difference?",
    description:
      "The interest rate is what you pay on the balance; APR adds the fees. A worked example where an 8% loan has an APR of 10%, and how to compare loans fairly.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["loan-calculator", "emi-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Two loans are both advertised at 8%. One has no fees; the other charges an arrangement fee. They are
            not the same price, and the interest rate alone cannot tell you that. The APR, or annual percentage
            rate, can.
          </p>

          <h2>The difference</h2>
          <ul>
            <li>
              <strong>Interest rate</strong> (sometimes called the nominal rate) is the rate charged on the money
              you owe. It decides the interest part of each payment.
            </li>
            <li>
              <strong>APR</strong> expresses the total cost of borrowing, interest plus compulsory fees, as a
              single yearly rate. It is the rate that would produce the same cost if there were no fees.
            </li>
          </ul>

          <h2>Worked example</h2>
          <p>
            You borrow 10,000 at 8% over three years. The monthly payment is 313.36. The lender also charges a
            300 arrangement fee, taken from the loan, so you receive 9,700 but repay as if you had borrowed
            10,000.
          </p>
          <p>
            Paying 313.36 a month for 36 months on 9,700 actually received is the same as borrowing at about
            10.1%. That is the APR. On a shorter loan, the same fee pushes the APR up even more, because it is
            spread over fewer months.
          </p>

          <h2>What APR includes, and what it leaves out</h2>
          <p>
            The rules vary by country and type of loan, but APR generally includes interest and fees you must pay
            to get the loan, such as arrangement or origination fees. It usually leaves out optional extras,
            late-payment charges and early-repayment fees. For mortgages, some countries publish a separate
            figure for the overall cost over the whole term, because introductory rates make a single APR
            misleading.
          </p>

          <h2>Representative APR</h2>
          <p>
            Adverts often quote a &ldquo;representative APR&rdquo;. In the UK, for example, that is the rate that
            a set share of successful applicants receive. Others may be offered more. The rate you are actually
            offered after applying is the one to compare.
          </p>

          <h2>How to compare loans</h2>
          <ol>
            <li>Compare APRs for loans of the same amount and the same term.</li>
            <li>
              Check the total amount payable. It is the plainest figure: the sum of all payments plus fees.
            </li>
            <li>
              Check what happens if you repay early, especially if you expect to. A low APR with a large
              early-settlement fee may cost more than a slightly higher APR with none.
            </li>
            <li>Watch for flat-rate quotes, which make the headline rate look much lower than the APR.</li>
          </ol>

          <h2>Check the payment yourself</h2>
          <p>
            Enter the amount, rate and term in the <Link href="/calculators/loan-calculator">Loan Calculator</Link>{" "}
            to see the payment and total interest. To find the effective rate including a fee, enter the amount
            you actually receive and adjust the rate until the payment matches the lender&apos;s quote; that
            rate is close to the APR. The <Link href="/calculators/emi-calculator">EMI Calculator</Link> works the
            same way for monthly instalments.
          </p>

          <h2>APR on savings</h2>
          <p>
            Savings accounts quote a related figure, usually called AER or APY, which shows the yearly return
            including compounding. The <Link href="/calculators/compound-interest-calculator">Compound Interest Calculator</Link>{" "}
            shows it as the effective annual rate. For loans quoted as a flat rate, see{" "}
            <Link href="/guides/flat-vs-reducing-interest-rate">flat vs reducing balance interest</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "rule-of-72",
    topic: "Calculations",
    title: "The rule of 72: how long it takes money to double",
    seoTitle: "Rule of 72: How Long Until Your Money Doubles?",
    description:
      "Divide 72 by the interest rate to estimate how many years money takes to double. How accurate the shortcut is, and how it works for inflation and debt.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["compound-interest-calculator", "percentage-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            How long does money take to double at 6% a year? You could work through compound interest, or you can
            divide 72 by 6 and get 12 years. That shortcut is the rule of 72, and it is accurate enough for most
            everyday decisions.
          </p>

          <h2>How to use it</h2>
          <p>Years to double ≈ 72 ÷ annual rate (as a plain number, so 6 for 6%).</p>
          <p>
            It also works backwards: to double your money in 9 years, you need about 72 ÷ 9 = 8% a year.
          </p>

          <h2>How accurate it is</h2>
          <table>
            <thead>
              <tr>
                <th>Rate</th>
                <th>Rule of 72</th>
                <th>Exact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2%</td>
                <td>36 years</td>
                <td>35.0 years</td>
              </tr>
              <tr>
                <td>4%</td>
                <td>18</td>
                <td>17.7</td>
              </tr>
              <tr>
                <td>6%</td>
                <td>12</td>
                <td>11.9</td>
              </tr>
              <tr>
                <td>8%</td>
                <td>9</td>
                <td>9.0</td>
              </tr>
              <tr>
                <td>10%</td>
                <td>7.2</td>
                <td>7.3</td>
              </tr>
              <tr>
                <td>12%</td>
                <td>6</td>
                <td>6.1</td>
              </tr>
              <tr>
                <td>18%</td>
                <td>4</td>
                <td>4.2</td>
              </tr>
              <tr>
                <td>24%</td>
                <td>3</td>
                <td>3.2</td>
              </tr>
            </tbody>
          </table>
          <p>
            The exact figures assume yearly compounding. Between about 4% and 12% the rule is within a few months.
            At very low or very high rates it drifts, but it stays a useful first estimate.
          </p>

          <h2>Why 72?</h2>
          <p>
            The exact doubling time is the natural logarithm of 2, about 0.693, divided by the logarithm of
            (1 + rate). For small rates that is close to 69.3 ÷ rate. 72 is used instead because it gives
            better answers at typical rates, and because it divides neatly by 2, 3, 4, 6, 8, 9 and 12. Some people
            use 69 or 70 for continuously compounded or very low rates.
          </p>

          <h2>Inflation halves your money too</h2>
          <p>
            The rule works for anything growing at a steady rate, including prices. At 3% inflation, prices double
            in about 24 years, which means cash kept under a mattress loses half its buying power in that time. At
            6% inflation, it takes 12 years.
          </p>

          <h2>And debt doubles</h2>
          <p>
            Unpaid debt grows the same way. A credit card balance at 24% interest, with nothing paid off, doubles
            in about three years. Seeing that number is often more persuasive than the interest rate itself.
          </p>

          <h2>What fees do to doubling</h2>
          <p>
            Small annual fees look harmless until you run them through the rule. An investment growing at 7% a
            year doubles in about 72 ÷ 7 = 10.3 years. Take off a 1% annual fee and it grows at 6%, doubling in
            about 12 years. Over 30 years that is roughly three doublings against two and a half: the money ends
            up about 7.6 times larger instead of about 5.7 times.
          </p>

          <h2>Doubling more than once</h2>
          <p>
            At 8%, money doubles in about 9 years, so in 18 years it is four times as much and in 27 years eight
            times. This is why starting early matters so much: the last doubling adds more than all the previous
            ones together.
          </p>

          <h2>When you need the real number</h2>
          <p>
            For regular contributions, different compounding periods or exact balances, use the{" "}
            <Link href="/calculators/compound-interest-calculator">Compound Interest Calculator</Link>. It shows
            the final balance, the interest earned and the effective annual rate. The guide to{" "}
            <Link href="/guides/compound-interest-explained">compound interest explained</Link> covers how
            compounding frequency changes the result.
          </p>
        </>
      );
    },
  },
];
