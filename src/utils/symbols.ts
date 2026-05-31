import type { Currency } from "@/types";

/**
 * Map an app symbol to a Yahoo Finance ticker.
 * Thai (THB) stocks trade on SET and use the ".BK" suffix on Yahoo.
 */
export function toYahooSymbol(symbol: string, currency: Currency): string {
  const s = symbol.trim().toUpperCase();
  if (!s) return s;
  if (currency === "THB" && !s.includes(".")) return `${s}.BK`;
  return s;
}

/** Strip exchange suffixes for display (e.g. "PTT.BK" -> "PTT"). */
export function displaySymbol(symbol: string): string {
  return symbol.replace(/\.[A-Z]+$/i, "");
}
