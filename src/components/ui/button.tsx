import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const VARIANTS = {
  primary:
    "bg-accent text-accent-fg shadow-subtle hover:bg-accent-hover active:translate-y-px disabled:hover:bg-accent",
  secondary:
    "bg-surface text-fg border border-border-strong shadow-subtle hover:bg-bg-muted active:translate-y-px",
  ghost: "text-fg-muted hover:bg-bg-muted hover:text-fg",
  danger:
    "bg-fg text-bg shadow-subtle hover:opacity-90 active:translate-y-px",
  link: "text-accent-text underline underline-offset-4 hover:no-underline p-0 h-auto",
} as const;

const SIZES = {
  sm: "h-8 px-3 text-[0.8125rem] gap-1.5 rounded-md",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-6 text-[0.9375rem] gap-2 rounded-lg",
  icon: "h-10 w-10 justify-center rounded-lg",
  "icon-sm": "h-8 w-8 justify-center rounded-md",
} as const;

export type ButtonVariant = keyof typeof VARIANTS;
export type ButtonSize = keyof typeof SIZES;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

export const buttonBase =
  "inline-flex items-center justify-center font-medium select-none transition-[background-color,color,border-color,box-shadow,transform] duration-150 disabled:pointer-events-none disabled:opacity-50";

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", loading = false, fullWidth, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        buttonBase,
        VARIANTS[variant],
        variant === "link" ? "" : SIZES[size],
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
});

/** Class list for anchors that should look like buttons but stay real links. */
export function linkButtonClass(variant: ButtonVariant = "secondary", size: ButtonSize = "md"): string {
  return cn(buttonBase, VARIANTS[variant], variant === "link" ? "" : SIZES[size]);
}
