import type { ToolContent } from "@/types/tool";

function unitContent(options: {
  name: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  units: string;
  basis: string;
  extra: string;
  faq: Array<{ question: string; answer: string }>;
  formula?: ToolContent["formula"];
  example?: ToolContent["example"];
}): ToolContent {
  return {
    seoTitle: options.seoTitle,
    seoDescription: options.seoDescription,
    intro: options.intro,
    howToUse: [
      "Type a value into any box — every other unit updates as you type.",
      "Use the swap button to flip the two headline units.",
      "Copy any result with the button beside it.",
      "Adjust the decimal places if you need more or less precision.",
    ],
    howItWorks: [
      options.basis,
      options.extra,
      "Conversion works by taking your value to a single base unit and then out again, so every pair of units is consistent with every other. Values are calculated at full double precision and only rounded for display, which means round-tripping a number through two conversions returns what you started with.",
    ],
    formula: options.formula,
    example: options.example,
    faq: [
      ...options.faq,
      {
        question: "How accurate are these conversions?",
        answer: `${options.units} All arithmetic is done at full precision and rounded only when displayed, so results are exact to the digits shown.`,
      },
    ],
  };
}

export const converterContent: Record<string, ToolContent> = {
  "timezone-meeting-planner": {
    seoTitle: "Time Zone Meeting Planner — Find Overlapping Hours",
    seoDescription:
      "Plan meetings across time zones. Compare cities side by side in an hour-by-hour grid, see where working hours overlap, and copy the times for your invite.",
    intro:
      "Add the cities your team works in to see their hours side by side, find the hours when everyone is at work, and copy a meeting time for all of them.",
    howToUse: [
      "Add each city or time zone — the first one is the reference.",
      "Choose the meeting date and the working hours to aim for.",
      "Look for the hours marked ✓, which fall within working hours everywhere.",
      "Select an hour to see it in every city, then copy the times into your invite.",
    ],
    howItWorks: [
      "Each column is one hour in the reference city. For every city the tool works out the local time at that moment from your browser's built-in time-zone database — the same IANA rules operating systems use — so daylight saving, half-hour offsets such as India's and 45-minute offsets such as Nepal's are all correct for the date you choose.",
      "An hour counts as good for a city when the whole hour falls inside the working hours you set, on a weekday. Early mornings and evenings are marked separately from night and weekends, so when there is no perfect overlap you can see the least disruptive compromise.",
      "Daylight saving starts and ends on different dates in different countries — the United States changes its clocks weeks before Europe does — so the overlap between two cities can shift by an hour for part of the year. Choosing the actual meeting date, not just today, avoids that trap.",
    ],
    faq: [
      {
        question: "What is the best meeting time for London and New York?",
        answer:
          "On most weekdays, 14:00–17:00 in London, which is 09:00–12:00 in New York. For a few weeks in spring and autumn, when only one country has changed its clocks, the overlap moves by an hour.",
      },
      {
        question: "Does it handle daylight saving time?",
        answer: "Yes. Local times are worked out for the date you choose, using each place's time-zone rules on that date.",
      },
      {
        question: "Why do some cities show times like 18:30?",
        answer: "Some time zones are offset from UTC by half or three-quarters of an hour, such as India (UTC+5:30) and Nepal (UTC+5:45).",
      },
      {
        question: "Can I add a time zone that isn't in the city list?",
        answer: "Yes. Type any IANA time zone name, such as America/Bogota or Pacific/Fiji, into the box and press Add.",
      },
    ],
  },

  "shoe-size-converter": {
    seoTitle: "Shoe Size Converter — US, UK, EU and Japan Sizes",
    seoDescription:
      "Convert shoe sizes between US men's, US women's, UK, European, Japanese and Mondopoint sizes, or find your size from your foot length in cm or inches.",
    intro:
      "Convert a shoe size between the US, UK, European and Japanese systems — or measure your foot and get your size in all of them.",
    howToUse: [
      "Choose the sizing system you know, such as US women's.",
      "Enter your size — or choose Foot length and enter a measurement in centimetres or inches.",
      "Read your estimated foot length and your size in every other system.",
      "Compare your foot length with the brand's own chart before buying, because sizes vary between makers.",
    ],
    howItWorks: [
      "Every sizing system is a scale laid over the length of a foot, with a different starting point and step. UK and US sizes go up in steps of a third of an inch, European (Paris point) sizes in steps of two-thirds of a centimetre, and Japanese and Mondopoint sizes simply state the foot length in centimetres or millimetres.",
      "The converter turns your size into an estimated foot length, then works out the size in each other system from the standard relationships: UK ≈ 3 × foot length in inches − 23, US men's ≈ 3 × foot length − 22, US women's ≈ 3 × foot length − 21, and European ≈ 1.5 × foot length in centimetres + 2. UK, US and European results are rounded to the nearest half size.",
      "These are the relationships the systems are built on, not any one brand's chart. Manufacturers use their own lasts and allowances, and some brand charts sit a full size away from these figures — which is why the estimated foot length is shown first: it is the most reliable number to compare with a maker's chart.",
    ],
    formula: {
      expression: "UK ≈ 3 × L(in) − 23      US men ≈ 3 × L(in) − 22      US women ≈ 3 × L(in) − 21      EU ≈ 1.5 × L(cm) + 2",
      where: ["L — foot length, in inches (in) or centimetres (cm)", "1 inch = 2.54 cm"],
      note: "Results are rounded to the nearest half size. Individual brands can differ from these by up to a full size.",
    },
    example: {
      scenario: "A foot that measures 25 cm",
      steps: [
        "Choose Foot length and enter 25 cm.",
        "25 cm is 9.84 inches.",
        "UK = 3 × 9.84 − 23 = 6.53, and EU = 1.5 × 25 + 2 = 39.5.",
      ],
      result: "UK 6.5, US men's 7.5, US women's 8.5, EU 39.5, Japan 25 cm, Mondopoint 250.",
    },
    faq: [
      {
        question: "How do I measure my foot length?",
        answer:
          "Stand on a sheet of paper with your heel against a wall, mark the tip of your longest toe, and measure from the wall to the mark. Measure both feet in the evening, when feet are largest, and use the longer one.",
      },
      {
        question: "What is the difference between US men's and women's sizes?",
        answer: "For the same foot, a US women's size is one size larger than the men's size, so a men's 8 is roughly a women's 9.",
      },
      {
        question: "Are UK and European sizes different for men and women?",
        answer:
          "No. UK, European, Japanese and Mondopoint sizes use one scale for everyone; only US sizing has separate men's and women's scales.",
      },
      {
        question: "Does it cover children's sizes?",
        answer: "No. Children's scales start from different points in each country and are not described by these adult formulas.",
      },
    ],
  },

  "engine-cc-to-hp": {
    seoTitle: "CC to HP Converter — Engine Size to Horsepower",
    seoDescription:
      "Convert engine cc to litres and cubic inches exactly, and estimate horsepower from engine size for petrol, turbo and diesel cars and motorcycles.",
    intro:
      "Convert engine displacement between cc, litres and cubic inches, and see a realistic horsepower range for an engine of that size and type.",
    howToUse: [
      "Enter the engine size in cc, litres or cubic inches.",
      "Choose the kind of engine, such as a turbocharged petrol car or a sport motorcycle.",
      "Read the exact size conversions and the estimated power range.",
      "Or enter a known power figure to convert between horsepower, metric PS and kilowatts.",
    ],
    howItWorks: [
      "Displacement conversions are exact. One litre is 1,000 cubic centimetres and one cubic inch is exactly 16.387064 cc, so a 1,998 cc engine is 2.0 litres or 121.9 cubic inches.",
      "Horsepower cannot be converted from cc, because displacement is only one ingredient of power. Two engines of the same size can differ several times over depending on turbocharging, how fast they rev and what they are tuned for. What can be done is an estimate from typical specific output — power per litre — for each kind of engine, shown as a low, typical and high figure.",
      "The specific outputs used are: small scooter and commuter motorcycle engines about 60–95 hp per litre; naturally aspirated petrol car engines 70–110; turbocharged petrol engines 100–160; turbodiesel car engines 55–100; high-revving sport motorcycles 150–220; and large truck diesels 25–40. For a real engine, the manufacturer's rated figure is always the one to use.",
      "Power units are converted exactly: one mechanical horsepower is 745.7 watts and one metric horsepower (PS, used on many European and Japanese specification sheets) is 735.5 watts, so 100 PS is 98.6 hp or 73.5 kW.",
    ],
    formula: {
      expression: "litres = cc ÷ 1000      cubic inches = cc ÷ 16.387064      estimated hp = litres × specific output",
      where: [
        "cc — engine displacement in cubic centimetres",
        "specific output — typical horsepower per litre for the engine type",
      ],
      note: "The displacement conversions are exact; horsepower from displacement is only ever an estimate.",
    },
    example: {
      scenario: "A 1,500 cc turbocharged petrol car engine",
      steps: [
        "Enter 1500 cc and choose Petrol car, turbocharged.",
        "1500 ÷ 1000 = 1.5 litres, and 1500 ÷ 16.387064 = 91.5 cubic inches.",
        "1.5 litres × 100 to 160 hp per litre, with 120 as the typical figure.",
      ],
      result: "1.5 L or 91.5 cu in, with an estimated 150–240 hp and typically around 180 hp.",
    },
    faq: [
      {
        question: "How much horsepower is 150 cc?",
        answer:
          "A 150 cc scooter or commuter motorcycle typically makes about 9–14 hp. A 150 cc racing engine can make considerably more.",
      },
      {
        question: "Is cc the same as horsepower?",
        answer:
          "No. cc measures the volume swept by the engine's cylinders; horsepower measures the power it produces. Bigger engines tend to be more powerful, but turbocharging and tuning matter as much as size.",
      },
      {
        question: "What is the difference between hp, bhp and PS?",
        answer:
          "hp and bhp both usually mean mechanical horsepower (745.7 W); bhp stresses that it was measured at the crankshaft. PS is metric horsepower (735.5 W), about 1.4% smaller, so the same power is a slightly bigger number in PS.",
      },
      {
        question: "How many cc is a 2.0-litre engine?",
        answer:
          "Nominally 2,000 cc, but manufacturers round the figure: most engines sold as 2.0 litres are between about 1,950 and 1,999 cc.",
      },
    ],
  },

  "currency-converter": {
    seoTitle: "Currency Converter — Live Exchange Rates",
    seoDescription:
      "Convert between major world currencies using daily European Central Bank reference rates. Free, no account, and rates are clearly dated.",
    intro:
      "Convert between major currencies using daily reference rates. The rate's date is always shown, so you know how fresh the figure is.",
    howToUse: [
      "Pick the currency you are converting from and the one you are converting to.",
      "Type an amount — the conversion updates immediately.",
      "Use the swap button to reverse the direction.",
      "Check the date shown under the result to see when the rate was published.",
    ],
    howItWorks: [
      "Rates come from a public reference feed that republishes the European Central Bank's daily rates. These are the mid-market reference rates published each working day at around 16:00 CET — the same figures news outlets quote.",
      "A reference rate is not what you will be charged. Banks, card networks and money transfer services add a margin on top, typically between 0.5% and 4%, and may charge a separate fee. Treat the number here as the honest midpoint the retail rate is measured against, not a quote.",
      "Rates are fetched once and cached for an hour, since the source only updates daily. When the feed cannot be reached the tool says so plainly and shows no figure, rather than falling back to a stale or invented rate.",
      "The amount you type is never sent anywhere. Only the currency codes are used to look up a rate; the arithmetic happens in your browser.",
    ],
    disclaimer:
      "Exchange rates are daily reference rates and are approximate. They change constantly and do not include the margin or fees your bank or provider will apply. Do not rely on them for trading or accounting.",
    faq: [
      {
        question: "How often are the rates updated?",
        answer:
          "The source publishes once each working day, around 16:00 Central European Time. There are no updates at weekends or on European public holidays.",
      },
      {
        question: "Why does my bank give me a different rate?",
        answer:
          "These are mid-market reference rates — the midpoint between buy and sell prices. Retail providers add a margin, usually 0.5% to 4%, plus any fixed fee.",
      },
      {
        question: "Can I use these rates for accounting?",
        answer:
          "No. Use the official rate your tax authority or accounting standard requires, which is usually a specific published rate for a specific date.",
      },
      {
        question: "Why is a currency missing?",
        answer:
          "The reference feed covers around thirty widely traded currencies. Pegged and thinly traded currencies are not included.",
      },
    ],
  },

  "length-converter": unitContent({
    name: "Length",
    seoTitle: "Length Converter — Metres, Feet, Inches, Miles",
    seoDescription:
      "Convert length and distance between metric and imperial units — millimetres to inches, metres to feet, kilometres to miles and more.",
    intro:
      "Convert length and distance across fifteen units. Type in one box and every other updates instantly.",
    units:
      "Every factor is defined against the metre, using the exact internationally agreed values — the inch is exactly 25.4 mm by definition, not an approximation.",
    basis:
      "All length units are defined against the metre, which since 1983 has been defined by the speed of light. The imperial units are not independent measurements: since the 1959 international yard and pound agreement, the inch is defined as exactly 25.4 millimetres, which makes every other imperial length exact too.",
    extra:
      "That exactness is why 5 feet 11 inches converts to precisely 1.8034 metres rather than something that drifts in the last digit. The nautical mile is the one unit defined differently — exactly 1,852 metres, chosen to approximate one minute of latitude.",
    formula: {
      expression: "value in target = (value × factor of source) ÷ factor of target",
      where: [
        "factor — how many metres one of that unit represents",
        "metre — the base unit every factor is defined against",
      ],
      note: "1 inch = 0.0254 m exactly; 1 mile = 1609.344 m exactly; 1 nautical mile = 1852 m exactly.",
    },
    example: {
      scenario: "Converting a height of 5 ft 11 in to metres",
      steps: ["5 ft 11 in = 71 inches", "71 × 0.0254 = 1.8034"],
      result: "1.8034 metres, or 180.34 centimetres.",
    },
    faq: [
      {
        question: "How many centimetres are in an inch?",
        answer:
          "Exactly 2.54. This is a definition rather than a measurement, agreed internationally in 1959.",
      },
      {
        question: "How do I convert feet and inches to centimetres?",
        answer:
          "Multiply the feet by 12, add the inches, then multiply by 2.54. So 5 ft 9 in is 69 inches, which is 175.26 cm.",
      },
      {
        question: "Why is a nautical mile different from a land mile?",
        answer:
          "A nautical mile is 1,852 metres, defined to approximate one minute of arc of latitude, which makes chart navigation straightforward. A land mile is 1,609.344 metres.",
      },
    ],
  }),

  "weight-converter": unitContent({
    name: "Weight",
    seoTitle: "Weight Converter — Kilograms, Pounds, Stones, Ounces",
    seoDescription:
      "Convert weight and mass between kilograms, grams, pounds, ounces, stones and tonnes. Instant, accurate conversions in your browser.",
    intro:
      "Convert weight between metric and imperial units, including stones for body weight and both kinds of ton.",
    units:
      "Factors are defined against the kilogram; the pound is exactly 0.45359237 kg by international agreement.",
    basis:
      "Every unit here is defined against the kilogram. The avoirdupois pound — the ordinary pound used for everyday weight — has been defined as exactly 0.45359237 kilograms since 1959, which makes ounces, stones and hundredweights exact as well.",
    extra:
      "Two traps are worth knowing about. A US ton is 2,000 pounds while a UK long ton is 2,240, and a metric tonne is 1,000 kg — three different things that all get called a ton, so they are listed separately here. Strictly, these are units of mass; weight is a force. In everyday use the distinction rarely matters, but it is why a kilogram is the same on the Moon while your weight is not.",
    formula: {
      expression: "value in target = (value × factor of source) ÷ factor of target",
      where: [
        "factor — how many kilograms one of that unit represents",
        "kilogram — the base unit every factor is defined against",
      ],
      note: "1 lb = 0.45359237 kg exactly; 1 stone = 14 lb; 1 oz = 1/16 lb.",
    },
    example: {
      scenario: "Converting 11 stone 4 pounds to kilograms",
      steps: ["11 × 14 + 4 = 158 pounds", "158 × 0.45359237 = 71.67"],
      result: "About 71.67 kilograms.",
    },
    faq: [
      {
        question: "How many pounds are in a kilogram?",
        answer: "About 2.20462. Going the other way, one pound is exactly 0.45359237 kg.",
      },
      {
        question: "How do I convert stones and pounds to kilograms?",
        answer:
          "Multiply the stones by 14, add the pounds, then multiply the total by 0.45359237.",
      },
      {
        question: "Which ton is which?",
        answer:
          "A metric tonne is 1,000 kg, a US short ton is 2,000 lb (907.18 kg), and a UK long ton is 2,240 lb (1,016.05 kg). All three are listed separately.",
      },
    ],
  }),

  "temperature-converter": {
    seoTitle: "Temperature Converter — Celsius, Fahrenheit, Kelvin",
    seoDescription:
      "Convert temperature between Celsius, Fahrenheit, Kelvin and Rankine. See all four scales at once, with the formulas explained.",
    intro:
      "Convert between Celsius, Fahrenheit, Kelvin and Rankine. All four scales update together as you type.",
    howToUse: [
      "Type a temperature into any of the four boxes.",
      "The other three update immediately.",
      "Use the reference points below for a quick sanity check.",
    ],
    howItWorks: [
      "Temperature is the odd one out among unit conversions, because these scales have different zero points as well as different step sizes. That is why you cannot convert by multiplying alone — you have to shift as well as scale.",
      "Celsius and Kelvin share a step size and differ only in where zero sits: 0 °C is 273.15 K. Fahrenheit uses a step five-ninths the size, with its zero further down again. Rankine is to Fahrenheit what Kelvin is to Celsius — an absolute scale using Fahrenheit-sized degrees.",
      "Absolute zero is the floor: −273.15 °C, −459.67 °F, or 0 K. Values below it are physically impossible, and the tool flags them rather than converting nonsense.",
    ],
    formula: {
      expression: "°F = °C × 9/5 + 32      °C = (°F − 32) × 5/9      K = °C + 273.15      °R = °F + 459.67",
      where: [
        "°C — degrees Celsius",
        "°F — degrees Fahrenheit",
        "K — kelvin, the absolute scale with Celsius-sized steps",
        "°R — degrees Rankine, absolute with Fahrenheit-sized steps",
      ],
      note: "−40 is the one point where Celsius and Fahrenheit agree, which makes it a handy check.",
    },
    example: {
      scenario: "Converting a 180 °C oven temperature",
      steps: ["180 × 9/5 = 324", "324 + 32 = 356"],
      result: "356 °F, or 453.15 K.",
    },
    faq: [
      {
        question: "How do I convert Celsius to Fahrenheit in my head?",
        answer:
          "Double it and add 30 for a rough answer — 20 °C gives about 70 °F, close to the exact 68. For accuracy, multiply by 1.8 and add 32.",
      },
      {
        question: "What temperature is the same in Celsius and Fahrenheit?",
        answer: "−40. It is the single point where the two scales cross.",
      },
      {
        question: "Why does Kelvin have no degree symbol?",
        answer:
          "Kelvin is an absolute unit rather than a scale of degrees, so it is written as 300 K, not 300 °K.",
      },
      {
        question: "What is absolute zero?",
        answer:
          "0 K, equal to −273.15 °C or −459.67 °F — the point where thermal motion is at its minimum. Nothing can be colder.",
      },
    ],
  },

  "time-converter": unitContent({
    name: "Time",
    seoTitle: "Time Converter — Seconds, Minutes, Hours, Days, Years",
    seoDescription:
      "Convert time between nanoseconds and years. Instant conversion across twelve units with clear notes on how months and years are defined.",
    intro:
      "Convert durations between nanoseconds and years, with every unit visible at once.",
    units:
      "Sub-day units are exact. Months and years are averages, since calendar months vary in length.",
    basis:
      "Everything up to a week is exact and unambiguous: a minute is 60 seconds, an hour 3,600, a day 86,400, a week 604,800.",
    extra:
      "Above a week it gets fuzzy, and it is worth being explicit about the choice made here. A year is taken as 365.2425 days — the Gregorian average, which accounts for the leap-year rules — and a month as one twelfth of that, about 30.44 days. That is why converting 1 month to days gives 30.44 rather than a whole number: there is no single correct answer, so the average is used. For real calendar arithmetic on specific dates, use the age calculator instead.",
    formula: {
      expression: "value in target = (value × seconds per source unit) ÷ seconds per target unit",
      where: [
        "second — the base unit every duration is defined against",
        "year — taken as 365.2425 days, the Gregorian mean",
        "month — taken as one twelfth of a mean year",
      ],
    },
    faq: [
      {
        question: "How many seconds are in a day?",
        answer: "86,400 — that is 24 hours × 60 minutes × 60 seconds.",
      },
      {
        question: "Why is a month 30.44 days here?",
        answer:
          "Because calendar months are 28 to 31 days long, so any single conversion has to use an average. 30.44 days is one twelfth of a mean Gregorian year.",
      },
      {
        question: "How do I work out the time between two dates?",
        answer:
          "Use the age calculator, which counts real calendar days including leap years, rather than averaging.",
      },
    ],
  }),

  "speed-converter": unitContent({
    name: "Speed",
    seoTitle: "Speed Converter — km/h, mph, m/s, Knots",
    seoDescription:
      "Convert speed between kilometres per hour, miles per hour, metres per second, knots, feet per second and Mach.",
    intro:
      "Convert speed across the units used for driving, running, sailing and flying — including knots and Mach.",
    units:
      "Factors derive from the exact length definitions, so mph and km/h conversions are precise.",
    basis:
      "Every speed is converted through metres per second, the SI base. Because the mile and the nautical mile are both exactly defined in metres, the conversions between mph, km/h and knots are exact rather than approximate.",
    extra:
      "Mach is the exception and deserves a caveat: it is a ratio to the local speed of sound, which changes with air temperature. The value used here, 340.29 m/s, is the standard sea-level figure at 15 °C. At cruising altitude the speed of sound is nearer 295 m/s, so Mach 1 there is a considerably slower ground speed.",
    formula: {
      expression: "value in target = (value × m/s per source unit) ÷ m/s per target unit",
      where: [
        "m/s — metres per second, the base unit",
        "knot — one nautical mile per hour, exactly 1852/3600 m/s",
        "Mach — a ratio to the speed of sound, taken at sea level and 15 °C",
      ],
    },
    faq: [
      {
        question: "How do I convert km/h to mph quickly?",
        answer:
          "Multiply by 0.621, or roughly divide by 1.6. So 100 km/h is about 62 mph.",
      },
      {
        question: "What is a knot?",
        answer:
          "One nautical mile per hour, about 1.852 km/h or 1.151 mph. It is standard in aviation and at sea because it maps directly onto latitude on a chart.",
      },
      {
        question: "Why does Mach depend on altitude?",
        answer:
          "Because the speed of sound depends on air temperature, which falls with altitude. Mach 1 is about 1,225 km/h at sea level but nearer 1,062 km/h at 11,000 metres.",
      },
    ],
  }),

  "area-converter": unitContent({
    name: "Area",
    seoTitle: "Area Converter — Square Metres, Feet, Acres, Hectares",
    seoDescription:
      "Convert area between square metres, square feet, acres, hectares, square miles and more. Useful for property, land and flooring.",
    intro:
      "Convert area between metric and imperial units, including the acre and hectare used for land.",
    units:
      "Factors are squared from the exact length definitions, so an acre is exactly 4046.8564224 m².",
    basis:
      "Area units are the squares of length units, so their conversion factors are the length factors squared. One square foot is 0.3048² = 0.09290304 m², exactly.",
    extra:
      "The two land units are worth knowing. A hectare is a clean 10,000 m² — a square 100 metres on a side. An acre is a historical unit, originally the area a yoke of oxen could plough in a day, now defined as exactly 43,560 square feet, which works out at 4,046.856 m². There are about 2.471 acres to the hectare.",
    formula: {
      expression: "value in target = (value × m² per source unit) ÷ m² per target unit",
      where: [
        "m² — square metre, the base unit",
        "hectare — exactly 10,000 m²",
        "acre — exactly 43,560 ft², which is 4046.8564224 m²",
      ],
    },
    example: {
      scenario: "A building plot of 1,200 square feet",
      steps: ["1200 × 0.09290304 = 111.48"],
      result: "About 111.48 square metres, or 0.0275 acres.",
    },
    faq: [
      {
        question: "How many square feet are in a square metre?",
        answer: "About 10.764. Going the other way, a square foot is 0.0929 m².",
      },
      {
        question: "How big is an acre?",
        answer:
          "43,560 square feet, or about 4,047 square metres — a little smaller than a standard football pitch.",
      },
      {
        question: "How many acres are in a hectare?",
        answer: "About 2.471. A hectare is 10,000 m², a square 100 metres on each side.",
      },
    ],
  }),

  "volume-converter": unitContent({
    name: "Volume",
    seoTitle: "Volume Converter — Litres, Gallons, Cups, Millilitres",
    seoDescription:
      "Convert volume between litres, millilitres, US and imperial gallons, cups, pints and spoons. US and imperial units are kept separate.",
    intro:
      "Convert volume for cooking, fuel and containers. US and imperial units are listed separately, because they are not the same.",
    units:
      "Factors are defined against the litre; US and imperial units are listed as distinct entries.",
    basis:
      "All volumes convert through the litre, which is exactly 0.001 cubic metres. The cubic units — cubic centimetres, metres, inches and feet — follow from the cubed length factors.",
    extra:
      "The important thing here is that US and imperial units of the same name are different sizes, and mixing them up is a genuine source of ruined recipes and mis-fuelled vehicles. A US gallon is 3.785 litres; an imperial gallon is 4.546 — about 20% larger. A US pint is 473 ml against an imperial 568 ml. Both sets are listed separately and labelled, so you always know which one you are using.",
    formula: {
      expression: "value in target = (value × litres per source unit) ÷ litres per target unit",
      where: [
        "litre — the base unit, exactly 0.001 m³",
        "US gallon — exactly 3.785411784 L",
        "imperial gallon — exactly 4.54609 L",
      ],
    },
    faq: [
      {
        question: "Is a US gallon the same as a UK gallon?",
        answer:
          "No. A US gallon is 3.785 litres and an imperial gallon is 4.546 — roughly 20% larger. Both are listed here so you can pick the right one.",
      },
      {
        question: "How many millilitres are in a cup?",
        answer:
          "A US cup is about 237 ml, a US legal cup (used on nutrition labels) is 240 ml, and a metric cup is 250 ml. Recipes usually mean the 237 ml cup unless they say otherwise.",
      },
      {
        question: "How do I convert a recipe to metric?",
        answer:
          "Convert each volume individually. Bear in mind that dry ingredients measured by volume vary with how tightly they are packed, so weighing them is more reliable.",
      },
    ],
  }),

  "data-storage-converter": unitContent({
    name: "Data",
    seoTitle: "Data Storage Converter — Bytes, MB, GB, GiB, TB",
    seoDescription:
      "Convert data storage between bytes, kilobytes, megabytes, gigabytes and terabytes, with decimal and binary units kept clearly apart.",
    intro:
      "Convert between bytes and terabytes, with the decimal units drive makers use and the binary units your computer reports shown separately.",
    units:
      "Decimal units use powers of 1,000 and binary units powers of 1,024, exactly as the standards define them.",
    basis:
      "There are two families of units here, and confusing them is why a 1 TB drive shows up as 931 GB. Decimal units — kB, MB, GB, TB — step in powers of 1,000 and are what storage manufacturers use. Binary units — KiB, MiB, GiB, TiB — step in powers of 1,024 and are what operating systems actually measure with.",
    extra:
      "The gap widens as the numbers grow: a kilobyte and a kibibyte differ by 2.4%, but a terabyte and a tebibyte differ by nearly 10%. Windows adds to the confusion by displaying binary quantities with decimal labels — what it calls 931 GB is really 931 GiB. Both families are listed here with their correct names so you can see exactly which is which.",
    formula: {
      expression: "1 MB = 1,000² bytes = 1,000,000      1 MiB = 1,024² bytes = 1,048,576",
      where: [
        "byte — the base unit, eight bits",
        "kB, MB, GB, TB — decimal units, powers of 1,000",
        "KiB, MiB, GiB, TiB — binary units, powers of 1,024",
      ],
    },
    example: {
      scenario: "Why a 1 TB drive shows as 931 GB",
      steps: [
        "The manufacturer sells 1 TB = 1,000,000,000,000 bytes.",
        "The operating system divides by 1,024 three times.",
        "1,000,000,000,000 ÷ 1,073,741,824 = 931.32",
      ],
      result: "931 GiB — the same drive, measured with a different sized unit.",
    },
    faq: [
      {
        question: "Why does my 1 TB drive show only 931 GB?",
        answer:
          "The drive really does hold a trillion bytes. Your operating system divides by 1,024 rather than 1,000 at each step, giving 931 gibibytes — the same capacity, a different unit.",
      },
      {
        question: "What is the difference between MB and MiB?",
        answer:
          "A megabyte is 1,000,000 bytes; a mebibyte is 1,048,576. The binary version is about 4.9% larger.",
      },
      {
        question: "How many megabytes are in a gigabyte?",
        answer:
          "1,000 in decimal terms, or 1,024 mebibytes in a gibibyte. Which one is meant depends on who is doing the counting.",
      },
    ],
  }),
};
