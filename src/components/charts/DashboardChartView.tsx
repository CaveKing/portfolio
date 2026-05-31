"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EmptyState } from "@/components/ui/EmptyState";
import { ChangePill } from "@/components/ui/ChangePill";
import { GridIcon } from "@/components/ui/icons";
import { buildSymbolPnl, computeHoldingMetrics } from "@/utils/calc";
import { formatCurrency } from "@/utils/format";
import type { Currency, Holding } from "@/types";

interface DashboardChartViewProps {
  holdings: Holding[];
  currency: Currency;
}

const GAIN = "#1fb35a";
const LOSS = "#e0352b";

export function DashboardChartView({ holdings, currency }: DashboardChartViewProps) {
  const data = useMemo(
    () => buildSymbolPnl(holdings, currency),
    [holdings, currency],
  );

  const { best, worst } = useMemo(() => {
    const scoped = holdings
      .filter((h) => h.currency === currency)
      .map(computeHoldingMetrics)
      .sort((a, b) => b.profitLossPercent - a.profitLossPercent);
    return { best: scoped[0] ?? null, worst: scoped[scoped.length - 1] ?? null };
  }, [holdings, currency]);

  if (data.length === 0) {
    return (
      <EmptyState
        icon={<GridIcon />}
        title="ยังไม่มีข้อมูลแดชบอร์ด"
        description="เพิ่มหุ้นในพอร์ตเพื่อดูกำไร/ขาดทุนรายตัวแบบกราฟแท่ง"
      />
    );
  }

  const barHeight = Math.max(data.length * 44, 120);

  return (
    <div className="space-y-5">
      {best && worst && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-surface-2 p-4">
            <p className="text-xs text-muted">ผลงานดีที่สุด</p>
            <p className="mt-1 font-semibold text-foreground">{best.symbol}</p>
            <ChangePill value={best.profitLoss} percent={best.profitLossPercent} />
          </div>
          <div className="rounded-2xl bg-surface-2 p-4">
            <p className="text-xs text-muted">ผลงานต่ำสุด</p>
            <p className="mt-1 font-semibold text-foreground">{worst.symbol}</p>
            <ChangePill value={worst.profitLoss} percent={worst.profitLossPercent} />
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm text-muted">กำไร / ขาดทุน รายตัว</p>
        <div style={{ height: barHeight }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "rgb(var(--muted))" }}
                tickFormatter={(value: number) =>
                  formatCurrency(value, currency, { compact: true })
                }
              />
              <YAxis
                type="category"
                dataKey="symbol"
                width={64}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "rgb(var(--foreground))" }}
              />
              <Tooltip
                cursor={{ fill: "rgb(var(--surface-2))" }}
                content={(props) => {
                  if (!props.active || !props.payload?.length) return null;
                  const datum = props.payload[0].payload as {
                    symbol: string;
                    profitLoss: number;
                    profitLossPercent: number;
                  };
                  return (
                    <div className="rounded-xl border border-border bg-surface px-3 py-2 shadow-lifted">
                      <p className="text-sm font-semibold text-foreground">
                        {datum.symbol}
                      </p>
                      <p className="text-xs tabular-nums text-muted">
                        {formatCurrency(datum.profitLoss, currency)} ·{" "}
                        {datum.profitLossPercent.toFixed(2)}%
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="profitLoss" radius={[0, 6, 6, 0]} barSize={22}>
                {data.map((entry) => (
                  <Cell
                    key={entry.symbol}
                    fill={entry.profitLoss >= 0 ? GAIN : LOSS}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
