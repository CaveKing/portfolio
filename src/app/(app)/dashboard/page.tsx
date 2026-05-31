"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useHoldings, useTransactions } from "@/hooks/usePortfolioData";
import { aggregateByCurrency } from "@/utils/calc";
import { CURRENCY_SYMBOL } from "@/utils/format";
import { DEFAULT_CURRENCY, ROUTES } from "@/constants";
import { SetupBanner } from "@/components/SetupBanner";
import { PortfolioSummary } from "@/components/dashboard/PortfolioSummary";
import { Top5Section } from "@/components/dashboard/Top5Section";
import { ChartPanel } from "@/components/charts/ChartPanel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Skeleton } from "@/components/ui/Skeleton";
import { WalletIcon } from "@/components/ui/icons";
import type { Currency, CurrencyTotals } from "@/types";

export default function DashboardPage() {
  const { profile } = useAuth();
  const { data: holdings, loading: holdingsLoading } = useHoldings();
  const { data: transactions } = useTransactions();

  const totals = useMemo(() => aggregateByCurrency(holdings), [holdings]);
  const currencies = useMemo(() => totals.map((t) => t.currency), [totals]);

  const [selected, setSelected] = useState<Currency>(DEFAULT_CURRENCY);
  const activeCurrency: Currency = currencies.includes(selected)
    ? selected
    : currencies[0] ?? DEFAULT_CURRENCY;

  const activeTotals: CurrencyTotals =
    totals.find((t) => t.currency === activeCurrency) ?? {
      currency: activeCurrency,
      marketValue: 0,
      costBasis: 0,
      profitLoss: 0,
      profitLossPercent: 0,
      holdingsCount: 0,
    };

  const greetingName = profile?.username ?? "นักลงทุน";

  return (
    <div className="space-y-6">
      <SetupBanner />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted">สวัสดี 👋</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {greetingName}
          </h1>
        </div>
        {currencies.length > 1 && (
          <SegmentedControl
            size="sm"
            aria-label="เลือกสกุลเงิน"
            options={currencies.map((code) => ({
              value: code,
              label: `${CURRENCY_SYMBOL[code]} ${code}`,
            }))}
            value={activeCurrency}
            onChange={setSelected}
          />
        )}
      </div>

      {holdingsLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[112px] w-full" />
          ))}
        </div>
      ) : holdings.length === 0 ? (
        <Card>
          <EmptyState
            icon={<WalletIcon />}
            title="เริ่มต้นพอร์ตของคุณ"
            description="ยังไม่มีหุ้นในพอร์ต เพิ่มหุ้นตัวแรกเพื่อดูมูลค่า กำไร/ขาดทุน และกราฟต่าง ๆ"
            action={
              <Link href={ROUTES.portfolio}>
                <Button>ไปที่หน้าพอร์ต</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <PortfolioSummary totals={activeTotals} />
      )}

      <ChartPanel
        holdings={holdings}
        transactions={transactions}
        currency={activeCurrency}
      />

      <Top5Section />
    </div>
  );
}
