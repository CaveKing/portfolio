import { StatCard } from "./StatCard";
import { ChangePill, pnlColor } from "@/components/ui/ChangePill";
import {
  BriefcaseIcon,
  ChartBarIcon,
  TrendingUpIcon,
  WalletIcon,
} from "@/components/ui/icons";
import { formatCurrency, formatNumber, formatSignedCurrency } from "@/utils/format";
import { cn } from "@/utils/cn";
import type { CurrencyTotals } from "@/types";

export function PortfolioSummary({ totals }: { totals: CurrencyTotals }) {
  const isUp = totals.profitLoss >= 0;
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <StatCard
        label="มูลค่าพอร์ต"
        value={formatCurrency(totals.marketValue, totals.currency)}
        icon={<WalletIcon />}
        accent="brand"
      />
      <StatCard
        label="ต้นทุนรวม"
        value={formatCurrency(totals.costBasis, totals.currency)}
        icon={<ChartBarIcon />}
        accent="neutral"
      />
      <StatCard
        label="กำไร / ขาดทุน"
        value={
          <span className={cn("tabular-nums", pnlColor(totals.profitLoss))}>
            {formatSignedCurrency(totals.profitLoss, totals.currency)}
          </span>
        }
        sub={<ChangePill value={totals.profitLoss} percent={totals.profitLossPercent} />}
        icon={<TrendingUpIcon />}
        accent={isUp ? "success" : "danger"}
      />
      <StatCard
        label="จำนวนหุ้น"
        value={formatNumber(totals.holdingsCount, 0)}
        icon={<BriefcaseIcon />}
        accent="neutral"
      />
    </div>
  );
}
