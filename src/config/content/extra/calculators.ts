import type { ToolContentExtra } from "@/types/tool";

export const calculatorExtra: Record<string, ToolContentExtra> = {
  "percentage-calculator": {
    tips: [
      "For a percentage change, always divide by the starting value. Going from 50 to 75 is a 50% rise; going back from 75 to 50 is a 33.3% fall.",
      "Percentages can be swapped: 8% of 50 is the same as 50% of 8, which is 4. Pick whichever is easier to work out in your head.",
      "Say “percentage points” when comparing two rates. A rate that moves from 4% to 6% has risen by 2 points, or by 50%.",
      "Check that the answer is sensible: a part should be smaller than the whole unless the percentage is over 100.",
    ],
    faq: [
      {
        question: "How do I find what percentage one number is of another?",
        answer: "Divide the part by the whole and multiply by 100. 18 out of 24 is 18 ÷ 24 × 100 = 75%.",
      },
      {
        question: "How do I undo a percentage increase?",
        answer:
          "Divide by one plus the rate rather than subtracting the percentage. A price of 120 after a 20% rise was 120 ÷ 1.2 = 100, not 96.",
      },
      {
        question: "How do I calculate a percentage decrease?",
        answer:
          "Subtract the new value from the old, divide by the old value and multiply by 100. From 80 to 60 is (80 − 60) ÷ 80 × 100 = 25%.",
      },
    ],
  },

  "age-calculator": {
    tips: [
      "Set the second date to find an age on a particular day — a school entry cut-off, an exam date or a pension date.",
      "Use the total in days or weeks for things that are counted that way, such as a baby's age in the first months.",
      "Check the next-birthday countdown when planning; it accounts for month lengths and leap years.",
      "For the length of time between any two events, not just birthdays, the same calculation works: enter the earlier date first.",
    ],
    faq: [
      {
        question: "How many days old am I?",
        answer:
          "Enter your date of birth and the total in days is shown under the main result. Someone born on 15 March 2001 was 9,305 days old on 5 September 2026.",
      },
      {
        question: "How do I work out an age “as of” a date on a form?",
        answer:
          "Set the second date to the date the form names, such as 1 January or the closing date, instead of leaving it as today.",
      },
      {
        question: "Are leap years taken into account?",
        answer:
          "Yes. The calculation uses the real calendar, so leap days and months of different lengths are counted exactly rather than averaged.",
      },
    ],
  },

  "gpa-calculator": {
    tips: [
      "Use the grading scale printed on your transcript or handbook; the same letter can be worth different points elsewhere.",
      "Enter credits exactly. A course with more credits moves the average more, so a mistyped credit value skews the result.",
      "Mark pass/fail courses as excluded so they do not affect the average.",
      "Try a what-if: change one grade at a time to see which course would lift your GPA most.",
    ],
    faq: [
      {
        question: "What counts as a good GPA?",
        answer:
          "It depends on the purpose. On a 4.0 scale a 3.0 (a B average) is often treated as a solid baseline and 3.5 or above as strong, but scholarships, honours and graduate programmes set their own thresholds.",
      },
      {
        question: "How many points are A− and B+ worth?",
        answer:
          "On the common 4.0 scale, A− is 3.7 and B+ is 3.3. Some institutions use slightly different values, so check your own table.",
      },
      {
        question: "Can I work out a weighted high-school GPA?",
        answer:
          "Yes. Choose the 5.0 scale, where honours, AP or IB courses can carry extra points, or enter the grade points your school publishes directly.",
      },
    ],
  },

  "cgpa-calculator": {
    tips: [
      "Enter each semester's credits as well as its GPA. A heavy semester counts for more than a light one.",
      "Use the projection to see what next semester needs before planning your course load.",
      "Treat the × 9.5 percentage conversion as an estimate and use your institution's own table for anything official.",
      "Remember that early semesters set the baseline; the more credits you complete, the less any single term can move the total.",
    ],
    faq: [
      {
        question: "Is CGPA just the average of my semester GPAs?",
        answer:
          "No. Each semester is weighted by its credits. Semesters of 3.48 over 13 credits and 3.80 over 17 give a CGPA of 3.66, not the simple average of 3.64.",
      },
      {
        question: "Does it work on a 10-point scale?",
        answer:
          "Yes. The calculation is the same on any scale, as long as every semester you enter uses the same one.",
      },
      {
        question: "Should I enter credits attempted or credits earned?",
        answer:
          "Credits attempted, which is what most institutions use for the average. If your institution counts differently, follow its rules.",
      },
    ],
  },

  "grade-calculator": {
    tips: [
      "Enter every assessment with the weight your syllabus gives it; weights that do not add up to 100 are scaled for you.",
      "Use the final exam planner early, while there is still time to change how you prepare.",
      "Treat the percentage as the reliable figure. Letter boundaries differ between institutions.",
      "Check whether your course uses weights or total points before trusting either figure; they give slightly different answers.",
    ],
    faq: [
      {
        question: "What percentage is a C?",
        answer:
          "On the common US scale, 70–79%. With plus and minus grades, C− starts at 70%, C at 73% and C+ at 77%. Your institution's table may differ.",
      },
      {
        question: "Can I include assessments I have not taken yet?",
        answer:
          "Leave them out of the list and use the final exam planner, which works out the score you need on the remaining assessment.",
      },
      {
        question: "My course adds up total points instead of using weights. Can I still use it?",
        answer:
          "Yes. Give each assessment a weight equal to its maximum marks. A 50-mark test weighted 50 and a 100-mark exam weighted 100 reproduce a total-points calculation exactly.",
      },
    ],
  },

  "attendance-calculator": {
    tips: [
      "Count only the classes that were actually held; cancelled classes usually do not count either way.",
      "Check your attendance early in the term, while missed classes are still easy to make up.",
      "Use the number of classes you can miss as a buffer for illness, not as a target.",
      "Ask your institution about medical or approved absences, which are sometimes excluded from the count.",
    ],
    faq: [
      {
        question: "How is attendance percentage calculated?",
        answer: "Classes attended divided by classes held, multiplied by 100. 30 out of 40 is 75%.",
      },
      {
        question: "How many classes do I need to attend to get back to 75%?",
        answer:
          "It depends on how far below you are. At 30 out of 45 (66.7%), you need 15 classes in a row: 45 out of 60 is exactly 75%. The calculator works this out for any numbers.",
      },
      {
        question: "Does the calculator know my college's rules?",
        answer:
          "No. It uses the requirement you enter. Check your institution's handbook for the percentage and for how it treats leave and cancelled classes.",
      },
    ],
  },

  "emi-calculator": {
    tips: [
      "Compare loans by total interest as well as by EMI; a lower monthly payment over a longer term usually costs far more overall.",
      "Ask whether the quoted rate is reducing-balance or flat. A flat rate always sounds cheaper than it is.",
      "Prepaying early in the loan saves the most interest, because the balance is highest then.",
      "Add processing fees and insurance to the comparison; the EMI alone does not include them.",
    ],
    faq: [
      {
        question: "What is the difference between a flat rate and a reducing-balance rate?",
        answer:
          "A reducing-balance rate charges interest only on what you still owe. A flat rate charges it on the full original amount for the whole term. A 9% flat rate on a five-year loan costs about the same as 15.7% on a reducing balance.",
      },
      {
        question: "How much does paying extra each month save?",
        answer:
          "On 500,000 over five years at 9%, paying 1,000 a month above the EMI clears the loan in 54 months instead of 60 and saves about 13,900 in interest. Check your loan terms for prepayment charges first.",
      },
      {
        question: "How much EMI can I afford?",
        answer:
          "A common rule of thumb is to keep all loan repayments together under about 40% of take-home pay. Lenders apply their own limits, and leaving room for savings and emergencies matters as much as the lender's yes.",
      },
    ],
  },

  "loan-calculator": {
    tips: [
      "Compare offers by the total repaid, not just the payment amount.",
      "Try a fortnightly or weekly schedule to see how much faster the loan clears.",
      "Ask lenders for the APR, which includes fees, when comparing offers with different charges.",
      "Check for early-repayment charges before planning to pay off a loan early.",
    ],
    faq: [
      {
        question: "What is APR?",
        answer:
          "The annual percentage rate: a yearly figure that includes the interest and most compulsory fees, so loans with different charges can be compared. Exactly what it includes is set by law and differs between countries.",
      },
      {
        question: "How does the term change what I pay?",
        answer:
          "A longer term lowers each payment but raises the total interest, because you borrow the money for longer. The table shows both so you can choose.",
      },
      {
        question: "Can I see how much interest I pay in each period?",
        answer:
          "Yes. The amortisation table splits every payment into interest and principal and shows the balance after it.",
      },
    ],
  },

  "mortgage-calculator": {
    tips: [
      "Include property tax and insurance; they are often the reason a monthly payment is higher than a simple rate calculator suggested.",
      "Compare a 15-year and a 30-year term. The shorter term costs more each month and far less in total.",
      "Try different deposits to see how much each extra amount lowers the monthly payment.",
      "Leave room in your budget for maintenance and repairs, which no mortgage payment covers.",
    ],
    faq: [
      {
        question: "How much interest does a shorter mortgage save?",
        answer:
          "On 280,000 at 6.5%, a 30-year loan costs about 1,770 a month and roughly 357,000 in interest. Over 15 years it is about 2,439 a month and roughly 159,000 in interest — around 198,000 less.",
      },
      {
        question: "What is the difference between principal and interest?",
        answer:
          "Principal is the part of each payment that reduces what you owe. Interest is the lender's charge for the money still outstanding. Early payments are mostly interest; later ones are mostly principal.",
      },
      {
        question: "Are closing costs included?",
        answer:
          "No. The calculator covers the monthly payment: principal, interest, property tax, insurance and any association fee. One-off purchase costs vary by country and lender.",
      },
    ],
  },

  "compound-interest-calculator": {
    tips: [
      "Start early. Time does more of the work than the rate or the frequency of compounding.",
      "Regular contributions usually matter more than the starting amount over long periods.",
      "Use a realistic, after-fees rate. A projection at an optimistic rate is just a bigger wrong number.",
      "Remember inflation: a balance in 30 years buys less than the same number would today.",
    ],
    faq: [
      {
        question: "What is the difference between simple and compound interest?",
        answer:
          "Simple interest is paid only on the original amount; compound interest is also paid on interest already earned. 10,000 at 5% for 10 years earns 5,000 simple interest, but about 6,289 compounded annually.",
      },
      {
        question: "How much difference does starting ten years earlier make?",
        answer:
          "Saving 200 a month at 7% compounded monthly grows to about 104,000 after 20 years, from 48,000 paid in. Over 30 years it grows to about 244,000, from 72,000 paid in — the extra ten years more than double the result.",
      },
      {
        question: "What interest rate should I enter?",
        answer:
          "The rate you realistically expect after fees: your savings account's rate, or a cautious long-run assumption for investments. The result is a projection at a fixed rate, not a forecast.",
      },
    ],
  },

  "bmi-calculator": {
    tips: [
      "Measure your height without shoes, standing straight against a wall; height errors matter because they are squared.",
      "Weigh yourself at the same time of day, ideally in the morning.",
      "Watch the trend over weeks rather than a single reading.",
      "Use waist measurement alongside BMI; it says more about where fat is carried.",
    ],
    faq: [
      {
        question: "How do I calculate BMI in pounds and inches?",
        answer:
          "Multiply your weight in pounds by 703 and divide by your height in inches squared. At 160 lb and 5 ft 9 in (69 inches): 703 × 160 ÷ 4,761 = 23.6.",
      },
      {
        question: "What BMI counts as obese?",
        answer:
          "30 and above for adults, divided into class I (30 to 34.9), class II (35 to 39.9) and class III (40 and above).",
      },
      {
        question: "Is BMI different for men and women?",
        answer:
          "The adult categories are the same for both. The measure does not account for differences in body composition, which is one of its limits.",
      },
    ],
  },

  "discount-calculator": {
    tips: [
      "Multiply stacked discounts, never add them: 20% then 10% off is 28% off, not 30%.",
      "Work backwards from a sale price to check the “was” price a shop advertises.",
      "Compare price per unit as well as the discount when pack sizes differ.",
      "Read “up to 50% off” carefully — only some items carry the largest discount.",
    ],
    faq: [
      {
        question: "How do I take 20% off a price?",
        answer: "Multiply by 0.8. A 75 item at 20% off costs 75 × 0.8 = 60.",
      },
      {
        question: "What is the total discount from two offers combined?",
        answer:
          "Multiply what each leaves you to pay, then subtract from one. 20% and 10% leave 0.8 × 0.9 = 0.72 of the price, so the combined discount is 28%.",
      },
      {
        question: "Is “buy one, get one free” the same as 50% off?",
        answer:
          "Only if you wanted two. Each item then costs half price, but if you only needed one, you are paying full price for it.",
      },
    ],
  },

  "tax-calculator": {
    tips: [
      "To remove tax from a price, divide by one plus the rate; subtracting the percentage gives the wrong answer.",
      "Check whether a price is quoted with or without tax before adding anything.",
      "Rates change, and some goods carry reduced rates. Confirm the current rate for what you are pricing.",
      "On invoices, decide whether tax is rounded per line or on the total, and do it the same way every time.",
    ],
    faq: [
      {
        question: "How do I add 20% VAT to a price?",
        answer: "Multiply by 1.2. A net price of 50 becomes 60 with 20% VAT.",
      },
      {
        question: "How much of a tax-inclusive price is tax?",
        answer:
          "The rate divided by one plus the rate. At 20%, tax is 0.2 ÷ 1.2 — one sixth — of the gross price, so 20 out of 120.",
      },
      {
        question: "Why do invoice totals sometimes differ by a cent?",
        answer:
          "Rounding tax on each line and rounding it once on the total can give results a cent apart. Both are legitimate; what matters is using one method consistently.",
      },
    ],
  },

  "salary-calculator": {
    tips: [
      "Compare job offers as annual figures, including the hours each one expects.",
      "Remember a month is about 4.35 weeks, not 4, when converting weekly pay.",
      "Enter unpaid weeks off if you have them; they change your effective hourly rate.",
      "For pay after tax and deductions, use the Take-Home Pay Calculator.",
    ],
    faq: [
      {
        question: "How do I convert an hourly wage to a yearly salary?",
        answer:
          "Multiply the hourly rate by your hours a week and by the weeks you are paid a year. At 20 an hour, 40 hours a week for 52 weeks, that is 41,600 a year.",
      },
      {
        question: "How do I convert an annual salary to monthly pay?",
        answer: "Divide by 12. A salary of 48,000 a year is 4,000 a month before tax.",
      },
      {
        question: "How do I see my pay after tax?",
        answer:
          "This calculator works with gross pay. The Take-Home Pay Calculator estimates pay after tax for the UK, Canada, Australia and India.",
      },
    ],
  },

  "scientific-calculator": {
    tips: [
      "Check the angle mode before using sin, cos or tan; degrees and radians give completely different answers.",
      "Use parentheses whenever you are unsure of the order; extra brackets never change a correct result.",
      "Click a line in the history to reuse it instead of retyping.",
      "Use the memory keys to keep a running total across several calculations.",
    ],
    faq: [
      {
        question: "Why does sin(30) give −0.988 instead of 0.5?",
        answer: "The calculator is in radians. Switch to degrees and sin(30) gives 0.5.",
      },
      {
        question: "Why does log of a negative number give an error?",
        answer:
          "The logarithm of a negative number, or of zero, is not defined in real numbers, so the calculator reports it rather than showing a meaningless result.",
      },
      {
        question: "Can I reuse an earlier answer?",
        answer: "Yes. Click any line in the history to bring that expression back into the input.",
      },
    ],
  },

  "paint-coverage-calculator": {
    tips: [
      "Use the coverage printed on the tin you plan to buy; it varies between paints.",
      "Allow for more paint on new plaster, rough surfaces and strong colour changes, or use a primer first.",
      "Buy all the paint or wallpaper for a room at once; batches can differ slightly in colour.",
      "Keep a little left over for touch-ups, labelled with the room and the colour name.",
    ],
    faq: [
      {
        question: "How do I measure a room for paint?",
        answer:
          "Measure the length and width of the floor and the height of the walls. The wall area is the perimeter, 2 × (length + width), multiplied by the height. A 4 × 3 m room with 2.5 m walls has 35 m² of wall.",
      },
      {
        question: "Should I buy extra paint?",
        answer:
          "The calculation already adds a waste allowance. Any small amount left over is useful for touch-ups later.",
      },
      {
        question: "What is a pattern repeat on wallpaper?",
        answer:
          "The vertical distance before the pattern starts again. Each strip has to be cut so the pattern lines up with its neighbour, so a larger repeat means more waste and more rolls.",
      },
    ],
  },

  "pet-age-calculator": {
    tips: [
      "For a mixed-breed dog, choose by weight rather than guessing a breed.",
      "Use the life stage to plan care: senior pets usually benefit from more frequent check-ups.",
      "Remember the result is an estimate; health and lifestyle matter as much as age.",
      "Compare the two dog estimates as a range rather than picking one as exact.",
    ],
    faq: [
      {
        question: "How old is a 10-year-old cat in human years?",
        answer: "About 56: 24 at two years old, plus about four human years for each year after that.",
      },
      {
        question: "How old is a one-year-old dog in human years?",
        answer:
          "About 15 for most sizes, or about 12 for giant breeds. Dogs mature very quickly in their first year.",
      },
      {
        question: "Why do the two dog estimates disagree?",
        answer:
          "They come from different methods. The size chart is the traditional veterinary guide; the DNA-based formula comes from a study of Labrador retrievers. Together they give a sensible range.",
      },
    ],
  },

  "take-home-pay-calculator": {
    tips: [
      "Choose the right region: Scotland has its own income tax bands, and Canadian results depend on the province.",
      "Include pension contributions and how they are made; salary sacrifice also reduces National Insurance in the UK.",
      "Pick the correct student loan plan; the thresholds differ a lot.",
      "Compare the result with a payslip and expect small differences from tax codes and benefits.",
    ],
    faq: [
      {
        question: "Which countries are covered?",
        answer:
          "The UK (with Scottish rates), Canada (Ontario, British Columbia and Alberta), Australia and India (both tax regimes).",
      },
      {
        question: "Which tax year does it use?",
        answer:
          "The UK's 2026–27 tax year, Canada's 2026 rates, Australia's 2026–27 resident rates and India's FY 2026–27.",
      },
      {
        question: "Is the result exactly what I will be paid?",
        answer:
          "It is an estimate for a typical employee. Tax codes, benefits in kind, other income and employer-specific deductions can all change the real figure.",
      },
    ],
  },

  "ev-charging-cost-calculator": {
    tips: [
      "Use the consumption shown on your car's dashboard over a few weeks; it reflects your real driving better than the official figure.",
      "Set the share of public charging honestly; rapid chargers can cost several times more per kWh than home electricity.",
      "If your tariff is cheaper overnight, enter the overnight price for home charging.",
      "Expect higher consumption in winter, when heating and cold batteries use more energy.",
    ],
    faq: [
      {
        question: "How do I convert miles per kWh to kWh per 100 miles?",
        answer: "Divide 100 by the miles per kWh. A car that does 3.5 miles per kWh uses about 28.6 kWh per 100 miles.",
      },
      {
        question: "What is charging efficiency?",
        answer:
          "The share of electricity from the grid that ends up in the battery. Some is lost as heat; around 90% is typical for home charging, which is the default here.",
      },
      {
        question: "Why do UK and US mpg figures differ for the same car?",
        answer:
          "The gallons are different sizes. A UK gallon is 4.546 litres and a US gallon 3.785, so the same car shows a higher mpg in UK figures.",
      },
    ],
  },

  "subscription-cost-tracker": {
    tips: [
      "Go through two or three months of bank and card statements; yearly and quarterly charges are easy to forget.",
      "Check app store subscriptions on your phone as well as card payments.",
      "Note when free trials end, before they turn into paid subscriptions.",
      "Tick the ones you might cancel to see the saving before you decide.",
    ],
    faq: [
      {
        question: "Is paying yearly cheaper than paying monthly?",
        answer:
          "Often, yes — many services discount a yearly plan. Compare the yearly price with twelve times the monthly price, and only commit if you are sure you will use it all year.",
      },
      {
        question: "Can I export my list?",
        answer: "Yes. Export it as a CSV file to keep a copy or open it in a spreadsheet.",
      },
      {
        question: "Is my list sent anywhere?",
        answer:
          "No. It is stored in this browser's local storage on your device and never sent to a server.",
      },
    ],
  },
};
