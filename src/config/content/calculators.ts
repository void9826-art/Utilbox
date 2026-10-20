import type { ToolContent } from "@/types/tool";

const FINANCE_DISCLAIMER =
  "This calculator is a general illustration, not financial advice. Lenders apply their own fees, rounding rules and day-count conventions, so a real quote will differ. Always check the figures with the provider before committing.";

export const calculatorContent: Record<string, ToolContent> = {
  "paint-coverage-calculator": {
    seoTitle: "Paint Calculator — How Much Paint Do I Need?",
    seoDescription:
      "How much paint do I need? Work out litres or gallons for a room from its size, doors, windows and coats, get the tins to buy, and count wallpaper rolls too.",
    intro:
      "Enter a room's length, width and wall height, plus doors, windows, coats and the coverage on the tin, to see how much paint to buy and the best mix of tins — or switch to wallpaper for the number of rolls. A 4 × 3 m room with 2.5 m walls and two coats needs about 5.8 litres.",
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
      "Choose dog or cat and enter your pet's age to see it in human years. Dogs are adjusted for size, because large breeds age faster: a 6-year-old Labrador is about 45 by the size chart, or about 60 by a 2020 DNA-based formula. The old rule that one dog year equals seven human years is wrong.",
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
      "Choose the UK, Canada, Australia or India, enter your gross salary and the details that apply — pension, student loan, province or tax regime — to see take-home pay per year, month and week with every deduction itemised. A £40,000 salary in England in 2026/27, with no pension or student loan, takes home £32,319.60. It is an estimate.",
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
      "Enter your battery size, start and end charge and electricity price to see what one charge costs, or your car's consumption and distance for the cost per mile or kilometre and per month, compared with petrol. Charging a 60 kWh battery from 20% to 80% at $0.15 per kWh costs about $6, allowing for charging losses.",
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
      "List each subscription with its price and billing cycle to see the true monthly and yearly total, upcoming renewals and what cancelling would save; a $6.99 weekly plan really costs $30.29 a month. The list is kept only in this browser's local storage, never on a server, so export a CSV or print it to keep a copy.",
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
      "Pick one of four questions — what is X% of Y, X is what percent of Y, the percentage change between two numbers, or adding and removing a percentage — and type your numbers. The answer updates as you type and shows the working. For example, 15% of 240 is 0.15 × 240 = 36.",
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
      "Enter a date of birth to get an exact age in years, months and days, plus total weeks and days lived and a countdown to the next birthday. Change the second date to find an age on any past or future date. Month lengths and leap years are handled using the real calendar, not an average.",
    howToUse: [
      "Enter the date of birth.",
      'Leave the second date as today, or set it to work out an age on a particular date.',
      "Read the exact age, followed by the totals and the next birthday countdown.",
    ],
    howItWorks: [
      "Age is counted the way people actually count it: whole years first, then whole months, then the days left over. The tool finds the most recent birthday, counts the whole months since it, and the days remaining after the last whole month.",
      "Months are counted on the real calendar, so their different lengths are respected. When a month is too short for the birth day, the month is complete on its last day: a person born on 31 January is 1 month old on 28 February in a common year, because February has no 31st, and 1 month and 1 day old on 1 March.",
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
      "Your GPA is a credit-weighted average: GPA = Σ (grade points × credits) ÷ Σ credits. Choose a 4.0, 4.3 or 5.0 scale, add each course with its credits and grade, and the GPA updates as you go. Mark pass/fail courses as excluded and they are left out of both totals.",
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
      "Your CGPA is the credit-weighted average of your semester GPAs: CGPA = Σ (semester GPA × credits) ÷ Σ credits. Add each semester's GPA and credits to see your cumulative figure, an approximate percentage (CGPA × 9.5; check your institution's table) and the GPA your next semester needs to reach a target.",
    howToUse: [
      "Add a row for each semester you have completed.",
      "Enter that semester's GPA and the number of credits it carried.",
      "The cumulative CGPA updates as you add rows.",
      "Use the projection box to see what a future semester would do to your CGPA.",
    ],
    howItWorks: [
      "A CGPA is a weighted average of semester GPAs, using each semester's credit load as its weight. Semesters where you took more credits therefore pull the cumulative figure harder — which is why a light semester with a perfect GPA moves the total less than students often expect.",
      "The projection tool answers the practical question directly: given where you are now, what GPA does the next semester need for you to reach a target? It rearranges the same weighted-average formula to solve for the unknown term, and tells you plainly when the target is not reachable in one semester.",
      "The percentage conversion, shown when the scale is 10, uses the widely published CGPA × 9.5 formula. It is an approximation adopted by several boards, not a universal standard — your institution's own conversion table always takes precedence.",
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
    seoTitle: "Grade Calculator — Test Score to Percentage & Grade",
    seoDescription:
      "Turn a test score like 61/80 into a percentage and a letter grade, combine weighted assessments, and find out what you need on the final exam.",
    intro:
      "To turn a score into a percentage, divide the marks by the marks available: 61/80 is 76.25%. Add each assessment with its weight to get an overall percentage and letter grade, and use the final exam planner to see the score you need for a target. Weights do not have to add up to 100.",
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
        question: "How do I turn a score like 61/80 into a percentage?",
        answer:
          "Divide the marks you scored by the marks available and multiply by 100. 61 ÷ 80 = 0.7625, so 61/80 is 76.25% — a C on both the standard 90/80/70/60 scale and the plus/minus scale. Enter any score as a single assessment and the tool does the same for you.",
      },
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
      "Your attendance is classes attended ÷ classes held. Enter both and the minimum you need to see how many classes you can still miss, or how many you must attend in a row to reach it: at 38 of 52 with a 75% requirement, attend the next 4. It also warns when the target can no longer be reached.",
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
      "Your EMI is the fixed monthly payment that repays a loan with interest: EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1), where r is the monthly rate and n the number of months. Enter the amount, annual rate and tenure to see the instalment, the total interest and every payment in the schedule.",
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
      "To calculate loan repayments, enter the amount, annual interest rate and term, and choose monthly, fortnightly or weekly payments. You get the payment, the total interest and a full amortisation table. Paying more often reduces total interest, because the balance falls sooner. Fees such as arrangement or early-repayment charges are not included.",
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
      "Your monthly mortgage cost is principal and interest plus property tax, insurance and any association fee, often called PITI. Enter the price, deposit, rate and term, then add tax and insurance to see the full payment. A 350,000 home with 20% down at 6.5% over 30 years is about 1,770 a month before tax and insurance.",
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
      "Compound interest means interest earns interest. Enter a starting balance, annual rate, time and compounding frequency, plus any regular deposits, to see the final balance and a year-by-year table. For example, 5,000 at 7% for 10 years compounded monthly, plus 200 a month, grows to about 44,665. It is a projection, not a forecast.",
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
      "BMI is your weight in kilograms divided by your height in metres squared. Enter your height and weight in metric or imperial units to see your BMI, its WHO category — 18.5 to 24.9 is the healthy range for adults — and the healthy weight range for your height. It is a screening measure, not a diagnosis.",
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
      "Enter a price and the percentage off to see what you pay and what you save. Stacked discounts multiply rather than add: 20% off then 10% off is a 28% saving, not 30%. Reverse mode finds the original price, so 45 after 25% off was 60. Add a tax rate to see the price at the till.",
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
      "To add tax, multiply the net amount by 1 plus the rate; to remove it, divide the gross by 1 plus the rate — so 240 including 20% VAT is 200 net plus 40 tax, not 240 minus 48. Enter an amount and a rate to get the net, tax and gross figures for VAT, GST or sales tax.",
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
      "Enter a pay figure and its period, plus your weekly hours and working days, to see the hourly, daily, weekly, monthly and annual equivalents at once. A month is the annual figure ÷ 12, not weekly pay × 4, which understates it by about 8%. All figures are gross, before tax and deductions.",
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
      "Type an expression such as 2 * (3 + 4)^2, or use the keypad, and press Enter. The calculator handles trigonometry in degrees or radians, logarithms, powers, roots, factorials, π and e, and memory, with correct operator precedence. Every result goes into a history you can click to reuse, and errors are explained precisely.",
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

  "tip-calculator": {
    seoTitle: "Tip Calculator — Split the Bill Between Friends",
    seoDescription:
      "Work out the tip and split the bill between any number of people, with each share rounded up if you like. Shows the working. Free and private.",
    intro:
      "Enter the bill, the tip percentage and the number of people to see the tip, the total and what each person pays. Tap a preset such as 15% or 20%, or round each share up to a whole amount for cash. A 15% tip on an 80.00 bill is 12.00, so four people pay 23.00 each.",
    howToUse: [
      "Enter the bill amount.",
      "Pick a tip percentage, or type your own.",
      "Enter how many people are sharing.",
      "Tick Round each share up for cash, then read what each person pays.",
    ],
    howItWorks: [
      "The tip is the bill multiplied by the tip percentage, and the total is the bill plus the tip. Dividing the total by the number of people gives each share. Amounts are rounded to the cent, and when the total does not divide evenly the working says who pays the odd cent.",
      "Rounding each share up to a whole amount is handy for cash. The tool shows how much extra that collects, so the group can leave it as additional tip or let one person pay less.",
      "Customs differ on whether to tip on the total or on the price before tax. The tip is worked out on whatever amount you enter, so enter the figure you want to tip on.",
    ],
    formula: {
      expression: "tip = bill × rate      total = bill + tip      each = total ÷ people",
      where: [
        "bill — the amount you are tipping on",
        "rate — the tip percentage as a decimal, e.g. 0.15 for 15%",
        "people — how many are sharing the bill",
      ],
    },
    example: {
      scenario: "An 80.00 bill, a 15% tip, shared by four people",
      steps: ["Tip = 80.00 × 0.15 = 12.00", "Total = 80.00 + 12.00 = 92.00", "Each = 92.00 ÷ 4 = 23.00"],
      result: "23.00 each, of which 3.00 is tip.",
    },
    faq: [
      {
        question: "How much should I tip?",
        answer:
          "It depends on where you are. In the United States 15–20% is usual at table-service restaurants, while in many other countries service is included or a small round-up is enough. Follow the local custom.",
      },
      {
        question: "Should the tip be on the total or before tax?",
        answer:
          "Both are common. Tipping on the amount before tax is slightly cheaper; enter whichever figure you want to tip on.",
      },
      {
        question: "What happens when the bill does not split evenly?",
        answer:
          "Each share is rounded to the cent and the working shows the odd cent, so you know one person pays a cent more or less. Rounding up to whole amounts avoids it.",
      },
      {
        question: "Can I split the bill unevenly?",
        answer:
          "Not here; every share is equal. For different amounts, add up each person's items first and apply the tip percentage to each.",
      },
    ],
  },

  "date-calculator": {
    seoTitle: "Date Calculator — Days and Working Days Between",
    seoDescription:
      "Count calendar days and working days between two dates, skipping weekends and holidays, or add days, weeks, months or business days to a date.",
    intro:
      "Choose two dates to count the calendar days and working days between them, or pick a date and add or subtract days, weeks, months, years or working days. Weekends are skipped for working days, and you can list public holidays to skip too. 1 to 31 October 2026 is 30 days, of which 21 are working days.",
    howToUse: [
      "Choose Days between dates or Add or subtract.",
      "Pick the start date, and the end date or the amount and unit to add.",
      "Optionally list public holidays, one YYYY-MM-DD date per line.",
      "Read the result; tick Count the start date as well if your rule counts both ends.",
    ],
    howItWorks: [
      "Days between two dates are counted from the day after the start up to and including the end date, so 1 to 2 March is 1 day — the same as subtracting the dates in a spreadsheet. Tick the option to count the start date as well, which is how Excel's NETWORKDAYS counts working days.",
      "Working days are Monday to Friday, minus any holidays you list. Holidays that fall on a weekend are not subtracted twice. Weekend and holiday rules differ between countries and employers, so list the holidays that apply to you.",
      "Adding working days follows Excel's WORKDAY: the start date is not counted, so 1 working day after a Friday is the following Monday. Subtracting works backwards the same way.",
      "Adding months keeps the day of the month where it can. When that day does not exist, the result is the last day of the month: 31 January plus one month is 28 February, or 29 in a leap year. Years work the same way, so 29 February plus a year is 28 February.",
      "Dates are handled as whole days in UTC, so a daylight-saving change can never shift a result by a day. Everything is calculated in your browser.",
    ],
    formula: {
      expression: "days = end date − start date      working days = days that are Mon–Fri and not holidays",
      where: [
        "start date — not counted unless you tick “Count the start date as well”",
        "end date — always counted",
      ],
    },
    example: {
      scenario: "1 October to 31 October 2026",
      steps: [
        "Calendar days: 31 − 1 = 30",
        "Days counted: 2 to 31 October",
        "Of those 30 days, 9 fall on a Saturday or Sunday, leaving 21 working days",
      ],
      result: "30 days, 21 working days — or 31 and 22 if the start date is counted too.",
    },
    faq: [
      {
        question: "Does it include the start and end dates?",
        answer:
          "By default it counts from the day after the start date up to and including the end date, like subtracting two dates. Tick “Count the start date as well” to include both ends.",
      },
      {
        question: "How do I count business days excluding holidays?",
        answer:
          "Open Public holidays to skip and list each holiday as YYYY-MM-DD, one per line. They are left out of working-day counts and skipped when adding working days.",
      },
      {
        question: "What is 30 days from today?",
        answer:
          "Choose Add or subtract, keep today's date as the start, enter 30 and choose Days. Choose Working days instead for 30 business days.",
      },
      {
        question: "Why does adding a month to 31 January give 28 February?",
        answer:
          "February has no 31st, so the result is the last day of February — the same rule spreadsheets and most date libraries use.",
      },
    ],
  },

  "time-card-calculator": {
    seoTitle: "Time Card Calculator — Weekly Hours and Overtime",
    seoDescription:
      "Add up a week of start and finish times, minus breaks, in hours and minutes and decimal hours. Works out overtime and gross pay. Free, private timesheet maths.",
    intro:
      "Enter a start time, finish time and unpaid break for each day to get the week's total in hours and minutes and in decimal hours for payroll. Add an hourly rate to see regular pay, overtime above 40 hours (or your own threshold) and the total. Night shifts that finish after midnight are handled. Nothing is uploaded.",
    howToUse: [
      "Enter the start and finish time for each day you worked, and the unpaid break in minutes.",
      "Leave days you did not work blank.",
      "Enter your hourly rate, the weekly hours after which overtime starts, and the overtime rate.",
      "Read the total hours, the decimal hours and the gross pay.",
    ],
    howItWorks: [
      "Each day's hours are the finish time minus the start time, minus the break. A finish earlier than the start is treated as the next day, so 22:00 to 06:00 is 8 hours.",
      "Times are added in whole minutes and only then shown as hours and minutes (7:45) and as decimal hours (7.75). Decimal hours are what most payroll systems want: 45 minutes is 0.75 of an hour, not 0.45.",
      "Overtime here is weekly: hours above the threshold — 40 by default, as under the US federal rule for many employees — are paid at the overtime rate, such as 1.5 for time and a half. Some places and contracts use daily overtime, double time or different thresholds, so set the numbers your employer uses.",
      "Pay is gross, before tax and other deductions. Rounding rules for clocking in and out (such as to the nearest quarter hour) vary by employer and are not applied.",
    ],
    formula: {
      expression: "hours = finish − start − break      pay = regular hours × rate + overtime hours × rate × multiplier",
      where: [
        "regular hours — up to the weekly overtime threshold",
        "overtime hours — anything above the threshold",
        "multiplier — 1.5 for time and a half, 2 for double time",
      ],
    },
    example: {
      scenario: "45 hours in a week at 20.00 an hour, time and a half after 40 hours",
      steps: [
        "Regular: 40 h × 20.00 = 800.00",
        "Overtime: 5 h × 20.00 × 1.5 = 150.00",
        "Total: 800.00 + 150.00",
      ],
      result: "950.00 gross for the week.",
    },
    faq: [
      {
        question: "How do I convert minutes to decimal hours?",
        answer:
          "Divide the minutes by 60: 15 minutes is 0.25, 30 is 0.5 and 45 is 0.75. So 7 hours 45 minutes is 7.75 hours.",
      },
      {
        question: "Does it handle overnight shifts?",
        answer:
          "Yes. If the finish time is earlier than the start, the shift is taken to end the next day.",
      },
      {
        question: "Should breaks be included?",
        answer:
          "Enter unpaid breaks in the break column and they are subtracted. Paid breaks count as working time, so leave them out.",
      },
      {
        question: "When does overtime start?",
        answer:
          "That depends on your country, state and contract. 40 hours a week is common in the US; set 0 if you have no overtime, or your own threshold.",
      },
    ],
  },

  "fuel-cost-calculator": {
    seoTitle: "Fuel Cost Calculator — Trip Cost From mpg or L/100 km",
    seoDescription:
      "Work out the fuel cost of a journey from the distance, your car's mpg (US or UK), L/100 km or km/L and the fuel price. Return trips and cost sharing included.",
    intro:
      "Enter the distance, fuel economy and fuel price to see the fuel a trip needs and its cost in total, per person and per mile or km. Economy can be L/100 km, km/L, or US or UK mpg. Driving 300 km each way at 6 L/100 km, with fuel at 1.80 a litre, uses 36 litres and costs 64.80.",
    howToUse: [
      "Enter the one-way distance in kilometres or miles, and tick Return journey if you are coming back.",
      "Enter your car's fuel economy and choose its unit.",
      "Enter the fuel price per litre or per gallon.",
      "Optionally enter how many people are sharing the cost.",
    ],
    howItWorks: [
      "Everything is converted to kilometres and litres first. Fuel needed = distance in km × litres per 100 km ÷ 100, and cost = litres × price per litre.",
      "Miles per gallon is converted with exact definitions: a mile is 1.609344 km, a US gallon 3.785411784 litres and a UK (imperial) gallon 4.54609 litres. That is why 30 mpg in the US (7.84 L/100 km) uses more fuel than 30 mpg in the UK (9.42 L/100 km) — a UK gallon is about 20% bigger.",
      "Official economy figures are measured in test conditions; motorway speed, traffic, load, cold weather and air conditioning usually raise real consumption. Use your car's trip computer or a recent fill-up for a more realistic figure.",
      "The cost covers fuel only, not tolls, parking, wear or depreciation. Everything is calculated in your browser.",
    ],
    formula: {
      expression: "fuel (L) = distance (km) × economy (L/100 km) ÷ 100      cost = fuel × price per litre",
      where: [
        "mpg (US) → L/100 km: 235.215 ÷ mpg",
        "mpg (UK) → L/100 km: 282.481 ÷ mpg",
        "km/L → L/100 km: 100 ÷ km/L",
      ],
    },
    example: {
      scenario: "A 300 km drive each way, 6 L/100 km, fuel at 1.80 a litre, three people sharing",
      steps: [
        "Distance: 300 × 2 = 600 km",
        "Fuel: 600 × 6 ÷ 100 = 36 litres",
        "Cost: 36 × 1.80 = 64.80, or 21.60 each",
      ],
      result: "64.80 for the trip, 21.60 per person.",
    },
    faq: [
      {
        question: "How do I calculate fuel cost per mile?",
        answer:
          "Divide the price per gallon by the miles per gallon. At 3.50 a US gallon and 25 mpg, each mile costs 0.14.",
      },
      {
        question: "Is UK mpg the same as US mpg?",
        answer:
          "No. The UK gallon is about 20% larger, so the same car shows a higher mpg figure in the UK. Choose the right one, or use L/100 km.",
      },
      {
        question: "How do I find my car's real fuel economy?",
        answer:
          "Fill the tank, reset the trip meter, and at the next fill-up divide the distance driven by the fuel added. Many cars also show an average on the trip computer.",
      },
      {
        question: "Does it include tolls or parking?",
        answer:
          "No. It covers fuel only; add other trip costs separately.",
      },
    ],
  },

  "unit-price-calculator": {
    seoTitle: "Unit Price Calculator — Which Pack Is Cheaper?",
    seoDescription:
      "Compare pack sizes by price per 100 g, per kg, per litre, per ounce or per item to see which is cheapest and by how much. Handles multipacks.",
    intro:
      "Enter the price and size of two or more packs to see each one's price per 100 g, per kg, per litre or per item, with the cheapest marked and how much more the others cost. Multipacks, grams, kilograms, ounces, pounds, millilitres and litres can be mixed. A 1.5 kg bag at 4.50 is 0.30 per 100 g.",
    howToUse: [
      "Enter each option's price and the size of one pack, and choose its unit.",
      "For multipacks, enter the number of packs included in the price.",
      "Add more options if you are comparing several sizes.",
      "Choose the unit to compare by, such as per 100 g or per litre, and read which is cheapest.",
    ],
    howItWorks: [
      "Each option is converted to a base unit — grams, millilitres or items — using exact definitions such as 1 lb = 453.59237 g and 1 US fl oz = 29.5735 ml. The unit price is the price divided by the total amount: size of one pack × number of packs.",
      "The cheapest option is the one with the lowest price per base unit. The others show how much more they cost per unit as a percentage, so 0.36 against 0.30 per 100 g is 20% more.",
      "Weight and volume cannot be compared without knowing the product's density, so options measured differently from the first option are left out of the comparison rather than guessed.",
      "Small unit prices are shown with up to four decimal places, because two decimals can make different prices look the same. Everything is calculated in your browser.",
    ],
    formula: {
      expression: "unit price = price ÷ (pack size × packs) × comparison amount",
      where: [
        "pack size — converted to grams, millilitres or items",
        "comparison amount — 100 for per 100 g, 1000 for per kg or per litre",
      ],
    },
    example: {
      scenario: "1.5 kg for 4.50, 500 g for 1.80, or four 250 g packs for 5.00",
      steps: [
        "4.50 ÷ 1500 g × 100 = 0.30 per 100 g",
        "1.80 ÷ 500 g × 100 = 0.36 per 100 g",
        "5.00 ÷ (4 × 250 g) × 100 = 0.50 per 100 g",
      ],
      result: "The 1.5 kg bag is cheapest; the 500 g bag costs 20% more per gram and the multipack 67% more.",
    },
    faq: [
      {
        question: "Is the bigger pack always cheaper?",
        answer:
          "No. Offers and multibuys on smaller packs often beat the large size, which is why comparing unit prices is worth it.",
      },
      {
        question: "Why can't I compare grams with millilitres?",
        answer:
          "A millilitre of oil weighs less than a gram, and a millilitre of honey more. Without the density, weight and volume cannot be compared fairly.",
      },
      {
        question: "How do I compare a multipack?",
        answer:
          "Enter the size of one pack, and the number of packs you get for the price. The unit price uses the total amount.",
      },
      {
        question: "Does the shelf label already show unit prices?",
        answer:
          "Many shops show one, but sometimes per 100 g on one product and per kg on another, or per item. Converting everything to the same basis makes the comparison fair.",
      },
    ],
  },

  "sip-calculator": {
    seoTitle: "SIP Calculator — Monthly Investment Returns",
    seoDescription:
      "Estimate what a monthly SIP grows to at an expected return, with an optional yearly step-up. Shows invested amount, gains and a year-by-year table.",
    intro:
      "Enter a monthly investment, an expected annual return and a period to see what a SIP could grow to, how much you put in and the estimated gains, with a year-by-year table. Add a yearly step-up if you plan to raise the amount. ₹5,000 a month for 10 years at 12% comes to about ₹11.6 lakh.",
    howToUse: [
      "Enter the amount you will invest each month.",
      "Enter the annual return you expect and the number of years.",
      "Optionally enter a yearly step-up, such as 10% if you will raise the SIP each year.",
      "Read the estimated value, the amount invested, the gains and the year-by-year table.",
    ],
    howItWorks: [
      "The calculator uses the convention most fund houses' SIP calculators use: the monthly rate is the annual rate ÷ 12, and each instalment is invested at the start of its month and grows until the end of the period. For a level SIP that gives the closed formula FV = P × ((1 + i)ⁿ − 1) ÷ i × (1 + i).",
      "With a step-up, the monthly amount rises by the chosen percentage at the start of each new year, so a 10% step-up turns 5,000 a month into 5,500 in year two and 6,050 in year three.",
      "Gains are the estimated value minus everything invested. They are before any tax, exit load or fund expenses not already reflected in the return you entered.",
      "Real market returns vary from year to year and can be negative. A steady assumed rate shows the effect of time and compounding; it is not a prediction of what a fund will return.",
    ],
    formula: {
      expression: "FV = P × ((1 + i)ⁿ − 1) ÷ i × (1 + i)",
      where: [
        "P — monthly investment",
        "i — monthly rate: annual return ÷ 12 ÷ 100",
        "n — number of monthly instalments",
      ],
    },
    example: {
      scenario: "₹5,000 a month for 10 years at an expected 12% a year",
      steps: [
        "i = 12 ÷ 12 ÷ 100 = 0.01, n = 120",
        "FV = 5,000 × (1.01¹²⁰ − 1) ÷ 0.01 × 1.01 ≈ 11,61,695",
        "Invested = 5,000 × 120 = 6,00,000",
      ],
      result: "About ₹11.62 lakh, of which about ₹5.62 lakh is estimated gains.",
    },
    faq: [
      {
        question: "Is the SIP return guaranteed?",
        answer:
          "No. Mutual fund returns depend on the market and are not guaranteed. The calculator assumes a steady rate to show how compounding works over time.",
      },
      {
        question: "What return should I assume?",
        answer:
          "Use a cautious figure based on the fund type and your horizon, and try a lower rate too. Past returns do not guarantee future ones.",
      },
      {
        question: "What is a step-up SIP?",
        answer:
          "A SIP whose monthly amount rises by a set percentage each year, usually in line with salary increases. Even a small yearly step-up makes a large difference over long periods.",
      },
      {
        question: "Why is my fund's actual value different?",
        answer:
          "Real returns vary month to month, units are bought at different prices, and expenses, exit loads and taxes affect what you receive. This is a projection, not a statement.",
      },
    ],
    disclaimer: "This projection is arithmetic on an assumed steady return, not investment advice or a forecast. Mutual fund investments are subject to market risk, returns are not guaranteed, and tax and charges are not included.",
  },

  "bmr-calculator": {
    seoTitle: "BMR and Calorie Calculator — Mifflin-St Jeor",
    seoDescription:
      "Estimate your basal metabolic rate and maintenance calories (TDEE) from age, sex, height, weight and activity, using the Mifflin-St Jeor equation.",
    intro:
      "Enter your age, sex, height, weight and activity level to estimate your basal metabolic rate — the calories your body uses at rest — and the daily calories that would keep your weight steady. It uses the Mifflin-St Jeor equation, the estimate most dietitians use. A 35-year-old woman, 168 cm and 68 kg, has a BMR of about 1,394 kcal.",
    howToUse: [
      "Choose metric or imperial units and enter your age, height and weight.",
      "Choose the sex the equation should use.",
      "Pick the activity level closest to a typical week.",
      "Read your BMR and the maintenance calories, and compare activity levels in the table.",
    ],
    howItWorks: [
      "BMR is estimated with the Mifflin-St Jeor equation, published in the American Journal of Clinical Nutrition in 1990: 10 × weight in kg + 6.25 × height in cm − 5 × age in years, then + 5 for men or − 161 for women.",
      "Maintenance calories, often called total daily energy expenditure (TDEE), multiply BMR by an activity factor from 1.2 for sedentary to 1.9 for very physical work and training. These factors are the standard ones used alongside the equation, but they are broad bands: choose the one that matches an ordinary week, not your most active one.",
      "Both figures are population averages. Body composition, genetics, health conditions and medication can move an individual's real needs well above or below the estimate. Weight trends over a few weeks are a better guide than any formula.",
      "The equation was developed for adults, so ages under 15 are not calculated. Everything is calculated in your browser.",
    ],
    formula: {
      expression: "BMR = 10 × weight + 6.25 × height − 5 × age + s      maintenance = BMR × activity factor",
      where: [
        "weight — kilograms; height — centimetres; age — years",
        "s — +5 for men, −161 for women",
        "activity factor — 1.2, 1.375, 1.55, 1.725 or 1.9",
      ],
    },
    example: {
      scenario: "A 35-year-old woman, 168 cm, 68 kg, lightly active",
      steps: [
        "BMR = 10 × 68 + 6.25 × 168 − 5 × 35 − 161",
        "= 680 + 1,050 − 175 − 161 = 1,394 kcal",
        "Maintenance = 1,394 × 1.375 ≈ 1,917 kcal",
      ],
      result: "About 1,394 kcal at rest and about 1,917 kcal a day to maintain weight.",
    },
    faq: [
      {
        question: "What is the difference between BMR and TDEE?",
        answer:
          "BMR is the energy your body uses at complete rest just to keep running. TDEE, or maintenance calories, adds everything you do in a day, from walking to exercise.",
      },
      {
        question: "Is Mifflin-St Jeor accurate?",
        answer:
          "It is the most widely recommended equation for adults, but it is an estimate. Individual results commonly differ from it, which is why progress over a few weeks is the real test.",
      },
      {
        question: "How many calories should I eat to lose weight?",
        answer:
          "That depends on your health and goals; a doctor or registered dietitian can advise. Eating below your maintenance estimate leads to weight loss over time, but very low intakes are not safe without supervision.",
      },
      {
        question: "Why does the equation ask for sex?",
        answer:
          "On average, men and women of the same height and weight have different body composition, so the equation uses a different constant. Choose the one that best fits your body, or ask a clinician if neither does.",
      },
    ],
    disclaimer: "These are estimates for general information, not medical or nutritional advice. If you are pregnant, have a health condition, take medication that affects weight, or are planning a significant diet change, speak to a doctor or registered dietitian.",
  },

  "loan-comparison-calculator": {
    seoTitle: "Loan Comparison Calculator — Rate, Fees, Term",
    seoDescription:
      "Compare up to three loan offers side by side: monthly payment, total interest, fees and a rate that includes fees. See which loan costs least overall.",
    intro:
      "Enter up to three loan offers with their amount, interest rate, term and up-front fees to compare the monthly payment, total interest and total cost side by side. A rate that includes fees shows when a lower headline rate is really dearer: 10,000 at 5% with a 500 fee costs more than 6% with no fee over three years.",
    howToUse: [
      "Enter each offer's amount, annual interest rate, term in years and any up-front fees.",
      "Compare the monthly payment, total interest and interest plus fees.",
      "Check the rate including fees to compare offers with different fees fairly.",
      "Read the summary for the offer that costs least overall.",
    ],
    howItWorks: [
      "Each loan is a standard level-payment loan: payment = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1), with r the annual rate ÷ 12 and n the number of months. Total interest is the payments minus the amount borrowed, and the total cost adds the up-front fees.",
      "The rate including fees is found by working out which annual rate would make the same payments repay only the money you actually receive after fees. It is calculated by bisection and quoted as a nominal annual rate (monthly rate × 12), the convention used for US APR disclosures; UK-style APRs compound it and come out slightly higher. Lenders' official APRs can include other charges as well.",
      "The lowest monthly payment is not always the cheapest loan: a longer term lowers the payment but usually raises the total interest. Comparing total cost answers “which costs least”, while the payment answers “which can I afford each month”.",
      "Insurance, early-repayment charges and variable rates are not modelled. Check each offer's full terms.",
    ],
    formula: {
      expression: "payment = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)      total cost = payment × n − P + fees",
      where: [
        "P — amount borrowed",
        "r — monthly rate: annual rate ÷ 12 ÷ 100",
        "n — number of monthly payments",
      ],
    },
    example: {
      scenario: "10,000 over 3 years: 6% with no fee, or 5% with a 500 fee",
      steps: [
        "6%, no fee: payment 304.22, interest 951.90, total cost 951.90",
        "5%, 500 fee: payment 299.71, interest 789.52, total cost 1,289.52",
        "Rate including the fee: about 8.46%",
      ],
      result: "The 5% loan has the lower payment but costs about 338 more overall.",
    },
    faq: [
      {
        question: "Is a lower interest rate always cheaper?",
        answer:
          "No. Fees can outweigh a lower rate, especially on smaller or shorter loans. Compare the total cost or the rate including fees.",
      },
      {
        question: "Should I choose the lowest monthly payment?",
        answer:
          "Only if affordability each month matters most. A longer term lowers the payment but usually adds a lot of interest; check the total cost too.",
      },
      {
        question: "What if the fee is added to the loan?",
        answer:
          "Enter the larger amount you will actually borrow as the loan amount and set the fee to 0, so the interest on the fee is included.",
      },
      {
        question: "Why is the rate including fees different from the lender's APR?",
        answer:
          "An official APR may include other compulsory charges and, in some countries, is compounded. Use this figure to compare offers on the same basis, and the lender's APR for the full picture.",
      },
    ],
    disclaimer: "This comparison is a general illustration, not financial advice. Lenders apply their own fees, rounding and day-count rules, so real figures will differ; check each offer's terms before committing.",
  },

  "savings-goal-calculator": {
    seoTitle: "Savings Goal Calculator — How Much to Save Monthly",
    seoDescription:
      "Work out how much to save each month to reach a savings goal by a date, or how long it will take at a given monthly saving, with interest included.",
    intro:
      "Enter a savings goal, what you have already saved and an interest rate to see how much to save each month to reach it in time — or switch modes to see how long it will take at a set monthly amount. To turn 1,000 into 10,000 in two years at 5% interest, save about 353 a month.",
    howToUse: [
      "Choose “How much each month?” or “How long will it take?”.",
      "Enter the goal, what you already have and the interest rate (0 for cash).",
      "Enter the time you have, or the amount you can save each month.",
      "Read the result and the balance over time.",
    ],
    howItWorks: [
      "Interest is compounded monthly at the annual rate ÷ 12, and deposits are made at the end of each month. What you already have grows on its own; the monthly deposit covers the rest.",
      "The monthly amount needed is the shortfall × r ÷ ((1 + r)ⁿ − 1), where the shortfall is the goal minus what your current savings will have grown to, r is the monthly rate and n the number of months. With no interest it is simply the shortfall ÷ n.",
      "The time to reach a goal is found by adding a month at a time until the balance reaches the goal, so it is a whole number of months.",
      "Tax on interest, changing rates and missed months are not included, so leave yourself a margin.",
    ],
    formula: {
      expression: "monthly = (goal − current × (1 + r)ⁿ) × r ÷ ((1 + r)ⁿ − 1)",
      where: [
        "r — monthly rate: annual rate ÷ 12 ÷ 100",
        "n — number of months",
        "current — what you have already saved",
      ],
    },
    example: {
      scenario: "Reaching 10,000 in 2 years from 1,000, at 5% interest",
      steps: [
        "1,000 grows to about 1,104.94 in 24 months",
        "Shortfall: 10,000 − 1,104.94 = 8,895.06",
        "Monthly: 8,895.06 × 0.004167 ÷ (1.004167²⁴ − 1) ≈ 353.18",
      ],
      result: "Save about 353.18 a month; you pay in 9,476.32 and interest adds the rest.",
    },
    faq: [
      {
        question: "How much should I save each month for a goal?",
        answer:
          "Divide the shortfall by the number of months for a no-interest estimate, or use this calculator to include interest on what you save.",
      },
      {
        question: "What interest rate should I use?",
        answer:
          "The rate on the account you will actually use. For cash in a current account, use 0.",
      },
      {
        question: "Does it include tax on interest?",
        answer:
          "No. If your interest is taxed, use a slightly lower rate, or add a margin to the monthly amount.",
      },
      {
        question: "What if I miss a month?",
        answer:
          "Missed deposits push the date back. Re-run the calculation from your new balance to see the new monthly amount.",
      },
    ],
  },

  "time-duration-calculator": {
    seoTitle: "Time Duration Calculator — Hours Between Times",
    seoDescription:
      "Find the hours and minutes between two times, add or subtract a duration from a time, or add up a list of durations such as 1:45 and 2:30.",
    intro:
      "Find the time between two clock times — 09:15 to 17:40 is 8 hours 25 minutes — add or subtract hours and minutes from a time, or add up a list of durations such as 1:45, 2:30 and 50 minutes. Times past midnight are handled, and totals show in hours and minutes and decimal hours, in your browser.",
    howToUse: [
      "Choose Between times, Add / subtract, or Add up.",
      "Enter the times, or a duration such as 3h 45m, 2:30 or 90 (minutes).",
      "For a list, put one duration per line and say whether 1:30 means hours:minutes or minutes:seconds.",
      "Read the result in hours and minutes and in decimal hours.",
    ],
    howItWorks: [
      "Between two times, the start is subtracted from the end. If the end is earlier than the start, it is taken to be the next day, so 22:00 to 06:00 is 8 hours.",
      "Adding or subtracting works in minutes and wraps round midnight, saying when the result falls on the next or previous day: 22:30 plus 3 hours 45 minutes is 02:15 the next day.",
      "Durations can be typed as 1:30:15, 1:30, 1h 30m, 90m, 45s, 1.5h or a plain number of minutes. A two-part value like 1:30 is ambiguous — hours and minutes for timesheets, minutes and seconds for music and video — so you choose which.",
      "Totals are added in seconds and only rounded for display. Decimal hours divide by 60: 45 minutes is 0.75 hours, not 0.45.",
    ],
    example: {
      scenario: "Adding 1:45, 2:30, 0:50 and 1h 15m",
      steps: [
        "105 + 150 + 50 + 75 = 380 minutes",
        "380 minutes = 6 hours 20 minutes",
        "6 h 20 min = 6.33 hours",
      ],
      result: "6:20 in total, or 6.33 decimal hours.",
    },
    faq: [
      {
        question: "How do I calculate hours between two times?",
        answer:
          "Subtract the start from the end. If the end is past midnight, add 24 hours first. 09:15 to 17:40 is 8 hours 25 minutes.",
      },
      {
        question: "How do I add hours and minutes?",
        answer:
          "Add the minutes, carry every 60 minutes into an hour, then add the hours — or list the durations in Add up and let the calculator do it.",
      },
      {
        question: "How do I convert minutes to decimal hours?",
        answer:
          "Divide by 60. 25 minutes is 0.42 hours, so 8 hours 25 minutes is 8.42 hours.",
      },
      {
        question: "Can I add video or song lengths?",
        answer:
          "Yes. In Add up, set two-part values to minutes:seconds and enter lengths such as 3:45.",
      },
    ],
  },
};
