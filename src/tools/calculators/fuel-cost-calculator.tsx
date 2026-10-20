"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Checkbox } from "@/components/ui/field";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import { tripCost, type DistanceUnit, type EconomyUnit, type PriceUnit } from "@/lib/fuel";
import { formatMoney } from "@/lib/money";
import { formatNumber } from "@/lib/utils";

import { CurrencySelect, EmptyResult, NumberField, ResultCard, SelectField, Working, parseNumber } from "./_shared";

const ECONOMY_LABELS: Record<EconomyUnit, string> = {
  l100km: "L/100 km",
  kml: "km per litre",
  mpgUS: "mpg (US)",
  mpgUK: "mpg (UK)",
};

const PRICE_LABELS: Record<PriceUnit, string> = {
  litre: "per litre",
  galUS: "per US gallon",
  galUK: "per UK gallon",
};

export default function FuelCostCalculator() {
  const [distance, setDistance] = React.useState("350");
  const [distanceUnit, setDistanceUnit] = React.useState<DistanceUnit>("km");
  const [economy, setEconomy] = React.useState("6.5");
  const [economyUnit, setEconomyUnit] = React.useState<EconomyUnit>("l100km");
  const [price, setPrice] = React.useState("1.75");
  const [priceUnit, setPriceUnit] = React.useState<PriceUnit>("litre");
  const [roundTrip, setRoundTrip] = React.useState(false);
  const [people, setPeople] = React.useState("1");
  const [currency, setCurrency] = React.useState("EUR");

  const money = (value: number) => formatMoney(value, currency);
  const result = tripCost({
    distance: parseNumber(distance) ?? NaN,
    distanceUnit,
    economy: parseNumber(economy) ?? NaN,
    economyUnit,
    price: parseNumber(price) ?? NaN,
    priceUnit,
    roundTrip,
    people: parseNumber(people) ?? 1,
  });

  const fuelAmount = (value: { litres: number; usGallons: number; ukGallons: number }) =>
    priceUnit === "galUS"
      ? `${formatNumber(value.usGallons, { maximumFractionDigits: 2 })} US gal`
      : priceUnit === "galUK"
        ? `${formatNumber(value.ukGallons, { maximumFractionDigits: 2 })} UK gal`
        : `${formatNumber(value.litres, { maximumFractionDigits: 2 })} L`;

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid grid-cols-[1fr_auto] items-end gap-2">
            <NumberField id="fuel-distance" label="Distance" value={distance} onChange={setDistance} min={0} />
            <SelectField label={<span className="sr-only">Distance unit</span>} id="fuel-distance-unit" value={distanceUnit} onChange={(value) => setDistanceUnit(value as DistanceUnit)}>
              <option value="km">km</option>
              <option value="mi">miles</option>
            </SelectField>
          </div>
          <div className="grid grid-cols-[1fr_auto] items-end gap-2">
            <NumberField id="fuel-economy" label="Fuel economy" value={economy} onChange={setEconomy} min={0} />
            <SelectField label={<span className="sr-only">Fuel economy unit</span>} id="fuel-economy-unit" value={economyUnit} onChange={(value) => setEconomyUnit(value as EconomyUnit)}>
              {Object.entries(ECONOMY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </SelectField>
          </div>
          <div className="grid grid-cols-[1fr_auto] items-end gap-2">
            <NumberField id="fuel-price" label="Fuel price" value={price} onChange={setPrice} min={0} />
            <SelectField label={<span className="sr-only">Price unit</span>} id="fuel-price-unit" value={priceUnit} onChange={(value) => setPriceUnit(value as PriceUnit)}>
              {Object.entries(PRICE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </SelectField>
          </div>
          <NumberField id="fuel-people" label="People sharing the cost" value={people} onChange={setPeople} min={1} step={1} inputMode="numeric" />
          <div className="flex items-end">
            <Checkbox
              label="Return journey"
              description="Doubles the distance."
              checked={roundTrip}
              onChange={(event) => setRoundTrip(event.target.checked)}
            />
          </div>
          <CurrencySelect value={currency} onChange={setCurrency} id="fuel-currency" />
        </div>

        {result ? (
          <div className="space-y-4">
            <ResultCard
              label="Fuel cost"
              value={money(result.cost)}
              sublabel={`${fuelAmount(result)} of fuel for ${formatNumber(distanceUnit === "mi" ? result.km / 1.609344 : result.km, { maximumFractionDigits: 1 })} ${distanceUnit === "mi" ? "miles" : "km"}${roundTrip ? ", there and back" : ""}.`}
              breakdown={[
                { label: "Each person pays", value: money(result.costPerPerson) },
                {
                  label: distanceUnit === "mi" ? "Cost per mile" : "Cost per km",
                  value: money(distanceUnit === "mi" ? result.costPerMile : result.costPerKm),
                },
              ]}
            />
            <StatGrid className="sm:grid-cols-4">
              <Stat label="Litres" value={formatNumber(result.litres, { maximumFractionDigits: 2 })} />
              <Stat label="US gallons" value={formatNumber(result.usGallons, { maximumFractionDigits: 2 })} />
              <Stat label="UK gallons" value={formatNumber(result.ukGallons, { maximumFractionDigits: 2 })} />
              <Stat label="L/100 km" value={formatNumber(result.litresPer100km, { maximumFractionDigits: 2 })} />
            </StatGrid>
            <Working
              lines={[
                `distance = ${formatNumber(result.km, { maximumFractionDigits: 2 })} km`,
                `fuel = ${formatNumber(result.km, { maximumFractionDigits: 2 })} km × ${formatNumber(result.litresPer100km, { maximumFractionDigits: 3 })} L ÷ 100 km = ${formatNumber(result.litres, { maximumFractionDigits: 2 })} L`,
                `cost = fuel × price = ${money(result.cost)}`,
              ]}
            />
          </div>
        ) : (
          <EmptyResult message="Enter a distance, a fuel economy above zero and a fuel price." />
        )}
      </div>
    </ToolFrame>
  );
}
