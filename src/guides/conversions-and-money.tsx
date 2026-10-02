import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-02";

export const conversionsAndMoneyGuides: Guide[] = [
  {
    slug: "how-to-calculate-a-discount",
    topic: "Calculations",
    title: "How to calculate a discount, a sale price and a stacked offer",
    seoTitle: "How to Calculate a Discount and a Sale Price",
    description:
      "Work out a sale price, the real saving from stacked discounts, an original price from a sale price, and whether a multi-buy is actually a bargain.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["discount-calculator", "percentage-calculator", "tax-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            &ldquo;30% off, plus an extra 15% for members.&rdquo; &ldquo;Was 80, now 60.&rdquo;
            &ldquo;Three for two.&rdquo; Shops present discounts in many ways, and a minute of arithmetic
            tells you what each one is really worth.
          </p>

          <h2>A single discount</h2>
          <p>
            <strong>sale price = original × (1 − discount)</strong>
          </p>
          <p>
            20% off 49.99 is 49.99 × 0.8 = 39.99. The saving is the difference, 10.00. The{" "}
            <Link href="/calculators/discount-calculator">Discount Calculator</Link> shows the sale
            price, the saving and the effective discount together.
          </p>

          <h2>Stacked discounts do not add up</h2>
          <p>
            When two discounts apply one after another, the second is taken off the already reduced
            price. A 120 coat with 30% off and then an extra 15%:
          </p>
          <ol>
            <li>120 × 0.70 = 84.</li>
            <li>84 × 0.85 = 71.40.</li>
          </ol>
          <p>
            You pay 71.40 and save 48.60 — an effective discount of 40.5%, not the 45% the two numbers
            seem to promise. Likewise, 20% off and then 10% off is 28% off, not 30%. To combine discounts,
            multiply what each leaves you to pay: 0.8 × 0.9 = 0.72, so you pay 72%.
          </p>

          <h2>Working back to the original price</h2>
          <p>
            To check a &ldquo;was&rdquo; price, divide the sale price by what is left after the discount.
            An item at 45 after 25% off was 45 ÷ 0.75 = 60. Adding 25% back on to 45 gives 56.25, which is
            wrong — the 25% was taken from 60, not from 45.
          </p>

          <h2>Is the deal really a deal?</h2>
          <ul>
            <li>
              <strong>Compare unit prices.</strong> 500 g for 3.50 is 0.70 per 100 g; 750 g for 4.80 is
              0.64 per 100 g. The bigger pack without a discount label can be the better buy.
            </li>
            <li>
              <strong>&ldquo;Buy one, get one free&rdquo;</strong> is half price per item only if you
              wanted two. If you needed one, you paid full price for it.
            </li>
            <li>
              <strong>&ldquo;Up to 70% off&rdquo;</strong> means some items, usually a few, carry the
              largest discount.
            </li>
            <li>
              <strong>Percentages and fixed amounts:</strong> 10 off a 40 item is 25% off; 10 off a 200
              item is 5%. Convert both to the same terms before comparing offers.
            </li>
          </ul>

          <h2>Discounts in your head</h2>
          <ul>
            <li>
              <strong>10% off:</strong> move the decimal point one place and subtract. 10% of 64 is 6.40, so
              the price is 57.60.
            </li>
            <li>
              <strong>20% off:</strong> double the 10% figure. 20% of 64 is 12.80.
            </li>
            <li>
              <strong>25% off:</strong> take a quarter. 25% of 64 is 16.
            </li>
            <li>
              <strong>15% off:</strong> 10% plus half of that again. 6.40 + 3.20 = 9.60.
            </li>
          </ul>
          <p>Close enough for a shop floor; use the calculator when the figure matters.</p>

          <h2>Discounts and tax</h2>
          <p>
            Whether the discount comes before or after tax does not change the total, because both are
            multiplications. Shops usually discount first and then add tax to the reduced price. To add or
            remove tax itself, use the <Link href="/calculators/tax-calculator">Tax Calculator</Link> — and
            remember that taking tax out of a price means dividing, not subtracting.
          </p>

          <h2>Discounts as percentage change</h2>
          <p>
            A discount is just a percentage decrease, so the{" "}
            <Link href="/calculators/percentage-calculator">Percentage Calculator</Link> can confirm one:
            from 80 to 60 is a 25% decrease. For more on how percentages trip people up, see{" "}
            <Link href="/guides/how-to-calculate-percentage-change">how to calculate percentage change</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "weekly-vs-monthly-loan-payments",
    topic: "Calculations",
    title: "Weekly, fortnightly or monthly loan payments: which costs less?",
    seoTitle: "Weekly vs Fortnightly vs Monthly Loan Payments",
    description:
      "How payment frequency changes the total interest on a loan, why the saving is small unless you pay more, and how “accelerated” fortnightly payments work.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["loan-calculator", "emi-calculator", "mortgage-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Lenders often offer weekly or fortnightly repayments as well as monthly ones, sometimes with a
            claim that paying more often saves thousands. Paying more often does save a little. The big
            savings come from something slightly different.
          </p>

          <h2>Why frequency matters at all</h2>
          <p>
            Interest is charged on the balance you owe. Each payment reduces that balance, so paying more
            often means the balance falls a little sooner, and slightly less interest builds up between
            payments.
          </p>

          <h2>The same loan, three ways</h2>
          <p>Borrowing 20,000 at 8% a year over 5 years, with the amount of each payment and the total interest:</p>
          <table>
            <thead>
              <tr>
                <th>Paid</th>
                <th>Payment</th>
                <th>Interest</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Monthly</td>
                <td>405.53</td>
                <td>4,331.62</td>
              </tr>
              <tr>
                <td>Fortnightly</td>
                <td>186.89</td>
                <td>4,296.48</td>
              </tr>
              <tr>
                <td>Weekly</td>
                <td>93.39</td>
                <td>4,281.08</td>
              </tr>
            </tbody>
          </table>
          <p>
            Paying weekly instead of monthly saves about 50 over five years. Real, but small. The{" "}
            <Link href="/calculators/loan-calculator">Loan Calculator</Link> shows these figures and a
            full schedule for each frequency.
          </p>

          <h2>Where the big savings come from: paying more</h2>
          <p>
            The impressive savings people quote usually come from &ldquo;accelerated&rdquo; fortnightly
            payments: paying half of the monthly amount every two weeks. A year has 26 fortnights, so you
            make 26 half-payments — the equivalent of 13 monthly payments instead of 12. That extra
            payment each year goes straight to the balance.
          </p>
          <p>Worked out with a simple model:</p>
          <ul>
            <li>
              On the 20,000 loan, paying 202.77 every fortnight clears it in about 4½ years, with about
              3,870 of interest — around 460 less than monthly.
            </li>
            <li>
              On a 280,000 mortgage at 6.5% over 30 years, paying half the monthly 1,769.79 every two weeks
              clears it in about 24 years, with roughly 82,000 less interest.
            </li>
          </ul>
          <p>
            The saving is not caused by the frequency itself; it is caused by paying the equivalent of an
            extra month each year. You could achieve almost exactly the same by paying monthly and adding
            one-twelfth extra to each payment.
          </p>

          <h2>Fortnightly is not the same as twice a month</h2>
          <p>
            Paying every two weeks gives 26 payments a year. Paying twice a month — on the 1st and the 15th,
            say — gives 24, exactly the same yearly total as monthly. Only the fortnightly schedule produces
            the extra month&apos;s worth of payments. When a lender offers a &ldquo;bi-weekly&rdquo; plan,
            check which one they mean, and whether each payment is half the monthly amount or recalculated.
          </p>

          <h2>Matching payments to pay day</h2>
          <p>
            The best reason to choose a frequency is your income. If you are paid weekly or fortnightly,
            matching your loan payments to pay day makes budgeting easier and avoids the squeeze of one
            large monthly payment. That convenience is often worth more than the small interest
            difference.
          </p>

          <h2>Check before switching</h2>
          <ul>
            <li>Some lenders charge to change payment frequency, or for overpaying.</li>
            <li>
              Some apply extra payments to future instalments rather than reducing the balance. Ask how
              overpayments are applied.
            </li>
            <li>Fees and insurance are not included in these figures; compare total costs from the lender.</li>
          </ul>
          <p>
            For how each payment splits between interest and principal, see{" "}
            <Link href="/guides/how-emi-is-calculated">how EMI is calculated</Link>; for home loans with tax
            and insurance, the <Link href="/calculators/mortgage-calculator">Mortgage Calculator</Link>.
            These are illustrations, not financial advice.
          </p>
        </>
      );
    },
  },

  {
    slug: "order-of-operations-calculator",
    topic: "Calculations",
    title: "Order of operations: why 2 + 3 × 4 is 14, not 20",
    seoTitle: "Order of Operations Explained: 2 + 3 × 4 = 14",
    description:
      "The rules a scientific calculator follows — brackets, powers, multiplication and division, addition and subtraction — plus degrees versus radians and common errors.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["scientific-calculator", "percentage-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Type 2 + 3 × 4 into a basic calculator that works left to right and you may get 20. A
            scientific calculator gives 14. The second is correct, because mathematics has an agreed order
            for working out an expression.
          </p>

          <h2>The order</h2>
          <ol>
            <li>
              <strong>Brackets</strong> — anything inside parentheses first.
            </li>
            <li>
              <strong>Powers</strong> — exponents such as 2^3.
            </li>
            <li>
              <strong>Multiplication and division</strong> — equal rank, worked left to right.
            </li>
            <li>
              <strong>Addition and subtraction</strong> — equal rank, worked left to right.
            </li>
          </ol>
          <p>
            Schools teach this as BODMAS, BIDMAS or PEMDAS; the letters differ, the rules are the same.
          </p>

          <h2>Worked examples</h2>
          <ul>
            <li>2 + 3 × 4 = 2 + 12 = <strong>14</strong></li>
            <li>(2 + 3) × 4 = 5 × 4 = <strong>20</strong></li>
            <li>10 ÷ 2 × 5 = 5 × 5 = <strong>25</strong> — left to right, not 10 ÷ 10</li>
            <li>2^3^2 = 2^9 = <strong>512</strong> — powers are worked from the right</li>
          </ul>
          <p>
            The last one surprises people. Stacked powers are evaluated from the top down, so 2^3^2 means 2
            to the power of 9. If you meant (2^3)^2, which is 64, write the brackets.
          </p>

          <h2>Using the scientific calculator</h2>
          <p>
            Type a whole expression into the <Link href="/calculators/scientific-calculator">Scientific
            Calculator</Link> and press Enter. It follows the order above, keeps a history you can click
            to reuse, and has memory keys for a running total. You can type on your keyboard as well as
            using the keypad.
          </p>
          <p>Supported functions include:</p>
          <ul>
            <li>sin, cos, tan and their inverses, plus sinh, cosh and tanh;</li>
            <li>log (base 10), ln (natural), log2, square and cube roots, abs and exp;</li>
            <li>floor, ceil, round, factorial with !, and the constants π and e.</li>
          </ul>

          <h2>Degrees or radians</h2>
          <p>
            Trigonometric functions depend on the angle unit. In degrees, sin(30) is 0.5. In radians,
            sin(30) is about −0.988, because 30 radians is a very different angle. If a trigonometry answer
            looks wrong, check the mode first; the current mode is shown next to the input.
          </p>

          <h2>Viral puzzles and ambiguous expressions</h2>
          <p>
            Puzzles such as 8 ÷ 2(2 + 2) circulate online because people get different answers — 16 or 1.
            The disagreement is about whether a multiplication written without a sign, as in 2(2 + 2), binds
            more tightly than ordinary division. Conventions differ between textbooks and calculators, so the
            expression is genuinely ambiguous. The fix is not to argue about the rule but to write the
            brackets: (8 ÷ 2) × (2 + 2) is 16, and 8 ÷ (2 × (2 + 2)) is 1. Different calculators — even the
            one on your phone in its basic and scientific layouts — may follow different conventions, so
            unambiguous input is the only reliable kind.
          </p>

          <h2>Errors that are actually right</h2>
          <ul>
            <li>
              <strong>log of zero or a negative number</strong> is undefined in real numbers, so it
              produces an error rather than a misleading result.
            </li>
            <li>
              <strong>Unbalanced brackets</strong> are reported, rather than guessed at.
            </li>
            <li>
              <strong>Unknown names</strong> — a mistyped function — are named in the error so you can fix
              them.
            </li>
          </ul>

          <h2>Tips for fewer mistakes</h2>
          <ul>
            <li>When in doubt, add brackets. Extra brackets never change a correct answer.</li>
            <li>Write the whole calculation as one expression rather than chaining partial results.</li>
            <li>Estimate first: if you expect about 50 and get 5,000, something is out of place.</li>
          </ul>
          <p>
            For percentages — a percentage of a number, percentage change, adding tax — the{" "}
            <Link href="/calculators/percentage-calculator">Percentage Calculator</Link> lays out the
            working for you.
          </p>
        </>
      );
    },
  },

  {
    slug: "currency-conversion-and-fees",
    topic: "Calculations",
    title: "Currency conversion: the real rate, the bank's rate and the hidden fees",
    seoTitle: "Currency Conversion: Real Rates and Hidden Fees",
    description:
      "What the mid-market exchange rate is, why your bank or card gives less, how to compare providers, and the card-terminal choice that costs travellers money.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["currency-converter", "percentage-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Search for an exchange rate and you get one number. Change money at a bank, an airport kiosk or
            through your card, and you get a different, worse one. The gap is how most currency providers
            earn money — and it is often bigger than the fee they advertise.
          </p>

          <h2>The mid-market rate</h2>
          <p>
            Banks trade currencies with each other at a buying price and a selling price. The midpoint
            between them is the mid-market rate — the fairest single figure, and the one news reports
            quote. The <Link href="/converters/currency-converter">Currency Converter</Link> uses the
            European Central Bank&apos;s daily reference rates, published each working day at about 16:00
            Central European Time, and shows the date of the rate it used. There are no updates at weekends
            or on European public holidays.
          </p>
          <p>
            Only the currency codes are used to look up the rate. The amount you type stays in your
            browser.
          </p>

          <h2>Why you get less</h2>
          <p>
            Retail providers add a margin to the mid-market rate, often between 0.5% and 4%, and may also
            charge a separate fee. Suppose the mid-market rate is 1.10 and you change 1,000:
          </p>
          <ul>
            <li>at the mid-market rate you would receive 1,100;</li>
            <li>with a 3% margin you receive about 1,067 — a cost of 33, even with &ldquo;no fee&rdquo;.</li>
          </ul>
          <p>
            &ldquo;Zero commission&rdquo; does not mean free; it usually means the cost is built into the
            rate.
          </p>

          <h2>Comparing providers properly</h2>
          <p>
            Ask each provider how much of the other currency you will actually receive for a fixed amount,
            after all fees. Then compare that with the mid-market figure. The difference, as a percentage
            of the mid-market amount, is your true cost — the{" "}
            <Link href="/calculators/percentage-calculator">Percentage Calculator</Link> works it out. For
            larger transfers, a fraction of a percentage point is real money.
          </p>

          <h2>Paying by card abroad</h2>
          <p>
            Card terminals and cash machines abroad often offer to charge you in your home currency. This
            is called dynamic currency conversion, and it is almost always worse than choosing the local
            currency, because the terminal&apos;s provider sets its own rate. When asked, choose to pay in
            the local currency and let your card issuer convert it.
          </p>
          <p>
            Check your card&apos;s foreign transaction fee too. Some cards charge around 3% on every
            purchase abroad; others charge nothing.
          </p>

          <h2>Cash</h2>
          <p>
            Exchange desks at airports and stations are usually among the most expensive options. If you
            need cash, withdrawing a moderate amount from a bank cash machine on arrival, in the local
            currency, is usually cheaper — but check your bank&apos;s withdrawal fees.
          </p>

          <h2>What the reference rate is not</h2>
          <ul>
            <li>It is not a quote. No one will necessarily exchange money for you at that rate.</li>
            <li>It is not for accounting or tax. Those need the official rate your authority specifies for a given date.</li>
            <li>It is not live. Rates move constantly during trading hours; this is a daily reference figure.</li>
          </ul>
          <p>
            The converter covers around thirty widely traded currencies. Pegged and thinly traded
            currencies are not in the reference feed.
          </p>
        </>
      );
    },
  },

  {
    slug: "height-in-feet-and-centimetres",
    topic: "Calculations",
    title: "Height in feet and inches to centimetres, and back",
    seoTitle: "Height Conversion: Feet and Inches to cm",
    description:
      "Convert a height between feet and inches and centimetres exactly, with a quick reference table and the mistakes that put conversions an inch out.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["length-converter", "bmi-calculator", "shoe-size-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            Forms, dating profiles, medical records and clothing sizes ask for height in different units
            depending on the country. Converting is exact — the inch is defined as exactly 2.54
            centimetres — but feet and inches together trip people up.
          </p>

          <h2>Feet and inches to centimetres</h2>
          <ol>
            <li>Multiply the feet by 12 and add the inches to get a total in inches.</li>
            <li>Multiply by 2.54.</li>
          </ol>
          <p>
            5 ft 9 in is 5 × 12 + 9 = 69 inches, and 69 × 2.54 = <strong>175.26 cm</strong>.
          </p>

          <h2>Centimetres to feet and inches</h2>
          <ol>
            <li>Divide by 2.54 to get inches.</li>
            <li>Divide by 12: the whole number is feet, and the remainder is inches.</li>
          </ol>
          <p>
            170 cm ÷ 2.54 = 66.93 inches. 66.93 ÷ 12 = 5 with 6.93 left over, so 170 cm is{" "}
            <strong>5 ft 6.9 in</strong>, usually rounded to 5 ft 7 in.
          </p>

          <h2>Quick reference</h2>
          <table>
            <thead>
              <tr>
                <th>Feet and inches</th>
                <th>Centimetres</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>5 ft 0 in</td>
                <td>152.4</td>
              </tr>
              <tr>
                <td>5 ft 4 in</td>
                <td>162.6</td>
              </tr>
              <tr>
                <td>5 ft 6 in</td>
                <td>167.6</td>
              </tr>
              <tr>
                <td>5 ft 8 in</td>
                <td>172.7</td>
              </tr>
              <tr>
                <td>5 ft 10 in</td>
                <td>177.8</td>
              </tr>
              <tr>
                <td>6 ft 0 in</td>
                <td>182.9</td>
              </tr>
              <tr>
                <td>6 ft 2 in</td>
                <td>188.0</td>
              </tr>
            </tbody>
          </table>
          <p>
            Going the other way: 160 cm is about 5 ft 3 in, 180 cm about 5 ft 11 in and 190 cm about 6 ft
            3 in. The <Link href="/converters/length-converter">Length Converter</Link> converts any value
            exactly.
          </p>

          <h2>Common mistakes</h2>
          <ul>
            <li>
              <strong>Treating 5.9 feet as 5 ft 9 in.</strong> 5.9 feet is 5 ft 10.8 in, because a foot
              has 12 inches, not 10.
            </li>
            <li>
              <strong>Rounding twice.</strong> Round only the final answer; rounding the inches first and
              then converting can put you an inch out.
            </li>
            <li>
              <strong>Using 2.5 instead of 2.54.</strong> Over a whole height, that shortcut is nearly 3 cm
              out: 69 inches comes to 172.5 cm instead of 175.26.
            </li>
          </ul>

          <h2>Which form does a form want?</h2>
          <ul>
            <li>
              <strong>Metres to two decimals</strong>, common on medical and official forms: 175.26 cm is
              1.75 m.
            </li>
            <li>
              <strong>Whole centimetres</strong>, common on passports and ID applications: round to the nearest
              centimetre, 175.
            </li>
            <li>
              <strong>Inches only</strong>, used on some US forms: 5 ft 9 in is 69 inches.
            </li>
            <li>
              <strong>Feet and inches</strong>, written 5′9″ or 5 ft 9 in — not 5.9.
            </li>
          </ul>
          <p>
            When a form gives a box for feet and another for inches, the inches box should hold 0 to 11; a
            height of 5 ft 12 in is 6 ft 0 in.
          </p>

          <h2>Measuring height accurately</h2>
          <p>
            Stand barefoot with your back and heels against a wall, looking straight ahead. Have someone
            rest a flat object such as a book on your head, level, and mark the wall underneath it. Measure
            from the floor to the mark. Height is slightly greater in the morning than in the evening, by
            up to a centimetre or so.
          </p>

          <h2>Where height is used</h2>
          <p>
            For body mass index, height is needed in metres: 175.26 cm is 1.7526 m. The{" "}
            <Link href="/calculators/bmi-calculator">BMI Calculator</Link> accepts either feet and inches
            or centimetres and converts for you. For shoes, the relevant measurement is foot length rather
            than height — see the <Link href="/converters/shoe-size-converter">Shoe Size Converter</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "acres-hectares-and-land-units",
    topic: "Calculations",
    title: "Acres, hectares, square feet and local land units explained",
    seoTitle: "Acres, Hectares and Land Area Units Explained",
    description:
      "Convert land and floor areas between acres, hectares, square metres and square feet, picture how big each one is, and handle local units such as ropani and cent.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["area-converter", "length-converter", "paint-coverage-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Property listings, land records and planning documents use a confusing mix of units:
            square feet for flats, square metres for floor plans, acres or hectares for land, and local
            units in many countries. All of them are exact multiples of each other.
          </p>

          <h2>The main units</h2>
          <table>
            <thead>
              <tr>
                <th>Unit</th>
                <th>In square metres</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Square foot</td>
                <td>0.0929</td>
              </tr>
              <tr>
                <td>Square yard</td>
                <td>0.8361</td>
              </tr>
              <tr>
                <td>Acre</td>
                <td>4,046.86</td>
              </tr>
              <tr>
                <td>Hectare</td>
                <td>10,000</td>
              </tr>
              <tr>
                <td>Square kilometre</td>
                <td>1,000,000 (100 hectares)</td>
              </tr>
            </tbody>
          </table>
          <p>
            A square metre is about 10.76 square feet. A hectare is about 2.471 acres, and an acre about
            0.405 hectares. The <Link href="/converters/area-converter">Area Converter</Link> converts
            between all of them exactly.
          </p>

          <h2>Picturing the sizes</h2>
          <ul>
            <li>
              <strong>A hectare</strong> is a square 100 metres on each side.
            </li>
            <li>
              <strong>A full-size football pitch</strong> of 105 × 68 metres is about 0.71 hectares, or
              1.76 acres.
            </li>
            <li>
              <strong>An acre</strong> is 43,560 square feet — historically, the area a team of oxen could
              plough in a day.
            </li>
          </ul>

          <h2>Why a square metre is not 3.28 square feet</h2>
          <p>
            A metre is about 3.28 feet, but area has two dimensions. A square metre is 3.28 feet by 3.28
            feet, which is about 10.76 square feet. Using the length factor for an area is the most common
            conversion mistake, and it makes a property look about three times smaller or larger than it
            is.
          </p>

          <h2>Working out an area</h2>
          <p>
            For a rectangle, multiply length by width in the same unit. A plot of 30 × 40 feet is 1,200
            square feet, or about 111.5 square metres. Split an irregular shape into rectangles and add
            them up. Convert lengths first with the <Link href="/converters/length-converter">Length
            Converter</Link> if your measurements are in mixed units.
          </p>

          <h2>Local land units</h2>
          <p>
            Many countries still use traditional units in land records. A few examples, with commonly used
            values:
          </p>
          <ul>
            <li>
              <strong>Cent</strong> (used in parts of South India): one hundredth of an acre, 435.6 square
              feet.
            </li>
            <li>
              <strong>Gaj</strong> (South Asia): a square yard, 9 square feet.
            </li>
            <li>
              <strong>Ropani</strong> (Nepal, hill regions): about 508.72 square metres, divided into 16
              aana of about 31.80 square metres.
            </li>
            <li>
              <strong>Bigha</strong> (Nepal, Terai): about 6,772.63 square metres, divided into 20 kattha
              of about 338.63 square metres.
            </li>
          </ul>
          <p>
            Units with the same name can have different sizes in different regions — the bigha varies
            widely across India, for example. For anything legal, such as a purchase or a land record,
            confirm the conversion your local land office uses.
          </p>

          <h2>Floor area is not always the same thing</h2>
          <p>
            A listing&apos;s &ldquo;area&rdquo; may be carpet area (inside the walls), built-up area
            (including walls) or a super built-up figure that adds a share of common areas. They can
            differ by a quarter or more for the same flat, so check which one a price per square foot is
            based on before comparing.
          </p>

          <h2>Rooms and decorating</h2>
          <p>
            For a room, floor area decides flooring and carpet; wall area decides paint and wallpaper. The{" "}
            <Link href="/calculators/paint-coverage-calculator">Paint and Wallpaper Calculator</Link>{" "}
            works out wall area from a room&apos;s dimensions.
          </p>
        </>
      );
    },
  },

  {
    slug: "running-pace-and-speed",
    topic: "Calculations",
    title: "Running pace and speed: min/km, min/mile, km/h and mph",
    seoTitle: "Running Pace and Speed: min/km, min/mile, km/h",
    description:
      "Convert running pace to speed and back, switch between kilometres and miles, and work out a finish time for 5K, 10K, half marathon and marathon.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["speed-converter", "length-converter", "time-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            Runners talk in pace — minutes per kilometre or per mile — while treadmills, bikes and cars
            show speed in km/h or mph. They describe the same thing upside down, and converting between
            them takes one division.
          </p>

          <h2>Pace and speed are opposites</h2>
          <p>
            <strong>pace (minutes per km) = 60 ÷ speed (km/h)</strong>
          </p>
          <p>
            <strong>speed (km/h) = 60 ÷ pace (minutes per km)</strong>
          </p>
          <p>The same works with miles and mph.</p>
          <table>
            <thead>
              <tr>
                <th>Speed</th>
                <th>Per km</th>
                <th>Per mile</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>8 km/h</td>
                <td>7:30</td>
                <td>12:04</td>
              </tr>
              <tr>
                <td>10 km/h</td>
                <td>6:00</td>
                <td>9:39</td>
              </tr>
              <tr>
                <td>12 km/h</td>
                <td>5:00</td>
                <td>8:03</td>
              </tr>
              <tr>
                <td>15 km/h</td>
                <td>4:00</td>
                <td>6:26</td>
              </tr>
            </tbody>
          </table>
          <p>
            To go from a pace per kilometre to a pace per mile, multiply by 1.609: 5:00 per km is 5 ×
            1.609 = 8.05 minutes, or 8:03 per mile.
          </p>

          <h2>Converting speeds</h2>
          <p>
            The <Link href="/converters/speed-converter">Speed Converter</Link> switches between km/h, mph,
            metres per second, knots and more, exactly. It works in speed, so convert a pace to a speed
            first with the formula above: a 6:00 per km pace is 10 km/h, which is about 6.21 mph.
          </p>

          <h2>Finish times</h2>
          <p>
            <strong>time = distance × pace</strong>
          </p>
          <ul>
            <li>5 km at 6:00 per km: 30 minutes.</li>
            <li>10 km at 5:30 per km: 55 minutes.</li>
            <li>Half marathon, 21.0975 km, at 6:00 per km: about 2 hours 6 minutes 35 seconds.</li>
            <li>Marathon, 42.195 km, at 5:00 per km: about 3 hours 30 minutes 58 seconds.</li>
          </ul>
          <p>
            Note the odd-looking marathon distance: 42.195 km is 26.2 miles, which is why a marathon at a
            round pace never finishes on a round time.
          </p>

          <h2>Working back from a goal time</h2>
          <p>
            <strong>pace = goal time ÷ distance</strong>
          </p>
          <ul>
            <li>A 25-minute 5K needs 25 ÷ 5 = 5:00 per km.</li>
            <li>A half marathon under 2 hours needs 120 ÷ 21.0975 = 5.69 minutes, or about 5:41 per km.</li>
            <li>
              A marathon under 4 hours needs exactly the same pace — 240 ÷ 42.195 is also about 5:41 per km,
              because the marathon is twice the half.
            </li>
          </ul>
          <p>
            Aim to run the first half at or slightly slower than goal pace. Starting fast feels easy for a few
            kilometres and costs far more time later than it gained.
          </p>

          <h2>Decimal minutes</h2>
          <p>
            Pace is written in minutes and seconds, but calculations produce decimals. 5.25 minutes is 5
            minutes 15 seconds, not 5:25 — multiply the decimal part by 60. The{" "}
            <Link href="/converters/time-converter">Time Converter</Link> helps with longer durations.
          </p>

          <h2>Treadmill speeds</h2>
          <p>
            Treadmills set speed, not pace. To run at 5:30 per km, set 60 ÷ 5.5 = 10.9 km/h. Many runners
            add a 1% incline to make treadmill running feel closer to running outdoors.
          </p>

          <h2>Kilometres and miles</h2>
          <p>
            A mile is exactly 1.609344 km. A 5K is 3.11 miles, a 10K 6.21 miles. The{" "}
            <Link href="/converters/length-converter">Length Converter</Link> handles any other distance.
          </p>

          <h2>A word on training</h2>
          <p>
            These numbers describe pace; they do not prescribe it. Most training advice suggests doing the
            majority of runs at an easy, conversational pace, well slower than race pace. If you are new to
            running or returning after a break, build up gradually.
          </p>
        </>
      );
    },
  },

  {
    slug: "shoe-size-conversion",
    topic: "Calculations",
    title: "Shoe size conversion: US, UK, EU and Japan — and why it varies",
    seoTitle: "Shoe Size Conversion: US, UK, EU and Japan",
    description:
      "Convert shoe sizes between US men's and women's, UK, European and Japanese systems, measure your foot properly, and understand why brands disagree.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["shoe-size-converter", "length-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            Buying shoes online from another country means translating a size you know into one you do
            not. Conversion charts help, but they disagree with each other — and with the shoes. Knowing
            how the systems work explains why, and what to do about it.
          </p>

          <h2>How each system works</h2>
          <p>Every shoe-size system is a scale laid over the length of a foot, with its own starting point and step:</p>
          <ul>
            <li>
              <strong>UK and US</strong> sizes go up in steps of a third of an inch. US men&apos;s sizes run
              about one size above UK sizes, and US women&apos;s about one size above US men&apos;s.
            </li>
            <li>
              <strong>European (Paris point)</strong> sizes go up in steps of two-thirds of a centimetre.
            </li>
            <li>
              <strong>Japanese sizes and Mondopoint</strong> simply state the foot length in centimetres or
              millimetres.
            </li>
          </ul>
          <p>
            UK, European, Japanese and Mondopoint sizes are the same for everyone; only US sizes have
            separate men&apos;s and women&apos;s scales.
          </p>

          <h2>The relationships</h2>
          <p>With L as foot length, the standard relationships are:</p>
          <ul>
            <li>UK ≈ 3 × L (inches) − 23</li>
            <li>US men&apos;s ≈ 3 × L (inches) − 22</li>
            <li>US women&apos;s ≈ 3 × L (inches) − 21</li>
            <li>EU ≈ 1.5 × L (cm) + 2</li>
          </ul>
          <p>
            For a 27 cm foot (10.63 inches): UK about 9, US men&apos;s about 10, US women&apos;s about 11,
            EU about 42.5 and Japan 27. The{" "}
            <Link href="/converters/shoe-size-converter">Shoe Size Converter</Link> uses these
            relationships and rounds to the nearest half size.
          </p>

          <h2>Measure your foot</h2>
          <ol>
            <li>Stand on a sheet of paper with your heel against a wall.</li>
            <li>Mark the tip of your longest toe — not always the big toe.</li>
            <li>Measure from the wall to the mark in centimetres or inches.</li>
            <li>Measure both feet in the evening, when feet are largest, and use the longer one.</li>
          </ol>
          <p>
            The converter accepts a foot length directly. Foot length is also the most reliable number to
            compare with a brand&apos;s own chart.
          </p>

          <h2>Why brands disagree</h2>
          <p>
            Each maker builds shoes around its own last — the foot-shaped form a shoe is made on — and adds
            its own allowance for toe room. Some brand charts sit a full size away from the standard
            relationships. Running shoes are often cut differently from formal shoes from the same brand.
            That is why the same person can wear three different sizes from three makers.
          </p>

          <h2>Buying shoes in another system</h2>
          <ul>
            <li>Find the brand&apos;s own size chart and compare your measured foot length with it.</li>
            <li>Read reviews for notes on whether the shoe runs large or small.</li>
            <li>Between sizes, choose the larger for walking and running shoes and thick socks.</li>
            <li>Check the returns policy before ordering from another country.</li>
          </ul>

          <h2>Children&apos;s sizes</h2>
          <p>
            Children&apos;s scales start from different points in each country and are not described by
            the adult relationships above. Measure the child&apos;s foot and use the brand&apos;s
            children&apos;s chart, leaving room to grow.
          </p>
          <p>
            For other length conversions — centimetres to inches for a foot measurement, for example — the{" "}
            <Link href="/converters/length-converter">Length Converter</Link> converts exactly.
          </p>
        </>
      );
    },
  },

  {
    slug: "engine-cc-to-horsepower",
    topic: "Calculations",
    title: "Engine cc, litres and horsepower: what the numbers mean",
    seoTitle: "Engine CC, Litres and Horsepower Explained",
    description:
      "Convert engine size between cc, litres and cubic inches exactly, see why horsepower can only be estimated from engine size, and decode hp, bhp, PS and kW.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["engine-cc-to-hp", "ev-charging-cost-calculator", "speed-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            A 1.5-litre car, a 150 cc scooter, a 350 cubic-inch V8: engine sizes are quoted in different
            units around the world, and people often assume a bigger number means more power. Size and
            power are related, but they are not the same thing.
          </p>

          <h2>What engine size measures</h2>
          <p>
            Engine size, or displacement, is the total volume the pistons sweep inside the cylinders. It
            is a measure of how much air and fuel the engine can draw in each cycle — not of how much power
            it produces.
          </p>

          <h2>Converting size: exact</h2>
          <ul>
            <li>1 litre = 1,000 cc (cubic centimetres).</li>
            <li>1 cubic inch = 16.387064 cc exactly.</li>
          </ul>
          <p>
            So a 1,998 cc engine is 2.0 litres or about 121.9 cubic inches, and a 5.0-litre engine is about
            305 cubic inches. Manufacturers round: most engines sold as 2.0 litres are between about 1,950
            and 1,999 cc. The <Link href="/converters/engine-cc-to-hp">Engine CC to HP Converter</Link>{" "}
            converts displacement exactly.
          </p>

          <h2>Horsepower: only an estimate</h2>
          <p>
            Power depends on much more than size: whether the engine is turbocharged, how fast it revs, how
            it is tuned and what it is designed for. Two engines of the same size can differ several times
            over. What can be estimated is a realistic range from typical power per litre for each kind of
            engine:
          </p>
          <ul>
            <li>small scooter and commuter motorcycle engines: about 60–95 hp per litre;</li>
            <li>petrol car engines without a turbo: about 70–110;</li>
            <li>turbocharged petrol car engines: about 100–160;</li>
            <li>turbodiesel car engines: about 55–100;</li>
            <li>high-revving sport motorcycles: about 150–220;</li>
            <li>large truck diesels: about 25–40.</li>
          </ul>
          <p>
            A 1,500 cc turbocharged petrol car engine therefore lands somewhere around 150–240 hp, typically
            about 180. A 150 cc commuter scooter makes about 9–14 hp. For a real vehicle, the
            manufacturer&apos;s rated figure is always the one to use.
          </p>

          <h2>hp, bhp, PS and kW</h2>
          <ul>
            <li>
              <strong>hp and bhp</strong> usually both mean mechanical horsepower, 745.7 watts. bhp stresses
              that it was measured at the crankshaft.
            </li>
            <li>
              <strong>PS</strong> is metric horsepower, 735.5 watts — about 1.4% smaller, so the same engine
              shows a slightly bigger number in PS. It appears on many European and Japanese specification
              sheets.
            </li>
            <li>
              <strong>kW</strong> is the international unit. Multiply kW by about 1.341 for hp: 100 kW is
              about 134 hp, or 136 PS.
            </li>
          </ul>

          <h2>Why bigger is not always stronger</h2>
          <p>
            Modern small turbocharged engines often match the power of older, larger engines, because the
            turbo forces in more air. Sport motorcycle engines make enormous power for their size by
            revving very high. Truck diesels are huge and produce modest power for their size, but great
            pulling force at low revs. Size tells you something about an engine; it never tells you
            everything.
          </p>

          <h2>Electric cars</h2>
          <p>
            Electric motors have no displacement, so their power is quoted directly in kW or hp. Their
            running costs depend on energy use rather than engine size — see{" "}
            <Link href="/guides/ev-charging-cost">how much it costs to charge an electric car</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "schedule-a-meeting-across-time-zones",
    topic: "Calculations",
    title: "How to schedule a meeting across time zones without mistakes",
    seoTitle: "How to Schedule a Meeting Across Time Zones",
    description:
      "Find hours that suit people in several countries, avoid the daylight saving weeks that move meetings, and write invites nobody can misread.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["timezone-meeting-planner", "timestamp-converter", "time-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            A team in London, New York and Kathmandu has very few hours when everyone is at work. Finding
            them by mental arithmetic works until the clocks change in one country and not another — and
            someone joins an hour early, or not at all.
          </p>

          <h2>Find the overlap step by step</h2>
          <ol>
            <li>
              Open the <Link href="/converters/timezone-meeting-planner">Time Zone Meeting Planner</Link>{" "}
              and add each city or time zone. The first one is the reference.
            </li>
            <li>Choose the actual meeting date, and the working hours you want to respect.</li>
            <li>
              Look for hours marked as inside working hours everywhere. Early mornings and evenings are
              marked separately from night, so you can see the least disruptive compromise when there is
              no perfect slot.
            </li>
            <li>Select an hour to see it in every city, and copy the times into your invite.</li>
          </ol>
          <p>
            Local times are worked out from the same time-zone rules operating systems use, so daylight
            saving and unusual offsets are correct for the date you choose.
          </p>

          <h2>Always use the real date</h2>
          <p>
            Countries change their clocks on different dates, and some never do. In 2026, the United
            States moved its clocks forward on 8 March and moves them back on 1 November; the UK and the
            European Union moved forward on 29 March and move back on 25 October. For a few weeks each
            spring and autumn, London and New York are four hours apart instead of five, and a recurring
            meeting moves by an hour for one side.
          </p>
          <p>
            The southern hemisphere runs the other way. In much of Australia, clocks go forward in early
            October and back in early April, so the gap between Sydney and Europe changes by two hours over
            the year.
          </p>

          <h2>Half-hour and quarter-hour zones</h2>
          <p>
            Not every zone is a whole number of hours from UTC. India is UTC+5:30 and Nepal UTC+5:45, so
            9:00 in London in winter is 14:30 in Delhi and 14:45 in Kathmandu. Mental arithmetic slips
            most often with these.
          </p>

          <h2>Write invites nobody can misread</h2>
          <ul>
            <li>
              Send a calendar invite rather than a time in a message; calendar apps convert to each
              person&apos;s own zone.
            </li>
            <li>
              In text, give the time in every city — in winter, for example, &ldquo;14:00 London / 09:00
              New York / 19:45 Kathmandu&rdquo;.
            </li>
            <li>Use the 24-hour clock or add am and pm, never neither.</li>
            <li>Include the date in every city when the meeting crosses midnight somewhere.</li>
          </ul>

          <h2>Be fair over time</h2>
          <p>
            When no hour suits everyone, the same people should not always take the 7:00 or 21:00 slot.
            Rotating the inconvenient time between regions, or recording meetings for those who cannot
            attend live, keeps a distributed team working well.
          </p>

          <h2>Common pairs</h2>
          <ul>
            <li>
              <strong>London and New York:</strong> on most weekdays, 14:00–17:00 in London is 09:00–12:00
              in New York.
            </li>
            <li>
              <strong>Europe and India:</strong> mornings in Europe overlap with afternoons in India.
            </li>
            <li>
              <strong>US west coast and Asia:</strong> late afternoon in California is early morning the
              next day in much of Asia — watch the date.
            </li>
          </ul>

          <h2>Timestamps in systems</h2>
          <p>
            In software and logs, times are best stored in UTC and converted for display. To read a Unix
            timestamp in UTC and your own zone, use the{" "}
            <Link href="/developer/timestamp-converter">Timestamp Converter</Link>; for plain durations, the{" "}
            <Link href="/converters/time-converter">Time Converter</Link>.
          </p>
        </>
      );
    },
  },
];
