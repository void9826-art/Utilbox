"use client";

import * as React from "react";
import { Download, Plus, Printer, X } from "lucide-react";

import { ErrorMessage } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { downloadBlob } from "@/lib/download";
import { formatMoney, roundMoney, toMinor, fromMinor } from "@/lib/money";

import { CURRENCIES, NumberField, SelectField, parseNumber } from "../calculators/_shared";

interface LineItem {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
}

let sequence = 0;
function newItem(): LineItem {
  sequence += 1;
  return { id: `item-${sequence}`, description: "", quantity: "1", unitPrice: "" };
}

/** Fixed ids for the rows present on first render, so hydration matches. */
const SEED_ITEMS: LineItem[] = [
  { id: "seed-item-1", description: "", quantity: "1", unitPrice: "" },
  { id: "seed-item-2", description: "", quantity: "1", unitPrice: "" },
];

function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
}

export default function InvoiceGenerator() {
  const [invoiceNumber, setInvoiceNumber] = React.useState("INV-0001");
  const [issueDate, setIssueDate] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [currency, setCurrency] = React.useState("USD");

  const [fromName, setFromName] = React.useState("");
  const [fromDetails, setFromDetails] = React.useState("");
  const [toName, setToName] = React.useState("");
  const [toDetails, setToDetails] = React.useState("");

  const [items, setItems] = React.useState<LineItem[]>(SEED_ITEMS);
  const [taxRate, setTaxRate] = React.useState("0");
  const [taxLabel, setTaxLabel] = React.useState("Tax");
  const [discount, setDiscount] = React.useState("0");
  const [notes, setNotes] = React.useState("");
  const [logo, setLogo] = React.useState<{ dataUrl: string; type: string } | null>(null);

  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const logoRef = React.useRef<HTMLInputElement>(null);

  // Today's date only exists on the client — the server has no idea what day
  // it is in the visitor's timezone — so the date fields are filled after mount.
  React.useEffect(() => {
    const today = todayIso();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- today's date in the visitor's timezone is not knowable on the server
    setIssueDate(today);
    setDueDate(addDays(today, 30));
  }, []);

  const update = (id: string, patch: Partial<LineItem>) =>
    setItems((previous) => previous.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const totals = React.useMemo(() => {
    // Line totals are held in whole cents so the invoice always adds up: a
    // subtotal summed from rounded pounds can differ from the sum of the rows.
    const lines = items.map((item) => {
      const quantity = parseNumber(item.quantity) ?? 0;
      const unitPrice = parseNumber(item.unitPrice) ?? 0;
      const lineMinor = Math.round(toMinor(unitPrice) * quantity);
      return { ...item, quantity, unitPrice, lineMinor, total: fromMinor(lineMinor) };
    });

    const subtotalMinor = lines.reduce((sum, line) => sum + line.lineMinor, 0);

    const discountValue = parseNumber(discount) ?? 0;
    const discountMinor = Math.round((subtotalMinor * discountValue) / 100);
    const afterDiscountMinor = subtotalMinor - discountMinor;

    const taxValue = parseNumber(taxRate) ?? 0;
    const taxMinor = Math.round((afterDiscountMinor * taxValue) / 100);

    return {
      lines,
      subtotal: fromMinor(subtotalMinor),
      discountAmount: fromMinor(discountMinor),
      taxAmount: fromMinor(taxMinor),
      total: fromMinor(afterDiscountMinor + taxMinor),
      hasContent: lines.some((line) => line.description.trim() || line.total !== 0),
    };
  }, [discount, items, taxRate]);

  const money = (value: number) => formatMoney(value, currency);

  const handleLogo = async (file: File) => {
    setError(null);
    if (!/^image\/(png|jpeg)$/.test(file.type)) {
      setError("The logo must be a PNG or JPG image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("The logo must be smaller than 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogo({ dataUrl: String(reader.result), type: file.type });
    reader.onerror = () => setError("That image could not be read.");
    reader.readAsDataURL(file);
  };

  const exportPdf = async () => {
    setBusy(true);
    setError(null);

    try {
      // pdf-lib is ~350 KB, so it is only fetched when a PDF is actually made.
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const { DocumentLayout, drawTable } = await import("@/lib/pdf-document");

      const doc = await PDFDocument.create();
      doc.setTitle(`Invoice ${invoiceNumber}`);
      doc.setCreator("Utilbox");
      doc.setProducer("Utilbox");

      const fonts = {
        regular: await doc.embedFont(StandardFonts.Helvetica),
        bold: await doc.embedFont(StandardFonts.HelveticaBold),
        italic: await doc.embedFont(StandardFonts.HelveticaOblique),
        boldItalic: await doc.embedFont(StandardFonts.HelveticaBoldOblique),
      };

      const layout = new DocumentLayout(doc, fonts, { pageSize: "a4", margin: 48 });

      const ink = rgb(0.06, 0.07, 0.09);
      const muted = rgb(0.42, 0.45, 0.5);
      const line = rgb(0.87, 0.88, 0.9);
      const accent = rgb(0.13, 0.13, 0.13);

      // Header: logo (or sender name) on the left, invoice meta on the right.
      const headerTop = layout.cursor;

      if (logo) {
        const bytes = Uint8Array.from(atob(logo.dataUrl.split(",")[1]), (c) => c.charCodeAt(0));
        const image =
          logo.type === "image/png" ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
        const scaled = image.scaleToFit(140, 56);
        layout.page.drawImage(image, {
          x: layout.margin,
          y: layout.pageHeight - layout.cursor - scaled.height,
          width: scaled.width,
          height: scaled.height,
        });
        layout.cursor += scaled.height + 10;
      }

      if (fromName.trim()) {
        layout.text(fromName, { size: 15, font: "bold", color: ink, spaceAfter: 2 });
      }
      if (fromDetails.trim()) {
        layout.text(fromDetails, { size: 9, color: muted, lineHeight: 1.4, maxWidth: 240 });
      }

      const bodyStart = layout.cursor;

      // Right-hand meta column, drawn from the header's top.
      layout.cursor = headerTop;
      layout.text("INVOICE", { size: 26, font: "bold", color: accent, align: "right", spaceAfter: 4 });
      layout.text(invoiceNumber, { size: 10, color: muted, align: "right", spaceAfter: 8 });
      layout.text(`Issued  ${formatDate(issueDate)}`, { size: 9, color: muted, align: "right" });
      layout.text(`Due     ${formatDate(dueDate)}`, { size: 9, color: ink, font: "bold", align: "right" });

      layout.cursor = Math.max(bodyStart, layout.cursor) + 18;
      layout.rule(line, 0.75, 0, 16);

      if (toName.trim() || toDetails.trim()) {
        layout.text("BILL TO", { size: 8, font: "bold", color: muted, spaceAfter: 4 });
        if (toName.trim()) {
          layout.text(toName, { size: 12, font: "bold", color: ink, spaceAfter: 2 });
        }
        if (toDetails.trim()) {
          layout.text(toDetails, { size: 9, color: muted, lineHeight: 1.4, maxWidth: 280 });
        }
        layout.space(18);
      }

      const rows = totals.lines
        .filter((item) => item.description.trim() || item.total !== 0)
        .map((item) => [
          item.description || "—",
          String(item.quantity),
          money(item.unitPrice),
          money(item.total),
        ]);

      if (rows.length === 0) {
        throw new Error("Add at least one line item before exporting.");
      }

      drawTable(
        layout,
        [
          { header: "Description", width: 0.5 },
          { header: "Qty", width: 0.12, align: "right" },
          { header: "Unit price", width: 0.19, align: "right" },
          { header: "Amount", width: 0.19, align: "right" },
        ],
        rows,
        {
          fontSize: 9.5,
          headerColor: ink,
          headerBackground: rgb(0.96, 0.97, 0.98),
          borderColor: line,
          textColor: rgb(0.25, 0.28, 0.33),
        },
      );

      // Totals block, right-aligned under the table.
      layout.space(10);
      const totalsRows: Array<[string, string, boolean]> = [
        ["Subtotal", money(totals.subtotal), false],
      ];
      if (totals.discountAmount > 0) {
        totalsRows.push([`Discount (${discount}%)`, `−${money(totals.discountAmount)}`, false]);
      }
      if (totals.taxAmount > 0) {
        totalsRows.push([`${taxLabel} (${taxRate}%)`, money(totals.taxAmount), false]);
      }
      totalsRows.push(["Total due", money(totals.total), true]);

      for (const [label, value, strong] of totalsRows) {
        layout.ensureSpace(20);
        if (strong) {
          layout.rule(line, 0.75, 4, 6);
        }
        const size = strong ? 12 : 9.5;
        layout.textAt(label, layout.pageWidth - layout.margin - 200, {
          size,
          font: strong ? "bold" : "regular",
          color: strong ? ink : muted,
        });
        const valueWidth = fonts[strong ? "bold" : "regular"].widthOfTextAtSize(value, size);
        layout.textAt(value, layout.pageWidth - layout.margin - valueWidth, {
          size,
          font: strong ? "bold" : "regular",
          color: strong ? accent : ink,
        });
        layout.cursor += size * 1.7;
      }

      if (notes.trim()) {
        layout.space(16);
        layout.rule(line, 0.75, 0, 10);
        layout.text("NOTES", { size: 8, font: "bold", color: muted, spaceAfter: 4 });
        layout.text(notes, { size: 9, color: muted, lineHeight: 1.5 });
      }

      const bytes = await doc.save();
      const buffer = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(buffer).set(bytes);
      downloadBlob(new Blob([buffer], { type: "application/pdf" }), `${invoiceNumber || "invoice"}.pdf`);
    } catch (caught) {
      setError(
        caught instanceof Error && caught.message.includes("line item")
          ? caught.message
          : "The invoice PDF could not be generated. Check that every amount is a number.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <ToolFrame className="print-hidden">
        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Invoice number" htmlFor="invoice-number">
              <Input
                id="invoice-number"
                value={invoiceNumber}
                onChange={(event) => setInvoiceNumber(event.target.value)}
              />
            </Field>
            <Field label="Issue date" htmlFor="invoice-issue">
              <Input
                id="invoice-issue"
                type="date"
                value={issueDate}
                onChange={(event) => setIssueDate(event.target.value)}
                className="tabular"
              />
            </Field>
            <Field label="Due date" htmlFor="invoice-due">
              <Input
                id="invoice-due"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="tabular"
              />
            </Field>
            <SelectField label="Currency" id="invoice-currency" value={currency} onChange={setCurrency}>
              {CURRENCIES.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </SelectField>
          </section>

          <section className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-3">
              <h2 className="text-[0.6875rem] font-semibold tracking-wider text-fg-subtle uppercase">
                From
              </h2>
              <Field label="Your name or business" htmlFor="invoice-from-name">
                <Input
                  id="invoice-from-name"
                  value={fromName}
                  onChange={(event) => setFromName(event.target.value)}
                  placeholder="Acme Studio Ltd"
                />
              </Field>
              <Field label="Address and contact details" htmlFor="invoice-from-details">
                <textarea
                  id="invoice-from-details"
                  rows={4}
                  value={fromDetails}
                  onChange={(event) => setFromDetails(event.target.value)}
                  placeholder={"12 Example Street\nLondon SW1A 1AA\nhello@example.com\nVAT: GB123456789"}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg shadow-subtle outline-none focus:border-accent"
                />
              </Field>
              <div>
                <Button type="button" variant="secondary" size="sm" onClick={() => logoRef.current?.click()}>
                  {logo ? "Replace logo" : "Add a logo"}
                </Button>
                {logo ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setLogo(null)}
                    className="ml-1.5"
                  >
                    Remove
                  </Button>
                ) : null}
                <input
                  ref={logoRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="sr-only"
                  tabIndex={-1}
                  aria-label="Choose a logo image"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    if (file) void handleLogo(file);
                  }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-[0.6875rem] font-semibold tracking-wider text-fg-subtle uppercase">
                Bill to
              </h2>
              <Field label="Client name" htmlFor="invoice-to-name">
                <Input
                  id="invoice-to-name"
                  value={toName}
                  onChange={(event) => setToName(event.target.value)}
                  placeholder="Client Company Ltd"
                />
              </Field>
              <Field label="Client address and details" htmlFor="invoice-to-details">
                <textarea
                  id="invoice-to-details"
                  rows={4}
                  value={toDetails}
                  onChange={(event) => setToDetails(event.target.value)}
                  placeholder={"4 Client Road\nManchester M1 2AB\naccounts@client.com"}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg shadow-subtle outline-none focus:border-accent"
                />
              </Field>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-[0.6875rem] font-semibold tracking-wider text-fg-subtle uppercase">
              Line items
            </h2>
            <div className="hidden grid-cols-[1fr_5rem_7rem_7rem_2.25rem] gap-2 px-1 text-[0.6875rem] font-medium text-fg-subtle sm:grid">
              <span>Description</span>
              <span>Qty</span>
              <span>Unit price</span>
              <span className="text-right">Amount</span>
              <span className="sr-only">Remove</span>
            </div>

            <ul className="space-y-2">
              {totals.lines.map((item, index) => (
                <li
                  key={item.id}
                  className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-surface-sunken p-2 sm:grid-cols-[1fr_5rem_7rem_7rem_2.25rem] sm:items-center sm:border-0 sm:bg-transparent sm:p-0"
                >
                  <Input
                    aria-label={`Item ${index + 1} description`}
                    value={item.description}
                    placeholder="Design work, week 1"
                    onChange={(event) => update(item.id, { description: event.target.value })}
                    className="col-span-2 sm:col-span-1"
                  />
                  <Input
                    aria-label={`Item ${index + 1} quantity`}
                    type="number"
                    min={0}
                    step="any"
                    value={item.quantity}
                    onChange={(event) => update(item.id, { quantity: event.target.value })}
                    className="tabular"
                  />
                  <Input
                    aria-label={`Item ${index + 1} unit price`}
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    value={item.unitPrice}
                    onChange={(event) => update(item.id, { unitPrice: event.target.value })}
                    className="tabular"
                  />
                  <span className="tabular self-center text-right text-sm font-medium text-fg">
                    {money(item.total)}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove item ${index + 1}`}
                    disabled={items.length <= 1}
                    onClick={() => setItems((previous) => previous.filter((row) => row.id !== item.id))}
                    className="justify-self-end"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setItems((previous) => [...previous, newItem()])}
            >
              <Plus className="size-4" aria-hidden="true" />
              Add line
            </Button>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            <NumberField
              id="invoice-discount"
              label="Discount"
              value={discount}
              onChange={setDiscount}
              suffix="%"
              min={0}
              max={100}
            />
            <NumberField
              id="invoice-tax"
              label="Tax rate"
              value={taxRate}
              onChange={setTaxRate}
              suffix="%"
              min={0}
              max={100}
              step="0.01"
            />
            <Field label="Tax label" htmlFor="invoice-tax-label">
              <Input
                id="invoice-tax-label"
                value={taxLabel}
                onChange={(event) => setTaxLabel(event.target.value)}
                placeholder="VAT, GST, Sales tax"
              />
            </Field>
          </section>

          <Field label="Notes and payment terms" htmlFor="invoice-notes">
            <textarea
              id="invoice-notes"
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Payment due within 30 days. Bank: 00-00-00 / 12345678."
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg shadow-subtle outline-none focus:border-accent"
            />
          </Field>

          <ErrorMessage message={error} onDismiss={() => setError(null)} />

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={exportPdf}
              loading={busy}
              disabled={!totals.hasContent}
              aria-describedby={totals.hasContent ? undefined : "invoice-download-hint"}
            >
              {busy ? null : <Download className="size-4" aria-hidden="true" />}
              Download PDF
            </Button>
            <Button type="button" variant="secondary" onClick={() => window.print()}>
              <Printer className="size-4" aria-hidden="true" />
              Print
            </Button>
            {/* A greyed-out button with no reason beside it reads as a broken
                page. Say what is missing instead. */}
            {totals.hasContent ? null : (
              <p id="invoice-download-hint" className="text-sm text-fg-muted">
                Add a line item with a description or an amount to enable the download.
              </p>
            )}
          </div>
        </div>
      </ToolFrame>

      {/* On-screen preview, and the printable version. */}
      <div className="print-surface overflow-hidden rounded-[var(--radius-card)] border border-border bg-white text-neutral-900 shadow-raised">
        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="min-w-0">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo.dataUrl} alt="" className="mb-3 max-h-14 w-auto" />
              ) : null}
              {fromName ? <p className="text-lg font-semibold">{fromName}</p> : null}
              {fromDetails ? (
                <p className="mt-1 text-xs leading-relaxed whitespace-pre-line text-neutral-500">
                  {fromDetails}
                </p>
              ) : null}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold tracking-tight text-neutral-900">INVOICE</p>
              <p className="text-sm text-neutral-500">{invoiceNumber}</p>
              <p className="mt-3 text-xs text-neutral-500">Issued {formatDate(issueDate)}</p>
              <p className="text-xs font-semibold">Due {formatDate(dueDate)}</p>
            </div>
          </div>

          {toName || toDetails ? (
            <div className="mt-8 border-t border-neutral-200 pt-6">
              <p className="text-[0.6875rem] font-semibold tracking-wider text-neutral-500 uppercase">
                Bill to
              </p>
              {toName ? <p className="mt-1 font-semibold">{toName}</p> : null}
              {toDetails ? (
                <p className="mt-0.5 text-xs leading-relaxed whitespace-pre-line text-neutral-500">
                  {toDetails}
                </p>
              ) : null}
            </div>
          ) : null}

          <table className="mt-8 w-full border-collapse text-sm">
            <caption className="sr-only">Invoice line items</caption>
            <thead>
              <tr className="bg-neutral-50">
                <th scope="col" className="px-3 py-2 text-left font-semibold">
                  Description
                </th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">
                  Qty
                </th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">
                  Unit price
                </th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {totals.lines.map((item) => (
                <tr key={item.id} className="border-b border-neutral-200">
                  <td className="px-3 py-2">{item.description || <span className="text-neutral-400">—</span>}</td>
                  <td className="tabular px-3 py-2 text-right">{item.quantity}</td>
                  <td className="tabular px-3 py-2 text-right">{money(item.unitPrice)}</td>
                  <td className="tabular px-3 py-2 text-right font-medium">{money(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-end">
            <dl className="w-full max-w-64 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-500">Subtotal</dt>
                <dd className="tabular">{money(totals.subtotal)}</dd>
              </div>
              {totals.discountAmount > 0 ? (
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Discount ({discount}%)</dt>
                  <dd className="tabular">−{money(totals.discountAmount)}</dd>
                </div>
              ) : null}
              {totals.taxAmount > 0 ? (
                <div className="flex justify-between">
                  <dt className="text-neutral-500">
                    {taxLabel} ({taxRate}%)
                  </dt>
                  <dd className="tabular">{money(totals.taxAmount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-neutral-300 pt-2 text-base font-bold">
                <dt>Total due</dt>
                <dd className="tabular">{money(roundMoney(totals.total))}</dd>
              </div>
            </dl>
          </div>

          {notes ? (
            <div className="mt-8 border-t border-neutral-200 pt-4">
              <p className="text-[0.6875rem] font-semibold tracking-wider text-neutral-500 uppercase">
                Notes
              </p>
              <p className="mt-1 text-xs leading-relaxed whitespace-pre-line text-neutral-500">{notes}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
