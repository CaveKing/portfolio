"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChangePill, pnlColor } from "@/components/ui/ChangePill";
import { InfoIcon } from "@/components/ui/icons";
import { useHoldings, useTransactions } from "@/hooks/usePortfolioData";
import { aggregateByCurrency, summarizePerformance } from "@/utils/calc";
import { CURRENCY_SYMBOL, formatCurrency, formatNumber, formatSignedCurrency } from "@/utils/format";
import { cn } from "@/utils/cn";
import { DEFAULT_CURRENCY, PERIODS } from "@/constants";
import type { Currency, Period } from "@/types";

export function PerformanceTab() {
  const { data: holdings, loading: holdingsLoading } = useHoldings();
  const { data: transactions, loading: txLoading } = useTransactions();

  const [period, setPeriod] = useState<Period>("monthly");
  const [selected, setSelected] = useState<Currency>(DEFAULT_CURRENCY);

  const totals = useMemo(() => aggregateByCurrency(holdings), [holdings]);

  const currencies = useMemo(() => {
    const set = new Set<Currency>();
    totals.forEach((t) => set.add(t.currency));
    transactions.forEach((t) => set.add(t.currency));
    return Array.from(set);
  }, [totals, transactions]);

  const activeCurrency: Currency = currencies.includes(selected)
    ? selected
    : currencies[0] ?? DEFAULT_CURRENCY;

  const unrealized = totals.find((t) => t.currency === activeCurrency);
  const summary = useMemo(
    () => summarizePerformance(transactions, activeCurrency, period),
    [transactions, activeCurrency, period],
  );

  const loading = holdingsLoading || txLoading;

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[112px] w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl
          size="sm"
          options={PERIODS}
          value={period}
          onChange={setPeriod}
          aria-label="เลือกช่วงเวลา"
        />
        {currencies.length > 1 && (
          <SegmentedControl
            size="sm"
            options={currencies.map((code) => ({
              value: code,
              label: `${CURRENCY_SYMBOL[code]} ${code}`,
            }))}
            value={activeCurrency}
            onChange={setSelected}
            aria-label="เลือกสกุลเงิน"
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="กำไร/ขาดทุน (ยังไม่รับรู้)"
          value={
            <span className={cn("tabular-nums", pnlColor(unrealized?.profitLoss ?? 0))}>
              {formatSignedCurrency(unrealized?.profitLoss ?? 0, activeCurrency)}
            </span>
          }
          sub={
            <ChangePill
              value={unrealized?.profitLoss ?? 0}
              percent={unrealized?.profitLossPercent ?? 0}
            />
          }
          accent={(unrealized?.profitLoss ?? 0) >= 0 ? "success" : "danger"}
        />
        <StatCard
          label="กำไร/ขาดทุน (รับรู้แล้ว)"
          value={
            <span className={cn("tabular-nums", pnlColor(summary.realizedPnl))}>
              {formatSignedCurrency(summary.realizedPnl, activeCurrency)}
            </span>
          }
          accent={summary.realizedPnl >= 0 ? "success" : "danger"}
        />
        <StatCard
          label="เงินทุนสุทธิ"
          value={
            <span className="tabular-nums">
              {formatSignedCurrency(summary.contributions, activeCurrency)}
            </span>
          }
          accent="brand"
        />
        <StatCard
          label="จำนวนการเทรด"
          value={formatNumber(summary.tradeCount, 0)}
          accent="neutral"
        />
      </div>

      <Card className="flex items-start gap-2.5 p-4">
        <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
        <p className="text-sm leading-relaxed text-muted">
          “ยังไม่รับรู้” คำนวณจากราคาปัจจุบันของหุ้นในพอร์ตเทียบกับต้นทุน ส่วน
          “รับรู้แล้ว” และ “เงินทุนสุทธิ” คำนวณจากรายการในช่วง
          <span className="font-medium text-foreground">
            {" "}
            {PERIODS.find((p) => p.value === period)?.label}
          </span>{" "}
          ที่ผ่านมา ทั้งหมดอ้างอิงข้อมูลที่คุณบันทึกไว้เอง
        </p>
      </Card>
    </div>
  );
}
