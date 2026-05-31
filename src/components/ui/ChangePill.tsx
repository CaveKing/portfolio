import { cn } from "@/utils/cn";
import { formatPercent, formatSignedCurrency } from "@/utils/format";
import type { Currency } from "@/types";
import { ArrowDownIcon, ArrowUpIcon } from "./icons";

/** Color class for a profit/loss value (gain = green, loss = red, flat = muted). */
export function pnlColor(value: number): string {
  if (value > 0) return "text-success";
  if (value < 0) return "text-danger";
  return "text-muted";
}

interface ChangePillProps {
  value: number;
  percent?: number;
  currency?: Currency;
  /** "percent" shows %, "currency" shows money, "both" shows money (pct). */
  mode?: "percent" | "currency" | "both";
  size?: "sm" | "md";
  className?: string;
}

export function ChangePill({
  value,
  percent,
  currency = "THB",
  mode = "percent",
  size = "sm",
  className,
}: ChangePillProps) {
  const positive = value > 0;
  const negative = value < 0;
  const Icon = positive ? ArrowUpIcon : negative ? ArrowDownIcon : null;

  let text: string;
  if (mode === "currency") {
    text = formatSignedCurrency(value, currency);
  } else if (mode === "both") {
    text =
      percent === undefined
        ? formatSignedCurrency(value, currency)
        : `${formatSignedCurrency(value, currency)} (${formatPercent(percent, { signed: true })})`;
  } else {
    text = formatPercent(percent ?? value, { signed: true });
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 font-semibold tabular-nums",
        size === "sm" ? "text-sm" : "text-[15px]",
        positive ? "text-success" : negative ? "text-danger" : "text-muted",
        className,
      )}
    >
      {Icon && <Icon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />}
      {text}
    </span>
  );
}
