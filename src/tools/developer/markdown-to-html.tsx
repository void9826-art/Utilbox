"use client";

import * as React from "react";

import { CodeEditor } from "@/components/tool/code-editor";
import { CopyButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Segmented } from "@/components/ui/field";
import { downloadText } from "@/lib/download";
import { htmlDocument, markdownToHtml } from "@/lib/markdown";

// Starts at ## so the live preview does not add a second h1 to the page.
const SAMPLE = `## Release notes

Version **2.1** adds *dark mode* and fixes the export bug.

### What changed

- Faster start-up
- [x] Dark mode
- [ ] Offline sync (next release)

| Feature | Status |
|---|:---:|
| Export | Fixed |
| Import | Unchanged |

> Back up your data before upgrading.

\`\`\`js
const theme = "dark";
\`\`\`

Read the [full changelog](https://example.com/changelog).
`;

export default function MarkdownToHtml() {
  const [markdown, setMarkdown] = React.useState(SAMPLE);
  const [view, setView] = React.useState<"preview" | "html">("preview");
  const [fullDocument, setFullDocument] = React.useState(false);

  const html = React.useMemo(() => markdownToHtml(markdown), [markdown]);
  const exported = fullDocument ? htmlDocument(html, markdown.match(/^#\s+(.+)$/m)?.[1] ?? "Document") : html;

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <CodeEditor
            id="markdown-input"
            label="Markdown"
            value={markdown}
            onChange={setMarkdown}
            rows={18}
            accept=".md,.markdown,.txt,text/markdown,text/plain"
          />

          <div className="min-w-0 space-y-2">
            <Segmented
              name="markdown-view"
              ariaLabel="Show"
              value={view}
              onChange={setView}
              options={[
                { value: "preview", label: "Preview" },
                { value: "html", label: "HTML code" },
              ]}
            />
            {view === "preview" ? (
              <div
                className="prose-content scrollbar-slim max-h-[30rem] min-h-40 overflow-auto rounded-lg border border-border bg-surface p-4 break-words [&_blockquote]:border-l-2 [&_blockquote]:border-border-strong [&_blockquote]:pl-3 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-fg [&_h2]:mt-4 [&_h4]:font-semibold [&_img]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-surface-sunken [&_pre]:p-3 [&_.task-list-item]:list-none"
                aria-label="Rendered preview"
                role="region"
                aria-live="polite"
                // The converter escapes all text and drops unsafe links, so its output is safe to render.
                dangerouslySetInnerHTML={{ __html: html || "<p>Nothing to preview yet.</p>" }}
              />
            ) : (
              <CodeEditor id="markdown-html" label="HTML" value={exported} readOnly rows={16} showStats={false} />
            )}
          </div>
        </div>

        <Checkbox
          label="Wrap in a complete HTML page"
          description="Adds <!doctype>, <head> and a title taken from the first heading."
          checked={fullDocument}
          onChange={(event) => setFullDocument(event.target.checked)}
        />

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            disabled={!html}
            onClick={() => downloadText(exported, fullDocument ? "document.html" : "fragment.html", "text/html;charset=utf-8")}
          >
            Download HTML
          </Button>
          <CopyButton value={exported} label="Copy HTML" />
        </div>
      </div>
    </ToolFrame>
  );
}
