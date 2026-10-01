import type { ToolContentExtra } from "@/types/tool";

export const converterExtra: Record<string, ToolContentExtra> = {
  "timezone-meeting-planner": {
    tips: [
      "Plan with the actual meeting date, not today. Countries change their clocks on different dates, so an overlap can move by an hour for a few weeks a year.",
      "When there is no hour that suits everyone, rotate the early or late slot between teams rather than always giving it to the same people.",
      "Write the time zone or city next to every time in the invite, such as 14:00 London / 09:00 New York, so nobody has to convert.",
      "For a recurring meeting, check the overlap again around March and October–November, when clocks change.",
    ],
    faq: [
      {
        question: "What time is it in India when it is 9:00 in London?",
        answer:
          "14:30 in winter, when London is on UTC, and 13:30 in summer, when London moves to British Summer Time. India does not change its clocks and stays at UTC+5:30 all year.",
      },
      {
        question: "When do the clocks change?",
        answer:
          "In the United States, on the second Sunday in March and the first Sunday in November. In the European Union and the UK, on the last Sunday in March and the last Sunday in October. Many countries do not change at all.",
      },
      {
        question: "How do I share the meeting time with everyone?",
        answer:
          "Select an hour to see it in every city, then copy the list of local times into your calendar invite or message.",
      },
    ],
  },

  "shoe-size-converter": {
    tips: [
      "Measure your feet in the evening, when they are at their largest, and use the longer foot.",
      "Compare your foot length with the brand's own size chart before buying; makers can differ by up to a full size.",
      "Between two sizes, choose the larger for shoes worn with thick socks or for long walks.",
      "Remember US men's and women's sizes are different scales; UK and European sizes are the same for everyone.",
    ],
    faq: [
      {
        question: "What size is a 26 cm foot?",
        answer:
          "About UK 7.5, US men's 8.5, US women's 9.5, EU 41 and Japan 26 by the standard relationships. Check the brand's chart, which may differ.",
      },
      {
        question: "What is Mondopoint?",
        answer:
          "A sizing system that states foot length in millimetres. It is used for ski boots and some military and work footwear.",
      },
      {
        question: "Why do my shoes in the same size fit differently?",
        answer:
          "Each maker builds shoes on its own last, the foot-shaped form a shoe is made around, and adds its own allowance for toe room. That is why foot length is a more reliable guide than the size printed inside an old pair.",
      },
    ],
  },

  "engine-cc-to-hp": {
    tips: [
      "For a real engine, use the manufacturer's rated power; any figure from engine size alone is an estimate.",
      "Choose the engine type carefully — turbocharging changes the estimate more than anything else.",
      "Check whether a specification sheet quotes hp, bhp, PS or kW before comparing two engines.",
      "Displacement conversions are exact, so use them freely for cc, litres and cubic inches.",
    ],
    faq: [
      {
        question: "How many cubic inches is a 5.0-litre engine?",
        answer: "About 305 cubic inches: 5,000 cc ÷ 16.387064 = 305.1.",
      },
      {
        question: "How do I convert kW to horsepower?",
        answer:
          "Multiply by about 1.341 for mechanical horsepower. A 100 kW engine produces about 134 hp, or 136 PS.",
      },
      {
        question: "Why is a small turbo engine as powerful as a bigger older one?",
        answer:
          "A turbocharger forces more air into the cylinders, so each litre produces more power. Turbocharged petrol engines typically make 100–160 hp per litre against 70–110 for engines without one.",
      },
    ],
  },

  "currency-converter": {
    tips: [
      "Check the date shown under the result; rates are published once each working day.",
      "Add your provider's margin when budgeting. Banks and card schemes typically charge between 0.5% and 4% over the reference rate.",
      "When paying by card abroad, choose to pay in the local currency if the terminal offers a choice.",
      "For large transfers, compare what each provider actually delivers after fees, not just the rate they show.",
    ],
    faq: [
      {
        question: "What is the mid-market rate?",
        answer:
          "The midpoint between the buying and selling prices of a currency. It is the fairest single figure, and the one retail rates are measured against.",
      },
      {
        question: "Should I pay in my home currency when abroad?",
        answer:
          "Usually not. When a card terminal or cash machine offers to charge you in your home currency, it applies its own exchange rate, which is normally worse than your card issuer's. Choosing the local currency is usually cheaper.",
      },
      {
        question: "Is the amount I type sent anywhere?",
        answer:
          "No. Only the currency codes are used to look up the rate. The amount stays in your browser and the arithmetic happens there.",
      },
    ],
  },

  "length-converter": {
    tips: [
      "For heights in feet and inches, convert everything to inches first: 5 ft 9 in is 69 inches.",
      "Use the nautical mile only for sea and air navigation; it is not the same as a land mile.",
      "Raise the decimal places for engineering work and lower them for everyday measurements.",
      "The inch is exactly 2.54 cm, so conversions between metric and imperial are exact, not approximate.",
    ],
    faq: [
      {
        question: "How many feet are in a metre?",
        answer: "About 3.28084. Going the other way, one foot is exactly 0.3048 metres.",
      },
      {
        question: "How many kilometres are in a mile?",
        answer: "Exactly 1.609344. A 10 km run is about 6.21 miles.",
      },
      {
        question: "How tall is 170 cm in feet and inches?",
        answer: "About 5 ft 7 in: 170 ÷ 2.54 = 66.93 inches, which is 5 feet and 6.93 inches.",
      },
    ],
  },

  "weight-converter": {
    tips: [
      "In the UK, body weight is often given in stones and pounds; one stone is 14 pounds.",
      "Check which ton is meant — metric, US short or UK long — before converting a shipping or freight weight.",
      "Precious metals are weighed in troy ounces, which are heavier than ordinary ounces.",
      "For cooking, weighing ingredients is more accurate than converting cups.",
    ],
    faq: [
      {
        question: "How many ounces are in a pound?",
        answer: "16. One ounce is about 28.35 grams.",
      },
      {
        question: "How many kilograms is 10 stone?",
        answer: "About 63.5 kg: 10 stone is 140 pounds, and 140 × 0.45359237 = 63.50.",
      },
      {
        question: "Is a troy ounce the same as an ordinary ounce?",
        answer:
          "No. A troy ounce, used for gold and silver, is about 31.10 grams. The ordinary avoirdupois ounce used for food and parcels is about 28.35 grams.",
      },
    ],
  },

  "temperature-converter": {
    tips: [
      "Remember temperature needs a shift as well as a scale, so a simple multiplication will be wrong.",
      "Use −40, where Celsius and Fahrenheit agree, as a quick sanity check.",
      "For a rough mental answer, double the Celsius figure and add 30.",
      "Kelvin is written without a degree sign: 300 K, not 300 °K.",
    ],
    faq: [
      {
        question: "What is normal body temperature in Fahrenheit?",
        answer:
          "37 °C is 98.6 °F, the traditional reference figure. Normal temperature varies from person to person and through the day.",
      },
      {
        question: "How do I convert Fahrenheit to Celsius?",
        answer: "Subtract 32, then multiply by 5/9. 350 °F is (350 − 32) × 5 ÷ 9 = 176.7 °C.",
      },
      {
        question: "Should I lower the temperature for a fan oven?",
        answer:
          "Many recipes suggest about 20 °C lower for a fan oven, because moving air cooks faster. Follow the recipe or your oven's manual if they say otherwise.",
      },
    ],
  },

  "time-converter": {
    tips: [
      "Units up to a week are exact; months and years are averages.",
      "For the time between two real dates, use the Age Calculator, which counts calendar days.",
      "On timesheets, remember decimal hours are not minutes: 7.5 hours is 7 hours 30 minutes.",
      "Use seconds or milliseconds when working with computer timestamps.",
    ],
    faq: [
      {
        question: "How do I convert decimal hours to hours and minutes?",
        answer:
          "Multiply the decimal part by 60. 7.75 hours is 7 hours and 0.75 × 60 = 45 minutes.",
      },
      {
        question: "How many weeks are in a year?",
        answer: "About 52.18 on average: 365.2425 days divided by 7. A common year is 52 weeks and one day.",
      },
      {
        question: "How many seconds are in a year?",
        answer:
          "31,536,000 in a 365-day year and 31,622,400 in a leap year. The Gregorian average used here is 31,556,952.",
      },
    ],
  },

  "speed-converter": {
    tips: [
      "Use m/s for physics and engineering, km/h or mph for roads, and knots for wind, sea and air.",
      "To go from m/s to km/h, multiply by 3.6.",
      "Mach depends on air temperature; the value here is for sea level at 15 °C.",
      "Check which unit a speed limit sign uses when driving abroad.",
    ],
    faq: [
      {
        question: "How fast is 100 km/h in mph?",
        answer: "About 62.14 mph.",
      },
      {
        question: "How do I convert m/s to km/h?",
        answer: "Multiply by 3.6. A wind of 10 m/s is 36 km/h.",
      },
      {
        question: "How fast is the speed of sound?",
        answer:
          "About 340.29 m/s, or 1,225 km/h, at sea level and 15 °C. It is slower in colder air, which is why it falls with altitude.",
      },
    ],
  },

  "area-converter": {
    tips: [
      "Area factors are length factors squared: a metre is 3.28 feet, but a square metre is 10.76 square feet.",
      "Measure a room in the same unit throughout before multiplying length by width.",
      "Split L-shaped rooms into rectangles and add the areas together.",
      "Use hectares or acres for land and square metres or square feet for floors.",
    ],
    faq: [
      {
        question: "How do I calculate the area of a room?",
        answer:
          "Multiply the length by the width. For an L-shaped room, divide it into two rectangles, work out each area and add them.",
      },
      {
        question: "How many square feet is 100 square metres?",
        answer: "About 1,076.39 square feet.",
      },
      {
        question: "Why isn't a square metre 3.28 square feet?",
        answer:
          "Because area is two-dimensional. Both sides of a square metre are 3.28 feet long, so its area is 3.28 × 3.28, about 10.76 square feet.",
      },
    ],
  },

  "volume-converter": {
    tips: [
      "Check where a recipe comes from: American recipes use US cups and gallons, British ones imperial pints and gallons.",
      "Weigh dry ingredients such as flour when you can; a cup of flour can vary a lot depending on how it is packed.",
      "A metric teaspoon is 5 ml and a metric tablespoon 15 ml.",
      "Keep US and imperial units apart; a UK pint is about 20% larger than a US pint.",
    ],
    faq: [
      {
        question: "How many millilitres are in a tablespoon?",
        answer:
          "A US tablespoon is about 14.8 ml and a metric tablespoon is 15 ml. Australian recipes use a 20 ml tablespoon.",
      },
      {
        question: "How many fluid ounces are in a litre?",
        answer: "About 33.8 US fluid ounces, or about 35.2 imperial fluid ounces.",
      },
      {
        question: "Is a litre of liquid the same as a kilogram?",
        answer:
          "For water, very nearly. Other liquids differ: a litre of milk is slightly heavier and a litre of cooking oil lighter.",
      },
    ],
  },

  "data-storage-converter": {
    tips: [
      "Check whether a figure is decimal (GB) or binary (GiB) before comparing two numbers.",
      "Divide an internet speed in Mbps by 8 to get the most it can download in MB per second.",
      "Expect the free space on a new device to be lower than the box says; the system takes a share.",
      "RAM is sold in binary units, so 16 GB of memory really is 16 GiB.",
    ],
    faq: [
      {
        question: "How long will a download take?",
        answer:
          "Convert the speed to megabytes per second by dividing by 8, then divide the file size by it. A 50 GB download on a 100 Mbps line takes about 67 minutes at full speed.",
      },
      {
        question: "Why does a Mac show 1 TB when Windows shows 931 GB?",
        answer:
          "macOS counts storage in decimal units, as drive makers do. Windows counts in binary units but labels them GB. Same drive, same bytes.",
      },
      {
        question: "Is a kilobyte 1,000 or 1,024 bytes?",
        answer:
          "Strictly, a kilobyte is 1,000 bytes and a kibibyte is 1,024. In everyday use both meanings still appear, which is why this converter lists them separately.",
      },
    ],
  },
};
