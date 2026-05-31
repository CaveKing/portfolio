"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { EmptyState } from "@/components/ui/EmptyState";
import { ChartPieIcon } from "@/components/ui/icons";
import { buildAllocation } from "@/utils/calc";
import { formatCurrency } from "@/utils/format";
import { CHART_PALETTE } from "@/constants";
import type { Currency, Holding } from "@/types";

interface PieChartViewProps {
  holdings: Holding[];
  currency: Currency;
}

export function PieChartView({ holdings, currency }: PieChartViewProps) {
  const slices = useMemo(
    () => buildAllocation(holdings, currency),
    [holdings, currency],
  );

  const total = useMemo(
    () => slices.reduce((sum, s) => sum + s.value, 0),
    [slices],
  );

  if (slices.length === 0 || total === 0) {
    return (
      <EmptyState
        icon={<ChartPieIcon />}
        title="ยังไม่มีสัดส่วนการลงทุน"
        description="เพิ่มหุ้นในพอร์ตเพื่อดูสัดส่วนการลงทุนแบบกราฟวงกลม"
      />
    );
  }

  return (
    <div className="grid items-center gap-6 sm:grid-cols-2">
      <div className="relative mx-auto h-64 w-full max-w-[18rem]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="symbol"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={slices.length > 1 ? 2 : 0}
              stroke="none"
            >
              {slices.map((slice, index) => (
                <Cell key={slice.symbol} fill={CHART_PALETTE[index % CHART_PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip
              content={(props) => {
                if (!props.active || !props.payload?.length) return null;
                const datum = props.payload[0].payload as {
                  symbol: string;
                  value: number;
                  percent: number;
                };
                return (
                  <div className="rounded-xl border border-border bg-surface px-3 py-2 shadow-lifted">
                    <p className="text-sm font-semibold text-foreground">
                      {datum.symbol}
                    </p>
                    <p className="text-xs tabular-nums text-muted">
                      {formatCurrency(datum.value, currency)} · {datum.percent.toFixed(1)}%
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-muted">รวม</span>
          <span className="text-lg font-semibold tabular-nums text-foreground">
            {formatCurrency(total, currency, { compact: true })}
          </span>
        </div>
      </div>

      <ul className="space-y-2.5">
        {slices.map((slice, index) => (
          <li
            key={slice.symbol}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="flex items-center gap-2.5">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: CHART_PALETTE[index % CHART_PALETTE.length] }}
              />
              <span className="font-medium text-foreground">{slice.symbol}</span>
            </span>
            <span className="tabular-nums text-muted">
              <span className="font-medium text-foreground">
                {slice.percent.toFixed(1)}%
              </span>{" "}
              · {formatCurrency(slice.value, currency, { compact: true })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
