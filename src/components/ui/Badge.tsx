import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type BadgeVariant = "neutral" | "brand" | "success" | "danger" | "warning";

const VARIANTS: Record<BadgeVariant, string> = {
  neutral: "bg-surface-2 text-muted",
  brand: "bg-brand-50 text-brand-700",
  success: "bg-success-soft text-success",
  danger: "bg-danger-soft text-danger",
  warning: "bg-warning-soft text-warning",
};

export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
