import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-01";

export const moneyHealthHomeGuides: Guide[] = [
  {
    slug: "how-to-calculate-exact-age",
    topic: "Calculations",
    title: "How to calculate an exact age in years, months and days",
    seoTitle: "How to Calculate Exact Age in Years, Months, Days",
    description:
      "Why dividing by 365 gives the wrong age, how to count years, months and days, what happens to 29 February birthdays, and how to find an age on a cut-off date.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["age-calculator", "time-converter", "pet-age-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            Working out someone&apos;s age in whole years is easy. Working it out exactly — 25 years,
            5 months and 21 days — is surprisingly fiddly, because months are different lengths and
            leap years come and go. Forms, contracts and eligibility rules often depend on getting it
            exactly right.
          </p>

          <h2>Why dividing days by 365 goes wrong</h2>
          <p>
            A common shortcut is to count the days between two dates and divide by 365, or by 365.25 to
            allow for leap years. Both drift. Near a birthday, the shortcut can be a day out either way —
            exactly the situation where eligibility for a school place, a pension or a licence is
            decided. Real age is counted on the calendar, not by averaging.
          </p>

          <h2>How age is counted properly</h2>
          <ol>
            <li>
              <strong>Whole years:</strong> subtract the birth year from the current year, then take
              one off if this year&apos;s birthday has not happened yet.
            </li>
            <li>
              <strong>Whole months:</strong> count the months since the last birthday, taking one off
              if the day of the month has not been reached yet.
            </li>
            <li>
              <strong>Days:</strong> count the days left over, borrowing from the length of the
              previous calendar month when needed.
            </li>
          </ol>
          <p>
            Borrowing from the real previous month is what makes the result correct across months of
            different lengths. Someone born on 31 January is one month old on 28 February in a common
            year, because February has no 31st.
          </p>

          <h2>A worked example</h2>
          <p>Someone born on 15 March 2001, checked on 5 September 2026:</p>
          <ul>
            <li>The 2026 birthday has passed, so 2026 − 2001 = <strong>25 years</strong>.</li>
            <li>From 15 March to 15 August is <strong>5 months</strong>.</li>
            <li>From 15 August to 5 September is <strong>21 days</strong>.</li>
          </ul>
          <p>
            The <Link href="/calculators/age-calculator">Age Calculator</Link> gives the same answer —
            25 years, 5 months and 21 days — together with the totals: 9,305 days, the equivalent in
            weeks, months and hours, and a countdown of 191 days to the next birthday.
          </p>

          <h2>Birthdays on 29 February</h2>
          <p>
            A person born on 29 February has a real birthday only once every four years. In other
            years, the most widely used convention treats their birthday as 1 March, so they turn a
            year older on 1 March. That is how the calculator counts. Some laws and organisations use
            28 February instead, so when an exact legal date matters — a licence, a contract, a pension —
            check the rule that applies where you are.
          </p>

          <h2>Age on a particular date</h2>
          <p>
            Many rules ask how old someone is on a specific day rather than today: &ldquo;age on 1
            September&rdquo; for school entry, &ldquo;age on the closing date&rdquo; for a job or a
            competition, &ldquo;age at the start of the policy&rdquo; for insurance. Set the second date
            in the calculator to that day instead of leaving it as today.
          </p>
          <p>
            The same works for any two dates — the length of a tenancy, the time since an event, the
            age of a building — because counting the gap between two dates is the same calculation.
          </p>

          <h2>Does the day of birth count?</h2>
          <p>
            By the usual convention, a person is zero days old on the day they are born and one year
            old on their first birthday. The day of birth is the starting point, not day one. That is
            also how the totals are counted.
          </p>

          <h2>Totals in days, weeks and hours</h2>
          <p>
            Ages in days or weeks are useful for babies, for milestones such as &ldquo;10,000 days
            old&rdquo;, and for anything measured in a fixed unit. These are counted from the real
            calendar too. For converting a duration between units without specific dates — how many
            hours are in 90 days — use the <Link href="/converters/time-converter">Time Converter</Link>,
            which works with average month and year lengths.
          </p>

          <h2>Other ways of counting age</h2>
          <p>
            Not every tradition counts the same way. Some East Asian traditions count a newborn as one
            year old; South Korea moved its official age counting to the international method in 2023.
            When a form asks for your age, it means the international method described here unless it
            says otherwise. For pets, see{" "}
            <Link href="/guides/dog-years-to-human-years">how dog and cat years really compare</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "dog-years-to-human-years",
    topic: "Calculations",
    title: "Dog years to human years: why the ×7 rule is wrong",
    seoTitle: "Dog Years to Human Years: What the Science Says",
    description:
      "How old a dog or cat really is in human terms, why size changes the answer, what a DNA study found, and a quick chart for small, medium, large and giant dogs.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pet-age-calculator", "age-calculator", "weight-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            &ldquo;Multiply by seven&rdquo; is the rule everyone knows, and it is wrong at both ends. A
            one-year-old dog is not a seven-year-old child — it can have puppies. And a twelve-year-old
            Great Dane is not 84; by that age it is very old indeed.
          </p>

          <h2>Dogs grow up fast, then age at different speeds</h2>
          <p>
            Dogs mature very quickly. By their first birthday most are physically grown and sexually
            mature, roughly like a human teenager. After that, ageing slows down — and how much it slows
            depends on size. Small dogs live longer and age more slowly in later life; giant breeds age
            fastest. Why larger dogs have shorter lives is still being studied, but the pattern itself
            is well established.
          </p>

          <h2>The size-based chart</h2>
          <p>
            Veterinary practices commonly use a chart in which the first year counts as about 15 human
            years (12 for giant breeds), the second adds about 9, and each year after that adds between
            about 4 for small dogs and 7 for giant ones. The{" "}
            <Link href="/calculators/pet-age-calculator">Pet Age Calculator</Link> uses this chart:
          </p>
          <table>
            <thead>
              <tr>
                <th>Age</th>
                <th>S</th>
                <th>M</th>
                <th>L</th>
                <th>XL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>15</td>
                <td>15</td>
                <td>15</td>
                <td>12</td>
              </tr>
              <tr>
                <td>2</td>
                <td>24</td>
                <td>24</td>
                <td>24</td>
                <td>22</td>
              </tr>
              <tr>
                <td>5</td>
                <td>36</td>
                <td>36</td>
                <td>36</td>
                <td>45</td>
              </tr>
              <tr>
                <td>10</td>
                <td>56</td>
                <td>60</td>
                <td>66</td>
                <td>79</td>
              </tr>
              <tr>
                <td>15</td>
                <td>76</td>
                <td>83</td>
                <td>93</td>
                <td>114</td>
              </tr>
            </tbody>
          </table>
          <p>
            S, M, L and XL are small, medium, large and giant dogs, grouped by typical adult weight: small
            up to 9 kg (20 lb), medium up to 23 kg (50 lb), large up to 45 kg (100 lb) and giant above
            that. For a mixed breed, choose by weight; the{" "}
            <Link href="/converters/weight-converter">Weight Converter</Link> switches between kilograms
            and pounds.
          </p>

          <h2>What the DNA study found</h2>
          <p>
            In 2020, researchers at the University of California, San Diego compared age-related
            chemical marks on DNA in Labrador retrievers and people. Their estimate is:
          </p>
          <p>
            <strong>human age ≈ 16 × ln(dog age) + 31</strong>
          </p>
          <p>
            where ln is the natural logarithm. It puts a 2-year-old dog at about 42, a 6-year-old at
            about 60 and a 10-year-old at about 68 — a very fast start and a slow later life. It was
            measured in one breed, so it is best treated as an interesting second opinion. For a
            6-year-old Labrador, the size chart says 45 and the DNA formula about 60; the calculator
            shows both.
          </p>

          <h2>Cats</h2>
          <p>
            Cats are simpler, because their size varies much less. Following International Cat
            Care&apos;s widely used chart, a one-year-old cat is about 15 in human terms and a
            two-year-old about 24. Each year after that adds about four human years:
          </p>
          <p>
            <strong>human age ≈ 24 + 4 × (cat age − 2)</strong>
          </p>
          <p>
            So a 10-year-old cat is about 56, and a 15-year-old about 76. Cats are commonly described as
            senior from around 11 years old.
          </p>

          <h2>Why it is worth knowing</h2>
          <ul>
            <li>
              <strong>Health checks.</strong> Vets often recommend more frequent check-ups as pets enter
              their senior years, because problems develop faster in a shorter life.
            </li>
            <li>
              <strong>Food and exercise.</strong> Diets and activity are often adjusted by life stage.
            </li>
            <li>
              <strong>Expectations.</strong> A giant-breed dog at seven is already in later life, while a
              small dog of the same age may have many years ahead.
            </li>
          </ul>

          <h2>Signs of ageing worth noticing</h2>
          <p>
            Whatever the number says, a pet&apos;s behaviour is a better guide to how it is ageing.
            Changes commonly worth mentioning to a vet include:
          </p>
          <ul>
            <li>stiffness, reluctance to jump or climb stairs, or slowing down on walks;</li>
            <li>weight gain or loss without a change in diet;</li>
            <li>drinking or urinating more than usual;</li>
            <li>bad breath or difficulty eating, which can signal dental problems;</li>
            <li>cloudy eyes, confusion, or changes in sleep and temperament.</li>
          </ul>
          <p>
            None of these is a diagnosis; they are reasons to book a check-up rather than to wait.
          </p>

          <h2>A note on precision</h2>
          <p>
            Any conversion to human years is an estimate. Breed, genetics, weight, diet and health all
            change how a particular animal ages. Use the number as a guide to life stage, and ask your
            vet about your own pet.
          </p>
        </>
      );
    },
  },

  {
    slug: "ev-charging-cost",
    topic: "Calculations",
    title: "How much does it cost to charge an electric car?",
    seoTitle: "How Much Does It Cost to Charge an Electric Car?",
    description:
      "Work out the cost of a charge and the cost per mile or kilometre for an electric car, see why public rapid charging changes the picture, and compare with petrol.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["ev-charging-cost-calculator", "speed-converter", "volume-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            &ldquo;How much does it cost to charge?&rdquo; has a simple answer for any one charge — and a
            more useful answer per mile or kilometre, which is what lets you compare with a petrol or
            diesel car.
          </p>

          <h2>The cost of one charge</h2>
          <p>
            <strong>cost = battery size × change in charge level ÷ charging efficiency × price per kWh</strong>
          </p>
          <ul>
            <li>
              <strong>Battery size</strong> is the usable capacity in kilowatt-hours (kWh), listed in the
              car&apos;s specification.
            </li>
            <li>
              <strong>Change in charge level</strong> is how much you add, such as from 20% to 80%.
            </li>
            <li>
              <strong>Charging efficiency</strong> accounts for energy lost as heat in the charger and
              battery. Around 90% is typical for home charging.
            </li>
          </ul>
          <p>
            A 60 kWh battery charged from 20% to 80% takes in 60 × 0.6 = 36 kWh. At 90% efficiency, 40
            kWh is drawn from the grid. At 0.15 per kWh, that charge costs <strong>6.00</strong>. The{" "}
            <Link href="/calculators/ev-charging-cost-calculator">EV Charging Cost Calculator</Link>{" "}
            does this for your own battery, levels and price.
          </p>

          <h2>Cost per mile or kilometre</h2>
          <p>
            Running cost depends on how efficiently the car uses energy. Cars and their dashboards
            state this as miles per kWh, kWh per 100 miles or kWh per 100 km. Divide the consumption
            by the charging efficiency, then multiply by your electricity price.
          </p>
          <p>
            A car that does 3.5 miles per kWh uses about 28.6 kWh per 100 miles. Divided by 0.9, that is
            about 31.7 kWh from the grid; at 0.15 per kWh, about <strong>4.76 per 100 miles</strong>.
          </p>

          <h2>Comparing with petrol — two examples</h2>
          <p>
            These use illustrative prices, not current ones; put your own figures into the calculator.
          </p>
          <ul>
            <li>
              <strong>United States:</strong> the electric car above, charged at home at $0.15 per kWh,
              costs about $4.76 per 100 miles. A petrol car doing 30 mpg with fuel at $3.50 a gallon costs
              about $11.67 per 100 miles.
            </li>
            <li>
              <strong>United Kingdom:</strong> an electric car doing 4 miles per kWh, charged at home at
              25p per kWh, costs about £6.94 per 100 miles. A petrol car doing 45 mpg with fuel at £1.40 a
              litre costs about £14.14 per 100 miles.
            </li>
          </ul>
          <p>
            UK mpg figures look higher than US ones for the same car because a UK gallon is 4.546 litres
            and a US gallon 3.785. The calculator uses the correct gallon for the units you choose.
          </p>

          <h2>Why public rapid charging changes the picture</h2>
          <p>
            Rapid chargers on motorways and in town centres often cost several times more per kWh than
            home electricity. In the UK example, the same car charged entirely at 75p per kWh would cost
            about £20.83 per 100 miles — more than the petrol car. Most owners who charge mainly at home
            pay far less than that, which is why the share of public charging is one of the inputs: it
            usually decides whether an electric car is much cheaper to run or only slightly.
          </p>

          <h2>Cheaper home charging</h2>
          <ul>
            <li>
              <strong>Time-of-use tariffs</strong> offer cheaper electricity overnight. Scheduling
              charging for those hours can cut the cost per mile substantially.
            </li>
            <li>
              <strong>Charge little and often.</strong> Topping up at home covers most daily driving
              without visiting a rapid charger.
            </li>
            <li>
              <strong>Follow the manufacturer&apos;s advice on charge levels.</strong> Many recommend
              charging to around 80% for daily use and to 100% only before long trips, depending on the
              battery type.
            </li>
          </ul>

          <h2>Why winter costs more</h2>
          <p>
            Cold batteries are less efficient and heating the cabin uses energy, so consumption often
            rises noticeably in winter. If you use your dashboard figure, take an average over a few
            months rather than a single week.
          </p>

          <h2>What the comparison leaves out</h2>
          <p>
            Fuel is only part of the cost of a car. Purchase price, insurance, maintenance, tax and
            resale value all differ between electric and petrol cars and between models. The
            calculator compares energy costs, which is the part that changes most with how you drive and
            where you charge.
          </p>
        </>
      );
    },
  },

  {
    slug: "what-goes-into-a-mortgage-payment",
    topic: "Calculations",
    title: "What goes into a mortgage payment — principal, interest, taxes and insurance",
    seoTitle: "What Goes Into a Mortgage Payment (PITI Explained)",
    description:
      "Break a monthly mortgage payment into its parts, see how the deposit, rate and term change it, and why the total interest over 30 years is so large.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["mortgage-calculator", "emi-calculator", "loan-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            The number a mortgage rate calculator gives and the amount that actually leaves your
            account each month are often different. The gap is property tax and insurance — and
            understanding each part of the payment helps you compare homes and loans properly.
          </p>

          <h2>The four parts: PITI</h2>
          <ul>
            <li>
              <strong>Principal</strong> — the part that pays down what you borrowed.
            </li>
            <li>
              <strong>Interest</strong> — the lender&apos;s charge on what you still owe.
            </li>
            <li>
              <strong>Taxes</strong> — property tax, divided into monthly amounts.
            </li>
            <li>
              <strong>Insurance</strong> — home insurance, and mortgage insurance if your lender
              requires it.
            </li>
          </ul>
          <p>
            In many places, particularly the United States, lenders collect the tax and insurance with
            the mortgage payment and pay the bills for you from an escrow account. Elsewhere you may
            pay them separately — but either way, they are part of the monthly cost of owning the home.
            Some homes also carry association or service charges.
          </p>

          <h2>A worked example</h2>
          <p>A home costing 350,000, with a 20% deposit, at 6.5% over 30 years:</p>
          <ol>
            <li>Deposit 70,000, so the loan is 280,000.</li>
            <li>Principal and interest come to about 1,770 a month.</li>
            <li>Property tax of 4,200 a year adds 350 a month.</li>
            <li>Insurance of 1,200 a year adds 100 a month.</li>
          </ol>
          <p>
            The total is about <strong>2,220 a month</strong>, of which 1,770 goes to the mortgage
            itself. The <Link href="/calculators/mortgage-calculator">Mortgage Calculator</Link> shows
            this breakdown for your own figures.
          </p>

          <h2>Why the interest total is so large</h2>
          <p>
            Over 30 years, that 280,000 loan costs about 357,000 in interest — more than the amount
            borrowed. It is not a trick of the calculator: you are borrowing a large sum for three
            decades, and in the early years most of each payment is interest because the balance is at
            its highest. The amortisation schedule shows the split shifting towards principal year by
            year. For the mechanics, see{" "}
            <Link href="/guides/how-emi-is-calculated">how EMI is calculated</Link>, which uses the same
            formula.
          </p>

          <h2>What changes the payment most</h2>
          <p>
            Each of these on the same 350,000 home, showing the monthly principal and interest and the
            total interest over the term:
          </p>
          <table>
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Monthly</th>
                <th>Interest</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>20% down, 6.5%, 30 years</td>
                <td>about 1,770</td>
                <td>about 357,000</td>
              </tr>
              <tr>
                <td>10% down, 6.5%, 30 years</td>
                <td>about 1,991</td>
                <td>about 402,000</td>
              </tr>
              <tr>
                <td>20% down, 6%, 30 years</td>
                <td>about 1,679</td>
                <td>about 324,000</td>
              </tr>
              <tr>
                <td>20% down, 7%, 30 years</td>
                <td>about 1,863</td>
                <td>about 391,000</td>
              </tr>
              <tr>
                <td>20% down, 6.5%, 15 years</td>
                <td>about 2,439</td>
                <td>about 159,000</td>
              </tr>
            </tbody>
          </table>
          <ul>
            <li>
              <strong>Rate:</strong> each percentage point moves this payment by roughly 90 a month,
              and the total by tens of thousands.
            </li>
            <li>
              <strong>Term:</strong> a 15-year loan costs about 670 more a month but saves around 198,000
              in interest.
            </li>
            <li>
              <strong>Deposit:</strong> a smaller deposit means a bigger loan, and in many markets a
              deposit below 20% also brings mortgage insurance, adding to the monthly cost.
            </li>
          </ul>

          <h2>Paying more than the minimum</h2>
          <p>
            Any amount paid above the monthly payment goes straight to the balance, so every later
            month&apos;s interest is a little lower. On the 280,000 loan at 6.5%, a simple month-by-month
            model gives:
          </p>
          <ul>
            <li>
              <strong>200 extra a month:</strong> paid off in about 22¾ years instead of 30, with about
              101,000 less interest.
            </li>
            <li>
              <strong>500 extra a month:</strong> paid off in about 17 years, with about 174,000 less
              interest.
            </li>
          </ul>
          <p>
            Many mortgages limit how much you can overpay each year without a charge, especially during
            a fixed-rate period, so check your terms first. Whether overpaying beats saving or investing
            the money depends on your rate and circumstances.
          </p>

          <h2>Fixed and adjustable rates</h2>
          <p>
            With a fixed rate, the principal and interest stay the same for the fixed period. With an
            adjustable or variable rate, they move with the lender&apos;s rate, so the payment can rise.
            When comparing a variable deal, work out the payment at a rate one or two points higher too,
            to see whether it would still be affordable.
          </p>

          <h2>Costs the monthly payment does not show</h2>
          <ul>
            <li>One-off purchase costs such as fees, legal costs and in some countries transfer taxes.</li>
            <li>Maintenance and repairs, often estimated at around 1% of the home&apos;s value a year.</li>
            <li>Utilities and running costs, which tend to be higher in a larger home.</li>
          </ul>

          <h2>Using the figures</h2>
          <p>
            Try several deposits, rates and terms rather than a single scenario, and include realistic
            tax and insurance figures for the area. The result is an estimate, not a quote — lenders
            add fees and use their own terms — and nothing here is financial advice. For other loans,
            the <Link href="/calculators/loan-calculator">Loan Calculator</Link> compares weekly,
            fortnightly and monthly repayments, and the{" "}
            <Link href="/calculators/emi-calculator">EMI Calculator</Link> shows a full schedule.
          </p>
        </>
      );
    },
  },

  {
    slug: "uk-take-home-pay-2026-27",
    topic: "Calculations",
    title: "UK take-home pay in 2026/27: how income tax and National Insurance are worked out",
    seoTitle: "UK Take-Home Pay 2026/27: Tax and NI Explained",
    description:
      "How UK income tax and National Insurance turn a salary into take-home pay in the 2026/27 tax year, with worked examples, the £100,000 trap and student loans.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["take-home-pay-calculator", "salary-calculator", "percentage-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            A UK salary of £30,000 does not mean £2,500 a month in your account. Income tax and National
            Insurance come off first, and possibly a pension contribution and student loan repayments.
            Here is how the main deductions work for an employee in the 2026/27 tax year, which runs from
            6 April 2026 to 5 April 2027.
          </p>

          <h2>Income tax (England, Wales and Northern Ireland)</h2>
          <ul>
            <li>
              The first <strong>£12,570</strong> is tax-free — the Personal Allowance.
            </li>
            <li>
              Income above that up to <strong>£50,270</strong> is taxed at <strong>20%</strong> (basic
              rate).
            </li>
            <li>
              From £50,270 to <strong>£125,140</strong> it is taxed at <strong>40%</strong> (higher
              rate).
            </li>
            <li>
              Above £125,140 it is taxed at <strong>45%</strong> (additional rate).
            </li>
          </ul>
          <p>
            Each rate applies only to the slice of income in its band. Earning one pound over £50,270
            does not put your whole salary into the 40% band — only that pound. Scotland sets its own
            income tax bands, six of them, from 19% to 48%.
          </p>

          <h2>National Insurance</h2>
          <p>
            Employees pay <strong>8%</strong> on earnings between £12,570 and £50,270, and{" "}
            <strong>2%</strong> on earnings above that. It is worked out on pay, not on taxable income,
            and applies across the whole of the UK.
          </p>

          <h2>A worked example: £30,000</h2>
          <ol>
            <li>Taxable income: £30,000 − £12,570 = £17,430.</li>
            <li>Income tax: £17,430 × 20% = £3,486.</li>
            <li>National Insurance: £17,430 × 8% = £1,394.40.</li>
            <li>Take-home: £30,000 − £3,486 − £1,394.40 = <strong>£25,119.60</strong> a year, or £2,093.30 a month.</li>
          </ol>

          <h2>Take-home pay at different salaries</h2>
          <p>
            Take-home pay in England, Wales and Northern Ireland, with no pension contributions or student
            loan:
          </p>
          <table>
            <thead>
              <tr>
                <th>Salary</th>
                <th>Yearly</th>
                <th>Monthly</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>£25,000</td>
                <td>£21,519.60</td>
                <td>£1,793.30</td>
              </tr>
              <tr>
                <td>£30,000</td>
                <td>£25,119.60</td>
                <td>£2,093.30</td>
              </tr>
              <tr>
                <td>£50,000</td>
                <td>£39,519.60</td>
                <td>£3,293.30</td>
              </tr>
              <tr>
                <td>£60,000</td>
                <td>£45,357.40</td>
                <td>£3,779.78</td>
              </tr>
              <tr>
                <td>£100,000</td>
                <td>£68,557.40</td>
                <td>£5,713.12</td>
              </tr>
            </tbody>
          </table>
          <p>
            The <Link href="/calculators/take-home-pay-calculator">Take-Home Pay Calculator</Link> shows
            the same breakdown for any salary, with Scottish rates, pensions and student loans.
          </p>

          <h2>The £100,000 trap</h2>
          <p>
            The Personal Allowance shrinks by £1 for every £2 of income above £100,000, and disappears
            completely at £125,140. In that range, each extra £1 of salary is taxed at 40% and also
            removes 50p of tax-free allowance, which is then taxed at 40% as well. With National
            Insurance at 2%, the combined rate on income between £100,000 and £125,140 is about{" "}
            <strong>62%</strong>. A salary of £125,140 leaves £78,110.60 — only about £9,550 more than
            £100,000 does.
          </p>
          <p>
            Pension contributions reduce the income used for this test, which is why people in that
            band often pay more into their pension.
          </p>

          <h2>Pension contributions</h2>
          <ul>
            <li>
              <strong>Salary sacrifice</strong> reduces your pay itself, so it saves income tax and
              National Insurance.
            </li>
            <li>
              <strong>Net pay arrangements</strong> take the contribution before income tax, but not
              before National Insurance.
            </li>
            <li>
              <strong>Relief at source</strong> takes the contribution from your taxed pay, and the
              pension provider adds 20% basic-rate relief on top.
            </li>
          </ul>
          <p>Your payslip or employer will tell you which scheme you are in.</p>

          <h2>Student loans</h2>
          <p>
            Repayments are 9% of your pay above a threshold that depends on your plan: £26,900 for Plan
            1, £29,385 for Plan 2, £33,795 for Plan 4 and £25,000 for Plan 5. Postgraduate loans are 6%
            above £21,000, on top of any undergraduate repayment.
          </p>

          <h2>Why your payslip is different</h2>
          <p>
            Payroll works out tax each pay period using your tax code — 1257L for most people, which
            reflects the £12,570 allowance. Benefits such as a company car, an emergency tax code after
            changing jobs, bonuses and underpaid tax from earlier years all change the figures. The
            calculator shows the full-year position for a single job with no other income; it is an
            estimate, not tax advice. For your own position, check your payslip and your personal tax
            account with HMRC.
          </p>
        </>
      );
    },
  },

  {
    slug: "recipe-conversions-cups-grams-oven",
    topic: "Calculations",
    title: "Recipe conversions: cups to grams, ounces, spoons and oven temperatures",
    seoTitle: "Recipe Conversions: Cups to Grams and Oven Temps",
    description:
      "Convert American, British and metric recipes: why cups to grams depends on the ingredient, US and UK pints, spoons, and oven temperatures in °C, °F and gas marks.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["volume-converter", "weight-converter", "temperature-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            An American recipe asks for cups and Fahrenheit, a British one for grams and gas marks, an
            Australian one for a tablespoon that is not the same size as anyone else&apos;s. Most
            conversions are simple; the one people most want — cups to grams — depends on what is in the
            cup.
          </p>

          <h2>Volume: cups, spoons and pints</h2>
          <table>
            <thead>
              <tr>
                <th>Measure</th>
                <th>Millilitres</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>US cup</td>
                <td>about 237</td>
              </tr>
              <tr>
                <td>Metric cup (Australia, NZ, Canada)</td>
                <td>250</td>
              </tr>
              <tr>
                <td>US tablespoon</td>
                <td>about 14.8</td>
              </tr>
              <tr>
                <td>Metric tablespoon</td>
                <td>15 (20 in Australia)</td>
              </tr>
              <tr>
                <td>Teaspoon</td>
                <td>about 5</td>
              </tr>
              <tr>
                <td>US pint</td>
                <td>about 473</td>
              </tr>
              <tr>
                <td>UK pint</td>
                <td>about 568</td>
              </tr>
            </tbody>
          </table>
          <p>
            The differences are small for a single spoon and larger in a pint: a UK pint is about 20%
            bigger than a US pint. The <Link href="/converters/volume-converter">Volume Converter</Link>{" "}
            lists US and imperial units separately so you do not mix them up.
          </p>

          <h2>Cups to grams: it depends on the ingredient</h2>
          <p>
            A cup measures volume; grams measure weight. A cup of flour weighs much less than a cup of
            sugar, so there is no single conversion. Typical figures for a US cup:
          </p>
          <ul>
            <li>Water or milk: about 240 g.</li>
            <li>Granulated sugar: about 200 g.</li>
            <li>All-purpose (plain) flour: about 120–130 g, spooned in and levelled.</li>
            <li>Butter: about 227 g — two American sticks of about 113 g.</li>
          </ul>
          <p>
            Flour varies most: scooped straight from the bag and packed down, a cup can hold noticeably
            more. That is why bakers prefer weighing. A unit converter can turn cups into millilitres
            exactly, but turning millilitres into grams needs the density of the ingredient, so treat
            any cups-to-grams figure as an approximation and use the recipe author&apos;s own
            conversion when they give one.
          </p>

          <h2>Ounces: weight or volume?</h2>
          <p>
            An ounce in a list of dry ingredients is a weight: 28.35 g. A fluid ounce is a volume: about
            29.6 ml in the US and 28.4 ml in the UK. For water the two are close; for honey or flour they
            are not. The <Link href="/converters/weight-converter">Weight Converter</Link> handles
            ounces and pounds as weights; 1 lb is 16 oz, about 454 g.
          </p>

          <h2>Oven temperatures</h2>
          <table>
            <thead>
              <tr>
                <th>°F</th>
                <th>°C</th>
                <th>Gas mark</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>275</td>
                <td>140</td>
                <td>1</td>
              </tr>
              <tr>
                <td>300</td>
                <td>150</td>
                <td>2</td>
              </tr>
              <tr>
                <td>325</td>
                <td>170</td>
                <td>3</td>
              </tr>
              <tr>
                <td>350</td>
                <td>180</td>
                <td>4</td>
              </tr>
              <tr>
                <td>375</td>
                <td>190</td>
                <td>5</td>
              </tr>
              <tr>
                <td>400</td>
                <td>200</td>
                <td>6</td>
              </tr>
              <tr>
                <td>425</td>
                <td>220</td>
                <td>7</td>
              </tr>
              <tr>
                <td>450</td>
                <td>230</td>
                <td>8</td>
              </tr>
            </tbody>
          </table>
          <p>
            These are the rounded equivalents printed in cookbooks; 350 °F is exactly 176.7 °C. For exact
            figures, the <Link href="/converters/temperature-converter">Temperature Converter</Link>{" "}
            shows Celsius, Fahrenheit and Kelvin together.
          </p>
          <p>
            <strong>Fan ovens</strong> cook faster because the air moves. Many recipes suggest setting
            a fan oven about 20 °C lower than a conventional one — so 180 °C conventional becomes about
            160 °C fan. Follow the recipe if it gives both.
          </p>

          <h2>Butter, eggs and other awkward units</h2>
          <ul>
            <li>
              <strong>Butter</strong> in American recipes often comes in sticks or tablespoons. One US
              stick is 8 tablespoons, about 113 g or 4 oz.
            </li>
            <li>
              <strong>Eggs</strong> are graded differently in different countries — a &ldquo;large&rdquo;
              egg is not the same weight everywhere — so in recipes where precision matters, weigh them.
            </li>
            <li>
              <strong>&ldquo;A stick&rdquo;, &ldquo;a knob&rdquo;, &ldquo;a pinch&rdquo;</strong> and
              similar measures are approximate by nature; a pinch of salt is a small amount, roughly
              what you can hold between finger and thumb.
            </li>
            <li>
              <strong>Tins and packets</strong> come in different standard sizes in different countries.
              Check the weight or volume printed on the recipe&apos;s ingredient rather than the number
              of tins.
            </li>
          </ul>

          <h2>Converting a whole recipe</h2>
          <ol>
            <li>Find out where the recipe comes from, so you know which cups, spoons and pints it means.</li>
            <li>Convert liquids by volume; they are reliable.</li>
            <li>For flour, sugar and butter, use weights where the author provides them, or the typical figures above.</li>
            <li>Convert the oven temperature, adjusting for a fan oven.</li>
            <li>Keep the proportions: if you round one ingredient, round the others the same way.</li>
          </ol>

          <h2>Scaling a recipe up or down</h2>
          <p>
            Multiply every ingredient by the same factor. Baking times do not scale the same way — a cake
            twice the size does not take twice as long, and a deeper tin cooks differently — so check
            for doneness rather than relying on the original time.
          </p>
        </>
      );
    },
  },
];
