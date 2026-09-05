"use client";

import * as React from "react";
import { Download } from "lucide-react";

import { ErrorMessage } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Slider } from "@/components/ui/field";
import { Alert, Badge } from "@/components/ui/surfaces";
import { downloadBlob, downloadText } from "@/lib/download";

import { SelectField } from "../calculators/_shared";

interface Format {
  id: string;
  label: string;
  sample: string;
  hint: string;
  /** Returns an error message, or null when the value is acceptable. */
  validate: (value: string) => string | null;
}

/** GS1 modulo-10 check digit, used by EAN and UPC. */
function gs1CheckDigit(digits: string): number {
  let sum = 0;
  // Weights alternate 3,1 from the right-hand end.
  for (let index = digits.length - 1, weight = 3; index >= 0; index -= 1, weight = weight === 3 ? 1 : 3) {
    sum += Number(digits[index]) * weight;
  }
  return (10 - (sum % 10)) % 10;
}

function validateGs1(value: string, length: number, name: string): string | null {
  if (!/^\d+$/.test(value)) return `${name} accepts digits only.`;
  if (value.length === length - 1) return null;
  if (value.length !== length) {
    return `${name} needs ${length - 1} digits (the check digit is added) or ${length} with it.`;
  }
  const expected = gs1CheckDigit(value.slice(0, length - 1));
  if (Number(value[length - 1]) !== expected) {
    return `The check digit should be ${expected}, not ${value[length - 1]}.`;
  }
  return null;
}

const FORMATS: Format[] = [
  {
    id: "CODE128",
    label: "CODE128 — any text",
    sample: "UTILBOX-2026",
    hint: "The general-purpose format for shipping, warehouse and asset labels.",
    validate: (value) =>
      value.length === 0
        ? "Enter a value."
        : /^[\x20-\x7e]+$/.test(value)
          ? null
          : "CODE128 supports printable ASCII characters only.",
  },
  {
    id: "EAN13",
    label: "EAN-13 — retail products",
    sample: "590123412345",
    hint: "The barcode on products sold outside North America.",
    validate: (value) => validateGs1(value, 13, "EAN-13"),
  },
  {
    id: "EAN8",
    label: "EAN-8 — small packages",
    sample: "9638507",
    hint: "A shorter retail code for products too small for EAN-13.",
    validate: (value) => validateGs1(value, 8, "EAN-8"),
  },
  {
    id: "UPC",
    label: "UPC-A — North American retail",
    sample: "03600029145",
    hint: "The retail barcode used in the United States and Canada.",
    validate: (value) => validateGs1(value, 12, "UPC-A"),
  },
  {
    id: "ITF14",
    label: "ITF-14 — shipping cartons",
    sample: "1234567890123",
    hint: "Applied to outer cases and cartons rather than individual products.",
    validate: (value) => validateGs1(value, 14, "ITF-14"),
  },
  {
    id: "CODE39",
    label: "CODE39 — legacy systems",
    sample: "UTILBOX 123",
    hint: "An older format still common in automotive and defence logistics.",
    validate: (value) =>
      /^[0-9A-Z\-. $/+%]*$/.test(value)
        ? value.length > 0
          ? null
          : "Enter a value."
        : "CODE39 accepts digits, capital letters, and - . $ / + % and space.",
  },
  {
    id: "codabar",
    label: "Codabar — libraries and labs",
    sample: "A123456789B",
    hint: "Used for blood banks, photo labs and library cards.",
    validate: (value) =>
      /^[A-Da-d][0-9\-$:/.+]*[A-Da-d]$/.test(value)
        ? null
        : "Codabar values start and end with a letter A–D, with digits in between.",
  },
];

export default function BarcodeGenerator() {
  const [formatId, setFormatId] = React.useState("CODE128");
  const [value, setValue] = React.useState("UTILBOX-2026");
  const [width, setWidth] = React.useState(2);
  const [height, setHeight] = React.useState(80);
  const [showText, setShowText] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [rendered, setRendered] = React.useState(false);
  const svgRef = React.useRef<SVGSVGElement>(null);

  const format = FORMATS.find((item) => item.id === formatId) ?? FORMATS[0];
  const validationError = format.validate(value.trim());

  React.useEffect(() => {
    let cancelled = false;

    async function render() {
      const element = svgRef.current;
      if (!element) return;

      if (validationError) {
        setRendered(false);
        element.replaceChildren();
        return;
      }

      try {
        // Loaded on demand so the library stays out of the initial bundle.
        const JsBarcode = (await import("jsbarcode")).default;
        if (cancelled) return;

        JsBarcode(element, value.trim(), {
          format: formatId,
          width,
          height,
          displayValue: showText,
          margin: 10,
          background: "#ffffff",
          lineColor: "#000000",
          fontSize: 16,
          font: "system-ui, sans-serif",
        });
        setRendered(true);
        setError(null);
      } catch (caught) {
        if (cancelled) return;
        setRendered(false);
        element.replaceChildren();
        setError(
          caught instanceof Error
            ? `That value cannot be encoded as ${format.label.split(" —")[0]}.`
            : "The barcode could not be generated.",
        );
      }
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, [format.label, formatId, height, showText, validationError, value, width]);

  const checkDigitPreview = React.useMemo(() => {
    const trimmed = value.trim();
    if (!/^\d+$/.test(trimmed)) return null;
    const lengths: Record<string, number> = { EAN13: 13, EAN8: 8, UPC: 12, ITF14: 14 };
    const target = lengths[formatId];
    if (!target || trimmed.length !== target - 1) return null;
    return gs1CheckDigit(trimmed);
  }, [formatId, value]);

  const downloadSvg = () => {
    const element = svgRef.current;
    if (!element) return;
    downloadText(new XMLSerializer().serializeToString(element), "barcode.svg", "image/svg+xml");
  };

  const downloadPng = () => {
    const element = svgRef.current;
    if (!element) return;

    const markup = new XMLSerializer().serializeToString(element);
    const image = new Image();
    const blob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    image.onload = () => {
      const canvas = document.createElement("canvas");
      // Render at 3× for a crisp printable bitmap.
      canvas.width = image.width * 3;
      canvas.height = image.height * 3;
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((output) => {
          if (output) downloadBlob(output, "barcode.png");
        }, "image/png");
      }
      URL.revokeObjectURL(url);
    };
    image.onerror = () => URL.revokeObjectURL(url);
    image.src = url;
  };

  return (
    <ToolFrame>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-4">
          <SelectField
            label="Barcode format"
            id="barcode-format"
            value={formatId}
            onChange={(next) => {
              setFormatId(next);
              const chosen = FORMATS.find((item) => item.id === next);
              if (chosen) setValue(chosen.sample);
            }}
            hint={format.hint}
          >
            {FORMATS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </SelectField>

          <Field
            label="Value to encode"
            htmlFor="barcode-value"
            error={value.trim() ? validationError : null}
            hint={
              checkDigitPreview !== null
                ? `A check digit of ${checkDigitPreview} will be added automatically.`
                : undefined
            }
          >
            <Input
              id="barcode-value"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="font-mono"
              autoComplete="off"
              spellCheck={false}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Slider
              label="Bar width"
              valueLabel={`${width} px`}
              min={1}
              max={5}
              value={width}
              onChange={(event) => setWidth(Number(event.target.value))}
            />
            <Slider
              label="Height"
              valueLabel={`${height} px`}
              min={30}
              max={200}
              step={10}
              value={height}
              onChange={(event) => setHeight(Number(event.target.value))}
            />
          </div>

          <Checkbox
            label="Show the value under the bars"
            description="Lets a person read the code when a scanner fails."
            checked={showText}
            onChange={(event) => setShowText(event.target.checked)}
          />

          <ErrorMessage message={error} />

          <Alert tone="info" title="Retail barcodes need a registered number">
            Any value here will scan, but retail systems identify products by their GS1-allocated number.
            For selling through shops you need a number issued to you; for internal stock, labels and asset
            tags, any value is fine.
          </Alert>
        </div>

        <aside className="min-w-0 space-y-3">
          <h2 className="text-[0.8125rem] font-medium text-fg">Preview</h2>

          <div className="flex min-h-40 items-center justify-center overflow-x-auto rounded-[var(--radius-card)] border border-border bg-white p-4">
            <svg ref={svgRef} role="img" aria-label={rendered ? `Barcode for ${value}` : "Barcode preview"} />
            {!rendered ? (
              <p className="px-4 text-center text-sm text-neutral-500">
                {validationError ?? "Enter a value to see the barcode."}
              </p>
            ) : null}
          </div>

          {rendered ? (
            <>
              <Badge tone="success">Valid {format.label.split(" —")[0]}</Badge>
              <div className="flex flex-col gap-2">
                <Button type="button" onClick={downloadPng} fullWidth>
                  <Download className="size-4" aria-hidden="true" />
                  Download PNG
                </Button>
                <Button type="button" variant="secondary" onClick={downloadSvg} fullWidth>
                  <Download className="size-4" aria-hidden="true" />
                  Download SVG
                </Button>
              </div>
              <p className="text-xs text-fg-subtle">
                The preview is always on white, because scanners need dark bars on a light background.
              </p>
            </>
          ) : null}
        </aside>
      </div>
    </ToolFrame>
  );
}
