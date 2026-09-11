"use client";

import * as React from "react";
import { CheckCircle2, Plus, Trash2, XCircle } from "lucide-react";

import { CopyButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Field, Input, Segmented, Textarea } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import { downloadText } from "@/lib/download";
import {
  AI_CRAWLERS,
  buildRobots,
  evaluateUrl,
  parseRobots,
  type RobotsWarning,
} from "@/lib/robots";

import { SelectField } from "../calculators/_shared";

type Mode = "build" | "test";

interface GroupDraft {
  id: number;
  agents: string;
  disallow: string;
  allow: string;
  crawlDelay: string;
}

let sequence = 0;
function draft(agents: string, disallow = "", allow = ""): GroupDraft {
  sequence += 1;
  return { id: sequence, agents, disallow, allow, crawlDelay: "" };
}

const PRESETS: Array<{ id: string; label: string; groups: () => GroupDraft[] }> = [
  { id: "allow", label: "Allow everything", groups: () => [draft("*")] },
  { id: "block", label: "Block everything", groups: () => [draft("*", "/")] },
  {
    id: "typical",
    label: "Typical website",
    groups: () => [draft("*", "/admin/\n/login\n/cart\n/search\n/*?*sessionid=")],
  },
  {
    id: "ai",
    label: "Block AI training crawlers",
    groups: () => [draft("*"), draft(AI_CRAWLERS.map((crawler) => crawler.token).join(", "), "/")],
  },
];

const CRAWLERS = ["Googlebot", "Bingbot", "GPTBot", "ClaudeBot", "Applebot", "DuckDuckBot"];

const lines = (value: string) => value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

function Warnings({ warnings }: { warnings: RobotsWarning[] }) {
  if (warnings.length === 0) return null;
  return (
    <Alert tone="warning" title={`${warnings.length} thing${warnings.length === 1 ? "" : "s"} to check`}>
      <ul className="list-disc space-y-0.5 pl-4">
        {warnings.map((warning, index) => (
          <li key={`${warning.line}-${index}`}>
            {warning.line > 0 ? `Line ${warning.line}: ` : ""}
            {warning.message}
          </li>
        ))}
      </ul>
    </Alert>
  );
}

export default function RobotsTxtGenerator() {
  const [mode, setMode] = React.useState<Mode>("build");
  const [groups, setGroups] = React.useState<GroupDraft[]>(() => PRESETS[2].groups());
  const [sitemaps, setSitemaps] = React.useState("https://example.com/sitemap.xml");
  const [testText, setTestText] = React.useState("");
  const [crawler, setCrawler] = React.useState("Googlebot");
  const [customCrawler, setCustomCrawler] = React.useState("");
  const [urls, setUrls] = React.useState("/\n/admin/settings\n/blog/first-post\n/search?q=shoes");

  const generated = React.useMemo(
    () =>
      buildRobots(
        groups.map((group) => ({
          agents: group.agents.split(/[,\n]/).map((agent) => agent.trim()),
          disallow: lines(group.disallow),
          allow: lines(group.allow),
          crawlDelay: Number(group.crawlDelay) > 0 ? Number(group.crawlDelay) : null,
        })),
        lines(sitemaps),
      ),
    [groups, sitemaps],
  );
  const generatedWarnings = React.useMemo(() => parseRobots(generated).warnings, [generated]);

  const tested = testText || generated;
  const parsedTest = React.useMemo(() => parseRobots(tested), [tested]);
  const crawlerName = crawler === "custom" ? customCrawler : crawler;
  const results = React.useMemo(
    () => (crawlerName.trim() ? lines(urls).slice(0, 100).map((url) => ({ url, verdict: evaluateUrl(parsedTest, crawlerName, url) })) : []),
    [crawlerName, parsedTest, urls],
  );

  const updateGroup = (id: number, key: keyof GroupDraft, value: string) =>
    setGroups((previous) => previous.map((group) => (group.id === id ? { ...group, [key]: value } : group)));

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Segmented
          name="robots-mode"
          ariaLabel="Mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: "build", label: "Build a file" },
            { value: "test", label: "Test URLs" },
          ]}
          className="sm:max-w-sm"
        />

        {mode === "build" ? (
          <>
            <div className="space-y-1.5">
              <span className="block text-[0.8125rem] font-medium text-fg">Start from a preset</span>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <Button key={preset.id} type="button" variant="secondary" size="sm" onClick={() => setGroups(preset.groups())}>
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {groups.map((group, index) => (
                <fieldset key={group.id} className="space-y-3 rounded-lg border border-border bg-surface-sunken p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <legend className="text-[0.8125rem] font-semibold text-fg">Group {index + 1}</legend>
                    {groups.length > 1 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setGroups((previous) => previous.filter((item) => item.id !== group.id))}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        Remove group
                      </Button>
                    ) : null}
                  </div>
                  <Field label="User-agents" htmlFor={`robots-agents-${group.id}`} hint="Separate with commas. * means every crawler.">
                    <Input
                      id={`robots-agents-${group.id}`}
                      value={group.agents}
                      onChange={(event) => updateGroup(group.id, "agents", event.target.value)}
                    />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Disallow — one path per line" htmlFor={`robots-disallow-${group.id}`}>
                      <Textarea
                        id={`robots-disallow-${group.id}`}
                        rows={4}
                        value={group.disallow}
                        placeholder="/private/"
                        onChange={(event) => updateGroup(group.id, "disallow", event.target.value)}
                        className="min-h-0 font-mono text-[0.8125rem]"
                      />
                    </Field>
                    <Field label="Allow — one path per line" htmlFor={`robots-allow-${group.id}`} hint="Use to re-open a path inside a blocked folder.">
                      <Textarea
                        id={`robots-allow-${group.id}`}
                        rows={4}
                        value={group.allow}
                        placeholder="/private/public-page"
                        onChange={(event) => updateGroup(group.id, "allow", event.target.value)}
                        className="min-h-0 font-mono text-[0.8125rem]"
                      />
                    </Field>
                  </div>
                  <Field label="Crawl-delay in seconds (optional)" htmlFor={`robots-delay-${group.id}`} className="sm:max-w-60">
                    <Input
                      id={`robots-delay-${group.id}`}
                      type="number"
                      min={0}
                      step="any"
                      value={group.crawlDelay}
                      onChange={(event) => updateGroup(group.id, "crawlDelay", event.target.value)}
                    />
                  </Field>
                </fieldset>
              ))}
              <Button type="button" variant="secondary" size="sm" onClick={() => setGroups((previous) => [...previous, draft("")])}>
                <Plus className="size-4" aria-hidden="true" />
                Add a group
              </Button>
            </div>

            <Field label="Sitemap URLs — one per line" htmlFor="robots-sitemaps">
              <Textarea
                id="robots-sitemaps"
                rows={2}
                value={sitemaps}
                onChange={(event) => setSitemaps(event.target.value)}
                className="min-h-0 font-mono text-[0.8125rem]"
              />
            </Field>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label htmlFor="robots-output" className="text-[0.8125rem] font-medium text-fg">
                  robots.txt
                </label>
                <div className="flex gap-1.5">
                  <CopyButton value={generated} />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={!generated}
                    onClick={() => downloadText(generated, "robots.txt")}
                  >
                    Download
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setTestText(generated);
                      setMode("test");
                    }}
                  >
                    Test this file
                  </Button>
                </div>
              </div>
              <Textarea
                id="robots-output"
                readOnly
                rows={Math.min(18, Math.max(4, generated.split("\n").length))}
                value={generated}
                className="bg-surface-sunken font-mono text-[0.8125rem]"
              />
            </div>
            <Warnings warnings={generatedWarnings} />

            <details className="rounded-lg border border-border bg-surface-sunken">
              <summary className="cursor-pointer px-3.5 py-2.5 text-[0.8125rem] font-medium text-fg">
                What the AI crawler preset blocks
              </summary>
              <ul className="space-y-1 px-3.5 pb-3 text-[0.8125rem] text-fg-muted">
                {AI_CRAWLERS.map((entry) => (
                  <li key={entry.token}>
                    <span className="font-mono text-fg">{entry.token}</span> ({entry.owner}) — {entry.purpose}.
                  </li>
                ))}
              </ul>
            </details>
          </>
        ) : (
          <>
            <Field label="robots.txt to test" htmlFor="robots-test-file" hint="Paste a site's robots.txt, or use the file from the Build tab.">
              <Textarea
                id="robots-test-file"
                rows={8}
                value={tested}
                onChange={(event) => setTestText(event.target.value)}
                className="font-mono text-[0.8125rem]"
              />
            </Field>
            <Warnings warnings={parsedTest.warnings} />

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField label="Crawler" id="robots-crawler" value={crawler} onChange={setCrawler}>
                {CRAWLERS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
                <option value="custom">Another crawler…</option>
              </SelectField>
              {crawler === "custom" ? (
                <Field label="Crawler name" htmlFor="robots-custom">
                  <Input id="robots-custom" value={customCrawler} placeholder="e.g. AhrefsBot" onChange={(event) => setCustomCrawler(event.target.value)} />
                </Field>
              ) : null}
            </div>

            <Field label="URLs or paths — one per line" htmlFor="robots-urls">
              <Textarea
                id="robots-urls"
                rows={4}
                value={urls}
                onChange={(event) => setUrls(event.target.value)}
                className="font-mono text-[0.8125rem]"
              />
            </Field>

            {results.length > 0 ? (
              <ul className="space-y-2" aria-live="polite">
                {results.map(({ url, verdict }, index) => {
                  const Icon = verdict.allowed ? CheckCircle2 : XCircle;
                  return (
                    <li key={`${url}-${index}`} className="rounded-lg border border-border bg-surface p-3 text-[0.8125rem]">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="min-w-0 font-mono break-all text-fg">{verdict.path}</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-fg">
                          <Icon className="size-4" aria-hidden="true" />
                          {verdict.allowed ? "Allowed" : "Blocked"}
                        </span>
                      </div>
                      <p className="mt-1 text-fg-muted">
                        {verdict.rule
                          ? `Decided by “${verdict.rule.allow ? "Allow" : "Disallow"}: ${verdict.rule.path}” on line ${verdict.rule.line}.`
                          : verdict.path === "/robots.txt"
                            ? "robots.txt itself is always fetchable."
                            : "No rule matches, so it is allowed by default."}{" "}
                        {verdict.agents.length === 0
                          ? "No group applies to this crawler."
                          : verdict.usedWildcardGroup
                            ? "No group names this crawler, so the * group applies."
                            : `Rules from the group for ${verdict.agents.join(", ")}.`}
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </>
        )}
      </div>
    </ToolFrame>
  );
}
