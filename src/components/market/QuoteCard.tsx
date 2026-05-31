"use client";

import { Card } from "@/components/ui/Card";
import { ChangePill } from "@/components/ui/ChangePill";
import { Button } from "@/components/ui/Button";
import { Sparkline } from "./Sparkline";
import { RefreshIcon } from "@/components/ui/icons";
import { formatMoney } from "@/utils/format";
import { displaySymbol } from "@/utils/symbols";
import type { QuoteResult } from "@/app/api/quote/route";

interface QuoteCardProps {
  quote: QuoteResult;
  name?: string;
  /** Provided only when this quote matches a holding in the portfolio. */
  onApply?: () => void;
  applying?: boolean;
}

export function QuoteCard({ quote, name, onApply, applying }: QuoteCardProps) {
  const positive = quote.change >= 0;
  const currency = quote.currency ?? "USD";

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{displaySymbol(quote.symbol)}</p>
          {name && <p className="truncate text-xs text-muted">{name}</p>}
        </div>
        <ChangePill value={quote.change} percent={quote.changePercent} mode="percent" />
      </div>

      <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
        {formatMoney(quote.price, currency)}
      </p>
      <p className="text-xs tabular-nums text-muted">
        {positive ? "+" : "−"}
        {formatMoney(Math.abs(quote.change), currency)} วันนี้
      </p>

      <div className="mt-3">
        <Sparkline data={quote.spark} positive={positive} />
      </div>

      {onApply && (
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          className="mt-3"
          leftIcon={<RefreshIcon className="h-4 w-4" />}
          onClick={onApply}
          loading={applying}
        >
          อัปเดตราคานี้เข้าพอร์ต
        </Button>
      )}
    </Card>
  );
}
