import { describe, expect, it } from "vitest";
import {
  aggregateByCurrency,
  buildAllocation,
  buildPortfolioTimeline,
  buildSymbolPnl,
  computeHoldingMetrics,
  computeRealizedEvents,
  summarizePerformance,
} from "./calc";
import type { Holding, Transaction } from "@/types";

const DAY = 24 * 60 * 60 * 1000;

function holding(overrides: Partial<Holding> = {}): Holding {
  return {
    id: "h1",
    symbol: "AAA",
    shares: 10,
    averageCost: 100,
    currentPrice: 120,
    currency: "THB",
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}

function tx(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: "t1",
    type: "buy",
    currency: "THB",
    amount: 0,
    date: 0,
    createdAt: 0,
    ...overrides,
  };
}

describe("computeHoldingMetrics", () => {
  it("computes market value, cost basis, and P/L", () => {
    const m = computeHoldingMetrics(holding());
    expect(m.marketValue).toBe(1200);
    expect(m.costBasis).toBe(1000);
    expect(m.profitLoss).toBe(200);
    expect(m.profitLossPercent).toBeCloseTo(20);
  });

  it("avoids divide-by-zero when cost basis is 0", () => {
    const m = computeHoldingMetrics(holding({ averageCost: 0 }));
    expect(m.profitLossPercent).toBe(0);
  });
});

describe("aggregateByCurrency", () => {
  it("groups per currency without cross-currency conversion", () => {
    const result = aggregateByCurrency([
      holding({ id: "a", currency: "THB", shares: 10, averageCost: 100, currentPrice: 120 }),
      holding({ id: "b", currency: "THB", shares: 5, averageCost: 200, currentPrice: 180 }),
      holding({ id: "c", currency: "USD", shares: 2, averageCost: 50, currentPrice: 60 }),
    ]);
    expect(result).toHaveLength(2);
    const thb = result.find((r) => r.currency === "THB")!;
    expect(thb.marketValue).toBe(1200 + 900);
    expect(thb.costBasis).toBe(1000 + 1000);
    expect(thb.profitLoss).toBe(100);
    expect(thb.holdingsCount).toBe(2);
  });

  it("sorts by market value descending", () => {
    const result = aggregateByCurrency([
      holding({ id: "a", currency: "USD", shares: 1, currentPrice: 10, averageCost: 10 }),
      holding({ id: "b", currency: "THB", shares: 100, currentPrice: 10, averageCost: 10 }),
    ]);
    expect(result[0].currency).toBe("THB");
  });
});

describe("buildAllocation", () => {
  it("returns slices that sum to 100% within a currency", () => {
    const slices = buildAllocation(
      [
        holding({ id: "a", symbol: "AAA", shares: 1, currentPrice: 300 }),
        holding({ id: "b", symbol: "BBB", shares: 1, currentPrice: 100 }),
        holding({ id: "c", symbol: "CCC", shares: 1, currentPrice: 100, currency: "USD" }),
      ],
      "THB",
    );
    expect(slices).toHaveLength(2);
    const total = slices.reduce((s, x) => s + x.percent, 0);
    expect(total).toBeCloseTo(100);
    expect(slices[0].symbol).toBe("AAA"); // largest first
    expect(slices[0].percent).toBeCloseTo(75);
  });
});

describe("buildPortfolioTimeline", () => {
  it("uses a cost-basis curve when trades exist and ends at market value", () => {
    const now = 10 * DAY;
    const transactions = [
      tx({ id: "1", type: "buy", symbol: "AAA", shares: 10, price: 100, date: 1 * DAY }),
      tx({ id: "2", type: "sell", symbol: "AAA", shares: 5, price: 150, date: 2 * DAY }),
    ];
    const holdings = [holding({ symbol: "AAA", shares: 5, currentPrice: 160 })];
    const { points, metric } = buildPortfolioTimeline(transactions, holdings, "THB", now);
    expect(metric).toBe("portfolio");
    expect(points).toHaveLength(3);
    expect(points[0].value).toBe(1000); // after buy
    expect(points[1].value).toBe(500); // after selling half at avg cost
    expect(points[2].value).toBe(800); // marked to market (5 * 160)
  });

  it("falls back to cumulative contributions when there are no trades", () => {
    const transactions = [
      tx({ id: "1", type: "deposit", amount: 1000, date: 1 * DAY }),
      tx({ id: "2", type: "withdraw", amount: 200, date: 2 * DAY }),
    ];
    const { points, metric } = buildPortfolioTimeline(transactions, [], "THB");
    expect(metric).toBe("contributions");
    expect(points.map((p) => p.value)).toEqual([1000, 800]);
  });
});

describe("computeRealizedEvents", () => {
  it("realizes P/L on sells using average cost", () => {
    const events = computeRealizedEvents(
      [
        tx({ id: "1", type: "buy", symbol: "AAA", shares: 10, price: 100, date: 1 }),
        tx({ id: "2", type: "sell", symbol: "AAA", shares: 5, price: 150, date: 2 }),
      ],
      "THB",
    );
    expect(events).toHaveLength(1);
    expect(events[0].pnl).toBe(250); // 5 * (150 - 100)
  });
});

describe("summarizePerformance", () => {
  it("sums realized P/L and contributions within the period", () => {
    const now = Date.now();
    const transactions = [
      tx({ id: "1", type: "buy", symbol: "AAA", shares: 10, price: 100, date: now - 3 * DAY }),
      tx({ id: "2", type: "sell", symbol: "AAA", shares: 5, price: 150, date: now - 1 * DAY }),
      tx({ id: "3", type: "deposit", amount: 500, date: now - 1 * DAY }),
    ];
    const summary = summarizePerformance(transactions, "THB", "monthly", now);
    expect(summary.realizedPnl).toBe(250);
    expect(summary.contributions).toBe(500);
    expect(summary.tradeCount).toBe(2);
  });

  it("excludes activity outside the window", () => {
    const now = Date.now();
    const summary = summarizePerformance(
      [tx({ id: "1", type: "deposit", amount: 999, date: now - 400 * DAY })],
      "THB",
      "monthly",
      now,
    );
    expect(summary.contributions).toBe(0);
  });
});

describe("buildSymbolPnl", () => {
  it("returns per-symbol P/L sorted descending", () => {
    const data = buildSymbolPnl(
      [
        holding({ id: "a", symbol: "AAA", shares: 1, averageCost: 100, currentPrice: 90 }),
        holding({ id: "b", symbol: "BBB", shares: 1, averageCost: 100, currentPrice: 150 }),
      ],
      "THB",
    );
    expect(data[0].symbol).toBe("BBB");
    expect(data[0].profitLoss).toBe(50);
    expect(data[1].profitLoss).toBe(-10);
  });
});
