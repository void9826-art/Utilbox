import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-03";

export const healthHomeUnitsGuides: Guide[] = [
  {
    slug: "healthy-weight-for-my-height",
    topic: "Calculations",
    title: "What is a healthy weight for my height?",
    seoTitle: "Healthy Weight for My Height: Chart in kg and lb",
    description:
      "The healthy weight range for your height in kilograms and pounds, how it is worked out from BMI, and why it is a range rather than a single ideal number.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["bmi-calculator", "weight-converter", "length-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            There is no single ideal weight for a given height. Health guidance uses a range, based on body mass
            index (BMI), within which weight-related health risks are lowest for most adults. Knowing your range is
            more useful than chasing one number, and it is easy to work out.
          </p>

          <h2>Healthy weight ranges by height</h2>
          <p>These ranges correspond to a BMI of 18.5 to 24.9, the standard adult healthy range.</p>
          <table>
            <thead>
              <tr>
                <th>Height</th>
                <th>Kilograms</th>
                <th>Pounds</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>152 cm (5 ft 0)</td>
                <td>43–58</td>
                <td>95–127</td>
              </tr>
              <tr>
                <td>160 cm (5 ft 3)</td>
                <td>47–64</td>
                <td>104–141</td>
              </tr>
              <tr>
                <td>168 cm (5 ft 6)</td>
                <td>52–70</td>
                <td>115–154</td>
              </tr>
              <tr>
                <td>170 cm (5 ft 7)</td>
                <td>53–72</td>
                <td>118–159</td>
              </tr>
              <tr>
                <td>175 cm (5 ft 9)</td>
                <td>57–76</td>
                <td>125–168</td>
              </tr>
              <tr>
                <td>183 cm (6 ft 0)</td>
                <td>62–83</td>
                <td>136–184</td>
              </tr>
            </tbody>
          </table>
          <p>
            For your exact height, the <Link href="/calculators/bmi-calculator">BMI Calculator</Link> shows the
            healthy weight range alongside your BMI, in metric or imperial units.
          </p>

          <h2>How the range is calculated</h2>
          <p>
            BMI is weight in kilograms divided by height in metres squared. Turning that around, weight = BMI ×
            height². For 1.70 m: 18.5 × 1.70² = 53.5 kg at the bottom of the range, and 24.9 × 1.70² = 72.0 kg at
            the top. The range is wide because people of the same height differ in frame, muscle and build.
          </p>

          <h2>Why a range, not a target</h2>
          <ul>
            <li>
              <strong>Build:</strong> a broad-shouldered person with a heavy frame sits naturally higher in the
              range than a slight one.
            </li>
            <li>
              <strong>Muscle:</strong> muscle is denser than fat. Athletes can have a BMI above 25 with little body
              fat.
            </li>
            <li>
              <strong>Age:</strong> some research suggests slightly higher weights carry little extra risk in older
              adults, while being underweight carries more.
            </li>
            <li>
              <strong>Ethnicity:</strong> for people of South Asian, Chinese and some other backgrounds, health risks
              start at a lower BMI. See{" "}
              <Link href="/guides/bmi-cut-offs-for-asian-adults">BMI cut-offs for Asian adults</Link>.
            </li>
          </ul>

          <h2>Better together: waist measurement</h2>
          <p>
            Fat around the middle is more closely linked to heart disease and diabetes than total weight. A simple
            check used in UK guidance is the waist-to-height ratio: your waist should be less than half your
            height. Measure around the middle, halfway between the bottom of the ribs and the top of the hips. At
            170 cm tall, that means a waist under 85 cm.
          </p>

          <h2>Converting units</h2>
          <p>
            If your scale shows stones or pounds and the chart is in kilograms, use the{" "}
            <Link href="/converters/weight-converter">Weight Converter</Link>. For heights in feet and inches, the{" "}
            <Link href="/converters/length-converter">Length Converter</Link> gives centimetres, and the guide to{" "}
            <Link href="/guides/height-in-feet-and-centimetres">height in feet and centimetres</Link> has a table.
          </p>

          <h2>Not for children or pregnancy</h2>
          <p>
            Adult BMI ranges do not apply to children and teenagers, who are assessed with age- and sex-specific
            growth charts, or during pregnancy. For anyone with a medical condition, a health professional&apos;s
            advice should come before any chart. For what BMI does and does not tell you, see{" "}
            <Link href="/guides/what-your-bmi-means">what your BMI means</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "bmi-cut-offs-for-asian-adults",
    topic: "Calculations",
    title: "BMI cut-offs for Asian adults: why 23 matters",
    seoTitle: "BMI Cut-Offs for Asian and South Asian Adults",
    description:
      "For people of South Asian, Chinese and other Asian backgrounds, health risks rise at a lower BMI. The 23 and 27.5 cut-offs, their origin and how to use them.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["bmi-calculator", "weight-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            The standard BMI categories, with overweight starting at 25 and obesity at 30, were developed largely
            from data on people of European descent. For many people of Asian descent, the risk of type 2 diabetes
            and heart disease starts rising at a noticeably lower BMI. Several health bodies therefore recommend
            lower cut-offs.
          </p>

          <h2>The lower thresholds</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Standard</th>
                <th>Asian</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Healthy</td>
                <td>18.5–24.9</td>
                <td>18.5–22.9</td>
              </tr>
              <tr>
                <td>Overweight / increased risk</td>
                <td>25–29.9</td>
                <td>23–27.4</td>
              </tr>
              <tr>
                <td>Obesity / high risk</td>
                <td>30 and over</td>
                <td>27.5 and over</td>
              </tr>
            </tbody>
          </table>
          <p>
            A World Health Organization expert consultation in 2004 identified 23 and 27.5 as public health action
            points for Asian populations. UK guidance from NICE uses 23 and 27.5 for people of South Asian, Chinese,
            other Asian, Middle Eastern, Black African or African-Caribbean family background. Indian consensus
            guidelines go further and treat a BMI of 25 or more as obesity.
          </p>

          <h2>What it means in practice</h2>
          <p>
            Take someone 170 cm tall weighing 70 kg. Their BMI is 24.2. On the standard chart they are in the
            healthy range. On the lower cut-offs, they are in the increased-risk band. For a 170 cm adult, the upper
            end of the healthy range on the lower cut-offs is about 66 kg rather than 72 kg.
          </p>

          <h2>Use the calculator with the right thresholds</h2>
          <ol>
            <li>
              Enter your height and weight in the <Link href="/calculators/bmi-calculator">BMI Calculator</Link>.
            </li>
            <li>Note the BMI number itself. The calculation is the same for everyone.</li>
            <li>
              Compare the number with the lower cut-offs above rather than the standard category label if they apply
              to you.
            </li>
          </ol>

          <h2>Why the risk differs</h2>
          <p>
            Research suggests that, at the same BMI, many people of South Asian descent carry more body fat and more
            of it around the abdomen and internal organs than people of European descent. That visceral fat is
            linked to insulin resistance. It is a population pattern, not a rule for every individual.
          </p>

          <h2>Waist size is especially useful</h2>
          <p>
            Because the concern is fat around the middle, waist measurement adds a lot of information. Indian and
            International Diabetes Federation guidance for South Asian adults uses waist thresholds of about 90 cm
            for men and 80 cm for women. A waist-to-height ratio under 0.5, meaning a waist less than half your
            height, is a simple check that works across backgrounds.
          </p>

          <h2>What to do with the result</h2>
          <ul>
            <li>
              A BMI in the 23–27.5 band is a reason to pay attention, not to panic. Small, sustained changes in diet
              and activity reduce risk.
            </li>
            <li>
              Ask about a diabetes check, such as an HbA1c blood test, especially with a family history or a large
              waist.
            </li>
            <li>Muscle still counts: a very muscular person may have a high BMI with low risk.</li>
          </ul>
          <p>
            For the standard ranges and what BMI misses, see{" "}
            <Link href="/guides/what-your-bmi-means">what your BMI means</Link>. For weight ranges by height, see{" "}
            <Link href="/guides/healthy-weight-for-my-height">healthy weight for my height</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "fever-temperature-celsius-fahrenheit",
    topic: "Calculations",
    title: "Fever temperatures in Celsius and Fahrenheit",
    seoTitle: "Fever Temperature Chart: Celsius and Fahrenheit",
    description:
      "Is 37.8 °C a fever? What is 101 °F in Celsius? A body temperature conversion chart, where a fever starts, and how the thermometer site changes the reading.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["temperature-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            Thermometers, medicine leaflets and health advice do not always use the same scale. A parent reading
            101 °F on a thermometer bought abroad, or a leaflet that says to seek help above 39 °C, needs a quick
            conversion. This guide gives the body-temperature range in both scales.
          </p>

          <h2>Body temperature chart</h2>
          <table>
            <thead>
              <tr>
                <th>°C</th>
                <th>°F</th>
                <th>Usually means</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>35.0</td>
                <td>95.0</td>
                <td>Low: hypothermia threshold</td>
              </tr>
              <tr>
                <td>36.5</td>
                <td>97.7</td>
                <td>Normal</td>
              </tr>
              <tr>
                <td>37.0</td>
                <td>98.6</td>
                <td>Normal</td>
              </tr>
              <tr>
                <td>37.5</td>
                <td>99.5</td>
                <td>Upper normal</td>
              </tr>
              <tr>
                <td>38.0</td>
                <td>100.4</td>
                <td>Fever</td>
              </tr>
              <tr>
                <td>38.5</td>
                <td>101.3</td>
                <td>Fever</td>
              </tr>
              <tr>
                <td>39.0</td>
                <td>102.2</td>
                <td>High fever</td>
              </tr>
              <tr>
                <td>40.0</td>
                <td>104.0</td>
                <td>Very high fever</td>
              </tr>
              <tr>
                <td>41.0</td>
                <td>105.8</td>
                <td>Dangerously high</td>
              </tr>
            </tbody>
          </table>
          <p>
            For any other value, use the <Link href="/converters/temperature-converter">Temperature Converter</Link>,
            which shows Celsius, Fahrenheit and Kelvin side by side.
          </p>

          <h2>Where a fever starts</h2>
          <p>
            A temperature of 38.0 °C (100.4 °F) or above is the threshold most health services use for a fever.
            Normal body temperature is not exactly 37 °C for everyone; it varies from person to person, rises
            slightly in the evening, and is often a little higher in young children.
          </p>

          <h2>The thermometer site matters</h2>
          <ul>
            <li>
              <strong>Rectal and ear readings</strong> tend to run a little higher than mouth readings.
            </li>
            <li>
              <strong>Armpit readings</strong> tend to run lower, so a normal-looking armpit reading may hide a mild
              fever.
            </li>
            <li>
              <strong>Forehead scanners</strong> are convenient but more easily affected by sweat, sun and drafts.
            </li>
          </ul>
          <p>Take a second reading if the first seems surprising, and use the same method each time.</p>

          <h2>The conversion formulas</h2>
          <ul>
            <li>°F = °C × 9 ÷ 5 + 32. So 38 × 1.8 = 68.4, plus 32 = 100.4 °F.</li>
            <li>°C = (°F − 32) × 5 ÷ 9. So (102 − 32) = 70, × 5 ÷ 9 = 38.9 °C.</li>
          </ul>
          <p>
            Around body temperature, a quick check: each 1 °C is 1.8 °F, so half a degree Celsius is 0.9 °F.
          </p>

          <h2>Reading a thermometer bought abroad</h2>
          <p>
            Many digital thermometers can switch between °C and °F, usually by holding the power button for a few
            seconds while the thermometer is off; the manual will say. If yours cannot, keep a copy of the chart
            above with it. When writing temperatures down for a doctor, note the scale and the measurement site,
            such as &ldquo;38.4 °C, under the tongue, 9 pm&rdquo;, along with the time and any medicine given, since
            fever reducers lower the reading for several hours.
          </p>

          <h2>When to get medical advice</h2>
          <p>
            This page is a conversion aid, not medical advice. Health services generally advise getting help
            promptly for a fever in a baby under three months, a very high temperature, a fever with a rash that
            does not fade when pressed, stiff neck, confusion, difficulty breathing, or a fever that lasts several
            days. Follow the guidance of your local health service and call emergency services if someone seems
            seriously unwell.
          </p>

          <h2>Converting other temperatures</h2>
          <p>
            For cooking and oven settings, see{" "}
            <Link href="/guides/recipe-conversions-cups-grams-oven">recipe conversions and oven temperatures</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "knots-to-mph-and-kmh",
    topic: "Calculations",
    title: "Knots to mph and km/h: how fast is a knot?",
    seoTitle: "Knots to mph and km/h: How Fast Is a Knot?",
    description:
      "One knot is one nautical mile per hour: 1.852 km/h or about 1.15 mph. A conversion table for boats, planes and wind, and why sailors and pilots still use knots.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["speed-converter", "length-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            Weather forecasts for sailors, flight-tracking apps and boat specifications give speeds in knots. If you
            think in miles or kilometres per hour, the numbers can be misleading: a 30-knot wind is stronger than
            &ldquo;30&rdquo; sounds.
          </p>

          <h2>The conversion</h2>
          <ul>
            <li>1 knot = 1 nautical mile per hour</li>
            <li>1 knot = 1.852 km/h (exactly)</li>
            <li>1 knot ≈ 1.151 mph</li>
            <li>1 knot ≈ 0.514 m/s</li>
          </ul>
          <table>
            <thead>
              <tr>
                <th>Knots</th>
                <th>km/h</th>
                <th>mph</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>5</td>
                <td>9.3</td>
                <td>5.8</td>
              </tr>
              <tr>
                <td>10</td>
                <td>18.5</td>
                <td>11.5</td>
              </tr>
              <tr>
                <td>20</td>
                <td>37.0</td>
                <td>23.0</td>
              </tr>
              <tr>
                <td>30</td>
                <td>55.6</td>
                <td>34.5</td>
              </tr>
              <tr>
                <td>50</td>
                <td>92.6</td>
                <td>57.5</td>
              </tr>
              <tr>
                <td>100</td>
                <td>185.2</td>
                <td>115.1</td>
              </tr>
              <tr>
                <td>450</td>
                <td>833.4</td>
                <td>517.9</td>
              </tr>
            </tbody>
          </table>
          <p>
            The <Link href="/converters/speed-converter">Speed Converter</Link> converts between knots, km/h, mph,
            metres per second and feet per second in both directions.
          </p>

          <h2>Quick mental maths</h2>
          <ul>
            <li>Knots to km/h: double it and take off about 7%. 20 knots → 40 − 3 = 37 km/h.</li>
            <li>Knots to mph: add 15%. 20 knots → 20 + 3 = 23 mph.</li>
          </ul>

          <h2>What is a nautical mile?</h2>
          <p>
            A nautical mile is 1,852 metres, longer than a land mile of 1,609 metres. It was originally based on one
            minute of latitude, one sixtieth of a degree, which makes it convenient for navigation with charts: a
            distance measured on the latitude scale at the side of a chart reads directly in nautical miles. The{" "}
            <Link href="/converters/length-converter">Length Converter</Link> includes nautical miles.
          </p>

          <h2>Why knots are still used</h2>
          <p>
            Ships and aircraft navigate across the globe using latitude and longitude, so a unit tied to the shape of
            the Earth remains practical. Air traffic control, aviation weather and marine forecasts use knots
            internationally, which keeps everyone on the same scale. The name comes from an old method of measuring
            a ship&apos;s speed: a line with knots tied at regular intervals was let out behind the ship, and the
            knots passing in a set time were counted.
          </p>

          <h2>Knots in weather forecasts</h2>
          <p>
            Marine and aviation forecasts give wind in knots. As a rough feel: under 10 knots is light, 11–21 knots
            is a moderate to fresh breeze, 22–33 knots is strong, and 34 knots and above is gale force. For small
            boats and paddleboards, conditions above about 15 knots are demanding for beginners. Always use the
            official marine forecast for decisions about going out.
          </p>

          <h2>Knots, nautical miles and fuel</h2>
          <p>
            Because a knot is a nautical mile per hour, journey times are easy: a boat at 6 knots covers 30 nautical
            miles in 5 hours. Boat fuel use is often quoted in litres or gallons per hour, so a passage plan is
            distance ÷ speed for the time, then time × consumption for the fuel, plus a generous reserve for tides,
            headwinds and detours.
          </p>

          <h2>Aircraft speeds</h2>
          <p>
            A typical airliner cruises at around 450–500 knots of true airspeed, roughly 830–930 km/h. Speeds shown
            on flight trackers are often ground speed, which includes the wind: a strong tailwind from the jet
            stream can push ground speed well past 600 knots.
          </p>
        </>
      );
    },
  },

  {
    slug: "mpg-to-litres-per-100km",
    topic: "Calculations",
    title: "How to convert mpg to litres per 100 km (and back)",
    seoTitle: "MPG to L/100km Conversion: US and UK Gallons",
    description:
      "Convert fuel economy between US mpg, UK mpg, litres per 100 km and km per litre, with tables, formulas, and why US and UK figures differ for the same car.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["volume-converter", "length-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            A car review from the US says 30 mpg, a British one says 36 mpg, and the European brochure says 7.8
            litres per 100 km. They may all describe the same car. Fuel economy units differ in two ways: the
            gallon itself is a different size in the US and UK, and Europe measures fuel used per distance rather
            than distance per fuel.
          </p>

          <h2>Conversion table</h2>
          <p>Litres per 100 km for each mpg figure, using US gallons and UK gallons:</p>
          <table>
            <thead>
              <tr>
                <th>mpg</th>
                <th>US</th>
                <th>UK</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>20</td>
                <td>11.8</td>
                <td>14.1</td>
              </tr>
              <tr>
                <td>25</td>
                <td>9.4</td>
                <td>11.3</td>
              </tr>
              <tr>
                <td>30</td>
                <td>7.8</td>
                <td>9.4</td>
              </tr>
              <tr>
                <td>40</td>
                <td>5.9</td>
                <td>7.1</td>
              </tr>
              <tr>
                <td>50</td>
                <td>4.7</td>
                <td>5.6</td>
              </tr>
            </tbody>
          </table>

          <h2>The formulas</h2>
          <ul>
            <li>L/100 km = 235.21 ÷ US mpg</li>
            <li>L/100 km = 282.48 ÷ UK mpg</li>
            <li>The same formulas work in reverse: US mpg = 235.21 ÷ L/100 km.</li>
            <li>UK mpg = US mpg × 1.201</li>
            <li>km per litre = 100 ÷ L/100 km</li>
          </ul>
          <p>
            Example: a car using 7 litres per 100 km does 235.21 ÷ 7 = 33.6 US mpg, or 40.4 UK mpg, or 14.3 km per
            litre.
          </p>

          <h2>Why the US and UK numbers differ</h2>
          <p>
            A US gallon is 3.785 litres. A UK (imperial) gallon is 4.546 litres, about 20% bigger. A car goes further
            on the bigger gallon, so its UK mpg figure is about 20% higher than its US one. Neither car is more
            efficient; the units are different. The <Link href="/converters/volume-converter">Volume Converter</Link>{" "}
            keeps US and imperial gallons separate for this reason.
          </p>

          <h2>Why L/100 km runs backwards</h2>
          <p>
            Miles per gallon is distance per fuel, so higher is better. Litres per 100 km is fuel per distance, so
            lower is better. The L/100 km figure is more useful for working out costs: if you drive 15,000 km a year
            at 7 L/100 km, you use 150 × 7 = 1,050 litres, and multiplying by the price per litre gives the annual
            fuel bill.
          </p>
          <p>
            It also shows real savings more honestly. Going from 15 to 20 mpg saves more fuel over the same distance
            than going from 40 to 50 mpg, even though the second change looks bigger.
          </p>

          <h2>km per litre</h2>
          <p>
            India and some other countries quote kilometres per litre. 15 km/L is 6.7 L/100 km, about 35 US mpg or
            42 UK mpg. Higher is better, like mpg.
          </p>

          <h2>Working out your own figure</h2>
          <p>
            Fill the tank to the brim, reset the trip counter, and drive normally. At the next fill-up, fill to the
            brim again and note the litres or gallons added. Divide the distance by the fuel for km per litre or mpg,
            or divide the fuel by the distance and multiply by 100 for L/100 km. Averaging over two or three tanks
            evens out how full the pump left it.
          </p>

          <h2>Official versus real-world figures</h2>
          <p>
            Brochure figures come from standardised laboratory tests and are usually better than real-world driving,
            especially in cold weather, short trips and at motorway speeds. Compare cars using the same test, and
            expect your own figure to be somewhat worse.
          </p>
          <p>
            For distance conversions between miles and kilometres, use the{" "}
            <Link href="/converters/length-converter">Length Converter</Link>. For electric cars, see{" "}
            <Link href="/guides/ev-charging-cost">how much it costs to charge an electric car</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "mbps-vs-megabytes-per-second",
    topic: "Calculations",
    title: "Mbps vs MB/s: how fast will my download really be?",
    seoTitle: "Mbps vs MB/s: How Long Will a Download Take?",
    description:
      "A 100 Mbps connection downloads at about 12.5 megabytes per second, not 100. Bits versus bytes, download time tables, and why real speeds come in a little lower.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["data-storage-converter", "time-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            You pay for a 100 Mbps connection, start a download, and the browser shows 11 MB/s. Nothing is wrong.
            Internet speeds are measured in megabits per second (Mbps, small b) and file sizes in megabytes (MB,
            capital B). A byte is eight bits, so 100 megabits per second moves at most 12.5 megabytes per second.
          </p>

          <h2>The conversion</h2>
          <p>MB/s = Mbps ÷ 8</p>
          <table>
            <thead>
              <tr>
                <th>Plan</th>
                <th>Max MB/s</th>
                <th>5 GB download</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>10 Mbps</td>
                <td>1.25</td>
                <td>about 67 min</td>
              </tr>
              <tr>
                <td>50 Mbps</td>
                <td>6.25</td>
                <td>about 13 min</td>
              </tr>
              <tr>
                <td>100 Mbps</td>
                <td>12.5</td>
                <td>about 6 min 40 s</td>
              </tr>
              <tr>
                <td>300 Mbps</td>
                <td>37.5</td>
                <td>about 2 min 13 s</td>
              </tr>
              <tr>
                <td>1 Gbps</td>
                <td>125</td>
                <td>about 40 s</td>
              </tr>
            </tbody>
          </table>
          <p>
            Times are the theoretical best for a 5 GB file (5,000 MB). Real downloads take a little longer.
          </p>

          <h2>Work out any download time</h2>
          <ol>
            <li>Convert the file size to megabytes. 5 GB = 5,000 MB in decimal units.</li>
            <li>Divide your speed in Mbps by 8 to get MB/s.</li>
            <li>Divide the file size by MB/s to get seconds.</li>
            <li>
              Convert seconds to minutes or hours with the <Link href="/converters/time-converter">Time Converter</Link>.
            </li>
          </ol>
          <p>
            The <Link href="/converters/data-storage-converter">Data Storage Converter</Link> converts between bits,
            bytes, megabytes and gigabytes, with decimal units (MB, GB) and binary units (MiB, GiB) kept separate.
          </p>

          <h2>Why real speeds are lower</h2>
          <ul>
            <li>
              <strong>Protocol overhead:</strong> some of every packet is addressing and error checking rather than
              your file, which typically costs a few percent.
            </li>
            <li>
              <strong>Wi-Fi:</strong> distance, walls and interference from neighbours often limit speed more than
              the broadband line. Test on a cable to see what the line itself delivers.
            </li>
            <li>
              <strong>The other end:</strong> a busy server may send more slowly than your connection can receive.
            </li>
            <li>
              <strong>Shared use:</strong> streaming and updates on other devices share the same connection.
            </li>
          </ul>

          <h2>What speed do you actually need?</h2>
          <p>
            Streaming one HD video uses a few megabits per second, and a 4K stream several times that. Video calls
            need less but are sensitive to upload speed and to delay. A household&apos;s need is roughly the sum of
            what everyone does at the busiest time of day. Beyond that, extra speed mainly shortens large
            downloads, such as games and system updates, which the table above lets you put in minutes.
          </p>

          <h2>Upload is often slower</h2>
          <p>
            Many home connections are asymmetric: 100 Mbps down but perhaps 10–20 Mbps up. Uploading large videos or
            backups takes much longer than downloading them. Check the upload figure in your plan or a speed test if
            you work with large files.
          </p>

          <h2>GB versus GiB</h2>
          <p>
            Operating systems sometimes report sizes in binary units, where a gigabyte means 1,024 × 1,024 × 1,024
            bytes. A file shown as 4.66 GB in some programs is 5 GB in decimal units. For download estimates, the
            difference is about 7% at gigabyte scale. The full explanation is in{" "}
            <Link href="/guides/why-1tb-drive-shows-931gb">why a 1 TB drive shows 931 GB</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "room-size-square-feet-to-square-metres",
    topic: "Calculations",
    title: "How to measure a room in square feet and square metres",
    seoTitle: "Room Size: Square Feet to Square Metres",
    description:
      "Measure a room's floor area, convert between square feet and square metres, handle L-shaped rooms, and add the right allowance when buying flooring.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["area-converter", "length-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            Flooring is sold by the square metre in some shops and by the square foot in others. Property listings
            mix the two. Measuring a room once and converting carefully saves both money and a second trip to the
            shop.
          </p>

          <h2>Measure the floor</h2>
          <ol>
            <li>Measure the length and the width at floor level, wall to wall, in the same unit.</li>
            <li>Measure twice; rooms are rarely perfectly square, so use the larger figure.</li>
            <li>Multiply length by width.</li>
          </ol>
          <p>
            A room 12 ft by 14 ft is 168 square feet. A room 4 m by 5 m is 20 square metres. If you measured in feet
            and inches, convert the inches to a decimal first: 12 ft 6 in is 12.5 ft.
          </p>

          <h2>Convert the area</h2>
          <ul>
            <li>1 square metre = 10.764 square feet</li>
            <li>1 square foot = 0.0929 square metres</li>
          </ul>
          <p>
            So 168 sq ft = 15.6 m², and 20 m² = 215.3 sq ft. The{" "}
            <Link href="/converters/area-converter">Area Converter</Link> handles square metres, square feet, square
            yards, acres and hectares.
          </p>

          <h2>The most common mistake</h2>
          <p>
            Converting the lengths with a linear factor and then forgetting to square it. A metre is 3.28 feet, but a
            square metre is 3.28 × 3.28 = 10.76 square feet, not 3.28. Either convert both sides first and then
            multiply, or multiply first and use an area conversion. The{" "}
            <Link href="/converters/length-converter">Length Converter</Link> does the first approach; the Area
            Converter the second.
          </p>
          <p>
            Also watch the phrasing: &ldquo;10 feet square&rdquo; describes a square 10 feet on each side, which is
            100 square feet, while &ldquo;10 square feet&rdquo; is a small area about the size of a doormat or two.
          </p>

          <h2>L-shaped and irregular rooms</h2>
          <p>
            Split the room into rectangles, measure each, and add them up. For an L-shaped room, one rectangle for
            the main part and one for the leg. Subtract fixed units such as kitchen cabinets or a built-in bath if
            the flooring will not go under them.
          </p>

          <h2>How much flooring to buy</h2>
          <ul>
            <li>
              <strong>Straight-laid floors:</strong> add about 10% for cutting and waste.
            </li>
            <li>
              <strong>Diagonal or herringbone patterns:</strong> add 15% or more, because more pieces are cut at the
              edges.
            </li>
            <li>
              <strong>Round up to whole packs</strong>, and keep a spare pack from the same batch for future repairs.
            </li>
          </ul>
          <p>Example: 15.6 m² plus 10% = 17.2 m². If packs cover 2.2 m² each, buy 8 packs (17.6 m²).</p>

          <h2>Property listings</h2>
          <p>
            Advertised floor areas may be measured differently: some include internal walls and stairwells, others
            only usable floor. Different countries and agents use different rules, so compare like with like and
            measure yourself before relying on a figure for pricing.
          </p>
          <p>
            For walls rather than floors, see <Link href="/guides/how-much-paint-do-i-need">how much paint you need</Link>{" "}
            and <Link href="/guides/how-many-rolls-of-wallpaper">how many rolls of wallpaper</Link>. For land
            areas, see <Link href="/guides/acres-hectares-and-land-units">acres, hectares and land units</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-many-rolls-of-wallpaper",
    topic: "Calculations",
    title: "How many rolls of wallpaper do I need?",
    seoTitle: "How Many Rolls of Wallpaper Do I Need?",
    description:
      "Count wallpaper the way decorators do: by drops, not by area. A worked example, how pattern repeat changes the answer, and why to buy from one batch.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["paint-coverage-calculator", "length-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            Dividing the wall area by the area of a roll gives the wrong answer for wallpaper. Each roll is cut into
            full-height strips, called drops, and the leftover at the end of a roll is often too short to use. The
            reliable method counts drops.
          </p>

          <h2>The drop method</h2>
          <ol>
            <li>
              <strong>Measure the perimeter</strong> of the room: add the lengths of all walls you will paper.
            </li>
            <li>
              <strong>Drops needed</strong> = perimeter ÷ roll width, rounded up.
            </li>
            <li>
              <strong>Drop length</strong> = wall height + pattern repeat + trimming allowance (about 10 cm).
            </li>
            <li>
              <strong>Drops per roll</strong> = roll length ÷ drop length, rounded down.
            </li>
            <li>
              <strong>Rolls</strong> = drops needed ÷ drops per roll, rounded up.
            </li>
          </ol>

          <h2>Worked example</h2>
          <p>
            A room 4 m by 3.5 m has a perimeter of 15 m. Walls are 2.4 m high. A standard European roll is 10.05 m
            long and 53 cm wide.
          </p>
          <ul>
            <li>Drops needed: 15 ÷ 0.53 = 28.3, so 29 drops.</li>
            <li>Plain paper, no pattern repeat: drop length 2.4 + 0.1 = 2.5 m, so 4 drops per roll.</li>
            <li>Rolls: 29 ÷ 4 = 7.25, so 8 rolls.</li>
          </ul>
          <p>
            With a 53 cm pattern repeat, each drop needs 3.03 m, only 3 fit on a roll, and you need 10 rolls. Pattern
            repeat changes the answer more than anything else.
          </p>

          <h2>Let the calculator do it</h2>
          <p>
            The <Link href="/calculators/paint-coverage-calculator">Paint and Wallpaper Calculator</Link> has a
            wallpaper mode. Enter the room size, wall height, roll width and length, pattern repeat and trim, and it
            shows the drop length, drops per roll, drops needed and rolls to buy, in metric or US and imperial units.
          </p>

          <h2>Doors and windows</h2>
          <p>
            Decorators usually count the full perimeter and do not subtract doors and windows. The short pieces
            needed above and below them still use up drops, and the spare paper covers mistakes. For a room with a
            very large window or patio door, you can subtract it, but keep a margin.
          </p>

          <h2>Read the label</h2>
          <ul>
            <li>
              <strong>Roll size:</strong> European rolls are commonly 10.05 m × 53 cm. American rolls vary and are
              often sold as double rolls. Use the dimensions on the label.
            </li>
            <li>
              <strong>Pattern repeat and match:</strong> a straight match lines up across the same height; an offset
              or drop match shifts by half a repeat, which can waste more.
            </li>
            <li>
              <strong>Batch number:</strong> colours vary slightly between print runs. Buy all rolls from the same
              batch, and buy one extra, because a matching roll may not be available later.
            </li>
          </ul>

          <h2>Feature walls</h2>
          <p>
            For a single wall, the perimeter is just that wall&apos;s width. A 3.6 m wall needs 7 drops of 53 cm
            paper. With 4 drops per roll, that is 2 rolls; with a large pattern repeat, possibly 3.
          </p>
          <p>
            For painting the other walls, see <Link href="/guides/how-much-paint-do-i-need">how much paint you need</Link>.
            For converting between feet and metres, use the <Link href="/converters/length-converter">Length Converter</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "degrees-vs-radians-on-a-calculator",
    topic: "Calculations",
    title: "Why sin(30) gives −0.988: degrees vs radians on a calculator",
    seoTitle: "Degrees vs Radians: Why Your Calculator Is Wrong",
    description:
      "If sin(30) does not give 0.5, your calculator is in radian mode. How to tell, how to switch, how to convert between degrees and radians, and when to use each.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["scientific-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            You type sin(30) expecting 0.5 and the calculator says −0.988. Or cos(60) gives −0.952 instead of 0.5.
            The calculator is not broken: it is measuring angles in radians, and 30 radians is a very different
            angle from 30 degrees.
          </p>

          <h2>Two ways to measure an angle</h2>
          <ul>
            <li>
              <strong>Degrees:</strong> a full turn is 360°. Used in everyday geometry, navigation and most school
              problems.
            </li>
            <li>
              <strong>Radians:</strong> a full turn is 2π, about 6.283. Used in calculus, physics and programming,
              because the formulas are simpler in radians.
            </li>
          </ul>
          <p>
            180° = π radians. So 30° is π ÷ 6, about 0.524 radians, while 30 radians is almost five full turns, which
            lands at an angle whose sine is −0.988.
          </p>

          <h2>How to tell which mode you are in</h2>
          <p>
            Test with a known value: sin(90) should be 1 in degrees. If you get 0.894, you are in radians. Most
            calculators show DEG or RAD on the display. The{" "}
            <Link href="/calculators/scientific-calculator">Scientific Calculator</Link> has DEG and RAD buttons; the
            highlighted one is active.
          </p>

          <h2>Converting</h2>
          <ul>
            <li>Degrees to radians: multiply by π ÷ 180. 45° × π ÷ 180 = 0.785.</li>
            <li>Radians to degrees: multiply by 180 ÷ π. 1 radian ≈ 57.3°.</li>
          </ul>
          <table>
            <thead>
              <tr>
                <th>Degrees</th>
                <th>Radians</th>
                <th>sin</th>
                <th>cos</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0°</td>
                <td>0</td>
                <td>0</td>
                <td>1</td>
              </tr>
              <tr>
                <td>30°</td>
                <td>π/6</td>
                <td>0.5</td>
                <td>0.866</td>
              </tr>
              <tr>
                <td>45°</td>
                <td>π/4</td>
                <td>0.707</td>
                <td>0.707</td>
              </tr>
              <tr>
                <td>60°</td>
                <td>π/3</td>
                <td>0.866</td>
                <td>0.5</td>
              </tr>
              <tr>
                <td>90°</td>
                <td>π/2</td>
                <td>1</td>
                <td>0</td>
              </tr>
              <tr>
                <td>180°</td>
                <td>π</td>
                <td>0</td>
                <td>−1</td>
              </tr>
            </tbody>
          </table>

          <h2>Gradians</h2>
          <p>
            Some calculators have a third mode, GRAD or gradians, where a right angle is 100 and a full turn 400. It
            is used in some surveying work and almost nowhere else. If a calculator shows GRAD, switch it to DEG or
            RAD before doing anything else; sin(30) in gradians gives about 0.454, another plausible-looking wrong
            answer.
          </p>

          <h2>Inverse functions too</h2>
          <p>
            asin, acos and atan return an angle, in whichever mode is active. asin(0.5) gives 30 in degree mode and
            0.524 in radian mode. If an answer looks far too small, check the mode before reworking the problem.
          </p>

          <h2>Exams and homework</h2>
          <ul>
            <li>
              If the question uses the degree symbol or comes from geometry, surveying or navigation, use degrees.
            </li>
            <li>
              If angles are written with π, or the work involves calculus, oscillations or circular motion, use
              radians.
            </li>
            <li>Check the mode before every exam. It is one of the most common causes of lost marks.</li>
          </ul>

          <h2>In spreadsheets and code</h2>
          <p>
            Excel, Google Sheets and nearly every programming language expect radians. In a spreadsheet,{" "}
            <code>=SIN(RADIANS(30))</code> returns 0.5, and <code>=DEGREES(PI())</code> returns 180. In JavaScript,
            Python and similar languages, convert with angle × Math.PI ÷ 180 before calling sin or cos.
          </p>
          <p>
            For the order in which a calculator evaluates longer expressions, see{" "}
            <Link href="/guides/order-of-operations-calculator">order of operations explained</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "est-edt-utc-gmt-explained",
    topic: "Calculations",
    title: "EST vs EDT, GMT vs UTC: time zone abbreviations explained",
    seoTitle: "EST vs EDT, GMT vs UTC: Time Zones Explained",
    description:
      "EST is not the same as EDT, and GMT is not quite UTC. What common time zone abbreviations mean, when daylight saving changes them, and how to avoid missed calls.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["timezone-meeting-planner", "timestamp-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            A meeting invite says 10:00 EST in July. Technically, Eastern Standard Time is not in use in July; New
            York is on Eastern Daylight Time. Most people mean &ldquo;New York time&rdquo; either way, but the
            mix-up causes hour-off errors whenever someone converts the abbreviation literally.
          </p>

          <h2>Common abbreviations</h2>
          <table>
            <thead>
              <tr>
                <th>Abbreviation</th>
                <th>Offset</th>
                <th>Used</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>EST / EDT</td>
                <td>UTC−5 / UTC−4</td>
                <td>US East, winter / summer</td>
              </tr>
              <tr>
                <td>CST / CDT</td>
                <td>UTC−6 / UTC−5</td>
                <td>US Central</td>
              </tr>
              <tr>
                <td>PST / PDT</td>
                <td>UTC−8 / UTC−7</td>
                <td>US West</td>
              </tr>
              <tr>
                <td>GMT / BST</td>
                <td>UTC+0 / UTC+1</td>
                <td>UK, winter / summer</td>
              </tr>
              <tr>
                <td>CET / CEST</td>
                <td>UTC+1 / UTC+2</td>
                <td>Most of Europe</td>
              </tr>
              <tr>
                <td>IST</td>
                <td>UTC+5:30</td>
                <td>India (all year)</td>
              </tr>
              <tr>
                <td>NPT</td>
                <td>UTC+5:45</td>
                <td>Nepal (all year)</td>
              </tr>
            </tbody>
          </table>
          <p>
            Abbreviations are not unique. IST also means Irish Standard Time and Israel Standard Time, and CST is
            China Standard Time as well as US Central. That is another reason to name a city instead.
          </p>

          <h2>GMT versus UTC</h2>
          <p>
            UTC, Coordinated Universal Time, is the world&apos;s reference time, kept by atomic clocks. GMT is
            historically the time at Greenwich and today is the UK&apos;s winter time zone. For everyday scheduling
            they are the same clock. The difference is that UTC is a standard and never changes for summer, while
            &ldquo;GMT&rdquo; as UK time switches to BST in summer. Computers and servers use UTC.
          </p>

          <h2>Daylight saving dates in 2026</h2>
          <ul>
            <li>United States and Canada (most areas): from 8 March to 1 November.</li>
            <li>UK and EU: from 29 March to 25 October.</li>
            <li>India, Nepal, China, Japan and most of Africa and South America: no daylight saving.</li>
          </ul>
          <p>
            For two to three weeks each spring and one week each autumn, the US and Europe are out of step, and the
            usual gap between New York and London shrinks from five hours to four. Recurring meetings drift by an
            hour for one side during those weeks.
          </p>

          <h2>How to avoid mistakes</h2>
          <ul>
            <li>
              <strong>Name a city:</strong> &ldquo;10:00 New York time&rdquo; is unambiguous all year.
            </li>
            <li>
              <strong>Use &ldquo;ET&rdquo; or &ldquo;PT&rdquo;</strong> to mean whatever is in force, rather than
              EST or PST.
            </li>
            <li>
              <strong>Send calendar invites</strong>, which store the event in UTC and show each person their local
              time.
            </li>
            <li>
              <strong>Check across a change date</strong> with the{" "}
              <Link href="/converters/timezone-meeting-planner">Time Zone Meeting Planner</Link>, which compares
              cities hour by hour using current daylight-saving rules.
            </li>
          </ul>

          <h2>Places with unusual offsets</h2>
          <p>
            Not every zone is a whole number of hours from UTC. India is UTC+5:30, Nepal UTC+5:45, parts of
            Australia UTC+9:30 or +10:30 in summer, and Newfoundland UTC−3:30. Scheduling tools that only offer whole
            hours get these wrong, so check the minutes when anyone in a meeting is in one of these places.
          </p>

          <h2>Offsets in timestamps</h2>
          <p>
            Machine-readable times carry the offset explicitly, such as <code>2026-10-03T10:00:00-04:00</code>, or use
            UTC with a Z: <code>2026-10-03T14:00:00Z</code>. Both are the same moment. The{" "}
            <Link href="/developer/timestamp-converter">Timestamp Converter</Link> shows any time in UTC and your own
            zone. For planning calls across several zones, see{" "}
            <Link href="/guides/schedule-a-meeting-across-time-zones">scheduling a meeting across time zones</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "minutes-to-decimal-hours",
    topic: "Work & documents",
    title: "How to convert minutes to decimal hours for timesheets",
    seoTitle: "Minutes to Decimal Hours: Timesheet Conversion",
    description:
      "7 hours 45 minutes is 7.75 hours, not 7.45. A minutes-to-decimal table, the formula, and how to avoid the most common timesheet and invoicing mistake.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["time-converter", "salary-calculator", "invoice-generator"],
    Body: function Body() {
      return (
        <>
          <p>
            Payroll systems, invoices and project trackers usually want hours as a decimal: 7.75 rather than 7:45.
            Typing 7.45 for seven hours and forty-five minutes is one of the most common timesheet errors, and it
            underpays by 18 minutes every time.
          </p>

          <h2>The formula</h2>
          <p>Decimal hours = hours + minutes ÷ 60</p>
          <p>7 h 45 min = 7 + 45 ÷ 60 = 7 + 0.75 = 7.75 hours.</p>

          <h2>Minutes to decimal table</h2>
          <table>
            <thead>
              <tr>
                <th>Min</th>
                <th>Hours</th>
                <th>Min</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>5</td>
                <td>0.08</td>
                <td>35</td>
                <td>0.58</td>
              </tr>
              <tr>
                <td>6</td>
                <td>0.10</td>
                <td>40</td>
                <td>0.67</td>
              </tr>
              <tr>
                <td>10</td>
                <td>0.17</td>
                <td>45</td>
                <td>0.75</td>
              </tr>
              <tr>
                <td>15</td>
                <td>0.25</td>
                <td>50</td>
                <td>0.83</td>
              </tr>
              <tr>
                <td>20</td>
                <td>0.33</td>
                <td>55</td>
                <td>0.92</td>
              </tr>
              <tr>
                <td>30</td>
                <td>0.50</td>
                <td>60</td>
                <td>1.00</td>
              </tr>
            </tbody>
          </table>
          <p>
            For any other value, enter the minutes in the <Link href="/converters/time-converter">Time Converter</Link>{" "}
            and read the result in hours.
          </p>

          <h2>Decimal back to minutes</h2>
          <p>
            Multiply the decimal part by 60. 3.4 hours is 3 hours plus 0.4 × 60 = 24 minutes. 1.15 hours is 1 hour 9
            minutes, not 1 hour 15.
          </p>

          <h2>Adding up a week</h2>
          <p>
            Convert each day to decimal first, then add. Adding clock times directly goes wrong as soon as minutes
            pass 60: 7:45 + 8:30 is not 15.75 or 15:75 but 16:15, which is 16.25 hours.
          </p>
          <ul>
            <li>Monday 7:45 = 7.75</li>
            <li>Tuesday 8:30 = 8.50</li>
            <li>Wednesday 6:20 = 6.33</li>
            <li>Thursday 8:10 = 8.17</li>
            <li>Friday 7:15 = 7.25</li>
            <li>Total: 38.00 hours</li>
          </ul>

          <h2>Pay and invoices</h2>
          <p>
            Multiply decimal hours by the hourly rate. At 18 an hour, 7.75 hours is 139.50; typing 7.45 would give
            134.10, five-forty short for one day. To find an hourly rate from a salary, use the{" "}
            <Link href="/calculators/salary-calculator">Salary Calculator</Link>. Freelancers entering hours as a
            quantity in the <Link href="/generators/invoice-generator">Invoice Generator</Link> should use decimal
            hours too, so the line total is right.
          </p>

          <h2>Rounding rules</h2>
          <p>
            Many employers and agencies round time to fixed steps: 6 minutes (0.1 hour), 15 minutes (0.25 hour) or
            similar. Rounding should be applied consistently, and in many places the law restricts rounding that
            always favours the employer. Lawyers and consultants often bill in 6-minute units, which is why 0.1 hours
            is a common minimum entry.
          </p>

          <h2>Billing clients by the minute</h2>
          <p>
            If you track work with a timer that shows minutes only, divide the total minutes by 60 at the end rather
            than converting each entry. A week of 47 short tasks totalling 1,365 minutes is 22.75 hours. Doing it once
            avoids rounding 47 small entries separately, and if each entry were rounded up, that drift would add up
            over a month.
          </p>

          <h2>In a spreadsheet</h2>
          <p>
            Spreadsheets store times as fractions of a day. To turn a time in cell A2 into decimal hours, use{" "}
            <code>=A2*24</code> and format the result as a number. To total hours above 24 as a time, format the cell
            as <code>[h]:mm</code> so it does not roll over to zero. For overtime calculations, see{" "}
            <Link href="/guides/overtime-pay-time-and-a-half">how to calculate overtime pay</Link>.
          </p>
        </>
      );
    },
  },
];
