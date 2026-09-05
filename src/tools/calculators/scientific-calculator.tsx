"use client";

import * as React from "react";
import { Delete, History } from "lucide-react";

import { CopyButton, ErrorMessage } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/field";
import { ExpressionError, evaluateExpression, formatResult, type AngleMode } from "@/lib/expression";
import { cn } from "@/lib/utils";

interface KeyDefinition {
  label: React.ReactNode;
  /** Text inserted at the caret. */
  insert?: string;
  action?: "clear" | "backspace" | "equals" | "answer";
  tone?: "default" | "function" | "operator" | "primary";
  wide?: boolean;
  ariaLabel?: string;
}

const SCIENTIFIC_KEYS: KeyDefinition[] = [
  { label: "sin", insert: "sin(", tone: "function" },
  { label: "cos", insert: "cos(", tone: "function" },
  { label: "tan", insert: "tan(", tone: "function" },
  { label: "ln", insert: "ln(", tone: "function" },
  { label: "log", insert: "log(", tone: "function" },

  { label: "asin", insert: "asin(", tone: "function" },
  { label: "acos", insert: "acos(", tone: "function" },
  { label: "atan", insert: "atan(", tone: "function" },
  { label: "√", insert: "sqrt(", tone: "function", ariaLabel: "Square root" },
  { label: "∛", insert: "cbrt(", tone: "function", ariaLabel: "Cube root" },

  { label: "xʸ", insert: "^", tone: "function", ariaLabel: "Power" },
  { label: "x²", insert: "^2", tone: "function", ariaLabel: "Squared" },
  { label: "n!", insert: "!", tone: "function", ariaLabel: "Factorial" },
  { label: "π", insert: "pi", tone: "function" },
  { label: "e", insert: "e", tone: "function" },
];

const NUMPAD_KEYS: KeyDefinition[] = [
  { label: "AC", action: "clear", tone: "operator", ariaLabel: "Clear everything" },
  { label: "(", insert: "(", tone: "operator" },
  { label: ")", insert: ")", tone: "operator" },
  { label: "÷", insert: "/", tone: "operator", ariaLabel: "Divide" },

  { label: "7", insert: "7" },
  { label: "8", insert: "8" },
  { label: "9", insert: "9" },
  { label: "×", insert: "*", tone: "operator", ariaLabel: "Multiply" },

  { label: "4", insert: "4" },
  { label: "5", insert: "5" },
  { label: "6", insert: "6" },
  { label: "−", insert: "-", tone: "operator", ariaLabel: "Subtract" },

  { label: "1", insert: "1" },
  { label: "2", insert: "2" },
  { label: "3", insert: "3" },
  { label: "+", insert: "+", tone: "operator", ariaLabel: "Add" },

  { label: "0", insert: "0" },
  { label: ".", insert: "." },
  { label: "%", insert: "%", tone: "operator", ariaLabel: "Remainder" },
  { label: "=", action: "equals", tone: "primary", ariaLabel: "Calculate" },
];

interface HistoryEntry {
  expression: string;
  result: string;
}

export default function ScientificCalculator() {
  const [expression, setExpression] = React.useState("");
  const [mode, setMode] = React.useState<AngleMode>("deg");
  const [error, setError] = React.useState<string | null>(null);
  const [history, setHistory] = React.useState<HistoryEntry[]>([]);
  const [memory, setMemory] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Live preview: evaluated on every change, but never shown as an error.
  const preview = React.useMemo(() => {
    if (!expression.trim()) return null;
    try {
      return formatResult(evaluateExpression(expression, mode));
    } catch {
      return null;
    }
  }, [expression, mode]);

  const insert = React.useCallback((text: string) => {
    const input = inputRef.current;
    setError(null);

    if (!input) {
      setExpression((previous) => previous + text);
      return;
    }

    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;

    setExpression((previous) => previous.slice(0, start) + text + previous.slice(end));

    // Restore the caret after React has applied the new value.
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start + text.length, start + text.length);
    });
  }, []);

  const calculate = React.useCallback(() => {
    if (!expression.trim()) return;
    try {
      const value = evaluateExpression(expression, mode);
      const formatted = formatResult(value);
      setHistory((previous) => [{ expression, result: formatted }, ...previous].slice(0, 40));
      setExpression(formatted);
      setError(null);
      requestAnimationFrame(() => {
        const input = inputRef.current;
        input?.focus();
        input?.setSelectionRange(formatted.length, formatted.length);
      });
    } catch (caught) {
      setError(
        caught instanceof ExpressionError ? caught.message : "That expression could not be calculated.",
      );
    }
  }, [expression, mode]);

  const backspace = () => {
    const input = inputRef.current;
    setError(null);
    if (!input) {
      setExpression((previous) => previous.slice(0, -1));
      return;
    }
    const start = input.selectionStart ?? expression.length;
    const end = input.selectionEnd ?? expression.length;

    if (start !== end) {
      setExpression((previous) => previous.slice(0, start) + previous.slice(end));
      requestAnimationFrame(() => input.setSelectionRange(start, start));
      return;
    }
    if (start === 0) return;
    setExpression((previous) => previous.slice(0, start - 1) + previous.slice(start));
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start - 1, start - 1);
    });
  };

  const handleKey = (key: KeyDefinition) => {
    if (key.insert !== undefined) {
      insert(key.insert);
      return;
    }
    switch (key.action) {
      case "clear":
        setExpression("");
        setError(null);
        inputRef.current?.focus();
        break;
      case "backspace":
        backspace();
        break;
      case "equals":
        calculate();
        break;
      case "answer":
        if (history[0]) insert(history[0].result);
        break;
    }
  };

  const toneClass = (tone: KeyDefinition["tone"]) => {
    switch (tone) {
      case "primary":
        return "bg-accent text-accent-fg hover:bg-accent-hover";
      case "operator":
        return "bg-surface-sunken text-fg hover:bg-bg-muted";
      case "function":
        return "bg-surface-sunken text-accent-text hover:bg-accent-soft text-[0.8125rem]";
      default:
        return "bg-surface text-fg hover:bg-bg-muted";
    }
  };

  return (
    <ToolFrame>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0 space-y-3">
          <div className="rounded-lg border border-border bg-surface-sunken p-3">
            <div className="flex items-center justify-between gap-3">
              <Segmented
                name="calc-angle-mode"
                ariaLabel="Angle mode"
                value={mode}
                onChange={setMode}
                options={[
                  { value: "deg", label: "DEG" },
                  { value: "rad", label: "RAD" },
                ]}
                className="w-32"
              />
              <span className="tabular text-xs text-fg-subtle">
                {memory !== 0 ? `M = ${formatResult(memory)}` : " "}
              </span>
            </div>

            <label htmlFor="calc-expression" className="sr-only">
              Expression
            </label>
            <input
              ref={inputRef}
              id="calc-expression"
              value={expression}
              onChange={(event) => {
                setExpression(event.target.value);
                setError(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  calculate();
                }
                if (event.key === "Escape") {
                  event.preventDefault();
                  setExpression("");
                  setError(null);
                }
              }}
              placeholder="Type an expression, e.g. 2 * (3 + 4)^2"
              inputMode="text"
              autoComplete="off"
              spellCheck={false}
              aria-describedby="calc-preview"
              className="tabular mt-3 w-full bg-transparent text-right font-mono text-2xl text-fg outline-none placeholder:text-[0.9375rem] placeholder:font-sans placeholder:text-fg-subtle sm:text-3xl"
            />

            <p
              id="calc-preview"
              aria-live="polite"
              className="tabular mt-1 min-h-6 text-right font-mono text-sm text-fg-muted"
            >
              {preview !== null && preview !== expression.trim() ? `= ${preview}` : " "}
            </p>
          </div>

          <ErrorMessage message={error} onDismiss={() => setError(null)} />

          <div className="grid grid-cols-5 gap-1.5">
            {SCIENTIFIC_KEYS.map((key, index) => (
              <CalculatorKey key={index} definition={key} onPress={handleKey} toneClass={toneClass} />
            ))}
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {NUMPAD_KEYS.map((key, index) => (
              <CalculatorKey key={index} definition={key} onPress={handleKey} toneClass={toneClass} />
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            <Button type="button" variant="secondary" size="sm" onClick={() => setMemory(0)}>
              MC
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => insert(formatResult(memory))}
            >
              MR
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                if (preview !== null) setMemory((previous) => previous + Number(preview));
              }}
            >
              M+
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                if (preview !== null) setMemory((previous) => previous - Number(preview));
              }}
            >
              M−
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={backspace}>
              <Delete className="size-4" aria-hidden="true" />
              Backspace
            </Button>
            {expression ? <CopyButton value={preview ?? expression} label="Copy result" /> : null}
          </div>
        </div>

        <aside className="min-w-0">
          <div className="flex items-center justify-between gap-2">
            {/* h2, not h3: this is the first heading under the page h1, and
                jumping a level leaves a screen reader announcing a subsection
                of nothing. */}
            <h2 className="flex items-center gap-1.5 text-[0.8125rem] font-semibold text-fg">
              <History className="size-3.5 text-fg-subtle" aria-hidden="true" />
              History
            </h2>
            {history.length > 0 ? (
              <button
                type="button"
                onClick={() => setHistory([])}
                className="text-xs text-fg-muted underline underline-offset-2 hover:text-fg"
              >
                Clear
              </button>
            ) : null}
          </div>

          {history.length === 0 ? (
            <p className="mt-2 rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-fg-subtle">
              Calculations you run will appear here.
            </p>
          ) : (
            <ul className="scrollbar-slim mt-2 max-h-96 space-y-1 overflow-y-auto">
              {history.map((entry, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => {
                      setExpression(entry.expression);
                      setError(null);
                      inputRef.current?.focus();
                    }}
                    className="w-full rounded-md border border-border bg-surface px-2.5 py-2 text-right transition-colors hover:border-border-strong hover:bg-bg-muted"
                  >
                    <span className="tabular block truncate font-mono text-[0.6875rem] text-fg-subtle">
                      {entry.expression}
                    </span>
                    <span className="tabular block truncate font-mono text-sm font-medium text-fg">
                      = {entry.result}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </ToolFrame>
  );
}

function CalculatorKey({
  definition,
  onPress,
  toneClass,
}: {
  definition: KeyDefinition;
  onPress: (key: KeyDefinition) => void;
  toneClass: (tone: KeyDefinition["tone"]) => string;
}) {
  return (
    <button
      type="button"
      onClick={() => onPress(definition)}
      aria-label={definition.ariaLabel}
      className={cn(
        "flex h-11 items-center justify-center rounded-lg border border-border font-medium transition-colors active:translate-y-px sm:h-12",
        toneClass(definition.tone),
      )}
    >
      {definition.label}
    </button>
  );
}
