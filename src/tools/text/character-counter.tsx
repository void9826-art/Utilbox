"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Alert } from "@/components/ui/surfaces";
import { cn, formatNumber } from "@/lib/utils";

import { Metric, MetricGrid, TextInput, analyseText } from "./_shared";

/**
 * Characters available in the GSM 7-bit alphabet used by SMS. A single
 * character outside this set switches the whole message to UCS-2 and cuts the
 * limit from 160 to 70, which is worth warning about.
 */
const GSM_BASIC =
  "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
const GSM_EXTENDED = "^{}\\[~]|€";

function isGsm7(text: string): boolean {
  for (const char of text) {
    if (!GSM_BASIC.includes(char) && !GSM_EXTENDED.includes(char)) return false;
  }
  return true;
}

const LIMITS = [
  { label: "X / Twitter post", limit: 280, note: "Free accounts" },
  { label: "Meta description", limit: 160, note: "Google truncates by pixel width" },
  { label: "Page title", limit: 60, note: "Recommended maximum" },
  { label: "SMS (single message)", limit: 160, note: "GSM-7 encoding" },
  { label: "Instagram caption", limit: 2200, note: "Hard limit" },
  { label: "LinkedIn post", limit: 3000, note: "Hard limit" },
];

export default function CharacterCounter() {
  const [text, setText] = React.useState("");

  const stats = React.useMemo(() => analyseText(text), [text]);

  const sms = React.useMemo(() => {
    if (!text) return null;
    const gsm = isGsm7(text);
    const perMessage = gsm ? 160 : 70;
    const perConcatenated = gsm ? 153 : 67;
    const length = gsm ? text.length : stats.graphemes;
    const messages = length <= perMessage ? 1 : Math.ceil(length / perConcatenated);
    return { gsm, perMessage, messages, length };
  }, [stats.graphemes, text]);

  const emojiHeavy = stats.characters !== stats.graphemes;

  return (
    <ToolFrame>
      <div className="space-y-5">
        <TextInput
          id="character-counter-input"
          value={text}
          onChange={setText}
          rows={8}
          placeholder="Paste the text you want to measure…"
        />

        <MetricGrid>
          <Metric label="Characters" value={stats.characters} emphasis hint="UTF-16 code units" />
          <Metric label="Without spaces" value={stats.charactersNoSpaces} />
          <Metric label="Visible characters" value={stats.graphemes} hint="What a reader sees" />
          <Metric label="Bytes (UTF-8)" value={stats.bytes} hint="Storage and SMS size" />
        </MetricGrid>

        {emojiHeavy ? (
          <Alert tone="info" title="This text contains multi-unit characters">
            {formatNumber(stats.characters)} code units make up {formatNumber(stats.graphemes)} visible
            characters. Emoji, flags and some accented letters take more than one unit, and platforms differ
            on which number they count against your limit.
          </Alert>
        ) : null}

        {sms ? (
          <Alert
            tone={sms.gsm ? "success" : "warning"}
            title={
              sms.gsm
                ? `Fits the GSM-7 alphabet — ${sms.messages} SMS message${sms.messages === 1 ? "" : "s"}`
                : `Contains characters outside GSM-7 — ${sms.messages} SMS message${sms.messages === 1 ? "" : "s"}`
            }
          >
            {sms.gsm
              ? `A single SMS holds 160 GSM-7 characters. This text is ${formatNumber(sms.length)}.`
              : `A curly quote, em dash or emoji forces UCS-2 encoding, which drops the limit from 160 to 70 characters per message. This text is ${formatNumber(sms.length)} characters.`}
          </Alert>
        ) : null}

        <section className="space-y-2">
          <h2 className="text-[0.8125rem] font-medium text-fg">Against common limits</h2>
          <ul className="space-y-2">
            {LIMITS.map((entry) => {
              const used = Math.min(100, (stats.characters / entry.limit) * 100);
              const over = stats.characters > entry.limit;
              return (
                <li key={entry.label} className="flex items-center gap-3">
                  <span className="w-44 shrink-0 text-[0.8125rem] text-fg">
                    {entry.label}
                    <span className="block text-[0.6875rem] text-fg-subtle">{entry.note}</span>
                  </span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-sunken">
                    <span
                      className={cn(
                        "block h-full rounded-full transition-[width] duration-200",
                        over ? "bg-fg" : used > 90 ? "bg-fg-subtle" : "bg-border-strong",
                      )}
                      style={{ width: `${used}%` }}
                    />
                  </span>
                  <span
                    className={cn(
                      "tabular w-24 shrink-0 text-right text-xs",
                      over ? "font-semibold text-fg" : "text-fg-muted",
                    )}
                  >
                    {over
                      ? `${formatNumber(stats.characters - entry.limit)} over`
                      : `${formatNumber(entry.limit - stats.characters)} left`}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </ToolFrame>
  );
}
