import { NextResponse } from "next/server";

// The route depends on the `symbols` query param, so it runs per-request.
// The upstream Yahoo fetch is cached for 1 hour to match the page's refresh
// cadence and avoid hammering the provider.
export const dynamic = "force-dynamic";

const ONE_HOUR = 60 * 60;
const MAX_SYMBOLS = 30;

export interface QuoteResult {
  requested: string;
  symbol: string;
  currency: string | null;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  spark: number[];
}

async function fetchQuote(requested: string): Promise<QuoteResult | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      requested,
    )}?interval=60m&range=5d`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; PortInvest/1.0)" },
      next: { revalidate: ONE_HOUR },
    });
    if (!res.ok) return null;

    const json = (await res.json()) as YahooChartResponse;
    const result = json?.chart?.result?.[0];
    const meta = result?.meta;
    if (!meta || typeof meta.regularMarketPrice !== "number") return null;

    const price = meta.regularMarketPrice;
    const previousClose =
      typeof meta.chartPreviousClose === "number"
        ? meta.chartPreviousClose
        : typeof meta.previousClose === "number"
          ? meta.previousClose
          : price;
    const closes = (result?.indicators?.quote?.[0]?.close ?? []).filter(
      (n): n is number => typeof n === "number",
    );
    const change = price - previousClose;
    const changePercent = previousClose ? (change / previousClose) * 100 : 0;

    return {
      requested,
      symbol: typeof meta.symbol === "string" ? meta.symbol : requested,
      currency: typeof meta.currency === "string" ? meta.currency : null,
      price,
      previousClose,
      change,
      changePercent,
      spark: closes.slice(-48),
    };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbols = (searchParams.get("symbols") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX_SYMBOLS);

  if (symbols.length === 0) {
    return NextResponse.json({ quotes: [], fetchedAt: Date.now() });
  }

  const settled = await Promise.all(symbols.map(fetchQuote));
  const quotes = settled.filter((q): q is QuoteResult => q !== null);
  return NextResponse.json({ quotes, fetchedAt: Date.now() });
}

// Minimal shape of the Yahoo Finance chart response we rely on.
interface YahooChartResponse {
  chart?: {
    result?: Array<{
      meta?: {
        symbol?: string;
        currency?: string;
        regularMarketPrice?: number;
        chartPreviousClose?: number;
        previousClose?: number;
      };
      indicators?: {
        quote?: Array<{ close?: Array<number | null> }>;
      };
    }>;
  };
}
