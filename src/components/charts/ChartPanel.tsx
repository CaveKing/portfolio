"use client";

import { useState } from "react";
import { Card, SectionHeader } from "@/components/ui/Card";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { LineChartView } from "./LineChartView";
import { PieChartView } from "./PieChartView";
import { DashboardChartView } from "./DashboardChartView";
import { ChartLineIcon, ChartPieIcon, GridIcon } from "@/components/ui/icons";
import type { ChartType, Currency, Holding, Transaction } from "@/types";

interface ChartPanelProps {
  holdings: Holding[];
  transactions: Transaction[];
  currency: Currency;
}

const OPTIONS = [
  {
    value: "line" as const,
    label: (
      <span className="flex items-center gap-1.5">
        <ChartLineIcon className="h-4 w-4" />
        <span className="hidden sm:inline">เส้น</span>
      </span>
    ),
  },
  {
    value: "pie" as const,
    label: (
      <span className="flex items-center gap-1.5">
        <ChartPieIcon className="h-4 w-4" />
        <span className="hidden sm:inline">วงกลม</span>
      </span>
    ),
  },
  {
    value: "dashboard" as const,
    label: (
      <span className="flex items-center gap-1.5">
        <GridIcon className="h-4 w-4" />
        <span className="hidden sm:inline">แดชบอร์ด</span>
      </span>
    ),
  },
];

export function ChartPanel({ holdings, transactions, currency }: ChartPanelProps) {
  const [chart, setChart] = useState<ChartType>("line");

  return (
    <Card className="p-5 sm:p-6">
      <SectionHeader
        title="ภาพรวมการลงทุน"
        description="สลับมุมมองกราฟได้ทันที"
        action={
          <SegmentedControl
            options={OPTIONS}
            value={chart}
            onChange={setChart}
            aria-label="เลือกชนิดกราฟ"
          />
        }
      />
      <div className="mt-6">
        {chart === "line" && (
          <LineChartView
            holdings={holdings}
            transactions={transactions}
            currency={currency}
          />
        )}
        {chart === "pie" && <PieChartView holdings={holdings} currency={currency} />}
        {chart === "dashboard" && (
          <DashboardChartView holdings={holdings} currency={currency} />
        )}
      </div>
    </Card>
  );
}
