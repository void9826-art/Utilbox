"use client";

import * as React from "react";
import { AlertTriangle, ArrowDown, ArrowUp, Plus, Trash2, XCircle } from "lucide-react";

import { CopyButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Field, Input, Segmented, Textarea } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import {
  AVAILABILITY_OPTIONS,
  CONDITION_OPTIONS,
  faqSchema,
  productSchema,
  toScriptTag,
  validateFaq,
  validateProduct,
  type ProductInput,
  type SchemaIssue,
} from "@/lib/schema-markup";

import { SelectField } from "../calculators/_shared";

type Mode = "faq" | "product";

interface FaqDraft {
  id: number;
  question: string;
  answer: string;
}

let sequence = 0;
const faqDraft = (question = "", answer = ""): FaqDraft => {
  sequence += 1;
  return { id: sequence, question, answer };
};

const EMPTY_PRODUCT: ProductInput = {
  name: "",
  description: "",
  images: [],
  brand: "",
  sku: "",
  gtin: "",
  mpn: "",
  url: "",
  price: "",
  currency: "USD",
  availability: "InStock",
  condition: "NewCondition",
  priceValidUntil: "",
  ratingValue: "",
  reviewCount: "",
};

function Issues({ issues }: { issues: SchemaIssue[] }) {
  const errors = issues.filter((issue) => issue.level === "error");
  return (
    <div className="space-y-2" aria-live="polite">
      <p className="text-[0.8125rem] font-semibold text-fg">
        {errors.length === 0 ? "No errors — the markup is well-formed." : `${errors.length} error${errors.length === 1 ? "" : "s"} to fix`}
      </p>
      <ul className="space-y-1.5">
        {issues.map((issue) => {
          const Icon = issue.level === "error" ? XCircle : AlertTriangle;
          return (
            <li key={issue.message} className="flex items-start gap-2 text-[0.8125rem] text-fg">
              <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                <strong className="font-semibold">{issue.level === "error" ? "Error: " : "Note: "}</strong>
                {issue.message}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function SchemaGenerator() {
  const [mode, setMode] = React.useState<Mode>("faq");
  const [faqs, setFaqs] = React.useState<FaqDraft[]>(() => [
    faqDraft("Do you ship internationally?", "Yes. We ship to more than 40 countries, and delivery times are shown at checkout."),
    faqDraft("What is your returns policy?", "You can return unused items within 30 days for a full refund."),
  ]);
  const [product, setProduct] = React.useState<ProductInput>(EMPTY_PRODUCT);
  const [imagesText, setImagesText] = React.useState("");

  const productInput = React.useMemo(
    () => ({ ...product, images: imagesText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean) }),
    [imagesText, product],
  );

  const schema = mode === "faq" ? faqSchema(faqs) : productSchema(productInput);
  const issues = mode === "faq" ? validateFaq(faqs) : validateProduct(productInput);
  const markup = toScriptTag(schema);

  const setField = (key: keyof ProductInput, value: string) => setProduct((previous) => ({ ...previous, [key]: value }));
  const updateFaq = (id: number, key: "question" | "answer", value: string) =>
    setFaqs((previous) => previous.map((entry) => (entry.id === id ? { ...entry, [key]: value } : entry)));
  const move = (index: number, delta: number) =>
    setFaqs((previous) => {
      const next = [...previous];
      const [item] = next.splice(index, 1);
      next.splice(index + delta, 0, item);
      return next;
    });

  const textField = (key: keyof ProductInput, label: string, options: { hint?: string; placeholder?: string } = {}) => (
    <Field label={label} htmlFor={`schema-${key}`} hint={options.hint}>
      <Input
        id={`schema-${key}`}
        value={String(product[key])}
        placeholder={options.placeholder}
        onChange={(event) => setField(key, event.target.value)}
      />
    </Field>
  );

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Segmented
          name="schema-mode"
          ariaLabel="Schema type"
          value={mode}
          onChange={setMode}
          options={[
            { value: "faq", label: "FAQ page" },
            { value: "product", label: "Product" },
          ]}
          className="sm:max-w-sm"
        />

        {mode === "faq" ? (
          <div className="space-y-3">
            {faqs.map((entry, index) => (
              <fieldset key={entry.id} className="space-y-2.5 rounded-lg border border-border bg-surface-sunken p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <legend className="text-[0.8125rem] font-semibold text-fg">Question {index + 1}</legend>
                  <div className="flex gap-1">
                    <Button type="button" variant="ghost" size="icon-sm" aria-label={`Move question ${index + 1} up`} disabled={index === 0} onClick={() => move(index, -1)}>
                      <ArrowUp className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Move question ${index + 1} down`}
                      disabled={index === faqs.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      <ArrowDown className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove question ${index + 1}`}
                      disabled={faqs.length === 1}
                      onClick={() => setFaqs((previous) => previous.filter((item) => item.id !== entry.id))}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
                <Field label="Question" htmlFor={`faq-q-${entry.id}`}>
                  <Input id={`faq-q-${entry.id}`} value={entry.question} onChange={(event) => updateFaq(entry.id, "question", event.target.value)} />
                </Field>
                <Field label="Answer" htmlFor={`faq-a-${entry.id}`} hint="Basic HTML such as <p>, <a>, <ul> and <strong> is allowed.">
                  <Textarea
                    id={`faq-a-${entry.id}`}
                    rows={3}
                    value={entry.answer}
                    onChange={(event) => updateFaq(entry.id, "answer", event.target.value)}
                    className="min-h-0"
                  />
                </Field>
              </fieldset>
            ))}
            <Button type="button" variant="secondary" size="sm" onClick={() => setFaqs((previous) => [...previous, faqDraft()])}>
              <Plus className="size-4" aria-hidden="true" />
              Add a question
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {textField("name", "Product name", { placeholder: "Ceramic coffee mug, 350 ml" })}
            {textField("brand", "Brand")}
            <Field label="Description" htmlFor="schema-description" className="sm:col-span-2">
              <Textarea
                id="schema-description"
                rows={2}
                value={product.description}
                onChange={(event) => setField("description", event.target.value)}
                className="min-h-0"
              />
            </Field>
            <Field label="Image URLs — one per line" htmlFor="schema-images" className="sm:col-span-2">
              <Textarea
                id="schema-images"
                rows={2}
                value={imagesText}
                placeholder="https://example.com/images/mug.jpg"
                onChange={(event) => setImagesText(event.target.value)}
                className="min-h-0 font-mono text-[0.8125rem]"
              />
            </Field>
            {textField("url", "Product page URL", { placeholder: "https://" })}
            {textField("gtin", "GTIN / EAN / UPC", { hint: "The barcode number. The check digit is verified." })}
            {textField("sku", "SKU")}
            {textField("mpn", "MPN")}
            {textField("price", "Price", { hint: "A plain number, e.g. 24.99", placeholder: "24.99" })}
            {textField("currency", "Currency", { hint: "ISO 4217 code, e.g. USD, EUR, GBP, INR" })}
            <SelectField label="Availability" id="schema-availability" value={product.availability} onChange={(value) => setField("availability", value)}>
              {AVAILABILITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
            <SelectField label="Condition" id="schema-condition" value={product.condition} onChange={(value) => setField("condition", value)}>
              {CONDITION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
            <Field label="Price valid until (optional)" htmlFor="schema-priceValidUntil">
              <Input
                id="schema-priceValidUntil"
                type="date"
                value={product.priceValidUntil}
                onChange={(event) => setField("priceValidUntil", event.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              {textField("ratingValue", "Average rating", { hint: "1 to 5" })}
              {textField("reviewCount", "Number of reviews")}
            </div>
          </div>
        )}

        <Issues issues={issues} />

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="schema-output" className="text-[0.8125rem] font-medium text-fg">
              JSON-LD for your page
            </label>
            <CopyButton value={markup} label="Copy code" />
          </div>
          <Textarea
            id="schema-output"
            readOnly
            rows={Math.min(22, markup.split("\n").length + 1)}
            value={markup}
            className="bg-surface-sunken font-mono text-[0.75rem]"
          />
        </div>

        <Alert tone="info">
          After adding the code to a live page, check it with{" "}
          <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer">
            Google&apos;s Rich Results Test
          </a>
          .
        </Alert>
      </div>
    </ToolFrame>
  );
}
