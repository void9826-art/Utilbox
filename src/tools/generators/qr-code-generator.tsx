"use client";

import * as React from "react";
import { Download } from "lucide-react";

import { CopyButton, ErrorMessage } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Slider } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import { downloadBlob, downloadText } from "@/lib/download";
import { cn } from "@/lib/utils";

import { SelectField } from "../calculators/_shared";

type ContentType = "url" | "text" | "email" | "phone" | "sms" | "wifi" | "vcard";

const CONTENT_TYPES: Array<{ value: ContentType; label: string }> = [
  { value: "url", label: "Link" },
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "sms", label: "SMS" },
  { value: "wifi", label: "Wi-Fi" },
  { value: "vcard", label: "Contact" },
];

const ERROR_LEVELS = [
  { value: "L", label: "L — recovers ~7%" },
  { value: "M", label: "M — recovers ~15%" },
  { value: "Q", label: "Q — recovers ~25%" },
  { value: "H", label: "H — recovers ~30%" },
];

/** QR escaping for Wi-Fi and vCard payloads: \ ; , : and " are special. */
function escapeQrValue(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

interface Fields {
  url: string;
  text: string;
  emailTo: string;
  emailSubject: string;
  emailBody: string;
  phone: string;
  smsNumber: string;
  smsMessage: string;
  wifiSsid: string;
  wifiPassword: string;
  wifiSecurity: string;
  wifiHidden: boolean;
  vcardName: string;
  vcardOrg: string;
  vcardPhone: string;
  vcardEmail: string;
  vcardUrl: string;
}

const EMPTY_FIELDS: Fields = {
  url: "https://example.com",
  text: "",
  emailTo: "",
  emailSubject: "",
  emailBody: "",
  phone: "",
  smsNumber: "",
  smsMessage: "",
  wifiSsid: "",
  wifiPassword: "",
  wifiSecurity: "WPA",
  wifiHidden: false,
  vcardName: "",
  vcardOrg: "",
  vcardPhone: "",
  vcardEmail: "",
  vcardUrl: "",
};

function buildPayload(type: ContentType, fields: Fields): string {
  switch (type) {
    case "url":
      return fields.url.trim();
    case "text":
      return fields.text;
    case "email": {
      if (!fields.emailTo.trim()) return "";
      const params = new URLSearchParams();
      if (fields.emailSubject) params.set("subject", fields.emailSubject);
      if (fields.emailBody) params.set("body", fields.emailBody);
      const query = params.toString();
      return `mailto:${fields.emailTo.trim()}${query ? `?${query}` : ""}`;
    }
    case "phone":
      return fields.phone.trim() ? `tel:${fields.phone.replace(/\s/g, "")}` : "";
    case "sms":
      if (!fields.smsNumber.trim()) return "";
      return `SMSTO:${fields.smsNumber.replace(/\s/g, "")}:${fields.smsMessage}`;
    case "wifi": {
      if (!fields.wifiSsid.trim()) return "";
      const security = fields.wifiSecurity === "nopass" ? "nopass" : fields.wifiSecurity;
      const parts = [
        `T:${security}`,
        `S:${escapeQrValue(fields.wifiSsid)}`,
        security !== "nopass" ? `P:${escapeQrValue(fields.wifiPassword)}` : "",
        fields.wifiHidden ? "H:true" : "",
      ].filter(Boolean);
      return `WIFI:${parts.join(";")};;`;
    }
    case "vcard": {
      if (!fields.vcardName.trim()) return "";
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${fields.vcardName}`,
        fields.vcardOrg ? `ORG:${fields.vcardOrg}` : "",
        fields.vcardPhone ? `TEL:${fields.vcardPhone}` : "",
        fields.vcardEmail ? `EMAIL:${fields.vcardEmail}` : "",
        fields.vcardUrl ? `URL:${fields.vcardUrl}` : "",
        "END:VCARD",
      ].filter(Boolean);
      return lines.join("\n");
    }
  }
}

export default function QrCodeGenerator() {
  const [type, setType] = React.useState<ContentType>("url");
  const [fields, setFields] = React.useState<Fields>(EMPTY_FIELDS);
  const [size, setSize] = React.useState(320);
  const [margin, setMargin] = React.useState(2);
  const [errorLevel, setErrorLevel] = React.useState("M");
  const [dark, setDark] = React.useState("#000000");
  const [light, setLight] = React.useState("#ffffff");
  const [svg, setSvg] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const payload = React.useMemo(() => buildPayload(type, fields), [fields, type]);

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) =>
    setFields((previous) => ({ ...previous, [key]: value }));

  React.useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!payload) {
        setSvg("");
        setError(null);
        const canvas = canvasRef.current;
        if (canvas) canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      try {
        // Loaded on demand so the library is not in the page's initial bundle.
        const QRCode = (await import("qrcode")).default;
        if (cancelled) return;

        const options = {
          errorCorrectionLevel: errorLevel as "L" | "M" | "Q" | "H",
          margin,
          color: { dark, light },
          width: size,
        };

        if (canvasRef.current) {
          await QRCode.toCanvas(canvasRef.current, payload, options);
        }
        const markup = await QRCode.toString(payload, { ...options, type: "svg" });
        if (!cancelled) {
          setSvg(markup);
          setError(null);
        }
      } catch (caught) {
        if (cancelled) return;
        setSvg("");
        setError(
          caught instanceof Error && /too (long|big)|code length/i.test(caught.message)
            ? "That content is too long to fit in a QR code. Shorten it, or lower the error-correction level."
            : "This content could not be encoded as a QR code.",
        );
      }
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, [dark, errorLevel, light, margin, payload, size]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, "qr-code.png");
    }, "image/png");
  };

  return (
    <ToolFrame>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-5">
          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">What should it contain?</span>
            <div className="flex flex-wrap gap-1.5">
              {CONTENT_TYPES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  aria-pressed={type === option.value}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-[0.8125rem] font-medium transition-colors",
                    type === option.value
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {type === "url" ? (
              <Field label="Web address" htmlFor="qr-url">
                <Input
                  id="qr-url"
                  type="url"
                  inputMode="url"
                  value={fields.url}
                  onChange={(event) => set("url", event.target.value)}
                  placeholder="https://example.com"
                />
              </Field>
            ) : null}

            {type === "text" ? (
              <Field label="Text" htmlFor="qr-text" hint="Any plain text, up to a few hundred characters.">
                <textarea
                  id="qr-text"
                  rows={4}
                  value={fields.text}
                  onChange={(event) => set("text", event.target.value)}
                  placeholder="Anything you like…"
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg shadow-subtle outline-none focus:border-accent"
                />
              </Field>
            ) : null}

            {type === "email" ? (
              <>
                <Field label="Send to" htmlFor="qr-email-to">
                  <Input
                    id="qr-email-to"
                    type="email"
                    value={fields.emailTo}
                    onChange={(event) => set("emailTo", event.target.value)}
                    placeholder="hello@example.com"
                  />
                </Field>
                <Field label="Subject" htmlFor="qr-email-subject">
                  <Input
                    id="qr-email-subject"
                    value={fields.emailSubject}
                    onChange={(event) => set("emailSubject", event.target.value)}
                  />
                </Field>
                <Field label="Message" htmlFor="qr-email-body">
                  <Input
                    id="qr-email-body"
                    value={fields.emailBody}
                    onChange={(event) => set("emailBody", event.target.value)}
                  />
                </Field>
              </>
            ) : null}

            {type === "phone" ? (
              <Field label="Phone number" htmlFor="qr-phone" hint="Include the country code for reliability.">
                <Input
                  id="qr-phone"
                  type="tel"
                  value={fields.phone}
                  onChange={(event) => set("phone", event.target.value)}
                  placeholder="+44 20 7946 0000"
                />
              </Field>
            ) : null}

            {type === "sms" ? (
              <>
                <Field label="Phone number" htmlFor="qr-sms-number">
                  <Input
                    id="qr-sms-number"
                    type="tel"
                    value={fields.smsNumber}
                    onChange={(event) => set("smsNumber", event.target.value)}
                    placeholder="+44 20 7946 0000"
                  />
                </Field>
                <Field label="Message" htmlFor="qr-sms-message">
                  <Input
                    id="qr-sms-message"
                    value={fields.smsMessage}
                    onChange={(event) => set("smsMessage", event.target.value)}
                  />
                </Field>
              </>
            ) : null}

            {type === "wifi" ? (
              <>
                <Field label="Network name (SSID)" htmlFor="qr-wifi-ssid">
                  <Input
                    id="qr-wifi-ssid"
                    value={fields.wifiSsid}
                    onChange={(event) => set("wifiSsid", event.target.value)}
                    placeholder="MyNetwork"
                  />
                </Field>
                <SelectField
                  label="Security"
                  id="qr-wifi-security"
                  value={fields.wifiSecurity}
                  onChange={(value) => set("wifiSecurity", value)}
                >
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP (legacy)</option>
                  <option value="nopass">Open — no password</option>
                </SelectField>
                {fields.wifiSecurity !== "nopass" ? (
                  <Field label="Password" htmlFor="qr-wifi-password">
                    <Input
                      id="qr-wifi-password"
                      value={fields.wifiPassword}
                      onChange={(event) => set("wifiPassword", event.target.value)}
                      autoComplete="off"
                    />
                  </Field>
                ) : null}
                <Checkbox
                  label="Hidden network"
                  checked={fields.wifiHidden}
                  onChange={(event) => set("wifiHidden", event.target.checked)}
                />
              </>
            ) : null}

            {type === "vcard" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" htmlFor="qr-vcard-name">
                  <Input
                    id="qr-vcard-name"
                    value={fields.vcardName}
                    onChange={(event) => set("vcardName", event.target.value)}
                  />
                </Field>
                <Field label="Organisation" htmlFor="qr-vcard-org">
                  <Input
                    id="qr-vcard-org"
                    value={fields.vcardOrg}
                    onChange={(event) => set("vcardOrg", event.target.value)}
                  />
                </Field>
                <Field label="Phone" htmlFor="qr-vcard-phone">
                  <Input
                    id="qr-vcard-phone"
                    type="tel"
                    value={fields.vcardPhone}
                    onChange={(event) => set("vcardPhone", event.target.value)}
                  />
                </Field>
                <Field label="Email" htmlFor="qr-vcard-email">
                  <Input
                    id="qr-vcard-email"
                    type="email"
                    value={fields.vcardEmail}
                    onChange={(event) => set("vcardEmail", event.target.value)}
                  />
                </Field>
                <Field label="Website" htmlFor="qr-vcard-url" className="sm:col-span-2">
                  <Input
                    id="qr-vcard-url"
                    type="url"
                    value={fields.vcardUrl}
                    onChange={(event) => set("vcardUrl", event.target.value)}
                  />
                </Field>
              </div>
            ) : null}
          </div>

          <details className="group rounded-lg border border-border">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-fg">
              Appearance
              <span
                aria-hidden="true"
                className="text-fg-subtle transition-transform duration-200 group-open:rotate-90"
              >
                ›
              </span>
            </summary>
            <div className="space-y-4 border-t border-border p-4">
              <Slider
                label="Size"
                valueLabel={`${size} px`}
                min={128}
                max={1024}
                step={32}
                value={size}
                onChange={(event) => setSize(Number(event.target.value))}
              />
              <Slider
                label="Quiet zone"
                valueLabel={`${margin} modules`}
                min={0}
                max={8}
                value={margin}
                onChange={(event) => setMargin(Number(event.target.value))}
              />
              <SelectField
                label="Error correction"
                id="qr-error-level"
                value={errorLevel}
                onChange={setErrorLevel}
                hint="Higher levels survive damage but make the pattern denser."
              >
                {ERROR_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </SelectField>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Pattern colour" htmlFor="qr-dark">
                  <Input
                    id="qr-dark"
                    type="color"
                    value={dark}
                    onChange={(event) => setDark(event.target.value)}
                    className="h-10 cursor-pointer p-1"
                  />
                </Field>
                <Field label="Background colour" htmlFor="qr-light">
                  <Input
                    id="qr-light"
                    type="color"
                    value={light}
                    onChange={(event) => setLight(event.target.value)}
                    className="h-10 cursor-pointer p-1"
                  />
                </Field>
              </div>
            </div>
          </details>

          <ErrorMessage message={error} />
        </div>

        <aside className="min-w-0 space-y-3">
          <h2 className="text-[0.8125rem] font-medium text-fg">Preview</h2>

          <div className="flex aspect-square items-center justify-center rounded-[var(--radius-card)] border border-border bg-surface-sunken p-4">
            {payload && !error ? (
              <canvas
                ref={canvasRef}
                className="h-auto max-h-full w-auto max-w-full"
                aria-label="Generated QR code"
                role="img"
              />
            ) : (
              <p className="px-4 text-center text-sm text-fg-muted">
                {error ? "Cannot render this content." : "Fill in the fields to see your QR code."}
              </p>
            )}
          </div>

          {payload && !error ? (
            <>
              <div className="flex flex-col gap-2">
                <Button type="button" onClick={downloadPng} fullWidth>
                  <Download className="size-4" aria-hidden="true" />
                  Download PNG
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  disabled={!svg}
                  onClick={() => downloadText(svg, "qr-code.svg", "image/svg+xml")}
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download SVG
                </Button>
              </div>

              <div className="rounded-lg border border-border bg-surface-sunken p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[0.6875rem] font-semibold tracking-wider text-fg-subtle uppercase">
                    Encoded content
                  </span>
                  <CopyButton value={payload} iconOnly variant="ghost" />
                </div>
                <code className="mt-1.5 block max-h-24 overflow-y-auto font-mono text-[0.6875rem] break-all text-fg-muted">
                  {payload}
                </code>
              </div>

              {type === "wifi" ? (
                <Alert tone="info" title="Wi-Fi codes on iPhone">
                  iOS reads Wi-Fi QR codes from the Camera app. Some Android devices need the code to be
                  scanned from the Wi-Fi settings screen instead.
                </Alert>
              ) : null}
            </>
          ) : null}
        </aside>
      </div>
    </ToolFrame>
  );
}
