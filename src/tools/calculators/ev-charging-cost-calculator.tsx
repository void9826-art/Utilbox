"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Segmented, Slider } from "@/components/ui/field";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import { LITRES_PER_UK_GALLON, chargeCost, gridKwhPerUnit } from "@/lib/household";
import { formatMoney } from "@/lib/money";
import { formatNumber } from "@/lib/utils";

import { CurrencySelect, EmptyResult, NumberField, ResultCard, Working, parseNumber } from "./_shared";

type Mode = "charge" | "distance";
type System = "metric" | "us" | "uk";

const SYSTEMS: Record<System, { label: string; distance: string; consumption: string; fuel: string; fuelPrice: string; defaults: Record<string, string> }> = {
  metric: {
    label: "km, litres",
    distance: "km",
    consumption: "kWh/100 km",
    fuel: "L/100 km",
    fuelPrice: "per litre",
    defaults: { consumption: "17", distance: "1200", fuel: "6.5", fuelPrice: "1.75" },
  },
  us: {
    label: "miles, US gallons",
    distance: "mi",
    consumption: "kWh/100 mi",
    fuel: "mpg (US)",
    fuelPrice: "per US gallon",
    defaults: { consumption: "30", distance: "1000", fuel: "30", fuelPrice: "3.50" },
  },
  uk: {
    label: "miles, UK mpg",
    distance: "mi",
    consumption: "mi/kWh",
    fuel: "mpg (UK)",
    fuelPrice: "per litre",
    defaults: { consumption: "3.5", distance: "750", fuel: "45", fuelPrice: "1.40" },
  },
};

const fmt = (value: number, digits = 1) => formatNumber(value, { maximumFractionDigits: digits });

export default function EvChargingCostCalculator() {
  const [mode, setMode] = React.useState<Mode>("charge");
  const [currency, setCurrency] = React.useState("USD");
  const [efficiency, setEfficiency] = React.useState(90);

  const [battery, setBattery] = React.useState("60");
  const [from, setFrom] = React.useState("20");
  const [to, setTo] = React.useState("80");
  const [homePrice, setHomePrice] = React.useState("0.15");

  const [system, setSystem] = React.useState<System>("us");
  const [values, setValues] = React.useState(SYSTEMS.us.defaults);
  const [publicPrice, setPublicPrice] = React.useState("0.45");
  const [publicShare, setPublicShare] = React.useState(20);

  const money = (value: number, digits = 2) =>
    digits === 2 ? formatMoney(value, currency) : `${formatMoney(value, currency).replace(/[\d.,]+/, fmt(value, digits))}`;
  const set = (key: string) => (value: string) => setValues((previous) => ({ ...previous, [key]: value }));
  const units = SYSTEMS[system];

  let output: React.ReactNode;
  if (mode === "charge") {
    const batteryValue = parseNumber(battery);
    const fromValue = parseNumber(from);
    const toValue = parseNumber(to);
    const priceValue = parseNumber(homePrice);
    const valid =
      batteryValue !== null &&
      batteryValue > 0 &&
      fromValue !== null &&
      toValue !== null &&
      fromValue >= 0 &&
      toValue <= 100 &&
      toValue > fromValue &&
      priceValue !== null &&
      priceValue >= 0;
    if (valid) {
      const result = chargeCost({ batteryKwh: batteryValue, fromPercent: fromValue, toPercent: toValue, efficiencyPercent: efficiency, pricePerKwh: priceValue });
      output = (
        <div className="space-y-4">
          <ResultCard
            label="Cost of this charge"
            value={money(result.cost)}
            breakdown={[
              { label: "Energy added to the battery", value: `${fmt(result.energyAdded)} kWh` },
              { label: "Energy drawn from the grid", value: `${fmt(result.energyFromGrid)} kWh` },
            ]}
          />
          <Working
            lines={[
              `Energy added = ${batteryValue} kWh × (${toValue}% − ${fromValue}%) = ${fmt(result.energyAdded, 2)} kWh`,
              `From the grid = ${fmt(result.energyAdded, 2)} ÷ ${efficiency}% = ${fmt(result.energyFromGrid, 2)} kWh`,
              `Cost = ${fmt(result.energyFromGrid, 2)} kWh × ${priceValue} = ${money(result.cost)}`,
              `A full charge from empty would cost ${money((batteryValue / (efficiency / 100)) * priceValue)}`,
            ]}
          />
        </div>
      );
    } else {
      output = <EmptyResult message="Enter a battery size, a start level below the end level (0–100%), and a price." />;
    }
  } else {
    const consumption = parseNumber(values.consumption);
    const distance = parseNumber(values.distance);
    const fuel = parseNumber(values.fuel);
    const fuelPrice = parseNumber(values.fuelPrice);
    const home = parseNumber(homePrice);
    const away = parseNumber(publicPrice);
    const valid =
      consumption !== null && consumption > 0 && distance !== null && distance >= 0 && home !== null && home >= 0 && away !== null && away >= 0;

    if (valid) {
      // Consumption per single distance unit, as shown on the dashboard (before charging losses).
      const perUnit = system === "uk" ? 1 / consumption : consumption / 100;
      const blendedPrice = home * (1 - publicShare / 100) + away * (publicShare / 100);
      const evPerUnit = gridKwhPerUnit(perUnit, efficiency) * blendedPrice;

      const fuelValid = fuel !== null && fuel > 0 && fuelPrice !== null && fuelPrice >= 0;
      const fuelPerUnit = !fuelValid
        ? null
        : system === "metric"
          ? (fuel / 100) * fuelPrice
          : system === "us"
            ? fuelPrice / fuel
            : (LITRES_PER_UK_GALLON / fuel) * fuelPrice;

      output = (
        <div className="space-y-4">
          <ResultCard
            label={`Charging cost for ${fmt(distance, 0)} ${units.distance}`}
            value={money(evPerUnit * distance)}
            sublabel={`${money(evPerUnit * 100)} per 100 ${units.distance}, at a blended ${fmt(blendedPrice, 3)} per kWh.`}
            breakdown={
              fuelPerUnit !== null
                ? [
                    { label: `Petrol car for ${fmt(distance, 0)} ${units.distance}`, value: money(fuelPerUnit * distance) },
                    {
                      label: fuelPerUnit * distance >= evPerUnit * distance ? "Saving with the EV" : "Extra cost with the EV",
                      value: money(Math.abs(fuelPerUnit - evPerUnit) * distance),
                    },
                  ]
                : undefined
            }
          />
          <StatGrid className="sm:grid-cols-3">
            <Stat label={`EV per ${units.distance}`} value={money(evPerUnit)} />
            <Stat label={`Petrol per ${units.distance}`} value={fuelPerUnit !== null ? money(fuelPerUnit) : "—"} />
            <Stat label="Per year at this rate" value={money(evPerUnit * distance * 12)} hint="If the distance is monthly" />
          </StatGrid>
        </div>
      );
    } else {
      output = <EmptyResult message="Enter your car's consumption above zero, a distance and electricity prices." />;
    }
  }

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="flex flex-wrap gap-3">
          <Segmented
            name="ev-mode"
            ariaLabel="What to calculate"
            value={mode}
            onChange={setMode}
            options={[
              { value: "charge", label: "One charge" },
              { value: "distance", label: "Cost per distance" },
            ]}
            className="sm:w-80"
          />
          {mode === "distance" ? (
            <Segmented
              name="ev-system"
              ariaLabel="Units"
              value={system}
              onChange={(value) => {
                setSystem(value);
                setValues(SYSTEMS[value].defaults);
              }}
              options={(Object.keys(SYSTEMS) as System[]).map((key) => ({ value: key, label: SYSTEMS[key].label }))}
              className="sm:w-[26rem]"
            />
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mode === "charge" ? (
            <>
              <NumberField id="ev-battery" label="Battery size" value={battery} onChange={setBattery} suffix="kWh" min={0} />
              <NumberField id="ev-from" label="Charge from" value={from} onChange={setFrom} suffix="%" min={0} max={100} />
              <NumberField id="ev-to" label="Charge to" value={to} onChange={setTo} suffix="%" min={0} max={100} />
            </>
          ) : (
            <>
              <NumberField id="ev-consumption" label="Car's consumption" value={values.consumption} onChange={set("consumption")} suffix={units.consumption} min={0} />
              <NumberField id="ev-distance" label="Distance per month" value={values.distance} onChange={set("distance")} suffix={units.distance} min={0} />
              <NumberField id="ev-public-price" label="Public charging price" value={publicPrice} onChange={setPublicPrice} suffix="/kWh" min={0} />
              <NumberField id="ev-fuel" label="Petrol car economy" value={values.fuel} onChange={set("fuel")} suffix={units.fuel} min={0} hint="Optional, to compare." />
              <NumberField id="ev-fuel-price" label={`Fuel price ${units.fuelPrice}`} value={values.fuelPrice} onChange={set("fuelPrice")} min={0} />
            </>
          )}
          <NumberField id="ev-home-price" label="Home electricity price" value={homePrice} onChange={setHomePrice} suffix="/kWh" min={0} />
          <CurrencySelect value={currency} onChange={setCurrency} id="ev-currency" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Slider
            label="Charging efficiency"
            valueLabel={`${efficiency}%`}
            min={70}
            max={100}
            value={efficiency}
            onChange={(event) => setEfficiency(Number(event.target.value))}
          />
          {mode === "distance" ? (
            <Slider
              label="Share charged at public chargers"
              valueLabel={`${publicShare}%`}
              min={0}
              max={100}
              step={5}
              value={publicShare}
              onChange={(event) => setPublicShare(Number(event.target.value))}
            />
          ) : null}
        </div>

        {output}
      </div>
    </ToolFrame>
  );
}
