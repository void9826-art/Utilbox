"use client";

import * as React from "react";
import { Download, Plus, Printer, X } from "lucide-react";

import { ErrorMessage } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import { downloadBlob } from "@/lib/download";

interface Entry {
  id: string;
  title: string;
  organisation: string;
  period: string;
  location: string;
  details: string;
}

let sequence = 0;
function newEntry(): Entry {
  sequence += 1;
  return { id: `entry-${sequence}`, title: "", organisation: "", period: "", location: "", details: "" };
}

/** A fixed id for the row present on first render, so hydration matches. */
function seedEntry(name: string): Entry {
  return {
    id: `seed-${name}`,
    title: "",
    organisation: "",
    period: "",
    location: "",
    details: "",
  };
}

export default function ResumeGenerator() {
  const [name, setName] = React.useState("");
  const [headline, setHeadline] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [experience, setExperience] = React.useState<Entry[]>(() => [seedEntry("experience")]);
  const [education, setEducation] = React.useState<Entry[]>(() => [seedEntry("education")]);
  const [skills, setSkills] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const contactLine = [email, phone, location, website].filter((part) => part.trim()).join("  ·  ");
  const skillList = skills
    .split(/[,\n]/)
    .map((skill) => skill.trim())
    .filter(Boolean);

  const hasContent = Boolean(name.trim() || summary.trim() || experience.some((e) => e.title.trim()));

  const updateEntry = (
    setter: React.Dispatch<React.SetStateAction<Entry[]>>,
    id: string,
    patch: Partial<Entry>,
  ) => setter((previous) => previous.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));

  const exportPdf = async () => {
    setBusy(true);
    setError(null);

    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const { DocumentLayout } = await import("@/lib/pdf-document");

      const doc = await PDFDocument.create();
      doc.setTitle(name ? `${name} — CV` : "Curriculum vitae");
      doc.setCreator("Utilbox");
      doc.setProducer("Utilbox");

      const fonts = {
        regular: await doc.embedFont(StandardFonts.Helvetica),
        bold: await doc.embedFont(StandardFonts.HelveticaBold),
        italic: await doc.embedFont(StandardFonts.HelveticaOblique),
        boldItalic: await doc.embedFont(StandardFonts.HelveticaBoldOblique),
      };

      const layout = new DocumentLayout(doc, fonts, { pageSize: "a4", margin: 52 });

      const ink = rgb(0.06, 0.07, 0.09);
      const muted = rgb(0.4, 0.43, 0.48);
      const line = rgb(0.84, 0.85, 0.87);

      if (name.trim()) {
        layout.text(name, { size: 22, font: "bold", color: ink, spaceAfter: 2 });
      }
      if (headline.trim()) {
        layout.text(headline, { size: 11, color: muted, spaceAfter: 4 });
      }
      if (contactLine) {
        layout.text(contactLine, { size: 9, color: muted, spaceAfter: 6 });
      }

      layout.rule(line, 0.75, 2, 14);

      const section = (title: string) => {
        layout.ensureSpace(60);
        layout.text(title.toUpperCase(), {
          size: 9,
          font: "bold",
          color: ink,
          spaceBefore: 6,
          spaceAfter: 3,
        });
        layout.rule(line, 0.5, 0, 8);
      };

      if (summary.trim()) {
        section("Profile");
        layout.text(summary, { size: 9.5, color: muted, lineHeight: 1.5, spaceAfter: 6 });
      }

      const renderEntries = (title: string, entries: Entry[]) => {
        const filled = entries.filter(
          (entry) => entry.title.trim() || entry.organisation.trim() || entry.details.trim(),
        );
        if (filled.length === 0) return;

        section(title);

        for (const entry of filled) {
          // Keep the heading with at least the first line of its detail.
          layout.ensureSpace(46);

          const heading = entry.title || entry.organisation;
          const rightText = [entry.period, entry.location].filter(Boolean).join("  ·  ");

          const headingTop = layout.cursor;
          layout.text(heading, {
            size: 10.5,
            font: "bold",
            color: ink,
            maxWidth: layout.contentWidth - 170,
          });
          const afterHeading = layout.cursor;

          if (rightText) {
            layout.cursor = headingTop;
            layout.text(rightText, { size: 9, color: muted, align: "right" });
          }
          layout.cursor = Math.max(afterHeading, layout.cursor);

          if (entry.title && entry.organisation) {
            layout.text(entry.organisation, { size: 9.5, color: muted, spaceAfter: 2 });
          }

          if (entry.details.trim()) {
            for (const detail of entry.details.split("\n").filter((row) => row.trim())) {
              const bullet = detail.replace(/^[-*•]\s*/, "");
              layout.text(`•  ${bullet}`, {
                size: 9.5,
                color: muted,
                lineHeight: 1.45,
                indent: 8,
              });
            }
          }

          layout.space(8);
        }
      };

      renderEntries("Experience", experience);
      renderEntries("Education", education);

      if (skillList.length > 0) {
        section("Skills");
        layout.text(skillList.join("  ·  "), { size: 9.5, color: muted, lineHeight: 1.5 });
      }

      const bytes = await doc.save();
      const buffer = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(buffer).set(bytes);
      downloadBlob(
        new Blob([buffer], { type: "application/pdf" }),
        `${(name || "resume").replace(/\s+/g, "-").toLowerCase()}.pdf`,
      );
    } catch {
      setError("The PDF could not be generated. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <ToolFrame className="print-hidden">
        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-[0.6875rem] font-semibold tracking-wider text-fg-subtle uppercase">
              Contact details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" htmlFor="resume-name">
                <Input id="resume-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" />
              </Field>
              <Field label="Professional headline" htmlFor="resume-headline">
                <Input
                  id="resume-headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Senior Software Engineer"
                />
              </Field>
              <Field label="Email" htmlFor="resume-email">
                <Input id="resume-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>
              <Field label="Phone" htmlFor="resume-phone">
                <Input id="resume-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Field>
              <Field label="Location" htmlFor="resume-location">
                <Input
                  id="resume-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="London, UK"
                />
              </Field>
              <Field label="Website or profile" htmlFor="resume-website">
                <Input
                  id="resume-website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="example.com"
                />
              </Field>
            </div>
          </section>

          <Field label="Profile summary" htmlFor="resume-summary" hint="Two or three sentences. Keep it specific.">
            <textarea
              id="resume-summary"
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg shadow-subtle outline-none focus:border-accent"
            />
          </Field>

          <EntrySection
            title="Experience"
            entries={experience}
            titleLabel="Job title"
            organisationLabel="Company"
            onAdd={() => setExperience((previous) => [...previous, newEntry()])}
            onRemove={(id) => setExperience((previous) => previous.filter((entry) => entry.id !== id))}
            onChange={(id, patch) => updateEntry(setExperience, id, patch)}
          />

          <EntrySection
            title="Education"
            entries={education}
            titleLabel="Qualification"
            organisationLabel="Institution"
            onAdd={() => setEducation((previous) => [...previous, newEntry()])}
            onRemove={(id) => setEducation((previous) => previous.filter((entry) => entry.id !== id))}
            onChange={(id, patch) => updateEntry(setEducation, id, patch)}
          />

          <Field
            label="Skills"
            htmlFor="resume-skills"
            hint="Separate with commas or new lines."
          >
            <textarea
              id="resume-skills"
              rows={3}
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="TypeScript, React, PostgreSQL, System design"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg shadow-subtle outline-none focus:border-accent"
            />
          </Field>

          <ErrorMessage message={error} onDismiss={() => setError(null)} />

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={exportPdf} loading={busy} disabled={!hasContent}>
              {busy ? null : <Download className="size-4" aria-hidden="true" />}
              Download PDF
            </Button>
            <Button type="button" variant="secondary" onClick={() => window.print()}>
              <Printer className="size-4" aria-hidden="true" />
              Print
            </Button>
          </div>

          <Alert tone="info" title="Built to survive applicant tracking systems">
            One column, standard headings, real selectable text and no graphics carrying information —
            the four things that most often break automated CV parsing.
          </Alert>
        </div>
      </ToolFrame>

      <div className="print-surface overflow-hidden rounded-[var(--radius-card)] border border-border bg-white text-neutral-900 shadow-raised">
        <div className="mx-auto max-w-[46rem] p-8 sm:p-12">
          {name ? <h2 className="text-3xl font-bold tracking-tight">{name}</h2> : null}
          {headline ? <p className="mt-0.5 text-neutral-600">{headline}</p> : null}
          {contactLine ? <p className="mt-2 text-xs text-neutral-500">{contactLine}</p> : null}

          {!hasContent ? (
            <p className="py-12 text-center text-sm text-neutral-400">
              Fill in the form above and your CV appears here.
            </p>
          ) : null}

          {summary ? (
            <PreviewSection title="Profile">
              <p className="text-sm leading-relaxed text-neutral-600">{summary}</p>
            </PreviewSection>
          ) : null}

          <PreviewEntries title="Experience" entries={experience} />
          <PreviewEntries title="Education" entries={education} />

          {skillList.length > 0 ? (
            <PreviewSection title="Skills">
              <ul className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-neutral-600">
                {skillList.map((skill, index) => (
                  <li key={skill}>
                    {skill}
                    {index < skillList.length - 1 ? <span className="ml-2 text-neutral-300">·</span> : null}
                  </li>
                ))}
              </ul>
            </PreviewSection>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function EntrySection({
  title,
  entries,
  titleLabel,
  organisationLabel,
  onAdd,
  onRemove,
  onChange,
}: {
  title: string;
  entries: Entry[];
  titleLabel: string;
  organisationLabel: string;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, patch: Partial<Entry>) => void;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-[0.6875rem] font-semibold tracking-wider text-fg-subtle uppercase">{title}</h2>

      {entries.map((entry, index) => (
        <div key={entry.id} className="space-y-3 rounded-lg border border-border bg-surface-sunken p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-fg-muted">
              {title} {index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove ${title.toLowerCase()} ${index + 1}`}
              disabled={entries.length <= 1}
              onClick={() => onRemove(entry.id)}
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={titleLabel} htmlFor={`${entry.id}-title`}>
              <Input
                id={`${entry.id}-title`}
                value={entry.title}
                onChange={(event) => onChange(entry.id, { title: event.target.value })}
              />
            </Field>
            <Field label={organisationLabel} htmlFor={`${entry.id}-org`}>
              <Input
                id={`${entry.id}-org`}
                value={entry.organisation}
                onChange={(event) => onChange(entry.id, { organisation: event.target.value })}
              />
            </Field>
            <Field label="Dates" htmlFor={`${entry.id}-period`}>
              <Input
                id={`${entry.id}-period`}
                value={entry.period}
                placeholder="2022 – present"
                onChange={(event) => onChange(entry.id, { period: event.target.value })}
              />
            </Field>
            <Field label="Location" htmlFor={`${entry.id}-location`}>
              <Input
                id={`${entry.id}-location`}
                value={entry.location}
                onChange={(event) => onChange(entry.id, { location: event.target.value })}
              />
            </Field>
          </div>

          <Field
            label="Details"
            htmlFor={`${entry.id}-details`}
            hint="One achievement per line. Each becomes a bullet."
          >
            <textarea
              id={`${entry.id}-details`}
              rows={3}
              value={entry.details}
              onChange={(event) => onChange(entry.id, { details: event.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg shadow-subtle outline-none focus:border-accent"
            />
          </Field>
        </div>
      ))}

      <Button type="button" variant="secondary" size="sm" onClick={onAdd}>
        <Plus className="size-4" aria-hidden="true" />
        Add {title.toLowerCase()}
      </Button>
    </section>
  );
}

function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="border-b border-neutral-200 pb-1 text-[0.6875rem] font-bold tracking-wider uppercase">
        {title}
      </h2>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

function PreviewEntries({ title, entries }: { title: string; entries: Entry[] }) {
  const filled = entries.filter(
    (entry) => entry.title.trim() || entry.organisation.trim() || entry.details.trim(),
  );
  if (filled.length === 0) return null;

  return (
    <PreviewSection title={title}>
      <div className="space-y-4">
        {filled.map((entry) => {
          const bullets = entry.details.split("\n").filter((line) => line.trim());
          return (
            <div key={entry.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <p className="font-semibold">{entry.title || entry.organisation}</p>
                <p className="text-xs text-neutral-500">
                  {[entry.period, entry.location].filter(Boolean).join("  ·  ")}
                </p>
              </div>
              {entry.title && entry.organisation ? (
                <p className="text-sm text-neutral-600">{entry.organisation}</p>
              ) : null}
              {bullets.length > 0 ? (
                <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-sm leading-relaxed text-neutral-600">
                  {bullets.map((bullet, index) => (
                    <li key={index}>{bullet.replace(/^[-*•]\s*/, "")}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>
    </PreviewSection>
  );
}
