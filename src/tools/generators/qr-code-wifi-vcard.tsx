"use client";

import * as React from "react";
import { Printer } from "lucide-react";

import { ErrorMessage } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Segmented, Textarea } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import { downloadBlob, downloadText } from "@/lib/download";
import { contrastRatio, relativeLuminance, type Rgb } from "@/lib/palette";
import { eventPayload, menuPayload, vcardPayload, wifiPayload, type VCardInput, type WifiSecurity } from "@/lib/qr-payloads";

import { SelectField } from "../calculators/_shared";

type Kind = "wifi" | "contact" | "menu" | "event";

const EMPTY_CONTACT: VCardInput = {
  firstName: "",
  lastName: "",
  organization: "",
  title: "",
  mobile: "",
  workPhone: "",
  email: "",
  website: "",
  street: "",
  city: "",
  region: "",
  postcode: "",
  country: "",
  note: "",
};

const CAPTIONS: Record<Kind, string> = {
  wifi: "Scan to join our Wi-Fi",
  contact: "Scan to save my contact details",
  menu: "Scan to see our menu",
  event: "Scan to add this event to your calendar",
};

function hexToRgb(hex: string): Rgb {
  const value = Number.parseInt(hex.slice(1), 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

export default function QrCodeWifiVcard() {
  const [kind, setKind] = React.useState<Kind>("wifi");
  const [wifi, setWifi] = React.useState({ ssid: "", password: "", security: "WPA" as WifiSecurity, hidden: false, showPassword: true });
  const [contact, setContact] = React.useState<VCardInput>(EMPTY_CONTACT);
  const [menu, setMenu] = React.useState({ url: "", venue: "" });
  const [event, setEvent] = React.useState({ title: "", location: "", description: "", start: "", end: "", allDay: false });
  const [caption, setCaption] = React.useState(CAPTIONS.wifi);
  const [dark, setDark] = React.useState("#000000");
  const [light, setLight] = React.useState("#ffffff");
  const [level, setLevel] = React.useState<"L" | "M" | "Q" | "H">("M");
  const [qr, setQr] = React.useState<{ payload: string; png: string; svg: string } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const payload =
    kind === "wifi"
      ? wifiPayload(wifi)
      : kind === "contact"
        ? vcardPayload(contact)
        : kind === "menu"
          ? menuPayload(menu.url)
          : eventPayload(event);

  React.useEffect(() => {
    if (!payload) return;
    let cancelled = false;
    import("qrcode")
      .then(async ({ default: QRCode }) => {
        const options = { errorCorrectionLevel: level, margin: 4, color: { dark, light } };
        const [png, svg] = await Promise.all([
          QRCode.toDataURL(payload, { ...options, width: 1024 }),
          QRCode.toString(payload, { ...options, type: "svg" }),
        ]);
        if (!cancelled) {
          setQr({ payload, png, svg });
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError("That content is too long for a QR code. Shorten it or lower the error correction.");
      });
    return () => {
      cancelled = true;
    };
  }, [dark, level, light, payload]);

  const ready = qr && payload && qr.payload === payload;
  const ratio = contrastRatio(hexToRgb(dark), hexToRgb(light));
  const inverted = relativeLuminance(hexToRgb(dark)) > relativeLuminance(hexToRgb(light));

  const setContactField = (key: keyof VCardInput) => (value: string) => setContact((previous) => ({ ...previous, [key]: value }));
  const contactField = (key: keyof VCardInput, label: string, type = "text") => (
    <Field key={key} label={label} htmlFor={`qr-contact-${key}`}>
      <Input id={`qr-contact-${key}`} type={type} value={contact[key]} onChange={(changeEvent) => setContactField(key)(changeEvent.target.value)} />
    </Field>
  );

  const downloadPng = async () => {
    if (!ready) return;
    downloadBlob(await (await fetch(qr.png)).blob(), `${kind}-qr-code.png`);
  };

  return (
    <ToolFrame>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="min-w-0 space-y-5 print:hidden">
          <Segmented
            name="qr-kind"
            ariaLabel="QR code type"
            value={kind}
            onChange={(value) => {
              setKind(value);
              setCaption(CAPTIONS[value]);
            }}
            options={[
              { value: "wifi", label: "Wi-Fi" },
              { value: "contact", label: "Contact" },
              { value: "menu", label: "Menu" },
              { value: "event", label: "Event" },
            ]}
          />

          {kind === "wifi" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Network name (SSID)" htmlFor="qr-ssid" hint="Exactly as it appears, including capitals.">
                <Input id="qr-ssid" value={wifi.ssid} autoComplete="off" onChange={(changeEvent) => setWifi({ ...wifi, ssid: changeEvent.target.value })} />
              </Field>
              <SelectField label="Security" id="qr-security" value={wifi.security} onChange={(value) => setWifi({ ...wifi, security: value as WifiSecurity })}>
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP (old routers)</option>
                <option value="nopass">No password</option>
              </SelectField>
              {wifi.security !== "nopass" ? (
                <Field label="Password" htmlFor="qr-password">
                  <Input id="qr-password" value={wifi.password} autoComplete="off" onChange={(changeEvent) => setWifi({ ...wifi, password: changeEvent.target.value })} />
                </Field>
              ) : null}
              <div className="space-y-2.5 self-end">
                <Checkbox label="Hidden network" checked={wifi.hidden} onChange={(changeEvent) => setWifi({ ...wifi, hidden: changeEvent.target.checked })} />
                <Checkbox
                  label="Print the password on the card"
                  checked={wifi.showPassword}
                  onChange={(changeEvent) => setWifi({ ...wifi, showPassword: changeEvent.target.checked })}
                />
              </div>
            </div>
          ) : null}

          {kind === "contact" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {contactField("firstName", "First name")}
              {contactField("lastName", "Last name")}
              {contactField("organization", "Organisation")}
              {contactField("title", "Job title")}
              {contactField("mobile", "Mobile", "tel")}
              {contactField("workPhone", "Work phone", "tel")}
              {contactField("email", "Email", "email")}
              {contactField("website", "Website", "url")}
              {contactField("street", "Street address")}
              {contactField("city", "City")}
              {contactField("region", "State or region")}
              {contactField("postcode", "Postcode")}
              {contactField("country", "Country")}
            </div>
          ) : null}

          {kind === "menu" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Menu web address" htmlFor="qr-menu-url" hint="A page you control, so the menu can change without reprinting.">
                <Input id="qr-menu-url" type="url" value={menu.url} placeholder="https://" onChange={(changeEvent) => setMenu({ ...menu, url: changeEvent.target.value })} />
              </Field>
              <Field label="Venue name (for the card)" htmlFor="qr-menu-venue">
                <Input id="qr-menu-venue" value={menu.venue} onChange={(changeEvent) => setMenu({ ...menu, venue: changeEvent.target.value })} />
              </Field>
            </div>
          ) : null}

          {kind === "event" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Event title" htmlFor="qr-event-title">
                <Input id="qr-event-title" value={event.title} onChange={(changeEvent) => setEvent({ ...event, title: changeEvent.target.value })} />
              </Field>
              <Field label="Location" htmlFor="qr-event-location">
                <Input id="qr-event-location" value={event.location} onChange={(changeEvent) => setEvent({ ...event, location: changeEvent.target.value })} />
              </Field>
              <Field label="Starts" htmlFor="qr-event-start">
                <Input
                  id="qr-event-start"
                  type={event.allDay ? "date" : "datetime-local"}
                  value={event.start}
                  onChange={(changeEvent) => setEvent({ ...event, start: changeEvent.target.value })}
                />
              </Field>
              <Field label={event.allDay ? "Last day" : "Ends"} htmlFor="qr-event-end" hint={event.allDay ? undefined : "Defaults to one hour after the start."}>
                <Input
                  id="qr-event-end"
                  type={event.allDay ? "date" : "datetime-local"}
                  value={event.end}
                  onChange={(changeEvent) => setEvent({ ...event, end: changeEvent.target.value })}
                />
              </Field>
              <Checkbox
                label="All-day event"
                checked={event.allDay}
                onChange={(changeEvent) => setEvent({ ...event, allDay: changeEvent.target.checked, start: "", end: "" })}
              />
              <Field label="Description" htmlFor="qr-event-description" className="sm:col-span-2">
                <Textarea
                  id="qr-event-description"
                  rows={2}
                  value={event.description}
                  onChange={(changeEvent) => setEvent({ ...event, description: changeEvent.target.value })}
                  className="min-h-0"
                />
              </Field>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Card caption" htmlFor="qr-caption" className="sm:col-span-2">
              <Input id="qr-caption" value={caption} onChange={(changeEvent) => setCaption(changeEvent.target.value)} />
            </Field>
            <Field label="Code colour" htmlFor="qr-dark">
              <Input id="qr-dark" type="color" value={dark} onChange={(changeEvent) => setDark(changeEvent.target.value)} className="h-10 cursor-pointer p-1" />
            </Field>
            <Field label="Background" htmlFor="qr-light">
              <Input id="qr-light" type="color" value={light} onChange={(changeEvent) => setLight(changeEvent.target.value)} className="h-10 cursor-pointer p-1" />
            </Field>
            <SelectField label="Error correction" id="qr-level" value={level} onChange={(value) => setLevel(value as typeof level)}>
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </SelectField>
          </div>

          {inverted ? (
            <Alert tone="warning">The code is lighter than its background. Many scanners cannot read inverted codes — use a dark code on a light background.</Alert>
          ) : ratio < 4 ? (
            <Alert tone="warning">
              The colours have a contrast of {ratio.toFixed(1)}:1. Aim for at least 4:1 so phone cameras can read the code reliably.
            </Alert>
          ) : null}

          <ErrorMessage message={error} onDismiss={() => setError(null)} />
        </div>

        <div className="space-y-3">
          <figure className="mx-auto max-w-72 space-y-2 rounded-xl border border-border bg-white p-5 text-center text-neutral-900 print:max-w-none print:border-2">
            {ready ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qr.png} alt={`QR code: ${caption}`} className="mx-auto w-full" />
            ) : (
              <div className="flex aspect-square items-center justify-center text-sm text-neutral-500">
                Fill in the details to create the code.
              </div>
            )}
            <figcaption className="space-y-0.5">
              <p className="text-base font-semibold">{caption}</p>
              {kind === "wifi" && wifi.ssid ? <p className="text-sm">Network: {wifi.ssid}</p> : null}
              {kind === "wifi" && wifi.showPassword && wifi.security !== "nopass" && wifi.password ? (
                <p className="text-sm">Password: {wifi.password}</p>
              ) : null}
              {kind === "menu" && menu.venue ? <p className="text-sm">{menu.venue}</p> : null}
              {kind === "event" && event.title ? <p className="text-sm">{event.title}</p> : null}
            </figcaption>
          </figure>

          <div className="flex flex-wrap justify-center gap-2 print:hidden">
            <Button type="button" size="sm" disabled={!ready} onClick={() => void downloadPng()}>
              Download PNG
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={!ready}
              onClick={() => ready && downloadText(qr.svg, `${kind}-qr-code.svg`, "image/svg+xml")}
            >
              Download SVG
            </Button>
            <Button type="button" variant="secondary" size="sm" disabled={!ready} onClick={() => window.print()}>
              <Printer className="size-4" aria-hidden="true" />
              Print card
            </Button>
          </div>
          <p className="text-center text-xs text-fg-subtle print:hidden">Test the code with your own phone before printing copies.</p>
        </div>
      </div>
    </ToolFrame>
  );
}
