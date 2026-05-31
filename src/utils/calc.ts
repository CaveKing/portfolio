import type {
  Currency,
  CurrencyTotals,
  Holding,
  HoldingWithMetrics,
  Period,
  Transaction,
} from "@/types";

/** Enrich a single holding with market value, cost basis and P/L. */
export function computeHoldingMetrics(holding: Holding): HoldingWithMetrics {
  const marketValue = holding.shares * holding.currentPrice;
  const costBasis = holding.shares * holding.averageCost;
  const profitLoss = marketValue - costBasis;
  const profitLossPercent = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;
  return { ...holding, marketValue, costBasis, profitLoss, profitLossPercent };
}

export function computeHoldingsMetrics(holdings: Holding[]): HoldingWithMetrics[] {
  return holdings.map(computeHoldingMetrics);
}

/**
 * Aggregate holdings into per-currency totals. We never convert across
 * currencies (no FX feed), so each currency is summarized independently.
 * Sorted by market value, descending.
 */
export function aggregateByCurrency(holdings: Holding[]): CurrencyTotals[] {
  const map = new Map<Currency, CurrencyTotals>();
  for (const holding of holdings) {
    const m = computeHoldingMetrics(holding);
    const current =
      map.get(holding.currency) ??
      ({
        currency: holding.currency,
        marketValue: 0,
        costBasis: 0,
        profitLoss: 0,
        profitLossPercent: 0,
        holdingsCount: 0,
      } satisfies CurrencyTotals);
    current.marketValue += m.marketValue;
    current.costBasis += m.costBasis;
    current.profitLoss += m.profitLoss;
    current.holdingsCount += 1;
    map.set(holding.currency, current);
  }
  return Array.from(map.values())
    .map((totals) => ({
      ...totals,
      profitLossPercent:
        totals.costBasis > 0 ? (totals.profitLoss / totals.costBasis) * 100 : 0,
    }))
    .sort((a, b) => b.marketValue - a.marketValue);
}

/** Distinct currencies present in a set of holdings, in display order. */
export function currenciesInUse(holdings: Holding[]): Currency[] {
  const seen = aggregateByCurrency(holdings).map((t) => t.currency);
  return seen.length ? seen : [];
}

export interface AllocationSlice {
  symbol: string;
  value: number;
  percent: number;
}

/** Allocation by market value for the pie chart, within a single currency. */
export function buildAllocation(
  holdings: Holding[],
  currency: Currency,
): AllocationSlice[] {
  const slices = holdings
    .filter((h) => h.currency === currency)
    .map((h) => ({ symbol: h.symbol, value: h.shares * h.currentPrice }));
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  return slices
    .map((s) => ({ ...s, percent: total > 0 ? (s.value / total) * 100 : 0 }))
    .sort((a, b) => b.value - a.value);
}

export interface ValuePoint {
  date: number;
  value: number;
}

export interface TimelineResult {
  points: ValuePoint[];
  /** What the series represents, for the chart label. */
  metric: "portfolio" | "contributions";
}

/**
 * Reconstruct a portfolio timeline (line chart) for a single currency from the
 * user's own transaction records — no external price history is invented.
 *
 * - If buy/sell trades exist: plot the running cost basis after each trade,
 *   then append a final point marked to current market prices.
 * - Otherwise: fall back to cumulative net contributions (deposits − withdraws).
 */
export function buildPortfolioTimeline(
  transactions: Transaction[],
  holdings: Holding[],
  currency: Currency,
  now: number = Date.now(),
): TimelineResult {
  const txs = transactions
    .filter((t) => t.currency === currency)
    .slice()
    .sort((a, b) => a.date - b.date);

  const hasTrades = txs.some((t) => t.type === "buy" || t.type === "sell");

  if (hasTrades) {
    const positions = new Map<string, { shares: number; cost: number }>();
    const points: ValuePoint[] = [];
    for (const t of txs) {
      if (t.type === "buy" && t.symbol) {
        const p = positions.get(t.symbol) ?? { shares: 0, cost: 0 };
        p.shares += t.shares ?? 0;
        p.cost += (t.shares ?? 0) * (t.price ?? 0) + (t.fee ?? 0);
        positions.set(t.symbol, p);
      } else if (t.type === "sell" && t.symbol) {
        const p = positions.get(t.symbol);
        if (p && p.shares > 0) {
          const sellShares = Math.min(t.shares ?? 0, p.shares);
          const avgCost = p.cost / p.shares;
          p.cost -= avgCost * sellShares;
          p.shares -= sellShares;
          positions.set(t.symbol, p);
        }
      }
      const value = sumPositions(positions);
      points.push({ date: t.date, value });
    }
    const marketValue = holdings
      .filter((h) => h.currency === currency)
      .reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
    points.push({ date: now, value: marketValue });
    return { points, metric: "portfolio" };
  }

  let running = 0;
  const points: ValuePoint[] = [];
  for (const t of txs) {
    if (t.type === "deposit") running += t.amount;
    else if (t.type === "withdraw") running -= t.amount;
    points.push({ date: t.date, value: running });
  }
  return { points, metric: "contributions" };
}

function sumPositions(
  positions: Map<string, { shares: number; cost: number }>,
): number {
  let total = 0;
  for (const p of positions.values()) total += p.cost;
  return total;
}

export interface RealizedEvent {
  date: number;
  symbol: string;
  pnl: number;
}

/**
 * Replay buy/sell transactions with the average-cost method to derive realized
 * P/L events. Used by the Performance view.
 */
export function computeRealizedEvents(
  transactions: Transaction[],
  currency: Currency,
): RealizedEvent[] {
  const txs = transactions
    .filter((t) => t.currency === currency)
    .slice()
    .sort((a, b) => a.date - b.date);
  const positions = new Map<string, { shares: number; cost: number }>();
  const events: RealizedEvent[] = [];
  for (const t of txs) {
    if (t.type === "buy" && t.symbol) {
      const p = positions.get(t.symbol) ?? { shares: 0, cost: 0 };
      p.shares += t.shares ?? 0;
      p.cost += (t.shares ?? 0) * (t.price ?? 0) + (t.fee ?? 0);
      positions.set(t.symbol, p);
    } else if (t.type === "sell" && t.symbol) {
      const p = positions.get(t.symbol);
      if (p && p.shares > 0) {
        const sellShares = Math.min(t.shares ?? 0, p.shares);
        const avgCost = p.cost / p.shares;
        const proceeds = sellShares * (t.price ?? 0) - (t.fee ?? 0);
        const costPortion = avgCost * sellShares;
        events.push({ date: t.date, symbol: t.symbol, pnl: proceeds - costPortion });
        p.cost -= costPortion;
        p.shares -= sellShares;
        positions.set(t.symbol, p);
      }
    }
  }
  return events;
}

/** Inclusive start (epoch ms) of the rolling window for a performance period. */
export function periodStart(period: Period, now: number = Date.now()): number {
  const d = new Date(now);
  switch (period) {
    case "daily":
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    case "weekly":
      return now - 7 * 24 * 60 * 60 * 1000;
    case "monthly":
      return now - 30 * 24 * 60 * 60 * 1000;
    case "yearly":
      return now - 365 * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
}

export interface PerformanceSummary {
  period: Period;
  realizedPnl: number;
  contributions: number;
  tradeCount: number;
}

/** Summarize activity within a rolling period window for one currency. */
export function summarizePerformance(
  transactions: Transaction[],
  currency: Currency,
  period: Period,
  now: number = Date.now(),
): PerformanceSummary {
  const start = periodStart(period, now);
  const realized = computeRealizedEvents(transactions, currency).filter(
    (e) => e.date >= start && e.date <= now,
  );
  const realizedPnl = realized.reduce((sum, e) => sum + e.pnl, 0);

  let contributions = 0;
  let tradeCount = 0;
  for (const t of transactions) {
    if (t.currency !== currency) continue;
    if (t.date < start || t.date > now) continue;
    if (t.type === "deposit") contributions += t.amount;
    else if (t.type === "withdraw") contributions -= t.amount;
    if (t.type === "buy" || t.type === "sell") tradeCount += 1;
  }

  return { period, realizedPnl, contributions, tradeCount };
}

/** Per-symbol P/L bars for the dashboard chart view. */
export interface SymbolPnl {
  symbol: string;
  profitLoss: number;
  profitLossPercent: number;
}

export function buildSymbolPnl(
  holdings: Holding[],
  currency: Currency,
): SymbolPnl[] {
  return holdings
    .filter((h) => h.currency === currency)
    .map((h) => {
      const m = computeHoldingMetrics(h);
      return {
        symbol: h.symbol,
        profitLoss: m.profitLoss,
        profitLossPercent: m.profitLossPercent,
      };
    })
    .sort((a, b) => b.profitLoss - a.profitLoss);
}
