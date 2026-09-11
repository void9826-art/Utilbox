"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Segmented } from "@/components/ui/field";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import {
  CC_PER_CUBIC_INCH,
  ENGINE_TYPES,
  WATTS_PER_HP,
  convertPower,
  estimateHorsepower,
  type PowerUnit,
} from "@/lib/sizing";
import { formatNumber } from "@/lib/utils";

import { EmptyResult, NumberField, ResultCard, SelectField, Working, parseNumber } from "../calculators/_shared";

type DisplacementUnit = "cc" | "l" | "cuin";

const DISPLACEMENT_UNITS: Array<{ value: DisplacementUnit; label: string }> = [
  { value: "cc", label: "cc" },
  { value: "l", label: "Litres" },
  { value: "cuin", label: "Cubic inches" },
];

const round = (value: number, digits = 0) => formatNumber(value, { maximumFractionDigits: digits, minimumFractionDigits: digits });

export default function EngineCcToHp() {
  const [amount, setAmount] = React.useState("1500");
  const [unit, setUnit] = React.useState<DisplacementUnit>("cc");
  const [type, setType] = React.useState("turbo-petrol");
  const [power, setPower] = React.useState("100");
  const [powerUnit, setPowerUnit] = React.useState<PowerUnit>("ps");

  const amountValue = parseNumber(amount);
  const cc =
    amountValue === null ? null : unit === "cc" ? amountValue : unit === "l" ? amountValue * 1000 : amountValue * CC_PER_CUBIC_INCH;
  const valid = cc !== null && cc > 0 && cc <= 100_000;

  const engine = ENGINE_TYPES.find((entry) => entry.id === type) ?? ENGINE_TYPES[0];
  const estimate = valid ? estimateHorsepower(cc, type) : null;

  const powerValue = parseNumber(power);
  const converted = powerValue !== null && powerValue >= 0 ? convertPower(powerValue, powerUnit) : null;

  return (
    <ToolFrame>
      <div className="space-y-6">
        <section className="space-y-4" aria-labelledby="engine-size-heading">
          <h2 id="engine-size-heading" className="text-[0.8125rem] font-semibold tracking-wide text-fg-subtle uppercase">
            Engine size and estimated power
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <NumberField id="engine-amount" label="Engine size" value={amount} onChange={setAmount} min={0} step="any" />
            <div className="space-y-1.5">
              <span className="block text-[0.8125rem] font-medium text-fg">Unit</span>
              <Segmented name="engine-unit" ariaLabel="Displacement unit" value={unit} onChange={setUnit} options={DISPLACEMENT_UNITS} />
            </div>
            <SelectField label="Engine type" id="engine-type" value={type} onChange={setType}>
              {ENGINE_TYPES.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </SelectField>
          </div>

          {valid && estimate ? (
            <div className="space-y-4">
              <ResultCard
                label="Engine size"
                value={`${round(cc / 1000, 2)} L`}
                sublabel={`${round(cc, 0)} cc · ${round(cc / CC_PER_CUBIC_INCH, 1)} cubic inches`}
                breakdown={[
                  { label: "Estimated power range", value: `${round(estimate.low)}–${round(estimate.high)} hp` },
                  {
                    label: "Typical for this type",
                    value: `${round(estimate.typical)} hp (${round((estimate.typical * WATTS_PER_HP) / 1000)} kW)`,
                  },
                ]}
              />
              <Working
                lines={[
                  `Litres = ${round(cc, 0)} ÷ 1000 = ${round(cc / 1000, 3)}`,
                  `Cubic inches = ${round(cc, 0)} ÷ 16.387064 = ${round(cc / CC_PER_CUBIC_INCH, 2)}`,
                  `${engine.label}: ${engine.low}–${engine.high} hp per litre, typically ${engine.typical}`,
                  `Estimate = ${round(cc / 1000, 3)} × ${engine.low}…${engine.high} = ${round(estimate.low)}–${round(estimate.high)} hp`,
                ]}
              />
            </div>
          ) : (
            <EmptyResult message="Enter an engine size greater than zero." />
          )}

          <Alert tone="info" title="Horsepower is an estimate">
            Displacement alone does not determine power — turbocharging, rev limits and tuning matter as much. Use the
            manufacturer&apos;s rated figure for a specific engine.
          </Alert>
        </section>

        <section className="space-y-4 border-t border-border pt-5" aria-labelledby="engine-power-heading">
          <h2 id="engine-power-heading" className="text-[0.8125rem] font-semibold tracking-wide text-fg-subtle uppercase">
            Convert a power figure
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField id="engine-power" label="Power" value={power} onChange={setPower} min={0} step="any" />
            <div className="space-y-1.5">
              <span className="block text-[0.8125rem] font-medium text-fg">Unit</span>
              <Segmented
                name="engine-power-unit"
                ariaLabel="Power unit"
                value={powerUnit}
                onChange={setPowerUnit}
                options={[
                  { value: "hp", label: "hp" },
                  { value: "ps", label: "PS" },
                  { value: "kw", label: "kW" },
                ]}
              />
            </div>
          </div>
          {converted ? (
            <StatGrid className="sm:grid-cols-3" aria-live="polite">
              <Stat label="Horsepower (hp, bhp)" value={round(converted.hp, 1)} emphasis={powerUnit !== "hp"} />
              <Stat label="Metric horsepower (PS)" value={round(converted.ps, 1)} emphasis={powerUnit !== "ps"} />
              <Stat label="Kilowatts (kW)" value={round(converted.kw, 1)} emphasis={powerUnit !== "kw"} />
            </StatGrid>
          ) : (
            <EmptyResult message="Enter a power figure of zero or more." />
          )}
        </section>
      </div>
    </ToolFrame>
  );
}
