"use client";

import * as React from "react";
import { Check, Info, TriangleAlert, X } from "lucide-react";

import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "info";

interface Toast {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
}

interface ToastContextValue {
  notify: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

/** How long a message stays before it disappears. */
const LIFETIME = 4000;

let sequence = 0;

const TONE_ICON = {
  success: Check,
  error: TriangleAlert,
  info: Info,
} as const;

/**
 * Small transient messages.
 *
 * Adapted from the supplied notification card, with its fixed green palette
 * replaced by the site's tokens so it reads in both themes. Tone is carried by
 * an icon and by the wording as well as the border, because colour alone is
 * not something every visitor can rely on.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const timers = React.useRef<Array<ReturnType<typeof setTimeout>>>([]);

  React.useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const notify = React.useCallback((toast: Omit<Toast, "id">) => {
    sequence += 1;
    const id = sequence;
    setToasts((previous) => [...previous, { ...toast, id }]);
    timers.current.push(
      setTimeout(() => setToasts((previous) => previous.filter((entry) => entry.id !== id)), LIFETIME),
    );
  }, []);

  const value = React.useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Announced politely, never stealing focus from whatever is in hand. */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end"
      >
        {toasts.map((toast) => {
          const Icon = TONE_ICON[toast.tone];
          return (
            <div
              key={toast.id}
              className={cn(
                "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-[var(--radius-card)] border bg-surface p-3.5 shadow-raised",
                toast.tone === "error" ? "border-danger-border" : "border-border",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
                  toast.tone === "error" ? "bg-danger-soft text-fg" : "bg-accent-soft text-accent-text",
                )}
              >
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-fg">{toast.title}</span>
                {toast.description ? (
                  <span className="mt-0.5 block truncate text-[0.8125rem] text-fg-muted">{toast.description}</span>
                ) : null}
              </span>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setToasts((previous) => previous.filter((entry) => entry.id !== toast.id))}
                className="rounded p-1 text-fg-subtle transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Returns a notify function. Calling it outside the provider is a no-op rather
 * than an error, so a component rendered in isolation still works.
 */
export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext);
  return context ?? { notify: () => {} };
}
