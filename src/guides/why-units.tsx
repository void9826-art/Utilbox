import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-20";

export const whyUnitsGuides: Guide[] = [
  {
    slug: "celsius-to-fahrenheit-in-your-head",
    topic: "Calculations",
    title: "Celsius to Fahrenheit in your head: the shortcut and where it fails",
    seoTitle: "Celsius to Fahrenheit in Your Head: The Shortcut",
    description:
      "“Double it and add 30” is close for weather but wrong for fevers and ovens. How accurate it is, a better mental method, and reference points to remember.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["temperature-converter", "scientific-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            To estimate Fahrenheit from Celsius, double the Celsius figure and add 30. It is exact at 10 °C and
            within about 4 °F from −10 °C to 30 °C, fine for weather. Beyond that it drifts: it overstates a
            fever by 5 °F and an oven by over 30 °F. For those, use °F = °C × 1.8 + 32.
          </p>

          <h2>How far off is “double and add 30”?</h2>
          <ul>
            <li>−10 °C: shortcut 10 °F, actual 14 °F (4 low)</li>
            <li>0 °C: shortcut 30 °F, actual 32 °F (2 low)</li>
            <li>10 °C: shortcut 50 °F, actual 50 °F (exact)</li>
            <li>20 °C: shortcut 70 °F, actual 68 °F (2 high)</li>
            <li>30 °C: shortcut 90 °F, actual 86 °F (4 high)</li>
            <li>37 °C: shortcut 104 °F, actual 98.6 °F (5.4 high)</li>
            <li>180 °C: shortcut 390 °F, actual 356 °F (34 high)</li>
          </ul>
          <p>
            The error is 0.2 × °C − 2, so it grows by 2 °F for every 10 °C you move away from 10 °C. That is
            why the shortcut feels reliable for weather and then fails at the extremes.
          </p>

          <h2>Where it matters</h2>
          <ul>
            <li>
              <strong>Body temperature.</strong> The shortcut turns a normal 37 °C into 104 °F, which would be a
              high fever. Never use it for health readings; see the{" "}
              <Link href="/guides/fever-temperature-celsius-fahrenheit">fever temperature chart</Link>.
            </li>
            <li>
              <strong>Cooking.</strong> 180 °C is 356 °F, usually set as 350 °F. The shortcut says 390 °F, enough
              to burn a cake.
            </li>
            <li>
              <strong>Freezing.</strong> 0 °C becomes 30 °F, which suggests ice when it is just at freezing point.
              Close to 0, the exact figure matters for roads and plants.
            </li>
          </ul>

          <h2>An exact method you can still do in your head</h2>
          <ol>
            <li>Double the Celsius figure.</li>
            <li>Take away a tenth of that result.</li>
            <li>Add 32.</li>
          </ol>
          <p>
            For 25 °C: double is 50; a tenth of 50 is 5, so 45; add 32 gives 77 °F, which is exact. For 37 °C: 74,
            minus 7.4 is 66.6, plus 32 is 98.6 °F.
          </p>

          <h2>Fahrenheit to Celsius</h2>
          <p>
            The rough reverse is “take away 30 and halve”. Exact: subtract 32, then multiply by 5/9. A mental
            version that is very close: subtract 32, halve, then add a tenth of the result. For 77 °F: 45, halved
            is 22.5, plus 2.25 is 24.75 — the exact answer is 25 °C.
          </p>

          <h2>Reference points worth memorising</h2>
          <ul>
            <li>−40 °C = −40 °F, the one point where the scales meet</li>
            <li>0 °C = 32 °F, water freezes</li>
            <li>10 °C = 50 °F, a cool day</li>
            <li>16 °C ≈ 61 °F and 28 °C ≈ 82 °F — the digits swap</li>
            <li>20 °C = 68 °F, typical room temperature</li>
            <li>37 °C = 98.6 °F, typical body temperature</li>
            <li>100 °C = 212 °F, water boils at sea level</li>
            <li>180 °C ≈ 350 °F and 200 °C ≈ 400 °F on ovens</li>
          </ul>

          <h2>Converting differences, not readings</h2>
          <p>
            A change of temperature converts without the 32. “It will be 5 °C warmer tomorrow” means 9 °F warmer,
            not 41 °F. Multiply a difference by 1.8, nothing more. Mixing these up is a common mistake in weather
            reports, climate figures and science homework. A rise of 1.5 °C, for instance, is a rise of 2.7 °F.
          </p>

          <h2>When to use a converter</h2>
          <p>
            For anything that matters — medicine, cooking, lab work, specifications — use the exact figure. The{" "}
            <Link href="/converters/temperature-converter">Temperature Converter</Link> updates Celsius,
            Fahrenheit, Kelvin and Rankine together as you type and flags anything below absolute zero. For a
            column of readings, the <Link href="/calculators/scientific-calculator">Scientific Calculator</Link>{" "}
            handles the formula with brackets: (98.6 − 32) × 5 ÷ 9.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Using the weather shortcut for fevers, ovens or freezers.</li>
            <li>Adding or subtracting 32 when converting a change of temperature.</li>
            <li>Forgetting brackets: °C = (°F − 32) × 5/9, not °F − 32 × 5/9.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Weather between −10 and 30 °C? The shortcut is fine.</li>
            <li>Health, cooking or technical use? Use the exact formula.</li>
            <li>Converting a difference? Multiply by 1.8 only.</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "square-metres-vs-metres-squared",
    topic: "Calculations",
    title: "Square metres vs metres squared: area conversion mistakes",
    seoTitle: "Square Metres vs Metres Squared: Area Mistakes",
    description:
      "Why 1 m² is 10.76 square feet, not 3.28, why “2 metres squared” is ambiguous, and how to convert areas and volumes without the most common mistakes.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["area-converter", "length-converter", "paint-coverage-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            To convert an area, square the length factor. A metre is 3.28 feet, so a square metre is 3.28 × 3.28
            = 10.76 square feet, not 3.28. And “2 metres squared” is ambiguous: 2 square metres is an area of 2 m²,
            while a square 2 metres on each side is 4 m². Say “square metres” to avoid confusion.
          </p>

          <h2>Mistake 1: converting area with a length factor</h2>
          <p>
            A room 4 m by 5 m is 20 m². In feet it is about 13.12 ft by 16.40 ft, which is 215.3 ft². Converting
            the area with the length factor gives 20 × 3.28 = 65.6, a third of the real figure. The same applies
            in every unit system:
          </p>
          <ul>
            <li>1 m² = 10.764 ft² (not 3.281)</li>
            <li>1 ft² = 0.0929 m² (about 1/10.76)</li>
            <li>1 m² = 10,000 cm² (not 100)</li>
            <li>1 km² = 1,000,000 m², and 1 hectare = 10,000 m²</li>
            <li>1 yd² = 9 ft² (3 × 3)</li>
          </ul>
          <p>
            The safe method: convert each side to the new unit first, then multiply. Or use the{" "}
            <Link href="/converters/area-converter">Area Converter</Link>, which works with area units directly,
            and the <Link href="/converters/length-converter">Length Converter</Link> for the sides.
          </p>

          <h2>Mistake 2: “metres squared” vs “square metres”</h2>
          <p>
            Strictly, “2 square metres” is an amount of area: any shape covering 2 m², such as a 1 m × 2 m rug.
            “2 metres squared” can mean the same thing in everyday speech, or it can mean (2 m)², a square with
            2 m sides, which is 4 m². Estate listings and homework both trip on this. Write “m²” or “square metres”
            for areas, and give dimensions (“2 m × 2 m”) when you mean a shape.
          </p>

          <h2>Mistake 3: scaling up</h2>
          <p>
            Doubling the sides of a square quadruples its area; doubling the sides of a cube multiplies its volume
            by eight. A 6 m × 6 m patio needs four times the paving of a 3 m × 3 m one, not twice. People budget
            twice and run out halfway.
          </p>

          <h2>Mistake 4: volume with an area or length factor</h2>
          <p>
            Volumes cube the length factor:
          </p>
          <ul>
            <li>1 m³ = 35.31 ft³ (3.281³)</li>
            <li>1 m³ = 1,000,000 cm³ = 1,000 litres</li>
            <li>1 ft³ = 28.32 litres</li>
          </ul>
          <p>
            A 2 m × 1 m × 0.1 m slab is 0.2 m³ of concrete — 200 litres — not 2 or 20.
          </p>

          <h2>Mistake 5: mixed units in one calculation</h2>
          <p>
            Multiplying 4 m by 150 cm gives 600 — of nothing in particular. Convert both to metres (4 × 1.5 = 6 m²)
            or both to centimetres (400 × 150 = 60,000 cm², which is also 6 m²) before multiplying.
          </p>

          <h2>Real jobs where this goes wrong</h2>
          <ul>
            <li>
              <strong>Paint and flooring:</strong> coverage is quoted per m² or per ft². The{" "}
              <Link href="/calculators/paint-coverage-calculator">Paint and Wallpaper Calculator</Link> works out
              wall area from room dimensions in metric or imperial, so you do not convert areas by hand.
            </li>
            <li>
              <strong>Property sizes:</strong> listings in square feet and square metres differ by a factor of
              about 10.76; a 1,000 ft² flat is about 93 m².
            </li>
            <li>
              <strong>Land:</strong> acres and hectares are areas too — 1 hectare is about 2.47 acres. See{" "}
              <Link href="/guides/acres-hectares-and-land-units">acres, hectares and land units</Link>.
            </li>
          </ul>

          <h2>Why squaring the factor works</h2>
          <p>
            Picture one square metre drawn on the floor. Each side is 1 m, which is 3.281 ft. Divide each side
            into feet and the square holds 3.281 rows of 3.281 one-foot squares: 10.76 of them. The same picture
            explains centimetres — 100 rows of 100 — and why a cubic metre holds a million cubic centimetres: 100
            × 100 × 100. Any time a unit is squared or cubed, its conversion factor is squared or cubed too.
          </p>

          <h2>A quick sense check</h2>
          <p>
            Square feet should always be a much bigger number than square metres for the same space — roughly ten
            times. Square centimetres should be ten thousand times the square metres. If your answer is only three
            or a hundred times bigger, you used a length factor.
          </p>

          <h2>Checklist</h2>
          <ul>
            <li>Area factor = length factor squared; volume factor = length factor cubed.</li>
            <li>All sides in the same unit before multiplying?</li>
            <li>Units written as m², ft² or “square metres”?</li>
            <li>Answer about ten times bigger in ft² than in m²?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "stones-and-pounds-to-kg",
    topic: "Calculations",
    title: "Stones and pounds to kg: why 11.5 stone isn’t 11 st 5 lb",
    seoTitle: "Stones and Pounds to kg: Avoid the 11.5 Stone Trap",
    description:
      "A stone is 14 pounds, so decimal stones and stones-and-pounds are not the same. How to convert st and lb to kg and back, with worked examples and a quick check.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["weight-converter", "bmi-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            A stone is 14 pounds, so 11.5 stone means 11 stone 7 pounds, not 11 stone 5 pounds. To convert stones
            and pounds to kilograms, multiply the stones by 14, add the pounds, then multiply by 0.4536. For
            example, 11 st 7 lb is 161 lb, which is 73.0 kg.
          </p>

          <h2>Why the decimal trap happens</h2>
          <p>
            Most units we use split into tens, so a decimal point feels like it marks “the small units”. Stones do
            not. Each stone has 14 pounds, so the part after the decimal point is a fraction of 14:
          </p>
          <ul>
            <li>0.25 stone = 3.5 lb</li>
            <li>0.5 stone = 7 lb</li>
            <li>0.75 stone = 10.5 lb</li>
          </ul>
          <p>
            Reading 11.5 stone as 11 st 5 lb loses 2 lb, about 0.9 kg. Going the other way, writing 11 st 10 lb as
            11.10 stone is wrong as well; it is about 11.71 stone.
          </p>

          <h2>Stones and pounds to kilograms</h2>
          <ol>
            <li>Multiply the stones by 14.</li>
            <li>Add the pounds to get a total in pounds.</li>
            <li>Multiply by 0.45359237 (or 0.4536 for everyday use).</li>
          </ol>
          <p>
            Example: 13 st 4 lb → 13 × 14 = 182, plus 4 = 186 lb → 186 × 0.45359 = 84.4 kg.
          </p>
          <p>
            Or skip the pounds: 1 stone is 6.35 kg, so 13 st is 82.55 kg, plus 4 lb (1.81 kg) is 84.4 kg.
          </p>

          <h2>Kilograms to stones and pounds</h2>
          <ol>
            <li>Divide the kilograms by 6.35029 to get decimal stones.</li>
            <li>The whole number is the stones.</li>
            <li>Multiply the decimal part by 14 to get the pounds.</li>
          </ol>
          <p>
            Example: 80 kg ÷ 6.35029 = 12.598 stone → 12 stone, and 0.598 × 14 = 8.4 lb → 12 st 8.4 lb.
          </p>
          <p>
            The <Link href="/converters/weight-converter">Weight Converter</Link> does both directions exactly and
            lists stones, pounds, kilograms and ounces side by side.
          </p>

          <h2>Where you meet stones</h2>
          <p>
            Stones are mainly used for body weight in the UK and Ireland. Medical records, gyms and most scales
            elsewhere use kilograms, and the US uses pounds alone — so an American would describe 12 st 8 lb as about
            176 lb. When a doctor, pharmacist or form asks for weight, give kilograms unless asked otherwise:
            medication doses and BMI are worked out in metric.
          </p>

          <h2>Checking BMI after converting</h2>
          <p>
            Once you have kilograms, the <Link href="/calculators/bmi-calculator">BMI Calculator</Link> gives BMI and
            the healthy weight range for your height. Convert first rather than estimating; a stone-to-kilo slip of
            one or two kilograms can move a borderline result. BMI has limits as a measure, explained in{" "}
            <Link href="/guides/what-your-bmi-means">what your BMI means</Link>.
          </p>

          <h2>Quick mental checks</h2>
          <ul>
            <li>1 stone ≈ 6.35 kg, so 10 stone ≈ 63.5 kg and 15 stone ≈ 95 kg.</li>
            <li>1 kg ≈ 2.2 lb, so kilograms are always a bit less than half the pounds.</li>
            <li>Half a stone is 7 lb, about 3.2 kg.</li>
          </ul>

          <h2>A quick reference</h2>
          <ul>
            <li>8 st = 50.8 kg</li>
            <li>9 st = 57.2 kg</li>
            <li>10 st = 63.5 kg</li>
            <li>11 st = 69.9 kg</li>
            <li>12 st = 76.2 kg</li>
            <li>13 st = 82.6 kg</li>
            <li>14 st = 88.9 kg</li>
            <li>15 st = 95.3 kg</li>
            <li>16 st = 101.6 kg</li>
          </ul>
          <p>Each extra pound adds about 0.45 kg to the figure for the whole stones.</p>

          <h2>Rounding without drifting</h2>
          <p>
            Convert from the most precise figure you have, and round once at the end. Converting 84.4 kg to
            stones, rounding to 13.3 stone, and then converting back gives 84.5 kg; do that a few times — between a
            scale, an app and a form — and the number drifts. Keep the original reading, in its original unit,
            as your record.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Reading decimal stones as stones and pounds.</li>
            <li>Typing pounds into a field that expects stones, or the reverse.</li>
            <li>Using 2.2 for medical calculations where precision matters; use the exact factor.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Stones × 14 + pounds = total pounds?</li>
            <li>Total pounds × 0.4536 = kilograms?</li>
            <li>Decimal part of stones multiplied by 14, not read as pounds?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "ton-vs-tonne",
    topic: "Calculations",
    title: "Ton vs tonne: metric, short and long tons explained",
    seoTitle: "Ton vs Tonne: Metric, Short and Long Tons",
    description:
      "A tonne is 1,000 kg, a US short ton 907 kg, and a UK long ton 1,016 kg. Which one a document means, why air conditioners are rated in tons, and how to convert.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["weight-converter", "volume-converter", "percentage-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            A tonne, or metric ton, is exactly 1,000 kg. A US short ton is 2,000 pounds, about 907.2 kg, and a UK
            long ton is 2,240 pounds, about 1,016 kg. The short ton is about 9% lighter than a tonne; the long ton
            about 1.6% heavier. When a document just says “ton”, check which one it means before converting.
          </p>

          <h2>The three tons side by side</h2>
          <ul>
            <li>
              <strong>Tonne (metric ton), t:</strong> 1,000 kg = 2,204.6 lb. Used worldwide in science, trade,
              shipping and most countries’ official statistics.
            </li>
            <li>
              <strong>Short ton (US ton):</strong> 2,000 lb = 907.18 kg. The everyday “ton” in the United States.
            </li>
            <li>
              <strong>Long ton (imperial ton):</strong> 2,240 lb = 1,016.05 kg. The historical British ton,
              still met in some shipping and older documents.
            </li>
          </ul>
          <p>
            The <Link href="/converters/weight-converter">Weight Converter</Link> lists all three separately, so you
            can convert between them and kilograms or pounds without guessing.
          </p>

          <h2>How big is the difference?</h2>
          <p>
            For 50 “tons” of material: 50 tonnes is 50,000 kg; 50 short tons is 45,359 kg; 50 long tons is 50,802
            kg. Mixing tonnes and short tons is a 4,641 kg error — about 9.3%. On a delivery, a load limit or a
            price per ton, that is a real amount of money or a real safety margin. The{" "}
            <Link href="/calculators/percentage-calculator">Percentage Calculator</Link> shows the percentage
            difference between any two figures.
          </p>

          <h2>How to tell which ton a document means</h2>
          <ul>
            <li>
              <strong>Spelling and symbol.</strong> “Tonne” and the symbol “t” always mean 1,000 kg. “Metric ton”,
              often written MT in trade documents, means the same.
            </li>
            <li>
              <strong>Origin.</strong> US sources usually mean short tons; UK and Commonwealth sources from the
              last few decades usually mean tonnes, older ones long tons.
            </li>
            <li>
              <strong>Context.</strong> International trade, emissions (“tonnes of CO₂”) and scientific data are
              almost always metric.
            </li>
            <li>
              <strong>When in doubt, ask.</strong> In a contract or order, write the unit in full — “tonnes (1,000
              kg)” — rather than “tons”.
            </li>
          </ul>

          <h2>Tons that are not weights</h2>
          <ul>
            <li>
              <strong>Refrigeration ton:</strong> air conditioners and chillers, especially in the US and India,
              are rated in tons of cooling. One ton of refrigeration is 12,000 BTU per hour, about 3.5 kW of cooling.
              A “1.5 ton AC” describes cooling power, not the unit’s weight.
            </li>
            <li>
              <strong>Register tons:</strong> a ship’s gross tonnage historically measured internal volume, with one
              register ton equal to 100 cubic feet. It says nothing about weight.
            </li>
            <li>
              <strong>Displacement and deadweight:</strong> a ship’s displacement is the weight of water it
              displaces, and deadweight is how much it can carry; both are stated in tonnes or long tons depending
              on the source.
            </li>
          </ul>
          <p>
            For volumes that sound similar, such as cubic metres of water, the{" "}
            <Link href="/converters/volume-converter">Volume Converter</Link> helps: a cubic metre of water is 1,000
            litres and weighs about one tonne.
          </p>

          <h2>Why the tonne is so close to the long ton</h2>
          <p>
            The coincidence is not designed. The long ton came from multiples of the pound — 20 hundredweight of
            112 lb — while the tonne is simply 1,000 kg, the mass of a cubic metre of water. They land within 1.6%
            of each other by chance, which is exactly why they get mixed up: the difference is small enough to miss
            on a single item and large enough to matter on a shipment.
          </p>

          <h2>Hundredweight, the other trap</h2>
          <p>
            The same split applies one level down. A UK hundredweight (cwt) is 112 lb, a twentieth of a long ton; a
            US hundredweight is 100 lb, a twentieth of a short ton. Agricultural prices quoted “per cwt” differ by
            12% depending on which is meant.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Converting a US “ton” at 1,000 kg.</li>
            <li>Reading “1.5 ton” on an air conditioner as its weight.</li>
            <li>Writing “ton” in an international order without saying which.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>“Tonne”, “t” or “metric ton”? 1,000 kg.</li>
            <li>US source saying “ton”? Probably 2,000 lb.</li>
            <li>Old British source? Possibly 2,240 lb.</li>
            <li>Cooling capacity or ship tonnage? Not a weight at all.</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "us-vs-uk-pints-gallons-fluid-ounces",
    topic: "Calculations",
    title: "US vs UK pints, gallons and fluid ounces: why they differ",
    seoTitle: "US vs UK Pints, Gallons and Fluid Ounces",
    description:
      "A UK pint is 568 ml, a US pint 473 ml. The UK fluid ounce is smaller, but there are 20 in a UK pint. The differences, why they exist and how to avoid mix-ups.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["volume-converter", "weight-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            US and UK liquid units share names, not sizes. A UK (imperial) pint is 568 ml and a US pint 473 ml,
            about 20% less, and gallons differ the same way. Yet a US fluid ounce, 29.6 ml, is slightly bigger than
            a UK one, 28.4 ml; the UK pint just holds 20 of them, not 16.
          </p>

          <h2>The figures</h2>
          <ul>
            <li>Fluid ounce: US 29.57 ml; imperial 28.41 ml</li>
            <li>Pint: US 473.2 ml (16 US fl oz); imperial 568.3 ml (20 imperial fl oz)</li>
            <li>Quart: US 946.4 ml; imperial 1,136.5 ml</li>
            <li>Gallon: US 3.785 litres; imperial 4.546 litres</li>
          </ul>
          <p>
            The <Link href="/converters/volume-converter">Volume Converter</Link> keeps US and imperial units in
            separate groups for exactly this reason, alongside litres, millilitres and cooking measures.
          </p>

          <h2>Why there are two systems</h2>
          <p>
            Several different gallons were in use in England before the US became independent, and the US
            standardised on one of the older ones, the wine gallon of 231 cubic inches. In 1824 Britain replaced
            its gallons with the new imperial gallon, defined by the volume of 10 pounds of water. The two systems
            have stayed apart ever since. Both are now defined exactly in metric terms.
          </p>

          <h2>Where the difference catches people</h2>
          <ul>
            <li>
              <strong>Recipes.</strong> An American recipe’s “2 pints of milk” is about 946 ml; a British one is
              1,136 ml. For cups, spoons and oven temperatures, see{" "}
              <Link href="/guides/recipe-conversions-cups-grams-oven">recipe conversions</Link>.
            </li>
            <li>
              <strong>Fuel economy.</strong> Miles per gallon figures are not comparable: 40 mpg in the UK is about
              33 mpg in US terms, because the UK gallon is bigger. See{" "}
              <Link href="/guides/mpg-to-litres-per-100km">mpg and litres per 100 km</Link>.
            </li>
            <li>
              <strong>Drinks.</strong> A pint of beer in a UK pub is 568 ml; a “pint” glass in the US usually holds
              about 473 ml.
            </li>
            <li>
              <strong>Product labels.</strong> A US label in fl oz and a UK label in fl oz describe different
              volumes; the millilitre figure, where shown, is the reliable one.
            </li>
            <li>
              <strong>Canada and other countries</strong> that used imperial measures historically may print either
              system on older material. Check the source.
            </li>
          </ul>

          <h2>Smaller measures</h2>
          <p>
            Teaspoons and tablespoons differ too. A US tablespoon is 14.8 ml; a metric tablespoon, used in the UK,
            Canada and New Zealand, is 15 ml — close enough not to matter. Australia uses a 20 ml tablespoon,
            which does matter for baking powder or salt. Teaspoons are about 5 ml almost everywhere. Older British
            recipes may use imperial measures that differ again, so check the age and origin of a recipe if
            quantities seem odd.
          </p>

          <h2>Fluid ounces vs ounces</h2>
          <p>
            A fluid ounce measures volume; an ounce measures weight (28.35 g). They match only roughly, and only for
            water: one imperial fluid ounce of water weighs about one ounce, while a US fluid ounce of water weighs
            a little more. For flour, sugar or honey they differ a lot, because those are not as dense as water —
            or are denser. Weigh solids in grams or ounces with the{" "}
            <Link href="/converters/weight-converter">Weight Converter</Link>, and measure liquids by volume.
          </p>

          <h2>When a label shows both</h2>
          <p>
            Products sold in several countries often print a US fl oz figure next to millilitres, even in the UK.
            A bottle marked “16.9 fl oz / 500 ml” is using US fluid ounces; 500 ml would be 17.6 imperial fluid
            ounces. Whenever the two figures do not quite agree with the imperial factor, assume the label is
            American.
          </p>

          <h2>Quick conversions to remember</h2>
          <ul>
            <li>1 UK pint ≈ 1.2 US pints; 1 US pint ≈ 0.83 UK pints</li>
            <li>1 UK gallon ≈ 1.2 US gallons</li>
            <li>1 litre ≈ 1.76 UK pints ≈ 2.11 US pints</li>
            <li>1 US cup = 236.6 ml; a “metric cup” = 250 ml</li>
          </ul>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Assuming a pint is a pint everywhere.</li>
            <li>Converting UK mpg with a US gallon factor.</li>
            <li>Treating fluid ounces and ounces as the same thing for dry ingredients.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Source American or British (or older Canadian)?</li>
            <li>Volume or weight ounce?</li>
            <li>Millilitre figure available? Use it.</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "km-to-miles-in-your-head",
    topic: "Calculations",
    title: "Kilometres to miles in your head: three quick methods",
    seoTitle: "Kilometres to Miles in Your Head: Quick Methods",
    description:
      "Multiply by 5 and divide by 8, use the Fibonacci trick, or take 60%. How accurate each mental method is for distances and speeds, with worked examples.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["length-converter", "speed-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            To turn kilometres into miles in your head, multiply by 5 and divide by 8; it is within 1% of the exact
            factor, 0.621. Taking 60% is easier but about 3% low. For miles to kilometres, multiply by 8 and divide
            by 5, or × 1.6. So 100 km is about 62 miles, and 50 miles about 80 km.
          </p>

          <h2>Method 1: × 5 ÷ 8</h2>
          <p>
            0.625 is very close to the true 0.6214, so this overstates by about 0.6%. It is easiest with numbers
            that divide by 8:
          </p>
          <ul>
            <li>40 km → 40 ÷ 8 × 5 = 25 miles (exact: 24.85)</li>
            <li>120 km → 15 × 5 = 75 miles (exact: 74.56)</li>
            <li>16 km → 2 × 5 = 10 miles (exact: 9.94)</li>
          </ul>

          <h2>Method 2: take 60%, then add a little</h2>
          <p>
            Halve the kilometres and add a tenth: 100 km → 50 + 10 = 60 miles. The exact answer is 62.1, so add
            about 3% if you need more accuracy. This method is quick for round numbers and speeds.
          </p>

          <h2>Method 3: the Fibonacci trick</h2>
          <p>
            Consecutive Fibonacci numbers — 2, 3, 5, 8, 13, 21, 34, 55, 89 — have a ratio close to 1.618, which is
            near the 1.609 kilometres in a mile. So each number in miles is roughly the next one in kilometres:
          </p>
          <ul>
            <li>3 miles ≈ 5 km (exact 4.83)</li>
            <li>5 miles ≈ 8 km (exact 8.05)</li>
            <li>8 miles ≈ 13 km (exact 12.87)</li>
            <li>13 miles ≈ 21 km (exact 20.92)</li>
            <li>55 miles ≈ 89 km (exact 88.51)</li>
          </ul>
          <p>Other numbers can be split into Fibonacci numbers and added: 20 miles = 13 + 5 + 2 → 21 + 8 + 3 = 32 km.</p>

          <h2>Which method to use when</h2>
          <ul>
            <li>
              <strong>Road signs and route planning:</strong> × 5 ÷ 8 or 60% plus a bit — both are close enough to
              plan a journey.
            </li>
            <li>
              <strong>Running and cycling:</strong> the Fibonacci pairs cover common distances, and race distances
              are worth memorising (below).
            </li>
            <li>
              <strong>Anything written down:</strong> the exact factor.
            </li>
          </ul>

          <h2>Speeds</h2>
          <p>The same factors work for km/h and mph:</p>
          <ul>
            <li>30 mph = 48.3 km/h</li>
            <li>50 km/h = 31.1 mph</li>
            <li>70 mph = 112.7 km/h</li>
            <li>100 km/h = 62.1 mph</li>
            <li>130 km/h = 80.8 mph</li>
          </ul>
          <p>
            Driving abroad, round the limit down rather than up; speed limits are legal maxima, and a few percent of
            conversion error is not a defence. The <Link href="/converters/speed-converter">Speed Converter</Link>{" "}
            gives exact figures in km/h, mph, m/s and knots, and turns running pace into speed.
          </p>

          <h2>Race distances</h2>
          <ul>
            <li>5K = 3.11 miles</li>
            <li>10K = 6.21 miles</li>
            <li>Half marathon = 21.0975 km = 13.1 miles</li>
            <li>Marathon = 42.195 km = 26.2 miles</li>
          </ul>
          <p>
            For pace per kilometre and per mile, see{" "}
            <Link href="/guides/running-pace-and-speed">running pace and speed</Link>.
          </p>

          <h2>Why miles and kilometres are related this way</h2>
          <p>
            The kilometre was defined from the size of the Earth — originally, the metre was one ten-millionth of
            the distance from the equator to the North Pole. The mile comes from Roman paces and later English
            furlongs. The two were never meant to fit together, which is why the factor is an awkward 1.609344.
            Since 1959 the inch has been defined as exactly 2.54 cm, which fixes the mile at exactly 1,609.344
            metres; the mental methods above are just ways of approximating that number.
          </p>

          <h2>When to use the exact figure</h2>
          <p>
            Mental methods are for estimates. For anything recorded — mileage claims, distances in a report,
            training logs — use the exact factors: 1 mile = 1.609344 km and 1 km = 0.621371 miles. The{" "}
            <Link href="/converters/length-converter">Length Converter</Link> uses the exact definitions and also
            covers nautical miles, which are a different unit (1.852 km) used at sea and in the air.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Multiplying by 1.6 when going from km to miles, which makes the answer bigger, not smaller.</li>
            <li>Confusing statute miles with nautical miles in sailing or aviation figures.</li>
            <li>Rounding a speed limit up after converting.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Kilometres → miles: the number gets smaller (× 5 ÷ 8).</li>
            <li>Miles → kilometres: the number gets bigger (× 8 ÷ 5).</li>
            <li>Need precision? Use 1.609344.</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "troy-ounce-vs-ounce",
    topic: "Calculations",
    title: "Troy ounce vs ounce: why gold is weighed differently",
    seoTitle: "Troy Ounce vs Ounce: Why Gold Is Weighed Differently",
    description:
      "Gold and silver prices are per troy ounce, 31.1 g, not the 28.35 g ounce on kitchen scales. How to convert troy ounces to grams and check what a price means.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["weight-converter", "percentage-calculator", "currency-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            Precious metals are priced per troy ounce, which is 31.1035 grams. The ordinary ounce on kitchen scales,
            the avoirdupois ounce, is 28.3495 grams, so a troy ounce is about 9.7% heavier. Using the wrong ounce
            when converting a gold or silver price to grams makes the price per gram look about 10% higher than it
            is.
          </p>

          <h2>The two ounces</h2>
          <ul>
            <li>
              <strong>Avoirdupois ounce (oz):</strong> 28.349523125 g, 1/16 of a pound. Used for food, post and
              everyday goods in the US and UK.
            </li>
            <li>
              <strong>Troy ounce (oz t):</strong> 31.1034768 g. Used for gold, silver, platinum and palladium in
              markets worldwide.
            </li>
          </ul>
          <p>
            The <Link href="/converters/weight-converter">Weight Converter</Link> lists the troy ounce and the
            carat separately from ordinary ounces, so you can convert between them and grams exactly.
          </p>

          <h2>Converting a metal price to grams</h2>
          <p>
            Divide the price per troy ounce by 31.1035. If gold is quoted at 2,500 per troy ounce, a gram costs
            2,500 ÷ 31.1035 = 80.38. Dividing by 28.35 by mistake gives 88.19, about 9.7% too high. A kilogram is
            32.15 troy ounces, so a kilo bar costs 32.15 times the ounce price.
          </p>
          <p>
            Prices are usually quoted in US dollars. To see the figure in your own currency, convert it with the{" "}
            <Link href="/converters/currency-converter">Currency Converter</Link>, which downloads the day’s
            exchange rates; the amount you enter stays in your browser. Retail prices also include a premium over
            the market price, and that varies by dealer and product.
          </p>

          <h2>The troy pound puzzle</h2>
          <p>
            A troy pound has 12 troy ounces, so it weighs 373.2 g — less than an ordinary 16-ounce pound of
            453.6 g. A troy ounce is heavier than an ordinary ounce, but a troy pound is lighter than an ordinary
            pound. Troy pounds are rarely used now; prices are per troy ounce, gram or kilogram.
          </p>

          <h2>Purity: karats and fineness</h2>
          <p>
            A gold item’s weight is not all gold. Purity is given as karats (out of 24) or fineness (parts per
            thousand):
          </p>
          <ul>
            <li>24 karat ≈ 999 fine: essentially pure</li>
            <li>22 karat = 91.7% gold (916)</li>
            <li>18 karat = 75% gold (750)</li>
            <li>14 karat = 58.3% gold (585 is a common hallmark)</li>
            <li>9 karat = 37.5% gold (375)</li>
          </ul>
          <p>
            To estimate the gold content, multiply the weight by the purity: a 10 g 18-karat chain contains 7.5 g of
            gold. The <Link href="/calculators/percentage-calculator">Percentage Calculator</Link> handles the
            sum for any purity. Do not confuse karat (purity) with carat, a unit of mass for gemstones equal to
            0.2 g.
          </p>

          <h2>Silver, platinum and coins</h2>
          <p>
            The same unit applies to silver, platinum and palladium, and bullion coins are usually sold by troy
            weight: a “1 oz” gold or silver coin contains one troy ounce of the metal. Some coins are made of a
            gold alloy and weigh more than one troy ounce in total so that the fine gold content is exactly one
            ounce. The fine weight, often stamped on the coin or stated by the mint, is the figure to value.
          </p>

          <h2>Local units</h2>
          <p>
            Some markets use their own units — for example the tola in South Asia, about 11.66 g, or the tael in parts
            of East Asia, whose size varies by region. Check the local definition before converting, and compare
            prices in grams where you can.
          </p>

          <h2>Checking a scale</h2>
          <p>
            Jewellers’ scales usually switch between grams, troy ounces and pennyweights (1/20 of a troy ounce,
            1.555 g). Check which unit the display is in before writing anything down.
          </p>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Dividing a gold price per ounce by 28.35 instead of 31.10.</li>
            <li>Weighing jewellery on kitchen scales set to ounces and comparing with a troy ounce price.</li>
            <li>Valuing an item by its full weight rather than its gold content.</li>
            <li>Mixing up carats for gemstones with karats for gold.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Price per troy ounce? Divide by 31.1035 for grams.</li>
            <li>Weight in grams and purity known?</li>
            <li>Currency and dealer premium accounted for?</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "kw-vs-kwh",
    topic: "Calculations",
    title: "kW vs kWh: the difference, and why your bill uses kWh",
    seoTitle: "kW vs kWh: What's the Difference?",
    description:
      "kW is how fast energy is used; kWh is how much is used. How to turn appliance power into energy and cost, and how EV battery and charger figures fit together.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["ev-charging-cost-calculator", "time-converter", "scientific-calculator"],
    Body: function Body() {
      return (
        <>
          <p>
            A kilowatt (kW) is a rate: how fast something uses or delivers energy. A kilowatt-hour (kWh) is an
            amount of energy: 1 kW used for one hour. Electricity bills charge per kWh because you pay for the
            energy used, not the speed. A 2 kW heater running for three hours uses 6 kWh.
          </p>

          <h2>The speed and distance analogy</h2>
          <p>
            Think of kW as speed and kWh as distance. Speed alone does not tell you how far you went; you need the
            time too. Power alone does not tell you how much energy was used; multiply by the hours:
          </p>
          <ul>
            <li>Energy (kWh) = power (kW) × time (hours)</li>
            <li>Power (kW) = energy (kWh) ÷ time (hours)</li>
            <li>Time (hours) = energy (kWh) ÷ power (kW)</li>
          </ul>
          <p>
            Saying “my house used 10 kW yesterday” or “this charger is 7 kWh” mixes the two up.
          </p>

          <h2>From appliance to bill</h2>
          <ol>
            <li>Find the power on the label, in watts or kilowatts. 1,000 W = 1 kW.</li>
            <li>Multiply by the hours it runs. Minutes need converting: 20 minutes is 1/3 hour.</li>
            <li>Multiply the kWh by your price per kWh.</li>
          </ol>
          <p>Examples, at an illustrative price of 0.25 per kWh:</p>
          <ul>
            <li>A 2 kW kettle for 3 minutes: 2 × 0.05 = 0.1 kWh → 0.025</li>
            <li>A 100 W television for 4 hours: 0.1 × 4 = 0.4 kWh → 0.10</li>
            <li>A 2 kW heater for 3 hours: 6 kWh → 1.50</li>
          </ul>
          <p>
            Label figures are maximums. Fridges, washing machines and heat pumps cycle on and off, so their real use
            is lower than power × hours switched on. Many labels give an annual kWh estimate, which is more useful.
            For minute and hour conversions, the <Link href="/converters/time-converter">Time Converter</Link> helps;
            for the arithmetic, the <Link href="/calculators/scientific-calculator">Scientific Calculator</Link>.
          </p>

          <h2>Electric cars: battery kWh and charger kW</h2>
          <ul>
            <li>
              <strong>Battery size</strong> is energy, in kWh: how much the car can store.
            </li>
            <li>
              <strong>Charger speed</strong> is power, in kW: how fast energy flows in.
            </li>
            <li>
              <strong>Charging time</strong> is roughly the kWh you need ÷ the charging kW. Adding 40 kWh on a 7 kW
              home charger takes about 6 hours.
            </li>
          </ul>
          <p>
            Real charging takes longer than the simple sum. The car may accept less power than the charger offers,
            rapid charging slows as the battery fills, and some energy is lost as heat, so the meter records more
            kWh than the battery gains. The{" "}
            <Link href="/calculators/ev-charging-cost-calculator">EV Charging Cost Calculator</Link> works out the
            cost of a charge from battery size, charge level and your price per kWh; see also{" "}
            <Link href="/guides/ev-charging-cost">how much it costs to charge an electric car</Link>.
          </p>

          <h2>Reading an energy bill</h2>
          <p>
            Your meter counts kWh, and the bill multiplies the kWh used in the period by the unit rate. A smart
            meter display may also show current power in kW or watts — that is how fast energy is being used right
            now, like a car’s speedometer, while the kWh total is the odometer. Switching a 2 kW heater on shows up
            immediately as a jump in power, and over time as kWh on the bill.
          </p>

          <h2>Other places the units appear</h2>
          <ul>
            <li>
              <strong>Solar panels</strong> are rated in kW (often kWp, for peak) — the most they produce in ideal
              conditions. What they generate over a day or a year is in kWh.
            </li>
            <li>
              <strong>Standing charges and capacity charges</strong> on some tariffs are per day or per kW of
              connection, separate from the per-kWh price.
            </li>
            <li>
              <strong>kW per hour</strong> is not a meaningful unit for energy use; if you see it, the writer meant
              kWh.
            </li>
          </ul>

          <h2>Mistakes to avoid</h2>
          <ul>
            <li>Multiplying watts by hours and treating the answer as kWh without dividing by 1,000.</li>
            <li>Estimating a fridge’s cost from its label power running 24 hours a day.</li>
            <li>Expecting a 50 kW charger to fill a 50 kWh battery from empty in exactly an hour.</li>
          </ul>

          <h2>Checklist</h2>
          <ul>
            <li>Power in kW (watts ÷ 1,000)?</li>
            <li>Time in hours?</li>
            <li>kW × hours = kWh; kWh × price = cost.</li>
          </ul>
        </>
      );
    },
  },
];
