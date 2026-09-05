"use client";

import * as React from "react";

import { ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import { formatNumber } from "@/lib/utils";

import { EmptyResult, NumberField, ResultCard, Working, parseNumber } from "./_shared";

export default function AttendanceCalculator() {
  const [held, setHeld] = React.useState("52");
  const [attended, setAttended] = React.useState("38");
  const [required, setRequired] = React.useState("75");
  const [remaining, setRemaining] = React.useState("20");

  const heldValue = parseNumber(held);
  const attendedValue = parseNumber(attended);
  const requiredValue = parseNumber(required);
  const remainingValue = parseNumber(remaining);

  const tooManyAttended =
    heldValue !== null && attendedValue !== null && attendedValue > heldValue;

  const result = React.useMemo(() => {
    if (
      heldValue === null ||
      attendedValue === null ||
      requiredValue === null ||
      heldValue <= 0 ||
      attendedValue < 0 ||
      attendedValue > heldValue ||
      requiredValue <= 0 ||
      requiredValue >= 100
    ) {
      return null;
    }

    const current = (attendedValue / heldValue) * 100;
    const rate = requiredValue / 100;
    const above = current >= requiredValue;

    // How many classes can be skipped while staying at or above the requirement.
    const canSkip = above ? Math.floor(attendedValue / rate - heldValue) : 0;

    // How many consecutive classes must be attended to reach the requirement.
    const mustAttend = above ? 0 : Math.ceil((rate * heldValue - attendedValue) / (1 - rate));

    const upcoming = remainingValue !== null && remainingValue > 0 ? remainingValue : null;
    const reachable = upcoming === null ? null : mustAttend <= upcoming;

    // Best possible final percentage if every remaining class is attended.
    const bestPossible =
      upcoming === null ? null : ((attendedValue + upcoming) / (heldValue + upcoming)) * 100;

    return { current, canSkip, mustAttend, above, upcoming, reachable, bestPossible, rate };
  }, [attendedValue, heldValue, remainingValue, requiredValue]);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NumberField
            id="attendance-held"
            label="Classes held"
            value={held}
            onChange={setHeld}
            min={1}
            step={1}
            inputMode="numeric"
          />
          <NumberField
            id="attendance-attended"
            label="Classes attended"
            value={attended}
            onChange={setAttended}
            min={0}
            step={1}
            inputMode="numeric"
            error={tooManyAttended ? "You cannot attend more classes than were held." : null}
          />
          <NumberField
            id="attendance-required"
            label="Required attendance"
            value={required}
            onChange={setRequired}
            suffix="%"
            min={1}
            max={99}
          />
          <NumberField
            id="attendance-remaining"
            label="Classes still to come"
            value={remaining}
            onChange={setRemaining}
            min={0}
            step={1}
            inputMode="numeric"
            hint="Optional"
          />
        </div>

        {result ? (
          <div className="space-y-4">
            <ResultCard
              label="Current attendance"
              value={`${result.current.toFixed(2)}%`}
              sublabel={
                result.above
                  ? `You are ${(result.current - (requiredValue ?? 0)).toFixed(2)} points above the requirement.`
                  : `You are ${((requiredValue ?? 0) - result.current).toFixed(2)} points below the requirement.`
              }
              breakdown={[
                { label: "Attended", value: `${formatNumber(attendedValue ?? 0)} of ${formatNumber(heldValue ?? 0)}` },
                { label: "Missed", value: formatNumber((heldValue ?? 0) - (attendedValue ?? 0)) },
              ]}
            />

            {result.above ? (
              <Alert
                tone={result.canSkip > 0 ? "success" : "warning"}
                title={
                  result.canSkip > 0
                    ? `You can miss ${result.canSkip} more class${result.canSkip === 1 ? "" : "es"}`
                    : "You are right on the line"
                }
              >
                {result.canSkip > 0
                  ? `Missing ${result.canSkip} more would leave you at ${(((attendedValue ?? 0) / ((heldValue ?? 0) + result.canSkip)) * 100).toFixed(2)}%, still at or above ${required}%.`
                  : `Missing even one more class would drop you below ${required}%.`}
              </Alert>
            ) : result.reachable === false ? (
              <Alert tone="danger" title="The requirement cannot be met this term">
                You would need to attend {result.mustAttend} more classes in a row, but only{" "}
                {result.upcoming} remain. Attending every one of them would take you to{" "}
                {result.bestPossible?.toFixed(2)}%.
              </Alert>
            ) : (
              <Alert
                tone="warning"
                title={`Attend the next ${result.mustAttend} class${result.mustAttend === 1 ? "" : "es"} without missing one`}
              >
                That brings you to{" "}
                {(
                  (((attendedValue ?? 0) + result.mustAttend) / ((heldValue ?? 0) + result.mustAttend)) *
                  100
                ).toFixed(2)}
                %, at or above the {required}% requirement.
              </Alert>
            )}

            <StatGrid className="sm:grid-cols-4">
              <Stat label="Current" value={`${result.current.toFixed(1)}%`} emphasis />
              <Stat label="Required" value={`${required}%`} />
              <Stat
                label={result.above ? "Can still miss" : "Must attend"}
                value={result.above ? formatNumber(result.canSkip) : formatNumber(result.mustAttend)}
              />
              <Stat
                label="Best possible"
                value={result.bestPossible === null ? "—" : `${result.bestPossible.toFixed(1)}%`}
                hint={result.bestPossible === null ? "Enter remaining classes" : "If you attend every remaining class"}
              />
            </StatGrid>

            <Working
              lines={
                result.above
                  ? [
                      `Current  : ${attendedValue} ÷ ${heldValue} × 100 = ${result.current.toFixed(2)}%`,
                      `Can skip : ⌊${attendedValue} ÷ ${result.rate} − ${heldValue}⌋ = ${result.canSkip}`,
                    ]
                  : [
                      `Current    : ${attendedValue} ÷ ${heldValue} × 100 = ${result.current.toFixed(2)}%`,
                      `Must attend: ⌈(${result.rate} × ${heldValue} − ${attendedValue}) ÷ (1 − ${result.rate})⌉`,
                      `           = ⌈${(result.rate * (heldValue ?? 0) - (attendedValue ?? 0)).toFixed(2)} ÷ ${(1 - result.rate).toFixed(2)}⌉ = ${result.mustAttend}`,
                    ]
              }
            />
          </div>
        ) : (
          <EmptyResult message="Enter the classes held, the classes attended, and a requirement between 1% and 99%." />
        )}

        <div className="flex justify-end">
          <ResetButton
            onReset={() => {
              setHeld("");
              setAttended("");
              setRequired("75");
              setRemaining("");
            }}
          >
            Clear
          </ResetButton>
        </div>
      </div>
    </ToolFrame>
  );
}
