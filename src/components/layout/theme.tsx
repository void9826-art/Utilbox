"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

export type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "utilbox-theme";

/**
 * Runs before first paint so the correct palette is applied without a flash.
 * Kept as a string because it must execute synchronously in <head>.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem("${STORAGE_KEY}");var d=s==="dark"||((s===null||s==="system")&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

function applyTheme(preference: ThemePreference): void {
  const dark =
    preference === "dark" ||
    (preference === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

const OPTIONS: Array<{ value: ThemePreference; label: string; icon: typeof Sun }> = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeToggle({ className }: { className?: string }) {
  // "system" until the effect reads storage — matches the server-rendered markup.
  const [preference, setPreference] = React.useState<ThemePreference>("system");
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage does not exist on the server, so the saved preference can only be read after mount
      setPreference(stored);
    }
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => applyTheme(preference);
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [preference, ready]);

  const choose = (value: ThemePreference) => {
    setPreference(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Private browsing can block storage; the choice still applies this session.
    }
    applyTheme(value);
  };

  const cycle = () => {
    const index = OPTIONS.findIndex((option) => option.value === preference);
    choose(OPTIONS[(index + 1) % OPTIONS.length].value);
  };

  const current = OPTIONS.find((option) => option.value === preference) ?? OPTIONS[2];
  const Icon = current.icon;

  return (
    <button
      type="button"
      onClick={cycle}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-bg-muted hover:text-fg",
        className,
      )}
      aria-label={`Theme: ${current.label}. Click to change.`}
      title={`Theme: ${current.label}`}
    >
      <Icon className="size-[1.125rem]" aria-hidden="true" />
    </button>
  );
}
