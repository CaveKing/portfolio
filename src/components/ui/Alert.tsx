import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon } from "./icons";

type AlertVariant = "error" | "success" | "info";

const STYLES: Record<AlertVariant, string> = {
  error: "border-danger/30 bg-danger-soft",
  success: "border-success/30 bg-success-soft",
  info: "border-brand/20 bg-brand-50",
};

const ACCENT: Record<AlertVariant, string> = {
  error: "text-danger",
  success: "text-success",
  info: "text-brand",
};

const ICONS = {
  error: AlertTriangleIcon,
  success: CheckCircleIcon,
  info: InfoIcon,
} as const;

export function Alert({
  variant = "info",
  children,
  className,
}: {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}) {
  const Icon = ICONS[variant];
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm",
        STYLES[variant],
        className,
      )}
      role={variant === "error" ? "alert" : "status"}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", ACCENT[variant])} />
      <div className="leading-relaxed text-foreground">{children}</div>
    </div>
  );
}
