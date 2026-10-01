import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-01";

export const moneyAndEverydayGuides: Guide[] = [
  {
    slug: "how-to-calculate-percentage-change",
    topic: "Calculations",
    title: "How to calculate percentage change — and the mistakes everyone makes",
    seoTitle: "How to Calculate Percentage Change (With Examples)",
    description:
      "The percentage change formula with worked examples, why a rise and a fall of the same size are different percentages, and percent versus percentage points.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["percentage-calculator", "discount-calculator", "grade-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Prices go up, salaries change, a score improves from one test to the next. Percentage
            change turns those differences into a single comparable number — and it is also one of the
            easiest calculations to get subtly wrong.
          </p>

          <h2>The formula</h2>
          <p>
            <strong>percentage change = (new − old) ÷ old × 100</strong>
          </p>
          <p>
            Subtract the old value from the new one, divide by the <em>old</em> value, and multiply by
            100. A positive answer is an increase; a negative one is a decrease.
          </p>
          <ul>
            <li>A price rising from 80 to 100: (100 − 80) ÷ 80 × 100 = <strong>+25%</strong>.</li>
            <li>A price falling from 100 to 80: (80 − 100) ÷ 100 × 100 = <strong>−20%</strong>.</li>
            <li>Rent rising from 1,200 to 1,290: 90 ÷ 1,200 × 100 = <strong>+7.5%</strong>.</li>
          </ul>
          <p>
            The <Link href="/calculators/percentage-calculator">Percentage Calculator</Link> has a
            percentage change mode that shows this working for any two numbers.
          </p>

          <h2>Mistake 1: dividing by the wrong number</h2>
          <p>
            The two examples above use the same gap of 20, yet one is +25% and the other −20%. That is
            not a contradiction. A percentage change is always measured against where you started,
            and the starting points differ. Dividing by the new value instead of the old one is the
            most common error, and it makes increases look smaller and decreases look bigger than
            they are.
          </p>

          <h2>Mistake 2: expecting a rise and a fall to cancel out</h2>
          <p>
            A 10% rise followed by a 10% fall does not bring you back to where you started. 100 rises
            to 110, and 10% of 110 is 11, so it falls to 99 — a 1% loss overall. A 50% fall needs a
            100% rise to recover. Successive changes multiply rather than add:
          </p>
          <p>
            <strong>overall change = (1 + first change) × (1 + second change) − 1</strong>
          </p>
          <p>
            The same applies to discounts. A 25% markup followed by a 25% discount leaves an item at
            93.75% of its original price, and two stacked discounts of 20% and 10% add up to 28% off,
            not 30%. The <Link href="/calculators/discount-calculator">Discount Calculator</Link>{" "}
            works out stacked discounts exactly.
          </p>

          <h2>Mistake 3: mixing up percent and percentage points</h2>
          <p>
            When the thing being measured is already a percentage — an interest rate, a tax rate, an
            exam pass rate — there are two ways to describe a change, and they give very different
            numbers. If a mortgage rate moves from 4% to 6%:
          </p>
          <ul>
            <li>it has risen by <strong>2 percentage points</strong> (6 − 4);</li>
            <li>it has risen by <strong>50 percent</strong> ((6 − 4) ÷ 4 × 100).</li>
          </ul>
          <p>
            Both are correct; they answer different questions. News reports sometimes use whichever
            sounds more dramatic, so it pays to notice which one is meant.
          </p>

          <h2>Mistake 4: averaging yearly changes</h2>
          <p>
            If something grows from 100 to 150 over five years, the total change is 50%, but the
            average yearly growth is not 10%. Because growth compounds, the steady yearly rate that
            gets from 100 to 150 in five years is about 8.45%. The formula for this compound annual
            growth rate is:
          </p>
          <p>
            <strong>yearly rate = (final ÷ start)^(1 ÷ years) − 1</strong>
          </p>
          <p>
            For 100 to 150 over five years: 1.5 raised to the power 0.2, minus 1, which is 0.0845, or
            8.45% a year.
          </p>

          <h2>Working backwards</h2>
          <p>
            To find an original value from a changed one, divide rather than subtract. If a price is
            126 after a 5% increase, the original was 126 ÷ 1.05 = 120 — not 126 minus 5% of 126,
            which gives 119.70. The same idea removes tax from a price: see{" "}
            <Link href="/guides/how-to-add-or-remove-vat">how to add or remove VAT</Link>.
          </p>

          <h2>When percentage change does not work</h2>
          <ul>
            <li>
              <strong>Starting from zero.</strong> Dividing by zero is undefined, so going from 0
              sales to 10 cannot be expressed as a percentage increase. Give the actual numbers
              instead.
            </li>
            <li>
              <strong>Negative starting values.</strong> A loss of −50 improving to a profit of 25 is
              hard to express meaningfully as a percentage. Again, the actual figures are clearer.
            </li>
            <li>
              <strong>Tiny bases.</strong> Going from 2 to 6 is a 200% increase, which sounds dramatic
              but is only four more. Quote the numbers alongside the percentage.
            </li>
          </ul>

          <h2>Quick reference</h2>
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Calculation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>What is 15% of 240?</td>
                <td>240 × 0.15 = 36</td>
              </tr>
              <tr>
                <td>18 is what percent of 24?</td>
                <td>18 ÷ 24 × 100 = 75%</td>
              </tr>
              <tr>
                <td>Change from 80 to 60?</td>
                <td>(60 − 80) ÷ 80 × 100 = −25%</td>
              </tr>
              <tr>
                <td>Original before a 20% rise to 120?</td>
                <td>120 ÷ 1.2 = 100</td>
              </tr>
            </tbody>
          </table>
          <p>
            For marks and grades specifically, see{" "}
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
    slug: "how-to-add-or-remove-vat",
    topic: "Calculations",
    title: "How to add or remove VAT, GST or sales tax from a price",
    seoTitle: "How to Add or Remove VAT, GST or Sales Tax",
    description:
      "Add tax to a net price, take it out of a gross price the right way, and see why subtracting the percentage gives the wrong answer — with worked examples.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["tax-calculator", "discount-calculator", "invoice-generator"],
    Body: function Body() {
      return (
        <>
          <p>
            Whether it is called VAT, GST or sales tax, the arithmetic is the same: a percentage added
            on top of a price. Adding it is easy. Taking it back out is where almost everyone gets it
            wrong the first time.
          </p>

          <h2>The words: net and gross</h2>
          <ul>
            <li>
              <strong>Net</strong> is the price before tax.
            </li>
            <li>
              <strong>Gross</strong> is the price including tax — what the customer pays.
            </li>
            <li>
              <strong>The tax</strong> is the difference between them.
            </li>
          </ul>

          <h2>Adding tax</h2>
          <p>
            <strong>gross = net × (1 + rate)</strong>
          </p>
          <p>
            At 20%, multiply by 1.2: a net price of 50 becomes 60. At 10%, multiply by 1.1: 50 becomes
            55. The tax is the gross minus the net — 10 and 5 respectively.
          </p>

          <h2>Removing tax — the right way</h2>
          <p>
            <strong>net = gross ÷ (1 + rate)</strong>
          </p>
          <p>
            At 20%, divide by 1.2: a gross price of 120 has a net price of 100 and contains 20 of tax.
          </p>
          <p>
            The tempting shortcut — taking 20% off 120 — gives 96, which is wrong. The 20% was
            calculated on the net price of 100, not on the gross of 120, so subtracting 20% of the
            gross removes too much. Always divide. The{" "}
            <Link href="/calculators/tax-calculator">Tax Calculator</Link> has a mode for each
            direction and always uses the division when extracting tax.
          </p>

          <h2>How much of a gross price is tax?</h2>
          <p>
            The tax share of a tax-inclusive price is <strong>rate ÷ (1 + rate)</strong>. A few
            common cases:
          </p>
          <table>
            <thead>
              <tr>
                <th>Rate</th>
                <th>Tax share</th>
                <th>Tax in 120</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>5%</td>
                <td>1/21 (about 4.76%)</td>
                <td>5.71 tax</td>
              </tr>
              <tr>
                <td>10%</td>
                <td>1/11 (about 9.09%)</td>
                <td>10.91 tax</td>
              </tr>
              <tr>
                <td>18%</td>
                <td>18/118 (about 15.25%)</td>
                <td>18.31 tax</td>
              </tr>
              <tr>
                <td>20%</td>
                <td>1/6 (about 16.67%)</td>
                <td>20.00 tax</td>
              </tr>
            </tbody>
          </table>
          <p>
            That is why accountants in the UK talk about &ldquo;the VAT fraction&rdquo; of one sixth at
            the 20% rate, and why in Australia and New Zealand people speak of one eleventh for 10%
            GST.
          </p>

          <h2>VAT, GST and sales tax: what differs</h2>
          <p>
            For a single price, nothing in the arithmetic. The difference is in how the tax is
            collected:
          </p>
          <ul>
            <li>
              <strong>VAT and GST</strong> are charged at each stage of the supply chain, with each
              business reclaiming the tax it paid on its own purchases. Consumer prices are usually
              shown including tax.
            </li>
            <li>
              <strong>Sales tax</strong>, as in the United States, is charged once at the final sale.
              Prices are usually shown before tax, which is added at the till, and the rate depends
              on the state and often the city or county.
            </li>
          </ul>
          <p>
            Rates differ widely between countries and often between kinds of goods. The UK&apos;s
            standard VAT rate is 20%, Germany&apos;s 19%, Australia&apos;s GST 10% and New
            Zealand&apos;s 15%; Canada combines a 5% federal GST with provincial taxes, or a single
            harmonised rate such as 13% in Ontario. Many countries apply reduced rates to food,
            books or energy. Always check the current rate for what you are pricing.
          </p>

          <h2>Discounts and tax together</h2>
          <p>
            Does it matter whether the discount or the tax is applied first? Not to the total. Both
            are multiplications, and multiplying in a different order gives the same answer: 100 with
            10% off and 20% tax is 108 either way. Shops usually present the discount first. For
            stacked discounts, see the <Link href="/calculators/discount-calculator">Discount Calculator</Link>.
          </p>

          <h2>On invoices: rounding</h2>
          <p>
            Take an invoice with three items at 0.99 each, before 20% tax. Rounded on each line, the
            tax is 0.198, which rounds to 0.20, three times: 0.60. Rounded once on the total, the tax
            is 2.97 × 0.2 = 0.594, which rounds to 0.59. When an invoice has many lines, tax can be
            rounded either way, and the two methods can differ by a cent or two. Both are legitimate; what matters is
            consistency and following any rule your tax authority sets. The{" "}
            <Link href="/generators/invoice-generator">Invoice Generator</Link> works in whole cents,
            so its lines, subtotal, tax and total always add up exactly.
          </p>

          <h2>A note on advice</h2>
          <p>
            This guide covers the arithmetic only. Whether you should charge tax, at what rate, and
            how to report it depends on your country, your business and what you sell — a question
            for your tax authority or an accountant.
          </p>
        </>
      );
    },
  },

  {
    slug: "compound-interest-explained",
    topic: "Calculations",
    title: "Compound interest explained, with real numbers",
    seoTitle: "Compound Interest Explained With Real Examples",
    description:
      "How compound interest works, how much compounding frequency really matters, the rule of 72, and why starting early beats almost everything else.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["compound-interest-calculator", "emi-calculator", "percentage-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Compound interest is interest earned on interest. That one idea explains why savings grow
            slowly and then quickly, why credit card debt gets out of hand, and why ten extra years
            can matter more than any choice of account.
          </p>

          <h2>Simple versus compound interest</h2>
          <p>
            With <strong>simple interest</strong>, you earn the same amount every year, calculated on
            the original sum. 10,000 at 5% earns 500 a year; after ten years you have 15,000.
          </p>
          <p>
            With <strong>compound interest</strong>, each year&apos;s interest is added to the balance,
            and the next year&apos;s interest is calculated on the larger figure. The first year earns
            500, the second 525, the third about 551, and so on. After ten years, compounded annually,
            the same 10,000 becomes about <strong>16,289</strong> — almost 1,300 more than simple
            interest, without any extra money paid in.
          </p>

          <h2>The formula</h2>
          <p>
            <strong>A = P × (1 + r ÷ n)^(n × t)</strong>
          </p>
          <ul>
            <li>
              <strong>P</strong> is the starting amount;
            </li>
            <li>
              <strong>r</strong> is the annual rate as a decimal, so 5% is 0.05;
            </li>
            <li>
              <strong>n</strong> is how many times a year interest is added;
            </li>
            <li>
              <strong>t</strong> is the number of years.
            </li>
          </ul>
          <p>
            The <Link href="/calculators/compound-interest-calculator">Compound Interest Calculator</Link>{" "}
            applies this, adds regular contributions, and shows the balance year by year.
          </p>

          <h2>Does compounding frequency matter?</h2>
          <p>Less than advertising suggests. The same 10,000 at 5% for ten years:</p>
          <table>
            <thead>
              <tr>
                <th>Compounded</th>
                <th>After 10 years</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Never (simple interest)</td>
                <td>15,000.00</td>
              </tr>
              <tr>
                <td>Yearly</td>
                <td>16,288.95</td>
              </tr>
              <tr>
                <td>Monthly</td>
                <td>16,470.09</td>
              </tr>
              <tr>
                <td>Daily</td>
                <td>16,486.65</td>
              </tr>
            </tbody>
          </table>
          <p>
            Going from yearly to monthly adds about 181. Going from monthly to daily adds about 17.
            The rate and the time invested matter far more. This is also why savings accounts quote
            an effective annual rate — called APY in the US or AER in the UK — alongside the
            headline rate: 5% compounded monthly is equivalent to about 5.12% compounded once a year.
          </p>

          <h2>The rule of 72</h2>
          <p>
            Divide 72 by the annual percentage rate to estimate how many years it takes for money to
            double. At 6%, about 12 years; at 9%, about 8 years. The exact figures are 11.9 and 8.04,
            so the shortcut is close enough for planning. It works in reverse for debt and inflation
            too: at 3% inflation, prices double in about 24 years.
          </p>

          <h2>Regular contributions do the heavy lifting</h2>
          <p>
            For most people, the money they keep paying in matters more than the starting sum. Saving
            200 a month at 7%, compounded monthly:
          </p>
          <ul>
            <li>
              after <strong>20 years</strong>, you have paid in 48,000 and the balance is about{" "}
              <strong>104,000</strong>;
            </li>
            <li>
              after <strong>30 years</strong>, you have paid in 72,000 and the balance is about{" "}
              <strong>244,000</strong>.
            </li>
          </ul>
          <p>
            Ten more years of the same 200 a month adds 24,000 of contributions but about 140,000 to
            the balance. That is compounding at work, and it is the strongest argument for starting
            early, even with small amounts.
          </p>

          <h2>Fees compound too</h2>
          <p>
            A yearly fee comes straight out of the rate you earn, and it compounds just like the
            returns. The same 200 a month for 30 years grows to about 244,000 at 7%, but to about
            201,000 at 6% — so a fee of one percentage point a year costs roughly 43,000, nearly a
            fifth of the final balance. Small differences in fees are worth comparing as carefully as
            differences in returns.
          </p>

          <h2>Remember inflation</h2>
          <p>
            A balance projected thirty years ahead is in future money. If prices rise by 2.5% a year,
            244,000 in thirty years buys about what 116,000 buys today. That does not make saving
            pointless — it makes it necessary — but compare projections in today&apos;s money when
            you plan.
          </p>

          <h2>Compounding works against you on debt</h2>
          <p>
            The same mechanism makes unpaid debt grow. Credit cards typically charge interest on
            unpaid interest, at rates far higher than savings earn, so a balance left to roll over
            can grow quickly. Loans with fixed instalments work differently: each payment covers the
            interest due and reduces the debt — see{" "}
            <Link href="/guides/how-emi-is-calculated">how EMI is calculated</Link>. Paying off
            expensive debt is, in effect, a guaranteed return equal to its interest rate.
          </p>

          <h2>Using the calculator sensibly</h2>
          <ul>
            <li>Use a realistic rate after fees, not the best year you have heard of.</li>
            <li>Remember investment returns vary from year to year; a fixed rate is a simplification.</li>
            <li>Try a few rates to see a range instead of a single answer.</li>
          </ul>
          <p>
            This is a mathematical illustration, not investment advice. Investments can fall as well
            as rise, and a qualified adviser can help with decisions about your own money.
          </p>
        </>
      );
    },
  },

  {
    slug: "hourly-to-annual-salary",
    topic: "Calculations",
    title: "How to convert hourly pay to an annual salary, and back",
    seoTitle: "How to Convert Hourly Pay to Annual Salary",
    description:
      "Turn an hourly rate into a yearly, monthly or weekly figure and back again, avoid the four-weeks-a-month mistake, and compare job offers fairly.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["salary-calculator", "take-home-pay-calculator", "percentage-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            One job advertises 22 an hour, another 45,000 a year, a third 3,600 a month. To compare
            them you have to put them on the same footing, and the conversions are easy to get
            slightly wrong.
          </p>

          <h2>Hourly to annual</h2>
          <p>
            <strong>annual = hourly rate × hours per week × weeks paid per year</strong>
          </p>
          <p>
            A full-time week of 40 hours, paid for all 52 weeks, is 2,080 hours a year. At 20 an hour
            that is 20 × 40 × 52 = <strong>41,600</strong> a year. For a 37.5-hour week it is 1,950
            hours, so the same 20 an hour comes to 39,000.
          </p>
          <p>
            A handy shortcut for a 40-hour week is to multiply the hourly rate by 2,000: 20 an hour
            is roughly 40,000 a year. The shortcut assumes about 50 paid weeks, which makes it a
            slightly cautious estimate.
          </p>

          <h2>Annual to hourly</h2>
          <p>
            Divide the salary by the hours worked in a year. A salary of 50,000 for a 40-hour week is
            50,000 ÷ 2,080 = <strong>24.04</strong> an hour. If you take unpaid weeks off, you work
            fewer hours for the same salary, so your effective hourly rate rises.
          </p>

          <h2>The months-and-weeks trap</h2>
          <p>
            A month is not four weeks. A year has 52.18 weeks, so an average month is about 4.35
            weeks. Converting a weekly wage to a monthly one by multiplying by four understates it by
            about 8%:
          </p>
          <ul>
            <li>800 a week × 4 = 3,200 — too low.</li>
            <li>800 a week × 52 ÷ 12 = about 3,467 — correct.</li>
          </ul>
          <p>
            The safe method for any conversion is to go through the annual figure: turn whatever you
            have into a yearly amount, then divide by 12 for months, 52 for weeks, or the number of
            hours you work. The <Link href="/calculators/salary-calculator">Salary Calculator</Link>{" "}
            does exactly that and shows every period at once.
          </p>

          <h2>Comparing job offers fairly</h2>
          <p>A raw salary comparison misses things that change what each hour is really worth:</p>
          <ul>
            <li>
              <strong>Paid holiday.</strong> A salaried job with paid holiday pays you for weeks you
              do not work; an hourly contract may not. Compare the annual figure for the time you
              will actually be paid.
            </li>
            <li>
              <strong>Hours.</strong> 45,000 for 35 hours a week is a better hourly rate than 48,000
              for 45 hours — about 24.73 against 20.51.
            </li>
            <li>
              <strong>Overtime.</strong> Many hourly jobs pay a higher rate for hours beyond a
              threshold; many salaried jobs do not pay extra for longer days.
            </li>
            <li>
              <strong>Pension and benefits.</strong> An employer pension contribution, health cover or
              a bonus can be worth several percent of salary.
            </li>
          </ul>
          <p>
            To see how much more one offer pays than another, the{" "}
            <Link href="/calculators/percentage-calculator">Percentage Calculator</Link> gives the
            difference as a percentage of your current pay.
          </p>

          <h2>What a pay rise is worth</h2>
          <p>
            A percentage rise is easiest to judge in the units you think in. A 5% rise on 41,600 a
            year is 2,080 more a year — 40 a week, or 1.00 more an hour on a 40-hour week. Before tax,
            of course: the amount you keep depends on your tax band.
          </p>

          <h2>Freelance day rates</h2>
          <p>
            A freelancer comparing a day rate with a salary needs to allow for the days they are not
            paid. A full-time employee is paid for about 260 weekdays a year, including paid holiday
            and public holidays, but works roughly 225–235 of them. Dividing a 50,000 salary by about
            230 working days gives roughly 217 a day — and a freelancer charging that would earn less
            than the employee, because they also pay for their own holidays, sick days, pension,
            equipment and the gaps between contracts. Day rates are higher than salaries for good
            reason.
          </p>

          <h2>Gross is not what you take home</h2>
          <p>
            Every figure above is gross pay, before income tax, social security contributions,
            pension and other deductions. Take-home pay depends on your country and circumstances. In
            the UK in 2026/27, for example, a salary of £30,000 leaves £25,119.60 a year after income
            tax and National Insurance, before any pension or student loan. The{" "}
            <Link href="/calculators/take-home-pay-calculator">Take-Home Pay Calculator</Link>{" "}
            estimates this for the UK, Canada, Australia and India, with every deduction listed.
          </p>

          <h2>Part-time and irregular hours</h2>
          <p>
            For part-time work, use your actual weekly hours: 20 hours a week at 18 an hour is 18,720
            a year for 52 paid weeks. For irregular hours, take the average over several months
            rather than a single week. For pay that is quoted per day, multiply by the days you work
            in a week and then follow the same steps.
          </p>

          <h2>Quick reference at 40 hours a week</h2>
          <table>
            <thead>
              <tr>
                <th>Hour</th>
                <th>Week</th>
                <th>Month</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>15</td>
                <td>600</td>
                <td>2,600</td>
                <td>31,200</td>
              </tr>
              <tr>
                <td>20</td>
                <td>800</td>
                <td>3,467</td>
                <td>41,600</td>
              </tr>
              <tr>
                <td>25</td>
                <td>1,000</td>
                <td>4,333</td>
                <td>52,000</td>
              </tr>
              <tr>
                <td>30</td>
                <td>1,200</td>
                <td>5,200</td>
                <td>62,400</td>
              </tr>
            </tbody>
          </table>
          <p>Monthly figures are the yearly figure divided by 12, rounded to the nearest whole unit.</p>
        </>
      );
    },
  },

  {
    slug: "how-much-paint-do-i-need",
    topic: "Calculations",
    title: "How much paint do I need? Measuring a room properly",
    seoTitle: "How Much Paint Do I Need? Room Calculation Guide",
    description:
      "Measure a room, work out the wall area, allow for doors, windows and coats, and turn it into the right number of tins — with metric and imperial examples.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["paint-coverage-calculator", "area-converter", "length-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            Buy too little paint and you end up making a second trip, hoping the new tin matches.
            Buy far too much and it sits in a shed for a decade. Working out the right amount takes a
            tape measure and five minutes.
          </p>

          <h2>What to measure</h2>
          <ul>
            <li>The <strong>length</strong> and <strong>width</strong> of the room, along the floor.</li>
            <li>The <strong>height</strong> of the walls, from floor to ceiling.</li>
            <li>The <strong>doors and windows</strong> — how many, and roughly how big.</li>
          </ul>
          <p>
            Measure in one unit throughout, metres or feet. If your tape gives you a mixture, the{" "}
            <Link href="/converters/length-converter">Length Converter</Link> converts it.
          </p>

          <h2>Work out the wall area</h2>
          <p>
            <strong>wall area = 2 × (length + width) × height</strong>
          </p>
          <p>
            That is the distance around the room multiplied by the height. For a 4 × 3 metre bedroom
            with 2.5 metre walls: 2 × (4 + 3) × 2.5 = <strong>35 m²</strong>.
          </p>
          <p>
            Then subtract the doors and windows. A standard internal door is roughly 1.9 m² and an
            average window around 1.5 m², though it is worth measuring large windows. One door and one
            window leave 35 − 1.9 − 1.5 = <strong>31.6 m²</strong> to paint.
          </p>

          <h2>Coats and coverage</h2>
          <p>
            Every tin states its coverage, usually as square metres per litre or square feet per
            gallon. Interior wall paints typically cover about 10–14 m² per litre (roughly 350–400
            square feet per US gallon) on a smooth surface that has been painted before.
          </p>
          <p>
            Plan on <strong>two coats</strong> for almost every job. One coat is only enough when
            repainting in the same colour over a sound surface; a big colour change, especially dark
            to light, may need three.
          </p>
          <p>
            <strong>paint needed = area × coats ÷ coverage</strong>, plus about 10% for waste and
            touch-ups.
          </p>

          <h2>A worked example (metric)</h2>
          <ol>
            <li>Wall area after the door and window: 31.6 m².</li>
            <li>Two coats: 31.6 × 2 = 63.2 m².</li>
            <li>At 12 m² per litre: 63.2 ÷ 12 = 5.27 litres.</li>
            <li>Plus 10%: about 5.8 litres.</li>
          </ol>
          <p>
            In practice that is one 5-litre tin and one 1-litre tin. The{" "}
            <Link href="/calculators/paint-coverage-calculator">Paint and Wallpaper Calculator</Link>{" "}
            does these steps for you and suggests the combination of standard tin sizes that covers
            what you need with the fewest containers.
          </p>

          <h2>A worked example (imperial)</h2>
          <p>
            A 12 × 10 foot room with 8-foot walls: 2 × (12 + 10) × 8 = 352 square feet. Subtracting a
            typical 3 × 7 foot door (21 sq ft) and a 15 sq ft window leaves 316 square feet. Two coats
            at 375 square feet per gallon need 316 × 2 ÷ 375 = 1.69 gallons, or about 1.85 with 10%
            extra — so buy 2 gallons.
          </p>

          <h2>Things that need more paint</h2>
          <ul>
            <li>
              <strong>New plaster</strong> soaks up paint. Use a thinned mist coat or a primer first,
              as the paint maker recommends.
            </li>
            <li>
              <strong>Rough or textured walls</strong> have more surface than their measurements
              suggest.
            </li>
            <li>
              <strong>Strong colour changes</strong> may need an extra coat or a tinted undercoat.
            </li>
          </ul>

          <h2>Ceilings and woodwork</h2>
          <p>
            A ceiling usually takes a different paint, so work it out separately: its area is simply
            length × width. The 4 × 3 m bedroom has a 12 m² ceiling, which at two coats and 12 m² per
            litre needs about 2.2 litres with the waste allowance. Skirting boards, door frames and
            window frames are usually painted in a different finish and need only a small tin.
          </p>

          <h2>Wallpaper is counted differently</h2>
          <p>
            Wallpaper is bought in rolls and hung in full-height strips called drops. How many drops
            a roll gives depends on the wall height and the pattern repeat — the distance before the
            pattern starts again, which has to line up from one strip to the next. A large repeat
            wastes more paper. Doors and windows are not usually subtracted, because offcuts rarely
            match the pattern. Switch the calculator to wallpaper to count rolls this way.
          </p>

          <h2>Before you buy</h2>
          <ul>
            <li>Buy all the paint or paper for a room at the same time; batches can differ slightly in colour.</li>
            <li>Check the coverage figure on the actual product you are buying.</li>
            <li>Keep a little left over, labelled with the room and colour, for touch-ups.</li>
          </ul>
          <p>
            Floor areas for carpets and flooring are calculated as length × width; the{" "}
            <Link href="/converters/area-converter">Area Converter</Link> switches between square
            metres and square feet.
          </p>
        </>
      );
    },
  },

  {
    slug: "attendance-percentage-75-rule",
    topic: "Calculations",
    title: "How to calculate attendance percentage — and how many classes you can miss",
    seoTitle: "How to Calculate Attendance Percentage (75% Rule)",
    description:
      "Work out your attendance percentage, how many classes you can still miss above a 75% requirement, and how many you need to attend to get back above it.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["attendance-calculator", "percentage-calculator", "grade-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Many colleges and universities set a minimum attendance — 75% is the most common figure —
            below which students can be stopped from sitting exams. Knowing exactly where you stand,
            and how much room you have, takes one formula and a little algebra.
          </p>

          <h2>Your attendance percentage</h2>
          <p>
            <strong>attendance % = classes attended ÷ classes held × 100</strong>
          </p>
          <p>
            Attending 33 of 40 classes is 33 ÷ 40 × 100 = <strong>82.5%</strong>. Count only classes
            that were actually held; a cancelled class is not an absence.
          </p>

          <h2>How many classes can I miss?</h2>
          <p>
            Suppose you have attended 36 of 40 classes, which is 90%, and the requirement is 75%. If
            you miss the next <em>s</em> classes, your attendance becomes 36 ÷ (40 + s). It stays at
            or above 75% as long as:
          </p>
          <p>
            <strong>36 ÷ (40 + s) ≥ 0.75, so 40 + s ≤ 48, so s ≤ 8</strong>
          </p>
          <p>
            You could miss the next 8 classes and still be at exactly 75% (36 out of 48). Miss a
            ninth and you drop below. The{" "}
            <Link href="/calculators/attendance-calculator">Attendance Calculator</Link> works this
            out for any figures.
          </p>
          <p>
            A useful rule of thumb: once you are exactly at 75%, you can miss one class for every three
            you attend and stay there. That is just 75% restated — three out of every four.
          </p>

          <h2>How many classes do I need to attend to get back to 75%?</h2>
          <p>
            Now suppose you have attended 28 of 40, which is 70%. If you attend the next <em>x</em>{" "}
            classes in a row, your attendance becomes (28 + x) ÷ (40 + x). You need:
          </p>
          <p>
            <strong>(28 + x) ÷ (40 + x) ≥ 0.75, so 28 + x ≥ 30 + 0.75x, so x ≥ 8</strong>
          </p>
          <p>
            Eight consecutive classes bring you to 36 out of 48 — exactly 75%. Notice how much harder
            recovering is than slipping: being five percentage points short took eight perfect classes
            to fix.
          </p>

          <h2>When it can no longer be reached</h2>
          <p>
            There is a limit that catches people out. If you have attended 20 of 40 classes (50%) and
            only 10 classes remain in the term, the best you can possibly finish on is 30 out of 50 —
            60%. No amount of effort reaches 75% in the time left. The calculator checks your target
            against the classes remaining and tells you plainly when that has happened, so you can
            speak to your department early instead of discovering it at exam time.
          </p>

          <h2>A general formula</h2>
          <p>For anyone who prefers to work it out by hand, with a requirement written as a decimal r (0.75 for 75%):</p>
          <ul>
            <li>
              <strong>Classes you can miss</strong> = attended ÷ r − held, rounded down.
            </li>
            <li>
              <strong>Classes you must attend</strong> = (r × held − attended) ÷ (1 − r), rounded up.
            </li>
          </ul>
          <p>
            Check with the examples: 36 ÷ 0.75 − 40 = 8 classes to miss, and (0.75 × 40 − 28) ÷ 0.25 =
            8 classes to attend.
          </p>

          <h2>Rules vary — check yours</h2>
          <ul>
            <li>
              <strong>Per subject or overall?</strong> Some institutions apply the requirement to each
              course separately, some to the total. A healthy overall figure can hide one course that
              is below the line.
            </li>
            <li>
              <strong>Lectures, labs and tutorials</strong> may be counted separately, or labs may
              count for more.
            </li>
            <li>
              <strong>Medical and approved absences</strong> are sometimes excused or
              &ldquo;condoned&rdquo; up to a limit, usually with documents submitted promptly.
            </li>
            <li>
              <strong>Late arrivals</strong> may count as absences after a certain number of minutes.
            </li>
          </ul>
          <p>
            Your student handbook or department office is the authority on all of these; the
            calculator simply uses the figures you enter.
          </p>

          <h2>Keep a buffer</h2>
          <p>
            The number of classes you can miss is a safety margin for illness and emergencies, not a
            target. Spending it early leaves nothing for the week you genuinely cannot attend.
            Checking your figures every few weeks, rather than at the end of term, is the simplest way
            to avoid an unpleasant surprise. For the marks side of the same term, see{" "}
            <Link href="/guides/test-score-to-percentage-and-grade">
              how to turn a test score into a percentage and a letter grade
            </Link>
            .
          </p>
        </>
      );
    },
  },
];
