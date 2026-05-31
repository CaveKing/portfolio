"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EmptyState } from "@/components/ui/EmptyState";
import { ChartLineIcon } from "@/components/ui/icons";
import { buildPortfolioTimeline } from "@/utils/calc";
import { formatCurrency, formatShortDate } from "@/utils/format";
import type { Currency, Holding, Transaction } from "@/types";

interface LineChartViewProps {
  holdings: Holding[];
  transactions: Transaction[];
  currency: Currency;
}

export function LineChartView({ holdings, transactions, currency }: LineChartViewProps) {
  const { points, metric } = useMemo(
    () => buildPortfolioTimeline(transactions, holdings, currency),
    [transactions, holdings, currency],
  );

  const data = useMemo(
    () => points.map((p) => ({ label: formatShortDate(p.date), value: p.value })),
    [points],
  );

  if (data.length === 0) {
    return (
      <EmptyState
        icon={<ChartLineIcon />}
        title="ยังไม่มีข้อมูลสำหรับกราฟเส้น"
        description="เพิ่มรายการซื้อ/ขาย หรือฝาก/ถอนในหน้าพอร์ต เพื่อสร้างเส้นแสดงพัฒนาการของพอร์ต"
      />
    );
  }

  const label =
    metric === "portfolio" ? "มูลค่าพอร์ตสะสม" : "เงินทุนสุทธิสะสม";

  return (
    <div>
      <p className="mb-1 text-sm text-muted">{label}</p>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0071e3" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#0071e3" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="rgb(var(--border))"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              minTickGap={28}
              tick={{ fontSize: 12, fill: "rgb(var(--muted))" }}
            />
            <YAxis
              width={64}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "rgb(var(--muted))" }}
              tickFormatter={(value: number) =>
                formatCurrency(value, currency, { compact: true })
              }
            />
            <Tooltip
              cursor={{ stroke: "rgb(var(--border))", strokeWidth: 1 }}
              content={(props) => {
                if (!props.active || !props.payload?.length) return null;
                const datum = props.payload[0].payload as {
                  label: string;
                  value: number;
                };
                return (
                  <div className="rounded-xl border border-border bg-surface px-3 py-2 shadow-lifted">
                    <p className="text-xs text-muted">{datum.label}</p>
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                      {formatCurrency(datum.value, currency)}
                    </p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#0071e3"
              strokeWidth={2.5}
              fill="url(#lineFill)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
