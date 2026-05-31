"use client";

import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { ChevronDownIcon } from "./icons";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string | null;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, className, id, children, ...props },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "h-11 w-full appearance-none rounded-2xl border bg-surface pl-4 pr-10 text-[15px] text-foreground transition-all duration-200",
            "focus:outline-none focus:ring-2",
            error
              ? "border-danger focus:border-danger focus:ring-danger/25"
              : "border-border focus:border-brand/50 focus:ring-brand/25",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
      </div>
      {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  );
});
