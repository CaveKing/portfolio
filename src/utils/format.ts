import type { Currency } from "@/types";

const CURRENCY_LOCALE: Record<Currency, string> = {
  THB: "th-TH",
  USD: "en-US",
};

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  THB: "฿",
  USD: "$",
};

const EM_DASH = "—";

/** Format a monetary amount with its currency symbol. */
export function formatCurrency(
  amount: number,
  currency: Currency = "THB",
  options: { compact?: boolean; maximumFractionDigits?: number } = {},
): string {
  if (!Number.isFinite(amount)) return EM_DASH;
  return new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
    style: "currency",
    currency,
    notation: options.compact ? "compact" : "standard",
    minimumFractionDigits: options.compact ? 0 : 2,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
  }).format(amount);
}

/** Always render a leading +/- sign, useful for profit/loss figures. */
export function formatSignedCurrency(
  amount: number,
  currency: Currency = "THB",
  options: { compact?: boolean } = {},
): string {
  if (!Number.isFinite(amount)) return EM_DASH;
  const sign = amount > 0 ? "+" : amount < 0 ? "-" : "";
  return `${sign}${formatCurrency(Math.abs(amount), currency, options)}`;
}

export function formatNumber(value: number, maximumFractionDigits = 2): string {
  if (!Number.isFinite(value)) return EM_DASH;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

/** Format a percentage value already expressed in percent units (e.g. 12.5 -> "12.50%"). */
export function formatPercent(value: number, options: { signed?: boolean } = {}): string {
  if (!Number.isFinite(value)) return EM_DASH;
  const sign = options.signed && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatShares(value: number): string {
  if (!Number.isFinite(value)) return EM_DASH;
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(value);
}

export function formatDate(ms: number): string {
  if (!Number.isFinite(ms)) return EM_DASH;
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(ms));
}

/** Compact day+month label for chart axes, e.g. "5 พ.ค.". */
export function formatShortDate(ms: number): string {
  if (!Number.isFinite(ms)) return EM_DASH;
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
  }).format(new Date(ms));
}

export function formatDateTime(ms: number): string {
  if (!Number.isFinite(ms)) return EM_DASH;
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ms));
}

/** A short, human relative time such as "เมื่อสักครู่" or "3 วันที่แล้ว". */
export function formatRelativeTime(ms: number, now: number = Date.now()): string {
  if (!Number.isFinite(ms)) return EM_DASH;
  const diff = now - ms;
  const sec = Math.round(diff / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  if (sec < 45) return "เมื่อสักครู่";
  if (min < 60) return `${min} นาทีที่แล้ว`;
  if (hr < 24) return `${hr} ชั่วโมงที่แล้ว`;
  if (day < 7) return `${day} วันที่แล้ว`;
  return formatDate(ms);
}

/** Format an epoch-ms value for an <input type="date"> (yyyy-mm-dd). */
export function toDateInputValue(ms: number): string {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
