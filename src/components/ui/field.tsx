"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export const controlClass =
  "w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-fg shadow-subtle transition-colors placeholder:text-fg-subtle hover:border-fg-subtle focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 disabled:cursor-not-allowed disabled:bg-bg-muted disabled:text-fg-subtle aria-[invalid=true]:border-fg aria-[invalid=true]:border-2";

export interface FieldProps {
  label: React.ReactNode;
  htmlFor: string;
  hint?: React.ReactNode;
  error?: string | null;
  /** Right-aligned adornment in the label row, e.g. a unit selector. */
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function Field({ label, htmlFor, hint, error, action, className, children }: FieldProps) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-[0.8125rem] font-medium text-fg">
          {label}
        </label>
        {action}
      </div>
      <FieldContext.Provider value={{ describedBy: cn(hintId, errorId) || undefined, invalid: Boolean(error) }}>
        {children}
      </FieldContext.Provider>
      {hint && !error ? (
        <p id={hintId} className="text-xs text-fg-subtle">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs font-semibold text-fg">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const FieldContext = React.createContext<{ describedBy?: string; invalid: boolean }>({
  invalid: false,
});

function useFieldWiring() {
  const context = React.useContext(FieldContext);
  return {
    "aria-describedby": context.describedBy,
    "aria-invalid": context.invalid || undefined,
  } as const;
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    const wiring = useFieldWiring();
    return <input ref={ref} className={cn(controlClass, className)} {...wiring} {...props} />;
  },
);

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  const wiring = useFieldWiring();
  return (
    <textarea
      ref={ref}
      className={cn(controlClass, "scrollbar-slim min-h-32 resize-y leading-relaxed", className)}
      {...wiring}
      {...props}
    />
  );
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  const wiring = useFieldWiring();
  return (
    <select
      ref={ref}
      className={cn(controlClass, "cursor-pointer appearance-none bg-no-repeat pr-9", className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23616161' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        backgroundPosition: "right 0.65rem center",
      }}
      {...wiring}
      {...props}
    >
      {children}
    </select>
  );
});

/** Segmented control used wherever a tool has two to four modes. */
export interface SegmentedProps<T extends string> {
  name: string;
  value: T;
  options: Array<{ value: T; label: React.ReactNode; title?: string }>;
  onChange: (value: T) => void;
  className?: string;
  ariaLabel: string;
}

export function Segmented<T extends string>({
  name,
  value,
  options,
  onChange,
  className,
  ariaLabel,
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex w-full items-stretch gap-1 rounded-lg border border-border bg-surface-sunken p-1",
        className,
      )}
    >
      {options.map((option) => {
        const id = `${name}-${option.value}`;
        const selected = option.value === value;
        return (
          <div key={option.value} className="flex-1">
            <input
              type="radio"
              id={id}
              name={name}
              value={option.value}
              checked={selected}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <label
              htmlFor={id}
              title={option.title}
              className={cn(
                "flex h-8 cursor-pointer items-center justify-center rounded-md px-3 text-center text-[0.8125rem] font-medium transition-colors",
                "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
                selected
                  ? "bg-surface text-fg shadow-subtle"
                  : "text-fg-muted hover:bg-surface/60 hover:text-fg",
              )}
            >
              {option.label}
            </label>
          </div>
        );
      })}
    </div>
  );
}

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: React.ReactNode;
  description?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, className, id, ...props },
  ref,
) {
  const generated = React.useId();
  const inputId = id ?? generated;

  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-border-strong accent-[var(--accent)]"
        {...props}
      />
      <div className="min-w-0">
        <label htmlFor={inputId} className="cursor-pointer text-sm text-fg select-none">
          {label}
        </label>
        {description ? <p className="text-xs text-fg-subtle">{description}</p> : null}
      </div>
    </div>
  );
});

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  valueLabel: React.ReactNode;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { label, valueLabel, className, id, ...props },
  ref,
) {
  const generated = React.useId();
  const inputId = id ?? generated;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={inputId} className="text-[0.8125rem] font-medium text-fg">
          {label}
        </label>
        <span className="tabular text-[0.8125rem] font-medium text-fg-muted">{valueLabel}</span>
      </div>
      <input
        ref={ref}
        id={inputId}
        type="range"
        className="h-5 w-full cursor-pointer accent-[var(--accent)]"
        {...props}
      />
    </div>
  );
});
