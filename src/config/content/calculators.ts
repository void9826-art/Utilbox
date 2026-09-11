import type { ToolContent } from "@/types/tool";

const FINANCE_DISCLAIMER =
  "This calculator is a general illustration, not financial advice. Lenders apply their own fees, rounding rules and day-count conventions, so a real quote will differ. Always check the figures with the provider before committing.";

export const calculatorContent: Record<string, ToolContent> = {
  "paint-coverage-calculator": {
    seoTitle: "Paint Calculator — How Much Paint Do I Need?",
    seoDescription:
      "How much paint do I need? Work out litres or gallons for a room from its size, doors, windows and coats, get the tins to buy, and count wallpaper rolls too.",
    intro:
      "Enter a room's size to see how much paint to buy — including the best mix of tins — or how many rolls of wallpaper you need.",
    howToUse: [
      "Choose Paint or Wallpaper, and metric or US units.",
      "Enter the room's length, width and wall height.",
      "For paint, add doors, windows, coats and the coverage printed on the tin; for wallpaper, the roll size and pattern repeat.",
      "Read how much to buy and which tins or how many rolls.",
    ],
    howItWorks: [
      "Wall area is the room's perimeter multiplied by its height: 2 × (length + width) × height. Doors and windows are subtracted using typical sizes you can change, and the ceiling can be added. The paint needed is that area multiplied by the number of coats, divided by the paint's coverage, plus an allowance for waste.",
      "Coverage is printed on the tin, usually as square metres per litre or square feet per gallon. Interior wall paints typically cover about 10–14 m² per litre, or 350–400 ft² per gallon, on a smooth surface that has been painted before. Bare plaster, rough textures and big colour changes use more.",
      "The tin suggestion searches every combination of standard sizes — 10, 5, 2.5 and 1 litre, or 5-gallon buckets, gallons and quarts — for the fewest containers that cover what you need.",
      "Wallpaper is counted in drops, the full-height strips. Each drop is the wall height plus the pattern repeat plus a trimming allowance; a roll gives as many whole drops as fit its length; and the room needs as many drops as the roll width divides into the perimeter. Doors and windows are not subtracted, because offcuts rarely match the pattern.",
    ],
    formula: {
      expression: "paint = (2 × (L + W) × H − doors − windows) × coats ÷ coverage × (1 + waste)",
      where: [
        "L, W, H — room length, width and wall height",
        "coverage — the area one litre or gallon covers in one coat",
        "waste — the allowance for spills, rollers and touch-ups",
      ],
      note: "Wallpaper rolls = ⌈perimeter ÷ roll width⌉ ÷ ⌊roll length ÷ (height + repeat + trim)⌋, rounded up.",
    },
    example: {
      scenario: "A 4 × 3 m bedroom with 2.5 m walls, one door, one window and two coats",
      steps: [
        "Walls: 2 × (4 + 3) × 2.5 = 35 m².",
        "Minus a 1.9 m² door and a 1.5 m² window: 31.6 m².",
        "31.6 m² × 2 coats ÷ 12 m² per litre = 5.27 L, plus 10% = 5.79 L.",
      ],
      result: "About 5.8 litres — one 5 L tin and one 1 L tin.",
    },
    faq: [
      {
        question: "How much does a litre of paint cover?",
        answer: "Typically 10–14 m² per coat for interior wall paint on a smooth surface. The exact figure is printed on the tin.",
      },
      {
        question: "Do I need two coats?",
        answer:
          "Usually. A second coat evens out colour and sheen, and is almost always needed when changing colour significantly or painting new plaster.",
      },
      {
        question: "Does it include the ceiling?",
        answer:
          "Tick Include the ceiling to add length × width. Ceilings are usually painted with a different, flat paint, so you may prefer to work them out separately.",
      },
      {
        question: "How many extra rolls of wallpaper should I buy?",
        answer:
          "The calculation already ignores doors and windows, which leaves some spare. Buy one more roll from the same batch number if you want room for mistakes or later repairs, because rolls from different batches can differ slightly in colour.",
      },
    ],
  },

  "pet-age-calculator": {
    seoTitle: "Dog Age in Human Years Calculator — Dogs and Cats",
    seoDescription:
      "Convert a dog's age to human years using its size or breed, compare it with the 2020 DNA-based formula, and work out a cat's age in human years too.",
    intro:
      "Find out how old your dog or cat is in human years. Dogs are adjusted for size, because large breeds age faster than small ones.",
    howToUse: [
      "Choose Dog or Cat.",
      "Enter your pet's age in years and months.",
      "For a dog, choose the breed — or choose by weight for a mixed breed.",
      "Read the human-equivalent age, life stage and the full chart for that size.",
    ],
    howItWorks: [
      "The old rule that one dog year equals seven human years is wrong in both directions. Dogs mature very quickly — a one-year-old dog is roughly as developed as a teenager — and then age more slowly, at a pace that depends on size.",
      "For dogs the calculator uses the size-based chart widely used by veterinary practices: the first year counts as about 15 human years (12 for giant breeds), the second adds about 9, and each year after that adds from 4 years for small dogs to 7 for giant ones. Breeds are grouped by typical adult weight — small up to 9 kg (20 lb), medium to 23 kg (50 lb), large to 45 kg (100 lb) and giant above that — and ages between whole years are interpolated.",
      "It also shows a newer estimate from a 2020 study by researchers at the University of California, San Diego, who compared age-related chemical marks on DNA in Labrador retrievers and people: human age ≈ 16 × ln(dog age) + 31. It was measured in one breed, so treat it as an interesting comparison rather than the answer.",
      "For cats the calculator follows International Cat Care's chart: a cat is about 15 in human terms at one year and 24 at two, and each year after that adds about four human years.",
    ],
    formula: {
      expression: "dog: size chart      DNA estimate = 16 × ln(dog age) + 31      cat = 24 + 4 × (age − 2)",
      where: ["ln — the natural logarithm", "ages in years; the cat formula applies from two years old"],
      note: "The DNA-based estimate applies from one year old.",
    },
    example: {
      scenario: "A 6-year-old Labrador Retriever",
      steps: [
        "Labradors are large dogs.",
        "The large-dog chart gives 45 human years at age 6.",
        "The DNA formula gives 16 × ln 6 + 31 = 59.7.",
      ],
      result: "About 45 in human years by the size chart, or about 60 by the DNA-based formula.",
    },
    faq: [
      {
        question: "Is one dog year really seven human years?",
        answer:
          "No. Dogs age fastest in their first two years and more slowly afterwards, and larger dogs age faster than smaller ones. The seven-year rule has no scientific basis.",
      },
      {
        question: "Why do big dogs age faster?",
        answer:
          "Large and giant breeds have shorter lifespans and reach old age sooner. The biological reasons are still being studied, which is why the chart adds more human years per year for bigger dogs.",
      },
      {
        question: "When is a cat a senior?",
        answer: "Feline life-stage guidelines class cats over 10 years old as seniors — about 56 in human terms.",
      },
      {
        question: "My dog is a mixed breed. Which size do I choose?",
        answer: "Choose by weight: enter your dog's healthy adult weight and the calculator picks the size group.",
      },
    ],
    disclaimer:
      "These are rules of thumb for comparing life stages, not a health assessment. Your vet can judge how your pet is ageing far better than any chart.",
  },

  "take-home-pay-calculator": {
    seoTitle: "UK Take-Home Pay Calculator 2026/27 — Plus CA, AU, IN",
    seoDescription:
      "Work out take-home pay after tax for the 2026/27 UK tax year, including National Insurance, pension and student loans — plus Canada, Australia and India.",
    intro:
      "See what you actually take home from a salary after income tax, National Insurance, pension and student loans — with versions for Canada, Australia and India.",
    howToUse: [
      "Choose the country.",
      "Enter your gross salary, per year or per month.",
      "Add the details that apply: Scotland, pension and student loan in the UK; province in Canada; a HELP debt in Australia; tax regime and deductions in India.",
      "Read your take-home pay per year, month and week, and the breakdown of every deduction.",
    ],
    howItWorks: [
      "UK, tax year 6 April 2026 to 5 April 2027: the Personal Allowance is £12,570, reduced by £1 for every £2 of income over £100,000. In England, Wales and Northern Ireland income tax is 20% up to £50,270, 40% up to £125,140 and 45% above; Scotland has six bands from 19% to 48%. Employee National Insurance is 8% between £12,570 and £50,270 and 2% above. Student loans are repaid at 9% above the plan threshold (Plan 1 £26,900, Plan 2 £29,385, Plan 4 £33,795, Plan 5 £25,000) and postgraduate loans at 6% above £21,000. Salary sacrifice reduces tax, National Insurance and loan repayments; a net pay arrangement reduces tax only.",
      "Canada, 2026: federal tax from 14% to 33%, plus provincial tax for Ontario, British Columbia or Alberta, each after the basic personal amount and credits for CPP and EI. Ontario's surtax and Health Premium are included. CPP is 5.95% of earnings between $3,500 and $74,600, CPP2 is 4% up to $85,000, and EI is 1.63% up to $68,900.",
      "Australia, 2026–27 for residents: no tax up to $18,200, then 15%, 30% from $45,000, 37% from $135,000 and 45% from $190,000, less the low income tax offset, plus the 2% Medicare levy. HELP repayments use the marginal system: 15% of income above $69,528, rising in later tiers. Employer super at 12% is paid on top of salary and shown separately.",
      "India, FY 2026–27: the new regime's slabs run from nil up to ₹4 lakh to 30% above ₹24 lakh, with a ₹75,000 standard deduction and no tax on taxable income up to ₹12 lakh thanks to the section 87A rebate, with marginal relief just above it. The old regime keeps the ₹2.5 lakh exemption, 5–30% slabs, a ₹50,000 standard deduction and deductions such as 80C. Surcharge, with marginal relief, and the 4% health and education cess apply to both.",
    ],
    example: {
      scenario: "A £40,000 salary in England with no pension or student loan",
      steps: [
        "Income Tax: (£40,000 − £12,570) × 20% = £5,486.",
        "National Insurance: (£40,000 − £12,570) × 8% = £2,194.40.",
        "£40,000 − £5,486 − £2,194.40.",
      ],
      result: "£32,319.60 a year, or £2,693.30 a month.",
    },
    faq: [
      {
        question: "How much is £30,000 after tax in the UK?",
        answer:
          "In England, Wales and Northern Ireland in 2026/27, £25,119.60 a year, or £2,093.30 a month, assuming no pension contributions or student loan.",
      },
      {
        question: "Why is my payslip different?",
        answer:
          "Payroll works out tax and National Insurance each pay period using your tax code, so one-off payments, benefits in kind, emergency tax codes and pension schemes all change the figures. The calculator shows the full-year position.",
      },
      {
        question: "Does salary sacrifice save more than a normal pension scheme?",
        answer:
          "Salary sacrifice reduces National Insurance as well as income tax, so for the same contribution it usually leaves more in your pocket than relief at source.",
      },
      {
        question: "Which Indian tax regime is better for me?",
        answer:
          "The new regime is better unless your deductions — 80C, HRA, home loan interest and so on — are large. Switch the regime in the calculator to compare both on your own figures.",
      },
    ],
    disclaimer:
      "An estimate for a single employee with no other income, not tax advice. Real payslips differ because tax is worked out per pay period and depends on your tax code, benefits, other income and claims. Not included: Ontario's and British Columbia's low-income tax reductions, Quebec, Australia's Medicare levy surcharge, higher-rate relief on UK relief-at-source pensions, and India's rounding of tax to the nearest ₹10.",
  },

  "ev-charging-cost-calculator": {
    seoTitle: "EV Charging Cost Calculator — Per Charge and Per Mile",
    seoDescription:
      "Work out what it costs to charge an electric car at home or in public — per charge, per mile or kilometre, and per month — and compare it with petrol.",
    intro:
      "See what charging an electric car really costs: for a single charge, per mile or kilometre, and per month, compared with running a petrol car.",
    howToUse: [
      "Choose One charge or Cost per distance.",
      "For one charge, enter the battery size, the start and end charge levels and your electricity price.",
      "For running costs, enter your car's consumption, the distance you drive and how much charging is done in public.",
      "Add a petrol car's fuel economy and fuel price to compare.",
    ],
    howItWorks: [
      "The energy a charge adds is the battery capacity multiplied by the change in charge level: taking a 60 kWh battery from 20% to 80% adds 36 kWh. Charging is not perfectly efficient — some energy is lost as heat in the charger and battery — so more is drawn from the grid than ends up in the battery. Home charging typically loses around 10%, which is the default efficiency here.",
      "Running cost per mile or kilometre comes from the car's consumption — shown on its dashboard or in its specification as kWh per 100 km, kWh per 100 miles or miles per kWh. Divided by charging efficiency and multiplied by your electricity price, it gives the cost of each mile or kilometre. Public rapid chargers usually cost several times more per kWh than home electricity, so the share of public charging matters.",
      "The petrol comparison converts fuel economy into fuel used per mile or kilometre and multiplies by the fuel price, using exact gallon sizes: a US gallon is 3.785 litres and a UK gallon 4.546 litres, which is why UK mpg figures look higher for the same car.",
    ],
    formula: {
      expression: "cost per charge = battery × (end % − start %) ÷ efficiency × price per kWh",
      where: [
        "battery — usable battery capacity in kWh",
        "efficiency — the share of grid electricity that reaches the battery",
      ],
      note: "Running cost per distance = consumption ÷ efficiency × electricity price.",
    },
    example: {
      scenario: "Charging a 60 kWh battery from 20% to 80% at $0.15 per kWh",
      steps: [
        "Energy added: 60 kWh × (80% − 20%) = 36 kWh.",
        "Drawn from the grid at 90% efficiency: 36 ÷ 0.9 = 40 kWh.",
        "40 kWh × $0.15.",
      ],
      result: "$6.00 for the charge.",
    },
    faq: [
      {
        question: "How much does it cost to fully charge an electric car?",
        answer:
          "Divide the battery size by the charging efficiency and multiply by your electricity price. A 60 kWh battery at $0.15 per kWh costs about $10.00 from empty to full at home.",
      },
      {
        question: "Is it cheaper to charge at home?",
        answer:
          "Almost always. Home electricity — especially on an off-peak tariff — usually costs far less per kWh than public rapid charging.",
      },
      {
        question: "Why does my car use more energy in winter?",
        answer:
          "Cold batteries are less efficient and heating the cabin draws power, so consumption rises in cold weather. Use a winter figure from your car's trip computer for a realistic estimate.",
      },
      {
        question: "Should I charge to 100%?",
        answer:
          "Many manufacturers recommend charging to around 80% for everyday use and to 100% before long trips. Check your car's handbook, as advice differs between battery types.",
      },
    ],
  },

  "subscription-cost-tracker": {
    seoTitle: "Subscription Cost Calculator — Track and Print Costs",
    seoDescription:
      "Add up every subscription to see what they really cost per month and per year, spot what to cancel, see upcoming renewals, and print or export the list.",
    intro:
      "List your subscriptions — streaming, software, gym, cloud storage — and see the true monthly and yearly total, the renewals coming up, and what cancelling would save.",
    howToUse: [
      "Add each subscription with its price and how often it bills.",
      "Optionally add the next renewal date and a category.",
      "Tick Cancel? on the ones you are unsure about to see what dropping them would save.",
      "Print the list or export it as CSV. It is also kept in this browser for next time.",
    ],
    howItWorks: [
      "Subscriptions bill on different cycles, which hides their real cost. The tracker converts each one to a monthly and a yearly figure — a weekly charge is multiplied by 52 and divided by 12, a quarterly one divided by three, a yearly one divided by twelve — and adds them up, so a $6.99 weekly plan appears as the $30.29 a month it really costs.",
      "Totals by category show where the money goes, and ticking the subscriptions you might cancel shows the monthly and yearly saving. Renewal dates roll forward by each subscription's billing cycle, so the list of upcoming renewals stays current, and dates at the end of a month renew on the last day of shorter months.",
      "Your list is saved in this browser's local storage and never sent to a server. Clearing your browser data removes it, so export a CSV if you want a copy.",
    ],
    example: {
      scenario: "Three subscriptions: $15.49 monthly, $6.99 weekly and $99 yearly",
      steps: [
        "$15.49 monthly stays $15.49 a month.",
        "$6.99 × 52 ÷ 12 = $30.29 a month.",
        "$99 ÷ 12 = $8.25 a month.",
      ],
      result: "$54.03 a month, or $648.36 a year.",
    },
    faq: [
      {
        question: "How do I find all my subscriptions?",
        answer:
          "Search your email for “receipt”, “renewal” and “subscription”, check the subscription pages in the Apple App Store and Google Play, and scan the last three months of bank and card statements for repeat charges.",
      },
      {
        question: "Is my list saved?",
        answer: "Yes, in this browser only, using local storage. Nothing is uploaded, and the list does not sync to your other devices.",
      },
      {
        question: "How are weekly subscriptions converted to monthly?",
        answer: "A year has 52 weeks and 12 months, so a weekly price is multiplied by 52 and divided by 12 — about 4.33 weeks per month, not 4.",
      },
      {
        question: "Can I print my list?",
        answer: "Yes. Press Print list for a clean table of every subscription with its monthly and yearly cost, without the editing controls.",
      },
    ],
  },

  "percentage-calculator": {
    seoTitle: "Percentage Calculator — Percent Of, Increase & Change",
    seoDescription:
      "Work out what percent of a number, what percentage one number is of another, and percentage increases or decreases. Every answer shows the formula used.",
    intro:
      "Four percentage questions in one place: what is X% of Y, X is what percent of Y, percentage change, and adding or removing a percentage.",
    howToUse: [
      "Pick the type of question you want to answer using the tabs.",
      "Type your numbers — the result updates as you type.",
      "Read the worked explanation below the answer to check the method.",
      "Switch tabs at any time; each keeps its own values.",
    ],
    howItWorks: [
      "A percentage is just a fraction with 100 on the bottom. Every calculation here is that one idea rearranged: to find a part you multiply, to find a rate you divide, and to find a change you compare the difference with where you started.",
      "The one people most often get wrong is percentage change, because it matters which number you divide by. Going from 50 to 75 is a 50% increase, but going back from 75 to 50 is a 33.3% decrease — the same gap measured against a different starting point.",
      "Results are rounded for display but calculated at full precision, so chaining answers together does not accumulate rounding error.",
    ],
    formula: {
      expression: "part = (percent ÷ 100) × whole      percent = (part ÷ whole) × 100      change = ((new − old) ÷ old) × 100",
      where: [
        "percent — the rate, written without the % sign",
        "whole — the number the percentage is taken from",
        "part — the resulting amount",
        "old / new — the values before and after the change",
      ],
      note: "Percentage change always divides by the original value, which is why an increase and the decrease that undoes it are different percentages.",
    },
    example: {
      scenario: "A £80 jacket is reduced to £60",
      steps: [
        "Choose the percentage change tab.",
        "Enter 80 as the original value and 60 as the new value.",
        "The tool computes (60 − 80) ÷ 80 × 100.",
      ],
      result: "A 25% decrease — a saving of £20.",
    },
    faq: [
      {
        question: "How do I work out a percentage of a number?",
        answer:
          "Divide the percentage by 100 and multiply by the number. 15% of 240 is 0.15 × 240 = 36.",
      },
      {
        question: "Why is a 50% rise not cancelled by a 50% fall?",
        answer:
          "Because each is measured against a different base. 100 rising by 50% gives 150; 150 falling by 50% gives 75, not 100. To undo a 50% rise you need a 33.3% fall.",
      },
      {
        question: "What is the difference between percent and percentage points?",
        answer:
          "If a rate moves from 4% to 6% it has risen by 2 percentage points, but by 50 percent. Percentage points measure the gap between two rates; percent measures relative change.",
      },
      {
        question: "How do I add tax or a tip to a price?",
        answer:
          'Use the "Add or subtract a percentage" tab. It multiplies by 1 plus the rate, so 20% added to 50 gives 60.',
      },
    ],
  },

  "age-calculator": {
    seoTitle: "Age Calculator — Exact Age in Years, Months and Days",
    seoDescription:
      "Find an exact age in years, months and days from any date of birth, plus total days lived and a countdown to the next birthday.",
    intro:
      "Work out an exact age in years, months and days — plus total weeks and days lived, and how long until the next birthday.",
    howToUse: [
      "Enter the date of birth.",
      'Leave the second date as today, or set it to work out an age on a particular date.',
      "Read the exact age, followed by the totals and the next birthday countdown.",
    ],
    howItWorks: [
      "Age is counted the way people actually count it: whole years first, then whole months, then the days left over. The tool takes the year difference, subtracts one if the birthday has not happened yet this year, then borrows days from the previous calendar month when the day-of-month has not been reached.",
      "Borrowing from the real previous month is what makes the result correct across months of different lengths. A person born on 31 January is 1 month old on 28 February in a common year, because February has no 31st.",
      "Leap years are handled by the calendar itself rather than by assuming 365.25 days. Someone born on 29 February has their anniversary treated as 1 March in common years, which is the most widely used convention.",
    ],
    example: {
      scenario: "Someone born on 15 March 2001, checked on 5 September 2026",
      steps: [
        "Enter 15 March 2001 as the date of birth.",
        "Leave the second date as 5 September 2026.",
      ],
      result: "25 years, 5 months and 21 days — 9,305 days in total, with the next birthday 191 days away.",
    },
    faq: [
      {
        question: "How is age calculated exactly?",
        answer:
          "Whole years since birth, then whole months since the last birthday, then the remaining days. Days are borrowed from the actual previous month, so month lengths are respected.",
      },
      {
        question: "What happens with a 29 February birthday?",
        answer:
          "In common years the anniversary is treated as 1 March, which is the convention most countries use for legal purposes.",
      },
      {
        question: "Can I calculate age on a past or future date?",
        answer:
          "Yes. Change the second date to any date you like, before or after today.",
      },
      {
        question: "Does it count the day of birth?",
        answer:
          "The day of birth counts as day zero, which is why someone born today is nought days old rather than one.",
      },
    ],
  },

  "gpa-calculator": {
    seoTitle: "GPA Calculator — Weighted Grade Point Average",
    seoDescription:
      "Calculate a weighted GPA from your courses and credit hours. Supports 4.0, 4.3 and 5.0 scales, letter grades or direct grade points.",
    intro:
      "Add your courses with their credits and grades to get a credit-weighted grade point average. Works with 4.0, 4.3 and 5.0 scales.",
    howToUse: [
      "Choose the grading scale your institution uses.",
      "Add a row for each course with its credit hours and the grade you received.",
      "Add or remove rows as needed — the GPA updates as you go.",
      "Courses graded pass/fail can be marked as excluded so they do not affect the average.",
    ],
    howItWorks: [
      "A GPA is a weighted mean, not a simple average. Each course's grade points are multiplied by its credit hours, those products are added up, and the total is divided by the total credits attempted. A five-credit course therefore moves your GPA more than a two-credit one.",
      "The scale you choose determines what each letter is worth. On the common 4.0 scale an A is 4.0 and a B is 3.0; the 4.3 scale adds an A+ at 4.3; and the 5.0 scale is used where honours or AP courses carry extra weight. You can also type grade points directly if your institution publishes them.",
      "Pass/fail and audited courses are normally excluded from the calculation entirely — they earn credit but carry no grade points — which is why marking them excluded removes their credits from the denominator as well.",
    ],
    formula: {
      expression: "GPA = Σ (grade points × credits) ÷ Σ credits",
      where: [
        "grade points — the numeric value of the letter grade on your scale",
        "credits — the credit hours, units or weight of the course",
        "Σ — the sum across every graded course",
      ],
      note: "Excluded pass/fail courses are left out of both sums.",
    },
    example: {
      scenario: "Four courses in one semester on a 4.0 scale",
      steps: [
        "Biology, 4 credits, grade A (4.0) → 16.0 points",
        "History, 3 credits, grade B+ (3.3) → 9.9 points",
        "Maths, 4 credits, grade B (3.0) → 12.0 points",
        "Art, 2 credits, grade A− (3.7) → 7.4 points",
      ],
      result: "45.3 total points ÷ 13 credits = a GPA of 3.48.",
    },
    faq: [
      {
        question: "What is the difference between GPA and CGPA?",
        answer:
          "GPA usually covers one term; CGPA is the cumulative figure across every term so far. Use the CGPA calculator to combine several semesters.",
      },
      {
        question: "Do pass/fail courses count?",
        answer:
          "At most institutions they do not affect the GPA. Mark them as excluded and they are removed from both the points and the credits.",
      },
      {
        question: "Why does one bad grade in a big course hurt so much?",
        answer:
          "Because credits are weights. A poor grade in a five-credit course carries more than twice the influence of the same grade in a two-credit course.",
      },
      {
        question: "Which scale should I choose?",
        answer:
          "Whichever your institution publishes. If your transcript shows an A+ worth more than 4.0, choose 4.3 or 5.0; otherwise the standard 4.0 scale is right.",
      },
    ],
  },

  "cgpa-calculator": {
    seoTitle: "CGPA Calculator — Cumulative GPA Across Semesters",
    seoDescription:
      "Combine semester GPAs into a cumulative CGPA, weighted by the credits in each term. Includes a CGPA to percentage estimate.",
    intro:
      "Combine each semester's GPA and credit load into one cumulative figure, and see what it converts to as a percentage.",
    howToUse: [
      "Add a row for each semester you have completed.",
      "Enter that semester's GPA and the number of credits it carried.",
      "The cumulative CGPA updates as you add rows.",
      "Use the projection box to see what a future semester would do to your CGPA.",
    ],
    howItWorks: [
      "A CGPA is a weighted average of semester GPAs, using each semester's credit load as its weight. Semesters where you took more credits therefore pull the cumulative figure harder — which is why a light semester with a perfect GPA moves the total less than students often expect.",
      "The projection tool answers the practical question directly: given where you are now, what GPA does the next semester need for you to reach a target? It rearranges the same weighted-average formula to solve for the unknown term, and tells you plainly when the target is not reachable in one semester.",
      "The percentage conversion uses the widely published CGPA × 9.5 formula. It is an approximation adopted by several boards, not a universal standard — your institution's own conversion table always takes precedence.",
    ],
    formula: {
      expression: "CGPA = Σ (semester GPA × semester credits) ÷ Σ semester credits",
      where: [
        "semester GPA — the grade point average for that term",
        "semester credits — total credit hours attempted that term",
        "Σ — the sum across every semester entered",
      ],
    },
    faq: [
      {
        question: "How do I convert CGPA to a percentage?",
        answer:
          "The common approximation is CGPA × 9.5, so a CGPA of 8.2 is about 77.9%. Check your institution's official table, because conversions vary.",
      },
      {
        question: "Why did my CGPA barely move after a great semester?",
        answer:
          "Because it is weighted by credits and averaged over everything you have done. The more credits already behind you, the less any single term can shift the total.",
      },
      {
        question: "Can I see what I need next semester to hit a target?",
        answer:
          "Yes. Enter your target CGPA and the credits you plan to take, and the tool works out the GPA that semester would need — or tells you if it is out of reach.",
      },
    ],
  },

  "grade-calculator": {
    seoTitle: "Grade Calculator — Marks to Percentage and Grade",
    seoDescription:
      "Turn marks into a percentage and a letter grade, combine weighted assessments, and find out what you need on the final exam.",
    intro:
      "Turn marks into a percentage and a letter grade. Combine weighted assessments, or work out what the final exam needs to be.",
    howToUse: [
      "Add each assessment with the marks you scored, the marks available, and its weight in the course.",
      "The overall percentage and letter grade update as you type.",
      "Use the final exam planner to find the score you need for a target grade.",
      "Switch grading scales if your institution uses different boundaries.",
    ],
    howItWorks: [
      "Each assessment is converted to its own percentage, multiplied by its weight, and the weighted results are added together. If the weights you enter do not add up to 100%, the tool normalises them — so entering four assessments weighted 1 each treats them as equal quarters.",
      "The final exam planner rearranges that sum. It takes the weight you have already banked, the target overall percentage, and solves for the score needed on the remaining assessment. When the required score is above 100% it says so plainly, rather than showing an impossible number without comment.",
      "Letter grades come from the boundary table for the scale you select. Boundaries vary between institutions, so treat the letter as indicative and the percentage as the reliable figure.",
    ],
    formula: {
      expression: "overall % = Σ ((score ÷ maximum) × weight) ÷ Σ weight × 100",
      where: [
        "score — marks you achieved on an assessment",
        "maximum — marks available for that assessment",
        "weight — how much that assessment counts toward the course",
      ],
      note: "Weights are normalised, so they do not have to add up to exactly 100.",
    },
    example: {
      scenario: "A course with coursework, a midterm and a final",
      steps: [
        "Coursework: 42/50, weight 20 → 84% × 0.20",
        "Midterm: 61/80, weight 30 → 76.25% × 0.30",
        "Final: 70/100, weight 50 → 70% × 0.50",
      ],
      result: "16.8 + 22.9 + 35.0 = 74.7% overall, which is a C on a standard scale.",
    },
    faq: [
      {
        question: "What do I need on the final to pass?",
        answer:
          "Enter your completed assessments, set the target percentage, and the planner solves for the final score required. It tells you clearly if the target cannot be reached.",
      },
      {
        question: "Do my weights have to add up to 100?",
        answer:
          "No. They are normalised, so weights of 1, 1, 2 are treated as 25%, 25% and 50%.",
      },
      {
        question: "Why is my letter grade different from my school's?",
        answer:
          "Grade boundaries are set by each institution and differ widely. Pick the closest scale, or read the percentage and apply your own boundaries.",
      },
    ],
  },

  "attendance-calculator": {
    seoTitle: "Attendance Calculator — Percentage and Classes Needed",
    seoDescription:
      "Work out your attendance percentage, how many classes you can still miss, and how many you must attend in a row to reach the required minimum.",
    intro:
      "See where your attendance stands, how many more classes you must attend to reach the requirement, and how many you can safely miss.",
    howToUse: [
      "Enter the total number of classes held so far and how many you attended.",
      "Set the minimum attendance your institution requires.",
      "Optionally enter how many classes are still to come this term.",
      "Read the verdict — either how many you can miss, or how many you must attend in a row.",
    ],
    howItWorks: [
      "Your current percentage is attended ÷ held. The interesting question is what happens next, and that depends on which side of the requirement you are on.",
      "If you are above the line, the tool works out how many classes you could skip before your percentage drops below it — solving attended ÷ (held + skipped) ≥ required for the largest whole number of skips.",
      "If you are below the line, it solves the mirror problem: how many consecutive classes you must attend for (attended + x) ÷ (held + x) to reach the requirement. There is a hard limit here that catches people out — if you have missed enough classes, no number of future attendances can rescue the percentage within the classes remaining. The tool checks this against your remaining classes and says so directly.",
    ],
    formula: {
      expression: "attendance % = (attended ÷ held) × 100      classes needed = ⌈(r × held − attended) ÷ (1 − r)⌉",
      where: [
        "attended — classes you were present for",
        "held — classes conducted so far",
        "r — required attendance as a decimal, e.g. 0.75 for 75%",
        "⌈ ⌉ — round up to the next whole class",
      ],
      note: "The second formula only has a solution when the requirement is below 100%.",
    },
    example: {
      scenario: "38 attended out of 52 held, with a 75% requirement",
      steps: [
        "Current attendance is 38 ÷ 52 = 73.1%, which is below the line.",
        "Needed = (0.75 × 52 − 38) ÷ (1 − 0.75) = (39 − 38) ÷ 0.25 = 4.",
      ],
      result: "Attend the next 4 classes without missing one and you reach 75% exactly.",
    },
    faq: [
      {
        question: "How many classes can I miss and stay above 75%?",
        answer:
          "Enter your figures and the tool gives the exact number. As a rule of thumb, once you are at exactly 75% you can miss one class for every three you attend.",
      },
      {
        question: "Why does it say the requirement cannot be met?",
        answer:
          "Because there are not enough classes left in the term. Once too many are missed, the arithmetic cannot recover within the remaining sessions — the tool tells you rather than showing an unreachable target.",
      },
      {
        question: "Should I count cancelled classes?",
        answer:
          "No. Only count classes that were actually held, since those are what your institution's register records.",
      },
    ],
  },

  "emi-calculator": {
    seoTitle: "EMI Calculator — Monthly Instalment and Amortisation",
    seoDescription:
      "Calculate your equated monthly instalment, total interest and full repayment schedule for any loan amount, rate and tenure.",
    intro:
      "Work out the equated monthly instalment on a loan, the total interest you will pay, and see every payment in the schedule.",
    howToUse: [
      "Enter the loan amount, the annual interest rate and the tenure.",
      "Switch the tenure between months and years if that is easier.",
      "Read the monthly instalment, total interest and total repayment.",
      "Open the schedule to see how each payment splits between interest and principal.",
    ],
    howItWorks: [
      "An EMI is a level payment: the same amount every month for the whole term. Each payment covers the interest that accrued on the outstanding balance, and whatever is left reduces the principal. Because the balance shrinks, the interest portion falls month by month and the principal portion rises — which is why early payments feel like they barely dent the loan.",
      "The instalment itself comes from the standard annuity formula, using the monthly rate (annual rate ÷ 12) and the number of months.",
      "The schedule is built in whole cents rather than by accumulating rounded floats, and the final instalment absorbs the rounding remainder. That is why the closing balance lands on exactly zero instead of a few cents adrift after 240 rows.",
    ],
    formula: {
      expression: "EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)",
      where: [
        "P — principal, the amount borrowed",
        "r — monthly interest rate, the annual rate ÷ 12 ÷ 100",
        "n — total number of monthly payments",
      ],
      note: "When the rate is zero the formula collapses to P ÷ n, which the calculator handles separately.",
    },
    example: {
      scenario: "Borrowing 500,000 over 5 years at 9% a year",
      steps: [
        "Monthly rate r = 9 ÷ 12 ÷ 100 = 0.0075",
        "Number of payments n = 60",
        "EMI = 500000 × 0.0075 × 1.0075⁶⁰ ÷ (1.0075⁶⁰ − 1)",
      ],
      result: "10,379.18 a month, repaying 622,750.59 in total — of which 122,750.59 is interest.",
    },
    disclaimer: FINANCE_DISCLAIMER,
    faq: [
      {
        question: "What does EMI stand for?",
        answer:
          "Equated Monthly Instalment — a fixed monthly payment covering both interest and principal, so the loan clears exactly at the end of the term.",
      },
      {
        question: "Why is most of my early payment interest?",
        answer:
          "Interest is charged on the balance outstanding, which is at its largest at the start. As the balance falls the interest share falls with it and more of each payment goes to principal.",
      },
      {
        question: "Does a longer tenure make the loan cheaper?",
        answer:
          "It lowers the monthly payment but raises the total cost, because you are borrowing the money for longer. The schedule shows both figures side by side.",
      },
      {
        question: "Why does my bank quote a slightly different EMI?",
        answer:
          "Lenders add processing fees, insurance and their own rounding and day-count rules. Treat this as a close estimate rather than a quote.",
      },
    ],
  },

  "loan-calculator": {
    seoTitle: "Loan Calculator — Payments, Interest and Amortisation",
    seoDescription:
      "Calculate loan repayments for any amount, rate and term. Compare monthly, fortnightly and weekly schedules and see the full amortisation table.",
    intro:
      "Work out repayments on any loan, compare payment frequencies, and see the full breakdown of interest against principal.",
    howToUse: [
      "Enter the amount you want to borrow, the annual interest rate and the term.",
      "Choose how often you will make payments.",
      "Read the payment amount, total interest and total repaid.",
      "Open the amortisation table for a period-by-period breakdown.",
    ],
    howItWorks: [
      "The same annuity mathematics applies whatever the payment frequency: the annual rate is divided by the number of payments per year, the term is multiplied by it, and the level payment is calculated from those two figures.",
      "Paying more often genuinely costs less. With fortnightly payments the balance is reduced 26 times a year rather than 12, so less interest accrues between reductions — and because 26 fortnights is slightly more than 12 months of payments, you also pay marginally more per year. Both effects shorten the loan.",
      "Amounts are tracked in whole cents throughout, so every row of the schedule adds up and the balance finishes at exactly zero.",
    ],
    formula: {
      expression: "payment = P × r ÷ (1 − (1 + r)⁻ⁿ)",
      where: [
        "P — amount borrowed",
        "r — interest rate per payment period",
        "n — total number of payments",
      ],
      note: "This is the annuity formula written in its negative-exponent form; it gives the same result as the EMI expression.",
    },
    disclaimer: FINANCE_DISCLAIMER,
    faq: [
      {
        question: "Should I pay weekly or monthly?",
        answer:
          "More frequent payments reduce total interest, because the balance falls sooner and 52 weekly or 26 fortnightly payments add up to slightly more each year than 12 monthly ones. Compare the totals here before asking your lender.",
      },
      {
        question: "What is amortisation?",
        answer:
          "The process of clearing a loan through regular payments that cover interest first and reduce principal with the remainder. The table shows exactly how that split changes over time.",
      },
      {
        question: "Does this include fees?",
        answer:
          "No. Arrangement fees, insurance and early-repayment charges vary by lender and are not modelled here.",
      },
    ],
  },

  "mortgage-calculator": {
    seoTitle: "Mortgage Calculator — Monthly Payment With Taxes",
    seoDescription:
      "Calculate a monthly mortgage payment including principal, interest, property tax, insurance and HOA fees, with a full amortisation schedule.",
    intro:
      "Work out the full monthly cost of a home loan — not just principal and interest, but property tax, insurance and any association fees.",
    howToUse: [
      "Enter the home price and your deposit, either as an amount or a percentage.",
      "Set the interest rate and the loan term.",
      "Add annual property tax, home insurance and any monthly association fee.",
      "Read the total monthly payment and the breakdown beneath it.",
    ],
    howItWorks: [
      "The loan amount is the price less your deposit. Principal and interest are calculated with the standard annuity formula on that amount. Annual property tax and insurance are divided by twelve and added, along with any monthly association fee — the combination lenders often call PITI.",
      "Separating these matters, because only principal and interest shrink the debt. Tax and insurance are ongoing costs that continue after the mortgage is repaid, and they are frequently the reason a monthly payment is larger than a rate calculator suggested.",
      "The amortisation schedule shows principal and interest only, since that is the part that actually pays down the loan.",
    ],
    formula: {
      expression: "monthly = (L × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)) + tax/12 + insurance/12 + HOA",
      where: [
        "L — loan amount, the price minus the deposit",
        "r — monthly interest rate",
        "n — number of monthly payments over the term",
      ],
    },
    example: {
      scenario: "A 350,000 home with 20% down at 6.5% over 30 years",
      steps: [
        "Deposit 70,000, so the loan is 280,000.",
        "Monthly rate 0.0054167 over 360 payments gives principal and interest of about 1,770.",
        "Add 4,200 a year of tax (350) and 1,200 of insurance (100).",
      ],
      result: "About 2,220 a month in total, of which 1,770 goes to the mortgage itself.",
    },
    disclaimer: FINANCE_DISCLAIMER,
    faq: [
      {
        question: "What does PITI mean?",
        answer:
          "Principal, Interest, Taxes and Insurance — the four components most lenders bundle into one monthly payment.",
      },
      {
        question: "How much deposit do I need?",
        answer:
          "That depends on the lender and the product. Putting down 20% commonly avoids mortgage insurance, but lower-deposit products exist. Try different figures to see the effect on the monthly payment.",
      },
      {
        question: "Is mortgage insurance included?",
        answer:
          "Not as a separate line. If your lender requires it, add its monthly cost to the insurance field.",
      },
      {
        question: "Why does the total interest look so large?",
        answer:
          "Because a 30-year term means borrowing for three decades. Shortening the term raises the monthly payment but cuts total interest dramatically — worth comparing here before you decide.",
      },
    ],
  },

  "compound-interest-calculator": {
    seoTitle: "Compound Interest Calculator — With Contributions",
    seoDescription:
      "Project savings growth with compound interest and optional regular deposits. Choose any compounding frequency and see a year-by-year breakdown.",
    intro:
      "See how savings grow over time with compound interest, including the effect of paying in regularly.",
    howToUse: [
      "Enter your starting balance, the annual interest rate and how long you are investing for.",
      "Choose how often interest is compounded.",
      "Add a regular contribution if you plan to keep paying in, and say how often.",
      "Read the final balance, then open the yearly table to see how it built up.",
    ],
    howItWorks: [
      "Compounding means interest earns interest. Each period the balance is multiplied by one plus the periodic rate, so growth accelerates: the second year earns interest on the first year's interest, and so on.",
      "Compounding frequency matters less than people expect. Moving from annual to monthly compounding at 7% adds roughly a fifth of a percentage point to the effective annual rate — real, but small next to the effect of the rate itself or the time invested.",
      "Regular contributions usually dominate the outcome over long periods. Whether you pay in at the start or end of each period changes the result slightly, because a deposit made at the start earns one extra period of interest; the tool lets you choose.",
      "All balances are tracked in whole cents so the yearly table adds up exactly.",
    ],
    formula: {
      expression: "A = P(1 + r/n)^(nt) + PMT × (((1 + r/n)^(nt) − 1) ÷ (r/n))",
      where: [
        "A — final balance",
        "P — starting principal",
        "r — annual interest rate as a decimal",
        "n — compounding periods per year",
        "t — number of years",
        "PMT — the regular contribution",
      ],
      note: "The second term is the future value of the contributions; it is multiplied by (1 + r/n) when deposits are made at the start of each period.",
    },
    example: {
      scenario: "5,000 invested for 10 years at 7%, compounded monthly, plus 200 a month",
      steps: [
        "The opening 5,000 grows to about 10,048 on its own.",
        "120 monthly deposits of 200 total 24,000 contributed.",
        "Those deposits grow to roughly 34,617.",
      ],
      result: "About 44,665 in total, of which around 15,665 is interest.",
    },
    disclaimer:
      "This is a mathematical projection at a fixed rate, not a forecast. Real returns vary, and investments can fall as well as rise. It is not investment advice.",
    faq: [
      {
        question: "What is the rule of 72?",
        answer:
          "Dividing 72 by the annual percentage rate gives a rough number of years for money to double. At 8%, that is about 9 years. It is a good mental check on any projection.",
      },
      {
        question: "Does compounding frequency make much difference?",
        answer:
          "Less than most people assume. At 7%, annual compounding yields 7.00% effective and monthly yields 7.23%. Time and the rate itself matter far more.",
      },
      {
        question: "Should I contribute at the start or end of the period?",
        answer:
          "The start, if you can. Each deposit then earns one extra period of interest, which compounds over the years into a meaningful difference.",
      },
      {
        question: "Is inflation taken into account?",
        answer:
          "No. The figures are nominal. To think in today's money, subtract your expected inflation rate from the interest rate before entering it.",
      },
    ],
  },

  "bmi-calculator": {
    seoTitle: "BMI Calculator — Body Mass Index, Metric and Imperial",
    seoDescription:
      "Calculate body mass index in metric or imperial units, see which WHO category it falls in, and find the healthy weight range for your height.",
    intro:
      "Calculate body mass index from your height and weight, and see the healthy weight range for someone of your height.",
    howToUse: [
      "Choose metric or imperial units.",
      "Enter your height and weight.",
      "Read your BMI, the category it falls in, and the healthy weight range for your height.",
    ],
    howItWorks: [
      "BMI divides weight in kilograms by height in metres squared. Imperial figures are converted first: pounds to kilograms and feet and inches to metres, so both unit systems give exactly the same answer.",
      "The categories shown are the World Health Organization's adult thresholds — under 18.5 underweight, 18.5 to 24.9 healthy, 25 to 29.9 overweight, 30 and above obese. The healthy weight range is the reverse calculation: the weights that put a BMI of 18.5 and 24.9 at your height.",
      "BMI is a population-level screening measure, and it has real limits on individuals. It does not distinguish muscle from fat, so athletes often read as overweight; it does not account for body composition, fat distribution, age or ethnicity, and it is not valid for children, pregnancy, or people with a very short or very tall stature. Treat it as one rough indicator among several.",
    ],
    formula: {
      expression: "BMI = weight (kg) ÷ height (m)²",
      where: [
        "weight — body mass in kilograms",
        "height — standing height in metres",
      ],
      note: "In imperial units the equivalent is 703 × weight (lb) ÷ height (in)².",
    },
    example: {
      scenario: "Someone 1.75 m tall weighing 72 kg",
      steps: ["Height squared = 1.75 × 1.75 = 3.0625", "BMI = 72 ÷ 3.0625"],
      result: "A BMI of 23.5, which is in the healthy range. For that height, 56.7–76.3 kg is the healthy band.",
    },
    disclaimer:
      "BMI is a general screening measure, not a diagnosis or an assessment of your health. It cannot distinguish muscle from fat and does not apply to children, pregnancy or athletes. Speak to a qualified healthcare professional about your own situation.",
    faq: [
      {
        question: "What is a healthy BMI?",
        answer:
          "The WHO considers 18.5 to 24.9 the healthy range for adults. The calculator also shows the weight range that corresponds to it at your height.",
      },
      {
        question: "Why does BMI say I am overweight when I am muscular?",
        answer:
          "BMI only knows your height and weight; muscle is denser than fat, so a muscular build reads high. It is a known limitation of the measure, not an error in the arithmetic.",
      },
      {
        question: "Does BMI work for children?",
        answer:
          "No. Children are assessed against age and sex percentile charts instead, because healthy body composition changes as they grow.",
      },
      {
        question: "Is waist measurement more useful?",
        answer:
          "For some purposes, yes — waist circumference and waist-to-height ratio say more about where fat is carried, which matters clinically. BMI remains useful as a quick population-level screen.",
      },
    ],
  },

  "discount-calculator": {
    seoTitle: "Discount Calculator — Sale Price and Savings",
    seoDescription:
      "Work out a sale price, how much you saved, stacked discounts, and reverse-engineer the original price from a discounted one.",
    intro:
      "Find the sale price and what you saved, stack multiple discounts, or work backwards from a sale price to the original.",
    howToUse: [
      "Choose a mode: a single discount, several stacked discounts, or working backwards from a sale price.",
      "Enter the price and the percentage off.",
      "Read the final price, the amount saved, and the effective discount.",
      "Add a tax rate if you want to see the price you actually pay at the till.",
    ],
    howItWorks: [
      "A single discount multiplies the price by one minus the rate. Stacked discounts are the part people get wrong: 20% off then a further 10% off is not 30% off. The second discount applies to the already-reduced price, so the true saving is 28%.",
      "Working backwards divides rather than multiplies. If an item is 45 after 25% off, the original was 45 ÷ 0.75 = 60.",
      "Where tax is involved, order matters in principle but not in arithmetic: applying a discount and then tax gives the same total as tax then discount, because both are multiplications. The tool applies the discount first, which is how most retailers present it.",
    ],
    formula: {
      expression: "sale price = original × (1 − d)      stacked = original × (1 − d₁) × (1 − d₂)      original = sale ÷ (1 − d)",
      where: [
        "original — the pre-discount price",
        "d — the discount as a decimal, e.g. 0.25 for 25%",
        "d₁, d₂ — successive discounts applied one after another",
      ],
    },
    example: {
      scenario: "A 120 coat with 30% off, plus an extra 15% member discount",
      steps: ["120 × 0.70 = 84", "84 × 0.85 = 71.40"],
      result: "71.40 to pay — a saving of 48.60, an effective discount of 40.5%, not 45%.",
    },
    faq: [
      {
        question: "Do stacked discounts add together?",
        answer:
          "No. Each applies to the price after the previous one. 20% then 10% gives a 28% total saving, not 30%.",
      },
      {
        question: "How do I find the original price from a sale price?",
        answer:
          'Use the reverse mode. It divides the sale price by one minus the discount — 45 at 25% off means the original was 60.',
      },
      {
        question: "Should tax be applied before or after the discount?",
        answer:
          "The total is the same either way, since both are multiplications. Retailers normally discount first and then tax the reduced price.",
      },
    ],
  },

  "tax-calculator": {
    seoTitle: "Tax Calculator — Add or Remove VAT, GST and Sales Tax",
    seoDescription:
      "Add tax to a net price or extract the tax from a gross price. Works for VAT, GST, sales tax and any percentage rate.",
    intro:
      "Add tax to a price, or work out how much tax is already inside a total. Works for VAT, GST and sales tax at any rate.",
    howToUse: [
      "Choose whether you are adding tax to a net amount or removing it from a gross amount.",
      "Enter the amount and the tax rate.",
      "Read the net, tax and gross figures.",
      "Use the preset rates if your country's standard rate is listed.",
    ],
    howItWorks: [
      "Adding tax multiplies the net amount by one plus the rate. Removing tax is the trickier direction, and it is where mistakes happen: you cannot take 20% off a gross price to find the net. You divide by 1.20 instead.",
      "The difference is not small. Take 20% off 120 and you get 96; divide 120 by 1.2 and you get 100, which is the correct net figure. The tool always uses the division form when extracting tax.",
      "All figures are rounded to the nearest cent using half-up rounding, which is what invoices and receipts use.",
    ],
    formula: {
      expression: "gross = net × (1 + r)      net = gross ÷ (1 + r)      tax = gross − net",
      where: [
        "net — the amount before tax",
        "gross — the amount including tax",
        "r — tax rate as a decimal, e.g. 0.2 for 20%",
      ],
      note: "Extracting tax divides by (1 + r). Subtracting the rate from the gross price gives the wrong answer.",
    },
    example: {
      scenario: "A 240 invoice total that includes 20% VAT",
      steps: ["Net = 240 ÷ 1.20 = 200", "Tax = 240 − 200 = 40"],
      result: "200 net plus 40 VAT. Note that 20% of 240 is 48, which would be wrong.",
    },
    disclaimer:
      "This is a general arithmetic tool. Tax rules, thresholds, exemptions and reduced rates vary by jurisdiction and by product. Check with a qualified accountant or your tax authority for anything official.",
    faq: [
      {
        question: "How do I remove VAT from a price?",
        answer:
          "Divide the gross price by 1 plus the rate. For 20% VAT, divide by 1.2. Subtracting 20% from the gross gives too small a net figure.",
      },
      {
        question: "What is the difference between VAT, GST and sales tax?",
        answer:
          "VAT and GST are charged at each stage of the supply chain with credits for tax already paid; sales tax is charged once at the final sale. The arithmetic here is identical for all three.",
      },
      {
        question: "Can I calculate several tax rates at once?",
        answer:
          "Enter a combined rate if your jurisdiction stacks state and local rates. For compound taxes charged on top of each other, use the calculator twice.",
      },
    ],
  },

  "salary-calculator": {
    seoTitle: "Salary Calculator — Hourly to Annual Pay Converter",
    seoDescription:
      "Convert pay between hourly, daily, weekly, fortnightly, monthly and annual figures, allowing for your working hours and holiday.",
    intro:
      "Convert pay between hourly, daily, weekly, monthly and annual figures, based on the hours you actually work.",
    howToUse: [
      "Enter a pay figure and say which period it covers.",
      "Set your usual hours per week and working days per week.",
      "Optionally set unpaid weeks off, which raises the effective hourly rate.",
      "Read every other period at once in the results table.",
    ],
    howItWorks: [
      "Everything is normalised to an annual figure first, then divided back out. That avoids the classic error of treating a month as four weeks: a year has 52.18 weeks, so a month is closer to 4.35 weeks. Multiplying a weekly wage by four understates monthly pay by about 8%.",
      "Unpaid weeks off change the hourly figure but not the annual one. If you earn a fixed salary but take two unpaid weeks, you work fewer hours for the same money, so your effective hourly rate rises.",
      "These are gross figures. Income tax, national insurance, pension contributions and other deductions vary far too much between jurisdictions and personal circumstances to model responsibly here.",
    ],
    formula: {
      expression: "annual = hourly × hours per week × (52 − unpaid weeks)      monthly = annual ÷ 12",
      where: [
        "hourly — pay per hour worked",
        "hours per week — your contracted or typical weekly hours",
        "unpaid weeks — weeks off without pay",
      ],
      note: "A month is annual ÷ 12, not weekly × 4. The difference is about 8%.",
    },
    example: {
      scenario: "25 an hour, 37.5 hours a week, no unpaid leave",
      steps: ["Weekly = 25 × 37.5 = 937.50", "Annual = 937.50 × 52 = 48,750", "Monthly = 48,750 ÷ 12 = 4,062.50"],
      result: "48,750 a year, 4,062.50 a month, 937.50 a week — all before deductions.",
    },
    disclaimer:
      "All figures are gross pay before tax and deductions. Income tax, social contributions and pension rules differ by country and by individual circumstance.",
    faq: [
      {
        question: "Why is monthly pay not weekly pay times four?",
        answer:
          "Because a year has 52.18 weeks, so an average month is 4.35 weeks. Multiplying by four understates monthly pay by roughly 8%.",
      },
      {
        question: "Are taxes included?",
        answer:
          "No. These are gross figures. Deductions depend on your country, tax code and personal allowances.",
      },
      {
        question: "How do unpaid weeks affect the result?",
        answer:
          "They raise your effective hourly rate on a fixed salary, because the same annual pay is spread over fewer worked hours.",
      },
    ],
  },

  "scientific-calculator": {
    seoTitle: "Scientific Calculator Online — Free, No Download",
    seoDescription:
      "A full scientific calculator with trigonometry, logarithms, powers, roots, constants and memory. Type expressions directly and see your history.",
    intro:
      "A full scientific calculator. Type an expression or use the keypad — trigonometry, logarithms, powers, roots, factorials and memory are all supported.",
    howToUse: [
      "Type an expression such as 2 * (3 + 4)^2 and press Enter, or use the keypad.",
      "Switch between degrees and radians for trigonometric functions.",
      "Use the memory keys to store and recall a running value.",
      "Click any line in the history to bring it back into the input.",
    ],
    howItWorks: [
      "The expression is parsed properly rather than evaluated as code. It is tokenised into numbers, operators and function names, converted to postfix notation with the shunting-yard algorithm — which handles operator precedence and right-associative powers correctly — and then evaluated from that stack.",
      "That matters for safety as much as correctness. Passing user input to eval() would let arbitrary JavaScript run in the page; a dedicated parser can only ever produce a number or a clear error message.",
      "Invalid input is reported precisely: unbalanced parentheses, an unknown function name, a missing operand, or a mathematically undefined result such as the logarithm of a negative number each get their own message rather than a generic failure.",
    ],
    example: {
      scenario: "Evaluating a compound expression",
      steps: [
        "Type sin(30) with the mode set to degrees → 0.5",
        "Type 2^10 → 1024",
        "Type log(1000) + sqrt(144) → 3 + 12",
      ],
      result: "15. Each result is added to the history, and can be clicked to reuse.",
    },
    faq: [
      {
        question: "Does it work in degrees or radians?",
        answer:
          "Both. A toggle above the keypad switches modes, and the current mode is shown next to the input so trigonometric results are never ambiguous.",
      },
      {
        question: "Which functions are supported?",
        answer:
          "sin, cos, tan and their inverses, sinh, cosh, tanh, log (base 10), ln, log2, sqrt, cbrt, abs, exp, floor, ceil, round, factorial via !, plus the constants π and e.",
      },
      {
        question: "How is precedence handled?",
        answer:
          "Standard mathematical precedence: parentheses, then powers (right-associative), then multiplication and division, then addition and subtraction. So 2 + 3 × 4 is 14 and 2^3^2 is 512.",
      },
      {
        question: "Can I use my keyboard?",
        answer:
          "Yes. Type expressions directly, Enter evaluates, Escape clears, and Backspace deletes. Function names can be typed out in full.",
      },
    ],
  },
};
